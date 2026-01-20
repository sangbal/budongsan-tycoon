/**
 * KIMCHI INVASION - Building Definitions
 *
 * @description M1 단계에 필요한 10종 건물 메타데이터 정의
 * @module data/buildings
 */

/**
 * @typedef {Object} BuildingDefinition
 * @property {string} id - 건물 고유 ID
 * @property {string} category - 카테고리 (extraction, production, power, utility, logistics)
 * @property {string} nameKey - i18n 키 (예: 'buildings.extractor.name')
 * @property {string} descKey - i18n 키 (예: 'buildings.extractor.desc')
 * @property {string} icon - 이모지 또는 아이콘 경로
 * @property {string} color - 표시 색상 (HEX)
 * @property {Object} cost - 건설 비용 { dollars: 100, iron: 20, ... }
 * @property {Object} input - 입력 자원/sec { resourceId: amount }
 * @property {Object} output - 출력 자원/sec { resourceId: amount }
 * @property {number} processTime - 가공 시간 (초, 0이면 연속 생산)
 * @property {number} energyPerTick - 틱당 에너지 소비 (초당)
 * @property {Object} size - 크기 { width, height } 타일 단위
 * @property {number} maxLevel - 최대 레벨
 * @property {string[]} tags - 태그
 */

/**
 * 건물 정의
 * @type {Object.<string, BuildingDefinition>}
 */
