# 9-A. 기술 스택 개요 (Tech Stack Overview)

> **Last Updated:** 2026-01-19
>
> 원본: `09-technical.md` 섹션 9.1~9.3

[← 목차로 돌아가기](./README.md) | [다음: Backend →](./09-b-backend.md)

---

## 9.1. 기술 철학

### 9.1.1. FAST 원칙

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      🚀 FAST: 기술 설계 프레임워크                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  F - Frictionless (마찰 없는 경험)                                          │
│  ───────────────────────────────────────────────────────────────────────── │
│  • 3초 이내 게임 시작 (First Meaningful Paint)                              │
│  • 60 FPS 유지, 프레임 드롭 최소화                                          │
│  • 끊김 없는 저장/로드 (비동기, 백그라운드)                                 │
│                                                                             │
│  A - Accessible (접근 가능한)                                               │
│  ───────────────────────────────────────────────────────────────────────── │
│  • 저사양 기기에서도 플레이 가능                                            │
│  • 느린 네트워크 환경 지원 (3G 이상)                                        │
│  • 오프라인 모드 지원                                                       │
│                                                                             │
│  S - Scalable (확장 가능한)                                                 │
│  ───────────────────────────────────────────────────────────────────────── │
│  • 수천 개 엔티티 동시 처리                                                 │
│  • 수만 명 동시 접속 지원 (서버)                                            │
│  • 새로운 콘텐츠 추가 용이                                                  │
│                                                                             │
│  T - Transparent (투명한 디버깅)                                            │
│  ───────────────────────────────────────────────────────────────────────── │
│  • 상세한 에러 리포팅                                                       │
│  • 실시간 성능 모니터링                                                     │
│  • 재현 가능한 버그 리포트                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.1.2. 기술 선택 기준

```javascript
const TECH_SELECTION_CRITERIA = {
  // 필수 조건
  mandatory: {
    browser_support: 'Chrome 90+, Firefox 90+, Safari 15+, Edge 90+',
    mobile_first: true,
    offline_capable: true,
    no_plugins: true, // Flash, Java 등 불필요
  },

  // 선호 조건
  preferred: {
    bundle_size: '< 500KB gzipped (초기 로드)',
    runtime_performance: '60 FPS on mid-range devices',
    developer_experience: 'TypeScript, Hot Reload, 좋은 IDE 지원',
    community_support: '활발한 커뮤니티, 문서화 우수',
    long_term_maintenance: '안정적인 메이저 버전, 기업 후원',
  },

  // 기피 조건
  avoid: {
    heavy_frameworks: ['Angular (큰 번들)'],
    unstable_libs: ['버전 0.x 라이브러리'],
    vendor_lock_in: ['특정 클라우드 종속'],
    complex_setup: ['복잡한 빌드 설정'],
  },
}
```

---

## 9.2. 플랫폼 및 브라우저 지원

### 9.2.1. 타겟 플랫폼 매트릭스

| 플랫폼                    | 지원 범위 | 우선순위 | 테스트 빈도 |
| :------------------------ | :-------- | :------- | :---------- |
| **데스크톱 Chrome**       | 90+       | 🥇 1순위 | 매 빌드     |
| **데스크톱 Firefox**      | 90+       | 🥇 1순위 | 매 빌드     |
| **데스크톱 Safari**       | 15+       | 🥈 2순위 | 주 1회      |
| **데스크톱 Edge**         | 90+       | 🥈 2순위 | 주 1회      |
| **모바일 iOS Safari**     | 15+       | 🥇 1순위 | 매 빌드     |
| **모바일 Android Chrome** | 90+       | 🥇 1순위 | 매 빌드     |
| **태블릿 iPad Safari**    | 15+       | 🥈 2순위 | 주 1회      |
| **태블릿 Android Chrome** | 90+       | 🥈 2순위 | 주 1회      |

### 9.2.2. 최소/권장 사양

