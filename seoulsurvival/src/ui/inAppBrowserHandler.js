/**
 * 인앱 브라우저 감지 및 경고 시스템
 * 카카오톡, 인스타그램 등 인앱 브라우저에서 접속 시 경고 배너 표시
 */

/**
 * 인앱 브라우저 핸들러 팩토리
 * @param {Object} deps - 의존성
 * @param {Function} deps.t - 번역 함수
 * @returns {Object} 핸들러 객체
 */
export function createInAppBrowserHandler(deps) {
  const { t } = deps

  /**
   * 인앱 브라우저 감지
   * @returns {Object} 감지 결과
   */
  function detectInAppBrowser() {
    const ua = navigator.userAgent || ''
    const isKakao = ua.includes('KAKAOTALK')
    const isInstagram = ua.includes('Instagram')
    const isFacebook = ua.includes('FBAN') || ua.includes('FBAV')
    const isLine = ua.includes('Line')
    const isWeChat = ua.includes('MicroMessenger')
    const isInApp = isKakao || isInstagram || isFacebook || isLine || isWeChat
    return { isInApp, isKakao, isInstagram, isFacebook, isLine, isWeChat }
  }

  /**
   * URL 복사 기능
   * @param {string} url - 복사할 URL
   */
  async function copyUrl(url) {
    try {
      // 클립보드 API 시도 (HTTPS/localhost에서 동작)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
        alert(t('inapp.copied'))
        return
      }
      // Fallback: execCommand 사용
      const textArea = document.createElement('textarea')
      textArea.value = url
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        const successful = document.execCommand('copy')
        if (successful) {
          alert(t('inapp.copied'))
        } else {
          throw new Error('execCommand failed')
        }
      } catch {
        alert(t('inapp.copyFallback', { url }))
      } finally {
        document.body.removeChild(textArea)
      }
    } catch {
      alert(t('inapp.copyFallback', { url }))
    }
  }

  /**
   * 인앱 브라우저 경고 배너 표시
   */
  function showWarningIfNeeded() {
    const { isInApp } = detectInAppBrowser()
    if (!isInApp) return

    const banner = document.createElement('div')
    banner.className = 'inapp-warning-banner'
    banner.innerHTML = `
      ${t('inapp.banner.message')}<br />
      <strong>${t('inapp.banner.hint')}</strong>
      <div class="inapp-warning-actions">
        <button type="button" class="btn-small" id="copyGameUrlBtn">${t('inapp.banner.copyBtn')}</button>
        <button type="button" class="btn-small" id="closeInappWarningBtn">${t('inapp.banner.closeBtn')}</button>
      </div>
    `
    document.body.prepend(banner)

    const copyBtn = banner.querySelector('#copyGameUrlBtn')
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        copyUrl('https://clicksurvivor.com/seoulsurvival/')
      })
    }

    const closeBtn = banner.querySelector('#closeInappWarningBtn')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        banner.remove()
      })
    }
  }

  return {
    detectInAppBrowser,
    showWarningIfNeeded,
  }
}
