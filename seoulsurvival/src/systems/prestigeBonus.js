/**
 * Seoul Survival - Prestige Bonus System (v2.0)
 *
 * 경력 포인트(CP) 기반 프레스티지 시스템
 * - 타워 획득 시 CP 지급
 * - CP로 20종 업그레이드 구매
 * - 7개 카테고리 (기본/금융/부동산/클릭/시작가속/영구슬롯/게임변경)
 * - 빌드 다양성 제공 (금융특화, 부동산특화, 클릭특화, 스피드런)
 */

import { gameState } from '../state/gameState.js'

/**
 * CP 계산 공식
 * CP = floor(sqrt(towers_lifetime) × 2) × (1 + log10(lifetime_earnings / 1조)) + 첫타워보너스
 *
 * v2.1: 밸런스 조정 - 초반 프레스티지 가치 향상을 위해 기본 CP ×2
 * v2.2: 첫 타워 보너스 +5 CP 추가 (프레스티지 동기부여 강화)
 *
 * @param {number} towersLifetime - 누적 타워 수
 * @param {number} lifetimeEarnings - 누적 수익
 * @returns {number} 획득할 CP
 */
export function calculateCP(towersLifetime, lifetimeEarnings) {
  if (towersLifetime <= 0) return 0

  // 첫 타워 보너스: +5 CP (프레스티지 후 의미 있는 빌드 가능)
  const firstTowerBonus = towersLifetime >= 1 ? 5 : 0

  const baseCp = Math.floor(Math.sqrt(towersLifetime) * 2)
  const earningsBonus = lifetimeEarnings > 1e12 ? Math.log10(lifetimeEarnings / 1e12) : 0

  return Math.max(1, Math.floor(baseCp * (1 + earningsBonus))) + firstTowerBonus
}

/**
 * 구매한 업그레이드에 사용된 총 CP 계산
 * @returns {number} 총 사용 CP
 */
export function getTotalSpentCP() {
  let total = 0
  for (const upgradeId of gameState.purchasedUpgrades || []) {
    const upgrade = PRESTIGE_UPGRADES.find(u => u.id === upgradeId)
    if (upgrade) {
      total += upgrade.cost
    }
  }
  return total
}

/**
 * CP 보유 보너스 배수 계산
 * 보유 CP + 사용된 CP 모두 카운트 (소비 페널티 없음)
 * 1 CP = +2% 수익 보너스
 *
 * @returns {number} 보너스 배수 (예: 1.2 = +20%)
 */
export function getCPBonusMultiplier() {
  const cp = gameState.careerPoints || 0
  const spentCP = getTotalSpentCP()
  const totalCP = cp + spentCP
  return 1 + totalCP * 0.02 // 1 CP = +2%
}

/**
 * 누적 CP 계산 (현재 보유 + 사용한 CP)
 * @returns {number} 누적 CP
 */
export function getTotalCPForBonus() {
  const cp = gameState.careerPoints || 0
  const spentCP = getTotalSpentCP()
  return cp + spentCP
}

/**
 * 프레스티지 업그레이드 정의 (20종)
 *
 * 카테고리:
 * - A: 기본 부스트 (4종) - 범용적
 * - B: 금융 경로 (3종) - 금융상품 특화
 * - C: 부동산 경로 (3종) - 부동산 특화
 * - D: 클릭/노동 경로 (3종) - 액티브 플레이
 * - E: 시작 가속 (3종) - 빠른 초반
 * - F: 영구 슬롯 (2종) - 메타 진행
 * - G: 게임플레이 변경 (2종) - 후반 편의
 */
