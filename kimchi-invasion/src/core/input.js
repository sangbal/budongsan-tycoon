/**
 * KIMCHI INVASION - Input Handling Module
 *
 * Handles mouse, touch, and keyboard input.
 * Provides unified input events for the game.
 */

import {
  toggleResearchPanel,
  hideResearchPanel,
  toggleSettingsMenu,
  closeSettingsMenu,
} from '../ui/index.js'
import { tutorialSystem, TUTORIAL_STATE } from '../systems/tutorialSystem.js'

// Input state
const state = {
  mouse: { x: 0, y: 0, down: false, button: -1 },
  touch: { active: false, touches: [] },
  keys: new Set(),
  modifiers: { shift: false, ctrl: false, alt: false },
}

// Event listeners
const listeners = {
  click: [],
  drag: [],
  zoom: [],
  keydown: [],
  keyup: [],
}

// Touch tracking for gestures
let lastTouchDistance = 0
let dragStart = null

/**
 * Initialize input handling
 */
export function initInput() {
  const gameContainer = document.getElementById('game-container')
  const canvas = document.getElementById('game-canvas')

  if (!gameContainer || !canvas) {
    console.warn('[Input] Game container or canvas not found')
    return
  }

  // Mouse events
  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mouseup', handleMouseUp)
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('wheel', handleWheel, { passive: false })
  canvas.addEventListener('contextmenu', e => e.preventDefault())

  // Touch events
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
  canvas.addEventListener('touchend', handleTouchEnd)
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false })

  // Keyboard events
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  // Prevent default browser behaviors
  canvas.addEventListener('dragstart', e => e.preventDefault())

  console.log('[Input] Initialized')
}

/**
 * Get current mouse position
 */
export function getMousePosition() {
  return { ...state.mouse }
}

/**
 * Check if a key is currently pressed
 */
export function isKeyDown(key) {
  return state.keys.has(key.toLowerCase())
}

/**
 * Subscribe to input events
 */
export function onInput(eventType, callback) {
  if (listeners[eventType]) {
    listeners[eventType].push(callback)
    return () => {
      const index = listeners[eventType].indexOf(callback)
      if (index > -1) listeners[eventType].splice(index, 1)
    }
  }
  return () => {}
}

// Event emitter
function emit(eventType, data) {
  listeners[eventType]?.forEach(callback => {
    try {
      callback(data)
    } catch (error) {
      console.error(`[Input] ${eventType} listener error:`, error)
    }
  })
}

// Get position from event (works for both mouse and touch)
function getEventPosition(e) {
  const canvas = document.getElementById('game-canvas')
  if (!canvas) return { x: 0, y: 0 }

  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  }
}

// Mouse handlers
function handleMouseDown(e) {
  const pos = getEventPosition(e)
  state.mouse = { ...pos, down: true, button: e.button }
  dragStart = { ...pos }

  if (e.button === 0) {
    // Left click
    emit('click', { ...pos, type: 'start' })
  }
}

function handleMouseUp(e) {
  const pos = getEventPosition(e)

  if (e.button === 0 && dragStart) {
    const distance = Math.hypot(pos.x - dragStart.x, pos.y - dragStart.y)
    if (distance < 5) {
      // Click (not drag)
      emit('click', { ...pos, type: 'click' })
    } else {
      // Drag end
      emit('drag', { start: dragStart, end: pos, type: 'end' })
    }
  }

  state.mouse = { ...pos, down: false, button: -1 }
  dragStart = null
}

function handleMouseMove(e) {
  const pos = getEventPosition(e)
  state.mouse = { ...state.mouse, ...pos }

  if (state.mouse.down && dragStart) {
    emit('drag', {
      start: dragStart,
      current: pos,
      delta: { x: pos.x - dragStart.x, y: pos.y - dragStart.y },
      type: 'move',
    })
  }
}

function handleWheel(e) {
  e.preventDefault()
  const pos = getEventPosition(e)
  const delta = e.deltaY > 0 ? -1 : 1

  emit('zoom', { ...pos, delta })
}

// Touch handlers
function handleTouchStart(e) {
  e.preventDefault()

  state.touch.active = true
  state.touch.touches = Array.from(e.touches)

  if (e.touches.length === 1) {
    const pos = getEventPosition(e)
    dragStart = { ...pos }
    emit('click', { ...pos, type: 'start' })
  } else if (e.touches.length === 2) {
    // Pinch zoom start
    lastTouchDistance = getTouchDistance(e.touches)
  }
}

