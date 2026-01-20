# 10-C. 효과음 시스템 (SFX System)

> **Last Updated:** 2026-01-19
>
> 원본: `10-audio.md` 섹션 10.3

[← 이전: BGM System](./10-b-bgm.md) | [다음: Ambience & Spatial →](./10-d-ambience-spatial.md)

---

## 10.3. 효과음 (SFX) 시스템

### 10.3.1. SFX 카테고리 및 사양

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🔊 효과음 카테고리 (8종, 120+ SFX)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ◆ UI 사운드 (15종)                                                         │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ui_click_primary      : 주 버튼 클릭 (800Hz 클릭, 50ms)                   │
│  ui_click_secondary    : 보조 버튼 클릭 (600Hz, 40ms)                      │
│  ui_hover              : 호버 피드백 (미세한 톤, 20ms)                      │
│  ui_open_menu          : 메뉴 열기 (상승 스윕, 150ms)                       │
│  ui_close_menu         : 메뉴 닫기 (하강 스윕, 100ms)                       │
│  ui_tab_switch         : 탭 전환 (부드러운 클릭, 60ms)                      │
│  ui_slider_tick        : 슬라이더 눈금 (매우 짧은 틱, 15ms)                 │
│  ui_toggle_on          : 토글 켜기 (상승 2음, 100ms)                        │
│  ui_toggle_off         : 토글 끄기 (하강 2음, 100ms)                        │
│  ui_error              : 에러/거부 (불협화음, 200ms)                        │
│  ui_success            : 성공 (밝은 2음, 150ms)                             │
│  ui_notification       : 알림 도착 (부드러운 차임, 300ms)                   │
│  ui_typing             : 텍스트 입력 (타자기 클릭, 30ms)                    │
│  ui_scroll             : 스크롤 (미세한 스윕, 연속)                         │
│  ui_tooltip            : 툴팁 표시 (미세한 팝, 50ms)                        │
│                                                                             │
│  ◆ 건설 사운드 (12종)                                                       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  build_place_small     : 소형 건물 배치 (금속 임팩트, 200ms)                │
│  build_place_medium    : 중형 건물 배치 (무거운 쿵, 300ms)                  │
│  build_place_large     : 대형 건물 배치 (깊은 임팩트 + 반향, 500ms)         │
│  build_rotate          : 건물 회전 (기계적 클릭, 100ms)                     │
│  build_delete          : 건물 철거 (분해음 + 금속 파편, 400ms)              │
│  build_invalid         : 배치 불가 (거부음, 150ms)                          │
│  belt_place            : 벨트 배치 (금속 스냅, 80ms)                        │
│  belt_extend           : 벨트 연장 (연속 스냅, 반복)                        │
│  belt_connect          : 벨트 연결 완료 (연결 확인음, 150ms)                │
│  inserter_place        : 투입기 배치 (기계 암 설치, 200ms)                  │
│  upgrade_start         : 업그레이드 시작 (상승 톤 + 전자음, 300ms)          │
│  upgrade_complete      : 업그레이드 완료 (성공 팡파르, 500ms)               │
│                                                                             │
│  ◆ 생산 사운드 (20종)                                                       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  machine_start         : 기계 시작 (엔진 점화, 400ms)                       │
│  machine_loop_idle     : 대기 상태 루프 (저음 험, 연속)                     │
│  machine_loop_active   : 가동 상태 루프 (리드미컬 기계음, 연속)             │
│  machine_stop          : 기계 정지 (감속 + 정지, 600ms)                     │
│  item_craft_start      : 제작 시작 (작업 시작음, 100ms)                     │
│  item_craft_complete   : 제작 완료 (완성 팝, 200ms)                         │
│  item_move             : 아이템 이동 (부드러운 스윕, 80ms)                  │
│  ferment_bubble        : 발효 버블 (물거품 + 생물학적, 150ms)               │
│  ferment_ready         : 발효 완료 (부드러운 차임 + 버블, 400ms)            │
│  forge_fire            : 용광로 불 (크래클 + 럼블, 연속)                    │
│  forge_pour            : 주조 (금속 흐름, 800ms)                            │
│  press_hydraulic       : 유압 프레스 (압축 + 해제, 600ms)                   │
│  mixer_blend           : 믹서 작동 (회전 + 섞임, 연속)                      │
│  cutter_slice          : 절단기 (날카로운 절단, 200ms)                      │
│  wash_water            : 세척 (물 스플래시, 500ms)                          │
│  pack_seal             : 포장 밀봉 (진공 + 씰, 300ms)                       │
│  juice_extract         : 착즙 (압착 + 액체 흐름, 400ms)                     │
│  salt_sprinkle         : 소금 뿌리기 (입자 낙하, 200ms)                     │
│  kimchi_mix            : 김치 버무리기 (젖은 섞임, 연속)                    │
│  jar_fill              : 항아리 채우기 (내용물 떨어짐, 600ms)               │
│                                                                             │
│  ◆ 물류 사운드 (12종)                                                       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  belt_move_loop        : 벨트 이동 루프 (기계 험, 연속)                     │
│  belt_item_pass        : 아이템 통과 (부드러운 클릭, 30ms)                  │
│  belt_jam              : 벨트 정체 (삐걱 + 경고, 300ms)                     │
│  inserter_grab         : 투입기 집기 (기계 암 동작, 150ms)                  │
│  inserter_place        : 투입기 놓기 (배치 + 해제, 150ms)                   │
│  inserter_loop         : 투입기 반복 동작 (리드미컬, 연속)                  │
│  splitter_split        : 분배기 분할 (분기 클릭, 100ms)                     │
│  underground_enter     : 지하 벨트 진입 (하강 스윕, 200ms)                  │
│  underground_exit      : 지하 벨트 출구 (상승 스윕, 200ms)                  │
│  drone_launch          : 드론 발사 (추진 + 상승, 500ms)                     │
│  drone_fly_loop        : 드론 비행 (프로펠러 험, 연속)                      │
│  drone_pickup          : 드론 수거 (하강 + 집기, 400ms)                     │
│                                                                             │
│  ◆ 에너지 사운드 (10종)                                                     │
│  ─────────────────────────────────────────────────────────────────────────  │
│  power_on              : 전력 공급 시작 (상승 험 + 점등, 400ms)             │
│  power_off             : 전력 차단 (하강 + 꺼짐, 300ms)                     │
│  power_low_warning     : 저전력 경고 (반복 비프, 500ms 주기)                │
│  power_critical        : 전력 위기 (급박한 경보, 300ms 주기)                │
│  solar_charge          : 태양광 충전 (전자 험 + 상승, 연속)                 │
│  solar_night           : 태양광 야간 (감소 톤, 1000ms)                      │
│  generator_hum         : 발전기 험 (저주파 진동, 연속)                      │
│  generator_strain      : 발전기 과부하 (불안정 험, 연속)                    │
│  fusion_pulse          : 핵융합 펄스 (깊은 펄스 + 에너지, 800ms)            │
│  megapack_discharge    : 메가팩 방전 (전기 크래클, 400ms)                   │
│                                                                             │
│  ◆ 환경 사운드 (15종)                                                       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  mars_wind_light       : 화성 바람 약 (미세한 럼블, 연속)                   │
│  mars_wind_heavy       : 화성 바람 강 (모래 입자 + 럼블, 연속)              │
│  mars_quake            : 화성 지진 (저주파 럼블 + 진동, 3000ms)             │
│  dust_storm_approach   : 먼지 폭풍 접근 (원거리 럼블, 연속 증가)            │
│  dust_storm_active     : 먼지 폭풍 활성 (강한 바람 + 충격, 연속)            │
│  radiation_burst       : 방사선 폭발 (전자 크래클, 500ms)                   │
│  meteor_incoming       : 운석 접근 (휘슬 + 증가, 2000ms)                    │
│  meteor_impact         : 운석 충돌 (폭발 임팩트, 1500ms)                    │
│  indoor_ambience       : 실내 앰비언스 (공기 순환, 밀폐감, 연속)            │
│  outdoor_ambience      : 실외 앰비언스 (희박한 대기, 연속)                  │
│  airlock_cycle         : 에어락 사이클 (가압/감압, 2000ms)                  │
│  day_transition        : 낮 전환 (밝아지는 톤, 3000ms)                      │
│  night_transition      : 밤 전환 (어두워지는 톤, 3000ms)                    │
│  communication_static  : 통신 정적 (라디오 노이즈, 연속)                    │
│  communication_clear   : 통신 연결 (클리어 톤, 500ms)                       │
│                                                                             │
│  ◆ 알림/성취 사운드 (14종)                                                  │
│  ─────────────────────────────────────────────────────────────────────────  │
│  alert_info            : 정보 알림 (부드러운 차임, 400ms)                   │
│  alert_warning         : 경고 알림 (주의 비프 × 2, 600ms)                   │
│  alert_critical        : 위기 알림 (급박한 경보, 800ms)                     │
│  achievement_minor     : 소형 업적 (작은 팡파르, 600ms)                     │
│  achievement_normal    : 일반 업적 (중간 팡파르, 1000ms)                    │
│  achievement_major     : 대형 업적 (큰 팡파르 + 심벌, 1500ms)               │
│  achievement_legendary : 전설 업적 (에픽 팡파르 + 콰이어, 3000ms)           │
│  achievement_secret    : 숨겨진 업적 (미스터리 톤 + 팡파르, 2000ms)         │
│  milestone_reach       : 마일스톤 도달 (웅장한 브라스, 2000ms)              │
│  research_complete     : 연구 완료 (디지털 상승 + 확인, 1000ms)             │
│  contract_accept       : 계약 수락 (서명 사운드, 500ms)                     │
│  contract_complete     : 계약 완료 (성공 팡파르, 1200ms)                    │
│  prestige_initiate     : 프레스티지 시작 (에픽 시작, 3000ms)                │
│  prestige_complete     : 프레스티지 완료 (우주적 해소, 5000ms)              │
│                                                                             │
│  ◆ 캐릭터 사운드 (10종) [추후 확장]                                         │
│  ─────────────────────────────────────────────────────────────────────────  │
│  character_walk        : 걷기 (발자국, 스테이지별)                          │
│  character_run         : 뛰기 (빠른 발자국)                                 │
│  character_interact    : 상호작용 (터치/클릭)                               │
│  character_idle        : 대기 (미세한 움직임)                               │
│  character_celebrate   : 축하 (기쁨 표현)                                   │
│  character_frustrated  : 좌절 (한숨/불만)                                   │
│  character_thinking    : 생각 중 (흠흠)                                     │
│  character_eureka      : 발견 (유레카 느낌)                                 │
│  suit_helmet_on        : 헬멧 착용 (밀폐 + 에어)                            │
│  suit_helmet_off       : 헬멧 탈착 (해제 + 공기)                            │
│                                                                             │
│  총 SFX: 108종 (추후 확장 예정)                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.3.2. SFX 기술 사양

