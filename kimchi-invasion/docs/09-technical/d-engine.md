# 9-D. 게임 엔진 아키텍처 (Game Engine Architecture)

> **Last Updated:** 2026-01-19
>
> 원본: `09-technical.md` 섹션 9.6

[← 이전: Performance](./09-c-performance.md) | [다음: Save System →](./09-e-save-system.md)

---

## 9.6. 게임 엔진 아키텍처

### 9.6.1. 게임 루프 상세

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Game Loop (60 TPS)                              │
│                                                                      │
│  ┌──────────┐                                                       │
│  │  Frame   │                                                       │
│  │  Start   │                                                       │
│  └────┬─────┘                                                       │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────┐    ┌──────────────────────────────────────┐          │
│  │  Input   │ →  │ Keyboard, Mouse, Touch, Gamepad      │          │
│  │ Process  │    └──────────────────────────────────────┘          │
│  └────┬─────┘                                                       │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────┐    ┌──────────────────────────────────────┐          │
│  │  Update  │ →  │ Physics, Logistics, Production,      │          │
│  │ Systems  │    │ Energy, Research, Market, AI         │          │
│  └────┬─────┘    └──────────────────────────────────────┘          │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────┐    ┌──────────────────────────────────────┐          │
│  │  State   │ →  │ Zustand Store Update, Event Emit     │          │
│  │  Sync    │    └──────────────────────────────────────┘          │
│  └────┬─────┘                                                       │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────┐    ┌──────────────────────────────────────┐          │
│  │  Render  │ →  │ PixiJS Stage Update, UI Sync         │          │
│  │  Frame   │    └──────────────────────────────────────┘          │
│  └────┬─────┘                                                       │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────┐    ┌──────────────────────────────────────┐          │
│  │  Frame   │ →  │ FPS Counter, Profiling, Debug UI     │          │
│  │   End    │    └──────────────────────────────────────┘          │
│  └──────────┘                                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**구현 설정:**

```javascript
const GAME_LOOP_CONFIG = {
  loop_type: 'requestAnimationFrame',
  fixed_timestep: false,
  max_frame_time: 100, // 100ms 이상 걸리면 프레임 스킵
  min_frame_time: 16, // 60 FPS 상한
}
```

### 9.6.2. 엔티티 컴포넌트 시스템 (ECS)

```javascript
const ECS_ARCHITECTURE = {
  // 컴포넌트 정의
  components: {
    // 기본 컴포넌트
    Transform: {
      x: 'number',
      y: 'number',
      rotation: 'number',
      scale: 'number',
    },
    Renderable: {
      sprite: 'string',
      layer: 'number',
      visible: 'boolean',
      tint: 'number',
    },
    GridPosition: {
      gridX: 'number',
      gridY: 'number',
      width: 'number',
      height: 'number',
    },

    // 건물 컴포넌트
    Building: {
      type: 'string',
      tier: 'number',
      health: 'number',
      maxHealth: 'number',
    },
    Producer: {
      recipe: 'string',
      progress: 'number',
      inputSlots: 'array',
      outputSlots: 'array',
    },
    PowerConsumer: {
      consumption: 'number',
      powered: 'boolean',
    },
    PowerProducer: {
      production: 'number',
      fuelType: 'string',
      fuelRemaining: 'number',
    },
    Storage: {
      items: 'object',
      capacity: 'number',
    },

    // 물류 컴포넌트
    Belt: {
      direction: 'number',
      speed: 'number',
      items: 'array',
    },
    Inserter: {
      pickupTarget: 'string',
      dropTarget: 'string',
      armPosition: 'number',
      holdingItem: 'string',
    },

    // 아이템 컴포넌트
    Item: {
      type: 'string',
      quality: 'number',
      stackSize: 'number',
    },
  },

  // 시스템 우선순위
  systems_priority: [
    'InputSystem',
    'PhysicsSystem',
    'LogisticsSystem',
    'ProductionSystem',
    'EnergySystem',
    'ResearchSystem',
    'MarketSystem',
    'ThreatSystem',
    'AchievementSystem',
    'RenderSystem',
    'UISystem',
    'SaveSystem',
  ],

  // 엔티티 관리
  entity_management: {
    max_entities: 100000,
    id_recycling: true,
    spatial_partitioning: 'quadtree',
    query_caching: true,
  },
}
```

### 9.6.3. 이벤트 시스템

```javascript
const EVENT_SYSTEM = {
  // 이벤트 타입
  event_types: {
    // 게임 이벤트
    GAME_STARTED: { payload: {} },
    GAME_PAUSED: { payload: { reason: 'string' } },
    GAME_RESUMED: { payload: {} },
    GAME_SAVED: { payload: { slot: 'number' } },
    GAME_LOADED: { payload: { slot: 'number' } },

    // 엔티티 이벤트
    ENTITY_CREATED: { payload: { id: 'number', type: 'string' } },
    ENTITY_DESTROYED: { payload: { id: 'number' } },
    BUILDING_PLACED: { payload: { id: 'number', type: 'string', x: 'number', y: 'number' } },
    BUILDING_REMOVED: { payload: { id: 'number' } },

    // 생산 이벤트
    ITEM_PRODUCED: { payload: { type: 'string', amount: 'number', producerId: 'number' } },
    ITEM_CONSUMED: { payload: { type: 'string', amount: 'number' } },
    RECIPE_COMPLETED: { payload: { recipe: 'string', quality: 'number' } },

    // 자원 이벤트
    RESOURCE_MINED: { payload: { type: 'string', amount: 'number' } },
    RESOURCE_DEPLETED: { payload: { nodeId: 'number' } },

    // 연구 이벤트
    RESEARCH_STARTED: { payload: { tech: 'string' } },
    RESEARCH_COMPLETED: { payload: { tech: 'string' } },

    // 진행 이벤트
    MILESTONE_REACHED: { payload: { milestone: 'number' } },
    ACHIEVEMENT_UNLOCKED: { payload: { achievement: 'string' } },
    PRESTIGE_INITIATED: { payload: {} },
    PRESTIGE_COMPLETED: { payload: { bonus: 'number' } },

    // 위협 이벤트
    THREAT_STARTED: { payload: { type: 'string', severity: 'number' } },
    THREAT_ENDED: { payload: { type: 'string' } },
    DAMAGE_RECEIVED: { payload: { entityId: 'number', amount: 'number' } },

    // 시스템 이벤트
    POWER_SHORTAGE: { payload: { deficit: 'number' } },
    POWER_RESTORED: { payload: {} },
    LOGISTICS_BOTTLENECK: { payload: { location: 'object' } },
  },

  // 이벤트 버스 설정
  event_bus: {
    max_listeners_per_event: 50,
    async_dispatch: false, // 동기 디스패치 (성능)
    wildcard_support: true, // '*' 패턴 지원
    event_history: {
      enabled: true,
      max_history: 1000,
      persist_to_replay: true,
    },
  },
}
```

---

[← 이전: Performance](./09-c-performance.md) | [다음: Save System →](./09-e-save-system.md)
