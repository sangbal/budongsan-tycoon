/**
 * bootstrapper.js - 게임 초기화 부트스트래퍼
 * 기초 시스템 초기화를 담당 (독립적인 초기화 로직만 포함)
 */

import { initSentry } from '../monitoring/sentry.js'
import { setupErrorBoundary } from './errorBoundary.js'
import * as Modal from '../ui/modal.js'
import * as Animations from '../ui/animations.js'
import { getInitialLang, setLang, applyI18nToDOMAsync } from '../i18n/index.js'

/**
 * 기초 시스템 초기화 (Sentry, 에러 바운더리, i18n, Modal)
 * @returns {Object} 초기화된 시스템 정보
 */
export function initFoundationSystems() {
  // ======= Sentry 초기화 (프로덕션 전용) =======
  if (import.meta.env.PROD) {
    initSentry()
  }

  // ======= 에러 바운더리 설정 =======
  setupErrorBoundary()

  // ======= i18n 초기화 =======
  // 초기 언어 설정 (URL → localStorage → 브라우저 언어)
  const initialLang = getInitialLang()
  setLang(initialLang)
  // 번역 로드 완료 후 DOM에 적용 (비동기)
  applyI18nToDOMAsync()

  // ======= 모달 시스템 초기화 =======
  Modal.initModal()

  return {
    initialLang,
    Modal,
  }
}

/**
 * 애니메이션 시스템 초기화
 * @param {HTMLElement} elWork - 노동 버튼 요소
 */
export function initAnimations(elWork) {
  Animations.initAnimations(elWork)
}

/**
 * 푸터 연도 설정
 */
export function initFooterYear() {
  const elCurrentYear = document.getElementById('currentYear')
  if (elCurrentYear) {
    elCurrentYear.textContent = new Date().getFullYear()
  }
}

/**
 * 개발 모드 로거 생성
 * @param {boolean} isDev - 개발 모드 여부
 * @returns {Object} 로거 객체
 */
export function createGameLogger(isDev) {
  return {
    log: isDev ? console.log.bind(console) : () => {},
    warn: isDev ? console.warn.bind(console) : () => {},
    error: isDev ? console.error.bind(console) : () => {},
  }
}

/**
 * 설정 초기값 생성
 * @returns {Object} 기본 설정 객체
 */
export function createDefaultSettings() {
  return {
    particles: true,
    fancyGraphics: true,
    shortNumbers: false,
  }
}
