# 특정 파일 작업 프롬프트

> **용도:** 특정 파일 생성/수정
> **사용 시점:** 정확한 파일 경로를 알고 작업할 때
> **권장 Agent:** quality-agent, code-reviewer

---

## 프롬프트 - 파일 생성 (아래 내용 전체 복사)

```
kimchi-invasion/src/[경로/파일명] 파일을 생성해줘.

요구사항:
- 개발 계획서의 아키텍처 따르기
- 기존 코드 스타일과 일관성 유지
- JSDoc 타입 힌트 포함
- export 구문 명확하게

완료 후 PROGRESS.md 업데이트.
```

---

## 프롬프트 - 파일 수정 (아래 내용 전체 복사)

```
kimchi-invasion/src/[경로/파일명] 파일을 수정해줘.

수정 내용:
[수정할 내용 설명]

기존 코드 스타일 유지하면서 최소한의 변경으로 처리해줘.
```

---

## 사용 예시

### 파일 생성

```
kimchi-invasion/src/core/pixiApp.js 파일을 생성해줘.

요구사항:
- 개발 계획서의 아키텍처 따르기
- 기존 코드 스타일과 일관성 유지
- JSDoc 타입 힌트 포함
- export 구문 명확하게

완료 후 PROGRESS.md 업데이트.
```

### 파일 수정

```
kimchi-invasion/src/main.js 파일을 수정해줘.

수정 내용:
- PixiJS Application 초기화 코드 추가
- 기존 Canvas 렌더러 대체

기존 코드 스타일 유지하면서 최소한의 변경으로 처리해줘.
```

---

## 자주 사용되는 파일 경로

```
# Core
kimchi-invasion/src/core/pixiApp.js
kimchi-invasion/src/core/camera.js
kimchi-invasion/src/core/tilemap.js
kimchi-invasion/src/core/input.js

# ECS
kimchi-invasion/src/ecs/Entity.js
kimchi-invasion/src/ecs/System.js
kimchi-invasion/src/ecs/World.js

# State
kimchi-invasion/src/state/stores/gameStore.js
kimchi-invasion/src/state/stores/uiStore.js
kimchi-invasion/src/state/stores/settingsStore.js

# Systems
kimchi-invasion/src/systems/resourceSystem.js
kimchi-invasion/src/systems/clickMining.js
kimchi-invasion/src/systems/buildingSystem.js
...

# Data
kimchi-invasion/src/data/buildings.js
kimchi-invasion/src/data/resources.js
kimchi-invasion/src/data/recipes.js

# UI
kimchi-invasion/src/ui/hud.js
kimchi-invasion/src/ui/buildMenu.js
kimchi-invasion/src/ui/resourceBar.js
kimchi-invasion/src/ui/tooltip.js
```

---

## 프롬프트 - 파일 생성 + 리뷰 (권장)

```
kimchi-invasion/src/[경로/파일명] 파일을 생성해줘.

요구사항:
- 개발 계획서의 아키텍처 따르기
- 기존 코드 스타일과 일관성 유지
- JSDoc 타입 힌트 포함
- export 구문 명확하게

생성 후:
1. code-reviewer로 즉시 리뷰
2. 문제 있으면 수정
3. PROGRESS.md 업데이트
```

---

## 프롬프트 - 파일 수정 + 테스트 (권장)

```
kimchi-invasion/src/[경로/파일명] 파일을 수정해줘.

수정 내용:
[수정할 내용 설명]

수정 후:
1. test-agent로 관련 테스트 실행
2. 회귀 버그 확인
3. code-reviewer로 리뷰
4. PROGRESS.md 업데이트
```

---

## Agent 역할 분담

| 작업           | Agent         |
| :------------- | :------------ |
| 파일 생성/수정 | 직접          |
| 코드 리뷰      | code-reviewer |
| 테스트         | test-agent    |
| 품질 검증      | quality-agent |
| 문서 업데이트  | gdd-enhancer  |
