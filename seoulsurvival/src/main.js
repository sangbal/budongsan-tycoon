import { safeGetJSON, safeRemove, safeSetJSON } from './persist/storage.js'
import {
  getFinancialCost,
  getFinancialSellPrice,
  getPropertyCost,
  getPropertySellPrice,
} from './economy/pricing.js'
import {
  getFinancialIncome as calculateFinancialIncome,
  getPropertyIncome as calculatePropertyIncome,
  getRps as calculateRps,
  getTotalIncomeForContribution as calculateTotalIncomeForContribution,
  getClickIncome as calculateClickIncome,
  getCurrentCareer as getCareerByLevel,
  getNextCareer as getNextCareerByLevel,
} from './economy/income.js'
import { createMarketSystem } from './systems/market.js'
import { createAchievementsSystem } from './systems/achievements.js'
import { createUpgradeUnlockSystem } from './systems/upgrades.js'
import { createUpgradeManager } from './systems/upgradeManager.js'
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

// 인앱 브라우저(카카오톡/인스타 등) 감지
function detectInAppBrowser() {
  const ua = navigator.userAgent || ''
  const isKakao = ua.includes('KAKAOTALK')
  const isInstagram = ua.includes('Instagram')
  const isFacebook = ua.includes('FBAN') || ua.includes('FBAV')
  const isLine = ua.includes('Line')
  const isWeChat = ua.includes('MicroMessenger')
  const isInApp = isKakao || isInstagram || isFacebook || isLine || isWeChat
  return { isInApp, isKakao, isInstagram, isFacebook, isLine, isWeChat }
}

