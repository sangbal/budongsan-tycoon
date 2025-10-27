/**
 * 메인 게임 로직 및 상태 관리
 */

import { GameBalance } from './balance.js';
import { UIRenderer } from '../ui/renderer.js';
import { formatNumber, createClickEffect, createParticle, safeSetItem, safeGetItem } from '../utils/helpers.js';

export class Game {
  constructor() {
    this.balance = new GameBalance();
    this.renderer = null;
    this.gameState = this.getInitialState();
    this.gameLoop = null;
    this.lastSaveTime = 0;
    this.saveInterval = 10000; // 10초마다 자동 저장
    
    this.init();
  }

  /**
   * 게임 초기화
   */
  async init() {
    // 밸런스 데이터 로드 대기
    await this.balance.loadItems();
    
    // 렌더러 초기화
    this.renderer = new UIRenderer(this.gameState, this.balance);
    
    // 게임 상태 로드
    this.loadGame();
    
    // 이벤트 리스너 설정
    this.setupEventListeners();
    
    // 게임 루프 시작
    this.startGameLoop();
    
    console.log('🎮 게임 초기화 완료');
  }

  /**
   * 초기 게임 상태
   */
  getInitialState() {
    return {
      cash: 0,
      totalClicks: 0,
      totalRPS: 0,
      incomePerClick: 0,
      totalEarnings: 0,
      gameStartTime: Date.now(),
      financial: {},
      realEstate: {},
      upgrades: {},
      unlockedProducts: {},
      purchaseMode: 'buy',
      purchaseQuantity: 1
    };
  }

