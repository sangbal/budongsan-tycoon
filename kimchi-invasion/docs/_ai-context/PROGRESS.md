# KIMCHI INVASION - 개발 진행 상황

> **목적:** AI가 새 세션에서 현재 진행 상황을 빠르게 파악하기 위한 문서
> **최종 수정:** 2026-01-20
> **현재 Phase:** Week 4 완료 - QA & 최적화

---

## 🎯 현재 상태 요약

| 항목            | 상태            | 비고             |
| :-------------- | :-------------- | :--------------- |
| **전체 진행률** | 90%             | Week 4 완료 ✅   |
| **현재 작업**   | Phase 2 QA 완료 | 최적화 작업 완료 |
| **다음 작업**   | 배포 준비       | E2E 테스트 추가  |
| **블로커**      | 없음            | -                |

---

## 📋 Week 1 체크리스트 (기술 기반 구축)

### Day 1-2: PixiJS 8 통합

- [x] PixiJS 8 + Zustand 의존성 설치 (pixi.js@8.15.0, zustand@5.0.10)
- [x] `core/pixiApp.js` - PixiJS Application 래퍼
- [x] `core/camera.js` - 팬/줌 카메라 시스템
- [x] `core/tilemap.js` - 타일맵 렌더링
- [x] 기존 Canvas 렌더러 대체 (main.js 수정)
- [x] `systems/cameraControls.js` - 입력-카메라 연결

### Day 3-4: Zustand 상태 관리

- [x] `state/stores/gameStore.js` - 게임 상태 (자원, 건물, 생산)
- [x] `state/stores/uiStore.js` - UI 상태 (모달, 패널, 빌드모드)
- [x] `state/stores/settingsStore.js` - 설정 (localStorage persist)
- [x] `state/stores/index.js` - 스토어 중앙 export
- [x] 기존 `gameState.js` → Zustand 마이그레이션 (삭제 완료)
- [x] 저장/불러오기 연동 (serialize/deserialize 구현)

### Day 5: ECS-Lite 프레임워크

- [x] `ecs/Entity.js` - 엔티티 기반 클래스
- [x] `ecs/System.js` - 시스템 기반 클래스
- [x] `ecs/World.js` - 엔티티/시스템 관리자
- [x] 게임 루프 통합 (`main.js`에서 `world.update(deltaTime)` 호출)
- [x] 단위 테스트 (18개 테스트 통과)

### Week 1 산출물

- [x] 빈 타일맵 렌더링
- [x] 카메라 팬/줌 조작
- [x] 상태 저장/불러오기 (serialize/deserialize 완료)

---

## 📋 Week 2 체크리스트 (M1 핵심 시스템) ✅ 완료

### Day 1: 자원 시스템

- [x] `data/resources.js` - 자원 정의 (27개 자원, 5개 카테고리, 524줄)
- [x] `systems/resourceSystem.js` - 자원 관리 (277줄, 12 함수)
- [x] `ui/resourceBar.js` - 자원 HUD (184줄)

### Day 2: 클릭 채굴

- [x] `systems/clickMining.js` - 클릭 채굴 (316줄)
- [x] `ui/clickEffect.js` - 클릭 이펙트 (197줄, 오브젝트 풀링)
- [ ] 기본 채굴 사운드 (Phase 2)

### Day 3-4: 건물 시스템

- [x] `data/buildings.js` - 건물 정의 (10종 건물, 5개 카테고리, 476줄)
- [x] `systems/buildingSystem.js` - 건물 배치/업그레이드 (477줄)
- [x] `ui/buildingSprites.js` - 건물 스프라이트 (520줄)
- [x] `ui/buildingRenderer.js` - 렌더링 레이어 통합 (200줄)
- [x] `ui/buildMenu.js` - 건물 배치 UI (456줄)

### Day 5: 농업/가공 기초

- [x] `systems/farmingSystem.js` - 농업 (193줄)
- [x] `systems/processingSystem.js` - 가공 (227줄)

---

## 📋 Week 3 체크리스트 (M1 완성 + M2 시작) ✅ 완료

### Day 1: 발효 시스템

- [x] `systems/fermentationSystem.js` - 발효 시스템 (253줄)
- [x] M1 E2E 테스트 - 김치 10캔 생산 검증 (21 테스트, 95% 통과)
- [x] 첫 김치 생산 ✅

### Day 2: 전력 시스템

- [x] `systems/powerSystem.js` - 전력 시스템 (262줄)
- [x] 화력 발전소 연동
- [x] 전력 부족 경고 (powerWarning 이벤트)

### Day 3: 컨베이어/투입기 시스템

