/**
 * KIMCHI INVASION - Tutorial System
 *
 * @description 5단계 FTUE (First-Time User Experience) 시스템
 * @see /docs/05-onboarding/onboarding.md
 */

import { System } from '../ecs/System.js'
import { useGameStore } from '../state/stores/gameStore.js'
import { useUIStore } from '../state/stores/uiStore.js'
import { t } from '../i18n/index.js'
import { Graphics, Container } from 'pixi.js'
import { getGameContainer } from '../core/pixiApp.js'
import { getTileSize } from '../core/tilemap.js'
import { getTutorialUI } from '../ui/tutorialUI.js'

/**
 * 튜토리얼 단계 정의
 */
export const TUTORIAL_STEPS = {
  PROLOGUE: 'prologue',
  STEP_1_COLLECT: 'step1_collect',
  STEP_2_BUILD: 'step2_build',
  STEP_3_CROP: 'step3_crop',
  STEP_4_LOGISTICS: 'step4_logistics',
  STEP_5_KIMCHI: 'step5_kimchi',
  EPILOGUE: 'epilogue',
  COMPLETED: 'completed',
}

/**
 * 튜토리얼 상태
 */
export const TUTORIAL_STATE = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  PAUSED: 'paused',
  SKIPPED: 'skipped',
  COMPLETED: 'completed',
}

/**
 * 로컬스토리지 키
 */
const STORAGE_KEY = 'kimchi_tutorial_state'

/**
 * 튜토리얼 시스템
 *
 * @description FTUE 5단계 시퀀스 관리
 * - 단계별 목표 추적
 * - 스포트라이트/하이라이트 효과
 * - 진행 상황 저장
 * - 스킵 기능
 */
export class TutorialSystem extends System {
  constructor() {
    super()
    this.label = 'TutorialSystem'

    /** @type {string} 현재 단계 */
    this.currentStep = TUTORIAL_STEPS.PROLOGUE

    /** @type {string} 튜토리얼 상태 */
    this.state = TUTORIAL_STATE.NOT_STARTED

    /** @type {Object} 단계별 목표 진행 상황 */
    this.stepProgress = {}

    /** @type {number} 튜토리얼 시작 시각 (타임스탬프) */
    this.startTime = 0

    /** @type {Set<string>} 하이라이트 중인 요소 ID */
    this.highlightedElements = new Set()

    /** @type {Function[]} 이벤트 구독 해제 함수 */
    this.unsubscribers = []

    /** @type {boolean} 첫 실행 여부 (프롤로그 표시용) */
    this.isFirstRun = true

    /** @type {Container | null} PixiJS 하이라이트 레이어 */
    this.pixiHighlightLayer = null

    /** @type {Map<string, { graphics: Graphics, animation: Function }>} PixiJS 하이라이트 맵 */
    this.pixiHighlights = new Map()

    this.loadState()
  }

  /**
   * 시스템 업데이트
   * @param {import('../ecs/Entity.js').Entity[]} _entities - 매칭된 엔티티 (사용 안 함)
   * @param {number} deltaTime - 경과 시간 (초)
   */
  update(_entities, deltaTime) {
    if (this.state !== TUTORIAL_STATE.IN_PROGRESS) return

    // 단계별 목표 자동 체크
    this.checkStepCompletion()

    // PixiJS 하이라이트 애니메이션 업데이트
    for (const [_id, { animation }] of this.pixiHighlights.entries()) {
      if (animation) {
        animation(deltaTime)
      }
    }
  }

  /**
   * 튜토리얼 시작
   */
  start() {
    if (this.state === TUTORIAL_STATE.COMPLETED) {
      console.log('[Tutorial] Already completed, restarting...')
      this.reset()
    }

    this.state = TUTORIAL_STATE.IN_PROGRESS
    this.startTime = Date.now()
    this.currentStep = this.isFirstRun ? TUTORIAL_STEPS.PROLOGUE : TUTORIAL_STEPS.STEP_1_COLLECT

    console.log(`[Tutorial] Started at step: ${this.currentStep}`)

    // 게임 일시정지 (프롤로그 표시 중)
    if (this.isFirstRun) {
      useUIStore.getState().pause()
      this.showPrologue()
    } else {
      this.advanceToStep(TUTORIAL_STEPS.STEP_1_COLLECT)
    }

    this.saveState()
  }

