/**
 * Seoul Survival - Work/Click System
 *
 * 클릭 처리 및 수익 계산 시스템
 */

import { t } from '../i18n/index.js'
import { PROBABILITY, TIMING } from '../balance/timing.js'
import * as Diary from './diary.js'
import * as Animations from '../ui/animations.js'

/**
 * 워크 시스템 생성
 * @param {Object} deps - 의존성
 * @param {Object} deps.state - gameState 객체
 * @param {Object} deps.UPGRADES - 업그레이드 정보 객체
 * @param {Object} deps.CAREER_LEVELS - 직급 레벨 정보 배열
 * @param {Object} deps.settings - 설정 객체 (particles 등)
 * @param {Function} deps.getClickIncome - 클릭 수익 계산 함수
 * @param {Function} deps.checkCareerPromotion - 승진 체크 함수
 * @param {Function} deps.updateUpgradeProgress - 업그레이드 진행률 업데이트 함수
 * @param {Function} deps.updateUI - UI 업데이트 함수
 * @param {HTMLElement} deps.elWork - 작업 버튼 DOM 요소
 * @returns {Object} 워크 관리 함수들
 */
export function createWorkSystem(deps) {
  const {
    state,
    UPGRADES,
    CAREER_LEVELS,
    settings,
    getClickIncome,
    checkCareerPromotion,
    updateUpgradeProgress,
    updateUI,
    elWork,
  } = deps

  /**
   * 클릭 수익 계산 (순수 함수)
   * @returns {number} 클릭 수익
   */
  function calculateClickIncome() {
    return getClickIncome()
  }

  /**
   * 성과급 적용 (순수 함수)
   * @param {number} income - 기본 수익
   * @returns {{ income: number, bonusApplied: boolean }} 성과급 적용 결과
   */
  function applyPerformanceBonus(income) {
    const hasBonusUpgrade = UPGRADES['performance_bonus'] && UPGRADES['performance_bonus'].purchased

    if (hasBonusUpgrade && Math.random() < PROBABILITY.PERFORMANCE_BONUS_CHANCE) {
      return {
        income: income * PROBABILITY.PERFORMANCE_BONUS_MULTIPLIER,
        bonusApplied: true,
      }
    }

    return { income, bonusApplied: false }
  }

  /**
   * 업그레이드 진행률 체크 및 알림
   * @description 미니 목표 알림: 다음 업그레이드까지 남은 클릭 수 체크
   */
  function checkUpgradeProgress() {
    const lockedUpgrades = Object.entries(UPGRADES)
      .filter(([id, u]) => u.category === 'labor' && !u.unlocked && !u.purchased)
      .map(([id, u]) => {
        const conditionStr = u.unlockCondition.toString()

        // totalClicks 조건 체크
        const match = conditionStr.match(/totalClicks\s*>=\s*(\d+)/)
        if (match) {
          return { id, requiredClicks: parseInt(match[1]), upgrade: u }
        }

        // careerLevel 조건 체크
        const careerMatch = conditionStr.match(/careerLevel\s*>=\s*(\d+)/)
        if (careerMatch) {
          const careerLevel = parseInt(careerMatch[1])
          const requiredClicks = CAREER_LEVELS[careerLevel]?.requiredClicks || Infinity
          return { id, requiredClicks, upgrade: u }
        }

        return null
      })
      .filter(x => x !== null)
      .sort((a, b) => a.requiredClicks - b.requiredClicks)

    if (lockedUpgrades.length > 0) {
      const nextUpgrade = lockedUpgrades[0]
      const remaining = nextUpgrade.requiredClicks - state.totalClicks

      // 50클릭, 25클릭, 10클릭, 5클릭 남았을 때 알림
      if (remaining === 50 || remaining === 25 || remaining === 10 || remaining === 5) {
        Diary.addLog(
          t('msg.nextUpgradeHint', { name: t(`upgrade.${nextUpgrade.id}.name`), remaining })
        )
      }
    }
  }

  /**
   * 클릭 애니메이션 적용
   * @param {number} clientX - 클릭 X 좌표
   * @param {number} clientY - 클릭 Y 좌표
   */
  function applyClickAnimation(clientX, clientY) {
    // 떨어지는 쿠키 애니메이션 생성 (설정에서 활성화된 경우만)
    if (settings.particles) {
      Animations.createFallingCookie(clientX ?? 0, clientY ?? 0)
    }

    // 클릭 애니메이션 효과
    elWork.classList.add('click-effect')
    setTimeout(() => elWork.classList.remove('click-effect'), TIMING.CLICK_EFFECT_DURATION_MS)
  }

  /**
   * 클릭 액션 처리
   * @param {number} clientX - 클릭 X 좌표 (optional)
   * @param {number} clientY - 클릭 Y 좌표 (optional)
   */
  function handleWorkAction(clientX, clientY) {
    // 1. 클릭 수익 계산
    let income = calculateClickIncome()

    // 2. 성과급 적용
    const { income: finalIncome, bonusApplied } = applyPerformanceBonus(income)
    income = finalIncome

    if (bonusApplied) {
      Diary.addLog(t('msg.bonusPaid'))
    }

    // 3. 상태 업데이트
    state.cash += income
    state.totalClicks += 1
    state.totalLaborIncome += income
    state.lifetimeEarnings += income

    // 4. 업그레이드 진행률 체크 (알림)
    checkUpgradeProgress()

    // 5. 자동 승진 체크
    const wasPromoted = checkCareerPromotion()
    if (wasPromoted) updateUI()

    // 6. 업그레이드 진행률 업데이트 (UI)
    updateUpgradeProgress()

    // 7. 클릭 애니메이션
    applyClickAnimation(clientX, clientY)

    // 8. 수익 증가 텍스트 애니메이션
    Animations.showIncomeAnimation(income)

    // 9. UI 업데이트
    updateUI()
  }

  return {
    handleWorkAction,
    calculateClickIncome,
    applyPerformanceBonus,
    checkUpgradeProgress,
  }
}
