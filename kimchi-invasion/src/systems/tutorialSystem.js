/**
 * KIMCHI INVASION - Tutorial System (Rebuild)
 *
 * @description 6단계 FTUE 시스템 - "10분 안에 김치" 목표
 * @see docs/05-onboarding/onboarding.md
 *
 * 핵심 원칙:
 * 1. "10분 안에 김치" - 빠른 목표 달성으로 리텐션 확보
 * 2. "자원 지급 없음" - 직접 채굴/생산하는 성취감
 * 3. "튜토리얼 모드" - 비용/속도 조정으로 좌절 최소화
 * 4. "물류는 나중에" - 튜토리얼 범위 최소화, 핵심만 학습
 */

import { System } from '../ecs/System.js'
import { useGameStore } from '../state/stores/gameStore.js'
import { useUIStore } from '../state/stores/uiStore.js'
import { t } from '../i18n/index.js'
import { Graphics, Container } from 'pixi.js'
import { getGameContainer } from '../core/pixiApp.js'
import { getTileSize } from '../core/tilemap.js'
import { getTutorialUI } from '../ui/tutorialUI.js'
import { buildingSystem } from './buildingSystem.js'

/**
 * 새로운 튜토리얼 단계 정의 (6단계 + 에필로그)
 *
 * Phase A: 손으로 느끼기 (3분)
 *   STEP 0 → STEP 1 → STEP 2
 *   (착륙)   (채굴)   (제련)
 *
 * Phase B: 자동화의 맛 (3분)
 *   STEP 3 → STEP 4
 *   (채굴기)  (얼음+온실)
 *
 * Phase C: 김치 완성 (4분)
 *   STEP 5 → EPILOGUE
 *   (김치!)  (자유플레이)
 */
