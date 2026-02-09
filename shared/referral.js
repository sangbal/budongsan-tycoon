// Referral system functions for ClickSurvivor games
import { getSupabaseClient } from './auth/supabaseClient.js'
import { getUser } from './auth/core.js'

const GAME_SLUG = 'seoulsurvival'

// DEV 모드 체크 (Vite 기준, optional chaining 사용)
const __IS_DEV__ = !!import.meta?.env?.DEV

// 에러 처리: 중복 로그 방지
let __lastErrorTime = 0
let __lastErrorMessage = ''
let __errorCount = 0
const ERROR_LOG_INTERVAL = 5000 // 5초마다 한 번만 로그

/**
 * 에러 로그 (중복 방지)
 * @param {Error|string} error - 에러 객체 또는 메시지
 * @param {string} context - 에러 컨텍스트
 */
function logReferralError(error, context = '') {
  const now = Date.now()
  const errorKey = error?.message || String(error)

  // 동일 에러가 연속 발생하면 카운트만 증가
  if (errorKey === __lastErrorMessage && now - __lastErrorTime < ERROR_LOG_INTERVAL) {
    __errorCount++
    return // 로그 스킵
  }

  // 새로운 에러이거나 시간이 지났으면 로그 출력
  if (__errorCount > 0) {
    console.error(`[Referral] Error (repeated ${__errorCount} times):`, error, context)
    __errorCount = 0
  } else {
    console.error(`[Referral] Error:`, error, context)
  }

  __lastErrorTime = now
  __lastErrorMessage = errorKey
}

/**
 * 추천 코드 생성 또는 조회
 * - 이미 존재하면 기존 코드 반환
 * - 없으면 새로 생성
 *
 * @param {string} userId - 사용자 ID (선택, 미제공 시 현재 로그인 사용자)
 * @returns {Promise<{ success: boolean, code?: string, error?: string, message?: string }>}
 */
export async function getOrCreateReferralCode(userId = null) {
  try {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      if (__IS_DEV__) {
        console.warn('[Referral] Supabase client not configured')
      }
      return { success: false, error: 'not_configured', message: 'Supabase not configured' }
    }

    // userId 미제공 시 현재 사용자 조회
    let targetUserId = userId
    if (!targetUserId) {
      const user = await getUser()
      if (!user) {
        return { success: false, error: 'not_logged_in', message: 'User not logged in' }
      }
      targetUserId = user.id
    }

    // RPC 함수 호출 (generate_referral_code)
    const { data, error } = await supabase.rpc('generate_referral_code', {
      p_game_slug: GAME_SLUG,
      p_user_id: targetUserId,
    })

    if (error) {
      // 테이블이 없으면 에러 반환
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        if (__IS_DEV__) {
          console.warn('[Referral] referral_codes table not found, run supabase/referral.sql')
        }
        return {
          success: false,
          error: 'schema_missing',
          message: 'Referral tables not configured',
        }
      }

      logReferralError(error, 'generate_referral_code')
      return { success: false, error: 'network', message: error.message }
    }

    // RPC 함수는 jsonb 반환
    if (data && typeof data === 'object') {
      if (data.success) {
        return {
          success: true,
          code: data.code,
          message: data.message || 'Referral code ready',
        }
      } else {
        return {
          success: false,
          error: data.error || 'unknown',
          message: data.message || 'Failed to generate referral code',
        }
      }
    }

    return { success: false, error: 'unknown', message: 'Unexpected response format' }
  } catch (e) {
    logReferralError(e, 'getOrCreateReferralCode')
    return { success: false, error: 'exception', message: e.message || 'Unknown error' }
  }
}

/**
 * 추천 코드 적용 (피추천인이 호출)
 * - sessionStorage에서 추천 코드를 가져와 적용
 * - 이미 추천받은 사용자는 에러 반환
 * - 자기 자신의 코드는 사용 불가
 *
 * @param {string} userId - 피추천인 사용자 ID (선택, 미제공 시 현재 로그인 사용자)
 * @param {string} code - 추천 코드 (선택, 미제공 시 sessionStorage에서 가져옴)
 * @returns {Promise<{ success: boolean, referrerId?: string, error?: string, message?: string }>}
 */