  /**
   * 튜토리얼 일시정지
   */
  pause() {
    this.state = TUTORIAL_STATE.PAUSED
    this.saveState()
    console.log('[Tutorial] Paused')
  }

  /**
   * 튜토리얼 재개
   */
  resume() {
    if (this.state === TUTORIAL_STATE.PAUSED) {
      this.state = TUTORIAL_STATE.IN_PROGRESS
      console.log('[Tutorial] Resumed')
    }
  }

  /**
   * 튜토리얼 스킵
   */
  skip() {
    this.state = TUTORIAL_STATE.SKIPPED
    this.currentStep = TUTORIAL_STEPS.COMPLETED
    this.clearAllHighlights()
    this.cleanup()

    // UI 복원
    useUIStore.getState().resume()
    useUIStore.getState().closeModal()

    console.log('[Tutorial] Skipped')
    this.saveState()

    // 스킵 시 보상 (선택적)
    this.grantSkipRewards()
  }

  /**
   * 튜토리얼 완료
   */
  complete() {
    this.state = TUTORIAL_STATE.COMPLETED
    this.currentStep = TUTORIAL_STEPS.COMPLETED
    this.clearAllHighlights()

    const duration = (Date.now() - this.startTime) / 1000
    console.log(`[Tutorial] Completed in ${duration.toFixed(1)}s`)

    this.saveState()
    this.showEpilogue()

    // 완료 보상
    this.grantCompletionRewards()
  }

  /**
   * 튜토리얼 리셋
   */
  reset() {
    this.state = TUTORIAL_STATE.NOT_STARTED
    this.currentStep = TUTORIAL_STEPS.PROLOGUE
    this.stepProgress = {}
    this.highlightedElements.clear()
    this.isFirstRun = true
    this.cleanup()
    localStorage.removeItem(STORAGE_KEY)
    console.log('[Tutorial] Reset')
  }

  /**
   * 다음 단계로 진행
   * @param {string} nextStep - 다음 단계 ID
   */
  advanceToStep(nextStep) {
    this.clearAllHighlights()
    this.currentStep = nextStep

    console.log(`[Tutorial] Advancing to: ${nextStep}`)

    switch (nextStep) {
      case TUTORIAL_STEPS.STEP_1_COLLECT:
        this.setupStep1Collect()
        break
      case TUTORIAL_STEPS.STEP_2_BUILD:
        this.setupStep2Build()
        break
      case TUTORIAL_STEPS.STEP_3_CROP:
        this.setupStep3Crop()
        break
      case TUTORIAL_STEPS.STEP_4_LOGISTICS:
        this.setupStep4Logistics()
        break
      case TUTORIAL_STEPS.STEP_5_KIMCHI:
        this.setupStep5Kimchi()
        break
      case TUTORIAL_STEPS.EPILOGUE:
        this.complete()
        break
      default:
        console.warn(`[Tutorial] Unknown step: ${nextStep}`)
    }

    this.saveState()
  }

