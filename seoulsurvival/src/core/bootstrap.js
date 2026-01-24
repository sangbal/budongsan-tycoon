/**
 * bootstrap.js
 * 게임 부트스트랩 - main.js의 DOMContentLoaded 내부를 단계별로 분리
 * Phase 18: main.js 최적화
 */

import { safeGetJSON, safeSetJSON } from '../persist/storage.js'
import {
  getFinancialCost,
  getPropertyCost,
  getFinancialSellPrice,
  getPropertySellPrice,
} from '../economy/pricing.js'
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
} from '../economy/incomeCalculator.js'
import { createAssetCalculator } from '../economy/assetCalculator.js'
import { createMarketSystem } from '../systems/market.js'
import { createAchievementsSystem } from '../systems/achievements.js'
import { createUpgradeUnlockSystem } from '../systems/upgrades.js'
import { createUpgradeManager } from '../systems/upgradeManager.js'
import { createWorkSystem } from '../systems/workSystem.js'
import { createPrestigeSystem } from '../systems/prestigeSystem.js'
import { createCareerSystem, preloadCareerImages } from '../systems/careerSystem.js'
import { getDomRefs } from '../ui/domRefs.js'
import { safeClass, safeHTML, safeText } from '../ui/domUtils.js'
import {
  updateStatsTab as updateStatsTabImpl,
  resetGrowthTracking,
  loadGrowthTracking,
  saveGrowthTracking,
  setAchievementScrollActive,
} from '../ui/statsTab.js'
import { createInvestmentTab } from '../ui/investmentTab.js'
import { createGameUI } from '../ui/gameUI.js'
import { createAchievementGrid } from '../ui/achievementGrid.js'
import { createButtonStateManager } from '../ui/buttonStates.js'
import { createCollapsibleManager } from '../ui/collapsible.js'
import { createCloudSyncManager } from '../persist/cloudSync.js'
import { createSaveLoadManager } from '../persist/saveLoad.js'
import { createNicknameManager } from '../systems/nicknameManager.js'
import { getUser, onAuthStateChange, signInGoogle, signOut } from '../../../shared/auth/core.js'
import { isSupabaseConfigured } from '../../../shared/auth/config.js'
import {
  updateLeaderboard,
  getLeaderboard,
  isNicknameTaken,
  normalizeNickname,
  validateNickname,
  claimNickname,
  getMyRank,
} from '../../../shared/leaderboard.js'
import {
  t,
  applyI18nToDOM,
  applyI18nToDOMAsync,
  setLang,
  getLang,
  getInitialLang,
  ensureTranslationLoaded,
} from '../i18n/index.js'
import { GAME_VERSION } from '../version.js'
import * as NumberFormat from '../utils/numberFormat.js'
import * as Modal from '../ui/modal.js'
import * as Animations from '../ui/animations.js'
import { toastSuccess, toastError, toastInfo, toastWarning } from '../ui/toast.js'
import * as Diary from '../systems/diary.js'
import * as LeaderboardUI from '../ui/leaderboardUI.js'
import { updateSynergyDisplay } from '../ui/synergyDisplay.js'
import { updateCompletionistSynergy } from '../systems/synergy.js'
import { initSentry } from '../monitoring/sentry.js'
import { setupErrorBoundary } from '../core/errorBoundary.js'
import { createUpgrades } from '../data/upgrades.js'
import { createAchievements } from '../data/achievements.js'
import { createTabNavigation } from '../ui/tabNavigation.js'
import { createSocialFeatures } from '../ui/socialFeatures.js'
import { createKeyboardShortcuts } from '../ui/keyboardShortcuts.js'
import { createInAppBrowserHandler } from '../ui/inAppBrowserHandler.js'
import { createHeaderResponsiveManager } from '../ui/headerResponsiveManager.js'
import { createSettingsTabManager } from '../ui/settingsTabManager.js'
import { createAuthUIManager } from '../ui/authUIManager.js'
import { createDevCheatSystem } from '../systems/devCheatSystem.js'
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
} from '../ui/eventSetup.js'
import { createGameLoopManager } from '../systems/gameLoopManager.js'
import { createI18nUIManager } from '../ui/i18nUIManager.js'
import { showAchievementNotification } from '../ui/achievementNotification.js'
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
} from '../state/gameState.js'
import {
  getStartingCash,
  processPrestige,
  applyStartingBonuses,
  getAllPrestigeEffects,
  calculateCP,
} from '../systems/prestigeBonus.js'
import { initPrestigeTab, renderPrestigeTab, refreshPrestigeTab } from '../ui/prestigeTab.js'
import { MARKET_EVENTS, BASE_COSTS } from '../balance/index.js'
import { TIMING, MARKET_EVENT_TIMING, PROBABILITY, ANIMATION } from '../balance/timing.js'

