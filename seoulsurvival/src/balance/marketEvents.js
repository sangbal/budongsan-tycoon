/**
 * Seoul Survival - 시장 이벤트 밸런스 설정
 *
 * 이 파일에서 랜덤 시장 이벤트의 효과와 지속시간을 조정할 수 있습니다.
 *
 * 구조:
 * - name: 이벤트 이름
 * - duration: 지속 시간 (밀리초)
 * - color: UI 표시 색상
 * - effects: 카테고리별 수익 배수 (1.0 = 변화 없음)
 *   - financial: { deposit, savings, bond, usStock, crypto }
 *   - property: { villa, officetel, apartment, shop, building }
 * - description: 이벤트 설명
 */

export const MARKET_EVENTS = [
  // ===== 부동산 호재 이벤트 =====
  {
    id: 'gangnam_boom',
    nameKey: 'event.gangnamBoom.name',
    descKey: 'event.gangnamBoom.desc',
    duration: 50_000,
    color: '#4CAF50',
    effects: {
      property: { apartment: 2.5, villa: 1.4, officetel: 1.2 },
    },
  },
  {
    id: 'jeonse_crisis',
    nameKey: 'event.jeonseCrisis.name',
    descKey: 'event.jeonseCrisis.desc',
    duration: 60_000,
    color: '#2196F3',
    effects: {
      property: { villa: 2.5, officetel: 2.5, apartment: 1.8 },
    },
  },
  {
    id: 'commercial_boom',
    nameKey: 'event.commercialBoom.name',
    descKey: 'event.commercialBoom.desc',
    duration: 50_000,
    color: '#FF9800',
    effects: {
      property: { shop: 2.5, building: 1.6 },
    },
  },
  {
    id: 'office_demand',
    nameKey: 'event.officeDemand.name',
    descKey: 'event.officeDemand.desc',
    duration: 55_000,
    color: '#9C27B0',
    effects: {
      property: { building: 2.5, shop: 1.4, officetel: 1.2 },
    },
  },

  // ===== 금융/리스크 자산 호재 이벤트 =====
  {
    id: 'rate_cut',
    nameKey: 'event.rateCut.name',
    descKey: 'event.rateCut.desc',
    duration: 70_000,
    color: '#2196F3',
    effects: {
      financial: { deposit: 0.7, savings: 0.8, bond: 2.0, usStock: 1.5 },
    },
  },
  {
    id: 'stock_boom',
    nameKey: 'event.stockBoom.name',
    descKey: 'event.stockBoom.desc',
    duration: 60_000,
    color: '#4CAF50',
    effects: {
      financial: { bond: 2.5, usStock: 2.0, crypto: 1.5 },
    },
  },
  {
    id: 'fed_qe',
    nameKey: 'event.fedQE.name',
    descKey: 'event.fedQE.desc',
    duration: 70_000,
    color: '#2196F3',
    effects: {
      financial: { usStock: 2.5, crypto: 1.8, bond: 1.3 },
    },
  },
  {
    id: 'bitcoin_surge',
    nameKey: 'event.bitcoinSurge.name',
    descKey: 'event.bitcoinSurge.desc',
    duration: 45_000,
    color: '#FF9800',
    effects: {
      financial: { crypto: 2.5, usStock: 1.2 },
    },
  },

  // ===== 부정 이벤트 (강도 캡: 0.7) =====
  {
    id: 'financial_crisis',
    nameKey: 'event.financialCrisis.name',
    descKey: 'event.financialCrisis.desc',
    duration: 90_000,
    color: '#F44336',
    effects: {
      financial: { bond: 0.7, usStock: 0.7, crypto: 0.7 },
      property: { shop: 0.7, building: 0.7 },
    },
  },
  {
    id: 'bank_crisis',
    nameKey: 'event.bankCrisis.name',
    descKey: 'event.bankCrisis.desc',
    duration: 75_000,
    color: '#9C27B0',
    effects: {
      financial: { deposit: 0.7, savings: 0.7, bond: 0.8 },
    },
  },
  {
    id: 'stock_crash',
    nameKey: 'event.stockCrash.name',
    descKey: 'event.stockCrash.desc',
    duration: 75_000,
    color: '#F44336',
    effects: {
      financial: { bond: 0.7, usStock: 0.7, crypto: 0.7 },
    },
  },
  {
    id: 'crypto_regulation',
    nameKey: 'event.cryptoRegulation.name',
    descKey: 'event.cryptoRegulation.desc',
    duration: 75_000,
    color: '#9C27B0',
    effects: {
      financial: { crypto: 0.7 },
    },
  },
]

// ===== 이벤트 설정 (참고용) =====
// 이벤트 발생 로직은 main.js에서 관리
// 여기서는 이벤트 데이터만 정의
