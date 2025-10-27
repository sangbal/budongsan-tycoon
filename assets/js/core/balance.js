/**
 * 게임 밸런싱 데이터 관리 클래스
 * JSON 데이터를 로드하고 게임 로직에 필요한 계산을 제공
 */
export class GameBalance {
  constructor() {
    this.items = null;
    this.loadItems();
  }
  
  /**
   * items.json 파일을 로드
   */
  async loadItems() {
    try {
      const response = await fetch('assets/data/items.json');
      this.items = await response.json();
      console.log('✅ 게임 데이터 로드 완료:', this.items);
    } catch (error) {
      console.error('❌ 게임 데이터 로드 실패:', error);
      // 폴백: 기본 데이터 사용
      this.items = this.getDefaultItems();
    }
  }
  
  /**
   * 기본 데이터 (폴백용)
   */
  getDefaultItems() {
    return {
      financial: [
        { id: "deposit", name: "예금", icon: "💰", baseCost: 50000, baseIncome: 5, costMultiplier: 1.15, unlockCondition: "always" },
        { id: "savings", name: "적금", icon: "🏦", baseCost: 500000, baseIncome: 75, costMultiplier: 1.15, unlockCondition: "deposit >= 1" },
        { id: "domestic_stock", name: "국내주식", icon: "📈", baseCost: 5000000, baseIncome: 1125, costMultiplier: 1.15, unlockCondition: "savings >= 1" },
        { id: "us_stock", name: "미국주식", icon: "🇺🇸", baseCost: 25000000, baseIncome: 6000, costMultiplier: 1.15, unlockCondition: "domestic_stock >= 1" },
        { id: "crypto", name: "코인", icon: "₿", baseCost: 100000000, baseIncome: 25000, costMultiplier: 1.15, unlockCondition: "us_stock >= 1" }
      ],
      realEstate: [
        { id: "villa", name: "빌라", icon: "🏘️", baseCost: 250000000, baseIncome: 8438, costMultiplier: 1.15, unlockCondition: "crypto >= 1" },
        { id: "officetel", name: "오피스텔", icon: "🏢", baseCost: 350000000, baseIncome: 17719, costMultiplier: 1.15, unlockCondition: "villa >= 1" },
        { id: "apartment", name: "아파트", icon: "🏬", baseCost: 800000000, baseIncome: 60750, costMultiplier: 1.15, unlockCondition: "officetel >= 1" },
        { id: "shop", name: "상가", icon: "🏪", baseCost: 1200000000, baseIncome: 137000, costMultiplier: 1.15, unlockCondition: "apartment >= 1" },
        { id: "building", name: "빌딩", icon: "🏗️", baseCost: 3000000000, baseIncome: 514000, costMultiplier: 1.15, unlockCondition: "shop >= 1" }
      ],
      careers: [
        { id: "part_time", name: "알바", level: 0, multiplier: 1.0, requiredClicks: 0, salary: 20000000, achievement: null },
        { id: "contract", name: "계약직", level: 1, multiplier: 1.5, requiredClicks: 20, salary: 30000000, achievement: "직장인" },
        { id: "employee", name: "사원", level: 2, multiplier: 2.0, requiredClicks: 40, salary: 40000000, achievement: "정규직" },
        { id: "assistant", name: "대리", level: 3, multiplier: 2.5, requiredClicks: 120, salary: 50000000, achievement: null },
        { id: "manager", name: "과장", level: 4, multiplier: 3.0, requiredClicks: 240, salary: 60000000, achievement: "팀장" },
        { id: "deputy", name: "차장", level: 5, multiplier: 3.5, requiredClicks: 400, salary: 70000000, achievement: null },
        { id: "director", name: "부장", level: 6, multiplier: 4.0, requiredClicks: 600, salary: 80000000, achievement: null },
        { id: "executive", name: "상무", level: 7, multiplier: 5.0, requiredClicks: 800, salary: 100000000, achievement: "임원" },
        { id: "vice_president", name: "전무", level: 8, multiplier: 10.0, requiredClicks: 1200, salary: 200000000, achievement: null },
        { id: "ceo", name: "CEO", level: 9, multiplier: 25.0, requiredClicks: 2000, salary: 500000000, achievement: "CEO" }
      ]
    };
  }
  
