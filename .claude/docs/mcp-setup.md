# MCP (Model Context Protocol) 상세 설정

> 이 문서는 MCP 서버 설정의 상세 가이드입니다.
> 간략한 개요는 `CLAUDE.md`를 참조하세요.

## 파일 구조

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
├── agents/                  # 에이전트 조직
└── skills/
    └── subagent-creator/    # 서브에이전트 생성 템플릿
```

## MCP 설정 Scope 체계

```
1. User scope:    ~/.claude.json       → `claude mcp list`에 표시됨
2. Local scope:   ~/.claude.json       → `claude mcp list`에 표시됨
3. Project scope: .mcp.json (루트)     → 표시 안 됨, 하지만 작동함 ✅
   ❌ .claude/mcp.json                 → 유효하지 않음!
```

⚠️ **중요:** MCP 설정 파일은 반드시 **프로젝트 루트의 `.mcp.json`**에 위치해야 합니다.

## 활성화된 MCP 서버

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

## 환경 변수 설정

### `.env.mcp` 구성

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
```

### `.env.local` 구성 (개발용)

```bash
# Supabase 공개 키 (클라이언트)
VITE_SUPABASE_URL=https://nvxdwacqmiofpennukeo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### ⚠️ 중요: 따옴표 사용 금지

```bash
# ✅ 올바른 형식
BRAVE_API_KEY=BSAzv4lHYoYloVS3tUhcQ1CXUrLDIi5

# ❌ 잘못된 형식 (따옴표 포함)
BRAVE_API_KEY="BSAzv4lHYoYloVS3tUhcQ1CXUrLDIi5"
```

## 환경 변수 자동 로드

`.mcp.json`은 PowerShell 스크립트 `.mcp/load-env-and-run.ps1`을 사용하여 `.env.mcp` 파일에서 환경 변수를 자동으로 로드합니다.

**동작 방식:**

1. MCP 서버 시작 시 `.mcp/load-env-and-run.ps1` 실행
2. 스크립트가 `.env.mcp` 파일을 읽어서 환경 변수 설정
3. 실제 MCP 서버 프로세스 시작

**수동 테스트:**

```powershell
powershell -ExecutionPolicy Bypass -File .mcp/load-env-and-run.ps1 cmd /c 'echo BRAVE_API_KEY=%BRAVE_API_KEY%'
```

## 문제 해결

MCP 서버가 환경 변수를 찾지 못하는 경우:

1. `.env.mcp` 파일이 프로젝트 루트에 있는지 확인
2. 값에 따옴표가 없는지 확인
3. Claude Code를 완전히 종료 후 재시작
4. 스크립트 테스트: `powershell -ExecutionPolicy Bypass -File .mcp/load-env-and-run.ps1 cmd /c echo %BRAVE_API_KEY%`

## MCP 명령어

```bash
# MCP 서버 목록 및 상태 확인 (User/Local scope만)
claude mcp list

# 세션 내 모든 MCP 확인 (Project scope 포함)
/mcp

# MCP 제거: .mcp.json에서 해당 서버 설정 삭제
```

## `claude mcp list` 표시 규칙

| Scope       | 설정 파일 위치                  | 표시 여부                         |
| ----------- | ------------------------------- | --------------------------------- |
| User        | `~/.claude.json`                | ✅ 표시됨                         |
| Local       | `~/.claude.json` (프로젝트별)   | ✅ 표시됨                         |
| **Project** | **`.mcp.json` (프로젝트 루트)** | ❌ **표시 안 됨** (하지만 작동함) |

**핵심:**

- `claude mcp list`는 **User/Local scope만 표시**
- Project scope (`.mcp.json`)의 MCP는 **표시되지 않지만 정상 작동**
- 세션 내 `/mcp` 명령으로 전체 MCP 확인 가능