// DEV 모드 체크
const __IS_DEV__ = !!import.meta?.env?.DEV

/**
 * Phase A: 기초 시스템 초기화
 * - Sentry, 에러 바운더리, i18n, 모달
 */
export function initializeFoundation() {
  // Sentry 초기화 (프로덕션 전용)
  if (import.meta.env.PROD) {
    initSentry()
  }

  // 에러 바운더리 설정
  setupErrorBoundary()

  // i18n 초기화
  const initialLang = getInitialLang()
  setLang(initialLang)
  applyI18nToDOMAsync()

  // 모달 시스템 초기화
  Modal.initModal()

  // 헤더 반응형 관리자 초기화
  const headerResponsiveManager = createHeaderResponsiveManager()
  headerResponsiveManager.initResizeListeners()

  // 인앱 브라우저 핸들러 초기화
  const inAppBrowserHandler = createInAppBrowserHandler({ t })
  inAppBrowserHandler.showWarningIfNeeded()

  // 제스처 방지
  setupGesturePreventions()

  return { Modal, t, getLang, setLang, applyI18nToDOMAsync, ensureTranslationLoaded }
}

/**
 * Phase B: DOM 및 상태 초기화
 */
export function initializeState() {
  const DOM = getDomRefs()

  // 설정 옵션
  let settings = {
    particles: true,
    fancyGraphics: true,
    shortNumbers: false,
  }

  // 설정 불러오기
  try {
    const saved = safeGetJSON(SETTINGS_KEY, null)
    if (saved) {
      settings = { ...settings, ...saved }
    }
  } catch (error) {
    console.error('설정 불러오기 실패:', error)
  }

  function saveSettings() {
    try {
      safeSetJSON(SETTINGS_KEY, settings)
    } catch (error) {
      console.error('설정 저장 실패:', error)
    }
  }

  return { DOM, settings, saveSettings, SAVE_KEY, SETTINGS_KEY }
}

/**
 * Phase C: 자산 계산기 및 헬퍼 함수 생성
 */
export function initializeAssetCalculator() {
  const assetCalculator = createAssetCalculator({ gameState })

  return {
    assetCalculator,
    calculateFinancialValue: () => assetCalculator.calculateFinancialValue(),
    calculatePropertyValue: () => assetCalculator.calculatePropertyValue(),
    calculateTotalAssetValue: () => assetCalculator.calculateTotalAssetValue(),
    getTotalAssets: () => assetCalculator.getTotalAssets(),
    calculateFinancialValueForType: (type, count) =>
      assetCalculator.calculateFinancialValueForType(type, count),
    calculatePropertyValueForType: (type, count) =>
      assetCalculator.calculatePropertyValueForType(type, count),
    calculateTotalAssetValueFromSave: saveData =>
      assetCalculator.calculateTotalAssetValueFromSave(saveData),
    calculatePlayTimeMsFromSave: (saveData, sessionStartTime) =>
      assetCalculator.calculatePlayTimeMsFromSave(saveData, sessionStartTime),
  }
}

/**
 * Phase D: UPGRADES 및 ACHIEVEMENTS 생성
 */