export const BUILDINGS = {
  // ========================================
  // EXTRACTION (채굴/채집)
  // ========================================
  extractor: {
    id: 'extractor',
    category: 'extraction',
    nameKey: 'buildings.extractor.name',
    descKey: 'buildings.extractor.desc',
    icon: '⛏️',
    color: '#6B7280', // Gray
    cost: {
      dollars: 100,
      iron: 20,
    },
    input: {},
    output: {
      iron: 0.5, // 0.5개/sec
    },
    processTime: 0, // 연속 생산
    energyPerTick: 1, // 1 에너지/sec
    size: { width: 2, height: 2 },
    maxLevel: 5,
    tags: ['mining', 'auto', 'tier1'],
  },

  iceHarvester: {
    id: 'iceHarvester',
    category: 'extraction',
    nameKey: 'buildings.iceHarvester.name',
    descKey: 'buildings.iceHarvester.desc',
    icon: '🧊',
    color: '#BAE6FD', // Light Cyan
    cost: {
      dollars: 80,
      iron: 15,
    },
    input: {},
    output: {
      ice: 0.3, // 0.3개/sec
    },
    processTime: 0, // 연속 생산
    energyPerTick: 1, // 1 에너지/sec
    size: { width: 2, height: 2 },
    maxLevel: 5,
    tags: ['mining', 'auto', 'water-source', 'tier1'],
  },

  // ========================================
  // PRODUCTION (가공/제조)
  // ========================================
  greenhouse: {
    id: 'greenhouse',
    category: 'production',
    nameKey: 'buildings.greenhouse.name',
    descKey: 'buildings.greenhouse.desc',
    icon: '🏡',
    color: '#10B981', // Green
    cost: {
      dollars: 200,
      iron: 30,
      sand: 10, // 유리 제작용
    },
    input: {
      water: 0.1, // 0.1개/sec
    },
    output: {
      cabbage: 0.033, // 1개/30초
    },
    processTime: 30, // 30초마다 수확
    energyPerTick: 2, // 2 에너지/sec
    size: { width: 3, height: 3 },
    maxLevel: 5,
    tags: ['farming', 'crop-production', 'tier1'],
  },

  furnace: {
    id: 'furnace',
    category: 'production',
    nameKey: 'buildings.furnace.name',
    descKey: 'buildings.furnace.desc',
    icon: '🔥',
    color: '#F97316', // Orange
    cost: {
      dollars: 150,
      iron: 50,
    },
    input: {
      iron: 2, // 2개 소비
    },
    output: {
      iron: 1, // 철판 1개 생산 (자원 ID 동일하지만 가공품)
    },
    processTime: 15, // 15초
    energyPerTick: 5, // 5 에너지/sec
    size: { width: 2, height: 2 },
    maxLevel: 5,
    tags: ['smelting', 'processing', 'tier1'],
  },

  brineStation: {
    id: 'brineStation',
    category: 'production',
    nameKey: 'buildings.brineStation.name',
    descKey: 'buildings.brineStation.desc',
    icon: '🧂',
    color: '#F3F4F6', // White
    cost: {
      dollars: 120,
      iron: 25,
    },
    input: {
      water: 10, // 10개 소비
    },
    output: {
      salt: 1, // 소금 1개
    },
    processTime: 20, // 20초
    energyPerTick: 3, // 3 에너지/sec
    size: { width: 2, height: 2 },
    maxLevel: 5,
    tags: ['processing', 'kimchi-ingredient', 'tier1'],
  },

  fermentationChamber: {
    id: 'fermentationChamber',
    category: 'production',
    nameKey: 'buildings.fermentationChamber.name',
    descKey: 'buildings.fermentationChamber.desc',
    icon: '🥬',
    color: '#DC2626', // Red
    cost: {
      dollars: 500,
      iron: 60,
      sand: 20,
    },
    input: {
      cabbage: 1, // 절인 배추 1개
      salt: 1, // 양념 1개
      chilliPowder: 1, // 고춧가루 1개
    },
    output: {
      kimchi: 1, // 김치 1개
    },
    processTime: 60, // 60초 기본 (숙성도에 따라 품질 결정)
    energyPerTick: 4, // 4 에너지/sec (온도 관리)
    size: { width: 3, height: 3 },
    maxLevel: 5,
    tags: ['fermentation', 'kimchi-production', 'tier2'],
  },

  // ========================================
  // POWER (전력)
  // ========================================
  coalPowerPlant: {
    id: 'coalPowerPlant',
    category: 'power',
    nameKey: 'buildings.coalPowerPlant.name',
    descKey: 'buildings.coalPowerPlant.desc',
    icon: '⚡',
    color: '#FCD34D', // Yellow
    cost: {
      dollars: 300,
      iron: 50,
    },
    input: {
      regolith: 0.3, // 3개/10초 (레골리스를 연료로 사용)
    },
    output: {
      energy: 10, // 10 에너지/sec 생산
    },
    processTime: 0, // 연속 생산
    energyPerTick: -10, // 에너지 생산 (음수)
    size: { width: 3, height: 3 },
    maxLevel: 5,
    tags: ['power-generation', 'tier1'],
  },

  // ========================================
  // UTILITY (유틸리티)
  // ========================================
  warehouse: {
    id: 'warehouse',
    category: 'utility',
    nameKey: 'buildings.warehouse.name',
    descKey: 'buildings.warehouse.desc',
    icon: '📦',
    color: '#8B5CF6', // Purple
    cost: {
      dollars: 200,
      iron: 40,
    },
    input: {},
    output: {},
    processTime: 0,
    energyPerTick: 0, // 에너지 소비 없음
    size: { width: 3, height: 3 },
    maxLevel: 10,
    tags: ['storage', 'utility', 'tier1'],
    effect: {
      type: 'storage',
      value: 500, // 모든 자원 +500 용량
    },
  },

  // ========================================
  // LOGISTICS (물류)
  // ========================================
  conveyor: {
    id: 'conveyor',
    category: 'logistics',
    nameKey: 'buildings.conveyor.name',
    descKey: 'buildings.conveyor.desc',
    icon: '➡️',
    color: '#A16207', // Brown
    cost: {
      dollars: 10,
      iron: 2,
    },
    input: {},
    output: {},
    processTime: 0,
    energyPerTick: 0.1, // 0.1 에너지/sec
    size: { width: 1, height: 1 },
    maxLevel: 3,
    tags: ['logistics', 'transport', 'tier2'],
    effect: {
      type: 'transport',
      speed: 1.0, // 1 아이템/sec
    },
  },

  inserter: {
    id: 'inserter',
    category: 'logistics',
    nameKey: 'buildings.inserter.name',
    descKey: 'buildings.inserter.desc',
    icon: '🦾',
    color: '#6B7280', // Gray
    cost: {
      dollars: 50,
      iron: 5,
    },
    input: {},
    output: {},
    processTime: 0,
    energyPerTick: 0.2, // 0.2 에너지/sec
    size: { width: 1, height: 1 },
    maxLevel: 5,
    tags: ['logistics', 'inserter', 'tier2'],
    effect: {
      type: 'transfer',
      speed: 0.5, // 1 아이템/2sec (기본)
    },
  },
}

// ========================================
// 카테고리 정의
// ========================================

/**
 * 건물 카테고리 정보
 */
export const BUILDING_CATEGORIES = {
  extraction: {
    id: 'extraction',
    nameKey: 'buildings.categories.extraction',
    color: '#6B7280',
    icon: '⛏️',
    sortOrder: 0,
  },
  production: {
    id: 'production',
    nameKey: 'buildings.categories.production',
    color: '#F97316',
    icon: '🔥',
    sortOrder: 1,
  },
  power: {
    id: 'power',
    nameKey: 'buildings.categories.power',
    color: '#FCD34D',
    icon: '⚡',
    sortOrder: 2,
  },
  utility: {
    id: 'utility',
    nameKey: 'buildings.categories.utility',
    color: '#8B5CF6',
    icon: '📦',
    sortOrder: 3,
  },
  logistics: {
    id: 'logistics',
    nameKey: 'buildings.categories.logistics',
    color: '#A16207',
    icon: '➡️',
    sortOrder: 4,
  },
}

