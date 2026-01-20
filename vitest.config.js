import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    passWithNoTests: true, // Allow running with no tests (until Phase A)
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/**', // Exclude Playwright E2E tests
      '**/*.spec.js', // Exclude Playwright spec files
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'seoulsurvival/src/**/*.js', // 명시적으로 소스 디렉토리 포함
      ],
      exclude: [
        'node_modules/',
        'dist/',
        'legacy/',
        'mma-promotion-manager/backup/',
        'tests/',
        '**/*.config.js',
        '**/*.config.ts',
        '**/__tests__/**', // 테스트 파일 제외
        '**/*.test.js', // 테스트 파일 제외
        '**/main.js', // 통합 파일 제외 (E2E로 테스트)
      ],
      // 커버리지 임계값 설정
      statements: 50,
      branches: 45,
      functions: 50,
      lines: 50,
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './shared'),
      '@seoulsurvival': path.resolve(__dirname, './seoulsurvival/src'),
      '@kimchi-invasion': path.resolve(__dirname, './kimchi-invasion/src'),
      '@mma-manager': path.resolve(__dirname, './mma-manager/src'),
    },
  },
})
