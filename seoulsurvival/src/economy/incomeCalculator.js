/**
 * Seoul Survival - Income Calculator
 *
 * 수익 계산 통합 모듈
 * main.js의 수익 계산 래퍼 함수들을 통합 (Phase 13)
 *
 * 모듈 레벨 싱글톤: setMarketEventMultiplier로 나중에 초기화
 */

import { gameState, CAREER_LEVELS } from '../state/gameState.js'
import {
  getFinancialIncome as calcFinancialIncome,
  getPropertyIncome as calcPropertyIncome,
  getRps as calcRps,
  getTotalIncomeForContribution as calcTotalIncomeForContribution,
  getClickIncome as calcClickIncome,
  getCurrentCareer as getCareerByLevel,
  getNextCareer as getNextCareerByLevel,
} from './income.js'
import { t } from '../i18n/index.js'

// 시장 이벤트 배수 함수 (investmentTab 초기화 후 설정)
let _getMarketEventMultiplier = () => 1

/**
 * 시장 이벤트 배수 함수 설정
 * investmentTab 초기화 후 호출해야 함
 *
 * @param {Function} fn - 시장 이벤트 배수 반환 함수
 */
export function setMarketEventMultiplier(fn) {
  _getMarketEventMultiplier = fn
}

/**
 * 클릭 수익 계산
 * @returns {number} 클릭당 수익
 */
export function getClickIncome() {
  return calcClickIncome(gameState.careerLevel, gameState.clickMultiplier)
}

/**
 * 현재 직급 정보 반환
 * @returns {Object} 직급 정보
 */
export function getCurrentCareer() {
  return getCareerByLevel(gameState.careerLevel)
}

/**
 * 다음 직급 정보 반환
 * @returns {Object|null} 다음 직급 정보 (최고 직급이면 null)
 */
export function getNextCareer() {
  return getNextCareerByLevel(gameState.careerLevel)
}

/**
 * 직급 이름 가져오기
 * @param {number} level - 직급 레벨
 * @returns {string} 직급 이름
 */
export function getCareerName(level) {
  if (level < 0 || level >= CAREER_LEVELS.length) return ''
  return t(CAREER_LEVELS[level].nameKey)
}

/**
 * 초당 수익 (RPS) 계산
 * @returns {number} 초당 총 수익
 */
export function getRps() {
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
  return calcRps(state, _getMarketEventMultiplier)
}

/**
 * 퍼센트 표시용 기준 총 수익
 * @returns {number} 기준 총 수익
 */
export function getTotalIncomeForContribution() {
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
  return calcTotalIncomeForContribution(state, _getMarketEventMultiplier)
}

/**
 * 금융상품 수익 계산
 * @param {string} type - 금융상품 타입
 * @param {number} count - 보유 수량
 * @returns {number} 초당 수익
 */
export function getFinancialIncome(type, count) {
  return calcFinancialIncome(type, count, _getMarketEventMultiplier)
}

/**
 * 부동산 수익 계산
 * @param {string} type - 부동산 타입
 * @param {number} count - 보유 수량
 * @returns {number} 초당 수익
 */
export function getPropertyIncome(type, count) {
  return calcPropertyIncome(type, count, _getMarketEventMultiplier)
}
