// shared/shell/headerActions.js
// 헤더 공유하기, 즐겨찾기 기능

import { translate } from '../i18n/lang.js'

/**
 * 공유하기 버튼 이벤트를 초기화합니다.
 * @param {HTMLElement} container - 헤더가 렌더링된 컨테이너
 */
export function initShareButton(container) {
  if (!container) return

  const shareBtn = container.querySelector('#headerShareBtn')
  if (!shareBtn) return

  shareBtn.addEventListener('click', async () => {
    const pageUrl = window.location.href
    const pageTitle = document.title || translate('header.share.defaultTitle')
    const pageDescription = translate('header.share.description')

    if (!navigator.share) {
      alert(translate('header.share.unsupported'))
      return
    }

    try {
      await navigator.share({
        title: pageTitle,
        text: pageDescription,
        url: pageUrl,
      })
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.error('공유 실패:', err)
      }
    }
  })
}

/**
 * 즐겨찾기/홈 화면 추가 버튼 이벤트를 초기화합니다.
 * @param {HTMLElement} container - 헤더가 렌더링된 컨테이너
 */
export function initFavoriteButton(container) {
  if (!container) return

  const favoriteBtn = container.querySelector('#headerFavoriteBtn')
  if (!favoriteBtn) return

  favoriteBtn.addEventListener('click', () => {
    const url = window.location.href
    const title = document.title || translate('header.share.defaultTitle')
    const ua = navigator.userAgent.toLowerCase()
    const isMobileDevice = /iphone|ipad|ipod|android/.test(ua)
    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isAndroid = /android/.test(ua)
    const isMac = navigator.platform.toUpperCase().includes('MAC')

    // IE 전용 즐겨찾기 추가 시도
    if (window.external && typeof window.external.AddFavorite === 'function') {
      try {
        window.external.AddFavorite(url, title)
        return
      } catch {
        // 실패하면 아래 안내로 fallback
      }
    }

    let message = ''

    if (isMobileDevice) {
      if (isIOS) {
        message = translate('header.favorite.ios')
      } else if (isAndroid) {
        message = translate('header.favorite.android')
      } else {
        message = translate('header.favorite.mobileGeneric')
      }
    } else {
      const shortcut = isMac ? '⌘ + D' : 'Ctrl + D'
      message = translate('header.favorite.desktop').replace('{shortcut}', shortcut)
    }

    alert(message)
  })
}

/**
 * 모든 헤더 액션 버튼을 초기화합니다.
 * @param {HTMLElement} container - 헤더가 렌더링된 컨테이너
 */
export function initHeaderActions(container) {
  initShareButton(container)
  initFavoriteButton(container)
}
