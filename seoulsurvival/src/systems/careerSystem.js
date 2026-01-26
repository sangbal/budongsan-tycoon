/**
 * Seoul Survival - Career/Promotion System
 *
 * 직급 승진 시스템 (Phase 14)
 * main.js에서 분리된 승진 체크 및 애니메이션 로직
 */

import { gameState, CAREER_LEVELS } from '../state/gameState.js'
import {
  getClickIncome,
  getCurrentCareer,
  getNextCareer,
  getCareerName,
} from '../economy/incomeCalculator.js'
import { t } from '../i18n/index.js'
import * as NumberFormat from '../utils/numberFormat.js'
import * as Diary from './diary.js'
import { ANIMATION } from '../balance/timing.js'
import { getEffectivePromotionRequirement } from './prestigeBonus.js'

// 프리로드된 이미지 URL 캐시
const preloadedImages = new Set()

/**
 * 이미지 프리로드
 * @param {string} imageUrl - 프리로드할 이미지 URL
 * @returns {Promise<void>}
 */
function preloadImage(imageUrl) {
  if (!imageUrl || preloadedImages.has(imageUrl)) {
    return Promise.resolve()
  }

  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      preloadedImages.add(imageUrl)
      resolve()
    }
    img.onerror = resolve // 에러 시에도 resolve (무시)
    img.src = imageUrl
  })
}

/**
 * 현재 레벨 및 다음 레벨 배경 이미지 프리로드
 * 게임 시작 시 호출하여 부드러운 전환 보장
 */
export function preloadCareerImages() {
  const currentLevel = gameState.careerLevel
  const imagesToPreload = []

  // 현재 레벨 이미지
  if (CAREER_LEVELS[currentLevel]?.bgImage) {
    imagesToPreload.push(CAREER_LEVELS[currentLevel].bgImage)
  }

  // 다음 레벨 이미지
  if (CAREER_LEVELS[currentLevel + 1]?.bgImage) {
    imagesToPreload.push(CAREER_LEVELS[currentLevel + 1].bgImage)
  }

  // 병렬 프리로드
  return Promise.all(imagesToPreload.map(preloadImage))
}

/**
 * 커리어 시스템 생성
 * @param {Object} deps - 의존성
 * @param {HTMLElement} deps.elWorkArea - 작업 영역 DOM 요소
 * @returns {Object} 커리어 관리 함수들
 */
export function createCareerSystem(deps) {
  const { elWorkArea } = deps

  /**
   * 승진 체크 및 처리
   * CP 클릭 가치 보너스와 인맥 업그레이드 감소가 적용됨
   * @returns {boolean} 승진 여부
   */
  function checkCareerPromotion() {
    const nextCareer = getNextCareer()
    if (!nextCareer) return false

    // CP 보너스와 인맥 감소가 적용된 유효 요구량 계산
    const effectiveRequirement = getEffectivePromotionRequirement(nextCareer.requiredClicks)

    if (gameState.totalClicks >= effectiveRequirement) {
      gameState.careerLevel += 1
      const newCareer = getCurrentCareer()
      const clickIncome = getClickIncome()

      Diary.addLog(
        t('msg.promoted', {
          career: getCareerName(gameState.careerLevel),
          income: NumberFormat.formatKoreanNumber(clickIncome),
        })
      )

      // 승진 시 전환 애니메이션
      if (elWorkArea) {
        // 페이드 아웃 효과
        elWorkArea.style.transition = `opacity ${ANIMATION.CAREER_FADE_OUT}ms ease-out`
        elWorkArea.style.opacity = '0.5'

        setTimeout(() => {
          // 배경 이미지 변경
          if (newCareer.bgImage) {
            elWorkArea.style.transition = `background-image ${ANIMATION.CAREER_BG_TRANSITION}ms ease-in-out, opacity ${ANIMATION.CAREER_FADE_IN}ms ease-in`
            elWorkArea.style.backgroundImage = `url('${newCareer.bgImage}')`
          } else {
            elWorkArea.style.transition = `background-image ${ANIMATION.CAREER_BG_TRANSITION}ms ease-in-out, opacity ${ANIMATION.CAREER_FADE_IN}ms ease-in`
            elWorkArea.style.backgroundImage =
              'radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)'
          }

          // 페이드 인 효과
          elWorkArea.style.opacity = '1'
        }, ANIMATION.CAREER_FADE_OUT)
      }

      // 직급 카드 애니메이션 효과
      const careerCard = document.querySelector('.career-card')
      if (careerCard) {
        careerCard.style.animation = 'none'
        setTimeout(() => {
          careerCard.style.animation = `careerPromotion ${ANIMATION.CAREER_CARD}ms ease-out`
        }, 10)
      }

      // 스크린 리더 알림
      const currentCareerEl = document.getElementById('currentCareer')
      if (currentCareerEl) {
        currentCareerEl.setAttribute(
          'aria-label',
          t('msg.promoted', {
            career: getCareerName(gameState.careerLevel),
            income: NumberFormat.formatKoreanNumber(clickIncome),
          })
        )
      }

      // 다음 레벨 이미지 프리로드 (비동기, 에러 무시)
      const upcomingCareer = CAREER_LEVELS[gameState.careerLevel + 1]
      if (upcomingCareer?.bgImage) {
        preloadImage(upcomingCareer.bgImage)
      }

      return true
    }
    return false
  }

  return {
    checkCareerPromotion,
    // incomeCalculator에서 import한 함수들도 re-export (편의성)
    getClickIncome,
    getCurrentCareer,
    getNextCareer,
    getCareerName,
  }
}
