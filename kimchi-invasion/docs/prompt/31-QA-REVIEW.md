# 코드 리뷰 프롬프트

> **용도:** 코드 품질 검토
> **사용 시점:** 기능 완료 후, PR 전, 주요 마일스톤 완료 시
> **권장 Agent:** code-reviewer, quality-agent

---

## 프롬프트 - 특정 파일 리뷰 (아래 내용 전체 복사)

```
[파일명]을 코드 리뷰해줘.

검토 항목:
1. 코드 스타일 일관성
2. 잠재적 버그
3. 성능 이슈
4. 보안 취약점
5. 개선 제안

문제 발견 시 수정 코드도 함께 제시해줘.
```

---

## 프롬프트 - code-reviewer 활용 (권장)

```
code-reviewer를 사용해서 최근 작성한 코드를 리뷰해줘.

리뷰 대상:
- kimchi-invasion/src/ 내 오늘 수정한 파일들

검토 항목:
- 코드 품질
- 잠재적 버그
- 성능 이슈
- 보안 취약점

심각한 문제가 있으면 바로 수정해줘.
```

---

## 프롬프트 - quality-agent 활용 (전체 시스템)

```
quality-agent를 사용해서 KIMCHI INVASION 코드베이스를 리뷰해줘.

검토 항목:
1. 아키텍처 일관성
2. 코드 중복
3. 미사용 코드
4. 명명 규칙
5. 문서화 상태

우선순위 높은 문제 3개 찾아서 수정해줘.
```

---

## 프롬프트 - 대규모 리뷰 (orchestrator)

```
orchestrator를 사용해서 Week [N] 코드를 전체 리뷰해줘.

orchestrator가:
1. code-reviewer로 개별 파일 리뷰
2. quality-agent로 아키텍처 검토
3. 문제점 종합 및 우선순위화
4. 심각한 문제 수정
5. test-agent로 회귀 테스트

리뷰 완료 후 보고서 작성해줘.
```

---

## 사용 예시

### 단일 파일 리뷰

```
code-reviewer를 사용해서 다음 파일을 리뷰해줘:

kimchi-invasion/src/systems/buildingSystem.js

검토 항목:
- 코드 품질
- 잠재적 버그
- 성능 이슈
- 보안 취약점

문제 발견 시 수정 코드도 함께 제시해줘.
```

### 여러 파일 리뷰

```
code-reviewer를 사용해서 다음 파일들을 리뷰해줘:

- kimchi-invasion/src/core/pixiApp.js
- kimchi-invasion/src/core/camera.js
- kimchi-invasion/src/core/tilemap.js

검토 항목:
- 코드 품질
- 잠재적 버그
- 성능 이슈
- PixiJS 8 Best Practice 준수

심각한 문제가 있으면 바로 수정해줘.
```

### ECS 프레임워크 리뷰

```
code-reviewer를 사용해서 ECS 프레임워크를 리뷰해줘:

- kimchi-invasion/src/ecs/Entity.js
- kimchi-invasion/src/ecs/System.js
- kimchi-invasion/src/ecs/World.js

검토 항목:
- ECS 패턴 준수
- 확장성
- 성능 (많은 엔티티 처리)
- 메모리 관리

Context7로 ECS Best Practice 확인 후 비교 검토해줘.
```

---

## 리뷰 체크리스트

### 기본 품질

- [ ] 변수/함수 명명이 명확한가
- [ ] 주석이 필요한 곳에 있는가
- [ ] JSDoc 타입 힌트가 있는가
- [ ] 불필요한 console.log가 없는가

### 잠재적 버그

- [ ] null/undefined 체크가 되어 있는가
- [ ] 배열 인덱스 범위 체크가 있는가
- [ ] 이벤트 리스너가 정리되는가
- [ ] 메모리 누수 가능성이 없는가

### 성능

- [ ] 불필요한 렌더링이 없는가
- [ ] 과도한 루프가 없는가
- [ ] 적절한 캐싱이 되어 있는가
- [ ] 오브젝트 풀링이 필요한 곳에 적용되었는가

### 보안

- [ ] 사용자 입력이 검증되는가
- [ ] XSS 취약점이 없는가

---

## Agent 역할 분담

| 리뷰 범위     | 권장 Agent               |
| :------------ | :----------------------- |
| 단일 파일     | code-reviewer            |
| 여러 파일     | code-reviewer            |
| 전체 아키텍처 | quality-agent            |
| 대규모 리뷰   | orchestrator             |
| PixiJS 관련   | code-reviewer + Context7 |
| 성능 관련     | performance-agent        |

---

## 리뷰 결과 활용

```
리뷰 완료 후:

1. 발견된 문제 수정
   - 심각: 즉시 수정
   - 중간: 이번 세션 내 수정
   - 낮음: 다음 세션에 수정

2. test-agent로 회귀 테스트
   - 수정한 코드가 기존 기능을 깨트리지 않는지 확인

3. PROGRESS.md 업데이트
   - 리뷰 결과 기록
   - 남은 문제 TODO로 추가
```
