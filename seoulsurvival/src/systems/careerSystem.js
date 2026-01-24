/**
 * Seoul Survival - Career/Promotion System
 *
 * 직급 승진 시스템 (Phase 14)
 * main.js에서 분리된 승진 체크 및 애니메이션 로직
 */

import { gameState } from '../state/gameState.js'
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
   * @returns {boolean} 승진 여부
   */
  function checkCareerPromotion() {
    const nextCareer = getNextCareer()
    if (nextCareer && gameState.totalClicks >= nextCareer.requiredClicks) {
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
