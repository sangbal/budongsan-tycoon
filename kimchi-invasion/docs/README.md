# KIMCHI INVASION: The Red Planet Protocol

**Version:** 2.0.0
**Last Updated:** 2026-01-19
**Status:** Full Design Document - Final (Pre-Development)

---

## Overview

화성에서 김치를 생산하고 지구로 역수출하는 Factorio 스타일의 공장 자동화 게임.

- **장르:** Factory Automation / Idle Incremental
- **플랫폼:** Web → Steam → Multi-Platform (크로스플랫폼 로드맵)
- **슬로건:** "화성을 붉게 물들이는 것은 모래가 아니라 우리의 김치다."

---

## 📁 폴더 구조

```
docs/
├── README.md                    # 이 파일 (메인 인덱스)
├── _ai-context/                 # 🤖 AI 컨텍스트용 빠른 참조
│   ├── QUICK_START.md          # 핵심 요약 (AI 첫 참조용)
│   └── GLOSSARY.md             # 용어집
│
├── 00-foundation/               # 기초 문서
│   ├── mvp-definition.md       # ⭐ MVP 범위, Cut List
│   └── tech-validation.md      # 기술 검증 계획
│
├── 01-concept/                  # 핵심 컨셉
│   └── core-concept.md         # 스토리, 디자인 철학
│
├── 02-mechanics/                # 게임 메카닉
│   └── game-mechanics.md       # 자원, 건물, 물류, 발효공학
│
├── 03-visual-ux/                # 📂 비주얼 & UX (8개 모듈)
│   ├── _index.md               # 인덱스 + 빠른 참조
│   ├── a-design-system.md      # 색상, 타이포, 아이콘
│   ├── b-layout.md             # HUD, 반응형
│   ├── c-animation.md          # 애니메이션
│   ├── d-overlays.md           # 오버레이, 알림
│   ├── e-integration.md        # 사운드-UI 연동
│   ├── f-accessibility.md      # WCAG 2.1 AA
│   ├── g-asset-specs.md        # 건물/자원 에셋
│   └── h-asset-advanced.md     # UI 컴포넌트, 효과
│
├── 04-progression/              # 📂 진행 시스템 (6개 모듈)
│   ├── _index.md               # 인덱스 + 빠른 참조
│   ├── a-flow-loops.md         # Flow 이론, 루프 설계
│   ├── b-economy.md            # 경제 시스템
│   ├── c-milestones.md         # M1~M5 마일스톤
│   ├── d-tech-tree.md          # 기술 트리 (Tier 1~5)
│   ├── e-prestige.md           # 프레스티지, Loadout
│   └── f-endgame.md            # 메가베이스, 리더보드
│
├── 05-onboarding/               # 온보딩
│   └── onboarding.md           # FTUE, 튜토리얼
│
├── 06-threats/                  # 위협 시스템
│   └── threats.md              # 위협 요소
│
├── 07-balance/                  # 밸런스
│   └── balance.md              # 수치 초안
│
├── 08-achievements/             # 업적
│   └── achievements.md         # 업적 시스템
│
├── 09-technical/                # 📂 기술 사양 (11개 모듈)
│   ├── _index.md               # 인덱스 + 빠른 참조
│   ├── a-tech-stack.md         # 프론트엔드 스택
│   ├── b-backend.md            # Supabase
│   ├── c-performance.md        # 성능 최적화
│   ├── d-engine.md             # 게임 엔진, ECS
│   ├── e-save-system.md        # 저장 시스템
│   ├── f-security.md           # 보안
│   ├── g-devops.md             # CI/CD, 테스트
│   ├── h-loading.md            # 로딩 시퀀스
│   ├── i-accessibility.md      # 기술적 접근성
│   ├── j-platform.md           # 크로스플랫폼
│   └── k-error-handling.md     # 에러 처리
│
├── 10-audio/                    # 📂 오디오 (6개 모듈)
│   ├── _index.md               # 인덱스 + 빠른 참조
│   ├── a-design.md             # MARS 디자인 철학
│   ├── b-bgm.md                # 적응형 BGM
│   ├── c-sfx.md                # 효과음 (120+)
│   ├── d-ambience-spatial.md   # 환경음, 공간 오디오
│   ├── e-optimization.md       # 최적화
│   └── f-implementation.md     # Howler.js 구현
│
├── 11-localization/             # 📂 현지화 (6개 모듈)
│   ├── _index.md               # 인덱스 + 빠른 참조
│   ├── a-philosophy.md         # GLOBAL 프레임워크
│   ├── b-architecture.md       # i18n 구조
│   ├── c-glossary-culture.md   # 용어집, 문화 적응
│   ├── d-grammar-fonts.md      # 문법, 폰트
│   ├── e-qa-community.md       # 번역 QA
│   └── f-implementation.md     # i18next 구현
│
└── 12-marketing/                # 마케팅
    └── market-strategy.md      # 타겟 유저, 경쟁 분석
```

---

## 🗂️ Table of Contents

