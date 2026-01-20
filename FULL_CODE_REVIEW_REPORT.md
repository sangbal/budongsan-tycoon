# Seoul Survival 코드 품질 분석 보고서

**작성일:** 2026-01-19
**작성자:** Quality Agent
**대상:** seoulsurvival/src/

---

## 📊 Executive Summary

서울 생존기 코드베이스는 **이미 상당한 리팩토링이 진행된 상태**입니다:

- main.js: **7173라인 → 2359라인** (67% 감소 ✅)
- 모듈화율: **41개 모듈 파일** (systems/, ui/, economy/, persist/ 등)
- ESLint 결과: **326개 이슈** (321 warnings, 5 errors)
- 테스트 커버리지: **단위 테스트 존재** (Vitest + Playwright E2E)

하지만 **품질 개선의 여지**가 있습니다. 특히 **사용되지 않는 import, 매직넘버, localStorage 직접 접근** 등이 주요 이슈입니다.

---

## 🔴 **Critical Issues (치명적 - 즉시 수정 필요)**

### 1. **중복된 함수명 (no-dupe-class-members)**

**파일:** `kimchi-invasion copy\src\ui.js:1094`

```javascript
// ❌ ERROR
class SomeClass {
  renderSlotHTML() { ... }
  renderSlotHTML() { ... } // 중복!
}
```

**영향:** 런타임 오류 가능성
**수정:** 중복 함수 제거 또는 이름 변경

---

### 2. **빈 catch 블록 (no-empty)**

**파일:** `seoulsurvival/src/main.js:67`

```javascript
// ❌ ERROR
try {
  // ...
} catch (e) {
  // 빈 블록 - 에러가 조용히 무시됨
}
```

**영향:** 디버깅 불가능, 예상치 못한 오류 발생 시 추적 어려움
**수정:**

```javascript
// ✅ GOOD
} catch (e) {
  console.error('Error occurred:', e)
  // 또는 최소한 주석으로 의도 명시
}
```

---

### 3. **@ts-ignore 남용 (ban-ts-comment)**

**파일:** `tests/toast.spec.js:249`

```javascript
// ❌ ERROR
// @ts-ignore
someCode()
```

**영향:** 타입 안전성 무력화
**수정:** `@ts-expect-error`로 변경 (오류가 없으면 경고 발생)

---

## 🟠 **High Priority (높음 - 버그 위험)**

### 1. **사용되지 않는 Import (no-unused-vars)**

| 파일                | 라인  | 사용되지 않는 변수                                                                              | 위험도  |
| ------------------- | ----- | ----------------------------------------------------------------------------------------------- | ------- |
| `main.js`           | 1     | `safeRemove`                                                                                    | 🟡 중간 |
| `main.js`           | 17    | `createMarketSystem`                                                                            | 🟡 중간 |
| `main.js`           | 18    | `createAchievementsSystem`                                                                      | 🟡 중간 |
| `main.js`           | 19    | `createUpgradeUnlockSystem`                                                                     | 🟡 중간 |
| `main.js`           | 21    | `getDomRefs`                                                                                    | 🟡 중간 |
| `main.js`           | 22    | `safeClass`, `safeHTML`                                                                         | 🟡 중간 |
| `main.js`           | 25-28 | `resetGrowthTracking`, `loadGrowthTracking`, `saveGrowthTracking`, `setAchievementScrollActive` | 🟡 중간 |
| `main.js`           | 38    | `signInGoogle`                                                                                  | 🟡 중간 |
| `main.js`           | 39    | `isSupabaseConfigured`                                                                          | 🟡 중간 |
| `main.js`           | 41-42 | `updateLeaderboard`, `getLeaderboard`                                                           | 🟡 중간 |
| `economy/income.js` | 12    | `getSynergyMultiplier`                                                                          | 🟡 중간 |
| `i18n/index.js`     | 8     | `translationsPromise`                                                                           | 🟡 중간 |

**총 계:** **44개 사용되지 않는 import**

**영향:**

- 번들 크기 증가 (Tree-shaking이 안 될 수 있음)
- 코드 가독성 저하 (실제로 사용되는 것처럼 보임)
- 유지보수 혼란 (삭제해도 되는지 판단 어려움)

