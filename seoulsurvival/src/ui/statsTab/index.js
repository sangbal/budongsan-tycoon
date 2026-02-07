/**
 * 통계 탭 렌더러 - 모듈화 버전
 * - 성장 추적, 도넛 차트, 효율 분석, 업적 그리드를 조율
 *
 * Phase 1.2: statsTab.js 분해 (1126줄 → 5개 모듈)
 */
import { t, getLang } from '../../i18n/index.js'
import * as NumberFormat from '../../utils/numberFormat.js'
import { gameState } from '../../state/gameState.js'

// 하위 모듈 import
import {
  resetGrowthTracking,
  loadGrowthTracking,
  saveGrowthTracking,
  updateGrowthTracking,
} from './growthTracking.js'
import { drawDonutChart } from './charts.js'
import {
  calculateEfficiencies,
  calculateFinancialValueForType,
  calculatePropertyValueForType,
  updateStatsLockStates,
} from './efficiency.js'
import { setAchievementScrollActive, updateAchievementGrid } from './statsAchievementGrid.js'

// 하위 모듈 re-export
export { resetGrowthTracking, loadGrowthTracking, saveGrowthTracking, setAchievementScrollActive }

/**
 * 통계 탭 전체 업데이트
 *
 * @param {{
 *  safeText:(el:Element|null, text:string)=>void,
 *  getRps:()=>number,
 *  getClickIncome:()=>number,
 *  calculateTotalAssetValue:()=>number,
 *  calculateFinancialValue:()=>number,
 *  calculatePropertyValue:()=>number,
 *  getFinancialCost:(type:string, index:number)=>number,
 *  getPropertyCost:(type:string, index:number)=>number,
 *  getProductName:(type:string)=>string,
 *  isProductUnlocked:(type:string)=>boolean,
 *  settings:object,
 *  ACHIEVEMENTS:object,
 *  now?:()=>number,
 * }} deps
 */
