/**
 * KIMCHI INVASION - Power System
 *
 * @description 전력 생산/소비를 관리하는 시스템
 * @module systems/powerSystem
 */

import { System } from '../ecs/System.js'
import { buildingSystem } from './buildingSystem.js'
import { resourceSystem } from './resourceSystem.js'
import { BUILDINGS } from '../data/buildings.js'

/**
 * 전력 관리 시스템
 * 발전소가 에너지를 생산하고, 건물들이 소비합니다.
 */
export class PowerSystem extends System {
  constructor() {
    super([]) // 전역 건물 관리이므로 requiredComponents 없음
    this.systemName = 'PowerSystem'
    this.priority = 25 // BuildingSystem(20) 다음 실행

    /**
     * @type {boolean} 전력 부족 경고 상태
     */
    this.powerWarning = false

    /**
     * @type {EventTarget} 이벤트 버스
     */
    this.eventBus = new EventTarget()
  }

  /**
   * 시스템 초기화
   */
  init() {
    // 전역 접근을 위해 window에 등록 (디버깅용)
    if (typeof window !== 'undefined') {
      window.powerSystem = this
    }
  }

  /**
   * 매 프레임 업데이트
   * @param {import('../ecs/Entity.js').Entity[]} _entities - 사용하지 않음
   * @param {number} deltaTime - 이전 프레임으로부터의 경과 시간 (초 단위)
   */
  update(_entities, deltaTime) {
    // BuildingSystem에서 이미 에너지 생산/소비를 처리하므로
    // 여기서는 전력 상태 모니터링과 경고만 담당

    // 1. 총 전력 소비량 계산
    const totalConsumption = this.calculateTotalConsumption()

    // 2. 전력 부족 체크
    this.checkPowerStatus(totalConsumption, deltaTime)
  }

  /**
   * 발전소에서 에너지 생산 (BuildingSystem에서 처리하므로 현재 사용 안함)
   * @deprecated BuildingSystem.updateBuildingProduction()에서 처리
   * @param {number} deltaTime - 경과 시간 (초)
   */
  produceEnergy(deltaTime) {
    const powerPlants = buildingSystem.getBuildingsByType('coalPowerPlant')

    for (const plant of powerPlants) {
      const def = BUILDINGS.coalPowerPlant
      if (!def) continue

      // 연료 소비 (레골리스)
      const fuelNeeded = (def.input?.regolith ?? 0.3) * deltaTime
      if (!resourceSystem.has('regolith', fuelNeeded)) {
        continue // 연료 부족 시 발전 중단
      }

      if (!resourceSystem.consume('regolith', fuelNeeded)) {
        continue
      }

      // 에너지 생산 (레벨 보너스 적용)
      const baseProduction = Math.abs(def.energyPerTick) // 음수이므로 절대값
      const levelBonus = 1 + (plant.level - 1) * 0.2
      const production = baseProduction * levelBonus * deltaTime

      resourceSystem.add('energy', production)
    }
  }

  /**
   * 총 전력 소비량 계산
   * @returns {number} 초당 전력 소비량 (에너지/sec)
   */
  calculateTotalConsumption() {
    let total = 0
    const buildings = buildingSystem.getAllBuildings()

    for (const building of buildings) {
      const def = BUILDINGS[building.type]
      if (def && def.energyPerTick > 0) {
        // 에너지 소비 건물만 계산 (양수)
        total += def.energyPerTick
      }
    }

    return total
  }

  /**
   * 전력 상태 체크 및 경고
   * @param {number} consumption - 초당 소비량
   * @param {number} _deltaTime - 경과 시간 (초)
   */
  checkPowerStatus(consumption, _deltaTime) {
    const currentEnergy = resourceSystem.get('energy')
    const wasWarning = this.powerWarning

    // 에너지가 5초치 소비량 미만이면 경고
    this.powerWarning = currentEnergy < consumption * 5

    // 경고 시작
    if (this.powerWarning && !wasWarning) {
      this.emit('powerWarning', { current: currentEnergy, consumption })
      console.warn(`[PowerSystem] ⚡ Power Warning! Energy: ${currentEnergy.toFixed(1)}`)
    }

    // 경고 해제
    if (!this.powerWarning && wasWarning) {
      this.emit('powerRestored', { current: currentEnergy })
      console.warn(`[PowerSystem] ⚡ Power Restored! Energy: ${currentEnergy.toFixed(1)}`)
    }
  }

  /**
   * 건물이 작동 가능한지 확인 (전력 충분 여부)
   * @param {Object} building - 건물 엔티티
   * @returns {boolean} 작동 가능 여부
   */
  canOperate(building) {
    const def = BUILDINGS[building.type]
    if (!def || def.energyPerTick <= 0) return true // 에너지 소비 없으면 항상 작동

    return resourceSystem.has('energy', def.energyPerTick)
  }

  /**
   * 전력 수지 조회 (생산 - 소비)
   * @returns {{ production: number, consumption: number, balance: number }}
   */
  getPowerBalance() {
    let production = 0
    let consumption = 0

    const buildings = buildingSystem.getAllBuildings()

    for (const building of buildings) {
      const def = BUILDINGS[building.type]
      if (!def) continue

      if (def.energyPerTick < 0) {
        // 에너지 생산 건물 (음수)
        const baseProduction = Math.abs(def.energyPerTick)
        const levelBonus = 1 + (building.level - 1) * 0.2
        production += baseProduction * levelBonus
      } else if (def.energyPerTick > 0) {
        // 에너지 소비 건물 (양수)
        consumption += def.energyPerTick
      }
    }

    return {
      production,
      consumption,
      balance: production - consumption,
    }
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
 * @type {PowerSystem}
 */
export const powerSystem = new PowerSystem()
