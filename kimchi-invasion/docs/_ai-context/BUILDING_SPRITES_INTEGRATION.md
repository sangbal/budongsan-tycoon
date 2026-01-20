# 건물 스프라이트 시스템 통합 가이드

## 개요

10종 건물의 PixiJS Graphics 기반 플레이스홀더 스프라이트 시스템이 구현되었습니다.

**구현 날짜:** 2026-01-19
**상태:** ✅ 완료

## 구현 파일

### 1. `src/ui/buildingSprites.js` (핵심 모듈)

건물 스프라이트 생성 및 관리 함수 제공:

```javascript
import { createBuildingSprite, getBuildingSprite, renderBuilding } from './ui/buildingSprites.js'

// 스프라이트 생성
const sprite = createBuildingSprite('extractor', 2) // 타입, 레벨

// 캐시된 스프라이트 가져오기 (복제)
const cachedSprite = getBuildingSprite('greenhouse', 1)

// 건물 렌더링
const building = { id: 'b1', type: 'extractor', x: 5, y: 3, level: 1 }
renderBuilding(building, building.x, building.y, container)
```

**주요 함수:**

| 함수                       | 설명                                 |
| -------------------------- | ------------------------------------ |
| `initBuildingSprites()`    | 타일 크기 초기화 (게임 시작 시 호출) |
| `createBuildingSprite()`   | 새 스프라이트 생성                   |
| `getBuildingSprite()`      | 캐시된 스프라이트 복제               |
| `renderBuilding()`         | 컨테이너에 건물 렌더링               |
| `removeBuilding()`         | 건물 스프라이트 제거                 |
| `upgradeBuilding()`        | 레벨 업그레이드 (스프라이트 교체)    |
| `updateBuildingProgress()` | 진행률 바 업데이트                   |
| `highlightBuilding()`      | 선택/호버 하이라이트                 |
| `markNoPower()`            | 에너지 부족 경고 표시                |
| `clearSpriteCache()`       | 캐시 초기화                          |

### 2. `src/ui/buildingRenderer.js` (통합 레이어)

`buildingSystem` 이벤트와 스프라이트를 연결:

```javascript
import { initBuildingRenderer } from './ui/buildingRenderer.js'

// UI 초기화 시 호출
initBuildingRenderer()

// 게임 루프에서 업데이트
updateBuildingRenderer(deltaTime)
```

**이벤트 리스너:**

- `placed` → 건물 배치 시 스프라이트 생성
- `removed` → 건물 제거 시 스프라이트 삭제
- `upgraded` → 건물 업그레이드 시 스프라이트 교체
- `productionComplete` → 생산 완료 시 진행률 바 초기화

**선택/호버 관리:**

```javascript
import { selectBuilding, hoverBuilding, deselectBuilding } from './ui/buildingRenderer.js'

// 건물 선택 (노란 테두리)
selectBuilding('building_123')

// 건물 호버 (회색 테두리)
hoverBuilding('building_456')

// 선택 해제
deselectBuilding()
```

### 3. `src/ui/index.js` (UI 초기화 통합)

**수정 내용:**

```javascript
// Import 추가
import {
  initBuildingRenderer,
  updateBuildingRenderer,
  destroyBuildingRenderer,
} from './buildingRenderer.js'

// initUI() 함수에 추가
initBuildingRenderer()

// updateUI() 함수에 추가
updateBuildingRenderer(deltaTime)

// cleanupUI() 함수에 추가
destroyBuildingRenderer()
```

## 색상 코딩 시스템

건물 카테고리별 색상:

| 카테고리   | 건물             | 색상   | HEX        |
| ---------- | ---------------- | ------ | ---------- |
| Extraction | Extractor        | 갈색   | `0x8B4513` |
| Extraction | Ice Harvester    | 하늘색 | `0x87CEEB` |
| Production | Greenhouse       | 초록   | `0x4CAF50` |
| Production | Furnace          | 주황   | `0xFF5722` |
| Production | Brine Station    | 파랑   | `0x2196F3` |
| Production | Fermentation     | 빨강   | `0xF44336` |
| Power      | Coal Power Plant | 노랑   | `0xFFEB3B` |
| Utility    | Warehouse        | 보라   | `0x9C27B0` |
| Logistics  | Conveyor         | 회색   | `0x9E9E9E` |
| Logistics  | Inserter         | 청회색 | `0x607D8B` |

## 스프라이트 구조

```
Container (sprite_extractor_lv2)
├── Graphics (배경 + 테두리)
├── Text (아이콘 이모지, 중앙 배치)
├── Graphics (레벨 배경) [레벨 2+ 만]
├── Text (레벨 텍스트) [레벨 2+ 만]
├── Graphics (진행률 바) [processTime > 0 만]
├── Graphics (하이라이트) [선택/호버 시]
└── Graphics (에너지 부족 경고) [에너지 부족 시]
```

## 크기 계산

```javascript
// 타일 크기 (tilemap.js에서 동적으로 가져옴)
const TILE_SIZE = getTileSize() // 64px

// 건물 크기
const width = building.size.width * TILE_SIZE
const height = building.size.height * TILE_SIZE

// 예시:
// - Extractor (2x2): 128x128px
// - Greenhouse (3x3): 192x192px
// - Conveyor (1x1): 64x64px
```

## 캐시 시스템

스프라이트는 `타입_레벨` 키로 캐시되어 성능 최적화:

```javascript
const key = `${buildingType}_${level}` // 예: "extractor_2"
spriteCache.set(key, sprite)

// 복제 시 Graphics는 context.clone() 사용
```

