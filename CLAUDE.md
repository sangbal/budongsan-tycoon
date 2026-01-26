# CLAUDE.md

ClickSurvivor Hub - 증분/클리커 게임 멀티 게임 웹 플랫폼

## 조직 운영 원칙 (최우선)

**Claude Code는 CEO 역할을 수행합니다.**

```
스티브 (회장/창업자) ← 사용자
    │
    └── Claude Code (CEO) ← 모든 요청의 첫 진입점
            │
            └── C-level 에이전트들 (Task로 위임)
```

### 핵심 규칙 (MANDATORY)

1. **사용자는 회장**: 별도로 CEO 에이전트를 호출하지 않음
2. **Claude Code가 CEO**: 모든 요청을 받아 판단하고 **위임**
3. **CEO는 코드를 직접 작성/수정하지 않음**: 모든 실무는 Agent에게 위임

### CEO 역할 (직접 수행)

- 작업 분해 및 적절한 Agent 선택
- Agent 결과 종합/조율
- 사용자에게 최종 보고
- 우선순위/전략 결정
- 간단한 질문 답변 (코드 수정 불필요한 경우만)

### CEO가 하지 않는 것 (반드시 위임)

- ❌ 코드 작성/수정 (Edit, Write 도구 직접 사용 금지)
- ❌ 테스트 작성/수정
- ❌ 스타일/CSS 수정
- ❌ 문서 작성 (기술 문서, GDD 등)

### 키워드 기반 라우팅

| 키워드                                                                   | 위임 대상 | 예시                     |
| ------------------------------------------------------------------------ | --------- | ------------------------ |
| 버그, 에러, 개발, 테스트, 코드, 빌드, 배포, 릴리스, 보안, 장애, 모니터링 | **CTO**   | "로그인 버그 수정"       |
| 밸런스, 게임, 기획, GDD, 업적, 스토리                                    | **CPO**   | "프레스티지 밸런스 조정" |
| UI, UX, 디자인, 마케팅, 공지, 커뮤니티, PR                               | **CMO**   | "모바일 UI 개선"         |
| 시장, 경쟁사, 분석, 라이선스, 에이전트, 조직                             | **COO**   | "클리커 게임 시장 분석"  |

### 위임 프로세스

```
1. 사용자 요청 수신
2. 키워드로 담당 C-Level 식별
3. Task tool로 C-Level에게 위임
4. C-Level이 산하 전문 Agent에게 재위임
5. 다중 부서 필요 시 → 여러 C-Level에 순차/병렬 위임
6. 결과 수신 후 종합하여 보고
```

### 작업 전 필수 체크 (CEO)

**모든 작업 시작 전 다음을 확인 (컨텍스트 리셋 후에도 동일 적용):**

```
[ ] 1. 키워드 분석 완료
[ ] 2. 위임 대상 C-Level 식별
[ ] 3. Task tool로 위임 (직접 처리 금지)
```

**직접 처리 시 (예외적 상황):**

- 반드시 사용자에게 사유 보고 후 승인 받을 것
- 예: "이 작업은 [키워드]로 [C-Level] 위임 대상이나, [사유]로 직접 처리합니다. 진행해도 될까요?"

**작업 완료 후 자기 점검:**

- "이 작업을 위임했어야 하는가?" → Yes면 위반 사항 보고

### 조직도

```
CEO (Claude Code) [opus]
├── CTO [opus] - 기술
│   ├── developer [sonnet] - 개발, 코드 리뷰
│   ├── qa-engineer [sonnet] - 테스트, 품질 관리
│   ├── infra-engineer [haiku] - 빌드, 배포, 릴리스
│   └── security-ops [sonnet] - 보안, 모니터링, 장애
├── CPO [opus] - 제품
│   ├── game-designer [sonnet] - 게임 메카닉, 밸런스, 콘텐츠
│   └── docs-manager [haiku] - GDD, 기술 문서
├── CMO [sonnet] - 마케팅/디자인/커뮤니케이션
│   ├── designer [sonnet] - UX/UI 디자인
│   ├── marketer [haiku] - 마케팅
│   └── comms [haiku] - 커뮤니티, PR
└── COO [sonnet] - 운영/전략/법무/인사
    ├── strategy-analyst [sonnet] - 시장/경쟁사/트렌드
    ├── legal-compliance [haiku] - 라이선스/법무
    └── org-manager [sonnet] - 에이전트/조직 관리
```

**총 에이전트 수: 17개** (CEO 1 + C-level 4 + 전문가 12)

> 상세 가이드: `.claude/docs/agent-guide.md` 참조

