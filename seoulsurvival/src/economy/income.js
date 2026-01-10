// 수익 계산 함수 모듈
// main.js에서 분리 (Phase 1 리팩토링)

import {
  gameState,
  FINANCIAL_INCOME,
  BASE_RENT,
  CAREER_LEVELS,
  BASE_CLICK_GAIN,
} from '../state/gameState.js'

/**
 * 금융상품의 현재 수익 계산 (시장 이벤트 배수 포함)
 * @param {string} type - 금융상품 타입 (deposit, savings, bond, usStock, crypto)
 * @param {number} count - 보유 수량
 * @param {Function} getMarketEventMultiplier - 시장 이벤트 배수 함수
 * @returns {number} 현재 초당 수익
 */
export function getFinancialIncome(type, count, getMarketEventMultiplier) {
  const baseIncome = FINANCIAL_INCOME[type]
  let income = baseIncome * count
  const marketMult = getMarketEventMultiplier(type, 'financial')
  income *= marketMult
  return income
}

/**
 * 부동산의 현재 수익 계산 (시장 이벤트 배수 포함)
 * @param {string} type - 부동산 타입 (villa, officetel, apartment, shop, building)
 * @param {number} count - 보유 수량
 * @param {Function} getMarketEventMultiplier - 시장 이벤트 배수 함수
 * @returns {number} 현재 초당 수익
 */
export function getPropertyIncome(type, count, getMarketEventMultiplier) {
  const baseIncome = BASE_RENT[type]
  let income = baseIncome * count
  const marketMult = getMarketEventMultiplier(type, 'property')
  income *= marketMult
  return income
}

/**
 * 전체 초당 수익 계산 (금융 + 부동산, 모든 배수 적용)
 * @param {Object} state - 게임 상태 객체
 * @param {Function} getMarketEventMultiplier - 시장 이벤트 배수 함수
 * @returns {number} 현재 초당 총 수익
 */
export function getRps(state, getMarketEventMultiplier) {
  // 금융상품 수익(고정) + 시장 이벤트 배수
  const financialIncome =
    getFinancialIncome('deposit', state.deposits, getMarketEventMultiplier) +
    getFinancialIncome('savings', state.savings, getMarketEventMultiplier) +
    getFinancialIncome('bond', state.bonds, getMarketEventMultiplier) +
    getFinancialIncome('usStock', state.usStocks, getMarketEventMultiplier) +
    getFinancialIncome('crypto', state.cryptos, getMarketEventMultiplier)

  // 부동산 수익(고정) + 시장 이벤트 배수
  const propertyRent =
    getPropertyIncome('villa', state.villas, getMarketEventMultiplier) +
    getPropertyIncome('officetel', state.officetels, getMarketEventMultiplier) +
    getPropertyIncome('apartment', state.apartments, getMarketEventMultiplier) +
    getPropertyIncome('shop', state.shops, getMarketEventMultiplier) +
    getPropertyIncome('building', state.buildings, getMarketEventMultiplier)

  // 배수 적용 순서: 1) 부동산에 rentMultiplier 적용, 2) 전체에 marketMultiplier 적용
  const totalIncome = financialIncome + propertyRent * state.rentMultiplier
  return totalIncome * state.marketMultiplier
}

/**
 * 퍼센트 표시용 기준 총 수익 (시장 이벤트/개별 배수는 포함, 글로벌 marketMultiplier는 제외)
 * @param {Object} state - 게임 상태 객체
 * @param {Function} getMarketEventMultiplier - 시장 이벤트 배수 함수
 * @returns {number} 기준 총 수익
 */
export function getTotalIncomeForContribution(state, getMarketEventMultiplier) {
  const financialIncome =
    getFinancialIncome('deposit', state.deposits, getMarketEventMultiplier) +
    getFinancialIncome('savings', state.savings, getMarketEventMultiplier) +
    getFinancialIncome('bond', state.bonds, getMarketEventMultiplier) +
    getFinancialIncome('usStock', state.usStocks, getMarketEventMultiplier) +
    getFinancialIncome('crypto', state.cryptos, getMarketEventMultiplier)

  const propertyRent =
    getPropertyIncome('villa', state.villas, getMarketEventMultiplier) +
    getPropertyIncome('officetel', state.officetels, getMarketEventMultiplier) +
    getPropertyIncome('apartment', state.apartments, getMarketEventMultiplier) +
    getPropertyIncome('shop', state.shops, getMarketEventMultiplier) +
    getPropertyIncome('building', state.buildings, getMarketEventMultiplier)

  // 부동산에는 rentMultiplier까지 반영 (getRps와 동일 기준, marketMultiplier만 제외)
  return financialIncome + propertyRent * state.rentMultiplier
}

/**
 * 클릭당 수익 계산 (직급 배수 + 업그레이드 배수)
 * @param {number} careerLevel - 현재 직급 레벨
 * @param {number} clickMultiplier - 클릭 배수
 * @returns {number} 클릭당 수익
 */
export function getClickIncome(careerLevel, clickMultiplier) {
  const currentCareer = CAREER_LEVELS[careerLevel]
  return Math.floor(BASE_CLICK_GAIN * currentCareer.multiplier * clickMultiplier)
}

/**
 * 현재 직급 정보 반환
 * @param {number} careerLevel - 현재 직급 레벨
 * @returns {Object} 직급 정보
 */
export function getCurrentCareer(careerLevel) {
  return CAREER_LEVELS[careerLevel]
}

/**
 * 다음 직급 정보 반환
 * @param {number} careerLevel - 현재 직급 레벨
 * @returns {Object|null} 다음 직급 정보 (최고 직급이면 null)
 */
export function getNextCareer(careerLevel) {
  return careerLevel < CAREER_LEVELS.length - 1 ? CAREER_LEVELS[careerLevel + 1] : null
}
