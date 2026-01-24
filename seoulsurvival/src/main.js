import { safeGetJSON, safeRemove, safeSetJSON } from './persist/storage.js'
import {
  getFinancialCost,
  getFinancialSellPrice,
  getPropertyCost,
  getPropertySellPrice,
} from './economy/pricing.js'
import {
  setMarketEventMultiplier,
  getClickIncome,
  getCurrentCareer,
  getNextCareer,
  getCareerName,
  getRps,
  getTotalIncomeForContribution,
  getFinancialIncome,
  getPropertyIncome,
} from './economy/incomeCalculator.js'
import { createAssetCalculator } from './economy/assetCalculator.js'
import { createMarketSystem } from './systems/market.js'
import { createAchievementsSystem } from './systems/achievements.js'
import { createUpgradeUnlockSystem } from './systems/upgrades.js'
import { createUpgradeManager } from './systems/upgradeManager.js'
import { createWorkSystem } from './systems/workSystem.js'
import { createPrestigeSystem } from './systems/prestigeSystem.js'
import { createCareerSystem } from './systems/careerSystem.js'
import { getDomRefs } from './ui/domRefs.js'
import { safeClass, safeHTML, safeText } from './ui/domUtils.js'
import {
  updateStatsTab as updateStatsTabImpl,
  resetGrowthTracking,
  loadGrowthTracking,
  saveGrowthTracking,
  setAchievementScrollActive,
} from './ui/statsTab.js'
import { createInvestmentTab } from './ui/investmentTab.js'
import { createGameUI } from './ui/gameUI.js'
import { createAchievementGrid } from './ui/achievementGrid.js'
import { createButtonStateManager } from './ui/buttonStates.js'
import { createCollapsibleManager } from './ui/collapsible.js'
import { createCloudSyncManager } from './persist/cloudSync.js'
import { createSaveLoadManager } from './persist/saveLoad.js'
import { createNicknameManager } from './systems/nicknameManager.js'
import { getUser, onAuthStateChange, signInGoogle, signOut } from '../../shared/auth/core.js'
import { isSupabaseConfigured } from '../../shared/auth/config.js'
import {
  updateLeaderboard,
  getLeaderboard,
  isNicknameTaken,
  normalizeNickname,
  validateNickname,
  claimNickname,
  getMyRank,
} from '../../shared/leaderboard.js'
import {
  t,
  applyI18nToDOM,
  applyI18nToDOMAsync,
  setLang,
  getLang,
  getInitialLang,
  ensureTranslationLoaded,
} from './i18n/index.js'
import { GAME_VERSION } from './version.js'
import * as NumberFormat from './utils/numberFormat.js'
import * as Modal from './ui/modal.js'
import * as Animations from './ui/animations.js'
import { toastSuccess, toastError, toastInfo, toastWarning } from './ui/toast.js'
import * as Diary from './systems/diary.js'
import * as LeaderboardUI from './ui/leaderboardUI.js'
import { updateSynergyDisplay } from './ui/synergyDisplay.js'
import { updateCompletionistSynergy } from './systems/synergy.js'
import { initSentry } from './monitoring/sentry.js'
import { setupErrorBoundary } from './core/errorBoundary.js'
import { createUpgrades } from './data/upgrades.js'
import { createAchievements } from './data/achievements.js'
import { createTabNavigation } from './ui/tabNavigation.js'
import { createSocialFeatures } from './ui/socialFeatures.js'
import { createKeyboardShortcuts } from './ui/keyboardShortcuts.js'
import { createInAppBrowserHandler } from './ui/inAppBrowserHandler.js'
import { createHeaderResponsiveManager } from './ui/headerResponsiveManager.js'
import { createSettingsTabManager } from './ui/settingsTabManager.js'
import { createAuthUIManager } from './ui/authUIManager.js'
import { createDevCheatSystem } from './systems/devCheatSystem.js'
import {
  setupPurchaseModeButtons,
  setupPurchaseQuantityButtons,
  setupWorkClickHandler,
  setupSettingsTabButtons,
  setupCloudSaveButtons,
  setupResetButtons,
  setupToggleSwitches,
  setupNicknameButtons,
  setupGesturePreventions,
} from './ui/eventSetup.js'
import { createGameLoopManager } from './systems/gameLoopManager.js'
import { createI18nUIManager } from './ui/i18nUIManager.js'
import { showAchievementNotification } from './ui/achievementNotification.js'
import {
  gameState,
  FINANCIAL_INCOME,
  BASE_RENT,
  CAREER_LEVELS,
  SAVE_KEY,
  CLOUD_RESTORE_BLOCK_KEY,
  CLOUD_RESTORE_SKIP_KEY,
  SETTINGS_KEY,
  resetIncomeTablesToDefault,
  reapplyIncomeTableAffectingUpgradeEffects,
  getTotalFinancialProducts,
  getTotalProperties,
  BASE_CLICK_GAIN,
} from './state/gameState.js'
import {
  getStartingCash,
  processPrestige,
  applyStartingBonuses,
  getAllPrestigeEffects,
  calculateCP,
} from './systems/prestigeBonus.js'
import { initPrestigeTab, renderPrestigeTab, refreshPrestigeTab } from './ui/prestigeTab.js'

