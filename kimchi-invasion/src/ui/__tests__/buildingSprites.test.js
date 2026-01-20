/**
 * KIMCHI INVASION - Building Sprites Tests
 *
 * @description buildingSprites.js 단위 테스트
 */

import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest'
import { Container, Graphics, Text } from 'pixi.js'
import {
  createBuildingSprite,
  getBuildingSprite,
  renderBuilding,
  removeBuilding,
  upgradeBuilding,
  updateBuildingProgress,
  highlightBuilding,
  clearSpriteCache,
  initBuildingSprites,
} from '../buildingSprites.js'

// Mock BUILDINGS data
vi.mock('../../data/buildings.js', () => ({
  BUILDINGS: {
    extractor: {
      id: 'extractor',
      icon: '⛏️',
      size: { width: 2, height: 2 },
      color: '#6B7280',
    },
    greenhouse: {
      id: 'greenhouse',
      icon: '🏡',
      size: { width: 3, height: 3 },
      color: '#10B981',
    },
    warehouse: {
      id: 'warehouse',
      icon: '📦',
      size: { width: 3, height: 3 },
      color: '#8B5CF6',
    },
  },
}))

// Mock tilemap
vi.mock('../../core/tilemap.js', () => ({
  getTileSize: () => 64,
}))

// Mock Canvas APIs for PixiJS Text rendering
beforeAll(() => {
  // Mock CanvasRenderingContext2D
  global.CanvasRenderingContext2D = class CanvasRenderingContext2D {
    constructor() {
      this.font = ''
    }
    measureText() {
      return { width: 100 }
    }
    fillText() {}
    clearRect() {}
    fillRect() {}
  }

  // Mock HTMLCanvasElement
  if (typeof HTMLCanvasElement !== 'undefined') {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => new CanvasRenderingContext2D())
  }
})