```javascript
// SFX 기술 사양
const SFX_TECHNICAL_SPEC = {
  // 파일 포맷
  format: {
    primary: 'ogg', // 메인 포맷 (브라우저 호환성 최고)
    fallback: 'mp3', // Safari 폴백
    sample_rate: 44100, // Hz
    bit_depth: 16, // bits
    channels: 'mono', // UI/SFX는 모노로 용량 절약
    normalization: -3, // dBFS (헤드룸 확보)
  },

  // 용량 제한
  file_size: {
    ui_sounds: { max_kb: 20, typical: 5 },
    build_sounds: { max_kb: 50, typical: 20 },
    production_sounds: { max_kb: 80, typical: 40 },
    ambient_loops: { max_kb: 200, typical: 100 },
    achievement_stingers: { max_kb: 150, typical: 80 },

    total_sfx_budget: 5 * 1024, // 5MB 총 예산
  },

  // 동시 재생 제한
  polyphony: {
    ui_sounds: 3, // 동시 UI 사운드
    build_sounds: 5, // 동시 건설 사운드
    production_sounds: 20, // 동시 생산 사운드 (공장 특성상 많음)
    ambient_loops: 8, // 동시 환경음

    priority_system: {
      critical_alert: 100, // 최우선
      achievement: 90,
      ui_feedback: 80,
      production: 50,
      ambient: 30,
      background: 10,
    },
  },

  // 3D 오디오 (웹 오디오 API)
  spatial: {
    enabled: true,
    model: 'HRTF', // Head-Related Transfer Function
    distance_model: 'inverse',
    ref_distance: 100, // 기준 거리 (게임 유닛)
    max_distance: 1000,
    rolloff_factor: 1.5,

    // 카메라 리스너 설정
    listener_follows_camera: true,
    doppler_factor: 0.5, // 도플러 효과 약하게
  },
}
```

