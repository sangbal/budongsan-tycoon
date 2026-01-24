/**
 * growthTracking.js 테스트
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  resetGrowthTracking,
  loadGrowthTracking,
  saveGrowthTracking,
  updateGrowthTracking,
} from '../growthTracking.js'

// i18n mock
vi.mock('../../../i18n/index.js', () => ({
  t: vi.fn((key, params) => {
    if (key === 'stats.maxAchieved') return '최대 달성'
    if (key === 'stats.remaining') return `${params?.amount || 0} 남음`
    if (key === 'stats.unit.perHour') return '/시간'
    return key
  }),
}))

// numberFormat mock
vi.mock('../../../utils/numberFormat.js', () => ({
  formatStatsNumber: vi.fn((num, settings) => `${num}`),
  formatCashDisplay: vi.fn((num, settings) => `₩${num}`),
}))

// gameState mock
vi.mock('../../../state/gameState.js', () => ({
  gameState: {
    depositsLifetime: 1000,
    savingsLifetime: 2000,
    bondsLifetime: 3000,
    usStocksLifetime: 4000,
    cryptosLifetime: 5000,
    villasLifetime: 6000,
    officetelsLifetime: 7000,
    apartmentsLifetime: 8000,
    shopsLifetime: 9000,
    buildingsLifetime: 10000,
    totalLaborIncome: 1000,
  },
}))

describe('growthTracking.js', () => {
  beforeEach(() => {
    // DOM 요소 생성
    document.body.innerHTML = `
      <span id="hourlyEarnings"></span>
      <span id="dailyEarnings"></span>
      <span id="growthRate"></span>
      <span id="nextMilestone"></span>
    `
    // 상태 초기화
    resetGrowthTracking()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('resetGrowthTracking', () => {
    it('상태 초기화', () => {
      // 먼저 데이터 로드
      loadGrowthTracking({
        hourlyEarningsHistory: [{ time: Date.now(), earnings: 1000 }],
        dailyEarningsHistory: [{ time: Date.now(), earnings: 1000 }],
        lastEarningsSnapshot: 5000,
        lastSnapshotTime: Date.now() - 60000,
      })

      // 리셋
      resetGrowthTracking()

      // 저장 데이터 확인
      const savedData = saveGrowthTracking()
      expect(savedData.hourlyEarningsHistory).toHaveLength(0)
      expect(savedData.dailyEarningsHistory).toHaveLength(0)
      expect(savedData.lastEarningsSnapshot).toBe(0)
    })
  })

  describe('loadGrowthTracking', () => {
    it('저장된 데이터 로드', () => {
      const savedData = {
        hourlyEarningsHistory: [{ time: Date.now(), earnings: 1000 }],
        dailyEarningsHistory: [{ time: Date.now(), earnings: 2000 }],
        lastEarningsSnapshot: 5000,
        lastSnapshotTime: Date.now() - 30000,
      }

      loadGrowthTracking(savedData)

      const result = saveGrowthTracking()
      expect(result.hourlyEarningsHistory).toHaveLength(1)
      expect(result.dailyEarningsHistory).toHaveLength(1)
      expect(result.lastEarningsSnapshot).toBe(5000)
    })

    it('null 데이터 처리', () => {
      expect(() => loadGrowthTracking(null)).not.toThrow()
    })

    it('undefined 데이터 처리', () => {
      expect(() => loadGrowthTracking(undefined)).not.toThrow()
    })

    it('빈 객체 처리', () => {
      loadGrowthTracking({})

      const result = saveGrowthTracking()
      expect(result.hourlyEarningsHistory).toHaveLength(0)
    })
  })

  describe('saveGrowthTracking', () => {
    it('현재 상태 반환', () => {
      const result = saveGrowthTracking()

      expect(result).toHaveProperty('hourlyEarningsHistory')
      expect(result).toHaveProperty('dailyEarningsHistory')
      expect(result).toHaveProperty('lastEarningsSnapshot')
      expect(result).toHaveProperty('lastSnapshotTime')
    })
  })

  describe('updateGrowthTracking', () => {
    let mockDeps

    beforeEach(() => {
      mockDeps = {
        settings: { notation: 'korean' },
        safeText: vi.fn((element, text) => {
          if (element) element.textContent = text
        }),
      }
    })

    it('UI 업데이트', () => {
      updateGrowthTracking(mockDeps)

      expect(mockDeps.safeText).toHaveBeenCalled()
    })

    it('시간당 수익 계산', () => {
      // 1시간 전 기록 추가
      loadGrowthTracking({
        hourlyEarningsHistory: [{ time: Date.now() - 1800000, earnings: 50000 }], // 30분 전
        dailyEarningsHistory: [],
        lastEarningsSnapshot: 0,
        lastSnapshotTime: Date.now(),
      })

      updateGrowthTracking(mockDeps)

      const hourlyEl = document.getElementById('hourlyEarnings')
      expect(hourlyEl.textContent).toBeDefined()
    })

    it('마일스톤 표시 (다음 목표)', () => {
      updateGrowthTracking(mockDeps)

      const milestoneEl = document.getElementById('nextMilestone')
      // 현재 수익이 56000이므로 다음 목표는 1000000
      expect(milestoneEl.textContent).toContain('남음')
    })

    it('성장률 표시', () => {
      updateGrowthTracking(mockDeps)

      const growthEl = document.getElementById('growthRate')
      expect(growthEl.textContent).toContain('%')
      expect(growthEl.textContent).toContain('/시간')
    })

    it('DOM 요소 없어도 에러 없음', () => {
      document.body.innerHTML = ''

      expect(() => updateGrowthTracking(mockDeps)).not.toThrow()
    })

    it('오래된 기록 정리 (1시간 초과)', () => {
      // 2시간 전 기록 추가
      loadGrowthTracking({
        hourlyEarningsHistory: [{ time: Date.now() - 7200000, earnings: 1000 }],
        dailyEarningsHistory: [],
        lastEarningsSnapshot: 0,
        lastSnapshotTime: Date.now(),
      })

      updateGrowthTracking(mockDeps)

      const savedData = saveGrowthTracking()
      // 1시간 초과 기록은 제거됨
      expect(savedData.hourlyEarningsHistory).toHaveLength(0)
    })

    it('최대 60개 기록 유지', () => {
      // 70개 기록 추가
      const now = Date.now()
      const history = []
      for (let i = 0; i < 70; i++) {
        history.push({ time: now - i * 50000, earnings: i * 1000 })
      }

      loadGrowthTracking({
        hourlyEarningsHistory: history,
        dailyEarningsHistory: [],
        lastEarningsSnapshot: 0,
        lastSnapshotTime: now,
      })

      updateGrowthTracking(mockDeps)

      const savedData = saveGrowthTracking()
      // 1시간 초과 + 60개 제한
      expect(savedData.hourlyEarningsHistory.length).toBeLessThanOrEqual(60)
    })
  })
})
