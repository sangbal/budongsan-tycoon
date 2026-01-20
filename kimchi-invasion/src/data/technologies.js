/**
 * KIMCHI INVASION - Technology Definitions
 *
 * @description 연구 기술 트리 정의 (Tier 1-5)
 * @module data/technologies
 */

/**
 * @typedef {Object} TechnologyEffect
 * @property {string} type - 효과 타입 ('multiplier' | 'unlock' | 'bonus')
 * @property {string} target - 대상 (예: 'mining', 'farming', 'solarPanels')
 * @property {number} value - 값 (배수, 불린, 보너스 값)
 */

/**
 * @typedef {Object} TechnologyDefinition
 * @property {string} id - 기술 고유 ID
 * @property {number} tier - 티어 (1-5)
 * @property {string} nameKey - i18n 키 (예: 'technologies.efficientDrills.name')
 * @property {string} descKey - i18n 키 (예: 'technologies.efficientDrills.desc')
 * @property {string} icon - 이모지 또는 아이콘 경로
 * @property {Object.<string, number>} cost - 연구 비용 (자원 ID → 수량)
 * @property {number} time - 연구 시간 (초)
 * @property {string[]} prerequisites - 선행 기술 ID 배열
 * @property {TechnologyEffect[]} effects - 기술 효과 배열
 */

/**
 * 기술 정의
 * @type {Object.<string, TechnologyDefinition>}
 */
