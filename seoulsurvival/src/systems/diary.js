/**
 * Seoul Survival - Diary System
 *
 * 게임의 일기장 시스템
 * - 게임 이벤트를 일기장 형식으로 변환
 * - 다양한 독백 스타일 제공
 * - 시간 스탬프 및 메타데이터 관리
 *
 * Phase 1.1: 템플릿 데이터를 data/diaryTemplates.js로 분리
 */

import { t, getLang } from '../i18n/index.js'
import {
  achievementTemplates,
  promotionTemplates,
  unlockByProduct,
  unlockDefaultTemplates,
  noMoneyTemplates,
  buyByProduct,
  buyDefaultTemplates,
  sellByProduct,
  sellDefaultTemplates,
  failTemplates,
  marketEventByProduct,
  marketEndByProduct,
  memoByProduct,
  memoDefaultTemplates,
  upgradeUnlockByProduct,
  upgradeBuyByProduct,
  warnTemplates,
  defaultTemplates,
  productDetectionRules,
  devKeywords,
} from '../data/diaryTemplates.js'

// ======= DOM 참조 =======
let elLog = null

// ======= 게임 시간 참조 (main.js에서 설정) =======
let gameStartTimeRef = null
let sessionStartTimeRef = null

/**
 * 일기장 시스템 초기화
 * @param {HTMLElement} logElement - 일기장 DOM 요소
 * @param {Object} timeRefs - 게임 시간 참조 객체
 * @param {number} timeRefs.gameStartTimeRef.gameStartTime - 게임 시작 시간
 * @param {number} timeRefs.sessionStartTimeRef - 세션 시작 시간
 */
export function initDiary(logElement, timeRefs) {
  elLog = logElement
  gameStartTimeRef = timeRefs
  sessionStartTimeRef = timeRefs.sessionStartTime
}

// ======= 유틸리티 함수 =======
const pad2 = n => String(n).padStart(2, '0')
const rand = n => Math.floor(Math.random() * n)

// 시스템 이모지/접두 제거
// eslint-disable-next-line no-misleading-character-class
const stripPrefix = txt => txt.replace(/^[✅❌💸💰🏆🎉🎁📈📉🔓⚠️💡]+\s*/gu, '').trim()
const soften = txt => stripPrefix(txt).replace(/\s+/g, ' ').trim()

/**
 * 템플릿 배열에서 랜덤하게 선택 (연속 중복 방지)
 * @param {string} key - 저장 키
 * @param {string[]} arr - 템플릿 배열
 * @returns {string}
 */
function pick(key, arr) {
  if (!Array.isArray(arr) || arr.length === 0) return ''
  const storeKey = `__diaryLastPick_${key}`
  const last = window[storeKey]
  let idx = rand(arr.length)
  if (arr.length > 1 && typeof last === 'number' && idx === last) {
    idx = (idx + 1 + rand(arr.length - 1)) % arr.length
  }
  window[storeKey] = idx
  return arr[idx]
}

/**
 * 텍스트에서 제품 종류 감지
 * @param {string} txt - 감지할 텍스트
 * @returns {string} 제품 종류
 */
function detectProduct(txt) {
  const t = String(txt || '')
  for (const [keyword, product] of productDetectionRules) {
    if (t.includes(keyword)) return product
  }
  return ''
}

/**
 * 템플릿 문자열에 변수 치환
 * @param {string} template - 템플릿 문자열
 * @param {Object} vars - 변수 객체
 * @returns {string}
 */
function applyTemplate(template, vars) {
  let result = template
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value || '')
  }
  return result.trim()
}

/**
 * 일기장 메타데이터 업데이트
 */
