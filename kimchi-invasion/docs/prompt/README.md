# KIMCHI INVASION - 프롬프트 라이브러리

> **목적:** 바이브 코딩 중 복사-붙여넣기로 사용할 수 있는 최적화된 프롬프트 모음
> **최종 수정:** 2026-01-19
> **사용법:** 상황에 맞는 프롬프트 파일을 열고 내용을 그대로 복사하여 Claude Code에 붙여넣기

---

## 🤖 활용 가능한 Agents & Skills

### Agents (서브에이전트)

| Agent                 | 용도                | 호출 시점                     |
| :-------------------- | :------------------ | :---------------------------- |
| **orchestrator**      | 작업 분해/위임/조율 | 대규모 기능, 멀티 시스템 구현 |
| **game-director**     | 전략/벤치마크 분석  | 게임 디자인 방향성 결정       |
| **gdd-enhancer**      | GDD 문서 고도화     | 기획 문서 작성/수정           |
| **quality-agent**     | 코드 품질/리팩토링  | 코드 개선, 아키텍처 수정      |
| **balance-agent**     | 게임 밸런스 조정    | 수치 밸런싱, 난이도 곡선      |
| **performance-agent** | 성능 최적화         | FPS 개선, 번들 축소           |
| **test-agent**        | 테스트 자동화       | 단위/E2E 테스트 작성          |
| **deploy-agent**      | 배포/모니터링       | CI/CD, Sentry 통합            |
| **design-agent**      | UI/UX 개선          | 모바일 UI, 접근성             |
| **bug-hunter**        | 버그 분석/수정      | 에러 추적, 근본 원인 분석     |
| **code-reviewer**     | 코드 리뷰           | PR 리뷰, 보안 검토            |

### MCP 도구

| MCP              | 용도                 | 프롬프트에서 호출            |
| :--------------- | :------------------- | :--------------------------- |
| **context7**     | 라이브러리 문서 검색 | `Context7을 사용해서...`     |
| **brave-search** | 웹 검색              | `brave-search를 사용해서...` |
| **playwright**   | 브라우저 자동화      | `Playwright로...`            |
| **testsprite**   | AI 자동 테스트       | `TestSprite MCP로...`        |
| **supabase**     | DB 조회/분석         | `Supabase에서...`            |

---

## 📋 프롬프트 목록

### 1. 세션 관리

| 파일                                                   | 상황           | 권장 Agent             |
| :----------------------------------------------------- | :------------- | :--------------------- |
| [01-SESSION-START.md](./01-SESSION-START.md)           | 새 세션 시작   | orchestrator           |
| [02-SESSION-CHECKPOINT.md](./02-SESSION-CHECKPOINT.md) | 작업 중단 전   | -                      |
| [03-SESSION-STATUS.md](./03-SESSION-STATUS.md)         | 현재 상태 확인 | -                      |
| [04-SESSION-END.md](./04-SESSION-END.md)               | 세션 종료      | test-agent, playwright |

### 2. 개발 진행

| 파일                                         | 상황           | 권장 Agent                  |
| :------------------------------------------- | :------------- | :-------------------------- |
| [10-DEV-NEXT.md](./10-DEV-NEXT.md)           | 다음 작업 진행 | orchestrator                |
| [11-DEV-FEATURE.md](./11-DEV-FEATURE.md)     | 특정 기능 구현 | gdd-enhancer, quality-agent |
| [12-DEV-FILE.md](./12-DEV-FILE.md)           | 특정 파일 작업 | quality-agent               |
| [13-DEV-INTEGRATE.md](./13-DEV-INTEGRATE.md) | 통합 작업      | orchestrator, test-agent    |

### 3. 문제 해결

| 파일                                 | 상황      | 권장 Agent                  |
| :----------------------------------- | :-------- | :-------------------------- |
| [20-FIX-ERROR.md](./20-FIX-ERROR.md) | 에러 발생 | bug-hunter                  |
| [21-FIX-BUG.md](./21-FIX-BUG.md)     | 버그 발견 | bug-hunter                  |
| [22-FIX-STUCK.md](./22-FIX-STUCK.md) | 막힘 상황 | game-director, orchestrator |

### 4. 품질 관리

| 파일                                           | 상황        | 권장 Agent                   |
| :--------------------------------------------- | :---------- | :--------------------------- |
| [30-QA-TEST.md](./30-QA-TEST.md)               | 테스트 실행 | test-agent                   |
| [31-QA-REVIEW.md](./31-QA-REVIEW.md)           | 코드 리뷰   | code-reviewer, quality-agent |
| [32-QA-REFACTOR.md](./32-QA-REFACTOR.md)       | 리팩토링    | quality-agent                |
| [33-QA-PERFORMANCE.md](./33-QA-PERFORMANCE.md) | 성능 최적화 | performance-agent            |

