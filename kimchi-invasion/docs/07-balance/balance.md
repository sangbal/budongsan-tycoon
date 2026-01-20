# 7. 밸런스 수치 (Balance Specification)

> **Last Updated:** 2026-01-19

[← 목차로 돌아가기](./README.md) | [← 이전: Threats](./06-threats.md)

---

## 7.1. 밸런스 설계 철학 (Balance Philosophy)

### 7.1.1. 핵심 원칙

> **"완벽한 밸런스는 없다. 하지만 의도된 밸런스는 있다."**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ⚖️ 밸런스 설계 원칙 (The DEPTH Framework)                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  D - Deterministic Progression (결정적 진행)                                │
│      • 플레이어의 노력이 예측 가능한 결과로 이어짐                          │
│      • 랜덤 요소는 보너스, 핵심 진행은 확정적                               │
│      • 막힘 없는 진행 보장 (단, 비효율은 허용)                              │
│                                                                             │
│  E - Exponential with Anchors (지수적 성장 + 앵커)                          │
│      • 기본 성장은 지수적 (팩토리오 스타일)                                 │
│      • 마일스톤이 앵커 역할 (급격한 점프 방지)                              │
│      • 무한 스케일링 가능하지만 의미 있는 구간 존재                         │
│                                                                             │
│  P - Parallel Paths (병렬 경로)                                             │
│      • 단일 최적해가 아닌 다양한 전략 허용                                  │
│      • "정답"보다 "선택"이 재미                                             │
│      • 특화 vs 범용 트레이드오프                                            │
│                                                                             │
│  T - Time-Gated Content (시간 게이트 콘텐츠)                                │
│      • 초반 러시 방지 (최소 플레이 시간 보장)                               │
│      • 발효 시간 = 자연스러운 시간 게이트                                   │
│      • 50시간 1회차 목표 달성을 위한 페이싱                                 │
│                                                                             │
│  H - Horizontal Scaling (수평적 확장)                                       │
│      • 단순 수직 업그레이드보다 병렬 생산 라인 선호                         │
│      • 더 큰 숫자가 아닌 더 넓은 공장                                       │
│      • 물류 복잡도가 핵심 도전                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.1.2. 50시간 1회차 설계

```javascript
// 1회차 플레이타임 목표
const PLAYTHROUGH_DESIGN = {
  target_first_playthrough: {
    minimum: 42 * 60, // 42시간 (분)
    optimal: 50 * 60, // 50시간
    maximum: 64 * 60, // 64시간 (탐험형 플레이어)
  },

  time_distribution: {
    M1_manual: { min: 60, max: 120 }, // 1-2시간
    M2_automation: { min: 180, max: 360 }, // 3-6시간
    M3_processing: { min: 480, max: 720 }, // 8-12시간
    M4_export: { min: 900, max: 1500 }, // 15-25시간
    M5_interstellar: { min: 900, max: 1200 }, // 15-20시간
  },

  // 2회차 이후는 40-60% 단축
  subsequent_playthrough_factor: 0.5,
}
```

### 7.1.3. 성장 곡선 모델

```
자원/시간
    ↑
    │                                              ████ M5
    │                                         █████
    │                                    ██████
    │                               ██████     ← 지수적 성장
    │                          █████
    │                     █████
    │                █████
    │           █████
    │      █████
    │  ████
    │██──────────────────────────────────────────────────────→ 시간
      M1    M2         M3              M4              M5

  성장률 공식: output = base × (1 + upgrade_level)^1.5 × efficiency_bonus
```

---

## 7.2. 시간 수치 (Time Values)