export const PRESTIGE_UPGRADES = [
  // ===== Category A: 기본 부스트 (4종) =====
  {
    id: 'A1_mentor',
    category: 'A',
    nameKey: 'cp.A1.name',
    descKey: 'cp.A1.desc',
    cost: 1,
    icon: '👨‍🏫',
    requires: [], // 선행 조건 없음
    effect: {
      type: 'click_multiplier',
      value: 1.2, // 클릭 수익 +20%
    },
  },
  {
    id: 'A2_network',
    category: 'A',
    nameKey: 'cp.A2.name',
    descKey: 'cp.A2.desc',
    cost: 2,
    icon: '🌐',
    requires: ['A1_mentor'],
    effect: {
      type: 'auto_income_multiplier',
      value: 1.25, // 자동 수익 +25%
    },
  },
  {
    id: 'A3_recognition',
    category: 'A',
    nameKey: 'cp.A3.name',
    descKey: 'cp.A3.desc',
    cost: 3,
    icon: '🏆',
    requires: ['A2_network'],
    effect: {
      type: 'starting_cash',
      value: 10_000_000, // 시작 자금 +1000만원
    },
  },
  {
    id: 'A4_reputation',
    category: 'A',
    nameKey: 'cp.A4.name',
    descKey: 'cp.A4.desc',
    cost: 5,
    icon: '⭐',
    requires: ['A3_recognition'],
    effect: {
      type: 'price_discount',
      value: 0.1, // 모든 가격 -10%
    },
  },

  // ===== Category B: 금융 경로 (3종) =====
  {
    id: 'B1_broker',
    category: 'B',
    nameKey: 'cp.B1.name',
    descKey: 'cp.B1.desc',
    cost: 3,
    icon: '📊',
    requires: [],
    effect: {
      type: 'financial_income_multiplier',
      value: 1.3, // 금융 수익 +30%
    },
  },
  {
    id: 'B2_fund_manager',
    category: 'B',
    nameKey: 'cp.B2.name',
    descKey: 'cp.B2.desc',
    cost: 5,
    icon: '💼',
    requires: ['B1_broker'],
    effect: {
      type: 'financial_price_discount',
      value: 0.25, // 금융 해금 가격 -25%
    },
  },
  {
    id: 'B3_hedge_fund',
    category: 'B',
    nameKey: 'cp.B3.name',
    descKey: 'cp.B3.desc',
    cost: 8,
    icon: '🦈',
    requires: ['B2_fund_manager'],
    effect: {
      type: 'financial_to_property_synergy',
      value: 1.15, // 금융→부동산 시너지 +15%
    },
  },

  // ===== Category C: 부동산 경로 (3종) =====
  {
    id: 'C1_realtor',
    category: 'C',
    nameKey: 'cp.C1.name',
    descKey: 'cp.C1.desc',
    cost: 3,
    icon: '🏠',
    requires: [],
    effect: {
      type: 'property_income_multiplier',
      value: 1.3, // 부동산 수익 +30%
    },
  },
  {
    id: 'C2_builder',
    category: 'C',
    nameKey: 'cp.C2.name',
    descKey: 'cp.C2.desc',
    cost: 5,
    icon: '🏗️',
    requires: ['C1_realtor'],
    effect: {
      type: 'property_price_discount',
      value: 0.25, // 부동산 해금 가격 -25%
    },
  },
  {
    id: 'C3_redeveloper',
    category: 'C',
    nameKey: 'cp.C3.name',
    descKey: 'cp.C3.desc',
    cost: 8,
    icon: '🌆',
    requires: ['C2_builder'],
    effect: {
      type: 'property_to_financial_synergy',
      value: 1.15, // 부동산→금융 시너지 +15%
    },
  },

  // ===== Category D: 클릭/노동 경로 (3종) =====
  {
    id: 'D1_workaholic',
    category: 'D',
    nameKey: 'cp.D1.name',
    descKey: 'cp.D1.desc',
    cost: 3,
    icon: '💪',
    requires: [],
    effect: {
      type: 'click_income_multiplier',
      value: 1.5, // 클릭 수익 +50%
    },
  },
  {
    id: 'D2_automation',
    category: 'D',
    nameKey: 'cp.D2.name',
    descKey: 'cp.D2.desc',
    cost: 5,
    icon: '🤖',
    requires: ['D1_workaholic'],
    effect: {
      type: 'auto_click_speed',
      value: 2, // 자동클릭 속도 2배
    },
  },
  {
    id: 'D3_ceo_mentality',
    category: 'D',
    nameKey: 'cp.D3.name',
    descKey: 'cp.D3.desc',
    cost: 8,
    icon: '👔',
    requires: ['D2_automation'],
    effect: {
      type: 'click_bonus_chance',
      value: 0.05, // 클릭 시 5% 확률 보너스
    },
  },

  // ===== Category E: 시작 가속 (3종) =====
  {
    id: 'E1_parents',
    category: 'E',
    nameKey: 'cp.E1.name',
    descKey: 'cp.E1.desc',
    cost: 2,
    icon: '👨‍👩‍👧',
    requires: [],
    effect: {
      type: 'starting_deposits',
      value: 5, // 시작 시 예금 5개
    },
  },
  {
    id: 'E2_connections',
    category: 'E',
    nameKey: 'cp.E2.name',
    descKey: 'cp.E2.desc',
    cost: 5,
    icon: '🤝',
    requires: ['E1_parents'],
    effect: {
      type: 'starting_career',
      value: 1, // 시작 시 계약직
    },
  },
  {
    id: 'E3_silver_spoon',
    category: 'E',
    nameKey: 'cp.E3.name',
    descKey: 'cp.E3.desc',
    cost: 10,
    icon: '🥄',
    requires: ['E2_connections'],
    effect: {
      type: 'starting_bundle',
      value: { villa: 1, career: 2 }, // 시작 시 빌라 1개 + 사원
    },
  },

  // ===== Category F: 영구 슬롯 (2종) =====
  {
    id: 'F1_preserve_1',
    category: 'F',
    nameKey: 'cp.F1.name',
    descKey: 'cp.F1.desc',
    cost: 6,
    icon: '🔒',
    requires: [],
    effect: {
      type: 'permanent_slot',
      value: 1, // 1번째 영구 슬롯
    },
  },
  {
    id: 'F2_preserve_2',
    category: 'F',
    nameKey: 'cp.F2.name',
    descKey: 'cp.F2.desc',
    cost: 15,
    icon: '🔐',
    requires: ['F1_preserve_1'],
    effect: {
      type: 'permanent_slot',
      value: 2, // 2번째 영구 슬롯
    },
  },

  // ===== Category G: 게임플레이 변경 (2종) =====
  {
    id: 'G1_prediction',
    category: 'G',
    nameKey: 'cp.G1.name',
    descKey: 'cp.G1.desc',
    cost: 7,
    icon: '🔮',
    requires: [],
    effect: {
      type: 'market_event_bonus',
      value: 1.5, // 시장 이벤트 효과 +50%
    },
  },
  {
    id: 'G2_insider',
    category: 'G',
    nameKey: 'cp.G2.name',
    descKey: 'cp.G2.desc',
    cost: 12,
    icon: '👁️',
    requires: ['G1_prediction'],
    effect: {
      type: 'market_event_preview',
      value: true, // 다음 이벤트 미리보기
    },
  },
]

