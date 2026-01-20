/**
 * KIMCHI INVASION - Tutorial UI Components
 *
 * @description 튜토리얼 UI (모달, 말풍선, 프리뷰)
 * @module ui/tutorialUI
 */

import { t } from '../i18n/index.js'
import { tutorialSystem, TUTORIAL_STEPS } from '../systems/tutorialSystem.js'
import { useUIStore } from '../state/stores/uiStore.js'

/**
 * 튜토리얼 UI 관리 클래스
 */
export class TutorialUI {
  constructor() {
    /** @type {HTMLElement|null} 모달 컨테이너 */
    this.modalContainer = null

    /** @type {HTMLElement|null} 목표 패널 */
    this.goalPanel = null

    /** @type {HTMLElement|null} 말풍선 */
    this.speechBubble = null

    /** @type {HTMLElement|null} 스포트라이트 오버레이 */
    this.spotlightOverlay = null

    this.init()
  }

  /**
   * 초기화
   */
  init() {
    this.createModalContainer()
    this.createGoalPanel()
    this.createSpeechBubble()
    this.createSpotlightOverlay()
    this.bindEvents()

    console.log('[TutorialUI] Initialized')
  }

  /**
   * 모달 컨테이너 생성
   */
  createModalContainer() {
    this.modalContainer = document.createElement('div')
    this.modalContainer.id = 'tutorial-modal'
    this.modalContainer.className = 'tutorial-modal hidden'
    this.modalContainer.innerHTML = `
      <div class="tutorial-modal-backdrop"></div>
      <div class="tutorial-modal-content">
        <div class="tutorial-modal-header">
          <h2 id="tutorial-modal-title"></h2>
          <button id="tutorial-skip-btn" class="tutorial-skip-btn">
            ${t('tutorial.skip') || '건너뛰기'}
          </button>
        </div>
        <div class="tutorial-modal-body" id="tutorial-modal-body">
          <!-- Content will be injected here -->
        </div>
        <div class="tutorial-modal-footer">
          <button id="tutorial-continue-btn" class="btn-primary">
            ${t('tutorial.continue') || '계속'}
          </button>
        </div>
      </div>
    `
    document.body.appendChild(this.modalContainer)
  }

  /**
   * 목표 패널 생성 (화면 상단 우측)
   */
  createGoalPanel() {
    this.goalPanel = document.createElement('div')
    this.goalPanel.id = 'tutorial-goal-panel'
    this.goalPanel.className = 'tutorial-goal-panel hidden'
    this.goalPanel.innerHTML = `
      <div class="tutorial-goal-header">
        <span class="tutorial-goal-icon">🎯</span>
        <h3 id="tutorial-goal-title"></h3>
      </div>
      <p id="tutorial-goal-description"></p>
      <div id="tutorial-goal-objectives"></div>
    `
    document.body.appendChild(this.goalPanel)
  }

  /**
   * 말풍선 생성 (NPC 대화)
   */
  createSpeechBubble() {
    this.speechBubble = document.createElement('div')
    this.speechBubble.id = 'tutorial-speech-bubble'
    this.speechBubble.className = 'tutorial-speech-bubble hidden'
    this.speechBubble.innerHTML = `
      <div class="speech-bubble-avatar">
        <img id="speech-bubble-avatar-img" src="" alt="NPC" />
      </div>
      <div class="speech-bubble-content">
        <div class="speech-bubble-name" id="speech-bubble-name"></div>
        <div class="speech-bubble-text" id="speech-bubble-text"></div>
      </div>
      <button class="speech-bubble-close" id="speech-bubble-close">✕</button>
    `
    document.body.appendChild(this.speechBubble)
  }

