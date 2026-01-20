# 10-D. 환경음 & 공간 오디오 (Ambience & Spatial Audio)

> **Last Updated:** 2026-01-19
>
> 원본: `10-audio.md` 섹션 10.4~10.5

[← 이전: SFX System](./10-c-sfx.md) | [다음: Optimization →](./10-e-optimization.md)

---

## 10.4. 환경 사운드 (Ambience) 시스템

### 10.4.1. 화성 환경음

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🌍 화성 환경 사운드스케이프                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  화성의 물리적 특성 반영:                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 대기 밀도: 지구의 1% → 소리 전파 약함                                    │
│  • 주요 성분: CO2 → 저주파 공명 특성                                        │
│  • 온도: -60°C 평균 → 건조한 공기감                                         │
│  • 바람: 최대 100km/h → 모래 입자 충격음                                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🏜️ 실외 환경음 레이어                                                │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  Layer A: 기본 바람 (항상)                                          │   │
│  │  ────────────────────────────                                       │   │
│  │  • 저주파 럼블 (20-80Hz)                                            │   │
│  │  • 볼륨: 날씨 상태에 따라 20-60%                                    │   │
│  │  • 루프 길이: 2분 (심리스)                                          │   │
│  │                                                                     │   │
│  │  Layer B: 먼지 입자 (바람 강도에 따라)                              │   │
│  │  ────────────────────────────────────                               │   │
│  │  • 미세한 입자 충격음 (틱틱)                                        │   │
│  │  • 밀도: 바람 속도에 비례                                           │   │
│  │  • 스테레오 패닝: 바람 방향 반영                                    │   │
│  │                                                                     │   │
│  │  Layer C: 고고도 바람 (항상, 미세)                                  │   │
│  │  ──────────────────────────────                                     │   │
│  │  • 고주파 휘파람 (멀리서)                                           │   │
│  │  • 볼륨: 5-15% (공간감 부여)                                        │   │
│  │  • 리버브: 넓은 화성 지형 느낌                                      │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🏠 실내 환경음 레이어                                                │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  Layer A: 생명유지장치 (항상)                                       │   │
│  │  ──────────────────────────────                                     │   │
│  │  • 공기 순환 팬 (저음 험)                                           │   │
│  │  • CO2 스크러버 (주기적 클릭)                                       │   │
│  │  • 산소 발생기 (미세한 버블)                                        │   │
│  │  • 볼륨: 20-30%                                                     │   │
│  │                                                                     │   │
│  │  Layer B: 구조물 크리킹 (온도 변화 시)                              │   │
│  │  ────────────────────────────────────                               │   │
│  │  • 금속 팽창/수축 소리                                              │   │
│  │  • 낮↔밤 전환 시 활성화                                             │   │
│  │  • 간헐적, 예측 불가능                                              │   │
│  │                                                                     │   │
│  │  Layer C: 외부 바람 (필터링됨)                                      │   │
│  │  ──────────────────────────────                                     │   │
│  │  • 실외 바람의 로우패스 필터 버전                                   │   │
│  │  • 벽을 통한 둔탁한 진동                                            │   │
│  │  • 볼륨: 실외의 30%                                                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.4.2. 공장 환경음 (동적 믹싱)

```javascript
// 공장 환경음 동적 믹싱 시스템
const FACTORY_AMBIENCE_SYSTEM = {
  // 활성 건물에 따른 앰비언스 강도
  building_contribution: {
    // 각 건물 타입의 사운드 기여도
    building_sounds: {
      miner: { loop: 'amb_miner.ogg', volume: 0.3, radius: 150 },
      assembler: { loop: 'amb_assembler.ogg', volume: 0.4, radius: 100 },
      fermentation_tank: { loop: 'amb_ferment.ogg', volume: 0.35, radius: 80 },
      forge: { loop: 'amb_forge.ogg', volume: 0.5, radius: 120 },
      greenhouse: { loop: 'amb_greenhouse.ogg', volume: 0.2, radius: 60 },
      solar_panel: { loop: 'amb_solar.ogg', volume: 0.15, radius: 50 },
      generator: { loop: 'amb_generator.ogg', volume: 0.6, radius: 200 },
      lab: { loop: 'amb_lab.ogg', volume: 0.25, radius: 80 },
    },

    // 벨트 사운드 (아이템 밀도에 따라)
    belt_ambient: {
      loop: 'amb_belt_system.ogg',
      volume_curve: items_per_second => Math.min(0.5, items_per_second / 100),
      global: true, // 위치 무관
    },
  },

  // 총합 볼륨 계산
  calculate_factory_volume: gameState => {
    let totalVolume = 0
    const cameraPos = gameState.camera.position

    for (const building of gameState.buildings) {
      if (!building.isActive) continue

      const spec = building_sounds[building.type]
      if (!spec) continue

      const distance = calculateDistance(cameraPos, building.position)
      const distanceFalloff = Math.max(0, 1 - distance / spec.radius)

      totalVolume += spec.volume * distanceFalloff * building.efficiency
    }

    return Math.min(0.7, totalVolume) // 최대 70%로 제한
  },

  // 청각적 복잡도 단계
  complexity_levels: {
    silent: { buildings: 0, description: '조용한 화성' },
    minimal: { buildings: 5, description: '초기 정착지' },
    active: { buildings: 15, description: '활발한 공장' },
    busy: { buildings: 30, description: '산업 단지' },
    megabase: { buildings: 100, description: '거대 시설' },
  },
}
```

### 10.4.3. 시간/날씨 기반 환경음

