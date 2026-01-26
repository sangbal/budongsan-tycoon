/**
 * gameLoopManager.js - 게임 루프 관리 모듈
 * 수익 틱, 자동 저장, 오토클릭, 시장 이벤트 타이머를 중앙 관리
 */

import { getPrestigeAutoClickSpeed } from './prestigeBonus.js'

/**
 * 게임 루프 매니저 생성
 * @param {Object} deps - 의존성 객체
 * @returns {Object} 게임 루프 매니저 인스턴스
 */
export function createGameLoopManager(deps) {
  const {
    // State
    gameState,
    UPGRADES,
    // Timing constants
    TIMING,
    MARKET_EVENT_TIMING,
    PROBABILITY,
    // Functions
    getRps,
    getFinancialIncome,
    getPropertyIncome,
    getClickIncome,
    checkCareerPromotion,
    checkMarketEvent,
    checkAchievements,
    checkUpgradeUnlocks,
    startMarketEvent,
    updateUI,
    saveGame,
    // Modules
    Animations,
    // DOM
    elWork,
  } = deps

  // 타이머 ID 저장
  let tickInterval = null
  let saveInterval = null
  let autoClickInterval = null
  let marketEventInterval = null

  // 정확한 deltaTime 계산을 위한 타임스탬프
  let lastTickTime = performance.now()

  // UI 업데이트 스로틀링 (비활성 탭에서 성능 최적화)
  let pendingUIUpdate = false

  // 슬로우 틱 카운터 (업적/업그레이드 체크 빈도 감소)
  let slowTickCounter = 0
  const SLOW_TICK_INTERVAL = 10 // 50ms × 10 = 500ms

  /**
   * 수익 틱 루프 시작
   * @param {number} tickMs - 틱 간격 (ms)
   */
  function startTickLoop(tickMs = 50) {
    if (tickInterval) return // 이미 실행 중

    lastTickTime = performance.now()
    slowTickCounter = 0

    tickInterval = setInterval(() => {
      // 슬로우 틱 (500ms) - 무거운 체크 로직
      slowTickCounter++
      if (slowTickCounter >= SLOW_TICK_INTERVAL) {
        slowTickCounter = 0
        checkMarketEvent() // 시장 이벤트 체크
        checkAchievements() // 업적 체크
        checkUpgradeUnlocks() // 업그레이드 해금 체크
      }

      // 패스트 틱 (50ms) - 수익 계산
      // 실제 경과 시간 계산 (탭 백그라운드/CPU 부하 시 정확도 보장)
      const now = performance.now()
      const deltaTime = Math.min((now - lastTickTime) / 1000, 1) // 최대 1초 제한 (비정상 지연 방지)
      lastTickTime = now
      const tickIncome = getRps() * deltaTime
      gameState.cash += tickIncome
      gameState.lifetimeEarnings += tickIncome // CP 계산용 누적 수익

      // 누적 생산량 계산 (시너지/프레스티지/마켓 배수 적용)
      gameState.depositsLifetime += getFinancialIncome('deposit', gameState.deposits) * deltaTime
      gameState.savingsLifetime += getFinancialIncome('savings', gameState.savings) * deltaTime
      gameState.bondsLifetime += getFinancialIncome('bond', gameState.bonds) * deltaTime
      gameState.usStocksLifetime += getFinancialIncome('usStock', gameState.usStocks) * deltaTime
      gameState.cryptosLifetime += getFinancialIncome('crypto', gameState.cryptos) * deltaTime
      gameState.villasLifetime += getPropertyIncome('villa', gameState.villas) * deltaTime
      gameState.officetelsLifetime +=
        getPropertyIncome('officetel', gameState.officetels) * deltaTime
      gameState.apartmentsLifetime +=
        getPropertyIncome('apartment', gameState.apartments) * deltaTime
      gameState.shopsLifetime += getPropertyIncome('shop', gameState.shops) * deltaTime
      gameState.buildingsLifetime += getPropertyIncome('building', gameState.buildings) * deltaTime

      // 비활성 탭에서는 UI 업데이트 스킵 (성능 최적화)
      // 데이터는 계속 계산되므로 탭 복귀 시 최신 상태 표시
      if (document.hidden) {
        pendingUIUpdate = true
        return
      }

      // rAF로 UI 업데이트 배치 (프레임 드롭 방지)
      if (!pendingUIUpdate) {
        pendingUIUpdate = true
        requestAnimationFrame(() => {
          updateUI()
          pendingUIUpdate = false
        })
      }
    }, tickMs)
  }

  /**
   * 자동 저장 루프 시작
   */
  function startAutoSave() {
    if (saveInterval) return // 이미 실행 중

    saveInterval = setInterval(() => {
      if (saveGame) {
        saveGame()
      }
    }, TIMING.AUTO_SAVE_INTERVAL_MS)
  }

  /**
   * 단일 자동 클릭 처리 (공통 로직)
   * @param {boolean} showAnimation - 애니메이션 표시 여부
   */
  function processAutoClick(showAnimation = true) {
    const income = getClickIncome()
    gameState.cash += income
    gameState.totalClicks += 1
    gameState.totalLaborIncome += income
    gameState.lifetimeEarnings += income // CP 계산용 누적 수익
    checkCareerPromotion()

    // 노동 버튼에 자동 클릭 이펙트 적용 (펄스 + 수익 텍스트)
    if (showAnimation && elWork) {
      elWork.classList.remove('auto-click-pulse')
      // double rAF 패턴으로 강제 리플로우 없이 애니메이션 재생
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (elWork) elWork.classList.add('auto-click-pulse')
        })
      })
    }
    // 수익 증가 애니메이션(초록색 돈 텍스트)도 함께 표시
    if (showAnimation) {
      Animations.showIncomeAnimation(income)
    }

    // 성과급은 오토클릭에도 적용
    if (
      UPGRADES['performance_bonus'] &&
      UPGRADES['performance_bonus'].purchased &&
      Math.random() < PROBABILITY.PERFORMANCE_BONUS_CHANCE
    ) {
      // 기본 income(1배)은 이미 지급됨 → 총 10배가 되도록 추가 9배 지급
      const bonusIncome = income * 9
      gameState.cash += bonusIncome
      gameState.totalLaborIncome += bonusIncome
      gameState.lifetimeEarnings += bonusIncome // CP 계산용 누적 수익
    }
  }

  /**
   * 오토클릭 루프 시작
   * - 기존 AI 시스템 (auto_work_system 업그레이드): 1회/초
   * - 프레스티지 자동화 (I1~I3 업그레이드): 1~4회/초
   * 두 시스템은 중첩 가능
   */
  function startAutoClick() {
    if (autoClickInterval) return // 이미 실행 중

    // 250ms 간격으로 체크 (4회/초 프레스티지 자동 클릭 지원)
    let tickCounter = 0

    autoClickInterval = setInterval(() => {
      tickCounter++
      const prestigeSpeed = getPrestigeAutoClickSpeed() // 0, 1, 2, 4

      // 프레스티지 자동 클릭 처리
      if (prestigeSpeed > 0) {
        // 속도별 처리:
        // - 4회/초: 매 틱(250ms)마다 1회
        // - 2회/초: 2틱마다 1회 (tickCounter % 2 === 0)
        // - 1회/초: 4틱마다 1회 (tickCounter % 4 === 0)
        const interval = 4 / prestigeSpeed // 4, 2, 1
        if (tickCounter % interval === 0) {
          processAutoClick(true)
        }
      }

      // 기존 AI 시스템 (1회/초, 4틱마다)
      if (tickCounter % 4 === 0 && gameState.autoClickEnabled) {
        processAutoClick(true)
      }

      // 카운터 리셋 (오버플로우 방지)
      if (tickCounter >= 1000) {
        tickCounter = 0
      }
    }, 250) // 250ms마다 (4회/초)
  }

  /**
   * 시장 이벤트 체커 시작
   */
  function startMarketEventChecker() {
    if (marketEventInterval) return // 이미 실행 중

    // 2-5분마다 랜덤하게 시장 이벤트 발생
    const scheduleNextCheck = () => {
      const delay =
        Math.random() * MARKET_EVENT_TIMING.RANDOM_RANGE_MS + MARKET_EVENT_TIMING.MIN_INTERVAL_MS
      marketEventInterval = setTimeout(() => {
        if (gameState.marketEventEndTime === 0) {
          // 현재 이벤트가 진행 중이 아닐 때만
          startMarketEvent()
        }
        scheduleNextCheck()
      }, delay)
    }
    scheduleNextCheck()
  }

  /**
   * 탭 활성화 시 즉시 UI 업데이트
   */
  function setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && pendingUIUpdate) {
        // 탭 복귀 시 즉시 UI 업데이트
        updateUI()
        pendingUIUpdate = false
      }
    })
  }

  /**
   * 모든 루프 시작
   */
  function startAllLoops() {
    setupVisibilityHandler()
    startTickLoop(50) // 50ms 틱
    startAutoSave()
    startAutoClick()
    startMarketEventChecker()
  }

  /**
   * 모든 루프 정지
   */
  function stopAllLoops() {
    if (tickInterval) {
      clearInterval(tickInterval)
      tickInterval = null
    }
    if (saveInterval) {
      clearInterval(saveInterval)
      saveInterval = null
    }
    if (autoClickInterval) {
      clearInterval(autoClickInterval)
      autoClickInterval = null
    }
    if (marketEventInterval) {
      clearTimeout(marketEventInterval)
      marketEventInterval = null
    }
  }

  /**
   * 틱 루프만 정지 (탭 비활성화 시 등)
   */
  function pauseTickLoop() {
    if (tickInterval) {
      clearInterval(tickInterval)
      tickInterval = null
    }
  }

  /**
   * 틱 루프 재개
   */
  function resumeTickLoop(tickMs = 50) {
    if (!tickInterval) {
      startTickLoop(tickMs)
    }
  }

  return {
    startAllLoops,
    stopAllLoops,
    startTickLoop,
    startAutoSave,
    startAutoClick,
    startMarketEventChecker,
    pauseTickLoop,
    resumeTickLoop,
  }
}
