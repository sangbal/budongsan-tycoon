/**
 * Asset Calculator Module Tests
 *
 * 자산 계산 로직 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAssetCalculator } from '../assetCalculator.js'
import * as pricing from '../pricing.js'

// pricing 모듈 모킹
vi.mock('../pricing.js', () => ({
  getFinancialCost: vi.fn(),
  getPropertyCost: vi.fn(),
}))

describe('createAssetCalculator', () => {
  let gameState
  let assetCalculator

  beforeEach(() => {
    // 게임 상태 초기화
    gameState = {
      cash: 1000,
      deposits: 5,
      savings: 3,
      bonds: 2,
      usStocks: 1,
      cryptos: 0,
      villas: 4,
      officetels: 2,
      apartments: 1,
      shops: 0,
      buildings: 0,
    }

    // assetCalculator 생성
    assetCalculator = createAssetCalculator({ gameState })

    // 모킹 초기화
    vi.clearAllMocks()

    // getFinancialCost 기본 동작 설정 (인덱스 기반 선형 증가)
    pricing.getFinancialCost.mockImplementation((type, index) => {
      const baseCosts = {
        deposit: 100,
        savings: 200,
        bond: 500,
        usStock: 1000,
        crypto: 5000,
      }
      return baseCosts[type] ? baseCosts[type] * (index + 1) : 0
    })

    // getPropertyCost 기본 동작 설정
    pricing.getPropertyCost.mockImplementation((type, index) => {
      const baseCosts = {
        villa: 10000,
        officetel: 25000,
        apartment: 50000,
        shop: 100000,
        building: 500000,
        tower: 1000000000000,
      }
      return baseCosts[type] ? baseCosts[type] * (index + 1) : 0
    })
  })

  describe('calculateFinancialValueForType', () => {
    it('금융상품 타입별 가치를 정확히 계산한다', () => {
      const result = assetCalculator.calculateFinancialValueForType('deposit', 3)
      // deposit: 100*1 + 100*2 + 100*3 = 600
      expect(result).toBe(600)
      expect(pricing.getFinancialCost).toHaveBeenCalledTimes(3)
    })

    it('보유 수량이 0일 때 0을 반환한다', () => {
      const result = assetCalculator.calculateFinancialValueForType('deposit', 0)
      expect(result).toBe(0)
      expect(pricing.getFinancialCost).not.toHaveBeenCalled()
    })

    it('다양한 금융상품 타입을 처리한다', () => {
      const depositValue = assetCalculator.calculateFinancialValueForType('deposit', 2)
      const savingsValue = assetCalculator.calculateFinancialValueForType('savings', 2)
      const bondValue = assetCalculator.calculateFinancialValueForType('bond', 2)

      // deposit: 100*1 + 100*2 = 300
      expect(depositValue).toBe(300)
      // savings: 200*1 + 200*2 = 600
      expect(savingsValue).toBe(600)
      // bond: 500*1 + 500*2 = 1500
      expect(bondValue).toBe(1500)
    })
  })

  describe('calculatePropertyValueForType', () => {
    it('부동산 타입별 가치를 정확히 계산한다', () => {
      const result = assetCalculator.calculatePropertyValueForType('villa', 3)
      // villa: 10000*1 + 10000*2 + 10000*3 = 60000
      expect(result).toBe(60000)
      expect(pricing.getPropertyCost).toHaveBeenCalledTimes(3)
    })

    it('보유 수량이 0일 때 0을 반환한다', () => {
      const result = assetCalculator.calculatePropertyValueForType('villa', 0)
      expect(result).toBe(0)
      expect(pricing.getPropertyCost).not.toHaveBeenCalled()
    })

    it('다양한 부동산 타입을 처리한다', () => {
      const villaValue = assetCalculator.calculatePropertyValueForType('villa', 2)
      const officetelValue = assetCalculator.calculatePropertyValueForType('officetel', 2)

      // villa: 10000*1 + 10000*2 = 30000
      expect(villaValue).toBe(30000)
      // officetel: 25000*1 + 25000*2 = 75000
      expect(officetelValue).toBe(75000)
    })
  })

  describe('calculateFinancialValue', () => {
    it('모든 금융상품의 총 가치를 계산한다', () => {
      const result = assetCalculator.calculateFinancialValue()

      // deposits(5): 100*1 + 100*2 + 100*3 + 100*4 + 100*5 = 1500
      // savings(3): 200*1 + 200*2 + 200*3 = 1200
      // bonds(2): 500*1 + 500*2 = 1500
      // usStocks(1): 1000*1 = 1000
      // cryptos(0): 0
      // Total: 1500 + 1200 + 1500 + 1000 + 0 = 5200
      expect(result).toBe(5200)
    })

    it('금융상품이 없을 때 0을 반환한다', () => {
      gameState.deposits = 0
      gameState.savings = 0
      gameState.bonds = 0
      gameState.usStocks = 0
      gameState.cryptos = 0

      const result = assetCalculator.calculateFinancialValue()
      expect(result).toBe(0)
    })
  })

  describe('calculatePropertyValue', () => {
    it('모든 부동산의 총 가치를 계산한다', () => {
      const result = assetCalculator.calculatePropertyValue()

      // villas(4): 10000*(1+2+3+4) = 100000
      // officetels(2): 25000*(1+2) = 75000
      // apartments(1): 50000*1 = 50000
      // shops(0): 0
      // buildings(0): 0
      // Total: 100000 + 75000 + 50000 = 225000
      expect(result).toBe(225000)
    })

    it('부동산이 없을 때 0을 반환한다', () => {
      gameState.villas = 0
      gameState.officetels = 0
      gameState.apartments = 0
      gameState.shops = 0
      gameState.buildings = 0

      const result = assetCalculator.calculatePropertyValue()
      expect(result).toBe(0)
    })
  })

  describe('calculateTotalAssetValue', () => {
    it('금융상품 + 부동산 총 가치를 계산한다', () => {
      const result = assetCalculator.calculateTotalAssetValue()

      // Financial: 5200 (위 calculateFinancialValue 테스트 참조)
      // Property: 225000 (위 calculatePropertyValue 테스트 참조)
      // Total: 5200 + 225000 = 230200
      expect(result).toBe(230200)
    })
  })

  describe('getTotalAssets', () => {
    it('현금 + 자산 가치 총합을 계산한다', () => {
      const result = assetCalculator.getTotalAssets()

      // Cash: 1000
      // Assets: 230200 (위 calculateTotalAssetValue 테스트 참조)
      // Total: 1000 + 230200 = 231200
      expect(result).toBe(231200)
    })

    it('현금만 있을 때 정확히 계산한다', () => {
      gameState.deposits = 0
      gameState.savings = 0
      gameState.bonds = 0
      gameState.usStocks = 0
      gameState.cryptos = 0
      gameState.villas = 0
      gameState.officetels = 0
      gameState.apartments = 0
      gameState.shops = 0
      gameState.buildings = 0

      const result = assetCalculator.getTotalAssets()
      expect(result).toBe(1000) // 현금만
    })
  })

  describe('calculateTotalAssetValueFromSave', () => {
    it('저장 데이터로부터 총 자산을 계산한다', () => {
      const saveData = {
        cash: 5000,
        deposits: 2,
        savings: 1,
        bonds: 0,
        usStocks: 1,
        cryptos: 0,
        villas: 1,
        officetels: 0,
        apartments: 0,
        shops: 0,
        buildings: 0,
        towers_run: 0,
      }

      const result = assetCalculator.calculateTotalAssetValueFromSave(saveData)

      // Cash: 5000
      // deposits(2): 100*(1+2) = 300
      // savings(1): 200*1 = 200
      // usStocks(1): 1000*1 = 1000
      // villas(1): 10000*1 = 10000
      // Total: 5000 + 300 + 200 + 1000 + 10000 = 16500
      expect(result).toBe(16500)
    })

    it('저장 데이터가 null일 때 0을 반환한다', () => {
      const result = assetCalculator.calculateTotalAssetValueFromSave(null)
      expect(result).toBe(0)
    })

    it('저장 데이터가 undefined일 때 0을 반환한다', () => {
      const result = assetCalculator.calculateTotalAssetValueFromSave(undefined)
      expect(result).toBe(0)
    })

    it('타워를 포함한 자산을 계산한다', () => {
      const saveData = {
        cash: 0,
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
        towers_run: 1,
      }

      const result = assetCalculator.calculateTotalAssetValueFromSave(saveData)

      // tower(1): 1000000000000*1 = 1000000000000
      expect(result).toBe(1000000000000)
    })

    it('누락된 필드를 0으로 처리한다', () => {
      const saveData = {
        cash: 1000,
        // 다른 필드들이 없음
      }

      const result = assetCalculator.calculateTotalAssetValueFromSave(saveData)
      expect(result).toBe(1000) // 현금만
    })
  })

  describe('calculatePlayTimeMsFromSave', () => {
    it('저장 데이터로부터 플레이타임을 계산한다', () => {
      const saveData = {
        totalPlayTime: 10000,
        sessionStartTime: Date.now() - 5000,
      }
      const sessionStartTime = Date.now()

      const result = assetCalculator.calculatePlayTimeMsFromSave(saveData, sessionStartTime)

      // totalPlayTime + currentSessionTime
      // 10000 + (현재 시간 - sessionStartTime)
      // currentSessionTime이 음수가 나올 수 있으므로 Math.max(0, ...)로 처리됨
      expect(result).toBeGreaterThanOrEqual(10000)
    })

    it('저장 데이터가 null일 때 0을 반환한다', () => {
      const result = assetCalculator.calculatePlayTimeMsFromSave(null, Date.now())
      expect(result).toBe(0)
    })

    it('누락된 필드를 기본값으로 처리한다', () => {
      const saveData = {}
      const sessionStartTime = Date.now()

      const result = assetCalculator.calculatePlayTimeMsFromSave(saveData, sessionStartTime)

      // totalPlayTime: 0 (기본값)
      // sessionStartTime: Date.now() (기본값)
      // currentSessionTime: 0에 가까움
      expect(result).toBeGreaterThanOrEqual(0)
    })

    it('sessionStartTime이 없을 때 저장된 값을 사용한다', () => {
      const savedSessionStart = Date.now() - 1000
      const saveData = {
        totalPlayTime: 5000,
        sessionStartTime: savedSessionStart,
      }

      const result = assetCalculator.calculatePlayTimeMsFromSave(saveData, null)

      // totalPlayTime + (현재 시간 - savedSessionStart)
      expect(result).toBeGreaterThanOrEqual(5000)
    })

    it('음수 세션 시간을 0으로 처리한다', () => {
      const saveData = {
        totalPlayTime: 1000,
        sessionStartTime: Date.now() + 10000, // 미래 시간
      }

      const result = assetCalculator.calculatePlayTimeMsFromSave(saveData, Date.now() + 5000)

      // currentSessionTime이 음수가 되므로 Math.max(0, ...)로 0 처리
      expect(result).toBe(1000) // totalPlayTime만
    })
  })
})
