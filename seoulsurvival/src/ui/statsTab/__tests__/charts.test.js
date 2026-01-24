/**
 * charts.js 테스트
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { drawDonutChart } from '../charts.js'

// gameState mock
vi.mock('../../../state/gameState.js', () => ({
  gameState: {
    cash: 10000,
  },
}))

describe('charts.js', () => {
  let mockCanvas
  let mockCtx

  beforeEach(() => {
    // Canvas mock
    mockCtx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      moveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      clearRect: vi.fn(),
      setTransform: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      fillStyle: '',
      lineWidth: 0,
      strokeStyle: '',
    }

    mockCanvas = document.createElement('canvas')
    mockCanvas.id = 'assetDonutChart'
    mockCanvas.width = 200
    mockCanvas.height = 200
    mockCanvas.getContext = vi.fn(() => mockCtx)
    document.body.appendChild(mockCanvas)

    // CSS 변수 mock
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: vi.fn(() => '#0b1220'),
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  describe('drawDonutChart', () => {
    it('캔버스가 없으면 조기 반환', () => {
      document.body.innerHTML = ''

      const deps = {
        calculateFinancialValue: vi.fn(() => 5000),
        calculatePropertyValue: vi.fn(() => 5000),
        calculateTotalAssetValue: vi.fn(() => 10000),
      }

      expect(() => drawDonutChart(deps)).not.toThrow()
    })

    it('getContext 실패시 조기 반환', () => {
      mockCanvas.getContext = vi.fn(() => null)

      const deps = {
        calculateFinancialValue: vi.fn(() => 5000),
        calculatePropertyValue: vi.fn(() => 5000),
        calculateTotalAssetValue: vi.fn(() => 10000),
      }

      expect(() => drawDonutChart(deps)).not.toThrow()
    })

    it('차트 그리기 성공', () => {
      const deps = {
        calculateFinancialValue: vi.fn(() => 5000),
        calculatePropertyValue: vi.fn(() => 5000),
        calculateTotalAssetValue: vi.fn(() => 10000),
      }

      drawDonutChart(deps)

      // 배경 원 그리기
      expect(mockCtx.beginPath).toHaveBeenCalled()
      expect(mockCtx.arc).toHaveBeenCalled()
      expect(mockCtx.fill).toHaveBeenCalled()
    })

    it('현금 섹션 그리기', () => {
      const deps = {
        calculateFinancialValue: vi.fn(() => 0),
        calculatePropertyValue: vi.fn(() => 0),
        calculateTotalAssetValue: vi.fn(() => 0),
      }

      drawDonutChart(deps)

      // 현금만 있으면 현금 섹션 그리기
      expect(mockCtx.createLinearGradient).toHaveBeenCalled()
    })

    it('금융 섹션 그리기', () => {
      const deps = {
        calculateFinancialValue: vi.fn(() => 10000),
        calculatePropertyValue: vi.fn(() => 0),
        calculateTotalAssetValue: vi.fn(() => 10000),
      }

      drawDonutChart(deps)

      // 금융 섹션이 있으면 그리기
      expect(mockCtx.fill).toHaveBeenCalled()
    })

    it('부동산 섹션 그리기', () => {
      const deps = {
        calculateFinancialValue: vi.fn(() => 0),
        calculatePropertyValue: vi.fn(() => 10000),
        calculateTotalAssetValue: vi.fn(() => 10000),
      }

      drawDonutChart(deps)

      // 부동산 섹션이 있으면 그리기
      expect(mockCtx.fill).toHaveBeenCalled()
    })

    it('DPR 대응 (레티나)', () => {
      // DPR이 2인 경우
      vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(2)

      const deps = {
        calculateFinancialValue: vi.fn(() => 5000),
        calculatePropertyValue: vi.fn(() => 5000),
        calculateTotalAssetValue: vi.fn(() => 10000),
      }

      drawDonutChart(deps)

      // 캔버스 크기가 DPR에 맞게 조정됨
      expect(mockCtx.setTransform).toHaveBeenCalled()
    })

    it('자산이 0일 때 처리', () => {
      // gameState.cash = 0 설정
      vi.doMock('../../../state/gameState.js', () => ({
        gameState: { cash: 0 },
      }))

      const deps = {
        calculateFinancialValue: vi.fn(() => 0),
        calculatePropertyValue: vi.fn(() => 0),
        calculateTotalAssetValue: vi.fn(() => 0),
      }

      expect(() => drawDonutChart(deps)).not.toThrow()
    })

    it('내부 원 (도넛 효과) 그리기', () => {
      const deps = {
        calculateFinancialValue: vi.fn(() => 5000),
        calculatePropertyValue: vi.fn(() => 5000),
        calculateTotalAssetValue: vi.fn(() => 10000),
      }

      drawDonutChart(deps)

      // 내부 원을 위한 arc 호출
      expect(mockCtx.arc).toHaveBeenCalled()
    })
  })
})
