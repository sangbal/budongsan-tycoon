/**
 * KIMCHI INVASION - Conveyor System
 *
 * @description 컨베이어(물류) 시스템 - 건물 간 자원 자동 이동 관리
 * @module systems/conveyorSystem
 */

import { System } from '../ecs/System.js'
import { BUILDINGS } from '../data/buildings.js'
import { resourceSystem } from './resourceSystem.js'
import { useGameStore } from '../state/stores/gameStore.js'
import { buildingSystem } from './buildingSystem.js'
import { generateConveyorId, generateItemId } from '../utils/idGenerator.js'

/**
 * @typedef {Object} ConveyorItem
 * @property {string} id - 아이템 ID
 * @property {string} resourceId - 자원 타입
 * @property {number} amount - 수량
 * @property {number} progress - 이동 진행률 (0.0 ~ 1.0)
 * @property {string} fromBuildingId - 출발지 건물 ID
 * @property {string} toBuildingId - 도착지 건물 ID
 */

/**
 * @typedef {Object} ConveyorDefinition
 * @property {string} id - 컨베이어 ID
 * @property {number} x - 타일 X 좌표
 * @property {number} y - 타일 Y 좌표
 * @property {string} direction - 방향 ('up', 'down', 'left', 'right')
 * @property {number} speed - 이동 속도 (아이템/초)
 * @property {number} level - 컨베이어 레벨
 * @property {ConveyorItem[]} items - 컨베이어 위의 아이템 목록
 */

/**
 * 컨베이어 관리 시스템
 * 건물 간 자원 자동 이동, 연결 관리, 물류 네트워크 관리
 */
export class ConveyorSystem extends System {
  constructor() {
    super([]) // 전역 컨베이어 관리이므로 requiredComponents 없음
    this.systemName = 'ConveyorSystem'
    this.priority = 30 // BuildingSystem(20) 다음 실행

    /** @type {Map<string, ConveyorDefinition>} 컨베이어 맵 (빠른 조회용) */
    this.conveyorMap = new Map()

    /** @type {Map<string, Set<string>>} 타일별 컨베이어 맵 (x,y → 컨베이어 ID Set) */
    this.locationMap = new Map()

    /** @type {Map<string, Set<string>>} 건물별 입력 컨베이어 (건물 ID → 컨베이어 ID Set) */
    this.inputConnections = new Map()

    /** @type {Map<string, Set<string>>} 건물별 출력 컨베이어 (건물 ID → 컨베이어 ID Set) */
    this.outputConnections = new Map()

    /** @type {EventTarget} 이벤트 버스 */
    this.eventBus = new EventTarget()

    /** @type {number} 컨베이어 최대 용량 (동시 아이템 수) */
    this.maxCapacity = 5
  }

  /**
   * 시스템 초기화
   */
  init() {
    // 전역 접근을 위해 window에 등록 (디버깅용)
    if (typeof window !== 'undefined') {
      window.conveyorSystem = this
    }

    // 저장된 컨베이어 복원
    this.loadConveyors()
  }

  /**
   * 저장된 컨베이어 불러오기 (게임 시작 시)
   */
  loadConveyors() {
    const conveyors = useGameStore.getState().conveyors || []
    this.conveyorMap.clear()
    this.locationMap.clear()
    this.inputConnections.clear()
    this.outputConnections.clear()

    for (const conveyor of conveyors) {
      this.conveyorMap.set(conveyor.id, conveyor)
      this.registerLocation(conveyor)
      this.updateConnections(conveyor)
    }
  }

  /**
   * 매 프레임 업데이트
   * @param {import('../ecs/Entity.js').Entity[]} _entities - 사용하지 않음
   * @param {number} deltaTime - 이전 프레임으로부터의 경과 시간 (초 단위)
   */
  update(_entities, deltaTime) {
    // 모든 컨베이어의 아이템 이동 처리
    for (const conveyor of this.conveyorMap.values()) {
      this.updateConveyorItems(conveyor, deltaTime)
    }
  }

