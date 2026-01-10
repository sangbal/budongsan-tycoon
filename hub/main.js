// Hub 메인 진입점
// 공통 Shell 렌더링 (헤더/푸터) 및 인증 초기화
import { renderHeader } from '../shared/shell/header.js'
import { renderFooter } from '../shared/shell/footer.js'
import { initHeaderAuth } from '../shared/shell/headerAuth.js'
import { renderGameCards } from './gameCards.js'

// DOM 준비 후 실행
document.addEventListener('DOMContentLoaded', async () => {
  const headerMount = document.getElementById('header-mount')
  const footerMount = document.getElementById('footer-mount')
  const gameCardsMount = document.getElementById('game-cards-mount')

  if (headerMount) {
    renderHeader(headerMount)
    await initHeaderAuth({ scope: 'hub' })
  }

  if (footerMount) {
    renderFooter(footerMount)
  }

  // 게임 카드 동적 렌더링
  if (gameCardsMount) {
    renderGameCards(gameCardsMount, { excludeFeatured: true })
  }

  console.log('[Hub] 초기화 완료')
})
