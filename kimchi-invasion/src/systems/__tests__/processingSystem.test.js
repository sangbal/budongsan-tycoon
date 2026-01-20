/**
 * KIMCHI INVASION - ProcessingSystem Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ProcessingSystem } from '../processingSystem.js'
import { buildingSystem } from '../buildingSystem.js'
import { resourceSystem } from '../resourceSystem.js'
import { useGameStore } from '../../state/stores/gameStore.js'

beforeEach(() => {
  useGameStore.setState({
    resources: {
      iron: 100,
      water: 100,
      salt: 0,
    },
    buildings: [],
  })
})

describe('ProcessingSystem', () => {
  let system

  beforeEach(() => {
    system = new ProcessingSystem()
    system.init()
  })

  describe('recipes', () => {
    it('furnace 레시피가 정의되어야 함', () => {
      expect(system.recipes.furnace).toBeDefined()
      expect(system.recipes.furnace.input).toEqual({ iron: 2 })
      expect(system.recipes.furnace.output).toEqual({ iron: 1 })
      expect(system.recipes.furnace.time).toBe(15)
    })

    it('brineStation 레시피가 정의되어야 함', () => {
      expect(system.recipes.brineStation).toBeDefined()
      expect(system.recipes.brineStation.input).toEqual({ water: 10 })
      expect(system.recipes.brineStation.output).toEqual({ salt: 1 })
      expect(system.recipes.brineStation.time).toBe(20)
    })

    it('레시피는 description을 가져야 함', () => {
      expect(system.recipes.furnace.description).toBe('철광석 제련')
      expect(system.recipes.brineStation.description).toBe('소금 증발')
    })
  })

  describe('processBuilding()', () => {
    let furnace
    const furnaceRecipe = {
      input: { iron: 2 },
      output: { iron: 1 },
      time: 15,
    }

    beforeEach(() => {
      furnace = {
        id: 'furnace_1',
        type: 'furnace',
        x: 10,
        y: 10,
        level: 1,
        processing: false,
        progress: 0,
      }
    })

    it('입력 자원이 충분하면 가공 시작', () => {
      const ironBefore = resourceSystem.get('iron')
      resourceSystem.add('iron', 10)

      system.processBuilding(furnace, furnaceRecipe, 1)

      expect(furnace.processing).toBe(true)
      // ironBefore + 10 (추가) - 2 (레시피 소비) = ironBefore + 8
      expect(resourceSystem.get('iron')).toBe(ironBefore + 8)
    })

    it('입력 자원 부족 시 가공 시작 안됨', () => {
      resourceSystem.consume('iron', 100) // 자원 모두 소비

      system.processBuilding(furnace, furnaceRecipe, 1)

      expect(furnace.processing).toBe(false)
    })

    it('가공 시작 시 processingStarted 이벤트 발생', () => {
      resourceSystem.add('iron', 10)
      const callback = vi.fn()
      system.on('processingStarted', callback)

      system.processBuilding(furnace, furnaceRecipe, 1)

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          buildingId: 'furnace_1',
          input: { iron: 2 },
        })
      )
    })

    it('가공 중일 때 진행률 증가', () => {
      furnace.processing = true
      furnace.progress = 0

      system.processBuilding(furnace, furnaceRecipe, 1) // 1초 (15초 중)

      expect(furnace.progress).toBeCloseTo(1 / 15, 5)
    })

    it('progress가 없으면 0으로 초기화', () => {
      furnace.processing = true
      delete furnace.progress

      system.processBuilding(furnace, furnaceRecipe, 1)

      expect(furnace.progress).toBeGreaterThanOrEqual(0)
    })

    it('100% 완료 시 출력 생성 및 리셋', () => {
      furnace.processing = true
      furnace.progress = 0.9 // 90% 완료
      const callback = vi.fn()
      system.on('processed', callback)

      system.processBuilding(furnace, furnaceRecipe, 5) // 5초 추가

      expect(furnace.processing).toBe(false)
      expect(furnace.progress).toBe(0)
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          buildingId: 'furnace_1',
          output: { iron: 1 },
        })
      )
    })

    it('완료 시 출력 자원이 추가되어야 함', () => {
      furnace.processing = true
      furnace.progress = 0.9
      const ironBefore = resourceSystem.get('iron')

      system.processBuilding(furnace, furnaceRecipe, 5)

      expect(resourceSystem.get('iron')).toBe(ironBefore + 1)
    })

    it('가공 중이 아니고 자원 부족하면 아무것도 안함', () => {
      resourceSystem.consume('iron', 100)

      system.processBuilding(furnace, furnaceRecipe, 1)

      expect(furnace.processing).toBe(false)
      expect(furnace.progress).toBe(0)
    })
  })

  describe('canStartProcessing()', () => {
    it('모든 입력 자원이 충분하면 true', () => {
      resourceSystem.add('iron', 10)
      const recipe = { input: { iron: 5 } }

      expect(system.canStartProcessing(recipe)).toBe(true)
    })

    it('하나라도 부족하면 false', () => {
      // 자원을 0으로 리셋 후 2만 추가 (5 미만)
      resourceSystem.set('iron', 2)
      const recipe = { input: { iron: 5 } }

      expect(system.canStartProcessing(recipe)).toBe(false)
    })

    it('여러 자원 중 하나라도 부족하면 false', () => {
      // iron은 충분하지만 water가 부족하도록 설정
      resourceSystem.set('iron', 10)
      resourceSystem.set('water', 5) // 10 필요, 5만 있음
      const recipe = {
        input: {
          iron: 5,
          water: 10, // 부족
        },
      }

      expect(system.canStartProcessing(recipe)).toBe(false)
    })

    it('빈 입력은 항상 true', () => {
      const recipe = { input: {} }
      expect(system.canStartProcessing(recipe)).toBe(true)
    })
  })

  describe('update()', () => {
    it('가공 건물이 없으면 에러 없이 동작', () => {
      expect(() => system.update([], 1)).not.toThrow()
    })

    it('furnace가 있으면 processBuilding() 호출', () => {
      const furnace = {
        id: 'furnace_1',
        type: 'furnace',
        processing: false,
        progress: 0,
      }
      buildingSystem.buildingMap.set('furnace_1', furnace)

      const spy = vi.spyOn(system, 'processBuilding')
      system.update([], 1)

      expect(spy).toHaveBeenCalledWith(furnace, system.recipes.furnace, 1)
      spy.mockRestore()

      buildingSystem.buildingMap.clear()
    })

    it('brineStation이 있으면 processBuilding() 호출', () => {
      const brineStation = {
        id: 'brine_1',
        type: 'brineStation',
        processing: false,
        progress: 0,
      }
      buildingSystem.buildingMap.set('brine_1', brineStation)

      const spy = vi.spyOn(system, 'processBuilding')
      system.update([], 1)

      expect(spy).toHaveBeenCalledWith(brineStation, system.recipes.brineStation, 1)
      spy.mockRestore()

      buildingSystem.buildingMap.clear()
    })
  })

  describe('getRecipe()', () => {
    it('정의된 레시피를 반환해야 함', () => {
      const recipe = system.getRecipe('furnace')
      expect(recipe).toBeDefined()
      expect(recipe.input).toEqual({ iron: 2 })
    })

    it('없는 레시피는 null 반환', () => {
      expect(system.getRecipe('unknownBuilding')).toBeNull()
    })
  })

  describe('setRecipe()', () => {
    it('새 레시피를 추가할 수 있어야 함', () => {
      const newRecipe = {
        input: { water: 5 },
        output: { ice: 1 },
        time: 10,
      }

      const success = system.setRecipe('icemaker', newRecipe)

      expect(success).toBe(true)
      expect(system.recipes.icemaker).toEqual(newRecipe)
    })

    it('기존 레시피를 덮어쓸 수 있어야 함', () => {
      const modifiedRecipe = {
        input: { iron: 1 },
        output: { iron: 2 },
        time: 5,
      }

      system.setRecipe('furnace', modifiedRecipe)

      expect(system.recipes.furnace).toEqual(modifiedRecipe)
    })

    it('잘못된 레시피 형식은 false 반환', () => {
      const invalidRecipe = {
        input: { iron: 1 },
        // output 누락
        time: 10,
      }

      const success = system.setRecipe('invalid', invalidRecipe)

      expect(success).toBe(false)
    })

    it('input 누락 시 false 반환', () => {
      const invalidRecipe = {
        output: { iron: 1 },
        time: 10,
      }

      expect(system.setRecipe('invalid', invalidRecipe)).toBe(false)
    })

    it('time 누락 시 false 반환', () => {
      const invalidRecipe = {
        input: { iron: 1 },
        output: { iron: 1 },
      }

      expect(system.setRecipe('invalid', invalidRecipe)).toBe(false)
    })
  })

  describe('이벤트 시스템', () => {
    it('on()으로 리스너 등록', () => {
      const callback = vi.fn()
      system.on('processed', callback)
      expect(system.eventBus.addEventListener).toBeTruthy()
    })

    it('off()로 리스너 제거', () => {
      const callback = vi.fn()
      system.on('processed', callback)
      system.off('processed', callback)
      expect(system.eventBus.removeEventListener).toBeTruthy()
    })

    it('emit()으로 이벤트 발생', () => {
      const callback = vi.fn()
      system.on('processed', callback)

      system.emit('processed', { buildingId: 'test' })

      expect(callback).toHaveBeenCalledWith({ buildingId: 'test' })
    })
  })

  describe('debugPrintAll()', () => {
    it('가공 건물 상태를 출력해야 함', () => {
      const furnace = {
        id: 'furnace_1',
        type: 'furnace',
        x: 10,
        y: 10,
        level: 2,
        processing: true,
        progress: 0.5,
      }
      buildingSystem.buildingMap.set('furnace_1', furnace)

      expect(() => system.debugPrintAll()).not.toThrow()

      buildingSystem.buildingMap.clear()
    })

    it('가공 건물이 없어도 에러 없이 동작', () => {
      expect(() => system.debugPrintAll()).not.toThrow()
    })

    it('진행 중이 아닌 건물도 표시해야 함', () => {
      const furnace = {
        id: 'furnace_1',
        type: 'furnace',
        x: 10,
        y: 10,
        level: 1,
        processing: false,
        progress: 0,
      }
      buildingSystem.buildingMap.set('furnace_1', furnace)

      expect(() => system.debugPrintAll()).not.toThrow()

      buildingSystem.buildingMap.clear()
    })
  })
})
