/**
 * 통계 탭 렌더러 - 확장 버전
 * - main.js의 통계 관련 함수들을 모두 통합
 * - 성장 추적, 도넛 차트, 효율 분석, 업적 그리드 포함
 */
import { t, getLang } from '../i18n/index.js'
import * as NumberFormat from '../utils/numberFormat.js'

// ======= 모듈 내부 상태 (성장 추적용) =======
let hourlyEarningsHistory = [] // 최근 1시간 수익 기록
let dailyEarningsHistory = [] // 최근 24시간 수익 기록
let lastEarningsSnapshot = 0 // 마지막 수익 스냅샷
let lastSnapshotTime = Date.now()

// 업적 스크롤 관련 플래그
let __achievementScrollActive = false
let __achievementUpdatePending = false
let __achievementScrollDebounceTimer = null

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
 * 업적 스크롤 활성화 상태 설정 (외부 이벤트 리스너에서 호출)
 */
export function setAchievementScrollActive(active) {
  __achievementScrollActive = active
}

// ======= 성장 추적 함수 =======
function updateGrowthTracking(deps) {
  const { state, settings, safeText } = deps
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

  // 1시간 이내 기록 유지
  hourlyEarningsHistory = hourlyEarningsHistory.filter(entry => now - entry.time < 3600000)
  // 24시간 이내 기록 유지
  dailyEarningsHistory = dailyEarningsHistory.filter(entry => now - entry.time < 86400000)

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

// ======= 도넛 차트 그리기 =======
function drawDonutChart(deps) {
  const { state, calculateFinancialValue, calculatePropertyValue, calculateTotalAssetValue } = deps

  const canvas = document.getElementById('assetDonutChart')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // DPR(레티나) 대응: 흐릿하게 보이는 문제 해결
  const baseSize = 200 // index.html의 canvas attribute와 동일한 논리 크기
  const dpr = Math.max(1, Math.floor((window.devicePixelRatio || 1) * 100) / 100)
  const target = Math.round(baseSize * dpr)
  if (canvas.width !== target || canvas.height !== target) {
    canvas.width = target
    canvas.height = target
    canvas.style.width = `${baseSize}px`
    canvas.style.height = `${baseSize}px`
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const centerX = baseSize / 2
  const centerY = baseSize / 2
  const radius = 80
  const innerRadius = 50

  // 자산 비율 계산
  const totalAssets = state.cash + calculateTotalAssetValue()
  const financialValue = calculateFinancialValue()
  const propertyValue = calculatePropertyValue()

  const cashPercent = totalAssets > 0 ? (state.cash / totalAssets) * 100 : 0
  const financialPercent = totalAssets > 0 ? (financialValue / totalAssets) * 100 : 0
  const propertyPercent = totalAssets > 0 ? (propertyValue / totalAssets) * 100 : 0

  // 배경 원
  ctx.clearRect(0, 0, baseSize, baseSize)
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
  ctx.fill()

  // 각 섹션 그리기
  let currentAngle = -Math.PI / 2

  // 현금
  if (cashPercent > 0) {
    const angle = (cashPercent / 100) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle)
    ctx.closePath()
    // 현금 컬러 = 노동 컬러(주황) + 더 또렷하게(그라데이션/경계선)
    const cashGrad = ctx.createLinearGradient(
      centerX - radius,
      centerY - radius,
      centerX + radius,
      centerY + radius
    )
    cashGrad.addColorStop(0, '#f59e0b')
    cashGrad.addColorStop(1, '#d97706')
    ctx.fillStyle = cashGrad
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)'
    ctx.stroke()
    currentAngle += angle
  }

  // 금융
  if (financialPercent > 0) {
    const angle = (financialPercent / 100) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle)
    ctx.closePath()
    ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'
    ctx.fill()
    currentAngle += angle
  }

  // 부동산
  if (propertyPercent > 0) {
    const angle = (propertyPercent / 100) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle)
    ctx.closePath()
    ctx.fillStyle = 'rgba(16, 185, 129, 0.5)'
    ctx.fill()
  }

  // 내부 원 (도넛 효과)
  ctx.beginPath()
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
  // canvas는 CSS var(--bg)를 직접 해석하지 못하므로 실제 색상값을 사용
  const bgColor =
    getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0b1220'
  ctx.fillStyle = bgColor
  ctx.fill()
}

