# main.js 리팩토링 계획서

## 문서 메타데이터

- 작성일: 2026-01-18
- 작성자: Quality Agent
- 대상 파일: `seoulsurvival/src/main.js`
- 현재 상태: 2,384 라인 (God Object)
- 목표: 1,000 라인 이하 (60% 감축)

## 1. 현황 분석

### 파일 크기

```
파일명: seoulsurvival/src/main.js
라인 수: 2,384 라인
Import 수: 37개 (모듈 의존성)
함수 수: 약 60개 (추정)
변수 수: 100개 이상 (let/const)
```

### 주요 문제점

1. **God Object 패턴**
   - 게임 루프, 상태 관리, UI 업데이트, 이벤트 핸들러 등 모든 책임이 한 파일에 집중
   - 단일 책임 원칙(SRP) 위반

2. **변수 스코프 혼재**
   - DOMContentLoaded 내부에 100개 이상의 변수 선언
   - 게임 상태, UI 상태, 임시 변수가 구분 없이 혼재

3. **테스트 불가능**
   - 모든 로직이 IIFE(즉시 실행 함수)와 DOMContentLoaded에 감싸져 있음
   - 순수 함수가 아닌 전역 변수 참조 로직

4. **코드 중복**
   - 금융상품/부동산 구매 로직 중복
   - UI 업데이트 코드 중복

### 의존성 맵 (주요 import)

| 카테고리      | 모듈                                          | 사용 위치             |
| ------------- | --------------------------------------------- | --------------------- |
| **상태 관리** | `state/gameState.js`                          | 게임 전역 변수        |
| **경제**      | `economy/pricing.js`, `economy/income.js`     | 가격/수익 계산        |
| **시스템**    | `systems/market.js`, `systems/upgrades.js`    | 시장, 업그레이드      |
| **UI**        | `ui/gameUI.js`, `ui/statsTab.js`              | UI 렌더링             |
| **저장/로드** | `persist/saveLoad.js`, `persist/cloudSync.js` | 저장, 클라우드 동기화 |
| **다국어**    | `i18n/index.js`                               | 번역                  |
| **인증**      | `shared/auth/core.js`                         | Supabase 인증         |
| **리더보드**  | `shared/leaderboard.js`                       | 리더보드 업데이트     |

### 변수 카테고리 분석

#### A. 게임 핵심 상태 (gameState.js로 이동 완료 또는 이동 가능)

```javascript
// 이미 gameState.js에 존재하거나, 이동 가능한 변수들
;(cash, totalPlayTime, sessionStartTime)
;(deposits, savings, bonds, usStocks, cryptos)
;(villas, officetels, apartments, shops, buildings, towers_run, towers_lifetime)
;(careerLevel, totalLaborIncome)
;(clickMultiplier, rentMultiplier, autoClickEnabled, managerLevel)
;(marketMultiplier, marketEventEndTime, currentMarketEvent)
totalClicks
playerNickname
```

**권장 조치**: 이미 `gameState.js`에 일부 존재. 나머지도 `gameState` 객체로 통합.

#### B. UI 상태 (별도 모듈로 분리 가능)

```javascript
// UI 전용 변수들
;(purchaseMode, purchaseQuantity) // → ui/purchaseControls.js
__nicknameModalShown // → systems/nicknameManager.js
settings // → persist/settings.js
```

**권장 조치**: UI 전용 모듈로 분리 (또는 각 시스템 모듈에 통합).

#### C. DOM 참조 (domRefs.js로 이동 완료)

```javascript
// DOM 요소 참조 (이미 getDomRefs()로 분리됨)
elCash, elFinancial, elProperties, elRps, elWork, ...
```

**상태**: `ui/domRefs.js`에 이미 분리됨. main.js에서는 `getDomRefs()`로 접근.

#### D. 모듈 인스턴스 (Factory 패턴 유지)

```javascript
// 모듈 팩토리 인스턴스
;(saveLoadManager, nicknameManager, cloudSyncManager, gameUIInstance)
;(upgradeManager, achievementGridInstance, buttonStateManager)
;(UPGRADES, ACHIEVEMENTS)
```

**권장 조치**: 현재 구조 유지 (Factory 패턴은 의존성 주입에 적합).

#### E. 임시/로컬 변수 (함수 내부로 이동)

```javascript
// 함수 스코프로 이동 가능
lastSaveTime // → saveLoadManager 내부로 이동 가능
```

### 함수 책임 분석 (주요 함수만)

