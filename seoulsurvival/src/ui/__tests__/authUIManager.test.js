/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAuthUIManager } from '../authUIManager.js'

describe('authUIManager', () => {
  let authUIManager
  let mockDeps

  beforeEach(() => {
    vi.clearAllMocks()

    // DOM 초기화
    document.body.innerHTML = `
      <div id="authProviderButtons" style="display: flex;"></div>
      <div id="logoutButtonContainer" hidden></div>
      <div id="cloudSaveSection" style="display: none;"></div>
      <span id="authStatusLabel">Guest Mode</span>
      <button data-auth-provider="google">Google Login</button>
      <button id="logoutBtn">Logout</button>
    `

    mockDeps = {
      getUser: vi.fn().mockResolvedValue(null),
      onAuthStateChange: vi.fn(),
      signInGoogle: vi.fn().mockResolvedValue({ ok: true }),
      signOut: vi.fn().mockResolvedValue({ ok: true }),
      t: vi.fn(key => key),
      toastSuccess: vi.fn(),
      toastError: vi.fn(),
    }

    authUIManager = createAuthUIManager(mockDeps)
  })

  describe('updateAuthButtons', () => {
    it('로그아웃 상태에서 로그인 버튼 표시', () => {
      authUIManager.updateAuthButtons(null)

      expect(document.getElementById('authProviderButtons').style.display).toBe('flex')
      expect(document.getElementById('logoutButtonContainer').hidden).toBe(true)
      expect(document.getElementById('cloudSaveSection').style.display).toBe('none')
    })

    it('로그인 상태에서 로그아웃 버튼 표시', () => {
      authUIManager.updateAuthButtons({ id: 'user-123' })

      expect(document.getElementById('authProviderButtons').style.display).toBe('none')
      expect(document.getElementById('logoutButtonContainer').hidden).toBe(false)
      expect(document.getElementById('cloudSaveSection').style.display).toBe('block')
    })
  })

  describe('initAuthUI', () => {
    it('초기 인증 상태 확인', async () => {
      mockDeps.getUser.mockResolvedValue({ id: 'user-123' })

      authUIManager.initAuthUI()

      await vi.waitFor(() => {
        expect(mockDeps.getUser).toHaveBeenCalled()
      })
    })

    it('인증 상태 변경 리스너 등록', () => {
      authUIManager.initAuthUI()

      expect(mockDeps.onAuthStateChange).toHaveBeenCalledWith(expect.any(Function))
    })

    it('Google 로그인 버튼 클릭 이벤트', async () => {
      authUIManager.initAuthUI()

      const googleBtn = document.querySelector('[data-auth-provider="google"]')
      googleBtn.click()

      await vi.waitFor(() => {
        expect(mockDeps.signInGoogle).toHaveBeenCalled()
      })
    })

    it('로그인 실패 시 에러 토스트 표시', async () => {
      mockDeps.signInGoogle.mockResolvedValue({ ok: false })
      authUIManager.initAuthUI()

      const googleBtn = document.querySelector('[data-auth-provider="google"]')
      googleBtn.click()

      await vi.waitFor(() => {
        expect(mockDeps.toastError).toHaveBeenCalledWith('error.loginFailed')
      })
    })

    it('로그아웃 버튼 클릭 이벤트', async () => {
      authUIManager.initAuthUI()

      const logoutBtn = document.getElementById('logoutBtn')
      logoutBtn.click()

      await vi.waitFor(() => {
        expect(mockDeps.signOut).toHaveBeenCalled()
      })
    })

    it('로그아웃 성공 시 토스트 표시', async () => {
      authUIManager.initAuthUI()

      const logoutBtn = document.getElementById('logoutBtn')
      logoutBtn.click()

      await vi.waitFor(() => {
        expect(mockDeps.toastSuccess).toHaveBeenCalled()
      })
    })

    it('로그아웃 실패 시 에러 토스트 표시', async () => {
      mockDeps.signOut.mockResolvedValue({ ok: false })
      authUIManager.initAuthUI()

      const logoutBtn = document.getElementById('logoutBtn')
      logoutBtn.click()

      await vi.waitFor(() => {
        expect(mockDeps.toastError).toHaveBeenCalledWith('error.logoutFailed')
      })
    })
  })
})
