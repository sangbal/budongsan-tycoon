# 9-C. 성능 최적화 (Performance Optimization)

> **Last Updated:** 2026-01-19
>
> 원본: `09-technical.md` 섹션 9.5

[← 이전: Backend](./09-b-backend.md) | [다음: Game Engine →](./09-d-engine.md)

---

## 9.5. 성능 최적화

### 9.5.1. 성능 목표 (적응형)

```javascript
const PERFORMANCE_TARGETS = {
  // 프레임레이트 목표
  fps: {
    high_end: { target: 60, min: 55 },
    mid_range: { target: 45, min: 40 },
    low_end: { target: 30, min: 25 },
  },

  // 로딩 시간 목표
  loading: {
    first_paint: { target: 500, max: 1000, unit: 'ms' },
    first_interactive: { target: 2000, max: 3000, unit: 'ms' },
    full_load: { target: 5000, max: 8000, unit: 'ms' },
  },

  // 메모리 목표
  memory: {
    heap_size: { target: 100, max: 200, unit: 'MB' },
    dom_nodes: { target: 500, max: 1000, unit: 'nodes' },
  },

  // 네트워크 목표
  network: {
    initial_bundle: { target: 300, max: 500, unit: 'KB' },
    api_response: { target: 200, max: 500, unit: 'ms' },
    save_upload: { target: 500, max: 1000, unit: 'ms' },
  },

  // 배터리 영향
  battery: {
    cpu_usage: { target: 30, max: 50, unit: '%' },
    wake_lock: false, // 배터리 절약
  },
}
```

### 9.5.2. 자동 품질 조절 시스템

```javascript
const ADAPTIVE_QUALITY_SYSTEM = {
  // FPS 샘플링
  sampling: {
    interval: 1000, // 1초마다 측정
    sample_size: 5, // 최근 5개 평균
    stabilization: 5000, // 품질 변경 후 5초 대기
  },

  // 품질 레벨 정의
  quality_levels: {
    ultra: {
      particles: 1.0,
      shadows: true,
      antialiasing: true,
      post_processing: true,
      max_entities_rendered: Infinity,
      texture_quality: 'high',
      animation_fps: 60,
    },
    high: {
      particles: 0.75,
      shadows: true,
      antialiasing: true,
      post_processing: false,
      max_entities_rendered: 10000,
      texture_quality: 'high',
      animation_fps: 60,
    },
    medium: {
      particles: 0.5,
      shadows: false,
      antialiasing: false,
      post_processing: false,
      max_entities_rendered: 5000,
      texture_quality: 'medium',
      animation_fps: 30,
    },
    low: {
      particles: 0.25,
      shadows: false,
      antialiasing: false,
      post_processing: false,
      max_entities_rendered: 2000,
      texture_quality: 'low',
      animation_fps: 30,
    },
    potato: {
      particles: 0,
      shadows: false,
      antialiasing: false,
      post_processing: false,
      max_entities_rendered: 1000,
      texture_quality: 'low',
      animation_fps: 15,
    },
  },

  // 자동 조절 규칙
  auto_adjust: {
    downgrade_threshold: 30, // FPS 이하면 품질 낮춤
    upgrade_threshold: 55, // FPS 이상이면 품질 높임
    upgrade_cooldown: 10000, // 품질 높이기 쿨다운
    max_downgrades_per_minute: 3,
  },

  // 수동 오버라이드
  manual_override: {
    enabled: true,
    persist_to_settings: true,
  },
}
```

### 9.5.3. 렌더링 최적화

```javascript
const RENDERING_OPTIMIZATIONS = {
  // 스프라이트 배칭
  sprite_batching: {
    enabled: true,
    batch_size: 4096, // 한 번에 4096개 스프라이트
    sort_by: 'texture', // 텍스처별 정렬로 드로우콜 최소화
    dynamic_batching: true, // 동적 엔티티도 배칭
  },

  // 뷰포트 컬링
  viewport_culling: {
    enabled: true,
    padding: 100, // 뷰포트 밖 100px까지 렌더
    quadtree: true, // 쿼드트리 공간 분할
    update_frequency: 16, // 60fps 기준 매 프레임
  },

  // LOD (Level of Detail)
  lod: {
    enabled: true,
    levels: [
      { distance: 0, detail: 'full' },
      { distance: 500, detail: 'reduced' },
      { distance: 1000, detail: 'minimal' },
      { distance: 2000, detail: 'icon' },
    ],
  },

  // 텍스처 관리
  texture_management: {
    atlas_size: 2048, // 2048x2048 아틀라스
    mipmap: false, // 2D 게임에서 불필요
    format: 'webp', // 압축 포맷
    lazy_loading: true, // 필요할 때 로드
    unload_unused: true, // 사용 안 하면 해제
    unload_delay: 30000, // 30초 후 해제
  },

  // 파티클 시스템
  particles: {
    pooling: true,
    pool_size: 10000,
    max_active: 5000,
    adaptive_spawn_rate: true, // 성능에 따라 스폰율 조절
  },

  // 렌더 타겟
  render_targets: {
    downscale_factor: 1, // 저사양에서 0.75로 낮춤
    clear_color: 0x000000,
  },
}
```

