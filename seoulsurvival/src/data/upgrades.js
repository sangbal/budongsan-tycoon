/**
 * 업그레이드 정의 모듈
 * Factory 패턴을 사용하여 main.js의 로컬 변수들을 의존성으로 주입받습니다.
 */

/**
 * @typedef {Object} UpgradeDependencies
 * @property {() => number} getCareerLevel - 현재 직급 레벨 반환
 * @property {() => number} getClickMultiplier - 클릭 배수 반환
 * @property {(v: number) => void} setClickMultiplier - 클릭 배수 설정
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
 * @property {() => void} updateAutoWorkUI - 자동 업무 UI 업데이트
 * @property {() => void} setAutoClickEnabled - 자동 클릭 활성화 설정
 * @property {() => void} incrementManagerLevel - 관리인 레벨 증가
 * @property {Object} FINANCIAL_INCOME - 금융상품 수익 테이블
 * @property {Object} BASE_RENT - 부동산 기본 월세 테이블
 * @property {() => number} getRentMultiplier - 월세 배수 반환
 * @property {(v: number) => void} setRentMultiplier - 월세 배수 설정
 */

/**
 * 업그레이드 객체를 생성하는 팩토리 함수
 * @param {UpgradeDependencies} deps - 의존성 객체
 * @returns {Object} UPGRADES 객체
 */