export function updateStatsTab(deps) {
  const { safeText, getRps, getClickIncome, settings, getFinancialCost, getPropertyCost } = deps
  const state = gameState
  const now = deps.now || Date.now

  try {
    // 1. 핵심 지표
    const totalAssets = state.cash + deps.calculateTotalAssetValue()
    const totalEarnings =
      state.depositsLifetime +
      state.savingsLifetime +
      state.bondsLifetime +
      state.usStocksLifetime +
      state.cryptosLifetime +
      state.villasLifetime +
      state.officetelsLifetime +
      state.apartmentsLifetime +
      state.shopsLifetime +
      state.buildingsLifetime +
      state.totalLaborIncome

    const totalAssetsEl = document.getElementById('totalAssets')
    const totalEarningsEl = document.getElementById('totalEarnings')

    if (!totalAssetsEl || !totalEarningsEl) {
      console.error(
        '[Stats] Critical elements not found! totalAssets:',
        totalAssetsEl,
        'totalEarnings:',
        totalEarningsEl
      )
      return
    }

    safeText(totalAssetsEl, NumberFormat.formatStatsNumber(totalAssets, settings))
    safeText(totalEarningsEl, NumberFormat.formatStatsNumber(totalEarnings, settings))

    // 통계 탭에서는 축약 표기/고정 소수점 규칙을 그대로 사용
    const perSecUnit = t('stats.unit.perSec')
    safeText(
      document.getElementById('rpsStats'),
      NumberFormat.formatCashDisplay(getRps(), settings) + perSecUnit
    )
    safeText(
      document.getElementById('clickIncomeStats'),
      NumberFormat.formatCashDisplay(getClickIncome(), settings)
    )

    // 2. 플레이 정보
    const timesUnit = t('stats.unit.times')
    const locale = getLang() === 'en' ? 'en-US' : 'ko-KR'
    safeText(
      document.getElementById('totalClicksStats'),
      state.totalClicks.toLocaleString(locale) + timesUnit
    )
    safeText(
      document.getElementById('laborIncomeStats'),
      NumberFormat.formatStatsNumber(state.totalLaborIncome, settings)
    )

    // 플레이 시간 계산 (누적 플레이시간 시스템)
    const currentSessionTime = now() - state.sessionStartTime
    const totalPlayTimeMs = state.totalPlayTime + currentSessionTime
    const playTimeMinutes = Math.floor(totalPlayTimeMs / 60000)
    const playTimeHours = Math.floor(playTimeMinutes / 60)
    const remainingMinutes = playTimeMinutes % 60
    const hourUnit = t('stats.unit.hour')
    const minuteUnit = t('stats.unit.minute')
    const playTimeText =
      playTimeHours > 0
        ? `${playTimeHours}${hourUnit} ${remainingMinutes}${minuteUnit}`
        : `${playTimeMinutes}${minuteUnit}`

    safeText(document.getElementById('playTimeStats'), playTimeText)

    // 시간당 수익
    const hourlyRateValue = playTimeMinutes > 0 ? (totalEarnings / playTimeMinutes) * 60 : 0
    const perHourUnit = t('stats.unit.perHour')
    safeText(
      document.getElementById('hourlyRate'),
      NumberFormat.formatCashDisplay(hourlyRateValue, settings) + perHourUnit
    )

    // 3. 수익 구조
    const laborPercent = totalEarnings > 0 ? (state.totalLaborIncome / totalEarnings) * 100 : 0
    const financialTotal =
      state.depositsLifetime +
      state.savingsLifetime +
      state.bondsLifetime +
      state.usStocksLifetime +
      state.cryptosLifetime
    const financialPercent = totalEarnings > 0 ? (financialTotal / totalEarnings) * 100 : 0
    const propertyTotal =
      state.villasLifetime +
      state.officetelsLifetime +
      state.apartmentsLifetime +
      state.shopsLifetime +
      state.buildingsLifetime
    const propertyPercent = totalEarnings > 0 ? (propertyTotal / totalEarnings) * 100 : 0

    // 수익 구조 바
    const incomeBar = document.querySelector('.income-bar')
    const laborSegment = document.getElementById('laborSegment')
    const financialSegment = document.getElementById('financialSegment')
    const propertySegment = document.getElementById('propertySegment')

    // 애니메이션 클래스 추가
    if (incomeBar && !incomeBar.classList.contains('animated')) {
      incomeBar.classList.add('animated')
    }

    if (laborSegment) {
      laborSegment.style.width = laborPercent.toFixed(1) + '%'
      const span = laborSegment.querySelector('span')
      if (span) {
        span.textContent = laborPercent >= 5 ? `🛠️ ${laborPercent.toFixed(1)}%` : ''
      }
    }

    if (financialSegment) {
      financialSegment.style.width = financialPercent.toFixed(1) + '%'
      const span = financialSegment.querySelector('span')
      if (span) {
        span.textContent = financialPercent >= 5 ? `💰 ${financialPercent.toFixed(1)}%` : ''
      }
    }

    if (propertySegment) {
      propertySegment.style.width = propertyPercent.toFixed(1) + '%'
      const span = propertySegment.querySelector('span')
      if (span) {
        span.textContent = propertyPercent >= 5 ? `🏢 ${propertyPercent.toFixed(1)}%` : ''
      }
    }

    // 범례 업데이트
    safeText(
      document.getElementById('laborLegend'),
      `${t('stats.labor')}: ${laborPercent.toFixed(1)}%`
    )
    safeText(
      document.getElementById('financialLegend'),
      `${t('stats.financial')}: ${financialPercent.toFixed(1)}%`
    )
    safeText(
      document.getElementById('propertyLegend'),
      `${t('stats.property')}: ${propertyPercent.toFixed(1)}%`
    )

    // 성장 추적 업데이트 (하위 모듈 호출)
    updateGrowthTracking(deps)

    // 도넛 차트 업데이트 (하위 모듈 호출)
    drawDonutChart(deps)

    // 4. 금융상품 상세 (수익 기여도 및 총 가치 추가)
    const totalEarningsForContribution = totalEarnings || 1

    // 통계 섹션 잠금 상태 업데이트 (하위 모듈 호출)
    updateStatsLockStates(deps)

    // 예금
    const countUnit = t('ui.unit.count')
    safeText(document.getElementById('depositsOwnedStats'), state.deposits + countUnit)
    safeText(
      document.getElementById('depositsLifetimeStats'),
      NumberFormat.formatStatsNumber(state.depositsLifetime, settings)
    )
    const depositsContribution =
      totalEarningsForContribution > 0
        ? ((state.depositsLifetime / totalEarningsForContribution) * 100).toFixed(1)
        : '0.0'
    safeText(document.getElementById('depositsContribution'), `(${depositsContribution}%)`)
    const depositsValue =
      state.deposits > 0
        ? calculateFinancialValueForType('deposit', state.deposits, getFinancialCost)
        : 0
    safeText(
      document.getElementById('depositsValue'),
      NumberFormat.formatKoreanNumber(depositsValue)
    )

    // 적금
    safeText(document.getElementById('savingsOwnedStats'), state.savings + countUnit)
    safeText(
      document.getElementById('savingsLifetimeStats'),
      NumberFormat.formatStatsNumber(state.savingsLifetime, settings)
    )
    const savingsContribution =
      totalEarningsForContribution > 0
        ? ((state.savingsLifetime / totalEarningsForContribution) * 100).toFixed(1)
        : '0.0'
    safeText(document.getElementById('savingsContribution'), `(${savingsContribution}%)`)
    const savingsValue =
      state.savings > 0
        ? calculateFinancialValueForType('savings', state.savings, getFinancialCost)
        : 0
    safeText(document.getElementById('savingsValue'), NumberFormat.formatKoreanNumber(savingsValue))

    // 주식
    safeText(document.getElementById('bondsOwnedStats'), state.bonds + countUnit)
    safeText(
      document.getElementById('bondsLifetimeStats'),
      NumberFormat.formatStatsNumber(state.bondsLifetime, settings)
    )
    const bondsContribution =
      totalEarningsForContribution > 0
        ? ((state.bondsLifetime / totalEarningsForContribution) * 100).toFixed(1)
        : '0.0'
    safeText(document.getElementById('bondsContribution'), `(${bondsContribution}%)`)
    const bondsValue =
      state.bonds > 0 ? calculateFinancialValueForType('bond', state.bonds, getFinancialCost) : 0
    safeText(document.getElementById('bondsValue'), NumberFormat.formatKoreanNumber(bondsValue))

    // 미국주식
    safeText(document.getElementById('usStocksOwnedStats'), state.usStocks + countUnit)
    safeText(
      document.getElementById('usStocksLifetimeStats'),
      NumberFormat.formatStatsNumber(state.usStocksLifetime, settings)
    )
    const usStocksContribution =
      totalEarningsForContribution > 0
        ? ((state.usStocksLifetime / totalEarningsForContribution) * 100).toFixed(1)
        : '0.0'
    safeText(document.getElementById('usStocksContribution'), `(${usStocksContribution}%)`)
    const usStocksValue =
      state.usStocks > 0
        ? calculateFinancialValueForType('usStock', state.usStocks, getFinancialCost)
        : 0
    safeText(
      document.getElementById('usStocksValue'),
      NumberFormat.formatKoreanNumber(usStocksValue)
    )

    // 코인
    safeText(document.getElementById('cryptosOwnedStats'), state.cryptos + countUnit)
    safeText(
      document.getElementById('cryptosLifetimeStats'),
      NumberFormat.formatStatsNumber(state.cryptosLifetime, settings)
    )
    const cryptosContribution =
      totalEarningsForContribution > 0
        ? ((state.cryptosLifetime / totalEarningsForContribution) * 100).toFixed(1)
        : '0.0'
    safeText(document.getElementById('cryptosContribution'), `(${cryptosContribution}%)`)
    const cryptosValue =
      state.cryptos > 0
        ? calculateFinancialValueForType('crypto', state.cryptos, getFinancialCost)
        : 0
    safeText(document.getElementById('cryptosValue'), NumberFormat.formatKoreanNumber(cryptosValue))

    // 5. 부동산 상세 (수익 기여도 및 총 가치 추가)
    // 빌라
    const propertyUnitForStats = t('ui.unit.property')
    safeText(document.getElementById('villasOwnedStats'), state.villas + propertyUnitForStats)
    safeText(
      document.getElementById('villasLifetimeStats'),
      NumberFormat.formatCashDisplay(state.villasLifetime, settings)
    )
    const villasContribution =
      totalEarningsForContribution > 0
        ? ((state.villasLifetime / totalEarningsForContribution) * 100).toFixed(1)
        : '0.0'
    safeText(document.getElementById('villasContribution'), `(${villasContribution}%)`)
    const villasValue =
      state.villas > 0 ? calculatePropertyValueForType('villa', state.villas, getPropertyCost) : 0
    safeText(
      document.getElementById('villasValue'),
      NumberFormat.formatCashDisplay(villasValue, settings)
    )

    // 오피스텔
    safeText(
      document.getElementById('officetelsOwnedStats'),
      state.officetels + propertyUnitForStats
    )
    safeText(
      document.getElementById('officetelsLifetimeStats'),
      NumberFormat.formatCashDisplay(state.officetelsLifetime, settings)
    )
    const officetelsContribution =
      totalEarningsForContribution > 0
        ? ((state.officetelsLifetime / totalEarningsForContribution) * 100).toFixed(1)
        : '0.0'
    safeText(document.getElementById('officetelsContribution'), `(${officetelsContribution}%)`)
    const officetelsValue =
      state.officetels > 0
        ? calculatePropertyValueForType('officetel', state.officetels, getPropertyCost)
        : 0
    safeText(
      document.getElementById('officetelsValue'),
      NumberFormat.formatCashDisplay(officetelsValue, settings)
    )

    // 아파트
    safeText(
      document.getElementById('apartmentsOwnedStats'),
      state.apartments + propertyUnitForStats
    )
    safeText(
      document.getElementById('apartmentsLifetimeStats'),
      NumberFormat.formatCashDisplay(state.apartmentsLifetime, settings)
    )
    const apartmentsContribution =
      totalEarningsForContribution > 0
        ? ((state.apartmentsLifetime / totalEarningsForContribution) * 100).toFixed(1)
        : '0.0'
    safeText(document.getElementById('apartmentsContribution'), `(${apartmentsContribution}%)`)
    const apartmentsValue =
      state.apartments > 0
        ? calculatePropertyValueForType('apartment', state.apartments, getPropertyCost)
        : 0
    safeText(
      document.getElementById('apartmentsValue'),
      NumberFormat.formatCashDisplay(apartmentsValue, settings)
    )

    // 상가
    safeText(document.getElementById('shopsOwnedStats'), state.shops + propertyUnitForStats)
    safeText(
      document.getElementById('shopsLifetimeStats'),
      NumberFormat.formatCashDisplay(state.shopsLifetime, settings)
    )
    const shopsContribution =
      totalEarningsForContribution > 0
        ? ((state.shopsLifetime / totalEarningsForContribution) * 100).toFixed(1)
        : '0.0'
    safeText(document.getElementById('shopsContribution'), `(${shopsContribution}%)`)
    const shopsValue =
      state.shops > 0 ? calculatePropertyValueForType('shop', state.shops, getPropertyCost) : 0
    safeText(
      document.getElementById('shopsValue'),
      NumberFormat.formatCashDisplay(shopsValue, settings)
    )

    // 빌딩
    const propertyUnit = t('ui.unit.property')
    safeText(document.getElementById('buildingsOwnedStats'), state.buildings + propertyUnit)
    safeText(
      document.getElementById('buildingsLifetimeStats'),
      NumberFormat.formatCashDisplay(state.buildingsLifetime, settings)
    )
    const buildingsContribution =
      totalEarningsForContribution > 0
        ? ((state.buildingsLifetime / totalEarningsForContribution) * 100).toFixed(1)
        : '0.0'
    safeText(document.getElementById('buildingsContribution'), `(${buildingsContribution}%)`)
    const buildingsValue =
      state.buildings > 0
        ? calculatePropertyValueForType('building', state.buildings, getPropertyCost)
        : 0
    safeText(
      document.getElementById('buildingsValue'),
      NumberFormat.formatCashDisplay(buildingsValue, settings)
    )

    // 6. 효율 분석 (하위 모듈 호출)
    const efficiencies = calculateEfficiencies(deps)
    safeText(document.getElementById('bestEfficiency'), efficiencies[0] || '-')
    safeText(document.getElementById('secondEfficiency'), efficiencies[1] || '-')
    safeText(document.getElementById('thirdEfficiency'), efficiencies[2] || '-')

    // 7. 업적 그리드 (하위 모듈 호출)
    updateAchievementGrid(deps)
  } catch (e) {
    console.error('[Stats] ❌ Stats tab update failed:', e)
    console.error('[Stats] Error stack:', e.stack)
    throw e
  }
}
