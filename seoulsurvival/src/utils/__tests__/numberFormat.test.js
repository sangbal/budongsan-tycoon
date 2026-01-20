/**
 * Seoul Survival - Number Format Tests
 *
 * 숫자 포맷팅 유틸리티 단위 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock i18n
vi.mock('../../i18n/index.js', () => ({
  getLang: vi.fn(() => 'ko'),
}))

import {
  formatKoreanNumber,
  formatEnglishNumber,
  formatFinancialPrice,
  formatPropertyPrice,
  formatStatsNumber,
  formatLeaderboardAssets,
  formatPlaytimeMs,
  formatPlaytimeMsShort,
  formatRelativeTime,
} from '../numberFormat.js'

import { getLang } from '../../i18n/index.js'

describe('formatKoreanNumber', () => {
  beforeEach(() => {
    getLang.mockReturnValue('ko')
  })

  it('1000 미만은 그대로 반환', () => {
    expect(formatKoreanNumber(0)).toBe('0')
    expect(formatKoreanNumber(500)).toBe('500')
    expect(formatKoreanNumber(999)).toBe('999')
  })

  it('천 단위 변환', () => {
    expect(formatKoreanNumber(1000)).toBe('1천')
    expect(formatKoreanNumber(5000)).toBe('5천')
  })

  it('만 단위 변환', () => {
    expect(formatKoreanNumber(10000)).toBe('1만')
    expect(formatKoreanNumber(50000)).toBe('5만')
  })

  it('억 단위 변환', () => {
    expect(formatKoreanNumber(100000000)).toBe('1억')
    expect(formatKoreanNumber(500000000)).toBe('5억')
  })

  it('조 단위 변환', () => {
    expect(formatKoreanNumber(1000000000000)).toBe('1조')
    expect(formatKoreanNumber(5000000000000)).toBe('5조')
  })

  it('소수점 처리', () => {
    expect(formatKoreanNumber(150000000)).toBe('1.5억')
    expect(formatKoreanNumber(15000)).toBe('1.5만')
  })
})

describe('formatEnglishNumber', () => {
  it('1000 미만은 그대로 반환', () => {
    expect(formatEnglishNumber(0)).toBe('0')
    expect(formatEnglishNumber(500)).toBe('500')
    expect(formatEnglishNumber(999)).toBe('999')
  })

  it('K 단위 변환', () => {
    expect(formatEnglishNumber(1000)).toBe('1K')
    expect(formatEnglishNumber(5000)).toBe('5K')
  })

  it('M 단위 변환', () => {
    expect(formatEnglishNumber(1000000)).toBe('1M')
    expect(formatEnglishNumber(5000000)).toBe('5M')
  })

  it('B 단위 변환', () => {
    expect(formatEnglishNumber(1000000000)).toBe('1B')
    expect(formatEnglishNumber(5000000000)).toBe('5B')
  })

  it('T 단위 변환', () => {
    expect(formatEnglishNumber(1000000000000)).toBe('1T')
    expect(formatEnglishNumber(5000000000000)).toBe('5T')
  })

  it('소수점 처리', () => {
    expect(formatEnglishNumber(1500000)).toBe('1.5M')
    expect(formatEnglishNumber(1500000000)).toBe('1.5B')
  })
})

describe('formatFinancialPrice', () => {
  beforeEach(() => {
    getLang.mockReturnValue('ko')
  })

  it('만 단위 반올림', () => {
    expect(formatFinancialPrice(50000)).toBe('5만')
    expect(formatFinancialPrice(500000)).toBe('50만')
  })

  it('억 단위 반올림', () => {
    expect(formatFinancialPrice(100000000)).toBe('1억')
    expect(formatFinancialPrice(500000000)).toBe('5억')
  })

  it('천 단위 반올림', () => {
    expect(formatFinancialPrice(5000)).toBe('5천')
  })

  it('1000 미만은 그대로', () => {
    expect(formatFinancialPrice(500)).toBe('500')
  })
})

describe('formatPropertyPrice', () => {
  beforeEach(() => {
    getLang.mockReturnValue('ko')
  })

  it('0.1억 단위 반올림', () => {
    expect(formatPropertyPrice(100000000)).toBe('1억')
    expect(formatPropertyPrice(150000000)).toBe('1.5억')
  })

  it('만 단위 반올림', () => {
    expect(formatPropertyPrice(50000)).toBe('5만')
  })
})

describe('formatStatsNumber', () => {
  beforeEach(() => {
    getLang.mockReturnValue('ko')
  })

  it('shortNumbers: false 시 전체 숫자 + 원', () => {
    const settings = { shortNumbers: false }
    expect(formatStatsNumber(1000, settings)).toBe('1,000원')
    expect(formatStatsNumber(100000000, settings)).toBe('100,000,000원')
  })

  it('shortNumbers: true 시 단위 축약', () => {
    const settings = { shortNumbers: true }
    expect(formatStatsNumber(10000, settings)).toBe('1.0만')
    expect(formatStatsNumber(100000000, settings)).toBe('1.00억')
  })

  it('조 단위 소수점 2자리 고정', () => {
    const settings = { shortNumbers: true }
    expect(formatStatsNumber(1000000000000, settings)).toBe('1.00조')
  })
})

describe('formatLeaderboardAssets', () => {
  beforeEach(() => {
    getLang.mockReturnValue('ko')
  })

  it('조 단위 정수 표기', () => {
    expect(formatLeaderboardAssets(1000000000000)).toBe('1조')
    // 1234000000000 = 1.234조 → Math.floor로 1조
    expect(formatLeaderboardAssets(1234000000000)).toBe('1조')
    // 1234조를 테스트하려면 1234 * 1조 = 1234000000000000
    expect(formatLeaderboardAssets(1234000000000000)).toBe('1,234조')
  })

  it('억 단위 정수 표기', () => {
    expect(formatLeaderboardAssets(100000000)).toBe('1억')
    expect(formatLeaderboardAssets(123400000000)).toBe('1,234억')
  })

  it('만원 단위 정수 표기', () => {
    expect(formatLeaderboardAssets(10000)).toBe('1만원')
    expect(formatLeaderboardAssets(15510000)).toBe('1,551만원')
  })

  it('만원 미만은 0만원', () => {
    expect(formatLeaderboardAssets(5000)).toBe('0만원')
    expect(formatLeaderboardAssets(0)).toBe('0만원')
  })
})

describe('formatPlaytimeMs', () => {
  it('0 또는 음수는 —', () => {
    expect(formatPlaytimeMs(0)).toBe('—')
    expect(formatPlaytimeMs(-100)).toBe('—')
  })

  it('1분 미만', () => {
    expect(formatPlaytimeMs(30000)).toBe('1분 미만') // 30초
  })

  it('분 단위', () => {
    expect(formatPlaytimeMs(60000)).toBe('1분') // 1분
    expect(formatPlaytimeMs(2700000)).toBe('45분') // 45분
  })

  it('시간 단위', () => {
    expect(formatPlaytimeMs(3600000)).toBe('1시간') // 1시간
    expect(formatPlaytimeMs(5400000)).toBe('1시간 30분') // 1시간 30분
  })

  it('정확히 시간 단위', () => {
    expect(formatPlaytimeMs(7200000)).toBe('2시간') // 2시간 정각
  })
})

describe('formatPlaytimeMsShort', () => {
  it('0 또는 음수는 —', () => {
    expect(formatPlaytimeMsShort(0)).toBe('—')
    expect(formatPlaytimeMsShort(-100)).toBe('—')
  })

  it('1분 미만', () => {
    expect(formatPlaytimeMsShort(30000)).toBe('<1m')
  })

  it('분 단위', () => {
    expect(formatPlaytimeMsShort(60000)).toBe('1m')
    expect(formatPlaytimeMsShort(2700000)).toBe('45m')
  })

  it('시간 단위', () => {
    expect(formatPlaytimeMsShort(3600000)).toBe('1h 00m')
    expect(formatPlaytimeMsShort(5400000)).toBe('1h 30m')
  })

  it('100시간 이상은 분 생략', () => {
    expect(formatPlaytimeMsShort(360000000)).toBe('100h') // 100시간
    expect(formatPlaytimeMsShort(365400000)).toBe('101h') // 101시간 30분
  })
})

describe('언어 전환 시 포맷 변경', () => {
  it('영어로 전환 시 K/M/B/T 사용', () => {
    getLang.mockReturnValue('en')

    expect(formatKoreanNumber(1000)).toBe('1K')
    expect(formatKoreanNumber(1000000)).toBe('1M')
    expect(formatKoreanNumber(1000000000)).toBe('1B')
  })

  it('영어 formatFinancialPrice', () => {
    getLang.mockReturnValue('en')

    expect(formatFinancialPrice(1000000)).toBe('1M')
    expect(formatFinancialPrice(1000000000)).toBe('1B')
  })

  it('영어 formatLeaderboardAssets', () => {
    getLang.mockReturnValue('en')

    expect(formatLeaderboardAssets(1000000000)).toBe('1B')
    expect(formatLeaderboardAssets(1000000000000)).toBe('1T')
  })

  it('영어 1000 미만은 0', () => {
    getLang.mockReturnValue('en')
    expect(formatLeaderboardAssets(500)).toBe('0')
  })
})

// Import additional functions for testing
import { formatNumberForLang, formatStatsNumberEnglish, formatHeaderCash } from '../numberFormat.js'

describe('formatNumberForLang', () => {
  beforeEach(() => {
    getLang.mockReturnValue('ko')
  })

  it('lang=en 지정 시 영어 포맷 사용', () => {
    expect(formatNumberForLang(1000000, 'en')).toBe('1M')
    expect(formatNumberForLang(1000000000, 'en')).toBe('1B')
  })

  it('lang=ko 지정 시 한국어 포맷 사용', () => {
    expect(formatNumberForLang(10000, 'ko')).toBe('1만')
    expect(formatNumberForLang(100000000, 'ko')).toBe('1억')
  })

  it('lang=null 시 자동 감지 (기본 ko)', () => {
    getLang.mockReturnValue('ko')
    expect(formatNumberForLang(10000, null)).toBe('1만')
    expect(formatNumberForLang(10000)).toBe('1만')
  })

  it('lang=null이고 언어가 en일 때', () => {
    getLang.mockReturnValue('en')
    expect(formatNumberForLang(1000000, null)).toBe('1M')
    expect(formatNumberForLang(1000000)).toBe('1M')
  })
})

describe('formatStatsNumberEnglish', () => {
  it('shortNumbers: false 시 전체 숫자 + KRW', () => {
    const settings = { shortNumbers: false }
    expect(formatStatsNumberEnglish(1000, settings)).toBe('1,000 KRW')
    expect(formatStatsNumberEnglish(100000000, settings)).toBe('100,000,000 KRW')
  })

  it('shortNumbers: true 시 K 단위', () => {
    const settings = { shortNumbers: true }
    expect(formatStatsNumberEnglish(1000, settings)).toBe('1K')
    expect(formatStatsNumberEnglish(50000, settings)).toBe('50K')
  })

  it('shortNumbers: true 시 M 단위', () => {
    const settings = { shortNumbers: true }
    expect(formatStatsNumberEnglish(1000000, settings)).toBe('1.0M')
    expect(formatStatsNumberEnglish(5500000, settings)).toBe('5.5M')
  })

  it('shortNumbers: true 시 B 단위', () => {
    const settings = { shortNumbers: true }
    expect(formatStatsNumberEnglish(1000000000, settings)).toBe('1.00B')
    expect(formatStatsNumberEnglish(5500000000, settings)).toBe('5.50B')
  })

  it('shortNumbers: true 시 T 단위', () => {
    const settings = { shortNumbers: true }
    expect(formatStatsNumberEnglish(1000000000000, settings)).toBe('1.00T')
    expect(formatStatsNumberEnglish(5500000000000, settings)).toBe('5.50T')
  })

  it('1000 미만은 전체 숫자 + KRW', () => {
    const settings = { shortNumbers: true }
    expect(formatStatsNumberEnglish(500, settings)).toBe('500 KRW')
  })
})

describe('formatHeaderCash', () => {
  beforeEach(() => {
    getLang.mockReturnValue('ko')
  })

  it('formatStatsNumber과 동일하게 동작 (한국어)', () => {
    const settings = { shortNumbers: true }
    expect(formatHeaderCash(10000, settings)).toBe('1.0만')
    expect(formatHeaderCash(100000000, settings)).toBe('1.00억')
  })

  it('shortNumbers: false 시 전체 숫자', () => {
    const settings = { shortNumbers: false }
    expect(formatHeaderCash(1000000, settings)).toBe('1,000,000원')
  })

  it('영어 모드에서 동작', () => {
    getLang.mockReturnValue('en')
    const settings = { shortNumbers: true }
    expect(formatHeaderCash(1000000, settings)).toBe('1.0M')
    expect(formatHeaderCash(1000000000, settings)).toBe('1.00B')
  })
})

describe('formatStatsNumber - 영어 모드', () => {
  beforeEach(() => {
    getLang.mockReturnValue('en')
  })

  it('영어 shortNumbers: false', () => {
    const settings = { shortNumbers: false }
    expect(formatStatsNumber(1000, settings)).toBe('1,000 KRW')
  })

  it('영어 shortNumbers: true', () => {
    const settings = { shortNumbers: true }
    expect(formatStatsNumber(1000000, settings)).toBe('1.0M')
    expect(formatStatsNumber(1000000000, settings)).toBe('1.00B')
  })
})

describe('formatStatsNumber - 한국어 추가 케이스', () => {
  beforeEach(() => {
    getLang.mockReturnValue('ko')
  })

  it('천원 단위', () => {
    const settings = { shortNumbers: true }
    expect(formatStatsNumber(1000, settings)).toBe('1천')
    expect(formatStatsNumber(5000, settings)).toBe('5천')
  })

  it('1000 미만', () => {
    const settings = { shortNumbers: true }
    expect(formatStatsNumber(500, settings)).toBe('500원')
    expect(formatStatsNumber(0, settings)).toBe('0원')
  })
})

describe('formatRelativeTime', () => {
  beforeEach(() => {
    getLang.mockReturnValue('ko')
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-20T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('null/undefined/빈 값은 —', () => {
    expect(formatRelativeTime(null)).toBe('—')
    expect(formatRelativeTime(undefined)).toBe('—')
    expect(formatRelativeTime('')).toBe('—')
  })

  it('유효하지 않은 날짜는 —', () => {
    expect(formatRelativeTime('invalid-date')).toBe('—')
    expect(formatRelativeTime('not a date')).toBe('—')
  })

  it('미래 시간은 —', () => {
    expect(formatRelativeTime('2026-01-20T13:00:00Z')).toBe('—')
  })

  it('1분 미만은 "방금" (한국어)', () => {
    expect(formatRelativeTime('2026-01-20T11:59:30Z')).toBe('방금')
    expect(formatRelativeTime('2026-01-20T11:59:59Z')).toBe('방금')
  })

  it('분 단위 (한국어)', () => {
    expect(formatRelativeTime('2026-01-20T11:55:00Z')).toBe('5분 전')
    expect(formatRelativeTime('2026-01-20T11:30:00Z')).toBe('30분 전')
    expect(formatRelativeTime('2026-01-20T11:01:00Z')).toBe('59분 전')
  })

  it('시간 단위 (한국어)', () => {
    expect(formatRelativeTime('2026-01-20T11:00:00Z')).toBe('1시간 전')
    expect(formatRelativeTime('2026-01-20T09:00:00Z')).toBe('3시간 전')
    expect(formatRelativeTime('2026-01-19T13:00:00Z')).toBe('23시간 전')
  })

  it('일 단위 (한국어)', () => {
    expect(formatRelativeTime('2026-01-19T12:00:00Z')).toBe('1일 전')
    expect(formatRelativeTime('2026-01-17T12:00:00Z')).toBe('3일 전')
    expect(formatRelativeTime('2026-01-14T12:00:00Z')).toBe('6일 전')
  })

  it('주 단위 (한국어)', () => {
    expect(formatRelativeTime('2026-01-13T12:00:00Z')).toBe('1주 전')
    expect(formatRelativeTime('2026-01-06T12:00:00Z')).toBe('2주 전')
    expect(formatRelativeTime('2025-12-30T12:00:00Z')).toBe('3주 전')
    expect(formatRelativeTime('2025-12-23T12:00:00Z')).toBe('4주 전') // 28일 = 4주
  })

  it('월 단위 (한국어)', () => {
    expect(formatRelativeTime('2025-12-21T12:00:00Z')).toBe('1개월 전') // 30일
    expect(formatRelativeTime('2025-12-20T12:00:00Z')).toBe('1개월 전') // 31일
    expect(formatRelativeTime('2025-10-20T12:00:00Z')).toBe('3개월 전')
    expect(formatRelativeTime('2025-02-20T12:00:00Z')).toBe('11개월 전')
  })

  it('년 단위 (한국어)', () => {
    expect(formatRelativeTime('2025-01-20T12:00:00Z')).toBe('1년 전') // 365일
    expect(formatRelativeTime('2024-01-20T12:00:00Z')).toBe('2년 전')
    expect(formatRelativeTime('2021-01-20T12:00:00Z')).toBe('5년 전')
  })

  it('영어 모드', () => {
    getLang.mockReturnValue('en')

    expect(formatRelativeTime('2026-01-20T11:59:30Z')).toBe('Now')
    expect(formatRelativeTime('2026-01-20T11:55:00Z')).toBe('5m ago')
    expect(formatRelativeTime('2026-01-20T09:00:00Z')).toBe('3h ago')
    expect(formatRelativeTime('2026-01-17T12:00:00Z')).toBe('3d ago')
    expect(formatRelativeTime('2026-01-06T12:00:00Z')).toBe('2w ago')
    expect(formatRelativeTime('2025-12-23T12:00:00Z')).toBe('4w ago') // 28일 = 4주
    expect(formatRelativeTime('2025-12-21T12:00:00Z')).toBe('1mo ago') // 30일
    expect(formatRelativeTime('2025-01-20T12:00:00Z')).toBe('1y ago') // 1년
  })

  it('Date 객체도 처리', () => {
    const date = new Date('2026-01-20T11:55:00Z')
    expect(formatRelativeTime(date)).toBe('5분 전')
  })
})
