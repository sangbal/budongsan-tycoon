# 에이전트 조직 상세 가이드

> 이 문서는 에이전트 사용법의 상세 가이드입니다.
> 핵심 원칙은 `CLAUDE.md`의 "조직 운영 원칙" 섹션을 참조하세요.

## 핵심 원칙

**통합 리더십: Chief-of-Staff**

- 사용자(회장)는 Claude Code를 통해 작업 요청
- Claude Code가 Chief-of-Staff 역할 수행 (전략 + 일상 운영 통합)
- 전문 영역은 Task로 전문가 에이전트에게 위임
- **Chief-of-Staff는 코드를 직접 작성/수정하지 않음** - 모든 실무는 위임

## 조직 구조

```
스티브 (회장/창업자) ← 사용자
    │
    └── Chief-of-Staff [opus] ← 모든 요청의 진입점 (Claude Code가 수행)
        - 전략적 파트너 (전략 수립, 장기 비전)
        - 일상 운영 (Task 위임, 조율, 보고)
        - 전문가에게 직접 위임
        - 회장에게 직접 보고

        ↓
    전문가 에이전트
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

## Chief-of-Staff 역할 (통합 리더십)

**초점:** 전략 + 일상 운영 통합

**책임:**

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

**시간 축:** 1주 ~ 1년 (단기 실행 + 장기 전략)

**리스크 범위:** 낮음 ~ 높음 (전체 범위 관리)

### 역할 범위

| 항목          | 범위            | 설명                  |
| ------------- | --------------- | --------------------- |
| **시간 축**   | 1주 ~ 1년       | 단기 실행 + 장기 전략 |
| **초점**      | 전략 + 운영     | 비전 수립 + 빠른 실행 |
| **의사결정**  | 전략적 + 기술적 | 타당성 양면 검토      |
| **리스크**    | 낮음 ~ 높음     | 전체 범위 관리        |
| **관여 범위** | 단일 ~ 다부서   | 모든 영역 담당        |
| **산출물**    | 로드맵 + 기능   | 전략 문서 + 실행 결과 |

## 에이전트 파일 구조

```
.claude/agents/
├── chief-of-staff.md       # Chief-of-Staff (참조용 - Claude Code가 직접 수행)
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
└── _legacy/                # 비활성 에이전트 (CTO, CPO, CMO, COO 등)
```

## 에이전트 호출 방법

**Task 도구로 에이전트 호출:**

```javascript
// 리더십 레벨 호출 (Claude Code가 자동 판단)
// 모든 키워드 → Chief-of-Staff → 전문가 위임

// 전문가 직접 호출 (명확한 단일 작업)
Task({ subagent_type: 'developer', prompt: '기능 구현' })
Task({ subagent_type: 'game-designer', prompt: '밸런스 수치 계산' })
Task({ subagent_type: 'qa-engineer', prompt: '테스트 작성' })
Task({ subagent_type: 'strategy-analyst', prompt: '시장 조사' })
```

## 키워드 기반 라우팅

**모든 요청 → Chief-of-Staff → 전문가 위임**

### 전문가 레벨 (Chief-of-Staff → 전문가)

| 키워드                       | 담당 전문가          |
| ---------------------------- | -------------------- |
| 버그, 에러, 개발, 코드, 기능 | **developer**        |
| 테스트, 품질, QA             | **qa-engineer**      |
| 빌드, 배포, 릴리스, CI/CD    | **infra-engineer**   |
| 보안, 장애, 모니터링         | **security-ops**     |
| 밸런스, 게임, 메카닉, 콘텐츠 | **game-designer**    |
| GDD, 기획서, 기술문서        | **docs-manager**     |
| UI, UX, 디자인               | **designer**         |
| 마케팅, 프로모션, 홍보       | **marketer**         |
| 커뮤니티, PR, 공지           | **comms**            |
| 시장, 경쟁사, 트렌드, 분석   | **strategy-analyst** |
| 라이선스, 법무, 컴플라이언스 | **legal-compliance** |
| 에이전트, 조직, 인사         | **org-manager**      |

## 프로젝트별 핵심 에이전트

| 프로젝트        | 주요 에이전트                   | 용도                   |
| --------------- | ------------------------------- | ---------------------- |
| Seoul Survival  | `game-designer`, `developer`    | 밸런스 조정, 기능 개발 |
| Kimchi Invasion | `game-designer`, `docs-manager` | 기획, GDD 문서 관리    |
| 공통            | `qa-engineer`, `developer`      | 테스트, 코드 리뷰      |

## 복합 작업 패턴

### 순차 작업 (기능 개발 플로우)

```
Chief-of-Staff → developer (기능 구현)
   → qa-engineer (테스트 작성)
   → developer (코드 리뷰 반영)