### 5. 특수 상황

| 파일                                               | 상황      | 권장 Agent/MCP         |
| :------------------------------------------------- | :-------- | :--------------------- |
| [40-SPECIAL-CHANGE.md](./40-SPECIAL-CHANGE.md)     | 방향 전환 | game-director          |
| [41-SPECIAL-RESEARCH.md](./41-SPECIAL-RESEARCH.md) | 기술 조사 | context7, brave-search |
| [42-SPECIAL-DEPLOY.md](./42-SPECIAL-DEPLOY.md)     | 배포      | deploy-agent           |

### 6. 자동화 (Ralph Wiggum)

| 파일                                   | 상황           | 권장 Agent                |
| :------------------------------------- | :------------- | :------------------------ |
| [50-RALPH-LOOP.md](./50-RALPH-LOOP.md) | 자동 반복 실행 | test-agent, quality-agent |

---

## 🎯 Agent 활용 가이드

### 대규모 작업 → orchestrator 패턴

```
orchestrator를 사용해서 다음 작업을 분해하고 진행해줘:

[큰 목표 설명]

orchestrator가:
1. 작업을 실행 가능한 단위로 분해
2. 적절한 전문 agent에게 위임
3. TodoWrite로 진행 상황 추적
4. 결과 통합 및 보고
```

### 기술 조사 → Context7 + brave-search

```
Context7을 사용해서 [라이브러리명]의 최신 API를 조사하고,
brave-search로 실제 사용 사례와 Best Practice를 찾아줘.
```

### 버그 해결 → bug-hunter + playwright

```
bug-hunter를 사용해서 버그 원인을 분석하고,
Playwright로 수정 후 동작을 시각적으로 확인해줘.
```

### 기획 작업 → gdd-enhancer

```
gdd-enhancer를 사용해서 [시스템] 관련 GDD 문서를 업데이트해줘.
- docs/02-mechanics/game-mechanics.md 참조
- 변경된 내용 반영
```

---

## 🔄 워크플로우 예시

### 기본 개발 사이클

```
1. 새 세션 시작
   └── 01-SESSION-START.md + orchestrator

2. 개발 진행
   ├── 10-DEV-NEXT.md (다음 작업)
   ├── 11-DEV-FEATURE.md + gdd-enhancer (기능 구현)
   └── 41-SPECIAL-RESEARCH.md + context7 (기술 조사)

3. 문제 발생 시
   ├── 20-FIX-ERROR.md + bug-hunter (에러)
   └── 21-FIX-BUG.md + bug-hunter (버그)

4. 품질 체크
   ├── 30-QA-TEST.md + test-agent (테스트)
   └── 31-QA-REVIEW.md + code-reviewer (리뷰)

5. 세션 종료 (필수!)
   └── 04-SESSION-END.md + playwright
```

### Ralph Loop 자동 사용 기준

AI가 다음 상황에서 자동으로 `/ralph-loop` 사용을 고려합니다:

| 상황                                | 자동 사용     | 권장 Agent                  |
| :---------------------------------- | :------------ | :-------------------------- |
| "알아서 해줘", "완료될 때까지" 요청 | ✅ 사용       | orchestrator                |
| ESLint 에러 10개 이상               | ✅ 사용       | quality-agent               |
| 테스트 실패가 3회 이상 반복         | ✅ 사용       | test-agent                  |
| TDD 작업 요청                       | ✅ 사용       | test-agent                  |
| UI/UX 설계, 아키텍처 결정           | ❌ 사용 안 함 | design-agent, game-director |

---

## 📝 프롬프트 수정 가이드

프롬프트에 `[placeholder]` 형식의 부분이 있으면 실제 값으로 교체:

```
[에러 메시지] → 실제 에러 메시지 붙여넣기
[파일명] → 실제 파일 경로
[기능명] → 구현할 기능 이름
[Agent명] → 사용할 Agent 이름
```

예시:

```
# 원본
[Agent명]를 사용해서 [기능명]을 구현해줘.

# 수정 후
quality-agent를 사용해서 ECS 프레임워크를 구현해줘.
```

---

## 🔗 관련 문서

- [진행 상황](../_ai-context/PROGRESS.md)
- [개발 계획서](../00-foundation/development-plan.md)
- [빠른 시작](../_ai-context/QUICK_START.md)
- [Agents 정의](/.claude/agents/)
- [Skills 정의](/.claude/skills/)