function updateDiaryMeta() {
  if (!gameStartTimeRef) return

  const now = new Date()
  const y = now.getFullYear()
  const m = pad2(now.getMonth() + 1)
  const d = pad2(now.getDate())
  const base =
    typeof gameStartTimeRef.gameStartTime !== 'undefined' && gameStartTimeRef.gameStartTime
      ? gameStartTimeRef.gameStartTime
      : sessionStartTimeRef
  const days = Math.max(1, Math.floor((Date.now() - base) / 86400000) + 1)

  // 헤더에 붙는 컴팩트 표기: yyyy.mm.dd(N일차)
  const elCompact = document.getElementById('diaryHeaderMeta')
  if (elCompact) {
    elCompact.textContent = `${y}.${m}.${d}(${t('ui.dayCount', { days })})`
  }

  // (구) DOM이 남아있을 때만 업데이트 (호환)
  const elDate = document.getElementById('diaryMetaDate')
  const elDay = document.getElementById('diaryMetaDay')
  if (elDate) elDate.textContent = t('ui.today', { date: `${y}.${m}.${d}` })
  if (elDay) elDay.textContent = t('ui.dayCount', { days })
}

/**
 * 원본 메시지를 일기 형식으로 변환
 * @param {string} raw - 원본 메시지
 * @returns {string} 변환된 일기 텍스트
 */
