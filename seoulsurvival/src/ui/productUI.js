/**
 * productUI.js
 * 금융상품 및 부동산 UI 업데이트 전용 모듈
 * main.js의 updateUI() 함수에서 분리
 */

import { t, getLang } from '../i18n/index.js'
import * as NumberFormat from '../utils/numberFormat.js'
import { FINANCIAL_INCOME, BASE_RENT } from '../state/gameState.js'
import {
  getFinancialCost,
  getFinancialSellPrice,
  getPropertyCost,
  getPropertySellPrice,
} from '../economy/pricing.js'

/**
 * 상품 이름 가져오기 (i18n 적용)
 */
export function getProductName(type) {
  return t(`product.${type}`)
}

/**
 * 금융상품 UI 업데이트
 * @param {Object} params
 * @param {string} params.type - 상품 타입 (deposit, savings, bond, usStock, crypto)
 * @param {number} params.count - 현재 보유 수량
 * @param {number} params.lifetime - 누적 생산량
 * @param {number} params.purchaseMode - 구매/판매 모드
 * @param {number} params.purchaseQuantity - 구매/판매 수량
 * @param {number} params.totalRps - 전체 초당 수익
 * @param {Function} params.getIncomeFn - 수익 계산 함수
 * @param {Object} params.settings - 게임 설정
 */
