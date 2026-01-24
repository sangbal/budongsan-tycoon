/**
 * 업그레이드 정의 모듈 - 배럴 파일
 * Phase 1.3: upgrades 모듈 분해 후 하위 호환성 유지를 위한 re-export
 *
 * 기존: 1003줄 단일 파일
 * 현재: 5개 모듈로 분해
 *   - upgrades/index.js (통합 팩토리)
 *   - upgrades/labor.js (노동 업그레이드)
 *   - upgrades/financial.js (금융 업그레이드)
 *   - upgrades/property.js (부동산 업그레이드)
 *   - upgrades/global.js (전역 업그레이드)
 */
export { createUpgrades } from './upgrades/index.js'
