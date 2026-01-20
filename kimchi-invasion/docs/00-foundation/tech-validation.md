# 00-B. 기술 검증 계획서 (Technical Validation Plan)

> **Last Updated:** 2026-01-19
> **Status:** MVP 착수 전 필수 완료
> **관련 문서:** [MVP 정의서](./00-mvp-definition.md)

[← 목차로 돌아가기](./README.md) | [← MVP 정의서](./00-mvp-definition.md)

---

## B.1. 검증 개요

### B.1.1. 검증 목적

MVP 개발 착수 전 **기술적 리스크를 조기 발견**하여 개발 중 대규모 수정을 방지합니다.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         기술 검증 목표                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🎯 핵심 질문                                                                │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  1. PixiJS로 5,000개 스프라이트를 60fps로 렌더링할 수 있는가?               │
│     → 불가능 시: 렌더링 최적화 또는 엔진 변경 검토                          │
│                                                                             │
│  2. 웹 오디오로 20채널 동시 재생이 안정적인가?                              │
│     → 불가능 시: 오디오 풀링 강화 또는 채널 수 제한                         │
│                                                                             │
│  3. 모바일 브라우저에서 터치 조작이 자연스러운가?                           │
│     → 불가능 시: 모바일 전용 UI 분리 또는 웹뷰 앱 고려                      │
│                                                                             │
│  4. 저사양 PC (i5-6세대, 8GB)에서 플레이 가능한가?                         │
│     → 불가능 시: LOD 시스템, 퀄리티 옵션 추가                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### B.1.2. 검증 일정 요약

| 주차       | 항목                                   | 산출물             |
| ---------- | -------------------------------------- | ------------------ |
| **Week 1** | PixiJS 렌더링 벤치마크                 | 성능 리포트        |
| **Week 2** | 웹 오디오 스트레스 테스트              | 안정성 리포트      |
| **Week 3** | 통합 프로토타입 + 크로스 플랫폼 테스트 | 최종 Go/No-Go 판정 |

---

## B.2. Test 1: PixiJS 렌더링 벤치마크

### B.2.1. 테스트 목표

| 항목              | 목표            | 최소 허용             |
| ----------------- | --------------- | --------------------- |
| **스프라이트 수** | 5,000개 @ 60fps | 3,000개 @ 30fps       |
| **타겟 기기**     | 중사양 PC       | 저사양 PC             |
| **브라우저**      | Chrome 120+     | Firefox, Safari, Edge |

### B.2.2. 벤치마크 시나리오

```javascript
// benchmark-sprites.js
const BENCHMARK_SCENARIOS = {
  // 시나리오 1: 정적 스프라이트 (건물)
  static_sprites: {
    count: [1000, 2000, 3000, 5000, 10000],
    sprite_size: 64, // px
    animation: false,
    description: '배치된 건물 시뮬레이션',
  },

  // 시나리오 2: 움직이는 스프라이트 (컨베이어 아이템)
  moving_sprites: {
    count: [500, 1000, 2000, 3000, 5000],
    sprite_size: 32,
    animation: true,
    velocity: 2, // px/frame
    description: '컨베이어 위 이동 아이템',
  },

  // 시나리오 3: 혼합 (실제 게임 시뮬레이션)
  mixed_scenario: {
    static_count: 2000, // 건물
    moving_count: 3000, // 아이템
    animated_count: 500, // 애니메이션 건물
    description: 'M2 후반 공장 규모 시뮬레이션',
  },

  // 시나리오 4: 극한 테스트
  stress_test: {
    total_count: 10000,
    with_particles: true,
    with_lighting: true,
    description: '메가베이스 시뮬레이션',
  },
}
```

### B.2.3. 측정 항목

```javascript
const METRICS_TO_MEASURE = {
  // FPS 관련
  fps: {
    average: 0,
    min: 0,
    max: 0,
    p1: 0, // 1% low
    p0_1: 0, // 0.1% low (스터터링 감지)
  },

  // 프레임 타임
  frame_time: {
    average_ms: 0,
    max_ms: 0,
    spikes: [], // 100ms 이상 프레임
  },

  // 메모리
  memory: {
    heap_used_mb: 0,
    heap_total_mb: 0,
    texture_memory_mb: 0,
  },

  // GPU (가능한 경우)
  gpu: {
    draw_calls: 0,
    triangles: 0,
  },

  // 배터리 (모바일)
  battery: {
    drain_per_minute: 0,
    temperature_increase: 0,
  },
}
```

