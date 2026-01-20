/**
 * Seoul Survival - Error Boundary Tests
 *
 * 에러 바운더리 시스템 단위 테스트
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { wrapFunction, setupErrorBoundary, logError } from '../errorBoundary.js'

// Mock dependencies
vi.mock('../../monitoring/sentry.js', () => ({
  captureError: vi.fn(),
}))

vi.mock('../../ui/modal.js', () => ({
  openConfirmModal: vi.fn(),
}))

vi.mock('../../ui/toast.js', () => ({
  toastWarning: vi.fn(),
}))

import { captureError } from '../../monitoring/sentry.js'
import * as Modal from '../../ui/modal.js'
import { toastWarning } from '../../ui/toast.js'

describe('errorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // window.t 초기화
    delete window.t
  })

  describe('wrapFunction', () => {
    it('정상 실행 시 결과 반환', () => {
      const fn = vi.fn(() => 42)
      const wrapped = wrapFunction(fn, 'TestContext')

      const result = wrapped()

      expect(result).toBe(42)
      expect(fn).toHaveBeenCalled()
    })

    it('인자가 올바르게 전달됨', () => {
      const fn = vi.fn((a, b) => a + b)
      const wrapped = wrapFunction(fn, 'TestContext')

      const result = wrapped(1, 2)

      expect(result).toBe(3)
      expect(fn).toHaveBeenCalledWith(1, 2)
    })

    it('동기 에러 발생 시 handleGameError 호출', () => {
      const error = new Error('테스트 에러')
      const fn = vi.fn(() => {
        throw error
      })
      const wrapped = wrapFunction(fn, 'TestContext')

      expect(() => wrapped()).toThrow('테스트 에러')
      expect(captureError).toHaveBeenCalledWith(
        error,
        expect.objectContaining({
          tags: { context: 'TestContext' },
          level: 'error',
        })
      )
    })

    it('showModal=true일 때 모달 표시', () => {
      const error = new Error('테스트 에러')
      const fn = vi.fn(() => {
        throw error
      })
      const wrapped = wrapFunction(fn, 'TestContext', true)

      try {
        wrapped()
      } catch {
        // 에러 무시
      }

      expect(Modal.openConfirmModal).toHaveBeenCalled()
    })

    it('showModal=false일 때 모달 표시 안함', () => {
      const error = new Error('테스트 에러')
      const fn = vi.fn(() => {
        throw error
      })
      const wrapped = wrapFunction(fn, 'TestContext', false)

      try {
        wrapped()
      } catch {
        // 에러 무시
      }

      expect(Modal.openConfirmModal).not.toHaveBeenCalled()
    })

    it('Promise 반환 시 catch 추가', async () => {
      const fn = vi.fn(() => Promise.resolve(42))
      const wrapped = wrapFunction(fn, 'TestContext')

      const result = await wrapped()

      expect(result).toBe(42)
    })

    it('Promise 거부 시 에러 처리', async () => {
      const error = new Error('비동기 에러')
      const fn = vi.fn(() => Promise.reject(error))
      const wrapped = wrapFunction(fn, 'TestContext')

      await expect(wrapped()).rejects.toThrow('비동기 에러')
      expect(captureError).toHaveBeenCalledWith(
        error,
        expect.objectContaining({
          tags: { context: 'TestContext' },
        })
      )
    })

    it('this 컨텍스트 유지', () => {
      const obj = {
        value: 10,
        fn: function () {
          return this.value
        },
      }
      obj.fn = wrapFunction(obj.fn, 'TestContext')

      const result = obj.fn()

      expect(result).toBe(10)
    })
  })

  describe('setupErrorBoundary', () => {
    let originalAddEventListener
    let eventHandlers

    beforeEach(() => {
      eventHandlers = {}
      originalAddEventListener = window.addEventListener
      window.addEventListener = vi.fn((event, handler) => {
        eventHandlers[event] = handler
      })

      // 콘솔 로그 모킹
      vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.spyOn(console, 'error').mockImplementation(() => {})

      // window 함수들 초기화
      delete window.saveGame
      delete window.cloudSave
    })

    afterEach(() => {
      window.addEventListener = originalAddEventListener
      vi.restoreAllMocks()
    })

    it('전역 error 이벤트 핸들러 등록', () => {
      setupErrorBoundary()

      expect(window.addEventListener).toHaveBeenCalledWith('error', expect.any(Function))
    })

    it('전역 unhandledrejection 이벤트 핸들러 등록', () => {
      setupErrorBoundary()

      expect(window.addEventListener).toHaveBeenCalledWith(
        'unhandledrejection',
        expect.any(Function)
      )
    })

    it('설정 완료 로그 출력', () => {
      setupErrorBoundary()

      expect(console.log).toHaveBeenCalledWith('✅ 에러 바운더리 설정 완료')
    })

    it('전역 error 핸들러가 captureError 호출', () => {
      setupErrorBoundary()

      const errorEvent = {
        preventDefault: vi.fn(),
        error: new Error('전역 에러'),
        message: '전역 에러',
        filename: 'test.js',
        lineno: 10,
        colno: 5,
      }
      eventHandlers.error(errorEvent)

      expect(errorEvent.preventDefault).toHaveBeenCalled()
      expect(captureError).toHaveBeenCalledWith(
        errorEvent.error,
        expect.objectContaining({
          tags: { context: 'Global Error' },
          level: 'error',
        })
      )
    })

    it('전역 error 핸들러 - error가 없으면 message로 Error 생성', () => {
      setupErrorBoundary()

      const errorEvent = {
        preventDefault: vi.fn(),
        error: null,
        message: '에러 메시지',
        filename: 'test.js',
        lineno: 10,
        colno: 5,
      }
      eventHandlers.error(errorEvent)

      expect(captureError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object))
    })

    it('unhandledrejection 핸들러가 captureError 호출', () => {
      setupErrorBoundary()

      const rejectionEvent = {
        preventDefault: vi.fn(),
        reason: new Error('Promise 거부'),
        promise: Promise.reject(new Error('test')).catch(() => {}),
      }
      eventHandlers.unhandledrejection(rejectionEvent)

      expect(rejectionEvent.preventDefault).toHaveBeenCalled()
      expect(captureError).toHaveBeenCalledWith(
        rejectionEvent.reason,
        expect.objectContaining({
          tags: { context: 'Promise Rejection' },
          level: 'error',
        })
      )
    })

    it('unhandledrejection - reason이 없으면 기본 Error 생성', () => {
      setupErrorBoundary()

      const rejectionEvent = {
        preventDefault: vi.fn(),
        reason: null,
        promise: Promise.resolve(),
      }
      eventHandlers.unhandledrejection(rejectionEvent)

      expect(captureError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object))
    })

    it('saveGame 함수 래핑', () => {
      const originalSaveGame = vi.fn()
      window.saveGame = originalSaveGame

      setupErrorBoundary()

      window.saveGame()
      expect(originalSaveGame).toHaveBeenCalled()
    })

    it('saveGame 에러 시 토스트 표시', () => {
      window.saveGame = vi.fn(() => {
        throw new Error('저장 실패')
      })

      setupErrorBoundary()
      window.saveGame()

      expect(toastWarning).toHaveBeenCalled()
      expect(captureError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          tags: { context: 'Save Game' },
          level: 'warning',
        })
      )
    })

    it('cloudSave 함수 래핑', () => {
      const originalCloudSave = vi.fn(() => Promise.resolve())
      window.cloudSave = originalCloudSave

      setupErrorBoundary()

      window.cloudSave()
      expect(originalCloudSave).toHaveBeenCalled()
    })

    it('cloudSave 동기 에러 시 토스트 표시', () => {
      window.cloudSave = vi.fn(() => {
        throw new Error('클라우드 저장 실패')
      })

      setupErrorBoundary()
      window.cloudSave()

      expect(toastWarning).toHaveBeenCalled()
    })

    it('cloudSave Promise 거부 시 토스트 표시', async () => {
      window.cloudSave = vi.fn(() => Promise.reject(new Error('비동기 실패')))

      setupErrorBoundary()
      await window.cloudSave()

      expect(toastWarning).toHaveBeenCalled()
    })

    it('saveGame/cloudSave 없으면 래핑 스킵', () => {
      delete window.saveGame
      delete window.cloudSave

      expect(() => setupErrorBoundary()).not.toThrow()
    })
  })

  describe('logError', () => {
    it('에러 메시지로 Error 생성하고 captureError 호출', () => {
      logError('테스트 에러 메시지')

      expect(captureError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          tags: {},
          level: 'info',
          extra: {},
        })
      )
    })

    it('context 옵션 전달', () => {
      logError('에러', {
        tags: { module: 'test' },
        level: 'warning',
        extra: { data: 123 },
      })

      expect(captureError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          tags: { module: 'test' },
          level: 'warning',
          extra: { data: 123 },
        })
      )
    })

    it('context가 빈 객체면 기본값 사용', () => {
      logError('에러', {})

      expect(captureError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          tags: {},
          level: 'info',
          extra: {},
        })
      )
    })
  })

  describe('t() 폴백 함수', () => {
    it('window.t가 있으면 호출', () => {
      window.t = vi.fn(key => `번역: ${key}`)

      // handleGameError 트리거를 위해 wrapFunction 사용
      const fn = vi.fn(() => {
        throw new Error('에러')
      })
      const wrapped = wrapFunction(fn, 'Test', true)

      try {
        wrapped()
      } catch {
        // 무시
      }

      expect(window.t).toHaveBeenCalled()
    })
  })
})
