/**
 * 공용 i18n 유틸 (hub/i18n.js 재사용)
 */

import ko from './translations/ko.js'
import en from './translations/en.js'

export const STORAGE_KEY = 'clicksurvivor_lang'

export const translations = {
  ko,
  en,
}

export const SUPPORTED_LANGS = Object.keys(translations)

// 모듈 레벨 캐시
let _cachedLang = null

export function resolveLang(input) {
  const v = String(input || '').toLowerCase()
  return SUPPORTED_LANGS.includes(v) ? v : null
}

export function getLangFromUrl() {
  if (typeof window === 'undefined') return null
  const u = new URL(window.location.href)
  return resolveLang(u.searchParams.get('lang'))
}

export function getInitialLang() {
  if (typeof window === 'undefined') return 'ko'
  try {
    const fromUrl = getLangFromUrl()
    if (fromUrl) return fromUrl
    const saved = resolveLang(localStorage.getItem(STORAGE_KEY))
    if (saved) return saved
    const nav = String(navigator.language || '').toLowerCase()
    if (nav.startsWith('ko')) return 'ko'
    return 'en'
  } catch (e) {
    console.warn('[lang] localStorage access failed, using navigator language:', e.message)
    return navigator?.language?.split('-')[0] || 'ko'
  }
}

export function getActiveLang() {
  if (_cachedLang) return _cachedLang
  _cachedLang = getInitialLang()
  return _cachedLang
}

/**
 * 번역 함수
 */
export function t(dict) {
  const lang = getActiveLang()
  return dict[lang] || dict.ko || ''
}

/**
 * DOM에 i18n 적용
 */
export function applyLang(lang) {
  if (typeof document === 'undefined') return lang

  // lang이 명시되지 않았다면 저장된 언어 또는 초기 언어 사용
  let resolved
  if (lang === undefined || lang === null) {
    resolved = getInitialLang() // URL → localStorage → navigator 순서
  } else {
    resolved = resolveLang(lang)
    if (!resolved) {
      console.warn(`[lang] Invalid language "${lang}", falling back to saved/default`)
      resolved = getInitialLang()
    }
  }

  document.documentElement.lang = resolved

  const table = translations[resolved] || translations.ko

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (!key) return
    const v = table[key]
    if (typeof v === 'string') el.textContent = v
  })

  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt')
    if (!key) return
    const v = table[key]
    if (typeof v === 'string') el.setAttribute('alt', v)
  })

  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label')
    if (!key) return
    const v = table[key]
    if (typeof v === 'string') el.setAttribute('aria-label', v)
  })

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title')
    if (!key) return
    const v = table[key]
    if (typeof v === 'string') el.setAttribute('title', v)
  })

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, resolved)
    } catch (e) {
      console.warn('[lang] Failed to persist language to localStorage:', e.message)
    }
  }

  // 캐시 갱신
  _cachedLang = resolved

  // Note: URL lang parameter handling disabled to prevent infinite loops
  return resolved
}

/**
 * 번역 키로부터 번역된 텍스트를 반환합니다.
 * alert() 등 동적 메시지에서 사용하세요.
 */
export function translate(key, fallback = '') {
  const lang = getActiveLang()
  const table = translations[lang] || translations.ko || {}
  return table[key] ?? fallback
}
