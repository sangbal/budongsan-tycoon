# Ralph Wiggum 자동 반복 루프

> **용도:** 완료될 때까지 자동 반복 실행
> **사용 시점:** TDD, 리팩토링, 대규모 구현 작업

---

## 기본 사용법

```bash
/ralph-loop "작업 설명" --max-iterations N --completion-promise "완료_신호"
```

**필수 옵션:**

- `--max-iterations N` - 최대 반복 횟수 (무한 루프 방지, **필수**)
- `--completion-promise "TEXT"` - 완료 시 출력할 신호 문구

---

## 프롬프트 템플릿

### 1. TDD 자동화 (테스트 통과까지)

```
/ralph-loop "
TDD로 [시스템명] 구현:
1. 실패하는 테스트 작성
2. 최소한의 코드로 구현
3. npm run test:unit 실행
4. 실패하면 수정
5. 리팩토링
6. 모든 테스트 통과 시 <promise>TDD_COMPLETE</promise>

현재 작업: [구체적 작업 설명]
완료 조건: 테스트 통과 + 커버리지 80% 이상
" --max-iterations 30 --completion-promise "TDD_COMPLETE"
```

### 2. ESLint/포맷팅 자동 수정

```
/ralph-loop "
코드 품질 자동 수정:
1. npm run lint 실행
2. 에러가 있으면 수정
3. npm run format 실행
4. 다시 lint 실행
5. 에러 0개일 때 <promise>LINT_CLEAN</promise>
" --max-iterations 15 --completion-promise "LINT_CLEAN"
```

### 3. 기능 구현 (명확한 스펙)

```
/ralph-loop "
[기능명] 구현:

요구사항:
- [요구사항 1]
- [요구사항 2]
- [요구사항 3]

완료 조건:
- 모든 요구사항 구현
- 단위 테스트 통과
- Playwright 스모크 테스트 통과

완료 시 <promise>FEATURE_DONE</promise>
" --max-iterations 40 --completion-promise "FEATURE_DONE"
```

### 4. ECS 프레임워크 완성 (KIMCHI INVASION)

```
/ralph-loop "
ECS-Lite 프레임워크 완전 구현:

파일:
1. ecs/Entity.js - 컴포넌트 추가/제거/조회
2. ecs/System.js - 엔티티 필터링, update 메서드
3. ecs/World.js - 엔티티/시스템 관리, 게임 루프 통합

요구사항:
- 각 파일에 JSDoc 타입 힌트
- 단위 테스트 작성 및 통과
- main.js에 통합
- Playwright 테스트 통과

완료 시 <promise>ECS_COMPLETE</promise>
" --max-iterations 30 --completion-promise "ECS_COMPLETE"
```

---

## 안전 수칙

### ⚠️ 필수

1. **항상 `--max-iterations` 설정** (없으면 무한 루프 → 비용 폭발)
2. **명확한 완료 조건** 정의 (테스트 통과, 에러 0개 등)
3. **작은 범위부터 시작** (10회 → 20회 → 50회)

### ❌ 금지

- `--max-iterations` 없이 실행
- 모호한 완료 조건 ("좋은 코드 작성")
- UI/UX 설계 같은 주관적 작업

---

## 루프 취소

진행 중인 루프를 취소하려면:

```
/cancel-ralph
```

---

## 작동 원리

```
1. 사용자가 /ralph-loop 실행
2. Claude가 작업 수행
3. Claude 종료 시도
4. Stop hook이 종료 차단
5. 동일한 프롬프트 + 파일 변경사항 전달
6. 2-5 반복
7. 완료 신호 감지 시 루프 종료
```

---

## 권장 사용 사례

| 작업             | max-iterations | 적합도     |
| :--------------- | :------------- | :--------- |
| ESLint 수정      | 10-15          | ⭐⭐⭐⭐⭐ |
| 단위 테스트 작성 | 20-30          | ⭐⭐⭐⭐⭐ |
| TDD 구현         | 30-50          | ⭐⭐⭐⭐⭐ |
| 리팩토링         | 20-40          | ⭐⭐⭐⭐   |
| 기능 구현        | 30-50          | ⭐⭐⭐⭐   |
| 버그 수정        | 15-25          | ⭐⭐⭐     |

---

## 문제 해결

### 루프가 멈추지 않음

```
/cancel-ralph
```

### 잘못된 방향으로 진행

1. `/cancel-ralph` 실행
2. `git diff`로 변경사항 확인
3. 필요시 `git checkout .`으로 롤백
4. 프롬프트 수정 후 재시도

### 완료 신호가 안 나옴

- 완료 조건이 너무 어려운지 확인
- `--max-iterations`에 도달하면 자동 종료
- 진행 상황 확인 후 조건 완화

---

## Agent 연동 패턴

Ralph Loop과 Agent를 함께 사용하는 패턴:

### 1. bug-hunter + Ralph Loop (버그 수정)

```
/ralph-loop "
bug-hunter를 사용해서 버그 자동 수정:

버그: [버그 설명]

1. bug-hunter로 원인 분석
2. 최소한의 코드로 수정
3. npm run test:unit 실행
4. 실패하면 다시 분석 및 수정
5. 모든 테스트 통과 시 <promise>BUG_FIXED</promise>
" --max-iterations 15 --completion-promise "BUG_FIXED"
```

### 2. quality-agent + Ralph Loop (코드 품질)

```
/ralph-loop "
quality-agent를 사용해서 코드 품질 자동 개선:

대상: [파일/폴더]

1. ESLint 에러 수정
2. 중복 코드 제거
3. 명명 규칙 개선
4. npm run lint 실행
5. 에러 0개일 때 <promise>QUALITY_DONE</promise>
" --max-iterations 20 --completion-promise "QUALITY_DONE"
```

### 3. test-agent + Ralph Loop (TDD)

```
/ralph-loop "
test-agent를 사용해서 TDD 자동화:

기능: [기능 설명]

1. 실패하는 테스트 작성
2. 최소 코드로 통과
3. npm run test:unit 실행
4. 리팩토링
5. 모든 테스트 통과 + 커버리지 80% 시 <promise>TDD_DONE</promise>
" --max-iterations 30 --completion-promise "TDD_DONE"
```

### 4. orchestrator + Ralph Loop (복합 작업)

```
/ralph-loop "
orchestrator를 사용해서 기능 완전 구현:

기능: [기능 설명]

orchestrator가:
1. 기능 구현
2. test-agent로 테스트
3. quality-agent로 품질 검증
4. Playwright로 E2E 테스트
5. 모든 검증 통과 시 <promise>FEATURE_COMPLETE</promise>
" --max-iterations 40 --completion-promise "FEATURE_COMPLETE"
```

---

## Agent별 권장 max-iterations

| Agent             | 작업 유형   | max-iterations |
| :---------------- | :---------- | :------------- |
| bug-hunter        | 단일 버그   | 10-15          |
| quality-agent     | ESLint 수정 | 15-20          |
| test-agent        | TDD         | 25-35          |
| performance-agent | 최적화      | 20-30          |
| orchestrator      | 복합 작업   | 35-50          |
