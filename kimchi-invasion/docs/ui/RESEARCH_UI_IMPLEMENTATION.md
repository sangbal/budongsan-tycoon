# Research UI 구현 보고서

**작성일:** 2026-01-19
**작업자:** Design Agent
**작업 유형:** UI/UX 구현

---

## 작업 개요

KIMCHI INVASION 게임의 **연구 UI 패널**을 구현했습니다. 이는 기술 트리 시각화, 연구 진행 관리, 상세 정보 표시를 포함하는 DOM 기반 사이드 패널입니다.

---

## 구현 내용

### 1. 파일 구조

```
kimchi-invasion/
├── src/
│   ├── ui/
│   │   ├── researchUI.js          # ✅ 신규 생성 (연구 UI 패널)
│   │   └── index.js                # ✅ 수정 (연구 UI 통합)
│   ├── i18n/
│   │   └── translations/
│   │       ├── ko.js               # ✅ 수정 (연구 번역 추가)
│   │       └── en.js               # ✅ 수정 (연구 번역 추가)
│   └── core/
│       └── input.js                # ✅ 수정 (R 키 단축키 추가)
└── docs/
    └── ui/
        └── RESEARCH_UI_IMPLEMENTATION.md  # ✅ 이 문서
```

---

## 주요 기능

### 1. 기술 트리 시각화

- **Tier별 그룹 표시** (Tier 1-5)
- **기술 노드**: 아이콘, 이름, 상태 배지
- **상태별 색상**:
  - 🔒 **잠김** (회색, grayscale): 선행 기술 미완료
  - ✅ **연구 가능** (녹색): 비용 충족
  - ⏳ **연구 중** (노란색): 진행 중
  - ✔️ **완료** (청록색): 연구 완료

### 2. 기술 상세 정보

- **기본 정보**: 아이콘, 이름, 설명
- **비용**: 자원별 현재/필요 수량 (색상 구분)
- **연구 시간**: "1분 30초" 형식
- **선행 기술**: 완료/미완료 구분
- **효과**: 배수, 해금, 보너스 형식화

### 3. 연구 진행

- **진행률 바**: 실시간 업데이트 (1초마다)
- **남은 시간 표시**
- **취소 버튼**: 자원 환불 없음 (설계 의도)

### 4. 인터랙션

- **클릭**: 기술 선택 → 상세 정보 표시
- **키보드 단축키**:
  - `R`: 연구 패널 토글
  - `ESC`: 패널 닫기

---

## 기술적 구현

### 1. ResearchUI 클래스

```javascript
export class ResearchUI {
  constructor() {
    this.panel = null              // 패널 루트 DOM
    this.techTreeContainer = null  // 기술 트리 컨테이너
    this.detailContainer = null    // 상세 정보 컨테이너
    this.selectedTechId = null     // 현재 선택된 기술
    this.techNodes = new Map()     // 기술 노드 DOM 캐시
    this.updateTimer = null        // 1초마다 업데이트
  }

  // 주요 메서드
  createPanel()              // 패널 생성
  renderTechTree()           // 기술 트리 렌더링
  selectTech(techId)         // 기술 선택
  startResearch(techId)      // 연구 시작
  cancelResearch()           // 연구 취소
  updateTechNode(techId)     // 노드 상태 업데이트
  startUpdateLoop()          // 주기적 업데이트
}
```

### 2. 이벤트 시스템

ResearchSystem 이벤트를 구독하여 실시간 UI 업데이트:

```javascript
researchSystem.on('researchStarted', () => this.updateAll())
researchSystem.on('researchCompleted', event => {
  this.updateAll()
  console.log('Research completed:', event.techId)
})
researchSystem.on('researchCancelled', () => this.updateAll())
```

### 3. 상태 계산 로직