| 함수명                     | 라인 수 (추정) | 책임                              | 이동 후보 모듈                |
| -------------------------- | -------------- | --------------------------------- | ----------------------------- |
| `updateUI()`               | 200+           | 모든 UI 업데이트                  | → ui/gameUI.js (완료)         |
| `startGameLoop()`          | 100+           | 게임 루프 (requestAnimationFrame) | → core/gameLoop.js            |
| `getRps()`                 | 50+            | 초당 수익 계산                    | → economy/income.js (완료)    |
| `buyFinancial()`           | 30+            | 금융상품 구매                     | → systems/financialManager.js |
| `buyProperty()`            | 30+            | 부동산 구매                       | → systems/propertyManager.js  |
| `doWork()`                 | 20+            | 클릭 처리                         | → systems/labor.js            |
| `loadGame()`, `saveGame()` | 50+            | 저장/로드                         | → persist/saveLoad.js (완료)  |

## 2. 리팩토링 전략

### 접근 방식: 점진적 추출 (Incremental Extraction)

전체 재작성은 위험도가 높으므로, 기존 코드에서 함수/변수를 하나씩 분리하는 방식을 채택합니다.

**핵심 원칙:**

1. **한 번에 하나의 모듈만 분리**
2. **각 단계마다 테스트 실행**
3. **git commit을 자주** (되돌리기 쉽게)
4. **순환 의존성 회피** (모듈 간 import 관계를 단방향으로 유지)

### 리팩토링 단계 (8주 계획)

#### Week 1-2: 상태 관리 통합 (core/gameState.js 강화)

**목표**: main.js의 모든 게임 상태를 `gameState.js`로 이동

```javascript
// seoulsurvival/src/state/gameState.js (기존 파일 확장)

// 현재 상태 (일부만 존재)
export const gameState = {
  cash: 0,
  // ...
}

// 추가할 상태
export const gameState = {
  // 재화
  cash: 0,
  totalPlayTime: 0,
  sessionStartTime: Date.now(),

  // 금융상품
  deposits: 0,
  savings: 0,
  bonds: 0,
  usStocks: 0,
  cryptos: 0,

  // 부동산
  villas: 0,
  officetels: 0,
  apartments: 0,
  shops: 0,
  buildings: 0,
  towers_run: 0,
  towers_lifetime: 0,

  // 커리어
  careerLevel: 0,
  totalLaborIncome: 0,

  // 멀티플라이어
  clickMultiplier: 1,
  rentMultiplier: 1,
  autoClickEnabled: false,
  managerLevel: 0,

  // 시장
  marketMultiplier: 1.0,
  marketEventEndTime: 0,
  currentMarketEvent: null,

  // 기타
  totalClicks: 0,
  playerNickname: '',
}

// Getter/Setter 패턴 추가 (옵션)
export function getCash() {
  return gameState.cash
}
export function setCash(value) {
  gameState.cash = value
}
```

**작업 항목:**

- [ ] main.js의 모든 let 변수를 gameState.js로 이동
- [ ] main.js에서 `gameState.cash` 형태로 접근하도록 수정
- [ ] 테스트 실행 (npm run test:unit)
- [ ] git commit -m "refactor: Consolidate game state into gameState.js"

**예상 감축**: -200 라인

---

#### Week 3: 게임 루프 분리 (core/gameLoop.js)

**목표**: 게임 틱 로직을 독립 모듈로 분리

```javascript
// seoulsurvival/src/core/gameLoop.js (신규)

import { gameState } from '../state/gameState.js'
import { calculateRps } from '../economy/income.js'

let lastTimestamp = 0
let animationFrameId = null

export function startGameLoop(updateUICallback) {
  function tick(timestamp) {
    const delta = timestamp - lastTimestamp
    lastTimestamp = timestamp

    // 게임 틱 업데이트
    updateGameTick(delta)

    // UI 업데이트
    if (updateUICallback) {
      updateUICallback()
    }

    animationFrameId = requestAnimationFrame(tick)
  }

  lastTimestamp = performance.now()
  animationFrameId = requestAnimationFrame(tick)
}

export function stopGameLoop() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

function updateGameTick(delta) {
  const deltaSeconds = delta / 1000
  const rps = calculateRps()
  gameState.cash += rps * deltaSeconds
  gameState.totalPlayTime += delta
}

export function calculateOfflineIncome(offlineTime) {
  const rps = calculateRps()
  return rps * (offlineTime / 1000)
}
```

**main.js 변경:**

```javascript
import { startGameLoop } from './core/gameLoop.js'

// DOMContentLoaded 내부
startGameLoop(() => {
  updateUI()
})
```

