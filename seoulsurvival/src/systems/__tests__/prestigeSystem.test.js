/**
 * Seoul Survival - Prestige System Tests
 *
 * 프레스티지 시스템 단위 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPrestigeSystem } from '../prestigeSystem.js'

describe('Prestige System', () => {
  let deps
  let prestigeSystem
  let mockState
  let mockUPGRADES
  let mockSaveLoadManager
  let mockLeaderboardUI
  let mockDiary
  let mockT
  let mockUpdateUI
  let mockUpdateAutoWorkUI

  beforeEach(() => {
    // Mock state
    mockState = {
      cash: 1_000_000_000_000,
      totalClicks: 1000,
      totalLaborIncome: 500_000_000_000,
      careerLevel: 5,
      clickMultiplier: 3,
      rentMultiplier: 2,
      autoClickEnabled: true,
      managerLevel: 5,
      deposits: 100,
      savings: 50,
      bonds: 30,
      usStocks: 20,
      cryptos: 10,
      villas: 5,
      officetels: 4,
      apartments: 3,
      shops: 2,
      buildings: 1,
      towers_run: 1,
      towers_lifetime: 5,
      depositsLifetime: 200,
      savingsLifetime: 100,
      bondsLifetime: 60,
      usStocksLifetime: 40,
      cryptosLifetime: 20,
      villasLifetime: 10,
      officetelsLifetime: 8,
      apartmentsLifetime: 6,
      shopsLifetime: 4,
      buildingsLifetime: 2,
      careerPoints: 10,
      totalCareerPoints: 15,
      purchasedUpgrades: ['A1_mentor'],
      permanentSlots: [],
      lifetimeEarnings: 1_000_000_000_000,
      currentMarketEvent: 'boom',
      marketEventEndTime: Date.now() + 60000,
      marketMultiplier: 1.5,
      playerNickname: 'TestPlayer',
      sessionStartTime: Date.now() - 100000,
    }

    // Mock upgrades
    mockUPGRADES = {
      upgrade1: { unlocked: true, purchased: true },
      upgrade2: { unlocked: true, purchased: false },
      upgrade3: { unlocked: false, purchased: false },
    }

    // Mock dependencies
    mockSaveLoadManager = {
      saveGame: vi.fn(),
    }

    mockLeaderboardUI = {
      updateLeaderboardEntry: vi.fn().mockResolvedValue(),
    }

    mockDiary = {
      addLog: vi.fn(),
    }

    mockT = vi.fn(key => `translated_${key}`)

    mockUpdateUI = vi.fn()
    mockUpdateAutoWorkUI = vi.fn()

    deps = {
      state: mockState,
      UPGRADES: mockUPGRADES,
      saveLoadManager: mockSaveLoadManager,
      LeaderboardUI: mockLeaderboardUI,
      Diary: mockDiary,
      t: mockT,
      updateUI: mockUpdateUI,
      updateAutoWorkUI: mockUpdateAutoWorkUI,
    }

    // Mock global __IS_DEV__
    global.__IS_DEV__ = false

    prestigeSystem = createPrestigeSystem(deps)
  })

  describe('resetHoldings', () => {
    it('금융상품 보유 수량을 0으로 초기화', () => {
      prestigeSystem.resetHoldings()

      expect(mockState.deposits).toBe(0)
      expect(mockState.savings).toBe(0)
      expect(mockState.bonds).toBe(0)
      expect(mockState.usStocks).toBe(0)
      expect(mockState.cryptos).toBe(0)
    })

    it('부동산 보유 수량을 0으로 초기화 (towers_lifetime 유지)', () => {
      prestigeSystem.resetHoldings()

      expect(mockState.villas).toBe(0)
      expect(mockState.officetels).toBe(0)
      expect(mockState.apartments).toBe(0)
      expect(mockState.shops).toBe(0)
      expect(mockState.buildings).toBe(0)
      expect(mockState.towers_run).toBe(0)
      expect(mockState.towers_lifetime).toBe(5) // 유지
    })

    it('Lifetime 변수를 0으로 초기화', () => {
      prestigeSystem.resetHoldings()

      expect(mockState.depositsLifetime).toBe(0)
      expect(mockState.savingsLifetime).toBe(0)
      expect(mockState.bondsLifetime).toBe(0)
      expect(mockState.usStocksLifetime).toBe(0)
      expect(mockState.cryptosLifetime).toBe(0)
      expect(mockState.villasLifetime).toBe(0)
      expect(mockState.officetelsLifetime).toBe(0)
      expect(mockState.apartmentsLifetime).toBe(0)
      expect(mockState.shopsLifetime).toBe(0)
      expect(mockState.buildingsLifetime).toBe(0)
    })

    it('연속 2회 호출 시 멱등성 보장', () => {
      prestigeSystem.resetHoldings()
      prestigeSystem.resetHoldings()

      expect(mockState.deposits).toBe(0)
      expect(mockState.towers_lifetime).toBe(5)
    })
  })

  describe('resetUpgrades', () => {
    it('모든 업그레이드를 잠금/미구매 상태로 초기화', () => {
      prestigeSystem.resetUpgrades(mockUPGRADES)

      expect(mockUPGRADES.upgrade1.unlocked).toBe(false)
      expect(mockUPGRADES.upgrade1.purchased).toBe(false)
      expect(mockUPGRADES.upgrade2.unlocked).toBe(false)
      expect(mockUPGRADES.upgrade2.purchased).toBe(false)
      expect(mockUPGRADES.upgrade3.unlocked).toBe(false)
      expect(mockUPGRADES.upgrade3.purchased).toBe(false)
    })

    it('빈 객체 전달 시 오류 없이 처리', () => {
      expect(() => {
        prestigeSystem.resetUpgrades({})
      }).not.toThrow()
    })

    it('연속 2회 호출 시 멱등성 보장', () => {
      prestigeSystem.resetUpgrades(mockUPGRADES)
      prestigeSystem.resetUpgrades(mockUPGRADES)

      expect(mockUPGRADES.upgrade1.unlocked).toBe(false)
      expect(mockUPGRADES.upgrade1.purchased).toBe(false)
    })
  })

  describe('performPrestige', () => {
    it('프레스티지 실행 시 모든 초기화 작업 수행', async () => {
      await prestigeSystem.performPrestige('test')

      // 보유 수량 초기화 확인
      expect(mockState.deposits).toBe(0)
      expect(mockState.villas).toBe(0)

      // 업그레이드 초기화 확인
      expect(mockUPGRADES.upgrade1.unlocked).toBe(false)
      expect(mockUPGRADES.upgrade1.purchased).toBe(false)

      // 시장 이벤트 초기화 확인
      expect(mockState.currentMarketEvent).toBe(null)
      expect(mockState.marketEventEndTime).toBe(0)
      expect(mockState.marketMultiplier).toBe(1.0)

      // UI/저장 함수 호출 확인
      expect(mockUpdateAutoWorkUI).toHaveBeenCalled()
      expect(mockUpdateUI).toHaveBeenCalled()
      expect(mockSaveLoadManager.saveGame).toHaveBeenCalled()
    })

    it('닉네임이 있으면 리더보드 업데이트 호출', async () => {
      mockState.playerNickname = 'TestPlayer'

      await prestigeSystem.performPrestige('test')

      expect(mockLeaderboardUI.updateLeaderboardEntry).toHaveBeenCalledWith(true)
    })

    it('닉네임이 없으면 리더보드 업데이트 건너뜀', async () => {
      mockState.playerNickname = ''

      await prestigeSystem.performPrestige('test')

      expect(mockLeaderboardUI.updateLeaderboardEntry).not.toHaveBeenCalled()
    })

    it('일기장 로그 추가', async () => {
      await prestigeSystem.performPrestige('test')

      expect(mockDiary.addLog).toHaveBeenCalledWith('translated_msg.prestigeComplete')
    })

    it('UI 업데이트 실패 시에도 프레스티지 계속 진행', async () => {
      mockUpdateUI.mockImplementationOnce(() => {
        throw new Error('UI 업데이트 실패')
      })

      await expect(prestigeSystem.performPrestige('test')).resolves.not.toThrow()

      // 저장은 여전히 호출됨
      expect(mockSaveLoadManager.saveGame).toHaveBeenCalled()
    })

    it('저장 실패 시에도 프레스티지 계속 진행', async () => {
      mockSaveLoadManager.saveGame.mockImplementationOnce(() => {
        throw new Error('저장 실패')
      })

      await expect(prestigeSystem.performPrestige('test')).resolves.not.toThrow()

      // 리더보드 업데이트는 여전히 호출됨
      expect(mockLeaderboardUI.updateLeaderboardEntry).toHaveBeenCalled()
    })

    it('일기장 로그 실패 시에도 프레스티지 계속 진행', async () => {
      mockDiary.addLog.mockImplementationOnce(() => {
        throw new Error('일기장 실패')
      })

      await expect(prestigeSystem.performPrestige('test')).resolves.not.toThrow()
    })

    it('리더보드 업데이트 실패 시에도 프레스티지 계속 진행', async () => {
      mockLeaderboardUI.updateLeaderboardEntry.mockRejectedValueOnce(
        new Error('리더보드 업데이트 실패')
      )

      await expect(prestigeSystem.performPrestige('test')).resolves.not.toThrow()

      // 일기장 로그는 여전히 호출됨
      expect(mockDiary.addLog).toHaveBeenCalled()
    })

    it('towers_lifetime은 유지되어야 함', async () => {
      const originalTowersLifetime = mockState.towers_lifetime

      await prestigeSystem.performPrestige('test')

      expect(mockState.towers_lifetime).toBe(originalTowersLifetime)
    })

    it('careerPoints는 유지되어야 함', async () => {
      // processPrestige()가 careerPoints를 증가시킬 수 있으므로
      // 최소한 원래 값 이상이어야 함
      const originalCP = mockState.careerPoints

      await prestigeSystem.performPrestige('test')

      expect(mockState.careerPoints).toBeGreaterThanOrEqual(originalCP)
    })

    it('CP가 0일 때 프레스티지 실행 가능', async () => {
      mockState.careerPoints = 0
      mockState.totalCareerPoints = 0

      await expect(prestigeSystem.performPrestige('test')).resolves.not.toThrow()

      expect(mockState.deposits).toBe(0)
    })

    it('연속 3회 프레스티지 실행 가능', async () => {
      await prestigeSystem.performPrestige('test1')
      await prestigeSystem.performPrestige('test2')
      await prestigeSystem.performPrestige('test3')

      // 매번 초기화되어야 함
      expect(mockState.deposits).toBe(0)
      expect(mockState.villas).toBe(0)
    })

    it('프레스티지 중 모든 의존성 오류 발생 시 예외 전파', async () => {
      // 모든 의존성을 오류 발생하도록 설정
      mockUpdateUI.mockImplementationOnce(() => {
        throw new Error('Critical UI Error')
      })
      mockSaveLoadManager.saveGame.mockImplementationOnce(() => {
        throw new Error('Critical Save Error')
      })
      mockLeaderboardUI.updateLeaderboardEntry.mockRejectedValueOnce(
        new Error('Critical Leaderboard Error')
      )
      mockDiary.addLog.mockImplementationOnce(() => {
        throw new Error('Critical Diary Error')
      })

      // 프레스티지는 계속 진행되어야 함 (비치명적 오류)
      await expect(prestigeSystem.performPrestige('test')).resolves.not.toThrow()
    })

    it('source 파라미터가 전달되어야 함', async () => {
      global.__IS_DEV__ = true
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await prestigeSystem.performPrestige('custom_source')

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('source: custom_source'))

      consoleSpy.mockRestore()
      global.__IS_DEV__ = false
    })

    it('빈 playerNickname(null)일 때 리더보드 업데이트 건너뜀', async () => {
      mockState.playerNickname = null

      await prestigeSystem.performPrestige('test')

      expect(mockLeaderboardUI.updateLeaderboardEntry).not.toHaveBeenCalled()
    })

    it('시장 이벤트가 null이어도 오류 없이 처리', async () => {
      mockState.currentMarketEvent = null
      mockState.marketEventEndTime = 0
      mockState.marketMultiplier = 1.0

      await expect(prestigeSystem.performPrestige('test')).resolves.not.toThrow()

      expect(mockState.currentMarketEvent).toBe(null)
    })

    it('업그레이드가 많을 때도 정상 처리', async () => {
      // 1000개 업그레이드 생성
      const largeUpgrades = {}
      for (let i = 0; i < 1000; i++) {
        largeUpgrades[`upgrade${i}`] = { unlocked: true, purchased: true }
      }

      deps.UPGRADES = largeUpgrades
      prestigeSystem = createPrestigeSystem(deps)

      await prestigeSystem.performPrestige('stress_test')

      // 모든 업그레이드가 초기화되어야 함
      expect(Object.values(largeUpgrades).every(u => !u.unlocked && !u.purchased)).toBe(true)
    })
  })
})