**수정:**

```javascript
// ❌ BAD
import { safeRemove, safeClass, safeHTML } from './ui/domUtils.js'
// safeClass, safeHTML은 사용되지 않음

// ✅ GOOD
import { safeRemove } from './ui/domUtils.js'
```

---

### 2. **매직 넘버 (Magic Numbers)**

하드코딩된 숫자가 **코드 전반에 산재**되어 있습니다:

| 파일                    | 라인     | 매직 넘버                                | 의미                        |
| ----------------------- | -------- | ---------------------------------------- | --------------------------- |
| `main.js`               | 2353     | `10000000`                               | 치트 코드 금액              |
| `state/gameState.js`    | 125      | `1000000000`                             | 월세 업그레이드 비용 (10억) |
| `state/gameState.js`    | 126      | `5000000000`                             | 관리인 고용 비용 (50억)     |
| `data/upgrades.js`      | 124, 138 | `10000000`                               | 업그레이드 비용 (1천만)     |
| `data/achievements.js`  | 211-267  | `100000000`, `1000000000`, ...           | 자산 마일스톤               |
| `utils/numberFormat.js` | 전체     | `1000000`, `1000000000`, `1000000000000` | 백만, 십억, 조              |

**영향:**

- 코드 가독성 극히 낮음 (1000000이 백만인지 한눈에 안 보임)
- 밸런스 조정 시 실수 위험
- 유지보수 어려움

**수정:**

```javascript
// ❌ BAD
if (cash >= 1000000000) { ... }

// ✅ GOOD
const RENT_UPGRADE_COST = 1_000_000_000 // 10억 (한국 숫자 구분자)
// 또는
const RENT_UPGRADE_COST = 1e9 // 10억 (과학적 표기법)

if (cash >= RENT_UPGRADE_COST) { ... }
```

**제안: 상수 파일 생성**

```javascript
// seoulsurvival/src/balance/costs.js
export const COSTS = {
  RENT_UPGRADE: 1_000_000_000,
  MANAGER_HIRE: 5_000_000_000,
  TOWER_PRESTIGE: 1_000_000_000_000, // 1조
}

// seoulsurvival/src/balance/milestones.js
export const ASSET_MILESTONES = {
  MILLION: 1_000_000,
  TEN_MILLION: 10_000_000,
  HUNDRED_MILLION: 100_000_000,
  BILLION: 1_000_000_000,
  // ...
}
```

---

### 3. **localStorage 직접 접근 (Anti-Pattern)**

**발견:** 총 **49회** localStorage/sessionStorage 직접 접근

**문제점:**

- 에러 핸들링 없음 (QuotaExceededError)
- JSON.parse 실패 시 크래시 가능
- 테스트 불가능

**예시:**

```javascript
// ❌ BAD (main.js, ui/gameUI.js 등 여러 곳)
const needsChange = localStorage.getItem('clicksurvivor_needsNicknameChange') === 'true'
```

**수정:**

```javascript
// ✅ GOOD - persist/storage.js 사용
import { safeGetJSON, safeSetJSON } from './persist/storage.js'

const needsChange = safeGetJSON('clicksurvivor_needsNicknameChange', false)
```

**현황:**

- ✅ `persist/storage.js`에 이미 안전 래퍼 존재
- ❌ 일부 코드에서 여전히 직접 접근

**액션:** 모든 localStorage 직접 접근을 `safeGetJSON/safeSetJSON`으로 교체

---

## 🟡 **Medium Priority (중간 - 코드 품질)**

### 1. **중복 코드 (Code Duplication)**

#### 1.1 수익 계산 로직 중복

**파일:** `ui/gameUI.js`

```javascript
// 금융 수익 계산 (라인 366-369)
const financialIncome =
  deposits * FINANCIAL_INCOME.deposit +
  savings * FINANCIAL_INCOME.savings +
  bonds * FINANCIAL_INCOME.bond

// 동일한 계산이 여러 곳에서 반복됨
```

**이미 존재하는 함수:**

- `economy/income.js:getFinancialIncome()`
- `economy/income.js:getRps()`