**작업 항목:**

- [ ] core/gameLoop.js 생성
- [ ] main.js에서 게임 루프 로직 제거
- [ ] 테스트 실행
- [ ] git commit -m "refactor: Extract game loop to core/gameLoop.js"

**예상 감축**: -150 라인

---

#### Week 4: 금융상품 매니저 분리 (systems/financialManager.js)

**목표**: 금융상품 구매/판매 로직 통합

```javascript
// seoulsurvival/src/systems/financialManager.js (신규)

import { gameState } from '../state/gameState.js'
import { getFinancialCost, getFinancialSellPrice } from '../economy/pricing.js'

export function createFinancialManager(deps) {
  const { toast, updateUI } = deps

  function buyFinancial(type, quantity) {
    const count = gameState[type]
    const cost = getFinancialCost(type, count, quantity)

    if (gameState.cash < cost) {
      toast.error('자금이 부족합니다.')
      return false
    }

    gameState.cash -= cost
    gameState[type] += quantity
    gameState[`${type}Lifetime`] += quantity

    updateUI()
    return true
  }

  function sellFinancial(type, quantity) {
    if (gameState[type] < quantity) {
      toast.error('판매할 수량이 부족합니다.')
      return false
    }

    const sellPrice = getFinancialSellPrice(type, gameState[type], quantity)
    gameState.cash += sellPrice
    gameState[type] -= quantity

    updateUI()
    return true
  }

  return {
    buyFinancial,
    sellFinancial,
  }
}
```

**작업 항목:**

- [ ] systems/financialManager.js 생성
- [ ] main.js에서 buyDeposit, buySavings 등 함수 제거
- [ ] 테스트 작성 (test-agent에게 위임)
- [ ] git commit -m "refactor: Extract financial manager"

**예상 감축**: -200 라인

---

#### Week 5: 부동산 매니저 분리 (systems/propertyManager.js)

**목표**: 부동산 구매/판매 로직 통합

(구조는 financialManager.js와 유사)

**예상 감축**: -200 라인

---

#### Week 6: 노동/클릭 시스템 분리 (systems/labor.js)

**목표**: doWork() 및 자동 노동 로직 분리

```javascript
// seoulsurvival/src/systems/labor.js (신규)

import { gameState } from '../state/gameState.js'
import { calculateClickIncome } from '../economy/income.js'
import { getCareerByLevel, getNextCareerByLevel } from '../economy/income.js'

export function createLaborSystem(deps) {
  const { animations, updateUI, checkUpgradeUnlocks } = deps

  function doWork() {
    const income = calculateClickIncome()
    gameState.cash += income
    gameState.totalClicks++
    gameState.totalLaborIncome += income

    // 커리어 승진 체크
    checkCareerPromotion()

    // 애니메이션
    animations.showFloatingText(`+${income}`)

    updateUI()
    checkUpgradeUnlocks()
  }

  function checkCareerPromotion() {
    const nextCareer = getNextCareerByLevel(gameState.careerLevel)
    if (nextCareer && gameState.totalLaborIncome >= nextCareer.requiredIncome) {
      gameState.careerLevel++
      // 승진 이벤트 발생
    }
  }

  return {
    doWork,
    checkCareerPromotion,
  }
}
```

**예상 감축**: -100 라인

---

#### Week 7: UI 이벤트 핸들러 분리 (ui/eventHandlers.js)

**목표**: 모든 addEventListener 로직 통합

```javascript
// seoulsurvival/src/ui/eventHandlers.js (신규)

export function setupEventHandlers(deps) {
  const { dom, financialManager, propertyManager, laborSystem, upgradeManager } = deps

  // 노동 버튼
  dom.elWork.addEventListener('click', () => {
    laborSystem.doWork()
  })

  // 금융상품 구매 버튼
  dom.elBuyDeposit.addEventListener('click', () => {
    financialManager.buyFinancial('deposits', purchaseQuantity)
  })

  // ... (나머지 이벤트 핸들러)
}
```

**예상 감축**: -300 라인

---

#### Week 8: main.js 최종 정리

**목표**: main.js를 "통합 허브"로만 남기기