function diaryize(raw) {
  const s = String(raw || '').trim()

  // 업그레이드 잔여 클릭 안내는 일기장에 기록하지 않음
  const nextUpgradePattern = new RegExp(
    t('msg.nextUpgradeHint', { remaining: '\\d+', name: '.*' })
      .replace(/\{remaining\}/g, '\\d+')
      .replace(/\{name\}/g, '.*'),
    'i'
  )
  if (nextUpgradePattern.test(s) || (/다음\s*업그레이드/.test(s) && /클릭\s*남/.test(s))) {
    return ''
  }

  // ======= 업적 =======
  if (s.startsWith('🏆') && (s.includes('업적 달성:') || s.includes('Achievement Unlocked:'))) {
    const body = stripPrefix(s).replace(/^(업적 달성|Achievement Unlocked):\s*/i, '')
    const [name, desc] = body.split(/\s*-\s*/)
    const template = pick('achievement', achievementTemplates)
    return applyTemplate(template, {
      name: name || '업적',
      desc: desc || '',
      descMemo: desc ? `메모: ${desc}` : '',
    })
  }

  // ======= 승진 =======
  const promotedPattern =
    getLang() === 'en'
      ? /🎉\s*(.+?)\s+promoted!?(\s*\(.*\))?/i
      : /🎉\s*(.+?)으로\s*승진했습니다!?(\s*\(.*\))?/
  if (s.startsWith('🎉') && (s.includes('승진했습니다') || /promoted/i.test(s))) {
    const m = s.match(promotedPattern)
    const career = m?.[1]?.trim() || '다음 단계'
    const extra = m?.[2]?.trim()
    const extraText = extra ? extra.replace(/[()]/g, '').trim() : ''
    const template = pick('promotion', promotionTemplates)
    return applyTemplate(template, { career, extra: extraText })
  }

  // ======= 해금 =======
  const unlockPattern = getLang() === 'en' ? /^🔓\s*(.+?)\s+unlocked/i : /^🔓\s*(.+?)이\s*해금/
  if (s.startsWith('🔓')) {
    const body = soften(s)
    const m = s.match(unlockPattern)
    const name = (m?.[1] || '').trim()

    if (name && unlockByProduct[name]) {
      const template = pick(`unlock_${name}`, unlockByProduct[name])
      return applyTemplate(template, { body })
    }
    const template = pick('unlock', unlockDefaultTemplates)
    return applyTemplate(template, { body })
  }

  // ======= 자금 부족 =======
  if (s.startsWith('💸 자금이 부족합니다')) {
    const body = soften(s)
    const template = pick('noMoney', noMoneyTemplates)
    return applyTemplate(template, { body })
  }

  // ======= 구매 =======
  const purchasedPattern =
    getLang() === 'en' ? /^✅\s*.+?\s+purchased/i : /^✅\s*.+?\s+구입했습니다/
  if (s.startsWith('✅') && (s.includes('구입했습니다') || /purchased/i.test(s))) {
    const body = soften(s)
    const m = s.match(/^✅\s*(.+?)\s+\d/)
    const name = (m?.[1] || '').trim()

    if (name && buyByProduct[name]) {
      const template = pick(`buy_${name}`, buyByProduct[name])
      return applyTemplate(template, { body })
    }
    const template = pick('buy', buyDefaultTemplates)
    return applyTemplate(template, { body })
  }

  // ======= 판매 =======
  if (s.startsWith('💰') && s.includes('판매했습니다')) {
    const body = soften(s)
    const m = s.match(/^💰\s*(.+?)\s+\d/)
    const name = (m?.[1] || '').trim()

    if (name && sellByProduct[name]) {
      const template = pick(`sell_${name}`, sellByProduct[name])
      return applyTemplate(template, { body })
    }
    const template = pick('sell', sellDefaultTemplates)
    return applyTemplate(template, { body })
  }

  // ======= 실패 =======
  if (s.startsWith('❌')) {
    const body = soften(s)
    const template = pick('fail', failTemplates)
    return applyTemplate(template, { body })
  }

  // ======= 시장 이벤트 발생 =======
  if (s.startsWith('📈') && s.includes('발생')) {
    const body = soften(s)
    const name1 = s.match(/^📈\s*(.+?)\s*발생/)?.[1]?.trim()
    const name2 = s.match(/^📈\s*시장 이벤트 발생:\s*(.+?)\s*\(/)?.[1]?.trim()
    const eventName = (name2 || name1 || '').trim()

    const product = detectProduct(`${eventName} ${body}`) || '시장'
    window.__diaryLastMarketProduct = product
    window.__diaryLastMarketName = eventName || body

    const templates = marketEventByProduct[product] || marketEventByProduct['시장']
    const template = pick(`market_${product}`, templates)
    return applyTemplate(template, { body })
  }

  // ======= 시장 이벤트 종료 =======
  if (s.startsWith('📉') && s.includes('종료')) {
    const product = window.__diaryLastMarketProduct || '시장'
    const name = window.__diaryLastMarketName || ''

    const isRealEstate = ['빌라', '오피스텔', '아파트', '상가', '빌딩'].includes(product)
    const key = isRealEstate ? '부동산' : product
    const templates = marketEndByProduct[key] || marketEndByProduct['시장']
    const template = pick(`marketEnd_${key}`, templates)

    window.__diaryLastMarketProduct = null
    window.__diaryLastMarketName = null

    return applyTemplate(template, { name })
  }

  // ======= 팁/메모 =======
  if (s.startsWith('💡')) {
    const body = soften(s)
    const product = window.__diaryLastMarketProduct || ''
    const name = window.__diaryLastMarketName || ''

    const isRealEstate = ['빌라', '오피스텔', '아파트', '상가', '빌딩'].includes(product)
    const key = isRealEstate ? '부동산' : product

    if (key && memoByProduct[key]) {
      const template = pick(`memo_${key}`, memoByProduct[key])
      return applyTemplate(template, { body, name })
    }
    const template = pick('memo', memoDefaultTemplates)
    return applyTemplate(template, { body })
  }

  // ======= 업그레이드 해금 =======
  if (s.startsWith('🎁') && s.includes('해금')) {
    const body = soften(s)
    const name = s.match(/해금:\s*(.+)$/)?.[1]?.trim() || ''

    const detectUpgradeProduct = txt => {
      const t = String(txt || '')
      if (t.includes('예금')) return '예금'
      if (t.includes('적금')) return '적금'
      if (t.includes('미국주식') || t.includes('미장') || t.includes('🇺🇸')) return '미국주식'
      if (t.includes('코인') || t.includes('₿') || t.includes('암호')) return '코인'
      if (t.includes('주식')) return '국내주식'
      if (t.includes('빌딩')) return '빌딩'
      if (t.includes('상가')) return '상가'
      if (t.includes('아파트')) return '아파트'
      if (t.includes('오피스텔')) return '오피스텔'
      if (t.includes('빌라')) return '빌라'
      if (t.includes('월세') || t.includes('부동산')) return '부동산'
      if (
        t.includes('클릭') ||
        t.includes('노동') ||
        t.includes('업무') ||
        t.includes('CEO') ||
        t.includes('커리어')
      )
        return '노동'
      return ''
    }

    const product = detectUpgradeProduct(`${name} ${body}`) || '기본'
    const templates = upgradeUnlockByProduct[product] || upgradeUnlockByProduct['기본']
    const template = pick(`upgradeUnlock_${product}`, templates)
    return applyTemplate(template, { name: name || body })
  }

  // ======= 업그레이드 구매 =======
  if (s.startsWith('✅') && s.includes('구매!')) {
    const body = soften(s)
    const m = s.match(/^✅\s*(.+?)\s*구매!\s*(.*)$/)
    const upName = (m?.[1] || '').trim()
    const upDesc = (m?.[2] || '').trim()

    const detectUpgradeProduct = txt => {
      const t = String(txt || '')
      if (t.includes('예금')) return '예금'
      if (t.includes('적금')) return '적금'
      if (t.includes('미국주식') || t.includes('미장') || t.includes('🇺🇸')) return '미국주식'
      if (t.includes('코인') || t.includes('₿') || t.includes('암호')) return '코인'
      if (t.includes('주식')) return '국내주식'
      if (t.includes('빌딩')) return '빌딩'
      if (t.includes('상가')) return '상가'
      if (t.includes('아파트')) return '아파트'
      if (t.includes('오피스텔')) return '오피스텔'
      if (t.includes('빌라')) return '빌라'
      if (t.includes('월세') || t.includes('부동산')) return '부동산'
      if (
        t.includes('클릭') ||
        t.includes('노동') ||
        t.includes('업무') ||
        t.includes('CEO') ||
        t.includes('커리어')
      )
        return '노동'
      return ''
    }

    const product = detectUpgradeProduct(`${upName} ${upDesc} ${body}`) || '기본'
    const core = [upName, upDesc].filter(Boolean).join(' — ') || body
    const templates = upgradeBuyByProduct[product] || upgradeBuyByProduct['기본']
    const template = pick(`upgradeBuy_${product}`, templates)
    return applyTemplate(template, { core, body })
  }

  // ======= 경고 =======
  if (s.startsWith('⚠️')) {
    const body = soften(s)
    const template = pick('warn', warnTemplates)
    return applyTemplate(template, { body })
  }

  // ======= 기본 =======
  const base = soften(s)
  const template = pick('default', defaultTemplates)
  return applyTemplate(template, {
    base,
    justWrite: t('diary.justWrite'),
    todayRecord: t('diary.todayRecord'),
    anyway: t('diary.anyway'),
    justRecord: t('diary.justRecord'),
    memo: t('diary.memo'),
    remember: t('diary.remember'),
    recordForLater: t('diary.recordForLater'),
    goodToWrite: t('diary.goodToWrite'),
    leaveRecord: t('diary.leaveRecord'),
  })
}

/**
 * 일기장에 로그 추가
 * @param {string} text - 추가할 로그 텍스트
 */
export function addLog(text) {
  // 초기화 전에 호출되면 조용히 무시 (게임 시작 시 타이밍 이슈)
  if (!elLog || !gameStartTimeRef) {
    return
  }

  // 개발 관련 메시지인지 확인
  const isDevMessage = devKeywords.some(keyword => text.includes(keyword))
  if (isDevMessage) {
    return
  }

  // ======= 일기장 변환 =======
  const now = new Date()
  const timeStamp = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`

  updateDiaryMeta()
  const diaryText = diaryize(text)
  if (!diaryText) return

  const p = document.createElement('p')
  const escaped = diaryText.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // 독백(1줄)과 정보(이후 줄)의 가시성 분리
  const lines = escaped.split('\n')
  const voiceLine = (lines[0] ?? '').trim()
  const infoLines = lines
    .slice(1)
    .map(l => String(l).trim())
    .filter(Boolean)
  const bodyHtml =
    `<span class="diary-voice">${voiceLine}</span>` +
    (infoLines.length ? `\n<span class="diary-info">${infoLines.join('\n')}</span>` : '')
  p.innerHTML = `<span class="diary-time">${timeStamp}</span>${bodyHtml}`

  if (!elLog) {
    console.error(
      '[Diary] ❌ elLog is null in addLog! Cannot add log entry. Diary was not initialized.'
    )
    return
  }

  elLog.prepend(p)
}
