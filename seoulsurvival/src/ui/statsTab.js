/**
 * 통계 탭 렌더러 - 배럴 파일
 * Phase 1.2: statsTab 모듈 분해 후 하위 호환성 유지를 위한 re-export
 *
 * 기존: 1126줄 단일 파일
 * 현재: 5개 모듈로 분해
 *   - statsTab/index.js (조율자)
 *   - statsTab/growthTracking.js (성장 추적)
 *   - statsTab/charts.js (도넛 차트)
 *   - statsTab/efficiency.js (효율 분석)
 *   - statsTab/achievementGrid.js (업적 그리드)
 */
export {
  updateStatsTab,
  resetGrowthTracking,
  loadGrowthTracking,
  saveGrowthTracking,
  setAchievementScrollActive,
} from './statsTab/index.js'