  /**
   * 스포트라이트 오버레이 생성
   */
  createSpotlightOverlay() {
    this.spotlightOverlay = document.createElement('div')
    this.spotlightOverlay.id = 'tutorial-spotlight'
    this.spotlightOverlay.className = 'tutorial-spotlight hidden'
    document.body.appendChild(this.spotlightOverlay)
  }

  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    // 스킵 버튼
    const skipBtn = document.getElementById('tutorial-skip-btn')
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.showSkipConfirmation()
      })
    }

    // 계속 버튼
    const continueBtn = document.getElementById('tutorial-continue-btn')
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        this.handleContinue()
      })
    }

    // 말풍선 닫기
    const bubbleClose = document.getElementById('speech-bubble-close')
    if (bubbleClose) {
      bubbleClose.addEventListener('click', () => {
        this.hideSpeechBubble()
      })
    }

    // UI 스토어 구독 (모달 상태 변화 감지)
    useUIStore.subscribe(
      state => state.activeModal,
      activeModal => {
        if (activeModal?.startsWith('tutorial-')) {
          this.showModal(activeModal)
        } else {
          this.hideModal()
        }
      }
    )
  }

  // ========================================================================
  // MODAL METHODS
  // ========================================================================

  /**
   * 모달 표시
   * @param {string} modalId - 모달 ID
   */
  showModal(modalId) {
    const modalData = useUIStore.getState().modalData || {}

    switch (modalId) {
      case 'tutorial-prologue':
        this.showPrologue(modalData)
        break
      case 'tutorial-epilogue':
        this.showEpilogue(modalData)
        break
      case 'tutorial-step-goal':
        this.showStepGoal(modalData)
        break
      default:
        console.warn(`[TutorialUI] Unknown modal: ${modalId}`)
    }
  }

  /**
   * 모달 숨기기
   */
  hideModal() {
    if (this.modalContainer) {
      this.modalContainer.classList.add('hidden')
    }
  }

  /**
   * 프롤로그 모달 표시
   * @param {Object} data - { onContinue, onSkip }
   */
  showPrologue(data) {
    const title = document.getElementById('tutorial-modal-title')
    const body = document.getElementById('tutorial-modal-body')
    const continueBtn = document.getElementById('tutorial-continue-btn')

    if (title) {
      title.textContent = t('tutorial.prologue.title') || 'KIMCHI INVASION'
    }

    if (body) {
      body.innerHTML = `
        <div class="tutorial-prologue">
          <div class="prologue-animation">
            <div class="mars-landing">
              <div class="stars"></div>
              <div class="rocket">🚀</div>
              <div class="mars-surface"></div>
            </div>
          </div>
          <div class="prologue-text">
            <p>${t('tutorial.prologue.text1') || '2087년, 인류의 화성 정착 2년차.'}</p>
            <p>${t('tutorial.prologue.text2') || '당신은 한국생명공학연구원 소속 바이오 엔지니어.'}</p>
            <p>${t('tutorial.prologue.text3') || '대원들의 면역력 저하 문제를 해결하기 위해 화성 최초의 김치 생산 시설을 건설해야 합니다.'}</p>
            <p>${t('tutorial.prologue.text4') || '화성의 혹독한 환경에서 살아남고, 언젠가는 지구에 김치를 역수출하는 것이 당신의 미션입니다.'}</p>
          </div>
        </div>
      `
    }

    if (continueBtn) {
      continueBtn.onclick = () => {
        if (data.onContinue) data.onContinue()
        this.hideModal()
      }
    }

    this.modalContainer?.classList.remove('hidden')
  }

  /**
   * 에필로그 모달 표시
   * @param {Object} data - { onClose }
   */
  showEpilogue(data) {
    const title = document.getElementById('tutorial-modal-title')
    const body = document.getElementById('tutorial-modal-body')
    const continueBtn = document.getElementById('tutorial-continue-btn')

    if (title) {
      title.textContent = t('tutorial.epilogue.title') || '튜토리얼 완료!'
    }

    if (body) {
      body.innerHTML = `
        <div class="tutorial-epilogue">
          <div class="epilogue-icon">🎉</div>
          <p>${t('tutorial.epilogue.text1') || '축하합니다! 화성에서 첫 김치 생산에 성공했습니다.'}</p>
          <p>${t('tutorial.epilogue.text2') || '이제 자유롭게 생산 라인을 확장하고 화성 김치 제국을 건설하세요!'}</p>
          <div class="epilogue-rewards">
            <h4>${t('tutorial.rewards') || '보상'}</h4>
            <ul>
              <li>💰 $1,000</li>
              <li>🔩 철판 ×50</li>
              <li>🏆 업적: "화성 김치 마스터"</li>
            </ul>
          </div>
        </div>
      `
    }

    if (continueBtn) {
      continueBtn.textContent = t('tutorial.start_game') || '게임 시작'
      continueBtn.onclick = () => {
        if (data.onClose) data.onClose()
        this.hideModal()
      }
    }

    this.modalContainer?.classList.remove('hidden')
  }

  /**
   * 단계 목표 UI 표시
   * @param {Object} goal - { title, description, objectives }
   */
  showStepGoal(goal) {
    const titleEl = document.getElementById('tutorial-goal-title')
    const descEl = document.getElementById('tutorial-goal-description')
    const objectivesEl = document.getElementById('tutorial-goal-objectives')

    if (titleEl) {
      titleEl.textContent = goal.title || ''
    }

    if (descEl) {
      descEl.textContent = goal.description || ''
    }

    if (objectivesEl && goal.objectives) {
      objectivesEl.innerHTML = goal.objectives
        .map(obj => {
          const progress = Math.min((obj.current / obj.target) * 100, 100)
          return `
          <div class="tutorial-objective">
            <div class="objective-label">
              <span>${obj.label}</span>
              <span class="objective-counter">${obj.current} / ${obj.target}</span>
            </div>
            <div class="objective-progress">
              <div class="objective-progress-bar" style="width: ${progress}%"></div>
            </div>
          </div>
        `
        })
        .join('')
    }

    this.goalPanel?.classList.remove('hidden')
  }

  /**
   * 목표 패널 숨기기
   */
  hideGoalPanel() {
    this.goalPanel?.classList.add('hidden')
  }

  // ========================================================================
  // SPEECH BUBBLE
  // ========================================================================

  /**
   * 말풍선 표시 (NPC 대화)
   * @param {Object} options - { name, text, avatar, x, y }
   */
  showSpeechBubble(options) {
    const nameEl = document.getElementById('speech-bubble-name')
    const textEl = document.getElementById('speech-bubble-text')
    const avatarEl = document.getElementById('speech-bubble-avatar-img')

    if (nameEl) {
      nameEl.textContent = options.name || 'NPC'
    }

    if (textEl) {
      textEl.textContent = options.text || ''
    }

    if (avatarEl && options.avatar) {
      avatarEl.src = options.avatar
    }

    // 위치 지정
    if (this.speechBubble) {
      if (options.x !== undefined && options.y !== undefined) {
        this.speechBubble.style.left = `${options.x}px`
        this.speechBubble.style.top = `${options.y}px`
      }
      this.speechBubble.classList.remove('hidden')
    }

    // 자동 닫기 (10초 후)
    setTimeout(() => {
      this.hideSpeechBubble()
    }, 10000)
  }

  /**
   * 말풍선 숨기기
   */
  hideSpeechBubble() {
    this.speechBubble?.classList.add('hidden')
  }

  // ========================================================================
  // SPOTLIGHT
  // ========================================================================

  /**
   * 스포트라이트 효과 (특정 요소 강조)
   * @param {string} selector - CSS 선택자
   */
  showSpotlight(selector) {
    const element = document.querySelector(selector)
    if (!element) {
      console.warn(`[TutorialUI] Spotlight target not found: ${selector}`)
      return
    }

    const rect = element.getBoundingClientRect()

    if (this.spotlightOverlay) {
      // SVG mask로 구멍 뚫기
      this.spotlightOverlay.innerHTML = `
        <svg width="100%" height="100%">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white"/>
              <rect x="${rect.left - 10}" y="${rect.top - 10}"
                    width="${rect.width + 20}" height="${rect.height + 20}"
                    fill="black" rx="8"/>
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%"
                fill="rgba(0,0,0,0.7)" mask="url(#spotlight-mask)"/>
        </svg>
      `
      this.spotlightOverlay.classList.remove('hidden')
    }

    // 요소에 펄스 애니메이션 추가
    element.classList.add('tutorial-spotlight-target')
  }

  /**
   * 스포트라이트 숨기기
   */
  hideSpotlight() {
    this.spotlightOverlay?.classList.add('hidden')

    // 모든 타겟에서 애니메이션 제거
    document.querySelectorAll('.tutorial-spotlight-target').forEach(el => {
      el.classList.remove('tutorial-spotlight-target')
    })
  }

  // ========================================================================
  // HELPERS
  // ========================================================================

  /**
   * 스킵 확인 대화상자
   */
  showSkipConfirmation() {
    const confirmed = confirm(t('tutorial.skip_confirm') || '정말 튜토리얼을 건너뛰시겠습니까?')
    if (confirmed) {
      tutorialSystem.skip()
      this.hideModal()
      this.hideGoalPanel()
      this.hideSpotlight()
    }
  }

  /**
   * 계속 버튼 핸들러
   */
  handleContinue() {
    const activeModal = useUIStore.getState().activeModal
    const modalData = useUIStore.getState().modalData || {}

    if (modalData.onContinue) {
      modalData.onContinue()
    }

    this.hideModal()
  }

  /**
   * 정리
   */
  destroy() {
    this.modalContainer?.remove()
    this.goalPanel?.remove()
    this.speechBubble?.remove()
    this.spotlightOverlay?.remove()

    this.modalContainer = null
    this.goalPanel = null
    this.speechBubble = null
    this.spotlightOverlay = null

    console.log('[TutorialUI] Destroyed')
  }
}

/**
 * 싱글톤 인스턴스
 */
let tutorialUIInstance = null

/**
 * TutorialUI 인스턴스 가져오기 (싱글톤)
 * @returns {TutorialUI}
 */
export function getTutorialUI() {
  if (!tutorialUIInstance) {
    tutorialUIInstance = new TutorialUI()
  }
  return tutorialUIInstance
}

/**
 * TutorialUI 초기화
 * @returns {TutorialUI}
 */
export function initTutorialUI() {
  return getTutorialUI()
}

/**
 * TutorialUI 정리
 */
export function destroyTutorialUI() {
  if (tutorialUIInstance) {
    tutorialUIInstance.destroy()
    tutorialUIInstance = null
  }
}
