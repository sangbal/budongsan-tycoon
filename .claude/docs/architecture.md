# 아키텍처 가이드

ClickSurvivor Hub의 전체 아키텍처 및 기술 스택 정보입니다.

## 엔트리 포인트 (vite.config.js)

- `index.html` - 허브 홈페이지
- `seoulsurvival/index.html` - 서울 생존기
- `kimchi-invasion/index.html` - 김치 인베이전
- `account/`, `auth/callback/` - 계정/OAuth
- `games/seoulsurvival/` - 게임 소개 페이지
- `terms.html`, `privacy.html` - 약관/정책

## 주요 디렉토리

```
shared/              # 게임 간 공유 (인증, 클라우드 저장, i18n)
seoulsurvival/src/   # 서울 생존기 게임 코드
kimchi-invasion/src/ # 김치 인베이전 게임 코드
hub/                 # 허브 전용 코드
```

## 서울 생존기 소스 구조 (seoulsurvival/src/)

```
core/
├── bootstrap.js       # Phase A~H 초기화 (90+ import, 아래 상세)
├── bootstrapper.js    # 부트스트래퍼 래퍼
└── errorBoundary.js   # 에러 경계

state/
├── gameState.js           # 중앙 상태 객체 (100+ 프로퍼티)
└── stateChangeTracker.js  # 상태 변경 추적

economy/
├── pricing.js         # 금융/부동산 가격 계산
├── assetCalculator.js # 총자산 계산
├── incomeCalculator.js # 수익 계산 (getRps, getClickIncome 등)
└── income.js          # 소득 관련

balance/
├── index.js           # 밸런스 상수 모음
├── timing.js          # 게임 루프 타이밍
├── career.js          # 직업 밸런스
├── financial.js       # 금융 밸런스
├── property.js        # 부동산 밸런스
├── upgrades.js        # 업그레이드 밸런스
└── marketEvents.js    # 시장 이벤트 밸런스

data/
├── achievements.js    # 업적 데이터
├── diaryTemplates.js  # 일기 템플릿
└── upgrades/          # 업그레이드 데이터
    ├── index.js       # 배럴 파일
    ├── financial.js   # 금융 업그레이드
    ├── global.js      # 글로벌 업그레이드
    ├── labor.js       # 노동 업그레이드
    └── property.js    # 부동산 업그레이드

systems/
├── achievements.js    # 업적 시스템
├── careerSystem.js    # 직업 시스템
├── diary.js           # 일기 시스템
├── gameLoopManager.js # 게임 루프 관리
├── market.js          # 시장 이벤트 시스템
├── nicknameManager.js # 닉네임 관리
├── prestigeSystem.js  # 프레스티지 시스템
├── prestigeBonus.js   # 프레스티지 보너스/업그레이드
├── synergy.js         # 시너지 시스템
├── upgrades.js        # 업그레이드 잠금해제
├── upgradeManager.js  # 업그레이드 관리
├── workSystem.js      # 노동 시스템
└── devCheatSystem.js  # 개발 치트 (DEV 전용)

ui/
├── gameUI.js              # 메인 게임 UI
├── achievementGrid.js     # 업적 그리드 (메인 탭용)
├── achievementNotification.js # 업적 알림
├── animations.js          # 애니메이션
├── authUIManager.js       # 인증 UI
├── buttonStates.js        # 버튼 상태 관리
├── careerUI.js            # 직업 UI
├── collapsible.js         # 접기/펴기
├── domRefs.js             # DOM 참조
├── domUtils.js            # DOM 유틸리티
├── eventSetup.js          # 이벤트 핸들러 설정
├── headerResponsiveManager.js # 반응형 헤더
├── headerUI.js            # 헤더 UI
├── i18nUIManager.js       # i18n UI
├── inAppBrowserHandler.js # 인앱 브라우저
├── investmentTab.js       # 투자 탭
├── keyboardShortcuts.js   # 키보드 단축키
├── leaderboardUI.js       # 리더보드 UI
├── modal.js               # 모달
├── prestigeTab.js         # 프레스티지 탭
├── productUI.js           # 상품 UI
├── settingsModal.js       # 설정 모달
├── settingsTabManager.js  # 설정 탭
├── socialFeatures.js      # 소셜 기능
├── statsTab.js            # 통계 탭 (배럴 → statsTab/ 실제 구현)
├── synergyDisplay.js      # 시너지 표시
├── tabNavigation.js       # 탭 네비게이션
├── toast.js               # 토스트 메시지
└── statsTab/              # 통계 탭 실제 구현
    ├── index.js               # 배럴 (updateStatsTab 등 re-export)
    ├── charts.js              # 도넛 차트
    ├── efficiency.js          # 효율 분석
    ├── growthTracking.js      # 성장 추적
    └── statsAchievementGrid.js # 통계 탭 전용 업적 그리드

persist/
├── storage.js     # localStorage 래퍼
├── saveLoad.js    # 저장/로드 관리
└── cloudSync.js   # 클라우드 동기화 (Supabase)

i18n/
├── index.js           # t(), setLang() 등
└── translations/
    ├── en.js          # 영어
    └── ko.js          # 한국어

utils/
└── numberFormat.js    # 숫자 포맷 (한국식, 축약 등)

monitoring/
└── sentry.js          # Sentry 에러 모니터링
```

