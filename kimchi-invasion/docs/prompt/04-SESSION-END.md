# 세션 종료 프롬프트

> **용도:** 개발 세션 종료 시
> **사용 시점:** 작업 마무리 후
> **권장 Agent:** test-agent (테스트), Playwright MCP (검증)

---

## 프롬프트 - 기본 (아래 내용 전체 복사)

```
개발 세션을 마무리한다.

1. **Playwright 테스트 실행**
   - `npx playwright test tests/kimchi-invasion-smoke.spec.js --reporter=list`
   - 실패 시 bug-hunter로 즉시 수정

2. **PROGRESS.md 업데이트**
   - 완료된 작업 체크
   - 다음 작업 명시
   - 작업 로그에 오늘 완료 내용 추가

3. **코드 품질 확인**
   - `npm run lint` 실행
   - 에러 있으면 수정
   - `npm run format` 실행

4. **최종 확인**
   - Playwright로 게임 정상 동작 확인
   - 콘솔 에러 없음 확인

테스트 통과 후 결과 요약해줘.
```

---

## 프롬프트 - Agent 활용 (권장)

```
개발 세션을 마무리한다.

orchestrator를 사용해서:
1. test-agent로 단위 테스트 실행
2. Playwright로 E2E 스모크 테스트
3. quality-agent로 ESLint/Prettier 확인
4. PROGRESS.md 업데이트

실패하는 테스트가 있으면 bug-hunter로 수정.

완료 후 세션 요약 작성해줘.
```

---

## 프롬프트 - 빠른 종료 (테스트만)

```
Playwright 스모크 테스트만 실행해줘:

npx playwright test tests/kimchi-invasion-smoke.spec.js --reporter=list

통과하면 PROGRESS.md 업데이트하고 세션 종료.
실패하면 bug-hunter로 수정 후 재실행.
```

---

## AI 자동 실행 항목

세션 종료 시 AI가 자동으로 실행해야 할 체크리스트:

### 필수 (항상 실행)

| 항목                    | Agent/MCP      | 실패 시           |
| :---------------------- | :------------- | :---------------- |
| Playwright smoke 테스트 | Playwright MCP | bug-hunter로 수정 |
| PROGRESS.md 업데이트    | 직접           | -                 |
| ESLint 검사             | quality-agent  | 자동 수정         |
| Prettier 포맷팅         | 직접           | -                 |

### 권장 (시간 있을 때)

| 항목        | Agent/MCP              |
| :---------- | :--------------------- |
| 단위 테스트 | test-agent             |
| 빌드 테스트 | 직접 (`npm run build`) |

---

## 자동 테스트 명령어

```bash
# 필수 테스트
npx playwright test tests/kimchi-invasion-smoke.spec.js --reporter=list

# 코드 품질
npm run lint
npm run format

# 전체 테스트 (시간 있을 때)
npm run test:unit && npm run test
```

---

## 세션 종료 체크리스트

작업 마무리 전 확인:

### 1. 코드 상태

- [ ] 모든 변경사항 저장됨
- [ ] ESLint 에러 없음
- [ ] 포맷팅 완료

### 2. 테스트 상태

- [ ] Playwright smoke 테스트 통과
- [ ] 게임 로딩 정상
- [ ] 콘솔 에러 없음

### 3. 문서 상태

- [ ] PROGRESS.md 최신 상태
- [ ] 다음 작업 명확히 기록됨

---

## 세션 요약 템플릿

```markdown
## 세션 요약 (YYYY-MM-DD)

### 완료된 작업

- [작업 1]
- [작업 2]

### 테스트 결과

- Playwright: ✅ 통과 (X passed)
- ESLint: ✅ 에러 없음

### 다음 세션 작업

- [다음 작업 1]
- [다음 작업 2]

### 특이사항

- [있으면 기록]
```

---

## Agent 역할 분담

| 단계             | Agent/MCP      |
| :--------------- | :------------- |
| E2E 테스트       | Playwright MCP |
| 단위 테스트      | test-agent     |
| 테스트 실패 수정 | bug-hunter     |
| 코드 품질 검사   | quality-agent  |
| 문서 업데이트    | 직접           |

---

## Ralph Loop 연동 (자동 완료)

```
/ralph-loop "
세션 종료 자동화:

1. npx playwright test tests/kimchi-invasion-smoke.spec.js
2. 실패하면 bug-hunter로 수정
3. npm run lint 실행
4. 에러 있으면 수정
5. npm run format 실행
6. PROGRESS.md 업데이트
7. 모든 테스트 통과 시 <promise>SESSION_COMPLETE</promise>
" --max-iterations 10 --completion-promise "SESSION_COMPLETE"
```
