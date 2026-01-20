/**
 * KIMCHI INVASION - Resource System
 *
 * @description 자원 관리 ECS 시스템
 * @module systems/resourceSystem
 */

import { System } from '../ecs/System.js'
import { RESOURCES } from '../data/resources.js'
import { useGameStore } from '../state/stores/gameStore.js'

/**
 * 자원 관리 시스템
 * 자원 추가/소비/검사 로직을 처리하고, 틱마다 자원 갱신을 관리
 */
export class ResourceSystem extends System {
  constructor() {
    super([]) // 엔티티가 아닌 전역 상태 관리이므로 requiredComponents 없음
    this.systemName = 'ResourceSystem'
    this.priority = 10 // 다른 시스템보다 먼저 실행
  }

  /**
   * 시스템 초기화
   */
  init() {
    // 전역 접근을 위해 window에 등록 (디버깅용)
    if (typeof window !== 'undefined') {
      window.resourceSystem = this
    }
  }

  /**
   * 매 프레임 업데이트
   * @param {import('../ecs/Entity.js').Entity[]} _entities - 사용하지 않음
   * @param {number} deltaTime - 이전 프레임으로부터의 경과 시간 (초 단위)
   */
  update(_entities, deltaTime) {
    // 향후 자동 생산/소비 로직 추가 예정
    // - 에너지 소모 처리 (건물이 가동 중이면 에너지 감소)
    // - 산소 소모 처리 (생명 유지)
    // - 자동 생산 로직

    // 현재는 빈 구현 (수동 자원 관리만)

    const dt = deltaTime // ESLint 경고 방지용
  }

  /**
   * 자원 추가
   * @param {string} resourceId - 자원 ID
   * @param {number} amount - 추가할 양 (양수)
   * @returns {number} 실제로 추가된 양
   */
  add(resourceId, amount) {
    const resource = RESOURCES[resourceId]
    if (!resource) {
      console.warn(`[ResourceSystem] Unknown resource: ${resourceId}`)
      return 0
    }

    const current = this.get(resourceId)
    const maxValue = resource.maxValue === -1 ? Infinity : resource.maxValue
    const newValue = Math.min(current + amount, maxValue)
    const actualAdded = newValue - current

    if (actualAdded > 0) {
      useGameStore.getState().modifyResource(resourceId, actualAdded)
    }

    return actualAdded
  }

  /**
   * 자원 소비
   * @param {string} resourceId - 자원 ID
   * @param {number} amount - 소비할 양 (양수)
   * @returns {boolean} 소비 성공 여부
   */
  consume(resourceId, amount) {
    const resource = RESOURCES[resourceId]
    if (!resource) {
      console.warn(`[ResourceSystem] Unknown resource: ${resourceId}`)
      return false
    }

    const current = this.get(resourceId)
    if (current < amount) {
      return false // 부족하면 실패
    }

    useGameStore.getState().modifyResource(resourceId, -amount)
    return true
  }

  /**
   * 자원 보유량 검사
   * @param {string} resourceId - 자원 ID
   * @param {number} amount - 필요한 양
   * @returns {boolean} 충분한지 여부
   */
  has(resourceId, amount) {
    const current = this.get(resourceId)
    return current >= amount
  }

  /**
   * 현재 보유량 조회
   * @param {string} resourceId - 자원 ID
   * @returns {number} 현재 보유량
   */
  get(resourceId) {
    const resources = useGameStore.getState().resources
    return resources[resourceId] ?? 0
  }

  /**
   * 자원 직접 설정 (디버깅/테스트용)
   * @param {string} resourceId - 자원 ID
   * @param {number} amount - 설정할 양
   */
  set(resourceId, amount) {
    const clampedAmount = Math.max(0, Math.min(amount, this.getMaxValue(resourceId)))
    useGameStore.getState().modifyResource(resourceId, clampedAmount - this.get(resourceId))
  }

  /**
   * 최대 용량 조회
   * @param {string} resourceId - 자원 ID
   * @returns {number} 최대 용량 (Infinity 가능)
   */
  getMaxValue(resourceId) {
    const resource = RESOURCES[resourceId]
    if (!resource) {
      console.warn(`[ResourceSystem] Unknown resource: ${resourceId}`)
      return 0
    }

    return resource.maxValue === -1 ? Infinity : resource.maxValue
  }

  /**
   * 자원 정의 조회
   * @param {string} resourceId - 자원 ID
   * @returns {import('../data/resources.js').ResourceDefinition|null}
   */
  getDefinition(resourceId) {
    return RESOURCES[resourceId] ?? null
  }

