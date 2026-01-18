/**
 * careerUI.js
 * 커리어 및 승진 UI 업데이트 전용 모듈
 * main.js의 updateUI() 함수에서 분리
 */

import { t } from '../i18n/index.js'
import * as NumberFormat from '../utils/numberFormat.js'
import { safeText } from './domUtils.js'

/**
 * 커리어 이름 가져오기
 * @param {number} level - 커리어 레벨
 * @returns {string} 커리어 이름
 */
export function getCareerName(level) {
  return t(`career.level${level}`)
}

/**
 * 커리어 UI 업데이트
 * @param {Object} params
 * @param {number} params.careerLevel - 현재 커리어 레벨
 * @param {number} params.totalClicks - 총 클릭 수
 * @param {number} params.clickIncome - 클릭당 수익
 * @param {Object} params.currentCareer - 현재 커리어 정보
 * @param {Object} params.nextCareer - 다음 커리어 정보
 */
export function updateCareerUI({
  careerLevel,
  totalClicks,
  clickIncome,
  currentCareer,
  nextCareer,
}) {
  try {
    // totalClicks 값 유효성 검사
    if (typeof totalClicks !== 'number' || totalClicks < 0) {
      console.warn('Invalid totalClicks value:', totalClicks, 'resetting to 0')
      totalClicks = 0
    }

    if (!currentCareer) {
      console.error('getCurrentCareer() returned null/undefined')
      return
    }

    // 현재 커리어 표시
    const elCurrentCareer = document.getElementById('currentCareer')
    safeText(elCurrentCareer, getCareerName(careerLevel))

    // 클릭 수익 표시
    const elClickIncomeButton = document.getElementById('clickIncomeButton')
    safeText(elClickIncomeButton, NumberFormat.formatNumberForLang(clickIncome))

    // 직급별 배경 이미지 업데이트
    const elWorkArea = document.getElementById('workArea')
    if (elWorkArea && currentCareer.bgImage) {
      elWorkArea.style.backgroundImage = `url('${currentCareer.bgImage}')`
    } else if (elWorkArea && !currentCareer.bgImage) {
      // 배경 이미지가 없으면 기본 그라데이션으로 복원
      elWorkArea.style.backgroundImage =
        'radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)'
    }

    // 승진 진행률 업데이트
    const elCareerProgress = document.getElementById('careerProgress')
    const elCareerProgressText = document.getElementById('careerProgressText')
    const elCareerRemaining = document.getElementById('careerRemaining')

    if (nextCareer) {
      // 승진 진행률 계산 및 표시
      const progress = Math.min((totalClicks / nextCareer.requiredClicks) * 100, 100)
      const remaining = Math.max(0, nextCareer.requiredClicks - totalClicks)

      if (elCareerProgress) {
        elCareerProgress.style.width = progress + '%'
        elCareerProgress.setAttribute('aria-valuenow', Math.round(progress))
      }

      // 간소화된 진행률 표시
      safeText(
        elCareerProgressText,
        `${Math.round(progress)}% (${totalClicks}/${nextCareer.requiredClicks})`
      )

      // 남은 클릭 수 표시
      if (elCareerRemaining) {
        if (remaining > 0) {
          // 천 단위 콤마 표기
          safeText(
            elCareerRemaining,
            t('ui.nextPromotion', { remaining: remaining.toLocaleString('ko-KR') })
          )
        } else {
          safeText(elCareerRemaining, t('ui.promotionAvailable'))
        }
      }
    } else {
      // 최고 직급 달성
      if (elCareerProgress) {
        elCareerProgress.style.width = '100%'
        elCareerProgress.setAttribute('aria-valuenow', 100)
      }
      safeText(elCareerProgressText, '100% (완료)')
      if (elCareerRemaining) {
        safeText(elCareerRemaining, '최고 직급 달성')
      }
    }
  } catch (e) {
    console.error('Career UI update failed:', e)
    console.error('Error details:', {
      totalClicks,
      careerLevel,
      currentCareer,
      nextCareer,
    })
  }
}

/**
 * 닉네임 UI 업데이트
 * @param {string} playerNickname - 플레이어 닉네임
 */
export function updateNicknameUI(playerNickname) {
  const nicknameLabel = document.getElementById('playerNicknameLabel')
  const nicknameInfoItem = document.getElementById('nicknameInfoItem')

  if (nicknameLabel) {
    nicknameLabel.textContent = playerNickname || '-'
  }
  if (nicknameInfoItem) {
    nicknameInfoItem.style.display = playerNickname ? 'flex' : 'none'
  }

  // 닉네임 변경 버튼 표시/숨김
  const nicknameChangeButtonContainer = document.getElementById('nicknameChangeButtonContainer')
  if (nicknameChangeButtonContainer) {
    nicknameChangeButtonContainer.style.display = playerNickname ? 'block' : 'none'
  }
}

/**
 * 닉네임 충돌 배너 업데이트
 */
export function updateNicknameConflictBanner() {
  const nicknameConflictBanner = document.getElementById('nicknameConflictBanner')
  if (nicknameConflictBanner) {
    try {
      const needsChange = localStorage.getItem('clicksurvivor_needsNicknameChange') === 'true'
      if (needsChange) {
        nicknameConflictBanner.style.display = 'block'
        // 배너 내용 업데이트
        const bannerText = nicknameConflictBanner.querySelector('span')
        if (bannerText) {
          bannerText.textContent = t('settings.nickname.migrationConflict.message')
        }
      } else {
        nicknameConflictBanner.style.display = 'none'
      }
    } catch (e) {
      nicknameConflictBanner.style.display = 'none'
    }
  }
}
