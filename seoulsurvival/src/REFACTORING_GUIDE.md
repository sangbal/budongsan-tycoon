# Seoul Survival 리팩토링 가이드

## 완료된 작업

### 1. 모듈 분리 (2025-01-10)

#### 생성된 파일

##### `seoulsurvival/src/systems/nicknameManager.js`
- **책임**: 닉네임 관리 전담
- **함수**:
  - `ensureNicknameModal()` - 닉네임이 없으면 모달 오픈 (중복 방지)
  - `openNicknameChangeModal()` - 닉네임 변경 모달 오픈 (쿨타임 체크)
  - `handleNicknameChangeFromModal()` - 닉네임 변경 처리 (로컬/클라우드)
  - `checkNicknameCooldown()` - 30초 쿨타임 체크
  - `saveNicknameCooldown()` - 쿨타임 저장

- **패턴**: Factory 패턴 (의존성 주입)
- **원본 위치**: `main.js` 라인 1275-1443, 5462-5671

##### `seoulsurvival/src/persist/saveLoad.js`
- **책임**: 게임 데이터 저장/로드
- **함수**:
  - `saveGame()` - 게임 데이터 저장 (localStorage + 클라우드 대기열)
  - `loadGame()` - 게임 데이터 로드 (오프라인 수익 계산 포함)
  - `resetGame()` - 게임 초기화 (수동 프레스티지)
  - `exportSave()` - 저장 파일 내보내기
  - `importSave()` - 저장 파일 가져오기

- **패턴**: Factory 패턴 (의존성 주입)
- **원본 위치**: `main.js` 라인 1132-1674

## 다음 단계: Factory 통합

### main.js 통합 (미완료)

현재 상태:
- ✅ 새 모듈 생성 완료
- ✅ main.js에 import 추가 완료
- ✅ 빌드 테스트 통과
- ❌ 기존 함수를 Factory 함수로 대체 (미완료)

### 통합 방법

#### 1. 전역 변수 래퍼 생성

main.js에서 Factory가 접근할 전역 변수를 getter/setter 객체로 래핑:

```javascript
// main.js 라인 ~1130 (saveGame 함수 바로 전)

// ======= 저장/로드 매니저 초기화 (Factory 패턴) =======
const gameVars = {
  get cash() { return cash },
  set cash(val) { cash = val },
  get totalClicks() { return totalClicks },
  set totalClicks(val) { totalClicks = val },
  // ... (모든 게임 상태 변수)
}

const cloudState = {
  get __currentUser() { return __currentUser },
  set __currentUser(val) { __currentUser = val },
  get __cloudPendingSave() { return __cloudPendingSave },
  set __cloudPendingSave(val) { __cloudPendingSave = val },
  get __lastCloudUploadedSaveTs() { return __lastCloudUploadedSaveTs },
  set __lastCloudUploadedSaveTs(val) { __lastCloudUploadedSaveTs = val },
}
```

#### 2. Factory 초기화

```javascript
// saveLoad 매니저 생성
const saveLoadManager = createSaveLoadManager({
  SAVE_KEY,
  gameVars,
  UPGRADES,
  ACHIEVEMENTS,
  reapplyIncomeTableAffectingUpgradeEffects,
  updateAutoWorkUI,
  updateSaveStatus,
  performAutoPrestige,
  t,
  getLang,
  Modal,
  Diary,
  LeaderboardUI,
  upsertCloudSave,
  cloudState,
  __IS_DEV__,
})

// 닉네임 매니저 생성
const nicknameManager = createNicknameManager({
  SAVE_KEY,
  CLOUD_RESTORE_BLOCK_KEY,
  Modal,
  t,
  validateNickname,
  normalizeNickname,
  claimNickname,
  getUser,
  saveGame: saveLoadManager.saveGame,
  updateUI,
  Diary,
  LeaderboardUI,
  upsertCloudSave,
  getPlayerNickname: () => playerNickname,
  setPlayerNickname: (val) => { playerNickname = val },
  __IS_DEV__,
})
```

