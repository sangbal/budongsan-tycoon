/**
 * Seoul Survival - Upgrade Unlock System Tests
 *
 * 업그레이드 해금 시스템 단위 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createUpgradeUnlockSystem } from '../upgrades.js'

describe('createUpgradeUnlockSystem', () => {
  let deps
  let upgrades

  beforeEach(() => {
    deps = {
      addLog: vi.fn(),
      onAnyUnlocked: vi.fn(),
    }

    upgrades = {
      upgrade1: {
        name: '업그레이드 1',
        unlocked: false,
        purchased: false,
        unlockCondition: vi.fn(() => false),
      },
      upgrade2: {
        name: '업그레이드 2',
        unlocked: false,
        purchased: false,
        unlockCondition: vi.fn(() => false),
      },
    }
  })

  describe('checkUpgradeUnlocks', () => {
    it('조건 미충족 시 해금 안됨', () => {
      const system = createUpgradeUnlockSystem(upgrades, deps)
      system.checkUpgradeUnlocks()

      expect(upgrades.upgrade1.unlocked).toBe(false)
      expect(upgrades.upgrade2.unlocked).toBe(false)
      expect(deps.addLog).not.toHaveBeenCalled()
      expect(deps.onAnyUnlocked).not.toHaveBeenCalled()
    })

    it('조건 충족 시 해금', () => {
      upgrades.upgrade1.unlockCondition = vi.fn(() => true)

      const system = createUpgradeUnlockSystem(upgrades, deps)
      system.checkUpgradeUnlocks()

      expect(upgrades.upgrade1.unlocked).toBe(true)
      expect(deps.addLog).toHaveBeenCalledWith(expect.stringContaining('업그레이드 1'))
      expect(deps.onAnyUnlocked).toHaveBeenCalled()
    })

    it('이미 해금된 업그레이드는 스킵', () => {
      upgrades.upgrade1.unlocked = true
      upgrades.upgrade1.unlockCondition = vi.fn(() => true)

      const system = createUpgradeUnlockSystem(upgrades, deps)
      system.checkUpgradeUnlocks()

      expect(upgrades.upgrade1.unlockCondition).not.toHaveBeenCalled()
      expect(deps.addLog).not.toHaveBeenCalled()
    })

    it('이미 구매된 업그레이드는 스킵', () => {
      upgrades.upgrade1.purchased = true
      upgrades.upgrade1.unlockCondition = vi.fn(() => true)

      const system = createUpgradeUnlockSystem(upgrades, deps)
      system.checkUpgradeUnlocks()

      expect(upgrades.upgrade1.unlockCondition).not.toHaveBeenCalled()
      expect(deps.addLog).not.toHaveBeenCalled()
    })

    it('여러 업그레이드 동시 해금', () => {
      upgrades.upgrade1.unlockCondition = vi.fn(() => true)
      upgrades.upgrade2.unlockCondition = vi.fn(() => true)

      const system = createUpgradeUnlockSystem(upgrades, deps)
      system.checkUpgradeUnlocks()

      expect(upgrades.upgrade1.unlocked).toBe(true)
      expect(upgrades.upgrade2.unlocked).toBe(true)
      expect(deps.addLog).toHaveBeenCalledTimes(2)
      expect(deps.onAnyUnlocked).toHaveBeenCalledTimes(1)
    })

    it('로그 메시지에 이모지와 업그레이드 이름 포함', () => {
      upgrades.upgrade1.unlockCondition = vi.fn(() => true)

      const system = createUpgradeUnlockSystem(upgrades, deps)
      system.checkUpgradeUnlocks()

      // t('msg.upgradeUnlocked') 번역 결과 검증
      expect(deps.addLog).toHaveBeenCalledWith('🎁 New upgrade unlocked: 업그레이드 1')
    })

    it('unlockCondition 에러 발생 시 무시하고 계속 진행', () => {
      upgrades.upgrade1.unlockCondition = vi.fn(() => {
        throw new Error('테스트 에러')
      })
      upgrades.upgrade2.unlockCondition = vi.fn(() => true)

      const system = createUpgradeUnlockSystem(upgrades, deps)

      // 에러 발생해도 예외 없이 진행
      expect(() => system.checkUpgradeUnlocks()).not.toThrow()

      // upgrade1은 해금 안됨 (에러), upgrade2는 해금됨
      expect(upgrades.upgrade1.unlocked).toBe(false)
      expect(upgrades.upgrade2.unlocked).toBe(true)
    })

    it('빈 업그레이드 객체에서도 에러 없이 동작', () => {
      const system = createUpgradeUnlockSystem({}, deps)
      expect(() => system.checkUpgradeUnlocks()).not.toThrow()
      expect(deps.onAnyUnlocked).not.toHaveBeenCalled()
    })

    it('onAnyUnlocked가 없어도 정상 동작', () => {
      const depsWithoutCallback = { addLog: vi.fn() }
      upgrades.upgrade1.unlockCondition = vi.fn(() => true)

      const system = createUpgradeUnlockSystem(upgrades, depsWithoutCallback)
      expect(() => system.checkUpgradeUnlocks()).not.toThrow()
      expect(upgrades.upgrade1.unlocked).toBe(true)
    })

    it('unlockCondition 함수가 매번 호출됨', () => {
      const system = createUpgradeUnlockSystem(upgrades, deps)

      system.checkUpgradeUnlocks()
      expect(upgrades.upgrade1.unlockCondition).toHaveBeenCalledTimes(1)

      // 다시 호출하면 이미 해금 안된 것만 체크
      system.checkUpgradeUnlocks()
      expect(upgrades.upgrade1.unlockCondition).toHaveBeenCalledTimes(2)
    })
  })
})
