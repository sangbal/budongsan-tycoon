# 에이전트 조직 상세 가이드

> 이 문서는 에이전트 사용법의 상세 가이드입니다.
> 핵심 원칙은 `CLAUDE.md`의 "조직 운영 원칙" 섹션을 참조하세요.

## 핵심 원칙

**Claude Code는 CEO 역할을 수행합니다.**

- 사용자(회장)는 별도로 CEO 에이전트를 호출하지 않음
- Claude Code가 모든 요청을 받아 판단
- 전문 영역은 Task로 C-level/하위 에이전트에게 위임
- **CEO는 코드를 직접 작성/수정하지 않음** - 모든 실무는 위임

## 조직 구조

```
스티브 (회장/창업자) ← 사용자
    │
    └── Claude Code (CEO) [opus] ← 모든 요청의 첫 진입점
            │
            ├── CTO [opus] - 기술
            │   ├── developer [sonnet] - 개발, 코드 리뷰
            │   ├── qa-engineer [sonnet] - 테스트, 품질 관리
            │   ├── infra-engineer [haiku] - 빌드, 배포, 릴리스
            │   └── security-ops [sonnet] - 보안, 모니터링, 장애
            │
            ├── CPO [opus] - 제품
            │   ├── game-designer [sonnet] - 게임 메카닉, 밸런스, 콘텐츠
            │   └── docs-manager [haiku] - GDD, 기술 문서
            │
            ├── CMO [sonnet] - 마케팅/디자인/커뮤니케이션
            │   ├── designer [sonnet] - UX/UI 디자인
            │   ├── marketer [haiku] - 마케팅
            │   └── comms [haiku] - 커뮤니티, PR
            │
            └── COO [sonnet] - 운영/전략/법무/인사
                ├── strategy-analyst [sonnet] - 시장/경쟁사/트렌드
                ├── legal-compliance [haiku] - 라이선스/법무
                └── org-manager [sonnet] - 에이전트/조직 관리
```

**총 에이전트 수: 18개** (CEO 1 + C-level 4 + 전문가 13)

## 에이전트 파일 구조

```
.claude/agents/
├── ceo.md                  # CEO (참조용 - Claude Code가 직접 수행)
├── cto.md                  # C-level: 기술 총괄
├── cpo.md                  # C-level: 제품 총괄
├── cmo.md                  # C-level: 마케팅/디자인/소통 총괄
├── coo.md                  # C-level: 운영/전략/법무/인사 총괄
├── developer.md            # 개발, 코드 리뷰
├── qa-engineer.md          # 테스트, 품질 관리
├── infra-engineer.md       # 빌드, 배포, 릴리스
├── security-ops.md         # 보안, 모니터링, 장애
├── game-designer.md        # 게임 메카닉, 밸런스, 콘텐츠
├── docs-manager.md         # GDD, 기술 문서
├── designer.md             # UX/UI 디자인
├── marketer.md             # 마케팅
├── comms.md                # 커뮤니티, PR
├── strategy-analyst.md     # 시장/경쟁사/트렌드
├── legal-compliance.md     # 라이선스/법무
├── org-manager.md          # 에이전트/조직 관리
└── _legacy/                # 비활성 에이전트
```

## 에이전트 호출 방법

**Task 도구로 에이전트 호출:**

```javascript
// C-level 호출 (업무 영역이 명확한 경우)
Task({ subagent_type: 'cto', prompt: '로그인 버그 수정' })
Task({ subagent_type: 'cpo', prompt: '프레스티지 밸런스 조정' })
Task({ subagent_type: 'cmo', prompt: '모바일 UI 개선' })
Task({ subagent_type: 'coo', prompt: '클리커 게임 시장 분석' })

// 전문가 직접 호출 (명확한 단일 작업)
Task({ subagent_type: 'developer', prompt: '기능 구현' })
Task({ subagent_type: 'game-designer', prompt: '밸런스 수치 계산' })
Task({ subagent_type: 'qa-engineer', prompt: '테스트 작성' })
```

## 키워드 기반 라우팅

| 키워드                     | 담당 C-level | 하위 전문가      |
| -------------------------- | ------------ | ---------------- |
| 버그, 에러, 개발, 코드     | **CTO**      | developer        |
| 테스트, 품질               | **CTO**      | qa-engineer      |
| 빌드, 배포, 릴리스         | **CTO**      | infra-engineer   |
| 보안, 모니터링, 장애       | **CTO**      | security-ops     |
| 게임, 밸런스, 기획, 메카닉 | **CPO**      | game-designer    |
| GDD, 문서 작성             | **CPO**      | docs-manager     |
| UI, UX, 디자인             | **CMO**      | designer         |
| 마케팅, 광고               | **CMO**      | marketer         |
| 커뮤니티, PR, 공지         | **CMO**      | comms            |
| 시장, 경쟁사, 트렌드       | **COO**      | strategy-analyst |
| 라이선스, 법무             | **COO**      | legal-compliance |
| 에이전트, 조직             | **COO**      | org-manager      |

