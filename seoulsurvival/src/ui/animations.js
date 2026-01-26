/**
 * Seoul Survival - Animation System
 *
 * 게임의 애니메이션 효과
 * - 떨어지는 지폐 (Falling Cookie)
 * - 떨어지는 건물 (Falling Building)
 * - 수익 증가 애니메이션 (Income Animation)
 * - 서울타워 이펙트 (Tower Fall Effect)
 */

import { t } from '../i18n/index.js'
import * as NumberFormat from '../utils/numberFormat.js'

// ======= DOM 참조 =======
let elWork = null

// ======= 위치 캐시 (성능 최적화) =======
let rectCache = { workRect: null, containerRect: null, timestamp: 0 }
const RECT_CACHE_TTL = 1000 // 1초 유효

/**
 * 캐시된 위치 정보 반환 (getBoundingClientRect 호출 최소화)
 * @returns {Object} { workRect, containerRect }
 */
function getCachedRects() {
  if (!elWork) return { workRect: null, containerRect: null }

  const now = Date.now()
  if (!rectCache.workRect || now - rectCache.timestamp > RECT_CACHE_TTL) {
    rectCache.workRect = elWork.getBoundingClientRect()
    rectCache.containerRect = elWork.parentElement?.getBoundingClientRect() || null
    rectCache.timestamp = now
  }
  return rectCache
}

/**
 * 애니메이션 시스템 초기화
 * DOM 요소 참조를 설정합니다.
 * @param {HTMLElement} workElement - 노동 버튼 요소
 */
export function initAnimations(workElement) {
  elWork = workElement

  // 리사이즈 시 캐시 무효화
  window.addEventListener(
    'resize',
    () => {
      rectCache.workRect = null
    },
    { passive: true }
  )
}

/**
 * 떨어지는 지폐 애니메이션 (노동 클릭 시)
 * @param {number} clickX - 클릭 X 좌표
 * @param {number} clickY - 클릭 Y 좌표
 */
export function createFallingCookie(clickX, clickY) {
  const cookie = document.createElement('div')
  cookie.className = 'falling-cookie'
  cookie.textContent = '💵' // 지폐만 떨어뜨리기

  // 클릭 위치 기준으로 설정
  cookie.style.left = clickX + Math.random() * 100 - 50 + 'px'
  cookie.style.top = clickY - 100 + 'px'

  document.body.appendChild(cookie)

  // 애니메이션 완료 후 요소 제거
  setTimeout(() => {
    if (cookie.parentNode) {
      cookie.parentNode.removeChild(cookie)
    }
  }, 2000)
}

/**
 * 떨어지는 건물 애니메이션
 * @param {string} icon - 떨어뜨릴 이모지 아이콘
 * @param {number} count - 떨어뜨릴 개수
 */
export function createFallingBuilding(icon, count) {
  for (let i = 0; i < Math.min(count, 5); i++) {
    // 최대 5개까지만 애니메이션
    setTimeout(() => {
      const building = document.createElement('div')
      building.className = 'falling-cookie'
      building.textContent = icon

      // 화면 상단에서 랜덤하게 떨어뜨리기
      building.style.left = Math.random() * window.innerWidth + 'px'
      building.style.top = '-100px'

      document.body.appendChild(building)

      // 애니메이션 완료 후 요소 제거
      setTimeout(() => {
        if (building.parentNode) {
          building.parentNode.removeChild(building)
        }
      }, 2000)
    }, i * 200) // 0.2초 간격으로 순차 생성
  }
}

/**
 * 수익 증가 애니메이션 (개선된 float-up 효과)
 * @param {number} amount - 표시할 수익 금액
 */
export function showIncomeAnimation(amount) {
  if (!elWork) return // elWork가 초기화되지 않았으면 스킵

  const animation = document.createElement('div')
  animation.className = 'income-increase'
  const formattedAmount = NumberFormat.formatKoreanNumber(amount)
  animation.textContent = t('ui.incomeFormat', { amount: formattedAmount })

  // 노동 버튼 위치 기준으로 애니메이션 위치 설정 (캐시 사용)
  const { workRect, containerRect } = getCachedRects()
  if (!workRect || !containerRect) return

  // 노동 버튼 위쪽에 랜덤하게 표시
  animation.style.position = 'absolute'
  animation.style.left = workRect.left - containerRect.left + Math.random() * 100 - 50 + 'px'
  animation.style.top = workRect.top - containerRect.top - 50 + 'px'
  animation.style.zIndex = '1000'
  animation.style.pointerEvents = 'none'

  elWork.parentElement.style.position = 'relative'
  elWork.parentElement.appendChild(animation)

  // 애니메이션 효과
  animation.style.opacity = '1'
  animation.style.transform = 'translateY(0px) scale(1)'

  // 떠오르는 애니메이션
  setTimeout(() => {
    animation.style.transition = 'all 1.5s ease-out'
    animation.style.opacity = '0'
    animation.style.transform = 'translateY(-80px) scale(1.2)'
  }, 100)

  // 애니메이션 완료 후 제거
  setTimeout(() => {
    if (animation.parentElement) {
      animation.parentElement.removeChild(animation)
    }
  }, 1600)
}

/**
 * 서울타워 이펙트: 하늘에서 이모지 떨어지는 애니메이션
 */
export function createTowerFallEffect() {
  // prefers-reduced-motion 체크
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    return // 애니메이션 생략
  }

  const emojiCount = 30 // 이모지 개수 증가 (15 → 30)
  const duration = 2000 // 2초

  for (let i = 0; i < emojiCount; i++) {
    setTimeout(() => {
      const tower = document.createElement('div')
      tower.className = 'falling-tower'
      tower.textContent = '🗼'

      // 화면 상단에서 랜덤하게 떨어뜨리기
      tower.style.left = Math.random() * window.innerWidth + 'px'
      tower.style.top = '-100px'

      // body에 직접 추가하여 모달 오버레이 위에 표시
      document.body.appendChild(tower)

      // 애니메이션 완료 후 요소 제거
      setTimeout(() => {
        if (tower.parentNode) {
          tower.parentNode.removeChild(tower)
        }
      }, duration)
    }, i * 40) // 0.04초 간격으로 순차 생성 (더 빠르게)
  }
}
