// games/seoulsurvival/main.js
// Seoul Survival 게임 페이지 진입점

import { renderHeader } from '../../hub/components/header.js'
import { renderFooter } from '../../hub/components/footer.js'
import { applyLang } from '../../shared/i18n/core.js'
import { getGameById } from '../../hub/games.registry.js'

const GAME_ID = 'seoulsurvival'

/**
 * 게임 데이터 렌더링
 */
function renderGamePage() {
  const game = getGameById(GAME_ID)
  if (!game) {
    console.error(`Game not found: ${GAME_ID}`)
    return
  }

  const currentLang = localStorage.getItem('clicksurvivor_lang') || 'ko'

  // Hero Capsule Image
  renderHeroCapsule(game, currentLang)

  // Game Info Panel
  renderGameInfo(game, currentLang)

  // Media Gallery
  renderMediaGallery(game, currentLang)

  // About Content
  renderAboutContent(game, currentLang)
}

/**
 * 히어로 캡슐 이미지 렌더링
 */
function renderHeroCapsule(game, lang) {
  const capsuleEl = document.getElementById('hero-capsule')
  if (game.media?.capsuleImage) {
    capsuleEl.src = game.media.capsuleImage
    capsuleEl.alt = game.title[lang]
  } else {
    // Placeholder
    capsuleEl.src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23222" width="800" height="450"/%3E%3Ctext x="50%25" y="50%25" fill="%23999" font-size="24" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
    capsuleEl.alt = 'Placeholder'
  }
}

/**
 * 게임 정보 패널 렌더링
 */
function renderGameInfo(game, lang) {
  // Title & Subtitle
  document.getElementById('game-title').textContent = game.title[lang]
  if (game.subtitle) {
    document.getElementById('game-subtitle').textContent = game.subtitle[lang]
  }

  // Short Description
  const shortDescEl = document.getElementById('game-short-description')
  if (game.shortDescription) {
    shortDescEl.textContent = game.shortDescription[lang]
  }

  // Tags
  renderTags(game.tags)

  // Features
  renderFeatures(game.features, lang)

  // Meta
  if (game.releaseDate) {
    document.getElementById('release-date').textContent = game.releaseDate
  }
  if (game.developer) {
    document.getElementById('developer').textContent = game.developer
  }
  document.getElementById('status').textContent = game.status

  // Browser Compatibility
  renderBrowserCompat(game.browserCompat)
}

/**
 * 태그 렌더링
 */
function renderTags(tags) {
  const tagsContainer = document.getElementById('game-tags')
  if (!tags || tags.length === 0) return

  tagsContainer.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('')
}

/**
 * 특징 렌더링
 */
function renderFeatures(features, lang) {
  const featuresContainer = document.getElementById('game-features')
  if (!features || features.length === 0) return

  featuresContainer.innerHTML = features
    .map(
      feature => `
    <div class="feature-item">
      <span class="feature-icon">${feature.icon}</span>
      <span class="feature-text">${feature.text[lang]}</span>
    </div>
  `
    )
    .join('')
}

/**
 * 브라우저 호환성 렌더링
 */
function renderBrowserCompat(browserCompat) {
  const compatList = document.getElementById('browser-compat-list')
  if (!browserCompat) return

  const browsers = [
    { name: 'Chrome', key: 'chrome' },
    { name: 'Firefox', key: 'firefox' },
    { name: 'Safari', key: 'safari' },
    { name: 'Edge', key: 'edge' },
  ]

  compatList.innerHTML = browsers
    .filter(b => browserCompat[b.key])
    .map(b => `<span class="browser-item">${b.name} ${browserCompat[b.key]}</span>`)
    .join('')
}

/**
 * 미디어 갤러리 렌더링
 */
function renderMediaGallery(game, lang) {
  const galleryEl = document.getElementById('media-gallery')
  if (!game.media?.screenshots || game.media.screenshots.length === 0) {
    galleryEl.innerHTML = '<p style="color: #999; text-align: center;">스크린샷 준비 중</p>'
    return
  }

  galleryEl.innerHTML = game.media.screenshots
    .map(
      (src, i) => `
    <div class="screenshot-item">
      <img src="${src}" alt="${game.title[lang]} Screenshot ${i + 1}" loading="lazy" />
    </div>
  `
    )
    .join('')
}

/**
 * About 섹션 렌더링
 */
function renderAboutContent(game, lang) {
  const aboutEl = document.getElementById('about-content')
  if (game.aboutContent) {
    aboutEl.innerHTML = game.aboutContent[lang]
  }
}

/**
 * 초기화
 */
function init() {
  // Header & Footer 렌더링
  renderHeader()
  renderFooter()

  // 게임 페이지 렌더링
  renderGamePage()

  // i18n 적용
  applyLang()
}

// DOM 로드 후 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
