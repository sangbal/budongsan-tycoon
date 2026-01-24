/**
 * Seoul Survival - Prestige Tab UI
 *
 * CP 상점 인터페이스 모듈
 * - 카테고리별 업그레이드 그리드 표시
 * - CP 잔액 및 구매 버튼
 * - 영구 슬롯 관리
 * - 빌드 경로 시각화
 */

import { gameState } from '../state/gameState.js'
import {
  PRESTIGE_UPGRADES,
  CATEGORIES,
  canPurchaseUpgrade,
  purchaseUpgrade,
  getUpgradesByCategory,
  getAllPrestigeEffects,
  saveToPermSlot,
  removeFromPermSlot,
  getTotalCPForBonus,
} from '../systems/prestigeBonus.js'

let tFunc = key => key
let formatNumberFunc = n => n.toLocaleString()
let onPurchaseCallback = null

/**
 * 프레스티지 탭 초기화
 * @param {Function} t - 번역 함수
 * @param {Function} formatNumber - 숫자 포맷 함수
 * @param {Function} onPurchase - 구매 콜백 (선택)
 */
export function initPrestigeTab(t, formatNumber, onPurchase = null) {
  tFunc = t
  formatNumberFunc = formatNumber
  onPurchaseCallback = onPurchase

  renderPrestigeTab()
  setupEventListeners()
}

/**
 * 프레스티지 탭 전체 렌더링
 */
export function renderPrestigeTab() {
  const container = document.getElementById('prestigeTabContent')
  if (!container) return

  const cp = gameState.careerPoints || 0
  const totalCp = gameState.totalCareerPoints || 0
  const towers = gameState.towers_lifetime || 0
  const effects = getAllPrestigeEffects()
  const totalCpForBonus = getTotalCPForBonus()
  const cpBonusPercent = totalCpForBonus * 2 // +2%/CP

  container.innerHTML = `
    <!-- CP 힌트 (탭 최상단) -->
    <p class="cp-hint">${tFunc('cp.hint', {}, '🗼 서울타워 구매 시 CP를 획득합니다. CP는 다음 런에 영구 보너스로 적용됩니다.')}</p>

    <!-- CP 잔액 헤더 -->
    <div class="cp-header">
      <!-- 상단: CP 잔액 + 메타 정보 -->
      <div class="cp-header-top">
        <div class="cp-balance">
          <span class="cp-icon">💼</span>
          <span class="cp-amount">${cp}</span>
          <span class="cp-label">CP</span>
        </div>
        <div class="cp-meta">
          <span class="cp-total">${tFunc('cp.total', {}, '누적')}: ${totalCpForBonus} CP</span>
          <span class="cp-towers">🗼 ${towers}</span>
        </div>
      </div>

      <!-- 하단: 인맥 보너스 (있을 때만) -->
      ${
        totalCpForBonus > 0
          ? `
        <div class="cp-bonus-display">
          <span class="bonus-label">${tFunc('cp.networkBonus', {}, '인맥 보너스')}:</span>
          <span class="bonus-value">+${cpBonusPercent}%</span>
          <span class="bonus-desc">${tFunc('cp.networkDesc', {}, '전체 수익')}</span>
        </div>
      `
          : ''
      }
    </div>

    <!-- 영구 슬롯 (해금된 경우만 표시) -->
    ${effects.permanent_slot > 0 ? renderPermanentSlots(effects.permanent_slot) : ''}

    <!-- 카테고리별 업그레이드 -->
    <div class="cp-categories">
      ${renderAllCategories()}
    </div>

    <!-- 빌드 가이드 (접힌 상태) -->
    <details class="cp-build-guide">
      <summary>${tFunc('cp.buildGuide', {}, '빌드 가이드')}</summary>
      <div class="cp-build-list">
        ${renderBuildGuide()}
      </div>
    </details>
  `
}

/**
 * 영구 슬롯 렌더링
 */
function renderPermanentSlots(maxSlots) {
  const slots = gameState.permanentSlots || []
  let html = `
    <div class="cp-permanent-slots">
      <h4>${tFunc('cp.permSlots', {}, '영구 슬롯')}</h4>
      <p class="cp-perm-hint">${tFunc('cp.permSlots.hint', {}, '리셋 시에도 유지되는 업그레이드')}</p>
      <div class="cp-slot-grid">
  `

  for (let i = 0; i < maxSlots; i++) {
    const upgradeId = slots[i]
    const upgrade = upgradeId ? PRESTIGE_UPGRADES.find(u => u.id === upgradeId) : null

    if (upgrade) {
      html += `
        <div class="cp-slot filled" data-slot="${i}">
          <span class="slot-icon">${upgrade.icon}</span>
          <span class="slot-name">${tFunc(upgrade.nameKey)}</span>
          <button class="slot-remove" data-slot="${i}" title="${tFunc('cp.removeSlot', {}, '제거')}">×</button>
        </div>
      `
    } else {
      html += `
        <div class="cp-slot empty" data-slot="${i}">
          <span class="slot-icon">🔲</span>
          <span class="slot-name">${tFunc('cp.emptySlot', {}, '빈 슬롯')}</span>
        </div>
      `
    }
  }

  html += `
      </div>
    </div>
  `
  return html
}