```javascript
getTechStatus(techId) {
  // 1. 완료 확인
  if (researchSystem.isResearched(techId)) return 'completed'

  // 2. 연구 중 확인
  if (researchSystem.currentResearch === techId) return 'researching'

  // 3. 선행 기술 확인
  if (!hasPrerequisites(...)) return 'locked'

  // 4. 자원 확인
  const canAfford = Object.entries(tech.cost).every(...)
  return canAfford ? 'available' : 'locked'
}
```

### 4. 성능 최적화

- **DOM 캐싱**: `techNodes` Map으로 재사용
- **조건부 업데이트**: 상태 변경 시만 DOM 조작
- **1초 주기 업데이트**: requestAnimationFrame 대신 setInterval

---

## UI/UX 디자인

### 1. 색상 테마 (SF/화성 테마)

```css
--color-tech-blue: #00d4ff /* 연구 제목, 선택 강조 */ --color-tech-green: #00ff88 /* 완료 상태 */
  --color-mars-orange: #e85d04 /* Tier 헤더 */ --color-warning: #ffbe0b /* 연구 중 */
  --color-danger: #ff006e /* 취소 버튼 */ --color-success: #06d6a0 /* 연구 시작 버튼 */;
```

### 2. 레이아웃

```
┌─────────────────────────────────┐
│ 🔬 연구                    [✕]  │ ← 헤더
├─────────────────────────────────┤
│ Tier 1                          │
│ ┌──┬──┬──┐                      │
│ │🔧│🌱│  │                      │ ← 기술 노드 그리드
│ └──┴──┴──┘                      │
│ Tier 2                          │
│ ┌──┬──┬──┬──┐                   │
│ │🧪│☀️│💧│🔧│                   │
│ └──┴──┴──┴──┘                   │
│ ... (Tier 3-5)                  │
├─────────────────────────────────┤
│ 🧪 고급 발효 기술               │ ← 상세 정보
│ 발효 공정 최적화로...           │
│                                 │
│ 비용:                           │
│ ✅ 유산균 데이터: 100 / 30      │
│                                 │
│ [연구 시작]                     │
└─────────────────────────────────┘
```

### 3. 반응형 (모바일)

```css
@media (max-width: 768px) {
  .tier-techs {
    grid-template-columns: repeat(2, 1fr); /* 2열 그리드 */
  }

  .tech-detail {
    max-height: 40vh; /* 화면의 40% */
  }
}
```

---

## 다국어 지원

### 한국어 (ko.js)

```javascript
research: {
  title: '연구',
  tier: 'Tier {tier}',
  status: { locked: '잠김', available: '연구 가능', ... },
  actions: { start: '연구 시작', cancel: '취소' },
  cost: '비용',
  time: '연구 시간',
  effects: '효과',
  prerequisites: '선행 기술',
},
technologies: {
  efficientDrills: {
    name: '효율적 채굴',
    desc: '채굴 장비 최적화로 채굴 속도가 20% 증가합니다.',
  },
  // ... 15개 기술
}
```

### 영어 (en.js)

```javascript
research: {
  title: 'Research',
  tier: 'Tier {tier}',
  status: { locked: 'Locked', available: 'Available', ... },
  actions: { start: 'Start Research', cancel: 'Cancel' },
  cost: 'Cost',
  time: 'Research Time',
  effects: 'Effects',
  prerequisites: 'Prerequisites',
},
technologies: {
  efficientDrills: {
    name: 'Efficient Drills',
    desc: 'Mining equipment optimization increases mining speed by 20%.',
  },
  // ... 15 technologies
}
```

---

## 통합 (UI Index)

### ui/index.js 수정

```javascript
import { createResearchUI } from './researchUI.js'

let researchUI = null

export async function initUI() {
  // ... 기존 초기화

  // Initialize ResearchUI (DOM-based)
  researchUI = createResearchUI()
  researchUI.hide() // 초기에는 숨김
  console.log('[UI] Research UI initialized')
}

export function cleanupUI() {
  // ... 기존 정리

  if (researchUI) {
    researchUI.destroy()
    researchUI = null
  }
}

// 외부 API
export function toggleResearchPanel() {
  researchUI?.toggle()
}
export function showResearchPanel() {
  researchUI?.show()
}
export function hideResearchPanel() {
  researchUI?.hide()
}
```

