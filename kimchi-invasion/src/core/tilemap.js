/**
 * KIMCHI INVASION - Tilemap System
 *
 * @description 화성 지형 타일맵 렌더링
 */

import { Container, Graphics, Text } from 'pixi.js'
import { getGameContainer } from './pixiApp.js'
import { setCameraBounds } from './camera.js'

/**
 * @typedef {Object} TilemapConfig
 * @property {number} [tileSize] - 타일 크기 (기본: 64)
 * @property {number} [mapWidth] - 맵 가로 타일 수 (기본: 50)
 * @property {number} [mapHeight] - 맵 세로 타일 수 (기본: 50)
 * @property {number} [chunkSize] - 청크 크기 (기본: 16)
 */

/**
 * @typedef {Object} Tile
 * @property {number} x - 타일 X 좌표
 * @property {number} y - 타일 Y 좌표
 * @property {string} type - 타일 타입 (ground, rock, ice, etc.)
 * @property {boolean} buildable - 건물 배치 가능 여부
 * @property {string|null} resource - 자원 타입 (iron, ice, etc.)
 */

/** @type {TilemapConfig} */
const config = {
  tileSize: 64,
  mapWidth: 50,
  mapHeight: 50,
  chunkSize: 16,
}

/** @type {Container | null} */
let tilemapContainer = null

/** @type {Map<string, Container>} */
const chunks = new Map()

/** @type {Tile[][]} */
let tiles = []

/**
 * 타일 타입별 색상
 */
const TILE_COLORS = {
  ground: 0x8b4513, // Mars Rust
  rock: 0x5a3a1a, // 어두운 암석
  ice: 0x87ceeb, // 얼음
  sand: 0xc4a35a, // 모래
  crater: 0x4a2a0a, // 크레이터
}

/**
 * 타일맵 초기화
 * @param {TilemapConfig} [customConfig]
 */
export function initTilemap(customConfig = {}) {
  Object.assign(config, customConfig)

  const gameContainer = getGameContainer()
  if (!gameContainer) {
    console.error('[Tilemap] Game container not found')
    return
  }

  // 기존 타일맵 제거
  if (tilemapContainer) {
    tilemapContainer.destroy({ children: true })
  }

  // 타일맵 컨테이너 생성
  tilemapContainer = new Container()
  tilemapContainer.label = 'tilemap'
  gameContainer.addChildAt(tilemapContainer, 0) // 가장 아래 레이어

  // 타일 데이터 생성
  generateTiles()

  // 청크 렌더링
  renderAllChunks()

  // 카메라 경계 설정
  const worldWidth = config.mapWidth * config.tileSize
  const worldHeight = config.mapHeight * config.tileSize
  setCameraBounds({
    minX: 0,
    minY: 0,
    maxX: worldWidth,
    maxY: worldHeight,
  })

  console.log(`[Tilemap] Initialized - ${config.mapWidth}x${config.mapHeight} tiles`)
}

/**
 * 타일 데이터 생성 (절차적 생성)
 */
function generateTiles() {
  tiles = []

  for (let y = 0; y < config.mapHeight; y++) {
    tiles[y] = []
    for (let x = 0; x < config.mapWidth; x++) {
      tiles[y][x] = generateTile(x, y)
    }
  }
}

/**
 * 단일 타일 생성
 * @param {number} x
 * @param {number} y
 * @returns {Tile}
 */
function generateTile(x, y) {
  // 간단한 노이즈 기반 지형 생성
  const noise = simpleNoise(x, y)

  let type = 'ground'
  let buildable = true
  let resource = null

  if (noise < 0.15) {
    type = 'crater'
    buildable = false
  } else if (noise < 0.25) {
    type = 'rock'
    buildable = false
    // 암석 지역에 철광석 확률
    if (Math.random() < 0.3) {
      resource = 'iron'
    }
  } else if (noise > 0.85) {
    type = 'ice'
    resource = 'ice'
  } else if (noise > 0.75) {
    type = 'sand'
  }

  return { x, y, type, buildable, resource }
}

/**
 * 간단한 노이즈 함수 (의사 랜덤)
 * @param {number} x
 * @param {number} y
 * @returns {number} 0~1 사이 값
 */
function simpleNoise(x, y) {
  const seed = 12345
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453
  return n - Math.floor(n)
}

/**
 * 모든 청크 렌더링
 */