**수정:** 기존 함수 재사용

---

#### 1.2 상품 이름 번역 중복

**발견 위치:**

- `ui/investmentTab.js:getProductName()`
- `ui/gameUI.js` (여러 곳에서 `t('product.xxx')` 직접 호출)
- `ui/statsTab.js`

**수정:** `getProductName()` 함수를 공통 유틸로 이동

```javascript
// utils/productNames.js (새 파일)
export function getProductName(type) {
  // investmentTab.js의 로직 이동
}
```

---

### 2. **전역 변수 오용**

**파일:** `main.js`

```javascript
// 라인 312-322: 전역 상태
const unlockedProducts = {
  deposit: true,
  savings: false,
  bond: false,
  // ...
}
```

**문제:**

- `gameState` 객체에 이미 동일한 `unlockedProducts` 존재 (state/gameState.js:104)
- 두 개의 상태가 불일치할 위험

**수정:**

```javascript
// ❌ BAD - main.js에서 별도 관리
const unlockedProducts = { ... }

// ✅ GOOD - gameState 사용
if (gameState.unlockedProducts.deposit) { ... }
```

---

### 3. **순환 의존성 위험**

**분석 결과:**

- 직접적인 순환 의존성은 **발견되지 않음** ✅
- 하지만 의존성 깊이가 깊음:

```
main.js
  └─> ui/gameUI.js
      └─> utils/numberFormat.js
          └─> i18n/index.js
              └─> i18n/translations/ko.js (771 라인)
```

**잠재적 위험:**

- `main.js`가 여전히 너무 많은 것에 의존 (41개 import)
- 추가 리팩토링 시 순환 의존성 발생 가능

**권장 사항:**

- 의존성 그래프 시각화 도구 사용 (예: madge)
- 가능한 한 단방향 의존성 유지

---

### 4. **타입 불일치 가능성**

#### 4.1 숫자 타입 검증 부족

**파일:** `ui/gameUI.js:203-208`

```javascript
// ✅ GOOD - 유효성 검사가 있는 경우
let totalClicks = getTotalClicks()
if (typeof totalClicks !== 'number' || totalClicks < 0) {
  console.warn('Invalid totalClicks value:', totalClicks, 'resetting to 0')
  totalClicks = 0
  setTotalClicks(0)
}
```

**문제:** 이런 검증이 **일부에만** 적용됨

**위험:**

- `deposits`, `savings`, `bonds` 등 다른 변수는 검증 없음
- 저장 데이터 손상 시 `NaN` 또는 `undefined`가 계산에 포함될 수 있음

**수정:** 모든 숫자 변수에 대해 동일한 검증 적용

---

#### 4.2 문자열/숫자 혼용

**파일:** `persist/saveLoad.js:252`

```javascript
gameVars.rentCost = data.rentCost || 1000000000
```

**문제:**

- `data.rentCost`가 `"1000000000"` (문자열)일 가능성
- `|| 1000000000`는 문자열 `"0"` 을 falsy로 간주하지 않음

**수정:**

```javascript
gameVars.rentCost = Number(data.rentCost) || 1000000000
```

---

### 5. **과도한 console.log (no-console)**

**발견:** **167회** console.log/warn/error

**허용된 메서드:**

- `console.warn` ✅
- `console.error` ✅

**금지된 메서드:**

- `console.log` ❌ (개발 모드에서만 허용)

**주요 위반:**

- `main.js:1355` - `console.debug('[resetRunHoldings] 초기화 완료')`
- `systems/careerSystem.js:128` - `console.log('=== PROMOTION DEBUG ===')`
- `systems/upgradeManager.js:232` - `console.log('=== PURCHASE UPGRADE DEBUG ===')`
- `ui/leaderboardUI.js:607, 687, 699, 704` - `console.debug('[LB] ...')`

**수정:**

```javascript
// ❌ BAD
console.log('DEBUG INFO')

// ✅ GOOD - 조건부 로그
const gameLog = __IS_DEV__ ? console.log.bind(console) : () => {}
gameLog('DEBUG INFO')
```

**현황:**

