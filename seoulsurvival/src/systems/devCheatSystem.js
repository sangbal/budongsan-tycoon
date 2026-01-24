/**
 * 개발 치트 시스템
 * 개발 모드에서만 활성화되는 테스트용 치트 코드
 */

/**
 * 개발 치트 시스템 팩토리
 * @param {Object} deps - 의존성
 * @param {Object} deps.gameState - 게임 상태 객체
 * @param {Object} deps.UPGRADES - 업그레이드 객체
 * @param {Function} deps.updateUI - UI 업데이트 함수
 * @param {Function} deps.updateUpgradeList - 업그레이드 리스트 업데이트 함수
 * @param {Function} deps.checkUpgradeUnlocks - 업그레이드 해금 체크 함수
 * @param {Function} deps.refreshPrestigeTab - 프레스티지 탭 갱신 함수
 * @param {Function} deps.t - 번역 함수
 * @param {Object} deps.NumberFormat - 숫자 포맷 모듈
 * @param {boolean} deps.__IS_DEV__ - 개발 모드 여부
 * @returns {Object} 치트 시스템 객체
 */
export function createDevCheatSystem(deps) {
  const {
    gameState,
    UPGRADES,
    updateUI,
    updateUpgradeList,
    checkUpgradeUnlocks,
    refreshPrestigeTab,
    t,
    NumberFormat,
    __IS_DEV__,
  } = deps

  /**
   * 개발 치트 초기화 (window.cheat 객체 설정)
   */
  function initDevCheats() {
    if (!__IS_DEV__) return

    window.cheat = {
      addCash: amount => {
        gameState.cash += amount
        updateUI()
      },
      unlockAllUpgrades: () => {
        Object.values(UPGRADES).forEach(u => (u.unlocked = true))
        updateUpgradeList()
      },
      unlockFirstUpgrade: () => {
        const firstId = Object.keys(UPGRADES)[0]
        UPGRADES[firstId].unlocked = true
        updateUpgradeList()
      },
      setClicks: count => {
        gameState.totalClicks = count
        updateUI()
        checkUpgradeUnlocks()
      },
      testUpgrade: () => {
        const firstId = Object.keys(UPGRADES)[0]
        UPGRADES[firstId].unlocked = true
        gameState.cash += 10000000
        updateUpgradeList()
        updateUI()
      },
      // CP 시스템 테스트 치트
      addCP: amount => {
        gameState.careerPoints += amount
        gameState.totalCareerPoints += amount
        refreshPrestigeTab(t, NumberFormat.formatNumber)
        updateUI()
      },
      setTowers: count => {
        gameState.towers_lifetime = count
        updateUI()
      },
      setLifetimeEarnings: amount => {
        gameState.lifetimeEarnings = amount
        updateUI()
      },
      testPrestige: () => {
        // 타워 5개, 수익 10조 시뮬레이션
        gameState.towers_lifetime = 5
        gameState.lifetimeEarnings = 1e13
        gameState.careerPoints = 10
        gameState.totalCareerPoints = 10
        refreshPrestigeTab(t, NumberFormat.formatNumber)
        updateUI()
      },
      getGameState: () => gameState,
    }
  }

  return {
    initDevCheats,
  }
}
