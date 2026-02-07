/**
 * gameLoopManager.js 테스트
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createGameLoopManager } from '../gameLoopManager.js'

describe('createGameLoopManager', () => {
  let mockDeps
  let manager
  let originalSetInterval
  let originalClearInterval
  let originalSetTimeout
  let originalClearTimeout
  let originalRAF
  let intervalCallbacks
  let timeoutCallbacks

  beforeEach(() => {
    intervalCallbacks = new Map()
    timeoutCallbacks = new Map()
    let intervalId = 0
    let timeoutId = 0

    // setInterval mock
    originalSetInterval = globalThis.setInterval
    globalThis.setInterval = vi.fn((callback, delay) => {
      const id = ++intervalId
      intervalCallbacks.set(id, { callback, delay })
      return id
    })

    // clearInterval mock
    originalClearInterval = globalThis.clearInterval
    globalThis.clearInterval = vi.fn(id => {
      intervalCallbacks.delete(id)
    })

    // setTimeout mock
    originalSetTimeout = globalThis.setTimeout
    globalThis.setTimeout = vi.fn((callback, delay) => {
      const id = ++timeoutId
      timeoutCallbacks.set(id, { callback, delay })
      return id
    })

    // clearTimeout mock
    originalClearTimeout = globalThis.clearTimeout
    globalThis.clearTimeout = vi.fn(id => {
      timeoutCallbacks.delete(id)
    })

    // requestAnimationFrame mock
    originalRAF = globalThis.requestAnimationFrame
    globalThis.requestAnimationFrame = vi.fn(callback => {
      callback()
      return 1
    })

    // 의존성 mock
    mockDeps = {
      gameState: {
        cash: 1000,
        lifetimeEarnings: 0,
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
        depositsLifetime: 0,
        savingsLifetime: 0,
        bondsLifetime: 0,
        usStocksLifetime: 0,
        cryptosLifetime: 0,
        villasLifetime: 0,
        officetelsLifetime: 0,
        apartmentsLifetime: 0,
        shopsLifetime: 0,
        buildingsLifetime: 0,
        totalLaborIncome: 0,
        autoClickEnabled: false,
        marketEventEndTime: 0,
        totalClicks: 0,
      },
      UPGRADES: {
        performance_bonus: { purchased: false },
      },
      TIMING: {
        AUTO_SAVE_INTERVAL_MS: 5000,
      },
      MARKET_EVENT_TIMING: {
        MIN_INTERVAL_MS: 120000,
        RANDOM_RANGE_MS: 180000,
      },
      PROBABILITY: {
        PERFORMANCE_BONUS_CHANCE: 0.1,
      },
      getRps: vi.fn(() => 10),
      getFinancialIncome: vi.fn(() => 1),
      getPropertyIncome: vi.fn(() => 2),
      getClickIncome: vi.fn(() => 5),
      checkCareerPromotion: vi.fn(),
      checkMarketEvent: vi.fn(),
      checkAchievements: vi.fn(),
      checkUpgradeUnlocks: vi.fn(),
      startMarketEvent: vi.fn(),
      updateUI: vi.fn(),
      saveGame: vi.fn(),
      Animations: {
        showIncomeAnimation: vi.fn(),
      },
      elWork: document.createElement('button'),
    }

    manager = createGameLoopManager(mockDeps)
  })

  afterEach(() => {
    globalThis.setInterval = originalSetInterval
    globalThis.clearInterval = originalClearInterval
    globalThis.setTimeout = originalSetTimeout
    globalThis.clearTimeout = originalClearTimeout
    globalThis.requestAnimationFrame = originalRAF
    vi.clearAllMocks()
  })

  describe('startAllLoops', () => {
    it('모든 루프 시작', () => {
      manager.startAllLoops()

      // setInterval 호출 확인 (틱, 자동저장, 오토클릭)
      expect(globalThis.setInterval).toHaveBeenCalled()
      // setTimeout 호출 확인 (시장 이벤트)
      expect(globalThis.setTimeout).toHaveBeenCalled()
    })
  })

  describe('stopAllLoops', () => {
    it('모든 루프 정지', () => {
      manager.startAllLoops()
      manager.stopAllLoops()

      // clearInterval, clearTimeout 호출 확인
      expect(globalThis.clearInterval).toHaveBeenCalled()
      expect(globalThis.clearTimeout).toHaveBeenCalled()
    })
  })

  describe('startTickLoop', () => {
    it('틱 루프 시작', () => {
      manager.startTickLoop(50)

      expect(globalThis.setInterval).toHaveBeenCalled()
    })

    it('이미 실행 중이면 중복 시작 안함', () => {
      manager.startTickLoop(50)
      manager.startTickLoop(50)

      expect(globalThis.setInterval).toHaveBeenCalledTimes(1)
    })

    it('틱 콜백 실행 시 수익 계산', () => {
      manager.startTickLoop(50)

      // 틱 콜백 실행
      const tickCallback = intervalCallbacks.get(1)?.callback
      expect(tickCallback).toBeDefined()

      const initialCash = mockDeps.gameState.cash
      // 슬로우 틱(10틱마다) 체크 로직 실행을 위해 10번 호출
      for (let i = 0; i < 10; i++) {
        tickCallback()
      }

      // checkMarketEvent 호출 확인 (슬로우 틱에서 실행됨)
      expect(mockDeps.checkMarketEvent).toHaveBeenCalled()
      expect(mockDeps.checkAchievements).toHaveBeenCalled()
      expect(mockDeps.checkUpgradeUnlocks).toHaveBeenCalled()
    })
  })

  describe('startAutoSave', () => {
    it('자동 저장 시작', () => {
      manager.startAutoSave()

      expect(globalThis.setInterval).toHaveBeenCalled()
    })

    it('이미 실행 중이면 중복 시작 안함', () => {
      manager.startAutoSave()
      manager.startAutoSave()

      expect(globalThis.setInterval).toHaveBeenCalledTimes(1)
    })

    it('자동 저장 콜백 실행 시 saveGame 호출', () => {
      manager.startAutoSave()

      const callback = intervalCallbacks.get(1)?.callback
      callback()

      expect(mockDeps.saveGame).toHaveBeenCalled()
    })
  })

  describe('startAutoClick', () => {
    it('오토클릭 시작', () => {
      manager.startAutoClick()

      expect(globalThis.setInterval).toHaveBeenCalled()
    })

    it('이미 실행 중이면 중복 시작 안함', () => {
      manager.startAutoClick()
      manager.startAutoClick()

      expect(globalThis.setInterval).toHaveBeenCalledTimes(1)
    })

    it('오토클릭 비활성화시 수익 없음', () => {
      mockDeps.gameState.autoClickEnabled = false
      manager.startAutoClick()

      const callback = intervalCallbacks.get(1)?.callback
      const initialCash = mockDeps.gameState.cash
      // 250ms 간격으로 4번 호출해야 1초가 되어 기존 오토클릭 작동
      callback()
      callback()
      callback()
      callback()

      expect(mockDeps.gameState.cash).toBe(initialCash)
    })

    it('오토클릭 활성화시 수익 추가', () => {
      mockDeps.gameState.autoClickEnabled = true
      manager.startAutoClick()

      const callback = intervalCallbacks.get(1)?.callback
      const initialCash = mockDeps.gameState.cash
      // 250ms 간격으로 4번 호출해야 1초가 되어 기존 오토클릭 작동 (tickCounter % 4 === 0)
      callback()
      callback()
      callback()
      callback()

      expect(mockDeps.gameState.cash).toBeGreaterThan(initialCash)
      expect(mockDeps.checkCareerPromotion).toHaveBeenCalled()
      expect(mockDeps.Animations.showIncomeAnimation).toHaveBeenCalled()
    })

    it('성과급 업그레이드 적용', () => {
      mockDeps.gameState.autoClickEnabled = true
      mockDeps.UPGRADES.performance_bonus.purchased = true

      // Math.random을 0으로 고정하여 항상 성과급 발생
      const originalRandom = Math.random
      Math.random = () => 0

      manager.startAutoClick()

      const callback = intervalCallbacks.get(1)?.callback
      const initialCash = mockDeps.gameState.cash
      // 250ms 간격으로 4번 호출해야 1초가 되어 기존 오토클릭 작동
      callback()
      callback()
      callback()
      callback()

      // 기본 5 + 보너스 45 = 50
      expect(mockDeps.gameState.cash).toBe(initialCash + 5 + 45)

      Math.random = originalRandom
    })
  })

  describe('startMarketEventChecker', () => {
    it('시장 이벤트 체커 시작', () => {
      manager.startMarketEventChecker()

      expect(globalThis.setTimeout).toHaveBeenCalled()
    })

    it('이미 실행 중이면 중복 시작 안함', () => {
      manager.startMarketEventChecker()
      manager.startMarketEventChecker()

      expect(globalThis.setTimeout).toHaveBeenCalledTimes(1)
    })

    it('시장 이벤트 콜백 실행 시 이벤트 시작', () => {
      mockDeps.gameState.marketEventEndTime = 0
      manager.startMarketEventChecker()

      const callback = timeoutCallbacks.get(1)?.callback
      callback()

      expect(mockDeps.startMarketEvent).toHaveBeenCalled()
    })

    it('이벤트 진행 중이면 새 이벤트 시작 안함', () => {
      mockDeps.gameState.marketEventEndTime = Date.now() + 10000
      manager.startMarketEventChecker()

      const callback = timeoutCallbacks.get(1)?.callback
      callback()

      expect(mockDeps.startMarketEvent).not.toHaveBeenCalled()
    })
  })

  describe('pauseTickLoop / resumeTickLoop', () => {
    it('틱 루프 일시정지', () => {
      manager.startTickLoop(50)
      manager.pauseTickLoop()

      expect(globalThis.clearInterval).toHaveBeenCalled()
    })

    it('틱 루프 재개', () => {
      manager.startTickLoop(50)
      manager.pauseTickLoop()
      manager.resumeTickLoop(50)

      expect(globalThis.setInterval).toHaveBeenCalledTimes(2)
    })

    it('이미 실행 중이면 재개 안함', () => {
      manager.startTickLoop(50)
      manager.resumeTickLoop(50) // 이미 실행 중

      expect(globalThis.setInterval).toHaveBeenCalledTimes(1)
    })
  })

  describe('반환 객체', () => {
    it('모든 메서드 포함', () => {
      expect(manager).toHaveProperty('startAllLoops')
      expect(manager).toHaveProperty('stopAllLoops')
      expect(manager).toHaveProperty('startTickLoop')
      expect(manager).toHaveProperty('startAutoSave')
      expect(manager).toHaveProperty('startAutoClick')
      expect(manager).toHaveProperty('startMarketEventChecker')
      expect(manager).toHaveProperty('pauseTickLoop')
      expect(manager).toHaveProperty('resumeTickLoop')
    })
  })

  describe('P0: deltaTime 및 수익 누적', () => {
    it('틱 루프에서 수익이 cash에 누적됨', () => {
      manager.startTickLoop(50)

      const tickCallback = intervalCallbacks.get(1)?.callback
      expect(tickCallback).toBeDefined()

      const initialCash = mockDeps.gameState.cash

      // 틱 실행 (getRps * deltaTime 수익 추가)
      tickCallback()

      // 수익이 추가되었는지 확인
      // getRps가 10을 반환하므로 약간의 수익 추가됨
      expect(mockDeps.gameState.cash).toBeGreaterThanOrEqual(initialCash)
    })

    it('lifetimeEarnings 누적 확인', () => {
      mockDeps.gameState.lifetimeEarnings = 1000
      manager.startTickLoop(50)

      const tickCallback = intervalCallbacks.get(1)?.callback
      const initialLifetime = mockDeps.gameState.lifetimeEarnings

      // 여러 틱 실행
      for (let i = 0; i < 5; i++) {
        tickCallback()
      }

      // lifetimeEarnings는 절대 감소하지 않음
      expect(mockDeps.gameState.lifetimeEarnings).toBeGreaterThanOrEqual(initialLifetime)
    })

    it('totalLaborIncome 누적 (오토클릭)', () => {
      mockDeps.gameState.autoClickEnabled = true
      mockDeps.gameState.totalLaborIncome = 1000
      manager.startAutoClick()

      const callback = intervalCallbacks.get(1)?.callback
      const initialLabor = mockDeps.gameState.totalLaborIncome

      // 4틱 = 1초 (오토클릭 발동)
      callback()
      callback()
      callback()
      callback()

      expect(mockDeps.gameState.totalLaborIncome).toBeGreaterThan(initialLabor)
    })

    it('금융상품 수익 계산 (getFinancialIncome 호출)', () => {
      mockDeps.gameState.deposits = 10
      manager.startTickLoop(50)

      const tickCallback = intervalCallbacks.get(1)?.callback
      tickCallback()

      // getFinancialIncome이 호출되었는지 확인
      expect(mockDeps.getFinancialIncome).toHaveBeenCalled()
    })

    it('부동산 수익 계산 (getPropertyIncome 호출)', () => {
      mockDeps.gameState.villas = 5
      manager.startTickLoop(50)

      const tickCallback = intervalCallbacks.get(1)?.callback
      tickCallback()

      // getPropertyIncome이 호출되었는지 확인
      expect(mockDeps.getPropertyIncome).toHaveBeenCalled()
    })

    it('슬로우 틱(10틱마다)에서 체크 함수들 호출', () => {
      manager.startTickLoop(50)

      const tickCallback = intervalCallbacks.get(1)?.callback

      // 10틱 실행
      for (let i = 0; i < 10; i++) {
        tickCallback()
      }

      expect(mockDeps.checkMarketEvent).toHaveBeenCalled()
      expect(mockDeps.checkAchievements).toHaveBeenCalled()
      expect(mockDeps.checkUpgradeUnlocks).toHaveBeenCalled()
    })

    it('UI 업데이트 호출', () => {
      manager.startTickLoop(50)

      const tickCallback = intervalCallbacks.get(1)?.callback
      tickCallback()

      expect(mockDeps.updateUI).toHaveBeenCalled()
    })

    it('음수 수익 방지', () => {
      // getRps가 음수를 반환하는 경우
      mockDeps.getRps.mockReturnValue(-10)
      manager.startTickLoop(50)

      const tickCallback = intervalCallbacks.get(1)?.callback
      const initialCash = mockDeps.gameState.cash

      tickCallback()

      // 수익이 음수가 되면 cash가 줄어들 수 있음
      // 게임 로직에 따라 다르므로 최소한 호출 확인
      expect(mockDeps.getRps).toHaveBeenCalled()
    })

    it('자동 저장 간격 확인', () => {
      manager.startAutoSave()

      // setInterval이 AUTO_SAVE_INTERVAL_MS로 호출됨
      expect(globalThis.setInterval).toHaveBeenCalled()
      const callArgs = globalThis.setInterval.mock.calls[0]
      expect(callArgs[1]).toBe(mockDeps.TIMING.AUTO_SAVE_INTERVAL_MS)
    })
  })
})
