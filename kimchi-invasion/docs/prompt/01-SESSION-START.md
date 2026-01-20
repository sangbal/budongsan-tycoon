# 세션 시작 프롬프트

> **용도:** 새 세션에서 컨텍스트 복원 + 개발 작업 재개
> **사용 시점:** Claude Code를 새로 시작했을 때
> **권장 Agent:** orchestrator (대규모 작업), gdd-enhancer (기획 확인)

---

## 프롬프트 - 기본 (아래 내용 전체 복사)

```
KIMCHI INVASION 게임 개발을 이어서 진행한다.

먼저 다음 문서들을 순서대로 읽어서 현재 상황을 파악해:
1. kimchi-invasion/docs/_ai-context/PROGRESS.md (현재 진행 상황)
2. kimchi-invasion/docs/00-foundation/development-plan.md (개발 계획서)

문서를 읽은 후:
1. 현재 진행 상황 요약 (완료된 항목, 진행 중인 항목)
2. 바로 시작할 다음 작업 제시
3. 내 확인 후 작업 시작

작업 완료 시마다 PROGRESS.md의 체크리스트를 업데이트해줘.
```

---

## 프롬프트 - orchestrator 활용 (대규모 작업)

```
KIMCHI INVASION 게임 개발을 이어서 진행한다.

orchestrator를 사용해서:
1. PROGRESS.md 체크리스트 분석
2. 남은 작업 목록 파악
3. 작업 의존성 분석
4. 병렬 실행 가능한 작업 식별
5. 작업 계획 수립 및 보고

문서 참조:
- kimchi-invasion/docs/_ai-context/PROGRESS.md
- kimchi-invasion/docs/00-foundation/development-plan.md

계획 수립 후 내 확인을 받아 작업 시작해줘.
```

---

## 프롬프트 - 특정 Phase 시작

```
KIMCHI INVASION Week [N] 개발을 시작한다.

orchestrator를 사용해서:
1. PROGRESS.md에서 Week [N] 체크리스트 확인
2. 작업을 전문 agent에게 분배
   - 코드 구현: quality-agent
   - 테스트: test-agent
   - 성능: performance-agent
3. TodoWrite로 진행 상황 추적
4. 결과 통합

시작해줘.
```

---

## 예상 응답

Claude가 다음을 수행합니다:

1. PROGRESS.md 읽기 → 체크리스트 상태 확인
2. development-plan.md 읽기 → 전체 맥락 파악
3. 현재 상태 보고 + 다음 작업 제안
4. (orchestrator 사용 시) 작업 분해 및 agent 배분 계획
5. 사용자 확인 후 작업 시작

---

## Agent 활용 팁

| 상황                    | 권장 Agent   |
| :---------------------- | :----------- |
| 단순 작업 재개          | 직접 진행    |
| 여러 시스템 동시 개발   | orchestrator |
| GDD 변경 사항 확인 필요 | gdd-enhancer |
| 기술 스택 확인 필요     | Context7 MCP |