export function createUpgrades(deps) {
  const {
    getCareerLevel,
    getClickMultiplier,
    setClickMultiplier,
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
    updateAutoWorkUI,
    setAutoClickEnabled,
    incrementManagerLevel,
    FINANCIAL_INCOME,
    BASE_RENT,
    getRentMultiplier,
    setRentMultiplier,
  } = deps

  return {
    // === 노동 관련 (재밸런싱) ===
    part_time_job: {
      name: '🍕 아르바이트 경험',
      desc: '클릭 수익 1.2배',
      cost: 50000,
      icon: '🍕',
      // 직급 연동: 계약직부터 해금
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
      // 직급 연동: 사원부터 해금
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
      // 직급 연동: 대리부터 해금
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
      // 직급 연동: 과장부터 해금
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
      // 직급 연동: 차장부터 해금
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
      // 직급 연동: 부장부터 해금
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
      // 직급 연동: 부장부터 해금
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
      // 직급 연동: 상무부터 해금
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
      // 직급 연동: 상무부터 해금
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
      // 직급 연동: 전무부터 해금
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
      // 직급 연동: 전무부터 해금
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
      // 직급 연동: 전무부터 해금
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
      // 직급 연동: CEO 이후(추가 성장용)로 해금
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
      // 직급 연동: CEO 이후(최종 성장용)로 해금
      unlockCondition: () => getCareerLevel() >= 9 && getTotalClicks() >= 30000,
      effect: () => {
        setClickMultiplier(getClickMultiplier() * 2.0)
      },
      category: 'labor',
      unlocked: false,
      purchased: false,
    },

    // === 예금 관련 ===
    deposit_boost_1: {
      name: '💰 예금 이자율 상승',
      desc: '예금 수익 2배',
      cost: 100000, // 기본가 5만원 × 2
      icon: '💰',
      unlockCondition: () => getDeposits() >= 5,
      effect: () => {
        FINANCIAL_INCOME.deposit *= 2
      },
      category: 'deposit',
      unlocked: false,
      purchased: false,
    },
    deposit_boost_2: {
      name: '💎 프리미엄 예금',
      desc: '예금 수익 2배',
      cost: 250000, // 기본가 5만원 × 5
      icon: '💎',
      unlockCondition: () => getDeposits() >= 15,
      effect: () => {
        FINANCIAL_INCOME.deposit *= 2
      },
      category: 'deposit',
      unlocked: false,
      purchased: false,
    },
    deposit_boost_3: {
      name: '💠 다이아몬드 예금',
      desc: '예금 수익 2배',
      cost: 500000, // 기본가 5만원 × 10
      icon: '💠',
      unlockCondition: () => getDeposits() >= 30,
      effect: () => {
        FINANCIAL_INCOME.deposit *= 2
      },
      category: 'deposit',
      unlocked: false,
      purchased: false,
    },
    deposit_boost_4: {
      name: '💍 플래티넘 예금',
      desc: '예금 수익 2배',
      cost: 1000000, // 기본가 5만원 × 20
      icon: '💍',
      unlockCondition: () => getDeposits() >= 40,
      effect: () => {
        FINANCIAL_INCOME.deposit *= 2
      },
      category: 'deposit',
      unlocked: false,
      purchased: false,
    },
    deposit_boost_5: {
      name: '👑 킹 예금',
      desc: '예금 수익 2배',
      cost: 2000000, // 기본가 5만원 × 40
      icon: '👑',
      unlockCondition: () => getDeposits() >= 50,
      effect: () => {
        FINANCIAL_INCOME.deposit *= 2
      },
      category: 'deposit',
      unlocked: false,
      purchased: false,
    },

    // === 적금 관련 ===
    savings_boost_1: {
      name: '🏦 적금 복리 효과',
      desc: '적금 수익 2배',
      cost: 1000000, // 기본가 50만원 × 2
      icon: '🏦',
      unlockCondition: () => getSavings() >= 5,
      effect: () => {
        FINANCIAL_INCOME.savings *= 2
      },
      category: 'savings',
      unlocked: false,
      purchased: false,
    },
    savings_boost_2: {
      name: '🏅 골드 적금',
      desc: '적금 수익 2배',
      cost: 2500000, // 기본가 50만원 × 5
      icon: '🏅',
      unlockCondition: () => getSavings() >= 15,
      effect: () => {
        FINANCIAL_INCOME.savings *= 2
      },
      category: 'savings',
      unlocked: false,
      purchased: false,
    },
    savings_boost_3: {
      name: '💍 플래티넘 적금',
      desc: '적금 수익 2배',
      cost: 5000000, // 기본가 50만원 × 10
      icon: '💍',
      unlockCondition: () => getSavings() >= 30,
      effect: () => {
        FINANCIAL_INCOME.savings *= 2
      },
      category: 'savings',
      unlocked: false,
      purchased: false,
    },
    savings_boost_4: {
      name: '💠 다이아몬드 적금',
      desc: '적금 수익 2배',
      cost: 10000000, // 기본가 50만원 × 20
      icon: '💠',
      unlockCondition: () => getSavings() >= 40,
      effect: () => {
        FINANCIAL_INCOME.savings *= 2
      },
      category: 'savings',
      unlocked: false,
      purchased: false,
    },
    savings_boost_5: {
      name: '👑 킹 적금',
      desc: '적금 수익 2배',
      cost: 20000000, // 기본가 50만원 × 40
      icon: '👑',
      unlockCondition: () => getSavings() >= 50,
      effect: () => {
        FINANCIAL_INCOME.savings *= 2
      },
      category: 'savings',
      unlocked: false,
      purchased: false,
    },

    // === 주식 관련 ===
    bond_boost_1: {
      name: '📈 주식 수익률 향상',
      desc: '주식 수익 2배',
      cost: 10000000, // 기본가 500만원 × 2
      icon: '📈',
      unlockCondition: () => getBonds() >= 5,
      effect: () => {
        FINANCIAL_INCOME.bond *= 2
      },
      category: 'bond',
      unlocked: false,
      purchased: false,
    },
    bond_boost_2: {
      name: '💹 프리미엄 주식',
      desc: '주식 수익 2배',
      cost: 25000000, // 기본가 500만원 × 5
      icon: '💹',
      unlockCondition: () => getBonds() >= 15,
      effect: () => {
        FINANCIAL_INCOME.bond *= 2
      },
      category: 'bond',
      unlocked: false,
      purchased: false,
    },
    bond_boost_3: {
      name: '📊 블루칩 주식',
      desc: '주식 수익 2배',
      cost: 50000000, // 기본가 500만원 × 10
      icon: '📊',
      unlockCondition: () => getBonds() >= 30,
      effect: () => {
        FINANCIAL_INCOME.bond *= 2
      },
      category: 'bond',
      unlocked: false,
      purchased: false,
    },
    bond_boost_4: {
      name: '💎 대형주 포트폴리오',
      desc: '주식 수익 2배',
      cost: 100000000, // 기본가 500만원 × 20
      icon: '💎',
      unlockCondition: () => getBonds() >= 40,
      effect: () => {
        FINANCIAL_INCOME.bond *= 2
      },
      category: 'bond',
      unlocked: false,
      purchased: false,
    },
    bond_boost_5: {
      name: '👑 킹 주식',
      desc: '주식 수익 2배',
      cost: 200000000, // 기본가 500만원 × 40
      icon: '👑',
      unlockCondition: () => getBonds() >= 50,
      effect: () => {
        FINANCIAL_INCOME.bond *= 2
      },
      category: 'bond',
      unlocked: false,
      purchased: false,
    },

    // === 미국주식 관련 ===
    usstock_boost_1: {
      name: '🇺🇸 S&P 500 투자',
      desc: '미국주식 수익 2배',
      cost: 50000000, // 기본가 2,500만원 × 2
      icon: '🇺🇸',
      unlockCondition: () => getUsStocks() >= 5,
      effect: () => {
        FINANCIAL_INCOME.usStock *= 2
      },
      category: 'usStock',
      unlocked: false,
      purchased: false,
    },
    usstock_boost_2: {
      name: '📈 나스닥 투자',
      desc: '미국주식 수익 2배',
      cost: 125000000, // 기본가 2,500만원 × 5
      icon: '📈',
      unlockCondition: () => getUsStocks() >= 15,
      effect: () => {
        FINANCIAL_INCOME.usStock *= 2
      },
      category: 'usStock',
      unlocked: false,
      purchased: false,
    },
    usstock_boost_3: {
      name: '💎 글로벌 주식 포트폴리오',
      desc: '미국주식 수익 2배',
      cost: 250000000, // 기본가 2,500만원 × 10
      icon: '💎',
      unlockCondition: () => getUsStocks() >= 30,
      effect: () => {
        FINANCIAL_INCOME.usStock *= 2
      },
      category: 'usStock',
      unlocked: false,
      purchased: false,
    },
    usstock_boost_4: {
      name: '🌍 글로벌 대형주',
      desc: '미국주식 수익 2배',
      cost: 500000000, // 기본가 2,500만원 × 20
      icon: '🌍',
      unlockCondition: () => getUsStocks() >= 40,
      effect: () => {
        FINANCIAL_INCOME.usStock *= 2
      },
      category: 'usStock',
      unlocked: false,
      purchased: false,
    },
    usstock_boost_5: {
      name: '👑 킹 글로벌 주식',
      desc: '미국주식 수익 2배',
      cost: 1000000000, // 기본가 2,500만원 × 40
      icon: '👑',
      unlockCondition: () => getUsStocks() >= 50,
      effect: () => {
        FINANCIAL_INCOME.usStock *= 2
      },
      category: 'usStock',
      unlocked: false,
      purchased: false,
    },

    // === 코인 관련 ===
    crypto_boost_1: {
      name: '₿ 비트코인 투자',
      desc: '코인 수익 2배',
      cost: 200000000, // 기본가 1억원 × 2
      icon: '₿',
      unlockCondition: () => getCryptos() >= 5,
      effect: () => {
        FINANCIAL_INCOME.crypto *= 2
      },
      category: 'crypto',
      unlocked: false,
      purchased: false,
    },
    crypto_boost_2: {
      name: '💎 알트코인 포트폴리오',
      desc: '코인 수익 2배',
      cost: 500000000, // 기본가 1억원 × 5
      icon: '💎',
      unlockCondition: () => getCryptos() >= 15,
      effect: () => {
        FINANCIAL_INCOME.crypto *= 2
      },
      category: 'crypto',
      unlocked: false,
      purchased: false,
    },
    crypto_boost_3: {
      name: '🚀 디지털 자산 전문가',
      desc: '코인 수익 2배',
      cost: 1000000000, // 기본가 1억원 × 10
      icon: '🚀',
      unlockCondition: () => getCryptos() >= 30,
      effect: () => {
        FINANCIAL_INCOME.crypto *= 2
      },
      category: 'crypto',
      unlocked: false,
      purchased: false,
    },
    crypto_boost_4: {
      name: '🌐 메타버스 자산',
      desc: '코인 수익 2배',
      cost: 2000000000, // 기본가 1억원 × 20
      icon: '🌐',
      unlockCondition: () => getCryptos() >= 40,
      effect: () => {
        FINANCIAL_INCOME.crypto *= 2
      },
      category: 'crypto',
      unlocked: false,
      purchased: false,
    },
    crypto_boost_5: {
      name: '👑 킹 암호화폐',
      desc: '코인 수익 2배',
      cost: 4000000000, // 기본가 1억원 × 40
      icon: '👑',
      unlockCondition: () => getCryptos() >= 50,
      effect: () => {
        FINANCIAL_INCOME.crypto *= 2
      },
      category: 'crypto',
      unlocked: false,
      purchased: false,
    },

    // === 빌라 관련 ===
    villa_boost_1: {
      name: '🏘️ 빌라 리모델링',
      desc: '빌라 수익 2배',
      cost: 500000000, // 기본가 2.5억원 × 2
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
      cost: 1250000000, // 기본가 2.5억원 × 5
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
      cost: 2500000000, // 기본가 2.5억원 × 10
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
      cost: 5000000000, // 기본가 2.5억원 × 20
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
      cost: 10000000000, // 기본가 2.5억원 × 40
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
      cost: 700000000, // 기본가 3.5억원 × 2
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
      cost: 1750000000, // 기본가 3.5억원 × 5
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
      cost: 3500000000, // 기본가 3.5억원 × 10
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
      cost: 7000000000, // 기본가 3.5억원 × 20
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
      cost: 14000000000, // 기본가 3.5억원 × 40
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
      cost: 1600000000, // 기본가 8억원 × 2
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
      cost: 4000000000, // 기본가 8억원 × 5
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
      cost: 8000000000, // 기본가 8억원 × 10
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
      cost: 16000000000, // 기본가 8억원 × 20
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
      cost: 32000000000, // 기본가 8억원 × 40
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
      cost: 2400000000, // 기본가 12억원 × 2
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
      cost: 6000000000, // 기본가 12억원 × 5
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
      cost: 12000000000, // 기본가 12억원 × 10
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
      cost: 24000000000, // 기본가 12억원 × 20
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
      cost: 48000000000, // 기본가 12억원 × 40
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
      cost: 6000000000, // 기본가 30억원 × 2
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
      cost: 15000000000, // 기본가 30억원 × 5
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
      cost: 30000000000, // 기본가 30억원 × 10
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
      cost: 60000000000, // 기본가 30억원 × 20
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
      cost: 120000000000, // 기본가 30억원 × 40
      icon: '👑',
      unlockCondition: () => getBuildings() >= 50,
      effect: () => {
        BASE_RENT.building *= 2
      },
      category: 'building',
      unlocked: false,
      purchased: false,
    },

    // === 전역 업그레이드 ===
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
      unlockCondition: () => getCareerLevel() >= 8, // 전무 달성 시 해금
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
