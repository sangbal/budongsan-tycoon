# MCP 서버 설정 가이드

이 가이드는 ClickSurvivor 프로젝트에서 MCP(Model Context Protocol) 서버를 설정하는 방법을 안내합니다.

## 📋 사전 준비

### 1. Node.js 설치 확인

```bash
node --version  # v20 이상 권장
npm --version
```

### 2. 필요한 API 키 발급

#### GitHub Personal Access Token

1. https://github.com/settings/tokens 접속
2. **Generate new token (classic)** 클릭
3. 권한 선택:
   - `repo` (전체)
   - `workflow`
   - `read:org`
4. 토큰 복사 후 안전한 곳에 저장

#### Brave Search API Key

1. https://brave.com/search/api/ 접속
2. **Get Started** 클릭
3. 무료 플랜 선택 (월 2,000 쿼리)
4. API 키 복사

#### Supabase Database URL

1. Supabase 프로젝트 대시보드 접속
2. **Settings** > **Database** 메뉴
3. **Connection string** 섹션에서 **URI** 복사
4. `[YOUR-PASSWORD]`를 실제 데이터베이스 비밀번호로 교체

---

## 🔧 MCP 서버 설정

### Step 1: 환경변수 파일 생성

```bash
# .env.mcp.example을 복사
cp .env.mcp.example .env.mcp

# 에디터로 열어서 실제 값 입력
nano .env.mcp
```

`.env.mcp` 예시:

```bash
GITHUB_TOKEN=ghp_1a2b3c4d5e6f7g8h9i0j
SUPABASE_DB_URL=postgresql://postgres:mypassword@db.abcdefghijk.supabase.co:5432/postgres
BRAVE_API_KEY=BSA_xyz123abc456
```

### Step 2: .gitignore에 추가

```bash
echo ".env.mcp" >> .gitignore
```

### Step 3: MCP 서버 테스트

#### GitHub MCP 테스트

```bash
# 최근 GitHub Actions 워크플로우 조회
npx -y @modelcontextprotocol/server-github
```

Claude Code에서 테스트:

```
Claude: "최근 GitHub Actions 워크플로우 실행 상태 조회해줘"
```

#### Postgres MCP 테스트

```bash
# Supabase DB 연결 테스트
npx -y @modelcontextprotocol/server-postgres "$SUPABASE_DB_URL"
```

Claude Code에서 테스트:

```
Claude: "leaderboard 테이블에서 상위 10명의 닉네임과 자산 조회해줘"
```

#### Memory MCP 테스트

```bash
npx -y @modelcontextprotocol/server-memory
```

Claude Code에서 테스트:

```
Claude: "Seoul Survival의 타워 가격 공식은 basePrice * 1.15^count라는 걸 기억해줘"
Claude: "Seoul Survival의 타워 가격 공식이 뭐였지?"
```

---

## 🎯 MCP 서버 활용 예시

### 1. GitHub MCP로 릴리즈 자동화

```
Claude: "최근 커밋들을 기반으로 v1.2.3 릴리즈 노트를 작성하고 GitHub Release를 생성해줘"
```

**결과**:

- `RELEASE_NOTES.md` 자동 업데이트
- GitHub Release 생성
- Git 태그 자동 생성

### 2. Postgres MCP로 데이터 분석

```
Claude: "지난 7일간 일별 신규 유저 수를 그래프로 보여줘"
Claude: "닉네임 중복 검사 로직이 제대로 작동하는지 확인해줘"
```

### 3. Brave Search MCP로 기술 조사

```
Claude: "React 19의 새로운 use() Hook 사용법을 검색해줘"
Claude: "Supabase Edge Functions에서 CORS 설정하는 방법 찾아줘"
```

### 4. Memory MCP로 컨텍스트 유지

```
Claude: "Seoul Survival의 경제 밸런스 정책을 기억해줘:
- 초반(~100M): 타워 위주 투자
- 중반(100M~1B): 업그레이드 균형
- 후반(1B+): 명성 시스템 집중"

# 나중에...
Claude: "Seoul Survival 경제 밸런스 정책이 뭐였지?"
```

### 5. Sequential Thinking MCP로 리팩토링 계획

```
Claude: "Seoul Survival의 main.js (9789줄)를 모듈화하는 계획을 단계별로 세워줘"
```

**결과**:

- 의존성 분석
- 모듈 분리 전략
- 단계별 마이그레이션 계획
- 테스트 시나리오

### 6. Puppeteer MCP로 E2E 테스트

```
Claude: "모든 게임의 'Play Now' 버튼을 클릭해서 로드되는지 테스트하고 스크린샷 찍어줘"
```

---

## 🔍 문제 해결

### MCP 서버가 실행되지 않을 때

#### 1. npx 캐시 초기화

```bash
npx clear-npx-cache
```

#### 2. 수동으로 MCP 서버 설치

```bash
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-brave-search
npm install -g @modelcontextprotocol/server-memory
```

#### 3. 환경변수 확인

```bash
# .env.mcp 파일이 제대로 로드되는지 확인
cat .env.mcp

# Claude Code 재시작
```

### WSL2 환경에서 경로 문제

GitKraken MCP가 작동하지 않을 때:

```json
{
  "gitkraken": {
    "command": "/mnt/c/Users/HOME/AppData/Roaming/Antigravity/User/globalStorage/eamodio.gitlens/gk.exe",
    "args": ["mcp", "--host=antigravity", "--source=gitlens", "--scheme=antigravity"]
  }
}
```

### Supabase 연결 실패

1. Supabase 프로젝트가 활성화되어 있는지 확인
2. Database 비밀번호가 정확한지 확인
3. IP 화이트리스트 설정 확인 (Supabase 대시보드 > Settings > Database > Connection Pooling)

---

## 📚 추가 리소스

- [MCP 공식 문서](https://modelcontextprotocol.io/)
- [GitHub MCP 서버 문서](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [Postgres MCP 서버 문서](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)
- [Claude Code 문서](https://claude.com/claude-code)

---

## 🎉 다음 단계

MCP 설정이 완료되면:

1. **커스텀 Skills 작성**: `/release`, `/i18n-sync`, `/balance-test` 등
2. **자동화 워크플로우 구축**: 배포 전 자동 테스트, 릴리즈 노트 생성 등
3. **데이터 분석 대시보드**: Supabase 데이터 기반 플레이어 행동 분석
4. **성능 모니터링**: Puppeteer로 로딩 시간, 번들 크기 추적

질문이나 문제가 있으면 Claude에게 물어보세요! 🚀