// ======= 효율 분석 (ROI: 투자 대비 수익률) =======
function calculateEfficiencies(deps) {
  const {
    state,
    getProductName,
    FINANCIAL_INCOME,
    BASE_RENT,
    rentMultiplier,
    getFinancialCost,
    getPropertyCost,
  } = deps
  const assets = []

  // 금융상품 - ROI = (초당 수익 / 개당 평균 구매가) × 100
  if (state.deposits > 0) {
    const totalInvestment = calculateFinancialValueForType(
      'deposit',
      state.deposits,
      getFinancialCost
    )
    const avgCost = totalInvestment / state.deposits
    const incomePerSec = FINANCIAL_INCOME.deposit
    const roi = avgCost > 0 ? (incomePerSec / avgCost) * 100 : 0
    assets.push({
      name: getProductName('deposit'),
      roi,
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
    const roi = avgCost > 0 ? (incomePerSec / avgCost) * 100 : 0
    assets.push({
      name: getProductName('savings'),
      roi,
      count: state.savings,
    })
  }
  if (state.bonds > 0) {
    const totalInvestment = calculateFinancialValueForType('bond', state.bonds, getFinancialCost)
    const avgCost = totalInvestment / state.bonds
    const incomePerSec = FINANCIAL_INCOME.bond
    const roi = avgCost > 0 ? (incomePerSec / avgCost) * 100 : 0
    assets.push({
      name: getProductName('bond'),
      roi,
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
    const roi = avgCost > 0 ? (incomePerSec / avgCost) * 100 : 0
    assets.push({
      name: getProductName('usStock'),
      roi,
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
    const roi = avgCost > 0 ? (incomePerSec / avgCost) * 100 : 0
    assets.push({
      name: getProductName('crypto'),
      roi,
      count: state.cryptos,
    })
  }

  // 부동산 - ROI = (초당 수익 / 개당 평균 구매가) × 100
  if (state.villas > 0) {
    const totalInvestment = calculatePropertyValueForType('villa', state.villas, getPropertyCost)
    const avgCost = totalInvestment / state.villas
    const incomePerSec = BASE_RENT.villa * rentMultiplier
    const roi = avgCost > 0 ? (incomePerSec / avgCost) * 100 : 0
    assets.push({
      name: getProductName('villa'),
      roi,
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
    const roi = avgCost > 0 ? (incomePerSec / avgCost) * 100 : 0
    assets.push({
      name: getProductName('officetel'),
      roi,
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
    const roi = avgCost > 0 ? (incomePerSec / avgCost) * 100 : 0
    assets.push({
      name: getProductName('apartment'),
      roi,
      count: state.apartments,
    })
  }
  if (state.shops > 0) {
    const totalInvestment = calculatePropertyValueForType('shop', state.shops, getPropertyCost)
    const avgCost = totalInvestment / state.shops
    const incomePerSec = BASE_RENT.shop * rentMultiplier
    const roi = avgCost > 0 ? (incomePerSec / avgCost) * 100 : 0
    assets.push({
      name: getProductName('shop'),
      roi,
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
    const roi = avgCost > 0 ? (incomePerSec / avgCost) * 100 : 0
    assets.push({
      name: getProductName('building'),
      roi,
      count: state.buildings,
    })
  }

  // ROI 순으로 정렬 (높은 순)
  assets.sort((a, b) => b.roi - a.roi)

  // 상위 3개 반환
  const perSecUnit = t('stats.unit.perSec')
  return assets
    .slice(0, 3)
    .map(
      a =>
        `${a.name} (ROI ${a.roi.toFixed(4)}%${perSecUnit}, ${a.count}${t('ui.unit.count')} ${t('ui.owned')})`
    )
}

// ======= 업적 그리드 업데이트 =======
function updateAchievementGrid(deps) {
  const { ACHIEVEMENTS, safeText } = deps

  const achievementGrid = document.getElementById('achievementGrid')
  if (!achievementGrid) return

  // 스크롤 중이면 업데이트를 지연 (디바운스)
  const statsContent = achievementGrid.closest('.stats-content')
  if (statsContent && __achievementScrollActive) {
    __achievementUpdatePending = true
    if (__achievementScrollDebounceTimer) {
      clearTimeout(__achievementScrollDebounceTimer)
    }
    __achievementScrollDebounceTimer = setTimeout(() => {
      __achievementScrollActive = false
      if (__achievementUpdatePending) {
        __achievementUpdatePending = false
        updateAchievementGrid(deps)
      }
    }, 300) // 스크롤 종료 후 300ms 대기
    return
  }

  // ======= 업적 툴팁(포털) 시스템 =======
  // - 툴팁 DOM은 1개만 사용 (겹침/누수/overflow 문제 방지)
  // - 이벤트는 그리드에 위임
  if (!window.__achievementTooltipPortalInitialized) {
    window.__achievementTooltipPortalInitialized = true

    const ensureTooltipEl = () => {
      let el = document.getElementById('achievementTooltip')
      if (!el) {
        el = document.createElement('div')
        el.id = 'achievementTooltip'
        el.className = 'achievement-tooltip'
        el.setAttribute('role', 'tooltip')
        el.setAttribute('aria-hidden', 'true')
        document.body.appendChild(el)
      }
      return el
    }

    const getAchText = achId => {
      const ach = ACHIEVEMENTS.find(a => a.id === achId)
      if (!ach) return ''
      const achievementName = t(`achievement.${ach.id}.name`, {}, ach.name)
      const achievementDesc = t(`achievement.${ach.id}.desc`, {}, ach.desc)
      const statusText = ach.unlocked
        ? t('achievement.status.unlocked')
        : t('achievement.status.locked')
      return `${achievementName}\n${achievementDesc}\n${statusText}`
    }

    const hideTooltip = () => {
      const el = document.getElementById('achievementTooltip')
      if (!el) return
      el.classList.remove('active', 'bottom')
      el.style.left = ''
      el.style.top = ''
      el.style.bottom = ''
      el.style.opacity = ''
      el.style.visibility = ''
      el.style.pointerEvents = ''
      el.setAttribute('aria-hidden', 'true')
      window.__achievementTooltipAnchorId = null
    }

    const showTooltipForIcon = iconEl => {
      const el = ensureTooltipEl()
      const achId = iconEl?.dataset?.achievementId || iconEl?.id?.replace(/^ach_/, '')
      if (!achId) return

      // 동일 아이콘 재클릭: 토글
      if (window.__achievementTooltipAnchorId === achId && el.classList.contains('active')) {
        hideTooltip()
        return
      }

      // 항상 1개만 보이도록 초기화
      hideTooltip()

      el.textContent = getAchText(achId)
      el.setAttribute('aria-hidden', 'false')

      // 측정을 위해 "보이되 투명/비활성" 상태로 먼저 활성화
      el.classList.add('active')
      el.style.opacity = '0'
      el.style.visibility = 'hidden'
      el.style.pointerEvents = 'none'
      el.style.left = '0px'
      el.style.top = '0px'
      el.style.bottom = 'auto'

      // 크기 측정
      void el.offsetHeight
      const tooltipRect = el.getBoundingClientRect()

      const iconRect = iconEl.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // 아이콘 중앙 기준
      let left = iconRect.left + iconRect.width / 2
      let top = iconRect.top - tooltipRect.height - 8
      let showBelow = false

      if (top < 10) {
        top = iconRect.bottom + 8
        showBelow = true
      }
      if (top + tooltipRect.height > viewportHeight - 10) {
        top = viewportHeight - tooltipRect.height - 10
      }

      // 좌/우 경계
      if (left + tooltipRect.width / 2 > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width / 2 - 10
      }
      if (left - tooltipRect.width / 2 < 10) {
        left = tooltipRect.width / 2 + 10
      }

      el.style.left = `${left}px`
      el.style.top = `${top}px`
      el.style.bottom = 'auto'
      el.classList.toggle('bottom', showBelow)

      // 즉시 표시
      el.style.visibility = 'visible'
      el.style.opacity = '1'
      el.style.pointerEvents = 'none' // 요구사항: 아이콘에서 벗어나면 사라짐 (툴팁 상호작용 불필요)

      window.__achievementTooltipAnchorId = achId
    }

    // 클릭: 즉시 표시/토글
    achievementGrid.addEventListener('click', e => {
      const iconEl = e.target.closest('.achievement-icon')
      if (!iconEl) return
      e.stopPropagation()
      showTooltipForIcon(iconEl)
    })

    // 아이콘에서 커서가 벗어나면 닫기
    // mouseleave는 버블링이 없어 pointerout으로 위임 처리
    achievementGrid.addEventListener('pointerout', e => {
      const fromIcon = e.target.closest?.('.achievement-icon')
      if (!fromIcon) return
      // 아이콘 밖으로 나가는 순간 닫기 (요구사항)
      hideTooltip()
    })

    // 바깥 클릭/스크롤/탭 전환 등으로 정리
    document.addEventListener('click', () => hideTooltip(), true)
    window.addEventListener('scroll', () => hideTooltip(), true)
    window.addEventListener('resize', () => hideTooltip(), true)
  }

  // 이미 생성되어 있으면 상태만 업데이트 시도 (깜빡임 방지)
  if (achievementGrid.children.length > 0) {
    let unlockedCount = 0
    let hasChanges = false

    Object.values(ACHIEVEMENTS).forEach(ach => {
      const icon = document.getElementById('ach_' + ach.id)
      if (!icon) {
        hasChanges = true // 아이콘이 없으면 재생성 필요
        return
      }

      const wasUnlocked = icon.classList.contains('unlocked')
      const isUnlocked = ach.unlocked

      // 상태가 변경된 경우에만 DOM 조작 (깜빡임 최소화)
      if (wasUnlocked !== isUnlocked) {
        hasChanges = true
        if (isUnlocked) {
          icon.classList.add('unlocked')
          icon.classList.remove('locked')
        } else {
          icon.classList.add('locked')
          icon.classList.remove('unlocked')
        }
      }

      if (isUnlocked) {
        unlockedCount++
      }

      // 네이티브 title은 항상 최신으로 유지 (툴팁 대체/접근성)
      const achievementName = t(`achievement.${ach.id}.name`, {}, ach.name)
      const achievementDesc = t(`achievement.${ach.id}.desc`, {}, ach.desc)
      const statusText = isUnlocked
        ? t('achievement.status.unlocked')
        : t('achievement.status.locked')
      const newTitle = `${achievementName}\n${achievementDesc}\n${statusText}`

      // title이 변경된 경우에만 업데이트 (불필요한 DOM 조작 방지)
      if (icon.title !== newTitle) {
        icon.title = newTitle
      }
    })

    const totalAchievements = Object.keys(ACHIEVEMENTS).length
    const progressEl = document.getElementById('achievementProgress')
    if (progressEl) {
      const newProgressText = `${unlockedCount}/${totalAchievements}`
      if (progressEl.textContent !== newProgressText) {
        safeText(progressEl, newProgressText)
      }
    }

    // 변경사항이 없으면 재렌더링 스킵 (깜빡임 방지)
    if (!hasChanges) {
      return
    }
  }

  // 여기까지 왔다는 것은:
  // - 그리드가 비어 있거나(children.length === 0)
  // - 또는 hasChanges=true로 "재생성 필요"가 감지된 경우
  // 항상 클린 상태에서 다시 그리도록 전체 초기화
  achievementGrid.innerHTML = ''
  let unlockedCount = 0
  const totalAchievements = Object.keys(ACHIEVEMENTS).length

  Object.values(ACHIEVEMENTS).forEach(ach => {
    const icon = document.createElement('div')
    icon.className = 'achievement-icon'
    icon.id = 'ach_' + ach.id
    icon.dataset.achievementId = ach.id
    icon.textContent = ach.icon
    const achievementName = t(`achievement.${ach.id}.name`, {}, ach.name)
    const achievementDesc = t(`achievement.${ach.id}.desc`, {}, ach.desc)
    const statusText = ach.unlocked
      ? t('achievement.status.unlocked')
      : t('achievement.status.locked')
    icon.title = `${achievementName}\n${achievementDesc}\n${statusText}`

    if (ach.unlocked) {
      icon.classList.add('unlocked')
      unlockedCount++
    } else {
      icon.classList.add('locked')
    }

    achievementGrid.appendChild(icon)
  })

  safeText(document.getElementById('achievementProgress'), `${unlockedCount}/${totalAchievements}`)
}

// ======= 통계 섹션 잠금 상태 업데이트 =======
function updateStatsLockStates(deps) {
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

// ======= 금융상품 타입별 가치 계산 =======
function calculateFinancialValueForType(type, count, getFinancialCost) {
  let value = 0
  for (let i = 0; i < count; i++) {
    value += getFinancialCost(type, i)
  }
  return value
}

// ======= 부동산 타입별 가치 계산 =======
function calculatePropertyValueForType(type, count, getPropertyCost) {
  let value = 0
  for (let i = 0; i < count; i++) {
    value += getPropertyCost(type, i)
  }
  return value
}

/**
 * 통계 탭 전체 업데이트 (확장 버전)
 * - 성장 추적, 도넛 차트, 상세 통계, 효율 분석, 업적 그리드 포함
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
 *  state:object,
 *  settings:object,
 *  ACHIEVEMENTS:object,
 *  FINANCIAL_INCOME:object,
 *  BASE_RENT:object,
 *  rentMultiplier:number,
 *  now?:()=>number,
 * }} deps
 */
export function updateStatsTab(deps) {
  const { safeText, getRps, getClickIncome, state, settings, getFinancialCost, getPropertyCost } =
    deps
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

    // 성장 추적 업데이트
    updateGrowthTracking(deps)

    // 도넛 차트 업데이트
    drawDonutChart(deps)

    // 4. 금융상품 상세 (수익 기여도 및 총 가치 추가)
    const totalEarningsForContribution = totalEarnings || 1

    // 통계 섹션 잠금 상태 업데이트
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

    // 6. 효율 분석
    const efficiencies = calculateEfficiencies(deps)
    safeText(document.getElementById('bestEfficiency'), efficiencies[0] || '-')
    safeText(document.getElementById('secondEfficiency'), efficiencies[1] || '-')
    safeText(document.getElementById('thirdEfficiency'), efficiencies[2] || '-')

    // 7. 업적 그리드
    updateAchievementGrid(deps)

    // 8. 빌드 시너지 업데이트 (main.js의 updateSynergyDisplay 호출이 필요한 경우)
    // updateSynergyDisplay() // 현재 main.js에 이 함수가 없음

    // 9. 리더보드는 통계 탭이 활성화될 때만 업데이트 (updateUI에서 매번 호출하지 않음)
    // 리더보드 업데이트는 navBtns 이벤트 리스너에서 처리
  } catch (e) {
    console.error('[Stats] ❌ Stats tab update failed:', e)
    console.error('[Stats] Error stack:', e.stack)
    // Re-throw to make error visible in console
    throw e
  }
}
