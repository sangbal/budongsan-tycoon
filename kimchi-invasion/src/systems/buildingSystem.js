/**
 * KIMCHI INVASION - Building System
 *
 * @description 건물 배치, 제거, 업그레이드 관리 시스템
 * @module systems/buildingSystem
 */

import { System } from '../ecs/System.js'
import { BUILDINGS, canAfford, getUpgradeCost, getProductionRate } from '../data/buildings.js'
import { resourceSystem } from './resourceSystem.js'
import { useGameStore } from '../state/stores/gameStore.js'
import { generateBuildingId } from '../utils/idGenerator.js'
import { getTile } from '../core/tilemap.js'
import { getTutorialCost } from './tutorialSystem.js'

/**
 * 건물 관리 시스템
 * 건물 배치, 제거, 업그레이드, 생산 로직 처리
 */
export class BuildingSystem extends System {
  constructor() {
    super([]) // 전역 건물 관리이므로 requiredComponents 없음
    this.systemName = 'BuildingSystem'
    this.priority = 20 // ResourceSystem(10) 다음 실행

    /** @type {Map<string, Object>} 건물 엔티티 맵 (빠른 조회용) */
    this.buildingMap = new Map()

    /** @type {Map<string, Set<string>>} 타일별 점유 맵 (x,y → 건물 ID Set) */
    this.occupancyMap = new Map()

    /** @type {EventTarget} 이벤트 버스 */
    this.eventBus = new EventTarget()
  }

  /**
   * 시스템 초기화
   */
  init() {
    // 전역 접근을 위해 window에 등록 (디버깅용)
    if (typeof window !== 'undefined') {
      window.buildingSystem = this
    }

    // 저장된 건물 복원
    this.loadBuildings()
  }

  /**
   * 저장된 건물 불러오기 (게임 시작 시)
   */
  loadBuildings() {
    const buildings = useGameStore.getState().buildings
    this.buildingMap.clear()
    this.occupancyMap.clear()

    for (const building of buildings) {
      this.buildingMap.set(building.id, building)
      this.markOccupied(building)
    }
  }

  /**
   * 매 프레임 업데이트
   * @param {import('../ecs/Entity.js').Entity[]} _entities - 사용하지 않음
   * @param {number} deltaTime - 이전 프레임으로부터의 경과 시간 (초 단위)
   */
  update(_entities, deltaTime) {
    // 모든 건물의 생산 처리
    for (const building of this.buildingMap.values()) {
      this.updateBuildingProduction(building, deltaTime)
    }
  }

  /**
   * 건물 생산 업데이트
   * @param {Object} building - 건물 엔티티
   * @param {number} deltaTime - 경과 시간 (초)
   */
  updateBuildingProduction(building, deltaTime) {
    const def = BUILDINGS[building.type]
    if (!def) return

    // 입력 자원 소비 확인 (발전소 연료 포함)
    if (def.input && Object.keys(def.input).length > 0) {
      const inputNeeded = {}
      for (const [resourceId, amount] of Object.entries(def.input)) {
        inputNeeded[resourceId] = amount * deltaTime
      }

      // 입력 자원이 부족하면 생산 중단
      for (const [resourceId, amount] of Object.entries(inputNeeded)) {
        if (!resourceSystem.has(resourceId, amount)) {
          return
        }
      }

      // 입력 자원 소비
      for (const [resourceId, amount] of Object.entries(inputNeeded)) {
        resourceSystem.consume(resourceId, amount)
      }
    }

    // 에너지 소비/생산 처리
    if (def.energyPerTick > 0) {
      // 에너지 소비 건물
      const energyNeeded = def.energyPerTick * deltaTime
      if (!resourceSystem.has('energy', energyNeeded)) {
        // 에너지 부족 시 생산 중단 (입력 자원은 이미 소비됨 - 손실)
        return
      }
      resourceSystem.consume('energy', energyNeeded)
    } else if (def.energyPerTick < 0) {
      // 에너지 생산 건물 (발전소)
      const energyProduced = Math.abs(def.energyPerTick) * deltaTime
      resourceSystem.add('energy', energyProduced)
    }

    // 생산량 계산 (레벨 보너스 적용)
    const production = getProductionRate(building.type, building.level)

    // 출력 자원 생산
    for (const [resourceId, baseAmount] of Object.entries(production)) {
      // energyPerTick이 음수면 에너지는 이미 생산됨 (중복 방지)
      if (resourceId === 'energy' && def.energyPerTick < 0) {
        continue
      }
      resourceSystem.add(resourceId, baseAmount * deltaTime)
    }

    // 생산 진행률 업데이트 (processTime이 있는 경우)
    if (def.processTime > 0) {
      building.progress = (building.progress || 0) + deltaTime / def.processTime
      if (building.progress >= 1) {
        building.progress = 0
        // 생산 완료 이벤트
        this.emit('productionComplete', { buildingId: building.id, building })
      }
      useGameStore.getState().updateBuilding(building.id, { progress: building.progress })
    }
  }

