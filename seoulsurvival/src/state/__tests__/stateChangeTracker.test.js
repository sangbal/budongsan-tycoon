/**
 * Seoul Survival - State Change Tracker Tests
 *
 * 상태 변경 추적 시스템 단위 테스트
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  markChanged,
  getChangedProps,
  hasChanges,
  createTrackedState,
  markMultipleChanged,
  unmarkChanged,
  clearChanges,
} from '../stateChangeTracker.js'

describe('stateChangeTracker - 기본 변경 추적', () => {
  beforeEach(() => {
    clearChanges()
  })

  afterEach(() => {
    clearChanges()
  })

  it('초기 상태는 변경 없음', () => {
    expect(hasChanges()).toBe(false)
    expect(getChangedProps()).toEqual([])
  })

  it('markChanged로 속성 추적', () => {
    markChanged('cash')
    expect(hasChanges()).toBe(true)
  })

  it('getChangedProps로 변경 목록 가져오기', () => {
    markChanged('cash')
    markChanged('deposits')

    const changes = getChangedProps()
    expect(changes).toContain('cash')
    expect(changes).toContain('deposits')
    expect(changes.length).toBe(2)
  })

  it('getChangedProps 호출 후 초기화됨', () => {
    markChanged('cash')
    const firstCall = getChangedProps()
    expect(firstCall).toContain('cash')

    const secondCall = getChangedProps()
    expect(secondCall).toEqual([])
    expect(hasChanges()).toBe(false)
  })

  it('중복 변경은 한 번만 추적', () => {
    markChanged('cash')
    markChanged('cash')
    markChanged('cash')

    const changes = getChangedProps()
    expect(changes.filter(prop => prop === 'cash').length).toBe(1)
  })

  it('clearChanges로 변경 추적 초기화', () => {
    markChanged('cash')
    markChanged('deposits')
    expect(hasChanges()).toBe(true)

    clearChanges()
    expect(hasChanges()).toBe(false)
    expect(getChangedProps()).toEqual([])
  })
})

describe('stateChangeTracker - 여러 속성 처리', () => {
  beforeEach(() => {
    clearChanges()
  })

  afterEach(() => {
    clearChanges()
  })

  it('markMultipleChanged로 여러 속성 한 번에 추적', () => {
    markMultipleChanged(['cash', 'deposits', 'savings'])

    const changes = getChangedProps()
    expect(changes).toContain('cash')
    expect(changes).toContain('deposits')
    expect(changes).toContain('savings')
    expect(changes.length).toBe(3)
  })

  it('빈 배열 전달 시 문제 없음', () => {
    expect(() => markMultipleChanged([])).not.toThrow()
    expect(hasChanges()).toBe(false)
  })

  it('unmarkChanged로 특정 속성 제거', () => {
    markChanged('cash')
    markChanged('deposits')
    markChanged('savings')

    unmarkChanged('deposits')

    const changes = getChangedProps()
    expect(changes).toContain('cash')
    expect(changes).toContain('savings')
    expect(changes).not.toContain('deposits')
    expect(changes.length).toBe(2)
  })

  it('존재하지 않는 속성 unmark 시 문제 없음', () => {
    markChanged('cash')
    expect(() => unmarkChanged('nonexistent')).not.toThrow()

    const changes = getChangedProps()
    expect(changes).toEqual(['cash'])
  })
})

describe('stateChangeTracker - 프록시 래퍼', () => {
  beforeEach(() => {
    clearChanges()
  })

  afterEach(() => {
    clearChanges()
  })

  it('프록시로 래핑된 객체는 자동으로 변경 추적', () => {
    const state = { cash: 0, deposits: 0 }
    const trackedState = createTrackedState(state)

    trackedState.cash = 1000
    expect(hasChanges()).toBe(true)

    const changes = getChangedProps()
    expect(changes).toContain('cash')
  })

  it('같은 값으로 설정 시 변경 추적 안 됨', () => {
    const state = { cash: 1000 }
    const trackedState = createTrackedState(state)

    trackedState.cash = 1000 // 같은 값
    expect(hasChanges()).toBe(false)
  })

  it('다른 값으로 변경 시 추적됨', () => {
    const state = { cash: 1000 }
    const trackedState = createTrackedState(state)

    trackedState.cash = 2000
    expect(hasChanges()).toBe(true)

    const changes = getChangedProps()
    expect(changes).toContain('cash')
  })

  it('여러 속성 변경 시 모두 추적', () => {
    const state = { cash: 0, deposits: 0, savings: 0 }
    const trackedState = createTrackedState(state)

    trackedState.cash = 1000
    trackedState.deposits = 5
    trackedState.savings = 3

    const changes = getChangedProps()
    expect(changes).toContain('cash')
    expect(changes).toContain('deposits')
    expect(changes).toContain('savings')
    expect(changes.length).toBe(3)
  })

  it('프록시 래핑해도 원본 객체 값은 변경됨', () => {
    const state = { cash: 0 }
    const trackedState = createTrackedState(state)

    trackedState.cash = 1000
    expect(state.cash).toBe(1000)
  })

  it('중복 변경 시 한 번만 추적', () => {
    const state = { cash: 0 }
    const trackedState = createTrackedState(state)

    trackedState.cash = 1000
    trackedState.cash = 2000
    trackedState.cash = 3000

    const changes = getChangedProps()
    expect(changes.filter(prop => prop === 'cash').length).toBe(1)
  })

  it('0과 false 구분', () => {
    const state = { value: 0 }
    const trackedState = createTrackedState(state)

    trackedState.value = false
    expect(hasChanges()).toBe(true)

    const changes = getChangedProps()
    expect(changes).toContain('value')
  })

  it('undefined와 null 구분', () => {
    const state = { value: undefined }
    const trackedState = createTrackedState(state)

    trackedState.value = null
    expect(hasChanges()).toBe(true)

    const changes = getChangedProps()
    expect(changes).toContain('value')
  })

  it('객체/배열 참조 변경 추적', () => {
    const state = { items: [] }
    const trackedState = createTrackedState(state)

    const newArray = [1, 2, 3]
    trackedState.items = newArray
    expect(hasChanges()).toBe(true)

    const changes = getChangedProps()
    expect(changes).toContain('items')
  })

  it('같은 배열 참조 재할당 시 추적 안 됨', () => {
    const arr = [1, 2, 3]
    const state = { items: arr }
    const trackedState = createTrackedState(state)

    trackedState.items = arr // 같은 참조
    expect(hasChanges()).toBe(false)
  })
})

describe('stateChangeTracker - 엣지 케이스', () => {
  beforeEach(() => {
    clearChanges()
  })

  afterEach(() => {
    clearChanges()
  })

  it('빈 문자열 속성 이름 처리', () => {
    expect(() => markChanged('')).not.toThrow()
    expect(hasChanges()).toBe(true)

    const changes = getChangedProps()
    expect(changes).toContain('')
  })

  it('특수 문자 포함 속성 이름', () => {
    markChanged('prop$name')
    markChanged('prop_name')
    markChanged('prop-name')

    const changes = getChangedProps()
    expect(changes.length).toBe(3)
  })

  it('매우 많은 속성 추적', () => {
    const props = []
    for (let i = 0; i < 1000; i++) {
      props.push(`prop${i}`)
    }

    markMultipleChanged(props)
    expect(hasChanges()).toBe(true)

    const changes = getChangedProps()
    expect(changes.length).toBe(1000)
  })

  it('프록시를 중첩 래핑해도 작동', () => {
    const state = { cash: 0 }
    const tracked1 = createTrackedState(state)
    const tracked2 = createTrackedState(tracked1)

    tracked2.cash = 1000
    expect(hasChanges()).toBe(true)
  })

  it('숫자 타입 속성 이름 처리', () => {
    const state = { 0: 'value0', 1: 'value1' }
    const trackedState = createTrackedState(state)

    trackedState[0] = 'changed'
    expect(hasChanges()).toBe(true)

    const changes = getChangedProps()
    expect(changes).toContain('0')
  })
})

describe('stateChangeTracker - 실전 시나리오', () => {
  beforeEach(() => {
    clearChanges()
  })

  afterEach(() => {
    clearChanges()
  })

  it('게임 루프 시뮬레이션: 매 틱마다 변경 확인', () => {
    const state = { cash: 0, deposits: 0 }
    const trackedState = createTrackedState(state)

    // 첫 번째 틱: cash 증가
    trackedState.cash = 100
    expect(hasChanges()).toBe(true)
    const tick1Changes = getChangedProps()
    expect(tick1Changes).toEqual(['cash'])

    // 두 번째 틱: 변경 없음
    expect(hasChanges()).toBe(false)

    // 세 번째 틱: deposits 변경
    trackedState.deposits = 1
    const tick3Changes = getChangedProps()
    expect(tick3Changes).toEqual(['deposits'])
  })

  it('UI 업데이트 최적화 시나리오', () => {
    const state = {
      cash: 0,
      deposits: 0,
      savings: 0,
      bonds: 0,
    }
    const trackedState = createTrackedState(state)

    // 사용자가 예금 구매
    trackedState.cash = -1000
    trackedState.deposits = 1

    const changes = getChangedProps()
    expect(changes).toContain('cash')
    expect(changes).toContain('deposits')
    expect(changes).not.toContain('savings')
    expect(changes).not.toContain('bonds')
  })

  it('부분 업데이트와 전체 업데이트 비교', () => {
    const state = { cash: 0, deposits: 0, savings: 0 }
    const trackedState = createTrackedState(state)

    // 한 속성만 변경
    trackedState.cash = 1000

    if (hasChanges()) {
      const changes = getChangedProps()
      // 변경된 속성만 업데이트 (최적화)
      expect(changes.length).toBe(1)
    }
  })

  it('저장/로드 시 변경 추적 초기화', () => {
    markChanged('cash')
    markChanged('deposits')

    // 저장 완료 후 변경 추적 초기화
    clearChanges()

    // 로드 후 변경 없음
    expect(hasChanges()).toBe(false)
  })
})
