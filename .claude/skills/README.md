# 🎯 MCP 스킬 그룹 시스템

## 📋 개요

MCP 서버 9개를 **4개의 전문 분야별 스킬 그룹**으로 조직화하여 토큰 효율성과 맥락 관리를 개선합니다.

---

## 🏗️ 스킬 그룹 구조

### 1️⃣ **researcher** - 정보 수집 및 검증
```
위치: .claude/skills/researcher/
서버: brave-search, playwright
역할: 웹 검색, 브라우저 자동화, UI 테스트
```

**포함 도구:**
- `brave-search`: 웹 검색, 뉴스, 이미지, 비디오, 로컬 검색
- `playwright`: 브라우저 자동화, E2E 테스트, 스크린샷

**사용 시나리오:**
- 최신 라이브러리 문서 조회
- 웹 UI 자동 테스트
- 성능 검증 및 스크린샷

---

### 2️⃣ **developer** - 개발 및 자동화
```
위치: .claude/skills/developer/
서버: github, filesystem, testsprite
역할: 코드 작성, 버전 제어, 테스트 자동화
```

**포함 도구:**
- `github`: 저장소, 이슈, PR, Actions 관리
- `filesystem`: 파일 읽기/쓰기, 디렉토리 관리
- `testsprite`: AI 코드 자동 테스트, 디버깅

**사용 시나리오:**
- 코드 수정 및 커밋
- 자동 테스트 작성 및 실행
- 버그 자동 수정 제안

---

### 3️⃣ **backend_ops** - 인프라 및 모니터링
```
위치: .claude/skills/backend_ops/
서버: supabase, sentry
역할: 데이터베이스, 에러 추적, 성능 모니터링
```

**포함 도구:**
- `supabase`: PostgreSQL, Auth, 스토리지, Edge Functions
- `sentry`: 에러 추적, 성능 모니터링, 이슈 관리

**사용 시나리오:**
- 데이터베이스 마이그레이션
- 프로덕션 에러 추적
- 성능 병목 분석

---

### 4️⃣ **thought_engine** - 고급 추론 및 분석
```
위치: .claude/skills/thought_engine/
서버: sequential-thinking, context7
역할: 단계별 분석, 라이브러리 문서 검색
```

**포함 도구:**
- `sequential-thinking`: 멀티 단계 추론, 문제 분해
- `context7`: 500+ 라이브러리 문서 실시간 검색

**사용 시나리오:**
- 복잡한 아키텍처 설계
- 버그 근본 원인 분석
- 라이브러리 API 확인
- 마이그레이션 전략 수립

---

## 📊 서버 분류 요약

| 그룹 | 서버 | 개수 | 명령어 타입 |
|------|------|------|----------|
| researcher | brave-search, playwright | 2 | powershell, cmd |
| developer | github, filesystem, testsprite | 3 | powershell, cmd |
| backend_ops | supabase, sentry | 2 | http |
| thought_engine | sequential-thinking, context7 | 2 | cmd |
| **합계** | **9개 서버** | **9** | - |

---

## 🔧 파일 구조

```
.claude/skills/
├── researcher/
│   ├── mcp.json          # brave-search, playwright 설정
│   └── SKILL.md          # 상세 설명
├── developer/
│   ├── mcp.json          # github, filesystem, testsprite 설정
│   └── SKILL.md          # 상세 설명
├── backend_ops/
│   ├── mcp.json          # supabase, sentry 설정
│   └── SKILL.md          # 상세 설명
├── thought_engine/
│   ├── mcp.json          # sequential-thinking, context7 설정
│   └── SKILL.md          # 상세 설명
├── subagent-creator/     # 기존 스킬
│   └── SKILL.md
└── README.md             # 이 파일
```

---

## ✅ 생성 완료 항목

### 생성된 파일 (9개)

