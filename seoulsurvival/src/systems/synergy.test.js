/**
 * Seoul Survival - Synergy System Unit Tests
 *
 * Vitest를 사용한 시너지 시스템 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  SYNERGIES,
  getActiveSynergies,
  getSynergyMultiplier,
  applyPropertySynergyMultiplier,
  applyFinancialSynergyMultiplier,
  applyClickSynergyMultiplier,
  updateCompletionistSynergy,
  getSynergyDisplayData,
} from './synergy.js'
import { gameState } from '../state/gameState.js'

describe('Synergy System', () => {
  let mockState

  beforeEach(() => {
    // 기본 게임 상태 모킹
    mockState = {
      deposits: 0,
      savings: 0,
      bonds: 0,
      usStocks: 0,
      cryptos: 0,
      villas: 0,
      officetels: 0,
      apartments: 0,
      shops: 0,
      buildings: 0,
      __completionistUnlocked: false,
    }
  })

  describe('SYNERGIES 상수', () => {
    it('시너지는 5종이어야 함', () => {
      expect(SYNERGIES).toHaveLength(5)
    })

    it('모든 시너지는 필수 필드를 가져야 함', () => {
      SYNERGIES.forEach(synergy => {
        expect(synergy).toHaveProperty('id')
        expect(synergy).toHaveProperty('nameKey')
        expect(synergy).toHaveProperty('descKey')
        expect(synergy).toHaveProperty('icon')
        expect(synergy).toHaveProperty('check')
        expect(synergy).toHaveProperty('effect')
        expect(synergy).toHaveProperty('multiplier')
        expect(typeof synergy.check).toBe('function')
        expect(synergy.multiplier).toBeGreaterThan(1)
      })
    })
  })

  describe('Real Estate Mogul 시너지', () => {
    it('부동산 5종 보유 시 활성화', () => {
      mockState.villas = 1
      mockState.officetels = 1
      mockState.apartments = 1
      mockState.shops = 1
      mockState.buildings = 1

      const active = getActiveSynergies(mockState)
      expect(active.some(s => s.id === 'real_estate_mogul')).toBe(true)
    })

    it('부동산 일부만 보유 시 비활성화', () => {
      mockState.villas = 1
      mockState.officetels = 1
      mockState.apartments = 1
      // shops, buildings 없음

      const active = getActiveSynergies(mockState)
      expect(active.some(s => s.id === 'real_estate_mogul')).toBe(false)
    })

    it('부동산 수익에 +30% 배수 적용', () => {
      mockState.villas = 1
      mockState.officetels = 1
      mockState.apartments = 1
      mockState.shops = 1
      mockState.buildings = 1

      const multiplier = getSynergyMultiplier(mockState, 'property_income')
      expect(multiplier).toBe(1.3)
    })
  })

  describe('Finance Guru 시너지', () => {
    it('금융 5종 보유 시 활성화', () => {
      mockState.deposits = 1
      mockState.savings = 1
      mockState.bonds = 1
      mockState.usStocks = 1
      mockState.cryptos = 1

      const active = getActiveSynergies(mockState)
      expect(active.some(s => s.id === 'finance_guru')).toBe(true)
    })

    it('금융 수익에 +25% 배수 적용', () => {
      mockState.deposits = 1
      mockState.savings = 1
      mockState.bonds = 1
      mockState.usStocks = 1
      mockState.cryptos = 1

      const multiplier = getSynergyMultiplier(mockState, 'financial_income')
      expect(multiplier).toBe(1.25)
    })
  })

  describe('Diversification 시너지', () => {
    it('모든 상품 보유 시 활성화', () => {
      // 금융 5종
      mockState.deposits = 1
      mockState.savings = 1
      mockState.bonds = 1
      mockState.usStocks = 1
      mockState.cryptos = 1
      // 부동산 5종
      mockState.villas = 1
      mockState.officetels = 1
      mockState.apartments = 1
      mockState.shops = 1
      mockState.buildings = 1

      const active = getActiveSynergies(mockState)
      expect(active.some(s => s.id === 'diversification')).toBe(true)
    })

    it('전체 수익에 +15% 배수 적용 (all_income)', () => {
      // 모든 상품 보유
      mockState.deposits = 1
      mockState.savings = 1
      mockState.bonds = 1
      mockState.usStocks = 1
      mockState.cryptos = 1
      mockState.villas = 1
      mockState.officetels = 1
      mockState.apartments = 1
      mockState.shops = 1
      mockState.buildings = 1

      // all_income은 모든 타입에 적용
      const finMult = getSynergyMultiplier(mockState, 'financial_income')
      const propMult = getSynergyMultiplier(mockState, 'property_income')

      // Finance Guru (1.25) × Diversification (1.15) = 1.4375
      expect(finMult).toBeCloseTo(1.4375, 2)
      // Real Estate Mogul (1.3) × Diversification (1.15) = 1.495
      expect(propMult).toBeCloseTo(1.495, 2)
    })
  })

  describe('Seoul Ruler 시너지', () => {
    it('빌딩 5개 이상 보유 시 활성화', () => {
      mockState.buildings = 5

      const active = getActiveSynergies(mockState)
      expect(active.some(s => s.id === 'seoul_ruler')).toBe(true)
    })

    it('빌딩 5개 미만 시 비활성화', () => {
      mockState.buildings = 4

      const active = getActiveSynergies(mockState)
      expect(active.some(s => s.id === 'seoul_ruler')).toBe(false)
    })

    it('전체 수익에 +50% 배수 적용', () => {
      mockState.buildings = 5

      const multiplier = getSynergyMultiplier(mockState, 'property_income')
      expect(multiplier).toBe(1.5)
    })
  })

  describe('Completionist 시너지', () => {
    it('모든 업그레이드 구매 시 활성화', () => {
      mockState.__completionistUnlocked = true

      const active = getActiveSynergies(mockState)
      expect(active.some(s => s.id === 'completionist')).toBe(true)
    })

    it('전체 수익에 +100% 배수 적용 (x2)', () => {
      mockState.__completionistUnlocked = true

      const multiplier = getSynergyMultiplier(mockState, 'property_income')
      expect(multiplier).toBe(2.0)
    })
  })

  describe('updateCompletionistSynergy', () => {
    beforeEach(() => {
      // gameState 초기화
      gameState.__completionistUnlocked = false
    })

    it('모든 업그레이드 구매 시 gameState.__completionistUnlocked = true', () => {
      const mockUpgrades = {
        upgrade1: { purchased: true },
        upgrade2: { purchased: true },
        upgrade3: { purchased: true },
      }

      updateCompletionistSynergy(mockUpgrades)

      expect(gameState.__completionistUnlocked).toBe(true)
    })

    it('일부 업그레이드 미구매 시 gameState.__completionistUnlocked = false', () => {
      const mockUpgrades = {
        upgrade1: { purchased: true },
        upgrade2: { purchased: false },
        upgrade3: { purchased: true },
      }

      updateCompletionistSynergy(mockUpgrades)

      expect(gameState.__completionistUnlocked).toBe(false)
    })

    it('빈 업그레이드 객체 시 true (vacuously true)', () => {
      const mockUpgrades = {}

      updateCompletionistSynergy(mockUpgrades)

      // every()는 빈 배열에 대해 true 반환
      expect(gameState.__completionistUnlocked).toBe(true)
    })
  })

  describe('applyPropertySynergyMultiplier', () => {
    it('부동산 왕 시너지 적용 시 기본 수익 x1.3', () => {
      mockState.villas = 1
      mockState.officetels = 1
      mockState.apartments = 1
      mockState.shops = 1
      mockState.buildings = 1

      const baseIncome = 100000
      const result = applyPropertySynergyMultiplier(baseIncome, mockState)
      expect(result).toBe(130000)
    })

    it('시너지 없으면 기본 수익 유지', () => {
      const baseIncome = 100000
      const result = applyPropertySynergyMultiplier(baseIncome, mockState)
      expect(result).toBe(100000)
    })
  })

  describe('applyFinancialSynergyMultiplier', () => {
    it('금융 전문가 시너지 적용 시 기본 수익 x1.25', () => {
      mockState.deposits = 1
      mockState.savings = 1
      mockState.bonds = 1
      mockState.usStocks = 1
      mockState.cryptos = 1

      const baseIncome = 100000
      const result = applyFinancialSynergyMultiplier(baseIncome, mockState)
      expect(result).toBe(125000)
    })
  })

  describe('applyClickSynergyMultiplier', () => {
    it('시너지 없으면 기본 클릭 수익 유지', () => {
      const baseIncome = 10000
      const result = applyClickSynergyMultiplier(baseIncome, mockState)
      expect(result).toBe(10000)
    })

    it('완벽주의자 시너지 활성화 시 클릭 수익 x2', () => {
      mockState.__completionistUnlocked = true

      const baseIncome = 10000
      const result = applyClickSynergyMultiplier(baseIncome, mockState)
      expect(result).toBe(20000)
    })

    it('다각화 + 완벽주의자 시너지 중첩 시 클릭 수익에 all_income 적용', () => {
      // 모든 상품 보유 (다각화)
      mockState.deposits = 1
      mockState.savings = 1
      mockState.bonds = 1
      mockState.usStocks = 1
      mockState.cryptos = 1
      mockState.villas = 1
      mockState.officetels = 1
      mockState.apartments = 1
      mockState.shops = 1
      mockState.buildings = 1
      // 완벽주의자
      mockState.__completionistUnlocked = true

      const baseIncome = 10000
      const result = applyClickSynergyMultiplier(baseIncome, mockState)
      // Diversification (1.15) × Completionist (2.0) = 2.3
      expect(result).toBe(23000)
    })

    it('서울 지배자 시너지 클릭 수익에도 적용 (all_income)', () => {
      mockState.buildings = 5

      const baseIncome = 10000
      const result = applyClickSynergyMultiplier(baseIncome, mockState)
      // Seoul Ruler (1.5)
      expect(result).toBe(15000)
    })
  })

  describe('getSynergyDisplayData', () => {
    it('UI 렌더링용 데이터 반환', () => {
      mockState.buildings = 5 // Seoul Ruler 활성화

      const displayData = getSynergyDisplayData(mockState)
      expect(displayData).toHaveLength(5)

      displayData.forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('nameKey')
        expect(item).toHaveProperty('descKey')
        expect(item).toHaveProperty('icon')
        expect(item).toHaveProperty('active')
        expect(item).toHaveProperty('multiplier')
        expect(item).toHaveProperty('effect')
      })

      const seoulRuler = displayData.find(s => s.id === 'seoul_ruler')
      expect(seoulRuler?.active).toBe(true)
    })
  })

  describe('복합 시너지 시나리오', () => {
    it('부동산 왕 + 다각화 시너지 중첩 (곱연산)', () => {
      // 모든 상품 보유
      mockState.deposits = 1
      mockState.savings = 1
      mockState.bonds = 1
      mockState.usStocks = 1
      mockState.cryptos = 1
      mockState.villas = 1
      mockState.officetels = 1
      mockState.apartments = 1
      mockState.shops = 1
      mockState.buildings = 1

      const multiplier = getSynergyMultiplier(mockState, 'property_income')
      // Real Estate Mogul (1.3) × Diversification (1.15) = 1.495
      expect(multiplier).toBeCloseTo(1.495, 2)
    })

    it('모든 시너지 활성화 시 최대 배수', () => {
      // 모든 상품 보유
      mockState.deposits = 1
      mockState.savings = 1
      mockState.bonds = 1
      mockState.usStocks = 1
      mockState.cryptos = 1
      mockState.villas = 1
      mockState.officetels = 1
      mockState.apartments = 1
      mockState.shops = 1
      mockState.buildings = 10 // Seoul Ruler
      mockState.__completionistUnlocked = true // Completionist

      const multiplier = getSynergyMultiplier(mockState, 'property_income')
      // Real Estate (1.3) × Diversification (1.15) × Seoul Ruler (1.5) × Completionist (2.0)
      // = 4.485
      expect(multiplier).toBeCloseTo(4.485, 2)
    })
  })
})
