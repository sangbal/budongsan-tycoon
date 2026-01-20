/**
 * Seoul Survival - Toast Notification System Tests
 *
 * 토스트 알림 시스템 단위 테스트
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createToast,
  clearAllToasts,
  toastError,
  toastSuccess,
  toastInfo,
  toastWarning,
  testToasts,
} from '../toast.js'

describe('Toast Notification System', () => {
  let originalRAF

  beforeEach(() => {
    // DOM 초기화
    document.body.innerHTML = ''

    // console 모킹
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    // requestAnimationFrame 모킹 (jsdom에 없으므로 직접 정의)
    originalRAF = window.requestAnimationFrame
    window.requestAnimationFrame = vi.fn(cb => {
      cb()
      return 0
    })
  })

  afterEach(() => {
    clearAllToasts()
    vi.restoreAllMocks()
    vi.useRealTimers()
    // requestAnimationFrame 복원
    if (originalRAF) {
      window.requestAnimationFrame = originalRAF
    }
  })

  describe('createToast', () => {
    it('기본 info 토스트 생성', () => {
      const toast = createToast('테스트 메시지')

      expect(toast).not.toBeNull()
      expect(toast.classList.contains('game-toast')).toBe(true)
      expect(toast.classList.contains('toast-info')).toBe(true)
      expect(toast.textContent).toContain('테스트 메시지')
    })

    it('error 타입 토스트 생성', () => {
      const toast = createToast('에러 메시지', 'error')

      expect(toast.classList.contains('toast-error')).toBe(true)
      expect(toast.getAttribute('aria-live')).toBe('assertive')
    })

    it('success 타입 토스트 생성', () => {
      const toast = createToast('성공 메시지', 'success')

      expect(toast.classList.contains('toast-success')).toBe(true)
      expect(toast.getAttribute('aria-live')).toBe('polite')
    })

    it('warning 타입 토스트 생성', () => {
      const toast = createToast('경고 메시지', 'warning')

      expect(toast.classList.contains('toast-warning')).toBe(true)
    })

    it('잘못된 타입은 info로 대체', () => {
      const toast = createToast('메시지', 'invalid_type')

      expect(toast.classList.contains('toast-info')).toBe(true)
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('유효하지 않은 타입'))
    })

    it('토스트 컨테이너 자동 생성', () => {
      createToast('테스트')

      const container = document.getElementById('game-toast-container')
      expect(container).not.toBeNull()
      expect(container.classList.contains('game-toast-container')).toBe(true)
    })

    it('토스트에 role=alert 속성 설정', () => {
      const toast = createToast('테스트')

      expect(toast.getAttribute('role')).toBe('alert')
    })

    it('아이콘 요소 생성', () => {
      const toast = createToast('테스트', 'success')

      const icon = toast.querySelector('.game-toast-icon')
      expect(icon).not.toBeNull()
      expect(icon.getAttribute('aria-hidden')).toBe('true')
      expect(icon.textContent).toBe('✅')
    })

    it('메시지 요소 생성', () => {
      const toast = createToast('테스트 메시지')

      const message = toast.querySelector('.game-toast-message')
      expect(message).not.toBeNull()
      expect(message.textContent).toBe('테스트 메시지')
    })

    it('show 클래스 추가 (애니메이션)', () => {
      const toast = createToast('테스트')

      expect(toast.classList.contains('show')).toBe(true)
    })

    it('중복 토스트 방지', () => {
      const toast1 = createToast('같은 메시지', 'info')
      const toast2 = createToast('같은 메시지', 'info')

      expect(toast1).not.toBeNull()
      expect(toast2).toBeNull()
    })

    it('다른 타입은 중복 허용', () => {
      const toast1 = createToast('같은 메시지', 'info')
      const toast2 = createToast('같은 메시지', 'error')

      expect(toast1).not.toBeNull()
      expect(toast2).not.toBeNull()
    })

    it('커스텀 duration 설정', () => {
      vi.useFakeTimers()

      const toast = createToast('테스트', 'info', 1000)
      expect(toast).not.toBeNull()

      // 1000ms 후 hide 시작
      vi.advanceTimersByTime(1000)
      expect(toast.classList.contains('hide')).toBe(true)
    })

    it('로그 출력', () => {
      createToast('테스트 메시지', 'success')

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('SUCCESS'))
    })

    it('클릭 시 토스트 닫힘', () => {
      vi.useFakeTimers()

      const toast = createToast('테스트', 'info', 10000)
      expect(toast).not.toBeNull()

      // 클릭 이벤트 트리거
      toast.click()

      // 즉시 hide 클래스 추가
      expect(toast.classList.contains('hide')).toBe(true)
    })

    it('자동 숨김 타이머 동작', () => {
      vi.useFakeTimers()

      const toast = createToast('테스트', 'info', 3000)

      // 3000ms 전에는 hide 클래스 없음
      vi.advanceTimersByTime(2999)
      expect(toast.classList.contains('hide')).toBe(false)

      // 3000ms 후 hide 클래스 추가
      vi.advanceTimersByTime(1)
      expect(toast.classList.contains('hide')).toBe(true)
    })
  })

  describe('clearAllToasts', () => {
    it('모든 토스트 제거', () => {
      createToast('토스트 1')
      createToast('토스트 2')
      createToast('토스트 3')

      const container = document.getElementById('game-toast-container')
      expect(container.children.length).toBe(3)

      clearAllToasts()

      expect(container.innerHTML).toBe('')
    })

    it('컨테이너가 없어도 에러 없음', () => {
      expect(() => clearAllToasts()).not.toThrow()
    })

    it('로그 출력', () => {
      createToast('테스트')
      clearAllToasts()

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('모든 토스트 제거됨'))
    })

    it('중복 방지 목록 초기화', () => {
      createToast('메시지', 'info')

      // 중복 방지로 null 반환
      expect(createToast('메시지', 'info')).toBeNull()

      clearAllToasts()

      // 초기화 후 다시 생성 가능
      expect(createToast('메시지', 'info')).not.toBeNull()
    })
  })

  describe('편의 함수', () => {
    it('toastError는 error 타입 생성', () => {
      const toast = toastError('에러')
      expect(toast.classList.contains('toast-error')).toBe(true)
    })

    it('toastSuccess는 success 타입 생성', () => {
      const toast = toastSuccess('성공')
      expect(toast.classList.contains('toast-success')).toBe(true)
    })

    it('toastInfo는 info 타입 생성', () => {
      const toast = toastInfo('정보')
      expect(toast.classList.contains('toast-info')).toBe(true)
    })

    it('toastWarning은 warning 타입 생성', () => {
      const toast = toastWarning('경고')
      expect(toast.classList.contains('toast-warning')).toBe(true)
    })

    it('편의 함수도 커스텀 duration 지원', () => {
      vi.useFakeTimers()

      const toast = toastError('에러', 1000)

      vi.advanceTimersByTime(1000)
      expect(toast.classList.contains('hide')).toBe(true)
    })
  })

  describe('testToasts', () => {
    it('테스트 함수 실행', () => {
      vi.useFakeTimers()

      testToasts()

      // 첫 번째 토스트 즉시 생성
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('테스트 시작'))

      // 타이머 진행하여 모든 토스트 생성
      vi.advanceTimersByTime(2000)

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('테스트 완료'))
    })
  })

  describe('스타일 주입', () => {
    it('토스트 스타일 주입', () => {
      createToast('테스트')

      const styleEl = document.getElementById('toast-styles')
      expect(styleEl).not.toBeNull()
      expect(styleEl.textContent).toContain('.game-toast-container')
    })

    it('스타일 중복 주입 방지', () => {
      createToast('토스트 1')
      createToast('토스트 2')

      const styleEls = document.querySelectorAll('#toast-styles')
      expect(styleEls.length).toBe(1)
    })
  })

  describe('hideToast 내부 로직', () => {
    it('DOM에서 토스트 제거', () => {
      vi.useFakeTimers()

      const toast = createToast('테스트', 'info', 100)
      const container = document.getElementById('game-toast-container')

      expect(container.contains(toast)).toBe(true)

      // 타이머 진행하여 숨김 시작
      vi.advanceTimersByTime(100)
      expect(toast.classList.contains('hide')).toBe(true)

      // 애니메이션 완료 후 DOM에서 제거
      vi.advanceTimersByTime(300)
      expect(container.contains(toast)).toBe(false)
    })

    it('이미 제거된 토스트에 대해 안전하게 처리', () => {
      vi.useFakeTimers()

      const toast = createToast('테스트', 'info', 100)

      // 수동으로 먼저 제거
      toast.parentElement.removeChild(toast)

      // 타이머 진행해도 에러 없음
      expect(() => vi.advanceTimersByTime(500)).not.toThrow()
    })
  })
})
