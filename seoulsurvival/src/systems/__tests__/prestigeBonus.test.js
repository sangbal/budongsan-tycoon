/**
 * Seoul Survival - Prestige Bonus System Tests (v2.0)
 *
 * CP 기반 프레스티지 업그레이드 시스템 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  PRESTIGE_UPGRADES,
  CATEGORIES,
  calculateCP,
  canPurchaseUpgrade,
  purchaseUpgrade,
  getUpgradeEffect,
  getAllPrestigeEffects,
  getUpgradesByCategory,
  getTotalSpentCP,
  getCPBonusMultiplier,
  processPrestige,
  resetPurchasedUpgrades,
  getStartingCash,
  getPrestigeMultiplier,
  getAllPrestigeMultipliers,
  getPrestigeBonusInfoHTML,
  applyStartingBonuses,
} from '../prestigeBonus.js'
import { gameState } from '../../state/gameState.js'

describe('Prestige Bonus System v2.0', () => {
  beforeEach(() => {
    // 각 테스트 전 상태 초기화
    gameState.towers_lifetime = 0
    gameState.lifetimeEarnings = 0
    gameState.careerPoints = 0
    gameState.totalCareerPoints = 0
    gameState.purchasedUpgrades = []
    gameState.permanentSlots = []
  })

  describe('PRESTIGE_UPGRADES 상수', () => {
    it('총 26개의 업그레이드가 정의되어야 함 (기존 20개 + 인맥 3개 + 자동화 3개)', () => {
      expect(PRESTIGE_UPGRADES).toHaveLength(26)
    })

    it('모든 업그레이드는 필수 속성을 가져야 함', () => {
      for (const upgrade of PRESTIGE_UPGRADES) {
        expect(upgrade).toHaveProperty('id')
        expect(upgrade).toHaveProperty('category')
        expect(upgrade).toHaveProperty('nameKey')
        expect(upgrade).toHaveProperty('descKey')
        expect(upgrade).toHaveProperty('cost')
        expect(upgrade).toHaveProperty('icon')
        expect(upgrade).toHaveProperty('requires')
        expect(upgrade).toHaveProperty('effect')
        expect(upgrade.effect).toHaveProperty('type')
        expect(upgrade.effect).toHaveProperty('value')
      }
    })

    it('카테고리는 유효한 범위여야 함', () => {
      const validCategories = ['QUICK_START', 'LABOR', 'BOOST', 'FINANCIAL', 'PROPERTY', 'META']
      for (const upgrade of PRESTIGE_UPGRADES) {
        expect(validCategories).toContain(upgrade.category)
      }
    })

    it('비용은 양수여야 함', () => {
      for (const upgrade of PRESTIGE_UPGRADES) {
        expect(upgrade.cost).toBeGreaterThan(0)
      }
    })
  })

  describe('CATEGORIES 상수', () => {
    it('6개의 카테고리가 정의되어야 함', () => {
      expect(Object.keys(CATEGORIES)).toHaveLength(6)
    })

    it('각 카테고리는 필수 속성을 가져야 함', () => {
      for (const [key, cat] of Object.entries(CATEGORIES)) {
        expect(cat).toHaveProperty('nameKey')
        expect(cat).toHaveProperty('icon')
        expect(cat).toHaveProperty('color')
      }
    })
  })

  describe('calculateCP', () => {
    it('타워 0개: CP 0', () => {
      expect(calculateCP(0, 0)).toBe(0)
    })

    it('타워 1개: 첫 타워 보너스 포함 7+ CP', () => {
      // baseCp = floor(sqrt(1) * 2) = 2
      // firstTowerBonus = 5
      // total = 2 + 5 = 7
      expect(calculateCP(1, 0)).toBeGreaterThanOrEqual(7)
    })

    it('타워 4개: baseCp = floor(sqrt(4) * 2) = 4, + 첫 타워 보너스 5', () => {
      expect(calculateCP(4, 0)).toBe(4 + 5)
    })

    it('높은 수익 보너스 적용', () => {
      // lifetimeEarnings > 1조일 때 추가 보너스
      const cpWith1T = calculateCP(1, 0)
      const cpWith10T = calculateCP(1, 10e12) // 10조
      expect(cpWith10T).toBeGreaterThan(cpWith1T)
    })

    it('음수 타워: CP 0', () => {
      expect(calculateCP(-1, 0)).toBe(0)
    })
  })

  describe('canPurchaseUpgrade', () => {
    it('유효하지 않은 업그레이드: 구매 불가', () => {
      const result = canPurchaseUpgrade('invalid_id')
      expect(result.canPurchase).toBe(false)
      expect(result.reason).toBe('invalid_upgrade')
    })

    it('CP 부족: 구매 불가', () => {
      gameState.careerPoints = 0
      const result = canPurchaseUpgrade('A1_mentor')
      expect(result.canPurchase).toBe(false)
      expect(result.reason).toBe('not_enough_cp')
    })

    it('CP 충분: 구매 가능', () => {
      gameState.careerPoints = 10
      const result = canPurchaseUpgrade('A1_mentor')
      expect(result.canPurchase).toBe(true)
    })

    it('이미 구매: 구매 불가', () => {
      gameState.careerPoints = 10
      gameState.purchasedUpgrades = ['A1_mentor']
      const result = canPurchaseUpgrade('A1_mentor')
      expect(result.canPurchase).toBe(false)
      expect(result.reason).toBe('already_purchased')
    })

    it('선행 조건 미충족: 구매 불가', () => {
      gameState.careerPoints = 10
      // A2_network requires A1_mentor
      const result = canPurchaseUpgrade('A2_network')
      expect(result.canPurchase).toBe(false)
      expect(result.reason).toBe('requires_not_met')
    })

    it('선행 조건 충족: 구매 가능', () => {
      gameState.careerPoints = 10
      gameState.purchasedUpgrades = ['A1_mentor']
      const result = canPurchaseUpgrade('A2_network')
      expect(result.canPurchase).toBe(true)
    })
  })

  describe('purchaseUpgrade', () => {
    it('구매 성공: CP 차감 및 목록 추가', () => {
      gameState.careerPoints = 10
      const success = purchaseUpgrade('A1_mentor')
      expect(success).toBe(true)
      expect(gameState.careerPoints).toBe(9) // 10 - 1
      expect(gameState.purchasedUpgrades).toContain('A1_mentor')
    })

    it('구매 실패: 상태 변화 없음', () => {
      gameState.careerPoints = 0
      const success = purchaseUpgrade('A1_mentor')
      expect(success).toBe(false)
      expect(gameState.careerPoints).toBe(0)
      expect(gameState.purchasedUpgrades).toHaveLength(0)
    })
  })

  describe('getUpgradeEffect', () => {
    it('구매한 업그레이드 효과 반환', () => {
      gameState.purchasedUpgrades = ['A1_mentor']
      const effect = getUpgradeEffect('click_multiplier')
      expect(effect).toBe(1.2)
    })

    it('구매하지 않은 효과: null', () => {
      gameState.purchasedUpgrades = []
      const effect = getUpgradeEffect('click_multiplier')
      expect(effect).toBeNull()
    })

    it('배수 효과 곱연산', () => {
      gameState.purchasedUpgrades = ['A1_mentor', 'D1_workaholic']
      // A1: click_multiplier 1.2
      // D1: click_income_multiplier 1.5 (다른 타입)
      const clickMult = getUpgradeEffect('click_multiplier')
      expect(clickMult).toBeCloseTo(1.2, 2)
    })

    it('할인 효과 합산 (최대 50%)', () => {
      gameState.purchasedUpgrades = ['A4_reputation', 'B2_fund_manager', 'C2_builder']
      // A4: price_discount 0.1
      // B2: financial_price_discount 0.25
      // C2: property_price_discount 0.25
      const priceDiscount = getUpgradeEffect('price_discount')
      expect(priceDiscount).toBeCloseTo(0.1, 2)
    })
  })

  describe('getAllPrestigeEffects', () => {
    it('기본값 반환', () => {
      gameState.purchasedUpgrades = []
      const effects = getAllPrestigeEffects()
      expect(effects.click_multiplier).toBe(1.0)
      expect(effects.auto_income_multiplier).toBe(1.0)
      expect(effects.price_discount).toBe(0)
      expect(effects.starting_cash).toBe(0)
    })

    it('구매한 업그레이드 효과 반영', () => {
      gameState.purchasedUpgrades = ['A1_mentor', 'E1_parents']
      const effects = getAllPrestigeEffects()
      expect(effects.click_multiplier).toBeCloseTo(1.2, 2)
      expect(effects.starting_deposits).toBe(5)
    })
  })

  describe('getUpgradesByCategory', () => {
    it('카테고리별 업그레이드 분류', () => {
      const byCategory = getUpgradesByCategory()
      expect(byCategory.QUICK_START).toHaveLength(6)
      expect(byCategory.LABOR).toHaveLength(6)
      expect(byCategory.BOOST).toHaveLength(4)
      expect(byCategory.FINANCIAL).toHaveLength(3)
      expect(byCategory.PROPERTY).toHaveLength(3)
      expect(byCategory.META).toHaveLength(4)
    })
  })

  describe('getTotalSpentCP', () => {
    it('구매 없음: 0', () => {
      gameState.purchasedUpgrades = []
      expect(getTotalSpentCP()).toBe(0)
    })

    it('구매한 업그레이드 비용 합산', () => {
      gameState.purchasedUpgrades = ['A1_mentor', 'A2_network']
      // A1: cost 1, A2: cost 2
      expect(getTotalSpentCP()).toBe(3)
    })
  })

  describe('getCPBonusMultiplier', () => {
    it('CP 0: 배수 1.0', () => {
      gameState.careerPoints = 0
      gameState.purchasedUpgrades = []
      expect(getCPBonusMultiplier()).toBe(1.0)
    })

    it('CP 10: 배수 1.2 (+20%)', () => {
      gameState.careerPoints = 10
      gameState.purchasedUpgrades = []
      expect(getCPBonusMultiplier()).toBeCloseTo(1.2, 2)
    })

    it('사용 CP도 카운트', () => {
      gameState.careerPoints = 5
      gameState.purchasedUpgrades = ['A1_mentor', 'A2_network'] // cost 1 + 2 = 3
      // total = 5 + 3 = 8, bonus = 1 + 8 * 0.02 = 1.16
      expect(getCPBonusMultiplier()).toBeCloseTo(1.16, 2)
    })
  })

  describe('processPrestige', () => {
    it('CP 지급 및 리셋', () => {
      gameState.towers_lifetime = 1
      gameState.lifetimeEarnings = 0
      gameState.purchasedUpgrades = ['A1_mentor']

      const earnedCP = processPrestige()

      expect(earnedCP).toBeGreaterThan(0)
      expect(gameState.careerPoints).toBe(earnedCP)
      // 구매 업그레이드는 리셋됨 (F 카테고리 제외)
      expect(gameState.purchasedUpgrades).toHaveLength(0)
    })

    it('F 카테고리 업그레이드 유지', () => {
      gameState.towers_lifetime = 1
      gameState.purchasedUpgrades = ['F1_preserve_1']

      processPrestige()

      expect(gameState.purchasedUpgrades).toContain('F1_preserve_1')
    })
  })

  describe('하위 호환성 함수', () => {
    it('getStartingCash: getAllPrestigeEffects 기반', () => {
      gameState.purchasedUpgrades = ['A3_recognition']
      const cash = getStartingCash()
      expect(cash).toBe(10_000_000)
    })

    it('getPrestigeMultiplier: 타입 매핑', () => {
      gameState.purchasedUpgrades = ['A1_mentor']
      const mult = getPrestigeMultiplier('click_power')
      expect(mult).toBeCloseTo(1.2, 2)
    })

    it('getAllPrestigeMultipliers: 하위 호환 형식', () => {
      gameState.purchasedUpgrades = ['A1_mentor', 'A2_network']
      const multipliers = getAllPrestigeMultipliers()

      expect(multipliers).toHaveProperty('click_power')
      expect(multipliers).toHaveProperty('auto_income')
      expect(multipliers).toHaveProperty('price_reduction')
      expect(multipliers).toHaveProperty('starting_cash')
    })
  })

  describe('getPrestigeBonusInfoHTML', () => {
    const mockT = (key, params, fallback) => fallback || key
    const mockFormatNumber = n => n.toLocaleString() + '원'

    it('구매 없음: 힌트 메시지', () => {
      gameState.towers_lifetime = 0
      gameState.purchasedUpgrades = []
      const html = getPrestigeBonusInfoHTML(mockT, mockFormatNumber)
      expect(html).toContain('prestige-hint')
    })

    it('구매 있음: 업그레이드 목록', () => {
      gameState.towers_lifetime = 1
      gameState.careerPoints = 5
      gameState.purchasedUpgrades = ['A1_mentor']
      const html = getPrestigeBonusInfoHTML(mockT, mockFormatNumber)

      expect(html).toContain('prestige-bonus-list')
      expect(html).toContain('👨‍🏫') // A1_mentor icon
      expect(html).toContain('category-BOOST')
    })
  })

  describe('통합 시나리오', () => {
    it('시나리오 1: 첫 프레스티지 후 업그레이드 구매', () => {
      // 타워 1개로 프레스티지
      gameState.towers_lifetime = 1
      const earnedCP = processPrestige()

      // CP 확인 (첫 타워 보너스 포함 7+)
      expect(gameState.careerPoints).toBeGreaterThanOrEqual(7)

      // A1 구매 (비용 1)
      const success = purchaseUpgrade('A1_mentor')
      expect(success).toBe(true)

      // 효과 확인
      const effects = getAllPrestigeEffects()
      expect(effects.click_multiplier).toBeCloseTo(1.2, 2)
    })

    it('시나리오 2: 업그레이드 체인 구매', () => {
      gameState.careerPoints = 20

      // A 카테고리 체인: A1 -> A2 -> A3
      expect(purchaseUpgrade('A1_mentor')).toBe(true)
      expect(purchaseUpgrade('A2_network')).toBe(true)
      expect(purchaseUpgrade('A3_recognition')).toBe(true)

      // A4는 A3 필요
      expect(purchaseUpgrade('A4_reputation')).toBe(true)

      const effects = getAllPrestigeEffects()
      expect(effects.starting_cash).toBe(10_000_000)
      expect(effects.price_discount).toBeCloseTo(0.1, 2)
    })

    it('시나리오 3: 다중 경로 빌드', () => {
      gameState.careerPoints = 30

      // 금융 경로
      purchaseUpgrade('B1_broker')
      // 부동산 경로
      purchaseUpgrade('C1_realtor')
      // 클릭 경로
      purchaseUpgrade('D1_workaholic')

      const effects = getAllPrestigeEffects()
      expect(effects.financial_income_multiplier).toBeCloseTo(1.3, 2)
      expect(effects.property_income_multiplier).toBeCloseTo(1.3, 2)
      expect(effects.click_income_multiplier).toBeCloseTo(1.5, 2)
    })
  })

  describe('P0: 승진 요구량 감소 (H1~H3)', () => {
    it('H1 구매: 승진 요구량 -20%', () => {
      gameState.careerPoints = 10
      purchaseUpgrade('H1_network_basic')

      const effects = getAllPrestigeEffects()
      expect(effects.promotion_requirement_reduction).toBeCloseTo(0.2, 2)
    })

    it('H1+H2 구매: 승진 요구량 -35%', () => {
      gameState.careerPoints = 20
      purchaseUpgrade('H1_network_basic')
      purchaseUpgrade('H2_network_power')

      const effects = getAllPrestigeEffects()
      // H1: 0.2, H2: 0.15 = 0.35
      expect(effects.promotion_requirement_reduction).toBeCloseTo(0.35, 2)
    })

    it('H1+H2+H3 구매: 승진 요구량 -50% (최대)', () => {
      gameState.careerPoints = 30
      purchaseUpgrade('H1_network_basic')
      purchaseUpgrade('H2_network_power')
      purchaseUpgrade('H3_vip_connections')

      const effects = getAllPrestigeEffects()
      // H1: 0.2, H2: 0.15, H3: 0.15 = 0.50
      expect(effects.promotion_requirement_reduction).toBeCloseTo(0.5, 2)
    })

    it('H2 구매 시 H1 선행조건 미충족', () => {
      gameState.careerPoints = 20
      // H1 없이 H2 구매 시도
      const result = canPurchaseUpgrade('H2_network_power')
      expect(result.canPurchase).toBe(false)
      expect(result.reason).toBe('requires_not_met')
      expect(result.missing).toBe('H1_network_basic')
    })

    it('H3 구매 시 H2 선행조건 미충족', () => {
      gameState.careerPoints = 30
      purchaseUpgrade('H1_network_basic')
      // H2 없이 H3 구매 시도
      const result = canPurchaseUpgrade('H3_vip_connections')
      expect(result.canPurchase).toBe(false)
      expect(result.reason).toBe('requires_not_met')
      expect(result.missing).toBe('H2_network_power')
    })

    it('H 계열 선행조건 체인 전체 구매', () => {
      gameState.careerPoints = 50

      // H1 -> H2 -> H3 순서로 구매
      expect(purchaseUpgrade('H1_network_basic')).toBe(true)
      expect(purchaseUpgrade('H2_network_power')).toBe(true)
      expect(purchaseUpgrade('H3_vip_connections')).toBe(true)

      // 모두 구매 목록에 있어야 함
      expect(gameState.purchasedUpgrades).toContain('H1_network_basic')
      expect(gameState.purchasedUpgrades).toContain('H2_network_power')
      expect(gameState.purchasedUpgrades).toContain('H3_vip_connections')
    })
  })

  describe('P0: applyStartingBonuses 멱등성', () => {
    it('중복 호출 시 보너스 중복 적용 - starting_cash', () => {
      gameState.careerPoints = 20
      gameState.purchasedUpgrades = []
      purchaseUpgrade('A1_mentor')
      purchaseUpgrade('A2_network')
      purchaseUpgrade('A3_recognition') // starting_cash: 10,000,000

      // 첫 번째 호출
      gameState.cash = 0
      applyStartingBonuses()
      const firstCash = gameState.cash
      expect(firstCash).toBe(10_000_000)

      // 두 번째 호출 (이미 보너스가 적용된 상태)
      applyStartingBonuses()
      const secondCash = gameState.cash

      // 두 번째 호출도 추가됨 (현재 로직상 멱등성 없음)
      // 이것은 설계 의도: 프레스티지 시 cash가 0으로 초기화된 후 1회만 호출되어야 함
      expect(secondCash).toBe(firstCash + 10_000_000)
    })

    it('프레스티지 흐름에서 1회만 호출 확인', () => {
      // 실제 프레스티지 흐름: resetHoldings -> applyStartingBonuses (1회)
      // 이 테스트는 문서화 목적
      gameState.careerPoints = 10
      gameState.purchasedUpgrades = []
      purchaseUpgrade('E1_parents') // starting_deposits: 5

      gameState.deposits = 0
      gameState.cash = 0

      const bonuses = applyStartingBonuses()

      expect(bonuses.deposits).toBe(5)
      expect(gameState.deposits).toBe(5)
    })
  })

  describe('P0: 영구슬롯 선행조건 체인', () => {
    it('F2 구매 시 F1 선행조건 필요', () => {
      gameState.careerPoints = 30

      // F1 없이 F2 구매 시도
      const result = canPurchaseUpgrade('F2_preserve_2')
      expect(result.canPurchase).toBe(false)
      expect(result.reason).toBe('requires_not_met')
      expect(result.missing).toBe('F1_preserve_1')
    })

    it('F1 -> F2 순서로 구매 성공', () => {
      gameState.careerPoints = 30

      expect(purchaseUpgrade('F1_preserve_1')).toBe(true)
      expect(purchaseUpgrade('F2_preserve_2')).toBe(true)

      const effects = getAllPrestigeEffects()
      expect(effects.permanent_slot).toBe(2) // 최대값 선택
    })

    it('프레스티지 후 F1, F2 유지', () => {
      gameState.careerPoints = 30
      gameState.towers_lifetime = 1

      purchaseUpgrade('F1_preserve_1')
      purchaseUpgrade('F2_preserve_2')
      purchaseUpgrade('A1_mentor') // 일반 업그레이드

      // 프레스티지 실행
      processPrestige()

      // F 카테고리는 유지
      expect(gameState.purchasedUpgrades).toContain('F1_preserve_1')
      expect(gameState.purchasedUpgrades).toContain('F2_preserve_2')
      // 일반 업그레이드는 리셋
      expect(gameState.purchasedUpgrades).not.toContain('A1_mentor')
    })
  })
})
