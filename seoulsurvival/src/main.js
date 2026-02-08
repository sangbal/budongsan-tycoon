/**
 * Seoul Survival - Main Entry Point
 * Phase 18: 부트스트랩 분리 후 간소화된 진입점
 */

import {
  initializeFoundation,
  initializeState,
  initializeAssetCalculator,
  initializeUpgradesAndAchievements,
  initializeInvestmentSystem,
  initializeGameUI,
  initializePersistence,
  initializePrestigeAndNickname,
  // Re-exported modules
  gameState,
  FINANCIAL_INCOME,
  BASE_RENT,
  CAREER_LEVELS,
  SAVE_KEY,
  getTotalFinancialProducts,
  getTotalProperties,
  getFinancialCost,
  getPropertyCost,
  getClickIncome,
  getCurrentCareer,
  getCareerName,
  getRps,
  getTotalIncomeForContribution,
  getFinancialIncome,
  getPropertyIncome,
  calculateCP,
  Modal,
  Animations,
  Diary,
  LeaderboardUI,
  NumberFormat,
  t,
  getLang,
  setLang,
  applyI18nToDOMAsync,
  ensureTranslationLoaded,
  safeText,
  createCareerSystem,
  preloadCareerImages,
  createWorkSystem,
  createCollapsibleManager,
  createSocialFeatures,
  createKeyboardShortcuts,
  createGameLoopManager,
  createTabNavigation,
  createI18nUIManager,
  createAuthUIManager,
  createAchievementGrid,
  createNotificationManager,
  createSettingsTabManager,
  setupPurchaseModeButtons,
  setupPurchaseQuantityButtons,
  setupWorkClickHandler,
  setupSettingsTabButtons,
  setupCloudSaveButtons,
  setupResetButtons,
  setupToggleSwitches,
  setupNicknameButtons,
  initPrestigeTab,
  refreshPrestigeTab,
  updateStatsTabImpl,
  updateSynergyDisplay,
  showAchievementNotification,
  getUser,
  onAuthStateChange,
  signInGoogle,
  signOut,
  toastSuccess,
  toastError,
  toastInfo,
  toastWarning,
  TIMING,
  MARKET_EVENT_TIMING,
  PROBABILITY,
  __IS_DEV__,
} from './core/bootstrap.js'
import { getDomRefs } from './ui/domRefs.js'

// CSS 번들링 보장
import '../styles/header.css'

