/**
 * KIMCHI INVASION - Internationalization Module
 *
 * Handles language translations and localization.
 */

import ko from './translations/ko.js'
import en from './translations/en.js'

const TRANSLATIONS = { ko, en }
const SUPPORTED_LANGUAGES = ['ko', 'en']
const DEFAULT_LANGUAGE = 'ko'
const STORAGE_KEY = 'clicksurvivor_lang'

let currentLanguage = DEFAULT_LANGUAGE
let currentTranslations = ko

/**
 * Initialize i18n
 */
export async function initI18n() {
  // Check URL parameter first
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get('lang')

  // Then check localStorage
  const storedLang = localStorage.getItem(STORAGE_KEY)

  // Then check browser language
  const browserLang = navigator.language?.split('-')[0]

  // Determine language to use
  const lang =
    urlLang ||
    storedLang ||
    (SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : DEFAULT_LANGUAGE)

  setLanguage(lang)

  console.log(`[i18n] Initialized with language: ${currentLanguage}`)
}

/**
 * Set the current language
 */
export function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    console.warn(`[i18n] Unsupported language: ${lang}, falling back to ${DEFAULT_LANGUAGE}`)
    lang = DEFAULT_LANGUAGE
  }

  currentLanguage = lang
  currentTranslations = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANGUAGE]
  localStorage.setItem(STORAGE_KEY, lang)

  // Update HTML lang attribute
  document.documentElement.lang = lang

  // Dispatch event for UI to react
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }))
}

/**
 * Get the current language
 */
export function getLanguage() {
  return currentLanguage
}

// Alias for compatibility
export const getCurrentLanguage = getLanguage

/**
 * Get supported languages
 */
export function getSupportedLanguages() {
  return [...SUPPORTED_LANGUAGES]
}

/**
 * Translate a key
 * @param {string} key - Dot-notation key (e.g., 'ui.buttons.start')
 * @param {object} params - Optional parameters for interpolation
 * @returns {string} Translated string
 */
export function t(key, params = {}) {
  if (!key) return ''

  // Navigate to the key
  const keys = key.split('.')
  let value = currentTranslations

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // Key not found, try fallback
      value = getFallbackTranslation(key)
      break
    }
  }

  // If value is not a string, return key
  if (typeof value !== 'string') {
    console.warn(`[i18n] Translation not found: ${key}`)
    return key
  }

  // Interpolate parameters
  return interpolate(value, params)
}

/**
 * Get fallback translation (from default language)
 */
function getFallbackTranslation(key) {
  const keys = key.split('.')
  let value = TRANSLATIONS[DEFAULT_LANGUAGE]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return null
    }
  }

  return typeof value === 'string' ? value : null
}

/**
 * Interpolate parameters into a string
 * Supports {param} syntax
 */
function interpolate(str, params) {
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? params[key] : match
  })
}

/**
 * Format a number according to locale
 */
export function formatNumber(num, options = {}) {
  return new Intl.NumberFormat(currentLanguage, options).format(num)
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
  return formatNumber(amount, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

/**
 * Format a date according to locale
 */
export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat(currentLanguage, options).format(date)
}
