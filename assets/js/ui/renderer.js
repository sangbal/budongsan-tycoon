/**
 * UI 렌더링 및 업데이트 관리
 */

import { formatNumber, formatTime, formatPercentage, createClickEffect, createParticle, getUpgradeRarity, getRarityColor, getRarityName } from '../utils/helpers.js';

export class UIRenderer {
  constructor(gameState, balance) {
    this.gameState = gameState;
    this.balance = balance;
    this.incomeIncreaseElements = [];
  }

  /**
   * 메인 UI 업데이트
   */
  updateUI() {
    this.updateHeader();
    this.updateWorkArea();
    this.updateShopArea();
    this.updateStatsTab();
    this.updateUpgrades();
  }

  /**
   * 헤더 정보 업데이트
   */
  updateHeader() {
    const cashElement = document.getElementById('cash');
    const rpsElement = document.getElementById('rps');
    const careerElement = document.getElementById('career');
    const progressElement = document.getElementById('progress');
    const progressBarElement = document.getElementById('progressBar');

    if (cashElement) {
      cashElement.textContent = formatNumber(this.gameState.cash);
    }

    if (rpsElement) {
      rpsElement.textContent = formatNumber(this.gameState.totalRPS);
    }

    if (careerElement) {
      const currentCareer = this.balance.getCurrentCareer(this.gameState.totalClicks);
      careerElement.textContent = currentCareer.name;
    }

    if (progressElement && progressBarElement) {
      const currentCareer = this.balance.getCurrentCareer(this.gameState.totalClicks);
      const nextCareer = this.balance.getNextCareer(this.gameState.totalClicks);
      
      if (nextCareer) {
        const progress = (this.gameState.totalClicks - currentCareer.requiredClicks) / 
                        (nextCareer.requiredClicks - currentCareer.requiredClicks);
        progressBarElement.style.width = (progress * 100) + '%';
        progressElement.textContent = `${this.gameState.totalClicks}/${nextCareer.requiredClicks}`;
      } else {
        progressBarElement.style.width = '100%';
        progressElement.textContent = '최고 등급';
      }
    }
  }

  /**
   * 노동 영역 업데이트
   */
  updateWorkArea() {
    const workButton = document.getElementById('work');
    const workIncomeElement = document.getElementById('workIncome');
    const careerInfoElement = document.getElementById('careerInfo');

    if (workButton) {
      const currentCareer = this.balance.getCurrentCareer(this.gameState.totalClicks);
      workButton.textContent = `💼 ${currentCareer.name}`;
    }

    if (workIncomeElement) {
      const currentCareer = this.balance.getCurrentCareer(this.gameState.totalClicks);
      const incomePerClick = Math.floor(currentCareer.salary / 3600 * currentCareer.multiplier);
      workIncomeElement.textContent = `클릭당 ${formatNumber(incomePerClick)}원`;
    }

    if (careerInfoElement) {
      const currentCareer = this.balance.getCurrentCareer(this.gameState.totalClicks);
      const nextCareer = this.balance.getNextCareer(this.gameState.totalClicks);
      
      if (nextCareer) {
        const remaining = nextCareer.requiredClicks - this.gameState.totalClicks;
        careerInfoElement.innerHTML = `
          <div class="muted">다음: ${nextCareer.name}</div>
          <div class="muted">남은 클릭: ${formatNumber(remaining)}회</div>
        `;
      } else {
        careerInfoElement.innerHTML = '<div class="muted">최고 등급 달성!</div>';
      }
    }
  }

  /**
   * 상점 영역 업데이트
   */
  updateShopArea() {
    this.updateFinancialItems();
    this.updateRealEstateItems();
    this.updateButtonStates();
  }

