/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createDevCheatSystem } from '../devCheatSystem.js'

describe('devCheatSystem', () => {
  let devCheatSystem
  let mockDeps

  beforeEach(() => {
    // window.cheat 초기화
    delete window.cheat

    mockDeps = {
      gameState: {
        cash: 1000,
        totalClicks: 0,
        careerPoints: 0,
        totalCareerPoints: 0,
        towers_lifetime: 0,
        lifetimeEarnings: 0,
      },
      UPGRADES: {
        upgrade1: { unlocked: false },
        upgrade2: { unlocked: false },
      },
      updateUI: vi.fn(),
      updateUpgradeList: vi.fn(),
      checkUpgradeUnlocks: vi.fn(),
      refreshPrestigeTab: vi.fn(),
      t: vi.fn(key => key),
      NumberFormat: { formatNumber: vi.fn(n => n.toString()) },
      __IS_DEV__: true,
    }

    devCheatSystem = createDevCheatSystem(mockDeps)
  })

  afterEach(() => {
    delete window.cheat
  })

  describe('initDevCheats', () => {
    it('개발 모드에서 window.cheat 객체가 생성됨', () => {
      devCheatSystem.initDevCheats()
      expect(window.cheat).toBeDefined()
    })

    it('프로덕션 모드에서는 window.cheat가 생성되지 않음', () => {
      const prodSystem = createDevCheatSystem({ ...mockDeps, __IS_DEV__: false })
      prodSystem.initDevCheats()
      expect(window.cheat).toBeUndefined()
    })
  })

  describe('cheat functions', () => {
    beforeEach(() => {
      devCheatSystem.initDevCheats()
    })

    it('addCash: 현금 추가', () => {
      window.cheat.addCash(5000)
      expect(mockDeps.gameState.cash).toBe(6000)
      expect(mockDeps.updateUI).toHaveBeenCalled()
    })

    it('unlockAllUpgrades: 모든 업그레이드 해금', () => {
      window.cheat.unlockAllUpgrades()
      expect(mockDeps.UPGRADES.upgrade1.unlocked).toBe(true)
      expect(mockDeps.UPGRADES.upgrade2.unlocked).toBe(true)
      expect(mockDeps.updateUpgradeList).toHaveBeenCalled()
    })

    it('unlockFirstUpgrade: 첫 번째 업그레이드 해금', () => {
      window.cheat.unlockFirstUpgrade()
      expect(mockDeps.UPGRADES.upgrade1.unlocked).toBe(true)
      expect(mockDeps.UPGRADES.upgrade2.unlocked).toBe(false)
      expect(mockDeps.updateUpgradeList).toHaveBeenCalled()
    })

    it('setClicks: 클릭 수 설정', () => {
      window.cheat.setClicks(100)
      expect(mockDeps.gameState.totalClicks).toBe(100)
      expect(mockDeps.updateUI).toHaveBeenCalled()
      expect(mockDeps.checkUpgradeUnlocks).toHaveBeenCalled()
    })

    it('testUpgrade: 업그레이드 테스트 설정', () => {
      window.cheat.testUpgrade()
      expect(mockDeps.UPGRADES.upgrade1.unlocked).toBe(true)
      expect(mockDeps.gameState.cash).toBe(10001000)
      expect(mockDeps.updateUpgradeList).toHaveBeenCalled()
      expect(mockDeps.updateUI).toHaveBeenCalled()
    })

    it('addCP: CP 추가', () => {
      window.cheat.addCP(5)
      expect(mockDeps.gameState.careerPoints).toBe(5)
      expect(mockDeps.gameState.totalCareerPoints).toBe(5)
      expect(mockDeps.refreshPrestigeTab).toHaveBeenCalled()
      expect(mockDeps.updateUI).toHaveBeenCalled()
    })

    it('setTowers: 타워 수 설정', () => {
      window.cheat.setTowers(10)
      expect(mockDeps.gameState.towers_lifetime).toBe(10)
      expect(mockDeps.updateUI).toHaveBeenCalled()
    })

    it('setLifetimeEarnings: 누적 수익 설정', () => {
      window.cheat.setLifetimeEarnings(1e12)
      expect(mockDeps.gameState.lifetimeEarnings).toBe(1e12)
      expect(mockDeps.updateUI).toHaveBeenCalled()
    })

    it('testPrestige: 프레스티지 테스트 설정', () => {
      window.cheat.testPrestige()
      expect(mockDeps.gameState.towers_lifetime).toBe(5)
      expect(mockDeps.gameState.lifetimeEarnings).toBe(1e13)
      expect(mockDeps.gameState.careerPoints).toBe(10)
      expect(mockDeps.gameState.totalCareerPoints).toBe(10)
      expect(mockDeps.refreshPrestigeTab).toHaveBeenCalled()
      expect(mockDeps.updateUI).toHaveBeenCalled()
    })

    it('getGameState: 게임 상태 반환', () => {
      const state = window.cheat.getGameState()
      expect(state).toBe(mockDeps.gameState)
    })
  })
})
