# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

ClickSurvivor Hub는 증분/클리커 게임을 호스팅하는 멀티 게임 웹 플랫폼입니다. 메인 게임은 "서울 생존기"로, 직급 승진, 투자, 프레스티지 시스템을 갖춘 증분 게임입니다.

**서비스 URL:**

- 허브: `https://clicksurvivor.com/`
- 서울 생존기: `https://clicksurvivor.com/seoulsurvival/`

## 주의사항

**언어 설정:**

- Claude Code는 **한글**로 소통하세요.
- 코드 주석, 커밋 메시지, 문서 등은 문맥에 따라 한글 또는 영문을 사용합니다.

## 개발 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:5173)
npm run build        # 프로덕션 빌드 (dist/)
npm run preview      # 빌드 프리뷰 (http://localhost:4173)

# 테스트
npm run test         # Playwright E2E 테스트 (빌드 필요)
npm run test:unit    # Vitest 단위 테스트
npm run test:unit:ui # Vitest UI 모드
npm run test:all     # 단위 + E2E 테스트

# 코드 품질
npm run lint         # ESLint 검사
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier 포맷팅
npm run type-check   # TypeScript 타입 검사
```

**단일 테스트 실행:**

```bash
npx vitest run path/to/test.js              # 단일 단위 테스트
npx playwright test tests/smoke.spec.js     # 단일 E2E 테스트
```

## 아키텍처

### 멀티페이지 Vite 빌드

`vite.config.js` → `rollupOptions.input`에 정의된 엔트리 포인트:

- `index.html` - 허브 홈페이지
- `seoulsurvival/index.html` - 서울 생존기 게임
- `kimchi-invasion/index.html` - 김치 인베이전 게임
- `account/` - 계정 관리 페이지
- `auth/callback/` - OAuth 콜백 핸들러
- `terms.html`, `privacy.html` - 법적 문서

### 주요 디렉토리

```
shared/              # 게임 간 공유 코드
├── auth/           # Supabase 인증 (Google OAuth)
├── shell/          # 공통 헤더/푸터 컴포넌트
├── i18n/           # 허브 다국어 번역
├── cloudSave.js    # Supabase 클라우드 저장
└── leaderboard.js  # 리더보드 + 닉네임 시스템

seoulsurvival/
├── src/
│   ├── main.js     # 게임 루프, 상태, 업그레이드 (대용량 파일)
│   ├── state/gameState.js  # 중앙 집중식 게임 상태
│   ├── balance/    # 게임 밸런스 상수
│   ├── systems/    # 시장, 업적, 업그레이드 모듈
│   ├── ui/         # UI 모듈 (statsTab, modal, animations)
│   ├── i18n/       # 게임 전용 번역 (ko/en)
│   └── economy/pricing.js  # 가격 계산
└── assets/images/  # 게임 이미지 (허브에서도 사용)

hub/                # 허브 전용 코드
├── main.js        # 허브 엔트리
├── home.js        # 홈페이지 게임 렌더링
└── games.registry.js  # 게임 카탈로그 (단일 소스)

