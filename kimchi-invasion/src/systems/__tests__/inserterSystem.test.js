/**
 * KIMCHI INVASION - Inserter System Tests
 *
 * @description 투입기 시스템 단위 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InserterSystem } from '../inserterSystem.js'
import { useGameStore } from '../../state/stores/gameStore.js'
import { resourceSystem } from '../resourceSystem.js'

describe('InserterSystem', () => {
  let system

  beforeEach(() => {
    // 상태 초기화
    useGameStore.getState().reset()

    // resourceSystem 초기화
    resourceSystem.init()

    // 테스트용 자원 설정 (resourceSystem 사용)
    resourceSystem.set('dollars', 1000)
    resourceSystem.set('iron', 1000)
    resourceSystem.set('energy', 1000)

    // 시스템 초기화
    system = new InserterSystem()
    system.init()
  })

  describe('place', () => {
    it('투입기를 배치할 수 있다', () => {
      const inserter = system.place(5, 5, 'right')

      expect(inserter).toBeTruthy()
      expect(inserter.x).toBe(5)
      expect(inserter.y).toBe(5)
      expect(inserter.direction).toBe('right')
      expect(inserter.level).toBe(1)
      expect(inserter.heldItem).toBeNull()
    })

    it('같은 위치에 중복 배치할 수 없다', () => {
      system.place(5, 5, 'right')
      const duplicate = system.place(5, 5, 'left')

      expect(duplicate).toBeNull()
    })

    it('건물이 있는 위치에 배치할 수 없다', () => {
      // 건물 배치
      useGameStore.getState().addBuilding({
        id: 'building1',
        type: 'extractor',
        x: 5,
        y: 5,
        level: 1,
        inventory: {},
        progress: 0,
      })

      const inserter = system.place(5, 5, 'right')

      expect(inserter).toBeNull()
    })

    it('자원이 부족하면 배치할 수 없다', () => {
      useGameStore.getState().modifyResources({
        dollars: -1000,
        iron: -1000,
      })

      const inserter = system.place(5, 5, 'right')

      expect(inserter).toBeNull()
    })

    it('배치 시 Zustand 상태에 추가된다', () => {
      const inserter = system.place(5, 5, 'right')

      const state = useGameStore.getState()
      expect(state.inserters.length).toBe(1)
      expect(state.inserters[0].id).toBe(inserter.id)
    })
  })

  describe('remove', () => {
    it('투입기를 제거할 수 있다', () => {
      const inserter = system.place(5, 5, 'right')
      const removed = system.remove(inserter.id)

      expect(removed).toBe(true)
      expect(system.getInserter(inserter.id)).toBeUndefined()
    })

    it('제거 시 50% 환불된다', () => {
      const beforeDollars = useGameStore.getState().resources.dollars
      const beforeIron = useGameStore.getState().resources.iron

      const inserter = system.place(5, 5, 'right')
      system.remove(inserter.id)

      const afterDollars = useGameStore.getState().resources.dollars
      const afterIron = useGameStore.getState().resources.iron

      // 50 달러, 5 철광석 비용 → 25 달러, 2.5 → 2 철광석 환불
      expect(afterDollars).toBe(beforeDollars - 50 + 25)
      expect(afterIron).toBe(beforeIron - 5 + 2)
    })

    it('들고 있던 아이템이 자원으로 반환된다', () => {
      const inserter = system.place(5, 5, 'right')
      inserter.heldItem = { resourceId: 'iron', amount: 5 }

      const beforeIron = useGameStore.getState().resources.iron
      system.remove(inserter.id)
      const afterIron = useGameStore.getState().resources.iron

      expect(afterIron).toBe(beforeIron + 5)
    })

    it('존재하지 않는 투입기는 제거할 수 없다', () => {
      const removed = system.remove('invalid-id')

      expect(removed).toBe(false)
    })
  })

  describe('upgrade', () => {
    it('투입기를 업그레이드할 수 있다', () => {
      const inserter = system.place(5, 5, 'right')
      const upgraded = system.upgrade(inserter.id)

      expect(upgraded).toBe(true)
      expect(inserter.level).toBe(2)
    })

    it('최대 레벨(5)에서 업그레이드할 수 없다', () => {
      const inserter = system.place(5, 5, 'right')
      inserter.level = 5

      const upgraded = system.upgrade(inserter.id)

      expect(upgraded).toBe(false)
      expect(inserter.level).toBe(5)
    })

    it('자원이 부족하면 업그레이드할 수 없다', () => {
      const inserter = system.place(5, 5, 'right')

      // 자원 모두 소진
      useGameStore.getState().modifyResources({
        dollars: -10000,
        iron: -10000,
      })

      const upgraded = system.upgrade(inserter.id)

      expect(upgraded).toBe(false)
      expect(inserter.level).toBe(1)
    })
  })

  describe('changeDirection', () => {
    it('투입기 방향을 변경할 수 있다', () => {
      const inserter = system.place(5, 5, 'right')
      const changed = system.changeDirection(inserter.id, 'up')

      expect(changed).toBe(true)
      expect(inserter.direction).toBe('up')
    })

    it('유효하지 않은 방향은 설정할 수 없다', () => {
      const inserter = system.place(5, 5, 'right')
      const changed = system.changeDirection(inserter.id, 'diagonal')

      expect(changed).toBe(false)
      expect(inserter.direction).toBe('right')
    })
  })

  describe('update', () => {
    it('에너지가 부족하면 동작하지 않는다', () => {
      const inserter = system.place(5, 5, 'right')

      // 건물 배치 (출발지)
      useGameStore.getState().addBuilding({
        id: 'source',
        type: 'extractor',
        x: 4,
        y: 5, // 투입기 왼쪽
        level: 1,
        inventory: { iron: 10 },
        progress: 0,
      })

      // 에너지 소진
      useGameStore.getState().modifyResource('energy', -10000)

      system.update([], 1.0)

      // 픽업하지 않음
      expect(inserter.heldItem).toBeNull()
    })

    it('출발지에서 아이템을 픽업한다', () => {
      const inserter = system.place(5, 5, 'right')

      // 건물 배치 (출발지 = 투입기 왼쪽)
      useGameStore.getState().addBuilding({
        id: 'source',
        type: 'extractor',
        x: 4,
        y: 5,
        level: 1,
        inventory: { iron: 10 },
        progress: 0,
      })

      // 픽업 시도
      system.tryPickup(inserter)

      expect(inserter.heldItem).not.toBeNull()
      expect(inserter.heldItem.resourceId).toBe('iron')
      expect(inserter.heldItem.amount).toBe(1)
    })

    it('도착지에 아이템을 전달한다', () => {
      const inserter = system.place(5, 5, 'right')
      inserter.heldItem = { resourceId: 'iron', amount: 5 }

      // 건물 배치 (도착지 = 투입기 오른쪽)
      useGameStore.getState().addBuilding({
        id: 'target',
        type: 'warehouse',
        x: 6,
        y: 5,
        level: 1,
        inventory: {},
        progress: 0,
      })

      // 전달 시도
      system.tryDeliver(inserter)

      expect(inserter.heldItem).toBeNull()

      const target = useGameStore.getState().getBuildingAt(6, 5)
      expect(target.inventory.iron).toBe(5)
    })

    it('레벨 3부터 용량이 2개로 증가한다', () => {
      const inserter = system.place(5, 5, 'right')
      inserter.level = 3

      // 건물 배치
      useGameStore.getState().addBuilding({
        id: 'source',
        type: 'extractor',
        x: 4,
        y: 5,
        level: 1,
        inventory: { iron: 10 },
        progress: 0,
      })

      system.tryPickup(inserter)

      expect(inserter.heldItem.amount).toBe(2)
    })
  })

  describe('이벤트', () => {
    it('inserterPlaced 이벤트 발생', done => {
      system.on('inserterPlaced', detail => {
        expect(detail.x).toBe(5)
        expect(detail.y).toBe(5)
        expect(detail.direction).toBe('right')
        done()
      })

      system.place(5, 5, 'right')
    })

    it('itemPickedUp 이벤트 발생', done => {
      const inserter = system.place(5, 5, 'right')

      useGameStore.getState().addBuilding({
        id: 'source',
        type: 'extractor',
        x: 4,
        y: 5,
        level: 1,
        inventory: { iron: 10 },
        progress: 0,
      })

      system.on('itemPickedUp', detail => {
        expect(detail.resourceId).toBe('iron')
        expect(detail.amount).toBe(1)
        done()
      })

      system.tryPickup(inserter)
    })

    it('itemDelivered 이벤트 발생', done => {
      const inserter = system.place(5, 5, 'right')
      inserter.heldItem = { resourceId: 'iron', amount: 5 }

      useGameStore.getState().addBuilding({
        id: 'target',
        type: 'warehouse',
        x: 6,
        y: 5,
        level: 1,
        inventory: {},
        progress: 0,
      })

      system.on('itemDelivered', detail => {
        expect(detail.resourceId).toBe('iron')
        expect(detail.amount).toBe(5)
        done()
      })

      system.tryDeliver(inserter)
    })
  })

  describe('유틸리티', () => {
    it('getInserterAt: 특정 위치의 투입기 조회', () => {
      system.place(5, 5, 'right')

      const found = system.getInserterAt(5, 5)
      expect(found).toBeTruthy()
      expect(found.x).toBe(5)
      expect(found.y).toBe(5)
    })

    it('getAllInserters: 모든 투입기 조회', () => {
      system.place(5, 5, 'right')
      system.place(10, 10, 'left')

      const all = system.getAllInserters()
      expect(all.length).toBe(2)
    })

    it('getReverseDirection: 역방향 계산', () => {
      expect(system.getReverseDirection('up')).toBe('down')
      expect(system.getReverseDirection('down')).toBe('up')
      expect(system.getReverseDirection('left')).toBe('right')
      expect(system.getReverseDirection('right')).toBe('left')
    })

    it('getNextPosition: 다음 위치 계산', () => {
      const up = system.getNextPosition(5, 5, 'up')
      expect(up).toEqual({ x: 5, y: 4 })

      const right = system.getNextPosition(5, 5, 'right')
      expect(right).toEqual({ x: 6, y: 5 })
    })
  })
})
