/**
 * 효율 분석 모듈
 * - 투자 회수 시간 계산
 * - 자산 가치 계산 헬퍼
 * - 통계 섹션 잠금 상태 관리
 */
import { t } from '../../i18n/index.js'
import { gameState, FINANCIAL_INCOME, BASE_RENT } from '../../state/gameState.js'

/**
 * 금융상품 타입별 가치 계산
 */
export function calculateFinancialValueForType(type, count, getFinancialCost) {
  let value = 0
  for (let i = 0; i < count; i++) {
    value += getFinancialCost(type, i)
  }
  return value
}

/**
 * 부동산 타입별 가치 계산
 */
export function calculatePropertyValueForType(type, count, getPropertyCost) {
  let value = 0
  for (let i = 0; i < count; i++) {
    value += getPropertyCost(type, i)
  }
  return value
}

/**
 * 효율 분석 (투자 회수 시간)
 * @returns {string[]} 상위 3개 자산의 회수 시간 정보
 */
export function calculateEfficiencies(deps) {
  const { getProductName, getFinancialCost, getPropertyCost } = deps
  const state = gameState
  const rentMultiplier = gameState.rentMultiplier
  const assets = []

  // 금융상품 - 회수 시간 = 개당 평균 구매가 / 초당 수익 (초)
  if (state.deposits > 0) {
    const totalInvestment = calculateFinancialValueForType(
      'deposit',
      state.deposits,
      getFinancialCost
    )
    const avgCost = totalInvestment / state.deposits
    const incomePerSec = FINANCIAL_INCOME.deposit
    const paybackSeconds = avgCost > 0 && incomePerSec > 0 ? avgCost / incomePerSec : Infinity
    assets.push({
      name: getProductName('deposit'),
      paybackSeconds,
      count: state.deposits,
    })
  }
  if (state.savings > 0) {
    const totalInvestment = calculateFinancialValueForType(
      'savings',
      state.savings,
      getFinancialCost
    )
    const avgCost = totalInvestment / state.savings
    const incomePerSec = FINANCIAL_INCOME.savings
    const paybackSeconds = avgCost > 0 && incomePerSec > 0 ? avgCost / incomePerSec : Infinity
    assets.push({
      name: getProductName('savings'),
      paybackSeconds,
      count: state.savings,
    })
  }
  if (state.bonds > 0) {
    const totalInvestment = calculateFinancialValueForType('bond', state.bonds, getFinancialCost)
    const avgCost = totalInvestment / state.bonds
    const incomePerSec = FINANCIAL_INCOME.bond
    const paybackSeconds = avgCost > 0 && incomePerSec > 0 ? avgCost / incomePerSec : Infinity
    assets.push({
      name: getProductName('bond'),
      paybackSeconds,
      count: state.bonds,
    })
  }
  if (state.usStocks > 0) {
    const totalInvestment = calculateFinancialValueForType(
      'usStock',
      state.usStocks,
      getFinancialCost
    )
    const avgCost = totalInvestment / state.usStocks
    const incomePerSec = FINANCIAL_INCOME.usStock
    const paybackSeconds = avgCost > 0 && incomePerSec > 0 ? avgCost / incomePerSec : Infinity
    assets.push({
      name: getProductName('usStock'),
      paybackSeconds,
      count: state.usStocks,
    })
  }
  if (state.cryptos > 0) {
    const totalInvestment = calculateFinancialValueForType(
      'crypto',
      state.cryptos,
      getFinancialCost
    )
    const avgCost = totalInvestment / state.cryptos
    const incomePerSec = FINANCIAL_INCOME.crypto
    const paybackSeconds = avgCost > 0 && incomePerSec > 0 ? avgCost / incomePerSec : Infinity
    assets.push({
      name: getProductName('crypto'),
      paybackSeconds,
      count: state.cryptos,
    })
  }

  // 부동산 - 회수 시간 = 개당 평균 구매가 / 초당 수익 (초)
  if (state.villas > 0) {
    const totalInvestment = calculatePropertyValueForType('villa', state.villas, getPropertyCost)
    const avgCost = totalInvestment / state.villas
    const incomePerSec = BASE_RENT.villa * rentMultiplier
    const paybackSeconds = avgCost > 0 && incomePerSec > 0 ? avgCost / incomePerSec : Infinity
    assets.push({
      name: getProductName('villa'),
      paybackSeconds,
      count: state.villas,
    })
  }
  if (state.officetels > 0) {
    const totalInvestment = calculatePropertyValueForType(
      'officetel',
      state.officetels,
      getPropertyCost
    )
    const avgCost = totalInvestment / state.officetels
    const incomePerSec = BASE_RENT.officetel * rentMultiplier
    const paybackSeconds = avgCost > 0 && incomePerSec > 0 ? avgCost / incomePerSec : Infinity
    assets.push({
      name: getProductName('officetel'),
      paybackSeconds,
      count: state.officetels,
    })
  }
  if (state.apartments > 0) {
    const totalInvestment = calculatePropertyValueForType(
      'apartment',
      state.apartments,
      getPropertyCost
    )
    const avgCost = totalInvestment / state.apartments
    const incomePerSec = BASE_RENT.apartment * rentMultiplier
    const paybackSeconds = avgCost > 0 && incomePerSec > 0 ? avgCost / incomePerSec : Infinity
    assets.push({
      name: getProductName('apartment'),
      paybackSeconds,
      count: state.apartments,
    })
  }
  if (state.shops > 0) {
    const totalInvestment = calculatePropertyValueForType('shop', state.shops, getPropertyCost)
    const avgCost = totalInvestment / state.shops
    const incomePerSec = BASE_RENT.shop * rentMultiplier
    const paybackSeconds = avgCost > 0 && incomePerSec > 0 ? avgCost / incomePerSec : Infinity
    assets.push({
      name: getProductName('shop'),
      paybackSeconds,
      count: state.shops,
    })
  }
  if (state.buildings > 0) {
    const totalInvestment = calculatePropertyValueForType(
      'building',
      state.buildings,
      getPropertyCost
    )
    const avgCost = totalInvestment / state.buildings
    const incomePerSec = BASE_RENT.building * rentMultiplier
    const paybackSeconds = avgCost > 0 && incomePerSec > 0 ? avgCost / incomePerSec : Infinity
    assets.push({
      name: getProductName('building'),
      paybackSeconds,
      count: state.buildings,
    })
  }

  // 회수 시간 순으로 정렬 (짧은 순)
  assets.sort((a, b) => a.paybackSeconds - b.paybackSeconds)

  // 상위 3개 반환
  const paybackUnit = t('stats.payback.minutes')
  return assets.slice(0, 3).map(a => {
    const paybackMinutes = (a.paybackSeconds / 60).toFixed(1)
    return `${a.name}: ${paybackMinutes}${paybackUnit}`
  })
}

