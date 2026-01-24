/**
 * Seoul Survival - Prestige System
 *
 * 프레스티지 실행 및 상태 초기화 시스템
 * - CP 지급 및 업그레이드 리셋 (prestigeBonus.js)
 * - 런 상태 초기화 (gameState.js의 resetRunState)
 * - 업그레이드/시장 이벤트/UI 리셋
 */

import { processPrestige, applyStartingBonuses } from './prestigeBonus.js'
import { resetRunState } from '../state/gameState.js'

/**
 * 프레스티지 시스템 생성
 * @param {Object} deps - 의존성
 * @param {Object} deps.state - gameState 객체
 * @param {Object} deps.UPGRADES - 업그레이드 정보 객체
 * @param {Object} deps.saveLoadManager - 저장/로드 관리자
 * @param {Object} deps.LeaderboardUI - 리더보드 UI 객체
 * @param {Object} deps.Diary - 일기장 객체
 * @param {Function} deps.t - i18n 번역 함수
 * @param {Function} deps.updateUI - UI 업데이트 함수
 * @param {Function} deps.updateAutoWorkUI - 자동 업무 UI 업데이트 함수
 * @returns {Object} 프레스티지 관리 함수들
 */
export function createPrestigeSystem(deps) {
  const { state, UPGRADES, saveLoadManager, LeaderboardUI, Diary, t, updateUI, updateAutoWorkUI } =
    deps

  /**
   * 보유 수량 초기화 (금융상품 + 부동산 + Lifetime)
   * resetRunState()에서 처리하지만 명시적으로 분리
   */
  function resetHoldings() {
    // 금융상품 초기화
    state.deposits = 0
    state.savings = 0
    state.bonds = 0
    state.usStocks = 0
    state.cryptos = 0

    // 부동산 초기화
    state.villas = 0
    state.officetels = 0
    state.apartments = 0
    state.shops = 0
    state.buildings = 0
    state.towers_run = 0 // towers_lifetime은 유지

    // Lifetime 변수 초기화
    state.depositsLifetime = 0
    state.savingsLifetime = 0
    state.bondsLifetime = 0
    state.usStocksLifetime = 0
    state.cryptosLifetime = 0
    state.villasLifetime = 0
    state.officetelsLifetime = 0
    state.apartmentsLifetime = 0
    state.shopsLifetime = 0
    state.buildingsLifetime = 0

    if (__IS_DEV__) {
      console.warn('[resetHoldings] 보유 수량 초기화 완료')
    }
  }

  /**
   * 업그레이드 초기화 (모든 업그레이드 잠금/미구매 처리)
   * @param {Object} upgrades - UPGRADES 객체
   */
  function resetUpgrades(upgrades) {
    for (const upgrade of Object.values(upgrades)) {
      upgrade.unlocked = false
      upgrade.purchased = false
    }

    if (__IS_DEV__) {
      console.warn('[resetUpgrades] 업그레이드 초기화 완료')
    }
  }

  /**
   * 프레스티지 실행
   * @param {string} source - 프레스티지 실행 소스 ('ending', 'settings', 'debug' 등)
   * @returns {Promise<void>}
   */
  async function performPrestige(source = 'unknown') {
    if (__IS_DEV__) {
      console.warn(`🔄 자동 프레스티지 실행 (source: ${source})`)
    }

    try {
      // 1. CP 지급 및 업그레이드 리셋 (prestigeBonus.js)
      const earnedCP = processPrestige()
      if (earnedCP > 0 && __IS_DEV__) {
        console.warn(`💼 경력 포인트 획득: +${earnedCP} CP (총 ${state.careerPoints} CP)`)
      }

      // 2. 런 상태 초기화 (gameState.js)
      resetRunState()

      // 3. 보유 수량 초기화 (명시적)
      resetHoldings()

      // 4. 업그레이드 초기화
      resetUpgrades(UPGRADES)

      // 5. 시장 이벤트 초기화 (resetRunState에서 처리하지만 명시적으로)
      state.currentMarketEvent = null
      state.marketEventEndTime = 0
      state.marketMultiplier = 1.0

      // 6. CP 시작 보너스 적용 (prestigeBonus.js)
      const startBonuses = applyStartingBonuses()
      if (
        __IS_DEV__ &&
        (startBonuses.cash > 0 ||
          startBonuses.deposits > 0 ||
          startBonuses.career > 0 ||
          startBonuses.villa > 0)
      ) {
        console.warn('🎁 시작 보너스 적용:', startBonuses)
      }

      // 7. 세션 시간 초기화 (resetRunState에서 처리)

      // 8. AI 업무 처리 및 노동 UI 상태 동기화
      updateAutoWorkUI()

      // 9. UI 업데이트 (안전하게)
      try {
        updateUI()
      } catch (uiError) {
        console.error('❌ UI 업데이트 중 오류:', uiError)
        // UI 업데이트 실패해도 게임 상태는 초기화됨
      }

      // 10. 저장 (안전하게)
      try {
        saveLoadManager.saveGame()
      } catch (saveError) {
        console.error('❌ 게임 저장 중 오류:', saveError)
        // 저장 실패해도 게임 상태는 초기화됨
      }

      // 11. 리더보드 즉시 업데이트 (프레스티지는 중요 이벤트)
      if (state.playerNickname) {
        try {
          await LeaderboardUI.updateLeaderboardEntry(true) // forceImmediate: 프레스티지는 즉시 업데이트
        } catch (error) {
          console.error('리더보드 업데이트 실패:', error)
        }
      }

      // 12. 일기장 로그
      try {
        Diary.addLog(t('msg.prestigeComplete'))
      } catch (diaryError) {
        console.error('일기장 로그 실패:', diaryError)
        // 일기장 오류는 치명적이지 않으므로 무시
      }

      if (__IS_DEV__) {
        console.warn('✅ 프레스티지 완료 (누적 데이터 유지)')
      }
    } catch (error) {
      console.error('❌ 프레스티지 실행 중 치명적 오류:', error)
      console.error('스택:', error.stack)
      // 치명적 오류만 사용자에게 알림
      throw error // 상위 try-catch에서 처리
    }
  }

  return {
    performPrestige,
    resetHoldings,
    resetUpgrades,
  }
}