  /**
   * 컨베이어 아이템 이동 업데이트
   * @param {ConveyorDefinition} conveyor - 컨베이어
   * @param {number} deltaTime - 경과 시간 (초)
   */
  updateConveyorItems(conveyor, deltaTime) {
    if (!conveyor.items || conveyor.items.length === 0) return

    const itemsToRemove = []

    // 각 아이템 진행률 업데이트
    for (const item of conveyor.items) {
      // 이동 진행 (레벨에 따라 속도 증가)
      const speedMultiplier = 1 + (conveyor.level - 1) * 0.2
      item.progress += (conveyor.speed * speedMultiplier * deltaTime) / 1.0 // 1타일 기준

      // 아이템이 도착지에 도달하면 전달
      if (item.progress >= 1.0) {
        this.deliverItem(item, conveyor)
        itemsToRemove.push(item.id)
      }
    }

    // 도착한 아이템 제거
    if (itemsToRemove.length > 0) {
      conveyor.items = conveyor.items.filter(item => !itemsToRemove.includes(item.id))
      useGameStore.getState().updateConveyor(conveyor.id, { items: conveyor.items })
    }
  }

  /**
   * 아이템을 도착지 건물에 전달
   * @param {ConveyorItem} item - 아이템
   * @param {ConveyorDefinition} conveyor - 컨베이어
   */
  deliverItem(item, conveyor) {
    // 다음 컨베이어 찾기
    const nextConveyor = this.findNextConveyor(conveyor)

    if (nextConveyor) {
      // 다음 컨베이어로 아이템 이동
      this.addItemToConveyor(nextConveyor.id, item.resourceId, item.amount, conveyor.id)
    } else {
      // 도착지 건물에 자원 추가 (향후 건물 인벤토리 시스템 구현)
      resourceSystem.add(item.resourceId, item.amount)

      // 이벤트 발생
      this.emit('itemDelivered', {
        itemId: item.id,
        resourceId: item.resourceId,
        amount: item.amount,
        conveyorId: conveyor.id,
        fromBuildingId: item.fromBuildingId,
      })
    }
  }

  /**
   * 다음 연결된 컨베이어 찾기
   * @param {ConveyorDefinition} conveyor - 현재 컨베이어
   * @returns {ConveyorDefinition|null} 다음 컨베이어 또는 null
   */
  findNextConveyor(conveyor) {
    // 방향에 따라 다음 타일 좌표 계산
    const nextPos = this.getNextPosition(conveyor.x, conveyor.y, conveyor.direction)
    if (!nextPos) return null

    // 다음 위치의 컨베이어 찾기
    const key = `${nextPos.x},${nextPos.y}`
    const conveyorIds = this.locationMap.get(key)
    if (!conveyorIds || conveyorIds.size === 0) return null

    const nextConveyorId = conveyorIds.values().next().value
    return this.conveyorMap.get(nextConveyorId)
  }

  /**
   * 방향에 따라 다음 위치 계산
   * @param {number} x - 현재 X 좌표
   * @param {number} y - 현재 Y 좌표
   * @param {string} direction - 방향
   * @returns {{x: number, y: number}|null} 다음 위치 또는 null
   */
  getNextPosition(x, y, direction) {
    const dirMap = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    }

    const offset = dirMap[direction]
    if (!offset) return null

