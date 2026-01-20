/**
 * KIMCHI INVASION - Farming System
 *
 * @description 온실(greenhouse) 농업 생산 시스템
 * @module systems/farmingSystem
 */

import { System } from '../ecs/System.js'
import { buildingSystem } from './buildingSystem.js'
import { resourceSystem } from './resourceSystem.js'
import { BUILDINGS } from '../data/buildings.js'

/**
 * 농업 생산 시스템
 * 온실에서 작물을 재배하고 수확
 */
export class FarmingSystem extends System {
  constructor() {
    super([]) // 전역 건물 관리이므로 requiredComponents 없음
    this.systemName = 'FarmingSystem'
    this.priority = 30 // BuildingSystem(20) 다음 실행

    /** @type {EventTarget} 이벤트 버스 */
    this.eventBus = new EventTarget()

    /**
     * 작물별 성장 시간 (초)
     * @type {Object.<string, number>}
     */
    this.cropGrowthTimes = {
      cabbage: 30, // 배추: 30초
      chilliPowder: 45, // 고추: 45초
      garlic: 60, // 마늘: 60초
    }
  }

  /**
   * 시스템 초기화
   */
  init() {
    // 전역 접근을 위해 window에 등록 (디버깅용)
    if (typeof window !== 'undefined') {
      window.farmingSystem = this
    }
  }

  /**
   * 매 프레임 업데이트
   * @param {import('../ecs/Entity.js').Entity[]} _entities - 사용하지 않음
   * @param {number} deltaTime - 이전 프레임으로부터의 경과 시간 (초 단위)
   */
  update(_entities, deltaTime) {
    // 온실 건물만 필터링
    const greenhouses = buildingSystem.getBuildingsByType('greenhouse')

    for (const building of greenhouses) {
      this.processFarming(building, deltaTime)
    }
  }

  /**
   * 온실 농업 처리
   * @param {Object} building - 온실 건물 엔티티
   * @param {number} deltaTime - 경과 시간 (초)
   */
  processFarming(building, deltaTime) {
    const def = BUILDINGS.greenhouse
    if (!def) {
      console.warn('[FarmingSystem] Greenhouse definition not found')
      return
    }

    // 1. 입력 자원 소비 (물)
    const waterNeeded = def.input.water * deltaTime
    if (!resourceSystem.has('water', waterNeeded)) {
      // 물 부족 시 생산 중단
      return
    }
    resourceSystem.consume('water', waterNeeded)

    // 2. 에너지 소비
    const energyNeeded = def.energyPerTick * deltaTime
    if (!resourceSystem.has('energy', energyNeeded)) {
      // 에너지 부족 시 생산 중단 (물은 이미 소비됨 - 손실)
      return
    }
    resourceSystem.consume('energy', energyNeeded)

    // 3. 진행률 업데이트
    const crop = building.cropType || 'cabbage' // 기본 배추
    const growthTime = this.cropGrowthTimes[crop] || def.processTime

    // progress가 없으면 초기화
    if (typeof building.progress !== 'number') {
      building.progress = 0
    }

    building.progress += deltaTime / growthTime

    // 4. 생산 완료 시
    if (building.progress >= 1) {
      resourceSystem.add(crop, 1)
      building.progress = 0

      // 수확 이벤트 발생
      this.emit('harvested', { buildingId: building.id, building, crop })

      console.log(`[FarmingSystem] Harvested ${crop} from ${building.id}`)
    }
  }

  /**
   * 온실 작물 변경
   * @param {string} buildingId - 건물 ID
   * @param {string} cropType - 작물 타입 (cabbage, chilliPowder, garlic)
   * @returns {boolean} 변경 성공 여부
   */
  setCropType(buildingId, cropType) {
    const building = buildingSystem.getBuilding(buildingId)
    if (!building || building.type !== 'greenhouse') {
      console.warn(`[FarmingSystem] Invalid building or not a greenhouse: ${buildingId}`)
      return false
    }

    if (!this.cropGrowthTimes[cropType]) {
      console.warn(`[FarmingSystem] Unknown crop type: ${cropType}`)
      return false
    }

    // 작물 변경 시 진행률 리셋
    building.cropType = cropType
    building.progress = 0

    this.emit('cropChanged', { buildingId, building, cropType })

    console.log(`[FarmingSystem] Changed crop to ${cropType} for ${buildingId}`)
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

  /**
   * 디버깅: 모든 온실 상태 출력
   */
  debugPrintAll() {
    const greenhouses = buildingSystem.getBuildingsByType('greenhouse')
    console.log('=== Farming System Status ===')
    console.log(`Total Greenhouses: ${greenhouses.length}`)

    for (const building of greenhouses) {
      const crop = building.cropType || 'cabbage'
      const progress = (building.progress || 0) * 100
      console.log(
        `🏡 ${building.id} (${building.x}, ${building.y}) ` +
          `Lv.${building.level} - ${crop} ${progress.toFixed(1)}%`
      )
    }
  }
}

// === 싱글톤 인스턴스 ===

/**
 * 전역 싱글톤 인스턴스
 * @type {FarmingSystem}
 */
export const farmingSystem = new FarmingSystem()
