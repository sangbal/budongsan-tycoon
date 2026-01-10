/**
 * Seoul Survival - Pricing Module Tests
 *
 * 가격 계산 함수 단위 테스트
 */

import { describe, it, expect } from 'vitest'
import {
  getFinancialCost,
  getPropertyCost,
  getFinancialSellPrice,
  getPropertySellPrice,
  getPriceMultiplierByTier,
} from '../pricing.js'

describe('getFinancialCost', () => {
  it('첫 예금 구매 가격은 50,000원', () => {
    const cost = getFinancialCost('deposit', 0, 1)
    expect(cost).toBe(50_000)
  })

  it('두 번째 예금 가격은 성장률 적용 (1.05배)', () => {
    const cost = getFinancialCost('deposit', 1, 1)
    expect(cost).toBe(Math.floor(50_000 * 1.05))
  })

  it('10개 일괄 구매 시 누적 계산', () => {
    const cost = getFinancialCost('deposit', 0, 10)
    // 실제 pricing.js의 sumGeometricCost 로직과 동일하게 계산
    let expected = 0
    for (let i = 0; i < 10; i++) {
      expected += 50_000 * Math.pow(1.05, i)
    }
    expected = Math.floor(expected)
    expect(cost).toBe(expected)
  })

  it('적금 첫 구매 가격은 500,000원', () => {
    const cost = getFinancialCost('savings', 0, 1)
    expect(cost).toBe(500_000)
  })

  it('잘못된 타입은 0원 반환', () => {
    expect(getFinancialCost('invalid', 0, 1)).toBe(0)
  })

  it('수량이 0 이하면 0원 반환', () => {
    expect(getFinancialCost('deposit', 0, 0)).toBe(0)
    expect(getFinancialCost('deposit', 0, -1)).toBe(0)
  })

  it('기존 보유량이 높을수록 가격 상승', () => {
    const cost1 = getFinancialCost('deposit', 0, 1)
    const cost2 = getFinancialCost('deposit', 10, 1)
    expect(cost2).toBeGreaterThan(cost1)
  })
})

describe('getPropertyCost', () => {
  it('첫 빌라 구매 가격은 250,000,000원 (2.5억)', () => {
    const cost = getPropertyCost('villa', 0, 1)
    expect(cost).toBe(250_000_000)
  })

  it('부동산도 성장률 적용', () => {
    const cost = getPropertyCost('villa', 1, 1)
    expect(cost).toBe(Math.floor(250_000_000 * 1.05))
  })

  it('오피스텔 첫 구매 가격은 350,000,000원 (3.5억)', () => {
    const cost = getPropertyCost('officetel', 0, 1)
    expect(cost).toBe(350_000_000)
  })

  it('잘못된 타입은 0원 반환', () => {
    expect(getPropertyCost('invalid', 0, 1)).toBe(0)
  })

  it('수량이 0 이하면 0원 반환', () => {
    expect(getPropertyCost('villa', 0, 0)).toBe(0)
  })
})

describe('getFinancialSellPrice', () => {
  it('예금 1개 판매 시 100% 환급', () => {
    const buyCost = getFinancialCost('deposit', 0, 1)
    const sellPrice = getFinancialSellPrice('deposit', 1, 1)
    expect(sellPrice).toBe(buyCost)
  })

  it('예금 10개 일괄 판매', () => {
    const sellPrice = getFinancialSellPrice('deposit', 10, 10)
    expect(sellPrice).toBeGreaterThan(0)
  })

  it('보유량이 0이면 판매 가격 0', () => {
    const sellPrice = getFinancialSellPrice('deposit', 0, 1)
    expect(sellPrice).toBe(0)
  })

  it('판매 수량이 0이면 0원', () => {
    const sellPrice = getFinancialSellPrice('deposit', 10, 0)
    expect(sellPrice).toBe(0)
  })

  it('보유량보다 많이 판매 시도 시 보유량만큼만 계산', () => {
    const sellPrice = getFinancialSellPrice('deposit', 5, 10)
    expect(sellPrice).toBeGreaterThan(0)
    expect(sellPrice).toBeLessThan(getFinancialCost('deposit', 0, 10))
  })
})

describe('getPropertySellPrice', () => {
  it('빌라 1개 판매 시 100% 환급 (PROPERTY_SELL_RATE = 1.0)', () => {
    const buyCost = getPropertyCost('villa', 0, 1)
    const sellPrice = getPropertySellPrice('villa', 1, 1)
    // PROPERTY_SELL_RATE가 1.0이므로 100% 환급
    expect(sellPrice).toBe(Math.floor(buyCost * 1.0))
  })

  it('보유량이 0이면 판매 가격 0', () => {
    const sellPrice = getPropertySellPrice('villa', 0, 1)
    expect(sellPrice).toBe(0)
  })

  it('판매 수량이 0이면 0원', () => {
    const sellPrice = getPropertySellPrice('villa', 10, 0)
    expect(sellPrice).toBe(0)
  })
})

describe('getPriceMultiplierByTier', () => {
  it('0~4개: 1.05배', () => {
    expect(getPriceMultiplierByTier(0)).toBe(1.05)
    expect(getPriceMultiplierByTier(4)).toBe(1.05)
  })

  it('5~14개: 1.1배', () => {
    expect(getPriceMultiplierByTier(5)).toBe(1.1)
    expect(getPriceMultiplierByTier(14)).toBe(1.1)
  })

  it('15~29개: 1.15배', () => {
    expect(getPriceMultiplierByTier(15)).toBe(1.15)
    expect(getPriceMultiplierByTier(29)).toBe(1.15)
  })

  it('30개 이상: 1.2배', () => {
    expect(getPriceMultiplierByTier(30)).toBe(1.2)
    expect(getPriceMultiplierByTier(100)).toBe(1.2)
  })
})
