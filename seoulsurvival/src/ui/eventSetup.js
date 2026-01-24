/**
 * eventSetup.js - 이벤트 리스너 통합 모듈
 * main.js에서 분산된 이벤트 리스너들을 중앙 관리
 */

/**
 * 구매 모드 버튼 설정 (구매/판매)
 * @param {Object} deps - 의존성 객체
 */
export function setupPurchaseModeButtons(deps) {
  const { elBuyMode, elSellMode, gameState, updateUI } = deps

  const setupModeBtn = (btn, mode, other) => {
    btn?.addEventListener('click', () => {
      gameState.purchaseMode = mode
      btn.classList.add('active')
      other?.classList.remove('active')
      updateUI()
    })
  }

  setupModeBtn(elBuyMode, 'buy', elSellMode)
  setupModeBtn(elSellMode, 'sell', elBuyMode)
}

/**
 * 구매 수량 버튼 설정 (1/5/10)
 * @param {Object} deps - 의존성 객체
 */
export function setupPurchaseQuantityButtons(deps) {
  const { elQty1, elQty5, elQty10, gameState, updateUI } = deps

  const setupQtyBtn = (btn, qty, others) => {
    btn?.addEventListener('click', () => {
      gameState.purchaseQuantity = qty
      btn.classList.add('active')
      others.forEach(o => o?.classList.remove('active'))
      updateUI()
    })
  }

  setupQtyBtn(elQty1, 1, [elQty5, elQty10])
  setupQtyBtn(elQty5, 5, [elQty1, elQty10])
  setupQtyBtn(elQty10, 10, [elQty1, elQty5])
}

/**
 * 작업(노동) 클릭 핸들러 설정
 * @param {Object} deps - 의존성 객체
 */
export function setupWorkClickHandler(deps) {
  const { elWork, workSystem } = deps

  // pointerdown으로 변경: 터치 즉시 반응하여 빠른 연타 인식률 개선
  elWork?.addEventListener('pointerdown', e => {
    // 마우스 우클릭/중간버튼 무시
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (workSystem) {
      workSystem.handleWorkAction(e.clientX, e.clientY)
    }
  })
}

/**
 * 설정 탭 버튼 설정 (내보내기/불러오기)
 * @param {Object} deps - 의존성 객체
 */
export function setupSettingsTabButtons(deps) {
  const { saveLoadManager } = deps

  const elExportSaveBtn = document.getElementById('exportSaveBtn')
  const elImportSaveBtn = document.getElementById('importSaveBtn')
  const elImportFileInput = document.getElementById('importFileInput')

  if (elExportSaveBtn) {
    elExportSaveBtn.addEventListener('click', () => saveLoadManager.exportSave())
  }

  if (elImportSaveBtn) {
    elImportSaveBtn.addEventListener('click', () => {
      if (elImportFileInput) {
        elImportFileInput.click()
      }
    })
  }

  if (elImportFileInput) {
    elImportFileInput.addEventListener('change', e => {
      const file = e.target.files[0]
      if (file) {
        saveLoadManager.importSave(file)
      }
    })
  }
}

/**
 * 클라우드 저장 버튼 설정
 * @param {Object} deps - 의존성 객체
 */
export function setupCloudSaveButtons(deps) {
  const { cloudSyncManager } = deps

  const elCloudUploadBtn = document.getElementById('cloudUploadBtn')
  const elCloudDownloadBtn = document.getElementById('cloudDownloadBtn')

  if (elCloudUploadBtn) {
    elCloudUploadBtn.addEventListener('click', cloudSyncManager.cloudUpload)
  }
  if (elCloudDownloadBtn) {
    elCloudDownloadBtn.addEventListener('click', cloudSyncManager.cloudDownload)
  }
}

/**
 * 리셋 버튼 설정
 * @param {Object} deps - 의존성 객체
 */
