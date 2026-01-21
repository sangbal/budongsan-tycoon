/**
 * KIMCHI INVASION - Coordinate Utilities
 *
 * @description 통합 좌표 변환 유틸리티
 * @module core/coordinates
 */

import { getTileSize } from './tilemap.js'
import {
  screenToWorld as cameraScreenToWorld,
  worldToScreen as cameraWorldToScreen,
} from './camera.js'

/**
 * 화면 좌표를 타일 좌표로 변환
 * @param {number} screenX - 화면 X 좌표
 * @param {number} screenY - 화면 Y 좌표
 * @returns {{ x: number, y: number }}
 */
export function screenToTile(screenX, screenY) {
  const world = cameraScreenToWorld(screenX, screenY)
  const tileSize = getTileSize()
  return {
    x: Math.floor(world.x / tileSize),
    y: Math.floor(world.y / tileSize),
  }
}

/**
 * 타일 좌표를 화면 좌표로 변환 (타일 중심)
 * @param {number} tileX - 타일 X 좌표
 * @param {number} tileY - 타일 Y 좌표
 * @returns {{ x: number, y: number }}
 */
export function tileToScreen(tileX, tileY) {
  const tileSize = getTileSize()
  const worldX = tileX * tileSize + tileSize / 2
  const worldY = tileY * tileSize + tileSize / 2
  return cameraWorldToScreen(worldX, worldY)
}

/**
 * 타일 좌표를 월드 좌표로 변환 (타일 중심)
 * @param {number} tileX - 타일 X 좌표
 * @param {number} tileY - 타일 Y 좌표
 * @returns {{ x: number, y: number }}
 */
export function tileToWorld(tileX, tileY) {
  const tileSize = getTileSize()
  return {
    x: tileX * tileSize + tileSize / 2,
    y: tileY * tileSize + tileSize / 2,
  }
}

/**
 * 타일 좌표를 월드 좌표로 변환 (타일 좌상단)
 * @param {number} tileX - 타일 X 좌표
 * @param {number} tileY - 타일 Y 좌표
 * @returns {{ x: number, y: number }}
 */
export function tileToWorldCorner(tileX, tileY) {
  const tileSize = getTileSize()
  return {
    x: tileX * tileSize,
    y: tileY * tileSize,
  }
}

/**
 * 월드 좌표를 타일 좌표로 변환
 * @param {number} worldX - 월드 X 좌표
 * @param {number} worldY - 월드 Y 좌표
 * @returns {{ x: number, y: number }}
 */
export function worldToTile(worldX, worldY) {
  const tileSize = getTileSize()
  return {
    x: Math.floor(worldX / tileSize),
    y: Math.floor(worldY / tileSize),
  }
}

/**
 * 화면 좌표를 월드 좌표로 변환 (카메라 래퍼)
 * @param {number} screenX - 화면 X 좌표
 * @param {number} screenY - 화면 Y 좌표
 * @returns {{ x: number, y: number }}
 */
export function screenToWorld(screenX, screenY) {
  return cameraScreenToWorld(screenX, screenY)
}

/**
 * 월드 좌표를 화면 좌표로 변환 (카메라 래퍼)
 * @param {number} worldX - 월드 X 좌표
 * @param {number} worldY - 월드 Y 좌표
 * @returns {{ x: number, y: number }}
 */
export function worldToScreen(worldX, worldY) {
  return cameraWorldToScreen(worldX, worldY)
}
