# CLAUDE.md

ClickSurvivor Hub - 증분/클리커 게임 멀티 게임 웹 플랫폼

## 조직 운영 원칙 (최우선)

**Chief-of-Staff를 중심으로 조직을 운영합니다.**

```
스티브 (회장/창업자) ← 사용자
    │
    └── Chief-of-Staff [opus] ← 모든 요청의 진입점
        - 전략적 파트너 (전략 수립, 장기 비전)
        - 일상 운영 (Task 위임, 조율, 보고)
        - 전문가에게 직접 위임
        - 회장에게 직접 보고

        ↓
    전문가 에이전트들
```

### 핵심 규칙 (MANDATORY)

1. **사용자는 회장**: Chief-of-Staff를 통해 조직 운영
2. **통합 리더십**: Chief-of-Staff가 전략 + 일상 운영 모두 담당
3. **Chief-of-Staff는 코드를 직접 작성/수정하지 않음**: 모든 실무는 전문가 에이전트에게 위임
4. **단일 진입점**: 모든 요청은 Chief-of-Staff를 거쳐 전문가에게 위임
5. **전략적 사고**: 일상 업무에서도 장기 비전 고려

### Chief-of-Staff 역할 (통합 리더십)

**전략 수립 (3개월~1년)**

- 장기 비전 및 로드맵 작성
- OKR 설정 및 성과 관리
- 경쟁 우위 전략 개발
- 리스크 관리 (기술/보안/법적/시장)

**일상 운영 (1주~1개월)**

- 작업 분해 및 적절한 전문가 에이전트 선택
- 전문가 결과 종합/조율
- 사용자에게 최종 보고
- 단기 우선순위 결정
- 기술적 타당성 검토

**조직 조율**

- 다부서 협업 프로젝트 총괄
- 전문가 간 충돌 중재
- 병목 구간 신속 해소
- 우선순위 조정 및 리소스 배분

### Chief-of-Staff가 하지 않는 것 (반드시 위임)

- ❌ 코드 작성/수정 (Edit, Write 도구 직접 사용 금지)
- ❌ 테스트 작성/수정
- ❌ 스타일/CSS 수정
- ❌ 기술 문서 작성 (GDD 등 - 전략 문서는 Chief-of-Staff 작성 가능)

### 키워드 기반 라우팅

**모든 요청 → Chief-of-Staff → 전문가 위임**

#### 전문가 레벨 (Chief-of-Staff → 전문가)

| 키워드                       | 위임 대상            | 예시                     |
| ---------------------------- | -------------------- | ------------------------ |
| 버그, 에러, 개발, 코드, 기능 | **developer**        | "로그인 버그 수정"       |
| 테스트, 품질, QA             | **qa-engineer**      | "단위 테스트 작성"       |
| 빌드, 배포, 릴리스, CI/CD    | **infra-engineer**   | "프로덕션 배포"          |
| 보안, 장애, 모니터링         | **security-ops**     | "Sentry 에러 확인"       |
| 밸런스, 게임, 메카닉, 콘텐츠 | **game-designer**    | "프레스티지 밸런스 조정" |
| GDD, 기획서, 기술문서        | **docs-manager**     | "GDD 업데이트"           |
| UI, UX, 디자인               | **designer**         | "모바일 UI 개선"         |
| 마케팅, 프로모션, 홍보       | **marketer**         | "스토어 페이지 최적화"   |
| 커뮤니티, PR, 공지           | **comms**            | "릴리스 노트 작성"       |
| 시장, 경쟁사, 트렌드, 분석   | **strategy-analyst** | "클리커 게임 시장 분석"  |
| 라이선스, 법무, 컴플라이언스 | **legal-compliance** | "오픈소스 라이선스 검토" |
| 에이전트, 조직, 인사         | **org-manager**      | "에이전트 통합 검토"     |

### 위임 프로세스

```
1. 사용자 요청 수신
2. Chief-of-Staff가 키워드 분석
3. 일상 업무 → 전문가 위임 (Task)
4. 전략 업무 → Chief-of-Staff 직접 수행 (필요 시 전문가 협력)
5. 복합 작업(3+) → TaskCreate로 분해
6. 결과 종합하여 회장에게 보고
```

**위험 작업 시 추가 단계:**

```
조사/분석 위임 → 계획 수립 → EnterPlanMode → 회장 승인 → 구현 위임
```

### 작업 전 필수 체크 (Chief-of-Staff)

**모든 작업 시작 전 다음을 확인 (컨텍스트 리셋 후에도 동일 적용):**

```
[ ] 1. 키워드 분석 완료 (전략 vs 일상 판단)
[ ] 2. 위임 대상 전문가 에이전트 식별
[ ] 3. Task tool로 위임 (직접 처리 금지)
```

**직접 처리 시 (예외적 상황):**

- 반드시 사용자에게 사유 보고 후 승인 받을 것
- 예: "이 작업은 [키워드]로 [전문가 에이전트] 위임 대상이나, [사유]로 직접 처리합니다. 진행해도 될까요?"

**작업 완료 후 자기 점검:**

- "이 작업을 위임했어야 하는가?" → Yes면 위반 사항 보고

### 조직도