/**
 * 통계 섹션 잠금 상태 업데이트
 */
export function updateStatsLockStates(deps) {
  const { isProductUnlocked } = deps

  // 금융상품 잠금 상태
  const statsProductMap = {
    savings: { id: 'savingsOwnedStats', name: t('product.savings') },
    bond: { id: 'bondsOwnedStats', name: t('product.bond') },
    usStock: { id: 'usStocksOwnedStats', name: t('product.usStock') },
    crypto: { id: 'cryptosOwnedStats', name: t('product.crypto') },
  }

  // 부동산 잠금 상태
  const statsPropertyMap = {
    villa: { id: 'villasOwnedStats', name: t('product.villa') },
    officetel: { id: 'officetelsOwnedStats', name: t('product.officetel') },
    apartment: { id: 'apartmentsOwnedStats', name: t('product.apartment') },
    shop: { id: 'shopsOwnedStats', name: t('product.shop') },
    building: { id: 'buildingsOwnedStats', name: t('product.building') },
  }

  // 금융상품 잠금 상태 적용
  Object.keys(statsProductMap).forEach(productName => {
    const productInfo = statsProductMap[productName]
    const statElement = document.getElementById(productInfo.id)
    if (statElement) {
      const assetRow = statElement.closest('.asset-row')
      if (assetRow) {
        const isLocked = !isProductUnlocked(productName)
        assetRow.classList.toggle('locked', isLocked)
      }
    }
  })

  // 부동산 잠금 상태 적용
  Object.keys(statsPropertyMap).forEach(propertyName => {
    const propertyInfo = statsPropertyMap[propertyName]
    const statElement = document.getElementById(propertyInfo.id)
    if (statElement) {
      const assetRow = statElement.closest('.asset-row')
      if (assetRow) {
        const isLocked = !isProductUnlocked(propertyName)
        assetRow.classList.toggle('locked', isLocked)
      }
    }
  })
}
