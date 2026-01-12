// 게임 에러 바운더리
import { captureError } from '../monitoring/sentry.js'
import * as Modal from '../ui/modal.js'

/**
 * 게임 에러 처리
 * @param {Error} error - 에러 객체
 * @param {string} context - 에러 발생 컨텍스트
 * @param {boolean} showModal - 사용자에게 모달 표시 여부
 */
function handleGameError(error, context = 'Unknown', showModal = true) {
  console.error(`[${context}] Error:`, error)

  // Sentry에 에러 전송 (프로덕션에서만)
  captureError(error, {
    tags: { context },
    level: 'error',
  })

  // 사용자에게 에러 알림 (치명적인 경우만)
  if (showModal) {
    Modal.openConfirmModal(
      t('modal.error.gameError.title') || '오류 발생',
      t('modal.error.gameError.message') ||
        `게임 실행 중 오류가 발생했습니다.\n${error.message}\n\n페이지를 새로고침 하시겠습니까?`,
      () => {
        window.location.reload()
      },
      {
        primaryLabel: t('ui.refresh') || '새로고침',
        secondaryLabel: t('ui.close') || '닫기',
      }
    )
  }
}

/**
 * 함수를 에러 바운더리로 래핑
 * @param {Function} fn - 래핑할 함수
 * @param {string} context - 컨텍스트 이름
 * @param {boolean} showModal - 에러 시 모달 표시 여부
 * @returns {Function} 래핑된 함수
 */
export function wrapFunction(fn, context, showModal = true) {
  return function (...args) {
    try {
      const result = fn.apply(this, args)

      // Promise 반환하는 경우 catch 추가
      if (result && typeof result.catch === 'function') {
        return result.catch(error => {
          handleGameError(error, context, showModal)
          throw error
        })
      }

      return result
    } catch (error) {
      handleGameError(error, context, showModal)
      throw error
    }
  }
}

/**
 * 에러 바운더리 설정
 * - 전역 에러 핸들러 등록
 * - 주요 게임 함수 래핑
 */
export function setupErrorBoundary() {
  // 전역 에러 핸들러 (동기 에러)
  window.addEventListener('error', event => {
    event.preventDefault() // 기본 에러 표시 방지

    console.error('Global error:', event.error)
    captureError(event.error || new Error(event.message), {
      tags: { context: 'Global Error' },
      level: 'error',
      extra: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    })

    // 치명적인 에러가 아니면 모달 표시하지 않음
    // (사용자 경험을 방해하지 않기 위해)
  })

  // 전역 Promise 거부 핸들러 (비동기 에러)
  window.addEventListener('unhandledrejection', event => {
    event.preventDefault() // 기본 에러 표시 방지

    console.error('Unhandled promise rejection:', event.reason)
    captureError(event.reason || new Error('Unhandled Promise Rejection'), {
      tags: { context: 'Promise Rejection' },
      level: 'error',
      extra: {
        promise: event.promise,
      },
    })
  })

  // 게임 저장 함수 래핑 (에러가 발생해도 게임이 중단되지 않도록)
  if (typeof window.saveGame === 'function') {
    const originalSaveGame = window.saveGame
    window.saveGame = function (...args) {
      try {
        return originalSaveGame.apply(this, args)
      } catch (error) {
        console.error('[Save Game] Error:', error)
        captureError(error, {
          tags: { context: 'Save Game' },
          level: 'warning', // 저장 실패는 경고 수준
        })
        // 저장 실패는 치명적이지 않으므로 에러를 삼킴
      }
    }
  }

  // 클라우드 저장 함수 래핑
  if (typeof window.cloudSave === 'function') {
    const originalCloudSave = window.cloudSave
    window.cloudSave = function (...args) {
      try {
        const result = originalCloudSave.apply(this, args)

        // Promise인 경우 catch 추가
        if (result && typeof result.catch === 'function') {
          return result.catch(error => {
            console.error('[Cloud Save] Error:', error)
            captureError(error, {
              tags: { context: 'Cloud Save' },
              level: 'warning',
            })
            // 클라우드 저장 실패는 치명적이지 않음
          })
        }

        return result
      } catch (error) {
        console.error('[Cloud Save] Error:', error)
        captureError(error, {
          tags: { context: 'Cloud Save' },
          level: 'warning',
        })
      }
    }
  }

  console.log('✅ 에러 바운더리 설정 완료')
}

/**
 * 수동으로 에러 기록 (디버깅용)
 * @param {string} message - 에러 메시지
 * @param {Object} context - 추가 컨텍스트
 */
export function logError(message, context = {}) {
  const error = new Error(message)
  captureError(error, {
    tags: context.tags || {},
    level: context.level || 'info',
    extra: context.extra || {},
  })
}

// t() 함수를 import하면 순환 참조가 발생할 수 있으므로
// 간단한 폴백 함수 정의
function t(key) {
  // i18n이 로드되지 않은 경우를 대비한 폴백
  if (typeof window.t === 'function') {
    return window.t(key)
  }
  return key
}
