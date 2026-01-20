/**
 * Seoul Survival - Game State Tests
 *
 * 게임 상태 관리 모듈 단위 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  gameState,
  getTotalFinancialProducts,
  getTotalProperties,
  resetIncomeTablesToDefault,
  reapplyIncomeTableAffectingUpgradeEffects,
  FINANCIAL_INCOME,
  BASE_RENT,
  CAREER_LEVELS,
  SAVE_KEY,
  SETTINGS_KEY,
  CLOUD_RESTORE_BLOCK_KEY,
  CLOUD_RESTORE_SKIP_KEY,
  BASE_CLICK_GAIN,
} from '../gameState.js'

describe('gameState 초기 상태', () => {
  it('초기 cash는 0', () => {
    expect(gameState.cash).toBe(0)
  })

  it('초기 예금은 0', () => {
    expect(gameState.deposits).toBe(0)
  })

  it('초기 빌라는 0', () => {
    expect(gameState.villas).toBe(0)
  })

  it('초기 purchaseQuantity는 1', () => {
    expect(gameState.purchaseQuantity).toBe(1)
  })

  it('초기 purchaseMode는 buy', () => {
    expect(gameState.purchaseMode).toBe('buy')
  })

  it('초기 careerLevel은 0 (알바생)', () => {
    expect(gameState.careerLevel).toBe(0)
  })

  it('초기 clickMultiplier는 1', () => {
    expect(gameState.clickMultiplier).toBe(1)
  })

  it('초기 rentMultiplier는 1', () => {
    expect(gameState.rentMultiplier).toBe(1)
  })

  it('초기 marketMultiplier는 1.0', () => {
    expect(gameState.marketMultiplier).toBe(1.0)
  })

  it('초기 예금만 해금', () => {
    expect(gameState.unlockedProducts.deposit).toBe(true)
    expect(gameState.unlockedProducts.savings).toBe(false)
    expect(gameState.unlockedProducts.villa).toBe(false)
  })
})

describe('getTotalFinancialProducts', () => {
  beforeEach(() => {
    // 테스트 전 초기화
    gameState.deposits = 0
    gameState.savings = 0
    gameState.bonds = 0
    gameState.usStocks = 0
    gameState.cryptos = 0
  })

  it('모두 0이면 0 반환', () => {
    expect(getTotalFinancialProducts()).toBe(0)
  })

  it('예금 1개 보유 시 1', () => {
    gameState.deposits = 1
    expect(getTotalFinancialProducts()).toBe(1)
  })

  it('여러 금융상품 보유 시 합계', () => {
    gameState.deposits = 5
    gameState.savings = 3
    gameState.bonds = 2
    expect(getTotalFinancialProducts()).toBe(10)
  })

  it('모든 금융상품 보유 시 합계', () => {
    gameState.deposits = 10
    gameState.savings = 20
    gameState.bonds = 30
    gameState.usStocks = 40
    gameState.cryptos = 50
    expect(getTotalFinancialProducts()).toBe(150)
  })
})

describe('getTotalProperties', () => {
  beforeEach(() => {
    gameState.villas = 0
    gameState.officetels = 0
    gameState.apartments = 0
    gameState.shops = 0
    gameState.buildings = 0
  })

  it('모두 0이면 0 반환', () => {
    expect(getTotalProperties()).toBe(0)
  })

  it('빌라 1개 보유 시 1', () => {
    gameState.villas = 1
    expect(getTotalProperties()).toBe(1)
  })

  it('여러 부동산 보유 시 합계', () => {
    gameState.villas = 2
    gameState.officetels = 3
    gameState.apartments = 5
    expect(getTotalProperties()).toBe(10)
  })

  it('모든 부동산 보유 시 합계', () => {
    gameState.villas = 10
    gameState.officetels = 20
    gameState.apartments = 30
    gameState.shops = 40
    gameState.buildings = 50
    expect(getTotalProperties()).toBe(150)
  })
})

describe('resetIncomeTablesToDefault', () => {
  it('수익 테이블을 초기값으로 리셋', () => {
    // 수익 테이블 임의 변경
    FINANCIAL_INCOME.deposit = 99999

    // 리셋 실행
    resetIncomeTablesToDefault()

    // 원래 값으로 복구되었는지 확인 (DEFAULT_FINANCIAL_INCOME.deposit = 50)
    expect(FINANCIAL_INCOME.deposit).toBe(50)
  })

  it('BASE_RENT도 리셋', () => {
    BASE_RENT.villa = 99999
    resetIncomeTablesToDefault()
    // DEFAULT_BASE_RENT.villa = 84_380
    expect(BASE_RENT.villa).toBe(84_380)
  })
})

describe('CAREER_LEVELS', () => {
  it('총 10개 직급 존재', () => {
    expect(CAREER_LEVELS.length).toBe(10)
  })

  it('첫 직급은 알바생', () => {
    expect(CAREER_LEVELS[0].nameKey).toBe('career.alba')
    expect(CAREER_LEVELS[0].multiplier).toBe(1)
    expect(CAREER_LEVELS[0].requiredClicks).toBe(0)
  })

  it('마지막 직급은 CEO', () => {
    expect(CAREER_LEVELS[9].nameKey).toBe('career.ceo')
    // CEO multiplier는 12 (12만원/클릭)
    expect(CAREER_LEVELS[9].multiplier).toBe(12)
  })

  it('모든 직급에 bgImage 속성 존재', () => {
    CAREER_LEVELS.forEach(level => {
      expect(level.bgImage).toBeDefined()
      expect(typeof level.bgImage).toBe('string')
    })
  })

  it('직급별 multiplier 증가', () => {
    for (let i = 1; i < CAREER_LEVELS.length; i++) {
      expect(CAREER_LEVELS[i].multiplier).toBeGreaterThan(CAREER_LEVELS[i - 1].multiplier)
    }
  })

  it('직급별 requiredClicks 증가', () => {
    for (let i = 1; i < CAREER_LEVELS.length; i++) {
      expect(CAREER_LEVELS[i].requiredClicks).toBeGreaterThan(CAREER_LEVELS[i - 1].requiredClicks)
    }
  })
})

describe('gameState 저장 키 상수', () => {
  it('SAVE_KEY 정의됨', () => {
    expect(SAVE_KEY).toBe('seoulTycoonSaveV1')
  })

  it('SETTINGS_KEY 정의됨', () => {
    expect(SETTINGS_KEY).toBe('capitalClicker_settings')
  })

  it('CLOUD_RESTORE_BLOCK_KEY 정의됨', () => {
    expect(CLOUD_RESTORE_BLOCK_KEY).toBe('ss_blockCloudRestoreUntilNicknameDone')
  })

  it('CLOUD_RESTORE_SKIP_KEY 정의됨', () => {
    expect(CLOUD_RESTORE_SKIP_KEY).toBe('ss_skipCloudRestoreOnce')
  })
})

describe('reapplyIncomeTableAffectingUpgradeEffects', () => {
  beforeEach(() => {
    // 테스트 전 수익 테이블 초기화
    resetIncomeTablesToDefault()
  })

  it('빈 UPGRADES 객체 처리', () => {
    const UPGRADES = {}
    expect(() => reapplyIncomeTableAffectingUpgradeEffects(UPGRADES)).not.toThrow()
  })

  it('구매하지 않은 업그레이드는 건너뛰기', () => {
    const UPGRADES = {
      test_upgrade: {
        purchased: false,
        effect: () => {
          FINANCIAL_INCOME.deposit = 999
        },
      },
    }

    reapplyIncomeTableAffectingUpgradeEffects(UPGRADES)

    // 적용되지 않아야 함
    expect(FINANCIAL_INCOME.deposit).toBe(50)
  })

  it('effect 함수가 없는 업그레이드는 건너뛰기', () => {
    const UPGRADES = {
      test_upgrade: {
        purchased: true,
        effect: 'not a function',
      },
    }

    expect(() => reapplyIncomeTableAffectingUpgradeEffects(UPGRADES)).not.toThrow()
  })

  it('FINANCIAL_INCOME에 영향 주지 않는 업그레이드는 건너뛰기', () => {
    let effectCalled = false
    const UPGRADES = {
      test_upgrade: {
        purchased: true,
        effect: () => {
          effectCalled = true
        },
      },
    }

    reapplyIncomeTableAffectingUpgradeEffects(UPGRADES)

    // 수익 테이블에 영향 주지 않으므로 호출 안 함
    expect(effectCalled).toBe(false)
  })

  it('FINANCIAL_INCOME에 영향 주는 업그레이드 적용', () => {
    const UPGRADES = {
      deposit_boost: {
        purchased: true,
        effect: function () {
          FINANCIAL_INCOME.deposit = 100
        },
      },
    }

    reapplyIncomeTableAffectingUpgradeEffects(UPGRADES)

    expect(FINANCIAL_INCOME.deposit).toBe(100)
  })

  it('BASE_RENT에 영향 주는 업그레이드 적용', () => {
    const UPGRADES = {
      rent_boost: {
        purchased: true,
        effect: function () {
          BASE_RENT.villa = 100_000
        },
      },
    }

    reapplyIncomeTableAffectingUpgradeEffects(UPGRADES)

    expect(BASE_RENT.villa).toBe(100_000)
  })

  it('effect 함수 예외 발생 시 계속 진행', () => {
    const UPGRADES = {
      broken_upgrade: {
        purchased: true,
        effect: function () {
          FINANCIAL_INCOME.deposit = 100
          throw new Error('Test error')
        },
      },
      working_upgrade: {
        purchased: true,
        effect: function () {
          FINANCIAL_INCOME.savings = 200
        },
      },
    }

    expect(() => reapplyIncomeTableAffectingUpgradeEffects(UPGRADES)).not.toThrow()

    // 첫 번째 업그레이드는 예외 전에 적용됨
    expect(FINANCIAL_INCOME.deposit).toBe(100)
  })

  it('여러 업그레이드 순차 적용', () => {
    const UPGRADES = {
      boost1: {
        purchased: true,
        effect: function () {
          FINANCIAL_INCOME.deposit *= 2
        },
      },
      boost2: {
        purchased: true,
        effect: function () {
          FINANCIAL_INCOME.savings *= 3
        },
      },
    }

    reapplyIncomeTableAffectingUpgradeEffects(UPGRADES)

    expect(FINANCIAL_INCOME.deposit).toBe(100) // 50 * 2
    expect(FINANCIAL_INCOME.savings).toBe(2250) // 750 * 3
  })

  it('null 또는 undefined 업그레이드 건너뛰기', () => {
    const UPGRADES = {
      valid: {
        purchased: true,
        effect: function () {
          FINANCIAL_INCOME.deposit = 150
        },
      },
      nullUpgrade: null,
      undefinedUpgrade: undefined,
    }

    expect(() => reapplyIncomeTableAffectingUpgradeEffects(UPGRADES)).not.toThrow()
    expect(FINANCIAL_INCOME.deposit).toBe(150)
  })
})

describe('BASE_CLICK_GAIN 상수', () => {
  it('BASE_CLICK_GAIN 정의됨', () => {
    expect(BASE_CLICK_GAIN).toBe(10000) // 1만원
  })
})

describe('gameState 추가 속성', () => {
  it('totalPlayTime 초기값 0', () => {
    expect(gameState.totalPlayTime).toBe(0)
  })

  it('sessionStartTime이 타임스탬프', () => {
    expect(typeof gameState.sessionStartTime).toBe('number')
    expect(gameState.sessionStartTime).toBeGreaterThan(0)
  })

  it('lastSaveTime이 Date 객체', () => {
    expect(gameState.lastSaveTime instanceof Date).toBe(true)
  })

  it('towers_run 초기값 0', () => {
    expect(gameState.towers_run).toBe(0)
  })

  it('towers_lifetime 초기값 0', () => {
    expect(gameState.towers_lifetime).toBe(0)
  })

  it('settings 객체 구조', () => {
    expect(gameState.settings).toBeDefined()
    expect(typeof gameState.settings.particles).toBe('boolean')
    expect(typeof gameState.settings.fancyGraphics).toBe('boolean')
    expect(typeof gameState.settings.shortNumbers).toBe('boolean')
  })

  it('unlockedProducts 구조 확인', () => {
    const products = gameState.unlockedProducts
    expect(products.deposit).toBe(true)
    expect(typeof products.savings).toBe('boolean')
    expect(typeof products.bond).toBe('boolean')
    expect(typeof products.usStock).toBe('boolean')
    expect(typeof products.crypto).toBe('boolean')
    expect(typeof products.villa).toBe('boolean')
    expect(typeof products.officetel).toBe('boolean')
    expect(typeof products.apartment).toBe('boolean')
    expect(typeof products.shop).toBe('boolean')
    expect(typeof products.building).toBe('boolean')
    expect(typeof products.tower).toBe('boolean')
  })

  it('누적 생산량 속성 존재', () => {
    expect(gameState.depositsLifetime).toBeDefined()
    expect(gameState.savingsLifetime).toBeDefined()
    expect(gameState.bondsLifetime).toBeDefined()
    expect(gameState.usStocksLifetime).toBeDefined()
    expect(gameState.cryptosLifetime).toBeDefined()
    expect(gameState.villasLifetime).toBeDefined()
    expect(gameState.officetelsLifetime).toBeDefined()
    expect(gameState.apartmentsLifetime).toBeDefined()
    expect(gameState.shopsLifetime).toBeDefined()
    expect(gameState.buildingsLifetime).toBeDefined()
  })
})