### B.2.4. 테스트 환경

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         테스트 환경 매트릭스                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🖥️ Desktop                                                                  │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [저사양] Intel i5-6500, 8GB RAM, Intel HD 530                              │
│          → 목표: 3,000 sprites @ 30fps                                      │
│                                                                             │
│  [중사양] Intel i5-10400, 16GB RAM, GTX 1650                                │
│          → 목표: 5,000 sprites @ 60fps                                      │
│                                                                             │
│  [고사양] Intel i7-12700, 32GB RAM, RTX 3060                                │
│          → 목표: 10,000 sprites @ 60fps                                     │
│                                                                             │
│  📱 Mobile                                                                   │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [iOS] iPhone 12 (A14), Safari                                              │
│        → 목표: 2,000 sprites @ 60fps                                        │
│                                                                             │
│  [iOS 저사양] iPhone SE 2 (A13), Safari                                     │
│              → 목표: 1,000 sprites @ 30fps                                  │
│                                                                             │
│  [Android] Galaxy S21 (SD888), Chrome                                       │
│            → 목표: 2,000 sprites @ 60fps                                    │
│                                                                             │
│  [Android 저사양] Galaxy A52 (SD720G), Chrome                               │
│                   → 목표: 1,000 sprites @ 30fps                             │
│                                                                             │
│  🌐 Browser                                                                  │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  • Chrome 120+                                                              │
│  • Firefox 120+                                                             │
│  • Safari 17+                                                               │
│  • Edge 120+                                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### B.2.5. 벤치마크 구현 코드