export const TECHNOLOGIES = {
  // ========================================
  // TIER 1 (기본)
  // ========================================
  efficientDrills: {
    id: 'efficientDrills',
    tier: 1,
    nameKey: 'technologies.efficientDrills.name',
    descKey: 'technologies.efficientDrills.desc',
    icon: '⛏️',
    cost: {
      lactobacillusData: 10,
    },
    time: 30,
    prerequisites: [],
    effects: [
      {
        type: 'multiplier',
        target: 'mining',
        value: 1.2, // +20%
      },
    ],
  },

  improvedFarming: {
    id: 'improvedFarming',
    tier: 1,
    nameKey: 'technologies.improvedFarming.name',
    descKey: 'technologies.improvedFarming.desc',
    icon: '🌱',
    cost: {
      lactobacillusData: 10,
    },
    time: 30,
    prerequisites: [],
    effects: [
      {
        type: 'multiplier',
        target: 'farming',
        value: 1.2, // +20%
      },
    ],
  },

  // ========================================
  // TIER 2 (발전)
  // ========================================
  advancedFermentation: {
    id: 'advancedFermentation',
    tier: 2,
    nameKey: 'technologies.advancedFermentation.name',
    descKey: 'technologies.advancedFermentation.desc',
    icon: '🧪',
    cost: {
      lactobacillusData: 30,
    },
    time: 60,
    prerequisites: ['improvedFarming'],
    effects: [
      {
        type: 'multiplier',
        target: 'fermentation',
        value: 1.3, // +30%
      },
    ],
  },

  solarPanels: {
    id: 'solarPanels',
    tier: 2,
    nameKey: 'technologies.solarPanels.name',
    descKey: 'technologies.solarPanels.desc',
    icon: '☀️',
    cost: {
      lactobacillusData: 25,
    },
    time: 45,
    prerequisites: ['efficientDrills'],
    effects: [
      {
        type: 'unlock',
        target: 'solarPanels',
        value: 1,
      },
    ],
  },

  waterRecycling: {
    id: 'waterRecycling',
    tier: 2,
    nameKey: 'technologies.waterRecycling.name',
    descKey: 'technologies.waterRecycling.desc',
    icon: '💧',
    cost: {
      lactobacillusData: 20,
    },
    time: 50,
    prerequisites: ['improvedFarming'],
    effects: [
      {
        type: 'bonus',
        target: 'waterConsumption',
        value: -0.25, // -25% 소비량
      },
    ],
  },

  // ========================================
  // TIER 3 (자동화)
  // ========================================
  conveyorSpeed: {
    id: 'conveyorSpeed',
    tier: 3,
    nameKey: 'technologies.conveyorSpeed.name',
    descKey: 'technologies.conveyorSpeed.desc',
    icon: '🚚',
    cost: {
      lactobacillusData: 50,
      fermentCulture: 10,
    },
    time: 90,
    prerequisites: ['advancedFermentation'],
    effects: [
      {
        type: 'multiplier',
        target: 'conveyor',
        value: 1.5, // +50%
      },
    ],
  },

  automatedHarvest: {
    id: 'automatedHarvest',
    tier: 3,
    nameKey: 'technologies.automatedHarvest.name',
    descKey: 'technologies.automatedHarvest.desc',
    icon: '🤖',
    cost: {
      lactobacillusData: 60,
      fermentCulture: 15,
    },
    time: 120,
    prerequisites: ['advancedFermentation', 'waterRecycling'],
    effects: [
      {
        type: 'unlock',
        target: 'automatedHarvest',
        value: 1,
      },
      {
        type: 'multiplier',
        target: 'farming',
        value: 1.3, // +30% (총 56% with improvedFarming)
      },
    ],
  },

  batteryStorage: {
    id: 'batteryStorage',
    tier: 3,
    nameKey: 'technologies.batteryStorage.name',
    descKey: 'technologies.batteryStorage.desc',
    icon: '🔋',
    cost: {
      lactobacillusData: 40,
      fermentCulture: 8,
    },
    time: 80,
    prerequisites: ['solarPanels'],
    effects: [
      {
        type: 'multiplier',
        target: 'energyStorage',
        value: 2.0, // 2배
      },
    ],
  },

  // ========================================
  // TIER 4 (프리미엄)
  // ========================================
  premiumFermentation: {
    id: 'premiumFermentation',
    tier: 4,
    nameKey: 'technologies.premiumFermentation.name',
    descKey: 'technologies.premiumFermentation.desc',
    icon: '⭐',
    cost: {
      lactobacillusData: 100,
      fermentCulture: 30,
    },
    time: 180,
    prerequisites: ['automatedHarvest'],
    effects: [
      {
        type: 'unlock',
        target: 'premiumKimchi',
        value: 1,
      },
    ],
  },

  quantumStorage: {
    id: 'quantumStorage',
    tier: 4,
    nameKey: 'technologies.quantumStorage.name',
    descKey: 'technologies.quantumStorage.desc',
    icon: '📦',
    cost: {
      lactobacillusData: 120,
      fermentCulture: 40,
    },
    time: 200,
    prerequisites: ['conveyorSpeed', 'batteryStorage'],
    effects: [
      {
        type: 'multiplier',
        target: 'storageCapacity',
        value: 3.0, // 3배
      },
    ],
  },

  efficientPower: {
    id: 'efficientPower',
    tier: 4,
    nameKey: 'technologies.efficientPower.name',
    descKey: 'technologies.efficientPower.desc',
    icon: '⚡',
    cost: {
      lactobacillusData: 80,
      fermentCulture: 25,
    },
    time: 150,
    prerequisites: ['batteryStorage'],
    effects: [
      {
        type: 'bonus',
        target: 'powerConsumption',
        value: -0.4, // -40% 소비량
      },
    ],
  },

  // ========================================
  // TIER 5 (엔드게임)
  // ========================================
  omegaKimchi: {
    id: 'omegaKimchi',
    tier: 5,
    nameKey: 'technologies.omegaKimchi.name',
    descKey: 'technologies.omegaKimchi.desc',
    icon: '💎',
    cost: {
      lactobacillusData: 200,
      fermentCulture: 80,
      omegaStarter: 10,
    },
    time: 300,
    prerequisites: ['premiumFermentation'],
    effects: [
      {
        type: 'unlock',
        target: 'omegaKimchi',
        value: 1,
      },
    ],
  },

  massProduction: {
    id: 'massProduction',
    tier: 5,
    nameKey: 'technologies.massProduction.name',
    descKey: 'technologies.massProduction.desc',
    icon: '🏭',
    cost: {
      lactobacillusData: 250,
      fermentCulture: 100,
      omegaStarter: 15,
    },
    time: 360,
    prerequisites: ['quantumStorage', 'efficientPower'],
    effects: [
      {
        type: 'multiplier',
        target: 'allProduction',
        value: 2.0, // +100% 모든 생산량
      },
    ],
  },

  spaceLogistics: {
    id: 'spaceLogistics',
    tier: 5,
    nameKey: 'technologies.spaceLogistics.name',
    descKey: 'technologies.spaceLogistics.desc',
    icon: '🚀',
    cost: {
      lactobacillusData: 300,
      fermentCulture: 120,
      omegaStarter: 20,
    },
    time: 400,
    prerequisites: ['quantumStorage', 'premiumFermentation'],
    effects: [
      {
        type: 'multiplier',
        target: 'exportEfficiency',
        value: 3.0, // +200% (총 300%)
      },
    ],
  },

  // Tier 2에 누락된 기술 추가
  basicAutomation: {
    id: 'basicAutomation',
    tier: 2,
    nameKey: 'technologies.basicAutomation.name',
    descKey: 'technologies.basicAutomation.desc',
    icon: '🔧',
    cost: {
      lactobacillusData: 30,
    },
    time: 60,
    prerequisites: ['efficientDrills'],
    effects: [
      {
        type: 'multiplier',
        target: 'processing',
        value: 1.25, // +25% 가공 속도
      },
    ],
  },
}

