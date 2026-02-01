import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// package.json에서 버전 읽기
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

// ClickSurvivor Hub 멀티페이지 구성
export default defineConfig({
  base: './',
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        account: resolve(__dirname, 'account/index.html'),
        'account-profile': resolve(__dirname, 'account/profile/index.html'),
        'account-connected': resolve(__dirname, 'account/connected/index.html'),
        'account-security': resolve(__dirname, 'account/security/index.html'),
        'account-delete': resolve(__dirname, 'account/delete/index.html'),
        'auth-callback': resolve(__dirname, 'auth/callback/index.html'),
        terms: resolve(__dirname, 'terms.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        'games-seoulsurvival': resolve(__dirname, 'games/seoulsurvival/index.html'),
        'games-seoulsurvival-patchnotes': resolve(
          __dirname,
          'games/seoulsurvival/patch-notes/index.html'
        ),
        seoulsurvival: resolve(__dirname, 'seoulsurvival/index.html'),
        'kimchi-invasion': resolve(__dirname, 'kimchi-invasion/index.html'),
      },
      output: {
        manualChunks(id) {
          // Vendor chunk 분리: node_modules 라이브러리
          if (id.includes('node_modules')) {
            // Sentry 모니터링 (선택적 로드)
            if (id.includes('@sentry')) {
              return 'vendor-sentry'
            }
            // React 생태계 - kimchi-invasion 전용
            // seoulsurvival 로드 시 다운로드하지 않음
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('scheduler') ||
              id.includes('zustand')
            ) {
              return 'vendor-react'
            }
            // PixiJS - kimchi-invasion 전용
            // seoulsurvival 로드 시 다운로드하지 않음
            if (id.includes('pixi')) {
              return 'vendor-pixi'
            }
            return 'vendor-common'
          }

          // Seoul Survival 게임별 코드 분리
          if (id.includes('seoulsurvival/src')) {
            // 번역 파일 - 각 언어별로 분리 (동적 로드)
            if (id.includes('i18n/translations/ko')) {
              return 'seoulsurvival-i18n-ko'
            }
            if (id.includes('i18n/translations/en')) {
              return 'seoulsurvival-i18n-en'
            }
            // 게임 상태 및 경제 시스템 (거의 모든 함수가 의존)
            if (id.includes('state/gameState') || id.includes('economy/')) {
              return 'seoulsurvival-core'
            }
            // 개발 치트 시스템 (DEV 모드에서만 동적 로드)
            if (id.includes('systems/devCheatSystem')) {
              return 'seoulsurvival-dev'
            }
            // 시스템 모듈 (게임 로직)
            if (id.includes('systems/')) {
              return 'seoulsurvival-systems'
            }
            // UI 모듈 (렌더링 로직)
            if (id.includes('ui/')) {
              return 'seoulsurvival-ui'
            }
            // 모니터링 및 분석 (선택적 로딩)
            if (id.includes('monitoring/') || id.includes('core/errorBoundary')) {
              return 'seoulsurvival-monitoring'
            }
            // i18n 유틸 (작은 크기)
            if (id.includes('i18n/') && !id.includes('i18n/translations/')) {
              return 'seoulsurvival-i18n'
            }
            // 유틸
            if (id.includes('utils/')) {
              return 'seoulsurvival-utils'
            }
          }

          // Kimchi Invasion 게임 (별도 청크)
          if (id.includes('kimchi-invasion/src')) {
            return 'kimchi-invasion-bundle'
          }

          // 공유 코드 분리
          if (id.includes('shared/')) {
            if (id.includes('auth/')) {
              return 'shared-auth'
            }
            return 'shared-common'
          }
        },
      },
    },
  },
})
