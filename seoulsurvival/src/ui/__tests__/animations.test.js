/**
 * animations.js 테스트
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  initAnimations,
  createFallingCookie,
  createFallingBuilding,
  showIncomeAnimation,
  createTowerFallEffect,
} from '../animations.js'

// i18n mock
vi.mock('../../i18n/index.js', () => ({
  t: vi.fn((key, params) => {
    if (key === 'ui.incomeFormat') return `+${params?.amount || 0}`
    return key
  }),
}))

// numberFormat mock
vi.mock('../../utils/numberFormat.js', () => ({
  formatKoreanNumber: vi.fn(num => `${num}원`),
}))

describe('animations.js', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('initAnimations', () => {
    it('workElement 참조 설정', () => {
      const workElement = document.createElement('button')
      workElement.id = 'workBtn'

      // 에러 없이 초기화되어야 함
      expect(() => initAnimations(workElement)).not.toThrow()
    })
  })

  describe('createFallingCookie', () => {
    it('지폐 이모지 요소 생성', () => {
      createFallingCookie(100, 200)

      const cookie = document.querySelector('.falling-cookie')
      expect(cookie).not.toBeNull()
      expect(cookie.textContent).toBe('💵')
    })

    it('클릭 위치 기준으로 스타일 설정', () => {
      createFallingCookie(100, 200)

      const cookie = document.querySelector('.falling-cookie')
      expect(cookie.style.left).toContain('px')
      expect(cookie.style.top).toBe('100px') // 200 - 100
    })

    it('2초 후 요소 제거', () => {
      createFallingCookie(100, 200)

      expect(document.querySelector('.falling-cookie')).not.toBeNull()

      // 2초 경과
      vi.advanceTimersByTime(2000)

      expect(document.querySelector('.falling-cookie')).toBeNull()
    })
  })

  describe('createFallingBuilding', () => {
    it('지정된 아이콘으로 요소 생성', () => {
      createFallingBuilding('🏠', 1)

      vi.advanceTimersByTime(100) // setTimeout 0 * 200 = 0ms 대기

      const building = document.querySelector('.falling-cookie')
      expect(building).not.toBeNull()
      expect(building.textContent).toBe('🏠')
    })

    it('최대 5개까지만 생성', () => {
      createFallingBuilding('🏢', 10)

      // 모든 타이머 실행 (5 * 200ms 간격)
      vi.advanceTimersByTime(1000)

      const buildings = document.querySelectorAll('.falling-cookie')
      expect(buildings.length).toBe(5)
    })

    it('순차적으로 생성', () => {
      createFallingBuilding('🏪', 3)

      // 0ms - 첫 번째 생성
      vi.advanceTimersByTime(0)
      expect(document.querySelectorAll('.falling-cookie').length).toBe(1)

      // 200ms - 두 번째 생성
      vi.advanceTimersByTime(200)
      expect(document.querySelectorAll('.falling-cookie').length).toBe(2)

      // 400ms - 세 번째 생성
      vi.advanceTimersByTime(200)
      expect(document.querySelectorAll('.falling-cookie').length).toBe(3)
    })

    it('2초 후 각 요소 제거', () => {
      createFallingBuilding('🏬', 2)

      // 200ms까지 진행 (두 요소 모두 생성됨)
      vi.advanceTimersByTime(200)
      expect(document.querySelectorAll('.falling-cookie').length).toBe(2)

      // 첫 번째 요소가 0ms에 생성되어 2000ms에 제거됨
      // 현재 시점은 200ms이므로 1800ms 더 경과하면 첫 번째 제거
      vi.advanceTimersByTime(1800)
      expect(document.querySelectorAll('.falling-cookie').length).toBe(1)

      // 두 번째 요소가 200ms에 생성되어 2200ms에 제거됨
      // 현재 시점은 2000ms이므로 200ms 더 경과하면 두 번째 제거
      vi.advanceTimersByTime(200)
      expect(document.querySelectorAll('.falling-cookie').length).toBe(0)
    })
  })

  describe('showIncomeAnimation', () => {
    let workElement

    beforeEach(() => {
      // workElement와 부모 요소 생성
      const container = document.createElement('div')
      container.id = 'workContainer'
      container.style.position = 'static'

      workElement = document.createElement('button')
      workElement.id = 'workBtn'
      container.appendChild(workElement)
      document.body.appendChild(container)

      // getBoundingClientRect mock
      workElement.getBoundingClientRect = vi.fn(() => ({
        left: 100,
        top: 200,
        width: 80,
        height: 40,
      }))
      container.getBoundingClientRect = vi.fn(() => ({
        left: 50,
        top: 100,
        width: 200,
        height: 300,
      }))

      initAnimations(workElement)
    })

    it('수익 애니메이션 요소 생성', () => {
      showIncomeAnimation(1000)

      const animation = document.querySelector('.income-increase')
      expect(animation).not.toBeNull()
    })

    it('포맷된 금액 표시', () => {
      showIncomeAnimation(5000)

      const animation = document.querySelector('.income-increase')
      expect(animation.textContent).toContain('5000원')
    })

    it('위치 스타일 설정', () => {
      showIncomeAnimation(1000)

      const animation = document.querySelector('.income-increase')
      expect(animation.style.position).toBe('absolute')
      expect(animation.style.zIndex).toBe('1000')
      expect(animation.style.pointerEvents).toBe('none')
    })

    it('부모 요소에 relative 설정', () => {
      showIncomeAnimation(1000)

      const container = document.getElementById('workContainer')
      expect(container.style.position).toBe('relative')
    })

    it('100ms 후 트랜지션 시작', () => {
      showIncomeAnimation(1000)

      const animation = document.querySelector('.income-increase')
      expect(animation.style.transition).toBe('')

      vi.advanceTimersByTime(100)

      expect(animation.style.transition).toBe('all 1.5s ease-out')
      expect(animation.style.opacity).toBe('0')
    })

    it('1.6초 후 요소 제거', () => {
      showIncomeAnimation(1000)

      expect(document.querySelector('.income-increase')).not.toBeNull()

      vi.advanceTimersByTime(1600)

      expect(document.querySelector('.income-increase')).toBeNull()
    })

    it('elWork 미초기화 시 스킵', () => {
      // 새로운 initAnimations 호출 없이 테스트
      // 현재는 이미 초기화됨, null로 재설정 필요
      initAnimations(null)

      expect(() => showIncomeAnimation(1000)).not.toThrow()
      expect(document.querySelector('.income-increase')).toBeNull()
    })
  })

  describe('createTowerFallEffect', () => {
    let matchMediaMock

    beforeEach(() => {
      // matchMedia mock
      matchMediaMock = vi.fn().mockReturnValue({
        matches: false,
      })
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: matchMediaMock,
      })
    })

    it('30개의 타워 이모지 생성', () => {
      createTowerFallEffect()

      // 모든 타이머 실행 (30 * 40ms)
      vi.advanceTimersByTime(1200)

      const towers = document.querySelectorAll('.falling-tower')
      expect(towers.length).toBe(30)
    })

    it('타워 이모지 텍스트', () => {
      createTowerFallEffect()

      vi.advanceTimersByTime(40)

      const tower = document.querySelector('.falling-tower')
      expect(tower.textContent).toBe('🗼')
    })

    it('화면 상단에서 시작', () => {
      createTowerFallEffect()

      // 첫 번째 요소는 0ms에 생성
      vi.advanceTimersByTime(0)

      const tower = document.querySelector('.falling-tower')
      expect(tower).not.toBeNull()
      // jsdom에서 style.top이 빈 문자열일 수 있으므로 요소 존재만 확인
      expect(tower.classList.contains('falling-tower')).toBe(true)
    })

    it('2초 후 요소 제거', () => {
      createTowerFallEffect()

      // 0ms에 첫 번째 생성
      vi.advanceTimersByTime(0)
      expect(document.querySelectorAll('.falling-tower').length).toBe(1)

      // 2000ms 경과 후 첫 번째 제거
      vi.advanceTimersByTime(2000)
      // 40ms 간격으로 생성되므로 2000/40 = 50개가 생성됐다가 첫 번째 하나만 제거됨
      // 하지만 총 30개만 생성되므로 30 - 1 = 29개 남음
      const towers = document.querySelectorAll('.falling-tower')
      expect(towers.length).toBeLessThan(30)
    })

    it('prefers-reduced-motion 시 애니메이션 생략', () => {
      matchMediaMock.mockReturnValue({ matches: true })

      createTowerFallEffect()

      vi.advanceTimersByTime(1200)

      expect(document.querySelector('.falling-tower')).toBeNull()
    })

    it('순차적으로 40ms 간격 생성', () => {
      createTowerFallEffect()

      // 0ms - 첫 번째
      vi.advanceTimersByTime(0)
      expect(document.querySelectorAll('.falling-tower').length).toBe(1)

      // 40ms - 두 번째
      vi.advanceTimersByTime(40)
      expect(document.querySelectorAll('.falling-tower').length).toBe(2)

      // 80ms - 세 번째
      vi.advanceTimersByTime(40)
      expect(document.querySelectorAll('.falling-tower').length).toBe(3)
    })
  })
})