## 프로젝트별 핵심 에이전트

| 프로젝트        | 주요 에이전트                   | 용도                   |
| --------------- | ------------------------------- | ---------------------- |
| Seoul Survival  | `game-designer`, `developer`    | 밸런스 조정, 기능 개발 |
| Kimchi Invasion | `game-designer`, `docs-manager` | 기획, GDD 문서 관리    |
| 공통            | `qa-engineer`, `developer`      | 테스트, 코드 리뷰      |

## 복합 작업 패턴

**순차 작업 (기능 개발 플로우):**

```
CTO → developer (기능 구현)
  → qa-engineer (테스트 작성)
  → developer (코드 리뷰 반영)
```

**병렬 작업 (출시 준비):**

```
CTO → infra-engineer (빌드 검증)
CMO → comms (릴리스 노트)
CMO → marketer (스토어 이미지)
```

**다부서 협업 (신규 게임 모드):**

```
CPO → game-designer (메카닉 설계)
CTO → developer (개발)
CMO → designer (UI 디자인)
COO → strategy-analyst (시장성 분석)
```

## 직접 호출 vs CEO 중개

**✅ 전문가 직접 호출 권장:**

- 명확한 단일 작업 (테스트 작성, 밸런스 수정, 문서 업데이트)
- 반복적 실무 (코드 리뷰, 번역)
- 전문 분석 (시장 조사)

**✅ C-level 호출 권장:**

- 업무 영역은 명확하나 여러 전문가 필요
- 전략적 판단 필요 (기술 스택 선택, 우선순위)

**➡️ CEO 판단 (Claude Code가 직접):**

- 다부서 협업 필요
- 우선순위 불명확
- 전략 결정 필요

## 에이전트 생성/관리 프로세스

**신규 에이전트 생성:**

```
사용자 요청 → CEO 판단 → COO → org-manager → .md 파일 생성
```

**기존 에이전트 수정:**

```
C-level/전문가 요청 → COO → org-manager → .md 파일 수정
```

**레거시 이동:**

```
COO 판단 → org-manager → .md 파일을 _legacy/로 이동
```

**org-manager 권한:**

- ✅ 전문가 에이전트 생성/수정/삭제
- ✅ 에이전트 → \_legacy 이동
- ✅ 조직도 문서 업데이트
- ❌ C-level 생성/삭제 (CEO 승인 필요)

## 작업 관리 모범사례

### 공유 작업 목록 패턴

복합 작업 시 CEO가 TaskCreate/TaskList/TaskUpdate를 활용하여 작업을 추적합니다.

**적용 기준:** 하위 작업이 3개 이상이거나, 2명 이상의 전문가에게 위임하는 경우

```
1. CEO가 TaskCreate로 전체 작업을 하위 작업으로 분해
2. 독립 작업은 병렬 위임, 의존성 있는 작업은 addBlockedBy 설정
3. 각 전문가 완료 시 TaskUpdate로 상태 갱신
4. TaskList로 전체 진행 상황 확인 후 보고
```

### 계획 승인 패턴

위험도가 높은 작업은 plan mode를 통해 회장(사용자) 승인을 받습니다.

**승인 필요 작업:**

- 구조 변경 (파일 이동/삭제, 아키텍처 변경)
- 대규모 리팩토링 (5개 이상 파일 변경)
- 데이터 마이그레이션
- 외부 서비스 연동 변경
- 밸런스 체계 전면 수정

**워크플로우:**

```
조사/분석 (전문가 위임) → 계획 수립 → EnterPlanMode → 회장 승인 → 구현 위임
```

### 작업 크기 가이드

- 한 전문가에게 한 번에 **5-6개 이하** 작업 배정
- 작업이 많으면 단계별로 나누어 위임
- 각 작업은 **명확한 완료 기준**을 포함

## 모델 선택 기준

| 모델       | 용도                     | 에이전트 예시                                                   |
| ---------- | ------------------------ | --------------------------------------------------------------- |
| **opus**   | C-level, 복잡한 의사결정 | CEO, CTO, CPO                                                   |
| **sonnet** | 전문 실무, 코드 작성     | developer, qa-engineer, game-designer, designer                 |
| **haiku**  | 단순 반복 작업, 문서     | infra-engineer, docs-manager, marketer, comms, legal-compliance |

## 위임 체크리스트 (CEO)

**모든 작업 시작 전:**

- [ ] 키워드 분석 완료
- [ ] 위임 대상 C-level 식별
- [ ] Task tool로 위임 (직접 처리 금지)

**직접 처리 시 (예외적 상황):**

- 반드시 사용자에게 사유 보고 후 승인 받을 것
- 예: "이 작업은 [키워드]로 [C-level] 위임 대상이나, [사유]로 직접 처리합니다. 진행해도 될까요?"

**작업 완료 후:**

- "이 작업을 위임했어야 하는가?" → Yes면 위반 사항 보고
