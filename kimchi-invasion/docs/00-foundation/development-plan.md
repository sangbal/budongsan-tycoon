# KIMCHI INVASION MVP 개발 계획서

> **Version:** 1.0
> **작성일:** 2026-01-19
> **상태:** 승인됨 - 개발 진행 중

---

## 1. Executive Summary

### 프로젝트 개요

- **게임명:** KIMCHI INVASION: The Red Planet Protocol
- **장르:** Factory Automation + Idle Incremental
- **컨셉:** 화성에서 김치를 생산하여 지구로 역수출하는 SF 팩토리 시뮬레이션

### 핵심 결정사항

| 항목      | 결정               | 근거                                |
| :-------- | :----------------- | :---------------------------------- |
| MVP 범위  | M1 + M2 전체       | 기획 문서 기준 유지                 |
| 개발 기간 | 4주 (6-8주 가능)   | 주말 집중 8시간+                    |
| 언어      | JavaScript + JSDoc | 기존 코드 활용, 마이그레이션 최소화 |
| 플랫폼    | 데스크톱 우선      | 터치 지원은 Phase 2                 |
| 렌더링    | PixiJS 8.x         | 5,000 스프라이트 @ 60fps 목표       |
| 상태관리  | Zustand 4.x        | 경량, 간편한 API                    |

---

## 2. MVP 범위 정의

### M1: 수동 단계 (1-2시간 플레이타임)

```
목표: 첫 김치 10캔 생산

해금 콘텐츠:
├── 클릭 채굴 (철광석, 얼음)
├── 기초 건물 (채굴기, 얼음 추출기, 온실)
├── 수동 가공 (용광로, 절임소)
├── 화력 발전소
└── 첫 번째 김치 (배추김치)

승리 조건: 배추김치 10캔 보유
```

### M2: 자동 채집 (3-5시간 플레이타임)

```
목표: 10캔/분 자동 생산

해금 콘텐츠:
├── 컨베이어 벨트 (직선, 회전)
├── 투입기 (자원 이동 자동화)
├── 연구소 (기술 트리 시작)
├── 창고 (용량 확장)
├── 두 번째 김치 (깍두기)
└── Tier 2 연구 시작

승리 조건: 김치 생산 속도 10캔/분 달성
```

### 성능 목표

| 지표       | 목표           | 측정 방법       |
| :--------- | :------------- | :-------------- |
| FPS        | 60fps          | PixiJS stats    |
| 스프라이트 | 5,000개        | 스트레스 테스트 |
| 로딩 시간  | < 3초          | Lighthouse      |
| 번들 크기  | < 300KB (gzip) | Vite build      |

---

## 3. 기술 아키텍처

### 3.1 기술 스택

```
프론트엔드:
├── PixiJS 8.x      # 2D WebGL 렌더링
├── Vite 5.x        # 번들러 + HMR
├── Zustand 4.x     # 상태 관리
├── Howler.js 2.x   # 오디오 (Phase 2)
└── i18next         # 다국어 (ko, en)

백엔드 (Phase 2):
├── Supabase        # DB + Auth
└── Edge Functions  # 서버리스
```

### 3.2 디렉토리 구조