export function setupResetButtons(deps) {
  const { elResetBtn, saveLoadManager } = deps

  if (elResetBtn) {
    elResetBtn.addEventListener('click', () => saveLoadManager.resetGame())
  }

  const elResetBtnSettings = document.getElementById('resetBtnSettings')
  if (elResetBtnSettings) {
    elResetBtnSettings.addEventListener('click', () => saveLoadManager.resetGame())
  }
}

/**
 * 토글 스위치 설정 (설정 탭)
 * @param {Object} deps - 의존성 객체
 */
export function setupToggleSwitches(deps) {
  const { settings, saveSettings, updateUI } = deps

  const elToggleParticles = document.getElementById('toggleParticles')
  const elToggleFancyGraphics = document.getElementById('toggleFancyGraphics')
  const elToggleShortNumbers = document.getElementById('toggleShortNumbers')

  const setupToggle = (el, key, afterChange) => {
    if (el) {
      el.addEventListener('change', e => {
        settings[key] = e.target.checked
        saveSettings()
        afterChange?.()
      })
    }
  }

  setupToggle(elToggleParticles, 'particles')
  setupToggle(elToggleFancyGraphics, 'fancyGraphics')
  setupToggle(elToggleShortNumbers, 'shortNumbers', updateUI)
}

/**
 * 닉네임 변경 버튼 설정
 * @param {Object} deps - 의존성 객체
 */
export function setupNicknameButtons(deps) {
  const { nicknameManager } = deps

  const nicknameChangeBtn = document.getElementById('nicknameChangeBtn')
  const nicknameConflictChangeBtn = document.getElementById('nicknameConflictChangeBtn')

  if (nicknameChangeBtn) {
    nicknameChangeBtn.addEventListener('click', () => nicknameManager.openNicknameChangeModal())
  }

  if (nicknameConflictChangeBtn) {
    nicknameConflictChangeBtn.addEventListener('click', () =>
      nicknameManager.openNicknameChangeModal()
    )
  }
}

/**
 * iOS 제스처 이벤트 방지 (더블탭/핀치 확대 방지)
 */
export function setupGesturePreventions() {
  try {
    const prevent = e => e.preventDefault()
    document.addEventListener('gesturestart', prevent, { passive: false })
    document.addEventListener('gesturechange', prevent, { passive: false })
    document.addEventListener('gestureend', prevent, { passive: false })
  } catch {
    // 브라우저가 해당 이벤트를 지원하지 않아도 무시
  }
}

/**
 * 모든 이벤트 리스너 설정 (통합 진입점)
 * @param {Object} deps - 의존성 객체
 */
export function setupAllEventListeners(deps) {
  const {
    // DOM elements
    elBuyMode,
    elSellMode,
    elQty1,
    elQty5,
    elQty10,
    elWork,
    elResetBtn,
    // State
    gameState,
    settings,
    // Modules
    workSystem,
    saveLoadManager,
    cloudSyncManager,
    nicknameManager,
    // Functions
    updateUI,
    saveSettings,
  } = deps

  // 구매 모드/수량 버튼
  setupPurchaseModeButtons({ elBuyMode, elSellMode, gameState, updateUI })
  setupPurchaseQuantityButtons({ elQty1, elQty5, elQty10, gameState, updateUI })

  // 작업 클릭 핸들러
  setupWorkClickHandler({ elWork, workSystem })

  // 리셋 버튼
  setupResetButtons({ elResetBtn, saveLoadManager })

  // 설정 탭 버튼
  setupSettingsTabButtons({ saveLoadManager })

  // 클라우드 저장 버튼
  if (cloudSyncManager) {
    setupCloudSaveButtons({ cloudSyncManager })
  }

  // 토글 스위치
  setupToggleSwitches({ settings, saveSettings, updateUI })

  // 닉네임 버튼
  if (nicknameManager) {
    setupNicknameButtons({ nicknameManager })
  }

  // iOS 제스처 방지
  setupGesturePreventions()
}
