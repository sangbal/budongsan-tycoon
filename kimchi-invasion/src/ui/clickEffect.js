/**
 * KIMCHI INVASION - Click Effect System
 *
 * @description 클릭 시 플로팅 텍스트 애니메이션 (+1 🪨)
 * @module ui/clickEffect
 */

import { Container, Text } from 'pixi.js'
import { getResourceIcon } from '../data/resources.js'
import { tileToWorld } from '../core/tilemap.js'

/**
 * @typedef {Object} FloatingEffect
 * @property {Text} text - PixiJS 텍스트 객체
 * @property {number} startY - 시작 Y 좌표
 * @property {number} elapsed - 경과 시간 (초)
 * @property {number} duration - 애니메이션 지속 시간 (초)
 */

/**
 * 클릭 이펙트 컨테이너
 * 클릭 시 "+1 ⚙️" 같은 플로팅 텍스트를 표시
 */
export class ClickEffect extends Container {
  constructor() {
    super()
    this.label = 'click-effects'

    /**
     * 활성화된 이펙트 목록
     * @type {FloatingEffect[]}
     * @private
     */
    this.activeEffects = []

    /**
     * 이펙트 풀 (재사용)
     * @type {Text[]}
     * @private
     */
    this.textPool = []
  }

  /**
   * 플로팅 텍스트 표시
   * @param {string} resourceId - 자원 ID
   * @param {number} amount - 획득량
   * @param {number} tileX - 타일 X 좌표
   * @param {number} tileY - 타일 Y 좌표
   */
  showFloating(resourceId, amount, tileX, tileY) {
    // 타일 좌표를 월드 좌표로 변환 (타일 중심)
    const worldPos = tileToWorld(tileX, tileY)

    const icon = getResourceIcon(resourceId)
    const text = this.getOrCreateText()

    // 텍스트 스타일
    text.text = `+${amount} ${icon}`
    text.style = {
      fill: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold',
      dropShadow: {
        alpha: 1,
        angle: Math.PI / 6,
        blur: 2,
        color: '#000000',
        distance: 2,
      },
      align: 'center',
    }

    // 위치 설정 (중심 정렬)
    text.anchor.set(0.5, 0.5)
    text.x = worldPos.x
    text.y = worldPos.y
    text.alpha = 1

    // 약간의 랜덤 X 오프셋 (여러 클릭 시 겹치지 않게)
    text.x += (Math.random() - 0.5) * 20

    this.addChild(text)

    // 이펙트 목록에 추가
    this.activeEffects.push({
      text,
      startY: worldPos.y,
      elapsed: 0,
      duration: 0.8, // 0.8초 동안 애니메이션
    })
  }

  /**
   * 매 프레임 업데이트
   * @param {number} deltaTime - 이전 프레임으로부터의 경과 시간 (초)
   */
  update(deltaTime) {
    for (let i = this.activeEffects.length - 1; i >= 0; i--) {
      const effect = this.activeEffects[i]
      effect.elapsed += deltaTime

      const progress = Math.min(effect.elapsed / effect.duration, 1)

      // easeOut 이징 함수
      const eased = 1 - Math.pow(1 - progress, 3)

      // 위로 이동 (50px)
      effect.text.y = effect.startY - eased * 50

      // 페이드아웃
      effect.text.alpha = 1 - progress

      // 완료 시 제거
      if (progress >= 1) {
        this.removeChild(effect.text)
        this.recycleText(effect.text)
        this.activeEffects.splice(i, 1)
      }
    }
  }

  /**
   * 텍스트 객체 가져오기 (풀에서 재사용 또는 새로 생성)
   * @returns {Text}
   * @private
   */
  getOrCreateText() {
    if (this.textPool.length > 0) {
      return this.textPool.pop()
    }
    return new Text()
  }

  /**
   * 텍스트 객체 재활용 (풀에 반환)
   * @param {Text} text
   * @private
   */
  recycleText(text) {
    // 풀 크기 제한 (메모리 누수 방지)
    if (this.textPool.length < 50) {
      text.text = ''
      text.alpha = 1
      this.textPool.push(text)
    } else {
      text.destroy()
    }
  }

  /**
   * 모든 이펙트 정리
   */
  cleanup() {
    // 활성 이펙트 제거
    this.activeEffects.forEach(effect => {
      this.removeChild(effect.text)
      effect.text.destroy()
    })
    this.activeEffects = []

    // 풀의 텍스트 제거
    this.textPool.forEach(text => text.destroy())
    this.textPool = []

    console.log('[ClickEffect] Cleaned up')
  }
}

/**
 * 싱글톤 인스턴스
 * @type {ClickEffect | null}
 */
let clickEffectInstance = null

/**
 * ClickEffect 인스턴스 가져오기
 * @returns {ClickEffect}
 */
export function getClickEffect() {
  if (!clickEffectInstance) {
    clickEffectInstance = new ClickEffect()
  }
  return clickEffectInstance
}

/**
 * ClickEffect 정리
 */
export function destroyClickEffect() {
  if (clickEffectInstance) {
    clickEffectInstance.cleanup()
    clickEffectInstance.destroy({ children: true })
    clickEffectInstance = null
  }
}