#### 3. 기존 함수 대체

```javascript
// 기존 함수 정의를 주석 처리하고 Factory 함수로 대체
// function saveGame() { ... } // 제거
// function loadGame() { ... } // 제거
// function resetGame() { ... } // 제거
// function exportSave() { ... } // 제거
// function importSave() { ... } // 제거

// Factory 함수를 전역 스코프로 노출
const saveGame = saveLoadManager.saveGame
const loadGame = saveLoadManager.loadGame
const resetGame = saveLoadManager.resetGame
const exportSave = saveLoadManager.exportSave
const importSave = saveLoadManager.importSave

const ensureNicknameModal = nicknameManager.ensureNicknameModal
const openNicknameChangeModal = nicknameManager.openNicknameChangeModal
const handleNicknameChangeFromModal = nicknameManager.handleNicknameChangeFromModal
```

#### 4. 이벤트 리스너 연결

```javascript
// 닉네임 변경 버튼 (이미 연결되어 있음, 확인만 필요)
if (nicknameChangeBtn) {
  nicknameChangeBtn.addEventListener('click', openNicknameChangeModal)
}

if (nicknameConflictChangeBtn) {
  nicknameConflictChangeBtn.addEventListener('click', openNicknameChangeModal)
}

// 저장 가져오기/내보내기 (이미 연결되어 있음, 확인만 필요)
```

### 테스트 체크리스트

통합 후 반드시 확인:

- [ ] `npm run build` 성공
- [ ] `npm run lint` 통과
- [ ] 게임 시작 시 `loadGame()` 정상 호출
- [ ] 클릭/구매 후 `saveGame()` 정상 작동
- [ ] 닉네임 모달 오픈 (신규 사용자)
- [ ] 닉네임 변경 버튼 작동
- [ ] 닉네임 변경 쿨타임 (30초) 작동
- [ ] 저장 내보내기/가져오기 작동
- [ ] 게임 초기화 (수동 프레스티지) 작동
- [ ] 오프라인 수익 계산 정상

### 주의사항

1. **전역 변수 의존성**: main.js에는 아직 많은 전역 변수가 남아 있습니다. Factory는 이 변수들을 getter/setter를 통해 접근합니다.

2. **순환 의존성**: `saveGame()`은 `ensureNicknameModal()`을 호출하지 않지만, `ensureNicknameModal()`은 `saveGame()`을 호출합니다. Factory 초기화 순서 주의.

3. **UPGRADES 초기화 시점**: UPGRADES는 `createUpgrades()`로 나중에 생성되므로, Factory 초기화를 그 이후로 미뤄야 할 수 있습니다.

## 향후 리팩토링 계획

### Phase 2: 게임 루프 분리
- `seoulsurvival/src/core/gameLoop.js`
- `startGameLoop()`, `updateGameTick()`, `calculateOfflineIncome()`

### Phase 3: 경제 시스템 통합
- `seoulsurvival/src/economy/income.js` (이미 존재)
- `seoulsurvival/src/economy/pricing.js` (이미 존재)

### Phase 4: UI 시스템 통합
- `seoulsurvival/src/ui/tabSystem.js`
- `switchTab()`, `updateUI()`, `updateStatsTab()`

### Phase 5: main.js 최종 정리
- 목표: 1000라인 이하
- 역할: 모듈 import + 초기화 + 이벤트 리스너 등록만 담당

## 성과 지표 (KPI)

- **main.js 라인 수**: 7173 → 1000 (목표)
- **ESLint 오류**: 0개 (유지)
- **코드 중복률**: 최소화
- **모듈화 수준**: 각 파일 500라인 이하

## 현재 상태

- **Date**: 2025-01-10
- **main.js**: 7173 라인 (변경 없음, 통합 대기 중)
- **새 모듈**: 2개 (nicknameManager.js, saveLoad.js)
- **빌드 상태**: ✅ 통과
- **통합 상태**: ⏳ 대기 중
