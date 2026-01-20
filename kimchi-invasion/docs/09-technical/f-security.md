# 9-F. 보안 시스템 (Security System)

> **Last Updated:** 2026-01-19
>
> 원본: `09-technical.md` 섹션 9.8

[← 이전: Save System](./09-e-save-system.md) | [다음: DevOps →](./09-g-devops.md)

---

## 9.8. 보안 시스템

### 9.8.1. 보안 위협 및 대응

```javascript
const SECURITY_MEASURES = {
  // 위협 분류
  threats: {
    // 클라이언트 조작
    client_manipulation: {
      description: '개발자 도구로 게임 상태 조작',
      severity: 'high',
      countermeasures: [
        '서버 사이드 검증 (Edge Functions)',
        '통계 일관성 체크',
        '이상치 탐지 알고리즘',
        '행동 패턴 분석',
      ],
    },

    // 저장 데이터 조작
    save_manipulation: {
      description: '로컬 저장 데이터 수정',
      severity: 'high',
      countermeasures: [
        '체크섬 검증',
        '서버 세이브와 비교',
        '불가능한 값 탐지',
        '타임스탬프 무결성 검사',
      ],
    },

    // 리더보드 치팅
    leaderboard_cheating: {
      description: '부정한 점수 제출',
      severity: 'critical',
      countermeasures: [
        '서버에서 점수 계산 검증',
        '재현 가능한 게임 리플레이',
        '통계적 이상치 탐지',
        '수동 검토 플래그',
      ],
    },

    // API 남용
    api_abuse: {
      description: 'API 과다 호출, DDoS',
      severity: 'high',
      countermeasures: ['Rate limiting (Supabase)', '요청 서명', 'Cloudflare 보호', 'IP 기반 차단'],
    },

    // 주입 공격
    injection: {
      description: 'XSS, SQL Injection',
      severity: 'critical',
      countermeasures: [
        '입력값 검증 (클라이언트 + 서버)',
        'Supabase RLS',
        'HTML 이스케이프',
        'CSP 헤더',
      ],
    },
  },

  // 치팅 탐지 시스템
  cheat_detection: {
    // 통계적 이상치 탐지
    statistical: {
      score_growth_rate: {
        threshold: '3 sigma', // 표준편차 3배 초과
        action: 'flag_for_review',
      },
      impossible_values: {
        check: 'math_validation',
        action: 'reject_immediately',
      },
      time_travel: {
        check: 'timestamp_consistency',
        action: 'flag_and_reset',
      },
    },

    // 행동 패턴 분석
    behavioral: {
      action_frequency: {
        max_actions_per_second: 60,
        action: 'throttle',
      },
      input_patterns: {
        check: 'human_like_variance',
        action: 'flag_for_review',
      },
    },

    // 대응 액션
    actions: {
      flag_for_review: '관리자 검토 대기열에 추가',
      reject_immediately: '즉시 거부, 로그 기록',
      flag_and_reset: '세이브 초기화, 경고',
      shadow_ban: '리더보드에서 숨김 (플레이는 가능)',
      full_ban: '계정 정지',
    },
  },
}
```

### 9.8.2. 인증 보안

```javascript
const AUTH_SECURITY = {
  // 세션 관리
  session: {
    token_storage: 'httpOnly cookie', // XSS 방지
    refresh_strategy: 'sliding window',
    max_age: 7 * 24 * 60 * 60, // 7일
    idle_timeout: 24 * 60 * 60, // 24시간 비활성 시 만료
  },

  // OAuth 설정
  oauth: {
    providers: ['google'],
    scopes: ['email', 'profile'], // 최소 권한
    state_parameter: true, // CSRF 방지
    pkce: true, // 코드 가로채기 방지
  },

  // 익명 인증
  anonymous: {
    enabled: true,
    upgrade_path: true, // 나중에 소셜 연결 가능
    data_retention: 90, // 90일 후 삭제
  },

  // Rate Limiting
  rate_limits: {
    login_attempts: { max: 5, window: 15 * 60 }, // 15분에 5회
    password_reset: { max: 3, window: 60 * 60 }, // 1시간에 3회
    api_calls: { max: 1000, window: 60 }, // 1분에 1000회
  },
}
```

---

[← 이전: Save System](./09-e-save-system.md) | [다음: DevOps →](./09-g-devops.md)