```javascript
// seoulsurvival/src/main.js (최종 형태, ~800 라인 목표)

import { startGameLoop } from './core/gameLoop.js'
import { createFinancialManager } from './systems/financialManager.js'
import { createPropertyManager } from './systems/propertyManager.js'
import { createLaborSystem } from './systems/labor.js'
import { setupEventHandlers } from './ui/eventHandlers.js'
import { createGameUI } from './ui/gameUI.js'
import { createSaveLoadManager } from './persist/saveLoad.js'
// ... (기타 import)

document.addEventListener('DOMContentLoaded', () => {
  // 1. i18n 초기화
  const initialLang = getInitialLang()
  setLang(initialLang)

  // 2. 데이터 초기화
  const UPGRADES = createUpgrades()
  const ACHIEVEMENTS = createAchievements()

  // 3. 시스템 모듈 생성
  const financialManager = createFinancialManager({
    /* deps */
  })
  const propertyManager = createPropertyManager({
    /* deps */
  })
  const laborSystem = createLaborSystem({
    /* deps */
  })

  // 4. UI 모듈 생성
  const gameUIInstance = createGameUI({
    /* deps */
  })

  // 5. 이벤트 핸들러 등록
  setupEventHandlers({
    /* deps */
  })

  // 6. 게임 로드
  const saveLoadManager = createSaveLoadManager({
    /* deps */
  })
  saveLoadManager.loadGame()

  // 7. 게임 루프 시작
  startGameLoop(() => {
    gameUIInstance.updateUI()
  })

  // 8. 자동 저장 타이머
  setInterval(() => {
    saveLoadManager.saveGame()
  }, 5000)
})
```

**작업 항목:**

- [ ] 모든 분리된 모듈 통합 테스트
- [ ] ESLint 오류 0개 확인
- [ ] main.js 라인 수 확인 (목표: 1,000 이하)
- [ ] git commit -m "refactor: Finalize main.js modularization"

**예상 감축**: -400 라인

---

## 3. 모듈 의존성 그래프

```
main.js (통합 허브)
├── core/
│   ├── gameLoop.js (게임 루프)
│   └── errorBoundary.js (에러 처리)
│
├── state/
│   └── gameState.js (게임 상태)
│
├── systems/
│   ├── financialManager.js (금융상품)
│   ├── propertyManager.js (부동산)
│   ├── labor.js (노동)
│   ├── upgradeManager.js (업그레이드)
│   └── market.js (시장)
│
├── economy/
│   ├── pricing.js (가격 계산)
│   └── income.js (수익 계산)
│
├── ui/
│   ├── gameUI.js (UI 렌더링)
│   ├── eventHandlers.js (이벤트)
│   ├── domRefs.js (DOM 참조)
│   └── modal.js (모달)
│
└── persist/
    ├── saveLoad.js (저장/로드)
    └── cloudSync.js (클라우드)
```

**의존성 규칙:**

- **단방향 의존**: 상위 모듈 → 하위 모듈 (역방향 금지)
- **순환 참조 금지**: A → B → A 금지
- **Core/State는 의존성 없음**: 가장 하위 레벨

---

## 4. 리스크 평가

### 높은 위험 (High Risk)

| 리스크                        | 영향도 | 발생 확률 | 대응 방안                            |
| ----------------------------- | ------ | --------- | ------------------------------------ |
| 게임 루프 분리 시 버그        | 높음   | 중간      | 단위 테스트 작성, 프리뷰 환경 테스트 |
| 상태 관리 변경 시 데이터 손실 | 높음   | 낮음      | 저장/로드 로직 우선 테스트           |
| UI 이벤트 핸들러 누락         | 중간   | 중간      | 수동 E2E 테스트 (Playwright)         |

### 중간 위험 (Medium Risk)

| 리스크           | 영향도 | 발생 확률 | 대응 방안                          |
| ---------------- | ------ | --------- | ---------------------------------- |
| 순환 의존성 발생 | 중간   | 중간      | 모듈 그래프 점검, ESLint 규칙 추가 |
| 중복 코드 재발   | 낮음   | 높음      | Code Review (code-reviewer agent)  |

### 낮은 위험 (Low Risk)

| 리스크           | 영향도 | 발생 확률 | 대응 방안                    |
| ---------------- | ------ | --------- | ---------------------------- |
| ESLint 오류 증가 | 낮음   | 중간      | lint:fix로 자동 수정         |
| 빌드 크기 증가   | 낮음   | 낮음      | Vite tree-shaking으로 최적화 |

---

## 5. 검증 체크리스트

각 Week 종료 시 아래 체크리스트를 실행합니다.

### 코드 품질

- [ ] ESLint 오류 0개
- [ ] ESLint 경고 10개 이하
- [ ] Prettier 포맷팅 통과
- [ ] 중복 코드 없음 (DRY 원칙)

### 기능 검증

