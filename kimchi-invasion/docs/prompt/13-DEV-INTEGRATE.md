# 통합 작업 프롬프트

> **용도:** 여러 시스템 연결, 통합 테스트
> **사용 시점:** 개별 시스템 완성 후 연결 작업 시
> **권장 Agent:** orchestrator, test-agent

---

## 프롬프트 - 기본 (아래 내용 전체 복사)

```
[시스템A]와 [시스템B]를 통합해줘.

1. 두 시스템 코드 먼저 읽기
2. 인터페이스 확인 및 연결
3. main.js에서 초기화 순서 확인
4. 통합 후 동작 테스트
5. 문제 있으면 수정

완료 후 PROGRESS.md 업데이트.
```

---

## 사용 예시

### PixiJS + 카메라 통합

```
pixiApp.js와 camera.js를 통합해줘.

1. 두 시스템 코드 먼저 읽기
2. 인터페이스 확인 및 연결
3. main.js에서 초기화 순서 확인
4. 통합 후 동작 테스트
5. 문제 있으면 수정

완료 후 PROGRESS.md 업데이트.
```

### 게임 상태 + 저장 시스템 통합

```
gameStore.js와 저장 시스템(persist/storage.js)을 통합해줘.

1. 두 시스템 코드 먼저 읽기
2. 인터페이스 확인 및 연결
3. main.js에서 초기화 순서 확인
4. 통합 후 동작 테스트
5. 문제 있으면 수정

완료 후 PROGRESS.md 업데이트.
```

### 전체 시스템 통합 (Week 4)

```
모든 게임 시스템을 main.js에 통합해줘.

통합 대상:
- PixiJS + 카메라 + 타일맵
- Zustand 스토어
- ECS World
- 모든 게임 시스템
- UI 컴포넌트

1. 각 시스템 import 확인
2. 초기화 순서 정리
3. 게임 루프에서 시스템 업데이트 연결
4. 통합 테스트 실행
5. 문제 수정

완료 후 PROGRESS.md 업데이트.
```

---

## 주요 통합 포인트

| 단계   | 통합 대상                 | 시점    |
| :----- | :------------------------ | :------ |
| Week 1 | PixiJS + Camera + Tilemap | Day 2   |
| Week 1 | Zustand + Storage         | Day 4   |
| Week 1 | ECS + Game Loop           | Day 5   |
| Week 2 | Resources + Click Mining  | Day 2   |
| Week 2 | Buildings + UI            | Day 4   |
| Week 3 | Production Systems        | Day 1-2 |
| Week 3 | Conveyor + Logistics      | Day 3   |
| Week 4 | 전체 통합                 | Day 4-5 |

---

## 프롬프트 - orchestrator 활용 (권장)

```
orchestrator를 사용해서 [시스템A]와 [시스템B]를 통합해줘.

orchestrator가:
1. 두 시스템 코드 분석
2. 인터페이스 연결 방안 수립
3. 통합 코드 작성
4. test-agent로 통합 테스트
5. Playwright로 E2E 검증
6. PROGRESS.md 업데이트

문제 있으면 bug-hunter로 수정해줘.
```

---

## 프롬프트 - 대규모 통합 (Week 4)

```
orchestrator를 사용해서 전체 시스템을 main.js에 통합해줘.

통합 대상:
- PixiJS + 카메라 + 타일맵
- Zustand 스토어
- ECS World
- 모든 게임 시스템
- UI 컴포넌트

orchestrator가:
1. 각 시스템 import 정리
2. 초기화 순서 최적화
3. 게임 루프 통합
4. test-agent로 전체 테스트
5. performance-agent로 성능 확인
6. Playwright로 E2E 검증

완료 후 PROGRESS.md 업데이트.
```

---

## Agent 역할 분담

| 통합 작업        | Agent             |
| :--------------- | :---------------- |
| 시스템 통합 조율 | orchestrator      |
| 통합 테스트      | test-agent        |
| 버그 수정        | bug-hunter        |
| 성능 확인        | performance-agent |
| E2E 검증         | Playwright        |
| 문서 업데이트    | gdd-enhancer      |

---

## Ralph Loop 연동 (자동 통합)

```
/ralph-loop "
시스템 자동 통합:

대상: [시스템A]와 [시스템B]

1. 통합 코드 작성
2. npm run test:unit 실행
3. 실패하면 수정
4. Playwright 스모크 테스트
5. 모든 테스트 통과 시 <promise>INTEGRATE_DONE</promise>
" --max-iterations 20 --completion-promise "INTEGRATE_DONE"
```
