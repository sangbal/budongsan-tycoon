/**
 * KIMCHI INVASION - Research UI Panel (DOM-based)
 *
 * @description 기술 트리 시각화 및 연구 관리 UI
 * @module ui/researchUI
 */

import { TECHNOLOGIES, getTechnologiesByTier } from '../data/technologies.js'
import { researchSystem } from '../systems/researchSystem.js'
import { resourceSystem } from '../systems/resourceSystem.js'
import { t } from '../i18n/index.js'

/**
 * 연구 UI 패널 클래스
 */
export class ResearchUI {
  constructor() {
    /** @type {HTMLElement|null} 패널 루트 */
    this.panel = null

    /** @type {HTMLElement|null} 기술 트리 컨테이너 */
    this.techTreeContainer = null

    /** @type {HTMLElement|null} 상세 정보 컨테이너 */
    this.detailContainer = null

    /** @type {string|null} 현재 선택된 기술 ID */
    this.selectedTechId = null

    /** @type {Map<string, HTMLElement>} 기술 노드 DOM 캐시 */
    this.techNodes = new Map()

    /** @type {number|null} 업데이트 타이머 */
    this.updateTimer = null

    this.createPanel()
    this.attachListeners()
    this.startUpdateLoop()
  }

  /**
   * 패널 생성
   */
  createPanel() {
    // 사이드 패널 가져오기
    const sidePanel = document.getElementById('side-panel')
    if (!sidePanel) {
      console.error('[ResearchUI] Side panel not found')
      return
    }

    // 패널 내용 초기화
    sidePanel.innerHTML = ''
    this.panel = sidePanel

    // 헤더
    const header = document.createElement('div')
    header.className = 'research-header'
    header.innerHTML = `
      <h2 class="research-title">🔬 ${t('research.title')}</h2>
      <button class="close-btn" id="close-research-panel" aria-label="Close">✕</button>
    `
    this.panel.appendChild(header)

    // 기술 트리 컨테이너
    this.techTreeContainer = document.createElement('div')
    this.techTreeContainer.className = 'tech-tree'
    this.panel.appendChild(this.techTreeContainer)

    // 상세 정보 컨테이너
    this.detailContainer = document.createElement('div')
    this.detailContainer.className = 'tech-detail hidden'
    this.panel.appendChild(this.detailContainer)

    // 기술 트리 렌더링
    this.renderTechTree()

    // 스타일 추가
    this.injectStyles()

    console.log('[ResearchUI] Panel created')
  }

  /**
   * 기술 트리 렌더링 (Tier별 그룹)
   */
  renderTechTree() {
    if (!this.techTreeContainer) return

    this.techTreeContainer.innerHTML = ''

    // Tier 1-5
    for (let tier = 1; tier <= 5; tier++) {
      const tierGroup = this.createTierGroup(tier)
      this.techTreeContainer.appendChild(tierGroup)
    }
  }

  /**
   * Tier 그룹 생성
   * @param {number} tier - Tier 번호 (1-5)
   * @returns {HTMLElement}
   */
  createTierGroup(tier) {
    const group = document.createElement('div')
    group.className = 'tier-group'
    group.setAttribute('data-tier', tier)

    // Tier 헤더
    const tierHeader = document.createElement('h3')
    tierHeader.className = 'tier-header'
    tierHeader.textContent = t('research.tier', { tier })
    group.appendChild(tierHeader)

    // 기술 노드들
    const techsContainer = document.createElement('div')
    techsContainer.className = 'tier-techs'

    const techs = getTechnologiesByTier(tier)
    techs.forEach(tech => {
      const node = this.createTechNode(tech)
      techsContainer.appendChild(node)
      this.techNodes.set(tech.id, node)
    })

    group.appendChild(techsContainer)
    return group
  }

  /**
   * 기술 노드 생성
   * @param {Object} tech - 기술 정의
   * @returns {HTMLElement}
   */
  createTechNode(tech) {
    const node = document.createElement('div')
    node.className = 'tech-node'
    node.setAttribute('data-tech-id', tech.id)

    // 상태 계산
    const status = this.getTechStatus(tech.id)
    node.classList.add(`status-${status}`)

    // 아이콘
    const icon = document.createElement('div')
    icon.className = 'tech-icon'
    icon.textContent = tech.icon
    node.appendChild(icon)

    // 이름
    const name = document.createElement('div')
    name.className = 'tech-name'
    name.textContent = t(tech.nameKey)
    node.appendChild(name)

    // 상태 표시
    const statusBadge = document.createElement('div')
    statusBadge.className = 'tech-status'
    statusBadge.textContent = t(`research.status.${status}`)
    node.appendChild(statusBadge)

    // 진행률 바 (연구 중일 때만)
    if (status === 'researching') {
      const progressBar = document.createElement('div')
      progressBar.className = 'tech-progress-bar'
      const progressFill = document.createElement('div')
      progressFill.className = 'tech-progress-fill'
      progressBar.appendChild(progressFill)
      node.appendChild(progressBar)
    }

    // 클릭 이벤트
    node.addEventListener('click', () => this.selectTech(tech.id))

    return node
  }