  /**
   * 건물 배치
   * @param {string} buildingType - 건물 타입 (BUILDINGS 키)
   * @param {number} tileX - 타일 X 좌표
   * @param {number} tileY - 타일 Y 좌표
   * @returns {Object|null} 생성된 건물 엔티티 또는 null
   */
  place(buildingType, tileX, tileY) {
    // 1. 건물 정의 확인
    const def = BUILDINGS[buildingType]
    if (!def) {
      console.warn(`[BuildingSystem] Unknown building type: ${buildingType}`)
      return null
    }

    // 2. 배치 가능 여부 확인
    if (!this.canPlace(buildingType, tileX, tileY)) {
      return null
    }

    // 3. 비용 지불 (튜토리얼 모드에서는 할인된 비용 적용)
    const cost = getTutorialCost(buildingType) ?? def.cost
    if (!resourceSystem.consumeMultiple(cost)) {
      return null
    }

    // 4. 건물 엔티티 생성
    const building = {
      id: generateBuildingId(),
      type: buildingType,
      x: tileX,
      y: tileY,
      level: 1,
      progress: 0, // 생산 진행률
      inventory: {}, // 내부 재고 (향후 확장)
    }

    // 5. 내부 맵에 추가
    this.buildingMap.set(building.id, building)
    this.markOccupied(building)

    // 6. Zustand 상태에 추가
    useGameStore.getState().addBuilding(building)

    // 7. 이벤트 발생
    this.emit('placed', { building, x: tileX, y: tileY })

    return building
  }

  /**
   * 배치 가능 여부 확인
   * @param {string} buildingType - 건물 타입
   * @param {number} tileX - 타일 X 좌표
   * @param {number} tileY - 타일 Y 좌표
   * @returns {boolean}
   */
  canPlace(buildingType, tileX, tileY) {
    const def = BUILDINGS[buildingType]
    if (!def) {
      console.warn(`[BuildingSystem] canPlace: Unknown building type: ${buildingType}`)
      return false
    }

    const { width, height } = def.size

    // 모든 타일이 비어있고, 건설 가능한지 확인
    for (let dx = 0; dx < width; dx++) {
      for (let dy = 0; dy < height; dy++) {
        const x = tileX + dx
        const y = tileY + dy

        // 타일이 건물로 점유되어 있는지 확인
        if (this.isOccupied(x, y)) {
          console.log(`[BuildingSystem] canPlace: Tile (${x}, ${y}) is occupied`)
          return false
        }

        // 타일이 건설 가능한 지형인지 확인
        const tile = getTile(x, y)
        if (!tile) {
          console.log(`[BuildingSystem] canPlace: Tile (${x}, ${y}) not found`)
          return false
        }
        if (!tile.buildable) {
          console.log(
            `[BuildingSystem] canPlace: Tile (${x}, ${y}) is not buildable (type: ${tile.type})`
          )
          return false
        }
      }
    }

    // 비용 확인 (튜토리얼 모드에서는 할인된 비용 적용)
    const cost = getTutorialCost(buildingType) ?? def.cost
    const resources = {}
    for (const resourceId of Object.keys(cost)) {
      resources[resourceId] = resourceSystem.get(resourceId)
    }

    // 튜토리얼 비용이 있으면 직접 비교, 없으면 canAfford 사용
    let affordable = true
    for (const [resourceId, amount] of Object.entries(cost)) {
      if ((resources[resourceId] ?? 0) < amount) {
        affordable = false
        break
      }
    }

    if (!affordable) {
      console.log(
        `[BuildingSystem] canPlace: Cannot afford ${buildingType}. Cost:`,
        cost,
        'Have:',
        resources
      )
    }

    return affordable
  }

  /**
   * 타일 점유 여부 확인
   * @param {number} x - 타일 X 좌표
   * @param {number} y - 타일 Y 좌표
   * @returns {boolean}
   */
  isOccupied(x, y) {
    const key = `${x},${y}`
    return this.occupancyMap.has(key) && this.occupancyMap.get(key).size > 0
  }