// ===== CSS 번들링 보장 =====
// Vite 빌드 시 HTML의 <link> 태그가 처리되지 않는 문제 해결
import '../styles/header.css'

// ===== 밸런스 설정 import =====
import { MARKET_EVENTS, BASE_COSTS } from './balance/index.js'
import { TIMING, MARKET_EVENT_TIMING, PROBABILITY, ANIMATION } from './balance/timing.js'

// 개발 모드에서는 콘솔을 유지하고, 프로덕션에서는 게임 로그만 무력화합니다.
// - Vite 빌드/개발서버: import.meta.env.DEV 사용
// - GitHub Pages처럼 번들 없이 ESM으로 직접 로드하는 경우: import.meta.env가 없을 수 있음
// DEV 모드 체크 (Vite 기준, optional chaining 사용)
const __IS_DEV__ = !!import.meta?.env?.DEV

// 게임 전용 로거 - 프로덕션에서는 무력화, 개발 모드에서는 활성화
// 외부 SDK(Supabase 등)의 console.error는 유지하여 중요 오류 추적 가능
const gameLog = __IS_DEV__ ? console.log.bind(console) : () => {}
const gameWarn = __IS_DEV__ ? console.warn.bind(console) : () => {}
const gameError = __IS_DEV__ ? console.error.bind(console) : () => {}

