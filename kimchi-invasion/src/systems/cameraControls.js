/**
 * KIMCHI INVASION - Camera Controls System
 *
 * @description 입력 이벤트와 카메라 시스템 연결
 */

import { onInput } from '../core/input.js'
import {
  startDrag,
  updateDrag,
  endDrag,
  zoomCamera,
  moveCamera,
  isDraggingCamera,
} from '../core/camera.js'

/** @type {Function[]} */
let unsubscribers = []

/** @type {{ x: number, y: number } | null} */
let lastDragPosition = null

/**
 * 카메라 컨트롤 초기화
 */
export function initCameraControls() {
  // 드래그로 카메라 팬
  const unsubDrag = onInput('drag', event => {
    if (event.type === 'move') {
      if (!isDraggingCamera()) {
        startDrag(event.start.x, event.start.y)
        lastDragPosition = event.start
      }
      updateDrag(event.current.x, event.current.y)
      lastDragPosition = event.current
    } else if (event.type === 'end') {
      endDrag()
      lastDragPosition = null
    }
  })
  unsubscribers.push(unsubDrag)

  // 마우스 휠/핀치로 줌
  const unsubZoom = onInput('zoom', event => {
    zoomCamera(event.delta, event.x, event.y)
  })
  unsubscribers.push(unsubZoom)

  // 키보드 WASD/화살표로 카메라 이동
  const unsubKey = onInput('keydown', event => {
    const speed = event.shift ? 50 : 20 // Shift로 빠르게

    switch (event.key) {
      case 'w':
      case 'arrowup':
        moveCamera(0, -speed)
        break
      case 's':
      case 'arrowdown':
        moveCamera(0, speed)
        break
      case 'a':
      case 'arrowleft':
        moveCamera(-speed, 0)
        break
      case 'd':
      case 'arrowright':
        moveCamera(speed, 0)
        break
    }
  })
  unsubscribers.push(unsubKey)

  console.log('[CameraControls] Initialized')
}

/**
 * 카메라 컨트롤 정리
 */
export function destroyCameraControls() {
  unsubscribers.forEach(unsub => unsub())
  unsubscribers = []
  lastDragPosition = null
  console.log('[CameraControls] Destroyed')
}
