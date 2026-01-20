# 10-E. 오디오 최적화 (Accessibility, Mobile, Settings)

> **Last Updated:** 2026-01-19
>
> 원본: `10-audio.md` 섹션 10.6~10.8

[← 이전: Ambience & Spatial](./10-d-ambience-spatial.md) | [다음: Implementation →](./10-f-implementation.md)

---

## 10.6. 오디오 접근성

### 10.6.1. 접근성 기능

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ♿ 오디오 접근성 기능                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🔇 청각 장애 지원                                                          │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  • 시각적 사운드 표시기 (Visual Sound Indicator)                            │
│    ┌──────────────────────────────────────────────────────────────────┐    │
│    │  🔊 사운드 이벤트 시각화                                          │    │
│    │                                                                  │    │
│    │  [!] 경고: 전력 부족        ← 화면 가장자리 빨간 깜빡임          │    │
│    │  [✓] 완료: 연구 끝          ← 녹색 펄스 + 아이콘                 │    │
│    │  [🏭] 기계: 가동 중         ← 건물 위 진동 효과                  │    │
│    │                                                                  │    │
│    └──────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  • 자막 시스템 (Subtitles)                                                  │
│    - 환경 사운드 설명: "[화성 바람 소리]"                                   │
│    - 기계 상태: "[발효 탱크 완료]"                                          │
│    - 경고 표시: "[경고: 전력 10%]"                                          │
│    - 위치 표시: "[왼쪽에서 폭발음]"                                         │
│                                                                             │
│  • 햅틱 피드백 (모바일)                                                     │
│    - 중요 이벤트: 강한 진동                                                 │
│    - UI 피드백: 약한 탭                                                     │
│    - 경고: 반복 진동                                                        │
│                                                                             │
│  🎧 난청 지원                                                               │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  • 주파수 압축                                                              │
│    - 고주파 정보를 저주파로 시프트                                         │
│    - 난청 영역 보정                                                         │
│                                                                             │
│  • 모노 오디오 옵션                                                         │
│    - 스테레오 → 모노 다운믹스                                              │
│    - 단측 청력 손실 지원                                                    │
│                                                                             │
│  • 볼륨 부스트                                                              │
│    - 알림 사운드 강조 (+6dB 옵션)                                          │
│    - 배경음 자동 감소                                                       │
│                                                                             │
│  🎵 인지 접근성                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  • 단순화 모드                                                              │
│    - 복잡한 레이어 사운드 → 단일 대표음                                    │
│    - 동시 재생 제한 (최대 3개)                                              │
│                                                                             │
│  • 예측 가능한 패턴                                                         │
│    - 일관된 사운드 → 행동 매핑                                             │
│    - 급격한 소리 변화 회피                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.6.2. 접근성 설정 UI

```javascript
// 접근성 오디오 설정
const AUDIO_ACCESSIBILITY_OPTIONS = {
  // 시각적 사운드 표시
  visual_sound_indicator: {
    enabled: false,
    default: false,
    description: '중요한 소리를 화면에 시각적으로 표시합니다',

    options: {
      show_direction: true, // 소리 방향 표시
      show_intensity: true, // 소리 강도 표시
      icon_size: 'medium', // small | medium | large
      position: 'edge', // edge | corner | overlay
    },
  },

  // 자막
  subtitles: {
    enabled: false,
    default: false,
    description: '소리 이벤트를 텍스트로 표시합니다',

    options: {
      background_opacity: 0.7,
      font_size: 'medium',
      duration: 3000, // ms
      max_simultaneous: 3,
      show_speaker: true, // [기계], [환경] 등
    },
  },

  // 모노 오디오
  mono_audio: {
    enabled: false,
    default: false,
    description: '스테레오를 모노로 변환합니다 (단측 청력 지원)',
  },

  // 햅틱 피드백
  haptic_feedback: {
    enabled: true,
    default: true,
    description: '중요한 이벤트에 진동 피드백을 제공합니다',

    options: {
      intensity: 'medium', // light | medium | strong
      ui_feedback: true,
      event_feedback: true,
      alert_feedback: true,
    },
  },

  // 사운드 프로파일 (프리셋)
  preset_profiles: {
    default: {
      name: '기본',
      settings: {
        /* 기본 설정 */
      },
    },
    hearing_impaired: {
      name: '청각 지원',
      settings: {
        visual_sound_indicator: true,
        subtitles: true,
        haptic_feedback: true,
        boost_alerts: true,
      },
    },
    low_hearing: {
      name: '난청 지원',
      settings: {
        mono_audio: true,
        boost_alerts: true,
        frequency_compression: true,
      },
    },
    sensitive_hearing: {
      name: '청각 과민',
      settings: {
        max_volume: 0.5,
        disable_sudden_sounds: true,
        smooth_transitions: true,
      },
    },
  },
}
```

