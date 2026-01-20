/**
 * KIMCHI INVASION - Camera System
 *
 * @description 게임 월드 카메라 (팬/줌) 관리
 */

import { getGameContainer, getScreenSize } from './pixiApp.js'

/**
 * @typedef {Object} CameraConfig
 * @property {number} [minZoom] - 최소 줌 (기본: 0.25)
 * @property {number} [maxZoom] - 최대 줌 (기본: 2.0)
 * @property {number} [zoomSpeed] - 줌 속도 (기본: 0.1)
 * @property {number} [panSpeed] - 팬 속도 (기본: 1.0)
 * @property {boolean} [clampToBounds] - 경계 제한 (기본: true)
 */

/**
 * @typedef {Object} CameraBounds
 * @property {number} minX
 * @property {number} minY
 * @property {number} maxX
 * @property {number} maxY
 */

/** @type {CameraConfig} */
const config = {
  minZoom: 0.25,
  maxZoom: 2.0,
  zoomSpeed: 0.1,
  panSpeed: 1.0,
  clampToBounds: true,
}

/** @type {{ x: number, y: number }} */
const position = { x: 0, y: 0 }

/** @type {number} */
let zoom = 1.0

/** @type {CameraBounds | null} */
let bounds = null

/** @type {boolean} */
let isDragging = false

/** @type {{ x: number, y: number }} */
let dragStart = { x: 0, y: 0 }

/** @type {{ x: number, y: number }} */
let positionStart = { x: 0, y: 0 }

/**
 * 카메라 초기화
 * @param {CameraConfig} [customConfig]
 */
export function initCamera(customConfig = {}) {
  Object.assign(config, customConfig)

  // 초기 위치를 화면 중앙으로
  const screen = getScreenSize()
  position.x = screen.width / 2
  position.y = screen.height / 2

  console.log('[Camera] Initialized')
}

/**
 * 카메라 경계 설정
 * @param {CameraBounds} newBounds
 */
export function setCameraBounds(newBounds) {
  bounds = newBounds
}

/**
 * 카메라 위치 설정
 * @param {number} x
 * @param {number} y
 */
export function setCameraPosition(x, y) {
  position.x = x
  position.y = y
  clampPosition()
  applyTransform()
}

/**
 * 카메라 이동 (상대)
 * @param {number} dx
 * @param {number} dy
 */
export function moveCamera(dx, dy) {
  position.x += (dx * config.panSpeed) / zoom
  position.y += (dy * config.panSpeed) / zoom
  clampPosition()
  applyTransform()
}

/**
 * 카메라 줌 설정
 * @param {number} newZoom
 * @param {number} [pivotX] - 줌 중심점 X (화면 좌표)
 * @param {number} [pivotY] - 줌 중심점 Y (화면 좌표)
 */
export function setCameraZoom(newZoom, pivotX, pivotY) {
  const oldZoom = zoom
  zoom = Math.max(config.minZoom, Math.min(config.maxZoom, newZoom))

  // 줌 중심점 기준으로 위치 조정
  if (pivotX !== undefined && pivotY !== undefined) {
    const screen = getScreenSize()
    const centerX = screen.width / 2
    const centerY = screen.height / 2

    // 마우스 위치에서 화면 중앙까지의 오프셋
    const offsetX = (pivotX - centerX) / oldZoom
    const offsetY = (pivotY - centerY) / oldZoom

    // 줌 변화에 따른 위치 조정
    const zoomRatio = 1 - oldZoom / zoom
    position.x += offsetX * zoomRatio
    position.y += offsetY * zoomRatio
  }

  clampPosition()
  applyTransform()
}

/**
 * 줌 인/아웃 (상대)
 * @param {number} delta - 양수면 줌 인, 음수면 줌 아웃
 * @param {number} [pivotX]
 * @param {number} [pivotY]
 */
