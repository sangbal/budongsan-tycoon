/**
 * 프레스티지 시스템
 * - resetRunHoldings: 런 단위 보유 자산 초기화 (금융상품, 부동산, Lifetime 변수)
 * - performAutoPrestige: 자동 프레스티지 실행 (상태 초기화 + UI 업데이트 + 저장)
 */

import { FINANCIAL_INCOME } from '../state/gameState.js'
import { BASE_COSTS } from '../balance/index.js'
import { getStartingCash } from './prestigeBonus.js'

/**
 * createPrestigeManager
 * Factory 패턴으로 프레스티지 시스템 생성
 *
 * @param {Object} deps - 의존성 객체
 * @param {Object} deps.state - 게임 상태 참조 객체 (mutable references)
 * @param {Object} deps.UPGRADES - 업그레이드 정의
 * @param {Function} deps.updateAutoWorkUI - AI 업무 UI 업데이트 함수
 * @param {Function} deps.updateUI - 전체 UI 업데이트 함수
 * @param {Object} deps.saveLoadManager - 저장/불러오기 매니저 (saveGame 메서드)
 * @param {Object} deps.LeaderboardUI - 리더보드 UI 모듈 (updateLeaderboardEntry 메서드)
 * @param {Object} deps.Diary - 일기장 모듈 (addLog 메서드)
 * @param {Function} deps.t - 번역 함수
 * @param {boolean} deps.__IS_DEV__ - 개발 모드 플래그
 * @returns {Object} { resetRunHoldings, performAutoPrestige }
 */