  /**
   * 단계 완료 여부 체크 (자동)
   */
  checkStepCompletion() {
    const gameState = useGameStore.getState()

    switch (this.currentStep) {
      case TUTORIAL_STEPS.STEP_1_COLLECT: {
        // 목표: 물(얼음) 5개, 레골리스 5개 수집
        // NOTE: subscribe 콜백에서도 완료 체크를 하므로 여기는 백업용
        const ice = gameState.resources.water ?? 0
        const regolith = gameState.resources.regolith ?? 0
        if (ice >= 5 && regolith >= 5) {
          this.advanceToStep(TUTORIAL_STEPS.STEP_2_BUILD)
        }
        break
      }

      case TUTORIAL_STEPS.STEP_2_BUILD: {
        // 목표: 채굴기 1개, 해동기 1개 배치
        const extractors = gameState.buildings.filter(b => b.type === 'extractor').length
        const iceHarvesters = gameState.buildings.filter(b => b.type === 'iceHarvester').length
        if (extractors >= 1 && iceHarvesters >= 1) {
          this.advanceToStep(TUTORIAL_STEPS.STEP_3_CROP)
        }
        break
      }

      case TUTORIAL_STEPS.STEP_3_CROP: {
        // 목표: 온실에서 배추 5개 재배
        const cabbages = gameState.resources.cabbage ?? 0
        if (cabbages >= 5) {
          this.advanceToStep(TUTORIAL_STEPS.STEP_4_LOGISTICS)
        }
        break
      }

      case TUTORIAL_STEPS.STEP_4_LOGISTICS: {
        // 목표: 컨베이어 벨트 연결 (최소 1개 라인)
        const conveyors = gameState.buildings.filter(b => b.type === 'conveyor').length
        if (conveyors >= 3) {
          this.advanceToStep(TUTORIAL_STEPS.STEP_5_KIMCHI)
        }
        break
      }

      case TUTORIAL_STEPS.STEP_5_KIMCHI: {
        // 목표: 김치 1캔 생산
        const kimchi = gameState.resources.kimchi ?? 0
        if (kimchi >= 1) {
          this.advanceToStep(TUTORIAL_STEPS.EPILOGUE)
        }
        break
      }

      default:
        break
    }
  }

  // ========================================================================
  // STEP SETUP METHODS
  // ========================================================================

  /**
   * STEP 1: 수동 자원 수집
   */
  setupStep1Collect() {
    this.stepProgress.step1 = { ice: 0, regolith: 0 }

    // 목표 표시
    this.showStepGoal({
      title: t('tutorial.step1.title') || '수동 자원 수집',
      description:
        t('tutorial.step1.desc') || '화면을 클릭하여 얼음 5개, 레골리스 5개를 수집하세요.',
      objectives: [
        { id: 'ice', label: '얼음', target: 5, current: 0 },
        { id: 'regolith', label: '레골리스', target: 5, current: 0 },
      ],
    })

    // 클릭 가능 영역 하이라이트 (타일맵에서 자원 노드 강조)
    this.highlightElement('tilemap-ice')
    this.highlightElement('tilemap-regolith')

    // 자원 수집 이벤트 구독
    const unsub = useGameStore.subscribe(
      state => state.resources,
      resources => {
        const ice = resources.water ?? 0
        const regolith = resources.regolith ?? 0
        this.stepProgress.step1 = { ice, regolith }
        this.updateStepGoal({
          objectives: [
            { id: 'ice', label: '얼음', target: 5, current: ice },
            { id: 'regolith', label: '레골리스', target: 5, current: regolith },
          ],
        })

        // 완료 조건 즉시 체크 (프레임 업데이트 대기 없이)
        if (
          this.currentStep === TUTORIAL_STEPS.STEP_1_COLLECT &&
          this.state === TUTORIAL_STATE.IN_PROGRESS &&
          ice >= 5 &&
          regolith >= 5
        ) {
          this.advanceToStep(TUTORIAL_STEPS.STEP_2_BUILD)
        }
      }
    )
    this.unsubscribers.push(unsub)
  }

