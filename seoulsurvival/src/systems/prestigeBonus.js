/**
 * Seoul Survival - Prestige Bonus System
 *
 * 프레스티지 보너스 시스템
 * - 타워 보유 시 영구 배수 제공
 * - 장기 진행 동기 부여
 * - 4단계 티어 시스템 (1/3/5/10 타워)
 */

import { gameState } from '../state/gameState.js'

/**
 * 프레스티지 보너스 정의 (10종)
 *
 * Tier 1: 기본 보너스 (타워 1+)
 * Tier 2: 중급 보너스 (타워 3+)
 * Tier 3: 고급 보너스 (타워 5+)
 * Tier 4: 엔드게임 보너스 (타워 10+)
 */
export const PRESTIGE_BONUSES = [
  // ===== Tier 1: 기본 보너스 (타워 1+) =====
  {
    id: 'click_master',
    nameKey: 'prestige.clickMaster.name',
    descKey: 'prestige.clickMaster.desc',
    minTowers: 1,
    tier: 1,
    icon: '👆',
    /**
     * 클릭 마스터: 타워당 클릭 파워 +10%
     * 타워 1개: 1.1배, 타워 3개: 1.3배, 타워 5개: 1.5배
     */
    effect: towers => ({
      type: 'click_power',
      multiplier: 1 + towers * 0.1,
    }),
  },
  {
    id: 'auto_income_boost',
    nameKey: 'prestige.autoIncomeBoost.name',
    descKey: 'prestige.autoIncomeBoost.desc',
    minTowers: 1,
    tier: 1,
    icon: '🤖',
    /**
     * 자동 수익 강화: 타워당 자동 수익 +5%
     * 타워 1개: 1.05배, 타워 5개: 1.25배, 타워 10개: 1.5배
     */
    effect: towers => ({
      type: 'auto_income',
      multiplier: 1 + towers * 0.05,
    }),
  },
  {
    id: 'discount_master',
    nameKey: 'prestige.discountMaster.name',
    descKey: 'prestige.discountMaster.desc',
    minTowers: 1,
    tier: 1,
    icon: '💸',
    /**
     * 할인 전문가: 타워당 모든 가격 -2%
     * 타워 1개: 0.98배, 타워 5개: 0.9배, 타워 10개: 0.8배
     * 최소 0.5배로 제한 (50% 할인 상한)
     */
    effect: towers => ({
      type: 'price_reduction',
      multiplier: Math.max(0.5, 1 - towers * 0.02),
    }),
  },
  {
    id: 'starting_capital',
    nameKey: 'prestige.startingCapital.name',
    descKey: 'prestige.startingCapital.desc',
    minTowers: 1,
    tier: 1,
    icon: '💰',
    /**
     * 스타트 자금: 타워당 시작 자금 +100만원
     * 타워 1개: +100만, 타워 5개: +500만, 타워 10개: +1000만
     */
    effect: towers => ({
      type: 'starting_cash',
      amount: towers * 1_000_000,
    }),
  },

  // ===== Tier 2: 중급 보너스 (타워 3+) =====
  {
    id: 'upgrade_power',
    nameKey: 'prestige.upgradePower.name',
    descKey: 'prestige.upgradePower.desc',
    minTowers: 3,
    tier: 2,
    icon: '⚡',
    /**
     * 업그레이드 강화: 모든 업그레이드 효과 +20%
     * 타워 3개: 1.2배, 타워 5개: 1.4배, 타워 10개: 1.9배
     */
    effect: towers => ({
      type: 'upgrade_multiplier',
      multiplier: 1 + (towers - 2) * 0.2,
    }),
  },
  {
    id: 'offline_boost',
    nameKey: 'prestige.offlineBoost.name',
    descKey: 'prestige.offlineBoost.desc',
    minTowers: 3,
    tier: 2,
    icon: '⏰',
    /**
     * 오프라인 수익: 오프라인 계산 시간 +50%
     * 기본 6시간 → 타워 3개: 9시간, 타워 5개: 12시간
     */
    effect: towers => ({
      type: 'offline_time',
      multiplier: 1 + (towers - 2) * 0.5,
    }),
  },

  // ===== Tier 3: 고급 보너스 (타워 5+) =====
  {
    id: 'special_upgrades',
    nameKey: 'prestige.specialUpgrades.name',
    descKey: 'prestige.specialUpgrades.desc',
    minTowers: 5,
    tier: 3,
    icon: '🎁',
    /**
     * 특수 업그레이드: 프레스티지 전용 업그레이드 해금
     * TODO: 향후 특수 업그레이드 시스템과 연계
     */
    effect: towers => ({
      type: 'unlock_special',
      enabled: true,
    }),
  },
  {
    id: 'synergy_master',
    nameKey: 'prestige.synergyMaster.name',
    descKey: 'prestige.synergyMaster.desc',
    minTowers: 5,
    tier: 3,
    icon: '🔗',
    /**
     * 시너지 전문가: 모든 시너지 효과 +25%
     * TODO: 빌드 시너지 시스템과 연계
     */
    effect: towers => ({
      type: 'synergy_boost',
      multiplier: 1.25,
    }),
  },

  // ===== Tier 4: 엔드게임 보너스 (타워 10+) =====
  {
    id: 'time_warp',
    nameKey: 'prestige.timeWarp.name',
    descKey: 'prestige.timeWarp.desc',
    minTowers: 10,
    tier: 4,
    icon: '⏩',
    /**
     * 시간 왜곡: 게임 틱 속도 +10%
     * 게임 진행 속도 향상 (극후반 편의 기능)
     */
    effect: towers => ({
      type: 'tick_speed',
      multiplier: 1 + (towers - 9) * 0.1,
    }),
  },
  {
    id: 'ultimate_power',
    nameKey: 'prestige.ultimatePower.name',
    descKey: 'prestige.ultimatePower.desc',
    minTowers: 10,
    tier: 4,
    icon: '⭐',
    /**
     * 궁극의 힘: 모든 수익 x1.5
     * 타워 10개: 1.5배, 타워 15개: 2.0배, 타워 20개: 2.5배
     */
    effect: towers => ({
      type: 'all_income',
      multiplier: 1 + (towers - 9) * 0.5,
    }),
  },
]

