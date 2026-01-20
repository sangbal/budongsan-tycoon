# 다음 작업 진행 프롬프트

> **용도:** 체크리스트 기반으로 다음 작업 자동 진행
> **사용 시점:** 현재 작업 완료 후, 다음 할 일을 모를 때
> **권장 Agent:** orchestrator (여러 작업), quality-agent (코드 작업)

---

## 프롬프트 - 기본 (아래 내용 전체 복사)

```
PROGRESS.md 체크리스트에서 다음으로 해야 할 작업을 진행해줘.

1. 체크리스트에서 미완료 항목 중 첫 번째 찾기
2. 해당 작업 수행
3. 작업 완료 후 체크리스트 업데이트
4. 결과 간단히 보고

바로 시작해.
```

---

## 프롬프트 - orchestrator 활용 (여러 작업)

```
PROGRESS.md 체크리스트 기준으로 다음 3개 작업을 진행해줘.

orchestrator를 사용해서:
1. 미완료 작업 3개 식별
2. 병렬 실행 가능 여부 판단
3. 적절한 전문 agent에게 위임:
   - 코드 구현 → quality-agent
   - 테스트 작성 → test-agent
   - 성능 관련 → performance-agent
4. TodoWrite로 진행 상황 추적
5. 완료 후 PROGRESS.md 업데이트

막히는 부분 없으면 계속 진행하고, 문제 생기면 보고해줘.
```

---

## 프롬프트 - 자동 진행 (Ralph Loop 연동)

```
/ralph-loop "
PROGRESS.md 체크리스트 기준으로 작업 연속 진행:

1. 미완료 항목 확인
2. 구현
3. 테스트 실행 (npm run test:unit)
4. 통과하면 체크리스트 업데이트
5. 다음 항목으로 이동
6. Day 완료 시 <promise>DAY_COMPLETE</promise>

현재 Day: [Day 번호]
" --max-iterations 30 --completion-promise "DAY_COMPLETE"
```

---

## 예상 동작

1. PROGRESS.md 읽기
2. 미완료 체크박스 `[ ]` 찾기
3. 해당 작업 수행
4. 완료 시 `[x]`로 업데이트
5. 다음 작업으로 이동 (연속 진행 시)

---

## Agent 활용 팁

| 작업 유형          | 권장 Agent    |
| :----------------- | :------------ |
| 단일 파일 작업     | 직접 진행     |
| 여러 파일/시스템   | orchestrator  |
| 새 모듈 설계       | quality-agent |
| 테스트 코드 작성   | test-agent    |
| GDD 문서 참조 필요 | gdd-enhancer  |

---

## MCP 활용 팁

| 상황                | MCP          |
| :------------------ | :----------- |
| 라이브러리 API 확인 | Context7     |
| 최신 문서/예제 검색 | brave-search |
| 동작 시각 확인      | Playwright   |
