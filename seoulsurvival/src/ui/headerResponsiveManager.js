/**
 * 헤더 반응형 관리자
 * 모바일에서 헤더가 2줄로 늘어나면 본문 상단 여백을 자동 보정
 */

/**
 * 헤더 반응형 관리자 팩토리
 * @returns {Object} 관리자 객체
 */
export function createHeaderResponsiveManager() {
  /**
   * 헤더 높이를 CSS 변수로 동기화
   */
  function syncHeaderHeight() {
    const header = document.querySelector('header')
    if (!header) return
    const h = Math.ceil(header.getBoundingClientRect().height || 0)
    if (h > 0) document.documentElement.style.setProperty('--header-h', `${h}px`)
  }

  /**
   * 리사이즈 이벤트 리스너 초기화
   */
  function initResizeListeners() {
    syncHeaderHeight()
    window.addEventListener('resize', syncHeaderHeight)

    // 모바일 주소창/뷰포트 변화 대응
    try {
      window.visualViewport?.addEventListener('resize', syncHeaderHeight)
    } catch {
      // Ignore if browser doesn't support this event
    }

    // 헤더 래핑/폰트 로딩 등으로 높이가 바뀌는 경우 대응
    try {
      const header = document.querySelector('header')
      if (header && 'ResizeObserver' in window) {
        new ResizeObserver(syncHeaderHeight).observe(header)
      }
    } catch {
      // Ignore if browser doesn't support this event
    }
  }

  return {
    syncHeaderHeight,
    initResizeListeners,
  }
}
