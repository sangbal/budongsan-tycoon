# 9-K. 에러 핸들링 정책 (Error Handling)

> **Last Updated:** 2026-01-19
>
> 원본: `09-technical.md` 섹션 9.13, 9.14

[← 이전: Platform](./09-j-platform.md) | [목차로 돌아가기 →](./README.md)

---

## 9.13. 에러 핸들링 정책

### 9.13.1. 에러 분류 체계

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🚨 에러 분류 및 대응 전략                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┬────────────┬──────────────────┬──────────────────────┐   │
│  │ 등급         │ 심각도     │ 예시             │ 대응                 │   │
│  ├──────────────┼────────────┼──────────────────┼──────────────────────┤   │
│  │ Critical     │ 🔴 즉시   │ 게임 크래시,     │ 자동 복구 시도 →    │   │
│  │              │           │ 데이터 손실 위험 │ 실패 시 재시작 유도  │   │
│  ├──────────────┼────────────┼──────────────────┼──────────────────────┤   │
│  │ Error        │ 🟠 높음   │ API 실패,        │ 재시도 (3회) →      │   │
│  │              │           │ 저장 실패        │ 오프라인 모드 전환   │   │
│  ├──────────────┼────────────┼──────────────────┼──────────────────────┤   │
│  │ Warning      │ 🟡 중간   │ 성능 저하,       │ 사용자 알림 →       │   │
│  │              │           │ 폴백 사용        │ 자동 품질 조절       │   │
│  ├──────────────┼────────────┼──────────────────┼──────────────────────┤   │
│  │ Info         │ 🟢 낮음   │ 기능 미지원,     │ 조용히 로깅 →       │   │
│  │              │           │ 비필수 실패      │ 대체 기능 사용       │   │
│  └──────────────┴────────────┴──────────────────┴──────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.13.2. 네트워크 에러 처리

```typescript
// 네트워크 에러 핸들러
const networkErrorHandler = {
  // 재시도 정책
  retryPolicy: {
    maxRetries: 3,
    backoffMs: [1000, 2000, 4000], // 지수 백오프
    retryableErrors: ['TIMEOUT', 'NETWORK_ERROR', '503', '429'],
  },

  // 오프라인 감지
  offlineDetection: {
    checkInterval: 5000, // 5초마다 연결 상태 확인
    offlineThreshold: 3, // 3회 연속 실패 시 오프라인 판정
  },

  // 오프라인 모드 동작
  offlineMode: {
    enableLocalSave: true, // 로컬 저장 활성화
    queueCloudSync: true, // 클라우드 동기화 대기열
    showOfflineBanner: true, // 오프라인 배너 표시
    disableLeaderboard: true, // 리더보드 비활성화
  },

  // 복구 시 동작
  onReconnect: {
    syncPendingData: true, // 대기 중인 데이터 동기화
    validateLocalSave: true, // 로컬 저장 무결성 검증
    showReconnectToast: true, // 재연결 알림
  },
}
```

### 9.13.3. 게임 상태 에러 복구

```typescript
// 게임 상태 복구 시스템
const stateRecoverySystem = {
  // 자동 백업
  autoBackup: {
    interval: 60000, // 1분마다 자동 백업
    maxBackups: 5, // 최근 5개 백업 유지
    storageKey: 'kimchi_backup_',
  },

  // 손상 감지
  corruptionDetection: {
    checksumValidation: true, // 체크섬 검증
    schemaValidation: true, // 스키마 검증
    rangeValidation: true, // 값 범위 검증
  },

  // 복구 전략
  recoveryStrategy: {
    // 1차: 마지막 자동 백업에서 복구
    tryLatestBackup: true,
    // 2차: 클라우드 저장에서 복구
    tryCloudSave: true,
    // 3차: 최소 복구 (기본값 + 프레스티지 보너스만 유지)
    minimalRecovery: true,
    // 최후: 완전 초기화 (사용자 확인 필요)
    fullReset: false,
  },

  // 복구 UI
  recoveryUI: {
    showRecoveryModal: true, // 복구 모달 표시
    explainOptions: true, // 옵션 설명 제공
    allowManualRestore: true, // 수동 복구 허용
  },
}
```