  /**
   * 여러 자원 동시 소비 (레시피용)
   * @param {Object.<string, number>} costs - { resourceId: amount } 형식
   * @returns {boolean} 모든 자원을 소비했는지 여부
   */
  consumeMultiple(costs) {
    // 먼저 모든 자원이 충분한지 확인
    for (const [resourceId, amount] of Object.entries(costs)) {
      if (!this.has(resourceId, amount)) {
        return false
      }
    }

    // 모두 충분하면 소비
    for (const [resourceId, amount] of Object.entries(costs)) {
      this.consume(resourceId, amount)
    }

    return true
  }

  /**
   * 여러 자원 동시 추가 (생산 보상용)
   * @param {Object.<string, number>} rewards - { resourceId: amount } 형식
   * @returns {Object.<string, number>} 실제로 추가된 양
   */
  addMultiple(rewards) {
    const actualAdded = {}

    for (const [resourceId, amount] of Object.entries(rewards)) {
      actualAdded[resourceId] = this.add(resourceId, amount)
    }

    return actualAdded
  }

  /**
   * 자원 용량 업그레이드 (향후 구현 예정)
   * @param {string} resourceId - 자원 ID
   * @param {number} additionalCapacity - 추가 용량
   */
  upgradeCapacity(resourceId, additionalCapacity) {
    // TODO: 창고 용량 업그레이드 시스템 구현
    // RESOURCES는 상수이므로, 동적 용량은 별도 상태로 관리 필요
    console.warn(
      `[ResourceSystem] upgradeCapacity not implemented yet: ${resourceId} +${additionalCapacity}`
    )
  }

  /**
   * 디버깅: 모든 자원 출력
   */
  debugPrintAll() {
    const resources = useGameStore.getState().resources
    console.log('=== Current Resources ===')
    for (const [id, amount] of Object.entries(resources)) {
      const resource = RESOURCES[id]
      const max = this.getMaxValue(id)
      const maxStr = max === Infinity ? '∞' : max
      console.log(`${resource?.icon ?? '?'} ${id}: ${amount} / ${maxStr}`)
    }
  }

  /**
   * 디버깅: 특정 자원 상세 정보
   * @param {string} resourceId - 자원 ID
   */
  debugInfo(resourceId) {
    const resource = RESOURCES[resourceId]
    if (!resource) {
      console.error(`[ResourceSystem] Unknown resource: ${resourceId}`)
      return
    }

    const current = this.get(resourceId)
    const max = this.getMaxValue(resourceId)

    console.log(`=== ${resource.icon} ${resourceId} ===`)
    console.log(`Current: ${current}`)
    console.log(`Max: ${max === Infinity ? '∞' : max}`)
    console.log(`Category: ${resource.category}`)
    console.log(`Can Trade: ${resource.canTrade}`)
    if (resource.canTrade) {
      console.log(`Base Price: $${resource.basePrice}`)
    }
    console.log(`Tags: ${resource.tags?.join(', ') ?? 'none'}`)
  }
}

// === 싱글톤 인스턴스 ===

/**
 * 전역 싱글톤 인스턴스
 * @type {ResourceSystem}
 */
export const resourceSystem = new ResourceSystem()

// === 편의 함수 (옵션) ===

/**
 * 자원 추가 단축 함수
 * @param {string} resourceId - 자원 ID
 * @param {number} amount - 추가할 양
 * @returns {number} 실제로 추가된 양
 */
export function addResource(resourceId, amount) {
  return resourceSystem.add(resourceId, amount)
}

/**
 * 자원 소비 단축 함수
 * @param {string} resourceId - 자원 ID
 * @param {number} amount - 소비할 양
 * @returns {boolean} 소비 성공 여부
 */
export function consumeResource(resourceId, amount) {
  return resourceSystem.consume(resourceId, amount)
}

/**
 * 자원 보유 확인 단축 함수
 * @param {string} resourceId - 자원 ID
 * @param {number} amount - 필요한 양
 * @returns {boolean} 충분한지 여부
 */
export function hasResource(resourceId, amount) {
  return resourceSystem.has(resourceId, amount)
}

/**
 * 자원 조회 단축 함수
 * @param {string} resourceId - 자원 ID
 * @returns {number} 현재 보유량
 */
export function getResource(resourceId) {
  return resourceSystem.get(resourceId)
}
