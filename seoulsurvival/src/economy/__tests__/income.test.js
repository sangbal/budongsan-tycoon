/**
 * Seoul Survival - Income Module Tests
 *
 * 수익 계산 함수 단위 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// 모킹할 모듈들 (테스트 전에 모킹 설정)
vi.mock('../../systems/synergy.js', () => ({
  getSynergyMultiplier: vi.fn(() => 1),
  applyPropertySynergyMultiplier: vi.fn(income => income),
  applyFinancialSynergyMultiplier: vi.fn(income => income),
}))

vi.mock('../../systems/prestigeBonus.js', () => ({
  getPrestigeMultiplier: vi.fn(() => 1),
}))

// 모킹 후 함수 import
import {
  getFinancialIncome,
  getPropertyIncome,
  getRps,
  getTotalIncomeForContribution,
  getClickIncome,
  getCurrentCareer,
  getNextCareer,
} from '../income.js'

import {
  applyPropertySynergyMultiplier,
  applyFinancialSynergyMultiplier,
} from '../../systems/synergy.js'

import { getPrestigeMultiplier } from '../../systems/prestigeBonus.js'

// 기본 수익값 상수 (balance에서 정의된 값)
const FINANCIAL_INCOME = {
  deposit: 50,
  savings: 750,
  bond: 11_250,
  usStock: 60_000,
  crypto: 250_000,
}

const BASE_RENT = {
  villa: 84_380,
  officetel: 177_190,
  apartment: 607_500,
  shop: 1_370_000,
  building: 5_140_000,
}

describe('getFinancialIncome', () => {
  const mockMarketMultiplier = vi.fn(() => 1)

  beforeEach(() => {
    vi.clearAllMocks()
    mockMarketMultiplier.mockReturnValue(1)
    applyFinancialSynergyMultiplier.mockImplementation(income => income)
    getPrestigeMultiplier.mockReturnValue(1)
  })

  it('예금 1개 보유 시 기본 수익 50원/초', () => {
    const income = getFinancialIncome('deposit', 1, mockMarketMultiplier)
    expect(income).toBe(FINANCIAL_INCOME.deposit)
  })

  it('예금 10개 보유 시 10배 수익', () => {
    const income = getFinancialIncome('deposit', 10, mockMarketMultiplier)
    expect(income).toBe(FINANCIAL_INCOME.deposit * 10)
  })

  it('적금 1개 보유 시 기본 수익 750원/초', () => {
    const income = getFinancialIncome('savings', 1, mockMarketMultiplier)
    expect(income).toBe(FINANCIAL_INCOME.savings)
  })

  it('국내주식 1개 보유 시 기본 수익 11,250원/초', () => {
    const income = getFinancialIncome('bond', 1, mockMarketMultiplier)
    expect(income).toBe(FINANCIAL_INCOME.bond)
  })

  it('미국주식 1개 보유 시 기본 수익 60,000원/초', () => {
    const income = getFinancialIncome('usStock', 1, mockMarketMultiplier)
    expect(income).toBe(FINANCIAL_INCOME.usStock)
  })

  it('코인 1개 보유 시 기본 수익 250,000원/초', () => {
    const income = getFinancialIncome('crypto', 1, mockMarketMultiplier)
    expect(income).toBe(FINANCIAL_INCOME.crypto)
  })

  it('보유 수량 0이면 수익 0', () => {
    const income = getFinancialIncome('deposit', 0, mockMarketMultiplier)
    expect(income).toBe(0)
  })

  it('시장 이벤트 배수 2배 적용', () => {
    mockMarketMultiplier.mockReturnValue(2)
    const income = getFinancialIncome('deposit', 1, mockMarketMultiplier)
    expect(income).toBe(FINANCIAL_INCOME.deposit * 2)
  })

  it('시장 이벤트 배수 0.5배 적용 (하락장)', () => {
    mockMarketMultiplier.mockReturnValue(0.5)
    const income = getFinancialIncome('deposit', 1, mockMarketMultiplier)
    expect(income).toBe(FINANCIAL_INCOME.deposit * 0.5)
  })

  it('시너지 배수 적용', () => {
    applyFinancialSynergyMultiplier.mockImplementation(income => income * 1.5)
    const income = getFinancialIncome('deposit', 1, mockMarketMultiplier)
    expect(income).toBe(FINANCIAL_INCOME.deposit * 1.5)
  })

  it('프레스티지 배수 적용 (auto_income + all_income)', () => {
    getPrestigeMultiplier.mockImplementation(type => {
      if (type === 'auto_income') return 1.2
      if (type === 'all_income') return 1.1
      return 1
    })
    const income = getFinancialIncome('deposit', 1, mockMarketMultiplier)
    expect(income).toBe(FINANCIAL_INCOME.deposit * 1.2 * 1.1)
  })

  it('모든 배수 복합 적용', () => {
    mockMarketMultiplier.mockReturnValue(2) // 시장 2배
    applyFinancialSynergyMultiplier.mockImplementation(income => income * 1.5) // 시너지 1.5배
    getPrestigeMultiplier.mockReturnValue(1.2) // 프레스티지 1.2배 (x2회 = 1.44배)

    const income = getFinancialIncome('deposit', 10, mockMarketMultiplier)
    // 50 * 10 * 2 * 1.5 * 1.2 * 1.2 = 2160
    expect(income).toBe(FINANCIAL_INCOME.deposit * 10 * 2 * 1.5 * 1.2 * 1.2)
  })
})

describe('getPropertyIncome', () => {
  const mockMarketMultiplier = vi.fn(() => 1)

  beforeEach(() => {
    vi.clearAllMocks()
    mockMarketMultiplier.mockReturnValue(1)
    applyPropertySynergyMultiplier.mockImplementation(income => income)
    getPrestigeMultiplier.mockReturnValue(1)
  })

  it('빌라 1개 보유 시 기본 수익 84,380원/초', () => {
    const income = getPropertyIncome('villa', 1, mockMarketMultiplier)
    expect(income).toBe(BASE_RENT.villa)
  })

  it('빌라 5개 보유 시 5배 수익', () => {
    const income = getPropertyIncome('villa', 5, mockMarketMultiplier)
    expect(income).toBe(BASE_RENT.villa * 5)
  })

  it('오피스텔 1개 보유 시 기본 수익 177,190원/초', () => {
    const income = getPropertyIncome('officetel', 1, mockMarketMultiplier)
    expect(income).toBe(BASE_RENT.officetel)
  })

  it('아파트 1개 보유 시 기본 수익 607,500원/초', () => {
    const income = getPropertyIncome('apartment', 1, mockMarketMultiplier)
    expect(income).toBe(BASE_RENT.apartment)
  })

  it('상가 1개 보유 시 기본 수익 1,370,000원/초', () => {
    const income = getPropertyIncome('shop', 1, mockMarketMultiplier)
    expect(income).toBe(BASE_RENT.shop)
  })

  it('빌딩 1개 보유 시 기본 수익 5,140,000원/초', () => {
    const income = getPropertyIncome('building', 1, mockMarketMultiplier)
    expect(income).toBe(BASE_RENT.building)
  })

  it('보유 수량 0이면 수익 0', () => {
    const income = getPropertyIncome('villa', 0, mockMarketMultiplier)
    expect(income).toBe(0)
  })

  it('시장 이벤트 배수 1.5배 적용', () => {
    mockMarketMultiplier.mockReturnValue(1.5)
    const income = getPropertyIncome('villa', 1, mockMarketMultiplier)
    expect(income).toBe(BASE_RENT.villa * 1.5)
  })

  it('시너지 배수 적용', () => {
    applyPropertySynergyMultiplier.mockImplementation(income => income * 2)
    const income = getPropertyIncome('villa', 1, mockMarketMultiplier)
    expect(income).toBe(BASE_RENT.villa * 2)
  })

  it('프레스티지 배수 적용', () => {
    getPrestigeMultiplier.mockReturnValue(1.3)
    const income = getPropertyIncome('villa', 1, mockMarketMultiplier)
    // auto_income 1.3 * all_income 1.3 = 1.69
    expect(income).toBe(BASE_RENT.villa * 1.3 * 1.3)
  })
})

describe('getRps', () => {
  const mockMarketMultiplier = vi.fn(() => 1)

  beforeEach(() => {
    vi.clearAllMocks()
    mockMarketMultiplier.mockReturnValue(1)
    applyFinancialSynergyMultiplier.mockImplementation(income => income)
    applyPropertySynergyMultiplier.mockImplementation(income => income)
    getPrestigeMultiplier.mockReturnValue(1)
  })

  it('아무것도 없으면 수익 0', () => {
    const state = {
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
      marketMultiplier: 1,
    }
    const rps = getRps(state, mockMarketMultiplier)
    expect(rps).toBe(0)
  })

  it('예금 1개만 있으면 50원/초', () => {
    const state = {
      deposits: 1,
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
      marketMultiplier: 1,
    }
    const rps = getRps(state, mockMarketMultiplier)
    expect(rps).toBe(50)
  })

  it('빌라 1개만 있으면 84,380원/초', () => {
    const state = {
      deposits: 0,
      savings: 0,
      bonds: 0,
      usStocks: 0,
      cryptos: 0,
      villas: 1,
      officetels: 0,
      apartments: 0,
      shops: 0,
      buildings: 0,
      rentMultiplier: 1,
      marketMultiplier: 1,
    }
    const rps = getRps(state, mockMarketMultiplier)
    expect(rps).toBe(BASE_RENT.villa)
  })

  it('금융 + 부동산 복합 수익', () => {
    const state = {
      deposits: 10, // 500원
      savings: 0,
      bonds: 0,
      usStocks: 0,
      cryptos: 0,
      villas: 1, // 84,380원
      officetels: 0,
      apartments: 0,
      shops: 0,
      buildings: 0,
      rentMultiplier: 1,
      marketMultiplier: 1,
    }
    const rps = getRps(state, mockMarketMultiplier)
    expect(rps).toBe(500 + BASE_RENT.villa)
  })

  it('rentMultiplier 적용 (부동산만)', () => {
    const state = {
      deposits: 10, // 500원 (rentMultiplier 미적용)
      savings: 0,
      bonds: 0,
      usStocks: 0,
      cryptos: 0,
      villas: 1, // 84,380원 * 2 = 168,760원
      officetels: 0,
      apartments: 0,
      shops: 0,
      buildings: 0,
      rentMultiplier: 2,
      marketMultiplier: 1,
    }
    const rps = getRps(state, mockMarketMultiplier)
    expect(rps).toBe(500 + BASE_RENT.villa * 2)
  })

  it('marketMultiplier 적용 (전체)', () => {
    const state = {
      deposits: 10, // 500원
      savings: 0,
      bonds: 0,
      usStocks: 0,
      cryptos: 0,
      villas: 1, // 84,380원
      officetels: 0,
      apartments: 0,
      shops: 0,
      buildings: 0,
      rentMultiplier: 1,
      marketMultiplier: 2, // 전체 2배
    }
    const rps = getRps(state, mockMarketMultiplier)
    expect(rps).toBe((500 + BASE_RENT.villa) * 2)
  })

  it('모든 금융상품 보유 시 총 수익', () => {
    const state = {
      deposits: 1, // 50
      savings: 1, // 750
      bonds: 1, // 11,250
      usStocks: 1, // 60,000
      cryptos: 1, // 250,000
      villas: 0,
      officetels: 0,
      apartments: 0,
      shops: 0,
      buildings: 0,
      rentMultiplier: 1,
      marketMultiplier: 1,
    }
    const rps = getRps(state, mockMarketMultiplier)
    const expected = 50 + 750 + 11_250 + 60_000 + 250_000
    expect(rps).toBe(expected)
  })

  it('모든 부동산 보유 시 총 수익', () => {
    const state = {
      deposits: 0,
      savings: 0,
      bonds: 0,
      usStocks: 0,
      cryptos: 0,
      villas: 1, // 84,380
      officetels: 1, // 177,190
      apartments: 1, // 607,500
      shops: 1, // 1,370,000
      buildings: 1, // 5,140,000
      rentMultiplier: 1,
      marketMultiplier: 1,
    }
    const rps = getRps(state, mockMarketMultiplier)
    const expected = 84_380 + 177_190 + 607_500 + 1_370_000 + 5_140_000
    expect(rps).toBe(expected)
  })
})

describe('getTotalIncomeForContribution', () => {
  const mockMarketMultiplier = vi.fn(() => 1)

  beforeEach(() => {
    vi.clearAllMocks()
    mockMarketMultiplier.mockReturnValue(1)
    applyFinancialSynergyMultiplier.mockImplementation(income => income)
    applyPropertySynergyMultiplier.mockImplementation(income => income)
    getPrestigeMultiplier.mockReturnValue(1)
  })

  it('marketMultiplier 미적용 확인', () => {
    const state = {
      deposits: 10,
      savings: 0,
      bonds: 0,
      usStocks: 0,
      cryptos: 0,
      villas: 1,
      officetels: 0,
      apartments: 0,
      shops: 0,
      buildings: 0,
      rentMultiplier: 1,
      marketMultiplier: 10, // 이 값은 무시되어야 함
    }
    const total = getTotalIncomeForContribution(state, mockMarketMultiplier)
    // marketMultiplier 미적용
    expect(total).toBe(500 + BASE_RENT.villa)
  })

  it('rentMultiplier는 적용됨', () => {
    const state = {
      deposits: 0,
      savings: 0,
      bonds: 0,
      usStocks: 0,
      cryptos: 0,
      villas: 1,
      officetels: 0,
      apartments: 0,
      shops: 0,
      buildings: 0,
      rentMultiplier: 2, // 이 값은 적용되어야 함
      marketMultiplier: 1,
    }
    const total = getTotalIncomeForContribution(state, mockMarketMultiplier)
    expect(total).toBe(BASE_RENT.villa * 2)
  })
})

describe('getClickIncome', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getPrestigeMultiplier.mockReturnValue(1)
  })

  it('직급 0 (알바), 배수 1일 때 기본 클릭 수익', () => {
    const income = getClickIncome(0, 1)
    // BASE_CLICK_GAIN * CAREER_LEVELS[0].multiplier * 1 * 1
    // 10000 * 1 * 1 * 1 = 10000
    expect(income).toBe(10_000)
  })

  it('직급 0, 클릭 배수 2배 적용', () => {
    const income = getClickIncome(0, 2)
    expect(income).toBe(20_000)
  })

  it('직급 1 (계약직) 배수 적용', () => {
    const income = getClickIncome(1, 1)
    // 직급 1의 multiplier = 1.5
    expect(income).toBe(15_000)
  })

  it('프레스티지 click_power 배수 적용', () => {
    getPrestigeMultiplier.mockReturnValue(2)
    const income = getClickIncome(0, 1)
    expect(income).toBe(20_000)
  })

  it('모든 배수 복합 적용', () => {
    getPrestigeMultiplier.mockReturnValue(1.5)
    const income = getClickIncome(1, 2)
    // 10000 * 1.5 (직급) * 2 (클릭배수) * 1.5 (프레스티지)
    expect(income).toBe(Math.floor(10_000 * 1.5 * 2 * 1.5))
  })

  it('높은 직급 (CEO) 테스트', () => {
    const income = getClickIncome(9, 1) // 직급 9 = CEO
    // CEO multiplier = 12
    expect(income).toBe(120_000)
  })
})

describe('getCurrentCareer', () => {
  it('직급 0은 알바', () => {
    const career = getCurrentCareer(0)
    expect(career.nameKey).toBe('career.alba')
    expect(career.multiplier).toBe(1)
  })

  it('직급 1은 계약직', () => {
    const career = getCurrentCareer(1)
    expect(career.nameKey).toBe('career.contract')
    expect(career.multiplier).toBe(1.5)
  })

  it('직급 9는 CEO', () => {
    const career = getCurrentCareer(9)
    expect(career.nameKey).toBe('career.ceo')
    expect(career.multiplier).toBe(12)
  })

  it('각 직급별 클릭 요구량 확인', () => {
    const career0 = getCurrentCareer(0)
    expect(career0.requiredClicks).toBe(0)

    const career1 = getCurrentCareer(1)
    expect(career1.requiredClicks).toBe(100)

    const career2 = getCurrentCareer(2)
    expect(career2.requiredClicks).toBe(300)
  })
})

describe('getNextCareer', () => {
  it('직급 0의 다음은 직급 1', () => {
    const next = getNextCareer(0)
    expect(next).not.toBeNull()
    expect(next.nameKey).toBe('career.contract')
  })

  it('직급 8의 다음은 직급 9 (CEO)', () => {
    const next = getNextCareer(8)
    expect(next).not.toBeNull()
    expect(next.nameKey).toBe('career.ceo')
  })

  it('최고 직급 (9)의 다음은 null', () => {
    const next = getNextCareer(9)
    expect(next).toBeNull()
  })

  it('다음 직급 승진 요구 클릭 수 확인', () => {
    const next = getNextCareer(0)
    expect(next.requiredClicks).toBe(100)
  })
})
