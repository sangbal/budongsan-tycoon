/**
 * 도넛 차트 모듈
 * - 자산 구성 비율 시각화
 * - DPR(레티나) 대응
 */
import { gameState } from '../../state/gameState.js'

/**
 * 도넛 차트 그리기
 * @param {{calculateFinancialValue: Function, calculatePropertyValue: Function, calculateTotalAssetValue: Function}} deps
 */
export function drawDonutChart(deps) {
  const { calculateFinancialValue, calculatePropertyValue, calculateTotalAssetValue } = deps
  const state = gameState

  const canvas = document.getElementById('assetDonutChart')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // DPR(레티나) 대응: 흐릿하게 보이는 문제 해결
  const baseSize = 200 // index.html의 canvas attribute와 동일한 논리 크기
  const dpr = Math.max(1, Math.floor((window.devicePixelRatio || 1) * 100) / 100)
  const target = Math.round(baseSize * dpr)
  if (canvas.width !== target || canvas.height !== target) {
    canvas.width = target
    canvas.height = target
    canvas.style.width = `${baseSize}px`
    canvas.style.height = `${baseSize}px`
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const centerX = baseSize / 2
  const centerY = baseSize / 2
  const radius = 80
  const innerRadius = 50

  // 자산 비율 계산
  const totalAssets = state.cash + calculateTotalAssetValue()
  const financialValue = calculateFinancialValue()
  const propertyValue = calculatePropertyValue()

  const cashPercent = totalAssets > 0 ? (state.cash / totalAssets) * 100 : 0
  const financialPercent = totalAssets > 0 ? (financialValue / totalAssets) * 100 : 0
  const propertyPercent = totalAssets > 0 ? (propertyValue / totalAssets) * 100 : 0

  // 배경 원
  ctx.clearRect(0, 0, baseSize, baseSize)
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
  ctx.fill()

  // 각 섹션 그리기
  let currentAngle = -Math.PI / 2

  // 현금
  if (cashPercent > 0) {
    const angle = (cashPercent / 100) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle)
    ctx.closePath()
    // 현금 컬러 = 노동 컬러(주황) + 더 또렷하게(그라데이션/경계선)
    const cashGrad = ctx.createLinearGradient(
      centerX - radius,
      centerY - radius,
      centerX + radius,
      centerY + radius
    )
    cashGrad.addColorStop(0, '#f59e0b')
    cashGrad.addColorStop(1, '#d97706')
    ctx.fillStyle = cashGrad
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)'
    ctx.stroke()
    currentAngle += angle
  }

  // 금융
  if (financialPercent > 0) {
    const angle = (financialPercent / 100) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle)
    ctx.closePath()
    ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'
    ctx.fill()
    currentAngle += angle
  }

  // 부동산
  if (propertyPercent > 0) {
    const angle = (propertyPercent / 100) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle)
    ctx.closePath()
    ctx.fillStyle = 'rgba(16, 185, 129, 0.5)'
    ctx.fill()
  }

  // 내부 원 (도넛 효과)
  ctx.beginPath()
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
  // canvas는 CSS var(--bg)를 직접 해석하지 못하므로 실제 색상값을 사용
  const bgColor =
    getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0b1220'
  ctx.fillStyle = bgColor
  ctx.fill()
}