### 9.5.4. 게임 로직 최적화

```javascript
const LOGIC_OPTIMIZATIONS = {
  // 틱 시스템
  tick_system: {
    base_tps: 60, // 초당 60틱
    variable_timestep: true, // 가변 타임스텝
    max_delta: 100, // 최대 100ms (프레임 드롭 방지)

    // 시스템별 업데이트 빈도
    update_frequencies: {
      input: 60, // 매 틱
      physics: 60, // 매 틱
      logistics: 30, // 30 TPS (벨트, 투입기)
      production: 10, // 10 TPS (생산 건물)
      energy: 5, // 5 TPS (전력 계산)
      research: 1, // 1 TPS (연구)
      market: 1, // 1 TPS (시장)
      achievements: 1, // 1 TPS (업적 체크)
      autosave: 0.2, // 5초마다 (0.2 TPS)
    },
  },

  // 청크 분할 처리
  chunk_processing: {
    enabled: true,
    chunk_size: 100, // 한 청크당 100개 엔티티
    max_chunks_per_frame: 5, // 프레임당 최대 5청크 처리
    priority_queue: true, // 가시 영역 우선
  },

  // Web Worker 활용
  web_workers: {
    enabled: true,
    workers: {
      pathfinding: {
        enabled: true,
        thread_pool_size: 2,
      },
      physics: {
        enabled: false, // 단순 2D라 불필요
      },
      serialization: {
        enabled: true, // 저장/로드 시 사용
        thread_pool_size: 1,
      },
    },
  },

  // 오브젝트 풀링
  object_pooling: {
    enabled: true,
    pools: {
      items: { initial: 1000, max: 10000 },
      particles: { initial: 5000, max: 20000 },
      ui_elements: { initial: 100, max: 500 },
      vectors: { initial: 500, max: 2000 },
    },
    gc_hint_threshold: 1000, // 1000개 반환 시 GC 힌트
  },

  // 캐싱
  caching: {
    recipe_results: true, // 레시피 계산 결과 캐싱
    path_cache: {
      enabled: true,
      max_entries: 1000,
      ttl: 5000, // 5초
    },
    grid_neighbors: true, // 이웃 그리드 캐싱
  },
}
```

### 9.5.5. 메모리 최적화

```javascript
const MEMORY_OPTIMIZATIONS = {
  // 메모리 예산
  memory_budget: {
    total: 200 * 1024 * 1024, // 200MB
    breakdown: {
      textures: 0.4, // 40% (80MB)
      audio: 0.15, // 15% (30MB)
      game_state: 0.2, // 20% (40MB)
      ui: 0.1, // 10% (20MB)
      buffers: 0.15, // 15% (30MB)
    },
  },

  // 텍스처 메모리 관리
  texture_memory: {
    max_loaded: 50 * 1024 * 1024, // 50MB
    compression: 'etc2', // 모바일 GPU 압축
    unload_strategy: 'lru', // Least Recently Used
  },

  // 가비지 컬렉션 최적화
  gc_optimization: {
    avoid_allocation_in_loop: true,
    reuse_arrays: true,
    typed_arrays_for_math: true,
    string_interning: true,

    // 메모리 압력 감지
    pressure_monitoring: {
      enabled: true,
      threshold: 0.8, // 80% 사용 시 경고
      action: 'reduce_quality', // 품질 낮춤
    },
  },

  // 대용량 데이터 처리
  large_data: {
    save_compression: 'lz4', // 빠른 압축
    chunk_streaming: true, // 청크 단위 스트리밍
    lazy_deserialization: true, // 필요할 때 역직렬화
  },
}
```

### 9.5.6. 네트워크 최적화

```javascript
const NETWORK_OPTIMIZATIONS = {
  // API 요청 최적화
  api_requests: {
    batching: {
      enabled: true,
      max_batch_size: 10,
      max_wait_time: 100, // 100ms 대기 후 배치 전송
    },
    compression: {
      request: 'gzip',
      response: 'br', // Brotli 우선
    },
    caching: {
      strategy: 'stale-while-revalidate',
      ttl: {
        leaderboard: 30000, // 30초
        profile: 300000, // 5분
        blueprints: 60000, // 1분
      },
    },
  },

  // 실시간 동기화
  realtime: {
    protocol: 'websocket',
    fallback: 'long-polling',
    heartbeat_interval: 30000, // 30초
    reconnect: {
      enabled: true,
      max_attempts: 5,
      backoff: 'exponential',
      initial_delay: 1000,
      max_delay: 30000,
    },
  },

  // 델타 동기화
  delta_sync: {
    enabled: true,
    diff_algorithm: 'jsondiffpatch',
    max_history: 10,
    full_sync_interval: 300000, // 5분마다 전체 동기화
  },

  // 오프라인 지원
  offline: {
    service_worker: true,
    cache_strategy: {
      static_assets: 'cache-first',
      api_responses: 'network-first',
      game_saves: 'local-first',
    },
    sync_queue: {
      enabled: true,
      max_queue_size: 100,
      retry_strategy: 'exponential-backoff',
    },
  },
}
```

---

[← 이전: Backend](./09-b-backend.md) | [다음: Game Engine →](./09-d-engine.md)