  /**
   * 기술 상태 조회
   * @param {string} techId - 기술 ID
   * @returns {'locked'|'available'|'researching'|'completed'}
   */
  getTechStatus(techId) {
    const tech = TECHNOLOGIES[techId]
    if (!tech) return 'locked'

    // 완료됨
    if (researchSystem.isResearched(techId)) {
      return 'completed'
    }

    // 현재 연구 중
    if (researchSystem.currentResearch === techId) {
      return 'researching'
    }

    // 선행 기술 확인
    const completedTechs = researchSystem.getCompletedTechs()
    const hasPrereqs = tech.prerequisites.every(prereq => completedTechs.includes(prereq))

    if (!hasPrereqs) {
      return 'locked'
    }

    // 자원 확인
    const canAfford = Object.entries(tech.cost).every(([resourceId, amount]) => {
      return resourceSystem.get(resourceId) >= amount
    })

    return canAfford ? 'available' : 'locked'
  }

  /**
   * 기술 선택 (상세 정보 표시)
   * @param {string} techId - 기술 ID
   */
  selectTech(techId) {
    this.selectedTechId = techId
    this.renderTechDetail(techId)

    // 모든 노드의 선택 해제
    this.techNodes.forEach(node => node.classList.remove('selected'))

    // 선택된 노드 강조
    const selectedNode = this.techNodes.get(techId)
    if (selectedNode) {
      selectedNode.classList.add('selected')
    }
  }

