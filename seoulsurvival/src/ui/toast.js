/**
 * Seoul Survival - Toast Notification System
 *
 * 사용자에게 비침습적인 알림을 제공하는 토스트 시스템
 * - 에러, 성공, 정보 메시지 표시
 * - 자동 숨김 (duration)
 * - 페이드 인/아웃 애니메이션
 * - 모바일 최적화
 */

// 토스트 컨테이너 ID
const TOAST_CONTAINER_ID = 'game-toast-container'

// 토스트 타입별 기본 설정
const TOAST_CONFIG = {
  error: {
    icon: '⚠️',
    className: 'toast-error',
    bgColor: 'var(--bad)',
    duration: 4000,
  },
  success: {
    icon: '✅',
    className: 'toast-success',
    bgColor: 'var(--good)',
    duration: 3000,
  },
  info: {
    icon: 'ℹ️',
    className: 'toast-info',
    bgColor: 'var(--info)',
    duration: 3000,
  },
  warning: {
    icon: '⚠️',
    className: 'toast-warning',
    bgColor: 'var(--warning)',
    duration: 3500,
  },
}

// 토스트 활성 목록 (중복 방지용)
const activeToasts = new Set()

/**
 * 토스트 컨테이너 초기화
 * DOM에 토스트를 담을 컨테이너를 생성합니다.
 */
function ensureToastContainer() {
  let container = document.getElementById(TOAST_CONTAINER_ID)
  if (!container) {
    container = document.createElement('div')
    container.id = TOAST_CONTAINER_ID
    container.className = 'game-toast-container'
    document.body.appendChild(container)
    injectToastStyles()
  }
  return container
}

/**
 * 토스트 스타일 주입
 * CSS를 동적으로 주입하여 스타일을 적용합니다.
 */
function injectToastStyles() {
  // 이미 스타일이 주입되었는지 확인
  if (document.getElementById('toast-styles')) return

  const style = document.createElement('style')
  style.id = 'toast-styles'
  style.textContent = `
    /* 토스트 컨테이너 */
    .game-toast-container {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2100; /* 모달(2000)보다 위 */
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
      max-width: 90vw;
    }

    /* 토스트 아이템 */
    .game-toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 12px;
      background: var(--bg-panel);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
      pointer-events: auto;
      min-width: 280px;
      max-width: 450px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text);
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    /* 토스트 표시 애니메이션 */
    .game-toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    /* 토스트 숨김 애니메이션 */
    .game-toast.hide {
      opacity: 0;
      transform: translateY(20px);
    }

    /* 토스트 아이콘 */
    .game-toast-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    /* 토스트 메시지 */
    .game-toast-message {
      flex: 1;
      line-height: 1.4;
      word-break: keep-all;
      overflow-wrap: break-word;
    }

    /* 토스트 타입별 스타일 */
    .game-toast.toast-error {
      border-left: 4px solid var(--bad);
      background: linear-gradient(
        135deg,
        rgba(251, 113, 133, 0.15),
        var(--bg-panel)
      );
    }

    .game-toast.toast-success {
      border-left: 4px solid var(--good);
      background: linear-gradient(
        135deg,
        rgba(52, 211, 153, 0.15),
        var(--bg-panel)
      );
    }

    .game-toast.toast-info {
      border-left: 4px solid var(--info);
      background: linear-gradient(
        135deg,
        rgba(59, 130, 246, 0.15),
        var(--bg-panel)
      );
    }

    .game-toast.toast-warning {
      border-left: 4px solid var(--warning);
      background: linear-gradient(
        135deg,
        rgba(251, 191, 36, 0.15),
        var(--bg-panel)
      );
    }

    /* 모바일 최적화 */
    @media (max-width: 768px) {
      .game-toast-container {
        bottom: 80px; /* 모바일 탭바 위 */
        max-width: calc(100vw - 32px);
      }

      .game-toast {
        min-width: unset;
        max-width: 100%;
        font-size: 13px;
        padding: 12px 16px;
      }

      .game-toast-icon {
        font-size: 18px;
      }
    }

    /* 애니메이션 감소 모드 */
    @media (prefers-reduced-motion: reduce) {
      .game-toast {
        transition: opacity 0.15s ease;
      }

      .game-toast.show {
        transform: translateY(0);
      }

      .game-toast.hide {
        transform: translateY(0);
      }
    }
  `
  document.head.appendChild(style)
}

