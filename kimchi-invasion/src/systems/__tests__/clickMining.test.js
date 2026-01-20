/**
 * KIMCHI INVASION - ClickMiningSystem Tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ClickMiningSystem } from '../clickMining.js'
import { resourceSystem } from '../resourceSystem.js'
import { useGameStore } from '../../state/stores/gameStore.js'

// Mock 모듈
vi.mock('../../core/tilemap.js', () => ({
  getTile: vi.fn((x, y) => {
    if (x < 0 || y < 0 || x > 50 || y > 50) return null // 맵 밖
    return {
      type: 'rock',
      resource: 'iron',
      hp: 10,
    }
  }),
  worldToTile: vi.fn((worldX, worldY) => ({
    x: Math.floor(worldX / 32),
    y: Math.floor(worldY / 32),
  })),
}))

vi.mock('../../core/camera.js', () => ({
  screenToWorld: vi.fn((screenX, screenY) => ({
    x: screenX,
    y: screenY,
  })),
}))

vi.mock('../../core/input.js', () => ({
  onInput: vi.fn((eventType, callback) => {
    // 해제 함수 반환
    return () => {}
  }),
}))

beforeEach(() => {
  useGameStore.setState({
    resources: {
      iron: 0,
      water: 0,
      ice: 0,
      sand: 0,
    },
  })
})

describe('ClickMiningSystem', () => {
  let system

  beforeEach(() => {
    system = new ClickMiningSystem()
    system.init()
  })

  afterEach(() => {
    system.cleanup()
  })

  describe('getMiningAmount()', () => {
    it('기본 채굴량은 1', () => {
      expect(system.getMiningAmount()).toBe(1)
    })

    it('baseMiningAmount 변경 시 반영됨', () => {
      system.baseMiningAmount = 5
      expect(system.getMiningAmount()).toBe(5)
    })
  })

  describe('getResourceId()', () => {
    it('타일에 resource 필드가 있으면 사용', () => {
      const tile = { type: 'rock', resource: 'iron' }
      expect(system.getResourceId(tile)).toBe('iron')
    })

    it('rock 타입은 iron 매핑', () => {
      const tile = { type: 'rock', resource: null }
      expect(system.getResourceId(tile)).toBe('iron')
    })

    it('ice 타입은 ice 매핑', () => {
      const tile = { type: 'ice', resource: null }
      expect(system.getResourceId(tile)).toBe('ice')
    })

    it('ground 타입은 iron 매핑 (임시)', () => {
      const tile = { type: 'ground', resource: null }
      expect(system.getResourceId(tile)).toBe('iron')
    })

    it('sand 타입은 sand 매핑', () => {
      const tile = { type: 'sand', resource: null }
      expect(system.getResourceId(tile)).toBe('sand')
    })

    it('알 수 없는 타입은 defaultResource 반환', () => {
      const tile = { type: 'unknown', resource: null }
      expect(system.getResourceId(tile)).toBe(system.defaultResource)
    })
  })

  describe('canMine()', () => {
    it('resource가 있는 타일은 채굴 가능', () => {
      const tile = { type: 'rock', resource: 'iron' }
      expect(system.canMine(tile)).toBe(true)
    })

    it('ground 타입은 채굴 가능', () => {
      const tile = { type: 'ground', resource: null }
      expect(system.canMine(tile)).toBe(true)
    })

    it('rock 타입은 채굴 가능', () => {
      const tile = { type: 'rock', resource: null }
      expect(system.canMine(tile)).toBe(true)
    })

    it('ice 타입은 채굴 가능', () => {
      const tile = { type: 'ice', resource: null }
      expect(system.canMine(tile)).toBe(true)
    })

    it('다른 타입은 채굴 불가', () => {
      const tile = { type: 'empty', resource: null }
      expect(system.canMine(tile)).toBe(false)
    })
  })

  describe('mine()', () => {
    it('채굴 시 자원이 추가되어야 함', () => {
      const tile = { type: 'rock', resource: 'iron' }
      system.mine(tile, 10, 10)

      expect(resourceSystem.get('iron')).toBe(1) // baseMiningAmount = 1
    })

    it('채굴 성공 시 mined 이벤트 발생', () => {
      const tile = { type: 'rock', resource: 'iron' }
      const callback = vi.fn()
      system.on('mined', callback)

      system.mine(tile, 10, 10)

      expect(callback).toHaveBeenCalledWith({
        resourceId: 'iron',
        amount: 1,
        tileX: 10,
        tileY: 10,
      })
    })

    it('자원 용량 초과 시 실제 추가된 양만 이벤트', () => {
      // energy maxValue = 100
      resourceSystem.add('energy', 100)
      const tile = { type: 'rock', resource: 'energy' }
      const callback = vi.fn()
      system.on('mined', callback)

      system.mine(tile, 10, 10)

      expect(callback).not.toHaveBeenCalled() // actualAdded = 0
    })
  })

  describe('handleClick()', () => {
    it('맵 밖 클릭은 무시해야 함', async () => {
      const { getTile } = await import('../../core/tilemap.js')
      getTile.mockReturnValueOnce(null)

      system.handleClick(1000, 1000) // 맵 밖

      expect(resourceSystem.get('iron')).toBe(0) // 채굴 안됨
    })

    it('채굴 불가 타일은 무시해야 함', async () => {
      const { getTile } = await import('../../core/tilemap.js')
      getTile.mockReturnValueOnce({
        type: 'empty',
        resource: null,
      })

      system.handleClick(100, 100)

      expect(resourceSystem.get('iron')).toBe(0)
    })
  })

  describe('이벤트 시스템', () => {
    it('on()으로 리스너 등록 가능', () => {
      const callback = vi.fn()
      const unsubscribe = system.on('mined', callback)

      expect(typeof unsubscribe).toBe('function')
    })

    it('해제 함수로 리스너 제거 가능', () => {
      const callback = vi.fn()
      const unsubscribe = system.on('mined', callback)

      unsubscribe()

      const tile = { type: 'rock', resource: 'iron' }
      system.mine(tile, 10, 10)

      expect(callback).not.toHaveBeenCalled()
    })

    it('emit() 에러 발생 시 다른 리스너는 계속 실행', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Test error')
      })
      const normalCallback = vi.fn()

      system.on('mined', errorCallback)
      system.on('mined', normalCallback)

      const tile = { type: 'rock', resource: 'iron' }
      system.mine(tile, 10, 10)

      expect(errorCallback).toHaveBeenCalled()
      expect(normalCallback).toHaveBeenCalled()
    })
  })

  describe('디버깅 함수', () => {
    it('setBaseMiningAmount()로 채굴량 변경', () => {
      system.setBaseMiningAmount(10)
      expect(system.baseMiningAmount).toBe(10)
    })

    it('음수 채굴량은 1로 제한', () => {
      system.setBaseMiningAmount(-5)
      expect(system.baseMiningAmount).toBe(1)
    })

    it('increaseMiningAmount()로 채굴량 증가', () => {
      system.baseMiningAmount = 5
      system.increaseMiningAmount(3)
      expect(system.baseMiningAmount).toBe(8)
    })
  })

  describe('cleanup()', () => {
    it('입력 이벤트 해제해야 함', () => {
      system.unsubscribeInput = vi.fn()
      system.cleanup()
      expect(system.unsubscribeInput).toHaveBeenCalled()
    })

    it('모든 리스너 제거해야 함', () => {
      system.on('mined', vi.fn())
      system.cleanup()
      expect(Object.keys(system.listeners)).toHaveLength(0)
    })
  })

  describe('update()', () => {
    it('매 프레임 호출되어도 에러 없어야 함 (이벤트 기반)', () => {
      expect(() => system.update([], 1 / 60)).not.toThrow()
    })
  })

  describe('편의 함수', () => {
    it('onMined() 단축 함수', async () => {
      const { onMined } = await import('../clickMining.js')
      const callback = vi.fn()
      const unsubscribe = onMined(callback)
      expect(typeof unsubscribe).toBe('function')
    })

    it('setBaseMiningAmount() 단축 함수', async () => {
      const { setBaseMiningAmount, clickMiningSystem } = await import('../clickMining.js')
      setBaseMiningAmount(5)
      expect(clickMiningSystem.baseMiningAmount).toBe(5)
    })

    it('increaseMiningAmount() 단축 함수', async () => {
      const { increaseMiningAmount, clickMiningSystem } = await import('../clickMining.js')
      clickMiningSystem.baseMiningAmount = 10
      increaseMiningAmount(5)
      expect(clickMiningSystem.baseMiningAmount).toBe(15)
    })
  })
})
