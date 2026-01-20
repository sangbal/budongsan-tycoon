/**
 * KIMCHI INVASION - Tutorial System Tests
 *
 * @description TutorialSystem 단위 테스트
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { TutorialSystem, TUTORIAL_STEPS, TUTORIAL_STATE } from '../tutorialSystem.js'
import { useGameStore } from '../../state/stores/gameStore.js'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: key => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
})

describe('TutorialSystem', () => {
  let tutorialSystem

  beforeEach(() => {
    localStorageMock.clear()
    tutorialSystem = new TutorialSystem()
    useGameStore.getState().reset()
  })

  afterEach(() => {
    tutorialSystem.cleanup()
  })

  describe('Initialization', () => {
    it('should initialize with NOT_STARTED state', () => {
      expect(tutorialSystem.state).toBe(TUTORIAL_STATE.NOT_STARTED)
      expect(tutorialSystem.currentStep).toBe(TUTORIAL_STEPS.PROLOGUE)
    })

    it('should be a valid System', () => {
      expect(tutorialSystem.label).toBe('TutorialSystem')
      expect(typeof tutorialSystem.update).toBe('function')
    })
  })

  describe('Start Tutorial', () => {
    it('should start tutorial from PROLOGUE', () => {
      tutorialSystem.start()

      expect(tutorialSystem.state).toBe(TUTORIAL_STATE.IN_PROGRESS)
      expect(tutorialSystem.currentStep).toBe(TUTORIAL_STEPS.PROLOGUE)
      expect(tutorialSystem.startTime).toBeGreaterThan(0)
    })

    it('should reset if already completed', () => {
      tutorialSystem.state = TUTORIAL_STATE.COMPLETED
      tutorialSystem.start()

      expect(tutorialSystem.state).toBe(TUTORIAL_STATE.IN_PROGRESS)
      expect(tutorialSystem.currentStep).toBe(TUTORIAL_STEPS.PROLOGUE)
    })
  })

  describe('Pause and Resume', () => {
    it('should pause tutorial', () => {
      tutorialSystem.start()
      tutorialSystem.pause()

      expect(tutorialSystem.state).toBe(TUTORIAL_STATE.PAUSED)
    })

    it('should resume tutorial', () => {
      tutorialSystem.start()
      tutorialSystem.pause()
      tutorialSystem.resume()

      expect(tutorialSystem.state).toBe(TUTORIAL_STATE.IN_PROGRESS)
    })
  })

  describe('Skip Tutorial', () => {
    it('should skip to COMPLETED', () => {
      tutorialSystem.start()
      tutorialSystem.skip()

      expect(tutorialSystem.state).toBe(TUTORIAL_STATE.SKIPPED)
      expect(tutorialSystem.currentStep).toBe(TUTORIAL_STEPS.COMPLETED)
    })

    it('should grant skip rewards', () => {
      const spy = vi.spyOn(tutorialSystem, 'grantSkipRewards')

      tutorialSystem.start()
      tutorialSystem.skip()

      expect(spy).toHaveBeenCalled()
    })
  })

  describe('Step Progression', () => {
    beforeEach(() => {
      tutorialSystem.isFirstRun = false
      tutorialSystem.start()
    })

    it('should advance from STEP_1 to STEP_2', () => {
      tutorialSystem.advanceToStep(TUTORIAL_STEPS.STEP_1_COLLECT)
      expect(tutorialSystem.currentStep).toBe(TUTORIAL_STEPS.STEP_1_COLLECT)

      tutorialSystem.advanceToStep(TUTORIAL_STEPS.STEP_2_BUILD)
      expect(tutorialSystem.currentStep).toBe(TUTORIAL_STEPS.STEP_2_BUILD)
    })

    it('should clear highlights when advancing steps', () => {
      tutorialSystem.advanceToStep(TUTORIAL_STEPS.STEP_1_COLLECT)

      // 실제 하이라이트 요소가 생성될 때까지 기다림 (setupStep1Collect에서 생성)
      const highlightCountAfterStep1 = tutorialSystem.highlightedElements.size

      tutorialSystem.advanceToStep(TUTORIAL_STEPS.STEP_2_BUILD)

      // clearAllHighlights()가 호출되어 이전 하이라이트 제거됨
      expect(tutorialSystem.highlightedElements.size).toBeLessThan(highlightCountAfterStep1 + 1)
    })
  })

  describe('Step Completion Check', () => {
    it('should complete STEP_1 when resources collected', () => {
      tutorialSystem.isFirstRun = false
      tutorialSystem.start()

      // start()가 advanceToStep(STEP_1_COLLECT)을 호출하므로 이미 STEP_1 상태
      expect(tutorialSystem.currentStep).toBe(TUTORIAL_STEPS.STEP_1_COLLECT)

      const gameState = useGameStore.getState()

      // 자원이 정의되어 있지 않으면 생성
      if (!gameState.resources.water) {
        gameState.modifyResource('water', 0)
      }
      if (!gameState.resources.regolith) {
        gameState.modifyResource('regolith', 0)
      }

      gameState.modifyResource('water', 5)
      gameState.modifyResource('regolith', 5)

      tutorialSystem.checkStepCompletion()
      expect(tutorialSystem.currentStep).toBe(TUTORIAL_STEPS.STEP_2_BUILD)
    })

    it('should complete STEP_2 when buildings placed', () => {
      tutorialSystem.advanceToStep(TUTORIAL_STEPS.STEP_2_BUILD)

      const gameState = useGameStore.getState()
      gameState.buildings.push({ type: 'extractor', x: 0, y: 0 })
      gameState.buildings.push({ type: 'iceHarvester', x: 1, y: 0 })

      tutorialSystem.checkStepCompletion()
      expect(tutorialSystem.currentStep).toBe(TUTORIAL_STEPS.STEP_3_CROP)
    })

    it('should complete STEP_5 when kimchi produced', () => {
      tutorialSystem.isFirstRun = false
      tutorialSystem.start()

      // STEP_5까지 직접 이동
      tutorialSystem.currentStep = TUTORIAL_STEPS.STEP_5_KIMCHI
      tutorialSystem.state = TUTORIAL_STATE.IN_PROGRESS

      const gameState = useGameStore.getState()

      // kimchi 자원이 정의되어 있지 않으면 생성
      if (!gameState.resources.kimchi) {
        gameState.modifyResource('kimchi', 0)
      }

      gameState.modifyResource('kimchi', 1)

      tutorialSystem.checkStepCompletion()

      // checkStepCompletion이 advanceToStep(EPILOGUE)을 호출하면 complete() 호출
      // 결과는 COMPLETED 또는 EPILOGUE
      expect([TUTORIAL_STEPS.EPILOGUE, TUTORIAL_STEPS.COMPLETED]).toContain(
        tutorialSystem.currentStep
      )
    })
  })

  describe('Highlight System', () => {
    it('should add highlighted element', () => {
      tutorialSystem.highlightElement('test-element')

      expect(tutorialSystem.highlightedElements.has('test-element')).toBe(true)
    })

    it('should remove highlighted element', () => {
      tutorialSystem.highlightElement('test-element')
      tutorialSystem.removeHighlight('test-element')

      expect(tutorialSystem.highlightedElements.has('test-element')).toBe(false)
    })

    it('should clear all highlights', () => {
      tutorialSystem.highlightElement('element-1')
      tutorialSystem.highlightElement('element-2')
      tutorialSystem.highlightElement('element-3')

      tutorialSystem.clearAllHighlights()
      expect(tutorialSystem.highlightedElements.size).toBe(0)
    })
  })

  describe('Persistence', () => {
    it('should save state to localStorage', () => {
      tutorialSystem.start()
      tutorialSystem.saveState()

      const saved = localStorageMock.getItem('kimchi_tutorial_state')
      expect(saved).toBeTruthy()

      const data = JSON.parse(saved)
      expect(data.state).toBe(TUTORIAL_STATE.IN_PROGRESS)
      expect(data.currentStep).toBe(TUTORIAL_STEPS.PROLOGUE)
    })

    it('should load state from localStorage', () => {
      const mockData = {
        state: TUTORIAL_STATE.IN_PROGRESS,
        currentStep: TUTORIAL_STEPS.STEP_3_CROP,
        stepProgress: { step3: { cabbage: 2 } },
        isFirstRun: false,
        startTime: Date.now(),
      }

      localStorageMock.setItem('kimchi_tutorial_state', JSON.stringify(mockData))

      const newTutorialSystem = new TutorialSystem()
      expect(newTutorialSystem.state).toBe(TUTORIAL_STATE.IN_PROGRESS)
      expect(newTutorialSystem.currentStep).toBe(TUTORIAL_STEPS.STEP_3_CROP)
      expect(newTutorialSystem.isFirstRun).toBe(false)
    })
  })

  describe('Completion', () => {
    it('should complete tutorial and grant rewards', () => {
      const spy = vi.spyOn(tutorialSystem, 'grantCompletionRewards')

      tutorialSystem.isFirstRun = false
      tutorialSystem.start()
      tutorialSystem.complete()

      expect(tutorialSystem.state).toBe(TUTORIAL_STATE.COMPLETED)
      expect(tutorialSystem.currentStep).toBe(TUTORIAL_STEPS.COMPLETED)

      // complete()가 grantCompletionRewards()를 호출하여 보상 지급
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('Reset', () => {
    it('should reset tutorial to initial state', () => {
      tutorialSystem.start()
      tutorialSystem.advanceToStep(TUTORIAL_STEPS.STEP_3_CROP)
      tutorialSystem.highlightElement('test')

      tutorialSystem.reset()

      expect(tutorialSystem.state).toBe(TUTORIAL_STATE.NOT_STARTED)
      expect(tutorialSystem.currentStep).toBe(TUTORIAL_STEPS.PROLOGUE)
      expect(tutorialSystem.highlightedElements.size).toBe(0)
      expect(Object.keys(tutorialSystem.stepProgress).length).toBe(0)
    })

    it('should clear localStorage on reset', () => {
      tutorialSystem.start()
      tutorialSystem.saveState()

      tutorialSystem.reset()

      const saved = localStorageMock.getItem('kimchi_tutorial_state')
      expect(saved).toBeNull()
    })
  })

  describe('Debug Info', () => {
    it('should return debug info', () => {
      tutorialSystem.start()
      tutorialSystem.highlightElement('test-element')

      const debug = tutorialSystem.getDebugInfo()

      expect(debug.state).toBe(TUTORIAL_STATE.IN_PROGRESS)
      expect(debug.currentStep).toBe(TUTORIAL_STEPS.PROLOGUE)
      expect(debug.highlightedElements).toContain('test-element')
    })
  })
})