```javascript
const DEVICE_REQUIREMENTS = {
  minimum: {
    cpu: '듀얼코어 1.5GHz (ARM Cortex-A53 이상)',
    ram: '2GB',
    gpu: 'WebGL 2.0 지원',
    screen: '320×568 (iPhone SE 1세대)',
    network: '3G (1Mbps)',
    storage: '50MB 여유 공간 (캐시)',
    browser: 'ES2020 지원',
  },

  recommended: {
    cpu: '쿼드코어 2.0GHz+ (A15, Snapdragon 8 이상)',
    ram: '4GB+',
    gpu: 'WebGL 2.0 + WebGPU 지원',
    screen: '1920×1080',
    network: '4G/WiFi (10Mbps+)',
    storage: '100MB+',
    browser: '최신 버전',
  },

  optimal: {
    cpu: '옥타코어 3.0GHz+',
    ram: '8GB+',
    gpu: '전용 GPU',
    screen: '2560×1440+',
    network: '광대역 (100Mbps+)',
    storage: '500MB+',
    browser: 'Chrome Canary',
  },
}
```

### 9.2.3. 기능 탐지 및 폴백

```javascript
const FEATURE_DETECTION = {
  // 필수 기능 (없으면 게임 불가)
  required: {
    webgl2: () => {
      const canvas = document.createElement('canvas')
      return !!canvas.getContext('webgl2')
    },
    localStorage: () => {
      try {
        localStorage.setItem('test', '1')
        localStorage.removeItem('test')
        return true
      } catch {
        return false
      }
    },
    es2020: () => {
      try {
        eval("const a = 1n; a?.b ?? 'c';")
        return true
      } catch {
        return false
      }
    },
  },

  // 선택 기능 (없으면 대체 방안)
  optional: {
    webgpu: {
      detect: () => 'gpu' in navigator,
      fallback: 'webgl2',
    },
    webworker: {
      detect: () => typeof Worker !== 'undefined',
      fallback: 'main-thread',
    },
    serviceWorker: {
      detect: () => 'serviceWorker' in navigator,
      fallback: 'no-offline',
    },
    vibration: {
      detect: () => 'vibrate' in navigator,
      fallback: 'none',
    },
    gamepad: {
      detect: () => 'getGamepads' in navigator,
      fallback: 'none',
    },
  },

  // 비지원 브라우저 메시지
  unsupportedMessage: {
    ko: '이 게임은 최신 브라우저에서 플레이해주세요. Chrome, Firefox, Safari, Edge 최신 버전을 권장합니다.',
    en: 'Please use a modern browser to play this game. Chrome, Firefox, Safari, Edge latest versions are recommended.',
  },
}
```

---

## 9.3. 프론트엔드 기술 스택

### 9.3.1. 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         🎮 프론트엔드 아키텍처 v2                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                           Presentation Layer                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│   │
│  │  │  Game View  │  │   HUD/UI    │  │   Menus     │  │   Modals    ││   │
│  │  │  (PixiJS)   │  │ (Vanilla)   │  │ (Vanilla)   │  │ (Vanilla)   ││   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘│   │
│  └─────────┼────────────────┼────────────────┼────────────────┼────────┘   │
│            │                │                │                │            │
│            └────────────────┴────────────────┴────────────────┘            │
│                                      │                                      │
│  ┌───────────────────────────────────▼───────────────────────────────────┐ │
│  │                          Application Layer                            │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │ │
│  │  │ GameManager │  │InputManager │  │AudioManager │  │ SaveManager │  │ │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │ │
│  └─────────┼────────────────┼────────────────┼────────────────┼──────────┘ │
│            │                │                │                │            │
│  ┌─────────▼────────────────▼────────────────▼────────────────▼──────────┐ │
│  │                           Domain Layer                                │ │
│  │                                                                       │ │
│  │  ┌───────────────────────────────────────────────────────────────┐   │ │
│  │  │                      Game Engine Core                         │   │ │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │ │
│  │  │  │  Tick   │  │ Entity  │  │  Grid   │  │Logistics│          │   │ │
│  │  │  │ System  │  │ System  │  │ System  │  │ System  │          │   │ │
│  │  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │   │ │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │ │
│  │  │  │Production│  │ Energy  │  │Research │  │ Market  │          │   │ │
│  │  │  │ System  │  │ System  │  │ System  │  │ System  │          │   │ │
│  │  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │   │ │
│  │  └───────────────────────────────────────────────────────────────┘   │ │
│  │                                                                       │ │
│  │  ┌───────────────────────────────────────────────────────────────┐   │ │
│  │  │                     State Management (Zustand)                 │   │ │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │ │
│  │  │  │  Game   │  │  UI     │  │ Settings│  │ Session │          │   │ │
│  │  │  │  Store  │  │  Store  │  │  Store  │  │  Store  │          │   │ │
│  │  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │   │ │
│  │  └───────────────────────────────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│  ┌───────────────────────────────────▼───────────────────────────────────┐ │
│  │                         Infrastructure Layer                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │ │
│  │  │ LocalStorage│  │  Supabase   │  │  Analytics  │  │   Sentry    │  │ │
│  │  │   Cache     │  │   Client    │  │   Client    │  │   Client    │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.3.2. 핵심 라이브러리 상세