```javascript
// src/benchmark/sprite-benchmark.ts
import * as PIXI from 'pixi.js';

interface BenchmarkResult {
  scenario: string;
  spriteCount: number;
  avgFps: number;
  minFps: number;
  p1Fps: number;
  heapUsedMB: number;
  drawCalls: number;
  passed: boolean;
}

class SpriteBenchmark {
  private app: PIXI.Application;
  private sprites: PIXI.Sprite[] = [];
  private fpsHistory: number[] = [];
  private running = false;

  constructor() {
    this.app = new PIXI.Application({
      width: 1920,
      height: 1080,
      backgroundColor: 0x1a1a2e,
      antialias: false,  // 성능 우선
      resolution: window.devicePixelRatio || 1,
    });
    document.body.appendChild(this.app.view as HTMLCanvasElement);
  }

  // 스프라이트 생성
  async createSprites(count: number, moving: boolean = false): Promise<void> {
    // 텍스처 아틀라스 로드
    const texture = await PIXI.Assets.load('benchmark-sprite.png');

    for (let i = 0; i < count; i++) {
      const sprite = new PIXI.Sprite(texture);
      sprite.x = Math.random() * this.app.screen.width;
      sprite.y = Math.random() * this.app.screen.height;
      sprite.anchor.set(0.5);

      if (moving) {
        (sprite as any).vx = (Math.random() - 0.5) * 4;
        (sprite as any).vy = (Math.random() - 0.5) * 4;
      }

      this.app.stage.addChild(sprite);
      this.sprites.push(sprite);
    }
  }

  // 벤치마크 실행
  async runBenchmark(
    scenario: string,
    spriteCount: number,
    durationMs: number = 10000
  ): Promise<BenchmarkResult> {
    this.fpsHistory = [];
    this.running = true;

    const startTime = performance.now();
    let lastTime = startTime;
    let frameCount = 0;

    // 메인 루프
    const ticker = () => {
      if (!this.running) return;

      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;

      // FPS 기록
      const fps = 1000 / delta;
      this.fpsHistory.push(fps);

      // 스프라이트 이동 (moving 시나리오)
      for (const sprite of this.sprites) {
        if ((sprite as any).vx !== undefined) {
          sprite.x += (sprite as any).vx;
          sprite.y += (sprite as any).vy;

          // 화면 경계 처리
          if (sprite.x < 0 || sprite.x > this.app.screen.width) {
            (sprite as any).vx *= -1;
          }
          if (sprite.y < 0 || sprite.y > this.app.screen.height) {
            (sprite as any).vy *= -1;
          }
        }
      }

      frameCount++;

      // 지속 시간 체크
      if (now - startTime >= durationMs) {
        this.running = false;
      } else {
        requestAnimationFrame(ticker);
      }
    };

    requestAnimationFrame(ticker);

    // 대기
    await new Promise(resolve => setTimeout(resolve, durationMs + 100));

    // 결과 계산
    const sortedFps = [...this.fpsHistory].sort((a, b) => a - b);
    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    const minFps = sortedFps[0];
    const p1Index = Math.floor(sortedFps.length * 0.01);
    const p1Fps = sortedFps[p1Index];

    // 메모리 측정
    const memory = (performance as any).memory;
    const heapUsedMB = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0;

    // 목표 달성 여부
    const passed = avgFps >= 60 && p1Fps >= 30;

    return {
      scenario,
      spriteCount,
      avgFps: Math.round(avgFps * 10) / 10,
      minFps: Math.round(minFps * 10) / 10,
      p1Fps: Math.round(p1Fps * 10) / 10,
      heapUsedMB: Math.round(heapUsedMB),
      drawCalls: this.app.renderer.gl ?
        (this.app.renderer as any).gl.getParameter(
          (this.app.renderer as any).gl.MAX_DRAW_BUFFERS
        ) : 0,
      passed,
    };
  }

  // 정리
  cleanup(): void {
    for (const sprite of this.sprites) {
      sprite.destroy();
    }
    this.sprites = [];
  }

  // 전체 벤치마크 스위트 실행
  async runFullSuite(): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = [];
    const counts = [1000, 2000, 3000, 5000, 7000, 10000];

    console.log('=== PixiJS Sprite Benchmark Suite ===\n');

    for (const count of counts) {
      // 정적 테스트
      await this.createSprites(count, false);
      const staticResult = await this.runBenchmark('static', count);
      results.push(staticResult);
      console.log(`Static ${count}: ${staticResult.avgFps} fps (${staticResult.passed ? 'PASS' : 'FAIL'})`);
      this.cleanup();

      // 동적 테스트
      await this.createSprites(count, true);
      const movingResult = await this.runBenchmark('moving', count);
      results.push(movingResult);
      console.log(`Moving ${count}: ${movingResult.avgFps} fps (${movingResult.passed ? 'PASS' : 'FAIL'})`);
      this.cleanup();
    }

    return results;
  }
}

// 실행
const benchmark = new SpriteBenchmark();
benchmark.runFullSuite().then(results => {
  console.log('\n=== Final Results ===');
  console.table(results);
});
```

### B.2.6. 최적화 옵션 (실패 시)

```javascript
// 성능 미달 시 적용할 최적화 기법
const OPTIMIZATION_TECHNIQUES = {
  // Level 1: 기본 최적화
  level_1: {
    techniques: [
      'ParticleContainer 사용 (vs Container)',
      'Texture Atlas 통합',
      'cacheAsBitmap 활용',
      'cullable = true 설정',
    ],
    expected_improvement: '30-50%',
  },

  // Level 2: 중급 최적화
  level_2: {
    techniques: [
      '오브젝트 풀링 (Object Pool)',
      '뷰포트 컬링 (화면 밖 비활성화)',
      'LOD 시스템 (거리별 디테일)',
      'Batch Rendering 최적화',
    ],
    expected_improvement: '50-100%',
  },

  // Level 3: 고급 최적화
  level_3: {
    techniques: [
      'WebGL 커스텀 셰이더',
      'Instanced Rendering',
      'GPU 파티클 시스템',
      'WebGPU 마이그레이션 검토',
    ],
    expected_improvement: '100-200%',
  },

  // Level 4: 아키텍처 변경
  level_4: {
    techniques: ['타일맵 기반 렌더링 전환', '청크 시스템 도입', '엔진 변경 (Phaser, Three.js)'],
    expected_improvement: 'varies',
  },
}
```

---

## B.3. Test 2: 웹 오디오 스트레스 테스트