  /**
   * STEP 2: 첫 건물 배치
   */
  setupStep2Build() {
    this.stepProgress.step2 = { extractor: 0, iceHarvester: 0 }

    this.showStepGoal({
      title: t('tutorial.step2.title') || '첫 건물 배치',
      description: t('tutorial.step2.desc') || '채굴기와 해동기를 각각 1개씩 배치하세요.',
      objectives: [
        { id: 'extractor', label: '채굴기', target: 1, current: 0 },
        { id: 'iceHarvester', label: '해동기', target: 1, current: 0 },
      ],
    })

    // 건물 메뉴 하이라이트
    this.highlightElement('build-menu')

    // 건물 배치 이벤트 구독
    const unsub = useGameStore.subscribe(
      state => state.buildings,
      buildings => {
        const extractors = buildings.filter(b => b.type === 'extractor').length
        const iceHarvesters = buildings.filter(b => b.type === 'iceHarvester').length
        this.stepProgress.step2 = { extractor: extractors, iceHarvester: iceHarvesters }
        this.updateStepGoal({
          objectives: [
            { id: 'extractor', label: '채굴기', target: 1, current: extractors },
            { id: 'iceHarvester', label: '해동기', target: 1, current: iceHarvesters },
          ],
        })
      }
    )
    this.unsubscribers.push(unsub)
  }

  /**
   * STEP 3: 첫 작물 재배
   */
  setupStep3Crop() {
    this.stepProgress.step3 = { cabbage: 0 }

    this.showStepGoal({
      title: t('tutorial.step3.title') || '첫 작물 재배',
      description: t('tutorial.step3.desc') || '온실을 배치하고 배추 5개를 재배하세요.',
      objectives: [{ id: 'cabbage', label: '배추', target: 5, current: 0 }],
    })

    this.highlightElement('build-menu-greenhouse')
  }

  /**
   * STEP 4: 물류 연결 (컨베이어)
   */
  setupStep4Logistics() {
    this.stepProgress.step4 = { conveyors: 0 }

    this.showStepGoal({
      title: t('tutorial.step4.title') || '물류 시스템',
      description: t('tutorial.step4.desc') || '컨베이어 벨트로 건물을 연결하세요.',
      objectives: [{ id: 'conveyors', label: '컨베이어 벨트', target: 3, current: 0 }],
    })

    this.highlightElement('build-menu-conveyor')
  }

  /**
   * STEP 5: 첫 김치 생산
   */
  setupStep5Kimchi() {
    this.stepProgress.step5 = { kimchi: 0 }

    this.showStepGoal({
      title: t('tutorial.step5.title') || '첫 김치 생산!',
      description:
        t('tutorial.step5.desc') || '배추 → 절임소 → 발효탱크를 연결하여 김치를 생산하세요.',
      objectives: [{ id: 'kimchi', label: '김치', target: 1, current: 0 }],
    })

    // 김치 생산 라인 하이라이트
    this.highlightElement('build-menu-fermenter')
  }

  // ========================================================================
  // UI METHODS
  // ========================================================================

  /**
   * 프롤로그 표시 (화성 착륙 씬)
   */
  showPrologue() {
    useUIStore.getState().openModal('tutorial-prologue', {
      onContinue: () => {
        this.isFirstRun = false
        useUIStore.getState().closeModal()
        useUIStore.getState().resume()
        this.advanceToStep(TUTORIAL_STEPS.STEP_1_COLLECT)
      },
      onSkip: () => {
        this.skip()
      },
    })
  }

  /**
   * 에필로그 표시 (튜토리얼 완료)
   */
  showEpilogue() {
    useUIStore.getState().openModal('tutorial-epilogue', {
      onClose: () => {
        useUIStore.getState().closeModal()
      },
    })
  }

  /**
   * 단계 목표 UI 표시
   * @param {Object} goal - { title, description, objectives }
   */
  showStepGoal(goal) {
    useUIStore.getState().openModal('tutorial-step-goal', goal)
  }

  /**
   * 단계 목표 업데이트 (진행률 표시)
   * @description DOM 직접 업데이트로 UI 즉시 반영
   * @param {Object} updates - { objectives: [...] }
   */
  updateStepGoal(updates) {
    if (updates.objectives) {
      const tutorialUI = getTutorialUI()
      tutorialUI.updateGoalProgress(updates.objectives)
    }
  }

