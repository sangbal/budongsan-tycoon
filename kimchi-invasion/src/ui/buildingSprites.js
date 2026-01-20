/**
 * KIMCHI INVASION - Building Sprites
 *
 * @description PixiJS Graphics로 건물 스프라이트 생성 및 관리
 * @module ui/buildingSprites
 */

import { Graphics, Container, Text } from 'pixi.js'
import { BUILDINGS } from '../data/buildings.js'
import { getTileSize } from '../core/tilemap.js'

/**
 * 건물 카테고리별 색상 (HEX 숫자)
 * buildings.js의 color 필드를 숫자로 변환
 */
const BUILDING_COLORS = {
  // Extraction (채굴)
  extractor: 0x8b4513, // 갈색
  iceHarvester: 0x87ceeb, // 하늘색

  // Production (생산)
  greenhouse: 0x4caf50, // 초록
  furnace: 0xff5722, // 주황
  brineStation: 0x2196f3, // 파랑
  fermentationChamber: 0xf44336, // 빨강

  // Power (전력)
  coalPowerPlant: 0xffeb3b, // 노랑

  // Utility (유틸리티)
  warehouse: 0x9c27b0, // 보라

  // Logistics (물류)
  conveyor: 0x9e9e9e, // 회색
  inserter: 0x607d8b, // 청회색
}

/**
 * 스프라이트 캐시 (타입_레벨 → Container)
 * @type {Map<string, Container>}
 */
const spriteCache = new Map()

/**
 * 타일 크기 캐시 (동적으로 가져오기)
 * @type {number}
 */
let TILE_SIZE = 64

/**
 * 타일 크기 초기화 (게임 시작 시 호출)
 */
export function initBuildingSprites() {
  TILE_SIZE = getTileSize()
  console.log(`[BuildingSprites] Initialized with TILE_SIZE=${TILE_SIZE}`)
}

/**
 * 건물 스프라이트 생성
 * @param {string} buildingType - 건물 타입 (BUILDINGS 키)
 * @param {number} level - 건물 레벨 (기본: 1)
 * @returns {Container} PixiJS 컨테이너
 */
export function createBuildingSprite(buildingType, level = 1) {
  const def = BUILDINGS[buildingType]
  if (!def) {
    console.warn(`[BuildingSprites] Unknown building type: ${buildingType}`)
    return createErrorSprite()
  }

  const color = BUILDING_COLORS[buildingType] || 0x666666
  const container = new Container()
  container.label = `sprite_${buildingType}_lv${level}`

  const width = def.size.width * TILE_SIZE
  const height = def.size.height * TILE_SIZE

  // 건물 배경 (색상으로 구분) + 테두리 (PixiJS 8 체이닝)
  const bg = new Graphics()
  bg.rect(0, 0, width, height).fill({ color, alpha: 0.9 })
  bg.rect(0, 0, width, height).stroke({ color: 0xffffff, width: 2 })

  container.addChild(bg)

  // 아이콘 (이모지 중앙 배치)
  const icon = new Text({
    text: def.icon,
    style: {
      fontSize: Math.min(width, height) * 0.4, // 크기에 비례
      fill: '#FFFFFF',
    },
  })
  icon.anchor.set(0.5)
  icon.x = width / 2
  icon.y = height / 2
  container.addChild(icon)

  // 레벨 표시 (2 이상일 때)
  if (level > 1) {
    const levelBg = new Graphics()
    levelBg.roundRect(2, 2, 40, 20, 4).fill({ color: 0x000000, alpha: 0.7 })
    container.addChild(levelBg)

    const levelText = new Text({
      text: `Lv${level}`,
      style: {
        fontSize: 12,
        fill: '#FFFFFF',
        fontWeight: 'bold',
      },
    })
    levelText.x = 6
    levelText.y = 4
    container.addChild(levelText)
  }

  return container
}

/**
 * 에러 스프라이트 생성 (정의되지 않은 건물용)
 * @returns {Container}
 */
function createErrorSprite() {
  const container = new Container()
  const bg = new Graphics()
  bg.rect(0, 0, TILE_SIZE, TILE_SIZE).fill({ color: 0xff00ff, alpha: 0.5 })
  bg.rect(0, 0, TILE_SIZE, TILE_SIZE).stroke({ color: 0xff0000, width: 2 })
  container.addChild(bg)

  const errorText = new Text({
    text: '❌',
    style: { fontSize: 20, fill: '#FFFFFF' },
  })
  errorText.anchor.set(0.5)
  errorText.x = TILE_SIZE / 2
  errorText.y = TILE_SIZE / 2
  container.addChild(errorText)

  return container
}

