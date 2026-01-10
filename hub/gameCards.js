// hub/gameCards.js
// 게임 카드 렌더링 모듈

import { getGameList } from './games.registry.js'

/**
 * 현재 언어 코드를 가져옵니다.
 * @returns {'ko' | 'en'}
 */
function getActiveLang() {
  try {
    return localStorage.getItem('clicksurvivor_lang') || 'ko'
  } catch {
    return 'ko'
  }
}

/**
 * 게임 카드 HTML을 생성합니다.
 * @param {import('./games.registry.js').Game} game
 * @param {'ko' | 'en'} lang
 * @returns {string}
 */
function createGameCardHTML(game, lang) {
  const title = game.title[lang] || game.title.ko
  const description = (game.description[lang] || game.description.ko).replace(/\n/g, '<br>')
  const badgeHTML = game.badge ? `<span class="game-card-badge">${game.badge}</span>` : ''

  return `
    <a href="${game.href}" class="card game-card" style="text-decoration: none; color: inherit; transition: transform 0.2s; border: 1px solid var(--border); background: var(--bg-panel);">
      <div class="card-content">
        <h3 style="margin: 0 0 8px; font-size: 18px; color: var(--text);">${title}</h3>
        ${badgeHTML}
        <p style="margin: 0 0 16px; font-size: 14px; color: var(--text-muted); line-height: 1.5;">
          ${description}
        </p>
        <div class="btn btn-small" style="background: rgba(255,255,255,0.1);">Play Now &rarr;</div>
      </div>
    </a>
  `
}

/**
 * 게임 카드를 컨테이너에 렌더링합니다.
 * @param {HTMLElement} container - 게임 카드가 렌더링될 컨테이너
 * @param {Object} [options]
 * @param {boolean} [options.excludeFeatured=true] - 피처드 게임 제외 여부
 */
export function renderGameCards(container, options = {}) {
  if (!container) return

  const { excludeFeatured = true } = options
  const lang = getActiveLang()
  const games = getGameList(excludeFeatured)

  container.innerHTML = games.map(game => createGameCardHTML(game, lang)).join('')
}