export async function applyReferralCode(userId = null, code = null) {
  try {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      if (__IS_DEV__) {
        console.warn('[Referral] Supabase client not configured')
      }
      return { success: false, error: 'not_configured', message: 'Supabase not configured' }
    }

    // userId 미제공 시 현재 사용자 조회
    let targetUserId = userId
    if (!targetUserId) {
      const user = await getUser()
      if (!user) {
        return { success: false, error: 'not_logged_in', message: 'User not logged in' }
      }
      targetUserId = user.id
    }

    // 추천 코드 미제공 시 sessionStorage에서 가져오기
    let referralCode = code
    if (!referralCode) {
      referralCode = sessionStorage.getItem('referralCode')
      if (!referralCode) {
        return { success: false, error: 'no_code', message: 'No referral code provided' }
      }
    }

    // RPC 함수 호출 (apply_referral_code)
    const { data, error } = await supabase.rpc('apply_referral_code', {
      p_game_slug: GAME_SLUG,
      p_referral_code: referralCode,
      p_referee_id: targetUserId,
    })

    if (error) {
      // 테이블이 없으면 에러 반환
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        if (__IS_DEV__) {
          console.warn(
            '[Referral] referral_relationships table not found, run supabase/referral.sql'
          )
        }
        return {
          success: false,
          error: 'schema_missing',
          message: 'Referral tables not configured',
        }
      }

      logReferralError(error, 'apply_referral_code')
      return { success: false, error: 'network', message: error.message }
    }

    // RPC 함수는 jsonb 반환
    if (data && typeof data === 'object') {
      if (data.success) {
        // 성공 시 sessionStorage에서 추천 코드 제거 (한 번만 사용)
        sessionStorage.removeItem('referralCode')

        return {
          success: true,
          referrerId: data.referrer_id,
          message: data.message || 'Referral code applied',
        }
      } else {
        return {
          success: false,
          error: data.error || 'unknown',
          message: data.message || 'Failed to apply referral code',
        }
      }
    }

    return { success: false, error: 'unknown', message: 'Unexpected response format' }
  } catch (e) {
    logReferralError(e, 'applyReferralCode')
    return { success: false, error: 'exception', message: e.message || 'Unknown error' }
  }
}

/**
 * 추천 마일스톤 기록
 * - 피추천인이 특정 마일스톤 달성 시 호출 (예: tower_count=1)
 * - 중복 기록 방지 (unique constraint)
 *
 * @param {string} referrerId - 추천인 사용자 ID
 * @param {string} refereeId - 피추천인 사용자 ID
 * @param {string} milestoneType - 마일스톤 유형 (예: 'tower_1', 'tower_5', 'playtime_1h')
 * @param {number} value - 마일스톤 값 (예: 1, 5, 3600000)
 * @returns {Promise<{ success: boolean, error?: string, message?: string }>}
 */
export async function recordReferralMilestone(referrerId, refereeId, milestoneType, value) {
  try {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      if (__IS_DEV__) {
        console.warn('[Referral] Supabase client not configured')
      }
      return { success: false, error: 'not_configured', message: 'Supabase not configured' }
    }

    // 필수 파라미터 검증
    if (!referrerId || !refereeId || !milestoneType || value == null) {
      return { success: false, error: 'missing_params', message: 'Missing required parameters' }
    }

    // value를 bigint로 변환 (음수는 0으로 바운딩)
    const safeValue = Math.max(0, Math.floor(Number(value)))

    // RPC 함수 호출 (record_referral_milestone)
    const { data, error } = await supabase.rpc('record_referral_milestone', {
      p_game_slug: GAME_SLUG,
      p_referrer_id: referrerId,
      p_referee_id: refereeId,
      p_milestone_type: milestoneType,
      p_milestone_value: safeValue,
    })

    if (error) {
      // 테이블이 없으면 에러 반환
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        if (__IS_DEV__) {
          console.warn('[Referral] referral_milestones table not found, run supabase/referral.sql')
        }
        return {
          success: false,
          error: 'schema_missing',
          message: 'Referral tables not configured',
        }
      }

      logReferralError(error, 'record_referral_milestone')
      return { success: false, error: 'network', message: error.message }
    }

    // RPC 함수는 jsonb 반환
    if (data && typeof data === 'object') {
      if (data.success) {
        if (__IS_DEV__) {
          console.log(`[Referral] Milestone recorded: ${milestoneType}=${safeValue}`)
        }
        return {
          success: true,
          message: data.message || 'Milestone recorded',
        }
      } else {
        // already_achieved 에러는 정상 동작 (중복 기록 방지)
        if (data.error === 'already_achieved') {
          if (__IS_DEV__) {
            console.debug(`[Referral] Milestone already achieved: ${milestoneType}`)
          }
          return { success: true, message: 'Milestone already recorded' }
        }

        return {
          success: false,
          error: data.error || 'unknown',
          message: data.message || 'Failed to record milestone',
        }
      }
    }

    return { success: false, error: 'unknown', message: 'Unexpected response format' }
  } catch (e) {
    logReferralError(e, 'recordReferralMilestone')
    return { success: false, error: 'exception', message: e.message || 'Unknown error' }
  }
}