/**
 * 캐시된 스프라이트 가져오기
 * @param {string} buildingType - 건물 타입
 * @param {number} level - 건물 레벨 (기본: 1)
 * @returns {Container} 복제된 스프라이트 (인스턴스마다 별도)
 */
export function getBuildingSprite(buildingType, level = 1) {
  const key = `${buildingType}_${level}`

  if (!spriteCache.has(key)) {
    const sprite = createBuildingSprite(buildingType, level)
    spriteCache.set(key, sprite)
  }

  // 캐시된 스프라이트 복제 (각 건물마다 별도 인스턴스)
  const cached = spriteCache.get(key)
  const clone = new Container()
  clone.label = cached.label

  // 모든 자식 복제
  for (const child of cached.children) {
    if (child instanceof Graphics) {
      // Graphics는 복제 불가능 → 재생성
      const newGraphics = new Graphics()
      newGraphics.context = child.context.clone()
      clone.addChild(newGraphics)
    } else if (child instanceof Text) {
      const newText = new Text({
        text: child.text,
        style: child.style,
      })
      newText.x = child.x
      newText.y = child.y
      newText.anchor.copyFrom(child.anchor)
      clone.addChild(newText)
    } else {
      // 기타 객체는 그대로 복제
      clone.addChild(child.clone?.() || child)
    }
  }

  return clone
}

/**
 * 건물 렌더링 (타일맵 위에 배치)
 * @param {Object} building - 건물 엔티티 { id, type, x, y, level }
 * @param {number} x - 타일 X 좌표
 * @param {number} y - 타일 Y 좌표
 * @param {Container} container - 부모 컨테이너 (타일맵 레이어)
 * @returns {Container} 생성된 스프라이트
 */
export function renderBuilding(building, x, y, container) {
  const sprite = getBuildingSprite(building.type, building.level)
  sprite.x = x * TILE_SIZE
  sprite.y = y * TILE_SIZE
  sprite.label = `building_${building.id}`

  // 건물 ID를 속성으로 저장 (클릭 이벤트용)
  sprite.buildingId = building.id

  container.addChild(sprite)
  return sprite
}

/**
 * 건물 제거 (스프라이트 삭제)
 * @param {string} buildingId - 건물 ID
 * @param {Container} container - 부모 컨테이너
 * @returns {boolean} 제거 성공 여부
 */
export function removeBuilding(buildingId, container) {
  const sprite = container.children.find(child => child.label === `building_${buildingId}`)

  if (sprite) {
    container.removeChild(sprite)
    sprite.destroy({ children: true })
    return true
  }

  console.warn(`[BuildingSprites] Building sprite not found: ${buildingId}`)
  return false
}

/**
 * 건물 업그레이드 (스프라이트 교체)
 * @param {string} buildingId - 건물 ID
 * @param {string} buildingType - 건물 타입
 * @param {number} newLevel - 새 레벨
 * @param {Container} container - 부모 컨테이너
 * @returns {boolean} 업그레이드 성공 여부
 */
export function upgradeBuilding(buildingId, buildingType, newLevel, container) {
  const oldSprite = container.children.find(child => child.label === `building_${buildingId}`)

  if (!oldSprite) {
    console.warn(`[BuildingSprites] Building sprite not found: ${buildingId}`)
    return false
  }

  // 위치 저장
  const x = oldSprite.x
  const y = oldSprite.y

  // 기존 스프라이트 제거
  container.removeChild(oldSprite)
  oldSprite.destroy({ children: true })

  // 새 스프라이트 생성
  const newSprite = getBuildingSprite(buildingType, newLevel)
  newSprite.x = x
  newSprite.y = y
  newSprite.label = `building_${buildingId}`
  newSprite.buildingId = buildingId

  container.addChild(newSprite)
  return true
}

/**
 * 진행률 바 업데이트 (발효, 가공 건물용)
 * @param {string} buildingId - 건물 ID
 * @param {number} progress - 진행률 (0.0 ~ 1.0)
 * @param {Container} container - 부모 컨테이너
 */
