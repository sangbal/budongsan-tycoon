/**
 * 업적 그리드 UI 모듈
 * - 업적 아이콘 렌더링
 * - 업적 툴팁 표시
 * - 스크롤 최적화
 */

import { safeText } from './domUtils.js'

/**
 * 업적 그리드 관리 객체 생성
 * @param {Object} deps - 의존성
 * @param {Function} deps.getAchievements - ACHIEVEMENTS 배열 반환 함수
 * @param {Function} deps.t - 번역 함수
 * @param {boolean} deps.isDev - 개발 모드 여부
 * @returns {Object} 업적 그리드 관리 객체
 */
export function createAchievementGrid(deps) {
  const { getAchievements, t, isDev } = deps

  // 스크롤 최적화 관련 내부 상태
  let achievementScrollActive = false
  let achievementUpdatePending = false
  let achievementScrollDebounceTimer = null

  /**
   * 업적 그리드 업데이트
   */
  function updateAchievementGrid() {
    const achievementGrid = document.getElementById('achievementGrid')
    if (!achievementGrid) return

    // 스크롤 중이면 업데이트를 지연 (디바운스)
    const statsContent = achievementGrid.closest('.stats-content')
    if (statsContent && achievementScrollActive) {
      achievementUpdatePending = true
      if (achievementScrollDebounceTimer) {
        clearTimeout(achievementScrollDebounceTimer)
      }
      achievementScrollDebounceTimer = setTimeout(() => {
        achievementScrollActive = false
        if (achievementUpdatePending) {
          achievementUpdatePending = false
          updateAchievementGrid()
        }
      }, 300) // 스크롤 종료 후 300ms 대기
      return
    }

    // ======= 업적 툴팁(포털) 시스템 =======
    // - 툴팁 DOM은 1개만 사용 (겹침/누수/overflow 문제 방지)
    // - 이벤트는 그리드에 위임
    // - 전역 리스너는 한 번만 등록, 그리드 리스너는 그리드별로 관리

    const ensureTooltipEl = () => {
      let el = document.getElementById('achievementTooltip')
      if (!el) {
        el = document.createElement('div')
        el.id = 'achievementTooltip'
        el.className = 'achievement-tooltip'
        el.setAttribute('role', 'tooltip')
        el.setAttribute('aria-hidden', 'true')
        document.body.appendChild(el)
      }
      return el
    }

    const getAchText = achId => {
      const ACHIEVEMENTS = getAchievements()
      const ach = ACHIEVEMENTS.find(a => a.id === achId)
      if (!ach) return ''
      const achievementName = t(`achievement.${ach.id}.name`, {}, ach.name)
      const achievementDesc = t(`achievement.${ach.id}.desc`, {}, ach.desc)
      const statusText = ach.unlocked
        ? t('achievement.status.unlocked')
        : t('achievement.status.locked')
      return `${achievementName}\n${achievementDesc}\n${statusText}`
    }

    const hideTooltip = () => {
      const el = document.getElementById('achievementTooltip')
      if (!el) return
      el.classList.remove('active', 'bottom')
      el.style.left = ''
      el.style.top = ''
      el.style.bottom = ''
      el.style.opacity = ''
      el.style.visibility = ''
      el.style.pointerEvents = ''
      el.setAttribute('aria-hidden', 'true')
      window.__achievementTooltipAnchorId = null
    }

    const showTooltipForIcon = iconEl => {
      const el = ensureTooltipEl()
      const achId = iconEl?.dataset?.achievementId || iconEl?.id?.replace(/^ach_/, '')
      if (!achId) return

      // 동일 아이콘 재클릭: 토글
      if (window.__achievementTooltipAnchorId === achId && el.classList.contains('active')) {
        hideTooltip()
        return
      }

      // 항상 1개만 보이도록 초기화
      hideTooltip()

      el.textContent = getAchText(achId)
      el.setAttribute('aria-hidden', 'false')

      // 측정을 위해 "보이되 투명/비활성" 상태로 먼저 활성화
      el.classList.add('active')
      el.style.opacity = '0'
      el.style.visibility = 'hidden'
      el.style.pointerEvents = 'none'
      el.style.left = '0px'
      el.style.top = '0px'
      el.style.bottom = 'auto'

      // 크기 측정
      void el.offsetHeight
      const tooltipRect = el.getBoundingClientRect()

      const iconRect = iconEl.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // 아이콘 중앙 기준
      let left = iconRect.left + iconRect.width / 2
      let top = iconRect.top - tooltipRect.height - 8
      let showBelow = false

      if (top < 10) {
        top = iconRect.bottom + 8
        showBelow = true
      }
      if (top + tooltipRect.height > viewportHeight - 10) {
        top = viewportHeight - tooltipRect.height - 10
      }

      // 좌/우 경계
      if (left + tooltipRect.width / 2 > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width / 2 - 10
      }
      if (left - tooltipRect.width / 2 < 10) {
        left = tooltipRect.width / 2 + 10
      }

      el.style.left = `${left}px`
      el.style.top = `${top}px`
      el.style.bottom = 'auto'
      el.classList.toggle('bottom', showBelow)

      // 즉시 표시
      el.style.visibility = 'visible'
      el.style.opacity = '1'
      el.style.pointerEvents = 'none' // 요구사항: 아이콘에서 벗어나면 사라짐 (툴팁 상호작용 불필요)

      window.__achievementTooltipAnchorId = achId
    }

    // 전역 이벤트 리스너는 한 번만 등록 (document/window 레벨)
    if (!window.__achievementTooltipPortalInitialized) {
      window.__achievementTooltipPortalInitialized = true

      // 바깥 클릭/스크롤/탭 전환 등으로 정리
      document.addEventListener('click', () => hideTooltip(), true)
      window.addEventListener('scroll', () => hideTooltip(), true)
      window.addEventListener('resize', () => hideTooltip(), true)
    }

    // 그리드 이벤트 리스너는 그리드별로 한 번만 등록 (data attribute로 중복 방지)
    if (!achievementGrid.dataset.tooltipListenersAttached) {
      achievementGrid.dataset.tooltipListenersAttached = 'true'

      // 클릭: 즉시 표시/토글
      achievementGrid.addEventListener('click', e => {
        const iconEl = e.target.closest('.achievement-icon')
        if (!iconEl) return
        e.stopPropagation()
        showTooltipForIcon(iconEl)
      })

      // 아이콘에서 커서가 벗어나면 닫기
      // mouseleave는 버블링이 없어 pointerout으로 위임 처리
      achievementGrid.addEventListener('pointerout', e => {
        const fromIcon = e.target.closest?.('.achievement-icon')
        if (!fromIcon) return
        // 아이콘 밖으로 나가는 순간 닫기 (요구사항)
        hideTooltip()
      })
    }

    // 이미 생성되어 있으면 상태만 업데이트 시도 (깜빡임 방지)
    if (achievementGrid.children.length > 0) {
      let unlockedCount = 0
      let hasChanges = false

      const ACHIEVEMENTS = getAchievements()
      Object.values(ACHIEVEMENTS).forEach(ach => {
        const icon = document.getElementById('ach_' + ach.id)
        if (!icon) {
          hasChanges = true // 아이콘이 없으면 재생성 필요
          return
        }

        const wasUnlocked = icon.classList.contains('unlocked')
        const isUnlocked = ach.unlocked

        // 상태가 변경된 경우에만 DOM 조작 (깜빡임 최소화)
        if (wasUnlocked !== isUnlocked) {
          hasChanges = true
          if (isUnlocked) {
            icon.classList.add('unlocked')
            icon.classList.remove('locked')
          } else {
            icon.classList.add('locked')
            icon.classList.remove('unlocked')
          }
        }

        if (isUnlocked) {
          unlockedCount++
        }

        // 네이티브 title은 항상 최신으로 유지 (툴팁 대체/접근성)
        const achievementName = t(`achievement.${ach.id}.name`, {}, ach.name)
        const achievementDesc = t(`achievement.${ach.id}.desc`, {}, ach.desc)
        const statusText = isUnlocked
          ? t('achievement.status.unlocked')
          : t('achievement.status.locked')
        const newTitle = `${achievementName}\n${achievementDesc}\n${statusText}`

        // title이 변경된 경우에만 업데이트 (불필요한 DOM 조작 방지)
        if (icon.title !== newTitle) {
          icon.title = newTitle
        }
      })

      const totalAchievements = Object.keys(ACHIEVEMENTS).length
      const progressEl = document.getElementById('achievementProgress')
      if (progressEl) {
        const newProgressText = `${unlockedCount}/${totalAchievements}`
        if (progressEl.textContent !== newProgressText) {
          safeText(progressEl, newProgressText)
        }
      }

      // 변경사항이 없으면 재렌더링 스킵 (깜빡임 방지)
      if (!hasChanges) {
        return
      }
    }

    // 여기까지 왔다는 것은:
    // - 그리드가 비어 있거나(children.length === 0)
    // - 또는 hasChanges=true로 "재생성 필요"가 감지된 경우
    // 항상 클린 상태에서 다시 그리도록 전체 초기화
    achievementGrid.innerHTML = ''
    let unlockedCount = 0
    const ACHIEVEMENTS = getAchievements()
    const totalAchievements = Object.keys(ACHIEVEMENTS).length

    Object.values(ACHIEVEMENTS).forEach(ach => {
      const icon = document.createElement('div')
      icon.className = 'achievement-icon'
      icon.id = 'ach_' + ach.id
      icon.dataset.achievementId = ach.id
      icon.textContent = ach.icon
      const achievementName = t(`achievement.${ach.id}.name`, {}, ach.name)
      const achievementDesc = t(`achievement.${ach.id}.desc`, {}, ach.desc)
      const statusText = ach.unlocked
        ? t('achievement.status.unlocked')
        : t('achievement.status.locked')
      icon.title = `${achievementName}\n${achievementDesc}\n${statusText}`

      if (ach.unlocked) {
        icon.classList.add('unlocked')
        unlockedCount++
      } else {
        icon.classList.add('locked')
      }

      achievementGrid.appendChild(icon)
    })

    safeText(
      document.getElementById('achievementProgress'),
      `${unlockedCount}/${totalAchievements}`
    )
  }

  /**
   * 업적 영역 스크롤 최적화 설정
   */
  function setupAchievementScrollOptimization() {
    const achievementGrid = document.getElementById('achievementGrid')
    if (!achievementGrid) return

    const statsContent = achievementGrid.closest('.stats-content')
    if (!statsContent) return

    // 이미 설정되어 있으면 스킵
    if (statsContent.dataset.scrollOptimized === 'true') return
    statsContent.dataset.scrollOptimized = 'true'

    let lastScrollTop = statsContent.scrollTop
    let lastScrollHeight = statsContent.scrollHeight
    let scrollThrottleTimer = null

    // 스크롤 이벤트 리스너
    statsContent.addEventListener(
      'scroll',
      () => {
        const currentScrollTop = statsContent.scrollTop
        const currentScrollHeight = statsContent.scrollHeight
        const clientHeight = statsContent.clientHeight

        // 스크롤 활성 플래그 설정
        achievementScrollActive = true

        // 스크롤 종료 디바운스
        if (achievementScrollDebounceTimer) {
          clearTimeout(achievementScrollDebounceTimer)
        }
        achievementScrollDebounceTimer = setTimeout(() => {
          achievementScrollActive = false
          if (achievementUpdatePending) {
            achievementUpdatePending = false
            updateAchievementGrid()
          }
        }, 300)

        // DEV 모드에서만 계측 (200ms throttle)
        if (isDev) {
          if (scrollThrottleTimer) return
          scrollThrottleTimer = setTimeout(() => {
            scrollThrottleTimer = null

            // scrollHeight 변화 감지
            if (currentScrollHeight !== lastScrollHeight) {
              console.warn('[Achievement Scroll] scrollHeight changed during scroll:', {
                before: lastScrollHeight,
                after: currentScrollHeight,
                scrollTop: currentScrollTop,
                clientHeight: clientHeight,
                reason: 'Layout change during scroll (likely cause of jank)',
              })
            }

            lastScrollTop = currentScrollTop
            lastScrollHeight = currentScrollHeight
          }, 200)
        }
      },
      { passive: true }
    )
  }

  return {
    updateAchievementGrid,
    setupAchievementScrollOptimization,
  }
}
