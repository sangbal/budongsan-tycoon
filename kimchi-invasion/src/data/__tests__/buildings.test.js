/**
 * KIMCHI INVASION - Building Definitions Tests
 */

import { describe, it, expect } from 'vitest'
import {
  BUILDINGS,
  BUILDING_CATEGORIES,
  getBuildingsByCategory,
  canAfford,
  getBuilding,
  getAllBuildingIds,
  getBuildingsByTag,
  isValidBuilding,
  getBuildingsSortedByCategory,
  getEnergyBalance,
  getUpgradeCost,
  getProductionRate,
  getBuildingsByTier,
} from '../buildings.js'

describe('buildings.js - M1 건물 정의', () => {
  describe('BUILDINGS 데이터 무결성', () => {
    it('10종 건물이 정의되어야 함', () => {
      const buildingCount = Object.keys(BUILDINGS).length
      expect(buildingCount).toBe(10)
    })

    it('모든 건물이 필수 필드를 가져야 함', () => {
      const requiredFields = [
        'id',
        'category',
        'nameKey',
        'descKey',
        'icon',
        'color',
        'cost',
        'input',
        'output',
        'processTime',
        'energyPerTick',
        'size',
        'maxLevel',
        'tags',
      ]

      Object.values(BUILDINGS).forEach(building => {
        requiredFields.forEach(field => {
          expect(building).toHaveProperty(field)
        })
      })
    })

    it('모든 건물 ID가 키와 일치해야 함', () => {
      Object.entries(BUILDINGS).forEach(([key, building]) => {
        expect(building.id).toBe(key)
      })
    })

    it('모든 건물이 유효한 카테고리를 가져야 함', () => {
      const validCategories = Object.keys(BUILDING_CATEGORIES)

      Object.values(BUILDINGS).forEach(building => {
        expect(validCategories).toContain(building.category)
      })
    })

    it('size는 양수 width/height를 가져야 함', () => {
      Object.values(BUILDINGS).forEach(building => {
        expect(building.size.width).toBeGreaterThan(0)
        expect(building.size.height).toBeGreaterThan(0)
      })
    })
  })

  describe('카테고리별 건물 조회', () => {
    it('채굴 건물 2종 (extractor, iceHarvester)', () => {
      const extraction = getBuildingsByCategory('extraction')
      expect(extraction).toHaveLength(2)
      expect(extraction.map(b => b.id)).toEqual(['extractor', 'iceHarvester'])
    })

    it('생산 건물 4종 (greenhouse, furnace, brineStation, fermentationChamber)', () => {
      const production = getBuildingsByCategory('production')
      expect(production).toHaveLength(4)
    })

    it('전력 건물 1종 (coalPowerPlant)', () => {
      const power = getBuildingsByCategory('power')
      expect(power).toHaveLength(1)
      expect(power[0].id).toBe('coalPowerPlant')
    })

    it('유틸리티 건물 1종 (warehouse)', () => {
      const utility = getBuildingsByCategory('utility')
      expect(utility).toHaveLength(1)
      expect(utility[0].id).toBe('warehouse')
    })

    it('물류 건물 2종 (conveyor, inserter)', () => {
      const logistics = getBuildingsByCategory('logistics')
      expect(logistics).toHaveLength(2)
    })
  })

  describe('canAfford - 건설 비용 검사', () => {
    it('충분한 자원이 있으면 true', () => {
      const resources = { dollars: 200, iron: 50 }
      expect(canAfford('extractor', resources)).toBe(true) // cost: $100, iron 20
    })

    it('자원이 부족하면 false', () => {
      const resources = { dollars: 50, iron: 10 }
      expect(canAfford('extractor', resources)).toBe(false)
    })

    it('자원이 정확히 일치하면 true', () => {
      const resources = { dollars: 100, iron: 20 }
      expect(canAfford('extractor', resources)).toBe(true)
    })

    it('유효하지 않은 건물 ID는 false', () => {
      const resources = { dollars: 1000, iron: 500 }
      expect(canAfford('invalid_building', resources)).toBe(false)
    })
  })

  describe('getBuilding - 건물 정보 조회', () => {
    it('유효한 ID는 건물 객체 반환', () => {
      const building = getBuilding('extractor')
      expect(building).toBeDefined()
      expect(building.id).toBe('extractor')
    })

    it('유효하지 않은 ID는 null 반환', () => {
      const building = getBuilding('nonexistent')
      expect(building).toBeNull()
    })
  })

  describe('getAllBuildingIds', () => {
    it('모든 건물 ID 배열 반환 (10개)', () => {
      const ids = getAllBuildingIds()
      expect(ids).toHaveLength(10)
      expect(ids).toContain('extractor')
      expect(ids).toContain('warehouse')
    })
  })

  describe('getBuildingsByTag', () => {
    it('tier1 태그를 가진 건물 조회', () => {
      const tier1Buildings = getBuildingsByTag('tier1')
      expect(tier1Buildings.length).toBeGreaterThan(0)
      tier1Buildings.forEach(building => {
        expect(building.tags).toContain('tier1')
      })
    })

    it('mining 태그를 가진 건물 조회', () => {
      const miningBuildings = getBuildingsByTag('mining')
      expect(miningBuildings).toHaveLength(2) // extractor, iceHarvester
    })
  })

  describe('isValidBuilding', () => {
    it('유효한 건물 ID', () => {
      expect(isValidBuilding('extractor')).toBe(true)
      expect(isValidBuilding('warehouse')).toBe(true)
    })

    it('유효하지 않은 건물 ID', () => {
      expect(isValidBuilding('invalid')).toBe(false)
      expect(isValidBuilding('')).toBe(false)
    })
  })

  describe('getBuildingsSortedByCategory', () => {
    it('카테고리 sortOrder에 따라 정렬된 건물 목록', () => {
      const sorted = getBuildingsSortedByCategory()
      expect(sorted).toHaveLength(10)

      // 첫 번째는 extraction 카테고리
      expect(sorted[0].category).toBe('extraction')
    })
  })

  describe('getEnergyBalance', () => {
    it('에너지 소비 건물은 음수 반환', () => {
      const balance = getEnergyBalance('extractor')
      expect(balance).toBe(-1) // energyPerTick: 1 → -1
    })

    it('에너지 생산 건물은 양수 반환', () => {
      const balance = getEnergyBalance('coalPowerPlant')
      expect(balance).toBe(10) // energyPerTick: -10 → 10
    })

    it('레벨이 증가하면 에너지 효율 개선 (-5%)', () => {
      const level1 = getEnergyBalance('extractor', 1)
      const level2 = getEnergyBalance('extractor', 2)
      expect(level2).toBeGreaterThan(level1) // 소비 감소 (음수가 작아짐)
    })
  })

  describe('getUpgradeCost', () => {
    it('업그레이드 비용 계산 (1.5배씩 증가)', () => {
      const cost = getUpgradeCost('extractor', 1)
      expect(cost).toBeDefined()
      expect(cost.dollars).toBe(150) // 100 * 1.5
      expect(cost.iron).toBe(30) // 20 * 1.5
    })

    it('최대 레벨에서는 null 반환', () => {
      const cost = getUpgradeCost('extractor', 5) // maxLevel: 5
      expect(cost).toBeNull()
    })

    it('유효하지 않은 건물 ID는 null', () => {
      const cost = getUpgradeCost('invalid', 1)
      expect(cost).toBeNull()
    })
  })

  describe('getProductionRate', () => {
    it('레벨에 따라 생산량 증가 (+20%)', () => {
      const level1 = getProductionRate('extractor', 1)
      const level2 = getProductionRate('extractor', 2)

      expect(level1.iron).toBe(0.5) // 기본 생산량
      expect(level2.iron).toBe(0.6) // 0.5 * 1.2
    })

    it('출력이 없는 건물은 빈 객체 반환', () => {
      const rate = getProductionRate('warehouse', 1)
      expect(rate).toEqual({})
    })
  })

  describe('getBuildingsByTier', () => {
    it('Tier 1 건물 조회', () => {
      const tier1 = getBuildingsByTier(1)
      expect(tier1.length).toBeGreaterThan(0)
      tier1.forEach(building => {
        expect(building.tags).toContain('tier1')
      })
    })

    it('Tier 2 건물 조회', () => {
      const tier2 = getBuildingsByTier(2)
      expect(tier2.length).toBeGreaterThan(0)
      tier2.forEach(building => {
        expect(building.tags).toContain('tier2')
      })
    })
  })

  describe('특정 건물 검증', () => {
    it('발효실은 김치 생산', () => {
      const chamber = getBuilding('fermentationChamber')
      expect(chamber.output.kimchi).toBe(1)
      expect(chamber.processTime).toBe(60) // 60초
    })

    it('화력 발전소는 에너지 생산', () => {
      const plant = getBuilding('coalPowerPlant')
      expect(plant.output.energy).toBe(10)
      expect(plant.energyPerTick).toBe(-10) // 생산 (음수)
    })

    it('창고는 저장 용량 증가 효과', () => {
      const warehouse = getBuilding('warehouse')
      expect(warehouse.effect.type).toBe('storage')
      expect(warehouse.effect.value).toBe(500)
    })

    it('컨베이어는 운송 효과', () => {
      const conveyor = getBuilding('conveyor')
      expect(conveyor.effect.type).toBe('transport')
      expect(conveyor.effect.speed).toBe(1.0)
    })

    it('투입기는 전송 효과', () => {
      const inserter = getBuilding('inserter')
      expect(inserter.effect.type).toBe('transfer')
      expect(inserter.effect.speed).toBe(0.5) // 1 아이템/2초
    })
  })
})
