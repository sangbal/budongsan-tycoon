# 에러 수정 프롬프트

> **용도:** 에러 메시지 기반 문제 해결
> **사용 시점:** 콘솔/터미널에 에러가 발생했을 때
> **권장 Agent:** bug-hunter (근본 원인 분석)

---

## 프롬프트 - 기본 (아래 내용 전체 복사)

```
다음 에러를 수정해줘:

[에러 메시지를 여기에 붙여넣기]

1. 에러 원인 분석
2. 관련 파일 확인
3. 수정 코드 적용
4. 수정 후 동작 확인

에러가 해결되면 간단히 원인과 해결 방법 알려줘.
```

---

## 프롬프트 - bug-hunter 활용 (권장)

```
bug-hunter를 사용해서 다음 에러를 분석하고 수정해줘:

[에러 메시지를 여기에 붙여넣기]

bug-hunter가:
1. 스택 트레이스에서 근본 원인 파악
2. 관련 코드 분석
3. 최소한의 변경으로 수정
4. Playwright로 수정 후 동작 확인

수정 완료 후 원인과 해결 방법 요약해줘.
```

---

## 프롬프트 - 복잡한 에러 (orchestrator 연동)

```
다음 에러가 여러 파일에 걸쳐 발생하고 있어:

[에러 메시지들]

orchestrator를 사용해서:
1. bug-hunter로 각 에러 원인 분석
2. 관련 파일들 식별
3. 수정 순서 결정 (의존성 고려)
4. 순차적으로 수정
5. test-agent로 회귀 테스트

완료 후 수정 내역 요약해줘.
```

---

## 사용 예시

### TypeError

```
bug-hunter를 사용해서 다음 에러를 분석하고 수정해줘:

TypeError: Cannot read properties of undefined (reading 'x')
    at Camera.update (camera.js:45)
    at gameLoop (main.js:120)

bug-hunter가:
1. 스택 트레이스에서 근본 원인 파악
2. 관련 코드 분석
3. 최소한의 변경으로 수정
4. Playwright로 수정 후 동작 확인

수정 완료 후 원인과 해결 방법 요약해줘.
```

### Import 에러

```
bug-hunter를 사용해서 다음 에러를 분석하고 수정해줘:

SyntaxError: The requested module './pixiApp.js' does not provide an export named 'app'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:132:21)

bug-hunter가:
1. export/import 구문 분석
2. 관련 모듈 확인
3. 최소한의 변경으로 수정
4. 빌드 테스트

수정 완료 후 원인과 해결 방법 요약해줘.
```

### Vite 빌드 에러

```
bug-hunter를 사용해서 다음 에러를 분석하고 수정해줘:

[vite] Internal server error: Failed to resolve import "pixi.js" from "src/core/pixiApp.js". Does the file exist?

bug-hunter가:
1. 의존성 확인 (package.json)
2. import 경로 확인
3. 필요시 npm install 실행
4. 빌드 테스트

수정 완료 후 원인과 해결 방법 요약해줘.
```

---

## Agent/MCP 활용 가이드

| 에러 유형     | 권장 Agent/MCP                   |
| :------------ | :------------------------------- |
| 런타임 에러   | bug-hunter                       |
| 타입 에러     | bug-hunter                       |
| Import/Export | bug-hunter                       |
| 빌드 에러     | bug-hunter + npm 확인            |
| PixiJS 관련   | bug-hunter + Context7 (API 확인) |
| Zustand 관련  | bug-hunter + Context7            |
| 복잡한 에러   | orchestrator + bug-hunter        |

---

## 에러 유형별 체크리스트

### TypeError / ReferenceError

- [ ] 변수가 정의되었는지 확인
- [ ] null/undefined 체크 추가
- [ ] 초기화 순서 확인

### SyntaxError (Import)

- [ ] export 구문 확인
- [ ] import 경로 확인
- [ ] 순환 참조 확인

### 빌드 에러

- [ ] 의존성 설치 확인 (npm install)
- [ ] 경로 별칭 확인 (vite.config.js)
- [ ] TypeScript 설정 확인

### PixiJS 에러

- [ ] Context7로 PixiJS 8 API 확인
- [ ] 초기화 순서 확인
- [ ] WebGL 컨텍스트 확인

---

## Ralph Loop 연동 (다수 에러)

```
/ralph-loop "
ESLint/TypeScript 에러 자동 수정:

1. npm run lint 실행
2. 에러 목록 확인
3. bug-hunter로 각 에러 수정
4. 다시 lint 실행
5. 에러 0개일 때 <promise>LINT_CLEAN</promise>
" --max-iterations 15 --completion-promise "LINT_CLEAN"
```