    return { x: x + offset.x, y: y + offset.y }
  }

  /**
   * 컨베이어 배치
   * @param {number} x - 타일 X 좌표
   * @param {number} y - 타일 Y 좌표
   * @param {string} direction - 방향 ('up', 'down', 'left', 'right')
   * @returns {ConveyorDefinition|null} 생성된 컨베이어 또는 null
   */
  place(x, y, direction = 'right') {
    // 1. 배치 가능 여부 확인
    if (!this.canPlace(x, y)) {
      return null
    }

    // 2. 비용 지불
    const def = BUILDINGS.conveyor
    if (!resourceSystem.consumeMultiple(def.cost)) {
      return null
    }

    // 3. 컨베이어 엔티티 생성
    const conveyor = {
      id: generateConveyorId(),
      x,
      y,
      direction,
      speed: def.effect.speed,
      level: 1,
      items: [],
    }

    // 4. 내부 맵에 추가
    this.conveyorMap.set(conveyor.id, conveyor)
    this.registerLocation(conveyor)

    // 5. 연결 업데이트
    this.updateConnections(conveyor)

    // 6. Zustand 상태에 추가
    useGameStore.getState().addConveyor(conveyor)

    // 7. 이벤트 발생
    this.emit('conveyorPlaced', { conveyor, x, y, direction })

    return conveyor
  }

  /**
   * 배치 가능 여부 확인
   * @param {number} x - 타일 X 좌표
   * @param {number} y - 타일 Y 좌표
   * @returns {boolean}
   */
  canPlace(x, y) {
    const key = `${x},${y}`

    // 이미 컨베이어가 있는지 확인
    if (this.locationMap.has(key) && this.locationMap.get(key).size > 0) {
      return false
    }

    // 건물이 점유하고 있는지 확인
    if (buildingSystem.isOccupied(x, y)) {
      return false
    }

    // 비용 확인
    const def = BUILDINGS.conveyor
    for (const [resourceId, amount] of Object.entries(def.cost)) {
      if (!resourceSystem.has(resourceId, amount)) {
        return false
      }
    }

    return true
  }

  /**
   * 컨베이어 위치 등록
   * @param {ConveyorDefinition} conveyor - 컨베이어
   */
  registerLocation(conveyor) {
    const key = `${conveyor.x},${conveyor.y}`
    if (!this.locationMap.has(key)) {
      this.locationMap.set(key, new Set())
    }
    this.locationMap.get(key).add(conveyor.id)
  }

  /**
   * 컨베이어 위치 등록 해제
   * @param {ConveyorDefinition} conveyor - 컨베이어
   */
  unregisterLocation(conveyor) {
    const key = `${conveyor.x},${conveyor.y}`
    if (this.locationMap.has(key)) {
      this.locationMap.get(key).delete(conveyor.id)
      if (this.locationMap.get(key).size === 0) {
        this.locationMap.delete(key)
      }
    }
  }

  /**
   * 컨베이어 연결 업데이트 (건물 입/출력 포트)
   * @param {ConveyorDefinition} conveyor - 컨베이어
   */
  updateConnections(conveyor) {
    // 인접 건물 확인
    const adjacentPositions = [
      { x: conveyor.x - 1, y: conveyor.y },
      { x: conveyor.x + 1, y: conveyor.y },
      { x: conveyor.x, y: conveyor.y - 1 },
      { x: conveyor.x, y: conveyor.y + 1 },
    ]

    for (const pos of adjacentPositions) {
      const building = buildingSystem.getBuildingAt(pos.x, pos.y)
      if (building) {
        // 입력 연결 등록
        if (!this.inputConnections.has(building.id)) {
          this.inputConnections.set(building.id, new Set())
        }
        this.inputConnections.get(building.id).add(conveyor.id)

        // 출력 연결 등록 (컨베이어 방향 기준)
        const nextPos = this.getNextPosition(conveyor.x, conveyor.y, conveyor.direction)
        if (nextPos && nextPos.x === pos.x && nextPos.y === pos.y) {
          if (!this.outputConnections.has(building.id)) {
            this.outputConnections.set(building.id, new Set())
          }
          this.outputConnections.get(building.id).add(conveyor.id)
        }
      }
    }
  }

  /**
   * 컨베이어 제거
   * @param {string} conveyorId - 컨베이어 ID
   * @returns {boolean} 제거 성공 여부
   */
  remove(conveyorId) {
    const conveyor = this.conveyorMap.get(conveyorId)
    if (!conveyor) {
      console.warn(`[ConveyorSystem] Conveyor not found: ${conveyorId}`)
      return false
    }

    // 컨베이어 위 아이템 자원으로 반환
    for (const item of conveyor.items) {
      resourceSystem.add(item.resourceId, item.amount)
    }

    // 50% 자원 환불
    const def = BUILDINGS.conveyor
    const refund = {}
    for (const [resourceId, amount] of Object.entries(def.cost)) {
      refund[resourceId] = Math.floor(amount * 0.5)
    }
    resourceSystem.addMultiple(refund)

    // 위치 등록 해제
    this.unregisterLocation(conveyor)

    // 연결 해제
    this.inputConnections.delete(conveyorId)
    this.outputConnections.delete(conveyorId)

    // 내부 맵에서 제거
    this.conveyorMap.delete(conveyorId)

    // Zustand 상태에서 제거
    useGameStore.getState().removeConveyor(conveyorId)

    // 이벤트 발생
    this.emit('conveyorRemoved', { conveyorId, refund })

    return true
  }

  /**
   * 컨베이어에 아이템 추가
   * @param {string} conveyorId - 컨베이어 ID
   * @param {string} resourceId - 자원 ID
   * @param {number} amount - 수량
   * @param {string} fromBuildingId - 출발지 건물 ID
   * @returns {boolean} 추가 성공 여부
   */
  addItemToConveyor(conveyorId, resourceId, amount, fromBuildingId = null) {
    const conveyor = this.conveyorMap.get(conveyorId)
    if (!conveyor) {
      console.warn(`[ConveyorSystem] Conveyor not found: ${conveyorId}`)
      return false
    }

    // 용량 확인
    if (conveyor.items.length >= this.maxCapacity) {
      return false
    }

    // 아이템 생성
    const item = {
      id: generateItemId(),
      resourceId,
      amount,
      progress: 0.0,
      fromBuildingId,
      toBuildingId: null, // 향후 구현
    }

    // 컨베이어에 추가
    conveyor.items.push(item)

    // Zustand 상태 업데이트
    useGameStore.getState().updateConveyor(conveyorId, { items: conveyor.items })

    // 이벤트 발생
    this.emit('itemPickedUp', {
      itemId: item.id,
      resourceId,
      amount,
      conveyorId,
      fromBuildingId,
    })

    return true
  }

  /**
   * 컨베이어 업그레이드
   * @param {string} conveyorId - 컨베이어 ID
   * @returns {boolean} 업그레이드 성공 여부
   */
  upgrade(conveyorId) {
    const conveyor = this.conveyorMap.get(conveyorId)
    if (!conveyor) {
      console.warn(`[ConveyorSystem] Conveyor not found: ${conveyorId}`)
      return false
    }

    const def = BUILDINGS.conveyor
    if (conveyor.level >= def.maxLevel) {
      return false
    }

    // 업그레이드 비용 계산 (1.5^레벨)
    const multiplier = Math.pow(1.5, conveyor.level)
    const cost = {}
    for (const [resourceId, amount] of Object.entries(def.cost)) {
      cost[resourceId] = Math.ceil(amount * multiplier)
    }

    // 비용 지불
    if (!resourceSystem.consumeMultiple(cost)) {
      return false
    }

    // 레벨 증가
    conveyor.level++

    // Zustand 상태 업데이트
    useGameStore.getState().updateConveyor(conveyorId, { level: conveyor.level })

    return true
  }

  /**
   * 컨베이어 조회
   * @param {string} conveyorId - 컨베이어 ID
   * @returns {ConveyorDefinition|undefined} 컨베이어
   */
  getConveyor(conveyorId) {
    return this.conveyorMap.get(conveyorId)
  }

  /**
   * 모든 컨베이어 조회
   * @returns {ConveyorDefinition[]} 컨베이어 배열
   */
  getAllConveyors() {
    return Array.from(this.conveyorMap.values())
  }

  /**
   * 특정 위치의 컨베이어 조회
   * @param {number} x - 타일 X 좌표
   * @param {number} y - 타일 Y 좌표
   * @returns {ConveyorDefinition|null} 컨베이어 또는 null
   */
  getConveyorAt(x, y) {
    const key = `${x},${y}`
    const conveyorIds = this.locationMap.get(key)
    if (!conveyorIds || conveyorIds.size === 0) return null

    const conveyorId = conveyorIds.values().next().value
    return this.conveyorMap.get(conveyorId)
  }

  /**
   * 컨베이어 방향 변경
   * @param {string} conveyorId - 컨베이어 ID
   * @param {string} newDirection - 새 방향
   * @returns {boolean} 변경 성공 여부
   */
  changeDirection(conveyorId, newDirection) {
    const conveyor = this.conveyorMap.get(conveyorId)
    if (!conveyor) {
      console.warn(`[ConveyorSystem] Conveyor not found: ${conveyorId}`)
      return false
    }

    const validDirections = ['up', 'down', 'left', 'right']
    if (!validDirections.includes(newDirection)) {
      console.warn(`[ConveyorSystem] Invalid direction: ${newDirection}`)
      return false
    }

    conveyor.direction = newDirection

    // 연결 업데이트
    this.updateConnections(conveyor)

    // Zustand 상태 업데이트
    useGameStore.getState().updateConveyor(conveyorId, { direction: newDirection })

    return true
  }

  /**
   * 이벤트 발생
   * @param {string} eventName - 이벤트 이름
   * @param {Object} detail - 이벤트 데이터
   */
  emit(eventName, detail) {
    const event = new CustomEvent(eventName, { detail })
    this.eventBus.dispatchEvent(event)
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} eventName - 이벤트 이름
   * @param {Function} callback - 콜백 함수
   */
  on(eventName, callback) {
    this.eventBus.addEventListener(eventName, event => callback(event.detail))
  }

  /**
   * 이벤트 리스너 제거
   * @param {string} eventName - 이벤트 이름
   * @param {Function} callback - 콜백 함수
   */
  off(eventName, callback) {
    this.eventBus.removeEventListener(eventName, callback)
  }
}

// === 싱글톤 인스턴스 ===

/**
 * 전역 싱글톤 인스턴스
 * @type {ConveyorSystem}
 */
export const conveyorSystem = new ConveyorSystem()
