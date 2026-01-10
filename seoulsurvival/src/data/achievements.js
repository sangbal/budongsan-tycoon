/**
 * 업적 정의 모듈
 * Factory 패턴을 사용하여 main.js의 로컬 변수들을 의존성으로 주입받습니다.
 */

/**
 * @typedef {Object} AchievementDependencies
 * @property {() => number} getTotalClicks - 총 클릭 수 반환
 * @property {() => number} getDeposits - 예금 수량 반환
 * @property {() => number} getSavings - 적금 수량 반환
 * @property {() => number} getBonds - 국내주식 수량 반환
 * @property {() => number} getUsStocks - 미국주식 수량 반환
 * @property {() => number} getCryptos - 코인 수량 반환
 * @property {() => number} getVillas - 빌라 수량 반환
 * @property {() => number} getOfficetels - 오피스텔 수량 반환
 * @property {() => number} getApartments - 아파트 수량 반환
 * @property {() => number} getShops - 상가 수량 반환
 * @property {() => number} getBuildings - 빌딩 수량 반환
 * @property {() => number} getTotalProperties - 총 부동산 수 반환
 * @property {() => number} getTotalAssets - 총 자산 반환
 * @property {() => number} getCareerLevel - 현재 직급 레벨 반환
 * @property {() => number} getTowersLifetime - 누적 타워 수 반환
 * @property {Object} UPGRADES - 업그레이드 객체
 * @property {Function} getFinancialCost - 금융상품 가격 계산 함수
 */

/**
 * 업적 배열을 생성하는 팩토리 함수
 * @param {AchievementDependencies} deps - 의존성 객체
 * @returns {Array} ACHIEVEMENTS 배열
 */
