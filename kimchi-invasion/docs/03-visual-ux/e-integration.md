# 3-E. 사운드-UI 연동 및 성능 (Sound-UI & Performance)

> **Last Updated:** 2026-01-19
>
> 원본: `03-visual-ux.md` 섹션 3.12~3.14

[← 이전: Overlays](./03-d-overlays.md) | [다음: Accessibility →](./03-f-accessibility.md)

---

## 3.12. 사운드-UI 연동

### 3.12.1. UI 사운드 매핑

| UI 이벤트       | 사운드 타입       | 특성             |
| :-------------- | :---------------- | :--------------- |
| **버튼 클릭**   | click_soft.wav    | 100ms, 피치 변조 |
| **건물 배치**   | place_metal.wav   | 200ms, 공간 음향 |
| **건물 삭제**   | demolish.wav      | 300ms, 잔향      |
| **메뉴 열기**   | swoosh_open.wav   | 150ms            |
| **메뉴 닫기**   | swoosh_close.wav  | 100ms            |
| **성공 알림**   | chime_success.wav | 500ms, 멜로디    |
| **경고 알림**   | alert_warning.wav | 300ms, 2회 반복  |
| **오류 알림**   | error_buzz.wav    | 200ms, 저음      |
| **업적 달성**   | achievement.wav   | 1000ms, 팡파르   |
| **레벨업/해금** | levelup.wav       | 800ms, 상승 음계 |

### 3.12.2. 청각 피드백 원칙

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     AUDIO FEEDBACK PRINCIPLES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. 일관성: 동일 동작 = 동일 사운드 (피치 변조로 변화)                     │
│                                                                             │
│  2. 비침습성: 반복 동작의 사운드는 짧고 부드럽게                           │
│     └─ 연속 클릭 시 볼륨 자동 감소 (50% → 30% → 20%)                       │
│                                                                             │
│  3. 정보 전달: 사운드만으로 상태 파악 가능                                 │
│     └─ 성공 = 상승 음계, 실패 = 하강 음계                                  │
│                                                                             │
│  4. 공간 음향: 화면 위치에 따른 좌우 패닝                                  │
│     └─ 좌측 건물 클릭 → 왼쪽 스피커 강조                                   │
│                                                                             │
│  5. 접근성: 모든 시각적 피드백은 청각 대안 제공                            │
│     └─ 색맹 모드 + 사운드 조합으로 상태 전달                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.13. 성능 목표 및 최적화

### 3.13.1. 성능 기준

| 메트릭            | 목표               | 측정 방법                  |
| :---------------- | :----------------- | :------------------------- |
| **FPS**           | 60fps (최소 30fps) | requestAnimationFrame 측정 |
| **초기 로드**     | < 3초 (LTE)        | Performance API            |
| **인터랙션 지연** | < 100ms            | Input → Visual 변화        |
| **메모리 사용**   | < 200MB            | Chrome DevTools            |
| **번들 크기**     | < 1MB (gzip)       | webpack-bundle-analyzer    |

### 3.13.2. 렌더링 최적화

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      RENDERING OPTIMIZATION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Canvas 레이어 분리]                                                       │
│  ├─ Layer 0: 배경 (정적, 거의 갱신 안 함)                                  │
│  ├─ Layer 1: 그리드/건물 (건설 시만 갱신)                                  │
│  ├─ Layer 2: 컨베이어 아이템 (매 프레임)                                   │
│  ├─ Layer 3: 드론/이펙트 (매 프레임)                                       │
│  └─ Layer 4: UI 오버레이 (이벤트 시)                                       │
│                                                                             │
│  [가시성 컬링]                                                              │
│  ├─ 화면 밖 타일: 렌더링 스킵                                              │
│  ├─ 축소 시: LOD (Level of Detail) 적용                                    │
│  └─ 먼 거리: 단순화된 아이콘으로 대체                                      │
│                                                                             │
│  [배치 렌더링]                                                              │
│  ├─ 동일 스프라이트: 인스턴스 렌더링                                       │
│  ├─ 텍스처 아틀라스: 드로우 콜 최소화                                      │
│  └─ 더티 플래그: 변경된 영역만 다시 그리기                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.13.3. 저사양 모드

| 설정              | 기본 | 저사양 |
| :---------------- | :--- | :----- |
| **파티클**        | 켜기 | 끄기   |
| **애니메이션**    | 전체 | 최소   |
| **그림자**        | 켜기 | 끄기   |
| **안티앨리어싱**  | 켜기 | 끄기   |
| **텍스처 해상도** | 높음 | 중간   |
| **배경 효과**     | 켜기 | 끄기   |

---

## 3.14. 디자인 시스템 토큰

### 3.14.1. CSS 변수 정의

```css
:root {
  /* 색상 */
  --color-bg-primary: #0d1117;
  --color-bg-secondary: #161b22;
  --color-bg-tertiary: #21262d;

  --color-text-primary: #e6edf3;
  --color-text-secondary: #8b949e;
  --color-text-disabled: #484f58;

  --color-accent-primary: #00d4ff;
  --color-accent-secondary: #e63946;
  --color-accent-tertiary: #2d5a27;

  --color-status-success: #10b981;
  --color-status-warning: #f59e0b;
  --color-status-error: #ef4444;
  --color-status-info: #3b82f6;

  /* 간격 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;

  /* 반경 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* 그림자 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);

  /* 전환 */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;

  /* z-index 계층 */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-tooltip: 400;
  --z-toast: 500;
}
```

---

[← 이전: Overlays](./03-d-overlays.md) | [다음: Accessibility →](./03-f-accessibility.md)
