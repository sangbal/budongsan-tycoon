/**
 * Seoul Survival - Synergy Display UI
 *
 * 활성화된 빌드 시너지를 표시하는 UI 컴포넌트
 */

import { getSynergyDisplayData } from '../systems/synergy.js'
import { t } from '../i18n/index.js'
import { gameState } from '../state/gameState.js'

/**
 * 시너지 UI 업데이트
 * 통계 탭 또는 별도 섹션에 활성화된 시너지 표시
 */
export function updateSynergyDisplay() {
  const container = document.getElementById('synergy-display')
  if (!container) return

  const synergyData = getSynergyDisplayData(gameState)
  const activeSynergies = synergyData.filter(s => s.active)

  // 활성 시너지가 없으면 안내 메시지
  if (activeSynergies.length === 0) {
    container.innerHTML = `
      <div class="synergy-empty">
        <p>${t('synergy.none')}</p>
      </div>
    `
    return
  }

  // 활성 시너지 렌더링
  container.innerHTML = `
    <div class="synergy-list">
      ${activeSynergies
        .map(
          synergy => `
        <div class="synergy-badge active">
          <div class="synergy-info">
            <div class="synergy-name">${t(synergy.nameKey)}</div>
            <div class="synergy-row">
              <span class="synergy-desc">${t(synergy.descKey)}</span>
              <span class="synergy-effect">x${synergy.multiplier.toFixed(2)}</span>
            </div>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `
}

/**
 * 시너지 목록 전체 표시 (활성/비활성 모두)
 * 업그레이드 탭이나 도움말에서 사용
 */
export function renderAllSynergies() {
  const container = document.getElementById('synergy-all-list')
  if (!container) return

  const synergyData = getSynergyDisplayData(gameState)

  container.innerHTML = `
    <div class="synergy-grid">
      ${synergyData
        .map(
          synergy => `
        <div class="synergy-card ${synergy.active ? 'active' : 'inactive'}">
          <div class="synergy-card-header">
            <span class="synergy-icon">${synergy.icon}</span>
            <span class="synergy-status">
              ${synergy.active ? t('synergy.active') : t('synergy.inactive')}
            </span>
          </div>
          <div class="synergy-card-body">
            <div class="synergy-name">${t(synergy.nameKey)}</div>
            <div class="synergy-desc">${t(synergy.descKey)}</div>
            <div class="synergy-multiplier">
              ${t('ui.multiplier', {}, 'Multiplier')}: <strong>x${synergy.multiplier}</strong>
            </div>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `
}

/**
 * 시너지 헤더 요약 표시 (활성 개수)
 * 상단 헤더에 표시
 */
export function updateSynergyHeader() {
  const headerEl = document.getElementById('synergy-header')
  if (!headerEl) return

  const synergyData = getSynergyDisplayData(gameState)
  const activeCount = synergyData.filter(s => s.active).length
  const totalCount = synergyData.length

  if (activeCount === 0) {
    headerEl.textContent = ''
    headerEl.classList.add('hidden')
    return
  }

  headerEl.textContent = `🔗 ${activeCount}/${totalCount}`
  headerEl.classList.remove('hidden')
  headerEl.title = t('synergy.title')
}

/**
 * 시너지 변화 알림 (새 시너지 활성화 시)
 * @param {string} synergyId - 활성화된 시너지 ID
 */
export function showSynergyUnlockNotification(synergyId) {
  const synergyData = getSynergyDisplayData(gameState)
  const synergy = synergyData.find(s => s.id === synergyId)
  if (!synergy) return

  // 다이어리 로그 (main.js의 addLog 사용)
  if (window.addLog) {
    window.addLog(t('msg.synergyActivated', { name: t(synergy.nameKey), desc: t(synergy.descKey) }))
  }

  // 파티클 애니메이션 (선택적)
  if (gameState.settings?.particles) {
    showSynergyParticle(synergy.icon)
  }
}

/**
 * 시너지 파티클 애니메이션
 * @param {string} icon - 시너지 아이콘
 */
function showSynergyParticle(icon) {
  const particle = document.createElement('div')
  particle.className = 'synergy-particle'
  particle.textContent = icon
  particle.style.left = `${Math.random() * 80 + 10}%`
  particle.style.top = '50%'

  document.body.appendChild(particle)

  // 애니메이션 후 제거
  setTimeout(() => particle.remove(), 2000)
}
