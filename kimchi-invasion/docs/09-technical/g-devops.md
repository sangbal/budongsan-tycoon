# 9-G. 개발 도구 및 DevOps (Development & DevOps)

> **Last Updated:** 2026-01-19
>
> 원본: `09-technical.md` 섹션 9.9

[← 이전: Security](./09-f-security.md) | [다음: Loading →](./09-h-loading.md)

---

## 9.9. 개발 도구 및 DevOps

### 9.9.1. 개발 환경

```javascript
const DEV_ENVIRONMENT = {
  // IDE 설정
  ide: {
    recommended: 'VS Code',
    extensions: [
      'dbaeumer.vscode-eslint',
      'esbenp.prettier-vscode',
      'ms-vscode.vscode-typescript-next',
      'pixijs.snippets',
    ],
    settings: {
      'editor.formatOnSave': true,
      'editor.codeActionsOnSave': {
        'source.fixAll.eslint': true,
      },
    },
  },

  // 린팅 & 포맷팅
  code_quality: {
    eslint: {
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      rules: {
        'no-console': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    prettier: {
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'es5',
    },
    husky: {
      'pre-commit': 'lint-staged',
      'pre-push': 'npm test',
    },
  },

  // 디버깅 도구
  debugging: {
    browser_devtools: true,
    pixi_devtools: true, // PixiJS Inspector
    performance_overlay: true, // FPS, 메모리 표시
    state_inspector: true, // Zustand devtools
    network_logger: true, // API 호출 로그
  },
}
```

### 9.9.2. 테스트 전략

```javascript
const TESTING_STRATEGY = {
  // 테스트 유형별 커버리지 목표
  coverage_targets: {
    unit: { target: 80, critical_paths: 100 },
    integration: { target: 70 },
    e2e: { target: 50, critical_flows: 100 },
  },

  // 단위 테스트
  unit_tests: {
    framework: 'Vitest',
    coverage_tool: 'c8',
    focus_areas: ['게임 로직 (생산, 물류, 에너지)', '상태 관리', '유틸리티 함수', '데이터 검증'],
    mocking: {
      browser_apis: true,
      supabase: true,
      pixi: true,
    },
  },

  // 통합 테스트
  integration_tests: {
    framework: 'Vitest',
    focus_areas: ['시스템 간 상호작용', '저장/로드 사이클', '이벤트 흐름'],
  },

  // E2E 테스트
  e2e_tests: {
    framework: 'Playwright',
    browsers: ['chromium', 'firefox', 'webkit'],
    critical_flows: [
      '게임 시작 → 첫 생산 → 저장',
      '로그인 → 클라우드 로드 → 계속 플레이',
      '프레스티지 전체 흐름',
      '리더보드 점수 제출',
    ],
    visual_regression: {
      enabled: true,
      tool: 'Playwright Screenshots',
      threshold: 0.1,
    },
  },

  // 성능 테스트
  performance_tests: {
    framework: 'Lighthouse CI',
    thresholds: {
      performance: 80,
      accessibility: 90,
      best_practices: 90,
    },
    custom_metrics: ['time_to_interactive', 'frame_rate_stability', 'memory_growth'],
  },
}
```

### 9.9.3. CI/CD 파이프라인

```yaml
# .github/workflows/ci.yml 개념
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # 코드 품질 검사
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  # 테스트
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v4

  # E2E 테스트
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  # 빌드
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Check bundle size
        run: npx bundlesize
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  # 배포 (main 브랜치)
  deploy:
    runs-on: ubuntu-latest
    needs: [build, e2e]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 9.9.4. 모니터링 및 분석

```javascript
const MONITORING = {
  // 에러 추적
  error_tracking: {
    service: 'Sentry',
    config: {
      dsn: 'process.env.SENTRY_DSN',
      environment: 'production',
      release: 'process.env.VERSION',
      tracesSampleRate: 0.1,
      beforeSend: event => {
        // PII 제거
        delete event.user?.email
        return event
      },
    },
    alerts: {
      new_issue: 'slack',
      spike: 'pagerduty',
    },
  },

  // 성능 모니터링
  performance: {
    service: 'Sentry Performance',
    metrics: [
      'page_load_time',
      'first_input_delay',
      'cumulative_layout_shift',
      'largest_contentful_paint',
      'custom:fps',
      'custom:memory_usage',
    ],
    sampling: 0.1,
  },

  // 사용자 분석
  analytics: {
    service: 'Google Analytics 4',
    events: [
      'game_started',
      'milestone_reached',
      'prestige_completed',
      'achievement_unlocked',
      'purchase_completed',
      'tutorial_completed',
      'tutorial_skipped',
    ],
    user_properties: ['prestige_count', 'playtime_hours', 'platform', 'language'],
  },

  // 비즈니스 메트릭
  business_metrics: {
    dashboards: [
      'DAU/MAU',
      'Session Length',
      'Retention (D1, D7, D30)',
      'Prestige Funnel',
      'Revenue',
    ],
    alerts: {
      dau_drop_10_percent: 'slack',
      error_rate_spike: 'pagerduty',
    },
  },
}
```

---

[← 이전: Security](./09-f-security.md) | [다음: Loading →](./09-h-loading.md)