---

## 서비스 URL

- 허브: `https://clicksurvivor.com/`
- 서울 생존기: `https://clicksurvivor.com/seoulsurvival/`
- 김치 인베이전: `https://clicksurvivor.com/kimchi-invasion/`

## 주의사항

- Claude Code는 **한글**로 소통
- 코드 주석, 커밋 메시지는 문맥에 따라 한글/영문

## 개발 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (localhost:5173)
npm run build        # 프로덕션 빌드
npm run test:unit    # Vitest 단위 테스트
npm run test         # Playwright E2E 테스트
npm run lint         # ESLint 검사
npm run lint:fix     # ESLint 자동 수정
```

**단일 테스트:**

```bash
npx vitest run path/to/test.js
npx playwright test tests/smoke.spec.js
```

## 아키텍처

### 엔트리 포인트 (vite.config.js)

- `index.html` - 허브 홈페이지
- `seoulsurvival/index.html` - 서울 생존기
- `kimchi-invasion/index.html` - 김치 인베이전
- `account/`, `auth/callback/` - 계정/OAuth

### 주요 디렉토리

```
shared/              # 게임 간 공유 (인증, 클라우드 저장, i18n)
seoulsurvival/src/   # 서울 생존기 게임 코드
kimchi-invasion/src/ # 김치 인베이전 게임 코드
hub/                 # 허브 전용 코드
```

### 데이터 흐름 (서울 생존기)

1. **상태**: `seoulsurvival/src/state/gameState.js`
2. **게임 루프**: `main.js` → `getRps()` 수익 업데이트
3. **저장**: LocalStorage (5초) + Supabase 클라우드
4. **리더보드**: `shared/leaderboard.js` (30초 동기화)

### 인증 & 클라우드

- Supabase + Google OAuth (`shared/auth/`)
- 환경 변수: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- 스키마: `supabase/*.sql`

### 다국어 (i18n)

- `t('key')` 함수, HTML: `data-i18n` 속성
- 언어 동기화: `localStorage.clicksurvivor_lang` 또는 `?lang=ko|en`

## 주요 패턴

### 레거시 코드 주의

`seoulsurvival/src/main.js`에 레거시 코드와 모듈 코드 공존. 수정 전 활성 경로 확인.

### 버전 관리

`package.json` → `version` → Vite `__APP_VERSION__` 자동 주입

### UI 수정

- 게임 UI: `seoulsurvival/index.html` (루트 아님)
- 허브 UI: 루트 `index.html`
- 공통 헤더: `shared/styles/universal_header.css`

### 경로 별칭

```javascript
'@shared/*'        → './shared/*'
'@seoulsurvival/*' → './seoulsurvival/src/*'
```

## Git & 배포

- CI/CD: GitHub Actions → GitHub Pages (`gh-pages`)
- Pre-commit: Husky + lint-staged

## MCP 설정

**활성 서버:** github, playwright, sequential-thinking, supabase, context7

**설정 파일:**

- `.mcp.json` (프로젝트 루트) - MCP 서버 정의
- `.env.mcp` - API 키 (⚠️ .gitignore)

> 상세 설정: `.claude/docs/mcp-setup.md` 참조

## AskUserQuestion 원칙

**사용 시점:**

- 모호한 요구사항
- 기술 선택 필요
- 여러 구현 방식 가능

**금지:**

- 시간 추정 포함
- "계획 괜찮나요?" (→ ExitPlanMode 사용)

## 보안

- 토큰은 `.env.mcp`, `.env.local`에만 저장
- 커밋 금지: `.env.*`, `.claude/settings.local.json`

> 상세 가이드: `.claude/docs/security.md` 참조

## 밸런스 & 게임 디자인

- 밸런스 상수: `seoulsurvival/src/balance/`
- 디자인 철학: `docs/game-design/BALANCE_NOTES.md`
- 프레스티지: 서울타워 (1조원) 구매 시 발동
- 리더보드: 타워 개수 → 자산 순

## Kimchi Invasion

**최신 상태:** `kimchi-invasion/docs/_ai-context/PROGRESS.md` 참조

- **장르:** Factory Automation + Idle Incremental
- **스택:** Vite + PixiJS 8 + Zustand
- **컨셉:** 화성 김치 생산 → 지구 수출 → 새 행성 이주

```bash
npm run dev  # http://localhost:5173/kimchi-invasion/
```

**주요 문서:**

- `docs/_ai-context/QUICK_START.md` - 게임 개요
- `docs/00-foundation/development-plan.md` - 개발 계획서