```javascript
const TECH_STACK = {
  // 렌더링
  rendering: {
    name: 'PixiJS',
    version: '8.x',
    purpose: ['2D WebGL 렌더링', '스프라이트 배칭', '파티클 시스템', '텍스처 관리'],
    config: {
      antialias: false, // 성능 우선
      resolution: 'auto', // 디바이스 픽셀 비율
      powerPreference: 'high-performance',
      backgroundAlpha: 0, // 투명 배경
    },
  },

  // 빌드 도구
  build: {
    name: 'Vite',
    version: '5.x',
    purpose: ['ESBuild 기반 빠른 번들링', 'Hot Module Replacement', '코드 스플리팅', '에셋 최적화'],
    config: {
      target: 'es2020',
      minify: 'esbuild',
      sourcemap: true, // 에러 추적용
      chunkSizeWarningLimit: 500, // KB
    },
  },

  // 타입 시스템
  types: {
    name: 'TypeScript',
    version: '5.x',
    purpose: ['컴파일 타임 타입 검사', 'IDE 자동완성', '리팩토링 안전성', '문서화 효과'],
    config: {
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
    },
  },

  // 상태 관리
  state: {
    name: 'Zustand',
    version: '4.x',
    purpose: [
      '경량 상태 관리 (< 1KB)',
      'React 없이 사용 가능',
      'Immer 미들웨어',
      'Persist 미들웨어',
    ],
    stores: [
      'gameStore', // 게임 상태
      'uiStore', // UI 상태
      'settingsStore', // 설정
      'sessionStore', // 세션 정보
    ],
  },

  // 오디오
  audio: {
    name: 'Howler.js',
    version: '2.x',
    purpose: [
      '크로스브라우저 오디오',
      'Web Audio API + HTML5 Audio 폴백',
      '스프라이트 오디오',
      '공간 오디오 (선택적)',
    ],
    config: {
      preload: true,
      html5PoolSize: 10,
      autoUnlock: true, // iOS 오디오 잠금 해제
    },
  },

  // 백엔드 클라이언트
  backend: {
    name: '@supabase/supabase-js',
    version: '2.x',
    purpose: [
      '인증 (Google OAuth, 익명)',
      '실시간 데이터베이스',
      '클라우드 저장',
      'Edge Functions 호출',
    ],
    config: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
}
```

### 9.3.3. 번들 크기 예산

```javascript
const BUNDLE_BUDGET = {
  // 초기 로드 (Critical Path)
  initial: {
    html: { max: 10, unit: 'KB' },
    css: { max: 20, unit: 'KB' },
    js_core: { max: 150, unit: 'KB' }, // 게임 엔진 코어
    js_vendor: { max: 100, unit: 'KB' }, // 필수 라이브러리
    total: { max: 300, unit: 'KB', note: 'gzipped' },
  },

  // 지연 로드 (Non-Critical)
  lazy: {
    js_ui: { max: 50, unit: 'KB' },
    js_audio: { max: 30, unit: 'KB' },
    js_analytics: { max: 20, unit: 'KB' },
    sprites: { max: 500, unit: 'KB', note: 'WebP, 스프라이트시트' },
    audio: { max: 1000, unit: 'KB', note: '압축 음악/효과음' },
    fonts: { max: 100, unit: 'KB', note: 'WOFF2' },
  },

  // 전체 예산
  total: {
    all_js: { max: 400, unit: 'KB' },
    all_assets: { max: 2000, unit: 'KB' },
    grand_total: { max: 2500, unit: 'KB' },
  },

  // 모니터링
  monitoring: {
    tool: 'bundlesize',
    ci_check: true,
    fail_on_exceed: true,
  },
}
```

---

[← 목차로 돌아가기](./README.md) | [다음: Backend →](./09-b-backend.md)