function handleTouchEnd(e) {
  if (e.touches.length === 0) {
    state.touch.active = false

    if (dragStart) {
      const pos = getEventPosition({ touches: e.changedTouches })
      const distance = Math.hypot(pos.x - dragStart.x, pos.y - dragStart.y)

      if (distance < 10) {
        emit('click', { ...pos, type: 'click' })
      } else {
        emit('drag', { start: dragStart, end: pos, type: 'end' })
      }
    }

    dragStart = null
    lastTouchDistance = 0
  }

  state.touch.touches = Array.from(e.touches)
}

function handleTouchMove(e) {
  e.preventDefault()
  state.touch.touches = Array.from(e.touches)

  if (e.touches.length === 1 && dragStart) {
    const pos = getEventPosition(e)
    emit('drag', {
      start: dragStart,
      current: pos,
      delta: { x: pos.x - dragStart.x, y: pos.y - dragStart.y },
      type: 'move',
    })
  } else if (e.touches.length === 2) {
    // Pinch zoom
    const distance = getTouchDistance(e.touches)
    const delta = (distance - lastTouchDistance) / 100

    if (Math.abs(delta) > 0.01) {
      const center = getTouchCenter(e.touches)
      emit('zoom', { ...center, delta })
      lastTouchDistance = distance
    }
  }
}

function getTouchDistance(touches) {
  if (touches.length < 2) return 0
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.hypot(dx, dy)
}

function getTouchCenter(touches) {
  if (touches.length < 2) return { x: 0, y: 0 }
  const canvas = document.getElementById('game-canvas')
  const rect = canvas?.getBoundingClientRect() ?? { left: 0, top: 0 }

  return {
    x: (touches[0].clientX + touches[1].clientX) / 2 - rect.left,
    y: (touches[0].clientY + touches[1].clientY) / 2 - rect.top,
  }
}

// Keyboard handlers
function handleKeyDown(e) {
  // Don't capture when typing in input fields
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return
  }

  const key = e.key.toLowerCase()
  state.keys.add(key)
  state.modifiers = {
    shift: e.shiftKey,
    ctrl: e.ctrlKey || e.metaKey,
    alt: e.altKey,
  }

  // Global hotkeys
  handleGlobalHotkeys(key, state.modifiers)

  emit('keydown', { key, ...state.modifiers })
}

/**
 * Handle global hotkeys
 */
function handleGlobalHotkeys(key, modifiers) {
  // R: 연구 패널 토글
  if (key === 'r' && !modifiers.ctrl && !modifiers.alt) {
    toggleResearchPanel()
  }

  // S: 설정 메뉴 토글
  if (key === 's' && !modifiers.ctrl && !modifiers.alt) {
    toggleSettingsMenu()
  }

  // ESC: Z-index 우선순위에 따라 모달 닫기
  // Z-index 높은 순: Settings (9500) > Tutorial (9000)
  if (key === 'escape') {
    handleEscapeKey()
  }

  // Space: 게임 일시정지/재개 (개발용)
  if (key === ' ' && import.meta.env.DEV) {
    const game = window.kimchiGame?.getGame()
    if (game) {
      if (game.running) {
        window.kimchiGame.pause()
      } else {
        window.kimchiGame.resume()
      }
    }
  }
}

/**
 * ESC 키 우선순위 처리
 * Z-index가 높은 모달부터 순차적으로 닫음
 */
function handleEscapeKey() {
  // 1순위: Settings Modal (z-index: 9500)
  const settingsModal = document.querySelector('.settings-modal:not(.hidden)')
  if (settingsModal) {
    closeSettingsMenu()
    return // 하나만 닫고 종료
  }

  // 2순위: Tutorial Modal (z-index: 9000)
  const tutorialModal = document.querySelector('.tutorial-modal:not(.hidden)')
  if (tutorialModal) {
    // 튜토리얼 진행 중에는 ESC 키 제한 (스킵 버튼으로만 종료 가능)
    // 튜토리얼이 아닌 경우에만 닫기
    if (tutorialSystem.state !== TUTORIAL_STATE.IN_PROGRESS) {
      // 튜토리얼 진행 중이 아니면 모달 닫기
      const closeBtn = tutorialModal.querySelector('.tutorial-skip-btn')
      if (closeBtn) closeBtn.click()
    } else {
      console.log('[Input] ESC disabled during tutorial (use Skip button)')
    }
    return
  }

  // 3순위: 기타 패널 (Research 등)
  hideResearchPanel()
}

function handleKeyUp(e) {
  const key = e.key.toLowerCase()
  state.keys.delete(key)
  state.modifiers = {
    shift: e.shiftKey,
    ctrl: e.ctrlKey || e.metaKey,
    alt: e.altKey,
  }

  emit('keyup', { key, ...state.modifiers })
}
