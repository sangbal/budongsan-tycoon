# MCP 서버 헬퍼 스크립트

이 디렉토리에는 MCP (Model Context Protocol) 서버를 실행하기 위한 헬퍼 스크립트가 포함되어 있습니다.

## load-env-and-run.ps1

`.env.mcp` 파일에서 환경 변수를 로드하고 MCP 서버를 실행하는 PowerShell 래퍼 스크립트입니다.

### 동작 방식

1. 프로젝트 루트의 `.env.mcp` 파일을 읽습니다
2. `KEY=VALUE` 형식의 환경 변수를 파싱합니다
3. 현재 프로세스의 환경 변수로 설정합니다
4. 전달받은 명령어를 실행합니다

### 사용 예시

```powershell
# 직접 실행
powershell -ExecutionPolicy Bypass -File .mcp/load-env-and-run.ps1 npx -y @brave/brave-search-mcp-server

# .mcp.json에서 사용
{
  "command": "powershell",
  "args": [
    "-ExecutionPolicy", "Bypass",
    "-File", ".mcp/load-env-and-run.ps1",
    "npx", "-y", "@brave/brave-search-mcp-server"
  ]
}
```

### 주의사항

- `.env.mcp` 파일은 `.gitignore`에 포함되어 있으므로 Git에 커밋되지 않습니다
- 실제 API 키와 토큰은 `.env.mcp`에만 저장하세요
- 이 스크립트는 Windows PowerShell 5.1 이상에서 작동합니다

## 문제 해결

### "실행 정책" 오류

PowerShell 실행 정책이 제한되어 있는 경우:

```powershell
# 현재 사용자에 대해 실행 정책 변경
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 또는 일회성으로 우회
powershell -ExecutionPolicy Bypass -File .mcp/load-env-and-run.ps1 <command>
```

### 환경 변수가 로드되지 않음

`.env.mcp` 파일이 올바른 형식인지 확인하세요:

```bash
# 올바른 형식
BRAVE_API_KEY=BSAxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_KEY=eyJxxxxxxxxxxxxx

# 잘못된 형식 (따옴표 사용 X)
BRAVE_API_KEY="BSAxxxxxxxxxxxxxxxxxx"
```
