/**
 * KIMCHI INVASION - Research System Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ResearchSystem } from '../researchSystem.js'
import { resourceSystem } from '../resourceSystem.js'
import { useGameStore } from '../../state/stores/gameStore.js'

describe('researchSystem.js', () => {
  let system

  beforeEach(() => {
    // 시스템 인스턴스 생성
    system = new ResearchSystem()

    // 게임 상태 초기화
    useGameStore.getState().reset()

    // 자원 초기화
    resourceSystem.init()
    resourceSystem.set('lactobacillusData', 1000)
    resourceSystem.set('fermentCulture', 500)
    resourceSystem.set('omegaStarter', 100)
  })

  describe('초기화', () => {
    it('시스템이 올바르게 생성되어야 함', () => {
      expect(system.systemName).toBe('ResearchSystem')
      expect(system.priority).toBe(5)
      expect(system.currentResearch).toBeNull()
      expect(system.researchProgress).toBe(0)
      expect(system.completedTechs.size).toBe(0)
    })

    it('init() 호출 시 저장된 상태 복원', () => {
      // 상태 설정
      useGameStore.getState().completeResearch('efficientDrills')
      useGameStore.getState().startResearch('improvedFarming')

      // 시스템 초기화
      system.init()

      expect(system.completedTechs.has('efficientDrills')).toBe(true)
      expect(system.currentResearch).toBe('improvedFarming')
    })
  })

  describe('startResearch', () => {
    it('Tier 1 기술을 연구할 수 있어야 함', () => {
      const result = system.startResearch('efficientDrills')
      expect(result).toBe(true)
      expect(system.currentResearch).toBe('efficientDrills')
      expect(system.researchProgress).toBe(0)
    })

    it('선행 기술이 없으면 연구할 수 없음', () => {
      const result = system.startResearch('advancedFermentation')
      expect(result).toBe(false)
      expect(system.currentResearch).toBeNull()
    })

    it('선행 기술 완료 후 연구 가능', () => {
      system.completedTechs.add('improvedFarming')
      const result = system.startResearch('advancedFermentation')
      expect(result).toBe(true)
      expect(system.currentResearch).toBe('advancedFermentation')
    })

    it('비용 부족 시 연구 실패', () => {
      resourceSystem.set('lactobacillusData', 5) // 부족
      const result = system.startResearch('efficientDrills')
      expect(result).toBe(false)
    })

    it('연구 비용이 소비되어야 함', () => {
      const before = resourceSystem.get('lactobacillusData')
      system.startResearch('efficientDrills')
      const after = resourceSystem.get('lactobacillusData')
      expect(after).toBe(before - 10)
    })

    it('이미 연구 중이면 새 연구 시작 불가', () => {
      system.startResearch('efficientDrills')
      const result = system.startResearch('improvedFarming')
      expect(result).toBe(false)
      expect(system.currentResearch).toBe('efficientDrills')
    })

    it('이미 완료된 기술은 다시 연구 불가', () => {
      system.completedTechs.add('efficientDrills')
      const result = system.startResearch('efficientDrills')
      expect(result).toBe(false)
    })

    it('researchStarted 이벤트 발생', () => {
      const listener = vi.fn()
      system.on('researchStarted', listener)
      system.startResearch('efficientDrills')
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ techId: 'efficientDrills' }))
    })
  })

  describe('update', () => {
    it('연구가 진행되어야 함', () => {
      system.startResearch('efficientDrills')
      system.update([], 10) // 10초 경과
      expect(system.researchProgress).toBe(10)
    })

    it('연구 시간 도달 시 자동 완료', () => {
      system.startResearch('efficientDrills') // 30초
      system.update([], 30)
      expect(system.currentResearch).toBeNull()
      expect(system.completedTechs.has('efficientDrills')).toBe(true)
    })

    it('연구 중이 아니면 업데이트 무시', () => {
      system.update([], 10)
      expect(system.researchProgress).toBe(0)
    })
  })

  describe('completeResearch', () => {
    it('연구 완료 시 기술이 해금되어야 함', () => {
      system.currentResearch = 'efficientDrills'
      system.completeResearch()
      expect(system.completedTechs.has('efficientDrills')).toBe(true)
      expect(system.currentResearch).toBeNull()
    })

    it('효과가 캐시에 적용되어야 함', () => {
      system.currentResearch = 'efficientDrills'
      system.completeResearch()
      expect(system.getMultiplier('mining')).toBe(1.2)
    })

    it('unlock 효과가 적용되어야 함', () => {
      system.completedTechs.add('efficientDrills')
      system.currentResearch = 'solarPanels'
      system.completeResearch()
      expect(system.isUnlocked('solarPanels')).toBe(true)
    })

    it('bonus 효과가 적용되어야 함', () => {
      system.completedTechs.add('improvedFarming')
      system.currentResearch = 'waterRecycling'
      system.completeResearch()
      expect(system.getBonus('waterConsumption')).toBe(-0.25)
    })

    it('researchCompleted 이벤트 발생', () => {
      const listener = vi.fn()
      system.on('researchCompleted', listener)
      system.currentResearch = 'efficientDrills'
      system.completeResearch()
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ techId: 'efficientDrills' }))
    })

    it('techUnlocked 이벤트 발생', () => {
      const listener = vi.fn()
      system.on('techUnlocked', listener)
      system.currentResearch = 'efficientDrills'
      system.completeResearch()
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ techId: 'efficientDrills' }))
    })
  })

  describe('cancelResearch', () => {
    it('연구 취소 시 상태가 초기화되어야 함', () => {
      system.startResearch('efficientDrills')
      system.researchProgress = 10
      system.cancelResearch()
      expect(system.currentResearch).toBeNull()
      expect(system.researchProgress).toBe(0)
    })

    it('연구 중이 아니면 false 반환', () => {
      const result = system.cancelResearch()
      expect(result).toBe(false)
    })

    it('researchCancelled 이벤트 발생', () => {
      const listener = vi.fn()
      system.on('researchCancelled', listener)
      system.startResearch('efficientDrills')
      system.cancelResearch()
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ techId: 'efficientDrills' }))
    })
  })

  describe('getMultiplier', () => {
    it('기본 배수는 1.0', () => {
      expect(system.getMultiplier('mining')).toBe(1.0)
    })

    it('효과 적용 시 배수가 변경됨', () => {
      system.completedTechs.add('efficientDrills')
      system.rebuildCache()
      expect(system.getMultiplier('mining')).toBe(1.2)
    })

    it('다중 효과는 곱셈 누적', () => {
      system.completedTechs.add('improvedFarming') // 1.2x
      system.completedTechs.add('automatedHarvest') // 1.3x
      system.rebuildCache()
      expect(system.getMultiplier('farming')).toBeCloseTo(1.56, 2) // 1.2 * 1.3
    })
  })

  describe('isUnlocked', () => {
    it('기본적으로 모든 기능이 잠겨 있음', () => {
      expect(system.isUnlocked('solarPanels')).toBe(false)
    })

    it('unlock 효과 적용 시 해금됨', () => {
      system.completedTechs.add('solarPanels')
      system.rebuildCache()
      expect(system.isUnlocked('solarPanels')).toBe(true)
    })
  })

  describe('getBonus', () => {
    it('기본 보너스는 0', () => {
      expect(system.getBonus('waterConsumption')).toBe(0)
    })

    it('bonus 효과 적용 시 값이 변경됨', () => {
      system.completedTechs.add('waterRecycling')
      system.rebuildCache()
      expect(system.getBonus('waterConsumption')).toBe(-0.25)
    })

    it('다중 보너스는 덧셈 누적', () => {
      system.completedTechs.add('waterRecycling') // -0.25
      system.completedTechs.add('efficientPower') // -0.4 (다른 타겟)
      system.rebuildCache()
      expect(system.getBonus('waterConsumption')).toBe(-0.25)
      expect(system.getBonus('powerConsumption')).toBe(-0.4)
    })
  })

  describe('getAvailableTechnologies', () => {
    it('처음엔 Tier 1 기술만 연구 가능', () => {
      const available = system.getAvailableTechnologies()
      expect(available.every(tech => tech.tier === 1)).toBe(true)
    })

    it('기술 완료 후 후속 기술 해금', () => {
      system.completedTechs.add('improvedFarming')
      const available = system.getAvailableTechnologies()
      expect(available.some(tech => tech.id === 'advancedFermentation')).toBe(true)
    })
  })

  describe('getCurrentResearchStatus', () => {
    it('연구 중이 아니면 null 반환', () => {
      expect(system.getCurrentResearchStatus()).toBeNull()
    })

    it('연구 중이면 상태 정보 반환', () => {
      system.startResearch('efficientDrills')
      system.researchProgress = 15
      const status = system.getCurrentResearchStatus()
      expect(status.techId).toBe('efficientDrills')
      expect(status.progress).toBe(15)
      expect(status.totalTime).toBe(30)
      expect(status.percent).toBe(50)
    })
  })

  describe('isResearched', () => {
    it('완료된 기술은 true 반환', () => {
      system.completedTechs.add('efficientDrills')
      expect(system.isResearched('efficientDrills')).toBe(true)
    })

    it('완료되지 않은 기술은 false 반환', () => {
      expect(system.isResearched('efficientDrills')).toBe(false)
    })
  })

  describe('getCompletedTechs', () => {
    it('완료된 기술 목록을 배열로 반환', () => {
      system.completedTechs.add('efficientDrills')
      system.completedTechs.add('improvedFarming')
      const completed = system.getCompletedTechs()
      expect(completed.length).toBe(2)
      expect(completed).toContain('efficientDrills')
      expect(completed).toContain('improvedFarming')
    })
  })

  describe('getResearchProgress', () => {
    it('연구 중이 아니면 0 반환', () => {
      expect(system.getResearchProgress()).toBe(0)
    })

    it('연구 진행률을 0-1 범위로 반환', () => {
      system.startResearch('efficientDrills') // 30초
      system.researchProgress = 15
      expect(system.getResearchProgress()).toBe(0.5)
    })
  })

  describe('rebuildCache', () => {
    it('캐시 재생성 시 모든 효과가 적용되어야 함', () => {
      system.completedTechs.add('efficientDrills') // mining 1.2x
      system.completedTechs.add('solarPanels') // unlock solarPanels
      system.completedTechs.add('waterRecycling') // waterConsumption -0.25
      system.rebuildCache()

      expect(system.getMultiplier('mining')).toBe(1.2)
      expect(system.isUnlocked('solarPanels')).toBe(true)
      expect(system.getBonus('waterConsumption')).toBe(-0.25)
    })
  })

  describe('디버깅 기능', () => {
    it('debugUnlockAll() 모든 기술 해금', () => {
      system.debugUnlockAll()
      expect(system.completedTechs.size).toBe(15)
    })

    it('debugCompleteNow() 현재 연구 즉시 완료', () => {
      system.startResearch('efficientDrills')
      system.debugCompleteNow()
      expect(system.completedTechs.has('efficientDrills')).toBe(true)
    })
  })

  describe('Zustand 통합', () => {
    it('연구 시작 시 gameStore 업데이트', () => {
      system.startResearch('efficientDrills')
      const state = useGameStore.getState()
      expect(state.research.current).toBe('efficientDrills')
      expect(state.research.progress).toBe(0)
    })

    it('연구 완료 시 gameStore 업데이트', () => {
      system.currentResearch = 'efficientDrills'
      system.completeResearch()
      const state = useGameStore.getState()
      expect(state.research.completed).toContain('efficientDrills')
      expect(state.research.current).toBeNull()
    })
  })
})
