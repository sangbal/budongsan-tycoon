/**
 * 설정 탭 관리자
 * 설정 토글, 언어 선택, 내보내기/가져오기 기능 관리
 */

import { safeGetJSON, safeSetJSON } from '../persist/storage.js'

/**
 * 설정 탭 관리자 팩토리
 * @param {Object} deps - 의존성
 * @param {Object} deps.settings - 설정 객체
 * @param {string} deps.SETTINGS_KEY - 설정 저장 키
 * @param {Function} deps.saveLoadManager - 저장/로드 관리자
 * @param {Function} deps.updateUI - UI 업데이트 함수
 * @param {Function} deps.updateAchievementGrid - 업적 그리드 업데이트 함수
 * @param {Function} deps.updateSaveStatus - 저장 상태 업데이트 함수
 * @param {Function} deps.refreshPrestigeTab - 프레스티지 탭 갱신 함수
 * @param {Function} deps.t - 번역 함수
 * @param {Function} deps.getLang - 현재 언어 가져오기
 * @param {Function} deps.setLang - 언어 설정
 * @param {Function} deps.applyI18nToDOMAsync - DOM에 번역 적용
 * @param {Object} deps.NumberFormat - 숫자 포맷 모듈
 * @param {Function} deps.getCareerName - 직급 이름 가져오기
 * @param {number} deps.getCareerLevel - 직급 레벨 가져오기
 * @param {Function} deps.safeText - 안전한 텍스트 설정
 * @returns {Object} 관리자 객체
 */
export function createSettingsTabManager(deps) {
  const {
    settings,
    SETTINGS_KEY,
    saveLoadManager,
    updateUI,
    updateAchievementGrid,
    updateSaveStatus,
    refreshPrestigeTab,
    t,
    getLang,
    setLang,
    applyI18nToDOMAsync,
    NumberFormat,
    getCareerName,
    getCareerLevel,
    safeText,
  } = deps

  /**
   * 설정 저장
   */
  function saveSettings() {
    try {
      safeSetJSON(SETTINGS_KEY, settings)
    } catch (error) {
      console.error('설정 저장 실패:', error)
    }
  }

  /**
   * 설정 불러오기
   */
  function loadSettings() {
    try {
      const saved = safeGetJSON(SETTINGS_KEY, null)
      if (saved) {
        Object.assign(settings, saved)
      }
    } catch (error) {
      console.error('설정 불러오기 실패:', error)
    }
  }

  /**
   * 언어 변경 시 모든 UI 업데이트
   */
  function updateAllUIForLanguage() {
    // 직급 표시 업데이트
    const currentCareerEl = document.getElementById('currentCareer')
    if (currentCareerEl) {
      safeText(currentCareerEl, getCareerName(getCareerLevel()))
    }

    // UI 업데이트 호출
    updateUI()

    // 업적 그리드 다시 렌더링
    updateAchievementGrid()

    // 경력 탭 다시 렌더링
    refreshPrestigeTab(t, NumberFormat.formatNumber)

    // 저장 상태 업데이트
    updateSaveStatus()
  }

  /**
   * 토글 스위치 설정 헬퍼
   */
  function setupToggle(el, key, afterChange) {
    if (el) {
      el.addEventListener('change', e => {
        settings[key] = e.target.checked
        saveSettings()
        afterChange?.()
      })
    }
  }

  /**
   * 설정 토글 항목의 클릭 영역 확대
   * - 설명 텍스트 클릭 시에도 토글 작동
   */
  function setupToggleClickExpansion() {
    const toggleContainers = document.querySelectorAll('.settings-toggle-container')

    toggleContainers.forEach(container => {
      const toggleInfo = container.querySelector('.settings-toggle-info')
      const input = container.querySelector('input[type="checkbox"]')

      if (toggleInfo && input) {
        toggleInfo.style.cursor = 'pointer'
        toggleInfo.addEventListener('click', () => {
          input.checked = !input.checked
          input.dispatchEvent(new Event('change', { bubbles: true }))
        })
      }
    })
  }

  /**
   * 설정 탭 초기화
   */
  function initSettingsTab() {
    // 설정 불러오기
    loadSettings()

    // 토글 초기값 설정
    const elToggleParticles = document.getElementById('toggleParticles')
    const elToggleFancyGraphics = document.getElementById('toggleFancyGraphics')
    const elToggleShortNumbers = document.getElementById('toggleShortNumbers')

    if (elToggleParticles) elToggleParticles.checked = settings.particles
    if (elToggleFancyGraphics) elToggleFancyGraphics.checked = settings.fancyGraphics
    if (elToggleShortNumbers) elToggleShortNumbers.checked = settings.shortNumbers

    // 토글 이벤트 리스너
    setupToggle(elToggleParticles, 'particles')
    setupToggle(elToggleFancyGraphics, 'fancyGraphics')
    setupToggle(elToggleShortNumbers, 'shortNumbers', updateUI)

    // 언어 선택 핸들러
    const elLanguageSelect = document.getElementById('languageSelect')
    if (elLanguageSelect) {
      elLanguageSelect.value = getLang()
      elLanguageSelect.addEventListener('change', async e => {
        const newLang = e.target.value
        setLang(newLang)
        await applyI18nToDOMAsync()
        updateAllUIForLanguage()
      })
    }

    // 내보내기/가져오기 버튼
    const elExportSaveBtn = document.getElementById('exportSaveBtn')
    const elImportSaveBtn = document.getElementById('importSaveBtn')
    const elImportFileInput = document.getElementById('importFileInput')

    if (elExportSaveBtn) {
      elExportSaveBtn.addEventListener('click', () => saveLoadManager.exportSave())
    }

    if (elImportSaveBtn) {
      elImportSaveBtn.addEventListener('click', () => {
        if (elImportFileInput) {
          elImportFileInput.click()
        }
      })
    }

    if (elImportFileInput) {
      elImportFileInput.addEventListener('change', e => {
        const file = e.target.files[0]
        if (file) {
          saveLoadManager.importSave(file)
        }
      })
    }

    // 새로 시작 버튼
    const elResetBtn = document.getElementById('resetBtn')
    const elResetBtnSettings = document.getElementById('resetBtnSettings')

    if (elResetBtn) {
      elResetBtn.addEventListener('click', () => saveLoadManager.resetGame())
    }
    if (elResetBtnSettings) {
      elResetBtnSettings.addEventListener('click', () => saveLoadManager.resetGame())
    }

    // 완전 초기화 버튼
    const elHardResetBtn = document.getElementById('hardResetBtn')
    if (elHardResetBtn) {
      elHardResetBtn.addEventListener('click', () => saveLoadManager.hardResetGame())
    }

    // 토글 클릭 영역 확대 설정
    setupToggleClickExpansion()
  }

  return {
    saveSettings,
    loadSettings,
    updateAllUIForLanguage,
    initSettingsTab,
  }
}