  /**
   * 특정 아이템 정보 가져오기
   */
  getItem(type, id) {
    if (!this.items || !this.items[type]) return null;
    return this.items[type].find(item => item.id === id);
  }
  
  /**
   * 아이템 구매 비용 계산
   */
  getCost(type, id, count) {
    const item = this.getItem(type, id);
    if (!item) return 0;
    return Math.floor(item.baseCost * Math.pow(item.costMultiplier, count));
  }
  
  /**
   * 아이템 수익 계산
   */
  getIncome(type, id, count) {
    const item = this.getItem(type, id);
    if (!item) return 0;
    return item.baseIncome * count;
  }
  
  /**
   * 아이템 해금 조건 확인
   */
  isUnlocked(type, id, gameState) {
    const item = this.getItem(type, id);
    if (!item) return false;
    if (item.unlockCondition === 'always') return true;
    
    return this.evaluateCondition(item.unlockCondition, gameState);
  }
  
  /**
   * 해금 조건 평가
   */
  evaluateCondition(condition, gameState) {
    if (!condition || condition === 'always') return true;
    
    try {
      // "deposit >= 1" 형태의 조건을 평가
      const [itemId, operator, value] = condition.split(' ');
      const currentValue = this.getCurrentValue(itemId, gameState);
      const targetValue = parseInt(value);
      
      switch (operator) {
        case '>=':
          return currentValue >= targetValue;
        case '>':
          return currentValue > targetValue;
        case '==':
          return currentValue === targetValue;
        case '<=':
          return currentValue <= targetValue;
        case '<':
          return currentValue < targetValue;
        default:
          return false;
      }
    } catch (error) {
      console.error('조건 평가 실패:', condition, error);
      return false;
    }
  }
  
  /**
   * 게임 상태에서 특정 값 가져오기
   */
  getCurrentValue(itemId, gameState) {
    // 금융상품
    if (gameState.financial && gameState.financial[itemId] !== undefined) {
      return gameState.financial[itemId];
    }
    
    // 부동산
    if (gameState.realEstate && gameState.realEstate[itemId] !== undefined) {
      return gameState.realEstate[itemId];
    }
    
    // 기타 게임 상태
    if (gameState[itemId] !== undefined) {
      return gameState[itemId];
    }
    
    return 0;
  }
  
  /**
   * 모든 금융상품 목록 가져오기
   */
  getAllFinancial() {
    return this.items ? this.items.financial : [];
  }
  
  /**
   * 모든 부동산 목록 가져오기
   */
  getAllRealEstate() {
    return this.items ? this.items.realEstate : [];
  }
  
  /**
   * 모든 직업 목록 가져오기
   */
  getAllCareers() {
    return this.items ? this.items.careers : [];
  }
  
  /**
   * 현재 직업 정보 가져오기
   */
  getCurrentCareer(totalClicks) {
    const careers = this.getAllCareers();
    let currentCareer = careers[0]; // 기본: 알바
    
    for (const career of careers) {
      if (totalClicks >= career.requiredClicks) {
        currentCareer = career;
      } else {
        break;
      }
    }
    
    return currentCareer;
  }
  
  /**
   * 다음 직업 정보 가져오기
   */
  getNextCareer(totalClicks) {
    const careers = this.getAllCareers();
    const currentCareer = this.getCurrentCareer(totalClicks);
    const currentIndex = careers.findIndex(c => c.id === currentCareer.id);
    
    return currentIndex < careers.length - 1 ? careers[currentIndex + 1] : null;
  }
}
