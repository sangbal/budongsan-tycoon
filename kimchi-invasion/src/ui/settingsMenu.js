/**
 * KIMCHI INVASION - Settings Menu UI
 *
 * @description 설정 메뉴 (볼륨, 언어, 그래픽, 게임 초기화)
 * @module ui/settingsMenu
 */

import { t, setLanguage, getCurrentLanguage } from '../i18n/index.js'
import { useSettingsStore } from '../state/stores/settingsStore.js'
import { useGameStore } from '../state/stores/gameStore.js'

/**
 * 설정 메뉴 UI 관리 클래스
 */
export class SettingsMenu {
  constructor() {
    /** @type {HTMLElement|null} 모달 컨테이너 */
    this.modalContainer = null

    /** @type {boolean} 모달 표시 상태 */
    this.isOpen = false

    this.init()
  }

  /**
   * 초기화
   */
  init() {
    this.createModal()
    this.bindEvents()
    this.subscribeToStore()

    console.log('[SettingsMenu] Initialized')
  }

  /**
   * 모달 생성
   */
  createModal() {
    this.modalContainer = document.createElement('div')
    this.modalContainer.id = 'settings-modal'
    this.modalContainer.className = 'settings-modal hidden'
    this.modalContainer.innerHTML = `
      <div class="settings-modal-backdrop"></div>
      <div class="settings-modal-content">
        <div class="settings-modal-header">
          <h2 id="settings-modal-title">${t('settings.title')}</h2>
          <button id="settings-close-btn" class="settings-close-btn" aria-label="Close">✕</button>
        </div>
        <div class="settings-modal-body">
          <!-- Volume Section -->
          <section class="settings-section">
            <h3 class="settings-section-title">${t('settings.volume')}</h3>

            <!-- Master Volume -->
            <div class="settings-row">
              <label for="master-volume-slider" class="settings-label">
                <span class="settings-label-text">${t('settings.master')}</span>
                <span id="master-volume-value" class="settings-value">70%</span>
              </label>
              <div class="settings-slider-container">
                <input
                  type="range"
                  id="master-volume-slider"
                  class="settings-slider"
                  min="0"
                  max="100"
                  value="70"
                  aria-label="Master Volume"
                />
              </div>
            </div>

            <!-- Sound Effects Volume -->
            <div class="settings-row">
              <label for="sfx-volume-slider" class="settings-label">
                <span class="settings-label-text">${t('settings.sfx')}</span>
                <span id="sfx-volume-value" class="settings-value">70%</span>
              </label>
              <div class="settings-slider-container">
                <input
                  type="range"
                  id="sfx-volume-slider"
                  class="settings-slider"
                  min="0"
                  max="100"
                  value="70"
                  aria-label="Sound Effects Volume"
                />
              </div>
            </div>

            <!-- Music Volume -->
            <div class="settings-row">
              <label for="bgm-volume-slider" class="settings-label">
                <span class="settings-label-text">${t('settings.bgm')}</span>
                <span id="bgm-volume-value" class="settings-value">50%</span>
              </label>
              <div class="settings-slider-container">
                <input
                  type="range"
                  id="bgm-volume-slider"
                  class="settings-slider"
                  min="0"
                  max="100"
                  value="50"
                  aria-label="Background Music Volume"
                />
              </div>
            </div>
          </section>

          <!-- Language Section -->
          <section class="settings-section">
            <h3 class="settings-section-title">${t('settings.language')}</h3>
            <div class="settings-row">
              <div class="settings-button-group" role="radiogroup" aria-label="Language">
                <button
                  id="lang-ko-btn"
                  class="settings-btn settings-btn-active"
                  data-lang="ko"
                  role="radio"
                  aria-checked="true"
                >
                  한국어
                </button>
                <button
                  id="lang-en-btn"
                  class="settings-btn"
                  data-lang="en"
                  role="radio"
                  aria-checked="false"
                >
                  English
                </button>
              </div>
            </div>
          </section>

          <!-- Graphics Section -->
          <section class="settings-section">
            <h3 class="settings-section-title">${t('settings.graphics')}</h3>

            <!-- Pixel Effect -->
            <div class="settings-row">
              <label for="pixel-effect-toggle" class="settings-label">
                <span class="settings-label-text">${t('settings.pixelEffect')}</span>
              </label>
              <button
                id="pixel-effect-toggle"
                class="settings-toggle"
                role="switch"
                aria-checked="false"
                aria-label="Pixel Effect"
              >
                <span class="settings-toggle-slider"></span>
              </button>
            </div>

            <!-- Particle Quality -->
            <div class="settings-row">
              <label class="settings-label">
                <span class="settings-label-text">${t('settings.particles')}</span>
              </label>
              <div class="settings-button-group" role="radiogroup" aria-label="Particle Quality">
                <button
                  class="settings-btn settings-btn-sm"
                  data-quality="low"
                  role="radio"
                >
                  ${getCurrentLanguage() === 'ko' ? '낮음' : 'Low'}
                </button>
                <button
                  class="settings-btn settings-btn-sm settings-btn-active"
                  data-quality="medium"
                  role="radio"
                  aria-checked="true"
                >
                  ${getCurrentLanguage() === 'ko' ? '중간' : 'Medium'}
                </button>
                <button
                  class="settings-btn settings-btn-sm"
                  data-quality="high"
                  role="radio"
                >
                  ${getCurrentLanguage() === 'ko' ? '높음' : 'High'}
                </button>
              </div>
            </div>
          </section>

          <!-- Other Section -->
          <section class="settings-section">
            <h3 class="settings-section-title">${getCurrentLanguage() === 'ko' ? '기타' : 'Other'}</h3>

            <!-- Tutorial Replay -->
            <div class="settings-row">
              <button id="tutorial-replay-btn" class="settings-action-btn">
                <span>🎓</span>
                <span>${t('settings.tutorialReplay')}</span>
              </button>
            </div>

            <!-- Reset Game -->
            <div class="settings-row">
              <button id="reset-game-btn" class="settings-action-btn settings-action-btn-danger">
                <span>⚠️</span>
                <span>${t('settings.reset')}</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    `
    document.body.appendChild(this.modalContainer)
  }

  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    // Close button
    const closeBtn = document.getElementById('settings-close-btn')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close())
    }

    // Backdrop click to close
    const backdrop = this.modalContainer?.querySelector('.settings-modal-backdrop')
    if (backdrop) {
      backdrop.addEventListener('click', () => this.close())
    }

    // ESC key to close
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close()
      }
    })

    // Volume sliders
    this.bindVolumeSlider('master-volume-slider', 'master-volume-value', volume => {
      const settings = useSettingsStore.getState()
      settings.setSoundVolume(volume / 100)
      settings.setMusicVolume(volume / 100)
    })

    this.bindVolumeSlider('sfx-volume-slider', 'sfx-volume-value', volume => {
      const settings = useSettingsStore.getState()
      settings.setSoundVolume(volume / 100)
    })

    this.bindVolumeSlider('bgm-volume-slider', 'bgm-volume-value', volume => {
      const settings = useSettingsStore.getState()
      settings.setMusicVolume(volume / 100)
    })

    // Language buttons
    const langButtons = this.modalContainer?.querySelectorAll('[data-lang]')
    langButtons?.forEach(btn => {
      btn.addEventListener('click', e => {
        const lang = e.currentTarget.dataset.lang
        this.changeLanguage(lang)
      })
    })

    // Pixel effect toggle
    const pixelToggle = document.getElementById('pixel-effect-toggle')
    if (pixelToggle) {
      pixelToggle.addEventListener('click', () => {
        const isEnabled = pixelToggle.getAttribute('aria-checked') === 'true'
        pixelToggle.setAttribute('aria-checked', !isEnabled)
        // TODO: Apply pixel effect to PixiJS renderer
        console.log('[SettingsMenu] Pixel effect:', !isEnabled)
      })
    }

    // Particle quality buttons
    const particleButtons = this.modalContainer?.querySelectorAll('[data-quality]')
    particleButtons?.forEach(btn => {
      btn.addEventListener('click', e => {
        const quality = e.currentTarget.dataset.quality
        this.changeParticleQuality(quality)
      })
    })

    // Tutorial replay button
    const tutorialBtn = document.getElementById('tutorial-replay-btn')
    if (tutorialBtn) {
      tutorialBtn.addEventListener('click', () => {
        this.replayTutorial()
      })
    }

    // Reset game button
    const resetBtn = document.getElementById('reset-game-btn')
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetGame()
      })
    }
  }

  /**
   * 볼륨 슬라이더 바인딩
   * @param {string} sliderId - 슬라이더 ID
   * @param {string} valueId - 값 표시 ID
   * @param {Function} onChange - 변경 콜백
   */
  bindVolumeSlider(sliderId, valueId, onChange) {
    const slider = document.getElementById(sliderId)
    const valueEl = document.getElementById(valueId)

    if (slider && valueEl) {
      slider.addEventListener('input', e => {
        const value = parseInt(e.target.value, 10)
        valueEl.textContent = `${value}%`
        onChange(value)
      })
    }
  }

  /**
   * 설정 스토어 구독
   */
  subscribeToStore() {
    // Sound volume 변경 감지
    useSettingsStore.subscribe(
      state => state.soundVolume,
      volume => {
        const slider = document.getElementById('sfx-volume-slider')
        const valueEl = document.getElementById('sfx-volume-value')
        if (slider && valueEl) {
          const percent = Math.round(volume * 100)
          slider.value = percent
          valueEl.textContent = `${percent}%`
        }
      }
    )

    // Music volume 변경 감지
    useSettingsStore.subscribe(
      state => state.musicVolume,
      volume => {
        const slider = document.getElementById('bgm-volume-slider')
        const valueEl = document.getElementById('bgm-volume-value')
        if (slider && valueEl) {
          const percent = Math.round(volume * 100)
          slider.value = percent
          valueEl.textContent = `${percent}%`
        }
      }
    )

    // Graphics quality 변경 감지
    useSettingsStore.subscribe(
      state => state.graphicsQuality,
      quality => {
        const buttons = this.modalContainer?.querySelectorAll('[data-quality]')
        buttons?.forEach(btn => {
          const isActive = btn.dataset.quality === quality
          btn.classList.toggle('settings-btn-active', isActive)
          btn.setAttribute('aria-checked', isActive)
        })
      }
    )
  }

  /**
   * 언어 변경
   * @param {string} lang - ko | en
   */
  changeLanguage(lang) {
    setLanguage(lang)
    useSettingsStore.getState().setLanguage(lang)

    // Update button states
    const buttons = this.modalContainer?.querySelectorAll('[data-lang]')
    buttons?.forEach(btn => {
      const isActive = btn.dataset.lang === lang
      btn.classList.toggle('settings-btn-active', isActive)
      btn.setAttribute('aria-checked', isActive)
    })

    // Reload UI text
    this.updateText()
  }

  /**
   * 파티클 품질 변경
   * @param {string} quality - low | medium | high
   */
  changeParticleQuality(quality) {
    useSettingsStore.getState().setGraphicsQuality(quality)

    // Update button states
    const buttons = this.modalContainer?.querySelectorAll('[data-quality]')
    buttons?.forEach(btn => {
      const isActive = btn.dataset.quality === quality
      btn.classList.toggle('settings-btn-active', isActive)
      btn.setAttribute('aria-checked', isActive)
    })

    console.log('[SettingsMenu] Particle quality:', quality)
  }

  /**
   * 튜토리얼 다시 보기
   */
  replayTutorial() {
    const confirmed = confirm(
      getCurrentLanguage() === 'ko' ? '튜토리얼을 다시 시작하시겠습니까?' : 'Restart the tutorial?'
    )

    if (confirmed) {
      // Reset tutorial progress
      localStorage.removeItem('kimchi-invasion-tutorial-progress')
      localStorage.removeItem('kimchi-invasion-tutorial-completed')

      // Reload page
      window.location.reload()
    }
  }

  /**
   * 게임 초기화
   */
  resetGame() {
    const confirmed = confirm(t('settings.resetConfirm'))

    if (confirmed) {
      // Double confirmation for safety
      const doubleConfirm = confirm(
        getCurrentLanguage() === 'ko'
          ? '정말로 모든 진행 상황을 삭제하시겠습니까? (되돌릴 수 없습니다)'
          : 'Are you absolutely sure? This action cannot be undone.'
      )

      if (doubleConfirm) {
        // Clear all game data
        localStorage.removeItem('kimchi-invasion-game')
        localStorage.removeItem('kimchi-invasion-tutorial-progress')

        // Reset game state
        useGameStore.getState().reset()

        // Reload page
        window.location.reload()
      }
    }
  }

  /**
   * UI 텍스트 업데이트 (언어 변경 시)
   */
  updateText() {
    const title = document.getElementById('settings-modal-title')
    if (title) {
      title.textContent = t('settings.title')
    }

    // Update section titles
    const sections = this.modalContainer?.querySelectorAll('.settings-section-title')
    if (sections) {
      sections[0].textContent = t('settings.volume')
      sections[1].textContent = t('settings.language')
      sections[2].textContent = t('settings.graphics')
      sections[3].textContent = getCurrentLanguage() === 'ko' ? '기타' : 'Other'
    }

    // Update labels
    const labels = this.modalContainer?.querySelectorAll('.settings-label-text')
    if (labels) {
      labels[0].textContent = t('settings.master')
      labels[1].textContent = t('settings.sfx')
      labels[2].textContent = t('settings.bgm')
      labels[3].textContent = t('settings.pixelEffect')
      labels[4].textContent = t('settings.particles')
    }

    // Update particle quality buttons
    const particleButtons = this.modalContainer?.querySelectorAll('[data-quality]')
    if (particleButtons) {
      particleButtons[0].textContent = getCurrentLanguage() === 'ko' ? '낮음' : 'Low'
      particleButtons[1].textContent = getCurrentLanguage() === 'ko' ? '중간' : 'Medium'
      particleButtons[2].textContent = getCurrentLanguage() === 'ko' ? '높음' : 'High'
    }

    // Update action buttons
    const tutorialBtn = document.getElementById('tutorial-replay-btn')
    if (tutorialBtn) {
      const span = tutorialBtn.querySelector('span:last-child')
      if (span) span.textContent = t('settings.tutorialReplay')
    }

    const resetBtn = document.getElementById('reset-game-btn')
    if (resetBtn) {
      const span = resetBtn.querySelector('span:last-child')
      if (span) span.textContent = t('settings.reset')
    }
  }

  /**
   * 모달 열기
   */
  open() {
    if (this.isOpen) return

    // Sync UI with current settings
    this.syncUIWithState()

    this.modalContainer?.classList.remove('hidden')
    this.isOpen = true

    console.log('[SettingsMenu] Opened')
  }

  /**
   * 모달 닫기
   */
  close() {
    if (!this.isOpen) return

    this.modalContainer?.classList.add('hidden')
    this.isOpen = false

    console.log('[SettingsMenu] Closed')
  }

  /**
   * UI를 현재 설정 상태와 동기화
   */
  syncUIWithState() {
    const settings = useSettingsStore.getState()

    // Volume sliders
    const sfxSlider = document.getElementById('sfx-volume-slider')
    const sfxValue = document.getElementById('sfx-volume-value')
    if (sfxSlider && sfxValue) {
      const percent = Math.round(settings.soundVolume * 100)
      sfxSlider.value = percent
      sfxValue.textContent = `${percent}%`
    }

    const bgmSlider = document.getElementById('bgm-volume-slider')
    const bgmValue = document.getElementById('bgm-volume-value')
    if (bgmSlider && bgmValue) {
      const percent = Math.round(settings.musicVolume * 100)
      bgmSlider.value = percent
      bgmValue.textContent = `${percent}%`
    }

    // Master volume (average of sfx and bgm)
    const masterSlider = document.getElementById('master-volume-slider')
    const masterValue = document.getElementById('master-volume-value')
    if (masterSlider && masterValue) {
      const percent = Math.round(((settings.soundVolume + settings.musicVolume) / 2) * 100)
      masterSlider.value = percent
      masterValue.textContent = `${percent}%`
    }

    // Language
    const currentLang = settings.language
    const langButtons = this.modalContainer?.querySelectorAll('[data-lang]')
    langButtons?.forEach(btn => {
      const isActive = btn.dataset.lang === currentLang
      btn.classList.toggle('settings-btn-active', isActive)
      btn.setAttribute('aria-checked', isActive)
    })

    // Graphics quality
    const quality = settings.graphicsQuality
    const qualityButtons = this.modalContainer?.querySelectorAll('[data-quality]')
    qualityButtons?.forEach(btn => {
      const isActive = btn.dataset.quality === quality
      btn.classList.toggle('settings-btn-active', isActive)
      btn.setAttribute('aria-checked', isActive)
    })
  }

  /**
   * 토글 (열기/닫기)
   */
  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  /**
   * 정리
   */
  destroy() {
    this.modalContainer?.remove()
    this.modalContainer = null
    this.isOpen = false

    console.log('[SettingsMenu] Destroyed')
  }
}

/**
 * 싱글톤 인스턴스
 */
let settingsMenuInstance = null

/**
 * SettingsMenu 인스턴스 가져오기 (싱글톤)
 * @returns {SettingsMenu}
 */
export function getSettingsMenu() {
  if (!settingsMenuInstance) {
    settingsMenuInstance = new SettingsMenu()
  }
  return settingsMenuInstance
}

/**
 * SettingsMenu 초기화
 * @returns {SettingsMenu}
 */
export function initSettingsMenu() {
  return getSettingsMenu()
}

/**
 * 설정 메뉴 열기
 */
export function openSettingsMenu() {
  getSettingsMenu().open()
}

/**
 * 설정 메뉴 닫기
 */
export function closeSettingsMenu() {
  getSettingsMenu().close()
}

/**
 * 설정 메뉴 토글
 */
export function toggleSettingsMenu() {
  getSettingsMenu().toggle()
}

/**
 * SettingsMenu 정리
 */
export function destroySettingsMenu() {
  if (settingsMenuInstance) {
    settingsMenuInstance.destroy()
    settingsMenuInstance = null
  }
}
