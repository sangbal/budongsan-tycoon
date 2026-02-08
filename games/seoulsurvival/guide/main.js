// games/seoulsurvival/guide/main.js
import { applyLang } from '@shared/i18n/lang.js'
import { renderHeader } from '@shared/shell/header.js'
import { renderFooter } from '@shared/shell/footer.js'

/**
 * 페이지 초기화
 */
function init() {
  // Header & Footer 렌더링
  const headerMount = document.getElementById('header-mount')
  const footerMount = document.getElementById('footer-mount')

  if (headerMount) renderHeader(headerMount)
  if (footerMount) renderFooter(footerMount)

  // i18n 적용
  applyLang()
}

// DOM 로드 후 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
