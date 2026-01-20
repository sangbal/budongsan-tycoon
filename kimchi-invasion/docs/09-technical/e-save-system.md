# 9-E. 저장 시스템 (Save System)

> **Last Updated:** 2026-01-19
>
> 원본: `09-technical.md` 섹션 9.7

[← 이전: Game Engine](./09-d-engine.md) | [다음: Security →](./09-f-security.md)

---

## 9.7. 저장 시스템

### 9.7.1. 저장 계층 상세

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         💾 저장 시스템 계층 v2                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Layer 0: 메모리 상태 (Zustand Store)                                │   │
│  │ • 실시간 게임 상태                                                   │   │
│  │ • 매 틱 업데이트                                                     │   │
│  │ • 손실 허용: 최근 1틱                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                              매 5초 │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Layer 1: IndexedDB (오프라인 캐시)                                   │   │
│  │ • 구조화된 데이터 저장                                               │   │
│  │ • 50MB+ 용량                                                         │   │
│  │ • 비동기 접근                                                        │   │
│  │ • 손실 허용: 최근 5초                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                              탭 숨김/닫기 시                                │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Layer 2: LocalStorage (빠른 복구용 백업)                             │   │
│  │ • 5MB 제한                                                           │   │
│  │ • 동기 접근 (빠름)                                                   │   │
│  │ • 압축 저장 (LZString)                                               │   │
│  │ • 손실 허용: 없음 (로컬 최종 백업)                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                              네트워크 연결 시                               │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Layer 3: Supabase Cloud (영구 저장)                                  │   │
│  │ • 크로스 디바이스 동기화                                             │   │
│  │ • 무제한 용량                                                        │   │
│  │ • 인증 필요                                                          │   │
│  │ • 버전 히스토리 유지                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 충돌 해결 전략                                                        │   │
│  │ ───────────────────────────────────────────────────────────────────  │   │
│  │ 1. 타임스탬프 비교: 최신 저장 우선                                   │   │
│  │ 2. 진행도 비교: 더 진행된 세이브 우선                                │   │
│  │ 3. 사용자 선택: 충돌 시 UI로 선택 요청                               │   │
│  │ 4. 병합 시도: 가능한 경우 업적/통계 병합                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.7.2. 저장 데이터 구조

```typescript
interface GameSave {
  // 메타데이터
  meta: {
    version: string // 세이브 버전 (마이그레이션용)
    timestamp: number // UTC 타임스탬프
    playtime: number // 총 플레이 시간 (초)
    checksum: string // 무결성 체크섬
  }

  // 핵심 상태
  core: {
    money: number // 현재 자금
    resources: Record<ResourceType, number> // 자원 보유량
    milestone: number // 현재 마일스톤
  }

  // 건물 상태
  buildings: {
    placed: BuildingState[] // 배치된 건물
    unlocked: string[] // 해금된 건물 타입
  }

  // 물류 상태
  logistics: {
    belts: BeltState[] // 벨트 상태
    inserters: InserterState[] // 투입기 상태
    drones: DroneState[] // 드론 상태
  }

  // 연구 상태
  research: {
    completed: string[] // 완료된 연구
    inProgress: {
      tech: string
      progress: number
    } | null
    researchPoints: number // 연구 포인트
  }

  // 프레스티지 상태
  prestige: {
    count: number // 프레스티지 횟수
    lifetimeStats: LifetimeStats // 영구 통계
    permanentBonuses: Record<string, number> // 영구 보너스
    loadout: LoadoutConfig // 출발 장비
  }

  // 업적 상태
  achievements: {
    unlocked: string[] // 달성한 업적
    progress: Record<string, number> // 진행 중인 업적
  }

  // 통계
  stats: {
    current: SessionStats // 현재 세션 통계
    lifetime: LifetimeStats // 영구 통계
  }

  // 행성 정보 (프레스티지용)
  planet: PlanetConfig

  // 설정
  settings: {
    quality: QualityLevel
    audio: AudioSettings
    ui: UISettings
  }
}

interface BuildingState {
  id: number
  type: string
  x: number
  y: number
  rotation: number
  health: number
  inventory?: Record<string, number>
  craftingProgress?: number
  powered?: boolean
}

interface BeltState {
  id: number
  x: number
  y: number
  direction: number
  items: { type: string; position: number }[]
}
```

### 9.7.3. 세이브 마이그레이션

```javascript
const SAVE_MIGRATION = {
  // 버전 히스토리
  versions: [
    '1.0.0', // 초기 릴리즈
    '1.1.0', // 새 자원 타입 추가
    '1.2.0', // 프레스티지 시스템 변경
    '1.3.0', // 물류 시스템 리팩토링
  ],

  // 마이그레이션 함수
  migrations: {
    '1.0.0_to_1.1.0': save => {
      // 새 자원 필드 추가
      save.core.resources.refined_iron = save.core.resources.refined_iron || 0
      save.meta.version = '1.1.0'
      return save
    },
    '1.1.0_to_1.2.0': save => {
      // 프레스티지 구조 변경
      if (!save.prestige.loadout) {
        save.prestige.loadout = {
          startingResources: {},
          startingTechs: [],
          bonuses: {},
        }
      }
      save.meta.version = '1.2.0'
      return save
    },
    '1.2.0_to_1.3.0': save => {
      // 벨트 아이템 구조 변경
      save.logistics.belts = save.logistics.belts.map(belt => ({
        ...belt,
        items: belt.items.map(item =>
          typeof item === 'string' ? { type: item, position: 0 } : item
        ),
      }))
      save.meta.version = '1.3.0'
      return save
    },
  },

  // 자동 마이그레이션
  migrate(save) {
    const currentIndex = this.versions.indexOf(save.meta.version)
    const latestIndex = this.versions.length - 1

    for (let i = currentIndex; i < latestIndex; i++) {
      const from = this.versions[i]
      const to = this.versions[i + 1]
      const migrationKey = `${from}_to_${to}`

      if (this.migrations[migrationKey]) {
        save = this.migrations[migrationKey](save)
        console.log(`Migrated save from ${from} to ${to}`)
      }
    }

    return save
  },
}
```

---

[← 이전: Game Engine](./09-d-engine.md) | [다음: Security →](./09-f-security.md)
