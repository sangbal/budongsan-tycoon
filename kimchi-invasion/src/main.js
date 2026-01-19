/**
 * KIMCHI INVASION: The Red Planet Protocol
 * Main Entry Point
 *
 * @description 화성에서 김치를 재배하고 지구로 수출하는 SF 팩토리 시뮬레이션 게임
 * @see /docs/ for full Game Design Document
 */

import { useGameStore } from './state/stores/gameStore.js'
import { initPixiApp, getApp, destroyPixiApp } from './core/pixiApp.js'
import { initCamera, setCameraPosition } from './core/camera.js'
import { initTilemap, getMapSize, getTileSize } from './core/tilemap.js'
import { initInput } from './core/input.js'
import { initSystems } from './systems/index.js'
import { initUI } from './ui/index.js'
import { initI18n, t } from './i18n/index.js'
import { loadSave, setupAutoSave } from './persist/storage.js'

// Global game instance
let game = null

/**
 * Game configuration
 */
const CONFIG = {
  targetFPS: 60,
  autoSaveInterval: 30000, // 30 seconds
  version: __APP_VERSION__ ?? '0.1.0',
}

/**
 * Update loading progress
 */
function updateLoadingProgress(progress, status) {
  const progressBar = document.getElementById('loading-progress')
  const statusText = document.getElementById('loading-status')

  if (progressBar) {
    progressBar.style.width = `${progress}%`
  }
  if (statusText) {
    statusText.textContent = status
  }
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen')
  if (loadingScreen) {
    loadingScreen.classList.add('hidden')
    // Remove from DOM after animation
    setTimeout(() => {
      loadingScreen.remove()
    }, 400)
  }
}

/**
 * Feature detection - check required browser capabilities
 */
function checkBrowserSupport() {
  const requirements = {
    webgl2: () => {
      const canvas = document.createElement('canvas')
      return !!canvas.getContext('webgl2')
    },
    localStorage: () => {
      try {
        localStorage.setItem('test', '1')
        localStorage.removeItem('test')
        return true
      } catch {
        return false
      }
    },
    es2020: () => {
      try {
        new Function('const a = 1n; a?.b ?? "c";')
        return true
      } catch {
        return false
      }
    },
  }

  const unsupported = Object.entries(requirements)
    .filter(([, check]) => !check())
    .map(([name]) => name)

  if (unsupported.length > 0) {
    throw new Error(`Browser missing required features: ${unsupported.join(', ')}`)
  }

  return true
}

/**
 * Initialize the game
 */
async function initGame() {
  try {
    console.log(`[KIMCHI INVASION] v${CONFIG.version} - Initializing...`)

    // Step 1: Check browser support
    updateLoadingProgress(5, 'Checking browser compatibility...')
    checkBrowserSupport()

    // Step 2: Initialize i18n
    updateLoadingProgress(15, 'Loading translations...')
    await initI18n()

    // Step 3: Initialize game state
    updateLoadingProgress(25, t('loading.state') || 'Initializing game state...')
    useGameStore.getState().reset()

    // Step 4: Load saved game (if exists)
    updateLoadingProgress(35, t('loading.save') || 'Loading saved game...')
    const hasSave = await loadSave()
    if (hasSave) {
      console.log('[KIMCHI INVASION] Save loaded successfully')
    }

    // Step 5: Initialize PixiJS renderer
    updateLoadingProgress(50, t('loading.renderer') || 'Initializing renderer...')
    const canvas = document.getElementById('game-canvas')
    await initPixiApp({ canvas })

    // Step 5.5: Initialize camera and tilemap
    updateLoadingProgress(55, t('loading.world') || 'Generating world...')
    initCamera()
    initTilemap()

    // Center camera on map
    const mapSize = getMapSize()
    const tileSize = getTileSize()
    setCameraPosition((mapSize.width * tileSize) / 2, (mapSize.height * tileSize) / 2)

    // Step 6: Initialize game systems
    updateLoadingProgress(70, t('loading.systems') || 'Loading game systems...')
    await initSystems()

    // Step 7: Initialize UI
    updateLoadingProgress(85, t('loading.ui') || 'Setting up interface...')
    await initUI()

    // Step 8: Initialize input handling
    updateLoadingProgress(95, t('loading.input') || 'Configuring controls...')
    initInput()

    // Step 9: Setup auto-save
    setupAutoSave(CONFIG.autoSaveInterval)

    // Done!
    updateLoadingProgress(100, t('loading.complete') || 'Ready!')

    console.log('[KIMCHI INVASION] Initialization complete')

    // Create game object
    game = {
      config: CONFIG,
      state: useGameStore.getState(),
      running: false,
      lastTime: 0,
    }

    // Short delay before hiding loading screen
    await new Promise(resolve => setTimeout(resolve, 300))
    hideLoadingScreen()

    // Start game loop
    startGameLoop()
  } catch (error) {
    console.error('[KIMCHI INVASION] Initialization failed:', error)
    updateLoadingProgress(0, `Error: ${error.message}`)
    // Show error to user
    showFatalError(error)
  }
}

/**
 * Main game loop
 */
function gameLoop(currentTime) {
  if (!game.running) return

  const deltaTime = currentTime - game.lastTime
  game.lastTime = currentTime

  // Update game systems
  // TODO: Implement system updates

  // Render frame
  // TODO: Implement rendering

  requestAnimationFrame(gameLoop)
}

/**
 * Start the game loop
 */
function startGameLoop() {
  if (game.running) return

  game.running = true
  game.lastTime = performance.now()

  console.log('[KIMCHI INVASION] Game loop started')
  requestAnimationFrame(gameLoop)
}

/**
 * Pause the game loop
 */
function pauseGameLoop() {
  game.running = false
  console.log('[KIMCHI INVASION] Game loop paused')
}

/**
 * Show fatal error to user
 */
function showFatalError(error) {
  const loadingContent = document.querySelector('.loading-content')
  if (loadingContent) {
    loadingContent.innerHTML = `
      <h1 style="color: var(--color-danger);">Error</h1>
      <p style="color: var(--color-text-dim); margin: 16px 0;">${error.message}</p>
      <p style="font-size: 0.875rem; color: var(--color-text-dim);">
        Please refresh the page or try a different browser.
      </p>
      <button onclick="location.reload()" style="
        margin-top: 24px;
        padding: 12px 24px;
        background: var(--color-kimchi-red);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
      ">Refresh</button>
    `
  }
}

// Handle visibility change (pause when tab hidden)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseGameLoop()
  } else if (game) {
    startGameLoop()
  }
})

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame)
} else {
  initGame()
}

// Export for debugging
if (import.meta.env.DEV) {
  window.kimchiGame = {
    getGame: () => game,
    getState: () => useGameStore.getState(),
    getPixiApp: getApp,
    pause: pauseGameLoop,
    resume: startGameLoop,
  }
}
