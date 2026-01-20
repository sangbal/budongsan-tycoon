/**
 * KIMCHI INVASION - ConveyorSystem 단위 테스트
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ConveyorSystem, conveyorSystem } from '../conveyorSystem.js'
import { resourceSystem } from '../resourceSystem.js'
import { useGameStore } from '../../state/stores/gameStore.js'

describe('ConveyorSystem', () => {
  let system

  beforeEach(() => {
    // gameStore 초기화
    useGameStore.getState().reset()

    // ResourceSystem 초기화
    resourceSystem.init()

    // 새 시스템 인스턴스 생성
    system = new ConveyorSystem()
    system.init()

    // 자원 초기화 (reset 후에)
    useGameStore.getState().modifyResource('dollars', 1000)
    useGameStore.getState().modifyResource('iron', 100)
  })

  describe('초기화', () => {
    it('시스템이 올바르게 초기화되어야 함', () => {
      expect(system.systemName).toBe('ConveyorSystem')
      expect(system.priority).toBe(30)
      expect(system.conveyorMap.size).toBe(0)
      expect(system.locationMap.size).toBe(0)
    })

    it('전역 변수에 등록되어야 함', () => {
      expect(window.conveyorSystem).toBe(system)
    })
  })

  describe('컨베이어 배치', () => {
    it('컨베이어를 배치할 수 있어야 함', () => {
      const conveyor = system.place(5, 5, 'right')

      expect(conveyor).not.toBeNull()
      expect(conveyor.x).toBe(5)
      expect(conveyor.y).toBe(5)
      expect(conveyor.direction).toBe('right')
      expect(conveyor.level).toBe(1)
      expect(conveyor.items).toEqual([])
    })

    it('배치 시 자원을 소비해야 함', () => {
      const initialDollars = resourceSystem.get('dollars')
      const initialIron = resourceSystem.get('iron')

      system.place(5, 5, 'right')

      expect(resourceSystem.get('dollars')).toBe(initialDollars - 10)
      expect(resourceSystem.get('iron')).toBe(initialIron - 2)
    })

    it('자원이 부족하면 배치 실패해야 함', () => {
      // 모든 자원 소비 (0으로 만들기)
      const currentDollars = resourceSystem.get('dollars')
      const currentIron = resourceSystem.get('iron')
      resourceSystem.consume('dollars', currentDollars)
      resourceSystem.consume('iron', currentIron)

      // 비용보다 적게 추가 (dollars 10, iron 2 필요)
      resourceSystem.add('dollars', 5) // 5 달러만 (10 필요)

      const conveyor = system.place(5, 5, 'right')

      expect(conveyor).toBeNull()
    })

    it('이미 컨베이어가 있는 위치에 배치 실패해야 함', () => {
      system.place(5, 5, 'right')
      const duplicate = system.place(5, 5, 'left')

      expect(duplicate).toBeNull()
    })

    it('배치 시 이벤트를 발생시켜야 함', () => {
      const listener = vi.fn()
      system.on('conveyorPlaced', listener)

      const conveyor = system.place(5, 5, 'up')

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          conveyor,
          x: 5,
          y: 5,
          direction: 'up',
        })
      )
    })
  })

  describe('컨베이어 제거', () => {
    it('컨베이어를 제거할 수 있어야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      const result = system.remove(conveyor.id)

      expect(result).toBe(true)
      expect(system.conveyorMap.has(conveyor.id)).toBe(false)
    })

    it('제거 시 50% 자원을 환불해야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      const dollarsBeforeRemove = resourceSystem.get('dollars')

      system.remove(conveyor.id)

      // 건설 비용 10달러 → 환불 5달러
      expect(resourceSystem.get('dollars')).toBe(dollarsBeforeRemove + 5)
    })

    it('존재하지 않는 컨베이어 제거 시 실패해야 함', () => {
      const result = system.remove('non_existent_id')

      expect(result).toBe(false)
    })

    it('컨베이어 위 아이템을 자원으로 반환해야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      system.addItemToConveyor(conveyor.id, 'iron', 10)

      const ironBefore = resourceSystem.get('iron')
      system.remove(conveyor.id)

      // 아이템이 반환되었는지 확인 (최소 10 이상 증가)
      expect(resourceSystem.get('iron')).toBeGreaterThanOrEqual(ironBefore + 10)
    })

    it('제거 시 이벤트를 발생시켜야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      const listener = vi.fn()
      system.on('conveyorRemoved', listener)

      system.remove(conveyor.id)

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          conveyorId: conveyor.id,
        })
      )
    })
  })

  describe('아이템 추가', () => {
    it('컨베이어에 아이템을 추가할 수 있어야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      const result = system.addItemToConveyor(conveyor.id, 'iron', 5, 'building_123')

      expect(result).toBe(true)
      expect(conveyor.items.length).toBe(1)
      expect(conveyor.items[0].resourceId).toBe('iron')
      expect(conveyor.items[0].amount).toBe(5)
      expect(conveyor.items[0].fromBuildingId).toBe('building_123')
      expect(conveyor.items[0].progress).toBe(0.0)
    })

    it('아이템 추가 시 이벤트를 발생시켜야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      const listener = vi.fn()
      system.on('itemPickedUp', listener)

      system.addItemToConveyor(conveyor.id, 'iron', 5)

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceId: 'iron',
          amount: 5,
          conveyorId: conveyor.id,
        })
      )
    })

    it('용량 초과 시 아이템 추가 실패해야 함', () => {
      const conveyor = system.place(5, 5, 'right')

      // 최대 용량(5)까지 채우기
      for (let i = 0; i < 5; i++) {
        system.addItemToConveyor(conveyor.id, 'iron', 1)
      }

      // 6번째 아이템 추가 시 실패
      const result = system.addItemToConveyor(conveyor.id, 'iron', 1)
      expect(result).toBe(false)
    })

    it('존재하지 않는 컨베이어에 아이템 추가 실패해야 함', () => {
      const result = system.addItemToConveyor('non_existent_id', 'iron', 5)
      expect(result).toBe(false)
    })
  })

  describe('아이템 이동', () => {
    it('아이템이 시간에 따라 이동해야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      system.addItemToConveyor(conveyor.id, 'iron', 5)

      const item = conveyor.items[0]
      const initialProgress = item.progress

      // 0.5초 업데이트 (속도 1.0이므로 0.5 진행)
      system.update([], 0.5)

      expect(item.progress).toBeGreaterThan(initialProgress)
      expect(item.progress).toBe(0.5)
    })

    it('레벨에 따라 이동 속도가 증가해야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      conveyor.level = 3 // 레벨 3 → 속도 +40%
      system.addItemToConveyor(conveyor.id, 'iron', 5)

      const item = conveyor.items[0]

      // 0.5초 업데이트 (속도 1.4배 → 0.7 진행)
      system.update([], 0.5)

      expect(item.progress).toBe(0.5 * 1.4)
    })

    it('아이템이 도착지에 도달하면 자원으로 추가되어야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      system.addItemToConveyor(conveyor.id, 'iron', 10)

      const ironBefore = resourceSystem.get('iron')

      // 1초 업데이트 (진행률 100% 도달)
      system.update([], 1.0)

      expect(resourceSystem.get('iron')).toBe(ironBefore + 10)
      expect(conveyor.items.length).toBe(0)
    })

    it('도착 시 이벤트를 발생시켜야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      system.addItemToConveyor(conveyor.id, 'iron', 5)

      const listener = vi.fn()
      system.on('itemDelivered', listener)

      // 1초 업데이트 (진행률 100% 도달)
      system.update([], 1.0)

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceId: 'iron',
          amount: 5,
        })
      )
    })
  })

  describe('컨베이어 업그레이드', () => {
    it('컨베이어를 업그레이드할 수 있어야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      const result = system.upgrade(conveyor.id)

      expect(result).toBe(true)
      expect(conveyor.level).toBe(2)
    })

    it('업그레이드 비용이 증가해야 함', () => {
      const conveyor = system.place(5, 5, 'right')

      // 첫 업그레이드 비용: 10 * 1.5 = 15 달러
      const dollarsBefore = resourceSystem.get('dollars')
      system.upgrade(conveyor.id)
      expect(resourceSystem.get('dollars')).toBe(dollarsBefore - 15)

      // 두 번째 업그레이드 비용: 10 * 1.5^2 = 22.5 → 23 달러
      const dollarsAfterFirst = resourceSystem.get('dollars')
      system.upgrade(conveyor.id)
      expect(resourceSystem.get('dollars')).toBe(dollarsAfterFirst - 23)
    })

    it('최대 레벨 도달 시 업그레이드 실패해야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      conveyor.level = 3 // 최대 레벨

      const result = system.upgrade(conveyor.id)

      expect(result).toBe(false)
      expect(conveyor.level).toBe(3)
    })

    it('자원이 부족하면 업그레이드 실패해야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      resourceSystem.consume('dollars', resourceSystem.get('dollars') - 5) // 5 달러만 남김

      const result = system.upgrade(conveyor.id)

      expect(result).toBe(false)
      expect(conveyor.level).toBe(1)
    })
  })

  describe('방향 변경', () => {
    it('컨베이어 방향을 변경할 수 있어야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      const result = system.changeDirection(conveyor.id, 'up')

      expect(result).toBe(true)
      expect(conveyor.direction).toBe('up')
    })

    it('잘못된 방향 입력 시 실패해야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      const result = system.changeDirection(conveyor.id, 'invalid')

      expect(result).toBe(false)
      expect(conveyor.direction).toBe('right')
    })

    it('존재하지 않는 컨베이어 방향 변경 시 실패해야 함', () => {
      const result = system.changeDirection('non_existent_id', 'up')
      expect(result).toBe(false)
    })
  })

  describe('위치 조회', () => {
    it('특정 위치의 컨베이어를 조회할 수 있어야 함', () => {
      const conveyor = system.place(5, 5, 'right')
      const found = system.getConveyorAt(5, 5)

      expect(found).not.toBeNull()
      expect(found.id).toBe(conveyor.id)
    })

    it('컨베이어가 없는 위치 조회 시 null 반환해야 함', () => {
      const found = system.getConveyorAt(10, 10)
      expect(found).toBeNull()
    })
  })

  describe('다음 위치 계산', () => {
    it('right 방향의 다음 위치를 계산해야 함', () => {
      const next = system.getNextPosition(5, 5, 'right')
      expect(next).toEqual({ x: 6, y: 5 })
    })

    it('left 방향의 다음 위치를 계산해야 함', () => {
      const next = system.getNextPosition(5, 5, 'left')
      expect(next).toEqual({ x: 4, y: 5 })
    })

    it('up 방향의 다음 위치를 계산해야 함', () => {
      const next = system.getNextPosition(5, 5, 'up')
      expect(next).toEqual({ x: 5, y: 4 })
    })

    it('down 방향의 다음 위치를 계산해야 함', () => {
      const next = system.getNextPosition(5, 5, 'down')
      expect(next).toEqual({ x: 5, y: 6 })
    })

    it('잘못된 방향 입력 시 null 반환해야 함', () => {
      const next = system.getNextPosition(5, 5, 'invalid')
      expect(next).toBeNull()
    })
  })

  describe('전역 싱글톤', () => {
    it('conveyorSystem 싱글톤이 존재해야 함', () => {
      expect(conveyorSystem).toBeInstanceOf(ConveyorSystem)
    })

    it('싱글톤이 시스템 이름을 가져야 함', () => {
      expect(conveyorSystem.systemName).toBe('ConveyorSystem')
    })
  })
})
