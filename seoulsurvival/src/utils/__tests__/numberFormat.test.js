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
    expect(formatStatsNumber(10000, settings)).toBe('1.0만원')
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