### 9.13.4. 사용자 친화적 에러 메시지

| 내부 에러          | 사용자 메시지                | 추가 안내                       |
| :----------------- | :--------------------------- | :------------------------------ |
| `NETWORK_TIMEOUT`  | "연결이 불안정합니다"        | "잠시 후 자동으로 재시도합니다" |
| `SAVE_FAILED`      | "저장에 실패했습니다"        | "로컬에 임시 저장되었습니다"    |
| `CLOUD_SYNC_ERROR` | "클라우드 동기화 실패"       | "오프라인 모드로 전환합니다"    |
| `AUTH_EXPIRED`     | "로그인이 만료되었습니다"    | "다시 로그인해주세요"           |
| `DATA_CORRUPTED`   | "데이터 오류가 발생했습니다" | "백업에서 복구를 시도합니다"    |
| `RATE_LIMITED`     | "요청이 너무 많습니다"       | "잠시 후 다시 시도해주세요"     |

### 9.13.5. 에러 로깅 및 모니터링

```typescript
// 에러 리포팅 설정
const errorReporting = {
  // 로깅 레벨
  logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',

  // 수집 데이터
  collectData: {
    stackTrace: true, // 스택 트레이스
    userAgent: true, // 브라우저 정보
    gameState: 'summary', // 게임 상태 요약 (민감 정보 제외)
    sessionDuration: true, // 세션 지속 시간
    lastActions: 10, // 최근 10개 행동 (디버깅용)
  },

  // 민감 정보 마스킹
  maskFields: ['email', 'nickname', 'userId'],

  // 외부 서비스 (선택)
  externalService: {
    provider: 'sentry', // 또는 null (자체 로깅만)
    sampleRate: 0.1, // 10% 샘플링 (비용 관리)
    environment: process.env.NODE_ENV,
  },

  // 사용자 피드백
  userFeedback: {
    allowCrashReport: true, // 크래시 리포트 허용 옵션
    feedbackModal: true, // 피드백 모달 제공
  },
}
```

### 9.13.6. 에러 대응 플로우차트

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🔄 에러 대응 플로우                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [에러 발생] ──► [등급 분류] ──┬──► [Critical] ──► 자동 복구 시도           │
│                               │         │          ├─ 성공 → 계속 플레이    │
│                               │         │          └─ 실패 → 복구 모달      │
│                               │                                             │
│                               ├──► [Error] ──► 재시도 (최대 3회)            │
│                               │         │      ├─ 성공 → 계속 플레이        │
│                               │         │      └─ 실패 → 폴백/오프라인      │
│                               │                                             │
│                               ├──► [Warning] ──► 알림 표시 + 자동 조치     │
│                               │                                             │
│                               └──► [Info] ──► 조용히 로깅                   │
│                                                                             │
│  [모든 에러] ──► [로깅] ──► [분석 대시보드]                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9.14. 요약

### 핵심 기술 스택

| 영역   | 기술           | 선택 이유         |
| :----- | :------------- | :---------------- |
| 렌더링 | PixiJS 8.x     | 고성능 2D WebGL   |
| 빌드   | Vite 5.x       | 빠른 HMR, ESBuild |
| 타입   | TypeScript 5.x | 안전성, 생산성    |
| 상태   | Zustand 4.x    | 경량, 유연함      |
| 오디오 | Howler.js 2.x  | 크로스브라우저    |
| 백엔드 | Supabase       | 올인원 BaaS       |

### 성능 목표 요약

| 지표             | 목표  | 최소  |
| :--------------- | :---- | :---- |
| 첫 상호작용      | 3초   | 5초   |
| FPS (중사양)     | 45    | 30    |
| 번들 크기 (gzip) | 300KB | 500KB |
| 메모리           | 100MB | 200MB |

### 보안 핵심

- RLS로 데이터 보호
- Edge Functions로 서버 검증
- 치팅 탐지 시스템
- Rate Limiting

---

[← 이전: Platform](./09-j-platform.md) | [목차로 돌아가기 →](./README.md)
