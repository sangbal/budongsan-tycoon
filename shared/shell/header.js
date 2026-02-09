// shared/shell/header.js
// 공통 헤더 컴포넌트 (모듈화 버전)

import { initHeaderMenu } from './headerMenu.js'
import { initHeaderActions } from './headerActions.js'
import { initLanguageSelector } from './headerLanguage.js'

/**
 * 현재 경로에 따라 헤더 링크 경로를 결정합니다.
 * @returns {{ homeHref: string, logoHref: string, accountHref: string }}
 */
function resolveHeaderPaths() {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  let homeHref = '/'
  let logoHref = '/images/logo.png'
  let accountHref = './account/'

  if (currentPath.includes('/seoulsurvival/')) {
    accountHref = '/account/'
  } else if (currentPath.includes('/account/')) {
    accountHref = './'
  } else if (currentPath.includes('/auth/callback/')) {
    accountHref = '/account/'
  }

  return { homeHref, logoHref, accountHref }
}

/**
 * 헤더를 렌더링합니다.
 * @param {HTMLElement} container - 헤더가 렌더링될 컨테이너
 */
export function renderHeader(container) {
  if (!container) return

  const { homeHref, logoHref, accountHref } = resolveHeaderPaths()

  container.innerHTML = `
    <header>
      <div class="header-brand" aria-label="ClickSurvivor Hub">
        <a href="${homeHref}" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px;">
          <img class="brand-icon" src="${logoHref}" alt="" aria-hidden="true" />
          <span class="brand-text"><b>ClickSurvivor</b></span>
        </a>
      </div>

      <!-- 즐겨찾기 / 홈 화면 안내 버튼 -->
      <button
        class="chip favorite-btn"
        id="headerFavoriteBtn"
        type="button"
        data-i18n-title="header.favorite.title"
        data-i18n-aria-label="header.favorite.ariaLabel"
      >
        <span class="favorite-icon">⭐</span>
        <span class="favorite-label" data-i18n="header.favorite.label">즐겨찾기</span>
      </button>

      <!-- 공유하기 버튼 -->
      <button class="chip share-btn" id="headerShareBtn" type="button" data-i18n-title="header.share.title" data-i18n-aria-label="header.share.ariaLabel">
        <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.6 2.6 0 0 0 0-1.39l7.02-4.11A2.99 2.99 0 1 0 14 5a3 3 0 0 0 .06.59L7.03 9.7A3 3 0 1 0 7 14.3l7.02 4.11A3 3 0 1 0 18 16.08z"></path>
        </svg>
        <span class="share-label" data-i18n="header.share.label">공유</span>
      </button>

      <!-- 언어 선택 드롭다운 -->
      <div class="language-selector">
        <label for="headerLanguageSelect" class="language-icon" data-i18n-aria-label="header.language.ariaLabel">🌐</label>
        <select id="headerLanguageSelect" class="language-select" data-i18n-aria-label="header.language.ariaLabel">
          <option value="ko">한국어</option>
          <option value="en">English</option>
        </select>
      </div>

      <nav class="header-nav" style="display: flex; gap: 10px; align-items: center;">
        <!-- 계정 버튼 (로그인 상태에 따라 동적 업데이트) -->
        <div class="header-account" id="headerAccount">
          <!-- 로그인 안 됨: Login 버튼 -->
          <button id="headerLoginBtn" class="chip login-btn" type="button" data-i18n-title="header.login.title" data-i18n-aria-label="header.login.ariaLabel">
            <span class="login-label" data-i18n="header.login.label">로그인</span>
          </button>
          <!-- 로그인 됨: 햄버거 메뉴 아이콘 -->
          <div id="headerAccountMenu" style="display: none; position: relative;">
            <!-- 모든 버전: 햄버거 메뉴 아이콘 -->
            <button id="headerAccountBtn" class="chip account-btn" type="button" data-i18n-title="header.account.title" data-i18n-aria-label="header.account.ariaLabel">
              <svg class="hamburger-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div id="headerAccountDropdown" class="account-dropdown">
              <div class="account-menu-header">
                <span id="headerAccountNicknameMobile" class="account-menu-nickname" data-i18n="header.account.guest">Guest</span>
              </div>
              <a href="${accountHref}" class="account-menu-item" data-i18n="header.account.manage">
                계정 관리
              </a>
              <button id="headerLogoutBtn" class="account-menu-item" type="button" data-i18n="header.logout.label">
                로그아웃
              </button>
            </div>
          </div>
          <!-- 모바일 바텀시트 오버레이 (body에 직접 렌더링) -->
          <div id="headerAccountOverlay" class="account-overlay"></div>
        </div>
      </nav>
    </header>
  `

  // 모듈화된 초기화 함수 호출
  initHeaderMenu(container)
  initHeaderActions(container)
  initLanguageSelector(container)
}

// 자동 렌더링 (terms.html, privacy.html 등에서 사용)
// 이 파일을 직접 script로 로드하는 페이지에서 자동으로 헤더를 렌더링합니다.
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('header-mount')
    if (container) {
      renderHeader(container)

      // 통합 headerAuth 모듈 사용
      try {
        const { initHeaderAuth } = await import('./headerAuth.js')
        await initHeaderAuth({ scope: 'static-page' })
      } catch (error) {
        console.warn('[Header] Auth init failed, using guest mode:', error)
        const loginBtn = document.getElementById('headerLoginBtn')
        const accountMenu = document.getElementById('headerAccountMenu')
        if (loginBtn) loginBtn.style.display = 'block'
        if (accountMenu) accountMenu.style.setProperty('display', 'none', 'important')
      }
    }
  })
}