## 진행률 바 표시

`processTime > 0`인 건물 (greenhouse, furnace 등)에 진행률 바 표시:

```javascript
// buildingSystem에서 progress 업데이트
building.progress += deltaTime / def.processTime

// buildingRenderer에서 자동 렌더링
updateBuildingProgress(building.id, building.progress, container)
```

**진행률 바 스타일:**

- 위치: 건물 하단 (y = height - 6)
- 크기: width - 4 (좌우 2px 여백)
- 높이: 4px
- 배경: 회색 (`0x333333`, alpha: 0.8)
- 진행: 초록 (`0x00FF00`, alpha: 1.0)
- 테두리: 검정 (1px)

## 테스트

### 단위 테스트

파일: `src/ui/__tests__/buildingSprites.test.js`

```bash
npm run test:unit -- buildingSprites.test.js
```

**테스트 커버리지:**

- ✅ 스프라이트 생성 (유효/무효 타입)
- ✅ 레벨 표시 (1 vs 2+)
- ✅ 캐시 복제
- ✅ 렌더링 및 제거
- ✅ 업그레이드
- ✅ 진행률 바
- ✅ 하이라이트
- ✅ 캐시 초기화

### 수동 테스트

브라우저 콘솔:

```javascript
// buildingSystem으로 건물 배치
window.buildingSystem.place('extractor', 5, 5)
window.buildingSystem.place('greenhouse', 10, 10)

// 건물 선택
window.buildingRenderer.selectBuilding('building_123')

// 모든 건물 출력
window.buildingSystem.debugPrintAll()

// 캐시 상태 확인
import { debugPrintCache } from './ui/buildingSprites.js'
debugPrintCache()
```

## 디버깅

### 건물 레이어 확인

```javascript
import { getBuildingLayer } from './ui/buildingRenderer.js'

const layer = getBuildingLayer()
console.log('Building layer:', layer)
console.log('Children count:', layer.children.length)
```

### 스프라이트 검사

```javascript
const sprite = layer.children.find(child => child.label === 'building_abc123')
console.log('Sprite:', sprite)
console.log('Position:', sprite.x, sprite.y)
console.log('Children:', sprite.children)
```

## 다음 단계

### 1. 클릭 인터랙션

```javascript
// input.js에서 클릭 이벤트 처리
sprite.interactive = true
sprite.on('pointerdown', () => {
  const building = buildingSystem.getBuilding(sprite.buildingId)
  // 건물 상세 UI 표시
})
```

### 2. 애니메이션

```javascript
// 생산 중 아이콘 회전
if (building.isProducing) {
  icon.rotation += deltaTime * 0.5
}

// 에너지 부족 시 깜빡임
if (noPower) {
  powerWarning.alpha = Math.sin(Date.now() / 200) * 0.5 + 0.5
}
```

### 3. 입력/출력 표시

```javascript
// 건물 위에 자원 아이콘 표시
function showInputOutput(building) {
  const def = BUILDINGS[building.type]

  // 입력 자원
  for (const [resourceId, amount] of Object.entries(def.input)) {
    addResourceIcon(resourceId, -amount, 'left')
  }

  // 출력 자원
  for (const [resourceId, amount] of Object.entries(def.output)) {
    addResourceIcon(resourceId, +amount, 'right')
  }
}
```

### 4. 툴팁

```javascript
sprite.on('pointerover', () => {
  const building = buildingSystem.getBuilding(sprite.buildingId)
  const def = BUILDINGS[building.type]

  showTooltip({
    title: t(`buildings.${building.type}.name`),
    description: t(`buildings.${building.type}.desc`),
    stats: {
      level: building.level,
      production: getProductionRate(building.type, building.level),
      energy: def.energyPerTick,
    },
  })
})
```

## 체크리스트

- [x] `buildingSprites.js` 구현
- [x] `buildingRenderer.js` 구현
- [x] `ui/index.js` 통합
- [x] 10종 건물 색상 코딩
- [x] 레벨 표시 (2 이상)
- [x] 진행률 바
- [x] 하이라이트 시스템
- [x] 캐시 시스템
- [x] 단위 테스트
- [x] 문서 작성
- [ ] 클릭 인터랙션
- [ ] 애니메이션
- [ ] 입력/출력 표시
- [ ] 툴팁

## 참고 자료

- **GDD:** `kimchi-invasion/docs/03-visual-ux/01-visual-identity.md`
- **건물 데이터:** `kimchi-invasion/src/data/buildings.js`
- **타일맵:** `kimchi-invasion/src/core/tilemap.js`
- **건물 시스템:** `kimchi-invasion/src/systems/buildingSystem.js`

## 기술 결정

### 왜 Graphics인가?

- ✅ 초기 프로토타입에 적합 (빠른 구현)
- ✅ 성능 충분 (100개 이하 건물)
- ✅ 코드만으로 생성 가능 (에셋 불필요)
- ⚠️ 향후 스프라이트 시트로 교체 가능

### 왜 캐시를 사용하는가?

- ✅ Graphics 복제 비용 감소
- ✅ 메모리 효율 (같은 타입/레벨은 1번만 생성)
- ✅ 일관성 유지 (색상/크기 변경 시 자동 반영)

### 왜 buildingRenderer를 분리했는가?

- ✅ 관심사 분리 (System vs Rendering)
- ✅ 이벤트 기반 아키텍처
- ✅ 테스트 용이성
- ✅ 향후 렌더링 엔진 교체 가능

---

**작성자:** Design Agent
**검토자:** Game Director
**버전:** v0.1.0
