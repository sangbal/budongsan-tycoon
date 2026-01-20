/**
 * ECS-Lite World 클래스
 * 엔티티와 시스템을 관리하고 게임 루프를 오케스트레이션
 *
 * @module ecs/World
 */

/**
 * World 클래스
 * 모든 엔티티와 시스템을 관리하는 중앙 관리자
 */
export class World {
  constructor() {
    /**
     * @type {Map<number, import('./Entity.js').Entity>}
     * 엔티티 ID를 키로 하는 엔티티 맵
     */
    this.entities = new Map()

    /**
     * @type {import('./System.js').System[]}
     * 우선순위 순으로 정렬된 시스템 배열
     */
    this.systems = []
  }

  /**
   * 엔티티 추가
   * @param {import('./Entity.js').Entity} entity
   * @returns {World} 메서드 체이닝용
   */
  addEntity(entity) {
    this.entities.set(entity.id, entity)
    return this
  }

  /**
   * 엔티티 제거
   * @param {number} id - 엔티티 ID
   * @returns {boolean} 제거 성공 여부
   */
  removeEntity(id) {
    return this.entities.delete(id)
  }

  /**
   * ID로 엔티티 가져오기
   * @param {number} id - 엔티티 ID
   * @returns {import('./Entity.js').Entity|undefined}
   */
  getEntity(id) {
    return this.entities.get(id)
  }

  /**
   * 타입으로 엔티티 필터링
   * @param {string} type - 엔티티 타입
   * @returns {import('./Entity.js').Entity[]}
   */
  getEntitiesByType(type) {
    return [...this.entities.values()].filter(e => e.type === type)
  }

  /**
   * 모든 엔티티 가져오기
   * @returns {import('./Entity.js').Entity[]}
   */
  getAllEntities() {
    return [...this.entities.values()]
  }

  /**
   * 시스템 추가
   * 우선순위에 따라 자동 정렬됨
   * @param {import('./System.js').System} system
   * @returns {World} 메서드 체이닝용
   */
  addSystem(system) {
    this.systems.push(system)
    // 우선순위 순으로 정렬 (낮은 숫자 = 높은 우선순위)
    this.systems.sort((a, b) => a.priority - b.priority)

    // 시스템 초기화
    if (typeof system.init === 'function') {
      system.init()
    }

    return this
  }

  /**
   * 시스템 제거
   * @param {import('./System.js').System} system
   * @returns {boolean} 제거 성공 여부
   */
  removeSystem(system) {
    const index = this.systems.indexOf(system)
    if (index !== -1) {
      // 시스템 정리
      if (typeof system.cleanup === 'function') {
        system.cleanup()
      }

      this.systems.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * 모든 시스템 업데이트
   * 우선순위 순으로 시스템을 실행하고, 각 시스템에 매칭되는 엔티티만 전달
   * @param {number} deltaTime - 이전 프레임으로부터의 경과 시간 (초 단위)
   */
  update(deltaTime) {
    for (const system of this.systems) {
      // 활성 상태이며 시스템의 요구사항을 만족하는 엔티티만 필터링
      const matchingEntities = [...this.entities.values()].filter(
        e => e.active && system.matches(e)
      )

      // 시스템 업데이트 실행
      system.update(matchingEntities, deltaTime)
    }
  }

  /**
   * 모든 엔티티와 시스템 제거
   */
  clear() {
    // 모든 시스템 정리
    for (const system of this.systems) {
      if (typeof system.cleanup === 'function') {
        system.cleanup()
      }
    }

    this.systems = []
    this.entities.clear()
  }
}