### B.3.1. 테스트 목표

| 항목               | 목표   | 최소 허용                  |
| ------------------ | ------ | -------------------------- |
| **동시 재생 채널** | 20채널 | 10채널                     |
| **지연 시간**      | <50ms  | <100ms                     |
| **메모리 누수**    | 없음   | 1시간 플레이 후 +50MB 이내 |

### B.3.2. 테스트 시나리오

```javascript
// audio-stress-test.js
const AUDIO_TEST_SCENARIOS = {
  // 시나리오 1: UI 사운드 연타
  ui_rapid_fire: {
    sound: 'ui_click',
    interval_ms: 50, // 50ms 간격
    duration_s: 10,
    expected_plays: 200,
    description: '빠른 클릭 시뮬레이션',
  },

  // 시나리오 2: 공장 환경음 믹스
  factory_ambience: {
    sounds: [
      { id: 'machine_loop_1', loop: true },
      { id: 'machine_loop_2', loop: true },
      { id: 'belt_loop', loop: true },
      { id: 'generator_hum', loop: true },
      { id: 'ambient_mars', loop: true },
    ],
    oneshot_interval_ms: 500,
    oneshot_sounds: ['item_pickup', 'item_drop', 'inserter_grab'],
    duration_s: 60,
    description: 'M2 공장 사운드스케이프',
  },

  // 시나리오 3: 대규모 공장
  megabase_audio: {
    loop_count: 10, // 10개 루프 사운드
    oneshot_per_second: 5, // 초당 5개 원샷
    duration_s: 120,
    description: '메가베이스 오디오 부하',
  },

  // 시나리오 4: 메모리 누수 테스트
  memory_leak_test: {
    play_and_stop_count: 1000,
    check_interval_s: 10,
    duration_s: 300, // 5분
    description: '반복 재생/정지로 메모리 누수 확인',
  },
}
```

### B.3.3. Howler.js 테스트 구현

