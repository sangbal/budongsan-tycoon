/**
 * KIMCHI INVASION - Building Renderer
 *
 * @description buildingSystem과 buildingSprites를 연결하는 렌더링 레이어
 * @module ui/buildingRenderer
 */

import { buildingSystem } from '../systems/buildingSystem.js'
import {
  initBuildingSprites,
  renderBuilding,
  removeBuilding,
  upgradeBuilding,
  updateBuildingProgress,
  highlightBuilding,
  markNoPower,
} from './buildingSprites.js'
import { getGameContainer } from '../core/pixiApp.js'
import { Container } from 'pixi.js'
import { powerSystem } from '../systems/powerSystem.js'
import { resourceSystem } from '../systems/resourceSystem.js'
import { BUILDINGS } from '../data/buildings.js'

/**
 * 건물 레이어 (타일맵 위)
 * @type {Container | null}
 */
let buildingLayer = null

/**
 * 현재 선택된 건물 ID
 * @type {string | null}
 */
let selectedBuildingId = null

/**
 * 현재 호버된 건물 ID
 * @type {string | null}
 */
let hoveredBuildingId = null

/**
 * 이벤트 핸들러 저장소 (해제용)
 * @type {{ placed: Function, removed: Function, upgraded: Function, productionComplete: Function } | null}
 */
let eventHandlers = null

/**
 * 건물 렌더러 초기화
 */
export function initBuildingRenderer() {
  console.log('[BuildingRenderer] Initializing...')

  // 타일 크기 초기화
  initBuildingSprites()

  // 건물 레이어 생성
  const gameContainer = getGameContainer()
  if (!gameContainer) {
    console.error('[BuildingRenderer] Game container not found')
    return
  }

  buildingLayer = new Container()
  buildingLayer.label = 'buildings'
  buildingLayer.sortableChildren = true // Z-index 지원
  gameContainer.addChild(buildingLayer)

  // buildingSystem 이벤트 리스너 등록
  setupEventListeners()

  // 기존 건물 렌더링 (저장된 게임 로드 시)
  renderExistingBuildings()

  console.log('[BuildingRenderer] Initialized')
}

/**
 * 기존 건물 렌더링 (게임 로드 시)
 */
function renderExistingBuildings() {
  const buildings = buildingSystem.getAllBuildings()

  for (const building of buildings) {
    renderBuilding(building, building.x, building.y, buildingLayer)
  }

  console.log(`[BuildingRenderer] Rendered ${buildings.length} existing buildings`)
}

/**
 * buildingSystem 이벤트 리스너 설정
 */
function setupEventListeners() {
  // 핸들러 저장 (해제용)
  eventHandlers = {
    placed: ({ building, x, y }) => {
      renderBuilding(building, x, y, buildingLayer)
    },
    removed: ({ buildingId }) => {
      removeBuilding(buildingId, buildingLayer)

      // 선택 상태 해제
      if (selectedBuildingId === buildingId) {
        selectedBuildingId = null
      }
      if (hoveredBuildingId === buildingId) {
        hoveredBuildingId = null
      }
    },
    upgraded: ({ buildingId, newLevel }) => {
      const building = buildingSystem.getBuilding(buildingId)
      if (!building) return

      upgradeBuilding(buildingId, building.type, newLevel, buildingLayer)
    },
    productionComplete: ({ buildingId }) => {
      updateBuildingProgress(buildingId, 0, buildingLayer)
    },
  }

  // 이벤트 리스너 등록
  buildingSystem.on('placed', eventHandlers.placed)
  buildingSystem.on('removed', eventHandlers.removed)
  buildingSystem.on('upgraded', eventHandlers.upgraded)
  buildingSystem.on('productionComplete', eventHandlers.productionComplete)
}

/**
 * 건물 진행률 업데이트 (매 프레임 호출)
 * @param {number} _deltaTime - 사용하지 않음 (향후 확장용)
 */
export function updateBuildingRenderer(_deltaTime) {
  // 모든 건물의 진행률 바 업데이트
  const buildings = buildingSystem.getAllBuildings()

  for (const building of buildings) {
    // 진행률 바 업데이트
    if (building.progress > 0) {
      updateBuildingProgress(building.id, building.progress, buildingLayer)
    }

    // 에너지 부족 건물 표시 (빨간색 테두리)
    const def = BUILDINGS[building.type]
    if (def && def.energyPerTick > 0) {
      // 에너지 소비 건물만 체크
      const canOperate = powerSystem.canOperate(building)
      markNoPower(building.id, buildingLayer, !canOperate)
    }

    // 입력 자원 부족 건물 표시
    if (def && def.input) {
      let hasAllInputs = true
      for (const [resourceType, amount] of Object.entries(def.input)) {
        if (!resourceSystem.has(resourceType, amount)) {
          hasAllInputs = false
          break
        }
      }
      // 입력 자원 부족 시 노란색 경고 표시 (향후 확장: 별도 표시 함수 추가 가능)
      if (!hasAllInputs) {
        // 현재는 markNoPower로 통합 표시 (빨간색)
        // 향후 markNoInput() 함수를 추가하여 노란색으로 구분 가능
        markNoPower(building.id, buildingLayer, true)
      }
    }
  }
}

/**
 * 건물 선택
 * @param {string} buildingId - 건물 ID
 */
export function selectBuilding(buildingId) {
  // 이전 선택 해제
  if (selectedBuildingId) {
    highlightBuilding(selectedBuildingId, buildingLayer, false)
  }

  // 새 선택
  selectedBuildingId = buildingId
  if (buildingId) {
    highlightBuilding(buildingId, buildingLayer, true, 0xffff00) // 노랑
  }
}

/**
 * 건물 호버
 * @param {string} buildingId - 건물 ID
 */
export function hoverBuilding(buildingId) {
  // 이전 호버 해제
  if (hoveredBuildingId && hoveredBuildingId !== selectedBuildingId) {
    highlightBuilding(hoveredBuildingId, buildingLayer, false)
  }

  // 새 호버
  hoveredBuildingId = buildingId
  if (buildingId && buildingId !== selectedBuildingId) {
    highlightBuilding(buildingId, buildingLayer, true, 0xaaaaaa) // 회색
  }
}

/**
 * 건물 선택 해제
 */
export function deselectBuilding() {
  if (selectedBuildingId) {
    highlightBuilding(selectedBuildingId, buildingLayer, false)
    selectedBuildingId = null
  }
}

/**
 * 현재 선택된 건물 ID 가져오기
 * @returns {string | null}
 */
export function getSelectedBuildingId() {
  return selectedBuildingId
}

/**
 * 건물 레이어 가져오기 (디버깅용)
 * @returns {Container | null}
 */
export function getBuildingLayer() {
  return buildingLayer
}

/**
 * 건물 렌더러 정리
 */
export function destroyBuildingRenderer() {
  // 이벤트 리스너 해제
  if (eventHandlers) {
    buildingSystem.off('placed', eventHandlers.placed)
    buildingSystem.off('removed', eventHandlers.removed)
    buildingSystem.off('upgraded', eventHandlers.upgraded)
    buildingSystem.off('productionComplete', eventHandlers.productionComplete)
    eventHandlers = null
  }

  if (buildingLayer) {
    buildingLayer.destroy({ children: true })
    buildingLayer = null
  }

  selectedBuildingId = null
  hoveredBuildingId = null
}

// 디버깅용 전역 노출 (개발 환경)
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.buildingRenderer = {
    selectBuilding,
    deselectBuilding,
    getSelectedBuildingId,
    getBuildingLayer,
  }
}
