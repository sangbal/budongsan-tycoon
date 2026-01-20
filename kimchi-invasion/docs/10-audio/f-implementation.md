# 10-F. 기술 구현 & 에셋 파이프라인 (Implementation & Pipeline)

> **Last Updated:** 2026-01-19
>
> 원본: `10-audio.md` 섹션 10.9~10.11

[← 이전: Optimization](./10-e-optimization.md) | [다음: Localization →](./11-localization.md)

---

## 10.9. 기술 구현: Howler.js + Web Audio API

### 10.9.1. 오디오 매니저 아키텍처

```javascript
// AudioManager 핵심 구조
class AudioManager {
  constructor() {
    // Howler 글로벌 설정
    Howler.autoUnlock = true
    Howler.html5PoolSize = 10

    // 오디오 컨텍스트 (Web Audio API)
    this.audioContext = Howler.ctx

    // 메인 버스 구조
    this.buses = {
      master: this.audioContext.createGain(),
      bgm: this.audioContext.createGain(),
      sfx: this.audioContext.createGain(),
      ambience: this.audioContext.createGain(),
      ui: this.audioContext.createGain(),
    }

    // 버스 연결: 각 버스 → 마스터 → 출력
    Object.keys(this.buses).forEach(key => {
      if (key !== 'master') {
        this.buses[key].connect(this.buses.master)
      }
    })
    this.buses.master.connect(this.audioContext.destination)

    // BGM 레이어 시스템
    this.bgmLayers = {
      ambient: null,
      harmonic: null,
      activity: null,
      tension: null,
      achievement: null,
    }

    // SFX 풀
    this.sfxPool = new Map()

    // 환경음 관리자
    this.ambienceManager = new AmbienceManager(this)

    // 공간 오디오 시스템
    this.spatialSystem = new SpatialAudioSystem(this.audioContext)

    // 설정
    this.settings = this.loadSettings()
  }

  // BGM 레이어 재생
  playBGMLayer(layerName, file, options = {}) {
    const existingLayer = this.bgmLayers[layerName]

    if (existingLayer) {
      // 크로스페이드
      this.crossfade(existingLayer, file, options.crossfadeDuration || 3000)
    } else {
      // 새 레이어 시작
      this.bgmLayers[layerName] = new Howl({
        src: [file],
        loop: true,
        volume: 0,
        html5: true, // 스트리밍 (BGM은 대용량)
        onload: () => {
          this.fadeIn(this.bgmLayers[layerName], options.targetVolume || 0.5)
        },
      })
      this.bgmLayers[layerName].play()
    }
  }

  // SFX 재생 (풀링)
  playSFX(soundId, options = {}) {
    // 풀에서 사운드 가져오기 또는 생성
    let sound = this.sfxPool.get(soundId)

    if (!sound) {
      sound = new Howl({
        src: [`sfx/${soundId}.ogg`, `sfx/${soundId}.mp3`],
        volume: this.settings.volume.sfx,
        pool: 5, // 동시 재생 인스턴스
      })
      this.sfxPool.set(soundId, sound)
    }

    // 피치 변형
    const pitch = options.pitch || this.getRandomPitch(soundId)

    // 공간 오디오 (위치가 있는 경우)
    if (options.position && this.settings.spatial.enabled_3d) {
      const playId = sound.play()
      this.spatialSystem.setPosition(sound, playId, options.position)
    } else {
      sound.play()
    }
  }

  // 크로스페이드
  crossfade(oldSound, newFile, duration) {
    const newSound = new Howl({
      src: [newFile],
      loop: true,
      volume: 0,
      html5: true,
    })

    newSound.play()
    newSound.fade(0, this.settings.volume.bgm, duration)
    oldSound.fade(oldSound.volume(), 0, duration)

    setTimeout(() => {
      oldSound.stop()
      oldSound.unload()
    }, duration)

    return newSound
  }

  // 볼륨 설정
  setVolume(bus, value) {
    this.buses[bus].gain.setValueAtTime(value, this.audioContext.currentTime)
    this.settings.volume[bus] = value
    this.saveSettings()
  }

  // 설정 로드/저장
  loadSettings() {
    const saved = localStorage.getItem('audio_settings')
    return saved ? JSON.parse(saved) : this.getDefaultSettings()
  }

  saveSettings() {
    localStorage.setItem('audio_settings', JSON.stringify(this.settings))
  }
}
```

### 10.9.2. 공간 오디오 구현

