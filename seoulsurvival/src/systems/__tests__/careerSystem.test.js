/**
 * Seoul Survival - Career System Tests
 *
 * 직급 승진 시스템 단위 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createCareerSystem } from '../careerSystem.js'

// Mock CAREER_LEVELS
const mockCareerLevels = [
  {
    nameKey: 'career.alba',
    multiplier: 1,
    requiredClicks: 0,
    bgImage: 'alba.png',
  },
  {
    nameKey: 'career.gyeyakjik',
    multiplier: 2,
    requiredClicks: 100,
    bgImage: 'gyeyakjik.png',
  },
  {
    nameKey: 'career.sawon',
    multiplier: 5,
    requiredClicks: 500,
    bgImage: 'sawon.png',
  },
]

// Mock i18n - 실제 경로에 맞게 수정
vi.mock('../../i18n/index.js', () => ({
  t: (key, params) => {
    if (key === 'career.alba') return '알바생'
    if (key === 'career.gyeyakjik') return '계약직'
    if (key === 'career.sawon') return '사원'
    if (key === 'msg.promoted') return `${params.career}으로 승진! 수익: ${params.income}`
    return key
  },
}))

// Mock NumberFormat - 실제 경로에 맞게 수정
vi.mock('../../utils/numberFormat.js', () => ({
  formatKoreanNumber: num => num.toLocaleString('ko-KR'),
}))

// Mock Diary - 실제 경로에 맞게 수정
vi.mock('../diary.js', () => ({
  addLog: vi.fn(),
}))

describe('createCareerSystem', () => {
  let careerSystem
  let deps

  beforeEach(() => {
    // DOM mock
    document.body.innerHTML = '<div id="workArea"></div>'

    deps = {
      CAREER_LEVELS: mockCareerLevels,
      getCareerLevel: vi.fn(() => 0),
      setCareerLevel: vi.fn(),
      getTotalClicks: vi.fn(() => 0),
      getClickMultiplier: vi.fn(() => 1),
      getElWorkArea: vi.fn(() => document.getElementById('workArea')),
    }

    careerSystem = createCareerSystem(deps)
  })

  describe('getCareerName', () => {
    it('레벨 0은 알바생', () => {
      expect(careerSystem.getCareerName(0)).toBe('알바생')
    })

    it('레벨 1은 계약직', () => {
      expect(careerSystem.getCareerName(1)).toBe('계약직')
    })

    it('잘못된 레벨은 빈 문자열', () => {
      expect(careerSystem.getCareerName(-1)).toBe('')
      expect(careerSystem.getCareerName(999)).toBe('')
    })
  })

  describe('getClickIncome', () => {
    it('알바생 (multiplier 1) 기본 수익은 10,000원', () => {
      deps.getCareerLevel = vi.fn(() => 0)
      deps.getClickMultiplier = vi.fn(() => 1)
      careerSystem = createCareerSystem(deps)

      expect(careerSystem.getClickIncome()).toBe(10_000)
    })

    it('계약직 (multiplier 2) 수익은 20,000원', () => {
      deps.getCareerLevel = vi.fn(() => 1)
      deps.getClickMultiplier = vi.fn(() => 1)
      careerSystem = createCareerSystem(deps)

      expect(careerSystem.getClickIncome()).toBe(20_000)
    })

    it('clickMultiplier 적용 (2배)', () => {
      deps.getCareerLevel = vi.fn(() => 0)
      deps.getClickMultiplier = vi.fn(() => 2)
      careerSystem = createCareerSystem(deps)

      expect(careerSystem.getClickIncome()).toBe(20_000)
    })

    it('career multiplier와 clickMultiplier 곱연산', () => {
      deps.getCareerLevel = vi.fn(() => 1) // multiplier 2
      deps.getClickMultiplier = vi.fn(() => 3)
      careerSystem = createCareerSystem(deps)

      expect(careerSystem.getClickIncome()).toBe(60_000) // 10000 * 2 * 3
    })
  })

  describe('getCurrentCareer', () => {
    it('현재 직급 정보 반환', () => {
      deps.getCareerLevel = vi.fn(() => 0)
      careerSystem = createCareerSystem(deps)

      const career = careerSystem.getCurrentCareer()
      expect(career.nameKey).toBe('career.alba')
      expect(career.multiplier).toBe(1)
    })
  })

  describe('getNextCareer', () => {
    it('다음 직급 정보 반환', () => {
      deps.getCareerLevel = vi.fn(() => 0)
      careerSystem = createCareerSystem(deps)

      const next = careerSystem.getNextCareer()
      expect(next.nameKey).toBe('career.gyeyakjik')
      expect(next.requiredClicks).toBe(100)
    })

    it('마지막 직급이면 null', () => {
      deps.getCareerLevel = vi.fn(() => 2)
      careerSystem = createCareerSystem(deps)

      const next = careerSystem.getNextCareer()
      expect(next).toBeNull()
    })
  })

  describe('checkCareerPromotion', () => {
    it('클릭 수 부족 시 승진 불가', () => {
      deps.getCareerLevel = vi.fn(() => 0)
      deps.getTotalClicks = vi.fn(() => 50) // 100 필요
      careerSystem = createCareerSystem(deps)

      const promoted = careerSystem.checkCareerPromotion()
      expect(promoted).toBe(false)
      expect(deps.setCareerLevel).not.toHaveBeenCalled()
    })

    it('클릭 수 충족 시 승진', () => {
      deps.getCareerLevel = vi.fn(() => 0)
      deps.getTotalClicks = vi.fn(() => 100)
      careerSystem = createCareerSystem(deps)

      const promoted = careerSystem.checkCareerPromotion()
      expect(promoted).toBe(true)
      expect(deps.setCareerLevel).toHaveBeenCalledWith(1)
    })

    it('마지막 직급이면 승진 불가', () => {
      deps.getCareerLevel = vi.fn(() => 2)
      deps.getTotalClicks = vi.fn(() => 9999)
      careerSystem = createCareerSystem(deps)

      const promoted = careerSystem.checkCareerPromotion()
      expect(promoted).toBe(false)
    })

    it('승진 시 배경 이미지 변경', () => {
      deps.getCareerLevel = vi.fn(() => 0)
      deps.getTotalClicks = vi.fn(() => 100)
      careerSystem = createCareerSystem(deps)

      const workArea = document.getElementById('workArea')
      careerSystem.checkCareerPromotion()

      // 애니메이션 트리거 확인
      expect(workArea.style.transition).toBeTruthy()
    })
  })
})