function renderAllChunks() {
  if (!tilemapContainer) return

  chunks.clear()

  const chunksX = Math.ceil(config.mapWidth / config.chunkSize)
  const chunksY = Math.ceil(config.mapHeight / config.chunkSize)

  for (let cy = 0; cy < chunksY; cy++) {
    for (let cx = 0; cx < chunksX; cx++) {
      renderChunk(cx, cy)
    }
  }
}

/**
 * 단일 청크 렌더링
 * @param {number} chunkX
 * @param {number} chunkY
 */
function renderChunk(chunkX, chunkY) {
  if (!tilemapContainer) return

  const chunkKey = `${chunkX},${chunkY}`

  // 기존 청크 제거
  const existingChunk = chunks.get(chunkKey)
  if (existingChunk) {
    existingChunk.destroy({ children: true })
  }

  const chunk = new Container()
  chunk.label = `chunk_${chunkKey}`

  const startX = chunkX * config.chunkSize
  const startY = chunkY * config.chunkSize
  const endX = Math.min(startX + config.chunkSize, config.mapWidth)
  const endY = Math.min(startY + config.chunkSize, config.mapHeight)

  // 청크 내 타일 그리기
  const graphics = new Graphics()

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const tile = tiles[y]?.[x]
      if (!tile) continue

      const px = x * config.tileSize
      const py = y * config.tileSize
      const color = TILE_COLORS[tile.type] || TILE_COLORS.ground

      // 타일 배경 + 테두리 (PixiJS 8 체이닝)
      graphics
        .rect(px, py, config.tileSize, config.tileSize)
        .fill({ color })
        .stroke({ width: 1, color: 0x000000, alpha: 0.2 })

      // 자원 표시
      if (tile.resource) {
        drawResourceIndicator(chunk, px, py, tile.resource)
      }
    }
  }

  chunk.addChild(graphics)

  // 청크 위치 설정
  tilemapContainer.addChild(chunk)
  chunks.set(chunkKey, chunk)
}

/**
 * 자원 표시 (임시 - 나중에 스프라이트로 대체)
 * @param {Container} parent
 * @param {number} x
 * @param {number} y
 * @param {string} resourceType
 */
function drawResourceIndicator(parent, x, y, resourceType) {
  const indicator = new Graphics()
  const cx = x + config.tileSize / 2
  const cy = y + config.tileSize / 2

  let color = 0xffffff
  if (resourceType === 'iron') color = 0x808080
  if (resourceType === 'ice') color = 0x00bfff

  // PixiJS 8 체이닝
  indicator.circle(cx, cy, 8).fill({ color }).stroke({ width: 2, color: 0x000000, alpha: 0.5 })

  parent.addChild(indicator)
}

/**
 * 특정 타일 가져오기
 * @param {number} x - 타일 X 좌표
 * @param {number} y - 타일 Y 좌표
 * @returns {Tile | null}
 */
export function getTile(x, y) {
  if (x < 0 || x >= config.mapWidth || y < 0 || y >= config.mapHeight) {
    return null
  }
  return tiles[y]?.[x] || null
}

/**
 * 월드 좌표를 타일 좌표로 변환
 * @param {number} worldX
 * @param {number} worldY
 * @returns {{ x: number, y: number }}
 */
export function worldToTile(worldX, worldY) {
  return {
    x: Math.floor(worldX / config.tileSize),
    y: Math.floor(worldY / config.tileSize),
  }
}

/**
 * 타일 좌표를 월드 좌표(중심)로 변환
 * @param {number} tileX
 * @param {number} tileY
 * @returns {{ x: number, y: number }}
 */
export function tileToWorld(tileX, tileY) {
  return {
    x: tileX * config.tileSize + config.tileSize / 2,
    y: tileY * config.tileSize + config.tileSize / 2,
  }
}

/**
 * 타일 크기 반환
 * @returns {number}
 */
export function getTileSize() {
  return config.tileSize
}

/**
 * 맵 크기 반환
 * @returns {{ width: number, height: number }}
 */
export function getMapSize() {
  return {
    width: config.mapWidth,
    height: config.mapHeight,
  }
}

/**
 * 특정 타일에 건물 배치 가능 여부
 * @param {number} tileX
 * @param {number} tileY
 * @returns {boolean}
 */
export function canBuild(tileX, tileY) {
  const tile = getTile(tileX, tileY)
  return tile?.buildable ?? false
}

/**
 * 타일맵 정리
 */
export function destroyTilemap() {
  if (tilemapContainer) {
    tilemapContainer.destroy({ children: true })
    tilemapContainer = null
  }
  chunks.clear()
  tiles = []
  console.log('[Tilemap] Destroyed')
}