### UI 구조 주의사항

- `ui/statsTab.js`는 **배럴 파일** → `ui/statsTab/index.js`로 re-export
- `ui/achievementGrid.js` = **메인 게임 탭용** 업적 그리드
- `ui/statsTab/statsAchievementGrid.js` = **통계 탭 전용** 업적 그리드 (역할 다름)

## bootstrap.js Phase 초기화 구조

```
Phase A: initializeFoundation()
  → Sentry, 에러 바운더리, i18n, 모달, 헤더, 인앱 브라우저

Phase B: initializeState()
  → DOM 참조, 설정 로드 (particles, fancyGraphics, shortNumbers)

Phase C: initializeAssetCalculator()
  → 자산 계산기 (금융/부동산/총자산)

Phase D: initializeUpgradesAndAchievements(deps)
  → UPGRADES, upgradeManager, ACHIEVEMENTS

Phase E: initializeInvestmentSystem(deps)
  → investmentTab, buttonStateManager

Phase F: initializeGameUI(deps)
  → gameUI 모듈 초기화

Phase G: initializePersistence(deps)
  → cloudSyncManager, saveLoadManager

Phase H: initializePrestigeAndNickname(deps)
  → prestigeSystem, nicknameManager
```

> **주의**: Phase 순서에 의존성이 있음. A→B→C→...→H 순서 변경 금지.

## 데이터 흐름 (서울 생존기)

1. **상태**: `seoulsurvival/src/state/gameState.js`
2. **게임 루프**: `gameLoopManager.js` → `getRps()` 수익 업데이트
3. **저장**: LocalStorage (5초) + Supabase 클라우드
4. **리더보드**: `shared/leaderboard.js` (30초 동기화)

## 인증 & 클라우드

- Supabase + Google OAuth (`shared/auth/`)
- 환경 변수: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- 스키마: `supabase/*.sql`

## 다국어 (i18n)

- `t('key')` 함수, HTML: `data-i18n` 속성
- 언어 동기화: `localStorage.clicksurvivor_lang` 또는 `?lang=ko|en`

### 번역 검증 자동화

**검증 스크립트**: `scripts/validate-i18n.js`

**실행 방법**:

```bash
npm run validate:i18n
```

**검증 항목**:

1. **키 일치** - ko.js 및 en.js의 모든 키가 일치하는지 확인
2. **중복 키 검출** - 각 번역 파일에서 중복된 키가 있는지 검사
3. **파라미터 일치** - `{param}` 형식의 파라미터가 모든 언어에서 일치하는지 검증
4. **HTML `data-i18n` 참조** - HTML에서 사용되는 모든 `data-i18n` 속성이 번역 파일에 존재하는지 확인
5. **JS `t()` 호출 유효성** - JavaScript 코드에서 `t('key')` 호출이 유효한 키를 사용하는지 검증

**CI/CD 통합** (예정):

- GitHub Actions에서 빌드 시 자동 검증 실행
- Pre-commit hook에서 번역 파일 수정 시 검증

## 주요 패턴

### 레거시 코드 주의

`seoulsurvival/src/main.js`에 레거시 코드와 모듈 코드 공존. 수정 전 활성 경로 확인.

### 버전 관리

`package.json` → `version` → Vite `__APP_VERSION__` 자동 주입

### UI 수정

- 게임 UI: `seoulsurvival/index.html` (루트 아님)
- 허브 UI: 루트 `index.html`
- 공통 헤더: `shared/styles/universal_header.css`

### 경로 별칭

```javascript
'@shared/*'           → './shared/*'
'@seoulsurvival/*'    → './seoulsurvival/src/*'
'@kimchi-invasion/*'  → './kimchi-invasion/src/*'
```

> vite.config.js, vitest.config.js, tsconfig.json 모두에 정의됨

## 관련 문서

- [밸런스 가이드](./balance-guide.md)
- [MCP 설정](./mcp-setup.md)
- [보안 가이드](./security.md)
