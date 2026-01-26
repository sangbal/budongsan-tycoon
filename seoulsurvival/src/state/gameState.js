/**
 * Seoul Survival - Game State
 *
 * 게임의 모든 상태 변수를 중앙 관리
 * - 통화 및 자산
 * - 보유 상품 (금융/부동산)
 * - 경제 배수
 * - 커리어 시스템
 * - 시장 이벤트
 * - 업적 및 설정
 */

import { CAREER_LEVELS as CAREER_BALANCE, BASE_CLICK_GAIN } from '../balance/index.js'
import { DEFAULT_FINANCIAL_INCOME, DEFAULT_BASE_RENT } from '../balance/index.js'

// Vite asset imports for career backgrounds
import workBg01 from '../../assets/images/work_bg_01_alba_night.webp'
import workBg02 from '../../assets/images/work_bg_02_gyeyakjik_night.webp'
import workBg03 from '../../assets/images/work_bg_03_sawon_night.webp'
import workBg04 from '../../assets/images/work_bg_04_daeri_night.webp'
import workBg05 from '../../assets/images/work_bg_05_gwajang_night.webp'
import workBg06 from '../../assets/images/work_bg_06_chajang_night.webp'
import workBg07 from '../../assets/images/work_bg_07_bujang_night.webp'
import workBg08 from '../../assets/images/work_bg_08_sangmu_night.webp'
import workBg09 from '../../assets/images/work_bg_09_jeonmu_night.webp'
import workBg10 from '../../assets/images/work_bg_10_ceo_night.webp'

// 직급별 배경 이미지 배열
const careerBgImages = [
  workBg01,
  workBg02,
  workBg03,
  workBg04,
  workBg05,
  workBg06,
  workBg07,
  workBg08,
  workBg09,
  workBg10,
]

// CAREER_LEVELS: balance/career.js에서 import된 CAREER_BALANCE에 bgImage 병합
export const CAREER_LEVELS = CAREER_BALANCE.map((level, idx) => ({
  ...level,
  bgImage: careerBgImages[idx],
}))

// 저장 키 상수
export const SAVE_KEY = 'seoulTycoonSaveV1'
export const CLOUD_RESTORE_BLOCK_KEY = 'ss_blockCloudRestoreUntilNicknameDone'
export const CLOUD_RESTORE_SKIP_KEY = 'ss_skipCloudRestoreOnce'
export const SETTINGS_KEY = 'capitalClicker_settings'