kimchi-invasion/    # 김치 인베이전 게임
├── index.html     # Vite 진입점
├── styles.css     # 게임 스타일시트
├── src/
│   ├── main.js    # 게임 초기화, 게임 루프
│   ├── core/      # 렌더러, 입력 처리
│   ├── state/     # 게임 상태 관리
│   ├── systems/   # 게임 시스템 (생산, 물류, 발효)
│   ├── ui/        # UI 컴포넌트
│   ├── data/      # 게임 데이터 (건물, 연구 등)
│   ├── i18n/      # 다국어 번역 (ko/en)
│   ├── balance/   # 밸런스 상수
│   ├── persist/   # 저장/불러오기
│   └── assets/    # 이미지, 사운드
└── docs/          # GDD 문서 (13개 파일)
```

### 데이터 흐름 (서울 생존기)

1. **상태**: `seoulsurvival/src/state/gameState.js`에서 모든 게임 변수 관리
2. **게임 루프**: `main.js`에서 틱 루프 실행, `getRps()` 수익 업데이트
3. **저장**: LocalStorage (5초 자동 저장) + Supabase 클라우드 (탭 숨김/닫기 시)
4. **리더보드**: `shared/leaderboard.js`에서 30초마다 Supabase 동기화

### 인증 & 클라우드 시스템

- **인증**: `shared/auth/`를 통한 Supabase + Google OAuth
- **저장 키**: `clicksurvivor-auth` (허브/게임 간 공유)
- **설정**: 환경 변수 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Supabase 테이블**: 스키마는 `supabase/*.sql` 참조

### 다국어(i18n)

- 허브: `shared/i18n/` + `hub/translations/`
- 게임: `seoulsurvival/src/i18n/`
- 언어 동기화: `localStorage.clicksurvivor_lang` 또는 `?lang=ko|en`
- 번역: `t('key')` 함수, 정적 HTML은 `data-i18n` 속성 사용

## 주요 패턴

### 레거시 코드 주의

`seoulsurvival/src/main.js`에 레거시 통계/UI 함수와 `src/ui/` 모듈 코드가 공존합니다. 수정 전 어느 코드 경로가 활성화되어 있는지 반드시 확인하세요.

### 버전 관리

- 단일 소스: `package.json` → `version`
- Vite를 통해 `__APP_VERSION__`으로 자동 주입
- 게임 설정 탭에서 버전 표시

### UI 수정

- 게임 UI: `seoulsurvival/index.html` 수정 (루트 `index.html` 아님)
- 허브 UI: 루트 `index.html` 수정
- 공통 헤더: `shared/styles/universal_header.css`

### 경로 별칭

```javascript
// tsconfig.json / vitest.config.js
'@shared/*'       → './shared/*'
'@seoulsurvival/*' → './seoulsurvival/src/*'
```

## Git & 배포

- **CI/CD**: GitHub Actions에서 `main` 브랜치를 GitHub Pages로 배포 (`gh-pages` 브랜치)
- **Pre-commit**: Husky + lint-staged로 ESLint/Prettier 실행
- **수동 배포**: `deploy.bat` 또는 `deploy.ps1`

## MCP (Model Context Protocol) 설정

Claude Code가 Supabase, Brave Search, 브라우저 자동화 등을 연동하기 위해 MCP 서버를 사용합니다.

### MCP 파일 구조 (MECE 관리)

```
프로젝트 루트:
├── .mcp.json                # ✅ MCP 서버 정의 (Project scope, 커밋 가능)
├── .mcp/                    # ✅ MCP 헬퍼 스크립트 (커밋 가능)
│   ├── load-env-and-run.ps1 # .env.mcp 자동 로더
│   └── README.md            # 스크립트 사용 가이드
├── .env.mcp.example         # MCP 환경변수 템플릿 (커밋 가능)
├── .env.mcp                 # 실제 MCP 토큰 ⚠️ .gitignore 등록
├── .env.local               # 개발 환경 변수 ⚠️ .gitignore 등록
└── .gitignore               # 보안 파일 지정

.claude/
├── settings.json            # 글로벌 도구 권한 (커밋 가능)
├── settings.local.json      # 로컬 도구 권한 ⚠️ 절대 커밋 금지
├── agents/
│   └── code-reviewer.md     # 코드 리뷰어 서브에이전트
└── skills/
    └── subagent-creator/    # 서브에이전트 생성 템플릿
```

⚠️ **중요:** MCP 설정 파일은 반드시 **프로젝트 루트의 `.mcp.json`**에 위치해야 합니다.
`.claude/mcp.json`은 유효하지 않은 위치입니다!

**MCP 설정 Scope 체계:**

```
1. User scope:    ~/.claude.json       → `claude mcp list`에 표시됨
2. Local scope:   ~/.claude.json       → `claude mcp list`에 표시됨
3. Project scope: .mcp.json (루트)     → 표시 안 됨, 하지만 작동함 ✅
   ❌ .claude/mcp.json                 → 유효하지 않음!
```

### 활성화된 MCP 서버

| 서버                    | 용도                         | 상태      |
| ----------------------- | ---------------------------- | --------- |
| **supabase**            | 데이터베이스, 인증, 스토리지 | ✅ OAuth  |
| **brave-search**        | 웹 검색 (최신 문서)          | ✅ API 키 |
| **filesystem**          | 로컬 파일시스템              | ✅ 활성   |
| **context7**            | 라이브러리 문서 검색         | ✅ 활성   |
| **sequential-thinking** | 단계별 추론                  | ✅ 활성   |
| **playwright**          | 브라우저 자동화              | ✅ 활성   |
| **github**              | GitHub 저장소, 이슈, PR      | ✅ API 키 |
| **sentry**              | 에러 모니터링                | ✅ OAuth  |
| **testsprite**          | AI 코드 자동 테스트/디버깅   | ✅ API 키 |

### 환경 변수 설정

**`.env.mcp` 구성:**

```bash
# GitHub MCP
GITHUB_TOKEN=ghp_...  # https://github.com/settings/tokens
                      # 필요 권한: repo, workflow, read:org

# Supabase MCP
SUPABASE_URL=https://nvxdwacqmiofpennukeo.supabase.co
SUPABASE_SERVICE_KEY=eyJ...  # DB 접근 권한

# Brave Search MCP
BRAVE_API_KEY=BSA...  # https://brave.com/search/api/

# TestSprite MCP
TESTSPRITE_API_KEY=ts_...  # https://www.testsprite.com/dashboard
                           # 자동 테스트, 디버깅, 코드 수정
```

**`.env.local` 구성 (개발용):**

```bash
# Supabase 공개 키 (클라이언트)
VITE_SUPABASE_URL=https://nvxdwacqmiofpennukeo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**⚠️ 중요: 따옴표 사용 금지**

`.env.mcp` 파일에 값을 입력할 때 따옴표를 사용하지 마세요:

```bash
# ✅ 올바른 형식
BRAVE_API_KEY=BSAzv4lHYoYloVS3tUhcQ1CXUrLDIi5

# ❌ 잘못된 형식 (따옴표 포함)
BRAVE_API_KEY="BSAzv4lHYoYloVS3tUhcQ1CXUrLDIi5"
```

### 환경 변수 자동 로드

`.mcp.json`은 PowerShell 스크립트 `.mcp/load-env-and-run.ps1`을 사용하여 `.env.mcp` 파일에서 환경 변수를 자동으로 로드합니다.

**동작 방식:**

1. MCP 서버 시작 시 `.mcp/load-env-and-run.ps1` 실행
2. 스크립트가 `.env.mcp` 파일을 읽어서 환경 변수 설정
3. 실제 MCP 서버 프로세스 시작

**수동 테스트:**

```powershell
# 환경 변수 로드 테스트
powershell -ExecutionPolicy Bypass -File .mcp/load-env-and-run.ps1 cmd /c 'echo BRAVE_API_KEY=%BRAVE_API_KEY%'

# 출력 예시: BRAVE_API_KEY=BSAzv4lHYoYloVS3tUhcQ1CXUrLDIi5
```

**문제 해결:**

MCP 서버가 환경 변수를 찾지 못하는 경우:

1. `.env.mcp` 파일이 프로젝트 루트에 있는지 확인
2. 값에 따옴표가 없는지 확인
3. Claude Code를 완전히 종료 후 재시작
4. 스크립트 테스트: `powershell -ExecutionPolicy Bypass -File .mcp/load-env-and-run.ps1 cmd /c echo %BRAVE_API_KEY%`

### 보안 관리 체계

⚠️ **절대 금지:**

| 항목                               | 위험성    | 영향                   |
| ---------------------------------- | --------- | ---------------------- |
| 토큰을 소스 코드에 포함            | 🔴 극높음 | 계정 해킹, 리소스 악용 |
| `.env.local` 커밋                  | 🔴 극높음 | 모든 환경변수 노출     |
| `.claude/settings.local.json` 커밋 | 🔴 높음   | 로컬 설정 유출         |
| 커밋 메시지에 토큰 포함            | 🔴 높음   | 히스토리 영구 노출     |

✅ **올바른 방법:**

```bash
# 1. .env.local, .env.mcp에 토큰 저장 (git 제외)
echo ".env.local" >> .gitignore
echo ".env.mcp" >> .gitignore
echo ".claude/settings.local.json" >> .gitignore

# 2. 파워셸에서 환경변수 설정 (로컬 세션용)
$env:GITHUB_TOKEN="ghp_..."
$env:SUPABASE_SERVICE_KEY="eyJ..."
$env:BRAVE_API_KEY="BSA..."
$env:TESTSPRITE_API_KEY="ts_..."

# 3. Claude Code MCP 상태 확인
claude mcp list
```

### 토큰 유출 대응

토큰이 실수로 노출된 경우:

```bash
# 1. 즉시 토큰 무효화
# Supabase: https://app.supabase.com > Settings > API Keys > Rotate
# Brave: https://brave.com/search/api/ > Revoke API Key
# GitHub: https://github.com/settings/personal-access-tokens > Delete
# TestSprite: https://www.testsprite.com/dashboard > Settings > API Keys > Delete

# 2. 새 토큰 발급 및 .env.mcp/.env.local 업데이트

# 3. git 히스토리 확인
git log --all -- .env.local .env.mcp
git log --all -- .claude/settings.local.json

# 4. 커밋 메시지 검색 (토큰 유출)
git log --all --grep="ghp_\|eyJ" || echo "히스토리 안전"
```

### MCP 명령어

```bash
# MCP 서버 목록 및 상태 확인 (User/Local scope만)
claude mcp list

# 세션 내 모든 MCP 확인 (Project scope 포함)
/mcp

# GitHub MCP (현재 활성화됨)
# 토큰: .env.mcp의 GITHUB_TOKEN
# 설정: .mcp.json의 github 항목

# MCP 제거
# .mcp.json에서 해당 서버 설정 삭제
```

### `claude mcp list` 표시 규칙

**`claude mcp list`에 표시되는 조건:**

| Scope       | 설정 파일 위치                  | 표시 여부                         |
| ----------- | ------------------------------- | --------------------------------- |
| User        | `~/.claude.json`                | ✅ 표시됨                         |
| Local       | `~/.claude.json` (프로젝트별)   | ✅ 표시됨                         |
| **Project** | **`.mcp.json` (프로젝트 루트)** | ❌ **표시 안 됨** (하지만 작동함) |

**핵심:**

- `claude mcp list`는 **User/Local scope만 표시**
- Project scope (`.mcp.json`)의 MCP는 **표시되지 않지만 정상 작동**
- 세션 내 `/mcp` 명령으로 전체 MCP 확인 가능

**MCP 작동 확인:**

```bash
# 명령줄에서 (User/Local scope만 표시)
claude mcp list

# Claude Code 세션 내에서 (모든 MCP 표시)
/mcp

# Project scope MCP가 작동하는지 확인:
# - brave-search: 웹 검색 기능 사용
# - context7: 라이브러리 문서 검색
# - sequential-thinking: 단계별 추론
# - playwright: 브라우저 자동화
# → 실제 기능 사용 시 작동하면 정상
```

## Ralph Wiggum 플러그인 (자동 반복 루프)

### 개요

Ralph Wiggum은 **자동 반복 실행 플러그인**입니다. Claude가 작업을 완료할 때까지 동일한 프롬프트를 자동으로 반복 실행합니다.

**설치 위치:** `.claude/plugins/ralph-wiggum/`

### 사용법

```bash
# 자동 반복 루프 시작
/ralph-loop "작업 설명" --max-iterations N --completion-promise "완료_신호"

# 루프 취소
/cancel-ralph
```

### 적합한 작업 (자동으로 사용 권장)

| 작업 유형                | max-iterations | 사용 시점                 |
| :----------------------- | :------------- | :------------------------ |
| **ESLint 에러 수정**     | 10-15          | 린트 에러가 많을 때       |
| **TDD 구현**             | 30-50          | 테스트 통과까지 자동 반복 |
| **리팩토링**             | 20-40          | 대규모 코드 개선          |
| **테스트 커버리지 달성** | 20-30          | 목표 커버리지까지         |

### 프롬프트 예시

```bash
# ESLint 자동 수정
/ralph-loop "
npm run lint 실행 후 에러 수정.
에러 0개일 때 <promise>LINT_CLEAN</promise>
" --max-iterations 15 --completion-promise "LINT_CLEAN"

# TDD 자동화
/ralph-loop "
TDD로 구현:
1. 실패하는 테스트 작성
2. 최소 코드로 구현
3. npm run test:unit
4. 실패하면 수정
5. 모든 테스트 통과 시 <promise>TDD_DONE</promise>
" --max-iterations 30 --completion-promise "TDD_DONE"
```

### ⚠️ 필수 규칙

1. **항상 `--max-iterations` 설정** (무한 루프 방지)
2. **명확한 완료 조건** (테스트 통과, 에러 0개 등)
3. **주관적 작업 금지** (UI 설계, 아키텍처 결정 등)

### AI 자동 사용 기준

다음 상황에서 AI가 자동으로 Ralph Loop 사용을 고려:

- 사용자가 "알아서 해줘", "완료될 때까지" 요청 시
- ESLint 에러가 10개 이상일 때
- 테스트 실패가 반복될 때
- 대규모 리팩토링 작업 시

**상세 가이드:** `kimchi-invasion/docs/prompt/50-RALPH-LOOP.md`

## Claude Code 기본 성향 & AskUserQuestion

### AskUserQuestion 사용 원칙

Claude Code는 **모호함이나 선택지가 있을 때 먼저 사용자에게 물어봅니다.** 코드를 먼저 쓰고 나중에 수정하는 대신, 계획 단계에서 사용자의 의견을 수렴합니다.

### 언제 AskUserQuestion을 사용할지

✅ **반드시 사용해야 할 때:**

1. **모호한 요구사항**
   - 사용자: "이 함수를 최적화해줘"
   - 나: 최적화 목표 3가지를 제시하고 선택 요청

2. **상충하는 우선순위**
   - 빠른 구현 vs 깔끔한 코드
   - 기능 확장 vs 코드 품질
   - 사용자에게 선택 요청

3. **기술 선택**
   - 어떤 라이브러리를 쓸까?
   - 어떤 패턴을 적용할까?
   - 사용자에게 옵션 제시

4. **여러 구현 방식이 가능할 때**
   - 리팩토링 방식 (전체 vs 점진적)
   - 파일 구조 설계
   - 사용자에게 확인

❌ **하지 말아야 할 때:**

- 시간 추정 포함 ("2주일 걸려요")
- "이 계획 괜찮나요?" 형태 (→ ExitPlanMode 사용)
- 너무 많은 선택지 (2-4개가 적당)
- 기술 진실에 대한 질문 (명확히 알면 제시)

### 사용 패턴

```javascript
// 1단계: 문제 상황 분석
// 사용자 요청: "이 코드를 개선해줘"
// → 여러 개선 방식이 가능함을 파악

// 2단계: AskUserQuestion으로 선택 요청
AskUserQuestion({
  questions: [
    {
      question: '어떤 방식을 선호하시나요?',
      header: '전략',
      options: [
        { label: '옵션 A', description: '장점/단점' },
        { label: '옵션 B (Recommended)', description: '장점/단점' },
      ],
    },
  ],
})

// 3단계: 사용자 답변 받음
// 사용자 선택: "옵션 B"

// 4단계: 선택에 따라 구현
// 옵션 B에 맞춰 코드 작성 시작
```

### 예시

**좋은 예:**

```
사용자: "main.js를 모듈화해줘"
나: 여러 리팩토링 방식을 분석한 후
  "리팩토링 방식을 어떻게 할까요?"
  - 전체 재구성 (빠르지만 위험)
  - 점진적 분리 (느리지만 안전)
  사용자에게 물어봄 → 답변 후 구현
```

**나쁜 예:**

```
사용자: "main.js를 모듈화해줘"
나: (바로 코드를 쓰기 시작)
  → 사용자가 원하는 방식이 아니었음 → 시간 낭비
```

## 밸런스 & 게임 디자인

주요 밸런스 파일:

- `docs/game-design/BALANCE_NOTES.md` - 디자인 철학
- `seoulsurvival/src/balance/` - 직급, 가격, 업그레이드 상수

프레스티지 시스템:

- 서울타워 (1조원) 구매 시 프레스티지 발동
- `towers_run`은 초기화, `towers_lifetime`은 유지
- 리더보드 순위: 타워 개수 우선 → 자산 순

## Kimchi Invasion 게임

### 🚀 개발 현황 (2026-01-19 시작)

> **⚠️ 새 세션 시작 시 반드시 읽을 문서:**
>
> 1. `kimchi-invasion/docs/_ai-context/PROGRESS.md` - 현재 진행 상황
> 2. `kimchi-invasion/docs/00-foundation/development-plan.md` - 개발 계획서

**현재 상태:**

- **Phase:** Week 1 - 기술 기반 구축
- **진행률:** 체크리스트 확인 → `docs/_ai-context/PROGRESS.md`

**확정된 기술 스택:**
| 항목 | 결정 |
|:-----|:-----|
| 렌더링 | PixiJS 8.x |
| 상태관리 | Zustand 4.x |
| 언어 | JavaScript + JSDoc |
| 아키텍처 | ECS-Lite 패턴 |
| 플랫폼 | 데스크톱 우선 |

**MVP 범위:** M1 (수동 단계) + M2 (자동 채집)

### 게임 개요

**KIMCHI INVASION: The Red Planet Protocol**은 화성에서 김치를 재배하고 지구로 수출하는 SF 팩토리 시뮬레이션 게임입니다.

- **장르**: Factory Automation + Idle Incremental
- **기술 스택**: Vite + PixiJS 8 + Zustand
- **URL**: `https://clicksurvivor.com/kimchi-invasion/`

### 핵심 컨셉

1. **배경**: 화성 이주 초기, 대원들의 면역력을 위해 김치 자체 생산 시스템 구축
2. **목표**: 화성에서 김치 생산 → 지구로 역수출 → 자본($) 축적 → 새 행성으로 이주
3. **프레스티지**: 우주선 구매 시 새 행성으로 이주 (Loadout 시스템으로 기술만 선택 가능)

### 설계 철학

- **Low Floor, High Ceiling**: 유치원생도 색깔/아이콘으로 시작 가능, 베테랑은 자동화/최적화 추구
- **Hard SF 기반**: 과학적 논리와 무게감 (물 전기분해 → 산소/수소, 발효 온도 관리 등)
- **내러티브 중심**: 일지, 이벤트, 스토리 진행으로 몰입감 제공
- **팩토리 게임 참조**: Factorio, Shapez, Two Point Hospital 등에서 영감

### GDD 문서 구조

`kimchi-invasion/docs/` 폴더에 13개 폴더 + 50개 문서로 체계화:

```
kimchi-invasion/docs/
├── README.md                    # 메인 인덱스
├── _ai-context/                 # 🤖 AI 컨텍스트용
│   ├── QUICK_START.md          # 핵심 요약 (AI 첫 참조용)
│   ├── GLOSSARY.md             # 용어집
│   └── PROGRESS.md             # ⭐ 개발 진행 상황
├── 00-foundation/               # 기초 문서
│   ├── mvp-definition.md       # MVP 범위
│   ├── tech-validation.md      # 기술 검증
│   └── development-plan.md     # ⭐ 개발 계획서
├── 01-concept/                  # 핵심 컨셉
├── 02-mechanics/                # 게임 메카닉
├── 03-visual-ux/                # 비주얼/UX (8개 모듈)
├── 04-progression/              # 진행 시스템 (6개 모듈)
├── 05-onboarding/               # 온보딩
├── 06-threats/                  # 위협 시스템
├── 07-balance/                  # 밸런스
├── 08-achievements/             # 업적
├── 09-technical/                # 기술 사양 (11개 모듈)
├── 10-audio/                    # 오디오 (6개 모듈)
├── 11-localization/             # 현지화 (6개 모듈)
└── 12-marketing/                # 마케팅
```

**AI 컨텍스트 활용:**

- 새 세션 시작 → `_ai-context/PROGRESS.md` 먼저 읽기
- 게임 개요 필요 → `_ai-context/QUICK_START.md`
- 특정 주제 → 해당 폴더의 `_index.md`

### 개발 가이드

**로컬 개발:**

```bash
npm run dev                    # http://localhost:5173/kimchi-invasion/
```

**주요 진입점:**

- `kimchi-invasion/src/main.js` - 게임 초기화 및 루프
- `kimchi-invasion/src/state/gameState.js` - 상태 관리
- `kimchi-invasion/src/i18n/index.js` - 다국어 지원

**데이터 흐름:**

1. `initGame()` → 로딩 화면 → 시스템 초기화
2. `gameLoop()` → 60 FPS로 시스템 업데이트 및 렌더링
3. 저장: LocalStorage (30초 자동) + 탭 숨김/닫기 시

### 경로 별칭 (추가 필요)

```javascript
// tsconfig.json에 추가
'@kimchi-invasion/*' → './kimchi-invasion/src/*'
```