export function initializeUpgradesAndAchievements(deps) {
  const { updateAutoWorkUI, assetCalculator } = deps

  const UPGRADES = createUpgrades({
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

  const upgradeManager = createUpgradeManager({
    UPGRADES,
    getCash: () => gameState.cash,
    setCash: newCash => {
      gameState.cash = newCash
    },
    CAREER_LEVELS,
  })

  const ACHIEVEMENTS = createAchievements({
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

  return { UPGRADES, upgradeManager, ACHIEVEMENTS }
}

/**
 * Phase E: 투자 탭 및 버튼 상태 관리자 초기화
 */
export function initializeInvestmentSystem(deps) {
  const { settings, updateUI, performAutoPrestige } = deps

  const investmentTab = createInvestmentTab({
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
    getFinancialCost,
    getPropertyCost,
    getFinancialSellPrice,
    getPropertySellPrice,
    updateUI,
    CAREER_LEVELS,
    MARKET_EVENTS,
    gameState,
    performAutoPrestige,
  })

  // incomeCalculator에 시장 이벤트 배수 함수 주입
  setMarketEventMultiplier(investmentTab.getMarketEventMultiplier)

  // buttonStateManager 초기화
  const buttonStateManager = createButtonStateManager({
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
    getFinancialCost,
    getPropertyCost,
    isProductUnlocked: investmentTab.isProductUnlocked,
  })

  return { investmentTab, buttonStateManager }
}

/**
 * Phase F: gameUI 모듈 초기화
 */
export function initializeGameUI(deps) {
  const {
    settings,
    updateInvestmentMarketImpactUI,
    updateButtonStates,
    updateBuildingItemStates,
    updateUpgradeAffordability,
    updateProductLockStates,
    updateStatsTab,
    getProductName,
  } = deps

  return createGameUI({
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
    updateInvestmentMarketImpactUI,
    updateButtonStates,
    updateBuildingItemStates,
    updateUpgradeAffordability,
    updateProductLockStates,
    updateStatsTab,
  })
}

/**
 * Phase G: 저장/로드 및 클라우드 동기화 시스템 초기화
 */
export function initializePersistence(deps) {
  const {
    UPGRADES,
    ACHIEVEMENTS,
    updateAutoWorkUI,
    updateSaveStatus,
    performAutoPrestige,
    calculateTotalAssetValueFromSave,
    calculatePlayTimeMsFromSave,
    updateUI,
  } = deps

  // 클라우드 동기화 매니저
  const cloudSyncManager = createCloudSyncManager({
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

  // 저장/로드 매니저
  const saveLoadManager = createSaveLoadManager({
    SAVE_KEY,
    gameVars: gameState,
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
    upsertCloudSave: cloudSyncManager.upsertCloudSave,
    cloudState: {
      get __currentUser() {
        return cloudSyncManager.__currentUser
      },
      get __cloudPendingSave() {
        return cloudSyncManager.__cloudPendingSave
      },
      set __cloudPendingSave(v) {
        cloudSyncManager.__cloudPendingSave = v
      },
      get __lastCloudUploadedSaveTs() {
        return cloudSyncManager.__lastCloudUploadedSaveTs || 0
      },
    },
    __IS_DEV__,
    calculateCP,
  })

  return { cloudSyncManager, saveLoadManager }
}

/**
 * Phase H: 프레스티지 및 닉네임 시스템 초기화
 */
export function initializePrestigeAndNickname(deps) {
  const { UPGRADES, saveLoadManager, updateUI, updateAutoWorkUI, cloudSyncManager } = deps

  // 프레스티지 시스템
  const prestigeSystem = createPrestigeSystem({
    state: gameState,
    UPGRADES,
    saveLoadManager,
    LeaderboardUI,
    Diary,
    t,
    updateUI,
    updateAutoWorkUI,
  })

  // 닉네임 관리자
  const nicknameManager = createNicknameManager({
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
    upsertCloudSave: cloudSyncManager.upsertCloudSave,
    getPlayerNickname: () => gameState.playerNickname,
    setPlayerNickname: value => {
      gameState.playerNickname = value
    },
    __IS_DEV__,
    calculateCP,
  })

  return { prestigeSystem, nicknameManager }
}

// Re-export 필요한 모듈들
export {
  gameState,
  FINANCIAL_INCOME,
  BASE_RENT,
  CAREER_LEVELS,
  SAVE_KEY,
  CLOUD_RESTORE_BLOCK_KEY,
  CLOUD_RESTORE_SKIP_KEY,
  SETTINGS_KEY,
  getTotalFinancialProducts,
  getTotalProperties,
  getFinancialCost,
  getPropertyCost,
  getFinancialSellPrice,
  getPropertySellPrice,
  getClickIncome,
  getCurrentCareer,
  getNextCareer,
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
  ensureTranslationLoaded,
  applyI18nToDOMAsync,
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
  createDevCheatSystem,
  createAchievementGrid,
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
  ANIMATION,
  __IS_DEV__,
}
