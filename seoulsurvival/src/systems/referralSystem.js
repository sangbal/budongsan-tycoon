/**
 * referralSystem.js
 * 추천 시스템 로직 모듈
 *
 * 책임:
 * - URL에서 추천 코드 파싱 및 저장
 * - 로그인 후 추천 코드 적용
 * - 피추천인 보너스 지급
 * - 마일스톤 체크 및 추천인 보상
 */

import {
  applyReferralCode,
  recordReferralMilestone,
  getOrCreateReferralCode,
} from '@shared/referral.js'
import { getUser } from '@shared/auth/core.js'

// DEV 모드 체크
const __IS_DEV__ = !!import.meta?.env?.DEV

/**
 * 추천 시스템 매니저 팩토리 함수
 *
 * @param {Object} deps - 의존성 객체
 * @param {Object} deps.gameState - 게임 상태 객체
 * @param {Function} deps.t - 다국어 번역 함수
 * @param {Function} deps.toastSuccess - 성공 토스트 함수
 * @param {Function} deps.toastError - 에러 토스트 함수
 * @param {Function} deps.toastInfo - 정보 토스트 함수
 * @param {Function} deps.saveGame - 게임 저장 함수
 *
 * @returns {Object} 추천 시스템 함수들
 */
export function createReferralSystem(deps) {
  const { gameState, t, toastSuccess, toastError, toastInfo, saveGame } = deps

  // 추천인 ID 캐시 (마일스톤 기록용)
  let _referrerId = null

  /**
   * 추천 시스템 초기화
   * - URL에서 추천 코드 확인
   * - 로그인 상태면 즉시 적용, 아니면 sessionStorage에 저장
   */
  async function initReferralSystem() {
    try {
      // URL에서 추천 코드 파싱 (ref 파라미터)
      const urlParams = new URLSearchParams(window.location.search)
      const referralCodeFromUrl = urlParams.get('ref')

      if (!referralCodeFromUrl) {
        if (__IS_DEV__) {
          console.log('[Referral] No referral code in URL')
        }
        return
      }

      // sessionStorage에 저장 (로그인 전이면 나중에 적용)
      sessionStorage.setItem('referralCode', referralCodeFromUrl)

      if (__IS_DEV__) {
        console.log('[Referral] Referral code saved to sessionStorage:', referralCodeFromUrl)
      }

      // URL에서 ref 파라미터 제거 (히스토리 정리)
      urlParams.delete('ref')
      const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`
      window.history.replaceState({}, '', newUrl)

      // 로그인 상태면 즉시 적용 시도
      const user = await getUser()
      if (user) {
        await claimReferralFromUrl()
      } else {
        if (__IS_DEV__) {
          console.log('[Referral] User not logged in, deferring referral code application')
        }
      }
    } catch (error) {
      console.error('[Referral] Error in initReferralSystem:', error)
    }
  }

  /**
   * 로그인 후 추천 코드 적용
   * - sessionStorage에서 추천 코드 읽기
   * - applyReferralCode API 호출
   * - 성공 시 피추천인 보너스 적용
   */
  async function claimReferralFromUrl() {
    try {
      // sessionStorage에서 추천 코드 가져오기
      const referralCode = sessionStorage.getItem('referralCode')
      if (!referralCode) {
        if (__IS_DEV__) {
          console.log('[Referral] No pending referral code in sessionStorage')
        }
        return
      }

      // 이미 보너스를 받았으면 스킵
      if (gameState.referralBonusApplied) {
        if (__IS_DEV__) {
          console.log('[Referral] Referral bonus already applied, skipping')
        }
        sessionStorage.removeItem('referralCode')
        return
      }

      // 현재 사용자 확인
      const user = await getUser()
      if (!user) {
        if (__IS_DEV__) {
          console.log('[Referral] User not logged in, cannot apply referral code')
        }
        return
      }

      // 추천 코드 적용 API 호출
      const result = await applyReferralCode(user.id, referralCode)

      if (!result.success) {
        // 에러 처리
        if (result.error === 'already_used') {
          if (__IS_DEV__) {
            console.log('[Referral] User already used a referral code')
          }
          sessionStorage.removeItem('referralCode')
          return
        }

        if (result.error === 'self_referral') {
          toastError?.(t?.('referral.cannotUseSelf') || '❌ You cannot use your own referral code.')
          sessionStorage.removeItem('referralCode')
          return
        }

        if (result.error === 'invalid_code') {
          toastError?.(t?.('referral.invalidCode') || '❌ Invalid referral code.')
          sessionStorage.removeItem('referralCode')
          return
        }

        // 기타 에러는 로그만 출력 (사용자에게 알리지 않음)
        if (__IS_DEV__) {
          console.error('[Referral] Failed to apply referral code:', result.message)
        }
        return
      }

      // 성공: 추천인 ID 저장 (마일스톤 기록용)
      _referrerId = result.referrerId

      if (__IS_DEV__) {
        console.log('[Referral] Referral code applied successfully, referrer:', _referrerId)
      }

      // 피추천인 보너스 적용
      await applyRefereeBonus()

      // sessionStorage에서 추천 코드 제거
      sessionStorage.removeItem('referralCode')

      // 성공 토스트
      toastSuccess?.(t?.('referral.bonusReceived') || '✅ Referral bonus! +5M starting cash 💰')
    } catch (error) {
      console.error('[Referral] Error in claimReferralFromUrl:', error)
    }
  }

  /**
   * 피추천인 보너스 적용
   * - 시작 자금 +500만원 (일회성)
   * - gameState.referralBonusApplied = true
   */
  async function applyRefereeBonus() {
    try {
      // 중복 체크
      if (gameState.referralBonusApplied) {
        if (__IS_DEV__) {
          console.log('[Referral] Referral bonus already applied')
        }
        return
      }

      // 보너스 지급: +500만원
      const bonusAmount = 5000000 // 500만원
      gameState.cash += bonusAmount

      // 플래그 설정
      gameState.referralBonusApplied = true

      // 저장
      saveGame?.()

      if (__IS_DEV__) {
        console.log(`[Referral] Referee bonus applied: +${bonusAmount}`)
      }
    } catch (error) {
      console.error('[Referral] Error in applyRefereeBonus:', error)
    }
  }

  /**
   * 마일스톤 체크 및 추천인 보상
   * - 피추천인이 특정 마일스톤 달성 시 호출
   * - 추천인에게 보상 지급 (예: 10분 플레이 → +1 CP)
   *
   * @param {string} milestoneType - 마일스톤 유형 (예: 'played_10min', 'tower_1')
   * @param {number} value - 마일스톤 값 (예: 600000 (10분), 1 (타워 1개))
   */
  async function checkReferralMilestones(milestoneType, value) {
    try {
      // 추천인 ID가 없으면 스킵 (추천받지 않은 사용자)
      if (!_referrerId) {
        if (__IS_DEV__) {
          console.debug('[Referral] No referrer ID, skipping milestone check')
        }
        return
      }

      // 현재 사용자 확인 (피추천인)
      const user = await getUser()
      if (!user) {
        if (__IS_DEV__) {
          console.debug('[Referral] User not logged in, cannot record milestone')
        }
        return
      }

      // 마일스톤 기록 API 호출
      const result = await recordReferralMilestone(_referrerId, user.id, milestoneType, value)

      if (!result.success) {
        // already_achieved는 정상 동작 (중복 기록 방지)
        if (result.error !== 'already_achieved') {
          if (__IS_DEV__) {
            console.error('[Referral] Failed to record milestone:', result.message)
          }
        }
        return
      }

      if (__IS_DEV__) {
        console.log(`[Referral] Milestone recorded: ${milestoneType}=${value}`)
      }

      // 마일스톤별 추천인 보상 처리 (서버에서 처리되므로 클라이언트는 알림만)
      // 추천인이 온라인이면 알림이 가지만, 오프라인이면 다음 로그인 시 알림
      // 여기서는 피추천인에게 "추천인에게 보상이 전달되었습니다" 알림 표시
      if (milestoneType === 'played_10min') {
        toastInfo?.(
          t?.('referral.friendPlayed', { name: 'Friend' }) ||
            'Your referrer earned +1 CP for your 10-minute milestone! 🎉'
        )
      }
    } catch (error) {
      console.error('[Referral] Error in checkReferralMilestones:', error)
    }
  }

  /**
   * 내 추천 코드 가져오기 또는 생성
   * - 로그인 필요
   * - gameState.referralCode에 캐시
   *
   * @returns {Promise<string|null>} 추천 코드 또는 null
   */
  async function getMyReferralCode() {
    try {
      // 캐시 확인
      if (gameState.referralCode) {
        return gameState.referralCode
      }

      // 현재 사용자 확인
      const user = await getUser()
      if (!user) {
        if (__IS_DEV__) {
          console.log('[Referral] User not logged in, cannot get referral code')
        }
        return null
      }

      // 추천 코드 생성 또는 조회
      const result = await getOrCreateReferralCode(user.id)

      if (!result.success) {
        if (__IS_DEV__) {
          console.error('[Referral] Failed to get referral code:', result.message)
        }
        return null
      }

      // 캐시 저장
      gameState.referralCode = result.code
      saveGame?.()

      return result.code
    } catch (error) {
      console.error('[Referral] Error in getMyReferralCode:', error)
      return null
    }
  }

  return {
    initReferralSystem,
    claimReferralFromUrl,
    checkReferralMilestones,
    applyRefereeBonus,
    getMyReferralCode,
  }
}