```javascript
// src/benchmark/audio-benchmark.ts
import { Howl, Howler } from 'howler';

interface AudioBenchmarkResult {
  scenario: string;
  totalPlays: number;
  failedPlays: number;
  avgLatencyMs: number;
  maxLatencyMs: number;
  memoryStartMB: number;
  memoryEndMB: number;
  memoryLeakMB: number;
  passed: boolean;
}

class AudioBenchmark {
  private sounds: Map<string, Howl> = new Map();
  private playLatencies: number[] = [];

  constructor() {
    // Howler 글로벌 설정
    Howler.autoUnlock = true;
    Howler.html5PoolSize = 20;
  }

  // 사운드 로드
  async loadSounds(): Promise<void> {
    const soundFiles = [
      'ui_click', 'ui_hover',
      'machine_loop_1', 'machine_loop_2',
      'belt_loop', 'generator_hum',
      'ambient_mars',
      'item_pickup', 'item_drop', 'inserter_grab'
    ];

    for (const id of soundFiles) {
      const sound = new Howl({
        src: [`/audio/${id}.ogg`, `/audio/${id}.mp3`],
        pool: 5,  // 동시 재생 인스턴스
        preload: true,
      });

      await new Promise<void>((resolve, reject) => {
        sound.once('load', () => resolve());
        sound.once('loaderror', () => reject(new Error(`Failed to load ${id}`)));
      });

      this.sounds.set(id, sound);
    }

    console.log(`Loaded ${this.sounds.size} sounds`);
  }

  // 사운드 재생 (지연 시간 측정)
  playWithLatency(id: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const sound = this.sounds.get(id);
      if (!sound) {
        reject(new Error(`Sound not found: ${id}`));
        return;
      }

      const startTime = performance.now();
      const playId = sound.play();

      if (playId === null) {
        reject(new Error(`Failed to play: ${id}`));
        return;
      }

      sound.once('play', () => {
        const latency = performance.now() - startTime;
        this.playLatencies.push(latency);
        resolve(latency);
      }, playId);

      // 타임아웃
      setTimeout(() => reject(new Error('Play timeout')), 1000);
    });
  }

  // UI 연타 테스트
  async testRapidFire(intervalMs: number, durationS: number): Promise<AudioBenchmarkResult> {
    console.log(`\n=== UI Rapid Fire Test (${intervalMs}ms interval) ===`);

    const memoryStart = this.getMemoryUsage();
    this.playLatencies = [];

    let totalPlays = 0;
    let failedPlays = 0;

    const startTime = Date.now();
    while (Date.now() - startTime < durationS * 1000) {
      try {
        await this.playWithLatency('ui_click');
        totalPlays++;
      } catch (e) {
        failedPlays++;
      }
      await this.delay(intervalMs);
    }

    const memoryEnd = this.getMemoryUsage();
    const avgLatency = this.playLatencies.reduce((a, b) => a + b, 0) / this.playLatencies.length;
    const maxLatency = Math.max(...this.playLatencies);

    return {
      scenario: 'rapid_fire',
      totalPlays,
      failedPlays,
      avgLatencyMs: Math.round(avgLatency * 10) / 10,
      maxLatencyMs: Math.round(maxLatency * 10) / 10,
      memoryStartMB: memoryStart,
      memoryEndMB: memoryEnd,
      memoryLeakMB: memoryEnd - memoryStart,
      passed: failedPlays === 0 && avgLatency < 50,
    };
  }

  // 동시 재생 테스트
  async testConcurrentPlayback(channelCount: number): Promise<AudioBenchmarkResult> {
    console.log(`\n=== Concurrent Playback Test (${channelCount} channels) ===`);

    const memoryStart = this.getMemoryUsage();
    this.playLatencies = [];

    let totalPlays = 0;
    let failedPlays = 0;

    // 루프 사운드 시작
    const loopSounds = ['machine_loop_1', 'machine_loop_2', 'belt_loop', 'generator_hum', 'ambient_mars'];
    const activeSounds: number[] = [];

    for (let i = 0; i < Math.min(channelCount, loopSounds.length); i++) {
      const sound = this.sounds.get(loopSounds[i % loopSounds.length]);
      if (sound) {
        sound.loop(true);
        const playId = sound.play();
        if (playId !== null) {
          activeSounds.push(playId);
          totalPlays++;
        } else {
          failedPlays++;
        }
      }
    }

    // 원샷 사운드 오버레이
    const oneshotSounds = ['item_pickup', 'item_drop', 'inserter_grab'];
    for (let i = 0; i < 20; i++) {
      await this.delay(200);
      try {
        await this.playWithLatency(oneshotSounds[i % oneshotSounds.length]);
        totalPlays++;
      } catch (e) {
        failedPlays++;
      }
    }

    // 정리
    for (const sound of this.sounds.values()) {
      sound.stop();
    }

    const memoryEnd = this.getMemoryUsage();
    const avgLatency = this.playLatencies.length > 0
      ? this.playLatencies.reduce((a, b) => a + b, 0) / this.playLatencies.length
      : 0;

    return {
      scenario: `concurrent_${channelCount}ch`,
      totalPlays,
      failedPlays,
      avgLatencyMs: Math.round(avgLatency * 10) / 10,
      maxLatencyMs: this.playLatencies.length > 0 ? Math.round(Math.max(...this.playLatencies) * 10) / 10 : 0,
      memoryStartMB: memoryStart,
      memoryEndMB: memoryEnd,
      memoryLeakMB: memoryEnd - memoryStart,
      passed: failedPlays < totalPlays * 0.05 && avgLatency < 100,
    };
  }

  // 메모리 누수 테스트
  async testMemoryLeak(iterations: number, checkIntervalS: number): Promise<AudioBenchmarkResult> {
    console.log(`\n=== Memory Leak Test (${iterations} iterations) ===`);

    const memoryStart = this.getMemoryUsage();
    const memorySnapshots: number[] = [memoryStart];

    let totalPlays = 0;
    let failedPlays = 0;

    for (let i = 0; i < iterations; i++) {
      try {
        const sound = this.sounds.get('ui_click');
        if (sound) {
          const playId = sound.play();
          totalPlays++;

          // 즉시 정지
          await this.delay(10);
          sound.stop(playId as number);
        }
      } catch (e) {
        failedPlays++;
      }

      // 메모리 스냅샷
      if (i % (iterations / 10) === 0) {
        memorySnapshots.push(this.getMemoryUsage());
        console.log(`Progress: ${Math.round(i / iterations * 100)}%, Memory: ${memorySnapshots[memorySnapshots.length - 1]}MB`);
      }
    }

    const memoryEnd = this.getMemoryUsage();
    const memoryLeak = memoryEnd - memoryStart;

    return {
      scenario: 'memory_leak',
      totalPlays,
      failedPlays,
      avgLatencyMs: 0,
      maxLatencyMs: 0,
      memoryStartMB: memoryStart,
      memoryEndMB: memoryEnd,
      memoryLeakMB: memoryLeak,
      passed: memoryLeak < 50,  // 50MB 이하
    };
  }

  // 유틸리티
  private getMemoryUsage(): number {
    const memory = (performance as any).memory;
    return memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 전체 테스트 스위트
  async runFullSuite(): Promise<AudioBenchmarkResult[]> {
    const results: AudioBenchmarkResult[] = [];

    await this.loadSounds();

    // 1. UI 연타
    results.push(await this.testRapidFire(50, 10));

    // 2. 동시 재생 (5, 10, 15, 20채널)
    for (const channels of [5, 10, 15, 20]) {
      results.push(await this.testConcurrentPlayback(channels));
    }

    // 3. 메모리 누수
    results.push(await this.testMemoryLeak(500, 10));

    console.log('\n=== Final Results ===');
    console.table(results);

    return results;
  }
}

// 실행
const benchmark = new AudioBenchmark();
benchmark.runFullSuite();
```

