// shared/shell/headerAuth.js
// 헤더 인증 UI 초기화 통합 모듈
// 이 모듈은 hub/main.js, account/*.js, header.js 등에서 공통으로 사용됩니다.

/**
 * 헤더의 인증 UI를 초기화합니다.
 * @param {Object} options
 * @param {string} [options.scope='hub'] - 현재 페이지 스코프 (hub, account, game 등)
 * @param {string} [options.gameSlug='seoulsurvival'] - 닉네임 조회에 사용할 게임 슬러그
 */
export async function initHeaderAuth(options = {}) {
  const { scope = 'hub', gameSlug = 'seoulsurvival' } = options

  try {
    const { initAuthUI } = await import('../auth/ui.js')
    const { getUser, onAuthStateChange, getUserProfile } = await import('../auth/core.js')

    const loginBtn = document.getElementById('headerLoginBtn')
    const logoutBtn = document.getElementById('headerLogoutBtn')
    const accountMenu = document.getElementById('headerAccountMenu')
    const nicknameMobile = document.getElementById('headerAccountNicknameMobile')

    if (!loginBtn && !logoutBtn) return

    // 초기 상태 설정 (게스트 모드)
    if (loginBtn) loginBtn.style.display = 'block'
    if (accountMenu) accountMenu.style.display = 'none'

    // 닉네임 업데이트 함수
    async function updateNickname(user) {
      if (!nicknameMobile || !user) {
        if (nicknameMobile) nicknameMobile.textContent = 'Guest'
        return
      }

      try {
        const profile = await getUserProfile(gameSlug)
        if (profile.success && profile.user?.nickname) {
          nicknameMobile.textContent = profile.user.nickname
        } else {
          nicknameMobile.textContent = getFallbackName(user)
        }
      } catch (error) {
        console.warn(`[${scope}] Failed to get nickname:`, error)
        nicknameMobile.textContent = getFallbackName(user)
      }
    }

    // 폴백 이름 추출
    function getFallbackName(user) {
      return (
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.user_metadata?.preferred_username ||
        user?.email?.split('@')[0] ||
        'Guest'
      )
    }

    // 로그인 상태 변경 시 헤더 UI 업데이트
    async function updateHeaderUI(user) {
      const isLoggedIn = !!user

      if (loginBtn) {
        loginBtn.style.display = isLoggedIn ? 'none' : 'block'
      }

      if (accountMenu) {
        accountMenu.style.display = isLoggedIn ? 'block' : 'none'
      }

      await updateNickname(user)
    }

    // 초기 상태 설정
    const initial = await getUser()
    await updateHeaderUI(initial)

    // 인증 UI 초기화
    await initAuthUI({
      scope,
      providerButtons: [],
      defaultProvider: 'google',
      loginBtn,
      logoutBtn,
      userLabel: null, // 닉네임은 updateNickname에서 직접 관리
      statusLabel: null,
      toast: msg => console.log(`[${scope}]`, msg),
    })

    // initAuthUI 내부 콜백과 충돌 방지를 위한 지연 업데이트
    setTimeout(async () => {
      const currentUser = await getUser()
      await updateHeaderUI(currentUser)
    }, 100)

    // 로그인 상태 변경 감지
    onAuthStateChange(async user => {
      await updateHeaderUI(user)
    })

    // 닉네임 변경 이벤트 감지
    window.addEventListener('nicknamechanged', async event => {
      const newNickname = event.detail?.nickname
      if (newNickname && nicknameMobile) {
        nicknameMobile.textContent = newNickname
        console.log(`[${scope}] Nickname updated from event:`, newNickname)
      }
      const currentUser = await getUser()
      await updateHeaderUI(currentUser)
    })

    // authstatechange 이벤트 감지
    window.addEventListener('authstatechange', async () => {
      const currentUser = await getUser()
      await updateHeaderUI(currentUser)
    })
  } catch (error) {
    console.warn(`[${scope}] Header auth init failed, using guest mode:`, error)
    // 에러 발생 시 게스트 모드로 설정
    const loginBtn = document.getElementById('headerLoginBtn')
    const accountMenu = document.getElementById('headerAccountMenu')
    if (loginBtn) loginBtn.style.display = 'block'
    if (accountMenu) accountMenu.style.display = 'none'
  }
}
