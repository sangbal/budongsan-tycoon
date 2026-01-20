/**
 * KIMCHI INVASION - Technology Definitions Tests
 */

import { describe, it, expect } from 'vitest'
import {
  TECHNOLOGIES,
  getTechnologiesByTier,
  isValidTechnology,
  getTechnology,
  hasPrerequisites,
  getAvailableTechnologies,
  getTechCost,
  getTechTime,
  getEffectsByType,
  getAllTechIds,
  getTechsSortedByTier,
} from '../technologies.js'

describe('technologies.js', () => {
  describe('TECHNOLOGIES 정의', () => {
    it('모든 기술에 필수 속성이 있어야 함', () => {
      for (const [id, tech] of Object.entries(TECHNOLOGIES)) {
        expect(tech.id).toBe(id)
        expect(tech.tier).toBeGreaterThanOrEqual(1)
        expect(tech.tier).toBeLessThanOrEqual(5)
        expect(tech.nameKey).toBeTruthy()
        expect(tech.descKey).toBeTruthy()
        expect(tech.icon).toBeTruthy()
        expect(tech.cost).toBeDefined()
        expect(tech.time).toBeGreaterThan(0)
        expect(Array.isArray(tech.prerequisites)).toBe(true)
        expect(Array.isArray(tech.effects)).toBe(true)
        expect(tech.effects.length).toBeGreaterThan(0)
      }
    })

    it('총 15개의 기술이 있어야 함', () => {
      expect(Object.keys(TECHNOLOGIES).length).toBe(15)
    })

    it('Tier 1-5 별로 기술이 존재해야 함', () => {
      expect(getTechnologiesByTier(1).length).toBeGreaterThan(0)
      expect(getTechnologiesByTier(2).length).toBeGreaterThan(0)
      expect(getTechnologiesByTier(3).length).toBeGreaterThan(0)
      expect(getTechnologiesByTier(4).length).toBeGreaterThan(0)
      expect(getTechnologiesByTier(5).length).toBeGreaterThan(0)
    })

    it('모든 선행 기술이 유효한 기술 ID여야 함', () => {
      for (const tech of Object.values(TECHNOLOGIES)) {
        for (const prereq of tech.prerequisites) {
          expect(TECHNOLOGIES[prereq]).toBeDefined()
        }
      }
    })

    it('선행 기술은 현재 Tier보다 낮아야 함', () => {
      for (const tech of Object.values(TECHNOLOGIES)) {
        for (const prereqId of tech.prerequisites) {
          const prereq = TECHNOLOGIES[prereqId]
          expect(prereq.tier).toBeLessThan(tech.tier)
        }
      }
    })

    it('효과는 올바른 타입이어야 함', () => {
      const validTypes = ['multiplier', 'unlock', 'bonus']
      for (const tech of Object.values(TECHNOLOGIES)) {
        for (const effect of tech.effects) {
          expect(validTypes).toContain(effect.type)
          expect(effect.target).toBeTruthy()
          expect(effect.value).toBeDefined()
        }
      }
    })

    it('Tier 1 기술은 선행 기술이 없어야 함', () => {
      for (const tech of getTechnologiesByTier(1)) {
        expect(tech.prerequisites.length).toBe(0)
      }
    })
  })

  describe('getTechnologiesByTier', () => {
    it('특정 Tier의 기술만 반환해야 함', () => {
      const tier2 = getTechnologiesByTier(2)
      expect(tier2.every(tech => tech.tier === 2)).toBe(true)
    })

    it('존재하지 않는 Tier는 빈 배열 반환', () => {
      expect(getTechnologiesByTier(99).length).toBe(0)
    })
  })

  describe('isValidTechnology', () => {
    it('유효한 기술 ID는 true 반환', () => {
      expect(isValidTechnology('efficientDrills')).toBe(true)
      expect(isValidTechnology('omegaKimchi')).toBe(true)
    })

    it('유효하지 않은 기술 ID는 false 반환', () => {
      expect(isValidTechnology('invalidTech')).toBe(false)
      expect(isValidTechnology('')).toBe(false)
    })
  })

  describe('getTechnology', () => {
    it('유효한 기술 정보를 반환해야 함', () => {
      const tech = getTechnology('efficientDrills')
      expect(tech).toBeDefined()
      expect(tech.id).toBe('efficientDrills')
    })

    it('유효하지 않은 ID는 null 반환', () => {
      expect(getTechnology('invalid')).toBeNull()
    })
  })

  describe('hasPrerequisites', () => {
    it('선행 기술이 없으면 true 반환', () => {
      expect(hasPrerequisites('efficientDrills', [])).toBe(true)
    })

    it('선행 기술이 모두 완료되면 true 반환', () => {
      expect(hasPrerequisites('advancedFermentation', ['improvedFarming'])).toBe(true)
    })

    it('선행 기술이 완료되지 않으면 false 반환', () => {
      expect(hasPrerequisites('advancedFermentation', [])).toBe(false)
    })

    it('복수 선행 기술이 모두 완료되어야 true', () => {
      expect(hasPrerequisites('automatedHarvest', ['advancedFermentation', 'waterRecycling'])).toBe(
        true
      )
      expect(hasPrerequisites('automatedHarvest', ['advancedFermentation'])).toBe(false)
    })

    it('유효하지 않은 기술 ID는 false 반환', () => {
      expect(hasPrerequisites('invalid', [])).toBe(false)
    })
  })

  describe('getAvailableTechnologies', () => {
    it('Tier 1 기술은 처음부터 연구 가능', () => {
      const available = getAvailableTechnologies([])
      const tier1 = available.filter(tech => tech.tier === 1)
      expect(tier1.length).toBe(getTechnologiesByTier(1).length)
    })

    it('선행 기술 완료 시 다음 기술이 해금됨', () => {
      const available = getAvailableTechnologies(['improvedFarming'])
      expect(available.some(tech => tech.id === 'advancedFermentation')).toBe(true)
    })

    it('이미 연구된 기술은 제외됨', () => {
      const available = getAvailableTechnologies(['efficientDrills'])
      expect(available.some(tech => tech.id === 'efficientDrills')).toBe(false)
    })
  })

  describe('getTechCost', () => {
    it('기술 비용을 반환해야 함', () => {
      const cost = getTechCost('efficientDrills')
      expect(cost).toBeDefined()
      expect(cost.lactobacillusData).toBe(10)
    })

    it('유효하지 않은 ID는 null 반환', () => {
      expect(getTechCost('invalid')).toBeNull()
    })
  })

  describe('getTechTime', () => {
    it('기술 연구 시간을 반환해야 함', () => {
      expect(getTechTime('efficientDrills')).toBe(30)
      expect(getTechTime('omegaKimchi')).toBe(300)
    })

    it('유효하지 않은 ID는 0 반환', () => {
      expect(getTechTime('invalid')).toBe(0)
    })
  })

  describe('getEffectsByType', () => {
    it('특정 타입의 효과만 필터링해야 함', () => {
      const multipliers = getEffectsByType('efficientDrills', 'multiplier')
      expect(multipliers.length).toBeGreaterThan(0)
      expect(multipliers.every(effect => effect.type === 'multiplier')).toBe(true)
    })

    it('존재하지 않는 타입은 빈 배열 반환', () => {
      expect(getEffectsByType('efficientDrills', 'invalidType').length).toBe(0)
    })

    it('유효하지 않은 기술 ID는 빈 배열 반환', () => {
      expect(getEffectsByType('invalid', 'multiplier').length).toBe(0)
    })
  })

  describe('getAllTechIds', () => {
    it('모든 기술 ID를 배열로 반환', () => {
      const ids = getAllTechIds()
      expect(ids.length).toBe(Object.keys(TECHNOLOGIES).length)
      expect(ids).toContain('efficientDrills')
      expect(ids).toContain('omegaKimchi')
    })
  })

  describe('getTechsSortedByTier', () => {
    it('Tier 순으로 정렬되어야 함', () => {
      const sorted = getTechsSortedByTier()
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].tier).toBeGreaterThanOrEqual(sorted[i - 1].tier)
      }
    })
  })

  describe('연구 트리 구조 검증', () => {
    it('순환 의존성이 없어야 함', () => {
      // DFS로 순환 검증
      const visited = new Set()
      const recStack = new Set()

      function hasCycle(techId) {
        if (recStack.has(techId)) return true
        if (visited.has(techId)) return false

        visited.add(techId)
        recStack.add(techId)

        const tech = TECHNOLOGIES[techId]
        for (const prereq of tech.prerequisites) {
          if (hasCycle(prereq)) return true
        }

        recStack.delete(techId)
        return false
      }

      for (const techId of Object.keys(TECHNOLOGIES)) {
        expect(hasCycle(techId)).toBe(false)
      }
    })

    it('Tier 5 기술은 적절한 비용을 가져야 함', () => {
      const tier5 = getTechnologiesByTier(5)
      for (const tech of tier5) {
        expect(tech.cost.lactobacillusData).toBeGreaterThanOrEqual(200)
        expect(tech.cost.fermentCulture).toBeGreaterThanOrEqual(80)
        expect(tech.cost.omegaStarter).toBeGreaterThanOrEqual(10)
      }
    })
  })
})
