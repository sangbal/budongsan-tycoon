/**
 * nicknameManager.js
 * 닉네임 관리 모듈 (Factory 패턴)
 *
 * 책임:
 * - 닉네임 모달 오픈 (중복 방지)
 * - 닉네임 변경 처리 (로컬/클라우드)
 * - 쿨타임 관리 (30초)
 */

const NICKNAME_CHANGE_COOLDOWN_MS = 30000
const NICKNAME_CHANGE_COOLDOWN_KEY = 'clicksurvivor_lastNicknameChangeAt'

/**
 * 닉네임 매니저 팩토리 함수
 *
 * @param {Object} deps - 의존성 객체
 * @param {string} deps.SAVE_KEY - localStorage 저장 키
 * @param {string} deps.CLOUD_RESTORE_BLOCK_KEY - 클라우드 복구 차단 키
 * @param {Function} deps.Modal - 모달 객체 (openInputModal, openInfoModal)
 * @param {Function} deps.t - 다국어 번역 함수
 * @param {Function} deps.validateNickname - 닉네임 유효성 검사 함수
 * @param {Function} deps.normalizeNickname - 닉네임 정규화 함수
 * @param {Function} deps.claimNickname - 닉네임 등록 함수 (Supabase)
 * @param {Function} deps.getUser - 현재 로그인 사용자 가져오기
 * @param {Function} deps.saveGame - 게임 저장 함수
 * @param {Function} deps.updateUI - UI 업데이트 함수
 * @param {Object} deps.Diary - 일기 객체 (addLog)
 * @param {Object} deps.LeaderboardUI - 리더보드 UI 객체 (updateLeaderboardEntry)
 * @param {Function} deps.upsertCloudSave - 클라우드 저장 함수
 * @param {Function} deps.getPlayerNickname - 현재 닉네임 가져오기
 * @param {Function} deps.setPlayerNickname - 닉네임 설정 함수
 * @param {boolean} deps.__IS_DEV__ - 개발 모드 플래그
 *
 * @returns {Object} 닉네임 관리 함수들
 */
