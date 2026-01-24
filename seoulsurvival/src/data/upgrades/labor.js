/**
 * 노동 관련 업그레이드 정의
 * Phase 1.3: upgrades.js 분해
 */

/**
 * 노동 업그레이드 팩토리
 * @param {Object} deps - 의존성 객체
 * @returns {Object} 노동 업그레이드 객체
 */
export function createLaborUpgrades(deps) {
  const { getCareerLevel, getClickMultiplier, setClickMultiplier, getTotalClicks } = deps

  return {
    part_time_job: {
      name: '🍕 아르바이트 경험',
      desc: '클릭 수익 1.2배',
      cost: 50000,
      icon: '🍕',
      unlockCondition: () => getCareerLevel() >= 1,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 1.2)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    internship: {
      name: '📝 인턴십',
      desc: '클릭 수익 1.2배',
      cost: 200000,
      icon: '📝',
      unlockCondition: () => getCareerLevel() >= 2,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 1.2)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    efficient_work: {
      name: '⚡ 효율적인 업무 처리',
      desc: '클릭 수익 1.2배',
      cost: 500000,
      icon: '⚡',
      unlockCondition: () => getCareerLevel() >= 3,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 1.2)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    focus_training: {
      name: '🎯 집중력 강화',
      desc: '클릭 수익 1.2배',
      cost: 2000000,
      icon: '🎯',
      unlockCondition: () => getCareerLevel() >= 4,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 1.2)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    professional_education: {
      name: '📚 전문 교육',
      desc: '클릭 수익 1.2배',
      cost: 10000000,
      icon: '📚',
      unlockCondition: () => getCareerLevel() >= 5,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 1.2)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    performance_bonus: {
      name: '💰 성과급',
      desc: '2% 확률로 10배 수익',
      cost: 10000000,
      icon: '💰',
      unlockCondition: () => getCareerLevel() >= 6,
      effect: () => {
        /* 확률형 효과는 클릭 이벤트에서 처리 */
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    career_recognition: {
      name: '💼 경력 인정',
      desc: '클릭 수익 1.2배',
      cost: 30000000,
      icon: '💼',
      unlockCondition: () => getCareerLevel() >= 6,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 1.2)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    overtime_work: {
      name: '🔥 초과근무',
      desc: '클릭 수익 1.2배',
      cost: 50000000,
      icon: '🔥',
      unlockCondition: () => getCareerLevel() >= 7,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 1.2)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    honor_award: {
      name: '🎖️ 명예상',
      desc: '클릭 수익 1.2배',
      cost: 100000000,
      icon: '🎖️',
      unlockCondition: () => getCareerLevel() >= 7,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 1.2)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    expertise_development: {
      name: '💎 전문성 개발',
      desc: '클릭 수익 1.2배',
      cost: 200000000,
      icon: '💎',
      unlockCondition: () => getCareerLevel() >= 8,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 1.2)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    teamwork: {
      name: '🤝 팀워크 향상',
      desc: '클릭 수익 1.2배',
      cost: 500000000,
      icon: '🤝',
      unlockCondition: () => getCareerLevel() >= 8,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 1.2)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    leadership: {
      name: '👑 리더십',
      desc: '클릭 수익 1.2배',
      cost: 2000000000,
      icon: '👑',
      unlockCondition: () => getCareerLevel() >= 8,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 1.2)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    ceo_privilege: {
      name: '👔 CEO 특권',
      desc: '클릭 수익 2.0배',
      cost: 10000000000,
      icon: '👔',
      unlockCondition: () => getCareerLevel() >= 9,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 2.0)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    global_experience: {
      name: '🌍 글로벌 경험',
      desc: '클릭 수익 2.0배',
      cost: 50000000000,
      icon: '🌍',
      unlockCondition: () => getCareerLevel() >= 9 && getTotalClicks() >= 15000,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 2.0)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
    entrepreneurship: {
      name: '🚀 창업',
      desc: '클릭 수익 2.0배',
      cost: 100000000000,
      icon: '🚀',
      unlockCondition: () => getCareerLevel() >= 9 && getTotalClicks() >= 30000,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 2.0)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },
  }
}
