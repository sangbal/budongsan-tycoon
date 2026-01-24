/**
 * Seoul Survival - Career System Tests
 *
 * 직급 승진 시스템 단위 테스트 (Phase 14 업데이트)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createCareerSystem } from '../careerSystem.js'

// Mock gameState
vi.mock('../../state/gameState.js', () => ({
  gameState: {
    careerLevel: 0,
    totalClicks: 0,
    clickMultiplier: 1,
  },
  CAREER_LEVELS: [
    { nameKey: 'career.alba', bgImage: 'alba.png' },
    { nameKey: 'career.gyeyakjik', bgImage: 'gyeyakjik.png' },
    { nameKey: 'career.sawon', bgImage: 'sawon.png' },
  ],
}))

// Mock incomeCalculator
vi.mock('../../economy/incomeCalculator.js', () => ({
  getClickIncome: vi.fn(() => 10000),
  getCurrentCareer: vi.fn(() => ({
    nameKey: 'career.gyeyakjik',
    multiplier: 2,
    bgImage: 'gyeyakjik.png',
  })),
  getNextCareer: vi.fn(() => ({
    nameKey: 'career.gyeyakjik',
    multiplier: 2,
    requiredClicks: 100,
    bgImage: 'gyeyakjik.png',
  })),
  getCareerName: vi.fn(level => {
    const names = ['알바생', '계약직', '사원']
    return names[level] || ''
  }),
}))

// Mock i18n
vi.mock('../../i18n/index.js', () => ({
  t: (key, params) => {
    if (key === 'msg.promoted') return `${params?.career}으로 승진! 수익: ${params?.income}`
    return key
  },
}))

// Mock NumberFormat
vi.mock('../../utils/numberFormat.js', () => ({
  formatKoreanNumber: num => num?.toLocaleString('ko-KR') || '0',
}))

// Mock Diary
vi.mock('../diary.js', () => ({
  addLog: vi.fn(),
}))

// Mock timing constants
vi.mock('../../balance/timing.js', () => ({
  ANIMATION: {
    CAREER_FADE_OUT: 300,
    CAREER_BG_TRANSITION: 800,
    CAREER_FADE_IN: 500,
    CAREER_CARD: 600,
  },
}))

describe('createCareerSystem (Phase 14)', () => {
  let careerSystem
  let mockGameState
  let mockIncomeCalculator

  beforeEach(async () => {
    vi.useFakeTimers()

    // DOM mock
    document.body.innerHTML = `
      <div id="workArea"></div>
      <div class="career-card"></div>
      <div id="currentCareer"></div>
    `

    // Reset mocks
    const { gameState } = await import('../../state/gameState.js')
    mockGameState = gameState
    mockGameState.careerLevel = 0
    mockGameState.totalClicks = 0
    mockGameState.clickMultiplier = 1

    const incomeCalc = await import('../../economy/incomeCalculator.js')
    mockIncomeCalculator = incomeCalc

    careerSystem = createCareerSystem({
      elWorkArea: document.getElementById('workArea'),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('checkCareerPromotion', () => {
    it('클릭 수 부족 시 승진 불가', async () => {
      mockGameState.totalClicks = 50 // 100 필요
      mockIncomeCalculator.getNextCareer.mockReturnValue({
        requiredClicks: 100,
        bgImage: 'next.png',
      })

      const promoted = careerSystem.checkCareerPromotion()
      expect(promoted).toBe(false)
      expect(mockGameState.careerLevel).toBe(0)
    })

    it('클릭 수 충족 시 승진', async () => {
      mockGameState.totalClicks = 100
      mockGameState.careerLevel = 0
      mockIncomeCalculator.getNextCareer.mockReturnValue({
        requiredClicks: 100,
        bgImage: 'gyeyakjik.png',
      })
      mockIncomeCalculator.getCurrentCareer.mockReturnValue({
        bgImage: 'gyeyakjik.png',
      })

      const promoted = careerSystem.checkCareerPromotion()
      expect(promoted).toBe(true)
      expect(mockGameState.careerLevel).toBe(1)
    })

    it('마지막 직급이면 승진 불가', async () => {
      mockIncomeCalculator.getNextCareer.mockReturnValue(null)

      const promoted = careerSystem.checkCareerPromotion()
      expect(promoted).toBe(false)
    })

    it('승진 시 배경 이미지 변경 애니메이션', async () => {
      mockGameState.totalClicks = 100
      mockIncomeCalculator.getNextCareer.mockReturnValue({
        requiredClicks: 100,
        bgImage: 'gyeyakjik.png',
      })
      mockIncomeCalculator.getCurrentCareer.mockReturnValue({
        bgImage: 'gyeyakjik.png',
      })

      const workArea = document.getElementById('workArea')
      careerSystem.checkCareerPromotion()

      // 페이드 아웃 시작
      expect(workArea.style.transition).toContain('opacity')
      expect(workArea.style.opacity).toBe('0.5')

      // 300ms 후 배경 변경
      await vi.advanceTimersByTimeAsync(300)
      expect(workArea.style.backgroundImage).toContain('gyeyakjik.png')
      expect(workArea.style.opacity).toBe('1')
    })

    it('bgImage가 없는 경우 그라디언트 배경', async () => {
      mockGameState.totalClicks = 100
      mockIncomeCalculator.getNextCareer.mockReturnValue({
        requiredClicks: 100,
      })
      mockIncomeCalculator.getCurrentCareer.mockReturnValue({
        // no bgImage
      })

      const workArea = document.getElementById('workArea')
      careerSystem.checkCareerPromotion()

      await vi.advanceTimersByTimeAsync(300)
      expect(workArea.style.backgroundImage).toContain('radial-gradient')
    })

    it('직급 카드 애니메이션 적용', async () => {
      mockGameState.totalClicks = 100
      mockIncomeCalculator.getNextCareer.mockReturnValue({
        requiredClicks: 100,
        bgImage: 'test.png',
      })
      mockIncomeCalculator.getCurrentCareer.mockReturnValue({
        bgImage: 'test.png',
      })

      careerSystem.checkCareerPromotion()

      const careerCard = document.querySelector('.career-card')
      expect(careerCard.style.animation).toBe('none')

      await vi.advanceTimersByTimeAsync(10)
      expect(careerCard.style.animation).toContain('careerPromotion')
    })

    it('스크린 리더용 aria-label 업데이트', () => {
      mockGameState.totalClicks = 100
      mockIncomeCalculator.getNextCareer.mockReturnValue({
        requiredClicks: 100,
        bgImage: 'test.png',
      })
      mockIncomeCalculator.getCurrentCareer.mockReturnValue({
        bgImage: 'test.png',
      })

      careerSystem.checkCareerPromotion()

      const currentCareerEl = document.getElementById('currentCareer')
      expect(currentCareerEl.getAttribute('aria-label')).toContain('승진')
    })

    it('workArea가 null이면 에러 없이 처리', () => {
      const careerSystemNoWorkArea = createCareerSystem({ elWorkArea: null })
      mockGameState.totalClicks = 100
      mockIncomeCalculator.getNextCareer.mockReturnValue({
        requiredClicks: 100,
        bgImage: 'test.png',
      })

      expect(() => careerSystemNoWorkArea.checkCareerPromotion()).not.toThrow()
    })

    it('career-card가 없어도 에러 없이 처리', () => {
      document.body.innerHTML = '<div id="workArea"></div>'

      const cs = createCareerSystem({
        elWorkArea: document.getElementById('workArea'),
      })

      mockGameState.totalClicks = 100
      mockIncomeCalculator.getNextCareer.mockReturnValue({
        requiredClicks: 100,
        bgImage: 'test.png',
      })
      mockIncomeCalculator.getCurrentCareer.mockReturnValue({
        bgImage: 'test.png',
      })

      expect(() => cs.checkCareerPromotion()).not.toThrow()
    })

    it('currentCareer 요소가 없어도 에러 없이 처리', () => {
      document.body.innerHTML = '<div id="workArea"></div>'

      const cs = createCareerSystem({
        elWorkArea: document.getElementById('workArea'),
      })

      mockGameState.totalClicks = 100
      mockIncomeCalculator.getNextCareer.mockReturnValue({
        requiredClicks: 100,
        bgImage: 'test.png',
      })
      mockIncomeCalculator.getCurrentCareer.mockReturnValue({
        bgImage: 'test.png',
      })

      expect(() => cs.checkCareerPromotion()).not.toThrow()
    })
  })

  describe('re-exported functions', () => {
    it('getClickIncome 함수 접근 가능', () => {
      expect(careerSystem.getClickIncome).toBeDefined()
      expect(typeof careerSystem.getClickIncome).toBe('function')
    })

    it('getCurrentCareer 함수 접근 가능', () => {
      expect(careerSystem.getCurrentCareer).toBeDefined()
    })

    it('getNextCareer 함수 접근 가능', () => {
      expect(careerSystem.getNextCareer).toBeDefined()
    })

    it('getCareerName 함수 접근 가능', () => {
      expect(careerSystem.getCareerName).toBeDefined()
    })
  })
})
