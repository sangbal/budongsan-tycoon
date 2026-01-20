# 9-J. 크로스플랫폼 전략 (Cross-Platform Strategy)

> **Last Updated:** 2026-01-19
>
> 원본: `09-technical.md` 섹션 9.12

[← 이전: Accessibility](./09-i-accessibility.md) | [다음: Error Handling →](./09-k-error-handling.md)

---

## 9.12. 미래 확장성 및 크로스플랫폼 전략

> **핵심 전략:** 웹 MVP → Godot 4 리빌드 → Steam/모바일 동시 배포
>
> 리서치 기반: [크로스플랫폼 기술 스택 리서치](../../docs/development/CROSSPLATFORM_TECH_STACK_RESEARCH.md)

### 9.12.0. 크로스플랫폼 로드맵

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🚀 크로스플랫폼 기술 전환 로드맵                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Phase 1: 웹 MVP (현재)                                      [M1-M6]       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 기술: JavaScript/TypeScript + PixiJS + Vite                             │
│  • 플랫폼: Web (PC + Mobile 브라우저)                                      │
│  • 목표: 핵심 게임플레이 검증, 유저 피드백 수집                             │
│  • 배포: ClickSurvivor 허브 (clicksurvivor.com/kimchi-invasion)            │
│                                                                             │
│  Phase 1.5: Steam Early Access (선택)                        [M7-M8]       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 기술: Electron + steamworks.js                                          │
│  • 장점: 기존 코드 100% 재사용, 빠른 출시                                   │
│  • 단점: 80-120MB 바이너리, 높은 메모리 사용량                              │
│  • 판단 기준: 웹 MVP 반응에 따라 결정                                       │
│                                                                             │
│  Phase 2: Godot 4 리빌드 ⭐ 권장                              [M9-M14]      │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 엔진: Godot 4.x                                                         │
│  • 언어: GDScript (또는 C#)                                                │
│  • 장점:                                                                   │
│    - 100% 무료, 오픈소스, 라이선스 리스크 없음                              │
│    - 2D 네이티브 엔진 (타워디펜스/팩토리에 최적)                            │
│    - 단일 코드베이스로 Web + Steam + 모바일 빌드                            │
│    - GodotSteam으로 완전한 Steam 통합                                      │
│  • 성공 사례: Brotato ($10.7M), Dome Keeper ($6.1M)                        │
│                                                                             │
│  Phase 3: 멀티플랫폼 배포                                    [M15+]        │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • Steam 정식 출시                                                         │
│  • Web (Godot HTML5 export)                                                │
│  • iOS/Android (검토)                                                      │
│  • Nintendo Switch (장기 검토 - 서드파티 포팅 서비스)                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.12.0.1. 엔진 비교 분석 (2025년 기준)

| 엔진        | Steam 점유율 | 2D 게임 적합성      | 라이선스    | 학습 곡선 | 추천도       |
| :---------- | :----------- | :------------------ | :---------- | :-------- | :----------- |
| **Godot 4** | 5% (급성장)  | ⭐⭐⭐⭐⭐ 네이티브 | 무료 (MIT)  | 1-2개월   | 🥇 **1순위** |
| Unity       | 51%          | ⭐⭐⭐⭐ 좋음       | 조건부 무료 | 2-4개월   | 🥈 2순위     |
| Unreal      | 28%          | ⭐⭐ 과도함         | 5% 로열티   | 4-6개월   | 🥉 3순위     |

**Godot 선정 근거:**

- 팩토리/타워디펜스 장르에 최적화된 2D 네이티브 엔진
- 유사 게임 성공 사례: Shapez.io (JS→Steam), Mindustry (Java/libGDX)
- Unity 라이선스 논란 후 인디 개발자 대거 이탈 → Godot 급성장
- 2025년 Steam 출시 게임 수: 2024년 전체(389개)를 5개월 만에 돌파

### 9.12.1. Steam 출시 준비

```javascript
const STEAM_PREPARATION = {
  // Phase 1.5: Electron 래핑 (단기 전략)
  electron_approach: {
    framework: 'Electron',
    steam_sdk: 'steamworks.js', // Greenworks 대체
    platforms: ['win64', 'mac', 'linux'],
    bundle_size: '80-120MB',
    pros: ['기존 코드 재사용', '빠른 출시'],
    cons: ['높은 메모리 사용', '성능 제한'],
    use_case: 'Early Access 빠른 출시 필요 시',
  },

  // Phase 2: Godot 리빌드 (장기 전략) ⭐ 권장
  godot_approach: {
    engine: 'Godot 4.x',
    steam_sdk: 'GodotSteam',
    platforms: ['win64', 'mac', 'linux', 'web'],
    bundle_size: '30-50MB',
    pros: ['네이티브 성능', '단일 코드베이스', '무료'],
    cons: ['리빌드 필요', '학습 곡선'],
    use_case: '정식 출시 및 장기 운영',
  },

  // Steamworks 통합 (공통)
  steamworks: {
    sdk_version: '1.55+',
    features: [
      'Achievements',
      'Cloud Save',
      'Leaderboards',
      'Trading Cards',
      'Workshop (블루프린트 공유)',
    ],
  },

  // 요구사항
  requirements: {
    demo: true, // 무료 데모 제공
    achievements: 110, // Steam 업적
    controller_support: 'partial',
    cloud_save: true,
    trading_cards: 6,
  },
}
```

### 9.12.2. 모바일 앱 계획

```javascript
const MOBILE_APP_PLAN = {
  // 앱 프레임워크
  framework: {
    primary: 'Capacitor', // 웹 래퍼
    fallback: 'React Native', // 필요 시
  },

  // 플랫폼별 기능
  platform_features: {
    ios: {
      game_center: true,
      apple_pay: false, // 웹 결제 사용
      push_notifications: true,
      haptic_feedback: true,
    },
    android: {
      play_games: true,
      google_pay: false,
      push_notifications: true,
      haptic_feedback: true,
    },
  },

  // 모바일 최적화
  optimizations: {
    battery_saver_mode: true,
    background_pause: true,
    data_saver: true,
    offline_first: true,
  },
}
```

---

[← 이전: Accessibility](./09-i-accessibility.md) | [다음: Error Handling →](./09-k-error-handling.md)
