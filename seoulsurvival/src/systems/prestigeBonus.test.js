/**
 * Seoul Survival - Prestige Bonus System Tests
 *
 * 프레스티지 보너스 시스템 단위 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  PRESTIGE_BONUSES,
  getActivePrestigeBonuses,
  getPrestigeMultiplier,
  getAllPrestigeMultipliers,
  getStartingCash,
  getBonusesByTier,
} from './prestigeBonus.js'
import { gameState } from '../state/gameState.js'

describe('Prestige Bonus System', () => {
  beforeEach(() => {
    // 각 테스트 전에 타워 개수 초기화
    gameState.towers_lifetime = 0
  })

  describe('PRESTIGE_BONUSES 상수', () => {
    it('총 10개의 보너스가 정의되어야 함', () => {
      expect(PRESTIGE_BONUSES).toHaveLength(10)
    })

    it('모든 보너스는 필수 속성을 가져야 함', () => {
      for (const bonus of PRESTIGE_BONUSES) {
        expect(bonus).toHaveProperty('id')
        expect(bonus).toHaveProperty('nameKey')
        expect(bonus).toHaveProperty('descKey')
        expect(bonus).toHaveProperty('minTowers')
        expect(bonus).toHaveProperty('tier')
        expect(bonus).toHaveProperty('icon')
        expect(bonus).toHaveProperty('effect')
        expect(typeof bonus.effect).toBe('function')
      }
    })

    it('티어는 1~4 범위여야 함', () => {
      for (const bonus of PRESTIGE_BONUSES) {
        expect(bonus.tier).toBeGreaterThanOrEqual(1)
        expect(bonus.tier).toBeLessThanOrEqual(4)
      }
    })

    it('minTowers는 티어에 따라 올바르게 설정되어야 함', () => {
      const tier1 = PRESTIGE_BONUSES.filter(b => b.tier === 1)
      const tier2 = PRESTIGE_BONUSES.filter(b => b.tier === 2)
      const tier3 = PRESTIGE_BONUSES.filter(b => b.tier === 3)
      const tier4 = PRESTIGE_BONUSES.filter(b => b.tier === 4)

      // Tier 1: 타워 1+
      for (const bonus of tier1) {
        expect(bonus.minTowers).toBe(1)
      }

      // Tier 2: 타워 3+
      for (const bonus of tier2) {
        expect(bonus.minTowers).toBe(3)
      }

      // Tier 3: 타워 5+
      for (const bonus of tier3) {
        expect(bonus.minTowers).toBe(5)
      }

      // Tier 4: 타워 10+
      for (const bonus of tier4) {
        expect(bonus.minTowers).toBe(10)
      }
    })
  })

  describe('getActivePrestigeBonuses', () => {
    it('타워 0개: 활성화된 보너스 없음', () => {
      gameState.towers_lifetime = 0
      const active = getActivePrestigeBonuses()
      expect(active).toHaveLength(0)
    })

    it('타워 1개: Tier 1 보너스 4개 활성화', () => {
      gameState.towers_lifetime = 1
      const active = getActivePrestigeBonuses()
      expect(active).toHaveLength(4)
      expect(active.every(b => b.tier === 1)).toBe(true)
    })

    it('타워 3개: Tier 1~2 보너스 6개 활성화', () => {
      gameState.towers_lifetime = 3
      const active = getActivePrestigeBonuses()
      expect(active).toHaveLength(6)
      expect(active.filter(b => b.tier === 1)).toHaveLength(4)
      expect(active.filter(b => b.tier === 2)).toHaveLength(2)
    })

    it('타워 5개: Tier 1~3 보너스 8개 활성화', () => {
      gameState.towers_lifetime = 5
      const active = getActivePrestigeBonuses()
      expect(active).toHaveLength(8)
      expect(active.filter(b => b.tier === 3)).toHaveLength(2)
    })

    it('타워 10개: 모든 보너스 10개 활성화', () => {
      gameState.towers_lifetime = 10
      const active = getActivePrestigeBonuses()
      expect(active).toHaveLength(10)
    })

    it('활성화된 보너스는 effectValue를 포함해야 함', () => {
      gameState.towers_lifetime = 3
      const active = getActivePrestigeBonuses()
      for (const bonus of active) {
        expect(bonus).toHaveProperty('effectValue')
        expect(bonus.effectValue).toHaveProperty('type')
      }
    })
  })

  describe('getPrestigeMultiplier', () => {
    it('타워 0개: 모든 배수는 1.0', () => {
      gameState.towers_lifetime = 0
      expect(getPrestigeMultiplier('click_power')).toBe(1.0)
      expect(getPrestigeMultiplier('auto_income')).toBe(1.0)
      expect(getPrestigeMultiplier('all_income')).toBe(1.0)
    })

    it('타워 1개: click_power = 1.1배', () => {
      gameState.towers_lifetime = 1
      expect(getPrestigeMultiplier('click_power')).toBeCloseTo(1.1, 2)
    })

    it('타워 3개: click_power = 1.3배, auto_income = 1.15배', () => {
      gameState.towers_lifetime = 3
      expect(getPrestigeMultiplier('click_power')).toBeCloseTo(1.3, 2)
      expect(getPrestigeMultiplier('auto_income')).toBeCloseTo(1.15, 2)
    })

    it('타워 10개: all_income = 1.5배', () => {
      gameState.towers_lifetime = 10
      expect(getPrestigeMultiplier('all_income')).toBeCloseTo(1.5, 2)
    })

    it('존재하지 않는 타입: 1.0 반환', () => {
      gameState.towers_lifetime = 5
      expect(getPrestigeMultiplier('non_existent_type')).toBe(1.0)
    })
  })

  describe('getAllPrestigeMultipliers', () => {
    it('타워 0개: 기본값 반환', () => {
      gameState.towers_lifetime = 0
      const multipliers = getAllPrestigeMultipliers()

      expect(multipliers.click_power).toBe(1.0)
      expect(multipliers.auto_income).toBe(1.0)
      expect(multipliers.price_reduction).toBe(1.0)
      expect(multipliers.starting_cash).toBe(0)
      expect(multipliers.all_income).toBe(1.0)
    })

    it('타워 1개: Tier 1 보너스만 적용', () => {
      gameState.towers_lifetime = 1
      const multipliers = getAllPrestigeMultipliers()

      expect(multipliers.click_power).toBeCloseTo(1.1, 2)
      expect(multipliers.auto_income).toBeCloseTo(1.05, 2)
      expect(multipliers.price_reduction).toBeCloseTo(0.98, 2)
      expect(multipliers.starting_cash).toBe(1_000_000)
    })

    it('타워 5개: Tier 1~3 보너스 적용', () => {
      gameState.towers_lifetime = 5
      const multipliers = getAllPrestigeMultipliers()

      expect(multipliers.click_power).toBeCloseTo(1.5, 2)
      expect(multipliers.auto_income).toBeCloseTo(1.25, 2)
      expect(multipliers.price_reduction).toBeCloseTo(0.9, 2)
      expect(multipliers.starting_cash).toBe(5_000_000)
      expect(multipliers.upgrade_multiplier).toBeCloseTo(1.6, 2) // 1 + (5-2)*0.2
      expect(multipliers.unlock_special).toBe(true)
    })

    it('타워 10개: 모든 보너스 적용', () => {
      gameState.towers_lifetime = 10
      const multipliers = getAllPrestigeMultipliers()

      expect(multipliers.click_power).toBeCloseTo(2.0, 2) // 1 + 10*0.1
      expect(multipliers.auto_income).toBeCloseTo(1.5, 2) // 1 + 10*0.05
      expect(multipliers.price_reduction).toBeCloseTo(0.8, 2) // 1 - 10*0.02
      expect(multipliers.starting_cash).toBe(10_000_000)
      expect(multipliers.all_income).toBeCloseTo(1.5, 2) // 1 + (10-9)*0.5
      expect(multipliers.tick_speed).toBeCloseTo(1.1, 2) // 1 + (10-9)*0.1
    })

    it('가격 할인 배수는 최소 0.5 (50% 상한)', () => {
      gameState.towers_lifetime = 30 // 1 - 30*0.02 = -0.6 → 최소 0.5
      const multipliers = getAllPrestigeMultipliers()
      expect(multipliers.price_reduction).toBeGreaterThanOrEqual(0.5)
    })
  })

  describe('getStartingCash', () => {
    it('타워 0개: 스타트 자금 0원', () => {
      gameState.towers_lifetime = 0
      expect(getStartingCash()).toBe(0)
    })

    it('타워 1개: 스타트 자금 100만원', () => {
      gameState.towers_lifetime = 1
      expect(getStartingCash()).toBe(1_000_000)
    })

    it('타워 5개: 스타트 자금 500만원', () => {
      gameState.towers_lifetime = 5
      expect(getStartingCash()).toBe(5_000_000)
    })

    it('타워 10개: 스타트 자금 1000만원', () => {
      gameState.towers_lifetime = 10
      expect(getStartingCash()).toBe(10_000_000)
    })
  })

  describe('getBonusesByTier', () => {
    it('티어별로 보너스가 올바르게 분류되어야 함', () => {
      const byTier = getBonusesByTier()

      expect(byTier.tier1).toHaveLength(4)
      expect(byTier.tier2).toHaveLength(2)
      expect(byTier.tier3).toHaveLength(2)
      expect(byTier.tier4).toHaveLength(2)
    })

    it('각 티어의 보너스는 올바른 tier 속성을 가져야 함', () => {
      const byTier = getBonusesByTier()

      expect(byTier.tier1.every(b => b.tier === 1)).toBe(true)
      expect(byTier.tier2.every(b => b.tier === 2)).toBe(true)
      expect(byTier.tier3.every(b => b.tier === 3)).toBe(true)
      expect(byTier.tier4.every(b => b.tier === 4)).toBe(true)
    })
  })

  describe('보너스 효과 함수 검증', () => {
    it('클릭 마스터: 타워당 +10%', () => {
      const clickMaster = PRESTIGE_BONUSES.find(b => b.id === 'click_master')
      expect(clickMaster.effect(1).multiplier).toBeCloseTo(1.1, 2)
      expect(clickMaster.effect(5).multiplier).toBeCloseTo(1.5, 2)
      expect(clickMaster.effect(10).multiplier).toBeCloseTo(2.0, 2)
    })

    it('자동 수익 강화: 타워당 +5%', () => {
      const autoIncomeBoost = PRESTIGE_BONUSES.find(b => b.id === 'auto_income_boost')
      expect(autoIncomeBoost.effect(1).multiplier).toBeCloseTo(1.05, 2)
      expect(autoIncomeBoost.effect(10).multiplier).toBeCloseTo(1.5, 2)
    })

    it('할인 전문가: 타워당 -2%, 최소 0.5배', () => {
      const discountMaster = PRESTIGE_BONUSES.find(b => b.id === 'discount_master')
      expect(discountMaster.effect(1).multiplier).toBeCloseTo(0.98, 2)
      expect(discountMaster.effect(10).multiplier).toBeCloseTo(0.8, 2)
      expect(discountMaster.effect(30).multiplier).toBeGreaterThanOrEqual(0.5)
    })

    it('스타트 자금: 타워당 +100만원', () => {
      const startingCapital = PRESTIGE_BONUSES.find(b => b.id === 'starting_capital')
      expect(startingCapital.effect(1).amount).toBe(1_000_000)
      expect(startingCapital.effect(5).amount).toBe(5_000_000)
      expect(startingCapital.effect(10).amount).toBe(10_000_000)
    })

    it('업그레이드 강화: 타워 3개부터 +20%', () => {
      const upgradePower = PRESTIGE_BONUSES.find(b => b.id === 'upgrade_power')
      // 수식: 1 + (towers - 2) * 0.2
      expect(upgradePower.effect(3).multiplier).toBeCloseTo(1.2, 2) // 1 + (3-2)*0.2 = 1.2
      expect(upgradePower.effect(5).multiplier).toBeCloseTo(1.6, 2) // 1 + (5-2)*0.2 = 1.6
      expect(upgradePower.effect(10).multiplier).toBeCloseTo(2.6, 2) // 1 + (10-2)*0.2 = 2.6
    })

    it('궁극의 힘: 타워 10개부터 x1.5', () => {
      const ultimatePower = PRESTIGE_BONUSES.find(b => b.id === 'ultimate_power')
      // 수식: 1 + (towers - 9) * 0.5
      expect(ultimatePower.effect(10).multiplier).toBeCloseTo(1.5, 2) // 1 + (10-9)*0.5 = 1.5
      expect(ultimatePower.effect(15).multiplier).toBeCloseTo(4.0, 2) // 1 + (15-9)*0.5 = 4.0
    })
  })

  describe('통합 시나리오', () => {
    it('시나리오 1: 첫 프레스티지 (타워 1개)', () => {
      gameState.towers_lifetime = 1
      const multipliers = getAllPrestigeMultipliers()

      // Tier 1 보너스만 활성화
      expect(multipliers.click_power).toBeCloseTo(1.1, 2)
      expect(multipliers.auto_income).toBeCloseTo(1.05, 2)
      expect(multipliers.price_reduction).toBeCloseTo(0.98, 2)
      expect(multipliers.starting_cash).toBe(1_000_000)

      // Tier 2+ 보너스는 비활성화
      expect(multipliers.upgrade_multiplier).toBe(1.0)
      expect(multipliers.unlock_special).toBe(false)
      expect(multipliers.all_income).toBe(1.0)
    })

    it('시나리오 2: 중급 플레이어 (타워 5개)', () => {
      gameState.towers_lifetime = 5
      const multipliers = getAllPrestigeMultipliers()

      // Tier 1~3 보너스 활성화
      expect(multipliers.click_power).toBeCloseTo(1.5, 2)
      expect(multipliers.auto_income).toBeCloseTo(1.25, 2)
      expect(multipliers.starting_cash).toBe(5_000_000)
      expect(multipliers.upgrade_multiplier).toBeCloseTo(1.6, 2)
      expect(multipliers.unlock_special).toBe(true)

      // Tier 4 보너스는 비활성화
      expect(multipliers.tick_speed).toBe(1.0)
      expect(multipliers.all_income).toBe(1.0)
    })

    it('시나리오 3: 엔드게임 플레이어 (타워 15개)', () => {
      gameState.towers_lifetime = 15
      const multipliers = getAllPrestigeMultipliers()

      // 모든 보너스 활성화 + 누적 효과
      expect(multipliers.click_power).toBeCloseTo(2.5, 2) // 1 + 15*0.1
      expect(multipliers.auto_income).toBeCloseTo(1.75, 2) // 1 + 15*0.05
      expect(multipliers.starting_cash).toBe(15_000_000)
      expect(multipliers.all_income).toBeCloseTo(4.0, 2) // 1 + (15-9)*0.5
      expect(multipliers.tick_speed).toBeCloseTo(1.6, 2) // 1 + (15-9)*0.1
    })
  })
})