### B.3.4. 모바일 자동재생 정책 테스트

```javascript
// mobile-autoplay-test.js
const MOBILE_AUTOPLAY_TEST = {
  // 자동재생 언락 테스트
  testAutoplayUnlock: async () => {
    const testSound = new Howl({
      src: ['/audio/silence_100ms.ogg'],
      html5: true,
    })

    // 첫 터치 없이 재생 시도
    const beforeTouch = testSound.play()
    console.log('Before touch:', beforeTouch !== null ? 'SUCCESS' : 'BLOCKED')

    // 터치 이벤트 시뮬레이션 후 재생
    document.addEventListener(
      'touchstart',
      async () => {
        const afterTouch = testSound.play()
        console.log('After touch:', afterTouch !== null ? 'SUCCESS' : 'BLOCKED')
      },
      { once: true }
    )
  },

  // 백그라운드 전환 테스트
  testBackgroundBehavior: () => {
    const bgSound = new Howl({
      src: ['/audio/ambient_mars.ogg'],
      loop: true,
    })

    bgSound.play()

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('Background: pausing audio')
        Howler.mute(true)
      } else {
        console.log('Foreground: resuming audio')
        Howler.mute(false)
      }
    })
  },

  // 인터럽션 핸들링 (전화, 알림)
  testInterruptionHandling: () => {
    // Web Audio API 상태 모니터링
    const ctx = Howler.ctx

    ctx.addEventListener('statechange', () => {
      console.log('Audio context state:', ctx.state)

      if (ctx.state === 'interrupted') {
        console.log('Audio interrupted (call/notification)')
      } else if (ctx.state === 'running') {
        console.log('Audio resumed')
      }
    })
  },
}
```

---

## B.4. Test 3: 크로스 플랫폼 통합 테스트