/**
 * 카테고리 정보
 */
export const CATEGORIES = {
  A: { nameKey: 'cp.category.A', icon: '📈', color: '#4ade80' },
  B: { nameKey: 'cp.category.B', icon: '💰', color: '#60a5fa' },
  C: { nameKey: 'cp.category.C', icon: '🏢', color: '#f97316' },
  D: { nameKey: 'cp.category.D', icon: '👆', color: '#a78bfa' },
  E: { nameKey: 'cp.category.E', icon: '🚀', color: '#fbbf24' },
  F: { nameKey: 'cp.category.F', icon: '🔒', color: '#6b7280' },
  G: { nameKey: 'cp.category.G', icon: '🎮', color: '#ec4899' },
}

/**
 * 업그레이드 구매 가능 여부 확인
 * @param {string} upgradeId - 업그레이드 ID
 * @returns {Object} { canPurchase, reason }
 */
export function canPurchaseUpgrade(upgradeId) {
  const upgrade = PRESTIGE_UPGRADES.find(u => u.id === upgradeId)
  if (!upgrade) {
    return { canPurchase: false, reason: 'invalid_upgrade' }
  }

  // 방어적 초기화
  const purchased = gameState.purchasedUpgrades || []

  // 이미 구매했는지 확인
  if (purchased.includes(upgradeId)) {
    return { canPurchase: false, reason: 'already_purchased' }
  }

  // CP 충분한지 확인
  if (gameState.careerPoints < upgrade.cost) {
    return { canPurchase: false, reason: 'not_enough_cp' }
  }

  // 선행 조건 충족 확인
  for (const reqId of upgrade.requires) {
    if (!purchased.includes(reqId)) {
      return { canPurchase: false, reason: 'requires_not_met', missing: reqId }
    }
  }

  return { canPurchase: true, reason: null }
}