/**
 * 활성화된 프레스티지 보너스 목록 반환
 * @returns {Array} 활성화된 보너스 배열 (효과 포함)
 */
export function getActivePrestigeBonuses() {
  const towers = gameState.towers_lifetime
  return PRESTIGE_BONUSES.filter(bonus => towers >= bonus.minTowers).map(bonus => ({
    ...bonus,
    effectValue: bonus.effect(towers),
  }))
}

/**
 * 특정 타입의 프레스티지 배수 계산
 * @param {string} type - 효과 타입 ('click_power', 'auto_income', 'all_income', etc.)
 * @returns {number} 배수 (기본값: 1.0)
 */
export function getPrestigeMultiplier(type) {
  const active = getActivePrestigeBonuses()
  let multiplier = 1.0

  for (const bonus of active) {
    if (bonus.effectValue.type === type) {
      multiplier *= bonus.effectValue.multiplier || 1.0
    }
  }

  return multiplier
}

/**
 * 모든 프레스티지 배수를 객체로 반환
 * @returns {Object} 효과 타입별 배수 맵
 */
export function getAllPrestigeMultipliers() {
  const towers = gameState.towers_lifetime
  const multipliers = {
    click_power: 1.0,
    auto_income: 1.0,
    price_reduction: 1.0,
    starting_cash: 0,
    upgrade_multiplier: 1.0,
    offline_time: 1.0,
    unlock_special: false,
    synergy_boost: 1.0,
    tick_speed: 1.0,
    all_income: 1.0,
  }

  const active = getActivePrestigeBonuses()

  for (const bonus of active) {
    const { type, multiplier, amount, enabled } = bonus.effectValue

    switch (type) {
      case 'starting_cash':
        multipliers.starting_cash += amount || 0
        break
      case 'unlock_special':
        multipliers.unlock_special = enabled || false
        break
      default:
        // 곱연산 배수
        if (multipliers[type] !== undefined && multiplier !== undefined) {
          multipliers[type] *= multiplier
        }
        break
    }
  }

  return multipliers
}