- `main.js`에 이미 `gameLog`, `gameWarn`, `gameError` 정의되어 있음
- 다른 모듈에서는 여전히 `console.log` 직접 사용

---

## 🟢 **Low Priority (낮음 - 가독성/유지보수)**

### 1. **긴 파일 (Code Smell)**

| 파일                  | 라인 수 | 권장 조치                             |
| --------------------- | ------- | ------------------------------------- |
| `main.js`             | 2359    | ⚠️ 여전히 길음 - 1000라인 이하 목표   |
| `systems/diary.js`    | 1391    | 🔴 긴급 - 모듈 분리 필요              |
| `ui/statsTab.js`      | 1053    | 🟡 중간 - 리팩토링 고려               |
| `data/upgrades.js`    | 1003    | 🟡 중간 - 데이터 파일이므로 허용 가능 |
| `ui/gameUI.js`        | 826     | ✅ 양호                               |
| `ui/investmentTab.js` | 749     | ✅ 양호                               |

**권장 사항:**

- `systems/diary.js` (1391라인) → `systems/diary/` 폴더로 분리
  - `diary/core.js` - 핵심 로직
  - `diary/templates.js` - 메시지 템플릿
  - `diary/ui.js` - UI 업데이트

---

### 2. **TODO 주석**

**발견:** 2개 (systems/prestigeBonus.js:132, 148)

```javascript
/**
 * TODO: 향후 특수 업그레이드 시스템과 연계
 */

/**
 * TODO: 빌드 시너지 시스템과 연계
 */
```

**권장:** GitHub Issues로 이동하여 추적 가능하게

---

### 3. **함수 복잡도**

**분석 도구 필요:** ESLint complexity rule 활성화 권장

```javascript
// eslint.config.js
rules: {
  'complexity': ['warn', 10], // 순환 복잡도 10 이상 경고
}
```

---

## 📈 **긍정적 측면 (이미 잘하고 있는 것)**

✅ **모듈화 진행 중**

- main.js가 7173라인에서 2359라인으로 감소
- 41개 모듈 파일로 분리

✅ **테스트 커버리지 존재**

- Vitest 단위 테스트 (17개 테스트 파일)
- Playwright E2E 테스트

✅ **i18n 지원**

- 한국어/영어 번역 완료
- 번역 키 기반 시스템

✅ **안전한 스토리지 래퍼**

- `persist/storage.js` 존재 (safeGetJSON, safeSetJSON)
- try-catch로 감싸진 안전한 접근

✅ **ESLint/Prettier 설정**

- 코드 스타일 일관성
- 자동 수정 가능 (76개 warning)

✅ **Factory 패턴 사용**

- `createGameUI()`, `createInvestmentTab()` 등
- 의존성 주입으로 테스트 가능

---

## 🎯 **우선순위별 액션 플랜**

### Phase 1: 긴급 (1주일 이내)

1. **🔴 Critical 이슈 수정**
   - [ ] `kimchi-invasion copy/src/ui.js:1094` - 중복 함수명 제거
   - [ ] `main.js:67` - 빈 catch 블록에 에러 로깅 추가
   - [ ] `tests/toast.spec.js:249` - @ts-ignore → @ts-expect-error

2. **🟠 사용되지 않는 Import 정리**
   - [ ] `npm run lint:fix` 실행
   - [ ] main.js에서 44개 unused import 제거
   - [ ] 빌드 크기 확인 (before/after 비교)

3. **🟠 localStorage 직접 접근 제거**
   - [ ] Grep으로 모든 `localStorage.getItem` 찾기
   - [ ] `safeGetJSON/safeSetJSON`으로 교체
   - [ ] 테스트 실행

---

### Phase 2: 중요 (2주일 이내)

4. **🟡 매직 넘버 상수화**
   - [ ] `balance/costs.js` 생성
   - [ ] `balance/milestones.js` 생성
   - [ ] 모든 하드코딩된 숫자를 상수로 교체
   - [ ] 단위 테스트 실행

5. **🟡 전역 변수 통합**
   - [ ] `main.js`의 `unlockedProducts` 제거
   - [ ] `gameState.unlockedProducts` 사용으로 통일

