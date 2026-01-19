/**
 * KIMCHI INVASION - Game Store (Zustand)
 *
 * @description 게임 핵심 상태 관리 (자원, 건물, 생산)
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/**
 * @typedef {Object} Resources
 * @property {number} dollars - 화폐
 * @property {number} iron - 철광석
 * @property {number} water - 물
 * @property {number} salt - 소금
 * @property {number} energy - 에너지
 * @property {number} cabbage - 배추
 * @property {number} radish - 무
 * @property {number} garlic - 마늘
 * @property {number} ginger - 생강
 * @property {number} chilliPowder - 고춧가루
 * @property {number} kimchi - 김치
 */

/**
 * @typedef {Object} Building
 * @property {string} id - 고유 ID
 * @property {string} type - 건물 타입
 * @property {number} x - 타일 X 좌표
 * @property {number} y - 타일 Y 좌표
 * @property {number} level - 건물 레벨
 * @property {Object} inventory - 내부 재고
 * @property {number} progress - 작업 진행률 (0-1)
 */

/**
 * @typedef {Object} GameState
 * @property {Resources} resources - 자원
 * @property {Object} production - 초당 생산량
 * @property {Building[]} buildings - 건물 목록
 * @property {Object} buildingCounts - 타입별 건물 수
 * @property {string[]} unlockedTech - 해금된 기술
 * @property {string|null} researching - 연구 중인 기술
 * @property {number} researchProgress - 연구 진행률
 * @property {Object} stats - 통계
 */

/** @type {Resources} */
const DEFAULT_RESOURCES = {
  dollars: 0,
  iron: 0,
  water: 0,
  salt: 0,
  energy: 0,
  cabbage: 0,
  radish: 0,
  garlic: 0,
  ginger: 0,
  chilliPowder: 0,
  kimchi: 0,
  premiumKimchi: 0,
  omegaKimchi: 0,
}

const DEFAULT_PRODUCTION = {
  iron: 0,
  water: 0,
  energy: 0,
  kimchi: 0,
}

const DEFAULT_STATS = {
  totalKimchiProduced: 0,
  totalDollarsEarned: 0,
  totalBuildingsPlaced: 0,
  totalPlayTime: 0,
  highestKimchiRate: 0,
}

/**
 * Game Store
 */
