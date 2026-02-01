// games/seoulsurvival/patch-notes/main.js
import { getPatchNotesByGame } from '../../../hub/patchnotes.registry.js'
import { applyLang } from '../../../shared/i18n/lang.js'
import { renderHeader } from '../../../shared/shell/header.js'
import { renderFooter } from '../../../shared/shell/footer.js'

/**
 * 카테고리별 CSS 클래스 매핑
 */
const CATEGORY_CLASS_MAP = {
  feature: 'category-feature',
  fix: 'category-fix',
  balance: 'category-balance',
  ui: 'category-ui',
  content: 'category-content',
  performance: 'category-performance',
}

/**
 * 카테고리 레이블 (i18n)
 */
const CATEGORY_LABELS = {
  feature: { ko: '기능', en: 'Feature' },
  fix: { ko: '수정', en: 'Fix' },
  balance: { ko: '밸런스', en: 'Balance' },
  ui: { ko: 'UI', en: 'UI' },
  content: { ko: '콘텐츠', en: 'Content' },
  performance: { ko: '성능', en: 'Performance' },
}

/**
 * 패치노트 렌더링 (Seoul Survival 전용)
 */
function renderPatchNotes() {
  const container = document.getElementById('patchnotes-container')
  if (!container) return

  const lang = localStorage.getItem('clicksurvivor_lang') || 'ko'
  let notes = getPatchNotesByGame('seoulsurvival')

  // 날짜 역순 정렬 (최신순)
  notes = notes.sort((a, b) => new Date(b.date) - new Date(a.date))

  if (notes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>${lang === 'ko' ? '패치노트가 없습니다.' : 'No patch notes available.'}</p>
      </div>
    `
    return
  }

  container.innerHTML = notes
    .map(note => {
      const title = note.title[lang] || note.title.ko
      const items = note.items
        .map(item => {
          const text = item.text[lang] || item.text.ko
          const categoryClass = CATEGORY_CLASS_MAP[item.category] || 'category-feature'
          const categoryLabel = CATEGORY_LABELS[item.category]?.[lang] || item.category

          return `
            <div class="patch-item">
              <span class="patch-category ${categoryClass}">${categoryLabel}</span>
              ${text}
            </div>
          `
        })
        .join('')

      return `
        <div class="release-note">
          <div class="release-note-header">
            <span class="release-note-version">v${note.version}</span>
            <span class="release-note-title">${title}</span>
            <span class="release-note-date">${note.date}</span>
          </div>
          <div class="release-note-content">
            ${items}
          </div>
        </div>
      `
    })
    .join('')
}

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

  // 패치노트 렌더링
  renderPatchNotes()

  // 언어 변경 시 재렌더링
  window.addEventListener('languagechange', () => {
    renderPatchNotes()
  })
}

// DOM 로드 후 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