  /**
   * 건물이 점유한 타일 표시
   * @param {Object} building - 건물 엔티티
   */
  markOccupied(building) {
    const def = BUILDINGS[building.type]
    if (!def) return

    const { width, height } = def.size
    for (let dx = 0; dx < width; dx++) {
      for (let dy = 0; dy < height; dy++) {
        const key = `${building.x + dx},${building.y + dy}`
        if (!this.occupancyMap.has(key)) {
          this.occupancyMap.set(key, new Set())
        }
        this.occupancyMap.get(key).add(building.id)
      }
    }
  }

  /**
   * 건물이 점유한 타일 해제
   * @param {Object} building - 건물 엔티티
   */
  unmarkOccupied(building) {
    const def = BUILDINGS[building.type]
    if (!def) return

    const { width, height } = def.size
    for (let dx = 0; dx < width; dx++) {
      for (let dy = 0; dy < height; dy++) {
        const key = `${building.x + dx},${building.y + dy}`
        if (this.occupancyMap.has(key)) {
          this.occupancyMap.get(key).delete(building.id)
          if (this.occupancyMap.get(key).size === 0) {
            this.occupancyMap.delete(key)
          }
        }
      }
    }
  }

  /**
   * 건물 제거
   * @param {string} buildingId - 건물 ID
   * @returns {boolean} 제거 성공 여부
   */
  remove(buildingId) {
    const building = this.buildingMap.get(buildingId)
    if (!building) {
      console.warn(`[BuildingSystem] Building not found: ${buildingId}`)
      return false
    }

    // 50% 자원 환불
    const refund = this.calculateRefund(building)
    resourceSystem.addMultiple(refund)

    // 점유 해제
    this.unmarkOccupied(building)

    // 내부 맵에서 제거
    this.buildingMap.delete(buildingId)

    // Zustand 상태에서 제거
    useGameStore.getState().removeBuilding(buildingId)

    // 이벤트 발생
    this.emit('removed', { buildingId, refund })

    return true
  }

  /**
   * 건물 제거 시 환불 계산 (50%)
   * @param {Object} building - 건물 엔티티
   * @returns {Object.<string, number>} 환불 자원
   */
  calculateRefund(building) {
    const def = BUILDINGS[building.type]
    if (!def) return {}

    const refund = {}
    for (const [resourceId, amount] of Object.entries(def.cost)) {
      refund[resourceId] = Math.floor(amount * 0.5)
    }

    return refund
  }

  /**
   * 건물 업그레이드
   * @param {string} buildingId - 건물 ID
   * @returns {boolean} 업그레이드 성공 여부
   */
  upgrade(buildingId) {
    const building = this.buildingMap.get(buildingId)
    if (!building) {
      console.warn(`[BuildingSystem] Building not found: ${buildingId}`)
      return false
    }

    const def = BUILDINGS[building.type]
    if (!def) return false

    // 최대 레벨 확인
    if (building.level >= def.maxLevel) {
      return false
    }

    // 업그레이드 비용 계산 (1.5^레벨)
    const cost = getUpgradeCost(building.type, building.level)
    if (!cost) return false

    // 비용 지불
    if (!resourceSystem.consumeMultiple(cost)) {
      return false
    }

    // 레벨 증가
    building.level++

    // Zustand 상태 업데이트
    useGameStore.getState().updateBuilding(buildingId, { level: building.level })

    // 이벤트 발생
    this.emit('upgraded', { buildingId, newLevel: building.level })

    return true
  }

  /**
   * 건물 조회
   * @param {string} buildingId - 건물 ID
   * @returns {Object|undefined} 건물 엔티티
   */
  getBuilding(buildingId) {
    return this.buildingMap.get(buildingId)
  }

  /**
   * 모든 건물 조회
   * @returns {Object[]} 건물 엔티티 배열
   */
  getAllBuildings() {
    return Array.from(this.buildingMap.values())
  }

  /**
   * 타입별 건물 조회
   * @param {string} buildingType - 건물 타입
   * @returns {Object[]} 건물 엔티티 배열
   */
  getBuildingsByType(buildingType) {
    return Array.from(this.buildingMap.values()).filter(b => b.type === buildingType)
  }

  /**
   * 특정 위치의 건물 조회
   * @param {number} x - 타일 X 좌표
   * @param {number} y - 타일 Y 좌표
   * @returns {Object|null} 건물 엔티티 또는 null
   */
  getBuildingAt(x, y) {
    const key = `${x},${y}`
    const buildingIds = this.occupancyMap.get(key)
    if (!buildingIds || buildingIds.size === 0) return null

    const buildingId = buildingIds.values().next().value
    return this.buildingMap.get(buildingId)
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
 * @type {BuildingSystem}
 */
export const buildingSystem = new BuildingSystem()
