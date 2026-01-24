/**
 * 금융상품 관련 업그레이드 정의
 * - 예금, 적금, 주식, 미국주식, 코인
 * Phase 1.3: upgrades.js 분해
 */

/**
 * 금융상품 업그레이드 팩토리
 * @param {Object} deps - 의존성 객체
 * @returns {Object} 금융상품 업그레이드 객체
 */
export function createFinancialUpgrades(deps) {
  const { getDeposits, getSavings, getBonds, getUsStocks, getCryptos, FINANCIAL_INCOME } = deps

  return {
    // === 예금 관련 ===
    deposit_boost_1: {
      name: '💰 예금 이자율 상승',
      desc: '예금 수익 2배',
      cost: 100000,
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
      cost: 250000,
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
      cost: 500000,
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
      cost: 1000000,
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
      cost: 2000000,
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
      cost: 1000000,
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
      cost: 2500000,
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
      cost: 5000000,
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
      cost: 10000000,
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
      cost: 20000000,
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
      cost: 10000000,
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
      cost: 25000000,
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
      cost: 50000000,
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
      cost: 100000000,
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
      cost: 200000000,
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
      cost: 50000000,
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
      cost: 125000000,
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
      cost: 250000000,
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
      cost: 500000000,
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
      cost: 1000000000,
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
      cost: 200000000,
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
      cost: 500000000,
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
      cost: 1000000000,
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
      cost: 2000000000,
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
      cost: 4000000000,
      icon: '👑',
      unlockCondition: () => getCryptos() >= 50,
      effect: () => {
        FINANCIAL_INCOME.crypto *= 2
      },
      category: 'crypto',
      unlocked: false,
      purchased: false,
    },
  }
}
