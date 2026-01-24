/**
 * Seoul Survival - Social Features
 *
 * 공유하기 및 즐겨찾기 기능
 */

/**
 * 소셜 기능 시스템 생성
 * @param {Object} deps - 의존성
 * @param {Function} deps.t - i18n 번역 함수
 * @param {Object} deps.Diary - 일기장 모듈
 * @param {Object} deps.Modal - 모달 모듈
 * @param {Object} deps.NumberFormat - 숫자 포맷 모듈
 * @param {Object} deps.settings - 설정 객체
 * @param {Function} deps.getCash - 현금 getter
 * @param {Function} deps.getRps - RPS getter
 * @returns {Object} 소셜 기능 관리 함수들
 */
export function createSocialFeatures(deps) {
  const { t, Diary, Modal, NumberFormat, settings, getCash, getRps } = deps

  /**
   * 게임 공유 (Web Share API)
   */
  async function shareGame() {
    const gameUrl = window.location.href
    const gameTitle = 'Seoul Survival : Rags to Riches'
    const gameDescription = t('share.description', {
      assets: NumberFormat.formatCashDisplay(getCash(), settings),
      rps: NumberFormat.formatCashDisplay(getRps(), settings),
    })

    // Web Share API만 사용 (링크 복사 fallback 제거)
    if (!navigator.share) {
      Diary.addLog(t('share.notSupported'))
      return
    }

    try {
      await navigator.share({
        title: gameTitle,
        text: gameDescription,
        url: gameUrl,
      })
      Diary.addLog(t('share.success'))
    } catch (err) {
      // 사용자가 공유 UI를 닫은 경우는 조용히 무시
      if (err?.name !== 'AbortError') {
        console.error('Share failed:', err)
        Diary.addLog(t('share.failed'))
      }
    }
  }

  /**
   * 즐겨찾기/홈 화면 안내
   */
  function handleFavoriteClick() {
    const url = window.location.href
    const title = document.title || 'Seoul Survival : Rags to Riches'
    const ua = navigator.userAgent.toLowerCase()
    const isMobile = /iphone|ipad|ipod|android/.test(ua)
    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isAndroid = /android/.test(ua)
    const isMac = navigator.platform.toUpperCase().includes('MAC')

    // (아주 옛날 IE 전용) 가능한 경우 직접 즐겨찾기 추가 시도
    if (window.external && typeof window.external.AddFavorite === 'function') {
      try {
        window.external.AddFavorite(url, title)
        Diary.addLog(t('favorite.added'))
        return
      } catch {
        // 실패하면 아래 안내로 fallback
      }
    }

    let message = ''
    const modalTitle = t('favorite.title')
    const icon = '⭐'

    if (isMobile) {
      if (isIOS) {
        message = t('favorite.ios')
      } else if (isAndroid) {
        message = t('favorite.android')
      } else {
        message = t('favorite.otherMobile')
      }
    } else {
      const shortcut = isMac ? '⌘ + D' : 'Ctrl + D'
      message = t('favorite.desktop', { shortcut })
    }

    Modal.openInfoModal(modalTitle, message, icon)
  }

  /**
   * 이벤트 리스너 초기화
   * @param {Object} elements - DOM 요소들
   * @param {HTMLElement} elements.shareBtn - 공유 버튼
   * @param {HTMLElement} elements.favoriteBtn - 즐겨찾기 버튼
   */
  function initEventListeners(elements) {
    const { shareBtn, favoriteBtn } = elements

    if (shareBtn) {
      shareBtn.addEventListener('click', shareGame)
    } else {
      console.error('공유 버튼을 찾을 수 없습니다.')
    }

    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', handleFavoriteClick)
    }
  }

  return {
    shareGame,
    handleFavoriteClick,
    initEventListeners,
  }
}