---

## 키보드 단축키 (input.js)

```javascript
function handleGlobalHotkeys(key, modifiers) {
  // R: 연구 패널 토글
  if (key === 'r' && !modifiers.ctrl && !modifiers.alt) {
    import('../ui/index.js').then(({ toggleResearchPanel }) => {
      toggleResearchPanel()
    })
  }

  // ESC: 모든 패널 닫기
  if (key === 'escape') {
    import('../ui/index.js').then(({ hideResearchPanel }) => {
      hideResearchPanel()
    })
  }
}
```

---

## 사용 방법

### 1. 게임 내 사용

```javascript
// 게임 실행 시 자동 초기화됨 (main.js → initUI → createResearchUI)

// 패널 열기
import { showResearchPanel } from './ui/index.js'
showResearchPanel()

// 또는 키보드 단축키 'R'
```

### 2. 디버깅

```javascript
// 개발자 콘솔에서
window.researchSystem.debugPrintAll() // 연구 상태 출력
window.researchSystem.debugUnlockAll() // 모든 기술 해금
window.researchSystem.debugCompleteNow() // 현재 연구 즉시 완료
```

---

## 접근성 (Accessibility)

### 구현된 기능

✅ **키보드 네비게이션**: R, ESC 단축키
✅ **명확한 라벨**: `aria-label` 속성 (닫기 버튼 등)
✅ **색상 대비**: WCAG AA 준수 (4.5:1 이상)
✅ **시각적 피드백**: 호버, 선택 상태 명확
✅ **스크린 리더 지원**: 시맨틱 HTML (`<button>`, `<h2>`, `<ul>`)

### 추가 개선 가능 항목

⚠️ **Tab 키 네비게이션**: 기술 노드 간 이동
⚠️ **ARIA 역할**: `role="tree"`, `role="treeitem"` (기술 트리)
⚠️ **실시간 알림**: `aria-live="polite"` (연구 완료 시)

---

## 테스트 가이드

### 1. 수동 테스트 시나리오

#### 시나리오 1: 첫 연구 시작

1. 게임 시작 → `R` 키 누름 → 연구 패널 열림
2. Tier 1의 "효율적 채굴" 클릭
3. 상세 정보 확인:
   - 비용: 유산균 데이터 10 (현재 0 / 10) → 빨간색 표시
   - 상태 배지: "잠김"
4. 게임 플레이로 유산균 데이터 10 획득
5. 상태 배지 자동 변경: "연구 가능" (녹색)
6. "연구 시작" 버튼 클릭
7. 진행률 바 표시 (0% → 100%, 30초 소요)
8. 완료 시:
   - 상태 배지: "완료" (청록색)
   - 체크 마크 표시
   - 효과 적용 확인 (채굴 속도 +20%)

#### 시나리오 2: 선행 기술 확인

1. Tier 2의 "고급 발효 기술" 클릭
2. 선행 기술 확인:
   - 🌱 개선된 농법: ❌ (빨간색 취소선)
3. "개선된 농법" 연구 완료
4. "고급 발효 기술" 상태 자동 변경: "연구 가능"

#### 시나리오 3: 연구 취소

1. 연구 시작 후 5초 경과
2. "취소" 버튼 클릭
3. 진행률 바 제거
4. 상태 배지: "연구 가능" 복원
5. 자원 환불 **없음** (설계 의도 확인)

### 2. 자동화 테스트 (TODO)