```
kimchi-invasion/src/
├── main.js                 # [유지] 게임 초기화
├── core/
│   ├── pixiApp.js          # [신규] PixiJS Application
│   ├── camera.js           # [신규] 팬/줌 카메라
│   ├── tilemap.js          # [신규] 타일맵 렌더링
│   └── input.js            # [유지] 입력 처리
├── ecs/
│   ├── Entity.js           # [신규] 엔티티 기반 클래스
│   ├── System.js           # [신규] 시스템 기반 클래스
│   └── World.js            # [신규] 엔티티/시스템 관리자
├── state/
│   └── stores/
│       ├── gameStore.js    # [신규] 게임 상태 (자원, 건물)
│       ├── uiStore.js      # [신규] UI 상태
│       └── settingsStore.js# [신규] 설정
├── systems/
│   ├── resourceSystem.js   # [신규] 자원 관리
│   ├── clickMining.js      # [신규] 클릭 채굴
│   ├── buildingSystem.js   # [신규] 건물 배치/업그레이드
│   ├── farmingSystem.js    # [신규] 농업 생산
│   ├── processingSystem.js # [신규] 가공 (용광로, 절임소)
│   ├── fermentationSystem.js # [신규] 발효 시스템
│   ├── conveyorSystem.js   # [신규] 물류 시스템
│   └── tutorialSystem.js   # [신규] 튜토리얼
├── data/
│   ├── buildings.js        # [신규] 건물 정의
│   ├── resources.js        # [신규] 자원 정의
│   └── recipes.js          # [신규] 제작법
├── ui/
│   ├── hud.js              # [신규] 상단 HUD
│   ├── buildMenu.js        # [신규] 건물 메뉴
│   ├── resourceBar.js      # [신규] 자원 표시
│   └── tooltip.js          # [신규] 툴팁
└── utils/
    ├── constants.js        # [신규] 상수
    └── helpers.js          # [신규] 유틸리티
```

### 3.3 ECS-Lite 패턴

```javascript
// Entity: 데이터만 보유
class Building {
  constructor(type, x, y) {
    this.id = uuid()
    this.type = type
    this.position = { x, y }
    this.inventory = {}
    this.progress = 0
  }
}

// System: 로직만 처리
class ProcessingSystem {
  update(buildings, deltaTime) {
    buildings.filter(b => b.type === 'furnace').forEach(b => this.processFurnace(b, deltaTime))
  }
}

// World: 엔티티/시스템 관리
class World {
  entities = []
  systems = []

  update(deltaTime) {
    this.systems.forEach(s => s.update(this.entities, deltaTime))
  }
}
```

---

## 4. 개발 로드맵 (4주)

### Week 1: 기술 기반 구축

```
Day 1-2: PixiJS 8 통합
├── pixiApp.js 작성
├── 기존 Canvas 렌더러 대체
├── 타일맵 기본 구현
└── 카메라 팬/줌

Day 3-4: Zustand 상태 관리
├── gameStore.js (자원, 건물)
├── uiStore.js (UI 상태)
├── 기존 gameState.js 마이그레이션
└── 저장/불러오기 연동

Day 5: ECS-Lite 프레임워크
├── Entity, System, World 클래스
├── 게임 루프 통합
└── 단위 테스트

산출물: 빈 타일맵 + 카메라 조작 + 상태 저장
```

### Week 2: M1 핵심 시스템

```
Day 1: 자원 시스템
├── resources.js 데이터
├── resourceSystem.js
├── 자원 HUD

Day 2: 클릭 채굴
├── clickMining.js
├── 클릭 이펙트
├── 채굴 사운드 (기본)

Day 3-4: 건물 시스템
├── buildings.js 데이터
├── buildingSystem.js
├── 건물 배치 UI
├── 건물 스프라이트 (플레이스홀더)

Day 5: 농업/가공 기초
├── farmingSystem.js (온실)
├── processingSystem.js (용광로, 절임소)

산출물: 클릭 채굴 + 건물 배치 + 기본 생산
```

### Week 3: M1 완성 + M2 시작

```
Day 1: 발효 시스템
├── fermentationSystem.js
├── 발효 진행 UI
├── 첫 김치 생산

Day 2: 전력 시스템
├── powerSystem.js
├── 화력 발전소
├── 전력 부족 경고

Day 3: 컨베이어 시스템
├── conveyorSystem.js
├── 자원 이동 시각화
├── 투입기

Day 4-5: 연구소 + 기술 트리
├── researchSystem.js
├── Tier 1-2 연구
├── 연구 UI

산출물: M1 완료 (김치 10캔) + 물류 기초
```

### Week 4: 통합 + 폴리싱

