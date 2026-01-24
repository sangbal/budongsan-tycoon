/**
 * timing.js
 * 게임 타이밍 및 확률 상수
 *
 * 하드코딩된 매직 넘버를 중앙화하여:
 * - 유지보수성 향상
 * - 밸런스 조정 용이
 * - 코드 가독성 개선
 */

// ======= 게임 틱 =======
export const TIMING = {
  /** 메인 게임 루프 틱 간격 (ms) */
  TICK_INTERVAL_MS: 50,

  /** 자동 저장 간격 (ms) - 5초 */
  AUTO_SAVE_INTERVAL_MS: 5000,

  /** 리더보드 업데이트 쓰로틀 (ms) - 30초 */
  LEADERBOARD_THROTTLE_MS: 30000,

  /** 클릭 효과 애니메이션 지속 시간 (ms) */
  CLICK_EFFECT_DURATION_MS: 300,

  /** 새로고침 전 지연 시간 (ms) */
  RELOAD_DELAY_MS: 500,
}

// ======= 시장 이벤트 =======
export const MARKET_EVENT_TIMING = {
  /** 시장 이벤트 최소 대기 시간 (ms) - 2분 */
  MIN_INTERVAL_MS: 120000,

  /** 시장 이벤트 랜덤 범위 (ms) - 3분 */
  RANDOM_RANGE_MS: 180000,

  /** 결과: MIN_INTERVAL_MS + Math.random() * RANDOM_RANGE_MS = 2~5분 */
}

// ======= 확률 =======
export const PROBABILITY = {
  /** 성과급 발생 확률 (2%) */
  PERFORMANCE_BONUS_CHANCE: 0.02,

  /** 성과급 배수 (10배) */
  PERFORMANCE_BONUS_MULTIPLIER: 10,

  /** 자동 클릭 확률 (현재 100%이지만, 추후 조정 가능) */
  AUTO_CLICK_CHANCE: 1.0,
}

// ======= 애니메이션 =======
export const ANIMATION = {
  /** 직급 승진 페이드 아웃 지속 시간 (ms) */
  PROMOTION_FADEOUT_MS: 300,
  CAREER_FADE_OUT: 300, // alias

  /** 직급 승진 배경 전환 지속 시간 (ms) */
  PROMOTION_TRANSITION_MS: 800,
  CAREER_BG_TRANSITION: 800, // alias

  /** 직급 승진 페이드 인 지속 시간 (ms) */
  CAREER_FADE_IN: 500,

  /** 직급 카드 애니메이션 지속 시간 (ms) */
  CAREER_CARD: 600,

  /** 직급 카드 애니메이션 지연 (ms) */
  CAREER_CARD_ANIMATION_DELAY_MS: 10,
}

// ======= 재시도 =======
export const RETRY = {
  /** 저장 최대 재시도 횟수 */
  SAVE_MAX_ATTEMPTS: 3,

  /** 저장 재시도 지연 (지수 백오프, ms) */
  SAVE_RETRY_DELAYS: [1000, 2000, 4000],
}
