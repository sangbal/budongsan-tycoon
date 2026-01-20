# 리팩토링 프롬프트

> **용도:** 코드 구조 개선
> **사용 시점:** 기능은 동작하지만 코드 품질 개선이 필요할 때
> **권장 Agent:** quality-agent

---

## 프롬프트 - 특정 파일 리팩토링 (아래 내용 전체 복사)

```
[파일명]을 리팩토링해줘.

개선 목표:
- 가독성 향상
- 중복 코드 제거
- 함수 분리
- 명명 개선

주의:
- 기존 동작 유지 (기능 변경 없음)
- 최소한의 변경으로 최대 효과
- 테스트가 있으면 통과 확인

리팩토링 전후 비교 설명해줘.
```

---

## 프롬프트 - quality-agent 활용 (권장)

```
quality-agent를 사용해서 [파일/폴더]를 리팩토링해줘.

대상:
- [리팩토링할 파일 또는 폴더]

개선 목표:
- 코드 품질 향상
- 아키텍처 개선
- 중복 제거
- 모듈화

quality-agent가:
1. 현재 코드 분석
2. 개선점 식별
3. 리팩토링 수행
4. test-agent로 회귀 테스트

기존 동작은 유지하면서 개선해줘.
```

---

## 프롬프트 - 대규모 리팩토링 (orchestrator)

```
orchestrator를 사용해서 [시스템/폴더]를 리팩토링해줘.

orchestrator가:
1. quality-agent로 현재 구조 분석
2. 리팩토링 계획 수립
3. 단계별 리팩토링 실행
4. 각 단계마다 test-agent로 테스트
5. 결과 통합 및 검증

대상: [리팩토링할 범위]

기존 기능 유지 + 점진적 개선으로 진행해줘.
```

---

## 사용 예시

### 긴 함수 분리

```
quality-agent를 사용해서 main.js의 initGame() 함수를 리팩토링해줘.

대상:
- kimchi-invasion/src/main.js

개선 목표:
- 긴 함수를 작은 함수들로 분리
- 각 함수의 역할 명확화
- 초기화 순서 가독성 향상

quality-agent가:
1. 현재 initGame() 분석
2. 분리 가능한 단위 식별
3. 헬퍼 함수로 추출
4. test-agent로 회귀 테스트

리팩토링 전후 비교 설명해줘.
```

### 중복 코드 제거

```
quality-agent를 사용해서 시스템 파일들의 중복 코드를 제거해줘.

대상:
- kimchi-invasion/src/systems/ 폴더 전체

개선 목표:
- 공통 로직 추출
- 유틸리티 함수 생성
- 상속 또는 컴포지션 활용

quality-agent가:
1. 중복 패턴 식별
2. 공통 모듈 설계
3. 리팩토링 수행
4. test-agent로 회귀 테스트

기존 동작 유지하면서 개선해줘.
```

### 전체 구조 개선

```
orchestrator를 사용해서 KIMCHI INVASION src/를 리팩토링해줘.

orchestrator가:
1. quality-agent로 현재 구조 분석
   - 아키텍처 일관성
   - 코드 중복
   - 모듈화 상태
2. 개선 계획 수립
3. 우선순위별 리팩토링
4. 각 단계마다 test-agent로 테스트

대상: kimchi-invasion/src/ 전체

점진적으로 개선해줘.
```

---

## 리팩토링 패턴

| 문제             | 해결 패턴           | Agent             |
| :--------------- | :------------------ | :---------------- |
| 긴 함수          | Extract Function    | quality-agent     |
| 중복 코드        | Extract Method      | quality-agent     |
| 복잡한 조건문    | Replace Conditional | quality-agent     |
| 긴 매개변수 목록 | Parameter Object    | quality-agent     |
| 전역 상태        | Replace with Store  | quality-agent     |
| 콜백 지옥        | async/await         | quality-agent     |
| 성능 문제        | 최적화 패턴         | performance-agent |

---

## Agent 역할 분담

| 리팩토링 범위  | 권장 Agent                   |
| :------------- | :--------------------------- |
| 단일 함수/파일 | quality-agent                |
| 여러 파일      | quality-agent                |
| 전체 아키텍처  | orchestrator + quality-agent |
| 성능 최적화    | performance-agent            |
| 테스트 검증    | test-agent                   |

---

## Ralph Loop 연동 (대규모 리팩토링)

```
/ralph-loop "
kimchi-invasion/src/를 점진적으로 리팩토링:

1. quality-agent로 현재 파일 분석
2. 개선점 1개 식별
3. 리팩토링 수행
4. npm run test:unit 실행
5. 통과하면 다음 파일
6. 전체 ESLint 에러 0개 + 테스트 통과 시 <promise>REFACTOR_DONE</promise>
" --max-iterations 30 --completion-promise "REFACTOR_DONE"
```

---

## 리팩토링 후 검증

```
리팩토링 완료 후:

1. test-agent로 단위 테스트
   - 기존 테스트 통과 확인
   - 새로운 모듈 테스트 추가

2. Playwright로 E2E 테스트
   - 게임 기능 정상 동작 확인

3. performance-agent로 성능 체크
   - 리팩토링 전후 성능 비교

4. PROGRESS.md 업데이트
   - 리팩토링 완료 기록
```
