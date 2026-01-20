/**
 * KIMCHI INVASION - Research System
 *
 * @description 기술 연구 시스템 (시작, 진행, 완료, 효과 적용)
 * @module systems/researchSystem
 */

import { System } from '../ecs/System.js'
import {
  TECHNOLOGIES,
  getTechnology,
  hasPrerequisites,
  getAvailableTechnologies,
  getTechCost,
} from '../data/technologies.js'
import { resourceSystem } from './resourceSystem.js'
import { useGameStore } from '../state/stores/gameStore.js'

/**
 * 연구 시스템
 * 기술 연구 진행 및 효과 적용 관리
 */
export class ResearchSystem extends System {
  constructor() {
    super([]) // 전역 연구 관리이므로 requiredComponents 없음
    this.systemName = 'ResearchSystem'
    this.priority = 5 // 낮은 우선순위 (다른 시스템 이후)

    /** @type {string|null} 현재 연구 중인 기술 ID */
    this.currentResearch = null

    /** @type {number} 현재 연구 진행 시간 (초) */
    this.researchProgress = 0

    /** @type {Set<string>} 완료된 기술 ID 집합 */
    this.completedTechs = new Set()

    /** @type {Map<string, number>} 효과 배수 캐시 (target → multiplier) */
    this.multiplierCache = new Map()

    /** @type {Set<string>} 해금된 기능 집합 (target ID) */
    this.unlockedFeatures = new Set()

    /** @type {Map<string, number>} 보너스 캐시 (target → bonus) */
    this.bonusCache = new Map()

    /** @type {EventTarget} 이벤트 버스 */
    this.eventBus = new EventTarget()
  }

  /**
   * 시스템 초기화
   */
  init() {
    // 전역 접근을 위해 window에 등록 (디버깅용)
    if (typeof window !== 'undefined') {
      window.researchSystem = this
    }

    // 저장된 연구 상태 복원
    this.loadResearch()
  }

  /**
   * 저장된 연구 상태 불러오기 (게임 시작 시)
   */
  loadResearch() {
    const research = useGameStore.getState().research
    this.completedTechs = new Set(research.completed)
    this.currentResearch = research.current
    this.researchProgress = research.progress ?? 0

    // 캐시 재생성
    this.rebuildCache()
  }

  /**
   * 효과 캐시 재생성 (게임 로드 시 또는 기술 완료 시)
   */
  rebuildCache() {
    this.multiplierCache.clear()
    this.unlockedFeatures.clear()
    this.bonusCache.clear()

    for (const techId of this.completedTechs) {
      const tech = TECHNOLOGIES[techId]
      if (!tech) continue

      for (const effect of tech.effects) {
        if (effect.type === 'multiplier') {
          // 배수는 곱셈 누적 (1.2 * 1.3 = 1.56)
          const current = this.multiplierCache.get(effect.target) ?? 1.0
          this.multiplierCache.set(effect.target, current * effect.value)
        } else if (effect.type === 'unlock') {
          this.unlockedFeatures.add(effect.target)
        } else if (effect.type === 'bonus') {
          // 보너스는 덧셈 누적 (-0.25 + -0.15 = -0.4)
          const current = this.bonusCache.get(effect.target) ?? 0
          this.bonusCache.set(effect.target, current + effect.value)
        }
      }
    }
  }

  /**
   * 매 프레임 업데이트 (연구 진행)
   * @param {import('../ecs/Entity.js').Entity[]} _entities - 사용하지 않음
   * @param {number} deltaTime - 이전 프레임으로부터의 경과 시간 (초 단위)
   */
  update(_entities, deltaTime) {
    if (!this.currentResearch) return

    const tech = TECHNOLOGIES[this.currentResearch]
    if (!tech) {
      console.warn(`[ResearchSystem] Invalid tech in progress: ${this.currentResearch}`)
      this.currentResearch = null
      return
    }

    // 연구 진행
    this.researchProgress += deltaTime

    // 10초마다 진행률 이벤트 발생 (UI 업데이트용)
    const progressPercent = Math.min((this.researchProgress / tech.time) * 100, 100)
    if (Math.floor(this.researchProgress) % 10 === 0) {
      this.emit('researchProgress', {
        techId: this.currentResearch,
        progress: this.researchProgress,
        totalTime: tech.time,
        percent: progressPercent,
      })
    }

    // 연구 완료 확인
    if (this.researchProgress >= tech.time) {
      this.completeResearch()
    }

    // Zustand 상태 업데이트 (진행률)
    useGameStore.getState().setResearchProgress(this.currentResearch, this.researchProgress)
  }

  /**
   * 연구 시작
   * @param {string} techId - 기술 ID
   * @returns {boolean} 시작 성공 여부
   */
  startResearch(techId) {
    // 1. 유효성 검사
    const tech = getTechnology(techId)
    if (!tech) {
      console.warn(`[ResearchSystem] Unknown technology: ${techId}`)
      return false
    }

    // 2. 이미 연구 중인지 확인
    if (this.currentResearch) {
      return false
    }

    // 3. 이미 완료된 기술인지 확인
    if (this.completedTechs.has(techId)) {
      return false
    }

    // 4. 선행 기술 확인
    if (!hasPrerequisites(techId, Array.from(this.completedTechs))) {
      return false
    }

    // 5. 비용 지불
    const cost = getTechCost(techId)
    if (!resourceSystem.consumeMultiple(cost)) {
      return false
    }

    // 6. 연구 시작
    this.currentResearch = techId
    this.researchProgress = 0

    // Zustand 상태 업데이트
    useGameStore.getState().startResearch(techId)

    // 이벤트 발생
    this.emit('researchStarted', { techId, tech })

    return true
  }