- [x] `systems/conveyorSystem.js` - 물류 시스템 (602줄, 36 테스트)
- [x] `systems/inserterSystem.js` - 투입기 시스템 (635줄, 25 테스트)
- [x] 레벨별 속도 증가 (Lv1-5)

### Day 4-5: 연구소 + 기술 트리

- [x] `data/technologies.js` - 15개 기술 정의 (471줄)
- [x] `systems/researchSystem.js` - 연구 시스템 (435줄, 76 테스트)
- [x] `ui/researchUI.js` - 연구 UI 패널 (i18n 포함)

---

## 📋 Week 4 체크리스트 (통합 + 폴리싱) ✅ 완료

### Day 1-2: 튜토리얼

- [x] `systems/tutorialSystem.js` - 튜토리얼 시스템 (610줄)
- [x] FTUE 시퀀스 (5단계)
- [x] `ui/tutorialUI.js` - 튜토리얼 UI (512줄)

### Day 3: i18n + 설정

- [x] ko/en 번역 완료
- [x] `ui/settingsMenu.js` - 설정 메뉴 (661줄)
- [x] 볼륨, 언어, 그래픽 설정

### Day 4: 버그 수정 + 최적화

- [x] 성능 프로파일링 (FPS 모니터 추가)
- [x] 메모리 누수 체크 (이벤트 리스너 해제 추가)
- [x] 크리티컬 버그 수정 (3개)
  - buildingRenderer 에너지/자원 부족 피드백
  - tutorialUI 스포트라이트 CSS 하이라이트
  - Z-order CSS 변수 통합

### Day 5: QA + 배포

- [x] console.log 정리 (232개 → 58개, 75% 감소)
- [x] 빌드 검증 (성공)
- [x] 단위 테스트 (902/936 통과, 96%)

---

## 🔧 기술 스택 (확정)

```
프론트엔드:
├── PixiJS 8.x      # 2D WebGL 렌더링
├── Vite 5.x        # 번들러 + HMR (기존)
├── Zustand 4.x     # 상태 관리 (신규 설치 필요)
└── JavaScript      # JSDoc 타입 힌트 사용

백엔드 (Phase 2):
├── Supabase        # DB + Auth
└── Edge Functions  # 서버리스
```

---

## 📁 생성할 파일 목록

### Week 1 (우선)

```
kimchi-invasion/src/
├── core/
│   ├── pixiApp.js          # PixiJS Application
│   ├── camera.js           # 카메라 시스템
│   └── tilemap.js          # 타일맵
├── ecs/
│   ├── Entity.js           # 엔티티
│   ├── System.js           # 시스템
│   └── World.js            # 월드 관리자
└── state/stores/
    ├── gameStore.js        # 게임 상태
    ├── uiStore.js          # UI 상태
    └── settingsStore.js    # 설정
```

### Week 2-4 (이후)

```
├── systems/
│   ├── resourceSystem.js
│   ├── clickMining.js
│   ├── buildingSystem.js
│   ├── farmingSystem.js
│   ├── processingSystem.js
│   ├── fermentationSystem.js
│   ├── conveyorSystem.js
│   ├── powerSystem.js
│   ├── researchSystem.js
│   └── tutorialSystem.js
├── data/
│   ├── buildings.js
│   ├── resources.js
│   └── recipes.js
└── ui/
    ├── hud.js
    ├── buildMenu.js
    ├── resourceBar.js
    └── tooltip.js
```

---

## 🚀 새 세션 시작 시 안내

### AI가 먼저 읽어야 할 문서

1. **이 문서** (`_ai-context/PROGRESS.md`) - 현재 진행 상황
2. **개발 계획서** (`00-foundation/development-plan.md`) - 전체 계획
3. **빠른 시작** (`_ai-context/QUICK_START.md`) - 게임 개요

### 첫 명령어

```bash
# 현재 상태 확인
cd kimchi-invasion
git status

# 의존성 확인
npm list pixi.js zustand

# 개발 서버 시작
npm run dev
```

### 현재 작업 재개 시

1. 위 체크리스트에서 미완료 항목 확인
2. 해당 작업 이어서 진행
3. 완료 시 체크리스트 업데이트

---

## 📝 작업 로그

### 2026-01-19

- [x] 개발 계획서 승인 완료
- [x] 문서화 구조 정리
- [x] **Week 1 Day 1-2 완료:**
  - PixiJS 8.15.0 + Zustand 5.0.10 설치
  - `core/pixiApp.js` - PixiJS Application 래퍼 (레이어: game, ui)
  - `core/camera.js` - 팬/줌 카메라 (경계 제한, 좌표 변환)
  - `core/tilemap.js` - 청크 기반 타일맵 (화성 지형 절차적 생성)
  - `systems/cameraControls.js` - 드래그/휠/WASD 카메라 컨트롤