/**
 * 모든 카테고리 렌더링
 */
function renderAllCategories() {
  const byCategory = getUpgradesByCategory()
  let html = ''

  for (const [cat, upgrades] of Object.entries(byCategory)) {
    const catInfo = CATEGORIES[cat]
    html += `
      <div class="cp-category" data-category="${cat}">
        <h3>
          <span class="cat-icon">${catInfo.icon}</span>
          ${tFunc(catInfo.nameKey)}
        </h3>
        <div class="upg-list">
          ${upgrades.map(u => renderUpgradeCard(u)).join('')}
        </div>
      </div>
    `
  }

  return html
}

/**
 * 업그레이드 카드 렌더링 (투자 탭 .row.building-item 스타일)
 */
function renderUpgradeCard(upgrade) {
  const purchased = gameState.purchasedUpgrades?.includes(upgrade.id) || false
  const { canPurchase, reason } = canPurchaseUpgrade(upgrade.id)
  const effects = getAllPrestigeEffects()
  const canSaveToSlot = purchased && effects.permanent_slot > 0 && upgrade.category !== 'F'
  const isInSlot = gameState.permanentSlots?.includes(upgrade.id) || false

  let statusClass = ''
  let buttonText = ''
  let buttonDisabled = ''

  if (purchased) {
    statusClass = 'purchased'
    buttonText = tFunc('cp.purchased', {}, '구매완료')
    buttonDisabled = 'disabled'
  } else if (!canPurchase) {
    statusClass = 'locked'
    buttonText = `${upgrade.cost} CP`
    buttonDisabled = 'disabled'
  } else {
    statusClass = 'available'
    buttonText = `${upgrade.cost} CP`
  }

  // 선행 조건 아이콘 렌더링
  const purchasedUpgrades = gameState.purchasedUpgrades || []
  const reqIcons =
    upgrade.requires.length > 0
      ? upgrade.requires
          .map(id => {
            const req = PRESTIGE_UPGRADES.find(u => u.id === id)
            const met = purchasedUpgrades.includes(id)
            return `<span class="req-icon ${met ? 'met' : 'unmet'}">${req?.icon || '?'}</span>`
          })
          .join('')
      : ''

  return `
    <div class="row building-item cp-item ${statusClass}" data-upgrade-id="${upgrade.id}">
      <div class="meta">
        <span class="title">${upgrade.icon} ${tFunc(upgrade.nameKey)}</span>
        <span class="desc">${tFunc(upgrade.descKey)}</span>
        <span class="desc cp-cost">${tFunc('cp.cost', {}, '비용')}: <b>${upgrade.cost} CP</b></span>
        ${
          upgrade.requires.length > 0
            ? `
          <span class="desc cp-requires">${tFunc('cp.requires', {}, '선행')}: ${reqIcons}</span>
        `
            : ''
        }
      </div>
      ${
        purchased
          ? `
        <div class="cp-purchased-actions">
          <span class="cp-purchased-status">✓</span>
          ${
            canSaveToSlot
              ? `
            <button class="btn-save-slot ${isInSlot ? 'in-slot' : ''}" data-upgrade-id="${upgrade.id}">
              ${isInSlot ? '🔒' : '📌'}
            </button>
          `
              : ''
          }
        </div>
      `
          : `
        <button class="btn" data-upgrade-id="${upgrade.id}" ${buttonDisabled}>
          ${buttonText}
        </button>
      `
      }
    </div>
  `
}

/**
 * 선행 조건 렌더링
 */
function renderRequirements(requires) {
  const purchased = gameState.purchasedUpgrades || []
  const icons = requires.map(id => {
    const req = PRESTIGE_UPGRADES.find(u => u.id === id)
    const met = purchased.includes(id)
    return `<span class="req-icon ${met ? 'met' : 'unmet'}">${req?.icon || '?'}</span>`
  })
  return `<div class="upgrade-requires">${tFunc('cp.requires', {}, '선행')}: ${icons.join('')}</div>`
}

