/**
 * KIMCHI INVASION - ID Generator Utilities
 *
 * @description 고유 ID 생성 유틸리티
 * @module utils/idGenerator
 */

/**
 * 고유 ID 생성 (범용)
 * @param {string} [prefix='entity'] - ID 접두사
 * @returns {string} 고유 ID
 */
export function generateId(prefix = 'entity') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * 건물 ID 생성
 * @returns {string} 고유 건물 ID
 */
export function generateBuildingId() {
  return generateId('building')
}

/**
 * 컨베이어 ID 생성
 * @returns {string} 고유 컨베이어 ID
 */
export function generateConveyorId() {
  return generateId('conveyor')
}

/**
 * 아이템 ID 생성
 * @returns {string} 고유 아이템 ID
 */
export function generateItemId() {
  return generateId('item')
}

/**
 * 엔티티 ID 생성
 * @returns {string} 고유 엔티티 ID
 */
export function generateEntityId() {
  return generateId('entity')
}
