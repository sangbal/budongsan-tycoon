/**
 * KIMCHI INVASION - Build Menu UI (PixiJS)
 *
 * @description 하단 건물 메뉴 바 + 빌드 모드 + 고스트 프리뷰
 * @module ui/buildMenu
 */

import { Container, Graphics, Text } from 'pixi.js'
import { BUILDINGS } from '../data/buildings.js'
import { buildingSystem } from '../systems/buildingSystem.js'
import { useUIStore } from '../state/stores/uiStore.js'

/**
 * 화면 좌표를 타일 좌표로 변환
 * @param {number} screenX - 화면 X 좌표
 * @param {number} screenY - 화면 Y 좌표
 * @returns {{ tileX: number, tileY: number }}
 */
function screenToTile(screenX, screenY) {
  const TILE_SIZE = 32
  // 카메라 오프셋 고려 필요 시 추가
  return {
    tileX: Math.floor(screenX / TILE_SIZE),
    tileY: Math.floor(screenY / TILE_SIZE),
  }
}

/**
 * 타일 좌표를 화면 좌표로 변환
 * @param {number} tileX - 타일 X 좌표
 * @param {number} tileY - 타일 Y 좌표
 * @returns {{ x: number, y: number }}
 */
function tileToScreen(tileX, tileY) {
  const TILE_SIZE = 32
  return {
    x: tileX * TILE_SIZE,
    y: tileY * TILE_SIZE,
  }
}

/**
 * 건물 메뉴 바 + 빌드 모드 관리
 */
export class BuildMenu extends Container {
  constructor() {
    super()
    this.label = 'buildMenu'

    /** @type {Container[]} 버튼 컨테이너 배열 */
    this.buttons = []

    /** @type {Map<string, Container>} 건물 ID별 버튼 맵 */
    this.buttonMap = new Map()

    /** @type {string|null} 현재 선택된 건물 타입 */
    this.selectedBuilding = null

    /** @type {Graphics|null} 고스트 프리뷰 */
    this.ghostSprite = null

    /** @type {number} 마지막 프리뷰 타일 X */
    this.lastTileX = -1

    /** @type {number} 마지막 프리뷰 타일 Y */
    this.lastTileY = -1

    /** @type {boolean} 마지막 배치 가능 여부 */
    this.lastValid = false

    /** @type {Function|null} 키보드 리스너 참조 */
    this.keyboardListener = null

    this.createMenuBar()
    this.setupKeyboardListeners()
  }

  /**
   * 메뉴 바 생성
   */
  createMenuBar() {
    const menuWidth = 600
    const menuHeight = 60
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    // 배경 바
    const bg = new Graphics()
    bg.rect(0, 0, menuWidth, menuHeight)
    bg.fill({ color: 0x1f2937, alpha: 0.95 })
    bg.stroke({ color: 0x374151, width: 2 })
    this.addChild(bg)

    // 하단 중앙 배치
    this.x = (screenWidth - menuWidth) / 2
    this.y = screenHeight - menuHeight - 10

    // 건물 버튼들 (Tier 1 건물 5개)
    const tier1Buildings = ['extractor', 'iceHarvester', 'greenhouse', 'furnace', 'coalPowerPlant']

    tier1Buildings.forEach((buildingId, index) => {
      const btn = this.createButton(buildingId, index)
      this.addChild(btn)
      this.buttons.push(btn)
      this.buttonMap.set(buildingId, btn)
    })
  }

  /**
   * 건물 버튼 생성
   * @param {string} buildingId - 건물 ID
   * @param {number} index - 버튼 인덱스
   * @returns {Container}
   */
  createButton(buildingId, index) {
    const def = BUILDINGS[buildingId]
    if (!def) {
      console.warn(`[BuildMenu] Unknown building: ${buildingId}`)
      return new Container()
    }

    const btn = new Container()
    btn.label = `btn-${buildingId}`

    // 버튼 배경
    const bg = new Graphics()
    bg.rect(0, 0, 80, 50)
    bg.fill({ color: 0x374151 })
    bg.stroke({ color: 0x4b5563, width: 1 })
    btn.addChild(bg)

    // 아이콘
    const icon = new Text({
      text: def.icon,
      style: {
        fontSize: 24,
        align: 'center',
      },
    })
    icon.anchor.set(0.5)
    icon.x = 40
    icon.y = 15
    btn.addChild(icon)

    // 비용 표시
    const costText = `$${def.cost.dollars ?? 0}`
    const cost = new Text({
      text: costText,
      style: {
        fontSize: 10,
        fill: '#9CA3AF',
        align: 'center',
      },
    })
    cost.anchor.set(0.5)
    cost.x = 40
    cost.y = 40
    btn.addChild(cost)

    // 위치 설정 (10px 여백 + 90px 간격)
    btn.x = 10 + index * 90
    btn.y = 5

    // 인터랙션 활성화
    btn.eventMode = 'static'
    btn.cursor = 'pointer'

    // 호버 효과
    btn.on('pointerover', () => {
      bg.clear()
      bg.rect(0, 0, 80, 50)
      bg.fill({ color: 0x4b5563 })
      bg.stroke({ color: 0x6b7280, width: 2 })
    })

    btn.on('pointerout', () => {
      bg.clear()
      bg.rect(0, 0, 80, 50)
      bg.fill({ color: 0x374151 })
      bg.stroke({ color: 0x4b5563, width: 1 })
    })

    // 클릭 이벤트
    btn.on('pointerdown', () => this.selectBuilding(buildingId))

    return btn
  }