// ========================================
// 유틸리티 함수
// ========================================

/**
 * 카테고리별 건물 조회
 * @param {string} category - 카테고리 ID
 * @returns {BuildingDefinition[]}
 */
export function getBuildingsByCategory(category) {
  return Object.values(BUILDINGS).filter(b => b.category === category)
}

/**
 * 건물 건설 비용 검사
 * @param {string} buildingId - 건물 ID
 * @param {Object.<string, number>} resources - 현재 보유 자원 { resourceId: amount }
 * @returns {boolean} 건설 가능 여부
 */
export function canAfford(buildingId, resources) {
  const building = BUILDINGS[buildingId]
  if (!building) return false

  for (const [resourceId, amount] of Object.entries(building.cost)) {
    if ((resources[resourceId] ?? 0) < amount) {
      return false
    }
  }

  return true
}

/**
 * 건물 정보 조회
 * @param {string} id - 건물 ID
 * @returns {BuildingDefinition|null}
 */
export function getBuilding(id) {
  return BUILDINGS[id] ?? null
}

/**
 * 모든 건물 ID 배열
 * @returns {string[]}
 */
export function getAllBuildingIds() {
  return Object.keys(BUILDINGS)
}

/**
 * 태그로 건물 검색
 * @param {string} tag - 태그
 * @returns {BuildingDefinition[]}
 */
export function getBuildingsByTag(tag) {
  return Object.values(BUILDINGS).filter(b => b.tags?.includes(tag))
}

/**
 * 건물 ID 유효성 검사
 * @param {string} id - 건물 ID
 * @returns {boolean}
 */
export function isValidBuilding(id) {
  return id in BUILDINGS
}

/**
 * 카테고리별 정렬된 건물 목록
 * @returns {BuildingDefinition[]}
 */
export function getBuildingsSortedByCategory() {
  const categories = Object.keys(BUILDING_CATEGORIES).sort(
    (a, b) => BUILDING_CATEGORIES[a].sortOrder - BUILDING_CATEGORIES[b].sortOrder
  )

  return categories.flatMap(category => getBuildingsByCategory(category))
}

/**
 * 건물 에너지 수지 계산
 * @param {string} buildingId - 건물 ID
 * @param {number} level - 건물 레벨 (기본 1)
 * @returns {number} 에너지 수지 (음수면 소비, 양수면 생산)
 */
export function getEnergyBalance(buildingId, level = 1) {
  const building = BUILDINGS[buildingId]
  if (!building) return 0

  // 레벨에 따라 에너지 수지 조정 (레벨당 -5%)
  const multiplier = 1 - (level - 1) * 0.05
  return -building.energyPerTick * multiplier
}

/**
 * 건물 업그레이드 비용 계산
 * @param {string} buildingId - 건물 ID
 * @param {number} currentLevel - 현재 레벨
 * @returns {Object.<string, number>|null} 업그레이드 비용 또는 null (최대 레벨)
 */
export function getUpgradeCost(buildingId, currentLevel) {
  const building = BUILDINGS[buildingId]
  if (!building || currentLevel >= building.maxLevel) return null

  // 업그레이드 비용 = 기본 건설 비용 * (1.5 ^ 현재레벨)
  const multiplier = Math.pow(1.5, currentLevel)
  const upgradeCost = {}

  for (const [resourceId, amount] of Object.entries(building.cost)) {
    upgradeCost[resourceId] = Math.ceil(amount * multiplier)
  }

  return upgradeCost
}

/**
 * 건물 생산량 계산 (레벨에 따라)
 * @param {string} buildingId - 건물 ID
 * @param {number} level - 건물 레벨
 * @returns {Object.<string, number>} 출력 자원/sec
 */
export function getProductionRate(buildingId, level = 1) {
  const building = BUILDINGS[buildingId]
  if (!building || !building.output) return {}

  // 레벨당 생산량 +20% 증가
  const multiplier = 1 + (level - 1) * 0.2
  const production = {}

  for (const [resourceId, amount] of Object.entries(building.output)) {
    production[resourceId] = amount * multiplier
  }

  return production
}

/**
 * Tier별 건물 조회
 * @param {number} tier - Tier (1-5)
 * @returns {BuildingDefinition[]}
 */
export function getBuildingsByTier(tier) {
  const tierTag = `tier${tier}`
  return Object.values(BUILDINGS).filter(b => b.tags?.includes(tierTag))
}