---

## 10.7. 모바일 오디오 최적화

### 10.7.1. 모바일 특화 처리

```javascript
// 모바일 오디오 시스템
const MOBILE_AUDIO_SYSTEM = {
  // 자동 재생 정책 대응
  autoplay_unlock: {
    // 첫 터치에서 오디오 컨텍스트 시작
    unlock_on_first_touch: true,

    // 무음 오디오로 미리 시작
    silent_priming: {
      enabled: true,
      file: 'silence_100ms.ogg',
    },

    // 언락 후 페이드인
    post_unlock_fadein: 500, // ms
  },

  // 배터리 절약 모드
  battery_saver: {
    // 감지 조건
    detect_low_battery: true,
    battery_threshold: 0.2, // 20%

    // 절약 조치
    actions: {
      reduce_polyphony: true, // 동시 재생 50% 감소
      disable_reverb: true, // 리버브 끄기
      disable_spatial: true, // 공간 오디오 끄기
      reduce_sample_rate: true, // 22050Hz로 다운
      compress_dynamic_range: true,
    },
  },

  // 백그라운드 오디오
  background_audio: {
    // 앱이 백그라운드로 갈 때
    on_background: {
      pause_bgm: true,
      pause_sfx: true,
      continue_alerts: false, // 알림도 일시정지
    },

    // 포그라운드 복귀 시
    on_foreground: {
      resume_delay: 200, // ms
      fade_in_duration: 1000,
    },
  },

  // 폰 스피커 vs 이어폰 감지
  output_detection: {
    detect_headphones: true,

    // 스피커 모드 시
    speaker_mode: {
      mono_mix: true, // 폰 스피커는 모노
      bass_boost: true, // 저음 보강
      compress_dynamics: true, // 다이나믹 압축
    },

    // 이어폰/헤드폰 모드 시
    headphone_mode: {
      full_stereo: true,
      enable_spatial: true,
      wider_stereo: true, // 스테레오 확장
    },
  },

  // 인터럽트 처리
  interruption_handling: {
    // 전화 수신 시
    phone_call: {
      duck_audio: true,
      duck_level: 0.1,
      resume_after: true,
    },

    // 알림 시
    notification: {
      duck_audio: true,
      duck_level: 0.5,
      duck_duration: 2000,
    },

    // Siri/Assistant 활성화 시
    voice_assistant: {
      pause_all: true,
    },
  },
}
```

### 10.7.2. 모바일 파일 최적화

```javascript
// 모바일용 오디오 에셋 최적화
const MOBILE_ASSET_OPTIMIZATION = {
  // 파일 포맷 선택
  format_selection: {
    ios: {
      preferred: 'aac',
      fallback: 'mp3',
      reason: 'iOS 하드웨어 디코딩',
    },
    android: {
      preferred: 'ogg',
      fallback: 'mp3',
      reason: '안드로이드 네이티브 지원',
    },
    web_mobile: {
      preferred: 'ogg',
      fallback: 'mp3',
      reason: '웹 오디오 호환성',
    },
  },

  // 품질 단계
  quality_tiers: {
    high: {
      sample_rate: 44100,
      bitrate: 128,
      use_when: 'Wi-Fi, 충분한 스토리지',
    },
    medium: {
      sample_rate: 22050,
      bitrate: 64,
      use_when: '기본 모바일',
    },
    low: {
      sample_rate: 16000,
      bitrate: 32,
      use_when: '저사양, 데이터 절약',
    },
  },

  // 동적 로딩
  dynamic_loading: {
    // 즉시 로드 (필수)
    immediate: ['ui_sounds/*', 'alerts/*', 'amb_base.ogg'],

    // 지연 로드 (튜토리얼 중)
    deferred: ['sfx_production/*', 'sfx_building/*'],

    // 온디맨드 (필요 시)
    on_demand: ['bgm_milestone_*', 'sfx_achievement_*', 'amb_weather_*'],

    // 스트리밍 (대용량)
    streaming: ['bgm_ambient_*.ogg'],
  },
}
```

---

## 10.8. 오디오 설정 UI