  /**
   * 건물 선택 (빌드 모드 진입)
   * @param {string} buildingId - 건물 ID
   */
  selectBuilding(buildingId) {
    // 이미 선택된 건물을 다시 클릭하면 취소
    if (this.selectedBuilding === buildingId) {
      this.cancelBuild()
      return
    }

    this.selectedBuilding = buildingId
    useUIStore.getState().selectBuildingType(buildingId)

    // 모든 버튼을 기본 스타일로 초기화
    this.buttonMap.forEach(btn => {
      const bg = btn.children[0]
      if (bg && bg instanceof Graphics) {
        bg.clear()
        bg.rect(0, 0, 80, 50)
        bg.fill({ color: 0x374151 })
        bg.stroke({ color: 0x4b5563, width: 1 })
      }
    })

    // 선택된 버튼 강조
    const selectedBtn = this.buttonMap.get(buildingId)
    if (selectedBtn) {
      const bg = selectedBtn.children[0]
      if (bg && bg instanceof Graphics) {
        bg.clear()
        bg.rect(0, 0, 80, 50)
        bg.fill({ color: 0x10b981 }) // Green
        bg.stroke({ color: 0x059669, width: 2 })
      }
    }

    console.log(`[BuildMenu] Selected building: ${buildingId}`)
  }

  /**
   * 빌드 모드 취소
   */
  cancelBuild() {
    this.selectedBuilding = null
    useUIStore.getState().cancelBuildMode()

    // 모든 버튼을 기본 스타일로 초기화
    this.buttonMap.forEach(btn => {
      const bg = btn.children[0]
      if (bg && bg instanceof Graphics) {
        bg.clear()
        bg.rect(0, 0, 80, 50)
        bg.fill({ color: 0x374151 })
        bg.stroke({ color: 0x4b5563, width: 1 })
      }
    })

    if (this.ghostSprite) {
      this.ghostSprite.destroy()
      this.ghostSprite = null
    }

    this.lastTileX = -1
    this.lastTileY = -1

    console.log('[BuildMenu] Build mode cancelled')
  }

  /**
   * 고스트 프리뷰 업데이트
   * @param {number} tileX - 타일 X 좌표
   * @param {number} tileY - 타일 Y 좌표
   */
  updateGhost(tileX, tileY) {
    if (!this.selectedBuilding) return

    const def = BUILDINGS[this.selectedBuilding]
    if (!def) return

    // 배치 가능 여부 확인
    const canPlace = buildingSystem.canPlace(this.selectedBuilding, tileX, tileY)

    // UI Store 업데이트 (다른 UI 컴포넌트가 참조 가능)
    useUIStore.getState().updateBuildPreview(tileX, tileY, canPlace)

    // 상태가 변경되지 않으면 스킵 (최적화)
    if (
      this.ghostSprite &&
      this.lastTileX === tileX &&
      this.lastTileY === tileY &&
      this.lastValid === canPlace
    ) {
      return
    }

    this.lastTileX = tileX
    this.lastTileY = tileY
    this.lastValid = canPlace

    // 기존 고스트 제거
    if (this.ghostSprite) {
      this.ghostSprite.destroy()
    }

    // 새 고스트 생성
    this.ghostSprite = new Graphics()
    this.ghostSprite.label = 'ghost'

    const TILE_SIZE = 32
    const { width, height } = def.size
    const color = canPlace ? 0x10b981 : 0xef4444 // Green / Red
    const alpha = 0.5

    // 반투명 사각형
    this.ghostSprite.rect(0, 0, width * TILE_SIZE, height * TILE_SIZE)
    this.ghostSprite.fill({ color, alpha })

    // 테두리
    this.ghostSprite.stroke({ color, width: 2, alpha: 0.8 })

    // 아이콘 표시
    const icon = new Text({
      text: def.icon,
      style: {
        fontSize: 20,
        align: 'center',
      },
    })
    icon.anchor.set(0.5)
    icon.x = (width * TILE_SIZE) / 2
    icon.y = (height * TILE_SIZE) / 2
    icon.alpha = 0.8
    this.ghostSprite.addChild(icon)

    // 위치 설정
    const { x, y } = tileToScreen(tileX, tileY)
    this.ghostSprite.x = x
    this.ghostSprite.y = y

    // 부모 컨테이너에 추가 (게임 레이어, UI 레이어가 아님)
    // buildMenu는 UI 레이어에 있으므로, 고스트는 게임 레이어에 추가해야 함
    // 이를 위해 부모의 부모 (stage)에서 gameContainer를 찾아 추가
    const stage = this.parent?.parent
    if (stage) {
      const gameContainer = stage.children.find(c => c.label === 'game')
      if (gameContainer) {
        gameContainer.addChild(this.ghostSprite)
      }
    }
  }