export const TUTORIAL_STEPS = {
  // Phase A: 손으로 느끼기
  STEP_0_PROLOGUE: 'step0_prologue', // 화성 착륙 (30초)
  STEP_1_MINING: 'step1_mining', // 첫 채굴 - ironOre 10개 (1분)
  STEP_2_SMELTING: 'step2_smelting', // 첫 가공 - ironPlate 5개 (1분30초)

  // Phase B: 자동화의 맛
  STEP_3_EXTRACTOR: 'step3_extractor', // 첫 건물 - 채굴기 (2분)
  STEP_4_GREENHOUSE: 'step4_greenhouse', // 얼음 + 온실 (2분)

  // Phase C: 김치 완성
  STEP_5_KIMCHI: 'step5_kimchi', // 첫 김치! (3분)
  EPILOGUE: 'epilogue', // 튜토리얼 완료 (30초)
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
 * 튜토리얼 모드 비용 조정표
 * @type {Object.<string, Object.<string, number>>}
 */
export const TUTORIAL_COSTS = {
  extractor: { ironPlate: 5 }, // 일반: 30 → 튜토리얼: 5 (17%)
  greenhouse: { ironPlate: 10 }, // 일반: 40 + sand 20 → 튜토리얼: 10 (25%)
  fermentationChamber: { ironPlate: 15 }, // 일반: 80 → 튜토리얼: 15 (19%)
}

/**
 * 튜토리얼 모드 속도 조정표 (초)
 * @type {Object.<string, number>}
 */
export const TUTORIAL_TIMES = {
  furnace: 3, // 일반: 15초 → 튜토리얼: 3초 (20%)
  greenhouse: 10, // 일반: 30초 → 튜토리얼: 10초 (33%)
  fermentationChamber: 10, // 일반: 60초 → 튜토리얼: 10초 (17%)
}

/**
 * 로컬스토리지 키
 */
const STORAGE_KEY = 'kimchi_tutorial_state'

/**
 * 튜토리얼 시스템
 *
 * @description 6단계 FTUE 시퀀스 관리
 * - 자원 자동 지급 없음
 * - 완전 무자원 상태에서 시작 (초기 용광로 1개만 제공)
 * - 채굴 → 가공 → 건설 → 생산의 핵심 루프 학습
 * - 10분 내 첫 김치 생산 달성
 */
export class TutorialSystem extends System {
  constructor() {
    super()
    this.label = 'TutorialSystem'

    /** @type {string} 현재 단계 */
    this.currentStep = TUTORIAL_STEPS.STEP_0_PROLOGUE

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
    this.currentStep = this.isFirstRun
      ? TUTORIAL_STEPS.STEP_0_PROLOGUE
      : TUTORIAL_STEPS.STEP_1_MINING

    // 튜토리얼 모드 활성화
    useGameStore.getState().enterTutorialMode()

    console.log(`[Tutorial] Started at step: ${this.currentStep}`)

    // 게임 일시정지 (프롤로그 표시 중)
    if (this.isFirstRun) {
      useUIStore.getState().pause()
      this.showPrologue()
    } else {
      this.advanceToStep(TUTORIAL_STEPS.STEP_1_MINING)
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

    // 튜토리얼 모드 해제
    useGameStore.getState().exitTutorialMode()

    // UI 복원
    useUIStore.getState().resume()
    useUIStore.getState().closeModal()

    console.log('[Tutorial] Skipped')
    this.saveState()

    // 스킵 시 기본 자원 지급 (건물 건설용)
    this.grantSkipRewards()
  }

  /**
   * 튜토리얼 완료
   */
  complete() {
    this.state = TUTORIAL_STATE.COMPLETED
    this.currentStep = TUTORIAL_STEPS.COMPLETED
    this.clearAllHighlights()

    // 튜토리얼 모드 해제 (정상 비용/속도로 전환)
    useGameStore.getState().exitTutorialMode()

    const duration = (Date.now() - this.startTime) / 1000
    console.log(`[Tutorial] Completed in ${duration.toFixed(1)}s`)

    this.saveState()
    this.showEpilogue()

    // 완료 보상 (업적 해금 등)
    this.grantCompletionRewards()
  }

  /**
   * 튜토리얼 리셋
   */
  reset() {
    this.state = TUTORIAL_STATE.NOT_STARTED
    this.currentStep = TUTORIAL_STEPS.STEP_0_PROLOGUE
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
    // 이전 단계의 모든 구독 해제
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []

    this.clearAllHighlights()
    this.currentStep = nextStep

    console.log(`[Tutorial] Advancing to: ${nextStep}`)

    switch (nextStep) {
      case TUTORIAL_STEPS.STEP_1_MINING:
        this.setupStep1Mining()
        break
      case TUTORIAL_STEPS.STEP_2_SMELTING:
        this.setupStep2Smelting()
        break
      case TUTORIAL_STEPS.STEP_3_EXTRACTOR:
        this.setupStep3Extractor()
        break
      case TUTORIAL_STEPS.STEP_4_GREENHOUSE:
        this.setupStep4Greenhouse()
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
      case TUTORIAL_STEPS.STEP_1_MINING: {
        // 목표: ironOre 10개 채굴
        const ironOre = gameState.resources.ironOre ?? 0
        if (ironOre >= 10) {
          this.advanceToStep(TUTORIAL_STEPS.STEP_2_SMELTING)
        }
        break
      }

      case TUTORIAL_STEPS.STEP_2_SMELTING: {
        // 목표: ironPlate 5개 획득
        const ironPlate = gameState.resources.ironPlate ?? 0
        if (ironPlate >= 5) {
          this.advanceToStep(TUTORIAL_STEPS.STEP_3_EXTRACTOR)
        }
        break
      }

      case TUTORIAL_STEPS.STEP_3_EXTRACTOR: {
        // 목표: 채굴기 1개 배치 + 자동 생산 확인
        const extractors = gameState.buildings.filter(b => b.type === 'extractor').length
        if (extractors >= 1) {
          // 채굴기 배치 후 3초 대기 (자동 생산 확인)
          if (!this.stepProgress.step3?.waitStart) {
            this.stepProgress.step3 = { waitStart: Date.now() }
          }
          const elapsed = Date.now() - this.stepProgress.step3.waitStart
          if (elapsed >= 3000) {
            this.advanceToStep(TUTORIAL_STEPS.STEP_4_GREENHOUSE)
          }
        }
        break
      }

      case TUTORIAL_STEPS.STEP_4_GREENHOUSE: {
        // 목표: 온실 건설 + 배추 1개 수확
        const cabbages = gameState.resources.cabbage ?? 0
        if (cabbages >= 1) {
          this.advanceToStep(TUTORIAL_STEPS.STEP_5_KIMCHI)
        }
        break
      }

      case TUTORIAL_STEPS.STEP_5_KIMCHI: {
        // 목표: 김치 1개 생산
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
  // STEP SETUP METHODS (자원 지급 없음!)
  // ========================================================================

  /**
   * 초기 용광로 배치 (튜토리얼 시작 시 1회)
   * @description 게임 초기화 시 용광로 1개를 배치하여 첫 가공 학습 지원
   */
  placeInitialFurnace() {
    const gameState = useGameStore.getState()
    if (gameState.tutorialFurnacePlaced) {
      return // 이미 배치됨
    }

    // 맵 중앙 근처에 용광로 배치 (5, 5)
    const furnaceX = 5
    const furnaceY = 5

    // buildingSystem을 통해 배치 (비용 무시)
    const furnace = {
      id: `tutorial_furnace_${Date.now()}`,
      type: 'furnace',
      x: furnaceX,
      y: furnaceY,
      level: 1,
      inventory: {},
      progress: 0,
      isTutorialBuilding: true, // 튜토리얼 건물 마커
    }

    // 직접 상태에 추가 (비용 차감 없이)
    gameState.addBuilding(furnace)
    gameState.setTutorialFurnacePlaced()

    console.log(`[Tutorial] Initial furnace placed at (${furnaceX}, ${furnaceY})`)
  }

  /**
   * STEP 1: 첫 채굴 - ironOre 10개
   * @description "바위를 클릭해서 철광석을 모으세요"
   */
  setupStep1Mining() {
    this.stepProgress.step1 = { ironOre: 0 }

    // 초기 용광로 배치
    this.placeInitialFurnace()

    // 목표 표시
    this.showStepGoal({
      title: t('tutorial.step1.title') || '첫 채굴',
      description: t('tutorial.step1.desc') || '바위 타일을 클릭해서 철광석 10개를 수집하세요.',
      objectives: [{ id: 'ironOre', label: '철광석', target: 10, current: 0 }],
      stepNumber: 1,
      totalSteps: 5,
    })

    // 바위 타일 하이라이트
    this.highlightElement('tilemap-rock')

    // 자원 수집 이벤트 구독
    const unsub = useGameStore.subscribe(
      state => state.resources,
      resources => {
        const ironOre = resources.ironOre ?? 0
        this.stepProgress.step1 = { ironOre }
        this.updateStepGoal({
          objectives: [{ id: 'ironOre', label: '철광석', target: 10, current: ironOre }],
        })
      }
    )
    this.unsubscribers.push(unsub)
  }

  /**
   * STEP 2: 첫 가공 - ironPlate 5개
   * @description "철광석을 용광로에 넣어 철판을 만드세요"
   * @note 초기 용광로가 이미 배치되어 있음
   */
  setupStep2Smelting() {
    this.stepProgress.step2 = { ironPlate: 0 }

    // 목표 표시
    this.showStepGoal({
      title: t('tutorial.step2.title') || '첫 제련',
      description:
        t('tutorial.step2.desc') ||
        '철광석을 용광로에 넣어 철판 5개를 만드세요.\n(용광로를 클릭하고 철광석을 투입)',
      objectives: [{ id: 'ironPlate', label: '철판', target: 5, current: 0 }],
      stepNumber: 2,
      totalSteps: 5,
    })

    // 용광로 하이라이트
    this.highlightElement('building-furnace')

    // 자원 변화 구독
    const unsub = useGameStore.subscribe(
      state => state.resources,
      resources => {
        const ironPlate = resources.ironPlate ?? 0
        this.stepProgress.step2 = { ironPlate }
        this.updateStepGoal({
          objectives: [{ id: 'ironPlate', label: '철판', target: 5, current: ironPlate }],
        })
      }
    )
    this.unsubscribers.push(unsub)
  }

  /**
   * STEP 3: 첫 건물 - 채굴기
   * @description "채굴기를 건설하여 자동 채굴을 경험하세요"
   * @note 튜토리얼 모드: 비용 30 → 5
   */
  setupStep3Extractor() {
    this.stepProgress.step3 = { extractor: 0 }

    // 목표 표시
    this.showStepGoal({
      title: t('tutorial.step3.title') || '첫 건물',
      description:
        t('tutorial.step3.desc') ||
        '건물 메뉴에서 채굴기를 선택하고 바위 근처에 배치하세요.\n(튜토리얼 할인: 철판 5개)',
      objectives: [{ id: 'extractor', label: '채굴기', target: 1, current: 0 }],
      stepNumber: 3,
      totalSteps: 5,
    })

    // 건물 메뉴 하이라이트
    this.highlightElement('build-menu')

    // 건물 배치 구독
    const unsub = useGameStore.subscribe(
      state => state.buildings,
      buildings => {
        const extractors = buildings.filter(b => b.type === 'extractor').length
        this.stepProgress.step3 = { ...this.stepProgress.step3, extractor: extractors }
        this.updateStepGoal({
          objectives: [{ id: 'extractor', label: '채굴기', target: 1, current: extractors }],
        })
      }
    )
    this.unsubscribers.push(unsub)
  }

  /**
   * STEP 4: 얼음 + 온실
   * @description "얼음을 채굴하고 온실을 건설하세요"
   * @note 튜토리얼 모드: 온실 비용 40+20 → 10
   */
  setupStep4Greenhouse() {
    this.stepProgress.step4 = { cabbage: 0 }

    // 목표 표시
    this.showStepGoal({
      title: t('tutorial.step4.title') || '온실 건설',
      description:
        t('tutorial.step4.desc') ||
        '얼음 타일을 클릭해 얼음을 모으고, 온실을 건설하여 배추를 재배하세요.\n(튜토리얼 할인: 철판 10개)',
      objectives: [{ id: 'cabbage', label: '배추', target: 1, current: 0 }],
      stepNumber: 4,
      totalSteps: 5,
    })

    // 얼음 타일 하이라이트
    this.highlightElement('tilemap-ice')

    // 자원 변화 구독
    const unsub = useGameStore.subscribe(
      state => state.resources,
      resources => {
        const cabbage = resources.cabbage ?? 0
        this.stepProgress.step4 = { cabbage }
        this.updateStepGoal({
          objectives: [{ id: 'cabbage', label: '배추', target: 1, current: cabbage }],
        })
      }
    )
    this.unsubscribers.push(unsub)
  }

  /**
   * STEP 5: 첫 김치!
   * @description "배추와 양념으로 김치를 만드세요"
   * @note 양념 1개 제공 (복잡한 양념 체인 생략)
   */
  setupStep5Kimchi() {
    this.stepProgress.step5 = { kimchi: 0 }

    // 양념 1개 제공 (튜토리얼 특별 지급 - 양념 체인 생략)
    useGameStore.getState().modifyResource('chilliPowder', 1)
    useGameStore.getState().modifyResource('salt', 2)
    console.log('[Tutorial] Step 5: Provided seasoning (chilliPowder: 1, salt: 2)')

    // 목표 표시
    this.showStepGoal({
      title: t('tutorial.step5.title') || '첫 김치!',
      description:
        t('tutorial.step5.desc') ||
        '발효실을 건설하고 배추, 양념, 고춧가루로 김치를 만드세요!\n(튜토리얼 할인: 철판 15개)',
      objectives: [{ id: 'kimchi', label: '김치', target: 1, current: 0 }],
      stepNumber: 5,
      totalSteps: 5,
    })

    // 발효실 하이라이트
    this.highlightElement('build-menu-fermenter')

    // 김치 생산 구독
    const unsub = useGameStore.subscribe(
      state => state.resources,
      resources => {
        const kimchi = resources.kimchi ?? 0
        this.stepProgress.step5 = { kimchi }
        this.updateStepGoal({
          objectives: [{ id: 'kimchi', label: '김치', target: 1, current: kimchi }],
        })
      }
    )
    this.unsubscribers.push(unsub)
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
        this.advanceToStep(TUTORIAL_STEPS.STEP_1_MINING)
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
   * @param {Object} goal - { title, description, objectives, stepNumber, totalSteps }
   */
  showStepGoal(goal) {
    useUIStore.getState().openModal('tutorial-step-goal', goal)
  }

  /**
   * 단계 목표 업데이트 (진행률 표시)
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

    // PixiJS 요소 하이라이트
    if (elementId.startsWith('tilemap-')) {
      this.highlightTilemapArea(elementId)
    } else if (elementId.startsWith('building-')) {
      this.highlightBuilding(elementId)
    } else {
      console.log(`[Tutorial] Highlight: ${elementId} (PixiJS 요소)`)
    }
  }

  /**
   * 타일맵 영역 하이라이트 (PixiJS Graphics)
   * @param {string} elementId - 타일맵 요소 ID (예: "tilemap-rock", "tilemap-ice")
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
      this.pixiHighlightLayer.zIndex = 9999
      gameContainer.addChild(this.pixiHighlightLayer)
    }

    // 이미 하이라이트 중이면 제거
    if (this.pixiHighlights.has(elementId)) {
      this.removeHighlight(elementId)
    }

    const tileSize = getTileSize()
    const x = 5 * tileSize
    const y = 5 * tileSize
    const width = 3 * tileSize
    const height = 3 * tileSize

    const highlight = new Graphics()
    highlight.label = `highlight_${elementId}`
    highlight.x = x
    highlight.y = y

    this.drawHighlightBox(highlight, width, height, 1.0)

    this.pixiHighlightLayer.addChild(highlight)

    let time = 0
    const animationFn = deltaTime => {
      time += deltaTime
      const alpha = 0.5 + Math.sin(time * 3) * 0.3
      const scale = 1.0 + Math.sin(time * 2) * 0.05

      highlight.scale.set(scale)
      highlight.alpha = alpha

      highlight.clear()
      this.drawHighlightBox(highlight, width / scale, height / scale, alpha)
    }

    this.pixiHighlights.set(elementId, { graphics: highlight, animation: animationFn })
  }

  /**
   * 건물 하이라이트 (PixiJS Graphics)
   * @param {string} elementId - 건물 ID (예: "building-furnace")
   */
  highlightBuilding(elementId) {
    const buildingType = elementId.replace('building-', '')
    console.log(`[Tutorial] Highlighting building type: ${buildingType}`)
  }

  /**
   * 하이라이트 박스 그리기
   * @param {Graphics} graphics - Graphics 객체
   * @param {number} width - 폭
   * @param {number} height - 높이
   * @param {number} alpha - 투명도
   */
  drawHighlightBox(graphics, width, height, alpha) {
    graphics.rect(0, 0, width, height).fill({ color: 0xd32f2f, alpha: alpha * 0.2 })

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

    const domElement = document.getElementById(elementId)
    if (domElement) {
      domElement.classList.remove('tutorial-highlight')
    }

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
   * 스킵 시 보상 지급
   * @description 스킵 시에만 자원 지급 (정상 플레이 시 자원 지급 없음)
   */
  grantSkipRewards() {
    const gameState = useGameStore.getState()
    gameState.modifyResource('ironPlate', 100)
    gameState.modifyResource('ironOre', 50)
    gameState.modifyResource('sand', 50)
    gameState.modifyResource('water', 30)
    console.log(
      '[Tutorial] Skip rewards granted (ironPlate: 100, ironOre: 50, sand: 50, water: 30)'
    )
  }

  /**
   * 완료 시 보상 지급
   * @description 첫 김치 생산 성공 보상
   */
  grantCompletionRewards() {
    // 자원 보상 없음 (자원 지급 없음 원칙)
    // 업적 해금만 처리
    console.log('[Tutorial] Completion: Achievement "화성 김치 마스터" unlocked!')
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
      this.currentStep = data.currentStep ?? TUTORIAL_STEPS.STEP_0_PROLOGUE
      this.stepProgress = data.stepProgress ?? {}
      this.isFirstRun = data.isFirstRun ?? true
      this.startTime = data.startTime ?? 0

      console.log(`[Tutorial] State loaded: ${this.state}, step: ${this.currentStep}`)
    } catch (err) {
      console.error('[Tutorial] Failed to load state:', err)
    }
  }

  /**
   * 시스템 정리
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
      isTutorialMode: useGameStore.getState().isTutorialMode,
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

// ========================================================================
// TUTORIAL MODE HELPERS
// ========================================================================

/**
 * 튜토리얼 모드 건설 비용 조회
 * @param {string} buildingId - 건물 ID
 * @returns {Object|null} 튜토리얼 비용 또는 null (일반 비용 사용)
 */
export function getTutorialCost(buildingId) {
  const gameState = useGameStore.getState()
  if (!gameState.isTutorialMode) {
    return null // 일반 비용 사용
  }
  return TUTORIAL_COSTS[buildingId] ?? null
}

/**
 * 튜토리얼 모드 가공 시간 조회
 * @param {string} buildingType - 건물 타입
 * @returns {number|null} 튜토리얼 시간(초) 또는 null (일반 시간 사용)
 */
export function getTutorialTime(buildingType) {
  const gameState = useGameStore.getState()
  if (!gameState.isTutorialMode) {
    return null // 일반 시간 사용
  }
  return TUTORIAL_TIMES[buildingType] ?? null
}