### 7.2.1. 생산 시간표 (50시간 기준)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ⏱️ 생산 시간 명세                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ◆ 재배 (Agriculture) - 기본 온실 기준                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 작물           │ 재배 시간 │ 수확량 │ 물 소비 │ 특수 조건            │   │
│  ├────────────────┼───────────┼────────┼─────────┼──────────────────────┤   │
│  │ 배추           │ 90s       │ 1개    │ 3L      │ -                    │   │
│  │ 무             │ 60s       │ 2개    │ 2L      │ -                    │   │
│  │ 파             │ 45s       │ 3개    │ 1L      │ -                    │   │
│  │ 오이           │ 75s       │ 1개    │ 4L      │ -                    │   │
│  │ 고추           │ 70s       │ 2개    │ 2L      │ 온도 20°C+           │   │
│  │ 마늘           │ 80s       │ 4개    │ 2L      │ -                    │   │
│  │ 양파           │ 85s       │ 2개    │ 3L      │ M3+ 해금             │   │
│  │ 생강           │ 120s      │ 1개    │ 5L      │ M4+ 해금, 희귀       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◆ 1차 가공 (Primary Processing)                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 공정           │ 시간   │ 입력              │ 출력          │ 전력   │   │
│  ├────────────────┼────────┼───────────────────┼───────────────┼────────┤   │
│  │ 얼음 해동      │ 15s    │ 얼음 ×1           │ 물 ×5         │ 5kW    │   │
│  │ 소금 증류      │ 30s    │ 물 ×10            │ 소금 ×1       │ 15kW   │   │
│  │ 건조           │ 20s    │ 고추 ×2           │ 건고추 ×1     │ 10kW   │   │
│  │ 분쇄           │ 15s    │ 건고추 ×1         │ 고춧가루 ×1   │ 8kW    │   │
│  │ 추출           │ 25s    │ 마늘 ×4           │ 마늘즙 ×1     │ 12kW   │   │
│  │ 젓갈 발효      │ 120s   │ 생선 ×5, 소금 ×2  │ 젓갈 ×1       │ 5kW    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◆ 2차 가공 (Secondary Processing)                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 공정           │ 시간   │ 입력                  │ 출력          │       │
│  ├────────────────┼────────┼───────────────────────┼───────────────┤       │
│  │ 배추 절임      │ 45s    │ 배추 ×1, 소금 ×2     │ 절인배추 ×1   │       │
│  │ 무 절임        │ 35s    │ 무 ×2, 소금 ×1       │ 절인무 ×1     │       │
│  │ 오이 절임      │ 40s    │ 오이 ×1, 소금 ×1     │ 절인오이 ×1   │       │
│  │ 양념 배합      │ 30s    │ 고춧가루, 마늘즙, 젓갈 │ 양념 ×1       │       │
│  │ 프리미엄 양념  │ 60s    │ 양념 ×1, 생강 ×1     │ 특양념 ×1     │       │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◆ 발효 (Fermentation) - 핵심 시간 게이트                                   │
│  📎 참고: [김치 제품 총괄표](./02-game-mechanics.md#213-김치-제품-총괄표-6종) │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 김치 종류      │ 발효 시간 │ 재료                   │ 품질 배수    │   │
│  ├────────────────┼───────────┼────────────────────────┼──────────────┤   │
│  │ 배추김치       │ 90s       │ 절인배추 ×1, 양념 ×1   │ 1.0x         │   │
│  │ 깍두기         │ 60s       │ 절인무 ×1, 양념 ×0.5   │ 1.0x         │   │
│  │ 파김치         │ 45s       │ 파 ×3, 양념 ×1.5       │ 1.0x         │   │
│  │ 오이소박이     │ 75s       │ 절인오이 ×1, 양념 ×1   │ 1.2x         │   │
│  │ 갓김치         │ 80s       │ 갓 ×2, 양념 ×1         │ 1.3x (M4+)   │   │
│  │ 묵은지 (6개월) │ 300s      │ 배추김치 ×1            │ 2.5x         │   │
│  │ 묵은지 (1년)   │ 600s      │ 배추김치 ×1            │ 4.0x         │   │
│  │ 프리미엄 김치  │ 150s      │ 절인배추 ×1, 특양념 ×1 │ 2.0x         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◆ 최종 가공 (Final Processing)                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 공정           │ 시간   │ 입력              │ 출력              │       │
│  ├────────────────┼────────┼───────────────────┼───────────────────┤       │
│  │ 포장           │ 15s    │ 김치 ×1, 캔 ×1    │ 포장김치 ×1       │       │
│  │ 진공 포장      │ 25s    │ 김치 ×1, 진공팩 ×1│ 진공김치 ×1       │       │
│  │ 김치 주스 착즙 │ 45s    │ 김치 ×3           │ 김치주스 ×1       │       │
│  │ 김치 분말화    │ 90s    │ 묵은지 ×2         │ 김치분말 ×1       │       │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2.2. 공업 생산 시간표

```javascript
// 공업 생산 시간
const INDUSTRIAL_PRODUCTION = {
  // 기초 자원
  mining: {
    iron_ore: { time: 10, output: 1, power: 5 },
    copper_ore: { time: 12, output: 1, power: 5 },
    coal: { time: 8, output: 1, power: 3 },
    ice: { time: 15, output: 1, power: 8 },
    rare_mineral: { time: 60, output: 1, power: 20 },
  },

  // 1차 가공
  smelting: {
    iron_plate: { time: 25, input: { iron_ore: 2 }, output: 1, power: 20 },
    copper_plate: { time: 25, input: { copper_ore: 2 }, output: 1, power: 20 },
    steel: { time: 45, input: { iron_plate: 5 }, output: 1, power: 35 },
    glass: { time: 30, input: { sand: 5 }, output: 1, power: 25 },
  },

  // 2차 가공
  manufacturing: {
    gear: { time: 15, input: { iron_plate: 2 }, output: 1, power: 10 },
    wire: { time: 10, input: { copper_plate: 1 }, output: 2, power: 5 },
    circuit: { time: 20, input: { wire: 3, iron_plate: 1 }, output: 1, power: 15 },
    motor: { time: 40, input: { gear: 2, circuit: 1, iron_plate: 3 }, output: 1, power: 25 },
    battery: { time: 50, input: { copper_plate: 2, iron_plate: 1, acid: 1 }, output: 1, power: 30 },
    chipset: { time: 90, input: { circuit: 5, rare_mineral: 1 }, output: 1, power: 50 },
  },

  // 고급 제작
  advanced: {
    drone_frame: { time: 120, input: { steel: 5, motor: 2, chipset: 1 }, output: 1, power: 40 },
    solar_cell: {
      time: 60,
      input: { glass: 2, copper_plate: 3, circuit: 2 },
      output: 1,
      power: 25,
    },
    rocket_part: { time: 180, input: { steel: 10, chipset: 5, motor: 3 }, output: 1, power: 100 },
  },
}
```

---

## 7.3. 생산 비율 (Production Ratios)

### 7.3.1. 배추김치 생산 라인 분석

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    📊 배추김치 1개 생산 완전 분석                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ◆ 자원 트리 (최종 제품 → 원재료)                                           │
│                                                                             │
│  배추김치 (1개)                                                             │
│  ├── 절인배추 (1개) ─────── 45s                                             │
│  │   ├── 배추 (1개) ─────── 90s                                             │
│  │   │   └── [씨앗 1, 흙 1, 물 3L]                                          │
│  │   └── 소금 (2개) ─────── 60s (30s × 2)                                   │
│  │       └── 물 (20L) ─────── 60s (15s × 4, 얼음 4개)                       │
│  │           └── 얼음 (4개) ─ 채굴                                          │
│  │                                                                          │
│  └── 양념 (1개) ──────────── 30s                                            │
│      ├── 고춧가루 (1개) ──── 35s (20s + 15s)                                │
│      │   └── 건고추 (1개)                                                   │
│      │       └── 고추 (2개) ── 140s (70s × 2)                               │
│      │           └── [씨앗 2, 흙 2, 물 4L]                                  │
│      ├── 마늘즙 (1개) ────── 25s                                            │
│      │   └── 마늘 (4개) ──── 80s                                            │
│      │       └── [씨앗 1, 흙 1, 물 2L]                                      │
│      └── 젓갈 (1개) ──────── 120s                                           │
│          └── 생선 (5개), 소금 (2개)                                         │
│                                                                             │
│  ◆ 시간 분석                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 경로                    │ 직렬 시간    │ 병목        │             │   │
│  ├─────────────────────────┼──────────────┼─────────────┼─────────────┤   │
│  │ 배추 → 절임 → 발효      │ 225s         │ 배추 재배   │             │   │
│  │ 고추 → 건조 → 분쇄 → 양념│ 205s         │ 고추 재배   │             │   │
│  │ 마늘 → 추출 → 양념      │ 105s         │ -           │             │   │
│  │ 생선 → 젓갈 → 양념      │ 150s         │ 젓갈 발효   │             │   │
│  │ 얼음 → 물 → 소금        │ 75s          │ -           │             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◆ 병목 분석 결과                                                           │
│  • 총 직렬 시간: ~315초 (최장 경로: 배추 라인)                              │
│  • 병렬 최적화 시: ~135초 (고추 라인이 실질적 병목)                         │
│  • 권장 비율: 배추 온실 3개 : 고추 온실 4개 : 마늘 온실 2개                 │
│                                                                             │
│  ◆ 시간당 최대 생산량 (최적화 라인)                                         │
│  • 단일 발효실: 40개/시간                                                   │
│  • 풀 생산 라인 (4발효실): 160개/시간                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3.2. 최적 생산 비율표

```javascript
// 최적 생산 비율 계산
const PRODUCTION_RATIOS = {
  // 배추김치 1개/분 생산 기준
  kimchi_line_standard: {
    target: '1 배추김치/분',
    facilities: {
      greenhouse_cabbage: 1.5, // 배추 온실
      greenhouse_chili: 2, // 고추 온실
      greenhouse_garlic: 1, // 마늘 온실
      pickling_station: 1, // 절임소
      dryer: 1, // 건조기
      grinder: 1, // 분쇄기
      extractor: 0.5, // 추출기
      seasoning_mixer: 1, // 양념 배합기
      fermentation_room: 1.5, // 발효실
    },
    power_required: 85, // kW
    water_per_minute: 15, // L
    space_tiles: 45, // 타일
  },

  // SPM (Sushi Per Minute) 목표별 스케일
  spm_targets: {
    beginner: { spm: 10, multiplier: 0.5 },
    intermediate: { spm: 30, multiplier: 1.5 },
    advanced: { spm: 60, multiplier: 3 },
    expert: { spm: 100, multiplier: 5 },
    megabase: { spm: 300, multiplier: 15 },
    legendary: { spm: 1000, multiplier: 50 },
  },
}
```

---

## 7.4. 경제 수치 (Economy Values)

### 7.4.1. 제품 판매가

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    💰 제품 판매가 & 수익성 분석                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ◆ 김치 제품 (지구 수출 기준)                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 제품           │ 기본가($) │ 원가($) │ 순이익 │ 난이도 │ 해금     │   │
│  ├────────────────┼───────────┼─────────┼────────┼────────┼──────────┤   │
│  │ 배추김치       │ $15       │ $3      │ $12    │ ★☆☆   │ M2       │   │
│  │ 깍두기         │ $18       │ $2.5    │ $15.5  │ ★☆☆   │ M2       │   │
│  │ 파김치         │ $22       │ $4      │ $18    │ ★★☆   │ M2       │   │
│  │ 오이소박이     │ $30       │ $5      │ $25    │ ★★☆   │ M3       │   │
│  │ 갓김치         │ $35       │ $6      │ $29    │ ★★★   │ M4       │   │
│  │ 묵은지 (6개월) │ $60       │ $15     │ $45    │ ★★★   │ M3       │   │
│  │ 묵은지 (1년)   │ $120      │ $15     │ $105   │ ★★★★  │ M4       │   │
│  │ 프리미엄 김치  │ $50       │ $10     │ $40    │ ★★★   │ M4       │   │
│  │ 김치 주스      │ $180      │ $45     │ $135   │ ★★★★  │ M4       │   │
│  │ 김치 분말      │ $300      │ $100    │ $200   │ ★★★★★ │ M5       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◆ 가격 변동 요인                                                           │
│  • 지구 수요 이벤트: ±30%                                                   │
│  • 품질 등급: 일반 1.0x / 고급 1.3x / 명품 1.6x / 전설 2.0x                │
│  • 대량 계약: 100개+ 시 +10%, 1000개+ 시 +25%                               │
│  • 시즌 보너스: 김장철(11-12월) +20%                                        │
│                                                                             │
│  ◆ 시간당 수익 목표 (마일스톤별)                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 마일스톤 │ 목표 수익/시간 │ 주요 수입원           │ 누적 자산      │   │
│  ├──────────┼────────────────┼───────────────────────┼────────────────┤   │
│  │ M1       │ $100-300       │ 원자재 판매           │ $500           │   │
│  │ M2       │ $500-1,500     │ 배추김치, 깍두기      │ $5,000         │   │
│  │ M3       │ $3,000-8,000   │ 다종 김치, 묵은지     │ $50,000        │   │
│  │ M4       │ $15,000-40,000 │ 프리미엄, 주스        │ $500,000       │   │
│  │ M5       │ $100,000+      │ 김치분말, 대량계약    │ $5,000,000     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.4.2. 건설 비용 체계

```javascript
// 건물 건설 비용
const BUILDING_COSTS = {
  // Tier 1: 기초 시설 (M1)
  tier1: {
    manual_miner: { money: 50, materials: { iron_plate: 5 } },
    basic_greenhouse: { money: 150, materials: { iron_plate: 10, glass: 5 } },
    storage_box: { money: 30, materials: { iron_plate: 3 } },
    coal_generator: { money: 200, materials: { iron_plate: 15, copper_plate: 5 } },
    water_pump: { money: 100, materials: { iron_plate: 8 } },
  },

  // Tier 2: 자동화 시설 (M2)
  tier2: {
    electric_miner: { money: 300, materials: { iron_plate: 20, motor: 1 } },
    advanced_greenhouse: { money: 400, materials: { iron_plate: 25, glass: 15, circuit: 2 } },
    conveyor_belt: { money: 20, materials: { iron_plate: 2 } },
    fast_belt: { money: 50, materials: { iron_plate: 3, gear: 1 } },
    inserter: { money: 80, materials: { iron_plate: 5, circuit: 1 } },
    pickling_station: { money: 350, materials: { iron_plate: 20, copper_plate: 10 } },
    basic_fermentation: { money: 500, materials: { iron_plate: 30, battery: 2 } },
    research_lab: { money: 600, materials: { iron_plate: 40, circuit: 5, glass: 10 } },
    solar_panel: { money: 250, materials: { iron_plate: 10, solar_cell: 2 } },
  },

  // Tier 3: 가공 자동화 (M3)
  tier3: {
    express_belt: { money: 100, materials: { iron_plate: 5, gear: 2, motor: 1 } },
    fast_inserter: { money: 150, materials: { iron_plate: 8, circuit: 3 } },
    advanced_fermentation: { money: 1500, materials: { steel: 20, battery: 5, chipset: 2 } },
    drone_hub: { money: 3000, materials: { steel: 30, drone_frame: 3, chipset: 5 } },
    seasoning_factory: { money: 800, materials: { steel: 15, motor: 3 } },
    mega_storage: { money: 500, materials: { steel: 25 } },
    solar_array: { money: 1000, materials: { steel: 20, solar_cell: 10 } },
  },

  // Tier 4: 역수출 시대 (M4)
  tier4: {
    launch_pad: { money: 8000, materials: { steel: 100, chipset: 20, rocket_part: 5 } },
    cargo_rocket: { money: 15000, materials: { steel: 200, chipset: 50, rocket_part: 20 } },
    advanced_research_lab: { money: 5000, materials: { steel: 50, chipset: 15, rare_mineral: 10 } },
    nuclear_reactor: { money: 20000, materials: { steel: 150, chipset: 30, rare_mineral: 50 } },
    aged_kimchi_cellar: { money: 3000, materials: { steel: 40, glass: 30 } },
  },

  // Tier 5: 성간 도약 (M5)
  tier5: {
    space_terminal: { money: 50000, materials: { steel: 500, chipset: 100, rocket_part: 50 } },
    fusion_reactor: { money: 100000, materials: { steel: 300, chipset: 200, rare_mineral: 100 } },
    interstellar_ship: {
      money: 200000,
      materials: { rocket_part: 200, chipset: 150, rare_mineral: 200 },
    },
  },
}

// 비용 스케일링
const COST_SCALING = {
  // 동일 건물 추가 건설 시
  duplicate_penalty: count => Math.pow(1.1, count - 1),

  // 마일스톤별 인플레이션
  milestone_inflation: {
    M1: 1.0,
    M2: 1.0,
    M3: 1.2,
    M4: 1.5,
    M5: 2.0,
  },
}
```

### 7.4.3. 연구 비용

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🔬 연구 비용 & 시간                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ◆ 연구 자원 (3단계 계층)                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 자원               │ 획득 방법              │ 사용처        │ 해금   │   │
│  ├────────────────────┼────────────────────────┼───────────────┼────────┤   │
│  │ 유산균 데이터      │ 발효 시 5% 확률        │ T1-T3 연구   │ M2     │   │
│  │ 발효 배양액        │ 묵은지 발효 부산물     │ T3-T4 연구   │ M3     │   │
│  │ 오메가 종균        │ 희귀 발효 이벤트       │ T5 연구      │ M4     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◆ 연구 트리 비용 요약 (대표적 기술)                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 기술               │ 유산균   │ 배양액 │ 오메가 │ 시간   │ 티어    │   │
│  ├────────────────────┼──────────┼────────┼────────┼────────┼─────────┤   │
│  │ 자동화 기초        │ 20       │ -      │ -      │ 60s    │ T1      │   │
│  │ 고속 벨트          │ 50       │ -      │ -      │ 120s   │ T1      │   │
│  │ 발효 효율 I        │ 80       │ 5      │ -      │ 180s   │ T2      │   │
│  │ 드론 물류          │ 150      │ 20     │ -      │ 300s   │ T2      │   │
│  │ 묵은지 숙성 가속   │ 200      │ 50     │ -      │ 450s   │ T3      │   │
│  │ 우주 물류          │ 300      │ 100    │ 5      │ 600s   │ T3      │   │
│  │ 핵융합 발전        │ 500      │ 200    │ 20     │ 900s   │ T4      │   │
│  │ 성간 항해          │ 1000     │ 500    │ 100    │ 1800s  │ T5      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◆ 연구 속도 보너스                                                         │
│  • 연구소 추가: +25%/개 (최대 4개, +100%)                                   │
│  • 연구원 배치: +10%/인                                                     │
│  • 프레스티지 보너스: +5%/회 (누적)                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.5. 물류 수치 (Logistics Values)

### 7.5.1. 운송 시스템

```javascript
// 물류 시스템 상세
const LOGISTICS_SYSTEM = {
  belts: {
    basic_belt: {
      speed: 15, // 아이템/분
      power: 0, // 수동
      cost_per_tile: 20,
      unlock: 'M1',
    },
    fast_belt: {
      speed: 30,
      power: 1, // kW/10타일
      cost_per_tile: 50,
      unlock: 'M2',
    },
    express_belt: {
      speed: 45,
      power: 2,
      cost_per_tile: 100,
      unlock: 'M3',
    },
    vacuum_tube: {
      speed: 60,
      power: 5,
      cost_per_tile: 200,
      sealed: true, // 환경 보호
      unlock: 'M4',
    },
  },

  inserters: {
    burner_inserter: {
      speed: 30, // 아이템/분
      power: 0,
      fuel_consumption: 0.5, // 석탄/분
      unlock: 'M1',
    },
    basic_inserter: {
      speed: 45,
      power: 2,
      unlock: 'M2',
    },
    fast_inserter: {
      speed: 90,
      power: 5,
      unlock: 'M3',
    },
    stack_inserter: {
      speed: 45,
      stack_size: 4, // 4개씩 이동
      power: 8,
      unlock: 'M4',
    },
  },

  drones: {
    logistics_drone: {
      speed: 100, // 타일/분
      capacity: 4, // 아이템
      range: 50, // 타일
      power_per_flight: 10, // kW
      unlock: 'M3',
    },
    cargo_drone: {
      speed: 80,
      capacity: 20,
      range: 100,
      power_per_flight: 25,
      unlock: 'M4',
    },
  },

  storage: {
    wooden_chest: { capacity: 100, unlock: 'M1' },
    iron_chest: { capacity: 200, unlock: 'M1' },
    steel_chest: { capacity: 500, unlock: 'M2' },
    warehouse: { capacity: 2000, unlock: 'M3' },
    logistics_warehouse: { capacity: 5000, drone_compatible: true, unlock: 'M4' },
  },
}
```

### 7.5.2. 처리량 계산

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    📦 처리량 병목 분석                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ◆ 벨트 용량 대비 생산 건물                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 벨트 타입        │ 용량/분 │ 온실 지원 │ 발효실 지원 │ 공장 지원  │   │
│  ├──────────────────┼─────────┼───────────┼─────────────┼────────────┤   │
│  │ 기본 벨트        │ 15      │ 2개       │ 1개         │ 1개        │   │
│  │ 고속 벨트        │ 30      │ 4개       │ 2개         │ 2개        │   │
│  │ 초고속 벨트      │ 45      │ 6개       │ 3개         │ 3개        │   │
│  │ 진공 튜브        │ 60      │ 8개       │ 4개         │ 4개        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◆ 병목 탐지 규칙                                                           │
│  • 벨트 적재율 > 80%: 황색 경고                                             │
│  • 벨트 적재율 > 95%: 적색 경고 (병목)                                      │
│  • 건물 입력 버퍼 0: 기아 상태 (업스트림 병목)                              │
│  • 건물 출력 버퍼 100%: 막힘 상태 (다운스트림 병목)                         │
│                                                                             │
│  ◆ 최적화 공식                                                              │
│  필요 벨트 수 = ceil(총_출력/분 ÷ 벨트_용량)                                │
│  필요 인서터 수 = ceil(건물_입력량/분 ÷ 인서터_속도)                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.6. 에너지 수치 (Energy Values)

### 7.6.1. 발전 시스템

```javascript
// 발전 시설
const POWER_GENERATION = {
  // Tier 1
  coal_burner: {
    output: 50, // kW
    fuel: 'coal',
    consumption: 1, // /분
    efficiency: 0.5, // 50%
    pollution: 10,
    unlock: 'M1',
  },

  // Tier 2
  solar_panel: {
    output: 25, // kW (낮)
    output_night: 0,
    efficiency: 1.0,
    footprint: 4, // 타일
    unlock: 'M2',
  },
  solar_array: {
    output: 100, // kW (낮)
    output_night: 0,
    efficiency: 1.0,
    footprint: 16,
    unlock: 'M3',
  },
  battery_pack: {
    capacity: 500, // kWh
    charge_rate: 50, // kW
    discharge_rate: 100, // kW
    efficiency: 0.9,
    unlock: 'M3',
  },

  // Tier 3
  geothermal: {
    output: 200, // kW (24시간)
    efficiency: 0.8,
    footprint: 9,
    location_required: 'geothermal_vent',
    unlock: 'M4',
  },

  // Tier 4-5
  nuclear_reactor: {
    output: 1000, // kW
    fuel: 'nuclear_fuel',
    consumption: 0.1, // /분
    efficiency: 0.7,
    cooling_required: true,
    unlock: 'M4',
  },
  fusion_reactor: {
    output: 5000, // kW
    fuel: 'deuterium',
    consumption: 0.01, // /분
    efficiency: 0.95,
    unlock: 'M5',
  },
}

// 전력 소비
const POWER_CONSUMPTION = {
  // 건물별 소비량 (kW)
  buildings: {
    electric_miner: 10,
    advanced_greenhouse: 15,
    pickling_station: 12,
    fermentation_room: 20,
    advanced_fermentation: 35,
    research_lab: 25,
    seasoning_factory: 18,
    drone_hub: 50,
    launch_pad: 100, // 발사 시 500
    space_terminal: 200,
  },

  // 물류 (총합)
  logistics: {
    per_100_belt_tiles: 5,
    per_10_inserters: 3,
    per_drone: 2, // 대기 상태
  },
}
```

### 7.6.2. 에너지 밸런스 가이드

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ⚡ 마일스톤별 에너지 예산                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ◆ 권장 전력 구성                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 마일스톤 │ 소비 예상  │ 권장 발전                  │ 비축        │   │
│  ├──────────┼────────────┼────────────────────────────┼─────────────┤   │
│  │ M1       │ 50-100kW   │ 석탄 ×3                    │ 20%         │   │
│  │ M2       │ 150-300kW  │ 석탄 ×4 + 태양광 ×8       │ 25%         │   │
│  │ M3       │ 500-1000kW │ 태양광 어레이 ×8 + 배터리 │ 30%         │   │
│  │ M4       │ 2-5MW      │ 핵 ×2 + 지열 ×4           │ 35%         │   │
│  │ M5       │ 10-20MW    │ 핵융합 ×3                  │ 40%         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◆ 에너지 위기 단계                                                         │
│  • 90-100%: 정상                                                            │
│  • 80-90%: 황색 경고 "전력 여유 부족"                                       │
│  • 60-80%: 주황색 경고 "전력 부족 임박"                                     │
│  • 40-60%: 적색 경고 + 비필수 시설 자동 차단                                │
│  • < 40%: 브라운아웃 - 모든 시설 50% 효율                                   │
│  • < 20%: 블랙아웃 - 핵심 시설만 운영                                       │
│                                                                             │
│  ◆ 야간 에너지 전략                                                         │
│  • 배터리 용량 = 야간 소비 × 0.5 (8시간 중 4시간분)                         │
│  • 또는 연료 발전 백업 (석탄/핵)                                            │
│  • 지열은 24시간 안정 공급 (위치 제한)                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.7. 프레스티지 경제 (Prestige Economy)

### 7.7.1. 우주선 구매 시스템

```javascript
// 프레스티지 우주선
const PRESTIGE_SHIPS = {
  pioneer: {
    name: '개척자호',
    cost: 100000,
    loadout_slots: 3,
    cargo_space: 10,
    speed_bonus: 0,
    unlock: 'first_prestige',
  },
  voyager: {
    name: '항해자호',
    cost: 500000,
    loadout_slots: 5,
    cargo_space: 25,
    speed_bonus: 0.1,
    unlock: 'prestige_3',
  },
  enterprise: {
    name: '대업호',
    cost: 2000000,
    loadout_slots: 8,
    cargo_space: 50,
    speed_bonus: 0.2,
    unlock: 'prestige_10',
  },
  legacy: {
    name: '유산호',
    cost: 10000000,
    loadout_slots: 12,
    cargo_space: 100,
    speed_bonus: 0.3,
    unlock: 'prestige_30',
  },
}

// 로드아웃 아이템
const LOADOUT_ITEMS = {
  // 기술 이전
  tech_core: {
    description: '연구 기술 1개 보존',
    cost_per_slot: 1,
  },
  tech_bundle: {
    description: '티어 전체 기술 보존',
    cost_per_slot: 3,
  },

  // 자원 이전
  resource_cache: {
    description: '자원 10,000 단위 이전',
    cost_per_slot: 1,
  },
  blueprint_data: {
    description: '블루프린트 1개 이전',
    cost_per_slot: 1,
  },

  // 영구 보너스
  production_boost: {
    description: '생산 속도 +2% (영구)',
    cost_per_slot: 2,
  },
  research_boost: {
    description: '연구 속도 +3% (영구)',
    cost_per_slot: 2,
  },
}
```

### 7.7.2. 프레스티지 보너스 누적

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🚀 프레스티지 보너스 누적표                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ◆ 기본 보너스 (자동 적용)                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 프레스티지 회차 │ 생산 속도 │ 연구 속도 │ 시작 자원 │ 특수 해금    │   │
│  ├─────────────────┼───────────┼───────────┼───────────┼──────────────┤   │
│  │ 1회             │ +5%       │ +3%       │ $1,000    │ -            │   │
│  │ 2회             │ +10%      │ +6%       │ $2,000    │ -            │   │
│  │ 3회             │ +15%      │ +9%       │ $3,000    │ 항해자호     │   │
│  │ 5회             │ +25%      │ +15%      │ $5,000    │ 챌린지 모드  │   │
│  │ 10회            │ +50%      │ +30%      │ $10,000   │ 대업호       │   │
│  │ 20회            │ +100%     │ +60%      │ $25,000   │ 크리에이티브 │   │
│  │ 30회            │ +150%     │ +90%      │ $50,000   │ 유산호       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◆ 무한 스케일링 (30회 이후)                                                │
│  • 생산 속도: +1%/회 (무한)                                                 │
│  • 연구 속도: +0.5%/회 (무한)                                               │
│  • 특수 마일스톤: 50회 (시간가속), 100회 (김치황제 칭호)                    │
│                                                                             │
│  ◆ 로드아웃 효과                                                            │
│  • 슬롯당 이전 기술: 다음 회차에서 즉시 해금                                │
│  • 자원 캐시: 시작 자원에 추가                                              │
│  • 블루프린트: 건설 패턴 즉시 사용 가능                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.8. 행성 파라미터 (Planet Parameters)

### 7.8.1. 행성 속성 시스템

```javascript
// 프레스티지 행성 생성
const PLANET_GENERATION = {
  // 기본 속성
  attributes: {
    fertility: {
      low: { crop_speed: 0.7, water_efficiency: 0.8 },
      medium: { crop_speed: 1.0, water_efficiency: 1.0 },
      high: { crop_speed: 1.3, water_efficiency: 1.2 },
    },
    mineral_richness: {
      poor: { ore_amount: 0.5, rare_chance: 0.01 },
      average: { ore_amount: 1.0, rare_chance: 0.05 },
      rich: { ore_amount: 1.5, rare_chance: 0.1 },
      abundant: { ore_amount: 2.0, rare_chance: 0.2 },
    },
    temperature: {
      frozen: { base_temp: -60, heating_cost: 1.5, crop_growth: 0.7 },
      cold: { base_temp: -30, heating_cost: 1.2, crop_growth: 0.9 },
      temperate: { base_temp: 0, heating_cost: 1.0, crop_growth: 1.0 },
      warm: { base_temp: 20, heating_cost: 0.8, crop_growth: 1.1 },
    },
    atmosphere: {
      thin: { dust_storm_chance: 1.5, solar_efficiency: 1.2 },
      normal: { dust_storm_chance: 1.0, solar_efficiency: 1.0 },
      thick: { dust_storm_chance: 0.5, solar_efficiency: 0.8 },
    },
    gravity: {
      low: { belt_speed: 1.2, jump_height: 1.5, energy_cost: 0.9 },
      normal: { belt_speed: 1.0, jump_height: 1.0, energy_cost: 1.0 },
      high: { belt_speed: 0.8, jump_height: 0.7, energy_cost: 1.2 },
    },
  },

  // 희귀 특성
  special_traits: {
    geothermal_active: { chance: 0.1, effect: 'geothermal_vents_available' },
    ancient_ruins: { chance: 0.05, effect: 'bonus_tech_discovery' },
    ice_planet: { chance: 0.1, effect: 'unlimited_ice_but_no_solar' },
    volcanic: { chance: 0.08, effect: 'rare_minerals_common_but_dangerous' },
    tidally_locked: { chance: 0.05, effect: 'permanent_day_or_night_zones' },
  },

  // 난이도 점수
  difficulty_score: planet => {
    let score = 0
    if (planet.fertility === 'low') score += 2
    if (planet.mineral_richness === 'poor') score += 2
    if (planet.temperature === 'frozen') score += 1
    if (planet.atmosphere === 'thin') score += 1
    return score
  },

  // 보상 배수
  reward_multiplier: difficulty => 1 + difficulty * 0.1,
}
```

---

## 7.9. 밸런스 테스트 전략 (Balance Testing)

### 7.9.1. 자동화 테스트 시나리오

```javascript
// 밸런스 테스트 스위트
const BALANCE_TESTS = {
  // 시나리오 테스트
  scenarios: {
    speedrun_test: {
      description: '최적화 플레이어 최단 클리어 시간',
      target: '35-45시간',
      auto_play: true,
      strategy: 'optimal',
      metrics: ['total_time', 'efficiency_score'],
    },
    casual_test: {
      description: '일반 플레이어 평균 클리어 시간',
      target: '50-60시간',
      auto_play: true,
      strategy: 'balanced',
      metrics: ['total_time', 'frustration_events'],
    },
    exploration_test: {
      description: '탐험형 플레이어 클리어 시간',
      target: '60-75시간',
      auto_play: true,
      strategy: 'completionist',
      metrics: ['total_time', 'content_coverage'],
    },
    stuck_detection: {
      description: '막힘 상태 감지',
      target: '0건',
      auto_play: true,
      metrics: ['dead_ends', 'softlocks', 'impossible_states'],
    },
  },

  // 경제 테스트
  economy: {
    inflation_check: {
      description: '마일스톤별 자산 증가율 검증',
      expected_growth: {
        M1_to_M2: { min: 5, max: 15 }, // 5-15배
        M2_to_M3: { min: 8, max: 20 },
        M3_to_M4: { min: 10, max: 30 },
        M4_to_M5: { min: 15, max: 50 },
      },
    },
    resource_bottleneck: {
      description: '자원 병목 발생 빈도',
      acceptable_rate: 0.1, // 10% 이하
      critical_resources: ['iron', 'water', 'power'],
    },
  },

  // 밸런스 지표
  kpis: {
    time_to_first_kimchi: { target: 600, tolerance: 120 }, // 10분 ± 2분
    time_to_automation: { target: 3600, tolerance: 600 }, // 1시간 ± 10분
    time_to_export: { target: 28800, tolerance: 3600 }, // 8시간 ± 1시간
    time_to_prestige: { target: 180000, tolerance: 18000 }, // 50시간 ± 5시간
  },
}
```

### 7.9.2. A/B 테스트 프레임워크

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🧪 A/B 테스트 설계                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ◆ 테스트 그룹                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 그룹       │ 변수                    │ 가설                        │   │
│  ├────────────┼─────────────────────────┼─────────────────────────────┤   │
│  │ Control    │ 현재 수치               │ 기준선                      │   │
│  │ Test A     │ 발효 시간 -20%          │ 더 빠른 피드백 선호?        │   │
│  │ Test B     │ 건설 비용 -15%          │ 더 넓은 공장 선호?          │   │
│  │ Test C     │ 연구 시간 +30%          │ 기다림이 성취감 증가?       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ◆ 측정 지표                                                                │
│  • Primary: D7 리텐션, 평균 플레이 시간                                     │
│  • Secondary: 프레스티지 도달률, 스토어 구매율                              │
│  • Guardrail: 이탈 시점, 불만 리포트                                        │
│                                                                             │
│  ◆ 샘플 크기 계산                                                           │
│  • 최소 효과 크기: 5%                                                       │
│  • 유의 수준: 0.05                                                          │
│  • 검정력: 0.8                                                              │
│  • 필요 샘플: 그룹당 ~3,000명                                               │
│                                                                             │
│  ◆ 롤아웃 전략                                                              │
│  • 1단계: 내부 테스트 (100명)                                               │
│  • 2단계: 소프트 런칭 (1,000명)                                             │
│  • 3단계: 전체 롤아웃 (승자 그룹)                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.10. 밸런스 조정 레버 (Balance Levers)

### 7.10.1. 핫픽스 가능 파라미터

```javascript
// 서버 사이드 조정 가능 파라미터
const REMOTE_CONFIG = {
  // 시간 조정
  time_multipliers: {
    crop_growth: 1.0,
    fermentation: 1.0,
    research: 1.0,
    shipping: 1.0,
  },

  // 경제 조정
  economy_multipliers: {
    sell_price: 1.0,
    build_cost: 1.0,
    research_cost: 1.0,
    energy_cost: 1.0,
  },

  // 드롭률
  drop_rates: {
    lacto_data: 0.05,
    ferment_culture: 0.02,
    omega_strain: 0.001,
  },

  // 이벤트 확률
  event_chances: {
    special_order: 0.1,
    price_surge: 0.05,
    disaster: 0.02,
  },

  // 프레스티지
  prestige: {
    bonus_per_level: 0.05,
    starting_money_multiplier: 1.0,
  },
}

// 조정 이력 기록
const BALANCE_CHANGELOG = {
  format: 'YYYY-MM-DD: parameter = old_value -> new_value (reason)',
  example: '2026-01-15: fermentation_time = 90s -> 75s (유저 피드백: 대기 지루)',
}
```

---

## 7.11. 밸런스 문서 버전

| 버전 | 날짜       | 주요 변경                 |
| :--- | :--------- | :------------------------ |
| v1.0 | 2026-01-18 | 초기 수치 설정            |
| v1.1 | -          | 플레이테스트 후 조정 예정 |

---

[다음: Achievements →](./08-achievements.md)
