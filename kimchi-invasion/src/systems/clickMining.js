/**
 * KIMCHI INVASION - Click Mining System
 *
 * @description 플레이어가 타일을 클릭하여 자원을 채굴하는 시스템
 * @module systems/clickMining
 */

import { System } from '../ecs/System.js'
import { resourceSystem } from './resourceSystem.js'
import { getTile, worldToTile } from '../core/tilemap.js'
import { onInput } from '../core/input.js'
import { screenToWorld } from '../core/camera.js'

/**
 * 클릭 채굴 시스템
 * 타일 클릭 시 자원 획득
 */
export class ClickMiningSystem extends System {
  constructor() {
    super([]) // 엔티티 대신 전역 이벤트 처리
    this.systemName = 'ClickMiningSystem'
    this.priority = 20

    /**
     * 이벤트 리스너 저장용
     * @private
     */
    this.listeners = {}

    /**
     * 입력 이벤트 해제 함수
     * @private
     */
    this.unsubscribeInput = null

    /**
     * 기본 채굴량
     * @private
     */
    this.baseMiningAmount = 1

    /**
     * 임시: 타일에 자원 정보가 없을 경우 기본 자원
     * @private
     */
    this.defaultResource = 'iron'
  }

  /**
   * 시스템 초기화
   */
  init() {
    // 전역 접근을 위해 window에 등록 (디버깅용)
    if (typeof window !== 'undefined') {
      window.clickMiningSystem = this
    }

    // 클릭 이벤트 리스너 등록
    this.setupClickHandler()

    // eslint-disable-next-line no-console
    console.log('[ClickMiningSystem] Initialized')
  }

  /**
   * 클릭 핸들러 설정
   * @private
   */
  setupClickHandler() {
    // input.js의 click 이벤트 구독
    this.unsubscribeInput = onInput('click', event => {
      // type: 'click' 일 때만 처리 (드래그 제외)
      if (event.type === 'click') {
        this.handleClick(event.x, event.y)
      }
    })
  }

  /**
   * 클릭 이벤트 처리
   * @param {number} screenX - 화면 좌표 X
   * @param {number} screenY - 화면 좌표 Y
   * @private
   */
  handleClick(screenX, screenY) {
    // 화면 좌표를 월드 좌표로 변환
    const worldPos = screenToWorld(screenX, screenY)

    // 월드 좌표를 타일 좌표로 변환
    const tilePos = worldToTile(worldPos.x, worldPos.y)

    // 타일 정보 가져오기
    const tile = getTile(tilePos.x, tilePos.y)

    if (!tile) {
      // 맵 밖 클릭
      return
    }

    // 채굴 가능 여부 확인
    if (this.canMine(tile)) {
      this.mine(tile, tilePos.x, tilePos.y)
    }
  }

  /**
   * 타일 채굴 가능 여부
   * @param {import('../core/tilemap.js').Tile} tile
   * @returns {boolean}
   * @private
   */
  canMine(tile) {
    // 자원이 있는 타일만 채굴 가능
    // 임시: 자원이 없어도 모든 타일에서 철광석 채굴 가능
    return (
      tile.resource !== null ||
      tile.type === 'ground' ||
      tile.type === 'rock' ||
      tile.type === 'ice'
    )
  }

  /**
   * 채굴 실행
   * @param {import('../core/tilemap.js').Tile} tile
   * @param {number} tileX
   * @param {number} tileY
   * @private
   */
  mine(tile, tileX, tileY) {
    // 자원 ID 결정
    const resourceId = this.getResourceId(tile)

    // 채굴량 계산
    const amount = this.getMiningAmount()

    // 자원 추가
    const actualAdded = resourceSystem.add(resourceId, amount)

    if (actualAdded > 0) {
      // 채굴 성공 (디버깅이 필요하면 주석 해제)
      // console.log(`[ClickMining] Mined ${actualAdded}x ${resourceId} at (${tileX}, ${tileY})`)

      // 이벤트 발생 (이펙트, UI 업데이트용)
      this.emit('mined', {
        resourceId,
        amount: actualAdded,
        tileX,
        tileY,
      })
    }

    // TODO: 타일 HP 감소 (향후 구현)
    // tile.hp -= 1
    // if (tile.hp <= 0) {
    //   tilemap.setTile(tileX, tileY, { type: 'empty' })
    // }
  }

