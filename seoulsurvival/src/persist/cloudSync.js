/**
 * cloudSync.js
 * 클라우드 세이브 동기화 시스템 (Supabase 기반)
 * - 탭 숨김/닫기 시 자동 업로드 (로그인 사용자)
 * - 수동 업로드/다운로드
 * - 클라우드 복구 제안
 * - 로그인 시 저장 충돌 해결
 */

import { fetchCloudSave, upsertCloudSave } from '../../../shared/cloudSave.js'
import * as NumberFormat from '../utils/numberFormat.js'
import * as Diary from '../systems/diary.js'

/**
 * 클라우드 동기화 관리자 생성 (Factory 패턴)
 * @param {Object} deps - 의존성 주입
 * @param {Function} deps.getUser - 현재 사용자 가져오기
 * @param {Function} deps.saveGame - 게임 저장 함수
 * @param {Function} deps.loadGame - 게임 로드 함수 (사용 안 함, 페이지 리로드로 대체)
 * @param {Object} deps.Modal - 모달 시스템
 * @param {Function} deps.t - 번역 함수
 * @param {Function} deps.getLang - 현재 언어 가져오기
 * @param {string} deps.SAVE_KEY - 로컬 저장 키
 * @param {string} deps.CLOUD_RESTORE_BLOCK_KEY - 클라우드 복구 차단 키
 * @param {string} deps.CLOUD_RESTORE_SKIP_KEY - 클라우드 복구 스킵 키
 * @param {Function} deps.calculateTotalAssetValueFromSave - 자산 계산 함수
 * @param {Function} deps.calculatePlayTimeMsFromSave - 플레이타임 계산 함수
 * @param {number} deps.sessionStartTime - 세션 시작 시간
 * @param {Function} deps.updateUI - UI 업데이트 함수
 * @param {Object} deps.LeaderboardUI - 리더보드 UI
 * @param {Function} deps.onAuthStateChange - 인증 상태 변경 감지
 * @param {Function} deps.claimNickname - 닉네임 클레임 함수
 * @param {Function} deps.normalizeNickname - 닉네임 정규화 함수
 * @param {Function} deps.getPlayerNickname - 현재 플레이어 닉네임 가져오기
 * @param {Function} deps.setPlayerNickname - 플레이어 닉네임 설정
 * @param {boolean} deps.__IS_DEV__ - 개발 모드 플래그
 * @returns {Object} 클라우드 동기화 관리자
 */
