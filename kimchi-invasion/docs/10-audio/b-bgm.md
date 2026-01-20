# 10-B. 배경 음악 시스템 (BGM System)

> **Last Updated:** 2026-01-19
>
> 원본: `10-audio.md` 섹션 10.2

[← 이전: Design Philosophy](./10-a-design.md) | [다음: SFX System →](./10-c-sfx.md)

---

## 10.2. 배경 음악 (BGM) - 적응형 레이어 시스템

### 10.2.1. 레이어 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🎵 적응형 음악 시스템 (Adaptive Music)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Layer 0: 앰비언트 베이스 (항상 재생)                                 │   │
│  │ ─────────────────────────────────────────────────────────────────   │   │
│  │ • 화성 바람 소리 (저주파 럼블, 50Hz 이하)                           │   │
│  │ • 우주 드론 (신스 패드, 매우 느린 진화)                             │   │
│  │ • 볼륨: 기본 25% (다른 레이어에 묻히지 않게)                        │   │
│  │ • 길이: 10분 무한 루프 (심리스 연결)                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              +                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Layer 1: 하모닉 베드 (마일스톤별 변화)                              │   │
│  │ ─────────────────────────────────────────────────────────────────   │   │
│  │ • 진행 단계에 맞는 화성 진행                                        │   │
│  │ • BPM: 60-80 (느린 호흡)                                            │   │
│  │ • 볼륨: 30-50% (동적 조절)                                          │   │
│  │ • 길이: 4분 루프                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              +                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Layer 2: 활동 레이어 (생산 활동 시)                                  │   │
│  │ ─────────────────────────────────────────────────────────────────   │   │
│  │ • 리드미컬한 신스 아르페지오                                         │   │
│  │ • 활성 건물 수에 비례하여 복잡도 증가                               │   │
│  │ • BPM: 80-120 (활동량에 따라)                                       │   │
│  │ • 볼륨: 건물 0개 = 0%, 50개+ = 60%                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              +                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Layer 3: 긴장 레이어 (특수 상황)                                     │   │
│  │ ─────────────────────────────────────────────────────────────────   │   │
│  │ • 전력 부족, 병목 심각, 마감 임박 시                                 │   │
│  │ • 불안한 펄스, 불협화음, 저음 럼블                                   │   │
│  │ • 볼륨: 위험도에 비례 (최대 70%)                                     │   │
│  │ • 즉시 해제 가능 (문제 해결 시 2초 페이드아웃)                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              +                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Layer 4: 성취 레이어 (목표 달성)                                     │   │
│  │ ─────────────────────────────────────────────────────────────────   │   │
│  │ • 밝은 멜로디, 상승하는 코드 진행                                    │   │
│  │ • 원샷 스팅거 (3-8초) + 여운 (15초 페이드)                          │   │
│  │ • 업적 등급에 따라 다른 스케일                                       │   │
│  │ • 프레스티지는 별도 시퀀스                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📊 최종 믹싱 = Σ(Layer × Volume × Situational_Weight)                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.2.2. 레이어 트리거 시스템