  /**
   * 금융상품 업데이트
   */
  updateFinancialItems() {
    const financialList = document.getElementById('financialList');
    if (!financialList) return;

    const financialItems = this.balance.getAllFinancial();
    financialList.innerHTML = '';

    financialItems.forEach(item => {
      const count = this.gameState.financial[item.id] || 0;
      const cost = this.balance.getCost('financial', item.id, count);
      const income = this.balance.getIncome('financial', item.id, count);
      const isUnlocked = this.balance.isUnlocked('financial', item.id, this.gameState);
      const canAfford = this.gameState.cash >= cost;

      const row = document.createElement('div');
      row.className = `row ${!isUnlocked ? 'locked' : ''}`;
      
      row.innerHTML = `
        <div class="meta">
          <div class="title">${item.icon} ${item.name} <span class="pill">${count}</span></div>
          <div class="desc">
            <b>${formatNumber(income)}원/초</b> • 
            ${item.description}
          </div>
        </div>
        <button class="btn ${canAfford && isUnlocked ? 'affordable' : ''}" 
                data-type="financial" 
                data-id="${item.id}"
                ${!isUnlocked ? 'disabled' : ''}>
          ${formatNumber(cost)}원
        </button>
      `;

      financialList.appendChild(row);
    });
  }

  /**
   * 부동산 업데이트
   */
  updateRealEstateItems() {
    const realEstateList = document.getElementById('realEstateList');
    if (!realEstateList) return;

    const realEstateItems = this.balance.getAllRealEstate();
    realEstateList.innerHTML = '';

    realEstateItems.forEach(item => {
      const count = this.gameState.realEstate[item.id] || 0;
      const cost = this.balance.getCost('realEstate', item.id, count);
      const income = this.balance.getIncome('realEstate', item.id, count);
      const isUnlocked = this.balance.isUnlocked('realEstate', item.id, this.gameState);
      const canAfford = this.gameState.cash >= cost;

      const row = document.createElement('div');
      row.className = `row ${!isUnlocked ? 'locked' : ''}`;
      
      row.innerHTML = `
        <div class="meta">
          <div class="title">${item.icon} ${item.name} <span class="pill">${count}</span></div>
          <div class="desc">
            <b>${formatNumber(income)}원/초</b> • 
            ${item.description}
          </div>
        </div>
        <button class="btn ${canAfford && isUnlocked ? 'affordable' : ''}" 
                data-type="realEstate" 
                data-id="${item.id}"
                ${!isUnlocked ? 'disabled' : ''}>
          ${formatNumber(cost)}원
        </button>
      `;

      realEstateList.appendChild(row);
    });
  }

  /**
   * 버튼 상태 업데이트
   */
  updateButtonStates() {
    const buttons = document.querySelectorAll('.btn[data-type][data-id]');
    
    buttons.forEach(button => {
      const type = button.dataset.type;
      const id = button.dataset.id;
      const count = this.gameState[type][id] || 0;
      const cost = this.balance.getCost(type, id, count);
      const isUnlocked = this.balance.isUnlocked(type, id, this.gameState);
      const canAfford = this.gameState.cash >= cost;

      button.disabled = !isUnlocked;
      button.textContent = `${formatNumber(cost)}원`;
      
      if (canAfford && isUnlocked) {
        button.classList.add('affordable');
      } else {
        button.classList.remove('affordable');
      }
    });
  }