export function createNicknameManager(deps) {
  const {
    SAVE_KEY,
    CLOUD_RESTORE_BLOCK_KEY,
    Modal,
    t,
    validateNickname,
    normalizeNickname,
    claimNickname,
    getUser,
    saveGame,
    updateUI,
    Diary,
    LeaderboardUI,
    upsertCloudSave,
    getPlayerNickname,
    setPlayerNickname,
    __IS_DEV__,
  } = deps

  // 세션 플래그: 닉네임 모달이 이미 표시되었는지 추적
  let __nicknameModalShown = false

  /**
   * 로컬 저장에서 최종 닉네임을 확인하고 반환
   * @returns {string} 닉네임 (없으면 빈 문자열)
   */
  function resolveFinalNickname() {
    try {
      const saveData = localStorage.getItem(SAVE_KEY)
      if (!saveData) return ''
      const data = JSON.parse(saveData)
      return data.nickname || ''
    } catch (error) {
      console.error('닉네임 확인 실패:', error)
      return ''
    }
  }

  /**
   * 닉네임이 없으면 모달을 열고, 세션 플래그로 중복 방지
   * 이 함수는 모든 닉네임 모달 오픈의 단일 진입점
   */
  function ensureNicknameModal() {
    // 이미 이번 세션에서 모달을 열었으면 스킵
    if (__nicknameModalShown) {
      console.log('⏭️ 닉네임 모달: 이미 이번 세션에서 표시됨')
      return
    }

    // 최종 닉네임 확인
    const finalNickname = resolveFinalNickname()
    if (finalNickname) {
      // 닉네임이 있으면 playerNickname 업데이트하고 스킵
      setPlayerNickname(finalNickname)
      return
    }

    // 닉네임이 없으면 모달 오픈
    __nicknameModalShown = true // 플래그 설정 (모달 오픈 전에 설정하여 중복 방지)

    // 닉네임 결정이 끝날 때까지 클라우드 복구를 세션 단위로 차단
    try {
      sessionStorage.setItem(CLOUD_RESTORE_BLOCK_KEY, '1')
    } catch (e) {
      console.warn('sessionStorage set 실패:', e)
    }

    setTimeout(() => {
      const handleConfirm = async nickname => {
        // 1. 로컬 유효성 검사 (새 정책: 1~6자, 공백 불허)
        const validation = validateNickname(nickname)
        if (!validation.ok) {
          let errorMessage = ''
          switch (validation.reasonKey) {
            case 'empty':
              errorMessage = t('settings.nickname.change.empty')
              break
            case 'tooShort':
              errorMessage = t('settings.nickname.change.tooShort')
              break
            case 'tooLong':
              errorMessage = t('settings.nickname.change.tooLong')
              break
            case 'invalid':
              errorMessage = t('settings.nickname.change.invalid')
              break
            case 'banned':
              errorMessage = t('settings.nickname.change.banned')
              break
            default:
              errorMessage = t('settings.nickname.change.invalid')
          }
          Modal.openInfoModal(t('modal.error.nicknameFormat.title'), errorMessage, '⚠️')
          __nicknameModalShown = false
          ensureNicknameModal()
          return
        }

        // 정규화
        const { raw: normalized, key } = normalizeNickname(nickname)

        // 2. 로그인 체크
        const user = await getUser()
        if (!user) {
          // 비로그인: 로컬만 저장
          setPlayerNickname(normalized)
          saveGame()
          Diary.addLog(t('msg.nicknameSet', { nickname: getPlayerNickname() }))
          Diary.addLog(t('settings.nickname.change.loginRequired'))

          // 클라우드 복구 차단 해제
          try {
            sessionStorage.removeItem(CLOUD_RESTORE_BLOCK_KEY)
          } catch (e) {
            console.warn('sessionStorage remove 실패:', e)
          }
          return
        }

        // 3. 로그인 상태: claimNickname 수행
        try {
          const claimResult = await claimNickname(normalized, user.id)

          if (!claimResult.success) {
            if (claimResult.error === 'taken') {
              Modal.openInfoModal(
                t('modal.error.nicknameTaken.title'),
                t('settings.nickname.change.taken'),
                '⚠️'
              )
            } else {
              Modal.openInfoModal(
                t('modal.error.nicknameFormat.title'),
                t('settings.nickname.change.claimFailed'),
                '⚠️'
              )
            }
            __nicknameModalShown = false
            ensureNicknameModal()
            return
          }

          // 성공
          setPlayerNickname(normalized)
          saveGame()
          Diary.addLog(t('msg.nicknameSet', { nickname: getPlayerNickname() }))

          // 마이그레이션 충돌 플래그 해제
          try {
            localStorage.removeItem('clicksurvivor_needsNicknameChange')
          } catch (e) {
            // 무시
          }

          // 리더보드 즉시 업데이트
          try {
            await LeaderboardUI.updateLeaderboardEntry(true)
          } catch (error) {
            console.error('리더보드 업데이트 실패:', error)
          }

          // 클라우드 복구 차단 해제
          try {
            sessionStorage.removeItem(CLOUD_RESTORE_BLOCK_KEY)
          } catch (e) {
            console.warn('sessionStorage remove 실패:', e)
          }
        } catch (error) {
          console.error('닉네임 설정 실패:', error)
          Modal.openInfoModal(
            t('modal.error.nicknameFormat.title'),
            t('settings.nickname.change.claimFailed'),
            '⚠️'
          )
          __nicknameModalShown = false
          ensureNicknameModal()
        }
      }

      Modal.openInputModal(t('modal.nickname.title'), t('modal.nickname.message'), handleConfirm, {
        icon: '✏️',
        primaryLabel: t('button.confirm'),
        placeholder: t('modal.nickname.placeholder'),
        maxLength: 6,
        defaultValue: '',
        required: true,
      })
    }, 500) // UI 로드 후 표시
  }

  /**
   * 쿨타임 체크
   * @returns {Object} { allowed: boolean, remainingSeconds?: number }
   */
  function checkNicknameCooldown() {
    try {
      const lastChangeAt = localStorage.getItem(NICKNAME_CHANGE_COOLDOWN_KEY)
      if (!lastChangeAt) {
        return { allowed: true }
      }

      const lastChangeTime = parseInt(lastChangeAt, 10)
      const now = Date.now()
      const elapsed = now - lastChangeTime

      if (elapsed >= NICKNAME_CHANGE_COOLDOWN_MS) {
        return { allowed: true }
      }

      const remaining = Math.ceil((NICKNAME_CHANGE_COOLDOWN_MS - elapsed) / 1000)
      return { allowed: false, remainingSeconds: remaining }
    } catch (e) {
      // localStorage 오류 시 허용 (쿨타임 실패해도 진행)
      return { allowed: true }
    }
  }

  /**
   * 쿨타임 저장
   */
  function saveNicknameCooldown() {
    try {
      localStorage.setItem(NICKNAME_CHANGE_COOLDOWN_KEY, String(Date.now()))
    } catch (e) {
      console.warn('쿨타임 저장 실패:', e)
    }
  }

  /**
   * 닉네임 변경 모달 열기
   */
  function openNicknameChangeModal() {
    // 쿨타임 체크
    const cooldown = checkNicknameCooldown()
    if (!cooldown.allowed) {
      Modal.openInfoModal(
        t('modal.error.nicknameLength.title'),
        t('settings.nickname.change.cooldown', { seconds: cooldown.remainingSeconds || 0 }),
        '⏱️'
      )
      return
    }

    // 현재 닉네임을 기본값으로 설정
    const currentNickname = getPlayerNickname() || ''

    Modal.openInputModal(
      t('settings.nickname.modal.title'),
      t('settings.nickname.modal.message'),
      handleNicknameChangeFromModal,
      {
        icon: '✏️',
        primaryLabel: t('settings.nickname.modal.submit'),
        secondaryLabel: t('settings.nickname.modal.cancel'),
        placeholder: t('settings.nickname.modal.placeholder'),
        maxLength: 6,
        defaultValue: currentNickname,
        required: true,
      }
    )
  }

  /**
   * 모달에서 닉네임 변경 처리
   */
  async function handleNicknameChangeFromModal(raw) {
    // 1. 로컬 유효성 검사
    const validation = validateNickname(raw)
    if (!validation.ok) {
      let errorMessage = ''
      switch (validation.reasonKey) {
        case 'empty':
          errorMessage = t('settings.nickname.change.empty')
          break
        case 'tooShort':
          errorMessage = t('settings.nickname.change.tooShort')
          break
        case 'tooLong':
          errorMessage = t('settings.nickname.change.tooLong')
          break
        case 'invalid':
          errorMessage = t('settings.nickname.change.invalid')
          break
        case 'banned':
          errorMessage = t('settings.nickname.change.banned')
          break
        default:
          errorMessage = t('settings.nickname.change.invalid')
      }
      Modal.openInfoModal(t('modal.error.nicknameFormat.title'), errorMessage, '⚠️')
      return
    }

    // 정규화
    const { raw: normalized, key } = normalizeNickname(raw)

    // 현재 닉네임과 동일하면 스킵
    const currentNormalized = normalizeNickname(getPlayerNickname() || '')
    if (key === currentNormalized.key) {
      if (__IS_DEV__) {
        console.log('[Nickname] 변경 없음: 동일한 닉네임')
      }
      return
    }

    // 1. 로그인 체크
    const user = await getUser()
    if (!user) {
      // 비로그인: 로컬만 저장, 리더보드 스킵
      const oldNickname = getPlayerNickname()
      setPlayerNickname(normalized)
      saveGame()
      updateUI()
      Diary.addLog(t('settings.nickname.change.success'))
      Diary.addLog(t('settings.nickname.change.loginRequired'))

      if (__IS_DEV__) {
        console.log(
          `[Nickname] 로컬 저장 완료 (비로그인): "${oldNickname}" → "${getPlayerNickname()}"`
        )
      }
      return
    }

    // 4. 로그인 상태: claimNickname 수행 (서버 유니크 보장)
    try {
      const claimResult = await claimNickname(normalized, user.id)

      if (!claimResult.success) {
        // 실패 처리
        if (claimResult.error === 'taken') {
          // taken 에러: 에러 모달 표시 후 입력 모달 재오픈 (재입력 가능)
          Modal.openInfoModal(
            t('modal.error.nicknameTaken.title'),
            t('settings.nickname.change.taken'),
            '⚠️'
          )
          // 에러 모달이 닫힌 후 입력 모달 재오픈 (기존 입력값 유지)
          setTimeout(() => {
            openNicknameChangeModal()
          }, 500)
        } else {
          Modal.openInfoModal(
            t('modal.error.nicknameLength.title'),
            t('settings.nickname.change.claimFailed'),
            '⚠️'
          )
        }
        return
      }

      // 성공: 닉네임 업데이트
      const oldNickname = getPlayerNickname()
      setPlayerNickname(normalized)

      // 저장
      saveGame()

      // 클라우드 저장
      try {
        const saveObj = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')
        await upsertCloudSave('seoulsurvival', saveObj)
        if (__IS_DEV__) {
          console.log('[Nickname] 클라우드 저장 완료')
        }
      } catch (error) {
        console.error('클라우드 저장 실패:', error)
      }

      // 리더보드 즉시 업데이트
      try {
        await LeaderboardUI.updateLeaderboardEntry(true) // forceImmediate: 닉네임 변경은 즉시 업데이트
      } catch (error) {
        console.error('리더보드 업데이트 실패:', error)
      }

      // 마이그레이션 충돌 플래그 해제
      try {
        localStorage.removeItem('clicksurvivor_needsNicknameChange')
        // 자동 오픈 세션 플래그도 해제
        sessionStorage.removeItem('clicksurvivor_nicknameModalAutoOpened')
      } catch (e) {
        // 무시
      }

      // 쿨타임 저장
      saveNicknameCooldown()

      // UI 업데이트
      updateUI()

      // 성공 메시지
      Diary.addLog(t('settings.nickname.change.success'))

      if (__IS_DEV__) {
        console.log(`[Nickname] 변경 완료: "${oldNickname}" → "${getPlayerNickname()}"`)
      }
    } catch (error) {
      console.error('닉네임 변경 실패:', error)
      Modal.openInfoModal(
        t('modal.error.nicknameLength.title'),
        t('settings.nickname.change.claimFailed'),
        '⚠️'
      )
    }
  }

  return {
    ensureNicknameModal,
    openNicknameChangeModal,
    handleNicknameChangeFromModal,
    checkNicknameCooldown,
    saveNicknameCooldown,
  }
}