/**
 * 추천 통계 조회
 * - 내 추천 코드, 추천한 사람 수, 마일스톤 수 조회
 *
 * @param {string} userId - 사용자 ID (선택, 미제공 시 현재 로그인 사용자)
 * @returns {Promise<{ success: boolean, code?: string, refereeCount?: number, milestoneCount?: number, error?: string, message?: string }>}
 */
export async function getReferralStats(userId = null) {
  try {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      if (__IS_DEV__) {
        console.warn('[Referral] Supabase client not configured')
      }
      return { success: false, error: 'not_configured', message: 'Supabase not configured' }
    }

    // userId 미제공 시 현재 사용자 조회
    let targetUserId = userId
    if (!targetUserId) {
      const user = await getUser()
      if (!user) {
        return { success: false, error: 'not_logged_in', message: 'User not logged in' }
      }
      targetUserId = user.id
    }

    // RPC 함수 호출 (get_referral_stats)
    const { data, error } = await supabase.rpc('get_referral_stats', {
      p_game_slug: GAME_SLUG,
      p_user_id: targetUserId,
    })

    if (error) {
      // 테이블이 없으면 에러 반환
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        if (__IS_DEV__) {
          console.warn('[Referral] referral tables not found, run supabase/referral.sql')
        }
        return {
          success: false,
          error: 'schema_missing',
          message: 'Referral tables not configured',
        }
      }

      logReferralError(error, 'get_referral_stats')
      return { success: false, error: 'network', message: error.message }
    }

    // RPC 함수는 jsonb 반환
    if (data && typeof data === 'object') {
      if (data.success) {
        return {
          success: true,
          code: data.code || null,
          refereeCount: data.referee_count || 0,
          milestoneCount: data.milestone_count || 0,
        }
      } else {
        return {
          success: false,
          error: data.error || 'unknown',
          message: data.message || 'Failed to get referral stats',
        }
      }
    }

    return { success: false, error: 'unknown', message: 'Unexpected response format' }
  } catch (e) {
    logReferralError(e, 'getReferralStats')
    return { success: false, error: 'exception', message: e.message || 'Unknown error' }
  }
}

/**
 * 피추천인 마일스톤 목록 조회
 * - 내가 추천한 사람들의 마일스톤 목록 (대시보드용)
 *
 * @param {string} referrerId - 추천인 사용자 ID (선택, 미제공 시 현재 로그인 사용자)
 * @returns {Promise<{ success: boolean, data?: Array, error?: string, message?: string }>}
 */
export async function getRefereeMilestones(referrerId = null) {
  try {
    const supabase = await getSupabaseClient()
    if (!supabase) {
      if (__IS_DEV__) {
        console.warn('[Referral] Supabase client not configured')
      }
      return {
        success: false,
        error: 'not_configured',
        message: 'Supabase not configured',
        data: [],
      }
    }

    // referrerId 미제공 시 현재 사용자 조회
    let targetReferrerId = referrerId
    if (!targetReferrerId) {
      const user = await getUser()
      if (!user) {
        return { success: false, error: 'not_logged_in', message: 'User not logged in', data: [] }
      }
      targetReferrerId = user.id
    }

    // RPC 함수 호출 (get_referee_milestones) - TABLE 반환
    const { data, error } = await supabase.rpc('get_referee_milestones', {
      p_game_slug: GAME_SLUG,
      p_referrer_id: targetReferrerId,
    })

    if (error) {
      // 테이블이 없으면 에러 반환
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        if (__IS_DEV__) {
          console.warn('[Referral] referral_milestones table not found, run supabase/referral.sql')
        }
        return {
          success: false,
          error: 'schema_missing',
          message: 'Referral tables not configured',
          data: [],
        }
      }

      logReferralError(error, 'get_referee_milestones')
      return { success: false, error: 'network', message: error.message, data: [] }
    }

    return {
      success: true,
      data: data || [],
    }
  } catch (e) {
    logReferralError(e, 'getRefereeMilestones')
    return { success: false, error: 'exception', message: e.message || 'Unknown error', data: [] }
  }
}
