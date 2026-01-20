/**
 * KIMCHI INVASION - Fermentation System
 *
 * @description 배추김치 발효 시스템. M1 목표인 "김치 10캔 생산"의 핵심 시스템
 * @module systems/fermentationSystem
 */

import { System } from '../ecs/System.js'
import { buildingSystem } from './buildingSystem.js'
import { resourceSystem } from './resourceSystem.js'
import { BUILDINGS } from '../data/buildings.js'

/**
 * 발효 시스템
 * 발효실에서 재료를 김치로 발효시키는 프로세스 관리
 */
export class FermentationSystem extends System {
  constructor() {
    super([]) // 전역 건물 관리이므로 requiredComponents 없음
    this.systemName = 'FermentationSystem'
    this.priority = 40 // ProcessingSystem(30) 다음 실행

    /** @type {EventTarget} 이벤트 버스 */
    this.eventBus = new EventTarget()

    /**
     * 발효 레시피 정의
     * @type {Object}
     */
    this.recipe = {
      input: {
        cabbage: 1, // 절인 배추 1개
        salt: 1, // 소금 1개
        chilliPowder: 1, // 고춧가루 1개
      },
      output: {
        kimchi: 1, // 김치 1개
      },
      time: 60, // 60초 기본 발효 시간
      description: '배추김치 발효',
    }
  }

  /**
   * 시스템 초기화
   */
  init() {
    // 전역 접근을 위해 window에 등록 (디버깅용)
    if (typeof window !== 'undefined') {
      window.fermentationSystem = this
    }
  }

  /**
   * 매 프레임 업데이트
   * @param {import('../ecs/Entity.js').Entity[]} _entities - 사용하지 않음
   * @param {number} deltaTime - 이전 프레임으로부터의 경과 시간 (초 단위)
   */
  update(_entities, deltaTime) {
    // 발효실 건물 필터링
    const fermenters = buildingSystem.getBuildingsByType('fermentationChamber')

    for (const building of fermenters) {
      this.processFermentation(building, deltaTime)
    }
  }

  /**
   * 발효 프로세스 처리
   * @param {Object} building - 발효실 건물 엔티티
   * @param {number} deltaTime - 경과 시간 (초)
   */
  processFermentation(building, deltaTime) {
    // 1. 발효 중인 경우 진행
    if (building.fermenting) {
      // progress가 없으면 초기화
      if (typeof building.progress !== 'number') {
        building.progress = 0
      }

      // 에너지 소비 확인
      const def = BUILDINGS.fermentationChamber
      const energyNeeded = def.energyPerTick * deltaTime

      if (!resourceSystem.has('energy', energyNeeded)) {
        // 에너지 부족 시 발효 진행 중단 (상태 유지)
        return
      }

      // 에너지 소비
      resourceSystem.consume('energy', energyNeeded)

      // 진행률 업데이트
      building.progress += deltaTime / this.recipe.time

      // 발효 완료
      if (building.progress >= 1) {
        // 출력 자원 생성 (김치 생산)
        resourceSystem.addMultiple(this.recipe.output)
        building.progress = 0
        building.fermenting = false

        // 발효 완료 이벤트 발생
        this.emit('fermented', {
          buildingId: building.id,
          building,
          output: this.recipe.output,
        })
      }
      return
    }

    // 2. 새 발효 시작
    if (this.canStartFermentation()) {
      // 입력 자원 소비
      if (resourceSystem.consumeMultiple(this.recipe.input)) {
        building.fermenting = true
        building.progress = 0

        // 발효 시작 이벤트 발생
        this.emit('fermentationStarted', {
          buildingId: building.id,
          building,
          input: this.recipe.input,
        })
      }
    }
  }

  /**
   * 발효 시작 가능 여부 확인
   * @returns {boolean} 가능 여부
   */
  canStartFermentation() {
    // 모든 입력 자원이 충분한지 확인
    for (const [resourceId, amount] of Object.entries(this.recipe.input)) {
      if (!resourceSystem.has(resourceId, amount)) {
        return false
      }
    }
    return true
  }

  /**
   * 레시피 조회
   * @returns {Object} 현재 발효 레시피
   */
  getRecipe() {
    return this.recipe
  }

  /**
   * 레시피 수정 (향후 업그레이드/연구용)
   * @param {Object} newRecipe - 새 레시피 정의
   * @returns {boolean} 수정 성공 여부
   */
  setRecipe(newRecipe) {
    if (!newRecipe.input || !newRecipe.output || !newRecipe.time) {
      console.warn('[FermentationSystem] Invalid recipe format')
      return false
    }

    this.recipe = newRecipe
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
 * @type {FermentationSystem}
 */
export const fermentationSystem = new FermentationSystem()
