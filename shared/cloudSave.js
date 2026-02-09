import { getSupabaseClient } from './auth/supabaseClient.js'
import { getUser } from './auth/core.js'
import LZString from 'lz-string'
// isAuthEnabled는 동적 import로 변경 (config.js 로드 지연)

const TABLE = 'game_saves'

/**
 * 클라우드 데이터 압축 (LZ-String Base64)
 * @param {Object} data - 저장할 데이터 객체
 * @returns {string} 압축된 문자열 (실패 시 원본 JSON)
 */
function compressCloudData(data) {
  try {
    const jsonStr = JSON.stringify(data)
    const compressed = LZString.compressToBase64(jsonStr)
    if (!compressed) return jsonStr

    if (import.meta?.env?.DEV) {
      const originalSize = new Blob([jsonStr]).size
      const compressedSize = new Blob([compressed]).size
      const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1)
      console.log(`☁️ 클라우드 압축: ${originalSize}B → ${compressedSize}B (${ratio}% 절감)`)
    }

    return compressed
  } catch (error) {
    console.error('클라우드 압축 중 오류:', error)
    return JSON.stringify(data)
  }
}

/**
 * 클라우드 데이터 압축 해제 (LZ-String Base64)
 * @param {string} compressedStr - 압축된 문자열
 * @returns {Object|null} 복원된 데이터 객체 (실패 시 null)
 */
function decompressCloudData(compressedStr) {
  try {
    let jsonStr = LZString.decompressFromBase64(compressedStr)
    if (!jsonStr) jsonStr = compressedStr // 하위 호환성
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error('클라우드 압축 해제 중 오류:', error)
    return null
  }
}

function normalizeError(err) {
  if (!err) return null
  const msg = err?.message || String(err)
  return { message: msg, code: err?.code, details: err?.details, hint: err?.hint }
}

function isMissingTable(err) {
  const msg = String(err?.message || '').toLowerCase()
  return msg.includes('does not exist') || msg.includes('relation') || msg.includes('42p01')
}

export async function fetchCloudSave(gameSlug) {
  const { isAuthEnabled } = await import('./auth/core.js')
  if (!(await isAuthEnabled())) return { ok: false, reason: 'not_configured' }
  const sb = await getSupabaseClient()
  if (!sb) return { ok: false, reason: 'not_configured' }

  const user = await getUser()
  if (!user) return { ok: false, reason: 'not_signed_in' }

  const { data, error } = await sb
    .from(TABLE)
    .select('save, save_ts, updated_at')
    .eq('user_id', user.id)
    .eq('game_slug', gameSlug)
    .maybeSingle()

  if (error) {
    return {
      ok: false,
      reason: isMissingTable(error) ? 'missing_table' : 'query_failed',
      error: normalizeError(error),
    }
  }

  if (!data) return { ok: true, found: false }

  // 압축 해제
  const compressedStr = typeof data.save === 'string' ? data.save : data.save.compressed
  const decompressed = decompressCloudData(compressedStr)
  if (!decompressed) {
    return {
      ok: false,
      reason: 'decompression_failed',
      error: { message: 'Failed to decompress cloud save data' },
    }
  }

  return {
    ok: true,
    found: true,
    save: decompressed,
    save_ts: data.save_ts,
    updated_at: data.updated_at,
  }
}

export async function upsertCloudSave(gameSlug, saveObj) {
  const { isAuthEnabled } = await import('./auth/core.js')
  if (!(await isAuthEnabled())) return { ok: false, reason: 'not_configured' }
  const sb = await getSupabaseClient()
  if (!sb) return { ok: false, reason: 'not_configured' }

  const user = await getUser()
  if (!user) return { ok: false, reason: 'not_signed_in' }

  const saveTs = Number(saveObj?.ts || Date.now()) || Date.now()

  // 저장 전 압축
  const compressed = compressCloudData(saveObj)

  const payload = {
    user_id: user.id,
    game_slug: gameSlug,
    save: { compressed: compressed }, // JSONB로 감싸서 저장
    save_ts: saveTs,
  }

  // 디버깅: 저장되는 데이터에 닉네임 포함 여부 확인
  if (saveObj?.nickname !== undefined) {
    console.log('☁️ 클라우드 저장: 닉네임 포함됨:', saveObj.nickname || '(빈 문자열)')
  } else {
    console.warn('⚠️ 클라우드 저장: 닉네임 필드가 없음')
  }

  const { error } = await sb.from(TABLE).upsert(payload, { onConflict: 'user_id,game_slug' })

  if (error) {
    return {
      ok: false,
      reason: isMissingTable(error) ? 'missing_table' : 'upsert_failed',
      error: normalizeError(error),
    }
  }

  return { ok: true }
}
