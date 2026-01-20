# KIMCHI INVASION - AI Quick Start Guide

> **목적:** AI가 프로젝트를 빠르게 이해하기 위한 핵심 요약
> **최종 수정:** 2026-01-19

---

## 🎮 게임 한 줄 요약

**화성에서 김치를 생산하여 지구로 역수출하는 Factorio 스타일 공장 자동화 게임**

---

## 📊 핵심 정보

| 항목                 | 값                                    |
| :------------------- | :------------------------------------ |
| **장르**             | Factory Automation + Idle Incremental |
| **플랫폼**           | Web (MVP) → Steam → Multi-Platform    |
| **1회차 플레이타임** | ~50시간                               |
| **MVP 범위**         | M1 + M2 (10-15시간)                   |
| **기술 스택**        | PixiJS + Vite + Zustand + Supabase    |

---

## 🏗️ 게임 구조

### 자원 계층 (Tier 0 → 3)

```
Tier 0: 원자재 ────────────────────────────────────────
        철광석, 얼음, 배추, 고추, 마늘

Tier 1: 중간재 ────────────────────────────────────────
        철판, 물, 소금, 고춧가루, 다진마늘

Tier 2: 완제품 ────────────────────────────────────────
        배추김치, 깍두기, 총각김치, 파김치, 오이소박이, 묵은지

Tier 3: 연구 자원 ─────────────────────────────────────
        🔬 유산균 데이터 (Tier 1-2)
        🧬 발효 배양액   (Tier 3-4)
        🧫 오메가 종균   (Tier 5)
```

### 마일스톤 (M1 → M5)

| 단계   | 이름        | 핵심 콘텐츠              | MVP |
| :----- | :---------- | :----------------------- | :-: |
| **M1** | 수동 단계   | 클릭 채굴, 기초 건물     | ✅  |
| **M2** | 자동 채집   | 컨베이어, 투입기, 연구소 | ✅  |
| **M3** | 가공 자동화 | 발효실, 드론, 태양광     | 🔜  |
| **M4** | 역수출 시대 | 우주 물류, 지구 수출     | 🔜  |
| **M5** | 성간 도약   | 우주선, 프레스티지       | 🔜  |

### 기술 트리 (Tier 1 → 5)

| Tier | 연구 자원 | 해금 예시                  |
| :--- | :-------- | :------------------------- |
| 1    | 🔬×40     | 채굴기, 온실, 화력발전     |
| 2    | 🔬×128    | 컨베이어, 연구소, 창고     |
| 3    | 🧬×59     | 발효실, 드론, 태양광       |
| 4    | 🧬×185    | 우주 물류, 포장기, 묵은지  |
| 5    | 🧫×40     | 핵융합, 우주선, 프레스티지 |

---

## 🔧 기술 스택

```
프론트엔드:
├── PixiJS 8.x     # 2D 렌더링
├── Vite 5.x       # 번들러
├── Zustand 4.x    # 상태 관리
├── Howler.js 2.x  # 오디오
└── i18next        # 다국어

백엔드:
├── Supabase       # DB + Auth + Storage
└── Edge Functions # 서버리스

배포:
├── Phase 1: Web (Vite)
├── Phase 1.5: Electron + Steam
└── Phase 2: Godot 4 리빌드 (권장)
```

---

## 📁 문서 구조 (13개 폴더)

| 폴더               | 핵심 내용              | AI 참조 시점    |
| :----------------- | :--------------------- | :-------------- |
| `00-foundation/`   | MVP 정의, 기술 검증    | 프로젝트 시작   |
| `01-concept/`      | 스토리, 세계관         | 내러티브 구현   |
| `02-mechanics/`    | 건물 50종, 물류, 발효  | 게임플레이 구현 |
| `03-visual-ux/`    | 디자인 시스템, 에셋    | UI 구현         |
| `04-progression/`  | 루프, 경제, 프레스티지 | 밸런스 조정     |
| `09-technical/`    | 아키텍처, 성능, 보안   | 기술 구현       |
| `10-audio/`        | BGM, SFX, 환경음       | 오디오 구현     |
| `11-localization/` | i18n, 번역             | 다국어 지원     |

---

## 🎯 AI 작업 시 권장 컨텍스트

### MVP 개발

```
00-foundation/mvp-definition.md
04-progression/c-milestones.md
09-technical/a-tech-stack.md
```

### UI/UX 구현

```
03-visual-ux/_index.md
03-visual-ux/a-design-system.md
03-visual-ux/b-layout.md
```

### 게임 밸런스

```
04-progression/_index.md
07-balance/balance.md
02-mechanics/game-mechanics.md
```

### 기술 아키텍처

```
09-technical/_index.md
09-technical/a-tech-stack.md
09-technical/d-engine.md
```

---

## ⚠️ 주의사항

1. **MVP 우선**: M1+M2만 구현, 나머지는 Post-Launch
2. **프레스티지**: 우주선 구매 시 새 행성으로 이주 (Loadout으로 기술 선택)
3. **Hard SF**: 과학적 논리 기반 (물 전기분해 → 산소/수소 등)
4. **용어**: Kimchi, Kimjang, Sol, Ares One은 번역하지 않음

---

## 🚀 개발 컨텍스트 (2026-01-19 시작)

### 현재 개발 상태

- **Phase:** Week 1 - 기술 기반 구축
- **진행 상황:** [PROGRESS.md](./PROGRESS.md) 참조

### 핵심 기술 결정

| 항목     | 결정               |
| :------- | :----------------- |
| 렌더링   | PixiJS 8.x         |
| 상태관리 | Zustand 4.x        |
| 언어     | JavaScript + JSDoc |
| 아키텍처 | ECS-Lite 패턴      |

### 새 세션 시작 시

1. `_ai-context/PROGRESS.md` 읽기 (현재 진행 상황)
2. 미완료 체크리스트 확인
3. 해당 작업 이어서 진행

### 개발 명령어

```bash
cd kimchi-invasion
npm run dev          # 개발 서버
npm run test:unit    # 단위 테스트
npm run build        # 프로덕션 빌드
```

---

## 🔗 상세 문서 링크

- [전체 목차](../README.md)
- [개발 계획서](../00-foundation/development-plan.md)
- [진행 상황](./PROGRESS.md)
- [MVP 정의](../00-foundation/mvp-definition.md)
- [용어집](./GLOSSARY.md)
