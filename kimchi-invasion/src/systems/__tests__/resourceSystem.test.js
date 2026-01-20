/**
 * KIMCHI INVASION - ResourceSystem Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ResourceSystem } from '../resourceSystem.js'
import { useGameStore } from '../../state/stores/gameStore.js'

// Zustand 스토어 초기화
beforeEach(() => {
  useGameStore.setState({
    resources: {
      iron: 0,
      water: 0,
      energy: 0,
      dollars: 100,
    },
  })
})

describe('ResourceSystem', () => {
  let system

  beforeEach(() => {
    system = new ResourceSystem()
    system.init()
  })

  describe('add()', () => {
    it('자원을 정상적으로 추가해야 함', () => {
      const added = system.add('iron', 50)
      expect(added).toBe(50)
      expect(system.get('iron')).toBe(50)
    })

    it('maxValue 한도를 초과하면 최대값까지만 추가', () => {
      // energy maxValue는 100
      system.add('energy', 80)
      const added = system.add('energy', 50) // 총 130이지만 100까지만
      expect(added).toBe(20)
      expect(system.get('energy')).toBe(100)
    })

    it('maxValue가 -1이면 무제한 추가 가능', () => {
      // dollars는 maxValue: -1 (무제한)
      const added = system.add('dollars', 1000000)
      expect(added).toBe(1000000)
      expect(system.get('dollars')).toBeGreaterThanOrEqual(1000000)
    })

    it('알 수 없는 자원 ID는 0 반환', () => {
      const added = system.add('unknownResource', 10)
      expect(added).toBe(0)
    })

    it('음수 추가는 허용 안함 (Math.min 동작)', () => {
      system.add('iron', 100)
      const added = system.add('iron', -50)
      expect(added).toBeLessThanOrEqual(0)
    })
  })

  describe('consume()', () => {
    beforeEach(() => {
      system.add('iron', 100)
      system.add('water', 50)
    })

    it('충분한 자원이 있으면 소비 성공', () => {
      const success = system.consume('iron', 30)
      expect(success).toBe(true)
      expect(system.get('iron')).toBe(70)
    })

    it('부족하면 소비 실패하고 상태 변경 안됨', () => {
      const success = system.consume('water', 100)
      expect(success).toBe(false)
      expect(system.get('water')).toBe(50) // 변경 안됨
    })

    it('정확히 보유량만큼 소비하면 성공', () => {
      const success = system.consume('water', 50)
      expect(success).toBe(true)
      expect(system.get('water')).toBe(0)
    })

    it('알 수 없는 자원 ID는 false 반환', () => {
      const success = system.consume('unknownResource', 10)
      expect(success).toBe(false)
    })

    it('소비 실패 시 상태가 롤백되어야 함', () => {
      const before = system.get('iron')
      system.consume('iron', 200) // 실패
      expect(system.get('iron')).toBe(before) // 변경 없음
    })
  })

  describe('has()', () => {
    beforeEach(() => {
      system.add('iron', 100)
    })

    it('충분한 자원이 있으면 true', () => {
      expect(system.has('iron', 50)).toBe(true)
      expect(system.has('iron', 100)).toBe(true)
    })

    it('부족하면 false', () => {
      expect(system.has('iron', 101)).toBe(false)
      expect(system.has('iron', 200)).toBe(false)
    })

    it('0개 요구 시 항상 true', () => {
      expect(system.has('water', 0)).toBe(true)
    })

    it('없는 자원은 false', () => {
      expect(system.has('water', 1)).toBe(false)
    })
  })

  describe('get()', () => {
    it('보유량을 정확히 반환해야 함', () => {
      system.add('iron', 42)
      expect(system.get('iron')).toBe(42)
    })

    it('없는 자원은 0 반환', () => {
      expect(system.get('unknownResource')).toBe(0)
    })
  })

  describe('getMaxValue()', () => {
    it('정의된 maxValue를 반환해야 함', () => {
      expect(system.getMaxValue('energy')).toBe(100)
      expect(system.getMaxValue('iron')).toBe(1000)
    })

    it('maxValue가 -1이면 Infinity 반환', () => {
      expect(system.getMaxValue('dollars')).toBe(Infinity)
    })

    it('알 수 없는 자원은 0 반환', () => {
      expect(system.getMaxValue('unknownResource')).toBe(0)
    })
  })

  describe('getDefinition()', () => {
    it('자원 정의를 반환해야 함', () => {
      const def = system.getDefinition('iron')
      expect(def).toBeTruthy()
      expect(def.id).toBe('iron')
      expect(def.category).toBe('raw')
    })

    it('없는 자원은 null 반환', () => {
      expect(system.getDefinition('unknownResource')).toBeNull()
    })
  })

  describe('consumeMultiple()', () => {
    beforeEach(() => {
      system.add('iron', 100)
      system.add('water', 50)
      system.add('energy', 30)
    })

    it('모든 자원이 충분하면 일괄 소비 성공', () => {
      const success = system.consumeMultiple({
        iron: 20,
        water: 10,
        energy: 5,
      })
      expect(success).toBe(true)
      expect(system.get('iron')).toBe(80)
      expect(system.get('water')).toBe(40)
      expect(system.get('energy')).toBe(25)
    })

    it('하나라도 부족하면 전체 실패 (All or Nothing)', () => {
      const before = {
        iron: system.get('iron'),
        water: system.get('water'),
        energy: system.get('energy'),
      }

      const success = system.consumeMultiple({
        iron: 20,
        water: 100, // 부족
        energy: 5,
      })

      expect(success).toBe(false)
      // 모든 자원이 원래 상태 유지 (트랜잭션 실패)
      expect(system.get('iron')).toBe(before.iron)
      expect(system.get('water')).toBe(before.water)
      expect(system.get('energy')).toBe(before.energy)
    })

    it('빈 객체는 항상 성공', () => {
      expect(system.consumeMultiple({})).toBe(true)
    })
  })

  describe('addMultiple()', () => {
    it('여러 자원을 동시에 추가해야 함', () => {
      const actualAdded = system.addMultiple({
        iron: 50,
        water: 30,
        energy: 20,
      })

      expect(actualAdded.iron).toBe(50)
      expect(actualAdded.water).toBe(30)
      expect(actualAdded.energy).toBe(20)
    })

    it('maxValue 초과 시 실제 추가된 양만 반환', () => {
      system.add('energy', 90) // 이미 90 보유 (max 100)
      const actualAdded = system.addMultiple({
        energy: 50, // 50 추가 시도하지만 10만 추가 가능
      })

      expect(actualAdded.energy).toBe(10)
      expect(system.get('energy')).toBe(100)
    })

    it('빈 객체는 빈 결과 반환', () => {
      const actualAdded = system.addMultiple({})
      expect(Object.keys(actualAdded)).toHaveLength(0)
    })
  })

  describe('update()', () => {
    it('deltaTime을 받아 처리해야 함 (현재는 빈 구현)', () => {
      const entities = []
      expect(() => system.update(entities, 1 / 60)).not.toThrow()
    })
  })

  describe('upgradeCapacity()', () => {
    it('아직 구현 안됨 (경고 로그)', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      system.upgradeCapacity('iron', 500)
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('디버깅 함수', () => {
    it('debugPrintAll()은 에러 없이 실행되어야 함', () => {
      system.add('iron', 100)
      system.add('water', 50)
      expect(() => system.debugPrintAll()).not.toThrow()
    })

    it('debugInfo()는 자원 정보를 출력해야 함', () => {
      system.add('iron', 42)
      expect(() => system.debugInfo('iron')).not.toThrow()
    })

    it('debugInfo()는 없는 자원 시 에러 로그', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      system.debugInfo('unknownResource')
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('편의 함수', () => {
    it('addResource() 단축 함수', async () => {
      const { addResource } = await import('../resourceSystem.js')
      const added = addResource('iron', 50)
      expect(added).toBe(50)
    })

    it('consumeResource() 단축 함수', async () => {
      const { addResource, consumeResource } = await import('../resourceSystem.js')
      addResource('iron', 100)
      const success = consumeResource('iron', 30)
      expect(success).toBe(true)
    })

    it('hasResource() 단축 함수', async () => {
      const { addResource, hasResource } = await import('../resourceSystem.js')
      addResource('iron', 100)
      expect(hasResource('iron', 50)).toBe(true)
    })

    it('getResource() 단축 함수', async () => {
      const { addResource, getResource } = await import('../resourceSystem.js')
      addResource('iron', 42)
      expect(getResource('iron')).toBe(42)
    })
  })
})