  /**
   * 요소 하이라이트 (스포트라이트 효과)
   * @param {string} elementId - DOM 또는 PixiJS 요소 ID
   */
  highlightElement(elementId) {
    this.highlightedElements.add(elementId)

    // DOM 요소
    const domElement = document.getElementById(elementId)
    if (domElement) {
      domElement.classList.add('tutorial-highlight')
      return
    }

    // PixiJS 요소 하이라이트 (타일맵 좌표 기반)
    // elementId 형식: "tilemap-ice", "tilemap-regolith", "building-{id}"
    if (elementId.startsWith('tilemap-')) {
      this.highlightTilemapArea(elementId)
    } else if (elementId.startsWith('building-')) {
      this.highlightBuilding(elementId)
    } else {
      console.log(`[Tutorial] Highlight: ${elementId} (PixiJS 요소, 구현 필요)`)
    }
  }

  /**
   * 타일맵 영역 하이라이트 (PixiJS Graphics)
   * @param {string} elementId - 타일맵 요소 ID (예: "tilemap-ice")
   */
  highlightTilemapArea(elementId) {
    // 하이라이트 레이어가 없으면 생성
    if (!this.pixiHighlightLayer) {
      const gameContainer = getGameContainer()
      if (!gameContainer) {
        console.warn('[Tutorial] Game container not found for PixiJS highlight')
        return
      }

      this.pixiHighlightLayer = new Container()
      this.pixiHighlightLayer.label = 'tutorialHighlights'
      this.pixiHighlightLayer.zIndex = 9999 // 최상위 레이어
      gameContainer.addChild(this.pixiHighlightLayer)
    }

    // 이미 하이라이트 중이면 제거
    if (this.pixiHighlights.has(elementId)) {
      this.removeHighlight(elementId)
    }

    // 타일맵 좌표 결정 (예시: 화면 중앙 영역)
    // 실제로는 resourceSystem이나 tilemap에서 자원 노드 위치를 가져와야 함
    const tileSize = getTileSize()
    const x = 5 * tileSize // 예시 좌표
    const y = 5 * tileSize
    const width = 3 * tileSize // 3x3 영역
    const height = 3 * tileSize

    // 하이라이트 Graphics 생성
    const highlight = new Graphics()
    highlight.label = `highlight_${elementId}`
    highlight.x = x
    highlight.y = y

    // 초기 그리기 (테두리 + 반투명 오버레이)
    this.drawHighlightBox(highlight, width, height, 1.0)

    this.pixiHighlightLayer.addChild(highlight)

    // 펄스 애니메이션 함수
    let time = 0
    const animationFn = deltaTime => {
      time += deltaTime
      const alpha = 0.5 + Math.sin(time * 3) * 0.3 // 0.2 ~ 0.8
      const scale = 1.0 + Math.sin(time * 2) * 0.05 // 0.95 ~ 1.05

      highlight.scale.set(scale)
      highlight.alpha = alpha

      // 테두리 재그리기
      highlight.clear()
      this.drawHighlightBox(highlight, width / scale, height / scale, alpha)
    }

    this.pixiHighlights.set(elementId, { graphics: highlight, animation: animationFn })
  }

  /**
   * 건물 하이라이트 (PixiJS Graphics)
   * @param {string} elementId - 건물 ID (예: "building-123")
   */
  highlightBuilding(elementId) {
    // 건물 하이라이트는 buildingRenderer의 highlightBuilding 함수 사용
    const buildingId = elementId.replace('building-', '')
    // buildingRenderer.highlightBuilding(buildingId, container, true, 0xffff00)
    console.log(`[Tutorial] Highlighting building: ${buildingId} (buildingRenderer 연동 필요)`)
  }

  /**
   * 하이라이트 박스 그리기 (헬퍼)
   * @param {Graphics} graphics - Graphics 객체
   * @param {number} width - 폭
   * @param {number} height - 높이
   * @param {number} alpha - 투명도
   */
  drawHighlightBox(graphics, width, height, alpha) {
    // 반투명 오버레이
    graphics.rect(0, 0, width, height).fill({ color: 0xd32f2f, alpha: alpha * 0.2 })

    // 테두리
    graphics
      .rect(0, 0, width, height)
      .stroke({ color: 0xd32f2f, width: 4, alpha: Math.min(alpha * 1.5, 1.0) })
  }