```javascript
// 시간 및 날씨에 따른 환경음 변화
const TIME_WEATHER_AMBIENCE = {
  // 하루 주기 (Sol = 화성 하루)
  day_cycle: {
    dawn: {
      // 새벽
      duration_hours: 2,
      ambient: 'amb_mars_dawn.ogg',
      characteristics: '고요함, 첫 빛, 온도 상승',
      solar_charge_sound: 'ramp_up',
    },
    day: {
      // 낮
      duration_hours: 10,
      ambient: 'amb_mars_day.ogg',
      characteristics: '태양광 활성, 따뜻함',
      solar_charge_sound: 'steady',
    },
    dusk: {
      // 황혼
      duration_hours: 2,
      ambient: 'amb_mars_dusk.ogg',
      characteristics: '온도 하락, 바람 증가',
      solar_charge_sound: 'ramp_down',
    },
    night: {
      // 밤
      duration_hours: 10,
      ambient: 'amb_mars_night.ogg',
      characteristics: '극저온, 별, 조용함',
      solar_charge_sound: 'silent',
    },
  },

  // 날씨 이벤트
  weather_events: {
    clear: {
      wind_volume: 0.3,
      dust_density: 0.1,
      visibility: 'high',
    },
    windy: {
      wind_volume: 0.6,
      dust_density: 0.4,
      additional_sound: 'wind_gust.ogg',
      gust_frequency: 15, // 초
    },
    dust_storm: {
      wind_volume: 0.9,
      dust_density: 1.0,
      additional_sound: 'dust_storm_loop.ogg',
      impact_sounds: true,
      solar_efficiency: 0.1,
    },
    cold_snap: {
      wind_volume: 0.4,
      ice_crystal_sound: 'ice_wind.ogg',
      structure_stress_sounds: true,
    },
  },
}
```

---

## 10.5. 공간 오디오 (Spatial Audio)

### 10.5.1. 3D 오디오 구현

```javascript
// Web Audio API 기반 공간 오디오 시스템
const SPATIAL_AUDIO_SYSTEM = {
  // 리스너 설정 (카메라 기반)
  listener: {
    position_source: 'camera', // camera | player_character
    orientation_source: 'camera_direction',

    update_rate: 60, // Hz
    interpolation: true, // 부드러운 이동
  },

  // 소스 타입별 공간화 설정
  source_types: {
    // 건물 사운드 (위치 기반)
    building: {
      spatial: true,
      panning_model: 'HRTF',
      distance_model: 'inverse',
      ref_distance: 50,
      max_distance: 500,
      rolloff_factor: 1.0,

      // 건물 크기에 따른 소스 크기
      cone: {
        inner_angle: 360,
        outer_angle: 360,
        outer_gain: 1.0,
      },
    },

    // UI 사운드 (2D)
    ui: {
      spatial: false,
      stereo: true,
      center_panned: true,
    },

    // 환경음 (3D + 앰비소닉)
    ambience: {
      spatial: true,
      panning_model: 'equalpower',
      omnidirectional: true,

      // 앰비소닉 디코딩 (가능한 경우)
      ambisonics: {
        enabled: true,
        order: 1, // First-order ambisonics
        decoder: 'binaural',
      },
    },

    // 알림 사운드 (2D, 중앙)
    notification: {
      spatial: false,
      priority: 'high',
      duck_other_sounds: 0.3,
    },
  },

  // 카메라 줌에 따른 믹싱
  zoom_mixing: {
    // 줌 아웃 시 개별 건물 → 총합 앰비언스
    close_zoom: {
      individual_buildings: 1.0,
      factory_ambience: 0.3,
    },
    medium_zoom: {
      individual_buildings: 0.6,
      factory_ambience: 0.6,
    },
    far_zoom: {
      individual_buildings: 0.2,
      factory_ambience: 1.0,
    },
  },
}
```

### 10.5.2. 거리 기반 볼륨 시스템 (간소화)

> **⚠️ MVP 간소화 결정 (2026-01-19)**
>
> - 컨볼루션 리버브 시스템 **삭제** (Post-Launch 검토)
> - 오클루전/차폐 시스템 **삭제** (Post-Launch 검토)
> - **거리 기반 볼륨 감쇠만 유지** (MVP 핵심)

```javascript
// MVP: 거리 기반 볼륨 시스템 (간소화)
const DISTANCE_VOLUME_SYSTEM = {
  // 거리 감쇠 설정
  distance_attenuation: {
    enabled: true,
    model: 'inverse', // 역거리 감쇠
    ref_distance: 50, // 기준 거리 (100% 볼륨)
    max_distance: 500, // 최대 거리 (청취 불가)
    rolloff_factor: 1.0, // 감쇠 속도

    // 볼륨 계산: volume = ref_distance / (ref_distance + rolloff * (distance - ref_distance))
    calculate_volume: distance => {
      if (distance <= 50) return 1.0
      if (distance >= 500) return 0.0
      return 50 / (50 + 1.0 * (distance - 50))
    },
  },

  // 카메라 줌 레벨에 따른 청취 범위 조정
  zoom_adjustment: {
    close_zoom: { multiplier: 1.0, description: '개별 건물 소리 명확' },
    medium_zoom: { multiplier: 0.7, description: '근거리 건물만 청취' },
    far_zoom: { multiplier: 0.4, description: '총합 앰비언스 위주' },
  },
}

// Post-Launch 확장 예정 (현재 비활성)
const POST_LAUNCH_AUDIO_FEATURES = {
  convolution_reverb: 'Phase 4+ 검토',
  occlusion_system: 'Phase 4+ 검토',
  hrtf_spatial: 'Phase 4+ 검토',
}
```

---

[← 이전: SFX System](./10-c-sfx.md) | [다음: Optimization →](./10-e-optimization.md)