  /**
   * 연구 완료 처리
   */
  completeResearch() {
    if (!this.currentResearch) return

    const techId = this.currentResearch
    const tech = TECHNOLOGIES[techId]
    if (!tech) return

    // 완료 목록에 추가
    this.completedTechs.add(techId)

    // 효과 적용 (캐시 업데이트)
    for (const effect of tech.effects) {
      if (effect.type === 'multiplier') {
        const current = this.multiplierCache.get(effect.target) ?? 1.0
        this.multiplierCache.set(effect.target, current * effect.value)
      } else if (effect.type === 'unlock') {
        this.unlockedFeatures.add(effect.target)
      } else if (effect.type === 'bonus') {
        const current = this.bonusCache.get(effect.target) ?? 0
        this.bonusCache.set(effect.target, current + effect.value)
      }
    }

    // Zustand 상태 업데이트
    useGameStore.getState().completeResearch(techId)

    // 이벤트 발생
    this.emit('researchCompleted', { techId, tech, effects: tech.effects })
    this.emit('techUnlocked', { techId, tech })

    // 다음 연구 준비
    this.currentResearch = null
    this.researchProgress = 0
  }

  /**
   * 연구 취소 (자원 환불 없음)
   * @returns {boolean} 취소 성공 여부
   */
  cancelResearch() {
    if (!this.currentResearch) return false

    const techId = this.currentResearch
    this.currentResearch = null
    this.researchProgress = 0

    // Zustand 상태 업데이트
    useGameStore.getState().cancelResearch()

    // 이벤트 발생
    this.emit('researchCancelled', { techId })

    return true
  }

  /**
   * 특정 타입의 배수 조회 (기술 효과 적용)
   * @param {string} target - 대상 (예: 'mining', 'farming')
   * @returns {number} 배수 (기본 1.0)
   */
  getMultiplier(target) {
    return this.multiplierCache.get(target) ?? 1.0
  }

  /**
   * 특정 기능 해금 여부 확인
   * @param {string} feature - 기능 ID (예: 'solarPanels', 'premiumKimchi')
   * @returns {boolean}
   */
  isUnlocked(feature) {
    return this.unlockedFeatures.has(feature)
  }

  /**
   * 특정 타입의 보너스 조회 (기술 효과 적용)
   * @param {string} target - 대상 (예: 'waterConsumption', 'powerConsumption')
   * @returns {number} 보너스 값 (기본 0)
   */
  getBonus(target) {
    return this.bonusCache.get(target) ?? 0
  }

  /**
   * 연구 가능한 기술 목록
   * @returns {import('../data/technologies.js').TechnologyDefinition[]}
   */
  getAvailableTechnologies() {
    return getAvailableTechnologies(Array.from(this.completedTechs))
  }

  /**
   * 현재 연구 진행 상태 조회
   * @returns {Object|null} { techId, progress, totalTime, percent }
   */
  getCurrentResearchStatus() {
    if (!this.currentResearch) return null

    const tech = TECHNOLOGIES[this.currentResearch]
    if (!tech) return null

    return {
      techId: this.currentResearch,
      progress: this.researchProgress,
      totalTime: tech.time,
      percent: Math.min((this.researchProgress / tech.time) * 100, 100),
    }
  }

  /**
   * 특정 기술 완료 여부
   * @param {string} techId - 기술 ID
   * @returns {boolean}
   */
  isResearched(techId) {
    return this.completedTechs.has(techId)
  }

  /**
   * 모든 완료된 기술 ID 조회
   * @returns {string[]}
   */
  getCompletedTechs() {
    return Array.from(this.completedTechs)
  }

  /**
   * 연구 진행률 (0-1)
   * @returns {number}
   */
  getResearchProgress() {
    if (!this.currentResearch) return 0

    const tech = TECHNOLOGIES[this.currentResearch]
    if (!tech) return 0

    return Math.min(this.researchProgress / tech.time, 1)
  }

  /**
   * 이벤트 발생
   * @param {string} eventName - 이벤트 이름
   * @param {Object} detail - 이벤트 데이터
   */
  emit(eventName, detail) {
    const event = new CustomEvent(eventName, { detail })
    this.eventBus.dispatchEvent(event)
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} eventName - 이벤트 이름
   * @param {Function} callback - 콜백 함수
   */
  on(eventName, callback) {
    this.eventBus.addEventListener(eventName, event => callback(event.detail))
  }

  /**
   * 이벤트 리스너 제거
   * @param {string} eventName - 이벤트 이름
   * @param {Function} callback - 콜백 함수
   */
  off(eventName, callback) {
    this.eventBus.removeEventListener(eventName, callback)
  }
}

// === 싱글톤 인스턴스 ===

/**
 * 전역 싱글톤 인스턴스
 * @type {ResearchSystem}
 */
export const researchSystem = new ResearchSystem()
