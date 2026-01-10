// shared/shell/headerActions.js
// 헤더 공유하기, 즐겨찾기 기능

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
    const pageTitle = document.title || 'ClickSurvivor Hub'
    const pageDescription = '게임 허브 - 여러 게임을 한 곳에서 플레이하세요'

    if (!navigator.share) {
      alert('이 기기/브라우저에서는 공유하기를 지원하지 않습니다.')
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
    const title = document.title || 'ClickSurvivor Hub'
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
    const modalTitle = '즐겨찾기 / 홈 화면에 추가'
    const icon = '⭐'

    if (isMobileDevice) {
      if (isIOS) {
        message =
          'iPhone/iPad에서는 Safari 하단의 공유 버튼(□↑)을 누른 뒤\n' +
          '"홈 화면에 추가"를 선택하면 바탕화면에 아이콘이 만들어집니다.'
      } else if (isAndroid) {
        message =
          'Android에서는 브라우저 오른쪽 위 메뉴(⋮)에서\n' +
          '"홈 화면에 추가" 또는 "앱 설치"를 선택하면 바탕화면에 아이콘이 만들어집니다.'
      } else {
        message = '이 기기에서는 브라우저의 메뉴에서 "홈 화면에 추가" 기능을 사용해 주세요.'
      }
    } else {
      const shortcut = isMac ? '⌘ + D' : 'Ctrl + D'
      message = `${shortcut} 를 눌러 이 페이지를 브라우저 즐겨찾기에 추가할 수 있습니다.`
    }

    alert(`${icon} ${modalTitle}\n\n${message}`)
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