export const useGameStore = create(
  subscribeWithSelector((set, get) => ({
    // === State ===
    resources: { ...DEFAULT_RESOURCES },
    production: { ...DEFAULT_PRODUCTION },
    buildings: [],
    buildingCounts: {},
    unlockedTech: [],
    researching: null,
    researchProgress: 0,
    stats: { ...DEFAULT_STATS },

    // Meta
    version: '1.0.0',
    createdAt: null,
    lastSavedAt: null,
    playTime: 0,

    // === Actions: Resources ===

    /**
     * 자원 추가/감소
     * @param {string} resource - 자원 이름
     * @param {number} amount - 변경량 (음수 가능)
     */
    modifyResource: (resource, amount) => {
      set(state => ({
        resources: {
          ...state.resources,
          [resource]: Math.max(0, (state.resources[resource] ?? 0) + amount),
        },
      }))
    },

    /**
     * 여러 자원 동시 변경
     * @param {Object} changes - { resource: amount } 형식
     */
    modifyResources: changes => {
      set(state => {
        const newResources = { ...state.resources }
        for (const [resource, amount] of Object.entries(changes)) {
          newResources[resource] = Math.max(0, (newResources[resource] ?? 0) + amount)
        }
        return { resources: newResources }
      })
    },

    /**
     * 자원 구매 가능 여부 확인
     * @param {Object} costs - { resource: amount } 형식
     * @returns {boolean}
     */
    canAfford: costs => {
      const { resources } = get()
      for (const [resource, amount] of Object.entries(costs)) {
        if ((resources[resource] ?? 0) < amount) {
          return false
        }
      }
      return true
    },

    /**
     * 자원 소비 (구매 불가시 false 반환)
     * @param {Object} costs - { resource: amount } 형식
     * @returns {boolean}
     */
    spendResources: costs => {
      if (!get().canAfford(costs)) return false

      set(state => {
        const newResources = { ...state.resources }
        for (const [resource, amount] of Object.entries(costs)) {
          newResources[resource] = Math.max(0, newResources[resource] - amount)
        }
        return { resources: newResources }
      })
      return true
    },

    // === Actions: Buildings ===

    /**
     * 건물 추가
     * @param {Building} building
     */
    addBuilding: building => {
      set(state => {
        const newBuildings = [...state.buildings, building]
        const newCounts = { ...state.buildingCounts }
        newCounts[building.type] = (newCounts[building.type] ?? 0) + 1

        return {
          buildings: newBuildings,
          buildingCounts: newCounts,
          stats: {
            ...state.stats,
            totalBuildingsPlaced: state.stats.totalBuildingsPlaced + 1,
          },
        }
      })
    },

    /**
     * 건물 제거
     * @param {string} buildingId
     */
    removeBuilding: buildingId => {
      set(state => {
        const building = state.buildings.find(b => b.id === buildingId)
        if (!building) return state

        const newBuildings = state.buildings.filter(b => b.id !== buildingId)
        const newCounts = { ...state.buildingCounts }
        newCounts[building.type] = Math.max(0, (newCounts[building.type] ?? 1) - 1)

        return {
          buildings: newBuildings,
          buildingCounts: newCounts,
        }
      })
    },

    /**
     * 건물 업데이트
     * @param {string} buildingId
     * @param {Partial<Building>} updates
     */
    updateBuilding: (buildingId, updates) => {
      set(state => ({
        buildings: state.buildings.map(b => (b.id === buildingId ? { ...b, ...updates } : b)),
      }))
    },

    /**
     * 특정 위치의 건물 찾기
     * @param {number} x
     * @param {number} y
     * @returns {Building|undefined}
     */
    getBuildingAt: (x, y) => {
      return get().buildings.find(b => b.x === x && b.y === y)
    },

    // === Actions: Production ===

    /**
     * 생산량 업데이트
     * @param {Object} rates - { resource: ratePerSecond }
     */
    setProduction: rates => {
      set({ production: { ...get().production, ...rates } })
    },

    /**
     * 생산 틱 처리 (deltaTime초 동안의 생산)
     * @param {number} deltaTime - 초 단위
     */
    processTick: deltaTime => {
      const { production, resources, stats } = get()
      const changes = {}
      let kimchiProduced = 0

      for (const [resource, rate] of Object.entries(production)) {
        if (rate > 0) {
          const amount = rate * deltaTime
          changes[resource] = amount

          if (resource === 'kimchi') {
            kimchiProduced = amount
          }
        }
      }

      if (Object.keys(changes).length > 0) {
        set(state => {
          const newResources = { ...state.resources }
          for (const [resource, amount] of Object.entries(changes)) {
            newResources[resource] = (newResources[resource] ?? 0) + amount
          }

          return {
            resources: newResources,
            playTime: state.playTime + deltaTime,
            stats: {
              ...state.stats,
              totalKimchiProduced: state.stats.totalKimchiProduced + kimchiProduced,
              totalPlayTime: state.stats.totalPlayTime + deltaTime,
              highestKimchiRate: Math.max(state.stats.highestKimchiRate, production.kimchi ?? 0),
            },
          }
        })
      }
    },

    // === Actions: Tech ===

    /**
     * 기술 해금
     * @param {string} techId
     */
    unlockTech: techId => {
      set(state => ({
        unlockedTech: [...new Set([...state.unlockedTech, techId])],
        researching: state.researching === techId ? null : state.researching,
        researchProgress: state.researching === techId ? 0 : state.researchProgress,
      }))
    },

    /**
     * 연구 시작
     * @param {string} techId
     */
    startResearch: techId => {
      set({ researching: techId, researchProgress: 0 })
    },

    /**
     * 연구 진행
     * @param {number} progress - 0-1 사이
     */
    updateResearchProgress: progress => {
      set({ researchProgress: Math.min(1, progress) })
    },

    // === Actions: Save/Load ===

    /**
     * 상태를 저장 가능한 객체로 직렬화
     * @returns {Object}
     */
    serialize: () => {
      const state = get()
      return {
        version: state.version,
        createdAt: state.createdAt,
        lastSavedAt: Date.now(),
        playTime: state.playTime,
        resources: state.resources,
        production: state.production,
        buildings: state.buildings,
        buildingCounts: state.buildingCounts,
        unlockedTech: state.unlockedTech,
        researching: state.researching,
        researchProgress: state.researchProgress,
        stats: state.stats,
      }
    },

    /**
     * 저장된 상태 복원
     * @param {Object} savedState
     */
    deserialize: savedState => {
      if (!savedState) return

      set({
        version: savedState.version ?? '1.0.0',
        createdAt: savedState.createdAt ?? Date.now(),
        lastSavedAt: savedState.lastSavedAt,
        playTime: savedState.playTime ?? 0,
        resources: { ...DEFAULT_RESOURCES, ...savedState.resources },
        production: { ...DEFAULT_PRODUCTION, ...savedState.production },
        buildings: savedState.buildings ?? [],
        buildingCounts: savedState.buildingCounts ?? {},
        unlockedTech: savedState.unlockedTech ?? [],
        researching: savedState.researching ?? null,
        researchProgress: savedState.researchProgress ?? 0,
        stats: { ...DEFAULT_STATS, ...savedState.stats },
      })
    },

    /**
     * 상태 초기화
     */
    reset: () => {
      set({
        resources: { ...DEFAULT_RESOURCES },
        production: { ...DEFAULT_PRODUCTION },
        buildings: [],
        buildingCounts: {},
        unlockedTech: [],
        researching: null,
        researchProgress: 0,
        stats: { ...DEFAULT_STATS },
        createdAt: Date.now(),
        lastSavedAt: null,
        playTime: 0,
      })
    },
  }))
)

// === Selectors (성능 최적화용) ===

/**
 * 특정 자원만 구독
 * @param {string} resource
 */
export const selectResource = resource => state => state.resources[resource] ?? 0

/**
 * 건물 개수 구독
 * @param {string} type
 */
export const selectBuildingCount = type => state => state.buildingCounts[type] ?? 0

/**
 * 총 김치 생산량 구독
 */
export const selectKimchiRate = state => state.production.kimchi ?? 0