document.addEventListener('DOMContentLoaded', () => {
  // ======= Phase A: 기초 시스템 초기화 =======
  initializeFoundation()

  // ======= Phase B: DOM 및 상태 초기화 =======
  const { DOM, settings, saveSettings, SAVE_KEY: saveKey, SETTINGS_KEY } = initializeState()

  // DOM 요소 단축 참조 (main.js에서 직접 사용하는 요소만)
  const {
    elWork,
    elWorkArea,
    elAutoWorkIndicator,
    elLog,
    elShareBtn,
    elFavoriteBtn,
    elBuyMode,
    elSellMode,
    elQty1,
    elQty5,
    elQty10,
    elResetBtn,
    elBuyDeposit,
    elBuySavings,
    elBuyBond,
    elBuyUsStock,
    elBuyCrypto,
    elBuyVilla,
    elBuyOfficetel,
    elBuyApt,
    elBuyShop,
    elBuyBuilding,
    elBuyTower,
  } = DOM

  // ======= 모듈 인스턴스 (나중에 초기화) =======
  let saveLoadManager = null
  let nicknameManager = null
  let cloudSyncManager = null
  let gameUIInstance = null
  let workSystem = null
  let prestigeSystem = null
  let buttonStateManager = null
  let achievementGridInstance = null
  let gameLoopManager = null

  // ======= Phase C: 자산 계산기 초기화 =======
  const {
    assetCalculator,
    calculateTotalAssetValue,
    calculateFinancialValue,
    calculatePropertyValue,
    calculateTotalAssetValueFromSave,
    calculatePlayTimeMsFromSave,
  } = initializeAssetCalculator()

  // ======= 헬퍼 함수들 =======
  function updateSaveStatus() {
    if (saveLoadManager?.updateSaveStatus) {
      saveLoadManager.updateSaveStatus()
    }
  }

  function updateAutoWorkUI() {
    if (elWorkArea) {
      elWorkArea.classList.toggle('auto-click-enabled', gameState.autoClickEnabled)
    }
    if (elAutoWorkIndicator) {
      elAutoWorkIndicator.style.display = gameState.autoClickEnabled ? '' : 'none'
    }
  }

  async function syncNicknameFromServer(logPrefix = '') {
    try {
      const user = await getUser()
      if (!user) return
      const { getUserProfile } = await import('../../shared/auth/core.js')
      const profile = await getUserProfile('seoulsurvival')
      if (!profile.success || !profile.user?.nickname) return
      const serverNickname = profile.user.nickname
      if (gameState.playerNickname === serverNickname) return
      gameState.playerNickname = serverNickname
      try {
        const saveData = localStorage.getItem(SAVE_KEY)
        if (saveData) {
          const data = JSON.parse(saveData)
          data.nickname = serverNickname
          localStorage.setItem(SAVE_KEY, JSON.stringify(data))
        }
      } catch (e) {
        console.warn('닉네임 저장 실패:', e)
      }
      updateUI()
      console.log(`[SeoulSurvival] ${logPrefix}Nickname synced from server:`, serverNickname)
    } catch (e) {
      console.warn(`${logPrefix}닉네임 동기화 실패:`, e)
    }
  }

  async function performAutoPrestige(source = 'unknown') {
    if (prestigeSystem) {
      return await prestigeSystem.performPrestige(source)
    }
    console.error('❌ prestigeSystem이 초기화되지 않았습니다.')
  }

  // ======= Phase D: UPGRADES 및 ACHIEVEMENTS 생성 =======
  const { UPGRADES, upgradeManager, ACHIEVEMENTS } = initializeUpgradesAndAchievements({
    updateAutoWorkUI,
    assetCalculator,
  })

  const { updateUpgradeAffordability, updateUpgradeProgress, updateUpgradeList, purchaseUpgrade } =
    upgradeManager

  // 공유하기/즐겨찾기 기능 (achievementNotification보다 먼저 초기화)
  const socialFeatures = createSocialFeatures({
    t,
    Diary,
    Modal,
    NumberFormat,
    settings,
    getCash: () => gameState.cash,
    getRps,
  })

  // achievementGrid 모듈 초기화
  achievementGridInstance = createAchievementGrid({
    getAchievements: () => ACHIEVEMENTS,
    t,
    isDev: __IS_DEV__,
  })

  function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true
        // shareGame을 shareCallback으로 전달
        showAchievementNotification(achievement, t, socialFeatures.shareGame)
        const achievementName = t(`achievement.${achievement.id}.name`, {}, achievement.name)
        const achievementDesc = t(`achievement.${achievement.id}.desc`, {}, achievement.desc)
        Diary.addLog(t('msg.achievementUnlocked', { name: achievementName, desc: achievementDesc }))
      }
    })
  }

  function checkUpgradeUnlocks() {
    let newUnlocks = 0
    for (const [id, upgrade] of Object.entries(UPGRADES)) {
      if (upgrade.purchased || upgrade.unlocked) continue
      try {
        if (upgrade.unlockCondition()) {
          upgrade.unlocked = true
          newUnlocks++
          Diary.addLog(t('msg.upgradeUnlocked', { name: t(`upgrade.${id}.name`) }))
        }
      } catch (error) {
        console.error(`업그레이드 해금 조건 체크 실패 (${id}):`, error)
      }
    }
    if (newUnlocks > 0) {
      updateUpgradeList()
    }
  }

  // ======= 커리어 시스템 초기화 =======
  const careerSystem = createCareerSystem({ elWorkArea })
  const checkCareerPromotion = careerSystem.checkCareerPromotion

  // ======= 애니메이션 시스템 초기화 =======
  Animations.initAnimations(elWork)

  // ======= UI 업데이트 함수들 =======
  function updateButtonStates() {
    buttonStateManager?.updateButtonStates()
  }

  function updateBuildingItemStates() {
    buttonStateManager?.updateBuildingItemStates()
  }

  function updateUI() {
    gameUIInstance?.updateUI()
    const careerNavBtn = document.getElementById('careerNavBtn')
    if (careerNavBtn) {
      const shouldShowCareer = gameState.towers_lifetime > 0 || gameState.careerPoints > 0
      careerNavBtn.style.display = shouldShowCareer ? '' : 'none'
    }
  }

  function updateStatsTab() {
    updateStatsTabImpl({
      safeText,
      getRps,
      getClickIncome,
      calculateTotalAssetValue,
      calculateFinancialValue,
      calculatePropertyValue,
      getFinancialCost,
      getPropertyCost,
      getProductName: investmentTab.getProductName,
      isProductUnlocked: investmentTab.isProductUnlocked,
      settings,
      ACHIEVEMENTS,
      now: () => Date.now(),
    })
    updateSynergyDisplay()
  }

  function updateAchievementGrid() {
    achievementGridInstance?.updateAchievementGrid()
  }

  // ======= Phase E: 투자 탭 및 버튼 상태 관리자 초기화 =======
  const { investmentTab, buttonStateManager: bsm } = initializeInvestmentSystem({
    settings,
    updateUI,
    performAutoPrestige,
    shareCallback: socialFeatures.shareGame, // 엔딩 모달 공유 버튼용
  })
  buttonStateManager = bsm

  const {
    getProductName,
    isProductUnlocked,
    checkNewUnlocks,
    getMarketEventMultiplier,
    startMarketEvent,
    checkMarketEvent,
    updateInvestmentMarketImpactUI,
    updateProductLockStates,
    initInvestmentEventListeners,
  } = investmentTab

  // ======= Phase F: gameUI 모듈 초기화 =======
  gameUIInstance = initializeGameUI({
    settings,
    updateInvestmentMarketImpactUI,
    updateButtonStates,
    updateBuildingItemStates,
    updateUpgradeAffordability,
    updateProductLockStates,
    updateStatsTab,
    getProductName,
  })

  // ======= 통계/투자 섹션 접기/펼치기 =======
  const collapsibleManager = createCollapsibleManager()
  collapsibleManager.initAll(100)

  // ======= 워크 시스템 초기화 =======
  workSystem = createWorkSystem({
    state: gameState,
    UPGRADES,
    CAREER_LEVELS,
    settings,
    getClickIncome,
    checkCareerPromotion,
    updateUpgradeProgress,
    updateUI,
    elWork,
  })

  // ======= 이벤트 리스너 설정 =======
  setupPurchaseModeButtons({ elBuyMode, elSellMode, gameState, updateUI })
  setupPurchaseQuantityButtons({ elQty1, elQty5, elQty10, gameState, updateUI })
  setupWorkClickHandler({ elWork, workSystem })

  // 공유하기/즐겨찾기 이벤트 리스너 (socialFeatures는 위에서 초기화됨)
  socialFeatures.initEventListeners({ shareBtn: elShareBtn, favoriteBtn: elFavoriteBtn })

  // 투자 탭 이벤트 리스너
  initInvestmentEventListeners({
    elBuyDeposit,
    elBuySavings,
    elBuyBond,
    elBuyUsStock,
    elBuyCrypto,
    elBuyVilla,
    elBuyOfficetel,
    elBuyApartment: elBuyApt,
    elBuyShop,
    elBuyBuilding,
    elBuyTower,
  })

  // 키보드 단축키
  const keyboardShortcuts = createKeyboardShortcuts({
    saveLoadManager,
    Diary,
    t,
    getImportFileInput: () => document.getElementById('importFileInput'),
  })
  keyboardShortcuts.initKeyboardShortcuts()

  // ======= 알림 매니저 =======
  const notificationManager = createNotificationManager({ toastInfo })

  // ======= 게임 루프 매니저 =======
  function initGameLoopManager() {
    gameLoopManager = createGameLoopManager({
      gameState,
      UPGRADES,
      settings,
      TIMING,
      MARKET_EVENT_TIMING,
      PROBABILITY,
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
      saveGame: () => saveLoadManager?.saveGame(),
      Animations,
      notificationManager,
      formatNumber: NumberFormat.formatNumber,
      t,
      elWork,
    })
    gameLoopManager.startAllLoops()
  }

  // 푸터 연도 동적 설정
  const elCurrentYear = document.getElementById('currentYear')
  if (elCurrentYear) {
    elCurrentYear.textContent = new Date().getFullYear()
  }

  // 초기 배경 이미지 설정
  const initialCareer = getCurrentCareer()
  if (elWorkArea && initialCareer?.bgImage) {
    elWorkArea.style.backgroundImage = `url('${initialCareer.bgImage}')`
  }

  // ======= Phase G: 저장/로드 및 클라우드 동기화 시스템 초기화 =======
  const { cloudSyncManager: csm, saveLoadManager: slm } = initializePersistence({
    UPGRADES,
    ACHIEVEMENTS,
    updateAutoWorkUI,
    updateSaveStatus,
    performAutoPrestige,
    calculateTotalAssetValueFromSave,
    calculatePlayTimeMsFromSave,
    updateUI,
  })
  cloudSyncManager = csm
  saveLoadManager = slm

  setupResetButtons({ elResetBtn, saveLoadManager })
  setupSettingsTabButtons({ saveLoadManager })
  initGameLoopManager()

  // ======= Phase H: 프레스티지 및 닉네임 시스템 초기화 =======
  const { prestigeSystem: ps, nicknameManager: nm } = initializePrestigeAndNickname({
    UPGRADES,
    saveLoadManager,
    updateUI,
    updateAutoWorkUI,
    cloudSyncManager,
  })
  prestigeSystem = ps
  nicknameManager = nm

  // 초기 렌더 함수
  async function initializeGame() {
    const gameLoaded = saveLoadManager.loadGame()

    // 현재/다음 레벨 배경 이미지 프리로드 (비동기, 에러 무시)
    preloadCareerImages()

    // 일기장 시스템 초기화
    if (elLog) {
      Diary.initDiary(elLog, {
        gameStartTime: gameState.gameStartTime,
        sessionStartTime: gameState.sessionStartTime,
      })
    }

    await syncNicknameFromServer('Initial ')

    if (gameLoaded) {
      Diary.addLog(t('msg.gameLoaded'))
      nicknameManager?.ensureNicknameModal()
    } else {
      Diary.addLog(t('msg.welcome'))
      const willReload = cloudSyncManager ? await cloudSyncManager.maybeOfferCloudRestore() : false
      if (!willReload) {
        nicknameManager?.ensureNicknameModal()
      }
    }
  }

  // ======= 리더보드 UI 시스템 초기화 =======
  LeaderboardUI.initLeaderboardUI(() => ({
    playerNickname: gameState.playerNickname,
    cash: gameState.cash,
    calculateTotalAssetValue,
    sessionStartTime: gameState.sessionStartTime,
    totalPlayTime: gameState.totalPlayTime,
    towers_lifetime: gameState.towers_lifetime,
    __IS_DEV__,
  }))

  // 초기 UI 업데이트
  updateUI()
  updateProductLockStates()

  // 경력 탭 (CP 상점) 초기화
  ensureTranslationLoaded(getLang()).then(() => {
    initPrestigeTab(t, NumberFormat.formatNumber)
  })

  // ======= 언어 UI 관리자 초기화 =======
  const i18nUIManager = createI18nUIManager({
    t,
    setLang,
    getLang,
    applyI18nToDOMAsync,
    safeText,
    getCareerName,
    getCareerLevel: () => gameState.careerLevel,
    updateUI,
    updateAchievementGrid,
    refreshPrestigeTab,
    updateSaveStatus,
    updateLeaderboardUI: LeaderboardUI.updateLeaderboardUI,
    updateUpgradeList,
    NumberFormat,
  })
  i18nUIManager.initSettingsToggles(settings)
  i18nUIManager.initLanguageSelector()

  // 클라우드 세이브 설정
  initializeGame()
  setupCloudSaveButtons({ cloudSyncManager })
  cloudSyncManager.initAuthListener()

  // ======= 인증 UI 관리자 초기화 =======
  const authUIManager = createAuthUIManager({
    getUser,
    onAuthStateChange,
    signInGoogle,
    signOut,
    t,
    toastSuccess,
    toastError,
  })
  authUIManager.initAuthUI()
  cloudSyncManager.initVisibilityListeners()

  // ======= 설정 탭 관리자 초기화 =======
  const settingsTabManager = createSettingsTabManager({
    settings,
    SETTINGS_KEY,
    saveLoadManager,
    updateUI,
    updateAchievementGrid: () => achievementGridInstance?.updateAchievementGrid(),
    updateSaveStatus,
    refreshPrestigeTab,
    t,
    getLang,
    setLang,
    applyI18nToDOMAsync,
    NumberFormat,
    getCareerName,
    getCareerLevel: () => gameState.careerLevel,
    safeText,
    notificationManager,
  })
  settingsTabManager.initSettingsTab()

  // ======= 설정 모달 초기화 =======
  import('./ui/settingsModal.js').then(({ createSettingsModal }) => {
    const settingsModal = createSettingsModal({
      syncNicknameFromServer,
    })
    settingsModal.initSettingsModal()
  })

  // ======= 하단 네비게이션 탭 전환 =======
  const tabNavigation = createTabNavigation({
    refreshPrestigeTab,
    LeaderboardUI,
    setupAchievementScrollOptimization: () => {
      achievementGridInstance?.setupAchievementScrollOptimization()
    },
  })
  tabNavigation.initTabNavigation()

  updateUI()
  updateProductLockStates()

  // 초기 리더보드 로드/폴링 및 Observer 설정
  setTimeout(() => {
    const rankingTab = document.getElementById('rankingTab')
    if (rankingTab?.classList.contains('active')) {
      LeaderboardUI.startLeaderboardPolling()
    }
    LeaderboardUI.setupLeaderboardObserver()
    LeaderboardUI.initLeaderboardRefreshButton()
  }, 1000)

  // 업그레이드 섹션 초기 상태 설정
  const upgradeListElement = document.getElementById('upgradeList')
  if (upgradeListElement) {
    upgradeListElement.classList.remove('collapsed-section')
  }
  // 번역 로드 후 업그레이드 목록 렌더링
  ensureTranslationLoaded(getLang()).then(() => {
    updateUpgradeList()
  })

  // 닉네임 변경 기능
  setupNicknameButtons({ nicknameManager })

  // Toast 시스템을 window에 연결
  window.toast = {
    success: toastSuccess,
    error: toastError,
    info: toastInfo,
    warning: toastWarning,
  }

  // ======= 개발 치트 시스템 초기화 (DEV 모드에서만 동적 로드) =======
  if (__IS_DEV__) {
    import('./systems/devCheatSystem.js').then(({ createDevCheatSystem }) => {
      const devCheatSystem = createDevCheatSystem({
        gameState,
        UPGRADES,
        updateUI,
        updateUpgradeList,
        checkUpgradeUnlocks,
        refreshPrestigeTab,
        t,
        NumberFormat,
        __IS_DEV__,
      })
      devCheatSystem.initDevCheats()
    })
  }
})
