/**
 * KIMCHI INVASION - Inserter System
 *
 * @description 투입기(Inserter) 시스템 - 건물 간 자원 이동 관리
 * @module systems/inserterSystem
 */

import { System } from '../ecs/System.js'
import { BUILDINGS } from '../data/buildings.js'
import { resourceSystem } from './resourceSystem.js'
import { useGameStore } from '../state/stores/gameStore.js'

/**
 * 고유 투입기 ID 생성
 * @returns {string}
 */
function generateInserterId() {
  return `inserter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * @typedef {Object} InserterDefinition
 * @property {string} id - 투입기 ID
 * @property {number} x - 타일 X 좌표
 * @property {number} y - 타일 Y 좌표
 * @property {string} direction - 방향 ('up', 'down', 'left', 'right')
 * @property {number} level - 투입기 레벨 (1-5)
 * @property {number} cooldown - 남은 쿨다운 (초)
 * @property {Object|null} heldItem - 들고 있는 아이템 { resourceId, amount }
 * @property {string|null} sourceId - 출발지 건물/컨베이어 ID
 * @property {string|null} targetId - 도착지 건물/컨베이어 ID
 */

/**
 * 레벨별 투입기 스펙
 */
const INSERTER_SPECS = {
  1: { speed: 0.5, capacity: 1, energyPerTick: 0.2 }, // 2초/아이템
  2: { speed: 0.75, capacity: 1, energyPerTick: 0.25 }, // 1.33초/아이템
  3: { speed: 1.0, capacity: 2, energyPerTick: 0.3 }, // 1초/아이템, 2개 용량
  4: { speed: 1.25, capacity: 2, energyPerTick: 0.35 }, // 0.8초/아이템
  5: { speed: 1.5, capacity: 3, energyPerTick: 0.4 }, // 0.67초/아이템, 3개 용량
}

/**
 * 투입기 관리 시스템
 * 건물/컨베이어 간 자원 이동, 픽업/전달 관리
 */
export class InserterSystem extends System {
  constructor() {
    super([]) // 전역 투입기 관리이므로 requiredComponents 없음
    this.systemName = 'InserterSystem'
    this.priority = 35 // ConveyorSystem(30) 다음 실행

    /** @type {Map<string, InserterDefinition>} 투입기 맵 (빠른 조회용) */
    this.inserterMap = new Map()

    /** @type {Map<string, Set<string>>} 타일별 투입기 맵 (x,y → 투입기 ID Set) */
    this.locationMap = new Map()

    /** @type {EventTarget} 이벤트 버스 */
    this.eventBus = new EventTarget()
  }

  /**
   * 시스템 초기화
   */
  init() {
    // 전역 접근을 위해 window에 등록 (디버깅용)
    if (typeof window !== 'undefined') {
      window.inserterSystem = this
    }

    // 저장된 투입기 복원
    this.loadInserters()
  }

  /**
   * 저장된 투입기 불러오기 (게임 시작 시)
   */
  loadInserters() {
    const inserters = useGameStore.getState().inserters || []
    this.inserterMap.clear()
    this.locationMap.clear()

    for (const inserter of inserters) {
      this.inserterMap.set(inserter.id, inserter)
      this.registerLocation(inserter)
    }
  }

  /**
   * 매 프레임 업데이트
   * @param {import('../ecs/Entity.js').Entity[]} _entities - 사용하지 않음
   * @param {number} deltaTime - 이전 프레임으로부터의 경과 시간 (초 단위)
   */
  update(_entities, deltaTime) {
    // 모든 투입기 업데이트
    for (const inserter of this.inserterMap.values()) {
      this.updateInserter(inserter, deltaTime)
    }
  }

  /**
   * 투입기 업데이트
   * @param {InserterDefinition} inserter - 투입기
   * @param {number} deltaTime - 경과 시간 (초)
   */
  updateInserter(inserter, deltaTime) {
    const spec = INSERTER_SPECS[inserter.level]
    if (!spec) {
      console.warn(`[InserterSystem] Invalid level for inserter ${inserter.id}`)
      return
    }

    // 에너지 확인
    const energyNeeded = spec.energyPerTick * deltaTime
    const currentEnergy = useGameStore.getState().resources.energy ?? 0
    if (currentEnergy < energyNeeded) {
      // 에너지 부족: 동작 중지
      return
    }

    // 쿨다운 감소
    if (inserter.cooldown > 0) {
      inserter.cooldown = Math.max(0, inserter.cooldown - deltaTime)

      // 쿨다운 중에는 에너지 소비 안 함
      return
    }

    // 쿨다운 완료 시 동작
    if (inserter.cooldown === 0) {
      if (!inserter.heldItem) {
        // 아이템 픽업 시도
        this.tryPickup(inserter)
      } else {
        // 아이템 전달 시도
        this.tryDeliver(inserter)
      }

      // 에너지 소비
      resourceSystem.consume('energy', energyNeeded)
    }
  }

  /**
   * 아이템 픽업 시도
   * @param {InserterDefinition} inserter - 투입기
   */
  tryPickup(inserter) {
    const spec = INSERTER_SPECS[inserter.level]
    const source = this.findSource(inserter)

    if (!source) {
      // 출발지가 없으면 스킵
      return
    }

    // 출발지에서 자원 가져오기
    const pickedResource = this.pickupFromSource(source, spec.capacity)

    if (pickedResource) {
      // 아이템 들기
      inserter.heldItem = pickedResource
      inserter.sourceId = source.id

      // 쿨다운 설정 (speed = items/sec → cooldown = 1/speed)
      inserter.cooldown = 1 / spec.speed

      // Zustand 상태 업데이트
      useGameStore.getState().updateInserter(inserter.id, {
        heldItem: inserter.heldItem,
        cooldown: inserter.cooldown,
        sourceId: inserter.sourceId,
      })

      // 이벤트 발생
      this.emit('itemPickedUp', {
        inserterId: inserter.id,
        resourceId: pickedResource.resourceId,
        amount: pickedResource.amount,
        sourceId: source.id,
      })
    }
  }

  /**
   * 아이템 전달 시도
   * @param {InserterDefinition} inserter - 투입기
   */
  tryDeliver(inserter) {
    const spec = INSERTER_SPECS[inserter.level]
    const target = this.findTarget(inserter)

    if (!target) {
      // 도착지가 없으면 아이템 보관
      return
    }

    // 도착지에 아이템 전달
    const success = this.deliverToTarget(target, inserter.heldItem)

    if (success) {
      const deliveredItem = inserter.heldItem

      // 아이템 내려놓기
      inserter.heldItem = null
      inserter.targetId = target.id

      // 쿨다운 설정
      inserter.cooldown = 1 / spec.speed

      // Zustand 상태 업데이트
      useGameStore.getState().updateInserter(inserter.id, {
        heldItem: null,
        cooldown: inserter.cooldown,
        targetId: inserter.targetId,
      })

      // 이벤트 발생
      this.emit('itemDelivered', {
        inserterId: inserter.id,
        resourceId: deliveredItem.resourceId,
        amount: deliveredItem.amount,
        targetId: target.id,
      })
    }
  }

  /**
   * 출발지 찾기 (역방향 위치)
   * @param {InserterDefinition} inserter - 투입기
   * @returns {Object|null} 출발지 객체 (건물 또는 컨베이어)
   */
  findSource(inserter) {
    const reverseDirection = this.getReverseDirection(inserter.direction)
    const sourcePos = this.getNextPosition(inserter.x, inserter.y, reverseDirection)
    if (!sourcePos) return null

    // 건물 확인
    const building = useGameStore.getState().getBuildingAt(sourcePos.x, sourcePos.y)
    if (building && building.inventory !== undefined) {
      return { ...building, objectType: 'building' }
    }

    // 컨베이어 확인 (향후 구현)
    // const conveyor = conveyorSystem.getConveyorAt(sourcePos.x, sourcePos.y)
    // if (conveyor) {
    //   return { ...conveyor, objectType: 'conveyor' }
    // }

    return null
  }

  /**
   * 도착지 찾기 (정방향 위치)
   * @param {InserterDefinition} inserter - 투입기
   * @returns {Object|null} 도착지 객체 (건물 또는 컨베이어)
   */
  findTarget(inserter) {
    const targetPos = this.getNextPosition(inserter.x, inserter.y, inserter.direction)
    if (!targetPos) return null

    // 건물 확인
    const building = useGameStore.getState().getBuildingAt(targetPos.x, targetPos.y)
    if (building && building.inventory !== undefined) {
      return { ...building, objectType: 'building' }
    }

    // 컨베이어 확인 (향후 구현)
    // const conveyor = conveyorSystem.getConveyorAt(targetPos.x, targetPos.y)
    // if (conveyor) {
    //   return { ...conveyor, objectType: 'conveyor' }
    // }

    return null
  }

  /**
   * 출발지에서 아이템 픽업
   * @param {Object} source - 출발지
   * @param {number} maxAmount - 최대 픽업 수량
   * @returns {{resourceId: string, amount: number}|null}
   */
  pickupFromSource(source, maxAmount) {
    if (source.objectType === 'building' && source.inventory) {
      // 인벤토리에서 수량이 1 이상인 첫 번째 자원 가져오기
      const resources = Object.entries(source.inventory).filter(([, amount]) => amount > 0)
      if (resources.length === 0) return null

      const [resourceId, availableAmount] = resources[0]
      const pickupAmount = Math.min(maxAmount, availableAmount)

      // 건물 인벤토리에서 차감
      const newInventory = { ...source.inventory }
      newInventory[resourceId] = Math.max(0, newInventory[resourceId] - pickupAmount)

      useGameStore.getState().updateBuilding(source.id, { inventory: newInventory })

      return { resourceId, amount: pickupAmount }
    }

    // 컨베이어에서 픽업 (향후 구현)
    return null
  }

  /**
   * 도착지에 아이템 전달
   * @param {Object} target - 도착지
   * @param {{resourceId: string, amount: number}} item - 아이템
   * @returns {boolean} 전달 성공 여부
   */
  deliverToTarget(target, item) {
    if (!item) return false

    if (target.objectType === 'building' && target.inventory !== undefined) {
      // 건물 인벤토리에 추가
      const newInventory = { ...target.inventory }
      newInventory[item.resourceId] = (newInventory[item.resourceId] ?? 0) + item.amount

      useGameStore.getState().updateBuilding(target.id, { inventory: newInventory })
      return true
    }

    // 컨베이어에 전달 (향후 구현)
    return false
  }

  /**
   * 역방향 계산
   * @param {string} direction - 방향
   * @returns {string} 역방향
   */
  getReverseDirection(direction) {
    const reverseMap = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    }
    return reverseMap[direction] || 'up'
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
   * 투입기 배치
   * @param {number} x - 타일 X 좌표
   * @param {number} y - 타일 Y 좌표
   * @param {string} direction - 방향 ('up', 'down', 'left', 'right')
   * @returns {InserterDefinition|null} 생성된 투입기 또는 null
   */
  place(x, y, direction = 'right') {
    // 1. 배치 가능 여부 확인
    if (!this.canPlace(x, y)) {
      return null
    }

    // 2. 비용 지불
    const def = BUILDINGS.inserter
    if (!resourceSystem.consumeMultiple(def.cost)) {
      return null
    }

    // 3. 투입기 엔티티 생성
    const inserter = {
      id: generateInserterId(),
      x,
      y,
      direction,
      level: 1,
      cooldown: 0,
      heldItem: null,
      sourceId: null,
      targetId: null,
    }

    // 4. 내부 맵에 추가
    this.inserterMap.set(inserter.id, inserter)
    this.registerLocation(inserter)

    // 5. Zustand 상태에 추가
    useGameStore.getState().addInserter(inserter)

    // 6. 이벤트 발생
    this.emit('inserterPlaced', { inserter, x, y, direction })

    return inserter
  }

  /**
   * 배치 가능 여부 확인
   * @param {number} x - 타일 X 좌표
   * @param {number} y - 타일 Y 좌표
   * @returns {boolean}
   */
  canPlace(x, y) {
    const key = `${x},${y}`

    // 이미 투입기가 있는지 확인
    if (this.locationMap.has(key) && this.locationMap.get(key).size > 0) {
      return false
    }

    // 건물이 점유하고 있는지 확인
    const building = useGameStore.getState().getBuildingAt(x, y)
    if (building) {
      return false
    }

    // 비용 확인
    const def = BUILDINGS.inserter
    for (const [resourceId, amount] of Object.entries(def.cost)) {
      if (!resourceSystem.has(resourceId, amount)) {
        return false
      }
    }

    return true
  }

  /**
   * 투입기 위치 등록
   * @param {InserterDefinition} inserter - 투입기
   */
  registerLocation(inserter) {
    const key = `${inserter.x},${inserter.y}`
    if (!this.locationMap.has(key)) {
      this.locationMap.set(key, new Set())
    }
    this.locationMap.get(key).add(inserter.id)
  }

  /**
   * 투입기 위치 등록 해제
   * @param {InserterDefinition} inserter - 투입기
   */
  unregisterLocation(inserter) {
    const key = `${inserter.x},${inserter.y}`
    if (this.locationMap.has(key)) {
      this.locationMap.get(key).delete(inserter.id)
      if (this.locationMap.get(key).size === 0) {
        this.locationMap.delete(key)
      }
    }
  }

  /**
   * 투입기 제거
   * @param {string} inserterId - 투입기 ID
   * @returns {boolean} 제거 성공 여부
   */
  remove(inserterId) {
    const inserter = this.inserterMap.get(inserterId)
    if (!inserter) {
      console.warn(`[InserterSystem] Inserter not found: ${inserterId}`)
      return false
    }

    // 들고 있던 아이템 자원으로 반환
    if (inserter.heldItem) {
      resourceSystem.add(inserter.heldItem.resourceId, inserter.heldItem.amount)
    }

    // 50% 자원 환불
    const def = BUILDINGS.inserter
    const refund = {}
    for (const [resourceId, amount] of Object.entries(def.cost)) {
      refund[resourceId] = Math.floor(amount * 0.5)
    }
    resourceSystem.addMultiple(refund)

    // 위치 등록 해제
    this.unregisterLocation(inserter)

    // 내부 맵에서 제거
    this.inserterMap.delete(inserterId)

    // Zustand 상태에서 제거
    useGameStore.getState().removeInserter(inserterId)

    // 이벤트 발생
    this.emit('inserterRemoved', { inserterId, refund })

    return true
  }

  /**
   * 투입기 업그레이드
   * @param {string} inserterId - 투입기 ID
   * @returns {boolean} 업그레이드 성공 여부
   */
  upgrade(inserterId) {
    const inserter = this.inserterMap.get(inserterId)
    if (!inserter) {
      console.warn(`[InserterSystem] Inserter not found: ${inserterId}`)
      return false
    }

    const def = BUILDINGS.inserter
    if (inserter.level >= def.maxLevel) {
      return false
    }

    // 업그레이드 비용 계산 (1.5^레벨)
    const multiplier = Math.pow(1.5, inserter.level)
    const cost = {}
    for (const [resourceId, amount] of Object.entries(def.cost)) {
      cost[resourceId] = Math.ceil(amount * multiplier)
    }

    // 비용 지불
    if (!resourceSystem.consumeMultiple(cost)) {
      return false
    }

    // 레벨 증가
    inserter.level++

    // Zustand 상태 업데이트
    useGameStore.getState().updateInserter(inserterId, { level: inserter.level })

    return true
  }

  /**
   * 투입기 조회
   * @param {string} inserterId - 투입기 ID
   * @returns {InserterDefinition|undefined} 투입기
   */
  getInserter(inserterId) {
    return this.inserterMap.get(inserterId)
  }

  /**
   * 모든 투입기 조회
   * @returns {InserterDefinition[]} 투입기 배열
   */
  getAllInserters() {
    return Array.from(this.inserterMap.values())
  }

  /**
   * 특정 위치의 투입기 조회
   * @param {number} x - 타일 X 좌표
   * @param {number} y - 타일 Y 좌표
   * @returns {InserterDefinition|null} 투입기 또는 null
   */
  getInserterAt(x, y) {
    const key = `${x},${y}`
    const inserterIds = this.locationMap.get(key)
    if (!inserterIds || inserterIds.size === 0) return null

    const inserterId = inserterIds.values().next().value
    return this.inserterMap.get(inserterId)
  }

  /**
   * 투입기 방향 변경
   * @param {string} inserterId - 투입기 ID
   * @param {string} newDirection - 새 방향
   * @returns {boolean} 변경 성공 여부
   */
  changeDirection(inserterId, newDirection) {
    const inserter = this.inserterMap.get(inserterId)
    if (!inserter) {
      console.warn(`[InserterSystem] Inserter not found: ${inserterId}`)
      return false
    }

    const validDirections = ['up', 'down', 'left', 'right']
    if (!validDirections.includes(newDirection)) {
      console.warn(`[InserterSystem] Invalid direction: ${newDirection}`)
      return false
    }

    inserter.direction = newDirection

    // Zustand 상태 업데이트
    useGameStore.getState().updateInserter(inserterId, { direction: newDirection })

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
 * @type {InserterSystem}
 */
export const inserterSystem = new InserterSystem()
