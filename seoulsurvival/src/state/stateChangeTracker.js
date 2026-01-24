/**
 * Seoul Survival - State Change Tracker
 *
 * 게임 상태 변경 감지 시스템
 * - 변경된 속성만 추적하여 UI 업데이트 최적화
 * - 50ms마다 전체 UI 업데이트 → 변경된 부분만 업데이트
 */

// 변경된 속성들을 추적하는 Set
const _changedProps = new Set()

/**
 * 속성이 변경되었음을 표시
 * @param {string} prop - 변경된 속성 이름
 */
export function markChanged(prop) {
  _changedProps.add(prop)
}

/**
 * 변경된 속성 목록을 가져오고 초기화
 * @returns {string[]} 변경된 속성 이름 배열
 */
export function getChangedProps() {
  const result = [..._changedProps]
  _changedProps.clear()
  return result
}

/**
 * 변경 사항이 있는지 확인
 * @returns {boolean} 변경 사항 존재 여부
 */
export function hasChanges() {
  return _changedProps.size > 0
}

/**
 * 프록시 래퍼: 상태 객체를 래핑하여 자동으로 변경 추적
 *
 * 사용 예시:
 * const trackedState = createTrackedState(gameState)
 * trackedState.cash = 1000  // 자동으로 markChanged('cash') 호출됨
 *
 * @param {Object} state - 추적할 상태 객체
 * @returns {Proxy} 변경 추적이 적용된 프록시 객체
 */
export function createTrackedState(state) {
  return new Proxy(state, {
    set(target, prop, value) {
      // 값이 실제로 변경된 경우에만 추적
      if (target[prop] !== value) {
        markChanged(prop)
      }
      target[prop] = value
      return true
    },
  })
}

/**
 * 여러 속성을 한 번에 변경 표시
 * @param {string[]} props - 변경된 속성 이름 배열
 */
export function markMultipleChanged(props) {
  for (const prop of props) {
    _changedProps.add(prop)
  }
}

/**
 * 특정 속성의 변경 추적 제거
 * @param {string} prop - 제거할 속성 이름
 */
export function unmarkChanged(prop) {
  _changedProps.delete(prop)
}

/**
 * 모든 변경 추적 초기화 (getChangedProps와 달리 반환하지 않음)
 */
export function clearChanges() {
  _changedProps.clear()
}