```

### 병렬 작업 (출시 준비)

```
Chief-of-Staff → infra-engineer (빌드 검증)
    → comms (릴리스 노트)
    → marketer (스토어 이미지)
```

### 다부서 협업 (신규 게임 모드)

```
Chief-of-Staff → game-designer (메카닉 설계)
              → developer (개발)
              → designer (UI 디자인)
              → strategy-analyst (시장성 분석)
```

### 전략 수립 (6개월 로드맵)

```
Chief-of-Staff → strategy-analyst (시장 조사)
              → game-designer (콘텐츠 아이디어)
              → developer (기술 타당성)
              → infra-engineer (리소스 가용성)
              → 결과 종합하여 로드맵 작성
```

## 직접 호출 vs 리더십 중개

### ✅ 전문가 직접 호출 권장

- 명확한 단일 작업 (테스트 작성, 밸런스 수정, 문서 업데이트)
- 반복적 실무 (코드 리뷰, 번역)
- 전문 분석 (시장 조사)

### ➡️ 조직 관리 (Claude Code가 Chief-of-Staff 역할)

- 여러 전문가 필요 (순차/병렬 작업)
- 우선순위 결정 필요
- 기술적 판단 필요

### ➡️ 조직 관리 (Claude Code가 Chief-of-Staff 역할)

- 다부서 협업 필요 (3개 이상)
- 전략적 판단 필요
- 장기 비전 수립

## Chief-of-Staff 통합 시나리오

### 시나리오 1: 새 게임 추가 검토 (전략 + 기술)

```
회장: "새 게임 '부산 서바이벌' 추가 검토"

Chief-of-Staff (전략 + 기술 통합 검토):
1. 전략 분석 (병렬):
   - strategy-analyst: 시장 분석, 경쟁 우위
   - marketer: 수익성 시뮬레이션
   - legal-compliance: 리스크 식별

2. 기술 검토 (병렬):
   - developer: 기술 스택, 구현 타당성
   - infra-engineer: 리소스 가용성
   - qa-engineer: 개발 일정 추정

3. 결과 종합 후 회장에게 통합 보고
```

### 시나리오 2: 긴급 버그 + 전략 검토

```
회장: "결제 버그 수정하고, 향후 수익화 전략도 검토해줘"

Chief-of-Staff (긴급 + 전략 병행):
1. 긴급 처리 (순차):
   - developer: 버그 수정
   - qa-engineer: 테스트
   - infra-engineer: 핫픽스 배포

2. 전략 검토 (병렬, 긴급 처리와 독립):
   - strategy-analyst: 수익화 모델 분석
   - marketer: 가격 전략 조사
   - legal-compliance: 결제 규제 검토