/**
 * 업그레이드 구매
 * @param {string} upgradeId - 업그레이드 ID
 * @returns {boolean} 구매 성공 여부
 */
export function purchaseUpgrade(upgradeId) {
  const { canPurchase } = canPurchaseUpgrade(upgradeId)
  if (!canPurchase) return false

  const upgrade = PRESTIGE_UPGRADES.find(u => u.id === upgradeId)
  gameState.careerPoints -= upgrade.cost

  // 방어적 초기화
  if (!gameState.purchasedUpgrades) {
    gameState.purchasedUpgrades = []
  }
  gameState.purchasedUpgrades.push(upgradeId)

  return true
}

/**
 * 구매한 업그레이드의 효과 반환
 * @param {string} effectType - 효과 타입
 * @returns {number|boolean|Object} 효과 값
 */
export function getUpgradeEffect(effectType) {
  let result = null

  for (const upgradeId of gameState.purchasedUpgrades || []) {
    const upgrade = PRESTIGE_UPGRADES.find(u => u.id === upgradeId)
    if (upgrade && upgrade.effect.type === effectType) {
      const val = upgrade.effect.value

      // 배수 타입은 곱연산
      if (effectType.includes('multiplier') || effectType.includes('synergy')) {
        result = (result || 1) * val
      }
      // 할인 타입은 합산 (최대 50%까지)
      else if (effectType.includes('discount')) {
        result = Math.min(0.5, (result || 0) + val)
      }
      // 그 외는 직접 값 반환
      else {
        result = val
      }
    }
  }

  return result
}

/**
 * 모든 프레스티지 효과를 객체로 반환
 * @returns {Object} 효과 타입별 값 맵
 */
export function getAllPrestigeEffects() {
  const effects = {
    // 배수 (기본값 1.0)
    click_multiplier: 1.0,
    auto_income_multiplier: 1.0,
    click_income_multiplier: 1.0,
    financial_income_multiplier: 1.0,
    property_income_multiplier: 1.0,
    financial_to_property_synergy: 1.0,
    property_to_financial_synergy: 1.0,
    auto_click_speed: 1.0,
    market_event_bonus: 1.0,

    // 할인 (기본값 0)
    price_discount: 0,
    financial_price_discount: 0,
    property_price_discount: 0,

    // 고정값 (기본값 0 또는 null)
    starting_cash: 0,
    starting_deposits: 0,
    starting_career: 0,
    starting_bundle: null,
    click_bonus_chance: 0,
    permanent_slot: 0,
    market_event_preview: false,
  }

  for (const upgradeId of gameState.purchasedUpgrades || []) {
    const upgrade = PRESTIGE_UPGRADES.find(u => u.id === upgradeId)
    if (!upgrade) continue

    const { type, value } = upgrade.effect

    if (
      type.includes('multiplier') ||
      type.includes('synergy') ||
      type === 'auto_click_speed' ||
      type === 'market_event_bonus'
    ) {
      effects[type] = (effects[type] || 1) * value
    } else if (type.includes('discount')) {
      effects[type] = Math.min(0.5, (effects[type] || 0) + value)
    } else if (type === 'permanent_slot') {
      effects[type] = Math.max(effects[type] || 0, value)
    } else if (type === 'market_event_preview') {
      effects[type] = value
    } else if (type === 'starting_bundle') {
      effects[type] = value
    } else {
      effects[type] = (effects[type] || 0) + (typeof value === 'number' ? value : 0)
    }
  }

  return effects
}

/**
 * 프레스티지 시 시작 보너스 적용
 * @returns {Object} 적용된 보너스 정보
 */