function showInAppBrowserWarningIfNeeded() {
  const { isInApp } = detectInAppBrowser()
  if (!isInApp) return

  const banner = document.createElement('div')
  banner.className = 'inapp-warning-banner'
  banner.innerHTML = `
    ${t('inapp.banner.message')}<br />
    <strong>${t('inapp.banner.hint')}</strong>
    <div class="inapp-warning-actions">
      <button type="button" class="btn-small" id="copyGameUrlBtn">${t('inapp.banner.copyBtn')}</button>
      <button type="button" class="btn-small" id="closeInappWarningBtn">${t('inapp.banner.closeBtn')}</button>
    </div>
  `
  document.body.prepend(banner)

  const copyBtn = banner.querySelector('#copyGameUrlBtn')
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const url = 'https://clicksurvivor.com/seoulsurvival/'
      try {
        // 클립보드 API 시도 (HTTPS/localhost에서 동작)
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url)
          alert(t('inapp.copied'))
          return
        }
        // Fallback: execCommand 사용
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          const successful = document.execCommand('copy')
          if (successful) {
            alert(t('inapp.copied'))
          } else {
            throw new Error('execCommand failed')
          }
        } catch (err) {
          alert(t('inapp.copyFallback', { url }))
        } finally {
          document.body.removeChild(textArea)
        }
      } catch (err) {
        alert(t('inapp.copyFallback', { url }))
      }
    })
  }

  const closeBtn = banner.querySelector('#closeInappWarningBtn')
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.remove()
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // ======= 모듈 인스턴스 선언 (나중에 초기화) =======
  let saveLoadManager = null
  let nicknameManager = null
  let cloudSyncManager = null
  let gameUIInstance = null // gameUI.js 모듈 인스턴스

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

  // ======= fixed header 높이만큼 본문 상단 여백 자동 보정 =======
  // 모바일에서 헤더가 2줄로 늘어나면(.statbar 래핑) 본문 상단 요소(직급 등)가 헤더에 가려질 수 있어,
  // 헤더 실제 높이를 CSS 변수(--header-h)로 주입해 .app padding-top이 자동으로 따라가도록 한다.
  function __syncHeaderHeightVar() {
    const header = document.querySelector('header')
    if (!header) return
    const h = Math.ceil(header.getBoundingClientRect().height || 0)
    if (h > 0) document.documentElement.style.setProperty('--header-h', `${h}px`)
  }

  __syncHeaderHeightVar()
  showInAppBrowserWarningIfNeeded()
  window.addEventListener('resize', __syncHeaderHeightVar)
  // 모바일 주소창/뷰포트 변화 대응
  try {
    window.visualViewport?.addEventListener('resize', __syncHeaderHeightVar)
  } catch {
    // Ignore if browser doesn't support this event
  }
  // 헤더 래핑/폰트 로딩 등으로 높이가 바뀌는 경우 대응
  try {
    const header = document.querySelector('header')
    if (header && 'ResizeObserver' in window) {
      new ResizeObserver(__syncHeaderHeightVar).observe(header)
    }
  } catch {
    // Ignore if browser doesn't support this event
  }

  // ======= (iOS) 더블탭/핀치로 인한 화면 확대 방지 =======
  // 요구사항: 노동하기 반복 터치 시 발생하는 화면 확대를 차단
  // - meta viewport(user-scalable=no) + gesture 이벤트 preventDefault로 이중 안전장치
  try {
    const prevent = e => e.preventDefault()
    document.addEventListener('gesturestart', prevent, { passive: false })
    document.addEventListener('gesturechange', prevent, { passive: false })
    document.addEventListener('gestureend', prevent, { passive: false })
  } catch {
    // 브라우저가 해당 이벤트를 지원하지 않아도 무시
  }

  // ======= 상태 =======
  // NOTE: safeText, safeHTML, safeClass는 './ui/domUtils.js'에서 import됨
  const fmt = new Intl.NumberFormat('ko-KR')

  // cash는 gameState.cash 사용 (SSOT 마이그레이션)

  // 누적 플레이시간 시스템 - gameState 사용 (SSOT 마이그레이션)
  // totalPlayTime, sessionStartTime, gameStartTime → gameState.xxx

  // 금융상품 보유 수량 - gameState 사용 (SSOT 마이그레이션)
  // deposits, savings, bonds, usStocks, cryptos → gameState.xxx

  // 금융상품 누적 생산량 - gameState 사용 (SSOT 마이그레이션)
  // depositsLifetime, savingsLifetime, bondsLifetime, usStocksLifetime, cryptosLifetime → gameState.xxx

  // 부동산 누적 생산량 - gameState 사용 (SSOT 마이그레이션)
  // villasLifetime, officetelsLifetime, apartmentsLifetime, shopsLifetime, buildingsLifetime → gameState.xxx

  // 구매 수량 선택 시스템 - gameState 사용 (SSOT 마이그레이션)
  // purchaseMode, purchaseQuantity → gameState.xxx

  // achievementGrid 모듈 인스턴스
  let achievementGridInstance = null

  // buttonStateManager 모듈 인스턴스
  let buttonStateManager = null

  // 자동 저장 시스템 - gameState 사용 (SSOT 마이그레이션)
  // NOTE: SAVE_KEY, CLOUD_RESTORE_BLOCK_KEY, CLOUD_RESTORE_SKIP_KEY는 './state/gameState.js'에서 import됨
  // lastSaveTime → gameState.lastSaveTime

  // 닉네임 (리더보드용) - gameState 사용 (SSOT 마이그레이션)
  // playerNickname, __nicknameModalShown → gameState.xxx

  // cloudSyncManager는 상단에서 선언됨

  // ======= 업그레이드 시스템 (Cookie Clicker 스타일) =======
  // UPGRADES 객체는 팩토리 함수로 생성 (data/upgrades.js)
  let UPGRADES = null

  // ======= 업그레이드 관리 시스템 초기화 =======
  // UPGRADES는 나중에 팩토리 함수로 생성됨
  let upgradeManager = null
  let updateUpgradeAffordability, updateUpgradeProgress, updateUpgradeList, purchaseUpgrade

  // upgradeManager 초기화는 UPGRADES 생성 후 수행 (라인 1320 이후)
  /*
  const upgradeManager_OLD = createUpgradeManager({
    UPGRADES,
    getCash: () => cash,
    setCash: newCash => {
      cash = newCash
    },
    CAREER_LEVELS,
  })
  const { updateUpgradeAffordability, updateUpgradeProgress, updateUpgradeList, purchaseUpgrade } =
    upgradeManager
  */

  // 부동산 보유 수량 - gameState 사용 (SSOT 마이그레이션)
  // villas, officetels, apartments, shops, buildings, towers_run, towers_lifetime → gameState.xxx

  // 해금 상태 추적 - gameState.unlockedProducts 사용 (중복 제거됨)
  // 실제 해금 로직은 investmentTab.js에서 관리

  // Note: FINANCIAL_INCOME, BASE_RENT, resetIncomeTablesToDefault,
  // reapplyIncomeTableAffectingUpgradeEffects는 gameState.js에서 이미 import됨

  // 업그레이드 배수 - gameState 사용 (SSOT 마이그레이션)
  // clickMultiplier, rentMultiplier, autoClickEnabled, managerLevel → gameState.xxx

  // 설정 옵션
  // NOTE: SETTINGS_KEY는 './state/gameState.js'에서 import됨
  let settings = {
    particles: true, // 파티클 애니메이션
    fancyGraphics: true, // 화려한 그래픽
    shortNumbers: false, // 짧은 숫자 표시 (기본값: 끔)
  }

  // 노동 커리어 시스템 - gameState 사용 (SSOT 마이그레이션)
  // careerLevel, totalLaborIncome → gameState.xxx

  // Note: CAREER_LEVELS는 gameState.js에서 이미 bgImage와 함께 import됨

  // 직급 이름 가져오기 함수
  function getCareerName(level) {
    if (level < 0 || level >= CAREER_LEVELS.length) return ''
    return t(CAREER_LEVELS[level].nameKey)
  }

  // 가격은 이제 동적으로 계산됨 (getPropertyCost 함수 사용)

  // 업그레이드 비용 - gameState 사용 (SSOT 마이그레이션)
  // rentCost, mgrCost → gameState.xxx

  // BASE_CLICK_GAIN - balance/career.js에서 import됨

  // 부동산 시장 이벤트 시스템 - gameState 사용 (SSOT 마이그레이션)
  // marketMultiplier, marketEventEndTime, currentMarketEvent → gameState.xxx

  // MARKET_EVENTS - balance/marketEvents.js에서 import됨

  // 업적 시스템 - gameState 사용 (SSOT 마이그레이션)
  // totalClicks → gameState.totalClicks

  // ACHIEVEMENTS 배열은 팩토리 함수로 생성
  let ACHIEVEMENTS = null

  // ACHIEVEMENTS 정의는 data/achievements.js로 이동
  // 아래 주석 처리된 275줄의 ACHIEVEMENTS 배열은 삭제됨

  // ======= DOM (캐시된 참조 사용) =======
  const DOM = getDomRefs()

  // DOM 요소 단축 참조 (기존 코드 호환성 유지)
  const {
    elCash,
    elFinancial,
    elProperties,
    elRps,
    elWork,
    elWorkArea,
    elAutoWorkIndicator,
    elLog,
    elShareBtn,
    elFavoriteBtn,
    elClickIncomeButton,
    elClickIncomeLabel,
    elClickMultiplier,
    elRentMultiplier,
    elDepositCount,
    elIncomePerDeposit,
    elBuyDeposit,
    elSavingsCount,
    elIncomePerSavings,
    elBuySavings,
    elBondCount,
    elIncomePerBond,
    elBuyBond,
    elUsStockCount,
    elIncomePerUsStock,
    elBuyUsStock,
    elCryptoCount,
    elIncomePerCrypto,
    elBuyCrypto,
    elBuyMode,
    elSellMode,
    elQty1,
    elQty5,
    elQty10,
    elSaveStatus,
    elResetBtn,
    elDepositCurrentPrice,
    elSavingsCurrentPrice,
    elBondCurrentPrice,
    elVillaCurrentPrice,
    elOfficetelCurrentPrice,
    elAptCurrentPrice,
    elShopCurrentPrice,
    elBuildingCurrentPrice,
    elVillaCount,
    elRentPerVilla,
    elBuyVilla,
    elOfficetelCount,
    elRentPerOfficetel,
    elBuyOfficetel,
    elAptCount,
    elRentPerApt,
    elBuyApt,
    elShopCount,
    elRentPerShop,
    elBuyShop,
    elBuildingCount,
    elRentPerBuilding,
    elBuyBuilding,
    elTowerCountDisplay,
    elTowerCountBadge,
    elTowerCurrentPrice,
    elBuyTower,
    elCurrentCareer,
    elCareerCost,
    elCareerProgress,
    elCareerProgressText,
    elCareerRemaining,
  } = DOM

  // 업그레이드 관련 (구형 DOM 제거됨 - 새로운 Cookie Clicker 스타일 사용)

  // ======= 애니메이션 시스템 초기화 (DOM 요소 선언 후) =======
  Animations.initAnimations(elWork)

  // ======= buttonStateManager 초기화 (DOM 요소 선언 후) =======
  // Note: isProductUnlocked 함수가 정의된 후에 실제로 동작
  // 여기서는 deps만 정의하고, isProductUnlocked 함수 정의 후 초기화 호출

  // ======= 유틸 =======
  // NOTE: getTotalFinancialProducts, getTotalProperties는 './state/gameState.js'에서 import됨
  // 중복 정의 제거됨 - import된 함수 사용

  // (단순화) 랜덤 변동 제거: 초당 수익은 예측 가능하게 유지하고,
  // 변동성은 '시장 이벤트'만으로 표현합니다.
  // NOTE: 수익 계산 함수들은 economy/income.js로 이동됨

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
    getTotalAssets,
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

  // (단순화) 리스크 UI 제거

  // 업적 체크
  function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true
        showAchievementNotification(achievement)
        // 업적 번역 키가 없으면 원본 한글 사용 (fallback)
        const achievementName = t(`achievement.${achievement.id}.name`, {}, achievement.name)
        const achievementDesc = t(`achievement.${achievement.id}.desc`, {}, achievement.desc)
        Diary.addLog(t('msg.achievementUnlocked', { name: achievementName, desc: achievementDesc }))
      }
    })
  }

  // 업적 알림 표시
  function showAchievementNotification(achievement) {
    const notification = document.createElement('div')
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #000;
        padding: 20px 30px;
        border-radius: 15px;
        font-weight: bold;
        z-index: 2000;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: achievementPop 1s ease-out;
      `
    // 번역 키가 없으면 fallback으로 한글 사용 (개발 중)
    const achievementName = t(`achievement.${achievement.id}.name`)
    const achievementDesc = t(`achievement.${achievement.id}.desc`)

    // XSS 방지: innerHTML 대신 DOM API 사용
    const iconDiv = document.createElement('div')
    iconDiv.style.cssText = 'font-size: 24px; margin-bottom: 10px;'
    iconDiv.textContent = '🏆'

    const nameDiv = document.createElement('div')
    nameDiv.style.cssText = 'font-size: 18px; margin-bottom: 5px;'
    nameDiv.textContent = achievementName

    const descDiv = document.createElement('div')
    descDiv.style.cssText = 'font-size: 14px; opacity: 0.8;'
    descDiv.textContent = achievementDesc

    notification.appendChild(iconDiv)
    notification.appendChild(nameDiv)
    notification.appendChild(descDiv)

    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification)
      }
    }, 3000)
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

  // 구매 가능 알림 체크

  // NOTE: 수익 계산 함수들은 economy/income.js로 이동됨
  // 래퍼 함수 (원래 이름 유지, 전역 변수를 모듈 함수에 전달)

  function getClickIncome() {
    return calculateClickIncome(gameState.careerLevel, gameState.clickMultiplier)
  }

  function getCurrentCareer() {
    return getCareerByLevel(gameState.careerLevel)
  }

  function getNextCareer() {
    return getNextCareerByLevel(gameState.careerLevel)
  }

  function getRps() {
    const state = {
      deposits: gameState.deposits,
      savings: gameState.savings,
      bonds: gameState.bonds,
      usStocks: gameState.usStocks,
      cryptos: gameState.cryptos,
      villas: gameState.villas,
      officetels: gameState.officetels,
      apartments: gameState.apartments,
      shops: gameState.shops,
      buildings: gameState.buildings,
      rentMultiplier: gameState.rentMultiplier,
      marketMultiplier: gameState.marketMultiplier,
    }
    return calculateRps(state, getMarketEventMultiplier)
  }

  function getTotalIncomeForContribution() {
    const state = {
      deposits: gameState.deposits,
      savings: gameState.savings,
      bonds: gameState.bonds,
      usStocks: gameState.usStocks,
      cryptos: gameState.cryptos,
      villas: gameState.villas,
      officetels: gameState.officetels,
      apartments: gameState.apartments,
      shops: gameState.shops,
      buildings: gameState.buildings,
      rentMultiplier: gameState.rentMultiplier,
      marketMultiplier: gameState.marketMultiplier,
    }
    return calculateTotalIncomeForContribution(state, getMarketEventMultiplier)
  }

  function getFinancialIncome(type, count) {
    return calculateFinancialIncome(type, count, getMarketEventMultiplier)
  }

  function getPropertyIncome(type, count) {
    return calculatePropertyIncome(type, count, getMarketEventMultiplier)
  }

  // 자동 승진 체크 함수 (클릭 수 기준)
  function checkCareerPromotion() {
    const nextCareer = getNextCareer()
    if (nextCareer && gameState.totalClicks >= nextCareer.requiredClicks) {
      const oldCareerLevel = gameState.careerLevel
      gameState.careerLevel += 1
      const newCareer = getCurrentCareer()
      const clickIncome = getClickIncome()
      Diary.addLog(
        t('msg.promoted', {
          career: getCareerName(gameState.careerLevel),
          income: NumberFormat.formatKoreanNumber(clickIncome),
        })
      )

      // 승진 시 전환 애니메이션
      if (elWorkArea) {
        // 페이드 아웃 효과
        elWorkArea.style.transition = 'opacity 0.3s ease-out'
        elWorkArea.style.opacity = '0.5'

        setTimeout(() => {
          // 배경 이미지 변경
          if (newCareer.bgImage) {
            elWorkArea.style.transition = 'background-image 0.8s ease-in-out, opacity 0.5s ease-in'
            elWorkArea.style.backgroundImage = `url('${newCareer.bgImage}')`
          } else {
            elWorkArea.style.transition = 'background-image 0.8s ease-in-out, opacity 0.5s ease-in'
            elWorkArea.style.backgroundImage =
              'radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)'
          }

          // 페이드 인 효과
          elWorkArea.style.opacity = '1'
        }, 300)
      }

      // 직급 카드 애니메이션 효과
      const careerCard = document.querySelector('.career-card')
      if (careerCard) {
        careerCard.style.animation = 'none'
        setTimeout(() => {
          careerCard.style.animation = 'careerPromotion 0.6s ease-out'
        }, 10)
      }

      // 스크린 리더 알림
      const currentCareerEl = document.getElementById('currentCareer')
      if (currentCareerEl) {
        currentCareerEl.setAttribute(
          'aria-label',
          t('msg.promoted', {
            career: getCareerName(gameState.careerLevel),
            income: NumberFormat.formatKoreanNumber(clickIncome),
          })
        )
      }

      return true
    }
    return false
  }

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

  // 업그레이드 그리드 상태 업데이트 함수
  // 구형 updateUpgradeGrid 함수 제거됨 - 새로운 updateUpgradeList 사용

  // ======= 저장/로드/닉네임 관리 함수는 모듈로 이동됨 =======
  // saveGame(), loadGame(), resetGame(), exportSave(), importSave(), updateSaveStatus()
  // → seoulsurvival/src/persist/saveLoad.js의 saveLoadManager 사용
  // ensureNicknameModal(), openNicknameChangeModal(), handleNicknameChangeFromModal()
  // → seoulsurvival/src/systems/nicknameManager.js의 nicknameManager 사용

  // 설정 저장 함수
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

  // updateUI - gameUI 모듈로 위임 (Phase 1 리팩토링으로 890줄 → 8줄)
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

  // ========== 레거시 updateUI() 코드 완전 삭제됨 ==========
  // gameUI.js 모듈로 위임 완료 (890줄 → 8줄 감소)
  // 원본 코드: gameUI.js의 createGameUI() 참조

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

  // ======= buttonStateManager 초기화 =======
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
    // DOM elements
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
  })

  // ======= gameUI 모듈 초기화 =======
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

    // DOM elements
    elCurrentCareer,
    elClickIncomeButton,
    elWorkArea,
    elCareerProgress,
    elCareerProgressText,
    elCareerRemaining,
    elCash,
    elFinancial,
    elProperties,
    elRps,
    elClickMultiplier,
    elRentMultiplier,
    elDepositCount,
    elIncomePerDeposit,
    elDepositCurrentPrice,
    elSavingsCount,
    elIncomePerSavings,
    elSavingsCurrentPrice,
    elBondCount,
    elIncomePerBond,
    elBondCurrentPrice,
    elVillaCount,
    elRentPerVilla,
    elVillaCurrentPrice,
    elOfficetelCount,
    elRentPerOfficetel,
    elOfficetelCurrentPrice,
    elAptCount,
    elRentPerApt,
    elAptCurrentPrice,
    elShopCount,
    elRentPerShop,
    elShopCurrentPrice,
    elBuildingCount,
    elRentPerBuilding,
    elBuildingCurrentPrice,
    elTowerCountDisplay,
    elTowerCountBadge,
    elTowerCurrentPrice,
  })

  // ======= 통계/투자 섹션 접기/펼치기 기능 (collapsible.js 모듈로 위임) =======
  const collapsibleManager = createCollapsibleManager()
  collapsibleManager.initAll(100) // 지연 초기화 (DOMContentLoaded 이후)

  // ======= 구매 수량 선택 시스템 =======
  const setupModeBtn = (btn, mode, other) => {
    btn?.addEventListener('click', () => {
      gameState.purchaseMode = mode
      btn.classList.add('active')
      other?.classList.remove('active')
      updateUI()
    })
  }
  const setupQtyBtn = (btn, qty, others) => {
    btn?.addEventListener('click', () => {
      gameState.purchaseQuantity = qty
      btn.classList.add('active')
      others.forEach(o => o?.classList.remove('active'))
      updateUI()
    })
  }
  setupModeBtn(elBuyMode, 'buy', elSellMode)
  setupModeBtn(elSellMode, 'sell', elBuyMode)
  setupQtyBtn(elQty1, 1, [elQty5, elQty10])
  setupQtyBtn(elQty5, 5, [elQty1, elQty10])
  setupQtyBtn(elQty10, 10, [elQty1, elQty5])

  // ======= 액션 =======
  function handleWorkAction(clientX, clientY) {
    let income = getClickIncome()

    // 업그레이드 효과 적용 (새 UPGRADES 시스템)
    if (
      UPGRADES['performance_bonus'] &&
      UPGRADES['performance_bonus'].purchased &&
      Math.random() < 0.02
    ) {
      income *= 10 // 2% 확률로 10배 수익
      Diary.addLog(t('msg.bonusPaid'))
    }

    // 떨어지는 쿠키 애니메이션 생성 (설정에서 활성화된 경우만)
    if (settings.particles) {
      Animations.createFallingCookie(clientX ?? 0, clientY ?? 0)
    }

    gameState.cash += income
    gameState.totalClicks += 1 // 클릭 수 증가
    gameState.totalLaborIncome += income // 총 노동 수익 증가
    gameState.lifetimeEarnings += income // CP 계산용 누적 수익

    // 미니 목표 알림: 다음 업그레이드까지 남은 클릭 수 체크
    const lockedUpgrades = Object.entries(UPGRADES)
      .filter(([id, u]) => u.category === 'labor' && !u.unlocked && !u.purchased)
      .map(([id, u]) => {
        const conditionStr = u.unlockCondition.toString()
        const match = conditionStr.match(/totalClicks\s*>=\s*(\d+)/)
        if (match) {
          return { id, requiredClicks: parseInt(match[1]), upgrade: u }
        }
        // gameState.careerLevel 체크인 경우
        const careerMatch = conditionStr.match(/careerLevel\s*>=\s*(\d+)/)
        if (careerMatch) {
          return {
            id,
            requiredClicks: CAREER_LEVELS[parseInt(careerMatch[1])]?.requiredClicks || Infinity,
            upgrade: u,
          }
        }
        return null
      })
      .filter(x => x !== null)
      .sort((a, b) => a.requiredClicks - b.requiredClicks)

    if (lockedUpgrades.length > 0) {
      const nextUpgrade = lockedUpgrades[0]
      const remaining = nextUpgrade.requiredClicks - gameState.totalClicks

      // 50클릭, 25클릭, 10클릭, 5클릭 남았을 때 알림
      if (remaining === 50 || remaining === 25 || remaining === 10 || remaining === 5) {
        Diary.addLog(
          t('msg.nextUpgradeHint', { name: t(`upgrade.${nextUpgrade.id}.name`), remaining })
        )
      }
    }

    // 자동 승진 체크
    const wasPromoted = checkCareerPromotion()
    if (wasPromoted) updateUI()

    // 업그레이드 진행률 업데이트 (UI에 표시된 경우)
    updateUpgradeProgress()

    // 클릭 애니메이션 효과
    elWork.classList.add('click-effect')
    setTimeout(() => elWork.classList.remove('click-effect'), 300)

    // 수익 증가 텍스트 애니메이션
    Animations.showIncomeAnimation(income)

    updateUI()
  }

  // pointerdown으로 변경: 터치 즉시 반응하여 빠른 연타 인식률 개선
  elWork.addEventListener('pointerdown', e => {
    // 마우스 우클릭/중간버튼 무시
    if (e.pointerType === 'mouse' && e.button !== 0) return
    handleWorkAction(e.clientX, e.clientY)
  })

  // ======= 공유하기 기능 =======
  async function shareGame() {
    const gameUrl = window.location.href
    const gameTitle = 'Capital Clicker: Seoul Survival'
    const gameDescription = t('share.description', {
      assets: NumberFormat.formatCashDisplay(gameState.cash, settings),
      rps: NumberFormat.formatCashDisplay(getRps(), settings),
    })
    // 요구사항: 공유 버튼은 Web Share API만 사용 (링크 복사 fallback 제거)
    if (!navigator.share) {
      Diary.addLog(t('share.notSupported'))
      return
    }

    try {
      await navigator.share({
        title: gameTitle,
        text: gameDescription,
        url: gameUrl,
      })
      Diary.addLog(t('share.success'))
    } catch (err) {
      // 사용자가 공유 UI를 닫은 경우는 조용히 무시
      if (err?.name !== 'AbortError') {
        console.error('Share failed:', err)
        Diary.addLog(t('share.failed'))
      }
    }
  }

  if (elShareBtn) {
    elShareBtn.addEventListener('click', shareGame)
  } else {
    console.error('공유 버튼을 찾을 수 없습니다.')
  }

  // ======= 즐겨찾기 / 홈 화면 안내 =======
  function handleFavoriteClick() {
    const url = window.location.href
    const title = document.title || 'Capital Clicker: Seoul Survival'
    const ua = navigator.userAgent.toLowerCase()
    const isMobile = /iphone|ipad|ipod|android/.test(ua)
    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isAndroid = /android/.test(ua)
    const isMac = navigator.platform.toUpperCase().includes('MAC')

    // (아주 옛날 IE 전용) 가능한 경우 직접 즐겨찾기 추가 시도
    if (window.external && typeof window.external.AddFavorite === 'function') {
      try {
        window.external.AddFavorite(url, title)
        Diary.addLog(t('favorite.added'))
        return
      } catch {
        // 실패하면 아래 안내로 fallback
      }
    }

    let message = ''
    const modalTitle = t('favorite.title')
    const icon = '⭐'

    if (isMobile) {
      if (isIOS) {
        message = t('favorite.ios')
      } else if (isAndroid) {
        message = t('favorite.android')
      } else {
        message = t('favorite.otherMobile')
      }
    } else {
      const shortcut = isMac ? '⌘ + D' : 'Ctrl + D'
      message = t('favorite.desktop', { shortcut })
    }

    Modal.openInfoModal(modalTitle, message, icon)
  }

  if (elFavoriteBtn) {
    elFavoriteBtn.addEventListener('click', handleFavoriteClick)
  }

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

  // 런(현재 게임) 보유 수량 일괄 초기화 함수
  function resetRunHoldings() {
    // 금융상품 초기화
    gameState.deposits = 0
    gameState.savings = 0
    gameState.bonds = 0
    gameState.usStocks = 0
    gameState.cryptos = 0

    // 부동산 초기화
    gameState.villas = 0
    gameState.officetels = 0
    gameState.apartments = 0
    gameState.shops = 0
    gameState.buildings = 0

    // 타워 런 초기화 (towers_lifetime은 유지)
    gameState.towers_run = 0

    // Lifetime 변수 초기화
    gameState.depositsLifetime = 0
    gameState.savingsLifetime = 0
    gameState.bondsLifetime = 0
    gameState.usStocksLifetime = 0
    gameState.cryptosLifetime = 0
    gameState.villasLifetime = 0
    gameState.officetelsLifetime = 0
    gameState.apartmentsLifetime = 0
    gameState.shopsLifetime = 0
    gameState.buildingsLifetime = 0

    if (__IS_DEV__) {
      console.debug('[resetRunHoldings] 초기화 완료')
    }
  }

  // 자동 프레스티지 실행 함수 (컨텍스트 독립: 엔딩/설정 경로 모두 안전)
  async function performAutoPrestige(source = 'unknown') {
    console.log(`🔄 자동 프레스티지 실행 (source: ${source})`)

    try {
      // CP 시스템: 프레스티지 처리 (CP 지급 + 업그레이드 리셋)
      const earnedCP = processPrestige()
      if (earnedCP > 0) {
        console.log(`💼 경력 포인트 획득: +${earnedCP} CP (총 ${gameState.careerPoints} CP)`)
      }

      // towers_lifetime은 유지, towers_run은 초기화
      // 자산/보유/진행도 초기화
      // 기본 시작 자금
      gameState.cash = 1000
      gameState.totalClicks = 0
      gameState.totalLaborIncome = 0
      gameState.careerLevel = 0
      gameState.clickMultiplier = 1
      gameState.rentMultiplier = 1
      gameState.autoClickEnabled = false
      gameState.managerLevel = 0

      // 모든 보유 수량 일괄 초기화 (상품 정의 기반)
      resetRunHoldings()

      // 업그레이드 초기화
      for (const upgrade of Object.values(UPGRADES)) {
        upgrade.unlocked = false
        upgrade.purchased = false
      }

      // 시장 이벤트 초기화
      gameState.currentMarketEvent = null
      gameState.marketEventEndTime = 0
      gameState.marketMultiplier = 1.0

      // CP 시스템: 시작 보너스 적용 (자금, 예금, 커리어, 빌라 등)
      const startBonuses = applyStartingBonuses()
      if (
        startBonuses.cash > 0 ||
        startBonuses.deposits > 0 ||
        startBonuses.career > 0 ||
        startBonuses.villa > 0
      ) {
        console.log('🎁 시작 보너스 적용:', startBonuses)
      }

      // 업적은 유지 (계정 누적)

      // 세션 시간 초기화
      gameState.sessionStartTime = Date.now()

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
      if (gameState.playerNickname) {
        try {
          await LeaderboardUI.updateLeaderboardEntry(true) // forceImmediate: 프레스티지는 즉시 업데이트
        } catch (error) {
          console.error('리더보드 업데이트 실패:', error)
        }
      }

      try {
        Diary.addLog(t('msg.prestigeComplete'))
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

  // ======= 업그레이드 효과 적용 함수 =======
  // 구형 applyUpgradeEffect 및 업그레이드 시스템 제거됨 - 새로운 Cookie Clicker 스타일 시스템 사용

  // ======= 키보드 단축키 =======
  document.addEventListener('keydown', e => {
    // 탭 전환: Alt + 1-5 (접근성)
    if (e.altKey && e.key >= '1' && e.key <= '5') {
      e.preventDefault()
      const tabMapping = {
        1: 'workTab',
        2: 'shopTab',
        3: 'statsTab',
        4: 'rankingTab',
        5: 'settingsTab',
      }
      const targetTab = tabMapping[e.key]
      const targetBtn = document.querySelector(`.nav-btn[data-tab="${targetTab}"]`)
      if (targetBtn) {
        targetBtn.click()
      }
    }

    // Ctrl + Shift + R: 게임 초기화 (브라우저 새로고침과 충돌 방지)
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault()
      saveLoadManager.resetGame()
    }
    // Ctrl + S: 수동 저장
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault() // 브라우저 저장 방지
      saveLoadManager.saveGame()
      Diary.addLog(t('msg.manualSave'))
    }
    // Ctrl + O: 저장 가져오기
    if (e.ctrlKey && e.key === 'o') {
      e.preventDefault()
      if (elImportFileInput) {
        elImportFileInput.click()
      }
    }
  })

  // ======= 수익 틱 =======
  const TICK = 50 // ms (성능 최적화: 250ms → 50ms)
  let lastTickTime = performance.now() // 정확한 deltaTime 계산을 위한 타임스탬프
  setInterval(() => {
    checkMarketEvent() // 시장 이벤트 체크
    checkAchievements() // 업적 체크
    checkUpgradeUnlocks() // 업그레이드 해금 체크

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
    gameState.officetelsLifetime += getPropertyIncome('officetel', gameState.officetels) * deltaTime
    gameState.apartmentsLifetime += getPropertyIncome('apartment', gameState.apartments) * deltaTime
    gameState.shopsLifetime += getPropertyIncome('shop', gameState.shops) * deltaTime
    gameState.buildingsLifetime += getPropertyIncome('building', gameState.buildings) * deltaTime

    updateUI()
  }, TICK)

  // ======= 자동 저장 시스템 =======
  setInterval(() => {
    if (saveLoadManager) {
      saveLoadManager.saveGame() // 5초마다 자동 저장
    }
  }, 5000)

  // ======= 오토클릭 시스템 =======
  setInterval(() => {
    if (gameState.autoClickEnabled) {
      const income = getClickIncome()
      gameState.cash += income
      gameState.totalClicks += 1
      gameState.totalLaborIncome += income
      gameState.lifetimeEarnings += income // CP 계산용 누적 수익
      checkCareerPromotion()

      // 노동 버튼에 자동 클릭 이펙트 적용 (펄스 + 수익 텍스트)
      if (elWork) {
        elWork.classList.remove('auto-click-pulse')
        // 리플로우 강제 후 다시 추가하여 매 틱마다 애니메이션 재생
        void elWork.offsetHeight
        elWork.classList.add('auto-click-pulse')
      }
      // 수익 증가 애니메이션(초록색 돈 텍스트)도 함께 표시
      Animations.showIncomeAnimation(income)

      // 성과급은 오토클릭에도 적용
      if (
        UPGRADES['performance_bonus'] &&
        UPGRADES['performance_bonus'].purchased &&
        Math.random() < 0.02
      ) {
        // 기본 income(1배)은 이미 지급됨 → 총 10배가 되도록 추가 9배 지급
        const bonusIncome = income * 9
        gameState.cash += bonusIncome
        gameState.totalLaborIncome += bonusIncome
        gameState.lifetimeEarnings += bonusIncome // CP 계산용 누적 수익
      }
    }
  }, 1000) // 1초마다

  // ======= 시장 이벤트 시스템 =======
  // 2-5분마다 랜덤하게 시장 이벤트 발생
  setInterval(
    () => {
      if (gameState.marketEventEndTime === 0) {
        // 현재 이벤트가 진행 중이 아닐 때만
        startMarketEvent()
      }
    },
    Math.random() * 180000 + 120000
  ) // 2-5분 랜덤

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
  // initializeGame은 saveLoadManager 초기화 후 호출됨 (아래 참조)

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

  // 설정 탭 UI 초기화
  const elToggleParticles = document.getElementById('toggleParticles')
  const elToggleFancyGraphics = document.getElementById('toggleFancyGraphics')
  const elToggleShortNumbers = document.getElementById('toggleShortNumbers')

  if (elToggleParticles) elToggleParticles.checked = settings.particles
  if (elToggleFancyGraphics) elToggleFancyGraphics.checked = settings.fancyGraphics
  if (elToggleShortNumbers) elToggleShortNumbers.checked = settings.shortNumbers

  // 언어 변경 시 모든 UI 업데이트 함수
  function updateAllUIForLanguage() {
    // 직급 표시 업데이트
    const currentCareerEl = document.getElementById('currentCareer')
    if (currentCareerEl) {
      safeText(currentCareerEl, getCareerName(gameState.careerLevel))
    }

    // UI 업데이트 호출 (직급, 상품 이름 등이 포함됨)
    updateUI()

    // 업적 그리드 다시 렌더링 (툴팁 번역을 위해)
    updateAchievementGrid()

    // 경력 탭 다시 렌더링 (번역을 위해)
    refreshPrestigeTab(t, NumberFormat.formatNumber)

    // 저장 상태 업데이트 (시간 포맷 번역을 위해)
    updateSaveStatus()
  }

  // 언어 선택 핸들러
  const elLanguageSelect = document.getElementById('languageSelect')
  if (elLanguageSelect) {
    elLanguageSelect.value = getLang()
    elLanguageSelect.addEventListener('change', async e => {
      const newLang = e.target.value
      setLang(newLang)
      await applyI18nToDOMAsync()
      updateAllUIForLanguage()
    })
  }

  // 설정 탭 이벤트 리스너
  const elExportSaveBtn = document.getElementById('exportSaveBtn')
  const elImportSaveBtn = document.getElementById('importSaveBtn')
  const elImportFileInput = document.getElementById('importFileInput')
  const elCloudUploadBtn = document.getElementById('cloudUploadBtn')
  const elCloudDownloadBtn = document.getElementById('cloudDownloadBtn')

  if (elExportSaveBtn) {
    elExportSaveBtn.addEventListener('click', () => saveLoadManager.exportSave())
  }

  if (elImportSaveBtn) {
    elImportSaveBtn.addEventListener('click', () => {
      if (elImportFileInput) {
        elImportFileInput.click()
      }
    })
  }

  if (elImportFileInput) {
    elImportFileInput.addEventListener('change', e => {
      const file = e.target.files[0]
      if (file) {
        saveLoadManager.importSave(file)
      }
    })
  }

  // ======= 클라우드 세이브(로그인 사용자 전용) =======
  // cloudSync.js 모듈로 분리됨
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
    gameVars: {
      get cash() {
        return gameState.cash
      },
      set cash(v) {
        gameState.cash = v
      },
      get totalClicks() {
        return gameState.totalClicks
      },
      set totalClicks(v) {
        gameState.totalClicks = v
      },
      get totalLaborIncome() {
        return gameState.totalLaborIncome
      },
      set totalLaborIncome(v) {
        gameState.totalLaborIncome = v
      },
      get careerLevel() {
        return gameState.careerLevel
      },
      set careerLevel(v) {
        gameState.careerLevel = v
      },
      get clickMultiplier() {
        return gameState.clickMultiplier
      },
      set clickMultiplier(v) {
        gameState.clickMultiplier = v
      },
      get rentMultiplier() {
        return gameState.rentMultiplier
      },
      set rentMultiplier(v) {
        gameState.rentMultiplier = v
      },
      get autoClickEnabled() {
        return gameState.autoClickEnabled
      },
      set autoClickEnabled(v) {
        gameState.autoClickEnabled = v
      },
      get managerLevel() {
        return gameState.managerLevel
      },
      set managerLevel(v) {
        gameState.managerLevel = v
      },
      get rentCost() {
        return gameState.rentCost
      },
      set rentCost(v) {
        gameState.rentCost = v
      },
      get mgrCost() {
        return gameState.mgrCost
      },
      set mgrCost(v) {
        gameState.mgrCost = v
      },
      get deposits() {
        return gameState.deposits
      },
      set deposits(v) {
        gameState.deposits = v
      },
      get savings() {
        return gameState.savings
      },
      set savings(v) {
        gameState.savings = v
      },
      get bonds() {
        return gameState.bonds
      },
      set bonds(v) {
        gameState.bonds = v
      },
      get usStocks() {
        return gameState.usStocks
      },
      set usStocks(v) {
        gameState.usStocks = v
      },
      get cryptos() {
        return gameState.cryptos
      },
      set cryptos(v) {
        gameState.cryptos = v
      },
      get depositsLifetime() {
        return gameState.depositsLifetime
      },
      set depositsLifetime(v) {
        gameState.depositsLifetime = v
      },
      get savingsLifetime() {
        return gameState.savingsLifetime
      },
      set savingsLifetime(v) {
        gameState.savingsLifetime = v
      },
      get bondsLifetime() {
        return gameState.bondsLifetime
      },
      set bondsLifetime(v) {
        gameState.bondsLifetime = v
      },
      get usStocksLifetime() {
        return gameState.usStocksLifetime
      },
      set usStocksLifetime(v) {
        gameState.usStocksLifetime = v
      },
      get cryptosLifetime() {
        return gameState.cryptosLifetime
      },
      set cryptosLifetime(v) {
        gameState.cryptosLifetime = v
      },
      get villas() {
        return gameState.villas
      },
      set villas(v) {
        gameState.villas = v
      },
      get officetels() {
        return gameState.officetels
      },
      set officetels(v) {
        gameState.officetels = v
      },
      get apartments() {
        return gameState.apartments
      },
      set apartments(v) {
        gameState.apartments = v
      },
      get shops() {
        return gameState.shops
      },
      set shops(v) {
        gameState.shops = v
      },
      get buildings() {
        return gameState.buildings
      },
      set buildings(v) {
        gameState.buildings = v
      },
      get towers_run() {
        return gameState.towers_run
      },
      set towers_run(v) {
        gameState.towers_run = v
      },
      get towers_lifetime() {
        return gameState.towers_lifetime
      },
      set towers_lifetime(v) {
        gameState.towers_lifetime = v
      },
      get villasLifetime() {
        return gameState.villasLifetime
      },
      set villasLifetime(v) {
        gameState.villasLifetime = v
      },
      get officetelsLifetime() {
        return gameState.officetelsLifetime
      },
      set officetelsLifetime(v) {
        gameState.officetelsLifetime = v
      },
      get apartmentsLifetime() {
        return gameState.apartmentsLifetime
      },
      set apartmentsLifetime(v) {
        gameState.apartmentsLifetime = v
      },
      get shopsLifetime() {
        return gameState.shopsLifetime
      },
      set shopsLifetime(v) {
        gameState.shopsLifetime = v
      },
      get buildingsLifetime() {
        return gameState.buildingsLifetime
      },
      set buildingsLifetime(v) {
        gameState.buildingsLifetime = v
      },
      get marketMultiplier() {
        return gameState.marketMultiplier
      },
      set marketMultiplier(v) {
        gameState.marketMultiplier = v
      },
      get marketEventEndTime() {
        return gameState.marketEventEndTime
      },
      set marketEventEndTime(v) {
        gameState.marketEventEndTime = v
      },
      get gameStartTime() {
        return gameState.gameStartTime
      },
      set gameStartTime(v) {
        gameState.gameStartTime = v
      },
      get totalPlayTime() {
        return gameState.totalPlayTime
      },
      set totalPlayTime(v) {
        gameState.totalPlayTime = v
      },
      get sessionStartTime() {
        return gameState.sessionStartTime
      },
      set sessionStartTime(v) {
        gameState.sessionStartTime = v
      },
      get playerNickname() {
        return gameState.playerNickname
      },
      set playerNickname(v) {
        gameState.playerNickname = v
      },
      get lastSaveTime() {
        return gameState.lastSaveTime
      },
      set lastSaveTime(v) {
        gameState.lastSaveTime = v
      },
      // CP 시스템 (경력 포인트)
      get careerPoints() {
        return gameState.careerPoints
      },
      set careerPoints(v) {
        gameState.careerPoints = v
      },
      get totalCareerPoints() {
        return gameState.totalCareerPoints
      },
      set totalCareerPoints(v) {
        gameState.totalCareerPoints = v
      },
      get purchasedUpgrades() {
        return gameState.purchasedUpgrades
      },
      set purchasedUpgrades(v) {
        gameState.purchasedUpgrades = v
      },
      get permanentSlots() {
        return gameState.permanentSlots
      },
      set permanentSlots(v) {
        gameState.permanentSlots = v
      },
      get lifetimeEarnings() {
        return gameState.lifetimeEarnings
      },
      set lifetimeEarnings(v) {
        gameState.lifetimeEarnings = v
      },
    },
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

  // 새로 시작 버튼 이벤트 리스너 (saveLoadManager 초기화 후)
  if (elResetBtn) {
    elResetBtn.addEventListener('click', () => saveLoadManager.resetGame())
  }
  const elResetBtnSettings = document.getElementById('resetBtnSettings')
  if (elResetBtnSettings) {
    elResetBtnSettings.addEventListener('click', () => saveLoadManager.resetGame())
  }

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

  // 게임 초기화 (saveLoadManager/nicknameManager 준비 완료 후)
  initializeGame()

  // 클라우드 업로드/다운로드 버튼 연결
  if (elCloudUploadBtn) elCloudUploadBtn.addEventListener('click', cloudSyncManager.cloudUpload)
  if (elCloudDownloadBtn)
    elCloudDownloadBtn.addEventListener('click', cloudSyncManager.cloudDownload)

  // 인증 리스너 초기화 (닉네임 마이그레이션, 저장 동기화 포함)
  cloudSyncManager.initAuthListener()

  // ======= 인증 버튼 UI 업데이트 =======
  function updateAuthButtons(user) {
    const isLoggedIn = !!user
    const authProviderButtons = document.getElementById('authProviderButtons')
    const logoutButtonContainer = document.getElementById('logoutButtonContainer')
    const cloudSaveSection = document.getElementById('cloudSaveSection')

    if (authProviderButtons) authProviderButtons.style.display = isLoggedIn ? 'none' : 'flex'
    if (logoutButtonContainer) logoutButtonContainer.hidden = !isLoggedIn
    if (cloudSaveSection) cloudSaveSection.style.display = isLoggedIn ? 'block' : 'none'
  }

  // 초기 인증 상태 확인 및 버튼 업데이트
  getUser().then(user => {
    updateAuthButtons(user)
  })

  // 인증 상태 변경 시 버튼 업데이트
  onAuthStateChange(user => {
    updateAuthButtons(user)
  })

  // 로그인 버튼 이벤트 리스너
  const googleLoginBtn = document.querySelector('[data-auth-provider="google"]')
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
      const result = await signInGoogle()
      if (!result.ok) {
        toastError(t('error.loginFailed'))
      }
    })
  }

  // 로그아웃 버튼 이벤트 리스너
  const logoutBtn = document.getElementById('logoutBtn')
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const result = await signOut()
      if (result.ok) {
        toastSuccess(t('settings.logout') + ' ✅')
        setTimeout(() => location.reload(), 500)
      } else {
        toastError('로그아웃 실패')
      }
    })
  }

  // 탭 숨김/닫기 시 자동 플러시 리스너 초기화
  cloudSyncManager.initVisibilityListeners()

  // 토글 스위치 이벤트 리스너
  if (elToggleParticles) {
    elToggleParticles.addEventListener('change', e => {
      settings.particles = e.target.checked
      saveSettings()
    })
  }

  if (elToggleFancyGraphics) {
    elToggleFancyGraphics.addEventListener('change', e => {
      settings.fancyGraphics = e.target.checked
      saveSettings()
      // 화려한 그래픽 설정 적용 (향후 확장 가능)
    })
  }

  if (elToggleShortNumbers) {
    elToggleShortNumbers.addEventListener('change', e => {
      settings.shortNumbers = e.target.checked
      saveSettings()
      // UI 즉시 업데이트 (숫자 포맷 변경 반영)
      updateUI()
    })
  }

  // ======= 금융상품/부동산 가치 계산 (statsTab.js에서 사용) =======

  // 금융상품 총 가치 계산 (ForType 함수 활용)
  function calculateFinancialValue() {
    return (
      calculateFinancialValueForType('deposit', gameState.deposits) +
      calculateFinancialValueForType('savings', gameState.savings) +
      calculateFinancialValueForType('bond', gameState.bonds) +
      calculateFinancialValueForType('usStock', gameState.usStocks) +
      calculateFinancialValueForType('crypto', gameState.cryptos)
    )
  }

  // 부동산 총 가치 계산 (ForType 함수 활용)
  function calculatePropertyValue() {
    return (
      calculatePropertyValueForType('villa', gameState.villas) +
      calculatePropertyValueForType('officetel', gameState.officetels) +
      calculatePropertyValueForType('apartment', gameState.apartments) +
      calculatePropertyValueForType('shop', gameState.shops) +
      calculatePropertyValueForType('building', gameState.buildings)
    )
  }

  // ======= 통계 탭 업데이트 함수 (statsTab.js 모듈로 위임) =======

  function updateStatsTab() {
    // statsTab.js 모듈의 updateStatsTab에 필요한 의존성 전달
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
      state: {
        cash: gameState.cash,
        deposits: gameState.deposits,
        savings: gameState.savings,
        bonds: gameState.bonds,
        usStocks: gameState.usStocks,
        cryptos: gameState.cryptos,
        depositsLifetime: gameState.depositsLifetime,
        savingsLifetime: gameState.savingsLifetime,
        bondsLifetime: gameState.bondsLifetime,
        usStocksLifetime: gameState.usStocksLifetime,
        cryptosLifetime: gameState.cryptosLifetime,
        villas: gameState.villas,
        officetels: gameState.officetels,
        apartments: gameState.apartments,
        shops: gameState.shops,
        buildings: gameState.buildings,
        villasLifetime: gameState.villasLifetime,
        officetelsLifetime: gameState.officetelsLifetime,
        apartmentsLifetime: gameState.apartmentsLifetime,
        shopsLifetime: gameState.shopsLifetime,
        buildingsLifetime: gameState.buildingsLifetime,
        totalLaborIncome: gameState.totalLaborIncome,
        totalClicks: gameState.totalClicks,
        sessionStartTime: gameState.sessionStartTime,
        totalPlayTime: gameState.totalPlayTime,
      },
      settings,
      ACHIEVEMENTS,
      FINANCIAL_INCOME,
      BASE_RENT,
      rentMultiplier: gameState.rentMultiplier,
      now: () => Date.now(),
    })

    // 빌드 시너지 업데이트 (statsTab.js에는 없는 호출)
    updateSynergyDisplay()
  }

  // 금융상품 타입별 가치 계산
  function calculateFinancialValueForType(type, count) {
    let value = 0
    for (let i = 0; i < count; i++) {
      value += getFinancialCost(type, i)
    }
    return value
  }

  // 부동산 타입별 가치 계산
  function calculatePropertyValueForType(type, count) {
    let value = 0
    for (let i = 0; i < count; i++) {
      value += getPropertyCost(type, i)
    }
    return value
  }

  // 총 자산 가치 계산 (현재 보유 자산을 현재가로 환산)
  function calculateTotalAssetValue() {
    return calculateFinancialValue() + calculatePropertyValue()
  }

  // 총 자산 = 현금 + 보유 자산 가치
  function getTotalAssets() {
    return gameState.cash + calculateTotalAssetValue()
  }

  /**
   * 저장 데이터에서 총 자산 계산 (saveData 객체 기준)
   */
  function calculateTotalAssetValueFromSave(saveData) {
    if (!saveData) return 0

    const cash = Number(saveData.cash || 0)

    // 금융상품 가치
    const financialValue =
      calculateFinancialValueForType('deposit', Number(saveData.deposits || 0)) +
      calculateFinancialValueForType('savings', Number(saveData.savings || 0)) +
      calculateFinancialValueForType('bond', Number(saveData.bonds || 0)) +
      calculateFinancialValueForType('usStock', Number(saveData.usStocks || 0)) +
      calculateFinancialValueForType('crypto', Number(saveData.cryptos || 0))

    // 부동산 가치
    const propertyValue =
      calculatePropertyValueForType('villa', Number(saveData.villas || 0)) +
      calculatePropertyValueForType('officetel', Number(saveData.officetels || 0)) +
      calculatePropertyValueForType('apartment', Number(saveData.apartments || 0)) +
      calculatePropertyValueForType('shop', Number(saveData.shops || 0)) +
      calculatePropertyValueForType('building', Number(saveData.buildings || 0)) +
      calculatePropertyValueForType('tower', Number(saveData.towers_run || 0))

    return cash + financialValue + propertyValue
  }

  /**
   * 저장 데이터에서 플레이타임 계산 (ms 단위)
   */
  function calculatePlayTimeMsFromSave(saveData, sessionStartTime) {
    if (!saveData) return 0
    const savedTotalPlayTime = Number(saveData.totalPlayTime || 0)
    const savedSessionStartTime = Number(saveData.sessionStartTime || Date.now())
    const currentSessionTime = Date.now() - (sessionStartTime || savedSessionStartTime)
    return savedTotalPlayTime + Math.max(0, currentSessionTime)
  }

  // 업적 그리드 업데이트 (achievementGrid.js 모듈로 위임)
  function updateAchievementGrid() {
    if (achievementGridInstance) {
      achievementGridInstance.updateAchievementGrid()
    }
  }

  // ======= 리더보드 폴링 제어 (랭킹 탭 전용) =======
  // ======= 하단 네비게이션 탭 전환 =======
  const navBtns = document.querySelectorAll('.nav-btn')
  const tabContents = document.querySelectorAll('.tab-content')

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab')

      // 모든 탭 비활성화
      tabContents.forEach(tab => tab.classList.remove('active'))
      navBtns.forEach(navBtn => {
        navBtn.classList.remove('active')
        navBtn.setAttribute('aria-selected', 'false')
      })

      // 선택한 탭 활성화
      const tabEl = document.getElementById(targetTab)
      if (tabEl) {
        tabEl.classList.add('active')
      }
      btn.classList.add('active')
      btn.setAttribute('aria-selected', 'true')

      // 햅틱 피드백 (지원되는 경우)
      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }

      // 경력 탭 진입 시 최신 상태로 새로고침
      if (targetTab === 'careerTab') {
        refreshPrestigeTab()
      }

      // 설정 탭 진입 시 마이그레이션 충돌 체크 및 서버 닉네임 동기화
      if (targetTab === 'settingsTab') {
        try {
          syncNicknameFromServer('') // 서버에서 최신 닉네임 동기화

          const needsChange = localStorage.getItem('clicksurvivor_needsNicknameChange') === 'true'
          if (needsChange) {
            // 세션 단위 가드: 같은 세션에서 이미 자동 오픈했으면 스킵
            const autoOpenKey = 'clicksurvivor_nicknameModalAutoOpened'
            const alreadyOpened = sessionStorage.getItem(autoOpenKey) === 'true'

            if (!alreadyOpened) {
              // 닉네임 변경 입력 모달 자동 오픈
              setTimeout(() => {
                openNicknameChangeModal()
                // 세션 플래그 설정 (이 세션에서 한 번만 자동 오픈)
                try {
                  sessionStorage.setItem(autoOpenKey, 'true')
                } catch (e) {
                  // sessionStorage 실패 시 무시
                }
              }, 300) // 탭 전환 애니메이션 후 표시
            }
          }
        } catch (e) {
          // 무시
        }
      }

      // 랭킹 탭 전용 리더보드 폴링 제어
      if (targetTab === 'rankingTab') {
        LeaderboardUI.startLeaderboardPolling()
        // 업적 영역 스크롤 이벤트 계측 및 최적화
        setupAchievementScrollOptimization()
      } else {
        LeaderboardUI.stopLeaderboardPolling()
      }
    })
  })

  // 업적 영역 스크롤 최적화 설정 (achievementGrid.js 모듈로 위임)
  function setupAchievementScrollOptimization() {
    if (achievementGridInstance) {
      achievementGridInstance.setupAchievementScrollOptimization()
    }
  }

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

  // 닉네임 변경 기능 (유니크 강제 시스템) - 모달 방식
  const nicknameChangeBtn = document.getElementById('nicknameChangeBtn')
  const nicknameConflictChangeBtn = document.getElementById('nicknameConflictChangeBtn')

  // ======= 닉네임 관련 함수는 모듈로 이동됨 =======
  // checkNicknameCooldown(), saveNicknameCooldown(), openNicknameChangeModal(), handleNicknameChangeFromModal()
  // → seoulsurvival/src/systems/nicknameManager.js의 nicknameManager 사용

  // 버튼 클릭 이벤트 리스너
  if (nicknameChangeBtn) {
    nicknameChangeBtn.addEventListener('click', () => nicknameManager.openNicknameChangeModal())
  }

  if (nicknameConflictChangeBtn) {
    nicknameConflictChangeBtn.addEventListener('click', () =>
      nicknameManager.openNicknameChangeModal()
    )
  }

  // Toast 시스템을 window에 연결 (전역 접근용)
  window.toast = {
    success: toastSuccess,
    error: toastError,
    info: toastInfo,
    warning: toastWarning,
  }

  // 치트 코드 (테스트용 - 개발 모드에서만 사용 가능)
  if (__IS_DEV__) {
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
})
