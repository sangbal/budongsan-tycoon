/**
 * 인증 UI 관리자
 * 로그인/로그아웃 버튼 및 클라우드 세이브 섹션 표시 관리
 */

/**
 * 인증 UI 관리자 팩토리
 * @param {Object} deps - 의존성
 * @param {Function} deps.getUser - 현재 사용자 가져오기
 * @param {Function} deps.onAuthStateChange - 인증 상태 변경 리스너
 * @param {Function} deps.signInGoogle - 구글 로그인
 * @param {Function} deps.signOut - 로그아웃
 * @param {Function} deps.t - 번역 함수
 * @param {Function} deps.toastSuccess - 성공 토스트
 * @param {Function} deps.toastError - 에러 토스트
 * @returns {Object} 관리자 객체
 */
export function createAuthUIManager(deps) {
  const { getUser, onAuthStateChange, signInGoogle, signOut, t, toastSuccess, toastError } = deps

  /**
   * 인증 버튼 UI 업데이트
   * @param {Object|null} user - 현재 사용자
   */
  function updateAuthButtons(user) {
    const isLoggedIn = !!user
    const authProviderButtons = document.getElementById('authProviderButtons')
    const logoutButtonContainer = document.getElementById('logoutButtonContainer')
    const cloudSaveSection = document.getElementById('cloudSaveSection')

    if (authProviderButtons) authProviderButtons.style.display = isLoggedIn ? 'none' : 'flex'
    if (logoutButtonContainer) logoutButtonContainer.hidden = !isLoggedIn
    if (cloudSaveSection) cloudSaveSection.style.display = isLoggedIn ? 'block' : 'none'
  }

  /**
   * 인증 UI 초기화
   */
  function initAuthUI() {
    // 초기 인증 상태 확인 및 버튼 업데이트
    getUser().then(user => {
      updateAuthButtons(user)
    })

    // 인증 상태 변경 시 버튼 업데이트
    onAuthStateChange(user => {
      updateAuthButtons(user)
    })

    // 로그인 버튼 이벤트 리스너
    const googleLoginBtn = document.querySelector('[data-auth-provider="google"]')
    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', async () => {
        const result = await signInGoogle()
        if (!result.ok) {
          toastError(t('error.loginFailed'))
        }
      })
    }

    // 로그아웃 버튼 이벤트 리스너
    const logoutBtn = document.getElementById('logoutBtn')
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        const result = await signOut()
        if (result.ok) {
          toastSuccess(t('settings.logout') + ' ✅')
          setTimeout(() => location.reload(), 500)
        } else {
          toastError('로그아웃 실패')
        }
      })
    }
  }

  return {
    updateAuthButtons,
    initAuthUI,
  }
}