- [ ] npm run dev로 게임 정상 실행
- [ ] 저장/로드 정상 작동
- [ ] 모든 탭 전환 정상
- [ ] 업그레이드 구매 정상
- [ ] 리더보드 업데이트 정상

### 테스트

- [ ] npm run test:unit 통과
- [ ] npm run test (E2E) 통과
- [ ] 빌드 성공 (npm run build)

### 성능

- [ ] 게임 루프 60fps 유지
- [ ] 초기 로딩 시간 3초 이하
- [ ] 빌드 파일 크기 300KB 이하

---

## 6. 다음 단계

### 우선순위 1 (Critical)

- [ ] **Week 1-2: gameState.js 통합** (상태 관리 중앙화)
- [ ] **Week 3: gameLoop.js 분리** (핵심 로직 독립)

### 우선순위 2 (High)

- [ ] **Week 4-5: 금융/부동산 매니저 분리** (비즈니스 로직)
- [ ] **Week 6: 노동 시스템 분리** (클릭 처리)

### 우선순위 3 (Medium)

- [ ] **Week 7: 이벤트 핸들러 분리** (UI 로직)
- [ ] **Week 8: 최종 정리** (통합 및 검증)

### 추가 작업 (test-agent에게 위임)

- [ ] 단위 테스트 작성 (각 모듈별)
- [ ] E2E 테스트 보강
- [ ] 성능 프로파일링 (performance-agent에게 위임)

---

## 7. 성공 기준 (KPI)

### 정량적 지표

| 지표                | 현재    | 목표    | 측정 방법         |
| ------------------- | ------- | ------- | ----------------- |
| **main.js 라인 수** | 2,384   | 1,000   | `wc -l main.js`   |
| **평균 함수 크기**  | 50 라인 | 30 라인 | ESLint 규칙       |
| **순환 복잡도**     | 높음    | 중간    | ESLint complexity |
| **코드 중복률**     | 15%     | 5%      | jscpd 도구        |
| **테스트 커버리지** | 0%      | 50%     | Vitest coverage   |

### 정성적 지표

- **가독성**: 새로운 개발자가 30분 내에 구조 이해 가능
- **유지보수성**: 버그 수정 시 영향 범위 명확
- **확장성**: 새 기능 추가 시 기존 코드 수정 최소화
- **테스트 용이성**: 각 모듈이 독립적으로 테스트 가능

---

## 8. 참고 자료

### 내부 문서

- `docs/game-design/BALANCE_NOTES.md` - 밸런스 디자인 철학
- `seoulsurvival/src/state/gameState.js` - 현재 상태 관리 구조
- `CLAUDE.md` - 프로젝트 가이드

### 외부 자료

- [Martin Fowler - Refactoring Catalog](https://refactoring.com/catalog/)
- [Clean Code - Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

## 9. 변경 이력

| 날짜       | 작성자        | 내용                 |
| ---------- | ------------- | -------------------- |
| 2026-01-18 | Quality Agent | 초안 작성            |
| -          | -             | (향후 업데이트 기록) |

---

## 부록 A: 모듈 템플릿

### Factory 패턴 모듈 템플릿

```javascript
/**
 * moduleName.js
 * 모듈 설명
 *
 * 책임:
 * - 책임 1
 * - 책임 2
 */

import { dependency1 } from './path.js'

/**
 * 모듈 팩토리 함수
 *
 * @param {Object} deps - 의존성 객체
 * @param {Type} deps.dep1 - 의존성 1 설명
 * @returns {Object} 모듈 함수들
 */
export function createModuleName(deps) {
  const { dep1, dep2 } = deps

  function publicFunction1() {
    // 구현
  }

  function publicFunction2() {
    // 구현
  }

  // 비공개 함수 (모듈 내부에서만 사용)
  function _privateHelper() {
    // 구현
  }

  return {
    publicFunction1,
    publicFunction2,
  }
}
```

---

## 부록 B: 커밋 메시지 컨벤션

```
refactor: 간결한 제목 (50자 이내)

변경 내용 상세 설명 (72자마다 줄바꿈)

- 변경 이유
- 영향 범위
- 테스트 결과

Related: #issue-number
```

**예시:**

```
refactor: Extract game loop to core/gameLoop.js

main.js의 게임 루프 로직을 독립 모듈로 분리하여
테스트 용이성과 가독성을 향상시켰습니다.

- startGameLoop(), stopGameLoop() 함수 추출
- updateGameTick() 로직 분리
- main.js 150 라인 감축

테스트: npm run test:unit 통과 (12 suites, 45 tests)

Related: #123
```

---

**문서 끝**