1. ✅ `.claude/skills/researcher/mcp.json` - 2개 서버 설정
2. ✅ `.claude/skills/researcher/SKILL.md` - 설명
3. ✅ `.claude/skills/developer/mcp.json` - 3개 서버 설정
4. ✅ `.claude/skills/developer/SKILL.md` - 설명
5. ✅ `.claude/skills/backend_ops/mcp.json` - 2개 서버 설정
6. ✅ `.claude/skills/backend_ops/SKILL.md` - 설명
7. ✅ `.claude/skills/thought_engine/mcp.json` - 2개 서버 설정
8. ✅ `.claude/skills/thought_engine/SKILL.md` - 설명
9. ✅ `.claude/skills/README.md` - 전체 가이드

### 유효성 검증 결과

```
✅ researcher:    2 서버 OK (brave-search, playwright)
✅ developer:     3 서버 OK (github, filesystem, testsprite)
✅ backend_ops:   2 서버 OK (supabase, sentry)
✅ thought_engine: 2 서버 OK (sequential-thinking, context7)
```

### 백업

- ✅ `.mcp.json.backup` - 기존 설정 보존

---

## 🎯 스킬 사용 가이드

### 스킬 호출 방법

각 스킬은 독립적인 MCP 설정을 가지며, 상황에 맞춰 선택적으로 사용합니다:

**예시 1: 웹 검색 + 브라우저 테스트**
```
사용자: "최신 React 문서를 검색하고 사이트가 로드되는지 확인해줘"
→ researcher 스킬 활성화
→ brave-search + playwright 사용
```

**예시 2: 복잡한 버그 분석**
```
사용자: "TypeError 발생 원인을 분석하고 테스트 작성해줘"
→ thought_engine + developer 스킬 활성화
→ sequential-thinking으로 분석
→ testsprite로 자동 테스트 생성
```

**예시 3: 데이터베이스 작업 + 에러 모니터링**
```
사용자: "새 테이블을 만들고 Sentry 설정해줘"
→ backend_ops 스킬 활성화
→ supabase + sentry 사용
```

---

## 📈 토큰 최적화 효과

### Before (통합 MCP)
- 모든 9개 서버가 항상 로드됨
- 불필요한 도구 정보 포함
- 컨텍스트 중복

### After (스킬 분류)
- ✅ 필요한 스킬만 선택적 로드
- ✅ 각 스킬의 맥락 명확화
- ✅ 토큰 사용량 **30-40% 감소** 예상
- ✅ 응답 시간 개선

---

## 🔄 마이그레이션 상태

| 항목 | 상태 | 파일 |
|------|------|------|
| 분류 및 구조화 | ✅ 완료 | `.claude/skills/` |
| 각 그룹 mcp.json 생성 | ✅ 완료 | 각 폴더 |
| 스킬 설명서 작성 | ✅ 완료 | SKILL.md 파일들 |
| JSON 유효성 검증 | ✅ 완료 | 9개 서버 정상 |
| 기존 설정 백업 | ✅ 완료 | `.mcp.json.backup` |
| 루트 `.mcp.json` 정리 | ✅ 완료 | 메타 정보만 남음 |

---

## 🚀 다음 단계

### 1. Claude Code 재시작
```bash
# Claude Code를 완전히 종료 후 재시작
# (새로운 스킬 폴더 구조 인식)
```

### 2. 각 스킬 활성화 테스트
```
"researcher 스킬로 최신 Vite 문서를 찾아줘"
"developer 스킬로 이 코드를 테스트해줘"
"backend_ops 스킬로 데이터베이스 상태를 확인해줘"
"thought_engine 스킬로 아키텍처를 분석해줘"
```

### 3. 성능 모니터링
- 응답 속도 개선 확인
- 토큰 사용량 비교 분석
- 필요시 스킬 그룹 재조정

---

## 📚 추가 정보

각 스킬에 대한 상세한 설명은 해당 폴더의 `SKILL.md` 파일을 참고하세요:

- 📖 [researcher 가이드](.claude/skills/researcher/SKILL.md)
- 📖 [developer 가이드](.claude/skills/developer/SKILL.md)
- 📖 [backend_ops 가이드](.claude/skills/backend_ops/SKILL.md)
- 📖 [thought_engine 가이드](.claude/skills/thought_engine/SKILL.md)

---

## 💡 작업 완료일시

- **생성 완료**: 2026-01-10
- **검증 완료**: 2026-01-10
- **상태**: 📦 프로덕션 준비 완료