```javascript
// 공간 오디오 시스템
class SpatialAudioSystem {
  constructor(audioContext) {
    this.ctx = audioContext
    this.listener = this.ctx.listener

    // 리스너 설정
    this.listener.setPosition(0, 0, 0)
    this.listener.setOrientation(0, 0, -1, 0, 1, 0)

    // 활성 소스 추적
    this.activeSources = new Map()
  }

  // 리스너 위치 업데이트 (카메라 기준)
  updateListener(cameraPosition, cameraDirection) {
    this.listener.setPosition(cameraPosition.x, cameraPosition.y, cameraPosition.z)
    this.listener.setOrientation(
      cameraDirection.x,
      cameraDirection.y,
      cameraDirection.z,
      0,
      1,
      0 // up vector
    )
  }

  // 소스에 공간화 적용
  setPosition(howl, playId, position) {
    // Howler의 내부 노드 접근
    const soundNode = howl._soundById(playId)._node

    // PannerNode 생성
    const panner = this.ctx.createPanner()
    panner.panningModel = 'HRTF'
    panner.distanceModel = 'inverse'
    panner.refDistance = 50
    panner.maxDistance = 500
    panner.rolloffFactor = 1

    panner.setPosition(position.x, position.y, position.z)

    // 연결
    soundNode.disconnect()
    soundNode.connect(panner)
    panner.connect(this.ctx.destination)

    this.activeSources.set(playId, { panner, position })
  }

  // 소스 위치 실시간 업데이트
  updateSourcePosition(playId, newPosition) {
    const source = this.activeSources.get(playId)
    if (source) {
      source.panner.setPosition(newPosition.x, newPosition.y, newPosition.z)
      source.position = newPosition
    }
  }
}
```

---

## 10.10. 오디오 에셋 파이프라인

### 10.10.1. 에셋 제작 가이드라인

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🎚️ 오디오 에셋 제작 표준                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ◆ 녹음/제작 표준                                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  샘플 레이트: 48000 Hz (마스터)                                              │
│  비트 깊이: 24 bit (마스터)                                                  │
│  포맷: WAV (마스터), OGG/MP3 (배포)                                         │
│  정규화: -3 dBFS (헤드룸)                                                    │
│  다이나믹 레인지: -12 ~ -3 dBFS                                              │
│                                                                             │
│  ◆ 파일 명명 규칙                                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [카테고리]_[서브카테고리]_[설명]_[버전].ogg                                 │
│                                                                             │
│  예시:                                                                      │
│  • ui_click_primary_v1.ogg                                                  │
│  • sfx_machine_assembler_loop_v2.ogg                                        │
│  • bgm_milestone_m3_factory_v1.ogg                                          │
│  • amb_mars_wind_heavy_v1.ogg                                               │
│                                                                             │
│  ◆ 라운드 로빈 명명                                                         │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  같은 사운드의 변형:                                                         │
│  • sfx_belt_item_pass_01.ogg                                                │
│  • sfx_belt_item_pass_02.ogg                                                │
│  • sfx_belt_item_pass_03.ogg                                                │
│  • sfx_belt_item_pass_04.ogg                                                │
│                                                                             │
│  ◆ 디렉토리 구조                                                            │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  assets/audio/                                                              │
│  ├── bgm/                                                                   │
│  │   ├── layers/                                                            │
│  │   │   ├── ambient/                                                       │
│  │   │   ├── harmonic/                                                      │
│  │   │   ├── activity/                                                      │
│  │   │   └── tension/                                                       │
│  │   └── stingers/                                                          │
│  ├── sfx/                                                                   │
│  │   ├── ui/                                                                │
│  │   ├── build/                                                             │
│  │   ├── production/                                                        │
│  │   ├── logistics/                                                         │
│  │   ├── energy/                                                            │
│  │   └── alerts/                                                            │
│  ├── ambience/                                                              │
│  │   ├── mars/                                                              │
│  │   ├── factory/                                                           │
│  │   └── weather/                                                           │
│  └── ir/  (Impulse Responses for reverb)                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.10.2. 빌드 파이프라인

