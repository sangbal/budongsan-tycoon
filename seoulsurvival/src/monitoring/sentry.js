// Sentry 에러 트래킹 초기화
import * as Sentry from '@sentry/browser'

/**
 * Sentry 초기화
 * 프로덕션 환경에서만 호출되어야 함
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN

  if (!dsn) {
    console.warn('Sentry DSN이 설정되지 않았습니다. .env.local에 VITE_SENTRY_DSN을 추가하세요.')
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE, // 'production' | 'development'
    release: `seoul-survival@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,

    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% 트랜잭션 샘플링

    // Session Replay (선택적)
    replaysSessionSampleRate: 0.1, // 10% 세션 기록
    replaysOnErrorSampleRate: 1.0, // 에러 발생 시 100% 기록

    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', 'clicksurvivor.com', /\.supabase\.co/],
      }),
      new Sentry.Replay(),
    ],

    beforeSend(event, hint) {
      // 민감 정보 필터링
      if (event.request) {
        delete event.request.cookies
      }

      // 개발 환경에서는 콘솔에만 출력
      if (import.meta.env.DEV) {
        console.error('Sentry would send:', event, hint)
        return null // 실제로는 전송하지 않음
      }

      return event
    },
  })

  // 사용자 정보 설정 (닉네임으로)
  const nickname = localStorage.getItem('clicksurvivor-nickname')
  if (nickname) {
    Sentry.setUser({ username: nickname })
  }

  console.log('✅ Sentry 초기화 완료')
}

/**
 * 에러를 Sentry에 전송
 * @param {Error} error - 에러 객체
 * @param {Object} context - 추가 컨텍스트 정보
 */
export function captureError(error, context = {}) {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      tags: context.tags || {},
      level: context.level || 'error',
      extra: context.extra || {},
    })
  }

  console.error('[Error]', error, context)
}

/**
 * 사용자 정보 업데이트
 * @param {string} nickname - 닉네임
 */
export function setUserContext(nickname) {
  if (import.meta.env.PROD && nickname) {
    Sentry.setUser({ username: nickname })
  }
}
