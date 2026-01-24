/**
 * 성장 추적 모듈
 * - 시간별 수익 기록 및 성장률 계산
 * - 마일스톤 추적
 */
import { t } from '../../i18n/index.js'
import * as NumberFormat from '../../utils/numberFormat.js'
import { gameState } from '../../state/gameState.js'

// ======= 모듈 내부 상태 =======
let hourlyEarningsHistory = [] // 최근 1시간 수익 기록
let dailyEarningsHistory = [] // 최근 24시간 수익 기록
let lastEarningsSnapshot = 0 // 마지막 수익 스냅샷
let lastSnapshotTime = Date.now()

/**
 * 성장 추적 상태 초기화 (게임 리셋 시 호출)
 */
export function resetGrowthTracking() {
  hourlyEarningsHistory = []
  dailyEarningsHistory = []
  lastEarningsSnapshot = 0
  lastSnapshotTime = Date.now()
}

/**
 * 성장 추적 상태 로드 (세이브 파일에서 복원)
 */
export function loadGrowthTracking(savedData) {
  if (savedData) {
    hourlyEarningsHistory = savedData.hourlyEarningsHistory || []
    dailyEarningsHistory = savedData.dailyEarningsHistory || []
    lastEarningsSnapshot = savedData.lastEarningsSnapshot || 0
    lastSnapshotTime = savedData.lastSnapshotTime || Date.now()
  }
}

/**
 * 성장 추적 상태 저장 (세이브 파일에 포함)
 */
export function saveGrowthTracking() {
  return {
    hourlyEarningsHistory,
    dailyEarningsHistory,
    lastEarningsSnapshot,
    lastSnapshotTime,
  }
}

/**
 * 성장 추적 UI 업데이트
 * @param {{settings: object, safeText: Function}} deps
 */
export function updateGrowthTracking(deps) {
  const { settings, safeText } = deps
  const state = gameState
  const now = Date.now()
  const currentEarnings =
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

  // 1시간 이내 기록 유지 (최대 60개)
  hourlyEarningsHistory = hourlyEarningsHistory.filter(entry => now - entry.time < 3600000)
  if (hourlyEarningsHistory.length > 60) {
    hourlyEarningsHistory = hourlyEarningsHistory.slice(-60)
  }
  // 24시간 이내 기록 유지 (최대 1440개)
  dailyEarningsHistory = dailyEarningsHistory.filter(entry => now - entry.time < 86400000)
  if (dailyEarningsHistory.length > 1440) {
    dailyEarningsHistory = dailyEarningsHistory.slice(-1440)
  }

  // 1분마다 스냅샷 저장
  if (now - lastSnapshotTime >= 60000) {
    hourlyEarningsHistory.push({ time: now, earnings: currentEarnings })
    dailyEarningsHistory.push({ time: now, earnings: currentEarnings })
    lastSnapshotTime = now
  }

  // 최근 1시간 수익 계산
  const hourlyEarnings =
    hourlyEarningsHistory.length > 0 ? currentEarnings - hourlyEarningsHistory[0].earnings : 0

  // 최근 24시간 수익 계산
  const dailyEarnings =
    dailyEarningsHistory.length > 0 ? currentEarnings - dailyEarningsHistory[0].earnings : 0

  // 성장 속도 계산 (시간당 증가율)
  const growthRate =
    lastEarningsSnapshot > 0 && now - lastSnapshotTime > 0
      ? ((currentEarnings - lastEarningsSnapshot) / lastEarningsSnapshot) *
        (3600000 / (now - lastSnapshotTime)) *
        100
      : 0

  // 마일스톤 계산
  const milestones = [1000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000]
  const maxAchievedText = t('stats.maxAchieved')
  let nextMilestone = milestones.find(m => m > currentEarnings) || maxAchievedText
  if (nextMilestone !== maxAchievedText) {
    const remaining = nextMilestone - currentEarnings
    const remainingText = t('stats.remaining', {
      amount: NumberFormat.formatStatsNumber(remaining, settings),
    })
    nextMilestone = remainingText
  }

  // UI 업데이트
  safeText(
    document.getElementById('hourlyEarnings'),
    NumberFormat.formatCashDisplay(Math.max(0, hourlyEarnings), settings)
  )
  safeText(
    document.getElementById('dailyEarnings'),
    NumberFormat.formatCashDisplay(Math.max(0, dailyEarnings), settings)
  )
  // "+0.0%/시간" 처럼 소수점 1자리 고정 + -0.0 방지
  const growthRateStable = Math.abs(growthRate) < 0.05 ? 0 : growthRate
  const perHourUnitForGrowth = t('stats.unit.perHour')
  safeText(
    document.getElementById('growthRate'),
    `${growthRateStable >= 0 ? '+' : ''}${growthRateStable.toFixed(1)}%${perHourUnitForGrowth}`
  )
  safeText(document.getElementById('nextMilestone'), nextMilestone)

  lastEarningsSnapshot = currentEarnings
}