export function updateBuildingProgress(buildingId, progress, container) {
  const sprite = container.children.find(child => child.label === `building_${buildingId}`)

  if (!sprite) return

  // 진행률 바 찾기 또는 생성
  let progressBar = sprite.children.find(child => child.label === 'progressBar')

  if (!progressBar) {
    progressBar = new Graphics()
    progressBar.label = 'progressBar'
    sprite.addChild(progressBar)
  }

  // 진행률 바 그리기
  const barWidth = sprite.width - 4
  const barHeight = 4
  const barX = 2
  const barY = sprite.height - 6

  progressBar.clear()

  // 배경 (회색) - PixiJS 8 체이닝
  progressBar.rect(barX, barY, barWidth, barHeight).fill({ color: 0x333333, alpha: 0.8 })

  // 진행률 (초록)
  progressBar
    .rect(barX, barY, barWidth * Math.max(0, Math.min(1, progress)), barHeight)
    .fill({ color: 0x00ff00, alpha: 1.0 })

  // 테두리
  progressBar.rect(barX, barY, barWidth, barHeight).stroke({ color: 0x000000, width: 1 })
}

/**
 * 진행률 바 제거
 * @param {string} buildingId - 건물 ID
 * @param {Container} container - 부모 컨테이너
 */
export function clearBuildingProgress(buildingId, container) {
  const sprite = container.children.find(child => child.label === `building_${buildingId}`)
  if (!sprite) return

  const progressBar = sprite.children.find(child => child.label === 'progressBar')
  if (progressBar) {
    sprite.removeChild(progressBar)
    progressBar.destroy()
  }
}

/**
 * 모든 스프라이트 캐시 초기화
 */
export function clearSpriteCache() {
  for (const sprite of spriteCache.values()) {
    sprite.destroy({ children: true })
  }
  spriteCache.clear()
  console.log('[BuildingSprites] Sprite cache cleared')
}

/**
 * 건물 하이라이트 (선택/호버 시)
 * @param {string} buildingId - 건물 ID
 * @param {Container} container - 부모 컨테이너
 * @param {boolean} highlight - 하이라이트 활성화 여부
 * @param {number} color - 하이라이트 색상 (기본: 노랑)
 */
export function highlightBuilding(buildingId, container, highlight = true, color = 0xffff00) {
  const sprite = container.children.find(child => child.label === `building_${buildingId}`)
  if (!sprite) return

  // 하이라이트 레이어 찾기 또는 생성
  let highlightLayer = sprite.children.find(child => child.label === 'highlight')

  if (highlight) {
    if (!highlightLayer) {
      highlightLayer = new Graphics()
      highlightLayer.label = 'highlight'
      sprite.addChildAt(highlightLayer, 0) // 맨 아래 레이어
    }

    highlightLayer.clear()
    highlightLayer.rect(0, 0, sprite.width, sprite.height).stroke({ color, width: 4, alpha: 0.8 })
  } else {
    // 하이라이트 제거
    if (highlightLayer) {
      sprite.removeChild(highlightLayer)
      highlightLayer.destroy()
    }
  }
}

/**
 * 건물 에너지 부족 표시 (빨간 테두리)
 * @param {string} buildingId - 건물 ID
 * @param {Container} container - 부모 컨테이너
 * @param {boolean} noPower - 에너지 부족 여부
 */
export function markNoPower(buildingId, container, noPower = true) {
  const sprite = container.children.find(child => child.label === `building_${buildingId}`)
  if (!sprite) return

  let powerWarning = sprite.children.find(child => child.label === 'noPowerWarning')

  if (noPower) {
    if (!powerWarning) {
      powerWarning = new Graphics()
      powerWarning.label = 'noPowerWarning'
      sprite.addChildAt(powerWarning, 0)
    }

    powerWarning.clear()
    powerWarning
      .rect(0, 0, sprite.width, sprite.height)
      .stroke({ color: 0xff0000, width: 3, alpha: 0.8 })

    // 깜빡임 애니메이션 (향후 추가)
  } else {
    if (powerWarning) {
      sprite.removeChild(powerWarning)
      powerWarning.destroy()
    }
  }
}

/**
 * 디버깅: 캐시 상태 출력
 */
export function debugPrintCache() {
  console.log('=== Building Sprite Cache ===')
  console.log(`Total cached: ${spriteCache.size}`)
  for (const [key, sprite] of spriteCache.entries()) {
    console.log(`${key}: ${sprite.label}`)
  }
}
