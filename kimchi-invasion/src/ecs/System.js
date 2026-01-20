/**
 * ECS-Lite System 기반 클래스
 * 로직만 처리하고 데이터는 Entity가 보유
 *
 * @module ecs/System
 */

/**
 * System 기반 클래스
 * 모든 게임 시스템은 이 클래스를 상속받아야 함
 */
export class System {
  /**
   * @param {string[]} [requiredComponents=[]] - 이 시스템이 처리할 엔티티가 반드시 가져야 할 컴포넌트 목록
   */
  constructor(requiredComponents = []) {
    /**
     * @type {string[]} 필수 컴포넌트 목록
     */
    this.requiredComponents = requiredComponents

    /**
     * @type {number} 실행 우선순위 (낮을수록 먼저 실행)
     * 기본값: 0
     */
    this.priority = 0
  }

  /**
   * 매 프레임마다 실행되는 업데이트 로직
   * 서브클래스에서 반드시 구현해야 함
   *
   * @param {import('./Entity.js').Entity[]} _entities - 이 시스템의 요구사항을 만족하는 엔티티 목록
   * @param {number} _deltaTime - 이전 프레임으로부터의 경과 시간 (초 단위)
   * @throws {Error} 서브클래스에서 구현하지 않으면 에러 발생
   */
  update(_entities, _deltaTime) {
    throw new Error(`${this.constructor.name}.update() must be implemented`)
  }

  /**
   * 엔티티가 이 시스템의 요구사항을 만족하는지 확인
   * @param {import('./Entity.js').Entity} entity
   * @returns {boolean}
   */
  matches(entity) {
    return this.requiredComponents.every(comp => entity.hasComponent(comp))
  }

  /**
   * 시스템 초기화 (선택적)
   * World에 추가될 때 한 번 실행됨
   */
  init() {
    // 서브클래스에서 필요시 구현
  }

  /**
   * 시스템 정리 (선택적)
   * World에서 제거될 때 한 번 실행됨
   */
  cleanup() {
    // 서브클래스에서 필요시 구현
  }
}