```
Day 1-2: 튜토리얼
├── tutorialSystem.js
├── FTUE 시퀀스
├── 힌트/가이드 UI

Day 3: i18n + 설정
├── ko/en 번역
├── 설정 메뉴
├── 볼륨, 언어 변경

Day 4: 버그 수정 + 최적화
├── 성능 프로파일링
├── 메모리 누수 체크
├── 크리티컬 버그 수정

Day 5: QA + 배포 준비
├── E2E 테스트
├── 빌드 검증
├── 배포

산출물: MVP 완성 (M1 + M2 핵심)
```

---

## 5. AI 에이전트 활용 전략

### 5.1 활성화된 서브 에이전트

| 에이전트          | 역할           | 사용 시점           |
| :---------------- | :------------- | :------------------ |
| **orchestrator**  | 작업 분해/위임 | 대규모 기능 구현    |
| **quality-agent** | 코드 품질      | 리팩토링, 코드 리뷰 |
| **balance-agent** | 게임 밸런스    | 수치 조정           |
| **test-agent**    | 테스트 자동화  | 단위/E2E 테스트     |
| **design-agent**  | UI/UX          | UI 구현, 접근성     |
| **bug-hunter**    | 버그 분석      | 에러 발생 시        |

### 5.2 MCP 서버 활용

| MCP              | 용도            | 활용 예시            |
| :--------------- | :-------------- | :------------------- |
| **context7**     | 최신 문서       | PixiJS 8 API 조회    |
| **testsprite**   | AI 테스트       | 자동 테스트 생성     |
| **playwright**   | 브라우저 자동화 | E2E 테스트, 스크린샷 |
| **brave-search** | 웹 검색         | 기술 문제 해결       |

### 5.3 바이브 코딩 워크플로우

```
1. 작업 정의
   └── TodoWrite로 작업 분해

2. 컨텍스트 준비
   ├── Context7로 라이브러리 문서 조회
   └── 관련 GDD 문서 참조

3. 구현
   ├── 코드 작성
   ├── 즉시 테스트 (vitest)
   └── 문제 시 bug-hunter 호출

4. 검증
   ├── test-agent로 테스트 보강
   ├── playwright로 시각 검증
   └── code-reviewer로 리뷰

5. 통합
   └── 메인 브랜치 병합
```

---

## 6. 리스크 관리

### 6.1 주요 리스크

| 리스크           | 확률 | 영향 | 완화 전략                 |
| :--------------- | :--- | :--- | :------------------------ |
| 4주 내 미완료    | 높음 | 높음 | M1 우선 완성, M2는 핵심만 |
| PixiJS 학습 곡선 | 중간 | 중간 | Context7 적극 활용        |
| 상태 관리 복잡도 | 중간 | 중간 | Zustand로 단순화          |
| 성능 이슈        | 낮음 | 높음 | 조기 프로파일링           |

### 6.2 Cut List (우선순위 낮음)

4주 내 미완료 시 제외:

- 사운드/BGM (기본 효과음만)
- 업적 시스템
- 리더보드
- 고급 물류 (드론, 분배기)
- 묵은지 (6번째 김치)

---

## 7. 검증 계획

### 7.1 테스트 전략

```bash
# 단위 테스트
npm run test:unit

# E2E 테스트
npm run test

# 성능 테스트
# PixiJS stats로 FPS 확인
# Lighthouse로 로딩 시간 측정
```

### 7.2 수동 검증 체크리스트

- [ ] 클릭 채굴로 철광석 획득
- [ ] 채굴기 건설 및 자동 채굴
- [ ] 온실 건설 및 배추 수확
- [ ] 용광로에서 철판 생산
- [ ] 절임소에서 소금 생산
- [ ] 배추김치 10캔 생산 (M1 완료)
- [ ] 컨베이어로 자원 자동 이동
- [ ] 연구소에서 기술 연구
- [ ] 10캔/분 자동 생산 (M2 완료)
- [ ] 저장/불러오기 정상 동작
- [ ] 한/영 언어 전환

---

## 8. 관련 문서

- [MVP 정의](./mvp-definition.md)
- [기술 검증](./tech-validation.md)
- [진행 상황 추적](./_ai-context/PROGRESS.md)

---

**승인일:** 2026-01-19
**작성자:** Claude Code
