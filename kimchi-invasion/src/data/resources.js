/**
 * KIMCHI INVASION - Resource Definitions
 *
 * @description 게임의 모든 자원 메타데이터 정의
 * @module data/resources
 */

/**
 * @typedef {Object} ResourceDefinition
 * @property {string} id - 자원 고유 ID
 * @property {string} category - 카테고리 (raw, crop, processed, utility, research)
 * @property {string} nameKey - i18n 키 (예: 'resources.iron.name')
 * @property {string} descKey - i18n 키 (예: 'resources.iron.desc')
 * @property {string} icon - 이모지 또는 아이콘 경로
 * @property {string} color - 표시 색상 (HEX)
 * @property {number} initialValue - 초기값
 * @property {number} maxValue - 최대값 (창고 용량, -1이면 무제한)
 * @property {boolean} canTrade - 거래 가능 여부
 * @property {number} basePrice - 기본 가격 ($, 거래 가능 자원만)
 * @property {string[]} tags - 추가 태그 (optional)
 */

/**
 * 자원 정의
 * @type {Object.<string, ResourceDefinition>}
 */
export const RESOURCES = {
  // ========================================
  // UTILITY (유틸리티)
  // ========================================
  dollars: {
    id: 'dollars',
    category: 'utility',
    nameKey: 'resources.dollars.name',
    descKey: 'resources.dollars.desc',
    icon: '💰',
    color: '#10B981', // Green
    initialValue: 100, // 시작 자금
    maxValue: -1, // 무제한
    canTrade: false,
    basePrice: 0,
    tags: ['currency'],
  },

  energy: {
    id: 'energy',
    category: 'utility',
    nameKey: 'resources.energy.name',
    descKey: 'resources.energy.desc',
    icon: '⚡',
    color: '#FCD34D', // Yellow
    initialValue: 0,
    maxValue: 100, // 초기 배터리 용량
    canTrade: false,
    basePrice: 0,
    tags: ['power'],
  },

  oxygen: {
    id: 'oxygen',
    category: 'utility',
    nameKey: 'resources.oxygen.name',
    descKey: 'resources.oxygen.desc',
    icon: '💨',
    color: '#60A5FA', // Light Blue
    initialValue: 100,
    maxValue: 200, // 초기 산소탱크 용량
    canTrade: false,
    basePrice: 0,
    tags: ['life-support'],
  },

  // ========================================
  // RAW MATERIALS (원자재)
  // ========================================
  ironOre: {
    id: 'ironOre',
    category: 'raw',
    nameKey: 'resources.ironOre.name',
    descKey: 'resources.ironOre.desc',
    icon: '🪨',
    color: '#8B4513', // Brown (철광석 색상)
    initialValue: 0,
    maxValue: 1000,
    canTrade: true,
    basePrice: 2,
    tags: ['mineral', 'ore', 'raw'],
  },

  ironPlate: {
    id: 'ironPlate',
    category: 'processed',
    nameKey: 'resources.ironPlate.name',
    descKey: 'resources.ironPlate.desc',
    icon: '🔩',
    color: '#6B7280', // Gray (가공품)
    initialValue: 0,
    maxValue: 500,
    canTrade: true,
    basePrice: 8,
    tags: ['mineral', 'processed', 'construction'],
  },

  // Legacy: iron은 ironPlate의 별칭으로 유지 (기존 코드 호환)
  iron: {
    id: 'iron',
    category: 'raw',
    nameKey: 'resources.iron.name',
    descKey: 'resources.iron.desc',
    icon: '⚙️',
    color: '#6B7280', // Gray
    initialValue: 0,
    maxValue: 1000,
    canTrade: true,
    basePrice: 5,
    tags: ['mineral', 'construction', 'legacy'],
  },

  water: {
    id: 'water',
    category: 'raw',
    nameKey: 'resources.water.name',
    descKey: 'resources.water.desc',
    icon: '💧',
    color: '#3B82F6', // Blue
    initialValue: 0,
    maxValue: 500,
    canTrade: true,
    basePrice: 2,
    tags: ['liquid', 'essential'],
  },

  salt: {
    id: 'salt',
    category: 'raw',
    nameKey: 'resources.salt.name',
    descKey: 'resources.salt.desc',
    icon: '🧂',
    color: '#F3F4F6', // White
    initialValue: 0,
    maxValue: 300,
    canTrade: true,
    basePrice: 3,
    tags: ['mineral', 'seasoning'],
  },

  ice: {
    id: 'ice',
    category: 'raw',
    nameKey: 'resources.ice.name',
    descKey: 'resources.ice.desc',
    icon: '🧊',
    color: '#BAE6FD', // Light Cyan
    initialValue: 0,
    maxValue: 500,
    canTrade: true,
    basePrice: 1,
    tags: ['frozen', 'water-source'],
  },

  regolith: {
    id: 'regolith',
    category: 'raw',
    nameKey: 'resources.regolith.name',
    descKey: 'resources.regolith.desc',
    icon: '🪨',
    color: '#A16207', // Brown
    initialValue: 0,
    maxValue: 2000,
    canTrade: false,
    basePrice: 0,
    tags: ['soil', 'mars'],
  },

  sand: {
    id: 'sand',
    category: 'raw',
    nameKey: 'resources.sand.name',
    descKey: 'resources.sand.desc',
    icon: '⏳',
    color: '#FDE68A', // Sand Yellow
    initialValue: 0,
    maxValue: 1000,
    canTrade: true,
    basePrice: 1,
    tags: ['mineral', 'construction'],
  },

  // ========================================
  // CROPS (농작물)
  // ========================================
  cabbage: {
    id: 'cabbage',
    category: 'crop',
    nameKey: 'resources.cabbage.name',
    descKey: 'resources.cabbage.desc',
    icon: '🥬',
    color: '#34D399', // Green
    initialValue: 0,
    maxValue: 500,
    canTrade: true,
    basePrice: 8,
    tags: ['vegetable', 'kimchi-ingredient'],
  },

  radish: {
    id: 'radish',
    category: 'crop',
    nameKey: 'resources.radish.name',
    descKey: 'resources.radish.desc',
    icon: '🥕',
    color: '#F59E0B', // Orange
    initialValue: 0,
    maxValue: 500,
    canTrade: true,
    basePrice: 6,
    tags: ['vegetable', 'kimchi-ingredient'],
  },

  garlic: {
    id: 'garlic',
    category: 'crop',
    nameKey: 'resources.garlic.name',
    descKey: 'resources.garlic.desc',
    icon: '🧄',
    color: '#F3F4F6', // White
    initialValue: 0,
    maxValue: 300,
    canTrade: true,
    basePrice: 4,
    tags: ['spice', 'seasoning'],
  },

  ginger: {
    id: 'ginger',
    category: 'crop',
    nameKey: 'resources.ginger.name',
    descKey: 'resources.ginger.desc',
    icon: '🫚',
    color: '#D97706', // Brown-Orange
    initialValue: 0,
    maxValue: 300,
    canTrade: true,
    basePrice: 5,
    tags: ['spice', 'seasoning'],
  },

  scallion: {
    id: 'scallion',
    category: 'crop',
    nameKey: 'resources.scallion.name',
    descKey: 'resources.scallion.desc',
    icon: '🧅',
    color: '#84CC16', // Lime Green
    initialValue: 0,
    maxValue: 400,
    canTrade: true,
    basePrice: 4,
    tags: ['vegetable', 'kimchi-ingredient'],
  },

  cucumber: {
    id: 'cucumber',
    category: 'crop',
    nameKey: 'resources.cucumber.name',
    descKey: 'resources.cucumber.desc',
    icon: '🥒',
    color: '#10B981', // Green
    initialValue: 0,
    maxValue: 400,
    canTrade: true,
    basePrice: 7,
    tags: ['vegetable', 'kimchi-ingredient'],
  },

  chilliPowder: {
    id: 'chilliPowder',
    category: 'crop',
    nameKey: 'resources.chilliPowder.name',
    descKey: 'resources.chilliPowder.desc',
    icon: '🌶️',
    color: '#DC2626', // Red
    initialValue: 0,
    maxValue: 200,
    canTrade: true,
    basePrice: 10,
    tags: ['spice', 'seasoning', 'processed'],
  },

  // ========================================
  // PROCESSED (가공품 - 김치)
  // ========================================
  kimchi: {
    id: 'kimchi',
    category: 'processed',
    nameKey: 'resources.kimchi.name',
    descKey: 'resources.kimchi.desc',
    icon: '🥬',
    color: '#DC2626', // Red
    initialValue: 0,
    maxValue: 500,
    canTrade: true,
    basePrice: 50,
    tags: ['fermented', 'export-goods', 'basic'],
  },

  kkakdugi: {
    id: 'kkakdugi',
    category: 'processed',
    nameKey: 'resources.kkakdugi.name',
    descKey: 'resources.kkakdugi.desc',
    icon: '🥕',
    color: '#F97316', // Orange-Red
    initialValue: 0,
    maxValue: 500,
    canTrade: true,
    basePrice: 45,
    tags: ['fermented', 'export-goods', 'basic'],
  },

  paKimchi: {
    id: 'paKimchi',
    category: 'processed',
    nameKey: 'resources.paKimchi.name',
    descKey: 'resources.paKimchi.desc',
    icon: '🧅',
    color: '#22C55E', // Green
    initialValue: 0,
    maxValue: 400,
    canTrade: true,
    basePrice: 40,
    tags: ['fermented', 'export-goods', 'fast-production'],
  },

  oiSobagi: {
    id: 'oiSobagi',
    category: 'processed',
    nameKey: 'resources.oiSobagi.name',
    descKey: 'resources.oiSobagi.desc',
    icon: '🥒',
    color: '#15803D', // Dark Green
    initialValue: 0,
    maxValue: 300,
    canTrade: true,
    basePrice: 80,
    tags: ['fermented', 'export-goods', 'premium'],
  },

  premiumKimchi: {
    id: 'premiumKimchi',
    category: 'processed',
    nameKey: 'resources.premiumKimchi.name',
    descKey: 'resources.premiumKimchi.desc',
    icon: '⭐',
    color: '#FBBF24', // Gold
    initialValue: 0,
    maxValue: 200,
    canTrade: true,
    basePrice: 150,
    tags: ['fermented', 'export-goods', 'premium', 'aged'],
  },

  omegaKimchi: {
    id: 'omegaKimchi',
    category: 'processed',
    nameKey: 'resources.omegaKimchi.name',
    descKey: 'resources.omegaKimchi.desc',
    icon: '💎',
    color: '#8B5CF6', // Purple
    initialValue: 0,
    maxValue: 100,
    canTrade: true,
    basePrice: 500,
    tags: ['fermented', 'export-goods', 'ultra-premium', 'endgame'],
  },

  // ========================================
  // RESEARCH (연구 자원)
  // ========================================
  lactobacillusData: {
    id: 'lactobacillusData',
    category: 'research',
    nameKey: 'resources.lactobacillusData.name',
    descKey: 'resources.lactobacillusData.desc',
    icon: '🔬',
    color: '#6366F1', // Indigo
    initialValue: 0,
    maxValue: 500,
    canTrade: false,
    basePrice: 0,
    tags: ['science', 'tier1-2'],
  },

  fermentCulture: {
    id: 'fermentCulture',
    category: 'research',
    nameKey: 'resources.fermentCulture.name',
    descKey: 'resources.fermentCulture.desc',
    icon: '🧬',
    color: '#A855F7', // Purple
    initialValue: 0,
    maxValue: 300,
    canTrade: false,
    basePrice: 0,
    tags: ['science', 'tier3-4'],
  },

  omegaStarter: {
    id: 'omegaStarter',
    category: 'research',
    nameKey: 'resources.omegaStarter.name',
    descKey: 'resources.omegaStarter.desc',
    icon: '🧫',
    color: '#EC4899', // Pink
    initialValue: 0,
    maxValue: 100,
    canTrade: false,
    basePrice: 0,
    tags: ['science', 'tier5', 'endgame'],
  },
}