### B.4.1. 테스트 체크리스트

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         크로스 플랫폼 테스트 체크리스트                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🖥️ Desktop Browsers                                                         │
│  ─────────────────────────────────────────────────────────────────────────  │
│  [ ] Chrome 120+ (Windows)                                                  │
│  [ ] Chrome 120+ (macOS)                                                    │
│  [ ] Firefox 120+ (Windows)                                                 │
│  [ ] Firefox 120+ (macOS)                                                   │
│  [ ] Safari 17+ (macOS)                                                     │
│  [ ] Edge 120+ (Windows)                                                    │
│                                                                             │
│  📱 Mobile Browsers                                                          │
│  ─────────────────────────────────────────────────────────────────────────  │
│  [ ] Chrome (Android 12+)                                                   │
│  [ ] Samsung Internet (Android)                                             │
│  [ ] Safari (iOS 16+)                                                       │
│  [ ] Chrome (iOS)  ← WebKit 기반                                            │
│                                                                             │
│  🎮 입력 테스트                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  [ ] 마우스 클릭/드래그                                                     │
│  [ ] 키보드 단축키                                                          │
│  [ ] 터치 탭/드래그                                                         │
│  [ ] 멀티터치 (핀치 줌)                                                     │
│  [ ] 터치 + 마우스 동시 (Surface 등)                                        │
│                                                                             │
│  📊 성능 테스트                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  [ ] 초기 로딩 시간 < 5초                                                   │
│  [ ] 메모리 사용량 < 512MB                                                  │
│  [ ] 60fps 유지 (중사양 기준)                                               │
│  [ ] 배터리 소모 (1시간 < 15%)                                              │
│                                                                             │
│  🔊 오디오 테스트                                                            │
│  ─────────────────────────────────────────────────────────────────────────  │
│  [ ] 자동재생 언락 (모바일)                                                 │
│  [ ] 백그라운드 전환 시 음소거                                              │
│  [ ] 이어폰 연결/해제 핸들링                                                │
│  [ ] 볼륨 컨트롤 동기화                                                     │
│                                                                             │
│  💾 저장 테스트                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  [ ] LocalStorage 저장/불러오기                                             │
│  [ ] 시크릿 모드 동작                                                       │
│  [ ] 저장 용량 한계 테스트 (5MB)                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### B.4.2. 자동화 테스트 스크립트

```javascript
// playwright-cross-platform.spec.ts
import { test, expect, devices } from '@playwright/test';

const DEVICES_TO_TEST = [
  { name: 'Desktop Chrome', ...devices['Desktop Chrome'] },
  { name: 'Desktop Firefox', ...devices['Desktop Firefox'] },
  { name: 'Desktop Safari', ...devices['Desktop Safari'] },
  { name: 'iPhone 12', ...devices['iPhone 12'] },
  { name: 'Galaxy S21', ...devices['Galaxy S III'] },  // 근사치
  { name: 'iPad', ...devices['iPad (gen 7)'] },
];

for (const device of DEVICES_TO_TEST) {
  test.describe(`${device.name}`, () => {
    test.use({ ...device });

    test('페이지 로딩', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(5000);  // 5초 이내
      await expect(page.locator('#game-container')).toBeVisible();
    });

    test('기본 인터랙션', async ({ page }) => {
      await page.goto('/');

      // 건물 배치 테스트
      await page.click('#build-menu-btn');
      await page.click('[data-building="miner"]');
      await page.click('#game-canvas', { position: { x: 400, y: 300 } });

      // 배치 확인
      await expect(page.locator('[data-entity="miner"]')).toBeVisible();
    });

    test('오디오 재생', async ({ page }) => {
      await page.goto('/');

      // 첫 인터랙션 (언락)
      await page.click('#game-canvas');

      // 오디오 컨텍스트 상태 확인
      const audioState = await page.evaluate(() => {
        return (window as any).Howler?.ctx?.state;
      });

      expect(audioState).toBe('running');
    });

    test('저장/불러오기', async ({ page }) => {
      await page.goto('/');

      // 게임 플레이 시뮬레이션
      await page.click('#build-menu-btn');
      await page.click('[data-building="miner"]');
      await page.click('#game-canvas', { position: { x: 400, y: 300 } });

      // 저장
      await page.click('#save-btn');

      // 새로고침
      await page.reload();

      // 불러오기 확인
      await expect(page.locator('[data-entity="miner"]')).toBeVisible();
    });
  });
}
```

---

## B.5. 결과 리포트 템플릿

### B.5.1. 벤치마크 리포트 형식