6. **🟡 타입 검증 강화**
   - [ ] 모든 숫자 변수에 대해 유효성 검사 추가
   - [ ] `persist/saveLoad.js`에서 `Number()` 변환 추가

---

### Phase 3: 리팩토링 (1개월 이내)

7. **🟢 긴 파일 분리**
   - [ ] `systems/diary.js` (1391라인) → `systems/diary/` 폴더로 분리
   - [ ] `ui/statsTab.js` (1053라인) → 함수 단위로 분리

8. **🟢 중복 코드 제거**
   - [ ] `getProductName()` 함수를 `utils/productNames.js`로 이동
   - [ ] 수익 계산 로직 통합

9. **🟢 console.log 정리**
   - [ ] 모든 `console.log`를 조건부 `gameLog`로 변경
   - [ ] 디버그 플래그 시스템 통합

---

## 📊 **메트릭 요약**

| 지표                       | 현재     | 목표 | 상태         |
| -------------------------- | -------- | ---- | ------------ |
| **main.js 라인 수**        | 2359     | 1000 | 🟡 진행 중   |
| **ESLint Errors**          | 5        | 0    | 🟡 수정 필요 |
| **ESLint Warnings**        | 321      | <100 | 🟡 개선 필요 |
| **매직 넘버**              | ~200개   | 0    | 🔴 심각      |
| **사용되지 않는 Import**   | 44개     | 0    | 🟡 수정 필요 |
| **localStorage 직접 접근** | 49회     | 0    | 🟡 수정 필요 |
| **모듈 개수**              | 41개     | -    | ✅ 양호      |
| **최대 파일 크기**         | 1391라인 | <500 | 🟡 개선 필요 |

---

## 🛠️ **도구 권장 사항**

1. **의존성 분석**

   ```bash
   npm install -D madge
   npx madge --circular --extensions js seoulsurvival/src
   ```

2. **복잡도 분석**

   ```bash
   npm install -D eslint-plugin-complexity
   ```

3. **번들 크기 분석**

   ```bash
   npm run build
   npm install -D rollup-plugin-visualizer
   ```

4. **코드 중복 감지**
   ```bash
   npm install -D jscpd
   npx jscpd seoulsurvival/src
   ```

---

## 🎓 **코드 품질 원칙 재확인**

### 1. 단일 책임 원칙 (Single Responsibility)

- ✅ 모듈 분리 잘 되어 있음
- ⚠️ 일부 파일은 여전히 너무 많은 책임 (diary.js, statsTab.js)

### 2. DRY (Don't Repeat Yourself)

- ⚠️ 중복 코드 존재 (수익 계산, 상품 이름)
- ✅ Factory 패턴으로 중복 감소

### 3. KISS (Keep It Simple, Stupid)

- ⚠️ 매직 넘버로 인한 복잡도 증가
- ✅ 함수 이름은 명확함

### 4. YAGNI (You Ain't Gonna Need It)

- ⚠️ 44개 unused import
- ✅ 불필요한 추상화는 적음

### 5. 명확한 네이밍

- ✅ 함수명, 변수명 대체로 명확
- ✅ 한국어/영어 주석 혼용으로 가독성 좋음

---

## 🏁 **결론**

서울 생존기 코드베이스는 **양호한 상태**이지만, **품질 개선의 여지**가 많습니다:

**즉시 조치:**

1. 5개 Critical Error 수정
2. 44개 unused import 제거
3. localStorage 직접 접근 제거

**중기 계획:**

1. 매직 넘버 상수화 (~200개)
2. 긴 파일 분리 (diary.js, statsTab.js)
3. 중복 코드 제거

**장기 목표:**

1. main.js 1000라인 이하로 감소
2. ESLint warning 100개 이하
3. 테스트 커버리지 80% 이상

---

**다음 단계:**

1. 이 보고서를 팀과 공유
2. 우선순위별 이슈를 GitHub Issues로 등록
3. Phase 1부터 순차적으로 진행

**예상 소요 시간:**

- Phase 1 (긴급): 1주일
- Phase 2 (중요): 2주일
- Phase 3 (리팩토링): 1개월

**총 예상:** 6주 (1.5개월)