/**
 * 시작 자금 계산 (프레스티지 보너스 적용)
 * @returns {number} 시작 자금
 */
export function getStartingCash() {
  const multipliers = getAllPrestigeMultipliers()
  return multipliers.starting_cash
}

/**
 * 티어별 보너스 목록 반환 (UI용)
 * @returns {Object} 티어별 보너스 맵 { tier1: [...], tier2: [...], ... }
 */
export function getBonusesByTier() {
  return {
    tier1: PRESTIGE_BONUSES.filter(b => b.tier === 1),
    tier2: PRESTIGE_BONUSES.filter(b => b.tier === 2),
    tier3: PRESTIGE_BONUSES.filter(b => b.tier === 3),
    tier4: PRESTIGE_BONUSES.filter(b => b.tier === 4),
  }
}

/**
 * 프레스티지 보너스 정보 텍스트 생성 (통계 탭용)
 * @param {Function} t - i18n 번역 함수
 * @param {Function} formatNumber - 숫자 포맷 함수
 * @returns {string} HTML 문자열
 */
export function getPrestigeBonusInfoHTML(t, formatNumber) {
  const active = getActivePrestigeBonuses()
  const towers = gameState.towers_lifetime

  if (towers === 0) {
    return `<p class="prestige-hint">${t('prestige.hint.none', {}, 'Prestige bonuses will activate when you acquire your first tower.')}</p>`
  }

  const lines = active.map(bonus => {
    const { effectValue } = bonus
    let effectText = ''

    switch (effectValue.type) {
      case 'click_power':
        effectText = `x${effectValue.multiplier.toFixed(2)}`
        break
      case 'auto_income':
        effectText = `x${effectValue.multiplier.toFixed(2)}`
        break
      case 'price_reduction':
        effectText = `x${effectValue.multiplier.toFixed(2)} (${((1 - effectValue.multiplier) * 100).toFixed(0)}% ${t('prestige.discount', {}, 'discount')})`
        break
      case 'starting_cash':
        effectText = `+${formatNumber(effectValue.amount)}`
        break
      case 'upgrade_multiplier':
        effectText = `x${effectValue.multiplier.toFixed(2)}`
        break
      case 'offline_time':
        effectText = `x${effectValue.multiplier.toFixed(2)}`
        break
      case 'unlock_special':
        effectText = t('prestige.effect.unlocked', {}, 'Unlocked')
        break
      case 'synergy_boost':
        effectText = `+${((effectValue.multiplier - 1) * 100).toFixed(0)}%`
        break
      case 'tick_speed':
        effectText = `x${effectValue.multiplier.toFixed(2)}`
        break
      case 'all_income':
        effectText = `x${effectValue.multiplier.toFixed(2)}`
        break
      default:
        effectText = t('prestige.effect.active', {}, 'Active')
    }

    return `
      <div class="prestige-bonus-item tier-${bonus.tier}">
        <span class="bonus-icon">${bonus.icon}</span>
        <span class="bonus-name">${t(bonus.nameKey)}</span>
        <span class="bonus-effect">${effectText}</span>
      </div>
    `
  })

  return `
    <div class="prestige-bonus-list">
      <h4>${t('prestige.title', {}, '프레스티지 보너스')} (${towers}🗼)</h4>
      ${lines.join('')}
    </div>
  `
}
