# 테스트 실행 프롬프트

> **용도:** 단위 테스트/E2E 테스트 실행 및 수정
> **사용 시점:** 기능 구현 후, 배포 전
> **권장 Agent:** test-agent, TestSprite MCP

---

## 프롬프트 - 단위 테스트 (아래 내용 전체 복사)

```
[파일/시스템]에 대한 단위 테스트를 작성하고 실행해줘.

1. 테스트 파일 생성 (없으면)
2. 주요 기능별 테스트 케이스 작성
3. npm run test:unit 실행
4. 실패하는 테스트 수정
5. 모든 테스트 통과 확인

결과 알려줘.
```

---

## 프롬프트 - test-agent 활용 (권장)

```
test-agent를 사용해서 [기능/시스템]의 테스트를 작성해줘.

테스트 대상:
- [테스트할 파일 또는 기능]

요구사항:
- 주요 기능 커버
- 엣지 케이스 포함
- 70%+ 커버리지 목표

test-agent가:
1. 테스트 대상 코드 분석
2. 테스트 케이스 설계
3. 테스트 코드 작성
4. 실행 및 결과 확인

완료 후 커버리지 보고해줘.
```

---

## 프롬프트 - TestSprite MCP 활용 (AI 자동 생성)

```
TestSprite MCP를 사용해서 [파일/시스템]의 테스트를 자동 생성해줘.

테스트 대상:
- kimchi-invasion/src/[경로]

TestSprite가:
1. 코드 분석
2. 테스트 케이스 자동 생성
3. 엣지 케이스 식별
4. 실행 및 결과 확인

생성된 테스트 검토 후 결과 알려줘.
```

---

## 프롬프트 - E2E 테스트 (Playwright)

```
KIMCHI INVASION의 E2E 테스트를 실행해줘.

1. 게임 빌드 확인 (npm run build)
2. Playwright 테스트 실행:
   npx playwright test tests/kimchi-invasion-smoke.spec.js --reporter=list
3. 실패하는 테스트 분석
4. bug-hunter로 코드 수정 또는 테스트 수정
5. 모든 테스트 통과 확인

결과 알려줘.
```

---

## 프롬프트 - 전체 테스트 (orchestrator)

```
orchestrator를 사용해서 KIMCHI INVASION 전체 테스트를 실행해줘.

orchestrator가:
1. test-agent로 단위 테스트 실행
2. Playwright로 E2E 테스트 실행
3. 실패 테스트 분석
4. bug-hunter로 문제 수정
5. 재실행 및 확인

완료 후 전체 결과 보고해줘.
```

---

## 사용 예시

### 특정 시스템 테스트

```
test-agent를 사용해서 resourceSystem.js의 테스트를 작성해줘.

테스트 대상:
- kimchi-invasion/src/systems/resourceSystem.js

요구사항:
- 자원 추가/감소 테스트
- 자원 한도 테스트
- 음수 방지 테스트
- 70%+ 커버리지 목표

test-agent가:
1. 테스트 대상 코드 분석
2. 테스트 케이스 설계
3. 테스트 코드 작성
4. 실행 및 결과 확인

완료 후 커버리지 보고해줘.
```

### ECS 프레임워크 테스트

```
test-agent를 사용해서 ECS 프레임워크의 테스트를 작성해줘.

테스트 대상:
- kimchi-invasion/src/ecs/Entity.js
- kimchi-invasion/src/ecs/System.js
- kimchi-invasion/src/ecs/World.js

요구사항:
- Entity 생성/삭제
- Component 추가/제거
- System update 호출
- World 엔티티 관리
- 80%+ 커버리지 목표

test-agent가:
1. 테스트 대상 코드 분석
2. 테스트 케이스 설계
3. 테스트 코드 작성
4. 실행 및 결과 확인

완료 후 커버리지 보고해줘.
```

---

## 테스트 명령어 참조

```bash
# 단위 테스트 전체 실행
npm run test:unit

# 특정 테스트 파일만 실행
npx vitest run kimchi-invasion/src/systems/__tests__/resourceSystem.test.js

# 테스트 감시 모드
npx vitest --watch

# 커버리지 확인
npm run test:coverage

# E2E 테스트
npm run test

# 특정 E2E 테스트만
npx playwright test tests/kimchi-invasion-smoke.spec.js

# E2E 테스트 (UI 모드)
npx playwright test --ui
```

---

## 테스트 파일 위치 규칙

```
src/
├── systems/
│   ├── resourceSystem.js
│   └── __tests__/
│       └── resourceSystem.test.js
├── ecs/
│   ├── Entity.js
│   └── __tests__/
│       └── Entity.test.js
├── core/
│   ├── pixiApp.js
│   └── __tests__/
│       └── pixiApp.test.js
...

tests/
└── kimchi-invasion-smoke.spec.js  # E2E 테스트
```

---

## Agent/MCP 역할 분담

| 테스트 유형      | 권장 Agent/MCP |
| :--------------- | :------------- |
| 단위 테스트 작성 | test-agent     |
| AI 자동 생성     | TestSprite MCP |
| E2E 테스트       | Playwright MCP |
| 실패 테스트 수정 | bug-hunter     |
| 대규모 테스트    | orchestrator   |

---

## Ralph Loop 연동 (TDD)

```
/ralph-loop "
TDD로 [시스템] 구현:

1. 실패하는 테스트 작성
2. 최소한의 코드로 구현
3. npm run test:unit 실행
4. 실패하면 수정
5. 리팩토링
6. 모든 테스트 통과 + 커버리지 80% 시 <promise>TDD_COMPLETE</promise>

테스트 대상: kimchi-invasion/src/[경로]
" --max-iterations 30 --completion-promise "TDD_COMPLETE"
```
