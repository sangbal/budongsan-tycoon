# 9-H. 로딩 및 초기화 (Loading & Initialization)

> **Last Updated:** 2026-01-19
>
> 원본: `09-technical.md` 섹션 9.10

[← 이전: DevOps](./09-g-devops.md) | [다음: Accessibility →](./09-i-accessibility.md)

---

## 9.10. 로딩 및 초기화

### 9.10.1. 로딩 시퀀스 상세

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         🚀 게임 로딩 시퀀스 v2                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Phase 1: Critical Path [0-1s]                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ├─ [0-100ms] HTML 파싱                                                     │
│  │   └─ 인라인 CSS로 로딩 스피너 즉시 표시                                  │
│  ├─ [100-300ms] Critical CSS 로드                                           │
│  │   └─ 로딩 화면 스타일                                                    │
│  ├─ [300-500ms] Core JS 로드 (150KB)                                        │
│  │   └─ 게임 엔진 코어, 상태 관리                                           │
│  └─ [500-1000ms] Feature Detection                                          │
│      └─ WebGL, LocalStorage, ES2020 확인                                    │
│                                                                             │
│  Phase 2: Resource Loading [1-3s]                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ├─ [1-1.5s] 스프라이트시트 프리로드                                        │
│  │   └─ WebP 포맷, 우선순위별 로드                                          │
│  ├─ [1-2s] 오디오 초기화                                                    │
│  │   └─ 필수 효과음만 먼저, 음악은 지연                                     │
│  ├─ [1.5-2.5s] 폰트 로드                                                    │
│  │   └─ WOFF2, 시스템 폰트 폴백                                             │
│  └─ [2-3s] Supabase 연결                                                    │
│      ├─ 세션 확인                                                           │
│      └─ 클라우드 세이브 메타데이터 조회                                     │
│                                                                             │
│  Phase 3: Game State Initialization [3-4s]                                  │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ├─ [3-3.3s] 로컬 세이브 확인                                               │
│  │   ├─ IndexedDB 조회                                                      │
│  │   └─ LocalStorage 폴백                                                   │
│  ├─ [3.3-3.6s] 세이브 충돌 해결                                             │
│  │   └─ 로컬 vs 클라우드 비교                                               │
│  ├─ [3.6-3.8s] 세이브 마이그레이션                                          │
│  │   └─ 버전 업그레이드 적용                                                │
│  └─ [3.8-4s] 게임 상태 복원                                                 │
│      └─ Zustand 스토어 초기화                                               │
│                                                                             │
│  Phase 4: Render Initialization [4-5s]                                      │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ├─ [4-4.3s] PixiJS 앱 생성                                                 │
│  │   └─ WebGL 컨텍스트 초기화                                               │
│  ├─ [4.3-4.6s] 씬 구성                                                      │
│  │   └─ 게임 월드, HUD, UI 레이어                                           │
│  └─ [4.6-5s] 첫 프레임 렌더                                                 │
│      └─ 로딩 화면 페이드 아웃                                               │
│                                                                             │
│  Phase 5: Game Start [5s+]                                                  │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ├─ 게임 루프 시작                                                          │
│  ├─ 튜토리얼 또는 게임 뷰 표시                                              │
│  └─ 백그라운드 에셋 지연 로드 시작                                          │
│                                                                             │
│  📊 목표: 5초 이내 첫 상호작용 가능                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.10.2. 프로그레시브 로딩

```javascript
const PROGRESSIVE_LOADING = {
  // 우선순위 그룹
  priority_groups: {
    critical: {
      assets: [
        'sprites/core.webp', // 핵심 UI 스프라이트
        'audio/ui_click.mp3', // 필수 효과음
      ],
      load_strategy: 'blocking',
    },
    high: {
      assets: [
        'sprites/buildings.webp', // 건물 스프라이트
        'sprites/items.webp', // 아이템 스프라이트
      ],
      load_strategy: 'parallel',
    },
    medium: {
      assets: [
        'sprites/effects.webp', // 효과 스프라이트
        'audio/ambient.mp3', // 배경음
      ],
      load_strategy: 'lazy',
    },
    low: {
      assets: [
        'sprites/decorations.webp', // 장식 스프라이트
        'audio/music_*.mp3', // 음악 (필요 시)
      ],
      load_strategy: 'idle',
    },
  },

  // 로드 전략
  strategies: {
    blocking: '게임 시작 전 필수 로드',
    parallel: '병렬 로드, 완료 시 활성화',
    lazy: '뷰포트 진입 시 로드',
    idle: '브라우저 idle 시간에 로드',
  },

  // 프로그레스 표시
  progress_display: {
    show_percentage: true,
    show_current_asset: true,
    fake_progress: {
      enabled: true, // 체감 속도 향상
      min_duration: 2000, // 최소 2초
    },
  },
}
```

---

[← 이전: DevOps](./09-g-devops.md) | [다음: Accessibility →](./09-i-accessibility.md)
