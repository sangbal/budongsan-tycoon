/**
 * KIMCHI INVASION - FarmingSystem Tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { FarmingSystem } from '../farmingSystem.js'
import { buildingSystem } from '../buildingSystem.js'
import { resourceSystem } from '../resourceSystem.js'
import { useGameStore } from '../../state/stores/gameStore.js'

beforeEach(() => {
  useGameStore.setState({
    resources: {
      water: 1000,
      energy: 1000,
      cabbage: 0,
      chilliPowder: 0,
      garlic: 0,
    },
    buildings: [],
  })
})

describe('FarmingSystem', () => {
  let system

  beforeEach(() => {
    system = new FarmingSystem()
    system.init()
  })

  describe('cropGrowthTimes', () => {
    it('배추는 30초 성장', () => {
      expect(system.cropGrowthTimes.cabbage).toBe(30)
    })

    it('고추는 45초 성장', () => {
      expect(system.cropGrowthTimes.chilliPowder).toBe(45)
    })

    it('마늘은 60초 성장', () => {
      expect(system.cropGrowthTimes.garlic).toBe(60)
    })
  })

  describe('processFarming()', () => {
    let greenhouse

    beforeEach(() => {
      // Mock 온실 건물
      greenhouse = {
        id: 'greenhouse_1',
        type: 'greenhouse',
        x: 10,
        y: 10,
        level: 1,
        cropType: 'cabbage',
        progress: 0,
      }
    })

    it('물과 에너지를 소비해야 함', () => {
      const waterBefore = resourceSystem.get('water')
      const energyBefore = resourceSystem.get('energy')

      system.processFarming(greenhouse, 1) // 1초

      expect(resourceSystem.get('water')).toBeLessThan(waterBefore)
      expect(resourceSystem.get('energy')).toBeLessThan(energyBefore)
    })

    it('물 부족 시 생산 중단', () => {
      resourceSystem.consume('water', 1000) // 물 모두 소비

      system.processFarming(greenhouse, 1)

      expect(greenhouse.progress).toBe(0) // 진행 안됨
    })

    it('에너지 부족 시 생산 중단 (물은 손실)', () => {
      resourceSystem.consume('energy', 1000) // 에너지 모두 소비
      const waterBefore = resourceSystem.get('water')

      system.processFarming(greenhouse, 1)

      expect(greenhouse.progress).toBe(0) // 진행 안됨
      expect(resourceSystem.get('water')).toBeLessThan(waterBefore) // 물만 소비됨 (손실)
    })

    it('progress가 없으면 0으로 초기화', () => {
      delete greenhouse.progress

      system.processFarming(greenhouse, 1)

      expect(greenhouse.progress).toBeGreaterThanOrEqual(0)
    })

    it('진행률이 증가해야 함', () => {
      system.processFarming(greenhouse, 1) // 1초 (30초 중)

      expect(greenhouse.progress).toBeCloseTo(1 / 30, 5)
    })

    it('100% 완료 시 작물 수확 및 리셋', () => {
      greenhouse.progress = 0.9 // 90% 완료
      const callback = vi.fn()
      system.on('harvested', callback)

      system.processFarming(greenhouse, 5) // 5초 추가 (총 100%+)

      expect(greenhouse.progress).toBeLessThan(1) // 리셋됨
      expect(resourceSystem.get('cabbage')).toBeGreaterThan(0)
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          buildingId: 'greenhouse_1',
          crop: 'cabbage',
        })
      )
    })

    it('cropType에 따라 성장 시간이 달라야 함', () => {
      greenhouse.cropType = 'garlic' // 60초

      system.processFarming(greenhouse, 1)

      expect(greenhouse.progress).toBeCloseTo(1 / 60, 5)
    })

    it('cropType이 없으면 기본 배추', () => {
      delete greenhouse.cropType

      system.processFarming(greenhouse, 30) // 30초

      expect(resourceSystem.get('cabbage')).toBeGreaterThan(0)
    })
  })

  describe('setCropType()', () => {
    let greenhouse

    beforeEach(() => {
      greenhouse = {
        id: 'greenhouse_1',
        type: 'greenhouse',
        x: 10,
        y: 10,
        level: 1,
        cropType: 'cabbage',
        progress: 0.5, // 50% 진행
      }
      buildingSystem.buildingMap.set('greenhouse_1', greenhouse)
    })

    afterEach(() => {
      buildingSystem.buildingMap.clear()
    })

    it('작물 변경 시 진행률 리셋', () => {
      const success = system.setCropType('greenhouse_1', 'garlic')

      expect(success).toBe(true)
      expect(greenhouse.cropType).toBe('garlic')
      expect(greenhouse.progress).toBe(0)
    })

    it('cropChanged 이벤트 발생', () => {
      const callback = vi.fn()
      system.on('cropChanged', callback)

      system.setCropType('greenhouse_1', 'garlic')

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          buildingId: 'greenhouse_1',
          cropType: 'garlic',
        })
      )
    })

    it('잘못된 건물 ID는 false 반환', () => {
      const success = system.setCropType('invalid_id', 'garlic')
      expect(success).toBe(false)
    })

    it('온실이 아닌 건물은 false 반환', () => {
      const otherBuilding = {
        id: 'furnace_1',
        type: 'furnace',
      }
      buildingSystem.buildingMap.set('furnace_1', otherBuilding)

      const success = system.setCropType('furnace_1', 'garlic')
      expect(success).toBe(false)
    })

    it('알 수 없는 작물 타입은 false 반환', () => {
      const success = system.setCropType('greenhouse_1', 'unknownCrop')
      expect(success).toBe(false)
    })
  })

  describe('update()', () => {
    it('온실이 없으면 에러 없이 동작', () => {
      expect(() => system.update([], 1)).not.toThrow()
    })

    it('온실이 있으면 processFarming() 호출', () => {
      const greenhouse = {
        id: 'greenhouse_1',
        type: 'greenhouse',
        x: 10,
        y: 10,
        level: 1,
        cropType: 'cabbage',
        progress: 0,
      }
      buildingSystem.buildingMap.set('greenhouse_1', greenhouse)

      const spy = vi.spyOn(system, 'processFarming')
      system.update([], 1)

      expect(spy).toHaveBeenCalledWith(greenhouse, 1)
      spy.mockRestore()
    })
  })

  describe('이벤트 시스템', () => {
    it('on()으로 리스너 등록', () => {
      const callback = vi.fn()
      system.on('harvested', callback)
      expect(system.eventBus.addEventListener).toBeTruthy()
    })

    it('off()로 리스너 제거', () => {
      const callback = vi.fn()
      system.on('harvested', callback)
      system.off('harvested', callback)
      expect(system.eventBus.removeEventListener).toBeTruthy()
    })

    it('emit()으로 이벤트 발생', () => {
      const callback = vi.fn()
      system.on('harvested', callback)

      system.emit('harvested', { crop: 'cabbage' })

      expect(callback).toHaveBeenCalledWith({ crop: 'cabbage' })
    })
  })

  describe('debugPrintAll()', () => {
    it('온실 상태를 출력해야 함', () => {
      const greenhouse = {
        id: 'greenhouse_1',
        type: 'greenhouse',
        x: 10,
        y: 10,
        level: 2,
        cropType: 'garlic',
        progress: 0.75,
      }
      buildingSystem.buildingMap.set('greenhouse_1', greenhouse)

      expect(() => system.debugPrintAll()).not.toThrow()

      buildingSystem.buildingMap.clear()
    })

    it('온실이 없어도 에러 없이 동작', () => {
      expect(() => system.debugPrintAll()).not.toThrow()
    })
  })

  describe('건물 정의 누락 시', () => {
    it('BUILDINGS.greenhouse가 없으면 경고 로그', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // Mock BUILDINGS
      vi.doMock('../../data/buildings.js', () => ({
        BUILDINGS: {}, // greenhouse 없음
      }))

      const greenhouse = {
        id: 'greenhouse_1',
        type: 'greenhouse',
        progress: 0,
      }

      system.processFarming(greenhouse, 1)

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})
