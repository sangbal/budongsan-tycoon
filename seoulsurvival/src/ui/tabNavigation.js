/**
 * Seoul Survival - Tab Navigation System
 *
 * 하단 네비게이션 탭 전환 로직
 * - 탭 활성화/비활성화
 * - 탭별 특수 동작 (경력탭 새로고침, 설정탭 닉네임 동기화, 랭킹탭 폴링)
 */

/**
 * 탭 네비게이션 시스템 생성
 * @param {Object} deps - 의존성
 * @param {Function} deps.refreshPrestigeTab - 경력 탭 새로고침 함수
 * @param {Function} deps.syncNicknameFromServer - 서버 닉네임 동기화 함수
 * @param {Function} deps.openNicknameChangeModal - 닉네임 변경 모달 열기 함수
 * @param {Object} deps.LeaderboardUI - 리더보드 UI 객체
 * @param {Function} deps.setupAchievementScrollOptimization - 업적 스크롤 최적화 설정 함수
 * @returns {Object} 탭 네비게이션 관리 함수들
 */
export function createTabNavigation(deps) {
  const {
    refreshPrestigeTab,
    syncNicknameFromServer,
    openNicknameChangeModal,
    LeaderboardUI,
    setupAchievementScrollOptimization,
  } = deps

  /**
   * 탭 전환 이벤트 리스너 초기화
   */
  function initTabNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn')
    const tabContents = document.querySelectorAll('.tab-content')

    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab')

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

    // 설정 탭 진입 시 마이그레이션 충돌 체크 및 서버 닉네임 동기화
    if (targetTab === 'settingsTab') {
      handleSettingsTabEntry()
    }

    // 랭킹 탭 전용 리더보드 폴링 제어
    if (targetTab === 'rankingTab') {
      LeaderboardUI.startLeaderboardPolling()
      setupAchievementScrollOptimization()
    } else {
      LeaderboardUI.stopLeaderboardPolling()
    }
  }

  /**
   * 설정 탭 진입 시 닉네임 동기화 및 모달 처리
   */
  function handleSettingsTabEntry() {
    try {
      syncNicknameFromServer('') // 서버에서 최신 닉네임 동기화

      const needsChange = localStorage.getItem('clicksurvivor_needsNicknameChange') === 'true'
      if (needsChange) {
        // 세션 단위 가드: 같은 세션에서 이미 자동 오픈했으면 스킵
        const autoOpenKey = 'clicksurvivor_nicknameModalAutoOpened'
        const alreadyOpened = sessionStorage.getItem(autoOpenKey) === 'true'

        if (!alreadyOpened) {
          // 닉네임 변경 입력 모달 자동 오픈
          setTimeout(() => {
            openNicknameChangeModal()
            // 세션 플래그 설정 (이 세션에서 한 번만 자동 오픈)
            try {
              sessionStorage.setItem(autoOpenKey, 'true')
            } catch (e) {
              // sessionStorage 실패 시 무시
            }
          }, 300) // 탭 전환 애니메이션 후 표시
        }
      }
    } catch (e) {
      // 무시
    }
  }

  return {
    initTabNavigation,
    handleTabSpecificActions,
  }
}