export function zoomCamera(delta, pivotX, pivotY) {
  const newZoom = zoom * (1 + delta * config.zoomSpeed)
  setCameraZoom(newZoom, pivotX, pivotY)
}

/**
 * 현재 카메라 위치 반환
 * @returns {{ x: number, y: number }}
 */
export function getCameraPosition() {
  return { ...position }
}

/**
 * 현재 줌 레벨 반환
 * @returns {number}
 */
export function getCameraZoom() {
  return zoom
}

/**
 * 화면 좌표를 월드 좌표로 변환
 * @param {number} screenX
 * @param {number} screenY
 * @returns {{ x: number, y: number }}
 */
export function screenToWorld(screenX, screenY) {
  const screen = getScreenSize()
  const centerX = screen.width / 2
  const centerY = screen.height / 2

  return {
    x: position.x + (screenX - centerX) / zoom,
    y: position.y + (screenY - centerY) / zoom,
  }
}

/**
 * 월드 좌표를 화면 좌표로 변환
 * @param {number} worldX
 * @param {number} worldY
 * @returns {{ x: number, y: number }}
 */
export function worldToScreen(worldX, worldY) {
  const screen = getScreenSize()
  const centerX = screen.width / 2
  const centerY = screen.height / 2

  return {
    x: centerX + (worldX - position.x) * zoom,
    y: centerY + (worldY - position.y) * zoom,
  }
}

/**
 * 드래그 시작
 * @param {number} x - 화면 좌표
 * @param {number} y - 화면 좌표
 */
export function startDrag(x, y) {
  isDragging = true
  dragStart.x = x
  dragStart.y = y
  positionStart.x = position.x
  positionStart.y = position.y
}

/**
 * 드래그 업데이트
 * @param {number} x - 화면 좌표
 * @param {number} y - 화면 좌표
 */
export function updateDrag(x, y) {
  if (!isDragging) return

  const dx = (dragStart.x - x) / zoom
  const dy = (dragStart.y - y) / zoom

  position.x = positionStart.x + dx
  position.y = positionStart.y + dy

  clampPosition()
  applyTransform()
}

/**
 * 드래그 종료
 */
export function endDrag() {
  isDragging = false
}

/**
 * 드래그 중인지 확인
 * @returns {boolean}
 */
export function isDraggingCamera() {
  return isDragging
}

/**
 * 위치를 경계 내로 제한
 */
function clampPosition() {
  if (!config.clampToBounds || !bounds) return

  const screen = getScreenSize()
  const halfWidth = screen.width / 2 / zoom
  const halfHeight = screen.height / 2 / zoom

  position.x = Math.max(bounds.minX + halfWidth, Math.min(bounds.maxX - halfWidth, position.x))
  position.y = Math.max(bounds.minY + halfHeight, Math.min(bounds.maxY - halfHeight, position.y))
}

/**
 * 게임 컨테이너에 변환 적용
 */
function applyTransform() {
  const container = getGameContainer()
  if (!container) return

  const screen = getScreenSize()
  const centerX = screen.width / 2
  const centerY = screen.height / 2

  container.scale.set(zoom)
  container.position.set(centerX - position.x * zoom, centerY - position.y * zoom)
}

/**
 * 특정 위치로 부드럽게 이동 (애니메이션)
 * @param {number} targetX
 * @param {number} targetY
 * @param {number} [duration=500] - ms
 * @returns {Promise<void>}
 */
export function panTo(targetX, targetY, duration = 500) {
  return new Promise(resolve => {
    const startX = position.x
    const startY = position.y
    const startTime = performance.now()

    function animate(currentTime) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)

      position.x = startX + (targetX - startX) * eased
      position.y = startY + (targetY - startY) * eased

      clampPosition()
      applyTransform()

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(animate)
  })
}

/**
 * 카메라 리셋 (초기 위치와 줌)
 */
export function resetCamera() {
  zoom = 1.0
  position.x = 0
  position.y = 0
  applyTransform()
}
