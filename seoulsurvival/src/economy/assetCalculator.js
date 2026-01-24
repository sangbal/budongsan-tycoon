/**
 * Asset Calculator Module
 *
 * 게임 내 자산 가치 계산 로직
 * - 금융상품 가치 계산
 * - 부동산 가치 계산
 * - 총 자산 가치 계산
 * - 저장 데이터로부터의 자산 계산
 */

import { getFinancialCost, getPropertyCost } from './pricing.js'

/**
 * 자산 계산기 팩토리 함수
 *
 * @param {Object} deps - 의존성 객체
 * @param {Object} deps.gameState - 게임 상태 객체
 * @returns {Object} 자산 계산 함수들
 */
export function createAssetCalculator(deps) {
  const { gameState } = deps

  /**
   * 금융상품 타입별 가치 계산
   * @param {string} type - 금융상품 타입 (deposit, savings, bond, usStock, crypto)
   * @param {number} count - 보유 수량
   * @returns {number} 총 가치
   */
  function calculateFinancialValueForType(type, count) {
    let value = 0
    for (let i = 0; i < count; i++) {
      value += getFinancialCost(type, i)
    }
    return value
  }

  /**
   * 부동산 타입별 가치 계산
   * @param {string} type - 부동산 타입 (villa, officetel, apartment, shop, building)
   * @param {number} count - 보유 수량
   * @returns {number} 총 가치
   */
  function calculatePropertyValueForType(type, count) {
    let value = 0
    for (let i = 0; i < count; i++) {
      value += getPropertyCost(type, i)
    }
    return value
  }

  /**
   * 금융상품 총 가치 계산
   * @returns {number} 모든 금융상품의 총 가치
   */
  function calculateFinancialValue() {
    return (
      calculateFinancialValueForType('deposit', gameState.deposits) +
      calculateFinancialValueForType('savings', gameState.savings) +
      calculateFinancialValueForType('bond', gameState.bonds) +
      calculateFinancialValueForType('usStock', gameState.usStocks) +
      calculateFinancialValueForType('crypto', gameState.cryptos)
    )
  }

  /**
   * 부동산 총 가치 계산
   * @returns {number} 모든 부동산의 총 가치
   */
  function calculatePropertyValue() {
    return (
      calculatePropertyValueForType('villa', gameState.villas) +
      calculatePropertyValueForType('officetel', gameState.officetels) +
      calculatePropertyValueForType('apartment', gameState.apartments) +
      calculatePropertyValueForType('shop', gameState.shops) +
      calculatePropertyValueForType('building', gameState.buildings)
    )
  }

  /**
   * 총 자산 가치 계산 (현재 보유 자산을 현재가로 환산)
   * @returns {number} 금융상품 + 부동산 총 가치
   */
  function calculateTotalAssetValue() {
    return calculateFinancialValue() + calculatePropertyValue()
  }

  /**
   * 총 자산 = 현금 + 보유 자산 가치
   * @returns {number} 현금 + 금융상품 + 부동산 총 가치
   */
  function getTotalAssets() {
    return gameState.cash + calculateTotalAssetValue()
  }

  /**
   * 저장 데이터에서 총 자산 계산 (saveData 객체 기준)
   * @param {Object} saveData - 저장 데이터 객체
   * @returns {number} 총 자산 가치
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
   * @param {Object} saveData - 저장 데이터 객체
   * @param {number} sessionStartTime - 세션 시작 시간
   * @returns {number} 총 플레이타임 (밀리초)
   */
  function calculatePlayTimeMsFromSave(saveData, sessionStartTime) {
    if (!saveData) return 0
    const savedTotalPlayTime = Number(saveData.totalPlayTime || 0)
    const savedSessionStartTime = Number(saveData.sessionStartTime || Date.now())
    const currentSessionTime = Date.now() - (sessionStartTime || savedSessionStartTime)
    return savedTotalPlayTime + Math.max(0, currentSessionTime)
  }

  return {
    calculateFinancialValueForType,
    calculatePropertyValueForType,
    calculateFinancialValue,
    calculatePropertyValue,
    calculateTotalAssetValue,
    getTotalAssets,
    calculateTotalAssetValueFromSave,
    calculatePlayTimeMsFromSave,
  }
}