export function createPrestigeManager(deps) {
  const {
    state,
    UPGRADES,
    updateAutoWorkUI,
    updateUI,
    saveLoadManager,
    LeaderboardUI,
    Diary,
    t,
    __IS_DEV__ = false,
  } = deps

  /**
   * 런 단위 보유 자산 초기화
   * - 금융상품: FINANCIAL_INCOME 키 기반 자동 초기화
   * - 부동산: BASE_COSTS 키 기반 자동 초기화 (tower 제외)
   * - Lifetime 변수: 누적 생산량 초기화
   * - towers_run은 초기화, towers_lifetime은 유지
   */
  function resetRunHoldings() {
    // 금융상품 보유 수량 초기화 (FINANCIAL_INCOME 키 기반)
    // 상수 키 → 변수명 매핑
    const financialHoldings = {
      deposit: () => {
        state.deposits = 0
      },
      savings: () => {
        state.savings = 0
      },
      bond: () => {
        state.bonds = 0
      },
      usStock: () => {
        state.usStocks = 0
      },
      crypto: () => {
        state.cryptos = 0
      },
    }

    // FINANCIAL_INCOME에 정의된 모든 키에 대해 초기화 실행
    for (const key of Object.keys(FINANCIAL_INCOME)) {
      if (financialHoldings[key]) {
        financialHoldings[key]()
      }
    }

    // 부동산 보유 수량 초기화 (BASE_COSTS 키 기반, tower 제외)
    // 상수 키 → 변수명 매핑
    const propertyHoldings = {
      villa: () => {
        if (typeof state.villas !== 'undefined') state.villas = 0
      },
      officetel: () => {
        if (typeof state.officetels !== 'undefined') state.officetels = 0
      },
      apartment: () => {
        if (typeof state.apartments !== 'undefined') state.apartments = 0
      },
      shop: () => {
        if (typeof state.shops !== 'undefined') state.shops = 0
      },
      building: () => {
        if (typeof state.buildings !== 'undefined') state.buildings = 0
      },
      // tower는 towers_run으로 별도 처리 (프레스티지 시 초기화, towers_lifetime은 유지)
    }

    // BASE_COSTS에 정의된 모든 키에 대해 초기화 실행 (tower 제외)
    const propertyKeys = Object.keys(BASE_COSTS).filter(key => key !== 'tower')
    if (__IS_DEV__) {
      console.debug('[resetRunHoldings] 부동산 초기화 대상:', propertyKeys)
    }

    for (const key of propertyKeys) {
      if (propertyHoldings[key]) {
        try {
          propertyHoldings[key]()
        } catch (e) {
          console.warn(`[resetRunHoldings] 부동산 ${key} 초기화 실패:`, e)
        }
      } else if (__IS_DEV__) {
        console.warn(`[resetRunHoldings] 부동산 ${key}에 대한 매핑이 없습니다.`)
      }
    }

    // 추가 변수 초기화 (상수에 없는 변수들)
    // 주의: domesticStocks는 존재하지 않음. 실제 변수는 bonds이며 위에서 이미 초기화됨
    if (typeof state.towers_run !== 'undefined') {
      state.towers_run = 0 // towers_lifetime은 유지
    } else if (__IS_DEV__) {
      console.warn('[resetRunHoldings] towers_run 변수가 정의되지 않았습니다.')
    }

    // 누적 생산량 초기화 (Lifetime 변수들) - 방어 로직 추가
    const lifetimeHoldings = {
      depositsLifetime: () => {
        if (typeof state.depositsLifetime !== 'undefined') state.depositsLifetime = 0
      },
      savingsLifetime: () => {
        if (typeof state.savingsLifetime !== 'undefined') state.savingsLifetime = 0
      },
      bondsLifetime: () => {
        if (typeof state.bondsLifetime !== 'undefined') state.bondsLifetime = 0
      },
      usStocksLifetime: () => {
        if (typeof state.usStocksLifetime !== 'undefined') state.usStocksLifetime = 0
      },
      cryptosLifetime: () => {
        if (typeof state.cryptosLifetime !== 'undefined') state.cryptosLifetime = 0
      },
      villasLifetime: () => {
        if (typeof state.villasLifetime !== 'undefined') state.villasLifetime = 0
      },
      officetelsLifetime: () => {
        if (typeof state.officetelsLifetime !== 'undefined') state.officetelsLifetime = 0
      },
      apartmentsLifetime: () => {
        if (typeof state.apartmentsLifetime !== 'undefined') state.apartmentsLifetime = 0
      },
      shopsLifetime: () => {
        if (typeof state.shopsLifetime !== 'undefined') state.shopsLifetime = 0
      },
      buildingsLifetime: () => {
        if (typeof state.buildingsLifetime !== 'undefined') state.buildingsLifetime = 0
      },
    }

    if (__IS_DEV__) {
      console.debug('[resetRunHoldings] Lifetime 변수 초기화 대상:', Object.keys(lifetimeHoldings))
    }

    for (const [varName, resetFn] of Object.entries(lifetimeHoldings)) {
      try {
        resetFn()
      } catch (e) {
        console.warn(`[resetRunHoldings] Lifetime 변수 ${varName} 초기화 실패:`, e)
      }
    }

    if (__IS_DEV__) {
      console.debug('[resetRunHoldings] 초기화 완료')
    }
  }

  /**
   * 자동 프레스티지 실행 함수
   * - 컨텍스트 독립: 엔딩/설정 경로 모두 안전
   * - towers_lifetime은 유지, towers_run은 초기화
   * - 자산/보유/진행도 초기화 + UI 업데이트 + 저장 + 리더보드 업데이트
   *
   * @param {string} source - 프레스티지 호출 소스 ('unknown', 'ending', 'settings' 등)
   */
  async function performAutoPrestige(source = 'unknown') {
    console.log(`🔄 자동 프레스티지 실행 (source: ${source})`)

    try {
      // towers_lifetime은 유지, towers_run은 초기화
      // 자산/보유/진행도 초기화
      // 프레스티지 보너스: 스타트 자금 적용
      state.cash = 1000 + getStartingCash() // 초기 자본 + 프레스티지 보너스
      state.totalClicks = 0
      state.totalLaborIncome = 0
      state.careerLevel = 0
      state.clickMultiplier = 1
      state.rentMultiplier = 1
      state.autoClickEnabled = false
      state.managerLevel = 0

      // 모든 보유 수량 일괄 초기화 (상품 정의 기반)
      resetRunHoldings()

      // 업그레이드 초기화
      for (const upgrade of Object.values(UPGRADES)) {
        upgrade.unlocked = false
        upgrade.purchased = false
      }

      // 시장 이벤트 초기화
      state.currentMarketEvent = null
      state.marketEventEndTime = 0
      state.marketMultiplier = 1.0

      // 업적은 유지 (계정 누적)

      // 세션 시간 초기화
      state.sessionStartTime = Date.now()

      // AI 업무 처리 및 노동 UI 상태 동기화
      updateAutoWorkUI()

      // UI 업데이트 (안전하게)
      try {
        updateUI()
      } catch (uiError) {
        console.error('❌ UI 업데이트 중 오류:', uiError)
        // UI 업데이트 실패해도 게임 상태는 초기화됨
      }

      // 저장 (안전하게)
      try {
        saveLoadManager.saveGame()
      } catch (saveError) {
        console.error('❌ 게임 저장 중 오류:', saveError)
        // 저장 실패해도 게임 상태는 초기화됨
      }

      // 리더보드 즉시 업데이트 (프레스티지는 중요 이벤트)
      if (state.playerNickname) {
        try {
          await LeaderboardUI.updateLeaderboardEntry(true) // forceImmediate: 프레스티지는 즉시 업데이트
        } catch (error) {
          console.error('리더보드 업데이트 실패:', error)
        }
      }

      try {
        Diary.addLog('🗼 새로운 시작. 다시 한 번.')
      } catch (diaryError) {
        console.error('일기장 로그 실패:', diaryError)
        // 일기장 오류는 치명적이지 않으므로 무시
      }
      if (__IS_DEV__) {
        console.log('✅ 프레스티지 완료 (누적 데이터 유지)')
      }
    } catch (error) {
      console.error('❌ 프레스티지 실행 중 치명적 오류:', error)
      console.error('스택:', error.stack)
      // 치명적 오류만 사용자에게 알림
      throw error // 상위 try-catch에서 처리
    }
  }

  return {
    resetRunHoldings,
    performAutoPrestige,
  }
}
