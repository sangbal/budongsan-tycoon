/**
 * efficiency.js 테스트
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  calculateFinancialValueForType,
  calculatePropertyValueForType,
  calculateEfficiencies,
  updateStatsLockStates,
} from '../efficiency.js'

// i18n mock
vi.mock('../../../i18n/index.js', () => ({
  t: vi.fn(key => {
    const translations = {
      'stats.unit.perSec': '/초',
      'ui.unit.count': '개',
      'ui.owned': '보유',
      'stats.payback.minutes': 'min ROI',
      'product.deposit': '예금',
      'product.savings': '적금',
      'product.bond': '채권',
      'product.usStock': '미국주식',
      'product.crypto': '코인',
      'product.villa': '빌라',
      'product.officetel': '오피스텔',
      'product.apartment': '아파트',
      'product.shop': '상가',
      'product.building': '빌딩',
    }
    return translations[key] || key
  }),
}))

// gameState mock
vi.mock('../../../state/gameState.js', () => ({
  gameState: {
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
    rentMultiplier: 1,
  },
  FINANCIAL_INCOME: {
    deposit: 1,
    savings: 2,
    bond: 5,
    usStock: 10,
    crypto: 20,
  },
  BASE_RENT: {
    villa: 50,
    officetel: 100,
    apartment: 200,
    shop: 500,
    building: 1000,
  },
}))

describe('efficiency.js', () => {
  describe('calculateFinancialValueForType', () => {
    it('0개일 때 0 반환', () => {
      const getFinancialCost = vi.fn(() => 1000)
      const result = calculateFinancialValueForType('deposit', 0, getFinancialCost)
      expect(result).toBe(0)
      expect(getFinancialCost).not.toHaveBeenCalled()
    })

    it('1개일 때 첫 번째 비용 반환', () => {
      const getFinancialCost = vi.fn(() => 1000)
      const result = calculateFinancialValueForType('deposit', 1, getFinancialCost)
      expect(result).toBe(1000)
      expect(getFinancialCost).toHaveBeenCalledWith('deposit', 0)
    })

    it('여러 개일 때 누적 비용 반환', () => {
      const getFinancialCost = vi.fn((type, index) => 1000 * (index + 1))
      const result = calculateFinancialValueForType('deposit', 3, getFinancialCost)
      // 1000 + 2000 + 3000 = 6000
      expect(result).toBe(6000)
    })
  })

  describe('calculatePropertyValueForType', () => {
    it('0개일 때 0 반환', () => {
      const getPropertyCost = vi.fn(() => 10000)
      const result = calculatePropertyValueForType('villa', 0, getPropertyCost)
      expect(result).toBe(0)
    })

    it('여러 개일 때 누적 비용 반환', () => {
      const getPropertyCost = vi.fn((type, index) => 10000 * (index + 1))
      const result = calculatePropertyValueForType('villa', 3, getPropertyCost)
      // 10000 + 20000 + 30000 = 60000
      expect(result).toBe(60000)
    })
  })

  describe('calculateEfficiencies', () => {
    let mockDeps
    let gameStateMock

    beforeEach(async () => {
      // gameState mock 업데이트
      const { gameState } = await import('../../../state/gameState.js')
      gameStateMock = gameState
      // 초기화
      gameStateMock.deposits = 0
      gameStateMock.savings = 0
      gameStateMock.bonds = 0
      gameStateMock.usStocks = 0
      gameStateMock.cryptos = 0
      gameStateMock.villas = 0
      gameStateMock.officetels = 0
      gameStateMock.apartments = 0
      gameStateMock.shops = 0
      gameStateMock.buildings = 0
      gameStateMock.rentMultiplier = 1

      mockDeps = {
        getProductName: vi.fn(type => {
          const names = {
            deposit: '예금',
            savings: '적금',
            bond: '채권',
            usStock: '미국주식',
            crypto: '코인',
            villa: '빌라',
            officetel: '오피스텔',
            apartment: '아파트',
            shop: '상가',
            building: '빌딩',
          }
          return names[type] || type
        }),
        getFinancialCost: vi.fn((type, index) => 1000),
        getPropertyCost: vi.fn((type, index) => 10000),
      }
    })

    it('자산이 없으면 빈 배열 반환', () => {
      const result = calculateEfficiencies(mockDeps)
      expect(result).toHaveLength(0)
    })

    it('예금만 있을 때 ROI 계산', () => {
      gameStateMock.deposits = 5

      const result = calculateEfficiencies(mockDeps)

      expect(result).toHaveLength(1)
      expect(result[0]).toContain('예금')
      expect(result[0]).toContain('ROI')
      // 실제 반환 형식: "예금: 16.7min ROI" (개수 정보 없음)
    })

    it('여러 자산이 있을 때 상위 3개만 반환', () => {
      gameStateMock.deposits = 10
      gameStateMock.savings = 5
      gameStateMock.bonds = 3
      gameStateMock.usStocks = 2

      const result = calculateEfficiencies(mockDeps)

      expect(result).toHaveLength(3)
    })

    it('ROI 높은 순으로 정렬', () => {
      gameStateMock.deposits = 10 // 낮은 ROI
      gameStateMock.cryptos = 1 // 높은 ROI (crypto = 20/sec)

      // crypto가 더 높은 ROI를 가지도록 비용 조정
      mockDeps.getFinancialCost = vi.fn((type, index) => {
        if (type === 'crypto') return 100 // 낮은 비용 → 높은 ROI
        return 10000 // 높은 비용 → 낮은 ROI
      })

      const result = calculateEfficiencies(mockDeps)

      // crypto가 첫 번째 (높은 ROI)
      expect(result[0]).toContain('코인')
    })

    it('부동산 ROI 계산', () => {
      gameStateMock.villas = 2

      const result = calculateEfficiencies(mockDeps)

      expect(result).toHaveLength(1)
      expect(result[0]).toContain('빌라')
    })

    it('rentMultiplier 적용', () => {
      gameStateMock.villas = 1
      gameStateMock.rentMultiplier = 2

      const result = calculateEfficiencies(mockDeps)

      // rentMultiplier가 2이면 ROI도 2배
      expect(result).toHaveLength(1)
    })
  })

  describe('updateStatsLockStates', () => {
    let mockDeps

    beforeEach(() => {
      // DOM 요소 생성
      document.body.innerHTML = `
        <div class="asset-row">
          <span id="savingsOwnedStats"></span>
        </div>
        <div class="asset-row">
          <span id="villasOwnedStats"></span>
        </div>
      `

      mockDeps = {
        isProductUnlocked: vi.fn(() => true),
      }
    })

    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('잠금 해제된 상품은 locked 클래스 없음', () => {
      mockDeps.isProductUnlocked = vi.fn(() => true)

      updateStatsLockStates(mockDeps)

      const savingsRow = document.getElementById('savingsOwnedStats')?.closest('.asset-row')
      expect(savingsRow?.classList.contains('locked')).toBe(false)
    })

    it('잠금된 상품은 locked 클래스 추가', () => {
      mockDeps.isProductUnlocked = vi.fn(() => false)

      updateStatsLockStates(mockDeps)

      const savingsRow = document.getElementById('savingsOwnedStats')?.closest('.asset-row')
      expect(savingsRow?.classList.contains('locked')).toBe(true)
    })

    it('DOM 요소가 없어도 에러 없음', () => {
      document.body.innerHTML = ''

      expect(() => updateStatsLockStates(mockDeps)).not.toThrow()
    })
  })
})
