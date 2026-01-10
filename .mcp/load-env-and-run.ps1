# .env.mcp 파일을 로드하고 MCP 서버를 실행하는 래퍼 스크립트
# 사용법: powershell -File load-env-and-run.ps1 <command> [args...]

# 스크립트가 위치한 디렉토리의 부모 디렉토리에서 .env.mcp 찾기
if ($PSScriptRoot) {
    $envFile = Join-Path (Split-Path $PSScriptRoot -Parent) ".env.mcp"
} else {
    # 스크립트 디렉토리를 알 수 없는 경우 현재 작업 디렉토리 사용
    $envFile = Join-Path $PWD ".env.mcp"
}

# .env.mcp 파일이 존재하는지 확인
if (Test-Path $envFile) {
    # .env.mcp 파일 읽기 및 환경 변수 설정
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        # 주석이나 빈 줄 무시
        if ($line -and -not $line.StartsWith('#')) {
            # KEY=VALUE 형식 파싱
            if ($line -match '^([^=]+)=(.*)$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                # 환경 변수 설정
                [Environment]::SetEnvironmentVariable($key, $value, 'Process')
            }
        }
    }
}

# 전달받은 명령어 실행
$command = $args[0]
$commandArgs = $args[1..($args.Length - 1)]

& $command @commandArgs