// ======= 게임 상태 객체 =======
// 모든 게임 상태를 하나의 객체로 관리
// main.js에서 import하여 직접 접근/수정 가능
export const gameState = {
  // 통화 및 시간
  cash: 0,
  totalPlayTime: 0, // 누적 플레이시간 (밀리초)
  sessionStartTime: Date.now(), // 현재 세션 시작 시간
  gameStartTime: Date.now(), // 게임 시작 시간 (호환성 유지)
  lastSaveTime: new Date(),

  // 금융상품 보유 수량
  deposits: 0, // 예금
  savings: 0, // 적금
  bonds: 0, // 국내주식
  usStocks: 0, // 미국주식
  cryptos: 0, // 코인

  // 금융상품 누적 생산량 (Cookie Clicker 스타일)
  depositsLifetime: 0,
  savingsLifetime: 0,
  bondsLifetime: 0,
  usStocksLifetime: 0,
  cryptosLifetime: 0,

  // 부동산 보유 수량
  villas: 0, // 빌라
  officetels: 0, // 오피스텔
  apartments: 0, // 아파트
  shops: 0, // 상가
  buildings: 0, // 빌딩
  towers_run: 0, // 서울타워 (현재 런에서 획득)
  towers_lifetime: 0, // 서울타워 (계정 누적, 프레스티지 유지)

  // 경력 포인트(CP) 시스템 - 프레스티지 통화
  careerPoints: 0, // 현재 보유 CP
  totalCareerPoints: 0, // 누적 획득 CP (통계용)
  purchasedUpgrades: [], // 구매한 프레스티지 업그레이드 ID 배열
  permanentSlots: [], // 영구 슬롯에 저장된 업그레이드 ID (최대 2개)
  lifetimeEarnings: 0, // 누적 수익 (CP 계산용)

  // 부동산 누적 생산량
  villasLifetime: 0,
  officetelsLifetime: 0,
  apartmentsLifetime: 0,
  shopsLifetime: 0,
  buildingsLifetime: 0,

  // 구매 수량 선택 시스템
  purchaseMode: 'buy', // 'buy' or 'sell'
  purchaseQuantity: 1, // 1, 10, 100

  // 닉네임 (리더보드용)
  playerNickname: '',
  __nicknameModalShown: false, // 닉네임 모달 세션 플래그

  // 해금 상태 추적 (순차 해금 시스템)
  unlockedProducts: {
    deposit: true,
    savings: false,
    bond: false,
    usStock: false,
    crypto: false,
    villa: false,
    officetel: false,
    apartment: false,
    shop: false,
    building: false,
    tower: false,
  },

  // 경제 배수
  clickMultiplier: 1, // 노동 효율 배수
  rentMultiplier: 1, // 월세 수익 배수
  autoClickEnabled: false, // 자동 클릭 활성화 여부
  managerLevel: 0, // 관리인 레벨

  // 업그레이드 비용
  rentCost: 1000000000, // 월세 수익률 업: 10억원
  mgrCost: 5000000000, // 관리인 고용: 50억원

  // 노동 커리어 시스템
  careerLevel: 0, // 현재 커리어 레벨
  totalLaborIncome: 0, // 총 노동 수익

  // 부동산 시장 이벤트 시스템
  marketMultiplier: 1.0, // 시장 수익 배수
  marketEventEndTime: 0, // 이벤트 종료 시간
  currentMarketEvent: null, // 현재 시장 이벤트

  // 업적 시스템
  totalClicks: 0, // 총 클릭 수 추적

  // 설정 옵션
  settings: {
    particles: true, // 파티클 애니메이션
    fancyGraphics: true, // 화려한 그래픽
    shortNumbers: false, // 짧은 숫자 표시 (기본값: 끔)
  },
}

// ======= 수익 테이블 (업그레이드로 변경 가능) =======
// 업그레이드로 변경 가능하도록 mutable copy 생성
export const FINANCIAL_INCOME = { ...DEFAULT_FINANCIAL_INCOME }
export const BASE_RENT = { ...DEFAULT_BASE_RENT }

/**
 * 수익 테이블을 초기값으로 리셋
 * 로드 시 업그레이드 효과 중복 적용 방지용
 */
export function resetIncomeTablesToDefault() {
  for (const k of Object.keys(DEFAULT_FINANCIAL_INCOME)) {
    FINANCIAL_INCOME[k] = DEFAULT_FINANCIAL_INCOME[k]
  }
  for (const k of Object.keys(DEFAULT_BASE_RENT)) {
    BASE_RENT[k] = DEFAULT_BASE_RENT[k]
  }
}

/**
 * 수익 테이블에 영향을 주는 업그레이드 효과를 재적용
 * @param {Object} UPGRADES - 업그레이드 객체 (main.js에서 전달)
 */
export function reapplyIncomeTableAffectingUpgradeEffects(UPGRADES) {
  resetIncomeTablesToDefault()

  for (const upgrade of Object.values(UPGRADES)) {
    if (!upgrade?.purchased || typeof upgrade.effect !== 'function') continue

    // clickMultiplier/rentMultiplier 등 "저장되는 상태"에 대한 effect는 중복 적용 위험이 있어 제외한다.
    // 반면 FINANCIAL_INCOME / BASE_RENT는 저장되지 않으므로, 여기에만 영향을 주는 업그레이드는 재적용이 필요하다.
    const src = Function.prototype.toString.call(upgrade.effect)
    const affectsIncomeTables = src.includes('FINANCIAL_INCOME') || src.includes('BASE_RENT')
    if (!affectsIncomeTables) continue

    try {
      upgrade.effect()
    } catch {
      // 업그레이드 effect 실패는 무시(로드/진행 유지)
    }
  }
}

// ======= 직렬화 함수 =======

