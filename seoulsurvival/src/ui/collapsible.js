/**
 * collapsible.js
 * 섹션 접기/펼치기 기능 모듈
 * main.js의 initStatsCollapsible, initInvestmentCollapsible 등 분리
 */

const COLLAPSE_STATE_KEY = 'section-collapse-state'

/**
 * 섹션 토글 상태 저장 (LocalStorage)
 */
export function saveSectionCollapseState(sectionId, isCollapsed) {
  try {
    const state = JSON.parse(localStorage.getItem(COLLAPSE_STATE_KEY) || '{}')
    state[sectionId] = isCollapsed
    localStorage.setItem(COLLAPSE_STATE_KEY, JSON.stringify(state))
  } catch (err) {
    console.warn('[Collapse] 상태 저장 실패:', err)
  }
}

/**
 * 섹션 토글 상태 복원
 */
export function restoreSectionCollapseState() {
  try {
    const state = JSON.parse(localStorage.getItem(COLLAPSE_STATE_KEY) || '{}')
    Object.entries(state).forEach(([sectionId, isCollapsed]) => {
      const section = document.querySelector(`[data-section-id="${sectionId}"]`)
      if (section && isCollapsed) {
        section.classList.add('collapsed')
        const toggle = section.querySelector('.stats-toggle')
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false')
        }
      }
    })
  } catch (err) {
    console.warn('[Collapse] 상태 복원 실패:', err)
  }
}

/**
 * 동적 높이 업데이트 함수
 */
export function updateStatsContentHeight(sectionId) {
  const section = document.querySelector(`[data-section-id="${sectionId}"]`)
  if (!section || section.classList.contains('collapsed')) return

  const content = section.querySelector('.stats-content')
  if (content) {
    content.style.maxHeight = content.scrollHeight + 'px'
    setTimeout(() => {
      if (!section.classList.contains('collapsed')) {
        content.style.maxHeight = 'none'
      }
    }, 300)
  }
}

/**
 * createCollapsibleManager
 * Factory 패턴으로 collapsible 관리자 생성
 */
export function createCollapsibleManager() {
  let statsCollapsibleInitialized = false
  let investmentCollapsibleInitialized = false

  /**
   * 통계 섹션 접기/펼치기 초기화
   */
  function initStatsCollapsible() {
    if (statsCollapsibleInitialized) return
    statsCollapsibleInitialized = true

    const statsTab = document.getElementById('statsTab')
    if (statsTab) {
      statsTab.addEventListener('click', e => {
        const toggle = e.target.closest('.stats-toggle')
        const toggleIcon = e.target.closest('.toggle-icon')
        if (toggle || toggleIcon) {
          const section = (toggle || toggleIcon).closest('.stats-section')
          if (section && section.classList.contains('collapsible')) {
            const achievementGrid = section.querySelector('#achievementGrid')
            if (achievementGrid) return
            section.classList.toggle('collapsed')
            e.preventDefault()
            e.stopPropagation()
          }
        }
      })
    }
  }

  /**
   * 투자 탭 접기/펼치기 초기화
   */
  function initInvestmentCollapsible() {
    if (investmentCollapsibleInitialized) return
    investmentCollapsibleInitialized = true

    const shopTab = document.getElementById('shopTab')
    if (!shopTab) return

    // 이벤트 위임: shopTab 전체에 1개 리스너
    shopTab.addEventListener('click', e => {
      const toggle = e.target.closest('.stats-toggle')
      const toggleIcon = e.target.closest('.toggle-icon')

      if (toggle || toggleIcon) {
        const section = (toggle || toggleIcon).closest('.stats-section')

        if (section && section.classList.contains('collapsible')) {
          const isCollapsed = section.classList.toggle('collapsed')

          const toggleElem = section.querySelector('.stats-toggle')
          if (toggleElem) {
            toggleElem.setAttribute('aria-expanded', !isCollapsed)
          }

          const sectionId = section.getAttribute('data-section-id')
          if (sectionId) {
            saveSectionCollapseState(sectionId, isCollapsed)
          }

          e.preventDefault()
          e.stopPropagation()
        }
      }
    })

    // 키보드 네비게이션 지원
    shopTab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const toggle = e.target.closest('.stats-toggle')
        if (toggle) {
          const section = toggle.closest('.stats-section')
          if (section && section.classList.contains('collapsible')) {
            const isCollapsed = section.classList.toggle('collapsed')
            toggle.setAttribute('aria-expanded', !isCollapsed)

            const sectionId = section.getAttribute('data-section-id')
            if (sectionId) {
              saveSectionCollapseState(sectionId, isCollapsed)
            }

            e.preventDefault()
          }
        }
      }
    })

    // 저장된 상태 복원
    restoreSectionCollapseState()
  }

  /**
   * 설정 모달 내 collapsible 초기화
   */
  function initSettingsCollapsible() {
    const settingsModalBody = document.getElementById('settingsModalBody')
    if (!settingsModalBody) return

    settingsModalBody.addEventListener('click', e => {
      const toggle = e.target.closest('.stats-toggle')
      const toggleIcon = e.target.closest('.toggle-icon')

      if (toggle || toggleIcon) {
        const section = (toggle || toggleIcon).closest('.stats-section')
        if (section && section.classList.contains('collapsible')) {
          const isCollapsed = section.classList.toggle('collapsed')

          const toggleElem = section.querySelector('.stats-toggle')
          if (toggleElem) {
            toggleElem.setAttribute('aria-expanded', !isCollapsed)
          }
        }
      }
    })
  }

  /**
   * 모든 collapsible 섹션 초기화 (지연 실행)
   */
  function initAll(delay = 100) {
    setTimeout(() => {
      initStatsCollapsible()
      initInvestmentCollapsible()
      initSettingsCollapsible()
    }, delay)
  }

  return {
    initStatsCollapsible,
    initInvestmentCollapsible,
    initSettingsCollapsible,
    initAll,
  }
}
