/**
 * saveLoad.js
 * 게임 저장/로드 모듈 (Factory 패턴)
 *
 * 책임:
 * - 게임 데이터 저장 (localStorage)
 * - 게임 데이터 로드
 * - 저장 내보내기/가져오기
 * - 게임 초기화 (수동 프레스티지)
 * - 저장 상태 UI 업데이트
 */

// 리더보드 업데이트 쓰로틀링 (모듈 스코프)
let _lastLeaderboardUpdate = 0

/**
 * 저장/로드 매니저 팩토리 함수
 *
 * @param {Object} deps - 의존성 객체
 * @param {string} deps.SAVE_KEY - localStorage 저장 키
 * @param {Object} deps.gameVars - 게임 전역 변수 참조 (getter/setter)
 * @param {Object} deps.UPGRADES - 업그레이드 객체
 * @param {Array} deps.ACHIEVEMENTS - 업적 배열
 * @param {Function} deps.reapplyIncomeTableAffectingUpgradeEffects - 업그레이드 효과 재적용 함수
 * @param {Function} deps.updateAutoWorkUI - 자동 업무 UI 업데이트 함수
 * @param {Function} deps.updateSaveStatus - 저장 상태 UI 업데이트 함수
 * @param {Function} deps.performAutoPrestige - 자동 프레스티지 함수
 * @param {Function} deps.t - 다국어 번역 함수
 * @param {Function} deps.getLang - 언어 가져오기 함수
 * @param {Object} deps.Modal - 모달 객체
 * @param {Object} deps.Diary - 일기 객체
 * @param {Object} deps.LeaderboardUI - 리더보드 UI 객체
 * @param {Function} deps.upsertCloudSave - 클라우드 저장 함수
 * @param {Object} deps.cloudState - 클라우드 상태 객체 (__currentUser, __cloudPendingSave, __lastCloudUploadedSaveTs)
 * @param {boolean} deps.__IS_DEV__ - 개발 모드 플래그
 * @param {Function} deps.calculateCP - CP 계산 함수 (기존 유저 마이그레이션용)
 *
 * @returns {Object} 저장/로드 함수들
 */