export function createAchievements(deps) {
  const {
    getTotalClicks,
    getDeposits,
    getSavings,
    getBonds,
    getUsStocks,
    getCryptos,
    getVillas,
    getOfficetels,
    getApartments,
    getShops,
    getBuildings,
    getTotalProperties,
    getTotalAssets,
    getCareerLevel,
    getTowersLifetime,
    UPGRADES,
    getFinancialCost,
  } = deps

  return [
    // === 기본 업적 (8개) ===
    {
      id: 'first_click',
      name: '첫 노동',
      desc: '첫 번째 클릭을 했다',
      icon: '👆',
      condition: () => getTotalClicks() >= 1,
      unlocked: false,
    },
    {
      id: 'first_deposit',
      name: '첫 예금',
      desc: '첫 번째 예금을 구입했다',
      icon: '💰',
      condition: () => getDeposits() >= 1,
      unlocked: false,
    },
    {
      id: 'first_savings',
      name: '첫 적금',
      desc: '첫 번째 적금을 구입했다',
      icon: '🏦',
      condition: () => getSavings() >= 1,
      unlocked: false,
    },
    {
      id: 'first_bond',
      name: '첫 국내주식',
      desc: '첫 번째 국내주식을 구입했다',
      icon: '📈',
      condition: () => getBonds() >= 1,
      unlocked: false,
    },
    {
      id: 'first_us_stock',
      name: '첫 미국주식',
      desc: '첫 번째 미국주식을 구입했다',
      icon: '🇺🇸',
      condition: () => getUsStocks() >= 1,
      unlocked: false,
    },
    {
      id: 'first_crypto',
      name: '첫 코인',
      desc: '첫 번째 코인을 구입했다',
      icon: '₿',
      condition: () => getCryptos() >= 1,
      unlocked: false,
    },
    {
      id: 'first_property',
      name: '첫 부동산',
      desc: '첫 번째 부동산을 구입했다',
      icon: '🏠',
      condition: () =>
        getVillas() + getOfficetels() + getApartments() + getShops() + getBuildings() >= 1,
      unlocked: false,
    },
    {
      id: 'first_upgrade',
      name: '첫 업그레이드',
      desc: '첫 번째 업그레이드를 구입했다',
      icon: '⚡',
      condition: () => Object.values(UPGRADES).some(upgrade => upgrade.purchased),
      unlocked: false,
    },

    // === 전문가 업적 (8개) ===
    {
      id: 'financial_expert',
      name: '금융 전문가',
      desc: '모든 금융상품을 보유했다',
      icon: '💼',
      condition: () =>
        getDeposits() > 0 &&
        getSavings() > 0 &&
        getBonds() > 0 &&
        getUsStocks() > 0 &&
        getCryptos() > 0,
      unlocked: false,
    },
    {
      id: 'property_collector',
      name: '부동산 수집가',
      desc: '5채의 부동산을 보유했다',
      icon: '🏘️',
      condition: () => getTotalProperties() >= 5,
      unlocked: false,
    },
    {
      id: 'property_tycoon',
      name: '부동산 타이쿤',
      desc: '모든 부동산 종류를 보유했다',
      icon: '🏙️',
      condition: () =>
        getVillas() > 0 &&
        getOfficetels() > 0 &&
        getApartments() > 0 &&
        getShops() > 0 &&
        getBuildings() > 0,
      unlocked: false,
    },
    {
      id: 'investment_guru',
      name: '투자 고수',
      desc: '모든 업그레이드를 구입했다',
      icon: '📊',
      condition: () => Object.values(UPGRADES).every(upgrade => upgrade.purchased),
      unlocked: false,
    },
    {
      id: 'gangnam_rich',
      name: '강남 부자',
      desc: '강남 부동산 3채를 보유했다',
      icon: '🏙️',
      condition: () => getApartments() >= 3,
      unlocked: false,
    },
    {
      id: 'global_investor',
      name: '글로벌 투자자',
      desc: '해외 투자 1억원을 달성했다',
      icon: '🌍',
      condition: () => getUsStocks() * 1000000 + getCryptos() * 1000000 >= 100000000,
      unlocked: false,
    },
    {
      id: 'crypto_expert',
      name: '암호화폐 전문가',
      desc: '코인 투자 5억원을 달성했다',
      icon: '₿',
      condition: () => {
        // 실제 코인 투자 금액 계산 (누적 구매 가격)
        let totalInvestment = 0
        for (let i = 0; i < getCryptos(); i++) {
          totalInvestment += getFinancialCost('crypto', i, 1)
        }
        return totalInvestment >= 500000000 // 5억원
      },
      unlocked: false,
    },
    {
      id: 'real_estate_agent',
      name: '부동산 중개사',
      desc: '부동산 20채를 보유했다',
      icon: '🏠',
      condition: () => getTotalProperties() >= 20,
      unlocked: false,
    },

    // === 자산 업적 (8개) ===
    // 총 자산 = 현금 + 보유 금융/부동산 자산 가치 기준
    {
      id: 'millionaire',
      name: '백만장자',
      desc: '총 자산 1억원을 달성했다',
      icon: '💎',
      condition: () => getTotalAssets() >= 100000000,
      unlocked: false,
    },
    {
      id: 'ten_millionaire',
      name: '억만장자',
      desc: '총 자산 10억원을 달성했다',
      icon: '💰',
      condition: () => getTotalAssets() >= 1000000000,
      unlocked: false,
    },
    {
      id: 'hundred_millionaire',
      name: '부자',
      desc: '총 자산 100억원을 달성했다',
      icon: '🏆',
      condition: () => getTotalAssets() >= 10000000000,
      unlocked: false,
    },
    {
      id: 'billionaire',
      name: '대부호',
      desc: '총 자산 1,000억원을 달성했다',
      icon: '👑',
      condition: () => getTotalAssets() >= 100000000000,
      unlocked: false,
    },
    {
      id: 'trillionaire',
      name: '재벌',
      desc: '총 자산 1조원을 달성했다',
      icon: '🏰',
      condition: () => getTotalAssets() >= 1000000000000,
      unlocked: false,
    },
    {
      id: 'global_rich',
      name: '세계적 부자',
      desc: '총 자산 10조원을 달성했다',
      icon: '🌍',
      condition: () => getTotalAssets() >= 10000000000000,
      unlocked: false,
    },
    {
      id: 'legendary_rich',
      name: '전설의 부자',
      desc: '총 자산 100조원을 달성했다',
      icon: '⭐',
      condition: () => getTotalAssets() >= 100000000000000,
      unlocked: false,
    },
    {
      id: 'god_rich',
      name: '신의 부자',
      desc: '총 자산 1,000조원을 달성했다',
      icon: '✨',
      condition: () => getTotalAssets() >= 1000000000000000,
      unlocked: false,
    },

    // === 커리어 업적 (8개) ===
    {
      id: 'career_starter',
      name: '직장인',
      desc: '계약직으로 승진했다',
      icon: '👔',
      condition: () => getCareerLevel() >= 1,
      unlocked: false,
    },
    {
      id: 'employee',
      name: '정규직',
      desc: '사원으로 승진했다',
      icon: '👨‍💼',
      condition: () => getCareerLevel() >= 2,
      unlocked: false,
    },
    {
      id: 'deputy_director',
      name: '팀장',
      desc: '과장으로 승진했다',
      icon: '👨‍💻',
      condition: () => getCareerLevel() >= 4,
      unlocked: false,
    },
    {
      id: 'executive',
      name: '임원',
      desc: '상무로 승진했다',
      icon: '👨‍🎓',
      condition: () => getCareerLevel() >= 7,
      unlocked: false,
    },
    {
      id: 'ceo',
      name: 'CEO',
      desc: 'CEO가 되었다',
      icon: '👑',
      condition: () => getCareerLevel() >= 9,
      unlocked: false,
    },
    // 재벌 회장: 총 자산 1조 기준
    {
      id: 'chaebol_chairman',
      name: '재벌 회장',
      desc: '자산 1조원을 달성했다',
      icon: '🏆',
      condition: () => getTotalAssets() >= 1000000000000,
      unlocked: false,
    },
    {
      id: 'global_ceo',
      name: '글로벌 CEO',
      desc: '해외 진출을 달성했다',
      icon: '🌍',
      condition: () => getUsStocks() >= 10 && getCryptos() >= 10,
      unlocked: false,
    },
    // 전설의 CEO: CEO + 총 자산 10조 + 서울타워 1개 이상 (프레스티지 경험 포함)
    {
      id: 'legendary_ceo',
      name: '전설의 CEO',
      desc: '모든 목표를 달성했다',
      icon: '⭐',
      condition: () =>
        getCareerLevel() >= 9 && getTotalAssets() >= 10000000000000 && getTowersLifetime() >= 1,
      unlocked: false,
    },
  ]
}
