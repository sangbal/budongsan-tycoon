/**
 * 부동산 관련 업그레이드 정의
 * - 빌라, 오피스텔, 아파트, 상가, 빌딩
 * Phase 1.3: upgrades.js 분해
 */

/**
 * 부동산 업그레이드 팩토리
 * @param {Object} deps - 의존성 객체
 * @returns {Object} 부동산 업그레이드 객체
 */
export function createPropertyUpgrades(deps) {
  const { getVillas, getOfficetels, getApartments, getShops, getBuildings, BASE_RENT } = deps

  return {
    // === 빌라 관련 ===
    villa_boost_1: {
      name: '🏘️ 빌라 리모델링',
      desc: '빌라 수익 2배',
      cost: 500000000,
      icon: '🏘️',
      unlockCondition: () => getVillas() >= 5,
      effect: () => {
        BASE_RENT.villa *= 2
      },
      category: 'villa',
      unlocked: false,
      purchased: false,
    },
    villa_boost_2: {
      name: '🌟 럭셔리 빌라',
      desc: '빌라 수익 2배',
      cost: 1250000000,
      icon: '🌟',
      unlockCondition: () => getVillas() >= 15,
      effect: () => {
        BASE_RENT.villa *= 2
      },
      category: 'villa',
      unlocked: false,
      purchased: false,
    },
    villa_boost_3: {
      name: '✨ 프리미엄 빌라 단지',
      desc: '빌라 수익 2배',
      cost: 2500000000,
      icon: '✨',
      unlockCondition: () => getVillas() >= 30,
      effect: () => {
        BASE_RENT.villa *= 2
      },
      category: 'villa',
      unlocked: false,
      purchased: false,
    },
    villa_boost_4: {
      name: '💎 다이아몬드 빌라',
      desc: '빌라 수익 2배',
      cost: 5000000000,
      icon: '💎',
      unlockCondition: () => getVillas() >= 40,
      effect: () => {
        BASE_RENT.villa *= 2
      },
      category: 'villa',
      unlocked: false,
      purchased: false,
    },
    villa_boost_5: {
      name: '👑 킹 빌라',
      desc: '빌라 수익 2배',
      cost: 10000000000,
      icon: '👑',
      unlockCondition: () => getVillas() >= 50,
      effect: () => {
        BASE_RENT.villa *= 2
      },
      category: 'villa',
      unlocked: false,
      purchased: false,
    },

    // === 오피스텔 관련 ===
    officetel_boost_1: {
      name: '🏢 오피스텔 스마트화',
      desc: '오피스텔 수익 2배',
      cost: 700000000,
      icon: '🏢',
      unlockCondition: () => getOfficetels() >= 5,
      effect: () => {
        BASE_RENT.officetel *= 2
      },
      category: 'officetel',
      unlocked: false,
      purchased: false,
    },
    officetel_boost_2: {
      name: '🏙️ 프리미엄 오피스텔',
      desc: '오피스텔 수익 2배',
      cost: 1750000000,
      icon: '🏙️',
      unlockCondition: () => getOfficetels() >= 15,
      effect: () => {
        BASE_RENT.officetel *= 2
      },
      category: 'officetel',
      unlocked: false,
      purchased: false,
    },
    officetel_boost_3: {
      name: '🌆 럭셔리 오피스텔 타워',
      desc: '오피스텔 수익 2배',
      cost: 3500000000,
      icon: '🌆',
      unlockCondition: () => getOfficetels() >= 30,
      effect: () => {
        BASE_RENT.officetel *= 2
      },
      category: 'officetel',
      unlocked: false,
      purchased: false,
    },
    officetel_boost_4: {
      name: '💎 다이아몬드 오피스텔',
      desc: '오피스텔 수익 2배',
      cost: 7000000000,
      icon: '💎',
      unlockCondition: () => getOfficetels() >= 40,
      effect: () => {
        BASE_RENT.officetel *= 2
      },
      category: 'officetel',
      unlocked: false,
      purchased: false,
    },
    officetel_boost_5: {
      name: '👑 킹 오피스텔',
      desc: '오피스텔 수익 2배',
      cost: 14000000000,
      icon: '👑',
      unlockCondition: () => getOfficetels() >= 50,
      effect: () => {
        BASE_RENT.officetel *= 2
      },
      category: 'officetel',
      unlocked: false,
      purchased: false,
    },

    // === 아파트 관련 ===
    apartment_boost_1: {
      name: '🏡 아파트 프리미엄화',
      desc: '아파트 수익 2배',
      cost: 1600000000,
      icon: '🏡',
      unlockCondition: () => getApartments() >= 5,
      effect: () => {
        BASE_RENT.apartment *= 2
      },
      category: 'apartment',
      unlocked: false,
      purchased: false,
    },
    apartment_boost_2: {
      name: '🏰 타워팰리스급 아파트',
      desc: '아파트 수익 2배',
      cost: 4000000000,
      icon: '🏰',
      unlockCondition: () => getApartments() >= 15,
      effect: () => {
        BASE_RENT.apartment *= 2
      },
      category: 'apartment',
      unlocked: false,
      purchased: false,
    },
    apartment_boost_3: {
      name: '🏛️ 초고급 아파트 단지',
      desc: '아파트 수익 2배',
      cost: 8000000000,
      icon: '🏛️',
      unlockCondition: () => getApartments() >= 30,
      effect: () => {
        BASE_RENT.apartment *= 2
      },
      category: 'apartment',
      unlocked: false,
      purchased: false,
    },
    apartment_boost_4: {
      name: '💎 다이아몬드 아파트',
      desc: '아파트 수익 2배',
      cost: 16000000000,
      icon: '💎',
      unlockCondition: () => getApartments() >= 40,
      effect: () => {
        BASE_RENT.apartment *= 2
      },
      category: 'apartment',
      unlocked: false,
      purchased: false,
    },
    apartment_boost_5: {
      name: '👑 킹 아파트',
      desc: '아파트 수익 2배',
      cost: 32000000000,
      icon: '👑',
      unlockCondition: () => getApartments() >= 50,
      effect: () => {
        BASE_RENT.apartment *= 2
      },
      category: 'apartment',
      unlocked: false,
      purchased: false,
    },

    // === 상가 관련 ===
    shop_boost_1: {
      name: '🏪 상가 입지 개선',
      desc: '상가 수익 2배',
      cost: 2400000000,
      icon: '🏪',
      unlockCondition: () => getShops() >= 5,
      effect: () => {
        BASE_RENT.shop *= 2
      },
      category: 'shop',
      unlocked: false,
      purchased: false,
    },
    shop_boost_2: {
      name: '🛍️ 프리미엄 상권',
      desc: '상가 수익 2배',
      cost: 6000000000,
      icon: '🛍️',
      unlockCondition: () => getShops() >= 15,
      effect: () => {
        BASE_RENT.shop *= 2
      },
      category: 'shop',
      unlocked: false,
      purchased: false,
    },
    shop_boost_3: {
      name: '🏬 메가몰 상권',
      desc: '상가 수익 2배',
      cost: 12000000000,
      icon: '🏬',
      unlockCondition: () => getShops() >= 30,
      effect: () => {
        BASE_RENT.shop *= 2
      },
      category: 'shop',
      unlocked: false,
      purchased: false,
    },
    shop_boost_4: {
      name: '💎 다이아몬드 상권',
      desc: '상가 수익 2배',
      cost: 24000000000,
      icon: '💎',
      unlockCondition: () => getShops() >= 40,
      effect: () => {
        BASE_RENT.shop *= 2
      },
      category: 'shop',
      unlocked: false,
      purchased: false,
    },
    shop_boost_5: {
      name: '👑 킹 상권',
      desc: '상가 수익 2배',
      cost: 48000000000,
      icon: '👑',
      unlockCondition: () => getShops() >= 50,
      effect: () => {
        BASE_RENT.shop *= 2
      },
      category: 'shop',
      unlocked: false,
      purchased: false,
    },

    // === 빌딩 관련 ===
    building_boost_1: {
      name: '🏙️ 빌딩 테넌트 확보',
      desc: '빌딩 수익 2배',
      cost: 6000000000,
      icon: '🏙️',
      unlockCondition: () => getBuildings() >= 5,
      effect: () => {
        BASE_RENT.building *= 2
      },
      category: 'building',
      unlocked: false,
      purchased: false,
    },
    building_boost_2: {
      name: '💼 랜드마크 빌딩',
      desc: '빌딩 수익 2배',
      cost: 15000000000,
      icon: '💼',
      unlockCondition: () => getBuildings() >= 15,
      effect: () => {
        BASE_RENT.building *= 2
      },
      category: 'building',
      unlocked: false,
      purchased: false,
    },
    building_boost_3: {
      name: '🏢 초고층 마천루',
      desc: '빌딩 수익 2배',
      cost: 30000000000,
      icon: '🏢',
      unlockCondition: () => getBuildings() >= 30,
      effect: () => {
        BASE_RENT.building *= 2
      },
      category: 'building',
      unlocked: false,
      purchased: false,
    },
    building_boost_4: {
      name: '💎 다이아몬드 빌딩',
      desc: '빌딩 수익 2배',
      cost: 60000000000,
      icon: '💎',
      unlockCondition: () => getBuildings() >= 40,
      effect: () => {
        BASE_RENT.building *= 2
      },
      category: 'building',
      unlocked: false,
      purchased: false,
    },
    building_boost_5: {
      name: '👑 킹 빌딩',
      desc: '빌딩 수익 2배',
      cost: 120000000000,
      icon: '👑',
      unlockCondition: () => getBuildings() >= 50,
      effect: () => {
        BASE_RENT.building *= 2
      },
      category: 'building',
      unlocked: false,
      purchased: false,
    },
  }
}