  /**
   * 통계 탭 업데이트
   */
  updateStatsTab() {
    const statsTab = document.getElementById('statsTab');
    if (!statsTab) return;

    const totalAssets = this.calculateTotalAssets();
    const totalEarnings = this.calculateTotalEarnings();
    const playTime = this.calculatePlayTime();
    const incomePerHour = this.calculateIncomePerHour();
    const revenueBreakdown = this.calculateRevenueBreakdown();
    const efficiencyRankings = this.calculateEfficiencyRankings();

    statsTab.innerHTML = `
      <div class="card">
        <h2>📊 게임 통계</h2>
        
        <div class="stats-section">
          <h3>💰 총 자산</h3>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-label">현금</div>
              <div class="stat-value">${formatNumber(this.gameState.cash)}원</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">총 자산</div>
              <div class="stat-value">${formatNumber(totalAssets)}원</div>
            </div>
          </div>
        </div>

        <div class="stats-section">
          <h3>📈 수익 정보</h3>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-label">초당 수익</div>
              <div class="stat-value">${formatNumber(this.gameState.totalRPS)}원/초</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">클릭당 수익</div>
              <div class="stat-value">${formatNumber(this.gameState.incomePerClick)}원</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">시간당 수익</div>
              <div class="stat-value">${formatNumber(incomePerHour)}원/시간</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">총 수익</div>
              <div class="stat-value">${formatNumber(totalEarnings)}원</div>
            </div>
          </div>
        </div>

        <div class="stats-section">
          <h3>⏰ 플레이 정보</h3>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-label">플레이 시간</div>
              <div class="stat-value">${formatTime(playTime)}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">총 클릭</div>
              <div class="stat-value">${formatNumber(this.gameState.totalClicks)}회</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">현재 직업</div>
              <div class="stat-value">${this.balance.getCurrentCareer(this.gameState.totalClicks).name}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">업그레이드</div>
              <div class="stat-value">${Object.keys(this.gameState.upgrades).length}개</div>
            </div>
          </div>
        </div>

        <div class="stats-section">
          <h3>📊 수익 구조</h3>
          <div class="income-bar">
            ${this.renderIncomeBar(revenueBreakdown)}
          </div>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-label">노동 수익</div>
              <div class="stat-value">${formatPercentage(revenueBreakdown.work)}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">금융 수익</div>
              <div class="stat-value">${formatPercentage(revenueBreakdown.financial)}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">부동산 수익</div>
              <div class="stat-value">${formatPercentage(revenueBreakdown.realEstate)}</div>
            </div>
          </div>
        </div>

        <div class="stats-section">
          <h3>🏆 효율 순위</h3>
          <div class="stat-grid">
            ${efficiencyRankings.map((item, index) => `
              <div class="stat-item">
                <div class="stat-label">${index + 1}위. ${item.name}</div>
                <div class="stat-value">${formatNumber(item.efficiency)}원/초</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="stats-section">
          <h3>🏅 업적</h3>
          <div class="achievement-grid">
            ${this.renderAchievements()}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 수익 바 렌더링
   */
  renderIncomeBar(breakdown) {
    const total = breakdown.work + breakdown.financial + breakdown.realEstate;
    if (total === 0) return '<div class="income-segment work" style="width: 100%">수익 없음</div>';

    return `
      <div class="income-segment work" style="width: ${(breakdown.work / total * 100)}%">
        ${breakdown.work > 0 ? '노동' : ''}
      </div>
      <div class="income-segment financial" style="width: ${(breakdown.financial / total * 100)}%">
        ${breakdown.financial > 0 ? '금융' : ''}
      </div>
      <div class="income-segment realEstate" style="width: ${(breakdown.realEstate / total * 100)}%">
        ${breakdown.realEstate > 0 ? '부동산' : ''}
      </div>
    `;
  }

  /**
   * 업적 렌더링
   */
  renderAchievements() {
    const achievements = [
      { id: 'first_click', icon: '👆', name: '첫 클릭', condition: this.gameState.totalClicks >= 1 },
      { id: 'hundred_clicks', icon: '💯', name: '백 클릭', condition: this.gameState.totalClicks >= 100 },
      { id: 'thousand_clicks', icon: '🎯', name: '천 클릭', condition: this.gameState.totalClicks >= 1000 },
      { id: 'first_investment', icon: '💰', name: '첫 투자', condition: Object.values(this.gameState.financial).some(count => count > 0) },
      { id: 'real_estate', icon: '🏠', name: '부동산', condition: Object.values(this.gameState.realEstate).some(count => count > 0) },
      { id: 'millionaire', icon: '💎', name: '백만장자', condition: this.gameState.cash >= 1000000 },
      { id: 'billionaire', icon: '👑', name: '억만장자', condition: this.gameState.cash >= 100000000 },
      { id: 'ceo', icon: '🏆', name: 'CEO', condition: this.balance.getCurrentCareer(this.gameState.totalClicks).id === 'ceo' }
    ];

    return achievements.map(achievement => `
      <div class="achievement-icon ${achievement.condition ? 'unlocked' : 'locked'}" 
           title="${achievement.name}">
        ${achievement.icon}
      </div>
    `).join('');
  }

  /**
   * 업그레이드 업데이트
   */
  updateUpgrades() {
    const upgradeList = document.getElementById('upgradeList');
    if (!upgradeList) return;

    const availableUpgrades = this.getAvailableUpgrades();
    upgradeList.innerHTML = '';

    if (availableUpgrades.length === 0) {
      upgradeList.innerHTML = '<div class="muted">해금된 업그레이드가 없습니다</div>';
      return;
    }

    availableUpgrades.forEach(upgrade => {
      const isPurchased = this.gameState.upgrades[upgrade.id];
      const canAfford = this.gameState.cash >= upgrade.cost;
      const rarity = getUpgradeRarity(upgrade.cost);

      const upgradeElement = document.createElement('div');
      upgradeElement.className = `upgrade-item ${canAfford ? 'affordable' : ''} ${isPurchased ? 'purchased' : ''}`;
      upgradeElement.setAttribute('data-rarity', rarity);
      upgradeElement.setAttribute('data-id', upgrade.id);

      upgradeElement.innerHTML = `
        <div class="upgrade-icon" style="color: ${getRarityColor(rarity)}">${upgrade.icon}</div>
        <div class="upgrade-info">
          <div class="upgrade-name">${upgrade.name}</div>
          <div class="upgrade-desc">${upgrade.description}</div>
          <div class="upgrade-cost">${formatNumber(upgrade.cost)}원</div>
        </div>
      `;

      upgradeList.appendChild(upgradeElement);
    });
  }

  /**
   * 총 자산 계산
   */
  calculateTotalAssets() {
    let total = this.gameState.cash;
    
    // 금융상품 자산
    Object.entries(this.gameState.financial).forEach(([id, count]) => {
      if (count > 0) {
        const item = this.balance.getItem('financial', id);
        if (item) {
          total += item.baseCost * count * 0.8; // 80% 회수율
        }
      }
    });

    // 부동산 자산
    Object.entries(this.gameState.realEstate).forEach(([id, count]) => {
      if (count > 0) {
        const item = this.balance.getItem('realEstate', id);
        if (item) {
          total += item.baseCost * count * 0.9; // 90% 회수율
        }
      }
    });

    return total;
  }

  /**
   * 총 수익 계산
   */
  calculateTotalEarnings() {
    return this.gameState.totalEarnings || 0;
  }

  /**
   * 플레이 시간 계산
   */
  calculatePlayTime() {
    if (!this.gameState.gameStartTime) return 0;
    return Math.floor((Date.now() - this.gameState.gameStartTime) / 1000);
  }

  /**
   * 시간당 수익 계산
   */
  calculateIncomePerHour() {
    return this.gameState.totalRPS * 3600;
  }

  /**
   * 수익 구조 분석
   */
  calculateRevenueBreakdown() {
    const workIncome = this.gameState.incomePerClick * this.gameState.totalClicks;
    const financialIncome = Object.entries(this.gameState.financial).reduce((sum, [id, count]) => {
      return sum + this.balance.getIncome('financial', id, count);
    }, 0);
    const realEstateIncome = Object.entries(this.gameState.realEstate).reduce((sum, [id, count]) => {
      return sum + this.balance.getIncome('realEstate', id, count);
    }, 0);

    const total = workIncome + financialIncome + realEstateIncome;
    
    return {
      work: total > 0 ? workIncome / total : 0,
      financial: total > 0 ? financialIncome / total : 0,
      realEstate: total > 0 ? realEstateIncome / total : 0
    };
  }

  /**
   * 효율 순위 계산
   */
  calculateEfficiencyRankings() {
    const items = [];

    // 금융상품
    this.balance.getAllFinancial().forEach(item => {
      const count = this.gameState.financial[item.id] || 0;
      if (count > 0) {
        items.push({
          name: item.name,
          efficiency: this.balance.getIncome('financial', item.id, count) / count
        });
      }
    });

    // 부동산
    this.balance.getAllRealEstate().forEach(item => {
      const count = this.gameState.realEstate[item.id] || 0;
      if (count > 0) {
        items.push({
          name: item.name,
          efficiency: this.balance.getIncome('realEstate', item.id, count) / count
        });
      }
    });

    return items.sort((a, b) => b.efficiency - a.efficiency).slice(0, 5);
  }

  /**
   * 사용 가능한 업그레이드 목록
   */
  getAvailableUpgrades() {
    // 기존 업그레이드 로직을 여기에 구현
    return [];
  }
}