  /**
   * 타일에서 자원 ID 추출
   * @param {import('../core/tilemap.js').Tile} tile
   * @returns {string}
   * @private
   */
  getResourceId(tile) {
    // 타일에 자원 정보가 있으면 사용
    if (tile.resource) {
      return tile.resource
    }

    // 타입별 기본 자원 매핑 (임시)
    const typeToResource = {
      rock: 'iron',
      ice: 'ice',
      ground: 'iron', // 임시: 지면에서도 철광석 채굴 가능
      sand: 'sand',
    }

    return typeToResource[tile.type] || this.defaultResource
  }

  /**
   * 채굴량 계산
   * @returns {number}
   * @private
   */
  getMiningAmount() {
    // 기본 채굴량
    let amount = this.baseMiningAmount

    // TODO: 업그레이드 보너스 추가 (향후 구현)
    // const bonus = upgradeSystem?.getMiningBonus?.() ?? 0
    // amount += bonus

    return amount
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} event - 이벤트 이름 ('mined')
   * @param {Function} callback - 콜백 함수
   * @returns {Function} 해제 함수
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)

    // 해제 함수 반환
    return () => {
      const index = this.listeners[event].indexOf(callback)
      if (index > -1) {
        this.listeners[event].splice(index, 1)
      }
    }
  }

  /**
   * 이벤트 발생
   * @param {string} event - 이벤트 이름
   * @param {*} data - 이벤트 데이터
   * @private
   */
  emit(event, data) {
    this.listeners[event]?.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`[ClickMiningSystem] Event '${event}' listener error:`, error)
      }
    })
  }

  /**
   * 매 프레임 업데이트
   * @param {import('../ecs/Entity.js').Entity[]} _entities - 사용하지 않음
   * @param {number} _deltaTime - 이전 프레임으로부터의 경과 시간 (초 단위)
   */
  update(_entities, _deltaTime) {
    // 클릭 채굴은 이벤트 기반이므로 매 프레임 업데이트 불필요
  }

  /**
   * 시스템 정리
   */
  cleanup() {
    // 입력 이벤트 해제
    if (this.unsubscribeInput) {
      this.unsubscribeInput()
      this.unsubscribeInput = null
    }

    // 모든 이벤트 리스너 제거
    this.listeners = {}

    // eslint-disable-next-line no-console
    console.log('[ClickMiningSystem] Cleaned up')
  }

  /**
   * 디버깅: 기본 채굴량 설정
   * @param {number} amount
   */
  setBaseMiningAmount(amount) {
    this.baseMiningAmount = Math.max(1, amount)
    // eslint-disable-next-line no-console
    console.log(`[ClickMiningSystem] Base mining amount set to ${this.baseMiningAmount}`)
  }

  /**
   * 디버깅: 채굴량 증가 (업그레이드 시뮬레이션)
   * @param {number} delta
   */
  increaseMiningAmount(delta) {
    this.baseMiningAmount += delta
    // eslint-disable-next-line no-console
    console.log(`[ClickMiningSystem] Mining amount increased to ${this.baseMiningAmount}`)
  }
}

// === 싱글톤 인스턴스 ===

/**
 * 전역 싱글톤 인스턴스
 * @type {ClickMiningSystem}
 */
export const clickMiningSystem = new ClickMiningSystem()

// === 편의 함수 (옵션) ===

/**
 * 채굴 이벤트 리스너 등록 단축 함수
 * @param {Function} callback - 콜백 함수
 * @returns {Function} 해제 함수
 */
export function onMined(callback) {
  return clickMiningSystem.on('mined', callback)
}

/**
 * 기본 채굴량 설정 단축 함수
 * @param {number} amount
 */
export function setBaseMiningAmount(amount) {
  clickMiningSystem.setBaseMiningAmount(amount)
}

/**
 * 채굴량 증가 단축 함수
 * @param {number} delta
 */
export function increaseMiningAmount(delta) {
  clickMiningSystem.increaseMiningAmount(delta)
}
