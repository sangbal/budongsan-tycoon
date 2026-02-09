/**
 * Seoul Survival - Achievements System Tests
 *
 * 업적 시스템 단위 테스트
 */

import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { createAchievementsSystem } from '../achievements.js'
import { ensureTranslationLoaded } from '../../i18n/index.js'

// 테스트 시작 전 번역 파일 로드
beforeAll(async () => {
  await ensureTranslationLoaded('en')
})

describe('createAchievementsSystem', () => {
  let deps
  let achievements

  beforeEach(() => {
    deps = {
      notify: vi.fn(),
      addLog: vi.fn(),
    }

    achievements = [
      {
        id: 'test_1',
        name: '테스트 업적 1',
        desc: '테스트 설명 1',
        icon: '🏆',
        condition: vi.fn(() => false),
        unlocked: false,
      },
      {
        id: 'test_2',
        name: '테스트 업적 2',
        desc: '테스트 설명 2',
        icon: '🎯',
        condition: vi.fn(() => false),
        unlocked: false,
      },
    ]
  })

  describe('checkAchievements', () => {
    it('조건 미충족 시 업적 해금 안됨', () => {
      const system = createAchievementsSystem(achievements, deps)
      system.checkAchievements()

      expect(achievements[0].unlocked).toBe(false)
      expect(achievements[1].unlocked).toBe(false)
      expect(deps.notify).not.toHaveBeenCalled()
      expect(deps.addLog).not.toHaveBeenCalled()
    })

    it('조건 충족 시 업적 해금', () => {
      achievements[0].condition = vi.fn(() => true)

      const system = createAchievementsSystem(achievements, deps)
      system.checkAchievements()

      expect(achievements[0].unlocked).toBe(true)
      // notify는 (achievement, shareCallback)으로 호출됨
      expect(deps.notify).toHaveBeenCalledWith(achievements[0], undefined)
      expect(deps.addLog).toHaveBeenCalledWith(expect.stringContaining('Achievement unlocked'))
      expect(deps.addLog).toHaveBeenCalledWith(expect.stringContaining('테스트 업적 1'))
    })

    it('이미 해금된 업적은 다시 해금 안됨', () => {
      achievements[0].condition = vi.fn(() => true)
      achievements[0].unlocked = true

      const system = createAchievementsSystem(achievements, deps)
      system.checkAchievements()

      expect(deps.notify).not.toHaveBeenCalled()
      expect(deps.addLog).not.toHaveBeenCalled()
    })

    it('여러 업적 동시 해금', () => {
      achievements[0].condition = vi.fn(() => true)
      achievements[1].condition = vi.fn(() => true)

      const system = createAchievementsSystem(achievements, deps)
      system.checkAchievements()

      expect(achievements[0].unlocked).toBe(true)
      expect(achievements[1].unlocked).toBe(true)
      expect(deps.notify).toHaveBeenCalledTimes(2)
      expect(deps.addLog).toHaveBeenCalledTimes(2)
    })

    it('로그 메시지에 업적 이름과 설명 포함', () => {
      achievements[0].condition = vi.fn(() => true)

      const system = createAchievementsSystem(achievements, deps)
      system.checkAchievements()

      // t('msg.achievementUnlocked', { name: ..., desc: ... }) 번역 결과 검증
      const logCall = deps.addLog.mock.calls[0][0]
      expect(logCall).toContain('🏆')
      expect(logCall).toContain('Achievement unlocked')
      expect(logCall).toContain('테스트 업적 1')
      expect(logCall).toContain('테스트 설명 1')
    })

    it('빈 업적 배열에서도 에러 없이 동작', () => {
      const system = createAchievementsSystem([], deps)
      expect(() => system.checkAchievements()).not.toThrow()
    })

    it('condition 함수가 호출됨', () => {
      const system = createAchievementsSystem(achievements, deps)
      system.checkAchievements()

      expect(achievements[0].condition).toHaveBeenCalled()
      expect(achievements[1].condition).toHaveBeenCalled()
    })

    it('unlocked가 true면 condition 호출 안됨', () => {
      achievements[0].unlocked = true
      achievements[0].condition = vi.fn(() => true)

      const system = createAchievementsSystem(achievements, deps)
      system.checkAchievements()

      // 이미 해금된 업적은 condition 체크하지 않음 (short-circuit)
      // 실제 코드를 보니 && 연산자로 short-circuit 발생
      expect(achievements[0].condition).not.toHaveBeenCalled()
    })
  })
})
