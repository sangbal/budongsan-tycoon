/**
 * KIMCHI INVASION - Building System Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { buildingSystem, BuildingSystem } from '../buildingSystem.js'
import { resourceSystem } from '../resourceSystem.js'
import { useGameStore } from '../../state/stores/gameStore.js'
import { BUILDINGS } from '../../data/buildings.js'

describe('BuildingSystem', () => {
  let system

  beforeEach(() => {
    // 상태 초기화 (먼저!)
    useGameStore.getState().reset()

    // 새 시스템 인스턴스 생성
    system = new BuildingSystem()
    system.init()

    // 자원 초기화 (건물 건설용)
    resourceSystem.add('dollars', 10000)
    resourceSystem.add('iron', 1000)
    resourceSystem.add('sand', 500)
    resourceSystem.add('regolith', 500)
    resourceSystem.add('energy', 100)
  })

  describe('place()', () => {
    it('건물을 정상적으로 배치해야 함', () => {
      const building = system.place('extractor', 0, 0)

      expect(building).not.toBeNull()
      expect(building.type).toBe('extractor')
      expect(building.x).toBe(0)
      expect(building.y).toBe(0)
      expect(building.level).toBe(1)
    })

    it('자원이 부족하면 배치에 실패해야 함', () => {
      // 자원 초기화 (부족하게)
      useGameStore.getState().reset()
      resourceSystem.add('dollars', 10) // extractor는 100 필요

      const building = system.place('extractor', 0, 0)
      expect(building).toBeNull()
    })

    it('이미 점유된 타일에는 배치할 수 없어야 함', () => {
      // 첫 번째 건물 배치
      system.place('extractor', 0, 0) // 2x2 크기

      // 겹치는 위치에 두 번째 건물 시도
      const building2 = system.place('extractor', 1, 1)
      expect(building2).toBeNull()
    })

    it('배치 후 자원이 소비되어야 함', () => {
      const initialDollars = resourceSystem.get('dollars')
      const cost = BUILDINGS.extractor.cost.dollars

      system.place('extractor', 0, 0)

      const finalDollars = resourceSystem.get('dollars')
      expect(finalDollars).toBe(initialDollars - cost)
    })
  })

  describe('canPlace()', () => {
    it('빈 타일에는 배치 가능해야 함', () => {
      const canPlace = system.canPlace('extractor', 5, 5)
      expect(canPlace).toBe(true)
    })

    it('점유된 타일에는 배치 불가능해야 함', () => {
      system.place('extractor', 0, 0)
      const canPlace = system.canPlace('extractor', 1, 1)
      expect(canPlace).toBe(false)
    })

    it('자원이 부족하면 배치 불가능해야 함', () => {
      useGameStore.getState().reset()
      const canPlace = system.canPlace('greenhouse', 0, 0)
      expect(canPlace).toBe(false)
    })
  })

  describe('remove()', () => {
    it('건물을 정상적으로 제거해야 함', () => {
      const building = system.place('extractor', 0, 0)
      const success = system.remove(building.id)

      expect(success).toBe(true)
      expect(system.getBuilding(building.id)).toBeUndefined()
    })

    it('제거 시 50% 자원을 환불해야 함', () => {
      const initialDollars = resourceSystem.get('dollars')
      const cost = BUILDINGS.extractor.cost.dollars

      const building = system.place('extractor', 0, 0)
      system.remove(building.id)

      const finalDollars = resourceSystem.get('dollars')
      const expectedRefund = Math.floor(cost * 0.5)

      expect(finalDollars).toBe(initialDollars - cost + expectedRefund)
    })

    it('제거 후 타일이 해제되어야 함', () => {
      const building = system.place('extractor', 0, 0)
      system.remove(building.id)

      // 같은 위치에 다시 배치 가능해야 함
      const canPlace = system.canPlace('extractor', 0, 0)
      expect(canPlace).toBe(true)
    })
  })

  describe('upgrade()', () => {
    it('건물을 정상적으로 업그레이드해야 함', () => {
      const building = system.place('extractor', 0, 0)
      const success = system.upgrade(building.id)

      expect(success).toBe(true)
      expect(building.level).toBe(2)
    })

    it('최대 레벨에서는 업그레이드할 수 없어야 함', () => {
      const building = system.place('extractor', 0, 0)

      // 최대 레벨까지 업그레이드
      const maxLevel = BUILDINGS.extractor.maxLevel
      for (let i = 1; i < maxLevel; i++) {
        system.upgrade(building.id)
      }

      // 이미 최대 레벨이므로 실패
      const success = system.upgrade(building.id)
      expect(success).toBe(false)
      expect(building.level).toBe(maxLevel)
    })

    it('업그레이드 비용이 증가해야 함', () => {
      const building = system.place('extractor', 0, 0)

      const dollarsBeforeUpgrade1 = resourceSystem.get('dollars')
      system.upgrade(building.id) // Level 1 → 2
      const dollarsAfterUpgrade1 = resourceSystem.get('dollars')
      const cost1 = dollarsBeforeUpgrade1 - dollarsAfterUpgrade1

      const dollarsBeforeUpgrade2 = resourceSystem.get('dollars')
      system.upgrade(building.id) // Level 2 → 3
      const dollarsAfterUpgrade2 = resourceSystem.get('dollars')
      const cost2 = dollarsBeforeUpgrade2 - dollarsAfterUpgrade2

      expect(cost2).toBeGreaterThan(cost1)
    })
  })

  describe('update()', () => {
    it.skip('발전소가 에너지를 생산해야 함 - TODO: 생산 루프 검증 필요', () => {
      // 발전소 연료 추가
      resourceSystem.add('regolith', 1000)

      const initialEnergy = resourceSystem.get('energy')
      system.place('coalPowerPlant', 0, 0)

      // 1초 업데이트
      system.update([], 1)

      const finalEnergy = resourceSystem.get('energy')
      expect(finalEnergy).toBeGreaterThan(initialEnergy)
    })

    it('에너지가 부족하면 생산이 중단되어야 함', () => {
      // 에너지를 소진
      const energy = resourceSystem.get('energy')
      resourceSystem.consume('energy', energy)

      const building = system.place('extractor', 0, 0)
      const initialIron = resourceSystem.get('iron')

      // 1초 업데이트 (에너지 부족으로 생산 안 됨)
      system.update([], 1)

      const finalIron = resourceSystem.get('iron')
      expect(finalIron).toBe(initialIron) // 변화 없음
    })

    it.skip('레벨이 높을수록 생산량이 증가해야 함 - TODO: 생산 루프 검증 필요', () => {
      resourceSystem.add('regolith', 1000)

      const building = system.place('coalPowerPlant', 0, 0)

      // Level 1 생산량
      const initialEnergy1 = resourceSystem.get('energy')
      system.update([], 1)
      const production1 = resourceSystem.get('energy') - initialEnergy1

      // 업그레이드 (Level 2)
      system.upgrade(building.id)

      // Level 2 생산량
      resourceSystem.consume('energy', resourceSystem.get('energy') - initialEnergy1) // 리셋
      const initialEnergy2 = resourceSystem.get('energy')
      system.update([], 1)
      const production2 = resourceSystem.get('energy') - initialEnergy2

      expect(production2).toBeGreaterThan(production1)
    })
  })

  describe('getBuildingAt()', () => {
    it('특정 위치의 건물을 조회해야 함', () => {
      const building = system.place('extractor', 0, 0)
      const found = system.getBuildingAt(0, 0)

      expect(found).not.toBeNull()
      expect(found.id).toBe(building.id)
    })

    it('빈 타일에서는 null을 반환해야 함', () => {
      const found = system.getBuildingAt(10, 10)
      expect(found).toBeNull()
    })

    it('건물이 차지한 모든 타일에서 같은 건물을 반환해야 함', () => {
      const building = system.place('extractor', 0, 0) // 2x2

      const found00 = system.getBuildingAt(0, 0)
      const found01 = system.getBuildingAt(0, 1)
      const found10 = system.getBuildingAt(1, 0)
      const found11 = system.getBuildingAt(1, 1)

      expect(found00.id).toBe(building.id)
      expect(found01.id).toBe(building.id)
      expect(found10.id).toBe(building.id)
      expect(found11.id).toBe(building.id)
    })
  })

  describe('이벤트 시스템', () => {
    it('배치 시 placed 이벤트를 발생시켜야 함', () => {
      const mockCallback = vi.fn()
      system.on('placed', mockCallback)

      system.place('extractor', 0, 0)

      expect(mockCallback).toHaveBeenCalledOnce()
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          x: 0,
          y: 0,
          building: expect.objectContaining({ type: 'extractor' }),
        })
      )
    })

    it('제거 시 removed 이벤트를 발생시켜야 함', () => {
      const mockCallback = vi.fn()
      system.on('removed', mockCallback)

      const building = system.place('extractor', 0, 0)
      system.remove(building.id)

      expect(mockCallback).toHaveBeenCalledOnce()
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          buildingId: building.id,
          refund: expect.any(Object),
        })
      )
    })

    it('업그레이드 시 upgraded 이벤트를 발생시켜야 함', () => {
      const mockCallback = vi.fn()
      system.on('upgraded', mockCallback)

      const building = system.place('extractor', 0, 0)
      system.upgrade(building.id)

      expect(mockCallback).toHaveBeenCalledOnce()
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          buildingId: building.id,
          newLevel: 2,
        })
      )
    })
  })

  describe('싱글톤 인스턴스', () => {
    it('buildingSystem이 전역 싱글톤이어야 함', () => {
      expect(buildingSystem).toBeInstanceOf(BuildingSystem)
    })
  })
})
