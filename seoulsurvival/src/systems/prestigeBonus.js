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
 * 프레스티지 업그레이드 정의 (26종)
 *
 * 새 카테고리 (6개, MECE 병합):
 * - QUICK_START: I(프레스티지 자동화) + E(시작 가속) → 자동화/가속 (6종)
 * - LABOR: D(클릭/노동) + H(인맥) → 클릭/승진 진행 (6종)
 * - BOOST: A(기본 부스트) → 범용 (4종)
 * - FINANCIAL: B(금융) → 금융 특화 (3종)
 * - PROPERTY: C(부동산) → 부동산 특화 (3종)
 * - META: F(영구 슬롯) + G(게임플레이) → 메타 시스템 (4종)
 */
export const PRESTIGE_UPGRADES = [
  // ===== Category QUICK_START: 빠른 시작 (6종) - 구 I + E =====
  // 프레스티지 자동화 (I 계열)
  {
    id: 'I1_auto_start',
    category: 'QUICK_START',
    nameKey: 'cp.I1.name',
    descKey: 'cp.I1.desc',
    cost: 1,
    icon: '☕',
    requires: [],
    effect: {
      type: 'prestige_auto_click',
      value: 1, // 1회/초
    },
  },
  {
    id: 'I2_auto_speed',
    category: 'QUICK_START',
    nameKey: 'cp.I2.name',
    descKey: 'cp.I2.desc',
    cost: 5,
    icon: '⚡',
    requires: ['I1_auto_start'],
    effect: {
      type: 'prestige_auto_click',
      value: 2, // 2회/초
    },
  },
  {
    id: 'I3_auto_turbo',
    category: 'QUICK_START',
    nameKey: 'cp.I3.name',
    descKey: 'cp.I3.desc',
    cost: 12,
    icon: '🔥',
    requires: ['I2_auto_speed'],
    effect: {
      type: 'prestige_auto_click',
      value: 4, // 4회/초
    },
  },
  // 시작 가속 (E 계열)
  {
    id: 'E1_parents',
    category: 'QUICK_START',
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
    category: 'QUICK_START',
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
    category: 'QUICK_START',
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

  // ===== Category LABOR: 노동 & 승진 (6종) - 구 D + H =====
  // 클릭/노동 (D 계열)
  {
    id: 'D1_workaholic',
    category: 'LABOR',
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
    category: 'LABOR',
    nameKey: 'cp.D2.name',
    descKey: 'cp.D2.desc',
    cost: 5,
    icon: '📊',
    requires: ['D1_workaholic'],
    effect: {
      type: 'auto_click_speed',
      value: 2, // 자동클릭 속도 2배
    },
  },
  {
    id: 'D3_ceo_mentality',
    category: 'LABOR',
    nameKey: 'cp.D3.name',
    descKey: 'cp.D3.desc',
    cost: 8,
    icon: '🎯',
    requires: ['D2_automation'],
    effect: {
      type: 'click_bonus_chance',
      value: 0.05, // 클릭 시 5% 확률 보너스
    },
  },
  // 인맥 (H 계열)
  {
    id: 'H1_network_basic',
    category: 'LABOR',
    nameKey: 'cp.H1.name',
    descKey: 'cp.H1.desc',
    cost: 1,
    icon: '🍺',
    requires: [],
    effect: {
      type: 'promotion_requirement_reduction',
      value: 0.2, // 승진 요구량 -20%
    },
  },
  {
    id: 'H2_network_power',
    category: 'LABOR',
    nameKey: 'cp.H2.name',
    descKey: 'cp.H2.desc',
    cost: 5,
    icon: '🏌️',
    requires: ['H1_network_basic'],
    effect: {
      type: 'promotion_requirement_reduction',
      value: 0.15, // 승진 요구량 추가 -15%
    },
  },
  {
    id: 'H3_vip_connections',
    category: 'LABOR',
    nameKey: 'cp.H3.name',
    descKey: 'cp.H3.desc',
    cost: 12,
    icon: '🏰',
    requires: ['H2_network_power'],
    effect: {
      type: 'promotion_requirement_reduction',
      value: 0.15, // 승진 요구량 추가 -15%
    },
  },

  // ===== Category BOOST: 범용 강화 (4종) - 구 A =====
  {
    id: 'A1_mentor',
    category: 'BOOST',
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
    category: 'BOOST',
    nameKey: 'cp.A2.name',
    descKey: 'cp.A2.desc',
    cost: 2,
    icon: '📱',
    requires: ['A1_mentor'],
    effect: {
      type: 'auto_income_multiplier',
      value: 1.25, // 자동 수익 +25%
    },
  },
  {
    id: 'A3_recognition',
    category: 'BOOST',
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
    category: 'BOOST',
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

  // ===== Category FINANCIAL: 금융 투자 (3종) - 구 B =====
  {
    id: 'B1_broker',
    category: 'FINANCIAL',
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
    category: 'FINANCIAL',
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
    category: 'FINANCIAL',
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

  // ===== Category PROPERTY: 부동산 투자 (3종) - 구 C =====
  {
    id: 'C1_realtor',
    category: 'PROPERTY',
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
    category: 'PROPERTY',
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
    category: 'PROPERTY',
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

  // ===== Category META: 메타 & 편의 (4종) - 구 F + G =====
  // 영구 슬롯 (F 계열)
  {
    id: 'F1_preserve_1',
    category: 'META',
    nameKey: 'cp.F1.name',
    descKey: 'cp.F1.desc',
    cost: 6,
    icon: '💎',
    requires: [],
    effect: {
      type: 'permanent_slot',
      value: 1, // 1번째 영구 슬롯
    },
  },
  {
    id: 'F2_preserve_2',
    category: 'META',
    nameKey: 'cp.F2.name',
    descKey: 'cp.F2.desc',
    cost: 15,
    icon: '💎',
    requires: ['F1_preserve_1'],
    effect: {
      type: 'permanent_slot',
      value: 2, // 2번째 영구 슬롯
    },
  },
  // 게임플레이 변경 (G 계열)
  {
    id: 'G1_prediction',
    category: 'META',
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
    category: 'META',
    nameKey: 'cp.G2.name',
    descKey: 'cp.G2.desc',
    cost: 12,
    icon: '📰',
    requires: ['G1_prediction'],
    effect: {
      type: 'market_event_preview',
      value: true, // 다음 이벤트 미리보기
    },
  },
]

/**
 * 카테고리 정보 (6개로 병합)
 *
 * MECE 병합:
 * - QUICK_START: I(프레스티지 자동화) + E(시작 가속) → "자동화/가속" 목적
 * - LABOR: D(클릭/노동) + H(인맥) → "클릭/승진 진행" 목적
 * - BOOST: A(기본 부스트) → 범용
 * - FINANCIAL: B(금융) → 금융 특화
 * - PROPERTY: C(부동산) → 부동산 특화
 * - META: F(영구 슬롯) + G(게임플레이) → "메타 시스템" 목적
 */
export const CATEGORIES = {
  QUICK_START: { nameKey: 'cp.cat.quickStart', icon: '🎒', color: '#fbbf24' },
  LABOR: { nameKey: 'cp.cat.labor', icon: '💼', color: '#a78bfa' },
  BOOST: { nameKey: 'cp.cat.boost', icon: '📚', color: '#4ade80' },
  FINANCIAL: { nameKey: 'cp.cat.financial', icon: '💵', color: '#60a5fa' },
  PROPERTY: { nameKey: 'cp.cat.property', icon: '🏘️', color: '#f97316' },
  META: { nameKey: 'cp.cat.meta', icon: '⏳', color: '#6b7280' },
}

/**
 * 카테고리 표시 순서 (게임 흐름 기반)
 * 1. 첫 프레스티지 후 → 🚀 빠른 시작 (1CP 자동클릭)
 * 2. 초반 진행 → 💪 노동 & 승진 (1CP 인맥)
 * 3. 안정적 성장 → 📈 범용 강화
 * 4. 중반 콘텐츠 → 💰 금융
 * 5. 중반 콘텐츠 → 🏢 부동산
 * 6. 후반 편의 → 🔧 메타
 */
export const CATEGORY_ORDER = ['QUICK_START', 'LABOR', 'BOOST', 'FINANCIAL', 'PROPERTY', 'META']

/**
 * 레거시 카테고리 정보 (하위 호환용)
 * @deprecated 새 시스템에서는 CATEGORIES 사용
 */
export const LEGACY_CATEGORIES = {
  A: { nameKey: 'cp.category.A', icon: '📈', color: '#4ade80' },
  B: { nameKey: 'cp.category.B', icon: '💰', color: '#60a5fa' },
  C: { nameKey: 'cp.category.C', icon: '🏢', color: '#f97316' },
  D: { nameKey: 'cp.category.D', icon: '👆', color: '#a78bfa' },
  E: { nameKey: 'cp.category.E', icon: '🚀', color: '#fbbf24' },
  F: { nameKey: 'cp.category.F', icon: '🔒', color: '#6b7280' },
  G: { nameKey: 'cp.category.G', icon: '🎮', color: '#ec4899' },
  H: { nameKey: 'cp.category.H', icon: '🤝', color: '#14b8a6' },
  I: { nameKey: 'cp.category.I', icon: '🤖', color: '#8b5cf6' },
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

    // 인맥 경로: 승진 요구량 감소 (곱연산, 기본값 1.0)
    promotion_requirement_reduction: 0,

    // 프레스티지 자동화: 자동 클릭 속도 (최대값 선택)
    prestige_auto_click: 0,
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
    } else if (type === 'promotion_requirement_reduction') {
      // 인맥 감소는 합산 (0.2 + 0.15 + 0.15 = 0.5, 즉 50% 감소)
      effects[type] = (effects[type] || 0) + value
    } else if (type === 'prestige_auto_click') {
      // 프레스티지 자동 클릭은 최대값 선택 (상위 업그레이드가 대체)
      effects[type] = Math.max(effects[type] || 0, value)
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

  // 영구 슬롯은 영구 슬롯 업그레이드(F1, F2) 자체를 저장할 수 없음
  const upgrade = PRESTIGE_UPGRADES.find(u => u.id === upgradeId)
  if (upgrade?.id.startsWith('F')) return false

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
 * 프레스티지 시 구매 업그레이드 리셋
 * [변경] CP 상품은 계정 누적 데이터이므로 모두 영구 유지
 */
export function resetPurchasedUpgrades() {
  // CP 상품은 프레스티지 후에도 영구 유지
  // 함수 본문을 비워 리셋 로직 제거
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

// ===== 클릭 가속 시스템 헬퍼 함수 =====

/**
 * CP 기반 클릭 가치 배수 계산
 * 누적 CP(보유 + 사용)에 따라 클릭당 승진 기여도 증가
 * 1 CP = +1% 클릭 가치
 *
 * @returns {number} 클릭 가치 배수 (예: 1.5 = 50% 증가)
 */
export function getPromotionClickMultiplier() {
  const totalCP = getTotalCPForBonus()
  return 1 + totalCP * 0.01 // 1 CP = +1%
}

/**
 * 인맥 업그레이드 기반 승진 요구량 감소율 계산
 * H1: -20%, H2: 추가 -15%, H3: 추가 -15% = 최대 50% 감소
 *
 * @returns {number} 감소율 (0~0.5, 예: 0.35 = 35% 감소)
 */
export function getNetworkRequirementReduction() {
  const effects = getAllPrestigeEffects()
  return effects.promotion_requirement_reduction || 0
}

/**
 * 인맥 업그레이드 적용된 승진 요구량 배수 계산
 * 예: 35% 감소 시 0.65 반환 (기존 요구량 × 0.65)
 *
 * @returns {number} 요구량 배수 (0.5~1.0)
 */
export function getPromotionRequirementMultiplier() {
  const reduction = getNetworkRequirementReduction()
  return Math.max(0.5, 1 - reduction) // 최소 50%까지만 감소
}

/**
 * 프레스티지 자동 클릭 속도 계산
 * I1: 1회/초, I2: 2회/초, I3: 4회/초
 *
 * @returns {number} 초당 자동 클릭 횟수 (0 = 비활성)
 */
export function getPrestigeAutoClickSpeed() {
  const effects = getAllPrestigeEffects()
  return effects.prestige_auto_click || 0
}

/**
 * 프레스티지 자동 클릭 활성화 여부
 * @returns {boolean} 활성화 여부
 */
export function isPrestigeAutoClickEnabled() {
  return getPrestigeAutoClickSpeed() > 0
}

/**
 * 승진까지 필요한 유효 클릭 수 계산
 * CP 보너스와 인맥 감소를 모두 적용
 *
 * @param {number} baseRequirement - 기본 승진 요구 클릭 수
 * @returns {number} 유효 필요 클릭 수
 */
export function getEffectivePromotionRequirement(baseRequirement) {
  const clickMultiplier = getPromotionClickMultiplier()
  const requirementMultiplier = getPromotionRequirementMultiplier()

  // 요구량 감소 적용 후, 클릭 가치 증가 적용
  // 예: 기본 1000클릭, 35% 감소 → 650클릭, 클릭 가치 1.5배 → 433클릭
  return Math.ceil((baseRequirement * requirementMultiplier) / clickMultiplier)
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
