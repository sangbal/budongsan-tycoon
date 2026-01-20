/**
 * KIMCHI INVASION - Processing System
 *
 * @description 가공 건물(용광로, 절임소 등) 처리 시스템
 * @module systems/processingSystem
 */

import { System } from '../ecs/System.js'
import { buildingSystem } from './buildingSystem.js'
import { resourceSystem } from './resourceSystem.js'

/**
 * 가공 시스템
 * 자원을 가공하여 새로운 자원을 생산
 */
export class ProcessingSystem extends System {
  constructor() {
    super([]) // 전역 건물 관리이므로 requiredComponents 없음
    this.systemName = 'ProcessingSystem'
    this.priority = 30 // BuildingSystem(20) 다음 실행

    /** @type {EventTarget} 이벤트 버스 */
    this.eventBus = new EventTarget()

    /**
     * 가공 레시피 정의
     * @type {Object.<string, Object>}
     */
    this.recipes = {
      furnace: {
        input: { iron: 2 }, // 철광석 2개
        output: { iron: 1 }, // 철판 1개 (자원 ID는 동일하지만 가공품)
        time: 15, // 15초
        description: '철광석 제련',
      },
      brineStation: {
        input: { water: 10 }, // 물 10개
        output: { salt: 1 }, // 소금 1개
        time: 20, // 20초
        description: '소금 증발',
      },
    }
  }

  /**
   * 시스템 초기화
   */
  init() {
    // 전역 접근을 위해 window에 등록 (디버깅용)
    if (typeof window !== 'undefined') {
      window.processingSystem = this
    }
  }

  /**
   * 매 프레임 업데이트
   * @param {import('../ecs/Entity.js').Entity[]} _entities - 사용하지 않음
   * @param {number} deltaTime - 이전 프레임으로부터의 경과 시간 (초 단위)
   */
  update(_entities, deltaTime) {
    // 가공 건물 처리
    for (const [buildingType, recipe] of Object.entries(this.recipes)) {
      const buildings = buildingSystem.getBuildingsByType(buildingType)
      for (const building of buildings) {
        this.processBuilding(building, recipe, deltaTime)
      }
    }
  }

  /**
   * 가공 건물 처리
   * @param {Object} building - 건물 엔티티
   * @param {Object} recipe - 레시피 정의
   * @param {number} deltaTime - 경과 시간 (초)
   */
  processBuilding(building, recipe, deltaTime) {
    // 이미 진행 중인 경우
    if (building.processing) {
      // progress가 없으면 초기화
      if (typeof building.progress !== 'number') {
        building.progress = 0
      }

      // 진행률 업데이트
      building.progress += deltaTime / recipe.time

      // 가공 완료
      if (building.progress >= 1) {
        // 출력 자원 생성
        resourceSystem.addMultiple(recipe.output)
        building.progress = 0
        building.processing = false

        // 가공 완료 이벤트 발생
        this.emit('processed', {
          buildingId: building.id,
          building,
          output: recipe.output,
        })

        console.log(
          `[ProcessingSystem] Processed: ${JSON.stringify(recipe.output)} from ${building.id}`
        )
      }
      return
    }

    // 새로운 가공 시작
    if (this.canStartProcessing(recipe)) {
      // 입력 자원 소비
      if (resourceSystem.consumeMultiple(recipe.input)) {
        building.processing = true
        building.progress = 0

        // 가공 시작 이벤트 발생
        this.emit('processingStarted', {
          buildingId: building.id,
          building,
          input: recipe.input,
        })

        console.log(
          `[ProcessingSystem] Started processing: ${JSON.stringify(recipe.input)} at ${building.id}`
        )
      }
    }
  }

  /**
   * 가공 시작 가능 여부 확인
   * @param {Object} recipe - 레시피 정의
   * @returns {boolean} 가능 여부
   */
  canStartProcessing(recipe) {
    // 모든 입력 자원이 충분한지 확인
    for (const [resourceId, amount] of Object.entries(recipe.input)) {
      if (!resourceSystem.has(resourceId, amount)) {
        return false
      }
    }
    return true
  }

  /**
   * 레시피 조회
   * @param {string} buildingType - 건물 타입
   * @returns {Object|null} 레시피 또는 null
   */
  getRecipe(buildingType) {
    return this.recipes[buildingType] ?? null
  }

  /**
   * 레시피 추가/수정 (향후 확장용)
   * @param {string} buildingType - 건물 타입
   * @param {Object} recipe - 레시피 정의
   */
  setRecipe(buildingType, recipe) {
    if (!recipe.input || !recipe.output || !recipe.time) {
      console.warn('[ProcessingSystem] Invalid recipe format')
      return false
    }

    this.recipes[buildingType] = recipe
    console.log(`[ProcessingSystem] Set recipe for ${buildingType}`)
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
   * 디버깅: 모든 가공 건물 상태 출력
   */
  debugPrintAll() {
    console.log('=== Processing System Status ===')

    for (const [buildingType, recipe] of Object.entries(this.recipes)) {
      const buildings = buildingSystem.getBuildingsByType(buildingType)
      console.log(`\n${buildingType} (${buildings.length}):`)
      console.log(`  Recipe: ${JSON.stringify(recipe.input)} → ${JSON.stringify(recipe.output)}`)
      console.log(`  Time: ${recipe.time}s`)

      for (const building of buildings) {
        const status = building.processing ? 'Processing' : 'Idle'
        const progress = building.processing ? (building.progress || 0) * 100 : 0
        console.log(
          `  ${building.id} (${building.x}, ${building.y}) ` +
            `Lv.${building.level} - ${status} ${progress.toFixed(1)}%`
        )
      }
    }
  }
}

// === 싱글톤 인스턴스 ===

/**
 * 전역 싱글톤 인스턴스
 * @type {ProcessingSystem}
 */
export const processingSystem = new ProcessingSystem()