describe('buildingSprites', () => {
  beforeEach(() => {
    clearSpriteCache()
    initBuildingSprites()
  })

  describe('createBuildingSprite', () => {
    it('유효한 건물 타입으로 스프라이트 생성', () => {
      const sprite = createBuildingSprite('extractor', 1)

      expect(sprite).toBeInstanceOf(Container)
      expect(sprite.label).toBe('sprite_extractor_lv1')
      expect(sprite.children.length).toBeGreaterThan(0)
    })

    it('잘못된 건물 타입으로 에러 스프라이트 생성', () => {
      const sprite = createBuildingSprite('invalid_type', 1)

      expect(sprite).toBeInstanceOf(Container)
      // 에러 스프라이트는 여전히 Container 반환
    })

    it('레벨 2 이상일 때 레벨 표시', () => {
      const sprite = createBuildingSprite('extractor', 3)

      const levelText = sprite.children.find(
        child => child instanceof Text && child.text.includes('Lv3')
      )
      expect(levelText).toBeDefined()
    })

    it('레벨 1일 때 레벨 표시 없음', () => {
      const sprite = createBuildingSprite('extractor', 1)

      const levelText = sprite.children.find(
        child => child instanceof Text && child.text.includes('Lv')
      )
      expect(levelText).toBeUndefined()
    })
  })

  describe('getBuildingSprite', () => {
    it('캐시에서 스프라이트 복제', () => {
      const sprite1 = getBuildingSprite('extractor', 1)
      const sprite2 = getBuildingSprite('extractor', 1)

      // 다른 인스턴스
      expect(sprite1).not.toBe(sprite2)
      // 같은 라벨
      expect(sprite1.label).toBe(sprite2.label)
    })

    it('다른 레벨은 별도 캐시', () => {
      const sprite1 = getBuildingSprite('extractor', 1)
      const sprite2 = getBuildingSprite('extractor', 2)

      expect(sprite1.label).not.toBe(sprite2.label)
    })
  })

  describe('renderBuilding', () => {
    it('건물을 컨테이너에 추가', () => {
      const container = new Container()
      const building = {
        id: 'test-building-1',
        type: 'extractor',
        level: 1,
      }

      const sprite = renderBuilding(building, 5, 3, container)

      expect(container.children).toContain(sprite)
      expect(sprite.label).toBe('building_test-building-1')
      expect(sprite.buildingId).toBe('test-building-1')
      expect(sprite.x).toBe(5 * 64) // TILE_SIZE = 64
      expect(sprite.y).toBe(3 * 64)
    })
  })

  describe('removeBuilding', () => {
    it('건물 스프라이트 제거', () => {
      const container = new Container()
      const building = {
        id: 'test-building-1',
        type: 'extractor',
        level: 1,
      }

      renderBuilding(building, 5, 3, container)
      expect(container.children.length).toBe(1)

      const removed = removeBuilding('test-building-1', container)

      expect(removed).toBe(true)
      expect(container.children.length).toBe(0)
    })

    it('존재하지 않는 건물 제거 시 false 반환', () => {
      const container = new Container()
      const removed = removeBuilding('non-existent', container)

      expect(removed).toBe(false)
    })
  })

  describe('upgradeBuilding', () => {
    it('건물 스프라이트 업그레이드', () => {
      const container = new Container()
      const building = {
        id: 'test-building-1',
        type: 'extractor',
        level: 1,
      }

      renderBuilding(building, 5, 3, container)

      const upgraded = upgradeBuilding('test-building-1', 'extractor', 2, container)

      expect(upgraded).toBe(true)

      const sprite = container.children.find(child => child.label === 'building_test-building-1')
      expect(sprite).toBeDefined()
      // 레벨 2 스프라이트로 교체됨
    })
  })

  describe('updateBuildingProgress', () => {
    it('진행률 바 생성 및 업데이트', () => {
      const container = new Container()
      const building = {
        id: 'test-building-1',
        type: 'greenhouse',
        level: 1,
      }

      renderBuilding(building, 5, 3, container)

      updateBuildingProgress('test-building-1', 0.5, container)

      const sprite = container.children.find(child => child.label === 'building_test-building-1')
      const progressBar = sprite.children.find(child => child.label === 'progressBar')

      expect(progressBar).toBeInstanceOf(Graphics)
    })

    it('진행률 0.0 ~ 1.0 범위 클램핑', () => {
      const container = new Container()
      const building = {
        id: 'test-building-1',
        type: 'greenhouse',
        level: 1,
      }

      renderBuilding(building, 5, 3, container)

      // 1.0 초과 값 테스트
      updateBuildingProgress('test-building-1', 1.5, container)
      // 에러 없이 실행되어야 함

      // 음수 값 테스트
      updateBuildingProgress('test-building-1', -0.5, container)
      // 에러 없이 실행되어야 함
    })
  })

  describe('highlightBuilding', () => {
    it('하이라이트 활성화', () => {
      const container = new Container()
      const building = {
        id: 'test-building-1',
        type: 'extractor',
        level: 1,
      }

      renderBuilding(building, 5, 3, container)

      highlightBuilding('test-building-1', container, true, 0xffff00)

      const sprite = container.children.find(child => child.label === 'building_test-building-1')
      const highlight = sprite.children.find(child => child.label === 'highlight')

      expect(highlight).toBeInstanceOf(Graphics)
    })

    it('하이라이트 비활성화', () => {
      const container = new Container()
      const building = {
        id: 'test-building-1',
        type: 'extractor',
        level: 1,
      }

      renderBuilding(building, 5, 3, container)

      highlightBuilding('test-building-1', container, true)
      highlightBuilding('test-building-1', container, false)

      const sprite = container.children.find(child => child.label === 'building_test-building-1')
      const highlight = sprite.children.find(child => child.label === 'highlight')

      expect(highlight).toBeUndefined()
    })
  })

  describe('캐시 관리', () => {
    it('캐시 초기화', () => {
      getBuildingSprite('extractor', 1)
      getBuildingSprite('greenhouse', 2)

      clearSpriteCache()

      // 캐시가 비워졌으므로 다시 생성
      const sprite = getBuildingSprite('extractor', 1)
      expect(sprite).toBeInstanceOf(Container)
    })
  })
})