```markdown
# 기술 검증 결과 리포트

**테스트 일자:** YYYY-MM-DD
**테스터:** [이름]
**빌드 버전:** [버전]

## 1. PixiJS 렌더링 벤치마크

### 1.1 테스트 환경

- CPU: [모델]
- GPU: [모델]
- RAM: [용량]
- Browser: [이름 및 버전]
- OS: [이름 및 버전]

### 1.2 결과 요약

| 시나리오 | 스프라이트 수 | Avg FPS | Min FPS | 1% Low | 결과 |
| -------- | ------------- | ------- | ------- | ------ | ---- |
| Static   | 1,000         |         |         |        |      |
| Static   | 3,000         |         |         |        |      |
| Static   | 5,000         |         |         |        |      |
| Moving   | 1,000         |         |         |        |      |
| Moving   | 3,000         |         |         |        |      |
| Moving   | 5,000         |         |         |        |      |

### 1.3 판정

- [ ] PASS: 5,000 sprites @ 60fps 달성
- [ ] CONDITIONAL: 3,000 sprites @ 30fps 달성 (최적화 필요)
- [ ] FAIL: 기준 미달 (아키텍처 재검토 필요)

### 1.4 권장 조치

[필요시 최적화 기법 기술]

---

## 2. 웹 오디오 스트레스 테스트

### 2.1 결과 요약

| 시나리오 | 채널 수 | 성공률 | Avg Latency | 메모리 증가 | 결과 |
| -------- | ------- | ------ | ----------- | ----------- | ---- |
| UI 연타  | -       |        |             |             |      |
| 동시재생 | 10      |        |             |             |      |
| 동시재생 | 20      |        |             |             |      |
| 누수체크 | -       |        |             |             |      |

### 2.2 판정

- [ ] PASS: 20채널 동시 재생, 메모리 안정
- [ ] CONDITIONAL: 10채널 안정 (채널 제한 필요)
- [ ] FAIL: 기준 미달

---

## 3. 크로스 플랫폼 테스트

### 3.1 브라우저 호환성

| 브라우저       | 버전 | 렌더링 | 오디오 | 저장 | 터치 | 결과 |
| -------------- | ---- | ------ | ------ | ---- | ---- | ---- |
| Chrome         |      |        |        |      |      |      |
| Firefox        |      |        |        |      |      |      |
| Safari         |      |        |        |      |      |      |
| Edge           |      |        |        |      |      |      |
| iOS Safari     |      |        |        |      |      |      |
| Android Chrome |      |        |        |      |      |      |

### 3.2 판정

- [ ] PASS: 모든 타겟 브라우저 정상
- [ ] CONDITIONAL: 일부 브라우저 이슈 (폴백 필요)
- [ ] FAIL: 주요 브라우저 미지원

---

## 4. 최종 Go/No-Go 판정

### 4.1 총괄 결과

| 영역   | 결과 | 비고 |
| ------ | ---- | ---- |
| 렌더링 |      |      |
| 오디오 |      |      |
| 호환성 |      |      |

### 4.2 최종 판정

- [ ] **GO**: 모든 기준 충족, MVP 개발 착수
- [ ] **CONDITIONAL GO**: 조건부 승인, 최적화 병행
- [ ] **NO-GO**: 기술 재검토 필요

### 4.3 후속 조치

[필요시 기술]

---

**승인:**

- 테크 리드: [서명]
- 날짜: YYYY-MM-DD
```

---

## B.6. 실행 가이드

### B.6.1. 로컬 실행 방법

```bash
# 1. 벤치마크 프로젝트 설정
cd kimchi-invasion
mkdir -p benchmark
cd benchmark

# 2. 의존성 설치
npm init -y
npm install pixi.js howler

# 3. 벤치마크 파일 복사
# (본 문서의 코드를 src/benchmark/ 에 저장)

# 4. 개발 서버 실행
npx vite

# 5. 브라우저에서 테스트
# http://localhost:5173/benchmark/sprites.html
# http://localhost:5173/benchmark/audio.html
```

### B.6.2. CI 통합 (선택)

```yaml
# .github/workflows/benchmark.yml
name: Performance Benchmark

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run benchmarks
        run: npm run benchmark

      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: benchmark-results
          path: benchmark-results/
```

---

## B.7. 문서 참조

| 문서                                 | 관련 내용          |
| ------------------------------------ | ------------------ |
| [MVP 정의서](./00-mvp-definition.md) | MVP 성능 목표      |
| [09-technical.md](./09-technical.md) | 기술 스택 상세     |
| [10-audio.md](./10-audio.md)         | 오디오 시스템 사양 |

---

[← MVP 정의서](./00-mvp-definition.md) | [다음: Core Concept →](./01-core-concept.md)