/**
 * 빌드 가이드 렌더링
 */
function renderBuildGuide() {
  const builds = [
    {
      name: 'cp.build.financial',
      path: ['A1_mentor', 'A2_network', 'B1_broker', 'B2_fund_manager', 'B3_hedge_fund'],
      desc: 'cp.build.financial.desc',
    },
    {
      name: 'cp.build.property',
      path: ['A1_mentor', 'A3_recognition', 'C1_realtor', 'C2_builder', 'C3_redeveloper'],
      desc: 'cp.build.property.desc',
    },
    {
      name: 'cp.build.active',
      path: ['A1_mentor', 'D1_workaholic', 'D2_automation', 'D3_ceo_mentality', 'G1_prediction'],
      desc: 'cp.build.active.desc',
    },
    {
      name: 'cp.build.speedrun',
      path: ['A3_recognition', 'E1_parents', 'E2_connections', 'E3_silver_spoon', 'A4_reputation'],
      desc: 'cp.build.speedrun.desc',
    },
  ]

  return builds
    .map(b => {
      const icons = b.path
        .map(id => {
          const u = PRESTIGE_UPGRADES.find(up => up.id === id)
          return u?.icon || '?'
        })
        .join(' → ')
      return `
      <div class="cp-build-item">
        <strong>${tFunc(b.name)}</strong>
        <div class="build-path">${icons}</div>
        <p class="build-desc">${tFunc(b.desc)}</p>
      </div>
    `
    })
    .join('')
}

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
  const container = document.getElementById('prestigeTabContent')
  if (!container) return

  container.addEventListener('click', e => {
    // 구매 버튼 클릭 (.cp-item 내부의 .btn)
    const purchaseBtn = e.target.closest('.cp-item .btn')
    if (purchaseBtn && !purchaseBtn.disabled) {
      const upgradeId = purchaseBtn.dataset.upgradeId
      handlePurchase(upgradeId)
      return
    }

    // 슬롯 저장 버튼 클릭
    const saveSlotBtn = e.target.closest('.btn-save-slot')
    if (saveSlotBtn) {
      const upgradeId = saveSlotBtn.dataset.upgradeId
      handleSaveToSlot(upgradeId)
      return
    }

    // 슬롯 제거 버튼 클릭
    const removeSlotBtn = e.target.closest('.slot-remove')
    if (removeSlotBtn) {
      const slotIndex = parseInt(removeSlotBtn.dataset.slot, 10)
      handleRemoveFromSlot(slotIndex)
      return
    }
  })
}

/**
 * 업그레이드 구매 처리
 */
function handlePurchase(upgradeId) {
  const success = purchaseUpgrade(upgradeId)
  if (success) {
    renderPrestigeTab()
    if (onPurchaseCallback) {
      onPurchaseCallback(upgradeId)
    }
  }
}

/**
 * 영구 슬롯에 저장 처리
 */
function handleSaveToSlot(upgradeId) {
  const slots = gameState.permanentSlots || []
  const effects = getAllPrestigeEffects()
  const maxSlots = effects.permanent_slot

  // 이미 슬롯에 있으면 제거
  const existingIdx = slots.indexOf(upgradeId)
  if (existingIdx !== -1) {
    removeFromPermSlot(existingIdx)
    renderPrestigeTab()
    return
  }

  // 빈 슬롯 찾기
  let targetSlot = -1
  for (let i = 0; i < maxSlots; i++) {
    if (!slots[i]) {
      targetSlot = i
      break
    }
  }

  if (targetSlot === -1) {
    // 슬롯이 꽉 찬 경우 첫 번째 슬롯에 덮어쓰기
    targetSlot = 0
  }

  saveToPermSlot(upgradeId, targetSlot)
  renderPrestigeTab()
}

/**
 * 영구 슬롯에서 제거 처리
 */
function handleRemoveFromSlot(slotIndex) {
  removeFromPermSlot(slotIndex)
  renderPrestigeTab()
}

/**
 * CP 잔액만 업데이트 (전체 리렌더링 없이)
 */
export function updateCPBalance() {
  const cpAmountEl = document.querySelector('.cp-amount')
  const cpTotalEl = document.querySelector('.cp-total')

  if (cpAmountEl) {
    cpAmountEl.textContent = gameState.careerPoints || 0
  }
  if (cpTotalEl) {
    cpTotalEl.textContent = `${tFunc('cp.total', {}, '누적')}: ${gameState.totalCareerPoints || 0} CP`
  }
}

/**
 * 외부에서 탭 새로고침 요청
 */
export function refreshPrestigeTab() {
  renderPrestigeTab()
}