export function applyStartingBonuses() {
  const effects = getAllPrestigeEffects()
  const bonuses = {
    cash: 0,
    deposits: 0,
    career: 0,
    villa: 0,
  }

  // 시작 자금
  if (effects.starting_cash > 0) {
    gameState.cash += effects.starting_cash
    bonuses.cash = effects.starting_cash
  }

  // 시작 예금
  if (effects.starting_deposits > 0) {
    gameState.deposits += effects.starting_deposits
    bonuses.deposits = effects.starting_deposits
  }

  // 시작 커리어 (계약직 = 1, 사원 = 2)
  if (effects.starting_career > 0) {
    gameState.careerLevel = Math.max(gameState.careerLevel, effects.starting_career)
    bonuses.career = effects.starting_career
  }

  // 시작 번들 (빌라 + 커리어)
  if (effects.starting_bundle) {
    if (effects.starting_bundle.villa) {
      gameState.villas += effects.starting_bundle.villa
      gameState.unlockedProducts.villa = true
      bonuses.villa = effects.starting_bundle.villa
    }
    if (effects.starting_bundle.career) {
      gameState.careerLevel = Math.max(gameState.careerLevel, effects.starting_bundle.career)
      bonuses.career = Math.max(bonuses.career, effects.starting_bundle.career)
    }
  }

  return bonuses
}

/**
 * 영구 슬롯에 업그레이드 저장
 * @param {string} upgradeId - 업그레이드 ID
 * @param {number} slotIndex - 슬롯 인덱스 (0 또는 1)
 * @returns {boolean} 성공 여부
 */
export function saveToPermSlot(upgradeId, slotIndex) {
  const effects = getAllPrestigeEffects()
  const maxSlots = effects.permanent_slot

  if (slotIndex >= maxSlots) return false
  if (!(gameState.purchasedUpgrades || []).includes(upgradeId)) return false

  // 영구 슬롯은 F 카테고리 업그레이드 자체를 저장할 수 없음
  const upgrade = PRESTIGE_UPGRADES.find(u => u.id === upgradeId)
  if (upgrade?.category === 'F') return false

  // 슬롯 배열 초기화
  if (!gameState.permanentSlots) {
    gameState.permanentSlots = []
  }

  // 이미 다른 슬롯에 있으면 제거
  const existingIdx = gameState.permanentSlots.indexOf(upgradeId)
  if (existingIdx !== -1) {
    gameState.permanentSlots[existingIdx] = null
  }

  gameState.permanentSlots[slotIndex] = upgradeId
  return true
}

/**
 * 영구 슬롯에서 업그레이드 제거
 * @param {number} slotIndex - 슬롯 인덱스
 */
export function removeFromPermSlot(slotIndex) {
  if (gameState.permanentSlots && gameState.permanentSlots[slotIndex]) {
    gameState.permanentSlots[slotIndex] = null
  }
}

/**
 * 프레스티지 시 구매 업그레이드 리셋 (영구 슬롯 제외)
 */
export function resetPurchasedUpgrades() {
  const effects = getAllPrestigeEffects()
  const maxSlots = effects.permanent_slot
  const preserved = []
  const purchased = gameState.purchasedUpgrades || []

  // 영구 슬롯에 저장된 업그레이드 보존
  if (gameState.permanentSlots) {
    for (let i = 0; i < maxSlots; i++) {
      const id = gameState.permanentSlots[i]
      if (id && purchased.includes(id)) {
        preserved.push(id)
      }
    }
  }

  // F 카테고리 (영구 슬롯 해금)는 항상 유지
  for (const upgradeId of purchased) {
    const upgrade = PRESTIGE_UPGRADES.find(u => u.id === upgradeId)
    if (upgrade?.category === 'F' && !preserved.includes(upgradeId)) {
      preserved.push(upgradeId)
    }
  }

  gameState.purchasedUpgrades = preserved
}

/**
 * 프레스티지 시 CP 지급 및 리셋 처리
 * @returns {number} 획득한 CP
 */
export function processPrestige() {
  // CP 계산
  const earnedCP = calculateCP(gameState.towers_lifetime, gameState.lifetimeEarnings)

  // CP 지급
  gameState.careerPoints += earnedCP
  gameState.totalCareerPoints += earnedCP

  // 구매 업그레이드 리셋 (영구 슬롯/F카테고리 제외)
  resetPurchasedUpgrades()

  return earnedCP
}

