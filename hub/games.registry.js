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
 * @property {{ ko: string, en: string }} [shortDescription] - 짧은 설명 (1-2문장)
 * @property {{ ko: string, en: string }} [aboutContent] - 상세 설명 HTML
 * @property {string} href - 게임 링크
 * @property {'live' | 'prototype' | 'coming_soon'} status - 게임 상태
 * @property {string} [badge] - 배지 텍스트 (선택)
 * @property {string[]} [tags] - 게임 태그 (최대 5개)
 * @property {Object} [media] - 미디어 리소스
 * @property {string} [media.capsuleImage] - 캡슐 이미지 (16:9)
 * @property {string} [media.trailerVideo] - 트레일러 비디오
 * @property {string[]} [media.screenshots] - 스크린샷 배열
 * @property {Object[]} [features] - 주요 특징 (최대 4개)
 * @property {string} [features[].icon] - 아이콘 이모지
 * @property {{ ko: string, en: string }} [features[].text] - 특징 설명
 * @property {Object} [browserCompat] - 브라우저 호환성
 * @property {string} [releaseDate] - 출시일 (YYYY-MM-DD)
 * @property {string} [developer] - 개발자
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
    shortDescription: {
      ko: '클릭(노동)으로 시작해 투자로 성장하고, 승진과 이벤트로 다음 목표가 열립니다.',
      en: 'Start with work, grow through investing, and unlock goals through ranks and events.',
    },
    aboutContent: {
      ko: '<p>알바생에서 시작해 CEO까지. <strong>서울 생존기</strong>는 노동과 투자의 선순환을 통해 자산을 키우는 증분 게임입니다.</p><h3>핵심 특징</h3><ul><li><strong>직관적인 진행:</strong> 클릭으로 시작해 업그레이드로 자동화</li><li><strong>전략적 투자:</strong> 시장 이벤트를 활용한 타이밍 플레이</li><li><strong>승진 시스템:</strong> 새로운 단계와 보상 해금</li><li><strong>프레스티지:</strong> 서울타워 구매로 새로운 게임 시작</li></ul>',
      en: '<p>From part-time worker to CEO. <strong>Seoul Survival</strong> is an incremental game where you grow your wealth through labor and investment.</p><h3>Key Features</h3><ul><li><strong>Intuitive progression:</strong> Start with clicks, automate with upgrades</li><li><strong>Strategic investing:</strong> Time your moves with market events</li><li><strong>Rank system:</strong> Unlock new stages and rewards</li><li><strong>Prestige:</strong> Buy Seoul Tower to start anew with bonuses</li></ul>',
    },
    href: './seoulsurvival/',
    status: 'live',
    badge: 'Featured',
    tags: ['Incremental', 'Idle', 'Strategy', 'Economy', 'Prestige'],
    media: {
      capsuleImage: './assets/seoulsurvival-capsule.jpg',
      trailerVideo: null,
      screenshots: [
        '/seoulsurvival/assets/images/work_bg_01_alba_night.webp',
        '/seoulsurvival/assets/images/work_bg_05_gwajang_night.webp',
        '/seoulsurvival/assets/images/work_bg_10_ceo_night.webp',
      ],
    },
    features: [
      { icon: '🖱️', text: { ko: '브라우저에서 즉시 플레이', en: 'Play instantly in browser' } },
      { icon: '☁️', text: { ko: '클라우드 저장 & 리더보드', en: 'Cloud saves & leaderboards' } },
      {
        icon: '📈',
        text: { ko: '전략적 투자 & 시장 이벤트', en: 'Strategic investing & market events' },
      },
      { icon: '♻️', text: { ko: '프레스티지로 새로운 시작', en: 'Prestige for new beginnings' } },
    ],
    browserCompat: {
      chrome: '90+',
      firefox: '88+',
      safari: '14+',
      edge: '90+',
    },
    releaseDate: '2025-01-15',
    developer: 'ClickSurvivor Hub',
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