export function updateFinancialProductUI({
  type,
  count,
  lifetime,
  purchaseMode,
  purchaseQuantity,
  totalRps,
  getIncomeFn,
  settings,
}) {
  // 요소 ID 매핑
  const elementIds = {
    deposit: {
      item: 'depositItem',
      count: 'depositCount',
      currentPrice: 'depositCurrentPrice',
      icon: '💰',
    },
    savings: {
      item: 'savingsItem',
      count: 'savingsCount',
      currentPrice: 'savingsCurrentPrice',
      icon: '🏦',
    },
    bond: {
      item: 'bondItem',
      count: 'bondCount',
      currentPrice: 'bondCurrentPrice',
      icon: '📈',
    },
    usStock: {
      item: 'usStockItem',
      count: 'usStockCount',
      currentPrice: 'usStockCurrentPrice',
      icon: '💼',
    },
    crypto: {
      item: 'cryptoItem',
      count: 'cryptoCount',
      currentPrice: 'cryptoCurrentPrice',
      icon: '🪙',
    },
  }

  const ids = elementIds[type]
  if (!ids) {
    console.warn(`Unknown financial product type: ${type}`)
    return
  }

  // 가격 계산
  const cost =
    purchaseMode === 'buy'
      ? getFinancialCost(type, count, purchaseQuantity)
      : getFinancialSellPrice(type, count, purchaseQuantity)

  // 수익 계산
  const baseIncome = FINANCIAL_INCOME[type]
  const totalIncome = count * baseIncome
  const effectiveIncome = getIncomeFn(type, count)
  const percent = totalRps > 0 ? ((effectiveIncome / totalRps) * 100).toFixed(1) : 0

  // 포맷팅
  const currency = t('ui.currency')
  const unit = t('ui.unit.count')
  const productName = getProductName(type)
  const perUnitAmount =
    Math.floor(baseIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') + currency
  const totalAmount =
    Math.floor(totalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') + currency
  const lifetimeAmount = NumberFormat.formatCashDisplayFixed1(lifetime, settings)
  const price = NumberFormat.formatFinancialPrice(cost)

  // 수량 업데이트
  const countEl = document.getElementById(ids.count)
  if (countEl) countEl.textContent = count

  // 상품 이름 업데이트
  const titleEl = document.querySelector(`#${ids.item} .title`)
  if (titleEl) titleEl.textContent = `${ids.icon} ${productName}`

  // 설명 업데이트
  const descEls = document.querySelectorAll(`#${ids.item} .desc`)
  if (descEls.length >= 4) {
    // 1. 각 상품이 초당 X 생산
    const perUnitText = t('product.desc.perUnit', {
      product: productName,
      amount: perUnitAmount,
    })
    descEls[0].innerHTML = `• ${perUnitText.replace(perUnitAmount, `<b>${perUnitAmount}</b>`)}`

    // 2. N개 상품이 초당 X 생산 (총 수익의 Y%)
    const totalText = t('product.desc.total', {
      count,
      unit,
      product: productName,
      amount: totalAmount,
      percent,
    })
    descEls[1].innerHTML = `• ${totalText.replace(totalAmount, `<b>${totalAmount}</b>`).replace(percent + '%', `<b>${percent}%</b>`)}`

    // 3. 지금까지 X 생산
    const lifetimeText = t('product.desc.lifetime', { amount: lifetimeAmount })
    descEls[2].innerHTML = `• ${lifetimeText.replace(lifetimeAmount, `<b>${lifetimeAmount}</b>`)}`

    // 4. 현재가: X
    const currentPriceText = t('product.desc.currentPrice', { price })
    descEls[3].innerHTML = currentPriceText.replace(price, `<b>${price}</b>`)
  }

  // 가격 업데이트
  const currentPriceEl = document.getElementById(ids.currentPrice)
  if (currentPriceEl) currentPriceEl.textContent = price
}

/**
 * 부동산 UI 업데이트
 * @param {Object} params
 * @param {string} params.type - 부동산 타입 (villa, officetel, apartment, shop, building)
 * @param {number} params.count - 현재 보유 수량
 * @param {number} params.lifetime - 누적 생산량
 * @param {number} params.purchaseMode - 구매/판매 모드
 * @param {number} params.purchaseQuantity - 구매/판매 수량
 * @param {number} params.totalRps - 전체 초당 수익
 * @param {Function} params.getIncomeFn - 수익 계산 함수
 * @param {number} params.rentMultiplier - 임대 배수
 * @param {Object} params.settings - 게임 설정
 */
export function updatePropertyUI({
  type,
  count,
  lifetime,
  purchaseMode,
  purchaseQuantity,
  totalRps,
  getIncomeFn,
  rentMultiplier,
  settings,
}) {
  // 요소 ID 매핑
  const elementIds = {
    villa: {
      item: 'villaItem',
      count: 'villaCount',
      currentPrice: 'villaCurrentPrice',
      icon: '🏡',
    },
    officetel: {
      item: 'officetelItem',
      count: 'officetelCount',
      currentPrice: 'officetelCurrentPrice',
      icon: '🏢',
    },
    apartment: {
      item: 'aptItem',
      count: 'aptCount',
      currentPrice: 'aptCurrentPrice',
      icon: '🏬',
    },
    shop: {
      item: 'shopItem',
      count: 'shopCount',
      currentPrice: 'shopCurrentPrice',
      icon: '🏪',
    },
    building: {
      item: 'buildingItem',
      count: 'buildingCount',
      currentPrice: 'buildingCurrentPrice',
      icon: '🏙️',
    },
  }

  const ids = elementIds[type]
  if (!ids) {
    console.warn(`Unknown property type: ${type}`)
    return
  }

  // 가격 계산
  const cost =
    purchaseMode === 'buy'
      ? getPropertyCost(type, count, purchaseQuantity)
      : getPropertySellPrice(type, count, purchaseQuantity)

  // 수익 계산
  const baseRent = BASE_RENT[type]
  const totalIncome = count * baseRent * rentMultiplier
  const effectiveIncome = getIncomeFn(type, count)
  const percent = totalRps > 0 ? ((effectiveIncome / totalRps) * 100).toFixed(1) : 0

  // 포맷팅
  const currency = t('ui.currency')
  const unit = t('ui.unit.property')
  const productName = getProductName(type)
  const perUnitAmount =
    Math.floor(baseRent * rentMultiplier).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
    currency
  const totalAmount =
    Math.floor(totalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') + currency
  const lifetimeAmount = NumberFormat.formatCashDisplayFixed1(lifetime, settings)
  const price = NumberFormat.formatPropertyPrice(cost)

  // 수량 업데이트
  const countEl = document.getElementById(ids.count)
  if (countEl) countEl.textContent = count

  // 상품 이름 업데이트
  const titleEl = document.querySelector(`#${ids.item} .title`)
  if (titleEl) titleEl.textContent = `${ids.icon} ${productName}`

  // 설명 업데이트
  const descEls = document.querySelectorAll(`#${ids.item} .desc`)
  if (descEls.length >= 4) {
    // 1. 각 부동산이 초당 X 생산
    const perUnitText = t('product.desc.perUnit', {
      product: productName,
      amount: perUnitAmount,
    })
    descEls[0].innerHTML = `• ${perUnitText.replace(perUnitAmount, `<b>${perUnitAmount}</b>`)}`

    // 2. N개 부동산이 초당 X 생산 (총 수익의 Y%)
    const totalText = t('product.desc.total', {
      count,
      unit,
      product: productName,
      amount: totalAmount,
      percent,
    })
    descEls[1].innerHTML = `• ${totalText.replace(totalAmount, `<b>${totalAmount}</b>`).replace(percent + '%', `<b>${percent}%</b>`)}`

    // 3. 지금까지 X 생산
    const lifetimeText = t('product.desc.lifetime', { amount: lifetimeAmount })
    descEls[2].innerHTML = `• ${lifetimeText.replace(lifetimeAmount, `<b>${lifetimeAmount}</b>`)}`

    // 4. 현재가: X
    const currentPriceText = t('product.desc.currentPrice', { price })
    descEls[3].innerHTML = currentPriceText.replace(price, `<b>${price}</b>`)
  }

  // 가격 업데이트
  const currentPriceEl = document.getElementById(ids.currentPrice)
  if (currentPriceEl) currentPriceEl.textContent = price
}

/**
 * 서울타워 UI 업데이트 (프레스티지 아이템)
 * @param {Object} params
 * @param {number} params.towersLifetime - 누적 타워 수
 * @param {number} params.purchaseMode - 구매/판매 모드 (항상 buy)
 */
export function updateTowerUI({ towersLifetime, purchaseMode }) {
  const towerName = getProductName('tower')
  const towerUnit = t('ui.unit.count')
  const towerPrice = NumberFormat.formatNumberForLang(1000000000000, getLang()) // 1조

  // 상품 이름 업데이트
  const towerTitleEl = document.querySelector('#towerItem .title')
  if (towerTitleEl) towerTitleEl.textContent = `🗼 ${towerName}`

  // 설명 업데이트
  const towerDescEls = document.querySelectorAll('#towerItem .desc')
  if (towerDescEls.length >= 2) {
    // 1. 설명
    const descText = t('product.tower.desc')
    towerDescEls[0].innerHTML = `• ${descText}`

    // 2. 누적 구매 횟수
    const lifetimeText = t('product.tower.lifetime', { count: towersLifetime })
    towerDescEls[1].innerHTML = `• ${lifetimeText.replace(String(towersLifetime), `<b>${towersLifetime}</b>`)}`
  }

  // 가격 업데이트 (항상 1조원 고정)
  const towerCurrentPriceEl = document.getElementById('towerCurrentPrice')
  if (towerCurrentPriceEl) {
    towerCurrentPriceEl.textContent = towerPrice
  }
}