### 10.8.1. 설정 화면 구조

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         🔧 오디오 설정                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ◆ 볼륨 조절                                                                │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  마스터 볼륨      [████████████████░░░░] 80%           [🔊]                 │
│                                                                             │
│  ├─ 음악 (BGM)   [████████████░░░░░░░░] 60%           [🎵]                 │
│  ├─ 효과음 (SFX) [████████████████████] 100%          [🔔]                 │
│  ├─ 환경음       [████████░░░░░░░░░░░░] 40%           [🌍]                 │
│  └─ UI 사운드    [████████████████░░░░] 80%           [🖱️]                 │
│                                                                             │
│  [🔊 테스트] 각 카테고리 테스트 재생                                        │
│                                                                             │
│  ◆ 음악 설정                                                                │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [✓] 적응형 음악 활성화                                                     │
│      게임 상황에 따라 음악이 자동으로 변화합니다                             │
│                                                                             │
│  [✓] 비트 동기화 전환                                                       │
│      음악 전환 시 박자에 맞춰 부드럽게 변경합니다                            │
│                                                                             │
│  [ ] 긴장 음악 비활성화                                                     │
│      위기 상황의 긴박한 음악을 끕니다                                        │
│                                                                             │
│  ◆ 효과음 설정                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [✓] 공장 환경음 활성화                                                     │
│      건물 가동 시 환경음이 재생됩니다                                        │
│                                                                             │
│  [✓] UI 피드백 사운드                                                       │
│      버튼 클릭, 메뉴 조작 시 소리가 납니다                                   │
│                                                                             │
│  [ ] 반복 사운드 제한                                                       │
│      자주 재생되는 효과음의 빈도를 줄입니다                                  │
│                                                                             │
│  ◆ 공간 오디오                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [✓] 3D 오디오 활성화                                                       │
│      건물 위치에 따라 소리 방향이 달라집니다                                 │
│                                                                             │
│  [ ] 헤드폰 HRTF 모드 (권장: 이어폰 사용 시)                                │
│      더 정확한 3D 공간감을 제공합니다                                        │
│                                                                             │
│  ◆ 시스템 설정                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [ ] 백그라운드에서 음소거                                                  │
│      다른 탭/앱 사용 시 자동으로 음소거합니다                                │
│                                                                             │
│  [✓] 저전력 모드 시 자동 최적화                                             │
│      배터리가 부족할 때 오디오 품질을 낮춥니다                               │
│                                                                             │
│  ◆ 접근성                                                                   │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [ ] 시각적 사운드 표시기                                                   │
│  [ ] 소리 이벤트 자막                                                       │
│  [ ] 모노 오디오 (단측 청력 지원)                                           │
│  [✓] 햅틱 피드백 (모바일)                                                   │
│                                                                             │
│  [프리셋: 기본 ▼]  [초기화]  [적용]                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.8.2. 설정 데이터 구조

```javascript
// 오디오 설정 데이터 구조
const AUDIO_SETTINGS_SCHEMA = {
  version: 1,

  volume: {
    master: { type: 'number', min: 0, max: 1, default: 0.8 },
    bgm: { type: 'number', min: 0, max: 1, default: 0.6 },
    sfx: { type: 'number', min: 0, max: 1, default: 1.0 },
    ambience: { type: 'number', min: 0, max: 1, default: 0.4 },
    ui: { type: 'number', min: 0, max: 1, default: 0.8 },
  },

  music: {
    adaptive_enabled: { type: 'boolean', default: true },
    beat_sync_transitions: { type: 'boolean', default: true },
    tension_music_enabled: { type: 'boolean', default: true },
  },

  sfx: {
    factory_ambience: { type: 'boolean', default: true },
    ui_feedback: { type: 'boolean', default: true },
    limit_repetition: { type: 'boolean', default: false },
    repetition_limit_ms: { type: 'number', default: 100 },
  },

  spatial: {
    enabled_3d: { type: 'boolean', default: true },
    hrtf_mode: { type: 'boolean', default: false },
  },

  system: {
    mute_on_background: { type: 'boolean', default: false },
    low_power_optimization: { type: 'boolean', default: true },
  },

  accessibility: {
    visual_indicator: { type: 'boolean', default: false },
    subtitles: { type: 'boolean', default: false },
    mono_audio: { type: 'boolean', default: false },
    haptic_feedback: { type: 'boolean', default: true },
  },
}
```

---

[← 이전: Ambience & Spatial](./10-d-ambience-spatial.md) | [다음: Implementation →](./10-f-implementation.md)
