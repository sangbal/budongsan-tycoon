/**
 * 전역 업그레이드 정의
 * - 부동산 관리 전문화, 전문 관리인, 금융 전문가, AI 시스템
 * Phase 1.3: upgrades.js 분해
 */

/**
 * 전역 업그레이드 팩토리
 * @param {Object} deps - 의존성 객체
 * @returns {Object} 전역 업그레이드 객체
 */
export function createGlobalUpgrades(deps) {
  const {
    getCareerLevel,
    getTotalProperties,
    getRentMultiplier,
    setRentMultiplier,
    incrementManagerLevel,
    setAutoClickEnabled,
    updateAutoWorkUI,
    FINANCIAL_INCOME,
  } = deps

  return {
    rent_multiplier: {
      name: '📊 부동산 관리 전문화',
      desc: '모든 부동산 수익 +10%',
      cost: 1000000000,
      icon: '📊',
      unlockCondition: () => getTotalProperties() >= 10,
      effect: () => {
        setRentMultiplier(getRentMultiplier() * 1.1)
      },
      category: 'global',
      unlocked: false,
      purchased: false,
    },
    manager_hire: {
      name: '👨‍💼 전문 관리인 고용',
      desc: '전체 임대 수익 +5%',
      cost: 5000000000,
      icon: '👨‍💼',
      unlockCondition: () => getTotalProperties() >= 20,
      effect: () => {
        setRentMultiplier(getRentMultiplier() * 1.05)
        incrementManagerLevel()
      },
      category: 'global',
      unlocked: false,
      purchased: false,
    },
    financial_expert: {
      name: '💼 금융 전문가 고용',
      desc: '모든 금융 수익 +20%',
      cost: 10000000000,
      icon: '💼',
      unlockCondition: () => getCareerLevel() >= 8,
      effect: () => {
        FINANCIAL_INCOME.deposit *= 1.2
        FINANCIAL_INCOME.savings *= 1.2
        FINANCIAL_INCOME.bond *= 1.2
      },
      category: 'global',
      unlocked: false,
      purchased: false,
    },
    auto_work_system: {
      name: '🤖 AI 업무 처리 시스템',
      desc: '1초마다 자동으로 1회 클릭 (초당 수익 추가)',
      cost: 5000000000,
      icon: '📱',
      unlockCondition: () => getCareerLevel() >= 7 && getTotalProperties() >= 10,
      effect: () => {
        setAutoClickEnabled(true)
        updateAutoWorkUI()
      },
      category: 'global',
      unlocked: false,
      purchased: false,
    },
  }
}