export function createSaveLoadManager(deps) {
  const {
    SAVE_KEY,
    gameVars,
    UPGRADES,
    ACHIEVEMENTS,
    reapplyIncomeTableAffectingUpgradeEffects,
    updateAutoWorkUI,
    updateSaveStatus,
    performAutoPrestige,
    t,
    getLang,
    Modal,
    Diary,
    LeaderboardUI,
    upsertCloudSave,
    cloudState,
    __IS_DEV__,
    calculateCP,
  } = deps

  // 저장 실패 카운터 및 재시도 설정
  let __saveFailCount = 0
  let __saveWarningShown = false
  const MAX_RETRY_ATTEMPTS = 3
  const RETRY_DELAYS = [1000, 2000, 4000] // 지수 백오프 (1초, 2초, 4초)

  /**
   * 게임 데이터 저장 함수 (재시도 메커니즘 포함)
   * @param {number} retryCount - 현재 재시도 횟수 (내부용)
   */
  function saveGame(retryCount = 0) {
    const saveData = {
      cash: gameVars.cash,
      totalClicks: gameVars.totalClicks,
      totalLaborIncome: gameVars.totalLaborIncome,
      careerLevel: gameVars.careerLevel,
      clickMultiplier: gameVars.clickMultiplier,
      rentMultiplier: gameVars.rentMultiplier,
      autoClickEnabled: gameVars.autoClickEnabled,
      managerLevel: gameVars.managerLevel,
      rentCost: gameVars.rentCost,
      mgrCost: gameVars.mgrCost,
      // 금융상품
      deposits: gameVars.deposits,
      savings: gameVars.savings,
      bonds: gameVars.bonds,
      usStocks: gameVars.usStocks,
      cryptos: gameVars.cryptos,
      // 금융상품 누적 생산량
      depositsLifetime: gameVars.depositsLifetime,
      savingsLifetime: gameVars.savingsLifetime,
      bondsLifetime: gameVars.bondsLifetime,
      usStocksLifetime: gameVars.usStocksLifetime,
      cryptosLifetime: gameVars.cryptosLifetime,
      // 부동산
      villas: gameVars.villas,
      officetels: gameVars.officetels,
      apartments: gameVars.apartments,
      shops: gameVars.shops,
      buildings: gameVars.buildings,
      towers_run: gameVars.towers_run,
      towers_lifetime: gameVars.towers_lifetime,
      // CP 시스템 (경력 포인트)
      careerPoints: gameVars.careerPoints,
      totalCareerPoints: gameVars.totalCareerPoints,
      purchasedUpgrades: gameVars.purchasedUpgrades,
      permanentSlots: gameVars.permanentSlots,
      lifetimeEarnings: gameVars.lifetimeEarnings,
      // 부동산 누적 생산량
      villasLifetime: gameVars.villasLifetime,
      officetelsLifetime: gameVars.officetelsLifetime,
      apartmentsLifetime: gameVars.apartmentsLifetime,
      shopsLifetime: gameVars.shopsLifetime,
      buildingsLifetime: gameVars.buildingsLifetime,
      // 업그레이드 (새 Cookie Clicker 스타일)
      upgradesV2: Object.fromEntries(
        Object.entries(UPGRADES).map(([id, upgrade]) => [
          id,
          { unlocked: upgrade.unlocked, purchased: upgrade.purchased },
        ])
      ),
      // 시장 이벤트
      marketMultiplier: gameVars.marketMultiplier,
      marketEventEndTime: gameVars.marketEventEndTime,
      // 업적
      achievements: ACHIEVEMENTS,
      // 저장 시간
      saveTime: new Date().toISOString(),
      ts: Date.now(),
      // 게임 시작 시간 (호환성 유지)
      gameStartTime: gameVars.gameStartTime,
      // 누적 플레이시간 시스템
      totalPlayTime: gameVars.totalPlayTime,
      sessionStartTime: gameVars.sessionStartTime,
      // 닉네임 (리더보드용)
      nickname: gameVars.playerNickname,
      // 추천 시스템
      referralBonusApplied: gameVars.referralBonusApplied,
      referralCode: gameVars.referralCode,
    }

    // 디버깅: 닉네임 저장 확인
    if (__IS_DEV__) {
      console.log('💾 저장 데이터에 포함된 닉네임:', gameVars.playerNickname || '(없음)')
      console.log('💾 saveData.nickname:', saveData.nickname)
    }

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
      gameVars.lastSaveTime = new Date()
      updateSaveStatus() // 저장 상태 UI 업데이트

      // 성공 시 실패 카운터 초기화
      __saveFailCount = 0

      // 로그인 사용자면 탭 숨김/닫기 시 플러시를 위해 대기 중인 저장으로 설정
      if (cloudState.__currentUser) {
        const saveTs = Number(saveData?.ts || 0) || 0
        if (saveTs && saveTs > cloudState.__lastCloudUploadedSaveTs) {
          cloudState.__cloudPendingSave = saveData
          // 디버깅: 클라우드 저장 대기 중인 데이터 확인
          if (__IS_DEV__) {
            console.log(
              '☁️ 클라우드 저장 대기 중인 데이터에 닉네임 포함:',
              cloudState.__cloudPendingSave.nickname || '(없음)'
            )
          }
        }
      }

      // 리더보드 업데이트 (닉네임이 있을 때만, 30초마다)
      if (
        gameVars.playerNickname &&
        (!_lastLeaderboardUpdate || Date.now() - _lastLeaderboardUpdate > 30000)
      ) {
        LeaderboardUI.updateLeaderboardEntry()
        _lastLeaderboardUpdate = Date.now()
      }
    } catch (error) {
      console.error(`게임 저장 실패 (시도 ${retryCount + 1}/${MAX_RETRY_ATTEMPTS}):`, error)

      // 재시도 로직 (최대 3회)
      if (retryCount < MAX_RETRY_ATTEMPTS - 1) {
        const delay = RETRY_DELAYS[retryCount]
        if (__IS_DEV__) {
          console.log(`⏳ ${delay}ms 후 재시도...`)
        }
        setTimeout(() => {
          saveGame(retryCount + 1)
        }, delay)
        return
      }

      // 최종 실패: 사용자에게 경고
      __saveFailCount = (__saveFailCount || 0) + 1
      if (__saveFailCount >= 3) {
        // 3회 이상 연속 실패 시 경고 표시
        showSaveWarning(error)
        __saveFailCount = 0 // 경고 후 카운트 리셋
      }
    }
  }

  /**
   * 저장 실패 경고 표시 (연속 실패 시)
   * @param {Error} error - 에러 객체 (선택사항)
   */
  function showSaveWarning(error) {
    if (__saveWarningShown) return // 이미 경고 표시 중이면 스킵
    __saveWarningShown = true

    // 에러 원인 분석 (저장 공간 부족 vs 기타)
    const isQuotaExceeded =
      error?.name === 'QuotaExceededError' ||
      error?.message?.includes('quota') ||
      error?.message?.includes('storage')

    const message = isQuotaExceeded
      ? t('error.quotaExceeded') || '저장 공간이 부족합니다. 브라우저 데이터를 정리해주세요.'
      : t('error.saveFailed') || '게임 저장에 실패했습니다. 저장 공간을 확인해주세요.'

    // Toast 시스템 사용 (window.toast가 있으면)
    if (typeof window.toast?.error === 'function') {
      window.toast.error(message, 5000)
      // 5초 후 플래그 리셋
      setTimeout(() => {
        __saveWarningShown = false
      }, 5000)
    } else {
      // 폴백: 기존 방식 (토스트가 아직 로드되지 않은 경우)
      console.error('[Save Warning]', message)
      alert(message)
      __saveWarningShown = false
    }
  }

  /**
   * 숫자 타입 검증 헬퍼 함수
   * @param {*} val - 검증할 값
   * @param {number} defaultVal - 기본값
   * @returns {number} 유효한 숫자 또는 기본값
   */
  function toNumber(val, defaultVal) {
    return typeof val === 'number' && !Number.isNaN(val) ? val : defaultVal
  }

  /**
   * 게임 데이터 불러오기 함수
   * @returns {boolean} 성공 여부
   */
  function loadGame() {
    try {
      const saveData = localStorage.getItem(SAVE_KEY)
      if (!saveData) {
        console.log('저장된 게임 데이터가 없습니다.')
        // 새 게임 시작 시 누적 플레이시간 초기화
        gameVars.totalPlayTime = 0
        gameVars.sessionStartTime = Date.now()
        return false
      }

      const data = JSON.parse(saveData)

      // 게임 상태 복원 (타입 검증 포함)
      gameVars.cash = toNumber(data.cash, 0)
      gameVars.totalClicks = toNumber(data.totalClicks, 0)
      gameVars.totalLaborIncome = toNumber(data.totalLaborIncome, 0)
      gameVars.careerLevel = toNumber(data.careerLevel, 0)
      gameVars.clickMultiplier = toNumber(data.clickMultiplier, 1)
      gameVars.rentMultiplier = toNumber(data.rentMultiplier, 1)
      gameVars.autoClickEnabled = data.autoClickEnabled || false
      gameVars.managerLevel = toNumber(data.managerLevel, 0)
      gameVars.rentCost = toNumber(data.rentCost, 1000000000)
      gameVars.mgrCost = toNumber(data.mgrCost, 5000000000)

      // 오토 업무 처리 UI 동기화
      updateAutoWorkUI()

      // 금융상품 복원
      gameVars.deposits = toNumber(data.deposits, 0)
      gameVars.savings = toNumber(data.savings, 0)
      gameVars.bonds = toNumber(data.bonds, 0)
      gameVars.usStocks = toNumber(data.usStocks, 0)
      gameVars.cryptos = toNumber(data.cryptos, 0)

      // 금융상품 누적 생산량 복원
      gameVars.depositsLifetime = toNumber(data.depositsLifetime, 0)
      gameVars.savingsLifetime = toNumber(data.savingsLifetime, 0)
      gameVars.bondsLifetime = toNumber(data.bondsLifetime, 0)
      gameVars.usStocksLifetime = toNumber(data.usStocksLifetime, 0)
      gameVars.cryptosLifetime = toNumber(data.cryptosLifetime, 0)

      // 부동산 복원
      gameVars.villas = toNumber(data.villas, 0)
      gameVars.officetels = toNumber(data.officetels, 0)
      gameVars.apartments = toNumber(data.apartments, 0)
      gameVars.shops = toNumber(data.shops, 0)
      gameVars.buildings = toNumber(data.buildings, 0)
      gameVars.towers_run = toNumber(data.towers_run, 0)
      gameVars.towers_lifetime = toNumber(data.towers_lifetime, toNumber(data.towers, 0)) // 마이그레이션: 기존 towers를 lifetime으로

      // CP 시스템 (경력 포인트) 복원
      gameVars.careerPoints = toNumber(data.careerPoints, 0)
      gameVars.totalCareerPoints = toNumber(data.totalCareerPoints, 0)
      gameVars.purchasedUpgrades = data.purchasedUpgrades || []
      gameVars.permanentSlots = data.permanentSlots || []
      gameVars.lifetimeEarnings = toNumber(data.lifetimeEarnings, 0)

      // 기존 유저 CP 마이그레이션: towers_lifetime > 0인데 CP가 없으면 소급 지급
      if (gameVars.towers_lifetime > 0 && !data.careerPoints && !data.totalCareerPoints) {
        const legacyCP = calculateCP(gameVars.towers_lifetime, gameVars.lifetimeEarnings || 0)
        gameVars.careerPoints = legacyCP
        gameVars.totalCareerPoints = legacyCP
        console.log(
          `🎁 기존 유저 CP 마이그레이션: +${legacyCP} CP (타워: ${gameVars.towers_lifetime})`
        )
      }

      // 부동산 누적 생산량 복원
      gameVars.villasLifetime = toNumber(data.villasLifetime, 0)
      gameVars.officetelsLifetime = toNumber(data.officetelsLifetime, 0)
      gameVars.apartmentsLifetime = toNumber(data.apartmentsLifetime, 0)
      gameVars.shopsLifetime = toNumber(data.shopsLifetime, 0)
      gameVars.buildingsLifetime = toNumber(data.buildingsLifetime, 0)

      // 업그레이드 복원 (새 Cookie Clicker 스타일)
      if (data.upgradesV2) {
        for (const [id, state] of Object.entries(data.upgradesV2)) {
          if (UPGRADES[id]) {
            UPGRADES[id].unlocked = state.unlocked
            UPGRADES[id].purchased = state.purchased

            // 효과 재적용 제거: clickMultiplier 등은 이미 저장된 값으로 복원되므로 중복 적용 불필요
            // 중복 적용 시 새로고침할 때마다 배수가 계속 곱해지는 버그 발생
          }
        }
      }

      // (버그픽스) 수익 테이블(FINANCIAL_INCOME/BASE_RENT)에만 영향을 주는 업그레이드 효과는
      // 저장값으로 복원되지 않으므로, 기본값으로 리셋 후 1회 재적용하여 재접속 시 수익이 줄어드는 문제를 방지한다.
      reapplyIncomeTableAffectingUpgradeEffects(UPGRADES)

      // 시장 이벤트 복원
      gameVars.marketMultiplier = toNumber(data.marketMultiplier, 1)
      gameVars.marketEventEndTime = toNumber(data.marketEventEndTime, 0)

      // 업적 복원
      if (data.achievements) {
        ACHIEVEMENTS.forEach((achievement, index) => {
          if (data.achievements[index]) {
            achievement.unlocked = data.achievements[index].unlocked
          }
        })
      }

      // 게임 시작 시간 복원 (호환성 유지)
      if (data.gameStartTime) {
        gameVars.gameStartTime = data.gameStartTime
      }

      // 누적 플레이시간 시스템 복원
      gameVars.totalPlayTime = toNumber(data.totalPlayTime, 0)
      // 닉네임 복원
      gameVars.playerNickname = data.nickname || ''
      // 추천 시스템 복원 (마이그레이션: 기존 세이브 호환성)
      gameVars.referralBonusApplied = data.referralBonusApplied ?? false
      gameVars.referralCode = data.referralCode ?? null
      // 새 세션 시작 (이전 세션 시간은 이미 저장 시 totalPlayTime에 포함되어 있음)
      gameVars.sessionStartTime = Date.now()

      return true
    } catch (error) {
      console.error('게임 불러오기 실패:', error)
      return false
    }
  }

  /**
   * 게임 초기화 함수 (A안: 수동 프레스티지 - 런 상태만 초기화, 누적 데이터 유지)
   */
  function resetGame() {
    console.log('🔄 resetGame function called (A안: 수동 프레스티지)') // 디버깅용

    Modal.openConfirmModal(
      t('modal.confirm.reset.title'),
      t('modal.confirm.reset.message'),
      () => {
        // 모달이 완전히 닫힌 후 프레스티지 실행 (DOM 안정화 대기)
        setTimeout(async () => {
          try {
            // 초기화 진행 메시지 (diary가 초기화되었을 때만 로그)
            if (typeof Diary.addLog === 'function') {
              Diary.addLog(t('msg.gameReset'))
            }
            console.log('✅ User confirmed reset (A안: 수동 프레스티지)') // 디버깅용

            // A안: performAutoPrestige() 호출로 런 상태만 초기화
            // - towers_lifetime, totalPlayTime 등 누적 데이터는 유지됨
            // - 닉네임도 유지됨 (performAutoPrestige에서 건드리지 않음)
            await performAutoPrestige('settings')

            if (__IS_DEV__) {
              console.log('✅ 수동 프레스티지 완료 (누적 데이터 유지)')
            }
          } catch (error) {
            console.error('❌ Error in resetGame:', error)
            console.error('에러 스택:', error.stack)
            // 실제 치명적 오류만 사용자에게 알림
            Modal.openInfoModal(
              t('modal.error.resetError.title'),
              t('modal.error.resetError.message'),
              '⚠️'
            )
          }
        }, 100) // 모달 닫힘 애니메이션 대기
      },
      {
        icon: '🔄',
        primaryLabel: t('modal.confirm.reset.primaryLabel'),
        secondaryLabel: t('button.cancel'),
      }
    )
  }

  /**
   * 저장 내보내기 함수
   */
  function exportSave() {
    try {
      const saveData = localStorage.getItem(SAVE_KEY)
      if (!saveData) {
        alert(t('modal.error.noSaveData.message'))
        return
      }

      const blob = new Blob([saveData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `capital-clicker-save-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      Diary.addLog(t('msg.saveExported'))
    } catch (error) {
      console.error('저장 내보내기 실패:', error)
      alert(t('error.saveExport'))
    }
  }

  /**
   * 저장 가져오기 함수
   */
  function importSave(file) {
    try {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const saveData = JSON.parse(e.target.result)
          localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
          Diary.addLog(t('msg.saveImported'))
          setTimeout(() => {
            location.reload()
          }, 1000)
        } catch (error) {
          console.error('저장 파일 파싱 실패:', error)
          alert(t('error.saveImportFormat'))
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error('저장 가져오기 실패:', error)
      alert(t('error.saveImport'))
    }
  }

  /**
   * 완전 초기화 - 모든 데이터 삭제 (누적 기록 포함)
   */
  function hardResetGame() {
    Modal.openConfirmModal(
      t('modal.confirm.hardReset.title', {}, '완전 초기화'),
      t(
        'modal.confirm.hardReset.message',
        {},
        '정말로 모든 데이터를 삭제하시겠습니까?\n\n누적 타워, 경력 포인트, 플레이 시간 등 모든 진행 상황이 영구적으로 삭제됩니다.\n\n이 작업은 되돌릴 수 없습니다.'
      ),
      () => {
        // LocalStorage 완전 삭제
        localStorage.removeItem(SAVE_KEY)

        // 업적 초기화
        for (const ach of ACHIEVEMENTS) {
          ach.unlocked = false
        }

        // 페이지 새로고침으로 완전 초기 상태
        window.location.reload()
      },
      {
        icon: '💀',
        primaryLabel: t('modal.confirm.hardReset.primaryLabel', {}, '완전 초기화'),
        secondaryLabel: t('button.cancel'),
      }
    )
  }

  return {
    saveGame,
    loadGame,
    resetGame,
    hardResetGame,
    exportSave,
    importSave,
  }
}