```javascript
// 오디오 에셋 빌드 스크립트 (vite.config.js 확장)
const audioAssetPipeline = {
  // 마스터 에셋 → 배포 에셋 변환
  transformations: {
    // BGM (스트리밍용)
    bgm: {
      input: 'assets/audio/master/bgm/**/*.wav',
      output: 'dist/audio/bgm/',
      format: ['ogg', 'mp3'],
      quality: {
        ogg: { bitrate: 128, sample_rate: 44100 },
        mp3: { bitrate: 128, sample_rate: 44100 },
      },
    },

    // SFX (즉시 재생용)
    sfx: {
      input: 'assets/audio/master/sfx/**/*.wav',
      output: 'dist/audio/sfx/',
      format: ['ogg', 'mp3'],
      quality: {
        ogg: { bitrate: 96, sample_rate: 44100 },
        mp3: { bitrate: 96, sample_rate: 44100 },
      },
      mono: true, // SFX는 모노로 용량 절약
    },

    // 환경음 (긴 루프)
    ambience: {
      input: 'assets/audio/master/ambience/**/*.wav',
      output: 'dist/audio/ambience/',
      format: ['ogg'],
      quality: {
        ogg: { bitrate: 64, sample_rate: 44100 },
      },
    },
  },

  // 스프라이트 시트 생성 (작은 SFX 묶음)
  sprites: {
    enabled: true,
    ui_sounds: {
      files: 'assets/audio/master/sfx/ui/*.wav',
      output: 'dist/audio/sprites/ui_sprite',
      format: 'ogg',
    },
  },

  // 매니페스트 생성
  manifest: {
    output: 'dist/audio/manifest.json',
    include: ['name', 'duration', 'size', 'category'],
  },
}
```

### 10.10.3. 로딩 전략

```javascript
// 오디오 로딩 매니저
const AUDIO_LOADING_STRATEGY = {
  // 로딩 단계
  stages: {
    // 1단계: 게임 시작 전 필수 로드
    critical: {
      priority: 0,
      files: [
        'sfx/ui/*', // 모든 UI 사운드
        'sfx/alerts/*', // 경고음
        'ambience/mars/amb_mars_base.ogg',
      ],
      blocking: true, // 로딩 화면에서 대기
      total_size_kb: 500,
    },

    // 2단계: 게임 시작 직후 백그라운드 로드
    high: {
      priority: 1,
      files: ['bgm/layers/ambient/*', 'bgm/layers/harmonic/m1_*', 'sfx/build/*'],
      blocking: false,
      total_size_kb: 1000,
    },

    // 3단계: 첫 자동화 전까지 로드
    medium: {
      priority: 2,
      files: ['sfx/production/*', 'sfx/logistics/*', 'bgm/layers/activity/*'],
      blocking: false,
      total_size_kb: 1500,
    },

    // 4단계: 온디맨드 로드
    low: {
      priority: 3,
      files: ['bgm/layers/harmonic/m[2-5]_*', 'bgm/stingers/*', 'ambience/weather/*'],
      load_on: 'milestone_approach',
      total_size_kb: 2000,
    },
  },

  // 프리로딩 힌트
  preload_hints: {
    // 마일스톤 3 접근 시 m3 음악 미리 로드
    milestone_approach: currentProgress => {
      const nextMilestone = Math.ceil(currentProgress)
      return [`bgm/layers/harmonic/m${nextMilestone}_*.ogg`]
    },

    // 날씨 이벤트 예고 시
    weather_warning: weatherType => {
      return [`ambience/weather/${weatherType}_*.ogg`]
    },
  },

  // 메모리 관리
  memory_management: {
    max_cached_mb: 50,

    // LRU 캐시 정책
    eviction_policy: 'lru',

    // 언로드하지 않을 파일
    never_unload: ['sfx/ui/*', 'sfx/alerts/*'],
  },
}
```

---

## 10.11. 비고 (Notes)

### 구현 우선순위

| 단계        | 기능                  | 중요도 | 의존성        |
| :---------- | :-------------------- | :----- | :------------ |
| **Phase 1** | 기본 BGM 재생, UI SFX | 필수   | Howler.js     |
| **Phase 1** | 볼륨 컨트롤           | 필수   | -             |
| **Phase 2** | 적응형 음악 레이어    | 높음   | Phase 1       |
| **Phase 2** | 생산 SFX              | 높음   | Phase 1       |
| **Phase 3** | 공간 오디오           | 중간   | Web Audio API |
| **Phase 3** | 환경음 시스템         | 중간   | Phase 2       |
| **Phase 4** | 접근성 기능           | 중간   | Phase 2       |
| **Phase 4** | 모바일 최적화         | 중간   | Phase 1       |

### 라이선스 고려사항

- BGM: 로열티 프리 또는 커미션 제작
- SFX: 로열티 프리 라이브러리 또는 자체 폴리
- Impulse Responses: 오픈 라이선스 (OpenAIR 등)

### 테스트 체크리스트

- [ ] 모든 브라우저 호환성 (Chrome, Firefox, Safari, Edge)
- [ ] 모바일 자동재생 정책 대응
- [ ] 장시간 플레이 메모리 누수 확인
- [ ] 저사양 기기 성능 테스트
- [ ] 청각 장애 접근성 검증

---

[← 이전: Optimization](./10-e-optimization.md) | [다음: Localization →](./11-localization.md)