// ========================================
// 카테고리 정의
// ========================================

/**
 * 자원 카테고리 정보
 */
export const RESOURCE_CATEGORIES = {
  utility: {
    id: 'utility',
    nameKey: 'resources.categories.utility',
    color: '#6B7280',
    icon: '⚙️',
    sortOrder: 0,
  },
  raw: {
    id: 'raw',
    nameKey: 'resources.categories.raw',
    color: '#8B5CF6',
    icon: '⛏️',
    sortOrder: 1,
  },
  crop: {
    id: 'crop',
    nameKey: 'resources.categories.crop',
    color: '#10B981',
    icon: '🌱',
    sortOrder: 2,
  },
  processed: {
    id: 'processed',
    nameKey: 'resources.categories.processed',
    color: '#DC2626',
    icon: '🥬',
    sortOrder: 3,
  },
  research: {
    id: 'research',
    nameKey: 'resources.categories.research',
    color: '#6366F1',
    icon: '🔬',
    sortOrder: 4,
  },
}

// ========================================
// 유틸리티 함수
// ========================================

/**
 * 카테고리별 자원 조회
 * @param {string} category - 카테고리 ID
 * @returns {ResourceDefinition[]}
 */
export function getResourcesByCategory(category) {
  return Object.values(RESOURCES).filter(r => r.category === category)
}