### 10.3.3. SFX 변형 시스템 (Variation)

```javascript
// 반복 피로 방지를 위한 SFX 변형 시스템
const SFX_VARIATION_SYSTEM = {
  // 랜덤 피치 변형
  pitch_variation: {
    ui_sounds: { min: 0.98, max: 1.02 }, // ±2%
    build_sounds: { min: 0.95, max: 1.05 }, // ±5%
    production_sounds: { min: 0.9, max: 1.1 }, // ±10%

    // 연속 재생 시 패턴 회피
    avoid_repetition: true,
    min_pitch_change: 0.02, // 이전 대비 최소 변화량
  },

  // 라운드 로빈 변형
  round_robin: {
    enabled: true,
    // 자주 사용되는 사운드에 대해 여러 버전 준비
    sounds_with_variants: {
      belt_item_pass: 4, // 4가지 버전
      machine_loop_active: 3,
      inserter_grab: 3,
      ui_click_primary: 2,
      ferment_bubble: 5, // 버블은 다양하게
    },

    // 셔플 재생 (연속 동일 버전 방지)
    shuffle: true,
    min_gap_before_repeat: 2,
  },

  // 동적 레이어링
  dynamic_layering: {
    enabled: true,

    // 강도에 따른 레이어 추가
    intensity_layers: {
      machine_loop_active: {
        base: 'machine_loop_base.ogg',
        layers: [
          { threshold: 0.3, file: 'machine_loop_layer1.ogg' },
          { threshold: 0.6, file: 'machine_loop_layer2.ogg' },
          { threshold: 0.9, file: 'machine_loop_layer3.ogg' },
        ],
      },
    },
  },
}
```

---

[← 이전: BGM System](./10-b-bgm.md) | [다음: Ambience & Spatial →](./10-d-ambience-spatial.md)