/**
 * 저장 가능한 상태 반환
 * saveLoad.js에서 사용하여 gameVars 프록시 대신 직접 접근
 *
 * @returns {Object} 저장할 상태 데이터
 */
export function getSerializableState() {
  return {
    // 통화 및 시간
    cash: gameState.cash,
    totalPlayTime: gameState.totalPlayTime,
    sessionStartTime: gameState.sessionStartTime,
    gameStartTime: gameState.gameStartTime,

    // 클릭 및 노동
    totalClicks: gameState.totalClicks,
    totalLaborIncome: gameState.totalLaborIncome,
    careerLevel: gameState.careerLevel,
    clickMultiplier: gameState.clickMultiplier,

    // 배수 및 업그레이드 비용
    rentMultiplier: gameState.rentMultiplier,
    autoClickEnabled: gameState.autoClickEnabled,
    managerLevel: gameState.managerLevel,
    rentCost: gameState.rentCost,
    mgrCost: gameState.mgrCost,

    // 금융상품 보유
    deposits: gameState.deposits,
    savings: gameState.savings,
    bonds: gameState.bonds,
    usStocks: gameState.usStocks,
    cryptos: gameState.cryptos,

    // 금융상품 누적 생산량
    depositsLifetime: gameState.depositsLifetime,
    savingsLifetime: gameState.savingsLifetime,
    bondsLifetime: gameState.bondsLifetime,
    usStocksLifetime: gameState.usStocksLifetime,
    cryptosLifetime: gameState.cryptosLifetime,

    // 부동산 보유
    villas: gameState.villas,
    officetels: gameState.officetels,
    apartments: gameState.apartments,
    shops: gameState.shops,
    buildings: gameState.buildings,
    towers_run: gameState.towers_run,
    towers_lifetime: gameState.towers_lifetime,

    // 부동산 누적 생산량
    villasLifetime: gameState.villasLifetime,
    officetelsLifetime: gameState.officetelsLifetime,
    apartmentsLifetime: gameState.apartmentsLifetime,
    shopsLifetime: gameState.shopsLifetime,
    buildingsLifetime: gameState.buildingsLifetime,

    // CP 시스템 (경력 포인트)
    // lifetimeEarnings: 런 내 누적 수익, CP 계산에만 사용
    // - 프레스티지 시 0으로 초기화되지 않음 (계정 누적)
    // - 타워 구매 시 CP로 변환
    careerPoints: gameState.careerPoints,
    totalCareerPoints: gameState.totalCareerPoints,
    purchasedUpgrades: gameState.purchasedUpgrades,
    permanentSlots: gameState.permanentSlots,
    lifetimeEarnings: gameState.lifetimeEarnings,

    // 시장 이벤트
    marketMultiplier: gameState.marketMultiplier,
    marketEventEndTime: gameState.marketEventEndTime,

    // 닉네임
    nickname: gameState.playerNickname,
  }
}

/**
 * 저장된 상태 복원
 * saveLoad.js에서 사용하여 gameVars 프록시 대신 직접 접근
 *
 * @param {Object} data - 저장된 상태 데이터
 */