```javascript
// tests/ui/researchUI.spec.js (Vitest)
describe('ResearchUI', () => {
  it('should render tech tree with 5 tiers', () => {
    const ui = new ResearchUI()
    expect(document.querySelectorAll('.tier-group').length).toBe(5)
  })

  it('should show detail panel on tech click', () => {
    const ui = new ResearchUI()
    const node = document.querySelector('[data-tech-id="efficientDrills"]')
    node.click()
    expect(ui.detailContainer.classList.contains('hidden')).toBe(false)
  })

  it('should update status when resources change', async () => {
    const ui = new ResearchUI()
    resourceSystem.add('lactobacillusData', 10)
    await new Promise(resolve => setTimeout(resolve, 1100)) // 1초 업데이트 대기
    const node = document.querySelector('[data-tech-id="efficientDrills"]')
    expect(node.classList.contains('status-available')).toBe(true)
  })
})
```

---

## 알려진 이슈 및 해결

### 이슈 1: 번역 키 interpolation

**문제**: `t('research.tier', { tier: 1 })` 형식 미지원
**임시 해결**: 문자열 치환 (`'Tier {tier}'.replace('{tier}', 1)`)
**TODO**: i18n 시스템에 interpolation 기능 추가

### 이슈 2: 효과 포맷팅

**문제**: 효과 타입이 다양해 포맷팅 복잡
**해결**: `formatEffect()` 메서드로 타입별 처리

```javascript
formatEffect(effect) {
  if (effect.type === 'multiplier') {
    const percent = ((effect.value - 1) * 100).toFixed(0)
    return `${effect.target}: +${percent}%`
  } else if (effect.type === 'unlock') {
    return `🔓 ${effect.target} 해금`
  } else if (effect.type === 'bonus') {
    const percent = (effect.value * 100).toFixed(0)
    return `${effect.target}: ${percent}%`
  }
}
```

---

## 다음 단계

### 1. UI 개선

- [ ] 기술 간 의존성 연결선 시각화 (SVG/Canvas)
- [ ] 애니메이션 추가 (연구 완료 시 파티클 효과)
- [ ] 모바일 터치 제스처 최적화 (스와이프로 Tier 전환)

### 2. 기능 추가

- [ ] 즐겨찾기/필터 기능 (Tier별, 카테고리별)
- [ ] 검색 기능 (기술 이름/설명)
- [ ] 추천 기술 표시 (다음에 연구하면 좋은 것)

### 3. 접근성 향상

- [ ] ARIA Tree 역할 적용
- [ ] 키보드 화살표 키로 노드 이동
- [ ] 연구 완료 시 `aria-live` 알림

### 4. 테스트

- [ ] Vitest 단위 테스트 작성
- [ ] Playwright E2E 테스트 작성
- [ ] 접근성 자동 테스트 (axe-core)

---

## 참고 자료

### 관련 파일

- `kimchi-invasion/src/data/technologies.js` - 기술 정의
- `kimchi-invasion/src/systems/researchSystem.js` - 연구 로직
- `kimchi-invasion/src/ui/buildMenu.js` - UI 패턴 참조

### 디자인 참고

- Factorio: 기술 트리 레이아웃
- Oxygen Not Included: 상태별 색상 구분
- Shapez: 미니멀 UI 디자인

---

## 결론

KIMCHI INVASION의 연구 UI 패널이 성공적으로 구현되었습니다. 주요 달성 사항:

✅ **기능 완성도**: 기술 트리 시각화, 연구 진행, 상세 정보 표시
✅ **사용자 경험**: 직관적 인터랙션, 실시간 업데이트
✅ **다국어 지원**: 한국어/영어 번역 완료
✅ **접근성**: 키보드 네비게이션, 색상 대비 준수
✅ **성능**: DOM 캐싱, 조건부 업데이트로 최적화

이제 플레이어는 `R` 키를 눌러 연구 패널을 열고, 기술을 선택하여 연구를 시작할 수 있습니다. 15개의 기술 (Tier 1-5)이 준비되었으며, 각 기술은 선행 기술과 효과가 명확히 표시됩니다.

**다음 작업**: UI 컴포넌트 (건물 메뉴, 자원 바 등)와의 통합 테스트를 진행하여 전체 게임 흐름에서 연구 시스템이 원활히 작동하는지 확인할 예정입니다.