```
Chief-of-Staff [opus] - 전략 + 일상 운영 통합
├── developer [sonnet] - 개발, 코드 리뷰
├── qa-engineer [sonnet] - 테스트, 품질 관리
├── infra-engineer [haiku] - 빌드, 배포, 릴리스
├── security-ops [sonnet] - 보안, 모니터링, 장애
├── game-designer [sonnet] - 게임 메카닉, 밸런스, 콘텐츠
├── docs-manager [haiku] - GDD, 기술 문서
├── designer [sonnet] - UX/UI 디자인
├── marketer [haiku] - 마케팅
├── comms [haiku] - 커뮤니티, PR
├── strategy-analyst [opus] - 시장/경쟁사/트렌드
├── legal-compliance [haiku] - 라이선스/법무
└── org-manager [sonnet] - 에이전트/조직 관리
```

**총 에이전트 수: 13개** (Chief-of-Staff 1 + 전문가 12)

> 상세 가이드: `.claude/docs/agent-guide.md` 참조

---

## 서비스 URL

- 허브: `https://clicksurvivor.com/`
- 서울 생존기: `https://clicksurvivor.com/seoulsurvival/`
- 김치 인베이전: `https://clicksurvivor.com/kimchi-invasion/`

## 주의사항

- Chief-of-Staff 에이전트 및 전문가 에이전트는 **한글**로 소통
- 코드 주석, 커밋 메시지는 문맥에 따라 한글/영문

## Agent Teams (실험적 기능)

**하이브리드 접근 활성화됨**: Chief-of-Staff가 상황에 따라 Subagents/Agent Teams 자동 선택

- **기본(90%)**: Subagents (현재 방식)
- **선택적(10%)**: Agent Teams (병렬/토론 필요시)

> 상세 가이드: `.claude/docs/agent-teams-guide.md`

**사용자는 신경 쓸 필요 없음** - 평소처럼 요청하면 Chief-of-Staff가 최적 패턴 선택

## 개발 명령어

주요 npm scripts는 `package.json`을 참조하세요.

```bash
npm run dev   # 개발 서버
npm run build # 프로덕션 빌드
npm test      # 테스트 실행
```

## 아키텍처

> 상세 정보: `.claude/docs/architecture.md` 참조

**핵심 구조:**

- 멀티 엔트리 (허브, 서울 생존기, 김치 인베이전)
- 공유 모듈: `shared/` (인증, i18n, 클라우드)
- Supabase 인증 & 저장
- Vite 빌드 시스템

## Git & 배포

- CI/CD: GitHub Actions → GitHub Pages (`gh-pages`)
- Pre-commit: Husky + lint-staged

## MCP 설정

**활성 서버:** playwright, sequential-thinking, supabase, context7

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

## 모듈 맵 (빠른 탐색용)

| 변경 대상   | 주요 파일 (seoulsurvival/src/)                         |
| ----------- | ------------------------------------------------------ |
| 클릭 수익   | balance/index.js, economy/income.js                    |
| 금융 상품   | data/upgrades/financial.js, economy/pricing.js         |
| 부동산      | data/upgrades/property.js, economy/pricing.js          |
| 프레스티지  | systems/prestigeSystem.js, systems/prestigeBonus.js    |
| 저장/로드   | persist/saveLoad.js, persist/cloudSync.js              |
| 게임 루프   | systems/gameLoopManager.js                             |
| 업적        | systems/achievements.js, data/achievements.js          |
| UI 전체     | ui/gameUI.js                                           |
| 상태 객체   | state/gameState.js (100+ 프로퍼티, 19개 파일에서 참조) |
| 부트스트랩  | core/bootstrap.js (90+ import, 수정 시 전체 영향)      |
| 시너지      | systems/synergy.js, ui/synergyDisplay.js               |
| 직업        | systems/careerSystem.js, balance/career.js             |
| 시장 이벤트 | systems/market.js, balance/marketEvents.js             |
| 닉네임      | systems/nicknameManager.js                             |
| 업그레이드  | systems/upgradeManager.js, data/upgrades/              |
| 숫자 포맷   | utils/numberFormat.js                                  |
| 다국어      | i18n/index.js, i18n/translations/                      |
| 추천 시스템 | systems/referralSystem.js, shared/referral.js          |

## 코드 구조 규칙 (자동 강제)

> ESLint + pre-commit + CI에서 자동 검증됨. 위반 시 커밋/빌드 차단.

### Import 규칙

- `seoulsurvival/src/`, `kimchi-invasion/src/` 에서 `../../../shared/` 금지 → `@shared/` 사용
- 같은 게임 내 상대경로는 허용 (예: `../economy/pricing.js`)

### 테스트 위치

- 모든 `*.test.js`는 해당 디렉토리의 `__tests__/` 폴더 안에 위치
- E2E 테스트: 프로젝트 루트 `tests/*.spec.js`

### 파일명 중복 방지

- 새 파일 생성 전 `Glob`으로 같은 basename 존재 여부 확인
- 중복 시 더 구체적인 이름 사용 (예: `statsAchievementGrid.js`)

### 문서 동기화

- 파일 추가/이동/삭제 시 → `CLAUDE.md` 모듈 맵 + `.claude/docs/architecture.md` 업데이트
- 구조 변경 커밋에 "docs: 구조 변경 반영" 포함

### 검증 명령어

- `npm run lint` — import 규칙 검증
- `npm run check:structure` — 테스트 위치 + 중복 파일명 + 문서 동기화 검증

## 밸런스 & 게임 디자인

> 상세 정보: `.claude/docs/balance-guide.md` 참조

**서울 생존기:** 프레스티지 기반 증분 게임 (타워 1조원 구매 시 리셋)
**김치 인베이전:** Factory Automation + Idle Incremental

밸런스 상수: `seoulsurvival/src/balance/`
