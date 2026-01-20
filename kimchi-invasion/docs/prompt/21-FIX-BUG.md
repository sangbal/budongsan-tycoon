# 버그 수정 프롬프트

> **용도:** 동작 오류 수정 (에러 메시지 없이 이상하게 동작할 때)
> **사용 시점:** 코드가 의도대로 동작하지 않을 때
> **권장 Agent:** bug-hunter, orchestrator

---

## 프롬프트 - 기본 (아래 내용 전체 복사)

```
버그를 수정해줘.

현상:
[현재 어떻게 동작하는지]

기대 동작:
[어떻게 동작해야 하는지]

관련 파일/기능:
[관련 있을 것 같은 파일이나 기능]

bug-hunter 에이전트를 사용해서:
1. 원인 분석
2. 최소한의 코드 변경으로 수정
3. 수정 후 동작 확인

결과 알려줘.
```

---

## 사용 예시

### 클릭이 안 됨

```
버그를 수정해줘.

현상:
타일맵을 클릭해도 아무 반응이 없음

기대 동작:
클릭하면 자원이 채굴되어야 함

관련 파일/기능:
- clickMining.js
- input.js
- 이벤트 리스너

bug-hunter 에이전트를 사용해서:
1. 원인 분석
2. 최소한의 코드 변경으로 수정
3. 수정 후 동작 확인

결과 알려줘.
```

### 자원이 저장 안 됨

```
버그를 수정해줘.

현상:
게임을 새로고침하면 자원이 0으로 초기화됨

기대 동작:
저장된 자원이 유지되어야 함

관련 파일/기능:
- storage.js
- gameStore.js
- LocalStorage

bug-hunter 에이전트를 사용해서:
1. 원인 분석
2. 최소한의 코드 변경으로 수정
3. 수정 후 동작 확인

결과 알려줘.
```

### 렌더링 문제

```
버그를 수정해줘.

현상:
건물 스프라이트가 올바른 위치에 표시되지 않음 (오프셋이 있음)

기대 동작:
건물이 타일 중앙에 정확히 배치되어야 함

관련 파일/기능:
- buildingSystem.js
- tilemap.js
- camera.js

bug-hunter 에이전트를 사용해서:
1. 원인 분석
2. 최소한의 코드 변경으로 수정
3. 수정 후 동작 확인

결과 알려줘.
```

---

## 프롬프트 - Playwright 검증 포함 (권장)

```
버그를 수정하고 Playwright로 검증해줘.

현상:
[현재 어떻게 동작하는지]

기대 동작:
[어떻게 동작해야 하는지]

bug-hunter 에이전트를 사용해서:
1. 원인 분석
2. 최소한의 코드 변경으로 수정
3. Playwright로 수정 확인
4. 콘솔 에러 없음 확인

결과 알려줘.
```

---

## 프롬프트 - 복합 버그 (orchestrator)

```
orchestrator를 사용해서 복합적인 버그를 수정해줘.

현상:
[여러 증상 설명]

기대 동작:
[정상 동작 설명]

orchestrator가:
1. bug-hunter로 원인 분석
2. 관련 파일들 모두 확인
3. 단계적으로 수정
4. test-agent로 회귀 테스트
5. Playwright로 E2E 검증

결과 보고해줘.
```

---

## 버그 유형별 체크리스트

| 버그 유형   | 확인할 곳                                   | Agent/MCP                 |
| :---------- | :------------------------------------------ | :------------------------ |
| 클릭 안 됨  | input.js, 이벤트 바인딩, z-index            | bug-hunter + Playwright   |
| 렌더링 오류 | 좌표 변환, 카메라 오프셋, 스프라이트 anchor | bug-hunter + design-agent |
| 저장 안 됨  | storage.js, JSON 직렬화, 키 이름            | bug-hunter                |
| 성능 저하   | 무한 루프, 메모리 누수, 과도한 렌더링       | performance-agent         |
| 타이밍 문제 | 초기화 순서, async/await, 이벤트 타이밍     | bug-hunter                |

---

## Agent 역할 분담

| 버그 상황   | Agent/MCP               |
| :---------- | :---------------------- |
| 단일 버그   | bug-hunter              |
| UI/렌더링   | bug-hunter + Playwright |
| 성능 문제   | performance-agent       |
| 복합 버그   | orchestrator            |
| 회귀 테스트 | test-agent              |

---

## Ralph Loop 연동 (자동 수정)

```
/ralph-loop "
버그 자동 수정:

현상: [버그 설명]

1. bug-hunter로 원인 분석
2. 수정 코드 적용
3. npm run test:unit 실행
4. 실패하면 다시 분석
5. Playwright 스모크 테스트
6. 모든 테스트 통과 시 <promise>BUG_FIXED</promise>
" --max-iterations 15 --completion-promise "BUG_FIXED"
```
