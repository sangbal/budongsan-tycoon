/**
 * Seoul Survival - Build Synergy System
 *
 * 플레이어가 특정 투자 조합을 갖춰 전략적 깊이를 추가하는 시너지 시스템
 *
 * 시너지 5종:
 * 1. 부동산 왕: 부동산 5종 보유 → 부동산 수익 +30%
 * 2. 금융 전문가: 금융 5종 보유 → 금융 수익 +25%
 * 3. 다각화: 모든 상품 1개+ → 전체 수익 +15%
 * 4. 서울 지배자: 빌딩 5개+ → 전체 수익 +50%
 * 5. 완벽주의자: 모든 업그레이드 구매 → 전체 수익 +100%
 */

import { gameState } from '../state/gameState.js'

/**
 * 시너지 정의
 * @type {Array<Object>}
 */
export const SYNERGIES = [
  {
    id: 'real_estate_mogul',
    nameKey: 'synergy.realEstateMogul.name',
    descKey: 'synergy.realEstateMogul.desc',
    icon: '🏢',
    /**
     * 조건: 부동산 5종 모두 1개 이상 보유
     * (빌라, 오피스텔, 아파트, 상가, 빌딩)
     */
    check: state => {
      return (
        state.villas > 0 &&
        state.officetels > 0 &&
        state.apartments > 0 &&
        state.shops > 0 &&
        state.buildings > 0
      )
    },
    effect: 'property_income',
    multiplier: 1.3, // +30%
  },
  {
    id: 'finance_guru',
    nameKey: 'synergy.financeGuru.name',
    descKey: 'synergy.financeGuru.desc',
    icon: '💰',
    /**
     * 조건: 금융 5종 모두 1개 이상 보유
     * (예금, 적금, 국내주식, 미국주식, 코인)
     */
    check: state => {
      return (
        state.deposits > 0 &&
        state.savings > 0 &&
        state.bonds > 0 &&
        state.usStocks > 0 &&
        state.cryptos > 0
      )
    },
    effect: 'financial_income',
    multiplier: 1.25, // +25%
  },
  {
    id: 'diversification',
    nameKey: 'synergy.diversification.name',
    descKey: 'synergy.diversification.desc',
    icon: '📊',
    /**
     * 조건: 금융 5종 + 부동산 5종 모두 1개 이상 보유
     */
    check: state => {
      return (
        state.deposits > 0 &&
        state.savings > 0 &&
        state.bonds > 0 &&
        state.usStocks > 0 &&
        state.cryptos > 0 &&
        state.villas > 0 &&
        state.officetels > 0 &&
        state.apartments > 0 &&
        state.shops > 0 &&
        state.buildings > 0
      )
    },
    effect: 'all_income',
    multiplier: 1.15, // +15%
  },
  {
    id: 'seoul_ruler',
    nameKey: 'synergy.seoulRuler.name',
    descKey: 'synergy.seoulRuler.desc',
    icon: '🗼',
    /**
     * 조건: 빌딩 5개 이상 보유
     */
    check: state => {
      return state.buildings >= 5
    },
    effect: 'all_income',
    multiplier: 1.5, // +50%
  },
  {
    id: 'completionist',
    nameKey: 'synergy.completionist.name',
    descKey: 'synergy.completionist.desc',
    icon: '🏆',
    /**
     * 조건: 모든 업그레이드 구매
     * NOTE: 이 조건은 UPGRADES 객체가 필요하므로 외부에서 주입받아 체크
     */
    check: state => {
      // 기본 false, 외부에서 체크 후 override
      return state.__completionistUnlocked || false
    },
    effect: 'all_income',
    multiplier: 2.0, // +100%
  },
]

/**
 * 활성화된 시너지 목록 반환
 * @param {Object} state - 게임 상태 객체
 * @returns {Array<Object>} 활성화된 시너지 배열
 */
export function getActiveSynergies(state = gameState) {
  return SYNERGIES.filter(synergy => synergy.check(state))
}

/**
 * 특정 효과 타입에 대한 시너지 배수 계산
 * @param {Object} state - 게임 상태 객체
 * @param {string} effectType - 효과 타입 ('property_income', 'financial_income', 'all_income', 'click_power')
 * @returns {number} 총 배수 (활성 시너지들의 곱연산)
 */
export function getSynergyMultiplier(state, effectType) {
  const activeSynergies = getActiveSynergies(state)
  let multiplier = 1.0

  for (const synergy of activeSynergies) {
    // all_income은 모든 타입에 적용
    if (synergy.effect === effectType || synergy.effect === 'all_income') {
      multiplier *= synergy.multiplier
    }
  }

  return multiplier
}

/**
 * 부동산 수익에 시너지 배수 적용
 * @param {number} baseIncome - 기본 부동산 수익
 * @param {Object} state - 게임 상태 객체
 * @returns {number} 시너지 배수 적용된 수익
 */
export function applyPropertySynergyMultiplier(baseIncome, state = gameState) {
  return baseIncome * getSynergyMultiplier(state, 'property_income')
}

/**
 * 금융 수익에 시너지 배수 적용
 * @param {number} baseIncome - 기본 금융 수익
 * @param {Object} state - 게임 상태 객체
 * @returns {number} 시너지 배수 적용된 수익
 */
export function applyFinancialSynergyMultiplier(baseIncome, state = gameState) {
  return baseIncome * getSynergyMultiplier(state, 'financial_income')
}

/**
 * 클릭 수익에 시너지 배수 적용
 * @param {number} baseIncome - 기본 클릭 수익
 * @param {Object} state - 게임 상태 객체
 * @returns {number} 시너지 배수 적용된 수익
 */
export function applyClickSynergyMultiplier(baseIncome, state = gameState) {
  return baseIncome * getSynergyMultiplier(state, 'click_power')
}

/**
 * 완벽주의자 시너지 조건 업데이트
 * (main.js에서 UPGRADES 객체를 사용하여 호출)
 * @param {Object} UPGRADES - 업그레이드 객체
 */
export function updateCompletionistSynergy(UPGRADES) {
  const allPurchased = Object.values(UPGRADES).every(upgrade => upgrade.purchased)
  gameState.__completionistUnlocked = allPurchased
}

/**
 * 시너지 UI 표시용 데이터 반환
 * @param {Object} state - 게임 상태 객체
 * @returns {Array<Object>} UI 렌더링용 시너지 데이터
 */
export function getSynergyDisplayData(state = gameState) {
  return SYNERGIES.map(synergy => ({
    id: synergy.id,
    nameKey: synergy.nameKey,
    descKey: synergy.descKey,
    icon: synergy.icon,
    active: synergy.check(state),
    multiplier: synergy.multiplier,
    effect: synergy.effect,
  }))
}
