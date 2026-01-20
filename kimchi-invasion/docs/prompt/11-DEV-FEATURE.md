# 특정 기능 구현 프롬프트

> **용도:** 특정 시스템/컴포넌트 개발
> **사용 시점:** 체크리스트 외 특정 기능을 구현하고 싶을 때
> **권장 Agent:** gdd-enhancer (기획 확인), quality-agent (코드 품질)

---

## 프롬프트 - 기본 (아래 내용 전체 복사)

```
[기능명] 기능을 구현해줘.

참고할 문서:
- 개발 계획서: docs/00-foundation/development-plan.md
- 게임 메카닉: docs/02-mechanics/game-mechanics.md

구현 시:
1. 관련 GDD 문서 먼저 확인
2. 기존 코드 패턴 따르기
3. JSDoc 타입 힌트 추가
4. 간단한 테스트 코드 포함

완료 후 PROGRESS.md 업데이트.
```

---

## 프롬프트 - Agent 활용 (권장)

```
[기능명] 기능을 구현해줘.

1. gdd-enhancer로 관련 GDD 문서 확인
   - docs/02-mechanics/ 에서 해당 시스템 스펙 참조

2. Context7로 필요한 라이브러리 API 조사
   - PixiJS 8 / Zustand 관련 기능

3. quality-agent로 구현
   - 기존 코드 패턴 준수
   - JSDoc 타입 힌트 추가

4. test-agent로 단위 테스트 작성

완료 후 PROGRESS.md 업데이트.
```

---

## 프롬프트 - 대규모 기능 (orchestrator)

```
[대규모 기능명]을 구현해줘.

orchestrator를 사용해서:
1. 기능을 작은 작업으로 분해
2. 각 작업에 적합한 agent 배정:
   - 기획 확인: gdd-enhancer
   - 코드 구현: quality-agent
   - 테스트: test-agent
   - UI 관련: design-agent
3. 의존성 순서대로 실행
4. 결과 통합

참고 문서:
- GDD: docs/02-mechanics/game-mechanics.md
- 계획: docs/00-foundation/development-plan.md
```

---

## 사용 예시

### ECS 프레임워크 구현

```
ECS-Lite 프레임워크를 구현해줘.

1. Context7로 ECS 패턴 Best Practice 조사

2. quality-agent로 구현:
   - ecs/Entity.js - 엔티티 기반 클래스
   - ecs/System.js - 시스템 기반 클래스
   - ecs/World.js - 엔티티/시스템 관리자

3. test-agent로 단위 테스트 작성

4. main.js에 통합

완료 후 PROGRESS.md 업데이트.
```

### 발효 시스템 구현

```
발효 시스템(fermentationSystem.js)을 구현해줘.

1. gdd-enhancer로 GDD에서 발효 메카닉 스펙 확인
   - docs/02-mechanics/game-mechanics.md

2. quality-agent로 구현:
   - 발효 진행 로직
   - 온도 관리 시스템
   - 김치 품질 계산

3. test-agent로 단위 테스트 작성

4. Playwright로 UI 동작 확인

완료 후 PROGRESS.md 업데이트.
```

---

## [기능명] 예시 목록

### Week 1 (기술 기반)

- `ECS-Lite 프레임워크 (Entity.js, System.js, World.js)`
- `카메라 시스템 (camera.js)`
- `타일맵 렌더러 (tilemap.js)`

### Week 2 (M1 핵심)

- `자원 시스템 (resourceSystem.js)`
- `클릭 채굴 시스템 (clickMining.js)`
- `건물 시스템 (buildingSystem.js)`

### Week 3 (M1 완성)

- `발효 시스템 (fermentationSystem.js)`
- `전력 시스템 (powerSystem.js)`
- `컨베이어 시스템 (conveyorSystem.js)`

### Week 4 (통합)

- `튜토리얼 시스템 (tutorialSystem.js)`
- `HUD 컴포넌트 (hud.js)`
- `건물 메뉴 (buildMenu.js)`

---

## Agent 역할 분담

| 단계      | Agent          | 역할                   |
| :-------- | :------------- | :--------------------- |
| 기획 확인 | gdd-enhancer   | GDD 문서에서 스펙 추출 |
| 기술 조사 | Context7 MCP   | 라이브러리 API 확인    |
| 구현      | quality-agent  | 코드 작성 (패턴 준수)  |
| 테스트    | test-agent     | 단위 테스트 작성       |
| UI 검증   | Playwright MCP | 시각적 동작 확인       |
