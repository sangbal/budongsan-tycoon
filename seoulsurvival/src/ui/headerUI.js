/**
 * headerUI.js
 * 게임 헤더 UI 업데이트 전용 모듈
 * main.js의 updateUI() 함수에서 분리
 */

import { t, getLang } from '../i18n/index.js'
import * as NumberFormat from '../utils/numberFormat.js'
import { FINANCIAL_INCOME, BASE_RENT } from '../state/gameState.js'
import { getProductName } from './productUI.js'

/**
 * 현금 표시 업데이트
 * @param {number} cash - 현재 현금
 * @param {Object} settings - 게임 설정
 */
export function updateCashDisplay(cash, settings) {
  const elCash = document.getElementById('cash')
  if (elCash) {
    elCash.textContent = NumberFormat.formatHeaderCash(cash, settings)
  }
}

/**
 * 금융상품 집계 표시 업데이트
 * @param {Object} counts - 금융상품 보유 수량 {deposits, savings, bonds, usStocks, cryptos}
 */
export function updateFinancialChip(counts) {
  const { deposits, savings, bonds, usStocks, cryptos } = counts
  const total = deposits + savings + bonds + usStocks + cryptos

  const elFinancial = document.getElementById('financial')
  if (elFinancial) {
    elFinancial.textContent = NumberFormat.formatNumberForLang(total)
  }

  // 툴팁 업데이트
  const financialChip = document.getElementById('financialChip')
  if (financialChip) {
    const countUnit = t('ui.unit.count')
    const tooltip = `${getProductName('deposit')}: ${deposits}${countUnit}\n${getProductName('savings')}: ${savings}${countUnit}\n${getProductName('bond')}: ${bonds}${countUnit}\n${getProductName('usStock')}: ${usStocks}${countUnit}\n${getProductName('crypto')}: ${cryptos}${countUnit}`
    financialChip.setAttribute('title', tooltip)
  }
}

/**
 * 부동산 집계 표시 업데이트
 * @param {Object} counts - 부동산 보유 수량 {villas, officetels, apartments, shops, buildings}
 */
export function updatePropertyChip(counts) {
  const { villas, officetels, apartments, shops, buildings } = counts
  const total = villas + officetels + apartments + shops + buildings

  const elProperties = document.getElementById('properties')
  if (elProperties) {
    elProperties.textContent = NumberFormat.formatNumberForLang(total)
  }

  // 툴팁 업데이트
  const propertyChip = document.getElementById('propertyChip')
  if (propertyChip) {
    const propertyUnit = t('ui.unit.property')
    const tooltip = `${getProductName('villa')}: ${villas}${propertyUnit}\n${getProductName('officetel')}: ${officetels}${propertyUnit}\n${getProductName('apartment')}: ${apartments}${propertyUnit}\n${getProductName('shop')}: ${shops}${propertyUnit}\n${getProductName('building')}: ${buildings}${propertyUnit}`
    propertyChip.setAttribute('title', tooltip)
  }
}

/**
 * 타워 배지 업데이트
 * @param {number} towersLifetime - 누적 타워 수
 */
export function updateTowerBadge(towersLifetime) {
  const towerBadge = document.getElementById('towerBadge')
  const towerCountHeader = document.getElementById('towerCountHeader')

  if (towerBadge && towerCountHeader) {
    if (towersLifetime > 0) {
      towerBadge.style.display = 'flex'
      towerCountHeader.textContent = towersLifetime
    } else {
      towerBadge.style.display = 'none'
    }
  }
}

/**
 * 초당 수익 표시 업데이트
 * @param {Object} params
 * @param {number} params.rps - 초당 수익
 * @param {Object} params.counts - 상품 보유 수량
 * @param {number} params.rentMultiplier - 임대 배수
 * @param {number} params.marketMultiplier - 시장 배수
 * @param {Object} params.settings - 게임 설정
 */
export function updateRpsChip({ rps, counts, rentMultiplier, marketMultiplier, settings }) {
  const { deposits, savings, bonds, villas, officetels, apartments, shops, buildings } = counts

  const elRps = document.getElementById('rps')
  if (elRps) {
    elRps.textContent = NumberFormat.formatHeaderCash(rps, settings)
  }

  // 툴팁 업데이트 (금융 수익 / 부동산 수익 / 시장 배수)
  const rpsChip = document.getElementById('rpsChip')
  if (rpsChip) {
    const financialIncome =
      deposits * FINANCIAL_INCOME.deposit +
      savings * FINANCIAL_INCOME.savings +
      bonds * FINANCIAL_INCOME.bond

    const propertyIncome =
      (villas * BASE_RENT.villa +
        officetels * BASE_RENT.officetel +
        apartments * BASE_RENT.apartment +
        shops * BASE_RENT.shop +
        buildings * BASE_RENT.building) *
      rentMultiplier

    const financialIncomeFormatted =
      NumberFormat.formatNumberForLang(financialIncome) + t('ui.currency') + '/s'
    const propertyIncomeFormatted =
      NumberFormat.formatNumberForLang(propertyIncome) + t('ui.currency') + '/s'

    const tooltip = `${t('header.tooltip.financialIncome', { amount: financialIncomeFormatted })}\n${t('header.tooltip.propertyIncome', { amount: propertyIncomeFormatted })}\n${t('header.tooltip.marketMultiplier', { multiplier: marketMultiplier })}`
    rpsChip.setAttribute('title', tooltip)
  }
}

/**
 * 배수 표시 업데이트
 * @param {number} clickMultiplier - 클릭 배수
 * @param {number} rentMultiplier - 임대 배수
 */
export function updateMultipliers(clickMultiplier, rentMultiplier) {
  const elClickMultiplier = document.getElementById('clickMultiplier')
  if (elClickMultiplier) {
    elClickMultiplier.textContent = clickMultiplier.toFixed(1)
  }

  const elRentMultiplier = document.getElementById('rentMultiplier')
  if (elRentMultiplier) {
    elRentMultiplier.textContent = rentMultiplier.toFixed(1)
  }
}

/**
 * 게임 버전 표시 업데이트
 * @param {string} version - 게임 버전
 */
export function updateGameVersion(version) {
  const gameVersionDisplay = document.getElementById('gameVersionDisplay')
  if (gameVersionDisplay) {
    gameVersionDisplay.textContent = `v${version}`
  }
}

/**
 * 일기장 헤더 메타 업데이트 (날짜 및 N일차)
 * @param {number} gameStartTime - 게임 시작 시간 (timestamp)
 * @param {number} sessionStartTime - 세션 시작 시간 (timestamp)
 */
export function updateDiaryHeaderMeta(gameStartTime, sessionStartTime) {
  const elCompact = document.getElementById('diaryHeaderMeta')
  if (elCompact) {
    const pad2 = n => String(n).padStart(2, '0')
    const now = new Date()
    const y = now.getFullYear()
    const m = pad2(now.getMonth() + 1)
    const d = pad2(now.getDate())
    const base =
      typeof gameStartTime !== 'undefined' && gameStartTime ? gameStartTime : sessionStartTime
    const days = Math.max(1, Math.floor((Date.now() - base) / 86400000) + 1)
    elCompact.textContent = `${y}.${m}.${d}(${t('ui.dayCount', { days })})`
  }
}