/**
 * 카테고리별 업그레이드 목록 반환
 * @returns {Object} 카테고리별 업그레이드 맵
 */
export function getUpgradesByCategory() {
  const result = {}
  for (const cat of Object.keys(CATEGORIES)) {
    result[cat] = PRESTIGE_UPGRADES.filter(u => u.category === cat)
  }
  return result
}

/**
 * 시작 자금 계산 (하위 호환성)
 * @returns {number} 시작 자금
 */
export function getStartingCash() {
  const effects = getAllPrestigeEffects()
  return effects.starting_cash || 0
}

// ===== 하위 호환성: 기존 함수들 =====

/**
 * @deprecated 새 시스템에서는 getAllPrestigeEffects() 사용
 */
export function getPrestigeMultiplier(type) {
  const effects = getAllPrestigeEffects()

  // 타입 매핑
  const typeMap = {
    click_power: 'click_multiplier',
    auto_income: 'auto_income_multiplier',
    all_income: 'auto_income_multiplier',
    price_reduction: null, // 할인은 별도 처리
  }

  const mappedType = typeMap[type] || type
  if (mappedType === null) {
    // price_reduction은 (1 - discount)로 반환
    return 1 - (effects.price_discount || 0)
  }

  return effects[mappedType] || 1.0
}

/**
 * @deprecated 새 시스템에서는 getAllPrestigeEffects() 사용
 */
export function getAllPrestigeMultipliers() {
  const effects = getAllPrestigeEffects()

  // 하위 호환 형식으로 변환
  return {
    click_power: effects.click_multiplier * effects.click_income_multiplier,
    auto_income: effects.auto_income_multiplier,
    price_reduction: 1 - effects.price_discount,
    starting_cash: effects.starting_cash,
    upgrade_multiplier: 1.0,
    offline_time: 1.0,
    unlock_special: false,
    synergy_boost: Math.max(
      effects.financial_to_property_synergy,
      effects.property_to_financial_synergy
    ),
    tick_speed: 1.0,
    all_income: effects.auto_income_multiplier,
  }
}

/**
 * @deprecated 기존 보너스 배열은 더 이상 사용 안 함
 */
export const PRESTIGE_BONUSES = []

/**
 * @deprecated 새 시스템에서는 구매한 업그레이드 기반
 */
export function getActivePrestigeBonuses() {
  return []
}

/**
 * @deprecated 새 시스템에서는 getUpgradesByCategory() 사용
 */
export function getBonusesByTier() {
  return { tier1: [], tier2: [], tier3: [], tier4: [] }
}

/**
 * 프레스티지 보너스 정보 HTML 생성 (통계 탭용)
 * @param {Function} t - i18n 번역 함수
 * @param {Function} formatNumber - 숫자 포맷 함수
 * @returns {string} HTML 문자열
 */
export function getPrestigeBonusInfoHTML(t, formatNumber) {
  const effects = getAllPrestigeEffects()
  const purchased = gameState.purchasedUpgrades || []
  const towers = gameState.towers_lifetime
  const cp = gameState.careerPoints

  if (towers === 0 && purchased.length === 0) {
    return `<p class="prestige-hint">${t('cp.hint.none', {}, '첫 타워를 획득하면 경력 포인트(CP)를 얻고 업그레이드를 구매할 수 있습니다.')}</p>`
  }

  const lines = purchased.map(id => {
    const upgrade = PRESTIGE_UPGRADES.find(u => u.id === id)
    if (!upgrade) return ''

    return `
      <div class="prestige-bonus-item category-${upgrade.category}">
        <span class="bonus-icon">${upgrade.icon}</span>
        <span class="bonus-name">${t(upgrade.nameKey)}</span>
        <span class="bonus-effect">${t('cp.active', {}, '활성')}</span>
      </div>
    `
  })

  return `
    <div class="prestige-bonus-list">
      <h4>${t('cp.title', {}, '경력 포인트')} (${cp} CP / 🗼${towers})</h4>
      ${lines.join('')}
    </div>
  `
}
