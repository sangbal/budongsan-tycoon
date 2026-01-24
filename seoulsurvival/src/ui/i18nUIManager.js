/**
 * i18nUIManager.js - 언어 변경 UI 관리 모듈
 * 언어 변경 시 모든 UI 업데이트를 담당
 */

/**
 * 언어 UI 관리자 생성
 * @param {Object} deps - 의존성 객체
 * @returns {Object} 언어 UI 관리자 인스턴스
 */
export function createI18nUIManager(deps) {
  const {
    t,
    setLang,
    getLang,
    applyI18nToDOMAsync,
    safeText,
    getCareerName,
    getCareerLevel,
    updateUI,
    updateAchievementGrid,
    refreshPrestigeTab,
    updateSaveStatus,
    NumberFormat,
  } = deps

  /**
   * 언어 변경 시 모든 UI 업데이트
   */
  function updateAllUIForLanguage() {
    // 직급 표시 업데이트
    const currentCareerEl = document.getElementById('currentCareer')
    if (currentCareerEl) {
      safeText(currentCareerEl, getCareerName(getCareerLevel()))
    }

    // UI 업데이트 호출 (직급, 상품 이름 등이 포함됨)
    updateUI()

    // 업적 그리드 다시 렌더링 (툴팁 번역을 위해)
    if (updateAchievementGrid) {
      updateAchievementGrid()
    }

    // 경력 탭 다시 렌더링 (번역을 위해)
    if (refreshPrestigeTab) {
      refreshPrestigeTab(t, NumberFormat.formatNumber)
    }

    // 저장 상태 업데이트 (시간 포맷 번역을 위해)
    if (updateSaveStatus) {
      updateSaveStatus()
    }
  }

  /**
   * 언어 선택기 초기화
   */
  function initLanguageSelector() {
    const elLanguageSelect = document.getElementById('languageSelect')
    if (!elLanguageSelect) return

    // 현재 언어 설정
    elLanguageSelect.value = getLang()

    // 언어 변경 이벤트 리스너
    elLanguageSelect.addEventListener('change', async e => {
      const newLang = e.target.value
      setLang(newLang)
      await applyI18nToDOMAsync()
      updateAllUIForLanguage()
    })
  }

  /**
   * 설정 탭 토글 스위치 초기 상태 설정
   * @param {Object} settings - 설정 객체
   */
  function initSettingsToggles(settings) {
    const elToggleParticles = document.getElementById('toggleParticles')
    const elToggleFancyGraphics = document.getElementById('toggleFancyGraphics')
    const elToggleShortNumbers = document.getElementById('toggleShortNumbers')

    if (elToggleParticles) elToggleParticles.checked = settings.particles
    if (elToggleFancyGraphics) elToggleFancyGraphics.checked = settings.fancyGraphics
    if (elToggleShortNumbers) elToggleShortNumbers.checked = settings.shortNumbers
  }

  return {
    updateAllUIForLanguage,
    initLanguageSelector,
    initSettingsToggles,
  }
}