export function restoreState(data) {
  // 통화 및 시간
  gameState.cash = data.cash || 0
  gameState.totalPlayTime = data.totalPlayTime || 0
  gameState.gameStartTime = data.gameStartTime || Date.now()

  // 클릭 및 노동
  gameState.totalClicks = data.totalClicks || 0
  gameState.totalLaborIncome = data.totalLaborIncome || 0
  gameState.careerLevel = data.careerLevel || 0
  gameState.clickMultiplier = data.clickMultiplier || 1

  // 배수 및 업그레이드 비용
  gameState.rentMultiplier = data.rentMultiplier || 1
  gameState.autoClickEnabled = data.autoClickEnabled || false
  gameState.managerLevel = data.managerLevel || 0
  gameState.rentCost = data.rentCost || 1000000000
  gameState.mgrCost = data.mgrCost || 5000000000

  // 금융상품 보유
  gameState.deposits = data.deposits || 0
  gameState.savings = data.savings || 0
  gameState.bonds = data.bonds || 0
  gameState.usStocks = data.usStocks || 0
  gameState.cryptos = data.cryptos || 0

  // 금융상품 누적 생산량
  gameState.depositsLifetime = data.depositsLifetime || 0
  gameState.savingsLifetime = data.savingsLifetime || 0
  gameState.bondsLifetime = data.bondsLifetime || 0
  gameState.usStocksLifetime = data.usStocksLifetime || 0
  gameState.cryptosLifetime = data.cryptosLifetime || 0

  // 부동산 보유
  gameState.villas = data.villas || 0
  gameState.officetels = data.officetels || 0
  gameState.apartments = data.apartments || 0
  gameState.shops = data.shops || 0
  gameState.buildings = data.buildings || 0
  gameState.towers_run = data.towers_run || 0
  // 마이그레이션: 기존 towers를 towers_lifetime으로
  gameState.towers_lifetime = data.towers_lifetime || data.towers || 0

  // 부동산 누적 생산량
  gameState.villasLifetime = data.villasLifetime || 0
  gameState.officetelsLifetime = data.officetelsLifetime || 0
  gameState.apartmentsLifetime = data.apartmentsLifetime || 0
  gameState.shopsLifetime = data.shopsLifetime || 0
  gameState.buildingsLifetime = data.buildingsLifetime || 0

  // CP 시스템
  gameState.careerPoints = data.careerPoints || 0
  gameState.totalCareerPoints = data.totalCareerPoints || 0
  gameState.purchasedUpgrades = data.purchasedUpgrades || []
  gameState.permanentSlots = data.permanentSlots || []
  gameState.lifetimeEarnings = data.lifetimeEarnings || 0

  // 시장 이벤트
  gameState.marketMultiplier = data.marketMultiplier || 1
  gameState.marketEventEndTime = data.marketEventEndTime || 0

  // 닉네임
  gameState.playerNickname = data.nickname || ''

  // 새 세션 시작
  gameState.sessionStartTime = Date.now()
}

/**
 * 런 상태만 초기화 (프레스티지용)
 * towers_lifetime, careerPoints, 업적 등 계정 누적 데이터는 유지
 */
export function resetRunState() {
  // 기본 시작 자금
  gameState.cash = 1000
  gameState.totalClicks = 0
  gameState.totalLaborIncome = 0
  gameState.careerLevel = 0
  gameState.clickMultiplier = 1
  gameState.rentMultiplier = 1
  gameState.autoClickEnabled = false
  gameState.managerLevel = 0

  // 금융상품 보유 초기화
  gameState.deposits = 0
  gameState.savings = 0
  gameState.bonds = 0
  gameState.usStocks = 0
  gameState.cryptos = 0

  // 부동산 보유 초기화
  gameState.villas = 0
  gameState.officetels = 0
  gameState.apartments = 0
  gameState.shops = 0
  gameState.buildings = 0
  gameState.towers_run = 0
  // towers_lifetime은 유지 (계정 누적)

  // 시장 이벤트 초기화
  gameState.marketMultiplier = 1
  gameState.marketEventEndTime = 0
  gameState.currentMarketEvent = null

  // 세션 시간 초기화
  gameState.sessionStartTime = Date.now()
}

// ======= 유틸리티 함수 =======

/**
 * 총 금융상품 개수 계산
 */
export function getTotalFinancialProducts() {
  return (
    gameState.deposits +
    gameState.savings +
    gameState.bonds +
    gameState.usStocks +
    gameState.cryptos
  )
}

/**
 * 총 부동산 개수 계산
 */
export function getTotalProperties() {
  return (
    gameState.villas +
    gameState.officetels +
    gameState.apartments +
    gameState.shops +
    gameState.buildings
  )
}

// Re-export constants for convenience
export { BASE_CLICK_GAIN }

// ======= 개발 모드 디버그 헬퍼 =======
// gameState를 전역으로 노출 (테스트용)
// 프로덕션 빌드에서는 Vite tree-shaking이 import.meta.env.DEV 체크를 최적화함
window.gameState = gameState
console.log('[DEV] gameState가 window.gameState로 노출됨')
