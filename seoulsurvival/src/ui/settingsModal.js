/**
 * Settings Modal Manager
 * 설정 모달 열기/닫기 및 관련 로직 관리
 */

/**
 * 설정 모달 관리자 생성
 * @param {Object} deps - 의존성
 * @param {Function} deps.syncNicknameFromServer - 서버 닉네임 동기화 함수
 * @returns {Object} 모달 관리 함수들
 */
export function createSettingsModal(deps) {
  const { syncNicknameFromServer } = deps

  let modalRoot = null
  let modalBody = null
  let modalCloseBtn = null
  let settingsContent = null

  /**
   * 설정 모달 초기화
   */
  function initSettingsModal() {
    modalRoot = document.getElementById('settingsModalRoot')
    modalBody = document.getElementById('settingsModalBody')
    modalCloseBtn = document.getElementById('settingsModalCloseBtn')
    settingsContent = document.getElementById('settingsTab')

    if (!modalRoot || !modalBody || !settingsContent) {
      console.error('설정 모달 요소를 찾을 수 없습니다.')
      return
    }

    // 설정 버튼 클릭 이벤트
    const settingsBtn = document.getElementById('settingsBtn')
    if (settingsBtn) {
      settingsBtn.addEventListener('click', openSettingsModal)
    }

    // 닫기 버튼 클릭 이벤트
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeSettingsModal)
    }

    // 오버레이 클릭 시 닫기
    modalRoot.addEventListener('click', e => {
      if (e.target === modalRoot) {
        closeSettingsModal()
      }
    })

    // ESC 키로 닫기
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modalRoot.style.display !== 'none') {
        closeSettingsModal()
      }
    })
  }

  /**
   * 설정 모달 열기
   */
  function openSettingsModal() {
    if (!modalRoot || !modalBody || !settingsContent) return

    // 설정 탭 콘텐츠를 모달로 이동
    const settingsCard = settingsContent.querySelector('.card')
    if (settingsCard) {
      // card 내부의 모든 stats-section만 이동 (h2 제외)
      const sections = Array.from(settingsCard.querySelectorAll('.stats-section'))
      sections.forEach(section => {
        modalBody.appendChild(section)
      })
    }

    // 서버 닉네임 동기화
    if (syncNicknameFromServer) {
      syncNicknameFromServer('')
    }

    // 모달 표시
    modalRoot.style.display = 'flex'

    // 포커스 트랩 (접근성)
    if (modalCloseBtn) {
      modalCloseBtn.focus()
    }
  }

  /**
   * 설정 모달 닫기
   */
  function closeSettingsModal() {
    if (!modalRoot || !modalBody || !settingsContent) return

    // 모달 콘텐츠를 다시 설정 탭으로 이동
    const settingsCard = settingsContent.querySelector('.card')
    if (settingsCard) {
      const sections = Array.from(modalBody.querySelectorAll('.stats-section'))
      sections.forEach(section => {
        settingsCard.appendChild(section)
      })
    }

    // 모달 숨김
    modalRoot.style.display = 'none'
  }

  return {
    initSettingsModal,
    openSettingsModal,
    closeSettingsModal,
  }
}
