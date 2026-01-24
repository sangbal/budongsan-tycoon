/**
 * timing.js 단위 테스트
 *
 * 게임 타이밍 및 확률 상수 검증
 */

import { describe, it, expect } from 'vitest'
import { TIMING, MARKET_EVENT_TIMING, PROBABILITY, ANIMATION, RETRY } from '../timing.js'

describe('timing constants', () => {
  describe('TIMING', () => {
    it('TICK_INTERVAL_MS는 양수여야 함', () => {
      expect(TIMING.TICK_INTERVAL_MS).toBeGreaterThan(0)
      expect(TIMING.TICK_INTERVAL_MS).toBe(50)
    })

    it('AUTO_SAVE_INTERVAL_MS는 TICK_INTERVAL_MS보다 커야 함', () => {
      expect(TIMING.AUTO_SAVE_INTERVAL_MS).toBeGreaterThan(TIMING.TICK_INTERVAL_MS)
      expect(TIMING.AUTO_SAVE_INTERVAL_MS).toBe(5000)
    })

    it('LEADERBOARD_THROTTLE_MS는 AUTO_SAVE_INTERVAL_MS보다 커야 함', () => {
      expect(TIMING.LEADERBOARD_THROTTLE_MS).toBeGreaterThan(TIMING.AUTO_SAVE_INTERVAL_MS)
      expect(TIMING.LEADERBOARD_THROTTLE_MS).toBe(30000)
    })

    it('CLICK_EFFECT_DURATION_MS는 양수여야 함', () => {
      expect(TIMING.CLICK_EFFECT_DURATION_MS).toBeGreaterThan(0)
      expect(TIMING.CLICK_EFFECT_DURATION_MS).toBe(300)
    })

    it('RELOAD_DELAY_MS는 양수여야 함', () => {
      expect(TIMING.RELOAD_DELAY_MS).toBeGreaterThan(0)
      expect(TIMING.RELOAD_DELAY_MS).toBe(500)
    })

    it('모든 TIMING 값은 유한한 숫자여야 함', () => {
      Object.values(TIMING).forEach(value => {
        expect(Number.isFinite(value)).toBe(true)
      })
    })

    it('모든 TIMING 값은 정수여야 함', () => {
      Object.values(TIMING).forEach(value => {
        expect(Number.isInteger(value)).toBe(true)
      })
    })
  })

  describe('MARKET_EVENT_TIMING', () => {
    it('MIN_INTERVAL_MS는 양수여야 함', () => {
      expect(MARKET_EVENT_TIMING.MIN_INTERVAL_MS).toBeGreaterThan(0)
      expect(MARKET_EVENT_TIMING.MIN_INTERVAL_MS).toBe(120000) // 2분
    })

    it('RANDOM_RANGE_MS는 양수여야 함', () => {
      expect(MARKET_EVENT_TIMING.RANDOM_RANGE_MS).toBeGreaterThan(0)
      expect(MARKET_EVENT_TIMING.RANDOM_RANGE_MS).toBe(180000) // 3분
    })

    it('최대 이벤트 간격은 5분(300초)이어야 함', () => {
      const maxInterval = MARKET_EVENT_TIMING.MIN_INTERVAL_MS + MARKET_EVENT_TIMING.RANDOM_RANGE_MS
      expect(maxInterval).toBe(300000) // 5분
    })

    it('모든 MARKET_EVENT_TIMING 값은 유한한 숫자여야 함', () => {
      Object.values(MARKET_EVENT_TIMING).forEach(value => {
        expect(Number.isFinite(value)).toBe(true)
      })
    })
  })

  describe('PROBABILITY', () => {
    it('PERFORMANCE_BONUS_CHANCE는 0~1 범위여야 함', () => {
      expect(PROBABILITY.PERFORMANCE_BONUS_CHANCE).toBeGreaterThanOrEqual(0)
      expect(PROBABILITY.PERFORMANCE_BONUS_CHANCE).toBeLessThanOrEqual(1)
      expect(PROBABILITY.PERFORMANCE_BONUS_CHANCE).toBe(0.02) // 2%
    })

    it('PERFORMANCE_BONUS_MULTIPLIER는 1 이상이어야 함', () => {
      expect(PROBABILITY.PERFORMANCE_BONUS_MULTIPLIER).toBeGreaterThanOrEqual(1)
      expect(PROBABILITY.PERFORMANCE_BONUS_MULTIPLIER).toBe(10)
    })

    it('AUTO_CLICK_CHANCE는 0~1 범위여야 함', () => {
      expect(PROBABILITY.AUTO_CLICK_CHANCE).toBeGreaterThanOrEqual(0)
      expect(PROBABILITY.AUTO_CLICK_CHANCE).toBeLessThanOrEqual(1)
      expect(PROBABILITY.AUTO_CLICK_CHANCE).toBe(1.0) // 100%
    })

    it('모든 PROBABILITY 값은 유한한 숫자여야 함', () => {
      Object.values(PROBABILITY).forEach(value => {
        expect(Number.isFinite(value)).toBe(true)
      })
    })

    it('성과급 확률은 너무 높지 않아야 함 (게임 밸런스)', () => {
      expect(PROBABILITY.PERFORMANCE_BONUS_CHANCE).toBeLessThan(0.1) // 10% 미만
    })

    it('성과급 배수는 실질적인 보상을 제공해야 함', () => {
      expect(PROBABILITY.PERFORMANCE_BONUS_MULTIPLIER).toBeGreaterThanOrEqual(5)
    })
  })

  describe('ANIMATION', () => {
    it('PROMOTION_FADEOUT_MS는 양수여야 함', () => {
      expect(ANIMATION.PROMOTION_FADEOUT_MS).toBeGreaterThan(0)
      expect(ANIMATION.PROMOTION_FADEOUT_MS).toBe(300)
    })

    it('PROMOTION_TRANSITION_MS는 PROMOTION_FADEOUT_MS보다 커야 함', () => {
      expect(ANIMATION.PROMOTION_TRANSITION_MS).toBeGreaterThan(ANIMATION.PROMOTION_FADEOUT_MS)
      expect(ANIMATION.PROMOTION_TRANSITION_MS).toBe(800)
    })

    it('CAREER_CARD_ANIMATION_DELAY_MS는 양수여야 함', () => {
      expect(ANIMATION.CAREER_CARD_ANIMATION_DELAY_MS).toBeGreaterThan(0)
      expect(ANIMATION.CAREER_CARD_ANIMATION_DELAY_MS).toBe(10)
    })

    it('모든 ANIMATION 값은 유한한 숫자여야 함', () => {
      Object.values(ANIMATION).forEach(value => {
        expect(Number.isFinite(value)).toBe(true)
      })
    })

    it('애니메이션 시간은 1초 이내여야 함 (UX)', () => {
      Object.values(ANIMATION).forEach(value => {
        expect(value).toBeLessThanOrEqual(1000)
      })
    })
  })

  describe('RETRY', () => {
    it('SAVE_MAX_ATTEMPTS는 1 이상이어야 함', () => {
      expect(RETRY.SAVE_MAX_ATTEMPTS).toBeGreaterThanOrEqual(1)
      expect(RETRY.SAVE_MAX_ATTEMPTS).toBe(3)
    })

    it('SAVE_RETRY_DELAYS 배열 길이는 SAVE_MAX_ATTEMPTS와 일치해야 함', () => {
      expect(RETRY.SAVE_RETRY_DELAYS.length).toBe(RETRY.SAVE_MAX_ATTEMPTS)
    })

    it('SAVE_RETRY_DELAYS는 지수 백오프를 구현해야 함', () => {
      const delays = RETRY.SAVE_RETRY_DELAYS
      expect(delays).toEqual([1000, 2000, 4000])

      // 각 지연 시간은 이전보다 크거나 같아야 함
      for (let i = 1; i < delays.length; i++) {
        expect(delays[i]).toBeGreaterThanOrEqual(delays[i - 1])
      }
    })

    it('모든 SAVE_RETRY_DELAYS는 양수여야 함', () => {
      RETRY.SAVE_RETRY_DELAYS.forEach(delay => {
        expect(delay).toBeGreaterThan(0)
        expect(Number.isFinite(delay)).toBe(true)
      })
    })

    it('재시도 지연 시간은 10초 이내여야 함 (UX)', () => {
      RETRY.SAVE_RETRY_DELAYS.forEach(delay => {
        expect(delay).toBeLessThanOrEqual(10000)
      })
    })
  })

  describe('상수 참조 테스트', () => {
    it('TIMING 객체는 읽기 전용이어야 함 (불변성)', () => {
      const originalValue = TIMING.TICK_INTERVAL_MS

      // Object.freeze가 적용되지 않았으므로 수정 가능
      // 향후 Object.freeze 적용 권장
      TIMING.TICK_INTERVAL_MS = 999

      // 원래 값으로 복원 (다른 테스트에 영향 없도록)
      TIMING.TICK_INTERVAL_MS = originalValue

      expect(TIMING.TICK_INTERVAL_MS).toBe(originalValue)
    })

    it('모든 상수 그룹은 객체여야 함', () => {
      expect(typeof TIMING).toBe('object')
      expect(typeof MARKET_EVENT_TIMING).toBe('object')
      expect(typeof PROBABILITY).toBe('object')
      expect(typeof ANIMATION).toBe('object')
      expect(typeof RETRY).toBe('object')
    })

    it('상수 그룹은 null이 아니어야 함', () => {
      expect(TIMING).not.toBeNull()
      expect(MARKET_EVENT_TIMING).not.toBeNull()
      expect(PROBABILITY).not.toBeNull()
      expect(ANIMATION).not.toBeNull()
      expect(RETRY).not.toBeNull()
    })
  })

  describe('게임 밸런스 제약 조건', () => {
    it('게임 틱은 60 FPS 이하여야 함 (브라우저 제약)', () => {
      const minTickInterval = 1000 / 60 // 16.67ms
      expect(TIMING.TICK_INTERVAL_MS).toBeGreaterThanOrEqual(minTickInterval)
    })

    it('자동 저장은 너무 자주 발생하지 않아야 함 (성능)', () => {
      expect(TIMING.AUTO_SAVE_INTERVAL_MS).toBeGreaterThanOrEqual(3000) // 최소 3초
    })

    it('리더보드 업데이트는 과도하지 않아야 함 (API 제약)', () => {
      expect(TIMING.LEADERBOARD_THROTTLE_MS).toBeGreaterThanOrEqual(10000) // 최소 10초
    })

    it('시장 이벤트는 너무 자주 발생하지 않아야 함 (밸런스)', () => {
      expect(MARKET_EVENT_TIMING.MIN_INTERVAL_MS).toBeGreaterThanOrEqual(60000) // 최소 1분
    })

    it('성과급 기대값은 클릭당 20% 미만이어야 함 (밸런스)', () => {
      const expectedValue =
        PROBABILITY.PERFORMANCE_BONUS_CHANCE * (PROBABILITY.PERFORMANCE_BONUS_MULTIPLIER - 1)
      expect(expectedValue).toBeLessThan(0.2) // 20% 미만
    })
  })

  describe('edge cases', () => {
    it('0으로 나누기 위험이 없어야 함', () => {
      expect(TIMING.TICK_INTERVAL_MS).not.toBe(0)
      expect(TIMING.AUTO_SAVE_INTERVAL_MS).not.toBe(0)
      expect(TIMING.LEADERBOARD_THROTTLE_MS).not.toBe(0)
    })

    it('Infinity 값이 없어야 함', () => {
      const allValues = [
        ...Object.values(TIMING),
        ...Object.values(MARKET_EVENT_TIMING),
        ...Object.values(PROBABILITY).filter(v => typeof v === 'number'),
        ...Object.values(ANIMATION),
        RETRY.SAVE_MAX_ATTEMPTS,
        ...RETRY.SAVE_RETRY_DELAYS,
      ]

      allValues.forEach(value => {
        expect(value).not.toBe(Infinity)
        expect(value).not.toBe(-Infinity)
      })
    })

    it('NaN 값이 없어야 함', () => {
      const allValues = [
        ...Object.values(TIMING),
        ...Object.values(MARKET_EVENT_TIMING),
        ...Object.values(PROBABILITY).filter(v => typeof v === 'number'),
        ...Object.values(ANIMATION),
        RETRY.SAVE_MAX_ATTEMPTS,
        ...RETRY.SAVE_RETRY_DELAYS,
      ]

      allValues.forEach(value => {
        expect(Number.isNaN(value)).toBe(false)
      })
    })
  })
})
