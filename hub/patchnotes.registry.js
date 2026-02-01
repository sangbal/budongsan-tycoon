// hub/patchnotes.registry.js
// 패치노트 레지스트리 (Single Source of Truth)

/**
 * @typedef {Object} PatchNote
 * @property {string} id - 패치노트 고유 ID
 * @property {string} gameId - 게임 ID (games.registry.js와 연동)
 * @property {string} version - 버전 번호 (예: "1.2.0")
 * @property {string} date - 출시일 (YYYY-MM-DD)
 * @property {{ ko: string, en: string }} title - 패치노트 제목
 * @property {PatchNoteItem[]} items - 패치 항목 배열
 */

/**
 * @typedef {Object} PatchNoteItem
 * @property {'feature' | 'fix' | 'balance' | 'ui' | 'content' | 'performance'} category - 카테고리
 * @property {{ ko: string, en: string }} text - 패치 내용
 */

/** @type {PatchNote[]} */
export const PATCH_NOTES = [
  {
    id: 'seoulsurvival-v1.2.2',
    gameId: 'seoulsurvival',
    version: '1.2.2',
    date: '2026-02-01',
    title: {
      ko: '설정 탭 모달 + 게임 페이지',
      en: 'Settings Tab Modal + Game Page',
    },
    items: [
      {
        category: 'feature',
        text: {
          ko: '설정 탭을 모달 팝업으로 전환',
          en: 'Converted settings tab to modal popup',
        },
      },
      {
        category: 'ui',
        text: {
          ko: 'Steam 스타일 게임 페이지 구현',
          en: 'Implemented Steam-style game page',
        },
      },
      {
        category: 'ui',
        text: {
          ko: '패치노트 섹션 추가',
          en: 'Added patch notes section',
        },
      },
    ],
  },
  {
    id: 'seoulsurvival-v1.2.1',
    gameId: 'seoulsurvival',
    version: '1.2.1',
    date: '2026-01-28',
    title: {
      ko: '에이전트 조직 통합',
      en: 'Agent Organization Integration',
    },
    items: [
      {
        category: 'feature',
        text: {
          ko: '에이전트 조직 통합 및 Seoul Survival 개선',
          en: 'Agent organization integration and Seoul Survival improvements',
        },
      },
      {
        category: 'fix',
        text: {
          ko: 'i18n 개선 및 번역 누락 수정',
          en: 'i18n improvements and fixed missing translations',
        },
      },
    ],
  },
  {
    id: 'seoulsurvival-v1.2.0',
    gameId: 'seoulsurvival',
    version: '1.2.0',
    date: '2026-01-26',
    title: {
      ko: '게임 타이틀 i18n',
      en: 'Game Title i18n',
    },
    items: [
      {
        category: 'feature',
        text: {
          ko: '게임 타이틀 i18n 적용',
          en: 'Applied i18n to game titles',
        },
      },
      {
        category: 'feature',
        text: {
          ko: '테스트 커버리지 대폭 향상',
          en: 'Significantly improved test coverage',
        },
      },
    ],
  },
  {
    id: 'seoulsurvival-v1.1.0',
    gameId: 'seoulsurvival',
    version: '1.1.0',
    date: '2026-01-24',
    title: {
      ko: '성능 최적화',
      en: 'Performance Optimization',
    },
    items: [
      {
        category: 'performance',
        text: {
          ko: 'Vendor 청크 분리 (511KB 감소)',
          en: 'Vendor chunk separation (511KB reduction)',
        },
      },
      {
        category: 'performance',
        text: {
          ko: '배경 이미지 프리로드 최적화',
          en: 'Background image preload optimization',
        },
      },
      {
        category: 'performance',
        text: {
          ko: 'devCheatSystem DEV 모드 전용 로드',
          en: 'devCheatSystem DEV mode only loading',
        },
      },
    ],
  },
  {
    id: 'seoulsurvival-v1.0.1',
    gameId: 'seoulsurvival',
    version: '1.0.1',
    date: '2026-01-23',
    title: {
      ko: '코드 최적화',
      en: 'Code Optimization',
    },
    items: [
      {
        category: 'performance',
        text: {
          ko: 'main.js 48% 감소 (2510→1305줄)',
          en: 'main.js 48% reduction (2510→1305 lines)',
        },
      },
      {
        category: 'feature',
        text: {
          ko: '부트스트랩 모듈 분리',
          en: 'Bootstrap module separation',
        },
      },
      {
        category: 'fix',
        text: {
          ko: '매직 넘버 상수화 (timing.js)',
          en: 'Magic numbers converted to constants (timing.js)',
        },
      },
    ],
  },
  {
    id: 'seoulsurvival-v1.0.0',
    gameId: 'seoulsurvival',
    version: '1.0.0',
    date: '2025-12-21',
    title: {
      ko: '초기 릴리즈',
      en: 'Initial Release',
    },
    items: [
      {
        category: 'feature',
        text: {
          ko: '브라우저 기반 자본 축적 클리커 게임',
          en: 'Browser-based capital accumulation clicker game',
        },
      },
      {
        category: 'feature',
        text: {
          ko: '다국어 지원 (한국어/영어)',
          en: 'Multilingual support (Korean/English)',
        },
      },
      {
        category: 'feature',
        text: {
          ko: 'Google 소셜 로그인',
          en: 'Google social login',
        },
      },
      {
        category: 'feature',
        text: {
          ko: '클라우드 저장',
          en: 'Cloud save',
        },
      },
      {
        category: 'feature',
        text: {
          ko: '리더보드 시스템',
          en: 'Leaderboard system',
        },
      },
      {
        category: 'feature',
        text: {
          ko: '프레스티지 시스템',
          en: 'Prestige system',
        },
      },
    ],
  },
]

/**
 * 특정 게임의 패치노트 조회
 * @param {string} gameId - 게임 ID
 * @param {number} [limit] - 최대 개수 (선택)
 * @returns {PatchNote[]}
 */
export function getPatchNotesByGame(gameId, limit) {
  const notes = PATCH_NOTES.filter(note => note.gameId === gameId).sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )
  return limit ? notes.slice(0, limit) : notes
}

/**
 * 버전으로 패치노트 조회
 * @param {string} id - 패치노트 ID
 * @returns {PatchNote | undefined}
 */
export function getPatchNoteById(id) {
  return PATCH_NOTES.find(note => note.id === id)
}

/**
 * 최신 패치노트 조회
 * @param {number} [limit=5] - 최대 개수
 * @returns {PatchNote[]}
 */
export function getLatestPatchNotes(limit = 5) {
  return [...PATCH_NOTES].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit)
}
