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

// ======= 리스너 참조 (cleanup용) =======
let resizeHandler = null
let isInitialized = false

// ======= 수익 애니메이션 풀링 (DOM 생성/제거 최소화) =======
const INCOME_POOL_SIZE = 10
let incomePool = []
let poolIndex = 0
let poolParent = null

// ======= 떨어지는 애니메이션 풀링 =======
const FALLING_POOL_SIZE = 8
let fallingPool = []
let fallingPoolIndex = 0

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
  // 중복 초기화 방지
  if (isInitialized) {
    elWork = workElement
    return
  }
  isInitialized = true

  elWork = workElement

  // 리사이즈 시 캐시 무효화
  resizeHandler = () => {
    rectCache.workRect = null
  }
  window.addEventListener('resize', resizeHandler, { passive: true })

  // 수익 애니메이션 풀 초기화
  if (workElement && workElement.parentElement) {
    poolParent = workElement.parentElement
    poolParent.style.position = 'relative'
    for (let i = 0; i < INCOME_POOL_SIZE; i++) {
      const el = document.createElement('div')
      el.className = 'income-increase'
      el.style.position = 'absolute'
      el.style.zIndex = '1000'
      el.style.pointerEvents = 'none'
      el.style.display = 'none'
      poolParent.appendChild(el)
      incomePool.push(el)
    }
  }

  // 떨어지는 애니메이션 풀 초기화
  for (let i = 0; i < FALLING_POOL_SIZE; i++) {
    const el = document.createElement('div')
    el.className = 'falling-cookie'
    el.style.display = 'none'
    document.body.appendChild(el)
    fallingPool.push(el)
  }
}

/**
 * 애니메이션 시스템 정리 (cleanup)
 */
export function cleanupAnimations() {
  if (!isInitialized) return

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }

  // 수익 애니메이션 풀 정리
  incomePool.forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el)
  })
  incomePool = []
  poolIndex = 0
  poolParent = null

  // 떨어지는 애니메이션 풀 정리
  fallingPool.forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el)
  })
  fallingPool = []
  fallingPoolIndex = 0

  elWork = null
  rectCache = { workRect: null, containerRect: null, timestamp: 0 }
  isInitialized = false
}

/**
 * 떨어지는 지폐 애니메이션 (노동 클릭 시)
 * @param {number} clickX - 클릭 X 좌표
 * @param {number} clickY - 클릭 Y 좌표
 */
export function createFallingCookie(clickX, clickY) {
  if (fallingPool.length === 0) return

  const cookie = fallingPool[fallingPoolIndex]
  fallingPoolIndex = (fallingPoolIndex + 1) % FALLING_POOL_SIZE

  cookie.className = 'falling-cookie'
  cookie.textContent = '💵'
  cookie.style.left = clickX + Math.random() * 100 - 50 + 'px'
  cookie.style.top = clickY - 100 + 'px'
  cookie.style.display = 'block'
  cookie.style.animation = 'none'

  requestAnimationFrame(() => {
    cookie.style.animation = 'fallDown 2s ease-in forwards'
  })

  setTimeout(() => {
    cookie.style.display = 'none'
  }, 2000)
}

/**
 * 떨어지는 건물 애니메이션
 * @param {string} icon - 떨어뜨릴 이모지 아이콘
 * @param {number} count - 떨어뜨릴 개수
 */
export function createFallingBuilding(icon, count) {
  if (fallingPool.length === 0) return

  for (let i = 0; i < Math.min(count, 5); i++) {
    setTimeout(() => {
      const building = fallingPool[fallingPoolIndex]
      fallingPoolIndex = (fallingPoolIndex + 1) % FALLING_POOL_SIZE

      building.className = 'falling-cookie'
      building.textContent = icon
      building.style.left = Math.random() * window.innerWidth + 'px'
      building.style.top = '-100px'
      building.style.display = 'block'
      building.style.animation = 'none'

      requestAnimationFrame(() => {
        building.style.animation = 'fallDown 2s ease-in forwards'
      })

      setTimeout(() => {
        building.style.display = 'none'
      }, 2000)
    }, i * 200)
  }
}

/**
 * 수익 증가 애니메이션 (개선된 float-up 효과)
 * 오브젝트 풀링 적용: DOM 생성/제거 비용 최소화
 * @param {number} amount - 표시할 수익 금액
 */
export function showIncomeAnimation(amount) {
  if (!elWork || incomePool.length === 0) return // elWork 또는 풀이 초기화되지 않았으면 스킵

  // 노동 버튼 위치 기준으로 애니메이션 위치 설정 (캐시 사용)
  const { workRect, containerRect } = getCachedRects()
  if (!workRect || !containerRect) return

  // 풀에서 다음 요소 가져오기
  const animation = incomePool[poolIndex]
  poolIndex = (poolIndex + 1) % INCOME_POOL_SIZE

  // 텍스트 내용 업데이트
  const formattedAmount = NumberFormat.formatKoreanNumber(amount)
  animation.textContent = t('ui.incomeFormat', { amount: formattedAmount })

  // 노동 버튼 위쪽에 랜덤하게 표시
  animation.style.left = workRect.left - containerRect.left + Math.random() * 100 - 50 + 'px'
  animation.style.top = workRect.top - containerRect.top - 50 + 'px'

  // 초기 상태 설정
  animation.style.display = 'block'
  animation.style.opacity = '1'
  animation.style.transform = 'translateY(0px) scale(1)'
  animation.style.transition = 'none'

  // 다음 프레임에서 애니메이션 시작 (reflow 강제)
  requestAnimationFrame(() => {
    animation.style.transition = 'all 1.5s ease-out'
    animation.style.opacity = '0'
    animation.style.transform = 'translateY(-80px) scale(1.2)'
  })

  // 애니메이션 완료 후 숨김 (제거 대신 display: none)
  setTimeout(() => {
    animation.style.display = 'none'
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

  if (fallingPool.length === 0) return

  const emojiCount = 10
  const duration = 2000

  for (let i = 0; i < emojiCount; i++) {
    setTimeout(() => {
      const tower = fallingPool[fallingPoolIndex]
      fallingPoolIndex = (fallingPoolIndex + 1) % FALLING_POOL_SIZE

      tower.className = 'falling-tower'
      tower.textContent = '🗼'
      tower.style.left = Math.random() * window.innerWidth + 'px'
      tower.style.top = '-100px'
      tower.style.display = 'block'
      tower.style.animation = 'none'

      requestAnimationFrame(() => {
        tower.style.animation = 'fallDown 2s ease-in forwards'
      })

      setTimeout(() => {
        tower.style.display = 'none'
      }, duration)
    }, i * 80)
  }
}