/**
 * 자원 ID 유효성 검사
 * @param {string} id - 자원 ID
 * @returns {boolean}
 */
export function isValidResource(id) {
  return id in RESOURCES
}

/**
 * 태그로 자원 검색
 * @param {string} tag - 태그
 * @returns {ResourceDefinition[]}
 */
export function getResourcesByTag(tag) {
  return Object.values(RESOURCES).filter(r => r.tags?.includes(tag))
}

/**
 * 거래 가능한 자원만 조회
 * @returns {ResourceDefinition[]}
 */
export function getTradableResources() {
  return Object.values(RESOURCES).filter(r => r.canTrade)
}

/**
 * 자원 정보 조회
 * @param {string} id - 자원 ID
 * @returns {ResourceDefinition|null}
 */
export function getResource(id) {
  return RESOURCES[id] ?? null
}

/**
 * 자원 표시 색상 조회
 * @param {string} id - 자원 ID
 * @returns {string} HEX 색상
 */
export function getResourceColor(id) {
  return RESOURCES[id]?.color ?? '#6B7280'
}

/**
 * 자원 아이콘 조회
 * @param {string} id - 자원 ID
 * @returns {string} 아이콘 (이모지 또는 경로)
 */
export function getResourceIcon(id) {
  return RESOURCES[id]?.icon ?? '❓'
}

/**
 * 모든 자원 ID 배열
 * @returns {string[]}
 */
export function getAllResourceIds() {
  return Object.keys(RESOURCES)
}

/**
 * 카테고리별 정렬된 자원 목록
 * @returns {ResourceDefinition[]}
 */
export function getResourcesSortedByCategory() {
  const categories = Object.keys(RESOURCE_CATEGORIES).sort(
    (a, b) => RESOURCE_CATEGORIES[a].sortOrder - RESOURCE_CATEGORIES[b].sortOrder
  )

  return categories.flatMap(category => getResourcesByCategory(category))
}
