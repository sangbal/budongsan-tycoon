/**
 * 업그레이드 정의 모듈 - 통합 팩토리
 * Phase 1.3: upgrades.js 분해 (1003줄 → 5개 모듈)
 *
 * Factory 패턴을 사용하여 main.js의 로컬 변수들을 의존성으로 주입받습니다.
 */

import { createLaborUpgrades } from './labor.js'
import { createFinancialUpgrades } from './financial.js'
import { createPropertyUpgrades } from './property.js'
import { createGlobalUpgrades } from './global.js'

/**
 * @typedef {Object} UpgradeDependencies
 * @property {() => number} getCareerLevel - 현재 직급 레벨 반환
 * @property {() => number} getClickMultiplier - 클릭 배수 반환
 * @property {(v: number) => void} setClickMultiplier - 클릭 배수 설정
 * @property {() => number} getTotalClicks - 총 클릭 수 반환
 * @property {() => number} getDeposits - 예금 수량 반환
 * @property {() => number} getSavings - 적금 수량 반환
 * @property {() => number} getBonds - 국내주식 수량 반환
 * @property {() => number} getUsStocks - 미국주식 수량 반환
 * @property {() => number} getCryptos - 코인 수량 반환
 * @property {() => number} getVillas - 빌라 수량 반환
 * @property {() => number} getOfficetels - 오피스텔 수량 반환
 * @property {() => number} getApartments - 아파트 수량 반환
 * @property {() => number} getShops - 상가 수량 반환
 * @property {() => number} getBuildings - 빌딩 수량 반환
 * @property {() => number} getTotalProperties - 총 부동산 수 반환
 * @property {() => void} updateAutoWorkUI - 자동 업무 UI 업데이트
 * @property {() => void} setAutoClickEnabled - 자동 클릭 활성화 설정
 * @property {() => void} incrementManagerLevel - 관리인 레벨 증가
 * @property {Object} FINANCIAL_INCOME - 금융상품 수익 테이블
 * @property {Object} BASE_RENT - 부동산 기본 월세 테이블
 * @property {() => number} getRentMultiplier - 월세 배수 반환
 * @property {(v: number) => void} setRentMultiplier - 월세 배수 설정
 */

/**
 * 업그레이드 객체를 생성하는 팩토리 함수
 * @param {UpgradeDependencies} deps - 의존성 객체
 * @returns {Object} UPGRADES 객체
 */
export function createUpgrades(deps) {
  return {
    ...createLaborUpgrades(deps),
    ...createFinancialUpgrades(deps),
    ...createPropertyUpgrades(deps),
    ...createGlobalUpgrades(deps),
  }
}