  /**
   * 기술 상세 정보 렌더링
   * @param {string} techId - 기술 ID
   */
  renderTechDetail(techId) {
    if (!this.detailContainer) return

    const tech = TECHNOLOGIES[techId]
    if (!tech) {
      this.detailContainer.classList.add('hidden')
      return
    }

    const status = this.getTechStatus(techId)

    // 상세 정보 HTML
    let html = `
      <div class="tech-detail-header">
        <div class="tech-detail-icon">${tech.icon}</div>
        <h3 class="tech-detail-name">${t(tech.nameKey)}</h3>
      </div>
      <p class="tech-detail-desc">${t(tech.descKey)}</p>
    `

    // 비용
    html += `<div class="tech-detail-section">
      <h4>${t('research.cost')}</h4>
      <ul class="tech-cost-list">
    `
    for (const [resourceId, amount] of Object.entries(tech.cost)) {
      const current = resourceSystem.get(resourceId)
      const hasEnough = current >= amount
      const className = hasEnough ? 'cost-sufficient' : 'cost-insufficient'
      html += `<li class="${className}">
        ${t(`resources.${resourceId}.name`)}: ${current.toLocaleString()} / ${amount.toLocaleString()}
      </li>`
    }
    html += `</ul></div>`

    // 연구 시간
    html += `<div class="tech-detail-section">
      <h4>${t('research.time')}</h4>
      <p>${this.formatTime(tech.time)}</p>
    </div>`

    // 선행 기술
    if (tech.prerequisites.length > 0) {
      html += `<div class="tech-detail-section">
        <h4>${t('research.prerequisites')}</h4>
        <ul class="tech-prereq-list">
      `
      for (const prereqId of tech.prerequisites) {
        const prereqTech = TECHNOLOGIES[prereqId]
        if (!prereqTech) continue
        const isCompleted = researchSystem.isResearched(prereqId)
        const className = isCompleted ? 'prereq-completed' : 'prereq-missing'
        html += `<li class="${className}">
          ${prereqTech.icon} ${t(prereqTech.nameKey)}
        </li>`
      }
      html += `</ul></div>`
    }

    // 효과
    html += `<div class="tech-detail-section">
      <h4>${t('research.effects')}</h4>
      <ul class="tech-effect-list">
    `
    for (const effect of tech.effects) {
      html += `<li>${this.formatEffect(effect)}</li>`
    }
    html += `</ul></div>`

    // 버튼
    html += `<div class="tech-detail-actions">`
    if (status === 'available') {
      html += `<button class="btn-research-start" id="btn-start-research">${t('research.actions.start')}</button>`
    } else if (status === 'researching') {
      const progress = researchSystem.getCurrentResearchStatus()
      html += `
        <div class="research-progress-info">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress.percent}%"></div>
          </div>
          <p>${t('research.progress')}: ${progress.percent.toFixed(1)}%</p>
          <p>${t('research.remaining')}: ${this.formatTime(progress.totalTime - progress.progress)}</p>
        </div>
        <button class="btn-research-cancel" id="btn-cancel-research">${t('research.actions.cancel')}</button>
      `
    } else if (status === 'completed') {
      html += `<p class="research-completed">✅ ${t('research.status.completed')}</p>`
    } else {
      html += `<p class="research-locked">🔒 ${t('research.status.locked')}</p>`
    }
    html += `</div>`

    this.detailContainer.innerHTML = html
    this.detailContainer.classList.remove('hidden')

    // 버튼 이벤트 리스너
    const startBtn = document.getElementById('btn-start-research')
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startResearch(techId))
    }

    const cancelBtn = document.getElementById('btn-cancel-research')
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cancelResearch())
    }
  }

  /**
   * 연구 시작
   * @param {string} techId - 기술 ID
   */
  startResearch(techId) {
    const success = researchSystem.startResearch(techId)
    if (success) {
      console.log(`[ResearchUI] Started research: ${techId}`)
      this.updateTechNode(techId)
      this.renderTechDetail(techId)
    } else {
      console.log(`[ResearchUI] Failed to start research: ${techId}`)
    }
  }

  /**
   * 연구 취소
   */
  cancelResearch() {
    const techId = researchSystem.currentResearch
    if (!techId) return

    const success = researchSystem.cancelResearch()
    if (success) {
      console.log(`[ResearchUI] Cancelled research: ${techId}`)
      this.updateTechNode(techId)
      this.renderTechDetail(techId)
    }
  }

  /**
   * 기술 노드 업데이트 (상태 변경 시)
   * @param {string} techId - 기술 ID
   */
  updateTechNode(techId) {
    const node = this.techNodes.get(techId)
    if (!node) return

    const tech = TECHNOLOGIES[techId]
    if (!tech) return

    // 기존 상태 클래스 제거
    node.classList.remove(
      'status-locked',
      'status-available',
      'status-researching',
      'status-completed'
    )

    // 새 상태 추가
    const status = this.getTechStatus(techId)
    node.classList.add(`status-${status}`)

    // 상태 텍스트 업데이트
    const statusBadge = node.querySelector('.tech-status')
    if (statusBadge) {
      statusBadge.textContent = t(`research.status.${status}`)
    }

    // 진행률 바 업데이트/추가/제거
    let progressBar = node.querySelector('.tech-progress-bar')
    if (status === 'researching') {
      if (!progressBar) {
        progressBar = document.createElement('div')
        progressBar.className = 'tech-progress-bar'
        const progressFill = document.createElement('div')
        progressFill.className = 'tech-progress-fill'
        progressBar.appendChild(progressFill)
        node.appendChild(progressBar)
      }

      const progress = researchSystem.getCurrentResearchStatus()
      if (progress) {
        const fill = progressBar.querySelector('.tech-progress-fill')
        if (fill) {
          fill.style.width = `${progress.percent}%`
        }
      }
    } else if (progressBar) {
      progressBar.remove()
    }
  }

  /**
   * 효과 포맷팅
   * @param {Object} effect - 효과 객체
   * @returns {string}
   */
  formatEffect(effect) {
    if (effect.type === 'multiplier') {
      const percent = ((effect.value - 1) * 100).toFixed(0)
      return `${effect.target}: +${percent}%`
    } else if (effect.type === 'unlock') {
      return `🔓 ${effect.target} 해금`
    } else if (effect.type === 'bonus') {
      const percent = (effect.value * 100).toFixed(0)
      return `${effect.target}: ${percent}%`
    }
    return `${effect.type}: ${effect.target}`
  }

  /**
   * 시간 포맷팅 (초 → "1분 30초")
   * @param {number} seconds - 초
   * @returns {string}
   */
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    if (minutes > 0) {
      return `${minutes}분 ${secs}초`
    }
    return `${secs}초`
  }

  /**
   * 이벤트 리스너 연결
   */
  attachListeners() {
    // 닫기 버튼
    const closeBtn = document.getElementById('close-research-panel')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide())
    }

    // ResearchSystem 이벤트 구독
    researchSystem.on('researchStarted', () => {
      this.updateAll()
    })

    researchSystem.on('researchCompleted', event => {
      this.updateAll()
      console.log('[ResearchUI] Research completed:', event.techId)
    })

    researchSystem.on('researchCancelled', () => {
      this.updateAll()
    })

    // 언어 변경 시 재렌더링
    window.addEventListener('languageChanged', () => {
      this.renderTechTree()
      if (this.selectedTechId) {
        this.renderTechDetail(this.selectedTechId)
      }
    })
  }

  /**
   * 모든 노드 업데이트 (자원 변경 시)
   */
  updateAll() {
    this.techNodes.forEach((node, techId) => {
      this.updateTechNode(techId)
    })

    // 선택된 기술 상세 정보도 업데이트
    if (this.selectedTechId) {
      this.renderTechDetail(this.selectedTechId)
    }
  }

  /**
   * 주기적 업데이트 루프 (1초마다)
   */
  startUpdateLoop() {
    this.updateTimer = setInterval(() => {
      // 연구 중인 기술만 업데이트 (최적화)
      if (researchSystem.currentResearch) {
        this.updateTechNode(researchSystem.currentResearch)

        // 상세 정보 패널이 열려있고 연구 중인 기술이 선택된 경우
        if (this.selectedTechId === researchSystem.currentResearch) {
          this.renderTechDetail(this.selectedTechId)
        }
      }

      // 자원이 변경되었을 수 있으므로 모든 노드의 상태 재계산 (가볍게)
      this.techNodes.forEach((node, techId) => {
        const tech = TECHNOLOGIES[techId]
        if (!tech) return

        const oldStatus = Array.from(node.classList)
          .find(c => c.startsWith('status-'))
          ?.replace('status-', '')
        const newStatus = this.getTechStatus(techId)

        // 상태가 변경된 경우만 업데이트
        if (oldStatus !== newStatus) {
          this.updateTechNode(techId)
        }
      })
    }, 1000)
  }

  /**
   * 패널 표시
   */
  show() {
    if (this.panel) {
      this.panel.classList.remove('hidden')
      this.updateAll()
    }
  }

  /**
   * 패널 숨김
   */
  hide() {
    if (this.panel) {
      this.panel.classList.add('hidden')
    }
  }

  /**
   * 토글
   */
  toggle() {
    if (this.panel) {
      this.panel.classList.toggle('hidden')
      if (!this.panel.classList.contains('hidden')) {
        this.updateAll()
      }
    }
  }

  /**
   * 스타일 주입
   */
  injectStyles() {
    const styleId = 'research-ui-styles'
    if (document.getElementById(styleId)) return

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      /* Research Panel Styles */
      .research-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--color-ui-border);
        background: var(--color-space-mid);
      }

      .research-title {
        font-size: 1.5rem;
        margin: 0;
        color: var(--color-tech-blue);
      }

      .close-btn {
        background: transparent;
        border: none;
        color: var(--color-text);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        transition: color var(--transition-fast);
      }

      .close-btn:hover {
        color: var(--color-danger);
      }

      /* Tech Tree */
      .tech-tree {
        padding: var(--spacing-md);
        overflow-y: auto;
        max-height: calc(100vh - 200px);
      }

      .tier-group {
        margin-bottom: var(--spacing-lg);
      }

      .tier-header {
        font-size: 1rem;
        color: var(--color-mars-orange);
        margin-bottom: var(--spacing-sm);
        padding-bottom: var(--spacing-xs);
        border-bottom: 2px solid var(--color-ui-border);
      }

      .tier-techs {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: var(--spacing-sm);
      }

      /* Tech Node */
      .tech-node {
        background: var(--color-space-mid);
        border: 2px solid var(--color-ui-border);
        border-radius: 8px;
        padding: var(--spacing-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
        position: relative;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-xs);
      }

      .tech-node:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }

      .tech-node.selected {
        border-color: var(--color-tech-blue);
        box-shadow: 0 0 12px rgba(0, 212, 255, 0.5);
      }

      .tech-icon {
        font-size: 2rem;
      }

      .tech-name {
        font-size: 0.75rem;
        text-align: center;
        color: var(--color-text);
        line-height: 1.2;
      }

      .tech-status {
        font-size: 0.625rem;
        padding: 2px 6px;
        border-radius: 4px;
        text-transform: uppercase;
        font-weight: 600;
      }

      /* Status Colors */
      .status-locked {
        opacity: 0.5;
        filter: grayscale(1);
      }

      .status-locked .tech-status {
        background: var(--color-text-dim);
        color: var(--color-space-dark);
      }

      .status-available .tech-status {
        background: var(--color-success);
        color: var(--color-space-dark);
      }

      .status-researching {
        border-color: var(--color-warning);
        box-shadow: 0 0 12px rgba(255, 190, 11, 0.5);
      }

      .status-researching .tech-status {
        background: var(--color-warning);
        color: var(--color-space-dark);
      }

      .status-completed {
        border-color: var(--color-tech-green);
      }

      .status-completed .tech-status {
        background: var(--color-tech-green);
        color: var(--color-space-dark);
      }

      /* Progress Bar */
      .tech-progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
        margin-top: auto;
      }

      .tech-progress-fill {
        height: 100%;
        background: var(--color-warning);
        transition: width 0.3s ease;
      }

      /* Tech Detail */
      .tech-detail {
        position: sticky;
        bottom: 0;
        background: var(--color-space-dark);
        border-top: 2px solid var(--color-ui-border);
        padding: var(--spacing-md);
        max-height: 50vh;
        overflow-y: auto;
      }

      .tech-detail-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-sm);
      }

      .tech-detail-icon {
        font-size: 2.5rem;
      }

      .tech-detail-name {
        font-size: 1.25rem;
        color: var(--color-tech-blue);
        margin: 0;
      }

      .tech-detail-desc {
        color: var(--color-text-dim);
        margin-bottom: var(--spacing-md);
        line-height: 1.5;
      }

      .tech-detail-section {
        margin-bottom: var(--spacing-md);
      }

      .tech-detail-section h4 {
        font-size: 0.875rem;
        color: var(--color-mars-orange);
        margin-bottom: var(--spacing-xs);
      }

      .tech-cost-list,
      .tech-prereq-list,
      .tech-effect-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .tech-cost-list li,
      .tech-prereq-list li,
      .tech-effect-list li {
        padding: var(--spacing-xs);
        margin-bottom: var(--spacing-xs);
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
      }

      .cost-insufficient {
        color: var(--color-danger);
      }

      .cost-sufficient {
        color: var(--color-success);
      }

      .prereq-missing {
        color: var(--color-text-dim);
        text-decoration: line-through;
      }

      .prereq-completed {
        color: var(--color-success);
      }

      /* Actions */
      .tech-detail-actions {
        margin-top: var(--spacing-md);
      }

      .btn-research-start,
      .btn-research-cancel {
        width: 100%;
        padding: var(--spacing-sm);
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .btn-research-start {
        background: var(--color-success);
        color: var(--color-space-dark);
      }

      .btn-research-start:hover {
        background: #05c296;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(6, 214, 160, 0.3);
      }

      .btn-research-cancel {
        background: var(--color-danger);
        color: white;
      }

      .btn-research-cancel:hover {
        background: #e6005c;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(255, 0, 110, 0.3);
      }

      .research-progress-info {
        margin-bottom: var(--spacing-sm);
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: var(--spacing-xs);
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--color-tech-blue), var(--color-tech-green));
        transition: width 0.3s ease;
      }

      .research-completed,
      .research-locked {
        text-align: center;
        padding: var(--spacing-sm);
        border-radius: 6px;
        font-weight: 600;
      }

      .research-completed {
        background: rgba(0, 255, 136, 0.1);
        color: var(--color-tech-green);
      }

      .research-locked {
        background: rgba(255, 255, 255, 0.05);
        color: var(--color-text-dim);
      }

      /* Mobile */
      @media (max-width: 768px) {
        .tier-techs {
          grid-template-columns: repeat(2, 1fr);
        }

        .tech-detail {
          max-height: 40vh;
        }
      }
    `
    document.head.appendChild(style)
  }

  /**
   * 정리 (메모리 누수 방지)
   */
  destroy() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer)
      this.updateTimer = null
    }

    if (this.panel) {
      this.panel.innerHTML = ''
      this.panel = null
    }

    this.techNodes.clear()
    console.log('[ResearchUI] Destroyed')
  }
}

/**
 * 연구 UI 인스턴스 생성 헬퍼
 * @returns {ResearchUI}
 */
export function createResearchUI() {
  const ui = new ResearchUI()
  console.log('[ResearchUI] Created')
  return ui
}