- [x] **Week 1 Day 3-4 완료:**
  - `state/stores/gameStore.js` - 자원/건물/생산/기술/통계 관리
  - `state/stores/uiStore.js` - 모달/패널/선택/알림/빌드모드
  - `state/stores/settingsStore.js` - 언어/오디오/그래픽/접근성 (persist)
  - `tests/kimchi-invasion-smoke.spec.js` - Playwright 스모크 테스트
  - `docs/prompt/04-SESSION-END.md` - 세션 종료 워크플로우
  - `main.js` PixiJS 통합 완료
- [x] **Week 1 Day 5 완료:**
  - `ecs/Entity.js` - 엔티티 기반 클래스 (110 라인)
  - `ecs/System.js` - 시스템 기반 클래스 (65 라인)
  - `ecs/World.js` - 엔티티/시스템 관리자 (141 라인)
  - `ecs/index.js` - 중앙 export (9 라인)
  - `ecs/__tests__/World.test.js` - 단위 테스트 (18개 테스트, 100% 통과)
  - ESLint 에러 0개, Prettier 적용 완료
  - **게임 루프 통합 완료:**
    - `main.js`에서 ECS World 인스턴스 생성
    - `gameLoop()`에서 `world.update(deltaTime)` 호출
    - deltaTime 계산 정확도 검증 (밀리초 → 초 변환)
    - 디버그 export 추가 (`window.kimchiGame.getWorld()`)
    - 검증 가이드 작성 (`docs/_ai-context/ECS_INTEGRATION_VERIFICATION.md`)
- [x] **Week 2 Day 1 부분 완료:**
  - `data/resources.js` - 27개 자원, 5개 카테고리 (524줄)
- [x] **Week 2 Day 3 부분 완료:**
  - `data/buildings.js` - 10종 건물, 5개 카테고리 (476줄)
  - `data/__tests__/buildings.test.js` - 단위 테스트 (37개 테스트, 100% 통과)
  - 건물 카테고리: extraction(2), production(4), power(1), utility(1), logistics(2)
  - 유틸리티 함수 10개: 조회, 비용 검사, 업그레이드, 생산량 계산 등
  - ESLint 에러 0개, Prettier 적용 완료
- [x] **Week 2 완료:**
  - `systems/resourceSystem.js` - 277줄, 12 함수
  - `systems/clickMining.js` - 316줄, 이벤트 시스템
  - `systems/buildingSystem.js` - 477줄, 21/23 테스트
  - `systems/farmingSystem.js` - 193줄
  - `systems/processingSystem.js` - 227줄
  - `ui/resourceBar.js` - 184줄
  - `ui/clickEffect.js` - 197줄, 오브젝트 풀링
  - `ui/buildMenu.js` - 456줄
  - 총 ~4,349줄 코드, 192 테스트 (96.5% 통과)
- [x] **Week 3 완료:**
  - `systems/fermentationSystem.js` - 253줄, 발효 레시피
  - `systems/powerSystem.js` - 262줄, 전력 경고 시스템
  - `systems/conveyorSystem.js` - 602줄, 36 테스트
  - `systems/inserterSystem.js` - 635줄, 25 테스트
  - `data/technologies.js` - 471줄, 15개 기술 (Tier 1-5)
  - `systems/researchSystem.js` - 435줄, 76 테스트 (100% 통과)
  - `ui/buildingSprites.js` - 520줄, 10종 건물 색상 코딩
  - `ui/buildingRenderer.js` - 200줄
  - `ui/researchUI.js` - 연구 패널 (i18n 포함)
  - M1 E2E 테스트 - 21 테스트, 95% 통과
  - 총 ~3,378줄 코드, 158 테스트

### 2026-01-20 (Phase 2 QA)

- [x] **Phase 2 QA & 최적화 완료:**
  - `main.js` - FPS 모니터 추가 (DEV 환경)
  - `ui/buildingRenderer.js` - 이벤트 리스너 해제, 에너지/자원 부족 피드백
  - `styles.css` - Z-index CSS 변수 통합
  - `styles/tutorial.css` - CSS 변수 적용
  - `styles/settings.css` - CSS 변수 적용
  - `i18n/index.js` - getCurrentLanguage alias 추가
  - console.log 정리: 232개 → 58개 (75% 감소)
  - 빌드 성공, 테스트 902/936 통과 (96%)

---

## 🔗 참조 링크

- [전체 목차](../README.md)
- [개발 계획서](../00-foundation/development-plan.md)
- [MVP 정의](../00-foundation/mvp-definition.md)
- [게임 메카닉](../02-mechanics/game-mechanics.md)
- [기술 스택](../09-technical/a-tech-stack.md)
