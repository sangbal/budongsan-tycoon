// hub/games.registry.js
// 게임 카탈로그 단일 소스 (Single Source of Truth)

/**
 * @typedef {Object} Game
 * @property {string} id - 게임 고유 ID
 * @property {string} slug - URL 슬러그
 * @property {boolean} featured - 메인 히어로 섹션에 표시 여부
 * @property {{ ko: string, en: string }} title - 게임 제목
 * @property {{ ko: string, en: string }} [subtitle] - 부제목 (선택)
 * @property {{ ko: string, en: string }} description - 게임 설명
 * @property {string} href - 게임 링크
 * @property {'live' | 'prototype' | 'coming_soon'} status - 게임 상태
 * @property {string} [badge] - 배지 텍스트 (선택)
 */

/** @type {Game[]} */
export const GAMES = [
  {
    id: 'seoulsurvival',
    slug: 'seoulsurvival',
    featured: true,
    title: { ko: '서울 생존기', en: 'Seoul Survival' },
    subtitle: { ko: '흙수저 탈출', en: 'Rags to Riches' },
    description: {
      ko: '노동으로 시드를 만들고, 투자로 가속하세요.\n승진과 이벤트로 다음 목표가 열립니다.',
      en: 'Build seed through labor, accelerate with investments.\nPromotions and events unlock your next goals.',
    },
    href: './seoulsurvival/',
    status: 'live',
    badge: 'Featured',
  },
  {
    id: 'mma-manager',
    slug: 'mma-manager',
    featured: false,
    title: { ko: 'MMA Promotion Manager', en: 'MMA Promotion Manager' },
    description: {
      ko: '선수 발굴, 매치메이킹, 흥행 관리.\n동네 단체에서 글로벌 1위까지 성장시키세요.',
      en: 'Scout fighters, make matches, manage promotions.\nGrow from local to global #1.',
    },
    href: './mma-manager/',
    status: 'live',
  },
  {
    id: 'kimchi-invasion',
    slug: 'kimchi-invasion',
    featured: false,
    title: { ko: 'Kimchi Invasion', en: 'Kimchi Invasion' },
    description: {
      ko: '김치로 우주를 정복하세요.',
      en: 'Conquer the universe with kimchi.',
    },
    href: './kimchi-invasion/',
    status: 'prototype',
    badge: 'Prototype',
  },
]

/**
 * ID로 게임 조회
 * @param {string} id
 * @returns {Game | undefined}
 */
export function getGameById(id) {
  return GAMES.find(g => g.id === id)
}

/**
 * 피처드 게임 조회
 * @returns {Game | undefined}
 */
export function getFeaturedGame() {
  return GAMES.find(g => g.featured)
}

/**
 * 게임 목록 조회
 * @param {boolean} [excludeFeatured=false] - 피처드 게임 제외 여부
 * @returns {Game[]}
 */
export function getGameList(excludeFeatured = false) {
  return excludeFeatured ? GAMES.filter(g => !g.featured) : GAMES
}