/**
 * 토스트 메시지 생성 및 표시
 * @param {string} message - 표시할 메시지
 * @param {string} type - 토스트 타입 ('error' | 'success' | 'info' | 'warning')
 * @param {number} duration - 표시 시간 (밀리초, 기본값: 타입별 기본값)
 * @returns {HTMLElement} 생성된 토스트 요소
 */
export function createToast(message, type = 'info', duration = null) {
  // 타입 검증
  if (!TOAST_CONFIG[type]) {
    console.warn(`[Toast] 유효하지 않은 타입: ${type}. 'info'로 대체합니다.`)
    type = 'info'
  }

  const config = TOAST_CONFIG[type]
  const finalDuration = duration ?? config.duration

  // 중복 토스트 방지 (같은 메시지가 이미 표시 중이면 무시)
  const toastKey = `${type}:${message}`
  if (activeToasts.has(toastKey)) {
    console.log('[Toast] 중복 토스트 방지:', message)
    return null
  }

  // 컨테이너 확보
  const container = ensureToastContainer()

  // 토스트 요소 생성
  const toast = document.createElement('div')
  toast.className = `game-toast ${config.className}`
  toast.setAttribute('role', 'alert')
  toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite')

  // 아이콘 추가
  const icon = document.createElement('span')
  icon.className = 'game-toast-icon'
  icon.textContent = config.icon
  icon.setAttribute('aria-hidden', 'true')
  toast.appendChild(icon)

  // 메시지 추가
  const messageEl = document.createElement('span')
  messageEl.className = 'game-toast-message'
  messageEl.textContent = message
  toast.appendChild(messageEl)

  // 컨테이너에 추가
  container.appendChild(toast)

  // 중복 방지 목록에 추가
  activeToasts.add(toastKey)

  // 페이드 인 애니메이션 (다음 프레임에 실행)
  requestAnimationFrame(() => {
    toast.classList.add('show')
  })

  // 자동 숨김 타이머
  const hideTimer = setTimeout(() => {
    hideToast(toast, toastKey)
  }, finalDuration)

  // 클릭 시 즉시 닫기
  toast.addEventListener('click', () => {
    clearTimeout(hideTimer)
    hideToast(toast, toastKey)
  })

  console.log(`[Toast] ${type.toUpperCase()}: ${message} (${finalDuration}ms)`)

  return toast
}

/**
 * 토스트 숨김 및 제거
 * @param {HTMLElement} toast - 숨길 토스트 요소
 * @param {string} toastKey - 중복 방지 키
 */
function hideToast(toast, toastKey) {
  if (!toast || !toast.parentElement) return

  // 페이드 아웃 애니메이션
  toast.classList.remove('show')
  toast.classList.add('hide')

  // 애니메이션 완료 후 DOM에서 제거
  setTimeout(() => {
    if (toast.parentElement) {
      toast.parentElement.removeChild(toast)
    }
    activeToasts.delete(toastKey)
  }, 300) // 애니메이션 시간과 일치
}

/**
 * 모든 토스트 즉시 제거 (페이지 전환 등에 사용)
 */
export function clearAllToasts() {
  const container = document.getElementById(TOAST_CONTAINER_ID)
  if (container) {
    container.innerHTML = ''
  }
  activeToasts.clear()
  console.log('[Toast] 모든 토스트 제거됨')
}

// 편의 함수 (타입별 토스트 생성)
export function toastError(message, duration) {
  return createToast(message, 'error', duration)
}

export function toastSuccess(message, duration) {
  return createToast(message, 'success', duration)
}

export function toastInfo(message, duration) {
  return createToast(message, 'info', duration)
}

export function toastWarning(message, duration) {
  return createToast(message, 'warning', duration)
}

// 테스트용 함수 (개발 모드에서만 사용)
export function testToasts() {
  console.log('[Toast] 테스트 시작...')

  toastInfo('정보 토스트입니다.')
  setTimeout(() => toastSuccess('성공 토스트입니다.'), 500)
  setTimeout(() => toastWarning('경고 토스트입니다.'), 1000)
  setTimeout(() => toastError('에러 토스트입니다.'), 1500)

  console.log('[Toast] 테스트 완료')
}
