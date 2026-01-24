/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createInAppBrowserHandler } from '../inAppBrowserHandler.js'

describe('inAppBrowserHandler', () => {
  let handler
  const mockT = vi.fn(key => key)

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
    handler = createInAppBrowserHandler({ t: mockT })
  })

  describe('detectInAppBrowser', () => {
    it('일반 브라우저에서는 isInApp이 false', () => {
      const originalUA = navigator.userAgent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        configurable: true,
      })

      const result = handler.detectInAppBrowser()
      expect(result.isInApp).toBe(false)
      expect(result.isKakao).toBe(false)
      expect(result.isInstagram).toBe(false)

      Object.defineProperty(navigator, 'userAgent', {
        value: originalUA,
        configurable: true,
      })
    })

    it('카카오톡 인앱 브라우저 감지', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 KAKAOTALK',
        configurable: true,
      })

      const result = handler.detectInAppBrowser()
      expect(result.isInApp).toBe(true)
      expect(result.isKakao).toBe(true)
    })

    it('인스타그램 인앱 브라우저 감지', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 Instagram',
        configurable: true,
      })

      const result = handler.detectInAppBrowser()
      expect(result.isInApp).toBe(true)
      expect(result.isInstagram).toBe(true)
    })

    it('페이스북 인앱 브라우저 감지 (FBAN)', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 FBAN',
        configurable: true,
      })

      const result = handler.detectInAppBrowser()
      expect(result.isInApp).toBe(true)
      expect(result.isFacebook).toBe(true)
    })

    it('라인 인앱 브라우저 감지', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 Line',
        configurable: true,
      })

      const result = handler.detectInAppBrowser()
      expect(result.isInApp).toBe(true)
      expect(result.isLine).toBe(true)
    })

    it('위챗 인앱 브라우저 감지', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 MicroMessenger',
        configurable: true,
      })

      const result = handler.detectInAppBrowser()
      expect(result.isInApp).toBe(true)
      expect(result.isWeChat).toBe(true)
    })
  })

  describe('showWarningIfNeeded', () => {
    it('일반 브라우저에서는 배너가 표시되지 않음', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 Chrome',
        configurable: true,
      })

      handler.showWarningIfNeeded()
      expect(document.querySelector('.inapp-warning-banner')).toBeNull()
    })

    it('인앱 브라우저에서 배너가 표시됨', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 KAKAOTALK',
        configurable: true,
      })

      handler.showWarningIfNeeded()
      const banner = document.querySelector('.inapp-warning-banner')
      expect(banner).not.toBeNull()
      expect(mockT).toHaveBeenCalledWith('inapp.banner.message')
      expect(mockT).toHaveBeenCalledWith('inapp.banner.hint')
    })

    it('닫기 버튼 클릭 시 배너가 제거됨', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 KAKAOTALK',
        configurable: true,
      })

      handler.showWarningIfNeeded()
      const closeBtn = document.getElementById('closeInappWarningBtn')
      expect(closeBtn).not.toBeNull()

      closeBtn.click()
      expect(document.querySelector('.inapp-warning-banner')).toBeNull()
    })

    it('복사 버튼 클릭 시 clipboard API 사용', async () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 KAKAOTALK',
        configurable: true,
      })

      // clipboard API mock
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      })

      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

      handler.showWarningIfNeeded()
      const copyBtn = document.getElementById('copyGameUrlBtn')
      expect(copyBtn).not.toBeNull()

      await copyBtn.click()

      await vi.waitFor(() => {
        expect(writeTextMock).toHaveBeenCalledWith('https://clicksurvivor.com/seoulsurvival/')
      })

      alertMock.mockRestore()
    })

    it('clipboard API 없을 때 execCommand fallback 사용', async () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 KAKAOTALK',
        configurable: true,
      })

      // clipboard API 제거
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      // document.execCommand mock (jsdom에는 없음)
      document.execCommand = vi.fn().mockReturnValue(true)
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

      handler.showWarningIfNeeded()
      const copyBtn = document.getElementById('copyGameUrlBtn')
      await copyBtn.click()

      expect(document.execCommand).toHaveBeenCalledWith('copy')

      delete document.execCommand
      alertMock.mockRestore()
    })

    it('execCommand 실패 시 fallback 메시지 표시', async () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 KAKAOTALK',
        configurable: true,
      })

      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      // document.execCommand mock - 실패 반환
      document.execCommand = vi.fn().mockReturnValue(false)
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

      handler.showWarningIfNeeded()
      const copyBtn = document.getElementById('copyGameUrlBtn')
      await copyBtn.click()

      expect(mockT).toHaveBeenCalledWith('inapp.copyFallback', expect.any(Object))

      delete document.execCommand
      alertMock.mockRestore()
    })

    it('clipboard API 에러 시 fallback 메시지 표시', async () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 KAKAOTALK',
        configurable: true,
      })

      // clipboard API 에러 발생
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'))
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      })

      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

      handler.showWarningIfNeeded()
      const copyBtn = document.getElementById('copyGameUrlBtn')
      await copyBtn.click()

      await vi.waitFor(() => {
        expect(mockT).toHaveBeenCalledWith('inapp.copyFallback', expect.any(Object))
      })

      alertMock.mockRestore()
    })
  })
})