```javascript
// 음악 레이어 트리거 조건
const MUSIC_LAYER_TRIGGERS = {
  // Layer 1: 하모닉 베드 변화
  harmonic_bed: {
    milestone_1: {
      track: 'bgm_harmonic_m1_hope.ogg',
      trigger: '첫 번째 건물 배치',
      mood: '호기심, 시작',
    },
    milestone_2: {
      track: 'bgm_harmonic_m2_growth.ogg',
      trigger: '첫 컨베이어 연결',
      mood: '성장, 진보',
    },
    milestone_3: {
      track: 'bgm_harmonic_m3_rhythm.ogg',
      trigger: '첫 자동 생산 라인 완성',
      mood: '리듬, 조화',
    },
    milestone_4: {
      track: 'bgm_harmonic_m4_epic.ogg',
      trigger: '지구 역수출 시작',
      mood: '웅장, 성취',
    },
    milestone_5: {
      track: 'bgm_harmonic_m5_cosmic.ogg',
      trigger: '프레스티지 해금',
      mood: '우주적, 초월',
    },
  },

  // Layer 2: 활동 레이어 강도
  activity: {
    intensity_calculation: gameState => {
      const activeBuildings = gameState.buildings.filter(b => b.isActive).length
      const beltActivity = gameState.belts.getItemsPerSecond()
      const researchActive = gameState.research.isResearching ? 1.2 : 1.0

      return Math.min(1.0, (activeBuildings / 50 + beltActivity / 100) * researchActive)
    },
    layers: [
      { threshold: 0.0, track: null }, // 무음
      { threshold: 0.1, track: 'bgm_activity_light.ogg' },
      { threshold: 0.3, track: 'bgm_activity_medium.ogg' },
      { threshold: 0.6, track: 'bgm_activity_heavy.ogg' },
      { threshold: 0.9, track: 'bgm_activity_intense.ogg' },
    ],
  },

  // Layer 3: 긴장 레이어
  tension: {
    power_low: {
      condition: gs => gs.power.ratio < 0.5,
      track: 'bgm_tension_power.ogg',
      volume_curve: ratio => Math.max(0, (0.5 - ratio) * 2), // 50% → 0vol, 0% → 1vol
    },
    bottleneck: {
      condition: gs => gs.belts.saturatedCount >= 3,
      track: 'bgm_tension_bottleneck.ogg',
      volume_curve: count => Math.min(1, (count - 2) / 5),
    },
    deadline: {
      condition: gs => gs.contracts.nearestDeadline < 120, // 2분 이내
      track: 'bgm_tension_deadline.ogg',
      volume_curve: seconds => Math.max(0, (120 - seconds) / 120),
    },
    disaster: {
      condition: gs => gs.environment.activeDisaster !== null,
      track: 'bgm_tension_disaster.ogg',
      volume: 0.8,
    },
  },

  // Layer 4: 성취 스팅거
  achievement: {
    minor: { track: 'stinger_achievement_minor.ogg', duration: 3 },
    normal: { track: 'stinger_achievement_normal.ogg', duration: 5 },
    major: { track: 'stinger_achievement_major.ogg', duration: 8 },
    legendary: { track: 'stinger_achievement_legendary.ogg', duration: 12 },
  },
}
```

### 10.2.3. 마일스톤별 음악 테마

| 마일스톤           | 테마 이름          | 조성 | BPM | 주요 악기          | 분위기                |
| :----------------- | :----------------- | :--- | :-- | :----------------- | :-------------------- |
| **M1 수동 단계**   | "First Steps"      | Am   | 60  | 패드, 피아노       | 고요, 탐험, 호기심    |
| **M2 자동 채집**   | "Awakening"        | C    | 72  | 신스, 아르페지오   | 희망, 성장의 시작     |
| **M3 가공 자동화** | "The Factory"      | Dm   | 90  | 시퀀서, 베이스     | 리드미컬, 기계적 조화 |
| **M4 역수출 시대** | "Earth Connection" | G    | 100 | 오케스트라, 브라스 | 웅장, 연결, 성취감    |
| **M5 성간 도약**   | "Beyond Mars"      | Em   | 80  | 오르간, 콰이어     | 에픽, 우주적 스케일   |

### 10.2.4. 음악 전환 시스템

```javascript
// 음악 전환 매니저
const MUSIC_TRANSITION_SYSTEM = {
  // 크로스페이드 설정
  crossfade: {
    default_duration: 3000, // 3초
    quick_duration: 500, // 긴급 상황
    slow_duration: 8000, // 마일스톤 전환

    curves: {
      linear: t => t,
      ease_in: t => t * t,
      ease_out: t => 1 - (1 - t) * (1 - t),
      ease_in_out: t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    },
  },

  // 비트 동기화
  beat_sync: {
    enabled: true,
    wait_for_bar: true, // 마디 끝까지 대기
    max_wait_time: 4000, // 최대 4초 대기
    quantize_to: 'bar', // bar | beat | off

    get_next_bar_time: (current_time, bpm, time_signature) => {
      const beat_duration = 60000 / bpm
      const bar_duration = beat_duration * time_signature
      const current_bar_position = current_time % bar_duration
      return bar_duration - current_bar_position
    },
  },

  // 상황별 전환 규칙
  transition_rules: {
    milestone_change: {
      duration: 8000,
      curve: 'ease_in_out',
      sync: true,
      interrupt_tension: true, // 긴장 레이어 해제
    },
    tension_start: {
      duration: 500,
      curve: 'ease_in',
      sync: false, // 즉시 시작
      blend_with_current: true,
    },
    tension_end: {
      duration: 2000,
      curve: 'ease_out',
      sync: false,
    },
    achievement: {
      duration: 0, // 스팅거는 즉시
      duck_other_layers: 0.5, // 다른 레이어 50%로
      duck_duration: 3000,
    },
  },
}
```

---

[← 이전: Design Philosophy](./10-a-design.md) | [다음: SFX System →](./10-c-sfx.md)