  /**
   * 하이라이트 제거
   * @param {string} elementId
   */
  removeHighlight(elementId) {
    this.highlightedElements.delete(elementId)

    // DOM 요소 하이라이트 제거
    const domElement = document.getElementById(elementId)
    if (domElement) {
      domElement.classList.remove('tutorial-highlight')
    }

    // PixiJS 하이라이트 제거
    if (this.pixiHighlights.has(elementId)) {
      const { graphics } = this.pixiHighlights.get(elementId)
      if (this.pixiHighlightLayer) {
        this.pixiHighlightLayer.removeChild(graphics)
      }
      graphics.destroy()
      this.pixiHighlights.delete(elementId)
    }
  }

  /**
   * 모든 하이라이트 제거
   */
  clearAllHighlights() {
    this.highlightedElements.forEach(id => this.removeHighlight(id))
    this.highlightedElements.clear()

    // PixiJS 하이라이트 레이어 정리
    if (this.pixiHighlightLayer) {
      this.pixiHighlightLayer.removeChildren()
      this.pixiHighlightLayer.destroy({ children: true })
      this.pixiHighlightLayer = null
    }
    this.pixiHighlights.clear()
  }

  // ========================================================================
  // REWARDS
  // ========================================================================

  /**
   * 스킵 시 보상 지급 (선택적)
   */
  grantSkipRewards() {
    const gameState = useGameStore.getState()
    // 기본 자원 지급
    gameState.modifyResource('dollars', 500)
    gameState.modifyResource('iron', 20)
    gameState.modifyResource('water', 20)
    console.log('[Tutorial] Skip rewards granted')
  }

  /**
   * 완료 시 보상 지급
   */
  grantCompletionRewards() {
    const gameState = useGameStore.getState()
    gameState.modifyResource('dollars', 1000)
    gameState.modifyResource('iron', 50)
    // TODO: 업적 해금 ("튜토리얼 마스터")
    console.log('[Tutorial] Completion rewards granted')
  }

  // ========================================================================
  // PERSISTENCE
  // ========================================================================

  /**
   * 튜토리얼 상태 저장
   */
  saveState() {
    const data = {
      state: this.state,
      currentStep: this.currentStep,
      stepProgress: this.stepProgress,
      isFirstRun: this.isFirstRun,
      startTime: this.startTime,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  /**
   * 튜토리얼 상태 로드
   */
  loadState() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      const data = JSON.parse(saved)
      this.state = data.state ?? TUTORIAL_STATE.NOT_STARTED
      this.currentStep = data.currentStep ?? TUTORIAL_STEPS.PROLOGUE
      this.stepProgress = data.stepProgress ?? {}
      this.isFirstRun = data.isFirstRun ?? true
      this.startTime = data.startTime ?? 0

      console.log(`[Tutorial] State loaded: ${this.state}, step: ${this.currentStep}`)
    } catch (err) {
      console.error('[Tutorial] Failed to load state:', err)
    }
  }

  /**
   * 시스템 정리 (이벤트 구독 해제)
   */
  cleanup() {
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []
  }

  /**
   * 디버그 정보
   */
  getDebugInfo() {
    return {
      state: this.state,
      currentStep: this.currentStep,
      stepProgress: this.stepProgress,
      highlightedElements: Array.from(this.highlightedElements),
    }
  }
}

/**
 * 싱글톤 인스턴스
 */
export const tutorialSystem = new TutorialSystem()

/**
 * 튜토리얼 자동 시작 체크
 * @description 게임 시작 시 튜토리얼 미완료 시 자동 시작
 */
export function checkAutoStartTutorial() {
  if (
    tutorialSystem.state === TUTORIAL_STATE.NOT_STARTED ||
    tutorialSystem.state === TUTORIAL_STATE.IN_PROGRESS
  ) {
    console.log('[Tutorial] Auto-starting tutorial...')
    tutorialSystem.start()
    return true
  }
  return false
}