document.addEventListener('DOMContentLoaded', () => {
  // ======= 모듈 인스턴스 선언 (나중에 초기화) =======
  let saveLoadManager = null
  let nicknameManager = null
  let cloudSyncManager = null
  let gameUIInstance = null // gameUI.js 모듈 인스턴스
  let workSystem = null // workSystem.js 모듈 인스턴스
  let prestigeSystem = null // prestigeSystem.js 모듈 인스턴스

  // ======= 자산 계산기 초기화 =======
  const assetCalculator = createAssetCalculator({ gameState })

  // assetCalculator 위임 함수들 (TDZ 방지를 위해 즉시 정의)
  const calculateFinancialValue = () => assetCalculator.calculateFinancialValue()
  const calculatePropertyValue = () => assetCalculator.calculatePropertyValue()
  const calculateTotalAssetValue = () => assetCalculator.calculateTotalAssetValue()
  const getTotalAssets = () => assetCalculator.getTotalAssets()
  const calculateFinancialValueForType = (type, count) =>
    assetCalculator.calculateFinancialValueForType(type, count)
  const calculatePropertyValueForType = (type, count) =>
    assetCalculator.calculatePropertyValueForType(type, count)
  const calculateTotalAssetValueFromSave = saveData =>
    assetCalculator.calculateTotalAssetValueFromSave(saveData)
  const calculatePlayTimeMsFromSave = (saveData, sessionStartTime) =>
    assetCalculator.calculatePlayTimeMsFromSave(saveData, sessionStartTime)

  // updateSaveStatus 함수 (saveLoadManager 초기화 후 호출 가능)
  function updateSaveStatus() {
    if (saveLoadManager && saveLoadManager.updateSaveStatus) {
      saveLoadManager.updateSaveStatus()
    }
  }

  // ======= Sentry 초기화 (프로덕션 전용) =======
  if (import.meta.env.PROD) {
    initSentry()
  }

  // ======= 에러 바운더리 설정 =======
  setupErrorBoundary()

  // ======= i18n 초기화 =======
  // 초기 언어 설정 (URL → localStorage → 브라우저 언어)
  const initialLang = getInitialLang()
  setLang(initialLang)
  // 번역 로드 완료 후 DOM에 적용 (비동기)
  applyI18nToDOMAsync()

  // ======= 모달 시스템 초기화 =======
  Modal.initModal()

  // ======= 헤더 반응형 관리자 초기화 =======
  const headerResponsiveManager = createHeaderResponsiveManager()
  headerResponsiveManager.initResizeListeners()

  // ======= 인앱 브라우저 핸들러 초기화 =======
  const inAppBrowserHandler = createInAppBrowserHandler({ t })
  inAppBrowserHandler.showWarningIfNeeded()

  // ======= (iOS) 더블탭/핀치로 인한 화면 확대 방지 =======
  // 요구사항: 노동하기 반복 터치 시 발생하는 화면 확대를 차단
  // - meta viewport(user-scalable=no) + gesture 이벤트 preventDefault로 이중 안전장치
  setupGesturePreventions()

  // ======= 상태 =======
  const fmt = new Intl.NumberFormat('ko-KR')

  // 모듈 인스턴스
  let achievementGridInstance = null
  let buttonStateManager = null

  // ======= 업그레이드 시스템 =======
  let UPGRADES = null
  let upgradeManager = null
  let updateUpgradeAffordability, updateUpgradeProgress, updateUpgradeList, purchaseUpgrade

  // 설정 옵션
  let settings = {
    particles: true,
    fancyGraphics: true,
    shortNumbers: false,
  }

  // ACHIEVEMENTS 배열 (팩토리 함수로 생성)
  let ACHIEVEMENTS = null

  // ======= DOM (캐시된 참조 사용) =======
  const DOM = getDomRefs()

  // Phase 17: DOM 요소 단축 참조 축소 (main.js에서 직접 사용하는 요소만)
  // gameUI, buttonStates 등 모듈은 getDomRefs() 직접 import
  const {
    // 핵심 UI 요소
    elWork,
    elWorkArea,
    elAutoWorkIndicator,
    elLog,
    // 소셜 기능
    elShareBtn,
    elFavoriteBtn,
    // 구매 모드/수량 버튼
    elBuyMode,
    elSellMode,
    elQty1,
    elQty5,
    elQty10,
    // 리셋 버튼
    elResetBtn,
    // 투자 탭 이벤트 리스너용
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

  // ======= 애니메이션 시스템 초기화 =======
  Animations.initAnimations(elWork)

  // 오토 업무 처리 시스템 UI 상태 동기화
  function updateAutoWorkUI() {
    if (elWorkArea) {
      elWorkArea.classList.toggle('auto-click-enabled', gameState.autoClickEnabled)
    }
    if (elAutoWorkIndicator) {
      elAutoWorkIndicator.style.display = gameState.autoClickEnabled ? '' : 'none'
    }
  }

  // 서버에서 닉네임 동기화 (로그인 상태인 경우)
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

  // ======= UPGRADES 및 ACHIEVEMENTS 팩토리 함수로 생성 =======
  // 필요한 모든 의존성을 주입하여 UPGRADES 객체 생성
  UPGRADES = createUpgrades({
    getCareerLevel: () => gameState.careerLevel,
    getClickMultiplier: () => gameState.clickMultiplier,
    setClickMultiplier: v => {
      gameState.clickMultiplier = v
    },
    getTotalClicks: () => gameState.totalClicks,
    getDeposits: () => gameState.deposits,
    getSavings: () => gameState.savings,
    getBonds: () => gameState.bonds,
    getUsStocks: () => gameState.usStocks,
    getCryptos: () => gameState.cryptos,
    getVillas: () => gameState.villas,
    getOfficetels: () => gameState.officetels,
    getApartments: () => gameState.apartments,
    getShops: () => gameState.shops,
    getBuildings: () => gameState.buildings,
    getTotalProperties,
    updateAutoWorkUI,
    setAutoClickEnabled: enabled => {
      gameState.autoClickEnabled = enabled
    },
    incrementManagerLevel: () => {
      gameState.managerLevel++
    },
    FINANCIAL_INCOME,
    BASE_RENT,
    getRentMultiplier: () => gameState.rentMultiplier,
    setRentMultiplier: v => {
      gameState.rentMultiplier = v
    },
  })

  // upgradeManager 초기화
  upgradeManager = createUpgradeManager({
    UPGRADES,
    getCash: () => gameState.cash,
    setCash: newCash => {
      gameState.cash = newCash
    },
    CAREER_LEVELS,
  })
  ;({ updateUpgradeAffordability, updateUpgradeProgress, updateUpgradeList, purchaseUpgrade } =
    upgradeManager)

  // ACHIEVEMENTS 배열 생성
  ACHIEVEMENTS = createAchievements({
    getTotalClicks: () => gameState.totalClicks,
    getDeposits: () => gameState.deposits,
    getSavings: () => gameState.savings,
    getBonds: () => gameState.bonds,
    getUsStocks: () => gameState.usStocks,
    getCryptos: () => gameState.cryptos,
    getVillas: () => gameState.villas,
    getOfficetels: () => gameState.officetels,
    getApartments: () => gameState.apartments,
    getShops: () => gameState.shops,
    getBuildings: () => gameState.buildings,
    getTotalProperties,
    getTotalAssets: () => assetCalculator.getTotalAssets(),
    getCareerLevel: () => gameState.careerLevel,
    getTowersLifetime: () => gameState.towers_lifetime,
    UPGRADES,
    getFinancialCost,
  })

  // achievementGrid 모듈 초기화
  achievementGridInstance = createAchievementGrid({
    getAchievements: () => ACHIEVEMENTS,
    t,
    isDev: __IS_DEV__,
  })

  // 업적 체크 (achievementNotification.js 모듈 사용)
  function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true
        showAchievementNotification(achievement, t)
        // 업적 번역 키가 없으면 원본 한글 사용 (fallback)
        const achievementName = t(`achievement.${achievement.id}.name`, {}, achievement.name)
        const achievementDesc = t(`achievement.${achievement.id}.desc`, {}, achievement.desc)
        Diary.addLog(t('msg.achievementUnlocked', { name: achievementName, desc: achievementDesc }))
      }
    })
  }

  // ======= 업그레이드 시스템 함수 =======

  // 업그레이드 해금 조건 체크
  function checkUpgradeUnlocks() {
    let newUnlocks = 0

    for (const [id, upgrade] of Object.entries(UPGRADES)) {
      // 이미 구매했거나 해금된 경우 스킵
      if (upgrade.purchased || upgrade.unlocked) continue

      // 해금 조건 체크
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

  // ======= 커리어 시스템 초기화 (Phase 14) =======
  const careerSystem = createCareerSystem({ elWorkArea })
  const checkCareerPromotion = careerSystem.checkCareerPromotion

  // 버튼 상태 업데이트 함수 (buttonStates.js 모듈로 위임)
  function updateButtonStates() {
    if (buttonStateManager) {
      buttonStateManager.updateButtonStates()
    }
  }

  // 건물 목록 색상 업데이트 함수 (buttonStates.js 모듈로 위임)
  function updateBuildingItemStates() {
    if (buttonStateManager) {
      buttonStateManager.updateBuildingItemStates()
    }
  }

  function saveSettings() {
    try {
      safeSetJSON(SETTINGS_KEY, settings)
    } catch (error) {
      console.error('설정 저장 실패:', error)
    }
  }

  // 설정 불러오기 함수
  function loadSettings() {
    try {
      const saved = safeGetJSON(SETTINGS_KEY, null)
      if (saved) {
        settings = { ...settings, ...saved }
      }
    } catch (error) {
      console.error('설정 불러오기 실패:', error)
    }
  }

  function updateUI() {
    if (gameUIInstance) {
      gameUIInstance.updateUI()
    }
    // gameUIInstance가 초기화되기 전에는 아무것도 하지 않음
    // (초기화 순서상 updateUI()는 gameUIInstance 초기화 후에만 호출됨)

    // 경력 탭 네비게이션 버튼 표시/숨김 (타워 1+ 또는 CP 1+ 일 때 표시)
    const careerNavBtn = document.getElementById('careerNavBtn')
    if (careerNavBtn) {
      const shouldShowCareer = gameState.towers_lifetime > 0 || gameState.careerPoints > 0
      careerNavBtn.style.display = shouldShowCareer ? '' : 'none'
    }
  }

  // ======= 투자 탭 UI 시스템 초기화 =======
  const investmentTab = createInvestmentTab({
    // State getters/setters
    getCash: () => gameState.cash,
    setCash: newCash => {
      gameState.cash = newCash
    },
    getPurchaseMode: () => gameState.purchaseMode,
    getPurchaseQuantity: () => gameState.purchaseQuantity,
    getSettings: () => settings,
    getCurrentMarketEvent: () => gameState.currentMarketEvent,
    getMarketEventEndTime: () => gameState.marketEventEndTime,
    setCurrentMarketEvent: event => {
      gameState.currentMarketEvent = event
    },
    setMarketEventEndTime: time => {
      gameState.marketEventEndTime = time
    },
    getCareerLevel: () => gameState.careerLevel,

    // Product counts (getters/setters)
    getDeposits: () => gameState.deposits,
    setDeposits: count => {
      gameState.deposits = count
    },
    getSavings: () => gameState.savings,
    setSavings: count => {
      gameState.savings = count
    },
    getBonds: () => gameState.bonds,
    setBonds: count => {
      gameState.bonds = count
    },
    getUsStocks: () => gameState.usStocks,
    setUsStocks: count => {
      gameState.usStocks = count
    },
    getCryptos: () => gameState.cryptos,
    setCryptos: count => {
      gameState.cryptos = count
    },
    getVillas: () => gameState.villas,
    setVillas: count => {
      gameState.villas = count
    },
    getOfficetels: () => gameState.officetels,
    setOfficetels: count => {
      gameState.officetels = count
    },
    getApartments: () => gameState.apartments,
    setApartments: count => {
      gameState.apartments = count
    },
    getShops: () => gameState.shops,
    setShops: count => {
      gameState.shops = count
    },
    getBuildings: () => gameState.buildings,
    setBuildings: count => {
      gameState.buildings = count
    },
    getTower: () => gameState.towers_run,
    setTower: count => {
      gameState.towers_run = count
    },

    // Helper functions
    getFinancialCost,
    getPropertyCost,
    getFinancialSellPrice,
    getPropertySellPrice,
    updateUI,

    // Constants
    CAREER_LEVELS,
    MARKET_EVENTS,

    // gameState 직접 참조 (타워 구매 시 towers_lifetime 업데이트용)
    gameState,

    // 프레스티지 시스템 (타워 구매 후 호출)
    performAutoPrestige,
  })

  // Destructure functions from investmentTab
  const {
    getProductName,
    isProductUnlocked,
    checkNewUnlocks,
    handleTransaction,
    showPurchaseSuccess,
    getMarketEventMultiplier,
    startMarketEvent,
    showMarketEventNotification,
    checkMarketEvent,
    updateInvestmentMarketImpactUI,
    updateProductLockStates,
    updateButton,
    initInvestmentEventListeners,
  } = investmentTab

  // incomeCalculator에 시장 이벤트 배수 함수 주입 (Phase 13)
  setMarketEventMultiplier(getMarketEventMultiplier)

  // ======= buttonStateManager 초기화 =======
  // Phase 17: DOM 요소는 모듈이 getDomRefs() 직접 import
  buttonStateManager = createButtonStateManager({
    // State getters
    getCash: () => gameState.cash,
    getPurchaseMode: () => gameState.purchaseMode,
    getPurchaseQuantity: () => gameState.purchaseQuantity,
    getDeposits: () => gameState.deposits,
    getSavings: () => gameState.savings,
    getBonds: () => gameState.bonds,
    getUsStocks: () => gameState.usStocks,
    getCryptos: () => gameState.cryptos,
    getVillas: () => gameState.villas,
    getOfficetels: () => gameState.officetels,
    getApartments: () => gameState.apartments,
    getShops: () => gameState.shops,
    getBuildings: () => gameState.buildings,
    // Helper functions
    getFinancialCost,
    getPropertyCost,
    isProductUnlocked,
  })

  // ======= gameUI 모듈 초기화 =======
  // Phase 17: DOM 요소는 모듈이 getDomRefs() 직접 import
  gameUIInstance = createGameUI({
    // State getters
    getCash: () => gameState.cash,
    getDeposits: () => gameState.deposits,
    getSavings: () => gameState.savings,
    getBonds: () => gameState.bonds,
    getUsStocks: () => gameState.usStocks,
    getCryptos: () => gameState.cryptos,
    getVillas: () => gameState.villas,
    getOfficetels: () => gameState.officetels,
    getApartments: () => gameState.apartments,
    getShops: () => gameState.shops,
    getBuildings: () => gameState.buildings,
    getTowersRun: () => gameState.towers_run,
    getTowersLifetime: () => gameState.towers_lifetime,
    getDepositsLifetime: () => gameState.depositsLifetime,
    getSavingsLifetime: () => gameState.savingsLifetime,
    getBondsLifetime: () => gameState.bondsLifetime,
    getUsStocksLifetime: () => gameState.usStocksLifetime,
    getCryptosLifetime: () => gameState.cryptosLifetime,
    getVillasLifetime: () => gameState.villasLifetime,
    getOfficetelsLifetime: () => gameState.officetelsLifetime,
    getApartmentsLifetime: () => gameState.apartmentsLifetime,
    getShopsLifetime: () => gameState.shopsLifetime,
    getBuildingsLifetime: () => gameState.buildingsLifetime,
    getPurchaseMode: () => gameState.purchaseMode,
    getPurchaseQuantity: () => gameState.purchaseQuantity,
    getPlayerNickname: () => gameState.playerNickname,
    getTotalClicks: () => gameState.totalClicks,
    getCareerLevel: () => gameState.careerLevel,
    getClickMultiplier: () => gameState.clickMultiplier,
    getRentMultiplier: () => gameState.rentMultiplier,
    getMarketMultiplier: () => gameState.marketMultiplier,
    getSettings: () => settings,
    getGameStartTime: () => gameState.gameStartTime,
    getSessionStartTime: () => gameState.sessionStartTime,

    // State setters
    setTotalClicks: v => {
      gameState.totalClicks = v
    },
    setDeposits: v => {
      gameState.deposits = v
    },
    setSavings: v => {
      gameState.savings = v
    },
    setBonds: v => {
      gameState.bonds = v
    },

    // Helper functions
    getCareerName,
    getCurrentCareer,
    getNextCareer,
    getClickIncome,
    getRps,
    getTotalFinancialProducts,
    getTotalProperties,
    getTotalIncomeForContribution,
    getFinancialIncome,
    getPropertyIncome,
    getFinancialCost,
    getFinancialSellPrice,
    getPropertyCost,
    getPropertySellPrice,
    getProductName,

    // UI update functions
    updateInvestmentMarketImpactUI,
    updateButtonStates,
    updateBuildingItemStates,
    updateUpgradeAffordability,
    updateProductLockStates,
    updateStatsTab,
  })

  // ======= 통계/투자 섹션 접기/펼치기 기능 (collapsible.js 모듈로 위임) =======
  const collapsibleManager = createCollapsibleManager()
  collapsibleManager.initAll(100) // 지연 초기화 (DOMContentLoaded 이후)

  // ======= 워크 시스템 초기화 (workSystem.js 모듈) =======
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

  // ======= 구매 수량 선택 시스템 (eventSetup.js 모듈로 위임) =======
  setupPurchaseModeButtons({ elBuyMode, elSellMode, gameState, updateUI })
  setupPurchaseQuantityButtons({ elQty1, elQty5, elQty10, gameState, updateUI })

  // ======= 액션 (eventSetup.js 모듈로 위임) =======
  setupWorkClickHandler({ elWork, workSystem })

  // ======= 공유하기/즐겨찾기 기능 (socialFeatures.js 모듈) =======
  const socialFeatures = createSocialFeatures({
    t,
    Diary,
    Modal,
    NumberFormat,
    settings,
    getCash: () => gameState.cash,
    getRps,
  })
  socialFeatures.initEventListeners({
    shareBtn: elShareBtn,
    favoriteBtn: elFavoriteBtn,
  })

  // 새로 시작 버튼 이벤트 리스너는 saveLoadManager 초기화 후에 설정됨
  // (아래 saveLoadManager 생성 후 설정)

  // 금융상품 거래 이벤트 (구매/판매 통합)
  // 투자 탭 이벤트 리스너 초기화 (investmentTab 모듈에서 관리)
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

  // 자동 프레스티지 실행 함수 - prestigeSystem.js로 이동됨
  async function performAutoPrestige(source = 'unknown') {
    if (prestigeSystem) {
      return await prestigeSystem.performPrestige(source)
    }
    console.error('❌ prestigeSystem이 초기화되지 않았습니다.')
  }

  // ======= 키보드 단축키 (keyboardShortcuts.js 모듈) =======
  const keyboardShortcuts = createKeyboardShortcuts({
    saveLoadManager,
    Diary,
    t,
    getImportFileInput: () => document.getElementById('importFileInput'),
  })
  keyboardShortcuts.initKeyboardShortcuts()

  // ======= 게임 루프 매니저 =======
  let gameLoopManager = null

  function initGameLoopManager() {
    gameLoopManager = createGameLoopManager({
      gameState,
      UPGRADES,
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
      elWork,
    })
    gameLoopManager.startAllLoops()
  }

  // 설정 불러오기
  loadSettings()

  // 푸터 연도 동적 설정
  const elCurrentYear = document.getElementById('currentYear')
  if (elCurrentYear) {
    elCurrentYear.textContent = new Date().getFullYear()
  }

  // 초기 렌더 함수 (saveLoadManager/nicknameManager 초기화 후 호출)
  async function initializeGame() {
    const gameLoaded = saveLoadManager.loadGame() // 게임 데이터 불러오기 시도

    // ======= 일기장 시스템 초기화 (loadGame 이후에 초기화하여 정확한 gameStartTime 사용) =======
    if (elLog) {
      Diary.initDiary(elLog, {
        gameStartTime: gameState.gameStartTime,
        sessionStartTime: gameState.sessionStartTime,
      })
    }

    // 게임 로드 후 서버에서 최신 닉네임 동기화
    await syncNicknameFromServer('Initial ')

    if (gameLoaded) {
      Diary.addLog(t('msg.gameLoaded'))
      // 로컬 저장이 있으면 즉시 닉네임 모달 확인
      nicknameManager?.ensureNicknameModal()
    } else {
      Diary.addLog(t('msg.welcome'))
      // 로컬 저장이 없으면 클라우드 복구를 먼저 확인
      const willReload = cloudSyncManager ? await cloudSyncManager.maybeOfferCloudRestore() : false
      if (!willReload) {
        // 클라우드 복구가 트리거되지 않았으면 닉네임 모달 확인
        // (사용자가 "나중에"를 선택했거나, 클라우드 세이브가 없음)
        nicknameManager?.ensureNicknameModal()
      }
      // willReload가 true면 리로드가 예약되었으므로 닉네임 모달은 리로드 후 처리됨
    }
  }
  // 초기 배경 이미지 설정
  const initialCareer = getCurrentCareer()
  if (elWorkArea && initialCareer && initialCareer.bgImage) {
    elWorkArea.style.backgroundImage = `url('${initialCareer.bgImage}')`
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

  // 초기 UI 업데이트 (동적 텍스트 포함)
  updateUI()
  updateProductLockStates()

  // 경력 탭 (CP 상점) 초기화 - 번역 로드 완료 후 실행
  ensureTranslationLoaded(getLang()).then(() => {
    initPrestigeTab(t, NumberFormat.formatNumber)
  })

  // ======= 언어 UI 관리자 초기화 (i18nUIManager.js 모듈) =======
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
    NumberFormat,
  })
  i18nUIManager.initSettingsToggles(settings)
  i18nUIManager.initLanguageSelector()

  // ======= 클라우드 세이브 =======
  cloudSyncManager = createCloudSyncManager({
    getUser,
    Modal,
    t,
    getLang,
    SAVE_KEY,
    CLOUD_RESTORE_BLOCK_KEY,
    CLOUD_RESTORE_SKIP_KEY,
    calculateTotalAssetValueFromSave,
    calculatePlayTimeMsFromSave,
    sessionStartTime: gameState.sessionStartTime,
    updateUI,
    LeaderboardUI,
    onAuthStateChange,
    claimNickname,
    normalizeNickname,
    getPlayerNickname: () => gameState.playerNickname,
    setPlayerNickname: value => {
      gameState.playerNickname = value
    },
    __IS_DEV__,
  })

  // ======= 저장/로드 시스템 =======
  saveLoadManager = createSaveLoadManager({
    SAVE_KEY,
    gameVars: gameState, // gameState 객체를 직접 참조
    UPGRADES,
    ACHIEVEMENTS,
    reapplyIncomeTableAffectingUpgradeEffects,
    updateAutoWorkUI,
    updateSaveStatus,
    performAutoPrestige,
    t,
    getLang,
    Modal,
    Diary,
    LeaderboardUI,
    upsertCloudSave: cloudSyncManager ? cloudSyncManager.upsertCloudSave : null,
    cloudState: {
      get __currentUser() {
        return cloudSyncManager?.__currentUser
      },
      get __cloudPendingSave() {
        return cloudSyncManager?.__cloudPendingSave
      },
      set __cloudPendingSave(v) {
        if (cloudSyncManager) cloudSyncManager.__cloudPendingSave = v
      },
      get __lastCloudUploadedSaveTs() {
        return cloudSyncManager?.__lastCloudUploadedSaveTs || 0
      },
    },
    __IS_DEV__,
    calculateCP,
  })

  setupResetButtons({ elResetBtn, saveLoadManager })
  setupSettingsTabButtons({ saveLoadManager })
  initGameLoopManager()

  // ======= 프레스티지 시스템 초기화 =======
  prestigeSystem = createPrestigeSystem({
    state: gameState,
    UPGRADES,
    saveLoadManager,
    LeaderboardUI,
    Diary,
    t,
    updateUI,
    updateAutoWorkUI,
  })

  // ======= 닉네임 관리 시스템 =======
  nicknameManager = createNicknameManager({
    SAVE_KEY,
    CLOUD_RESTORE_BLOCK_KEY,
    Modal,
    t,
    validateNickname,
    normalizeNickname,
    claimNickname,
    getUser,
    saveGame: () => saveLoadManager.saveGame(),
    updateUI,
    Diary,
    LeaderboardUI,
    upsertCloudSave: cloudSyncManager ? cloudSyncManager.upsertCloudSave : null,
    getPlayerNickname: () => gameState.playerNickname,
    setPlayerNickname: value => {
      gameState.playerNickname = value
    },
    __IS_DEV__,
    calculateCP,
  })

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
  setupToggleSwitches({ settings, saveSettings, updateUI })

  function updateStatsTab() {
    // Phase 15: statsTab.js가 gameState, FINANCIAL_INCOME, BASE_RENT를 직접 import
    // 외부 함수만 의존성으로 전달
    updateStatsTabImpl({
      safeText,
      getRps,
      getClickIncome,
      calculateTotalAssetValue,
      calculateFinancialValue,
      calculatePropertyValue,
      getFinancialCost,
      getPropertyCost,
      getProductName,
      isProductUnlocked,
      settings,
      ACHIEVEMENTS,
      now: () => Date.now(),
    })

    // 빌드 시너지 업데이트 (statsTab.js에는 없는 호출)
    updateSynergyDisplay()
  }

  function updateAchievementGrid() {
    if (achievementGridInstance) {
      achievementGridInstance.updateAchievementGrid()
    }
  }

  // ======= 하단 네비게이션 탭 전환 (tabNavigation.js 모듈) =======
  const tabNavigation = createTabNavigation({
    refreshPrestigeTab,
    syncNicknameFromServer,
    openNicknameChangeModal: () => nicknameManager?.openNicknameChangeModal(),
    LeaderboardUI,
    setupAchievementScrollOptimization: () => {
      if (achievementGridInstance) {
        achievementGridInstance.setupAchievementScrollOptimization()
      }
    },
  })
  tabNavigation.initTabNavigation()

  updateUI() // 초기 UI 업데이트
  updateProductLockStates() // 초기 잠금 상태 업데이트

  // 초기 리더보드 로드/폴링 및 Observer 설정
  setTimeout(() => {
    const rankingTab = document.getElementById('rankingTab')
    if (rankingTab && rankingTab.classList.contains('active')) {
      LeaderboardUI.startLeaderboardPolling()
    }
    LeaderboardUI.setupLeaderboardObserver()
    LeaderboardUI.initLeaderboardRefreshButton()
  }, 1000)

  // 업그레이드 섹션 초기 상태 설정 (열림)
  const upgradeListElement = document.getElementById('upgradeList')
  if (upgradeListElement) {
    upgradeListElement.classList.remove('collapsed-section')
  }

  updateUpgradeList() // 초기 업그레이드 리스트 생성

  // 닉네임 변경 기능 (eventSetup.js 모듈로 위임)
  setupNicknameButtons({ nicknameManager })

  // Toast 시스템을 window에 연결 (전역 접근용)
  window.toast = {
    success: toastSuccess,
    error: toastError,
    info: toastInfo,
    warning: toastWarning,
  }

  // ======= 개발 치트 시스템 초기화 =======
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