  /**
   * 이벤트 리스너 설정
   */
  setupEventListeners() {
    // 노동 버튼
    const workButton = document.getElementById('work');
    if (workButton) {
      workButton.addEventListener('click', (e) => this.handleWorkClick(e));
    }

    // 상점 버튼들
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn') && e.target.dataset.type && e.target.dataset.id) {
        this.handleShopClick(e);
      }
    });

    // 업그레이드 클릭
    document.addEventListener('click', (e) => {
      if (e.target.closest('.upgrade-item')) {
        this.handleUpgradeClick(e);
      }
    });

    // 탭 전환
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-btn')) {
        this.handleTabSwitch(e);
      }
    });

    // 모드 전환
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('mode-toggle')) {
        this.handleModeToggle(e);
      }
    });

    // 수량 선택
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quantity-selector')) {
        this.handleQuantitySelect(e);
      }
    });

    // 새로 시작 버튼
    const resetButton = document.getElementById('reset');
    if (resetButton) {
      resetButton.addEventListener('click', () => this.resetGame());
    }

    // 키보드 단축키
    document.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });
  }

  /**
   * 노동 클릭 처리
   */
  handleWorkClick(e) {
    const currentCareer = this.balance.getCurrentCareer(this.gameState.totalClicks);
    const income = Math.floor(currentCareer.salary / 3600 * currentCareer.multiplier);
    
    this.gameState.cash += income;
    this.gameState.totalClicks++;
    this.gameState.totalEarnings += income;

    // 클릭 이펙트
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    createClickEffect(x, y, `+${formatNumber(income)}원`);
    createParticle(x, y, '💼');

    // 버튼 애니메이션
    e.target.classList.add('clicked');
    setTimeout(() => e.target.classList.remove('clicked'), 300);

    this.updateIncomePerClick();
    this.checkNewUnlocks();
    this.saveGame();
  }

  /**
   * 상점 클릭 처리
   */
  handleShopClick(e) {
    const type = e.target.dataset.type;
    const id = e.target.dataset.id;
    const count = this.gameState[type][id] || 0;
    const cost = this.balance.getCost(type, id, count);
    const isUnlocked = this.balance.isUnlocked(type, id, this.gameState);

    if (!isUnlocked || this.gameState.cash < cost) return;

    // 구매 처리
    this.gameState.cash -= cost;
    this.gameState[type][id] = (this.gameState[type][id] || 0) + this.gameState.purchaseQuantity;

    // 구매 이펙트
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    createParticle(x, y, '💰');
    e.target.classList.add('clicked');
    setTimeout(() => e.target.classList.remove('clicked'), 300);

    this.updateTotalRPS();
    this.checkNewUnlocks();
    this.saveGame();
  }

  /**
   * 업그레이드 클릭 처리
   */
  handleUpgradeClick(e) {
    const upgradeElement = e.target.closest('.upgrade-item');
    const upgradeId = upgradeElement.dataset.id;
    
    // 업그레이드 로직 구현
    console.log('업그레이드 클릭:', upgradeId);
  }

  /**
   * 탭 전환 처리
   */
  handleTabSwitch(e) {
    const tabId = e.target.dataset.tab;
    
    // 모든 탭 비활성화
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // 모든 네비 버튼 비활성화
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // 선택된 탭 활성화
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
      targetTab.classList.add('active');
    }
    
    e.target.classList.add('active');
  }

  /**
   * 모드 전환 처리
   */
  handleModeToggle(e) {
    const mode = e.target.dataset.mode;
    
    // 모든 모드 버튼 비활성화
    document.querySelectorAll('.mode-toggle').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // 선택된 모드 활성화
    e.target.classList.add('active');
    this.gameState.purchaseMode = mode;
    
    this.renderer.updateButtonStates();
  }

  /**
   * 수량 선택 처리
   */
  handleQuantitySelect(e) {
    const quantity = parseInt(e.target.dataset.quantity);
    
    // 모든 수량 버튼 비활성화
    document.querySelectorAll('.quantity-selector').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // 선택된 수량 활성화
    e.target.classList.add('active');
    this.gameState.purchaseQuantity = quantity;
    
    this.renderer.updateButtonStates();
  }

  /**
   * 키보드 입력 처리
   */
  handleKeyboard(e) {
    // 스페이스바로 노동
    if (e.code === 'Space') {
      e.preventDefault();
      const workButton = document.getElementById('work');
      if (workButton) {
        workButton.click();
      }
    }
    
    // 숫자키로 수량 선택
    if (e.code >= 'Digit1' && e.code <= 'Digit3') {
      const quantity = parseInt(e.code.replace('Digit', ''));
      const quantityButton = document.querySelector(`[data-quantity="${quantity}"]`);
      if (quantityButton) {
        quantityButton.click();
      }
    }
  }

  /**
   * 게임 루프 시작
   */
  startGameLoop() {
    this.gameLoop = setInterval(() => {
      this.update();
    }, 1000); // 1초마다 업데이트
  }

  /**
   * 게임 업데이트
   */
  update() {
    // 수익 추가
    this.addIncome();
    
    // UI 업데이트
    this.renderer.updateUI();
    
    // 자동 저장
    const now = Date.now();
    if (now - this.lastSaveTime > this.saveInterval) {
      this.saveGame();
      this.lastSaveTime = now;
    }
  }

  /**
   * 수익 추가
   */
  addIncome() {
    if (this.gameState.totalRPS > 0) {
      this.gameState.cash += this.gameState.totalRPS;
      this.gameState.totalEarnings += this.gameState.totalRPS;
    }
  }

  /**
   * 총 RPS 업데이트
   */
  updateTotalRPS() {
    let totalRPS = 0;
    
    // 금융상품 수익
    Object.entries(this.gameState.financial).forEach(([id, count]) => {
      if (count > 0) {
        totalRPS += this.balance.getIncome('financial', id, count);
      }
    });
    
    // 부동산 수익
    Object.entries(this.gameState.realEstate).forEach(([id, count]) => {
      if (count > 0) {
        totalRPS += this.balance.getIncome('realEstate', id, count);
      }
    });
    
    this.gameState.totalRPS = totalRPS;
  }

  /**
   * 클릭당 수익 업데이트
   */
  updateIncomePerClick() {
    const currentCareer = this.balance.getCurrentCareer(this.gameState.totalClicks);
    this.gameState.incomePerClick = Math.floor(currentCareer.salary / 3600 * currentCareer.multiplier);
  }

  /**
   * 새 해금 확인
   */
  checkNewUnlocks() {
    // 금융상품 해금 확인
    this.balance.getAllFinancial().forEach(item => {
      const isUnlocked = this.balance.isUnlocked('financial', item.id, this.gameState);
      if (isUnlocked && !this.gameState.unlockedProducts[item.id]) {
        this.gameState.unlockedProducts[item.id] = true;
        this.showUnlockNotification(item);
      }
    });
    
    // 부동산 해금 확인
    this.balance.getAllRealEstate().forEach(item => {
      const isUnlocked = this.balance.isUnlocked('realEstate', item.id, this.gameState);
      if (isUnlocked && !this.gameState.unlockedProducts[item.id]) {
        this.gameState.unlockedProducts[item.id] = true;
        this.showUnlockNotification(item);
      }
    });
  }

  /**
   * 해금 알림 표시
   */
  showUnlockNotification(item) {
    // 알림 로직 구현
    console.log('새로운 해금:', item.name);
  }

  /**
   * 게임 저장
   */
  saveGame() {
    const saveData = {
      ...this.gameState,
      lastSaveTime: Date.now()
    };
    
    safeSetItem('budongsan-tycoon-save', saveData);
  }

  /**
   * 게임 로드
   */
  loadGame() {
    const saveData = safeGetItem('budongsan-tycoon-save');
    
    if (saveData) {
      // 게임 시작 시간은 새로 설정
      this.gameState = {
        ...saveData,
        gameStartTime: Date.now()
      };
      
      // 수익 계산 업데이트
      this.updateTotalRPS();
      this.updateIncomePerClick();
      
      console.log('💾 게임 데이터 로드 완료');
    } else {
      console.log('🆕 새 게임 시작');
    }
  }

  /**
   * 게임 리셋
   */
  resetGame() {
    if (confirm('정말로 새로 시작하시겠습니까? 모든 진행 상황이 사라집니다.')) {
      this.gameState = this.getInitialState();
      localStorage.removeItem('budongsan-tycoon-save');
      this.updateTotalRPS();
      this.updateIncomePerClick();
      console.log('🔄 게임 리셋 완료');
    }
  }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
