/**
 * Seoul Survival - Tab Navigation System
 *
 * 하단 네비게이션 탭 전환 로직
 * - 탭 활성화/비활성화
 * - 탭별 특수 동작 (경력탭 새로고침, 설정탭 닉네임 동기화, 랭킹탭 폴링)
 */

// 활성 탭 상태 추적 (성능 최적화: updateUI에서 현재 탭만 렌더링)
let _activeTab = 'workTab'

/**
 * 현재 활성 탭 ID 반환
 * @returns {string} 활성 탭 ID (예: 'workTab', 'investmentTab', 'statsTab')
 */
export function getActiveTab() {
  return _activeTab
}

/**
 * 탭 네비게이션 시스템 생성
 * @param {Object} deps - 의존성
 * @param {Function} deps.refreshPrestigeTab - 경력 탭 새로고침 함수
 * @param {Object} deps.LeaderboardUI - 리더보드 UI 객체
 * @param {Function} deps.setupAchievementScrollOptimization - 업적 스크롤 최적화 설정 함수
 * @returns {Object} 탭 네비게이션 관리 함수들
 */
export function createTabNavigation(deps) {
  const { refreshPrestigeTab, LeaderboardUI, setupAchievementScrollOptimization } = deps

  /**
   * 탭 전환 이벤트 리스너 초기화
   */
  function initTabNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn')
    const tabContents = document.querySelectorAll('.tab-content')

    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab')

        // 활성 탭 상태 업데이트 (성능 최적화용)
        _activeTab = targetTab

        // 모든 탭 비활성화
        tabContents.forEach(tab => tab.classList.remove('active'))
        navBtns.forEach(navBtn => {
          navBtn.classList.remove('active')
          navBtn.setAttribute('aria-selected', 'false')
        })

        // 선택한 탭 활성화
        const tabEl = document.getElementById(targetTab)
        if (tabEl) {
          tabEl.classList.add('active')
        }
        btn.classList.add('active')
        btn.setAttribute('aria-selected', 'true')

        // 햅틱 피드백 (지원되는 경우)
        if ('vibrate' in navigator) {
          navigator.vibrate(10)
        }

        // 탭별 특수 동작 처리
        handleTabSpecificActions(targetTab)
      })
    })
  }

  /**
   * 탭별 특수 동작 처리
   * @param {string} targetTab - 대상 탭 ID
   */
  function handleTabSpecificActions(targetTab) {
    // 경력 탭 진입 시 최신 상태로 새로고침
    if (targetTab === 'careerTab') {
      refreshPrestigeTab()
    }

    // 랭킹 탭 전용 리더보드 폴링 제어
    if (targetTab === 'rankingTab') {
      LeaderboardUI.startLeaderboardPolling()
      setupAchievementScrollOptimization()
    } else {
      LeaderboardUI.stopLeaderboardPolling()
    }
  }

  return {
    initTabNavigation,
    handleTabSpecificActions,
  }
}
