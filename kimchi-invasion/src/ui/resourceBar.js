/**
 * KIMCHI INVASION - Resource Bar UI Component
 *
 * @description 화면 상단에 주요 자원을 표시하는 HUD
 * @module ui/resourceBar
 */

import { Container, Text, Graphics } from 'pixi.js'
import { getResourceIcon, getResourceColor, RESOURCES } from '../data/resources.js'
import { useGameStore } from '../state/stores/gameStore.js'

/**
 * 자원 HUD 컴포넌트
 * @class ResourceBar
 * @extends Container
 */
export class ResourceBar extends Container {
  /**
   * @param {Object} [config]
   * @param {number} [config.width] - HUD 너비
   * @param {number} [config.height] - HUD 높이
   * @param {string[]} [config.displayResources] - 표시할 자원 ID 배열
   */
  constructor(config = {}) {
    super()

    this.config = {
      width: config.width ?? 600,
      height: config.height ?? 50,
      displayResources: config.displayResources ?? ['dollars', 'energy', 'iron', 'ice'],
      padding: 12,
      itemSpacing: 120,
      fontSize: 18,
      fontFamily: 'monospace',
    }

    /** @type {Object.<string, Text>} */
    this.resourceTexts = {}

    /** @type {Graphics} */
    this.background = null

    /** @type {Function} */
    this.unsubscribe = null

    this.label = 'ResourceBar'
    this.createBar()
    this.subscribeToStore()
  }

  /**
   * HUD 배경 및 자원 텍스트 생성
   */
  createBar() {
    // 배경 패널 (PixiJS 8 체이닝)
    this.background = new Graphics()
    this.background
      .rect(0, 0, this.config.width, this.config.height)
      .fill({ color: 0x1f2937, alpha: 0.95 })
    this.background
      .rect(0, 0, this.config.width, this.config.height)
      .stroke({ width: 2, color: 0x374151, alpha: 0.8 })
    this.addChild(this.background)

    // 각 자원 텍스트 생성
    const { displayResources, padding, itemSpacing, fontSize, fontFamily } = this.config

    displayResources.forEach((resourceId, index) => {
      const resource = RESOURCES[resourceId]
      if (!resource) {
        console.warn(`[ResourceBar] Unknown resource: ${resourceId}`)
        return
      }

      const text = new Text({
        text: `${getResourceIcon(resourceId)} 0`,
        style: {
          fill: getResourceColor(resourceId),
          fontSize,
          fontFamily,
          fontWeight: 'bold',
        },
      })

      text.x = padding + index * itemSpacing
      text.y = (this.config.height - fontSize) / 2

      this.addChild(text)
      this.resourceTexts[resourceId] = text
    })

    console.log(`[ResourceBar] Created with ${displayResources.length} resources`)
  }

  /**
   * Zustand 스토어 구독 및 실시간 업데이트
   */
  subscribeToStore() {
    // Zustand의 subscribeWithSelector를 사용하여 resources만 감시
    this.unsubscribe = useGameStore.subscribe(
      state => state.resources,
      resources => {
        this.updateDisplay(resources)
      },
      {
        // 초기 렌더링 트리거
        fireImmediately: true,
      }
    )
  }

  /**
   * 자원 표시 업데이트
   * @param {Object.<string, number>} resources - 자원 객체
   */
  updateDisplay(resources) {
    Object.entries(this.resourceTexts).forEach(([resourceId, text]) => {
      const value = resources[resourceId] ?? 0
      const icon = getResourceIcon(resourceId)

      // 에너지는 현재/최대 형식으로 표시
      if (resourceId === 'energy') {
        const maxEnergy = RESOURCES.energy.maxValue
        text.text = `${icon} ${Math.floor(value)}/${maxEnergy}`

        // 에너지 부족 시 빨간색 경고
        if (value < maxEnergy * 0.2) {
          text.style.fill = '#EF4444' // Red
        } else {
          text.style.fill = getResourceColor(resourceId)
        }
      } else {
        // 일반 자원은 숫자만 표시
        text.text = `${icon} ${this.formatNumber(value)}`
      }
    })
  }

  /**
   * 숫자 포맷팅 (1K, 1M 등)
   * @param {number} num - 숫자
   * @returns {string} 포맷된 문자열
   */
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return Math.floor(num).toString()
  }

  /**
   * 컴포넌트 정리 (메모리 누수 방지)
   */
  destroy(options) {
    // Zustand 구독 해제
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }

    // PixiJS 객체 정리
    super.destroy(options)

    console.log('[ResourceBar] Destroyed')
  }
}

/**
 * ResourceBar 초기화 함수
 * @param {Container} container - PixiJS UI 컨테이너
 * @param {Object} [config] - ResourceBar 설정
 * @returns {ResourceBar}
 */
export function initResourceBar(container, config = {}) {
  const resourceBar = new ResourceBar(config)

  // 화면 상단 중앙에 배치 (기본 위치)
  const defaultX = config.x ?? 10
  const defaultY = config.y ?? 10
  resourceBar.position.set(defaultX, defaultY)

  container.addChild(resourceBar)

  console.log(`[ResourceBar] Initialized at (${defaultX}, ${defaultY})`)
  return resourceBar
}
