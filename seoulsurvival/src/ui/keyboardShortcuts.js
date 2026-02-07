/**
 * Seoul Survival - Keyboard Shortcuts
 *
 * 키보드 단축키 시스템
 * - Alt + 1-5: 탭 전환
 * - Ctrl + S: 수동 저장
 * - Ctrl + O: 저장 가져오기
 * - Ctrl + Shift + R: 게임 초기화
 */

/**
 * 키보드 단축키 시스템 생성
 * @param {Object} deps - 의존성
 * @param {Object} deps.saveLoadManager - 저장/로드 관리자
 * @param {Object} deps.Diary - 일기장 모듈
 * @param {Function} deps.t - i18n 번역 함수
 * @param {Function} deps.getImportFileInput - 파일 입력 요소 getter
 * @returns {Object} 키보드 단축키 관리 함수들
 */
export function createKeyboardShortcuts(deps) {
  const { saveLoadManager, Diary, t, getImportFileInput } = deps

  // 탭 매핑
  const TAB_MAPPING = {
    1: 'workTab',
    2: 'shopTab',
    3: 'statsTab',
    4: 'rankingTab',
    5: 'careerTab',
  }

  // 탭 순서 (Arrow 키 네비게이션용)
  const TAB_ORDER = ['workTab', 'shopTab', 'statsTab', 'rankingTab', 'careerTab']

  /**
   * 탭 전환 (Alt + 1-5)
   * @param {string} key - 눌린 키
   */
  function handleTabSwitch(key) {
    const targetTab = TAB_MAPPING[key]
    if (targetTab) {
      const targetBtn = document.querySelector(`.nav-btn[data-tab="${targetTab}"]`)
      if (targetBtn) {
        targetBtn.click()
      }
    }
  }

  /**
   * Arrow 키로 탭 네비게이션
   * @param {string} direction - 'left' | 'right'
   */
  function handleArrowTabSwitch(direction) {
    const activeBtn = document.querySelector('.nav-btn.active')
    if (!activeBtn) return

    const currentTab = activeBtn.dataset.tab
    const currentIndex = TAB_ORDER.indexOf(currentTab)
    if (currentIndex === -1) return

    let nextIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1
    // 순환
    if (nextIndex < 0) nextIndex = TAB_ORDER.length - 1
    if (nextIndex >= TAB_ORDER.length) nextIndex = 0

    const nextTab = TAB_ORDER[nextIndex]
    const nextBtn = document.querySelector(`.nav-btn[data-tab="${nextTab}"]`)
    if (nextBtn && nextBtn.offsetParent !== null) {
      // 보이는 탭만 선택
      nextBtn.click()
      nextBtn.focus()
    }
  }

  /**
   * 키보드 이벤트 핸들러
   * @param {KeyboardEvent} e - 키보드 이벤트
   */
  function handleKeydown(e) {
    // 입력 필드에서 단축키 비활성화
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return
    }

    // 탭 전환: Alt + 1-5 (접근성)
    if (e.altKey && e.key >= '1' && e.key <= '5') {
      e.preventDefault()
      handleTabSwitch(e.key)
      return
    }

    // Arrow 키로 탭 네비게이션 (탭 버튼에 포커스 있을 때만)
    if (e.target.classList.contains('nav-btn')) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleArrowTabSwitch('left')
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleArrowTabSwitch('right')
        return
      }
    }

    // Ctrl + Shift + R: 게임 초기화
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault()
      saveLoadManager.resetGame()
      return
    }

    // Ctrl + S: 수동 저장
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      saveLoadManager.saveGame()
      Diary.addLog(t('msg.manualSave'))
      return
    }

    // Ctrl + O: 저장 가져오기
    if (e.ctrlKey && e.key === 'o') {
      e.preventDefault()
      const importFileInput = getImportFileInput()
      if (importFileInput) {
        importFileInput.click()
      }
    }
  }

  /**
   * 키보드 단축키 이벤트 리스너 초기화
   */
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeydown)
  }

  /**
   * 키보드 단축키 이벤트 리스너 제거
   */
  function removeKeyboardShortcuts() {
    document.removeEventListener('keydown', handleKeydown)
  }

  return {
    initKeyboardShortcuts,
    removeKeyboardShortcuts,
    handleKeydown,
  }
}
