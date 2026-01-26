# 보안 관리 체계

> 이 문서는 토큰/API 키 보안 관리의 상세 가이드입니다.

## 절대 금지 사항

| 항목                               | 위험성    | 영향                   |
| ---------------------------------- | --------- | ---------------------- |
| 토큰을 소스 코드에 포함            | 🔴 극높음 | 계정 해킹, 리소스 악용 |
| `.env.local` 커밋                  | 🔴 극높음 | 모든 환경변수 노출     |
| `.claude/settings.local.json` 커밋 | 🔴 높음   | 로컬 설정 유출         |
| 커밋 메시지에 토큰 포함            | 🔴 높음   | 히스토리 영구 노출     |

## 올바른 토큰 관리

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

## 토큰 유출 대응

토큰이 실수로 노출된 경우:

### 1. 즉시 토큰 무효화

| 서비스     | 무효화 URL                                                          |
| ---------- | ------------------------------------------------------------------- |
| Supabase   | https://app.supabase.com > Settings > API Keys > Rotate             |
| Brave      | https://brave.com/search/api/ > Revoke API Key                      |
| GitHub     | https://github.com/settings/personal-access-tokens > Delete         |
| TestSprite | https://www.testsprite.com/dashboard > Settings > API Keys > Delete |

### 2. 새 토큰 발급 및 업데이트

`.env.mcp` 및 `.env.local` 파일에 새 토큰 적용

### 3. Git 히스토리 확인

```bash
# 환경 파일 히스토리 확인
git log --all -- .env.local .env.mcp
git log --all -- .claude/settings.local.json

# 커밋 메시지 검색 (토큰 유출)
git log --all --grep="ghp_\|eyJ" || echo "히스토리 안전"
```

## 보안 파일 목록

**.gitignore에 반드시 포함:**

```
.env.local
.env.mcp
.claude/settings.local.json
```

**커밋 가능:**

```
.env.mcp.example     # 토큰 없는 템플릿
.mcp.json            # MCP 설정 (토큰 없음)
.claude/settings.json # 글로벌 도구 권한
```
