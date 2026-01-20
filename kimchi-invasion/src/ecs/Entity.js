/**
 * ECS-Lite Entity 클래스
 * 데이터만 보유하고 로직은 System에 위임
 *
 * @module ecs/Entity
 */

let entityIdCounter = 0

/**
 * 고유한 엔티티 ID 생성
 * @returns {number}
 */
function generateId() {
  return ++entityIdCounter
}

/**
 * @typedef {Object} EntityConfig
 * @property {string} type - 엔티티 타입 (예: 'building', 'resource', 'worker')
 * @property {Object} [components] - 초기 컴포넌트 데이터 (key-value)
 */

/**
 * Entity 클래스
 * 컴포넌트(데이터) 컨테이너 역할만 수행
 */
export class Entity {
  /**
   * @param {EntityConfig} config
   */
  constructor(config) {
    /** @type {number} 고유 ID */
    this.id = generateId()

    /** @type {string} 엔티티 타입 (필터링용) */
    this.type = config.type

    /** @type {Object.<string, any>} 컴포넌트 데이터 */
    this.components = { ...config.components }

    /** @type {boolean} 활성 상태 (비활성 엔티티는 시스템에서 무시됨) */
    this.active = true
  }

  /**
   * 컴포넌트 추가 또는 업데이트
   * @param {string} name - 컴포넌트 이름
   * @param {any} data - 컴포넌트 데이터
   * @returns {Entity} 메서드 체이닝용
   */
  addComponent(name, data) {
    this.components[name] = data
    return this
  }

  /**
   * 컴포넌트 제거
   * @param {string} name - 컴포넌트 이름
   * @returns {Entity} 메서드 체이닝용
   */
  removeComponent(name) {
    delete this.components[name]
    return this
  }

  /**
   * 컴포넌트 데이터 가져오기
   * @param {string} name - 컴포넌트 이름
   * @returns {any|undefined}
   */
  getComponent(name) {
    return this.components[name]
  }

  /**
   * 컴포넌트 존재 여부 확인
   * @param {string} name - 컴포넌트 이름
   * @returns {boolean}
   */
  hasComponent(name) {
    return name in this.components
  }

  /**
   * 엔티티 비활성화
   * @returns {Entity}
   */
  deactivate() {
    this.active = false
    return this
  }

  /**
   * 엔티티 활성화
   * @returns {Entity}
   */
  activate() {
    this.active = true
    return this
  }
}

/**
 * 테스트용 ID 카운터 리셋
 * @internal
 */
export function resetEntityIdCounter() {
  entityIdCounter = 0
}
