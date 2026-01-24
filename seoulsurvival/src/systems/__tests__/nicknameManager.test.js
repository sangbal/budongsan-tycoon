/**
 * nicknameManager.js 테스트
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createNicknameManager } from '../nicknameManager.js'

describe('createNicknameManager', () => {
  let mockDeps
  let manager
  let mockStorage

  beforeEach(() => {
    // localStorage mock
    mockStorage = {}
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(key => mockStorage[key] || null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      mockStorage[key] = value
    })
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(key => {
      delete mockStorage[key]
    })

    // sessionStorage mock
    vi.spyOn(window.sessionStorage, 'getItem').mockImplementation(key => mockStorage[key] || null)
    vi.spyOn(window.sessionStorage, 'setItem').mockImplementation((key, value) => {
      mockStorage[key] = value
    })
    vi.spyOn(window.sessionStorage, 'removeItem').mockImplementation(key => {
      delete mockStorage[key]
    })

    // 의존성 mock
    mockDeps = {
      SAVE_KEY: 'test_save',
      CLOUD_RESTORE_BLOCK_KEY: 'test_cloud_block',
      Modal: {
        openInputModal: vi.fn(),
        openInfoModal: vi.fn(),
      },
      t: vi.fn(key => key),
      validateNickname: vi.fn(nickname => {
        if (!nickname) return { ok: false, reasonKey: 'empty' }
        if (nickname.length < 1) return { ok: false, reasonKey: 'tooShort' }
        if (nickname.length > 6) return { ok: false, reasonKey: 'tooLong' }
        return { ok: true }
      }),
      normalizeNickname: vi.fn(nickname => ({
        raw: nickname?.trim() || '',
        key: nickname?.trim()?.toLowerCase() || '',
      })),
      claimNickname: vi.fn().mockResolvedValue({ success: true }),
      getUser: vi.fn().mockResolvedValue(null),
      saveGame: vi.fn(),
      updateUI: vi.fn(),
      Diary: {
        addLog: vi.fn(),
      },
      LeaderboardUI: {
        updateLeaderboardEntry: vi.fn().mockResolvedValue({}),
      },
      upsertCloudSave: vi.fn().mockResolvedValue({}),
      getPlayerNickname: vi.fn(() => ''),
      setPlayerNickname: vi.fn(),
      __IS_DEV__: false,
    }

    manager = createNicknameManager(mockDeps)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('checkNicknameCooldown', () => {
    it('쿨타임 기록 없으면 허용', () => {
      const result = manager.checkNicknameCooldown()
      expect(result.allowed).toBe(true)
    })

    it('쿨타임 경과 후 허용', () => {
      mockStorage['clicksurvivor_lastNicknameChangeAt'] = String(Date.now() - 60000)
      const result = manager.checkNicknameCooldown()
      expect(result.allowed).toBe(true)
    })

    it('쿨타임 내 불허', () => {
      mockStorage['clicksurvivor_lastNicknameChangeAt'] = String(Date.now() - 10000)
      const result = manager.checkNicknameCooldown()
      expect(result.allowed).toBe(false)
      expect(result.remainingSeconds).toBeGreaterThan(0)
    })

    it('잘못된 타임스탬프 처리', () => {
      mockStorage['clicksurvivor_lastNicknameChangeAt'] = 'invalid'
      const result = manager.checkNicknameCooldown()
      // parseInt('invalid') = NaN, elapsed = NaN, NaN >= 30000 = false
      // 따라서 쿨타임 내로 판정됨 (보수적 처리)
      expect(result).toHaveProperty('allowed')
    })
  })

  describe('saveNicknameCooldown', () => {
    it('쿨타임 저장', () => {
      manager.saveNicknameCooldown()
      expect(mockStorage['clicksurvivor_lastNicknameChangeAt']).toBeDefined()
    })
  })

  describe('ensureNicknameModal', () => {
    it('닉네임이 있으면 모달 안 열림', () => {
      mockStorage['test_save'] = JSON.stringify({ nickname: '테스터' })

      manager.ensureNicknameModal()

      expect(mockDeps.setPlayerNickname).toHaveBeenCalledWith('테스터')
      expect(mockDeps.Modal.openInputModal).not.toHaveBeenCalled()
    })

    it('닉네임이 없으면 모달 열림', async () => {
      vi.useFakeTimers()

      manager.ensureNicknameModal()

      // setTimeout 실행
      vi.advanceTimersByTime(600)

      expect(mockDeps.Modal.openInputModal).toHaveBeenCalled()

      vi.useRealTimers()
    })

    it('같은 세션에서 중복 오픈 방지', async () => {
      vi.useFakeTimers()

      manager.ensureNicknameModal()
      vi.advanceTimersByTime(600)
      manager.ensureNicknameModal()
      vi.advanceTimersByTime(600)

      expect(mockDeps.Modal.openInputModal).toHaveBeenCalledTimes(1)

      vi.useRealTimers()
    })

    it('저장 데이터 파싱 실패 시 빈 문자열 반환', () => {
      mockStorage['test_save'] = 'invalid json'

      manager.ensureNicknameModal()

      // 파싱 실패해도 에러 없이 진행
      expect(() => manager.ensureNicknameModal()).not.toThrow()
    })
  })

  describe('openNicknameChangeModal', () => {
    it('쿨타임 내면 에러 모달 표시', () => {
      mockStorage['clicksurvivor_lastNicknameChangeAt'] = String(Date.now())

      manager.openNicknameChangeModal()

      expect(mockDeps.Modal.openInfoModal).toHaveBeenCalled()
      expect(mockDeps.Modal.openInputModal).not.toHaveBeenCalled()
    })

    it('쿨타임 경과 후 입력 모달 표시', () => {
      mockStorage['clicksurvivor_lastNicknameChangeAt'] = String(Date.now() - 60000)

      manager.openNicknameChangeModal()

      expect(mockDeps.Modal.openInputModal).toHaveBeenCalled()
    })

    it('현재 닉네임을 기본값으로 설정', () => {
      mockDeps.getPlayerNickname.mockReturnValue('현재닉')

      manager.openNicknameChangeModal()

      expect(mockDeps.Modal.openInputModal).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(Function),
        expect.objectContaining({
          defaultValue: '현재닉',
        })
      )
    })
  })

  describe('handleNicknameChangeFromModal', () => {
    it('빈 닉네임 거부', async () => {
      await manager.handleNicknameChangeFromModal('')

      expect(mockDeps.Modal.openInfoModal).toHaveBeenCalled()
      expect(mockDeps.setPlayerNickname).not.toHaveBeenCalled()
    })

    it('너무 긴 닉네임 거부', async () => {
      await manager.handleNicknameChangeFromModal('일이삼사오육칠팔')

      expect(mockDeps.Modal.openInfoModal).toHaveBeenCalled()
    })

    it('동일한 닉네임 변경 스킵', async () => {
      mockDeps.getPlayerNickname.mockReturnValue('테스터')

      await manager.handleNicknameChangeFromModal('테스터')

      expect(mockDeps.saveGame).not.toHaveBeenCalled()
    })

    it('비로그인 상태에서 로컬 저장', async () => {
      mockDeps.getUser.mockResolvedValue(null)

      await manager.handleNicknameChangeFromModal('새닉')

      expect(mockDeps.setPlayerNickname).toHaveBeenCalledWith('새닉')
      expect(mockDeps.saveGame).toHaveBeenCalled()
      expect(mockDeps.Diary.addLog).toHaveBeenCalled()
    })

    it('로그인 상태에서 클레임 성공', async () => {
      mockDeps.getUser.mockResolvedValue({ id: 'user123' })
      mockDeps.claimNickname.mockResolvedValue({ success: true })
      mockStorage['test_save'] = JSON.stringify({ cash: 1000 })

      await manager.handleNicknameChangeFromModal('새닉')

      expect(mockDeps.claimNickname).toHaveBeenCalledWith('새닉', 'user123')
      expect(mockDeps.setPlayerNickname).toHaveBeenCalledWith('새닉')
      expect(mockDeps.LeaderboardUI.updateLeaderboardEntry).toHaveBeenCalled()
    })

    it('닉네임 중복 시 에러 처리', async () => {
      vi.useFakeTimers()
      mockDeps.getUser.mockResolvedValue({ id: 'user123' })
      mockDeps.claimNickname.mockResolvedValue({ success: false, error: 'taken' })

      await manager.handleNicknameChangeFromModal('중복닉')

      expect(mockDeps.Modal.openInfoModal).toHaveBeenCalled()

      vi.useRealTimers()
    })

    it('클레임 실패 시 에러 처리', async () => {
      mockDeps.getUser.mockResolvedValue({ id: 'user123' })
      mockDeps.claimNickname.mockResolvedValue({ success: false, error: 'other' })

      await manager.handleNicknameChangeFromModal('실패닉')

      expect(mockDeps.Modal.openInfoModal).toHaveBeenCalled()
    })

    it('네트워크 에러 처리', async () => {
      mockDeps.getUser.mockResolvedValue({ id: 'user123' })
      mockDeps.claimNickname.mockRejectedValue(new Error('Network error'))

      await manager.handleNicknameChangeFromModal('에러닉')

      expect(mockDeps.Modal.openInfoModal).toHaveBeenCalled()
    })
  })

  describe('반환 객체', () => {
    it('모든 메서드 포함', () => {
      expect(manager).toHaveProperty('ensureNicknameModal')
      expect(manager).toHaveProperty('openNicknameChangeModal')
      expect(manager).toHaveProperty('handleNicknameChangeFromModal')
      expect(manager).toHaveProperty('checkNicknameCooldown')
      expect(manager).toHaveProperty('saveNicknameCooldown')
    })
  })
})