  /**
   * 마우스 이동 처리
   * @param {number} screenX - 화면 X 좌표
   * @param {number} screenY - 화면 Y 좌표
   */
  handleMouseMove(screenX, screenY) {
    if (!this.selectedBuilding) return

    const { tileX, tileY } = screenToTile(screenX, screenY)
    this.updateGhost(tileX, tileY)
  }

  /**
   * 마우스 클릭 처리 (건물 배치)
   * @param {number} screenX - 화면 X 좌표
   * @param {number} screenY - 화면 Y 좌표
   */
  handleClick(screenX, screenY) {
    if (!this.selectedBuilding) return

    const { tileX, tileY } = screenToTile(screenX, screenY)

    // 건물 배치 시도
    const building = buildingSystem.place(this.selectedBuilding, tileX, tileY)

    if (building) {
      console.log(`[BuildMenu] Placed ${this.selectedBuilding} at (${tileX}, ${tileY})`)

      // 빌드 모드 유지 (연속 배치) 또는 종료 (1회 배치)
      // 현재는 1회 배치 후 종료
      this.cancelBuild()
    } else {
      console.log(`[BuildMenu] Failed to place ${this.selectedBuilding} at (${tileX}, ${tileY})`)
    }
  }

  /**
   * 키보드 리스너 설정
   */
  setupKeyboardListeners() {
    this.keyboardListener = e => {
      // ESC: 빌드 모드 취소
      if (e.key === 'Escape' && this.selectedBuilding) {
        this.cancelBuild()
        e.preventDefault()
      }

      // 숫자 키 1-5: 건물 빠른 선택
      if (e.key >= '1' && e.key <= '5') {
        const tier1Buildings = [
          'extractor',
          'iceHarvester',
          'greenhouse',
          'furnace',
          'coalPowerPlant',
        ]
        const index = parseInt(e.key) - 1
        if (index >= 0 && index < tier1Buildings.length) {
          this.selectBuilding(tier1Buildings[index])
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', this.keyboardListener)
  }

  /**
   * 정리 (메모리 누수 방지)
   */
  destroy(options) {
    // 키보드 리스너 제거
    if (this.keyboardListener) {
      window.removeEventListener('keydown', this.keyboardListener)
      this.keyboardListener = null
    }

    // 고스트 스프라이트 제거
    if (this.ghostSprite) {
      this.ghostSprite.destroy()
      this.ghostSprite = null
    }

    super.destroy(options)
  }
}

/**
 * BuildMenu를 게임에 통합하는 헬퍼 함수
 * @param {import('pixi.js').Container} uiContainer - UI 레이어 컨테이너
 * @param {import('pixi.js').Container} gameContainer - 게임 레이어 컨테이너
 * @returns {BuildMenu}
 */
export function createBuildMenu(uiContainer, gameContainer) {
  const buildMenu = new BuildMenu()
  uiContainer.addChild(buildMenu)

  // 전역 마우스 이벤트 설정 (gameContainer에)
  gameContainer.eventMode = 'static'

  gameContainer.on('pointermove', e => {
    const pos = e.global
    buildMenu.handleMouseMove(pos.x, pos.y)
  })

  gameContainer.on('pointerdown', e => {
    const pos = e.global
    buildMenu.handleClick(pos.x, pos.y)
  })

  console.log('[BuildMenu] Created and attached to UI layer')
  return buildMenu
}