export function createCloudSyncManager(deps) {
  const {
    getUser,
    Modal,
    t,
    getLang,
    SAVE_KEY,
    CLOUD_RESTORE_BLOCK_KEY,
    CLOUD_RESTORE_SKIP_KEY,
    calculateTotalAssetValueFromSave,
    calculatePlayTimeMsFromSave,
    sessionStartTime,
    updateUI,
    LeaderboardUI,
    onAuthStateChange,
    claimNickname,
    normalizeNickname,
    getPlayerNickname,
    setPlayerNickname,
    __IS_DEV__,
  } = deps

  // 내부 상태
  let __cloudPendingSave = null
  let __lastCloudUploadedSaveTs = 0
  let __currentUser = null
  let __lastCloudSyncAt = null

  /**
   * 마지막 클라우드 동기화 시간 UI 업데이트
   */
  function __updateCloudLastSyncUI() {
    const el = document.getElementById('cloudLastSync')
    if (!el) return
    if (!__lastCloudSyncAt) {
      el.textContent = '--:--'
      return
    }
    const locale = getLang() === 'en' ? 'en-US' : 'ko-KR'
    el.textContent = __lastCloudSyncAt.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  /**
   * 클라우드 힌트 메시지 설정
   */
  function __setCloudHint(text) {
    const el = document.getElementById('cloudSaveHint')
    if (!el || !text) return
    el.textContent = text
  }

  /**
   * 탭 숨김/닫기 시 자동 플러시 (토글 없음, 항상 ON)
   */
  async function flushCloudAutoUpload(_reason = 'flush') {
    if (!__currentUser) return
    if (!__cloudPendingSave) return

    const saveObj = __cloudPendingSave
    __cloudPendingSave = null

    const saveTs = Number(saveObj?.ts || Date.now()) || Date.now()
    if (saveTs && saveTs <= __lastCloudUploadedSaveTs) return // 중복 업로드 방지

    const r = await upsertCloudSave('seoulsurvival', saveObj)
    if (!r.ok) {
      // 플러시는 조용히 실패(UX 보호). 버튼 수동 업로드에서 자세한 안내.
      __setCloudHint(`자동 동기화 실패(나중에 재시도). 이유: ${r.reason || 'unknown'}`)
      return
    }

    __lastCloudUploadedSaveTs = saveTs
    __lastCloudSyncAt = new Date()
    __updateCloudLastSyncUI()
    __setCloudHint('자동 동기화 완료 ✅')
  }

  /**
   * 수동 클라우드 업로드
   */
  async function cloudUpload() {
    const user = await getUser()
    if (!user) {
      Modal.openInfoModal(
        t('modal.error.loginRequired.title'),
        t('modal.error.loginRequired.message'),
        '🔐'
      )
      return
    }

    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) {
      Modal.openInfoModal(
        t('modal.error.noSaveData.title'),
        t('modal.error.noSaveData.message'),
        '💾'
      )
      return
    }

    let saveObj
    try {
      saveObj = JSON.parse(raw)
    } catch {
      Modal.openInfoModal(
        t('modal.error.invalidSaveData.title'),
        t('modal.error.invalidSaveData.message'),
        '⚠️'
      )
      return
    }

    const r = await upsertCloudSave('seoulsurvival', saveObj)
    if (!r.ok) {
      if (r.reason === 'missing_table') {
        Modal.openInfoModal(
          t('modal.error.cloudTableMissing.title'),
          t('modal.error.cloudTableMissing.message'),
          '🛠️'
        )
        return
      }
      Modal.openInfoModal(
        t('modal.error.uploadFailed.title'),
        t('modal.error.uploadFailed.message', { error: r.error?.message || '' }),
        '⚠️'
      )
      return
    }

    Diary.addLog(t('msg.cloudSaved'))
    Modal.openInfoModal(
      t('modal.info.cloudSaveComplete.title'),
      t('modal.info.cloudSaveComplete.message'),
      '☁️'
    )
  }

  /**
   * 수동 클라우드 다운로드
   */
  async function cloudDownload() {
    const user = await getUser()
    if (!user) {
      Modal.openInfoModal(
        t('modal.error.loginRequired.title'),
        t('modal.error.loginRequired.message'),
        '🔐'
      )
      return
    }

    const r = await fetchCloudSave('seoulsurvival')
    if (!r.ok) {
      if (r.reason === 'missing_table') {
        Modal.openInfoModal(
          t('modal.error.cloudTableMissing.title'),
          t('modal.error.cloudTableMissing.message'),
          '🛠️'
        )
        return
      }
      Modal.openInfoModal(
        t('modal.error.downloadFailed.title'),
        t('modal.error.downloadFailed.message', { error: r.error?.message || '' }),
        '⚠️'
      )
      return
    }

    if (!r.found) {
      Modal.openInfoModal(
        t('modal.error.noCloudSave.title'),
        t('modal.error.noCloudSave.message'),
        '☁️'
      )
      return
    }

    const locale = getLang() === 'en' ? 'en-US' : 'ko-KR'
    const cloudTime = r.save?.saveTime
      ? new Date(r.save.saveTime).toLocaleString(locale)
      : r.updated_at
        ? new Date(r.updated_at).toLocaleString(locale)
        : t('ui.noTimeInfo')
    Modal.openConfirmModal(
      t('modal.confirm.cloudLoad.title'),
      t('modal.confirm.cloudLoad.message', { time: cloudTime }),
      () => {
        try {
          localStorage.setItem(SAVE_KEY, JSON.stringify(r.save))
          Diary.addLog(t('msg.cloudApplied'))
          setTimeout(() => location.reload(), 600)
        } catch (e) {
          Modal.openInfoModal(
            t('modal.error.cloudApplyFailed.title'),
            t('modal.error.cloudApplyFailed.message', { error: String(e) }),
            '⚠️'
          )
        }
      },
      {
        icon: '☁️',
        primaryLabel: t('button.load'),
        secondaryLabel: t('button.cancel'),
      }
    )
  }

  /**
   * 클라우드 세이브 복구를 제안하고, 사용자 선택에 따라 처리
   * @returns {Promise<boolean>} true: reload가 예약됨, false: reload 예약 안 됨
   */
  async function maybeOfferCloudRestore() {
    // 닉네임 결정이 끝날 때까지 클라우드 복구를 차단
    try {
      if (sessionStorage.getItem(CLOUD_RESTORE_BLOCK_KEY) === '1') {
        return false
      }
    } catch (e) {
      console.warn('sessionStorage get 실패:', e)
    }

    // resetGame 직후 첫 부팅에서는 클라우드 복구 제안을 1회 스킵
    try {
      if (sessionStorage.getItem(CLOUD_RESTORE_SKIP_KEY) === '1') {
        sessionStorage.removeItem(CLOUD_RESTORE_SKIP_KEY)
        return false
      }
    } catch (e) {
      console.warn('sessionStorage get/remove 실패:', e)
    }

    // 로컬 저장이 없을 때만 자동 제안(안전)
    const hasLocal = !!localStorage.getItem(SAVE_KEY)
    if (hasLocal) return false

    const user = await getUser()
    if (!user) return false

    const r = await fetchCloudSave('seoulsurvival')
    if (!r.ok || !r.found) return false

    const locale = getLang() === 'en' ? 'en-US' : 'ko-KR'
    const cloudTime = r.save?.saveTime
      ? new Date(r.save.saveTime).toLocaleString(locale)
      : r.updated_at
        ? new Date(r.updated_at).toLocaleString(locale)
        : t('ui.noTimeInfo')
    const message = t('modal.confirm.cloudRestore.message', { time: cloudTime })

    // Promise를 반환하여 사용자 선택을 기다림
    return new Promise(resolve => {
      let settled = false // resolve 중복 호출 방지 가드

      const done = value => {
        if (!settled) {
          settled = true
          resolve(value)
        }
      }

      Modal.openConfirmModal(
        t('modal.confirm.cloudRestore.title'),
        message,
        () => {
          // "불러오기" 클릭 시
          try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(r.save))
            Diary.addLog(t('msg.cloudApplied'))
            setTimeout(() => location.reload(), 600)
            done(true) // reload가 예약되었음을 반환
          } catch (error) {
            console.error('클라우드 세이브 적용 실패:', error)
            done(false) // 에러 발생 시 false 반환
          }
        },
        {
          icon: '☁️',
          primaryLabel: t('button.load'),
          secondaryLabel: t('button.later'),
          onCancel: () => {
            // "나중에" 클릭 시
            done(false) // reload 예약 안 됨
          },
        }
      )
    })
  }

  /**
   * 로그인 시 클라우드/로컬 저장 비교 및 제안
   * @returns {Promise<boolean>} true: 저장이 변경됨 (reload 필요), false: 변경 없음
   */
  async function compareAndOfferSaveSync() {
    const user = await getUser()
    if (!user) return false

    // 로컬 저장 확인
    const localSaveStr = localStorage.getItem(SAVE_KEY)
    if (!localSaveStr) {
      // 로컬 저장 없으면 기존 maybeOfferCloudRestore() 사용
      return await maybeOfferCloudRestore()
    }

    let localSave
    try {
      localSave = JSON.parse(localSaveStr)
    } catch (e) {
      console.error('로컬 저장 파싱 실패:', e)
      return false
    }

    // 클라우드 저장 확인
    const cloudResult = await fetchCloudSave('seoulsurvival')
    if (!cloudResult.ok || !cloudResult.found) {
      // 클라우드 저장 없으면 현재 로컬 저장 사용
      return false
    }

    const cloudSave = cloudResult.save

    // 자산 계산
    const localAssets = calculateTotalAssetValueFromSave(localSave)
    const cloudAssets = calculateTotalAssetValueFromSave(cloudSave)

    // 플레이타임 계산
    const localPlayTimeMs = calculatePlayTimeMsFromSave(localSave, sessionStartTime)
    const cloudPlayTimeMs = calculatePlayTimeMsFromSave(cloudSave, Date.now())

    // 타임스탬프 비교
    const localTs = Number(localSave.ts || 0)
    const cloudTs = Number(cloudResult.save_ts || 0)

    // 비교 로직: 클라우드가 더 높은 자산이거나, 자산이 같으면 더 최신인 경우
    const shouldOfferCloud =
      cloudAssets > localAssets || // 클라우드가 더 높은 자산
      (cloudAssets === localAssets && cloudTs > localTs) // 자산 같으면 더 최신 것

    if (!shouldOfferCloud) {
      // 로컬이 더 나으면 제안하지 않음
      return false
    }

    const locale = getLang() === 'en' ? 'en-US' : 'ko-KR'
    // 클라우드가 더 나은 경우 제안
    const cloudTime = cloudSave.saveTime
      ? new Date(cloudSave.saveTime).toLocaleString(locale)
      : cloudResult.updated_at
        ? new Date(cloudResult.updated_at).toLocaleString(locale)
        : t('ui.noTimeInfo')
    const localTime = localSave.saveTime
      ? new Date(localSave.saveTime).toLocaleString(locale)
      : t('ui.noTimeInfo')

    // 플레이타임 포맷
    const localPlayTimeText = NumberFormat.formatPlaytimeMs(localPlayTimeMs)
    const cloudPlayTimeText = NumberFormat.formatPlaytimeMs(cloudPlayTimeMs)

    // 자산 포맷
    const localAssetsText = NumberFormat.formatLeaderboardAssets(localAssets)
    const cloudAssetsText = NumberFormat.formatLeaderboardAssets(cloudAssets)

    const message =
      `다른 기기에서 더 높은 점수로 저장된 진행이 있습니다.\n\n` +
      `📊 지금 이 기기\n` +
      `   자산: ${localAssetsText}\n` +
      `   플레이타임: ${localPlayTimeText}\n` +
      `   저장 시간: ${localTime}\n\n` +
      `☁️ 다른 기기\n` +
      `   자산: ${cloudAssetsText}\n` +
      `   플레이타임: ${cloudPlayTimeText}\n` +
      `   저장 시간: ${cloudTime}\n\n` +
      `어떤 진행을 사용하시겠습니까?`

    return new Promise(resolve => {
      let settled = false

      const done = value => {
        if (!settled) {
          settled = true
          resolve(value)
        }
      }

      Modal.openConfirmModal(
        t('modal.confirm.progressSwitch.title'),
        t('modal.confirm.progressSwitch.message', { message }),
        () => {
          // 다른 기기로 바꾸기
          try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(cloudSave))
            Diary.addLog(t('msg.cloudProgressLoaded'))
            setTimeout(() => location.reload(), 600)
            done(true)
          } catch (error) {
            console.error('클라우드 세이브 적용 실패:', error)
            Modal.openInfoModal(
              t('modal.error.progressSwitchFailed.title'),
              t('modal.error.progressSwitchFailed.message', {
                error: error.message || String(error),
              }),
              '⚠️'
            )
            done(false)
          }
        },
        {
          icon: '☁️',
          primaryLabel: '다른 기기로 바꾸기',
          secondaryLabel: '지금 기기 그대로',
          onCancel: () => {
            // 지금 기기 그대로 선택 시
            done(false)
          },
        }
      )
    })
  }

  /**
   * 자동 저장 시 pending save 업데이트
   * (main.js의 autosave에서 호출)
   */
  function setPendingSave(saveObj) {
    __cloudPendingSave = saveObj
  }

  /**
   * 현재 사용자 설정
   */
  function setCurrentUser(user) {
    __currentUser = user
  }

  /**
   * 인증 상태 변경 리스너 등록
   */
  async function initAuthListener() {
    try {
      __currentUser = await getUser()

      // 마이그레이션: 로그인 시 현재 닉네임이 있으면 자동 claim 시도
      const playerNickname = getPlayerNickname()
      if (__currentUser && playerNickname) {
        try {
          const { raw: normalized } = normalizeNickname(playerNickname)
          const claimResult = await claimNickname(normalized, __currentUser.id)

          if (!claimResult.success && claimResult.error === 'taken') {
            // 충돌: 다른 사용자가 이미 점유
            if (__IS_DEV__) {
              console.warn('[Nickname Migration] 충돌 감지:', playerNickname)
            }
            // needsNicknameChange 플래그 설정
            try {
              localStorage.setItem('clicksurvivor_needsNicknameChange', 'true')
            } catch (e) {
              console.warn('needsNicknameChange 플래그 저장 실패:', e)
            }
          } else if (claimResult.success) {
            if (__IS_DEV__) {
              console.warn('[Nickname Migration] 자동 claim 성공:', playerNickname)
            }
            // 성공 시 플래그 해제
            try {
              localStorage.removeItem('clicksurvivor_needsNicknameChange')
            } catch {
              // 무시
            }
          }
        } catch (error) {
          console.error('[Nickname Migration] 자동 claim 실패:', error)
          // 마이그레이션 실패해도 게임 진행은 계속
        }
      }

      onAuthStateChange(async user => {
        __currentUser = user

        // 로그인 시 마이그레이션: 현재 닉네임이 있으면 자동 claim 시도
        const playerNickname = getPlayerNickname()
        if (user && playerNickname) {
          try {
            const { raw: normalized } = normalizeNickname(playerNickname)
            const claimResult = await claimNickname(normalized, user.id)

            if (!claimResult.success && claimResult.error === 'taken') {
              // 충돌: 다른 사용자가 이미 점유
              if (__IS_DEV__) {
                console.warn('[Nickname Migration] 로그인 후 충돌 감지:', playerNickname)
              }
              // needsNicknameChange 플래그 설정
              try {
                localStorage.setItem('clicksurvivor_needsNicknameChange', 'true')
              } catch (e) {
                console.warn('needsNicknameChange 플래그 저장 실패:', e)
              }
              // 설정 탭에 배너 표시를 위해 UI 업데이트
              setTimeout(() => {
                updateUI()
              }, 20)
            } else if (claimResult.success) {
              if (__IS_DEV__) {
                console.warn('[Nickname Migration] 로그인 후 자동 claim 성공:', playerNickname)
              }
              // 성공 시 플래그 해제
              try {
                localStorage.removeItem('clicksurvivor_needsNicknameChange')
              } catch {
                // 무시
              }
              // 리더보드 즉시 업데이트
              try {
                await LeaderboardUI.updateLeaderboardEntry(true)
              } catch (error) {
                console.error('리더보드 업데이트 실패:', error)
              }
            }
          } catch (error) {
            console.error('[Nickname Migration] 로그인 후 자동 claim 실패:', error)
          }
        }

        // 로그인 성공 시 저장 비교 (1회만)
        if (user && !window.__saveSyncChecked) {
          window.__saveSyncChecked = true
          // UI 안정화를 위해 약간의 지연
          setTimeout(async () => {
            try {
              await compareAndOfferSaveSync()
            } catch (error) {
              console.error('저장 동기화 확인 중 오류:', error)
            }
          }, 1500) // 로그인 UI 업데이트 후 실행
        } else if (!user) {
          // 로그아웃 시 플래그 리셋
          window.__saveSyncChecked = false
        }
      })

      // 닉네임 변경 이벤트 감지 (다른 페이지에서 닉네임 변경 시)
      // 이벤트 리스너는 한 번만 등록되도록 onAuthStateChange 밖으로 이동
      if (!window.__nicknameEventListenersRegistered) {
        window.__nicknameEventListenersRegistered = true

        window.addEventListener('nicknamechanged', async event => {
          const newNickname = event.detail?.nickname
          if (newNickname) {
            setPlayerNickname(newNickname)
            // 게임 저장에 닉네임 업데이트
            try {
              const saveData = localStorage.getItem(SAVE_KEY)
              if (saveData) {
                const data = JSON.parse(saveData)
                data.nickname = newNickname
                localStorage.setItem(SAVE_KEY, JSON.stringify(data))
              }
            } catch (e) {
              console.warn('닉네임 저장 실패:', e)
            }
            // UI 업데이트
            setTimeout(() => {
              updateUI()
            }, 20)
            if (__IS_DEV__) {
              console.warn('[SeoulSurvival] Nickname updated from event:', newNickname)
            }
          }
        })

        // authstatechange 이벤트도 감지 (닉네임 변경 후 발생)
        window.addEventListener('authstatechange', async () => {
          // 닉네임 변경 플래그 확인
          try {
            const nicknameChanged = localStorage.getItem('clicksurvivor_nickname_changed')
            if (nicknameChanged) {
              // 현재 사용자 가져오기
              const currentUser = await getUser()
              if (currentUser) {
                // 서버에서 최신 닉네임 가져오기
                const { getUserProfile } = await import('../../../shared/auth/core.js')
                const profile = await getUserProfile('seoulsurvival')
                if (profile.success && profile.user?.nickname) {
                  setPlayerNickname(profile.user.nickname)
                  // 게임 저장에 닉네임 업데이트
                  const saveData = localStorage.getItem(SAVE_KEY)
                  if (saveData) {
                    const data = JSON.parse(saveData)
                    data.nickname = profile.user.nickname
                    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
                  }
                  // UI 업데이트
                  setTimeout(() => {
                    updateUI()
                  }, 20)
                  if (__IS_DEV__) {
                    console.warn(
                      '[SeoulSurvival] Nickname updated from server:',
                      profile.user.nickname
                    )
                  }
                }
              }
              // 플래그 제거
              localStorage.removeItem('clicksurvivor_nickname_changed')
            }
          } catch (e) {
            console.warn('닉네임 동기화 실패:', e)
          }
        })
      }
    } catch {
      // Ignore if browser doesn't support this event
    }
  }

  /**
   * visibility/pagehide 이벤트 리스너 등록
   */
  function initVisibilityListeners() {
    // 탭이 숨겨지거나 닫힐 때 자동으로 클라우드에 플러시 (로그인 사용자만)
    // 주의: 브라우저 크래시/강제 종료 시에는 실행되지 않을 수 있음 (best-effort)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flushCloudAutoUpload('visibility:hidden')
      }
    })
    window.addEventListener('pagehide', () => {
      flushCloudAutoUpload('pagehide')
    })
  }

  return {
    // Public API
    cloudUpload,
    cloudDownload,
    maybeOfferCloudRestore,
    compareAndOfferSaveSync,
    flushCloudAutoUpload,
    setPendingSave,
    setCurrentUser,
    initAuthListener,
    initVisibilityListeners,

    // Internal (for testing)
    __updateCloudLastSyncUI,
    __setCloudHint,
  }
}