// ========================================
// 유틸리티 함수
// ========================================

/**
 * 티어별 기술 조회
 * @param {number} tier - 티어 (1-5)
 * @returns {TechnologyDefinition[]}
 */
export function getTechnologiesByTier(tier) {
  return Object.values(TECHNOLOGIES).filter(tech => tech.tier === tier)
}

/**
 * 기술 ID 유효성 검사
 * @param {string} id - 기술 ID
 * @returns {boolean}
 */
export function isValidTechnology(id) {
  return id in TECHNOLOGIES
}

/**
 * 기술 정보 조회
 * @param {string} id - 기술 ID
 * @returns {TechnologyDefinition|null}
 */
export function getTechnology(id) {
  return TECHNOLOGIES[id] ?? null
}

/**
 * 선행 기술 검사
 * @param {string} techId - 기술 ID
 * @param {string[]} researchedTechs - 이미 연구된 기술 ID 배열
 * @returns {boolean} 모든 선행 기술 완료 여부
 */
export function hasPrerequisites(techId, researchedTechs) {
  const tech = TECHNOLOGIES[techId]
  if (!tech) return false

  // 선행 기술이 없으면 true
  if (tech.prerequisites.length === 0) return true

  // 모든 선행 기술이 연구되었는지 확인
  return tech.prerequisites.every(prereq => researchedTechs.includes(prereq))
}

/**
 * 연구 가능한 기술 목록 (선행 기술 완료됨)
 * @param {string[]} researchedTechs - 이미 연구된 기술 ID 배열
 * @returns {TechnologyDefinition[]}
 */
export function getAvailableTechnologies(researchedTechs) {
  return Object.values(TECHNOLOGIES).filter(
    tech => !researchedTechs.includes(tech.id) && hasPrerequisites(tech.id, researchedTechs)
  )
}

/**
 * 기술 비용 조회
 * @param {string} techId - 기술 ID
 * @returns {Object.<string, number>|null} 비용 맵
 */
export function getTechCost(techId) {
  return TECHNOLOGIES[techId]?.cost ?? null
}

/**
 * 기술 연구 시간 조회 (초)
 * @param {string} techId - 기술 ID
 * @returns {number} 연구 시간 (초)
 */
export function getTechTime(techId) {
  return TECHNOLOGIES[techId]?.time ?? 0
}

/**
 * 특정 타입의 효과만 필터링
 * @param {string} techId - 기술 ID
 * @param {string} effectType - 효과 타입 ('multiplier' | 'unlock' | 'bonus')
 * @returns {TechnologyEffect[]}
 */
export function getEffectsByType(techId, effectType) {
  const tech = TECHNOLOGIES[techId]
  if (!tech) return []

  return tech.effects.filter(effect => effect.type === effectType)
}

/**
 * 모든 기술 ID 배열
 * @returns {string[]}
 */
export function getAllTechIds() {
  return Object.keys(TECHNOLOGIES)
}

/**
 * 티어별 정렬된 기술 목록
 * @returns {TechnologyDefinition[]}
 */
export function getTechsSortedByTier() {
  return Object.values(TECHNOLOGIES).sort((a, b) => a.tier - b.tier)
}
