/**
 * KIMCHI INVASION - UI Module Index
 *
 * Handles all UI rendering and interactions.
 */

import { getUIContainer, getGameContainer } from '../core/pixiApp.js'
import { initResourceBar } from './resourceBar.js'
import { getClickEffect } from './clickEffect.js'
import { clickMiningSystem } from '../systems/clickMining.js'
import { createBuildMenu } from './buildMenu.js'
import {
  initBuildingRenderer,
  updateBuildingRenderer,
  destroyBuildingRenderer,
} from './buildingRenderer.js'
import { createResearchUI } from './researchUI.js'
import { initTutorialUI, destroyTutorialUI } from './tutorialUI.js'
import { initSettingsMenu, destroySettingsMenu } from './settingsMenu.js'

// UI components will be imported here as they are developed
// import { initToolbar } from './toolbar.js';
// import { initSidePanel } from './sidePanel.js';
// import { initModals } from './modals.js';

/** @type {import('./resourceBar.js').ResourceBar | null} */
let resourceBar = null

/** @type {import('./clickEffect.js').ClickEffect | null} */
let clickEffect = null

/** @type {import('./buildMenu.js').BuildMenu | null} */
let buildMenu = null

/** @type {import('./researchUI.js').ResearchUI | null} */
let researchUI = null

/** @type {Function | null} */
let unsubscribeMined = null

/**
 * Initialize all UI components
 */
export async function initUI() {
  console.log('[UI] Initializing UI components...')

  const uiContainer = getUIContainer()
  if (!uiContainer) {
    throw new Error('[UI] PixiJS UI container not found')
  }

  const gameContainer = getGameContainer()
  if (!gameContainer) {
    throw new Error('[UI] PixiJS game container not found')
  }

  // Initialize ResourceBar
  resourceBar = initResourceBar(uiContainer, {
    x: 10,
    y: 10,
  })

  // Initialize ClickEffect (게임 레이어에 추가, UI 요소보다 아래)
  clickEffect = getClickEffect()
  gameContainer.addChild(clickEffect)

  // 채굴 이벤트 구독
  unsubscribeMined = clickMiningSystem.on('mined', ({ resourceId, amount, tileX, tileY }) => {
    if (clickEffect) {
      clickEffect.showFloating(resourceId, amount, tileX, tileY)
    }
  })

  console.log('[UI] Click effect system initialized')

  // Initialize BuildMenu
  buildMenu = createBuildMenu(uiContainer, gameContainer)
  console.log('[UI] Build menu initialized')

  // Initialize BuildingRenderer (건물 스프라이트 시스템)
  initBuildingRenderer()
  console.log('[UI] Building renderer initialized')

  // Initialize ResearchUI (DOM-based)
  try {
    researchUI = createResearchUI()
    researchUI.hide() // 초기에는 숨김
    console.log('[UI] Research UI initialized')
  } catch (err) {
    console.warn('[UI] Failed to initialize Research UI:', err.message)
    researchUI = null
  }

  // Initialize TutorialUI (DOM-based)
  try {
    initTutorialUI()
    console.log('[UI] Tutorial UI initialized')
  } catch (err) {
    console.warn('[UI] Failed to initialize Tutorial UI:', err.message)
  }

  // Initialize SettingsMenu (DOM-based)
  try {
    initSettingsMenu()
    console.log('[UI] Settings menu initialized')
  } catch (err) {
    console.warn('[UI] Failed to initialize Settings menu:', err.message)
  }

  // TODO: Initialize other components
  // await initToolbar();
  // await initSidePanel();
  // await initModals();

  console.log('[UI] All UI components initialized')
}

/**
 * Update UI (called every frame)
 * @param {number} deltaTime - 경과 시간 (초)
 */
export function updateUI(deltaTime) {
  // Update click effects animation
  if (clickEffect) {
    clickEffect.update(deltaTime)
  }

  // Update building renderer (진행률 바 등)
  updateBuildingRenderer(deltaTime)

  // TODO: Update other components based on state
  // updateResourceBar(state.resources);
  // updateToolbar(state);
}

/**
 * Show a modal dialog
 */
export function showModal(modalId, data = {}) {
  const container = document.getElementById('modal-container')
  if (container) {
    container.classList.remove('hidden')
    // TODO: Render modal content
  }
}

/**
 * Hide the modal dialog
 */
export function hideModal() {
  const container = document.getElementById('modal-container')
  if (container) {
    container.classList.add('hidden')
    container.innerHTML = ''
  }
}

/**
 * Toggle side panel visibility
 */
export function toggleSidePanel(show = null) {
  const panel = document.getElementById('side-panel')
  if (!panel) return

  if (show === null) {
    panel.classList.toggle('hidden')
  } else if (show) {
    panel.classList.remove('hidden')
  } else {
    panel.classList.add('hidden')
  }
}

/**
 * Show a toast notification
 */
export function showToast(message, type = 'info', duration = 3000) {
  // TODO: Implement toast notifications
  console.log(`[Toast] ${type}: ${message}`)
}

/**
 * Cleanup UI components
 */
export function cleanupUI() {
  // Unsubscribe from events
  if (unsubscribeMined) {
    unsubscribeMined()
    unsubscribeMined = null
  }

  // Cleanup click effects
  if (clickEffect) {
    clickEffect.cleanup()
    clickEffect = null
  }

  // Cleanup build menu
  if (buildMenu) {
    buildMenu.destroy()
    buildMenu = null
  }

  // Cleanup research UI
  if (researchUI) {
    researchUI.destroy()
    researchUI = null
  }

  // Cleanup building renderer
  destroyBuildingRenderer()

  // Cleanup tutorial UI
  destroyTutorialUI()

  // Cleanup settings menu
  destroySettingsMenu()

  resourceBar = null

  console.log('[UI] Cleaned up')
}

/**
 * 연구 패널 토글
 */
export function toggleResearchPanel() {
  if (researchUI) {
    researchUI.toggle()
  }
}

/**
 * 연구 패널 표시
 */
export function showResearchPanel() {
  if (researchUI) {
    researchUI.show()
  }
}

/**
 * 연구 패널 숨김
 */
export function hideResearchPanel() {
  if (researchUI) {
    researchUI.hide()
  }
}

/**
 * 설정 메뉴 열기
 */
export { openSettingsMenu, closeSettingsMenu, toggleSettingsMenu } from './settingsMenu.js'