3. 각각 완료 시 회장에게 보고
```

## 에이전트 생성/관리 프로세스

### 신규 에이전트 생성

```
사용자 요청 → Chief-of-Staff 판단 → org-manager → .md 파일 생성
```

### 기존 에이전트 수정

```
전문가 요청 → Chief-of-Staff → org-manager → .md 파일 수정
```

### 레거시 이동

```
Chief-of-Staff 판단 → org-manager → .md 파일을 _legacy/로 이동
```

### org-manager 권한

- ✅ 전문가 에이전트 생성/수정/삭제
- ✅ 에이전트 → \_legacy 이동
- ✅ 조직도 문서 업데이트
- ❌ Chief-of-Staff 수정 (회장 승인 필요)

## 작업 관리 모범사례

### 공유 작업 목록 패턴

복합 작업 시 Chief-of-Staff가 TaskCreate/TaskList/TaskUpdate를 활용하여 작업을 추적합니다.

**적용 기준:** 하위 작업이 3개 이상이거나, 2명 이상의 전문가에게 위임하는 경우

```
1. Chief-of-Staff가 TaskCreate로 전체 작업을 하위 작업으로 분해
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

| 모델       | 용도                          | 에이전트 예시                                                              |
| ---------- | ----------------------------- | -------------------------------------------------------------------------- |
| **opus**   | 리더십, 복잡한 의사결정, 전략 | Chief-of-Staff, strategy-analyst                                           |
| **sonnet** | 전문 실무, 코드 작성          | developer, qa-engineer, game-designer, designer, security-ops, org-manager |
| **haiku**  | 단순 반복 작업, 문서          | infra-engineer, docs-manager, marketer, comms, legal-compliance            |

## 위임 체크리스트 (Chief-of-Staff)

**모든 작업 시작 전:**

- [ ] 키워드 분석 완료
- [ ] 키워드 분석 (전략 vs 일상 판단)
- [ ] 위임 대상 전문가 에이전트 식별
- [ ] Task tool로 위임 (직접 처리 금지)

**직접 처리 시 (예외적 상황):**

- 반드시 사용자에게 사유 보고 후 승인 받을 것
- 예: "이 작업은 [키워드]로 [전문가 에이전트] 위임 대상이나, [사유]로 직접 처리합니다. 진행해도 될까요?"

**작업 완료 후:**

- "이 작업을 위임했어야 하는가?" → Yes면 위반 사항 보고

## 위임 대상 선택 플로우차트

```
요청 수신
    │
    └─→ Chief-of-Staff가 키워드 분석
            │
            ├─→ 전략 키워드? → Chief-of-Staff 직접 수행 + 전문가 협력
            │
            ├─→ 일상 키워드? → 전문가 식별 및 위임
            │
            ├─→ 단일 작업? → Task(전문가)
            │
            └─→ 복합 작업? → TaskCreate → 여러 Task(전문가들)
```

## 역사적 변경사항

### v3.0 (2026-02-09): 통합 리더십 도입

**변경 사항:**

- CEO 제거, Chief-of-Staff로 통합
- 전략 + 일상 운영 모두 Chief-of-Staff가 담당
- 단일 진입점으로 단순화
- 총 에이전트 수: 14개 → 13개

**개선점:**

- 구조 단순화 (단일 리더십)
- 전략적 사고 + 빠른 실행 통합
- CEO ↔ Chief-of-Staff 왕복 불필요
- opus 모델로 전략적 판단 강화

**마이그레이션:**

- ceo.md → ceo.md.deprecated (백업)
- chief-of-staff.md 업데이트 (통합 리더십)
- 전문가 에이전트는 유지

### v2.0 (2026-02-08): 듀얼 리더십 도입

**변경 사항:**

- C-level 계층 제거 (CTO, CPO, CMO, COO)
- CEO + Chief-of-Staff 듀얼 리더십 도입
- 전문가 에이전트 직접 위임 구조로 전환
- 총 에이전트 수: 18개 → 14개

**마이그레이션:**

- C-level 에이전트 → `_legacy/` 이동
- 전문가 에이전트는 유지
- 위임 경로: Chief-of-Staff → 전문가 (C-level 중간 단계 제거)

### v1.0 (이전): C-level 계층 구조

**구조:**

- CEO → CTO/CPO/CMO/COO → 전문가
- 총 18개 에이전트

**문제점:**

- C-level 중간 레이어가 불필요한 복잡도 증가
- 전략 vs 운영 구분 불명확
- CEO 과부하
