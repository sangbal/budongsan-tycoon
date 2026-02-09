/**
 * Seoul Survival - Social Features
 *
 * 공유하기 및 즐겨찾기 기능
 */

import { getOrCreateReferralCode } from '@shared/referral.js'
import { getUser } from '@shared/auth/core.js'

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
   * @param {Object} context - 공유 맥락 (선택)
   * @param {string} context.type - 맥락 타입 ('tower', 'achievement', 'career', null)
   * @param {string} context.name - 업적/직업명 (type='achievement'/'career' 시)
   * @param {number} context.count - 타워 구매 횟수 (type='tower' 시)
   */
  async function shareGame(context = null) {
    // 게임 URL 생성 (로그인 시 추천 코드 자동 포함)
    let gameUrl = window.location.origin + window.location.pathname

    // 로그인 여부 확인 및 추천 코드 가져오기
    try {
      const user = await getUser()
      if (user) {
        const { success, code } = await getOrCreateReferralCode()
        if (success && code) {
          gameUrl += `?ref=${code}`
        }
      }
    } catch (err) {
      // 추천 코드 가져오기 실패 시 일반 URL 사용
      console.warn('Failed to get referral code for share:', err)
    }

    const gameTitle = t('game.title')
    let gameDescription = ''

    // 맥락별 메시지 생성
    if (context && context.type) {
      switch (context.type) {
        case 'tower':
          gameDescription = t('share.context.tower', {
            towerCount: context.count || 1,
          })
          break
        case 'achievement':
          gameDescription = t('share.context.achievement', {
            achievementName: context.name || '',
          })
          break
        case 'career':
          gameDescription = t('share.context.career', {
            career: context.name || '',
          })
          break
        default:
          // 기본 메시지 (역호환)
          gameDescription = t('share.description', {
            assets: NumberFormat.formatCashDisplay(getCash(), settings),
            rps: NumberFormat.formatCashDisplay(getRps(), settings),
          })
      }
    } else {
      // 역호환: context 미제공 시 기본 메시지
      gameDescription = t('share.description', {
        assets: NumberFormat.formatCashDisplay(getCash(), settings),
        rps: NumberFormat.formatCashDisplay(getRps(), settings),
      })
    }

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
    const title = document.title || t('game.title')
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
