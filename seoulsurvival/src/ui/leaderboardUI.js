/**
 * Seoul Survival - Leaderboard UI System
 *
 * 리더보드 표시 및 업데이트 시스템
 * - 리더보드 UI 렌더링
 * - 내 순위 조회 및 표시
 * - 폴링 및 IntersectionObserver 관리
 */

import { t } from '../i18n/index.js'
import * as NumberFormat from '../utils/numberFormat.js'
import { updateLeaderboard, getLeaderboard, getMyRank } from '../../../shared/leaderboard.js'
import { getUser, signInGoogle } from '../../../shared/auth/core.js'
import { isSupabaseConfigured } from '../../../shared/auth/config.js'

// ======= 상수 =======
const LEADERBOARD_UPDATE_INTERVAL = 30000 // 30초
const LEADERBOARD_TIMEOUT = 7000 // 7초

// ======= XSS 방지 헬퍼 함수 =======
/**
 * HTML 특수문자 이스케이프 (XSS 방지)
 * @param {string} str - 이스케이프할 문자열
 * @returns {string} 이스케이프된 문자열
 */
function escapeHTML(str) {
  if (!str || typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * 에러 메시지 UI를 안전하게 생성 (XSS 방지)
 * @param {HTMLElement} container - 컨테이너 요소
 * @param {string} message - 표시할 메시지
 * @param {boolean} showRetry - 재시도 버튼 표시 여부
 */
function renderErrorUI(container, message, showRetry = true) {
  container.innerHTML = ''
  const errorDiv = document.createElement('div')
  errorDiv.className = 'leaderboard-error'

  const msgDiv = document.createElement('div')
  msgDiv.textContent = message
  errorDiv.appendChild(msgDiv)

  if (showRetry) {
    const retryBtn = document.createElement('button')
    retryBtn.className = 'leaderboard-retry-btn'
    retryBtn.textContent = t('button.retry') || 'Retry'
    retryBtn.addEventListener('click', () => {
      updateLeaderboardUI(true)
    })
    errorDiv.appendChild(retryBtn)
  }

  container.appendChild(errorDiv)
}

// ======= 상태 변수 =======
let __leaderboardLoading = false
let __leaderboardLastUpdate = 0
let __leaderboardUpdateTimer = null
let __lbPollingStarted = false
let __lbInterval = null
let __lbObserver = null
let __lbFirstLoad = true // 페이지 로드 후 첫 랭킹 탭 진입 플래그

// ======= 게임 상태 참조 (main.js에서 설정) =======
let gameStateRef = null

/**
 * 리더보드 UI 시스템 초기화
 * @param {Object} gameState - 게임 상태 객체 참조
 */
export function initLeaderboardUI(getGameState) {
  gameStateRef = getGameState
}

/**
 * 데스크톱 레이아웃 여부 확인
 */
function isDesktopLayout() {
  return window.innerWidth >= 768
}

/**
 * 리더보드 UI 업데이트
 */
export async function updateLeaderboardUI(force = false) {
  const container = document.getElementById('leaderboardContainer')
  if (!container) return

  // Supabase 키가 설정되지 않은 경우: 네트워크 호출을 스킵하고 안내만 표시
  if (!isSupabaseConfigured()) {
    renderErrorUI(
      container,
      t('ranking.notConfigured') || 'Leaderboard setup is not complete. Please check back later.',
      false
    )
    __leaderboardLoading = false
    __leaderboardLastUpdate = Date.now()
    return
  }

  // 이미 로딩 중이면 스킵 (force일 때는 강제 실행)
  if (__leaderboardLoading && !force) {
    return
  }

  // 최근 업데이트로부터 충분한 시간이 지나지 않았으면 스킵 (force가 아닐 때만, 첫 호출 제외)
  const now = Date.now()
  if (
    !force &&
    __leaderboardLastUpdate > 0 &&
    now - __leaderboardLastUpdate < LEADERBOARD_UPDATE_INTERVAL
  ) {
    return
  }

  // 디바운싱: 타이머가 있으면 취소하고 새로 설정
  if (__leaderboardUpdateTimer) {
    clearTimeout(__leaderboardUpdateTimer)
    __leaderboardUpdateTimer = null
  }

  // 즉시 실행하지 않고 약간의 지연을 두어 연속 호출 방지
  __leaderboardUpdateTimer = setTimeout(
    async () => {
      __leaderboardLoading = true
      __leaderboardUpdateTimer = null

      // 타임아웃 설정 (7초 후에도 응답이 없으면 실패로 간주)
      const timeoutId = setTimeout(() => {
        if (__leaderboardLoading) {
          console.error('리더보드: 타임아웃 발생')
          renderErrorUI(container, t('ranking.timeout') || 'Failed to load leaderboard (timeout)')
          __leaderboardLoading = false
          __leaderboardLastUpdate = Date.now()
        }
      }, LEADERBOARD_TIMEOUT)

      try {
        // 로딩 메시지 표시 (XSS 방지)
        container.innerHTML = ''
        const loadingDiv = document.createElement('div')
        loadingDiv.className = 'leaderboard-loading'
        loadingDiv.textContent = t('ranking.loadingText')
        container.appendChild(loadingDiv)

        const result = await getLeaderboard(10, 'assets')
        clearTimeout(timeoutId)

        if (!result.success) {
          const errorMsg = result.error || t('ranking.unknownError') || 'Unknown error'
          const status = result.status
          const errorType = result.errorType

          console.error('Leaderboard: API error', { errorMsg, status, errorType })

          let userMessage = ''
          if (errorType === 'forbidden' || status === 401 || status === 403) {
            userMessage = t('ranking.error.forbidden') || 'Permission denied to load leaderboard.'
          } else if (errorType === 'config') {
            userMessage =
              t('ranking.error.config') ||
              'Leaderboard config error: Please check Supabase settings.'
          } else if (errorType === 'schema') {
            userMessage =
              t('ranking.error.schema') ||
              'Leaderboard table not configured. Contact administrator.'
          } else if (errorType === 'network') {
            userMessage = t('ranking.error.network') || 'Network error: Cannot load leaderboard.'
          } else {
            userMessage =
              (t('ranking.error.generic') || 'Cannot load leaderboard:') + ` ${errorMsg}`
          }

          renderErrorUI(container, userMessage)
          __leaderboardLoading = false
          __leaderboardLastUpdate = Date.now()
          return
        }

        const entries = result.data || []
        if (entries.length === 0) {
          // XSS 방지: DOM API 사용
          container.innerHTML = ''
          const emptyDiv = document.createElement('div')
          emptyDiv.className = 'leaderboard-empty'
          emptyDiv.textContent = t('ranking.empty')
          container.appendChild(emptyDiv)
          __leaderboardLoading = false
          __leaderboardLastUpdate = Date.now()
          // 내 순위 영역도 비움
          const myRankContent = document.getElementById('myRankContent')
          if (myRankContent) {
            myRankContent.innerHTML = ''
            const myRankEmpty = document.createElement('div')
            myRankEmpty.className = 'leaderboard-my-rank-empty'
            myRankEmpty.textContent = t('ranking.noRecordsYet') || 'No leaderboard records yet.'
            myRankContent.appendChild(myRankEmpty)
          }
          return
        }

        // 리더보드 HTML 생성 (테이블 형태)
        const table = document.createElement('table')
        table.className = 'leaderboard-table'

        const thead = document.createElement('thead')
        thead.innerHTML = `
            <tr>
              <th class="col-rank">${t('ranking.table.rank')}</th>
              <th class="col-nickname">${t('ranking.table.nickname')}</th>
              <th class="col-tower" aria-label="${t('product.tower') || 'Seoul Tower'}"></th>
              <th class="col-assets">${t('ranking.table.assets')}</th>
              <th class="col-playtime" aria-label="${t('ranking.table.lastActive.full')}">${t('ranking.table.lastActive')}</th>
            </tr>
          `
        table.appendChild(thead)

        const tbody = document.createElement('tbody')

        let myEntry = null
        const currentNickLower = (gameStateRef().playerNickname || '').trim().toLowerCase()

        entries.forEach((entry, index) => {
          const tr = document.createElement('tr')

          // 순위 셀
          const rankTd = document.createElement('td')
          rankTd.className = 'col-rank'
          rankTd.textContent = String(index + 1)

          // 닉네임 셀
          const nickTd = document.createElement('td')
          nickTd.className = 'col-nickname'
          nickTd.textContent = entry.nickname || t('ui.anonymous') || 'Anonymous'

          // 타워 셀
          const towerTd = document.createElement('td')
          towerTd.className = 'col-tower'
          const towerCount = entry.tower_count || 0
          towerTd.textContent = towerCount > 0 ? `🗼${towerCount > 1 ? `x${towerCount}` : ''}` : '-'

          // 자산 셀 (만원/억 단위로 표시)
          const assetsTd = document.createElement('td')
          assetsTd.className = 'col-assets'
          assetsTd.textContent = NumberFormat.formatLeaderboardAssets(entry.total_assets || 0)

          // 플레이타임 셀
          const playtimeTd = document.createElement('td')
          playtimeTd.className = 'col-playtime'
          playtimeTd.textContent = NumberFormat.formatRelativeTime(entry.updated_at)

          // 내 닉네임 하이라이트 + 내 엔트리 캐시
          const entryNickLower = (entry.nickname || '').trim().toLowerCase()
          if (currentNickLower && currentNickLower === entryNickLower) {
            tr.classList.add('is-me')
            myEntry = {
              rank: index + 1,
              ...entry,
            }
          }

          tr.appendChild(rankTd)
          tr.appendChild(nickTd)
          tr.appendChild(towerTd)
          tr.appendChild(assetsTd)
          tr.appendChild(playtimeTd)
          tbody.appendChild(tr)
        })

        table.appendChild(tbody)

        container.innerHTML = ''
        container.appendChild(table)
        __leaderboardLastUpdate = Date.now()

        // 마지막 갱신 시각 표시
        const lastUpdatedEl = document.getElementById('leaderboardLastUpdated')
        if (lastUpdatedEl) {
          const d = new Date(__leaderboardLastUpdate)
          const hh = String(d.getHours()).padStart(2, '0')
          const mm = String(d.getMinutes()).padStart(2, '0')
          const ss = String(d.getSeconds()).padStart(2, '0')
          const timeStr = `${hh}:${mm}:${ss}`
          lastUpdatedEl.textContent = t('ranking.lastUpdated', { time: timeStr })
        }

        // 내 순위 영역 업데이트 (Top10 및 Top10 밖 모두)
        const myRankContent = document.getElementById('myRankContent')
        if (myRankContent) {
          if (!currentNickLower) {
            myRankContent.innerHTML = `
                <div class="leaderboard-my-rank-empty">
                  ${t('ranking.nicknameRequired') || 'Set a nickname to see your rank and record here.'}
                </div>
              `
          } else if (myEntry) {
            // Top10 안에 있을 때: 이미 계산된 myEntry 사용
            const playTimeText = NumberFormat.formatPlaytimeMs(myEntry.play_time_ms || 0)
            const towerCount = myEntry.tower_count || 0
            // XSS 방지: 닉네임 이스케이프
            const safeNickname = escapeHTML(
              myEntry.nickname || gameStateRef().playerNickname || t('ui.anonymous') || 'Anonymous'
            )
            const displayName =
              towerCount > 0
                ? `${safeNickname} 🗼${towerCount > 1 ? `x${towerCount}` : ''}`
                : safeNickname
            myRankContent.innerHTML = `
                <div class="my-rank-card">
                  <div class="my-rank-header">
                    <span class="my-rank-label">${t('ranking.myRecord') || 'My Record'}</span>
                    <span class="my-rank-rank-badge">${myEntry.rank}${t('ranking.rankSuffix') || ''}</span>
                  </div>
                  <div class="my-rank-main">
                    <div class="my-rank-name">${displayName}</div>
                    <div class="my-rank-assets">💰 ${NumberFormat.formatLeaderboardAssets(myEntry.total_assets || 0)}</div>
                  </div>
                  <div class="my-rank-meta">
                    <span class="my-rank-playtime">⏱️ ${t('ranking.table.playtime.full')}: ${playTimeText}</span>
                    <span class="my-rank-note">${t('ranking.top10Rank') || 'Top 10 Rank'}</span>
                  </div>
                </div>
              `
          } else {
            // 닉네임은 있지만 Top10 밖인 경우: RPC로 실제 순위 조회
            const user = await getUser()

            if (!user) {
              // 비로그인 상태: 간단한 문구 + 버튼만 표시
              myRankContent.innerHTML = `
                  <div class="leaderboard-my-rank-empty">
                    ${t('ranking.loginRequired')}
                    <div class="leaderboard-my-rank-actions">
                      <button type="button" class="btn" id="openLoginFromRanking">
                        🔐 ${t('settings.loginGoogle')}
                      </button>
                    </div>
                  </div>
                `
              const loginBtn = document.getElementById('openLoginFromRanking')
              if (loginBtn) {
                loginBtn.addEventListener('click', async e => {
                  e.preventDefault()
                  if (!isSupabaseConfigured()) {
                    alert(
                      t('settings.guestMode') ||
                        'Currently in guest mode. Login feature is coming soon.'
                    )
                    return
                  }
                  const result = await signInGoogle()
                  if (!result.ok) {
                    alert(t('error.loginFailed') || 'Login failed. Please try again.')
                  } else {
                    // 로그인 성공 후 리더보드 UI 다시 업데이트
                    setTimeout(() => updateLeaderboardUI(true), 1000)
                  }
                })
              }
              return
            }

            // 로그인 상태: RPC로 순위 조회
            myRankContent.innerHTML = `
                <div class="leaderboard-my-rank-loading">
                  ${t('ranking.loadingMyRank') || 'Loading my rank...'}
                </div>
              `

            try {
              const rankResult = await getMyRank(gameStateRef().playerNickname, 'assets')

              if (!rankResult.success || !rankResult.data) {
                let innerHtml = ''
                if (rankResult.errorType === 'forbidden') {
                  // 권한 부족: 간단한 문구 + 버튼만 표시
                  console.warn('[LB] 권한 부족으로 내 순위 조회 실패')
                  innerHtml = `
                      <div class="leaderboard-my-rank-empty">
                        ${t('ranking.loginRequired')}
                        <div class="leaderboard-my-rank-actions">
                          <button type="button" class="btn" id="openLoginFromRanking">
                            🔐 ${t('settings.loginGoogle')}
                          </button>
                        </div>
                      </div>
                    `
                } else if (rankResult.errorType === 'network') {
                  console.error('[LB] 네트워크 오류로 내 순위 조회 실패')
                  innerHtml = `
                      <div class="leaderboard-my-rank-error">
                        ${t('ranking.networkErrorMyRank') || 'Network error: Cannot load my rank.'}
                      </div>
                    `
                } else if (rankResult.errorType === 'not_found') {
                  // 리더보드에 기록이 없음: 로그인 상태면 리더보드 업데이트 시도
                  if (user && gameStateRef().playerNickname) {
                    try {
                      // bigint 컬럼에 안전하게 저장하기 위해 정수로 변환 (0 바운딩)
                      const rawTotalAssets =
                        gameStateRef().cash + gameStateRef().calculateTotalAssetValue()
                      const totalAssets = Math.max(0, Math.floor(rawTotalAssets))

                      const currentSessionTime = Math.max(
                        0,
                        Math.floor(Date.now() - gameStateRef().sessionStartTime)
                      )
                      const rawTotalPlayTimeMs = gameStateRef().totalPlayTime + currentSessionTime
                      const totalPlayTimeMs = Math.max(0, Math.floor(rawTotalPlayTimeMs))

                      const towerCount = Math.max(
                        0,
                        Math.floor(gameStateRef().towers_lifetime || 0)
                      )

                      if (gameStateRef().__IS_DEV__) {
                        console.log('[LB] 리더보드 업데이트 시도', {
                          nickname: gameStateRef().playerNickname,
                          totalAssets: { raw: rawTotalAssets, safe: totalAssets },
                          totalPlayTimeMs: { raw: rawTotalPlayTimeMs, safe: totalPlayTimeMs },
                          towerCount: { raw: gameStateRef().towers_lifetime, safe: towerCount },
                        })
                      }
                      const updateResult = await updateLeaderboard(
                        gameStateRef().playerNickname,
                        totalAssets,
                        totalPlayTimeMs,
                        towerCount
                      )
                      if (updateResult.success) {
                        // 업데이트 성공 후 다시 조회
                        const retryResult = await getMyRank(gameStateRef().playerNickname, 'assets')
                        if (retryResult.success && retryResult.data) {
                          const me = retryResult.data
                          const playTimeText = NumberFormat.formatPlaytimeMs(me.play_time_ms || 0)
                          const towerCount = me.tower_count || 0
                          const displayName =
                            towerCount > 0
                              ? `${me.nickname || gameStateRef().playerNickname || t('ui.anonymous') || 'Anonymous'} 🗼${towerCount > 1 ? `x${towerCount}` : ''}`
                              : me.nickname ||
                                gameStateRef().playerNickname ||
                                t('ui.anonymous') ||
                                'Anonymous'
                          myRankContent.innerHTML = `
                              <div class="my-rank-card">
                                <div class="my-rank-header">
                                  <span class="my-rank-label">${t('ranking.myRecord') || 'My Record'}</span>
                                  <span class="my-rank-rank-badge">${me.rank}${t('ranking.rankSuffix') || ''}</span>
                                </div>
                                <div class="my-rank-main">
                                  <div class="my-rank-name">${displayName}</div>
                                  <div class="my-rank-assets">💰 ${NumberFormat.formatLeaderboardAssets(me.total_assets || 0)}</div>
                                </div>
                                <div class="my-rank-meta">
                                  <span class="my-rank-playtime">⏱️ ${t('ranking.table.playtime.full')}: ${playTimeText}</span>
                                  <span class="my-rank-note">${t('ranking.myActualRank') || 'My Actual Rank'}</span>
                                </div>
                              </div>
                            `
                          return
                        }
                      } else {
                        console.error('[LB] 리더보드 업데이트 실패', updateResult.error)
                      }
                    } catch (updateError) {
                      console.error('[LB] 리더보드 업데이트 중 오류', updateError)
                    }
                  }
                  // 업데이트 실패하거나 여전히 기록이 없으면 안내 메시지
                  innerHtml = `
                      <div class="leaderboard-my-rank-empty">
                        ${t('ranking.emptyMessage')}<br />
                        ${t('ranking.emptyHint')}
                      </div>
                    `
                } else {
                  console.error('[LB] 내 순위 조회 실패', rankResult.errorType)
                  innerHtml = `
                      <div class="leaderboard-my-rank-error">
                        ${t('ranking.cannotLoadMyRank') || 'Cannot load my rank.'}
                      </div>
                    `
                }

                myRankContent.innerHTML = innerHtml

                const loginBtn = document.getElementById('openLoginFromRanking')
                if (loginBtn) {
                  loginBtn.addEventListener('click', async e => {
                    e.preventDefault()
                    if (!isSupabaseConfigured()) {
                      alert(
                        t('settings.guestMode') ||
                          'Currently in guest mode. Login feature is coming soon.'
                      )
                      return
                    }
                    const result = await signInGoogle()
                    if (!result.ok) {
                      alert(t('error.loginFailed') || 'Login failed. Please try again.')
                    } else {
                      // 로그인 성공 후 리더보드 UI 다시 업데이트
                      setTimeout(() => updateLeaderboardUI(true), 1000)
                    }
                  })
                }
              } else {
                const me = rankResult.data
                const playTimeText = NumberFormat.formatPlaytimeMs(me.play_time_ms || 0)
                const towerCount = me.tower_count || 0
                // XSS 방지: 닉네임 이스케이프
                const safeNickname = escapeHTML(
                  me.nickname || gameStateRef().playerNickname || t('ui.anonymous') || 'Anonymous'
                )
                const displayName =
                  towerCount > 0
                    ? `${safeNickname} 🗼${towerCount > 1 ? `x${towerCount}` : ''}`
                    : safeNickname
                myRankContent.innerHTML = `
                    <div class="my-rank-card">
                      <div class="my-rank-header">
                        <span class="my-rank-label">${t('ranking.myRecord') || 'My Record'}</span>
                        <span class="my-rank-rank-badge">${me.rank}${t('ranking.rankSuffix') || ''}</span>
                      </div>
                      <div class="my-rank-main">
                        <div class="my-rank-name">${displayName}</div>
                        <div class="my-rank-assets">💰 ${NumberFormat.formatLeaderboardAssets(me.total_assets || 0)}</div>
                      </div>
                      <div class="my-rank-meta">
                        <span class="my-rank-playtime">⏱️ ${t('ranking.table.playtime.full')}: ${playTimeText}</span>
                        <span class="my-rank-note">${t('ranking.myActualRank') || 'My Actual Rank'}</span>
                      </div>
                    </div>
                  `
              }
            } catch (e) {
              console.error('[LB] My rank RPC call failed:', e)
              myRankContent.innerHTML = `
                  <div class="leaderboard-my-rank-error">
                    ${t('ranking.errorLoadingMyRank') || 'Error occurred while loading my rank.'}
                  </div>
                `
            }
          }
        }
      } catch (error) {
        clearTimeout(timeoutId)
        console.error('리더보드 UI 업데이트 실패:', error)
        const errorMsg = error.message || 'Unknown error'
        // XSS 방지: renderErrorUI 사용
        renderErrorUI(container, t('ranking.error', { error: errorMsg }), true)
        __leaderboardLastUpdate = Date.now()
      } finally {
        __leaderboardLoading = false
      }
    },
    force ? 0 : 300
  ) // force가 아니면 300ms 지연
}

/**
 * 리더보드 엔트리 업데이트 (게임 저장 시 호출)
 */
export async function updateLeaderboardEntry(forceImmediate = false) {
  if (!gameStateRef().playerNickname) {
    if (gameStateRef().__IS_DEV__) {
      console.log('[LB] 리더보드 업데이트 스킵: 닉네임 없음')
    }
    return // 닉네임이 없으면 업데이트 안 함
  }

  // 엔딩 이후에도 계속 업데이트 (gameStateRef().towers_lifetime 사용)
  try {
    // 로그인 상태 확인
    const user = await getUser()
    if (!user) {
      if (gameStateRef().__IS_DEV__) {
        console.log('[LB] 리더보드 업데이트 스킵: 로그인되지 않음')
      }
      return
    }

    // bigint 컬럼에 안전하게 저장하기 위해 정수로 변환 (0 바운딩)
    const rawTotalAssets = gameStateRef().cash + gameStateRef().calculateTotalAssetValue()
    const totalAssets = Math.max(0, Math.floor(rawTotalAssets))

    const currentSessionTime = Math.max(0, Math.floor(Date.now() - gameStateRef().sessionStartTime))
    const rawTotalPlayTimeMs = gameStateRef().totalPlayTime + currentSessionTime
    const totalPlayTimeMs = Math.max(0, Math.floor(rawTotalPlayTimeMs))

    const towerCount = Math.max(0, Math.floor(gameStateRef().towers_lifetime || 0))

    if (gameStateRef().__IS_DEV__) {
      console.log('[LB] 리더보드 업데이트 시도', {
        nickname: gameStateRef().playerNickname,
        totalAssets: { raw: rawTotalAssets, safe: totalAssets },
        totalPlayTimeMs: { raw: rawTotalPlayTimeMs, safe: totalPlayTimeMs },
        towerCount: { raw: gameStateRef().towers_lifetime, safe: towerCount },
        userId: user.id,
        forceImmediate,
      })
    }

    const result = await updateLeaderboard(
      gameStateRef().playerNickname,
      totalAssets,
      totalPlayTimeMs,
      towerCount,
      forceImmediate
    )
    if (result.success) {
      if (gameStateRef().__IS_DEV__) {
        console.log('[LB] 리더보드 업데이트 성공', result.skipped ? '(skipped)' : '')
      }
    } else {
      console.error('[LB] 리더보드 업데이트 실패', result.error)
    }
  } catch (error) {
    console.error('[LB] 리더보드 업데이트 예외 발생:', error)
  }
}

/**
 * 리더보드 폴링 시작
 */
export function startLeaderboardPolling() {
  const rankingTab = document.getElementById('rankingTab')
  if (!rankingTab) return

  // 모바일(탭형)에서는 active 탭일 때만 폴링
  if (!isDesktopLayout() && !rankingTab.classList.contains('active')) return

  // 이미 폴링 중이면 스킵 (강화된 가드)
  if (__lbPollingStarted && __lbInterval) {
    if (gameStateRef().__IS_DEV__) {
      console.debug('[LB] 폴링이 이미 시작되어 있음, 스킵')
    }
    return
  }

  // 플래그 설정 (타이머 설정 전에 설정하여 중복 방지)
  __lbPollingStarted = true

  // 첫 로드일 때만 즉시 업데이트
  if (__lbFirstLoad) {
    updateLeaderboardUI(true)
    __lbFirstLoad = false
  }

  // 다음 5분 정각까지 대기 후, 5분마다 갱신
  const now = Date.now()
  const POLLING_INTERVAL_MS = 300000 // 5분 = 300초
  const delayToNextInterval = POLLING_INTERVAL_MS - (now % POLLING_INTERVAL_MS)

  __lbInterval = setTimeout(function tick() {
    const rankingActive = rankingTab.classList.contains('active')
    // 모바일에서는 active 여부를 계속 검사, 데스크톱에서는 IntersectionObserver가 stop을 담당
    if (!isDesktopLayout() && !rankingActive) {
      stopLeaderboardPolling()
      return
    }
    updateLeaderboardUI(false)
    __lbInterval = setTimeout(tick, POLLING_INTERVAL_MS)
  }, delayToNextInterval)
}

/**
 * 리더보드 폴링 중단
 */
export function stopLeaderboardPolling() {
  if (__lbInterval) {
    clearTimeout(__lbInterval)
    __lbInterval = null
  }
  // 플래그도 리셋 (다시 시작할 수 있도록)
  __lbPollingStarted = false
}

/**
 * 리더보드 IntersectionObserver 설정
 */
export function setupLeaderboardObserver() {
  const rankingTab = document.getElementById('rankingTab')
  const container = document.getElementById('leaderboardContainer')
  if (!rankingTab || !container) return

  if (!('IntersectionObserver' in window)) {
    console.log('IntersectionObserver 미지원: active 탭 기준으로만 리더보드 폴링 제어')
    return
  }

  if (__lbObserver) {
    __lbObserver.disconnect()
  }

  // IntersectionObserver 콜백이 중복 호출되지 않도록 디바운싱
  let __lbObserverLastState = null
  let __lbObserverDebounceTimer = null

  __lbObserver = new IntersectionObserver(
    entries => {
      // 디바운싱: 연속 호출 방지 (100ms)
      if (__lbObserverDebounceTimer) {
        clearTimeout(__lbObserverDebounceTimer)
      }

      __lbObserverDebounceTimer = setTimeout(() => {
        entries.forEach(entry => {
          const isVisible = entry.isIntersecting
          const rankingActive = rankingTab.classList.contains('active')

          // 상태가 변경되지 않았으면 스킵 (중복 호출 방지)
          const currentState = isVisible ? 'visible' : 'hidden'
          if (__lbObserverLastState === currentState) {
            if (gameStateRef().__IS_DEV__) {
              console.debug('[LB] Observer 상태 변경 없음, 스킵:', currentState)
            }
            return
          }
          __lbObserverLastState = currentState

          // 데스크톱: 보이면 폴링 시작, 안 보이면 중단
          // 모바일: active + visible일 때만 시작
          const shouldStart = isDesktopLayout() ? isVisible : isVisible && rankingActive

          if (shouldStart) {
            if (gameStateRef().__IS_DEV__) {
              console.debug('[LB] Observer: 폴링 시작')
            }
            startLeaderboardPolling()
          } else {
            if (gameStateRef().__IS_DEV__) {
              console.debug('[LB] Observer: 폴링 중단')
            }
            stopLeaderboardPolling()
          }
        })
      }, 100) // 100ms 디바운싱
    },
    {
      root: null,
      threshold: 0.1,
    }
  )

  __lbObserver.observe(container)
}

/**
 * 리더보드 새로고침 버튼 초기화
 */
export function initLeaderboardRefreshButton() {
  const refreshBtn = document.getElementById('leaderboardRefreshBtn')
  if (!refreshBtn) return

  refreshBtn.addEventListener('click', async () => {
    // 이미 로딩 중이면 무시
    if (__leaderboardLoading) {
      return
    }

    // 로딩 애니메이션 시작
    refreshBtn.classList.add('loading')
    refreshBtn.disabled = true

    try {
      // 강제 업데이트 실행
      await updateLeaderboardUI(true)
    } catch (error) {
      console.error('[LB] 수동 새로고침 실패:', error)
    } finally {
      // 로딩 애니메이션 종료
      refreshBtn.classList.remove('loading')
      refreshBtn.disabled = false
    }
  })
}