| #      | 폴더               | 문서                                                 | 설명                            |
| :----- | :----------------- | :--------------------------------------------------- | :------------------------------ |
| **0**  | `00-foundation/`   | [MVP 정의](./00-foundation/mvp-definition.md)        | ⭐ MVP 범위 (M1+M2), 성공 기준  |
|        |                    | [기술 검증](./00-foundation/tech-validation.md)      | PixiJS 벤치마크                 |
| **1**  | `01-concept/`      | [Core Concept](./01-concept/core-concept.md)         | 스토리, 디자인 철학, 세계관     |
| **2**  | `02-mechanics/`    | [Game Mechanics](./02-mechanics/game-mechanics.md)   | 자원, 건물 50종, 물류, 발효공학 |
| **3**  | `03-visual-ux/`    | [**\_index.md**](./03-visual-ux/_index.md)           | 📂 8개 모듈 인덱스              |
| **4**  | `04-progression/`  | [**\_index.md**](./04-progression/_index.md)         | 📂 6개 모듈 인덱스              |
| **5**  | `05-onboarding/`   | [Onboarding](./05-onboarding/onboarding.md)          | FTUE, 튜토리얼                  |
| **6**  | `06-threats/`      | [Threats](./06-threats/threats.md)                   | 위협 요소                       |
| **7**  | `07-balance/`      | [Balance](./07-balance/balance.md)                   | 밸런스 수치                     |
| **8**  | `08-achievements/` | [Achievements](./08-achievements/achievements.md)    | 업적 시스템                     |
| **9**  | `09-technical/`    | [**\_index.md**](./09-technical/_index.md)           | 📂 11개 모듈 인덱스             |
| **10** | `10-audio/`        | [**\_index.md**](./10-audio/_index.md)               | 📂 6개 모듈 인덱스              |
| **11** | `11-localization/` | [**\_index.md**](./11-localization/_index.md)        | 📂 6개 모듈 인덱스              |
| **12** | `12-marketing/`    | [Market Strategy](./12-marketing/market-strategy.md) | 마케팅 전략                     |

---

## 🤖 AI 컨텍스트 활용 가이드

### 빠른 시작

```
# 전체 개요가 필요할 때
→ _ai-context/QUICK_START.md

# 특정 주제만 필요할 때 (권장)
→ 해당 폴더의 _index.md 또는 개별 모듈
```

### 추천 컨텍스트 조합

| 작업              | 포함할 문서                                                          |
| :---------------- | :------------------------------------------------------------------- |
| **MVP 개발 시작** | `00-foundation/mvp-definition.md` + `04-progression/c-milestones.md` |
| **UI 구현**       | `03-visual-ux/_index.md` + 필요한 서브모듈                           |
| **기술 아키텍처** | `09-technical/_index.md` + `a-tech-stack.md`                         |
| **게임 밸런스**   | `04-progression/_index.md` + `07-balance/balance.md`                 |
| **현지화 구현**   | `11-localization/f-implementation.md`                                |

### 파일 명명 규칙

- `_index.md` : 해당 폴더의 인덱스 (빠른 참조 테이블 포함)
- `a-`, `b-`, ... : 섹션 순서대로 정렬된 모듈

---

## Quick Reference

### 마일스톤 요약 (1회차 ~50시간)

| 단계 | 이름        | 핵심 해금                  | 누적 시간     | 범위           |
| :--- | :---------- | :------------------------- | :------------ | :------------- |
| M1   | 수동 단계   | 기초 채굴, 온실, 화력 발전 | 1-2시간       | ✅ **MVP**     |
| M2   | 자동 채집   | 컨베이어, 투입기, 연구소   | 4-7시간       | ✅ **MVP**     |
| M3   | 가공 자동화 | 발효실, 고속 물류, 드론    | 12-19시간     | 🔜 Post-Launch |
| M4   | 역수출 시대 | 발사대, 우주 물류, 묵은지  | 27-44시간     | 🔜 Post-Launch |
| M5   | 성간 도약   | 핵융합, 우주선, 프레스티지 | **42-64시간** | 🔜 Post-Launch |

### 핵심 자원 계층

```
Tier 0: 원자재 (광물, 얼음, 작물)
    ↓
Tier 1: 중간재 (철판, 소금, 양념)
    ↓
Tier 2: 완제품 (김치 6종)
    ↓
Tier 3: 연구 자원 (🔬, 🧬, 🧫)
```

### 기술 스택 로드맵

| Phase         | 목표               | 기술 스택                |
| :------------ | :----------------- | :----------------------- |
| **Phase 1**   | 웹 MVP             | JS/TS + PixiJS + Vite    |
| **Phase 1.5** | Steam Early Access | Electron + steamworks.js |
| **Phase 2**   | Steam 정식         | **Godot 4** ⭐           |
| **Phase 3**   | 멀티플랫폼         | Godot Export             |

---

## Notes

- 원본 통합 문서: [`../kimchi-invasion.md`](../kimchi-invasion.md)
- 문서 폴더화: 2026-01-19 (AI 컨텍스트 효율성 최적화)
- 총 **50개 문서** → **13개 폴더**로 체계화
