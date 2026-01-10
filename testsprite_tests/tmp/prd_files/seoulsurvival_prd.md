# Seoul Survival (서울 생존기) - Product Requirements Document

## 1. Product Overview

**서울 생존기**는 한국의 사회경제적 현실을 반영한 증분(Incremental)/클리커 웹 게임입니다. 플레이어는 알바생으로 시작하여 노동, 투자, 부동산 구매를 통해 자산을 축적하고 CEO까지 성장합니다.

### 핵심 컨셉
- **노동 → 투자 → 자동화**: 클릭으로 월급을 벌고, 금융상품과 부동산에 투자하여 자동 수익 창출
- **프레스티지 시스템**: 서울타워(1조원) 구매 시 게임 리셋 + 영구 보너스
- **리더보드**: 실시간 순위 경쟁 (서울타워 개수 → 자산 순)

### 서비스 URL
- **Production**: `https://clicksurvivor.com/seoulsurvival/`
- **Development**: `http://localhost:5173/seoulsurvival/`

---

## 2. Core Features

### 2.1 노동 시스템 (Work System)
| 기능 | 설명 |
|------|------|
| 클릭 노동 | 화면 중앙 버튼 클릭 → 현금 획득 |
| 직급 시스템 | 10단계 (알바 → 계약직 → 사원 → 대리 → 과장 → 차장 → 부장 → 상무 → 전무 → CEO) |
| 승진 조건 | 누적 클릭 수 기반 (100 → 300 → 700 → 1200 → 2000 → 3500 → 5000 → 8000 → 12000) |
| 수익 배수 | 직급별 1x → 1.5x → 2x → 2.5x → 3x → 3.5x → 4x → 5x → 10x → 12x |
| 자동 클릭 | 업그레이드 구매 시 자동 노동 활성화 |

### 2.2 금융상품 투자 (Financial Investment)
| 상품 | 기본가격 | 초당수익 | 해금조건 |
|------|----------|----------|----------|
| 예금 | 5만원 | 50원/초 | 기본 해금 |
| 적금 | 50만원 | 750원/초 | 예금 1개 |
| 국내주식 | 500만원 | 11,250원/초 | 적금 1개 |
| 미국주식 | 2,500만원 | 60,000원/초 | 국내주식 1개 |
| 코인 | 1억원 | 250,000원/초 | 미국주식 1개 |

### 2.3 부동산 투자 (Real Estate)
| 상품 | 기본가격 | 초당월세 | 해금조건 |
|------|----------|----------|----------|
| 빌라 | 2.5억원 | 84,380원/초 | 코인 1개 |
| 오피스텔 | 3.5억원 | 177,190원/초 | 빌라 1개 |
| 아파트 | 8억원 | 607,500원/초 | 오피스텔 1개 |
| 상가 | 12억원 | 1,370,000원/초 | 아파트 1개 |
| 빌딩 | 30억원 | 5,140,000원/초 | 상가 1개 |
| 서울타워 | 1조원 | - (프레스티지) | 빌딩 1개 |

### 2.4 시장 이벤트 (Market Events)
- **호황(Bull)**: 금융상품 수익 +50% (30초)
- **불황(Bear)**: 금융상품 수익 -30% (30초)
- **랜덤 발생**: 게임 진행 중 확률적 발생

### 2.5 업그레이드 시스템
- **노동 효율**: 클릭당 수익 증가
- **월세 수익률**: 부동산 수익 증가
- **관리인 고용**: 자동 클릭 활성화

### 2.6 프레스티지 시스템
- **조건**: 서울타워 구매 (1조원)
- **효과**: 게임 리셋 + towers_lifetime 유지
- **리더보드**: towers_lifetime 개수 우선 순위

### 2.7 저장/로드 시스템
- **자동 저장**: 5초마다 LocalStorage
- **클라우드 저장**: Supabase (로그인 시)
- **수동 저장/불러오기**: 설정 탭에서 가능

### 2.8 리더보드
- **실시간 순위**: 30초마다 Supabase 동기화
- **순위 기준**: towers_lifetime > 총 자산

### 2.9 다국어 지원
- **한국어 (ko)**: 기본 언어
- **영어 (en)**: 전체 번역 지원
- **언어 전환**: URL 파라미터 또는 설정

---

## 3. User Interface Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Header: 로고 | 현금 | 초당수익 | 로그인/계정]              │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────┐  ┌─────────────────────┐            │
│ │     노동 섹션        │  │     투자 섹션        │            │
│ │  [직급: 알바]        │  │  [탭: 금융 | 부동산] │            │
│ │  [클릭 버튼]         │  │  [상품 목록]         │            │
│ │  [수익: +10,000원]   │  │  [구매/판매 버튼]    │            │
│ └─────────────────────┘  └─────────────────────┘            │
│ ┌─────────────────────┐  ┌─────────────────────┐            │
│ │    업그레이드 섹션    │  │    통계/리더보드     │            │
│ │  [노동 효율 업]       │  │  [통계 탭]           │            │
│ │  [월세 수익률 업]     │  │  [리더보드 탭]       │            │
│ └─────────────────────┘  │  [설정 탭]           │            │
│                          └─────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. User Flows

### 4.1 신규 플레이어 플로우
1. 게임 접속 → 알바 직급으로 시작
2. 노동 버튼 클릭 → 현금 획득 (+10,000원)
3. 예금 구매 (5만원) → 자동 수익 시작 (50원/초)
4. 적금 해금 (예금 1개 보유 시)
5. 반복: 클릭 → 투자 → 해금 → 승진

### 4.2 프레스티지 플로우
1. 1조원 자산 달성
2. 서울타워 구매
3. 확인 모달 표시
4. 프레스티지 실행: 게임 리셋 + towers_lifetime +1
5. 알바 직급으로 재시작

### 4.3 로그인 플로우
1. 헤더 로그인 버튼 클릭
2. Google OAuth 팝업
3. 인증 완료 → 클라우드 저장 동기화
4. 닉네임 설정 모달 (최초 1회)

---

## 5. Technical Stack

| 영역 | 기술 |
|------|------|
| Build | Vite 6.x |
| Language | Vanilla JavaScript (ES Modules) |
| UI Framework | 없음 (DOM 직접 조작) |
| State Management | `gameState.js` 중앙 집중식 |
| Backend | Supabase (Auth, Database, Storage) |
| Testing | Playwright (E2E), Vitest (Unit) |
| CI/CD | GitHub Actions → GitHub Pages |

---

## 6. Test Scope

### 6.1 Critical Paths (High Priority)
- [ ] 게임 로드 및 초기화
- [ ] 노동 버튼 클릭 → 현금 증가
- [ ] 금융상품 구매/판매
- [ ] 부동산 구매/판매
- [ ] 자동 수익 계산 (초당 수익)
- [ ] 직급 승진 시스템
- [ ] 저장/불러오기 (LocalStorage)

### 6.2 Important Features (Medium Priority)
- [ ] 상품 해금 조건
- [ ] 업그레이드 구매 및 효과
- [ ] 시장 이벤트 발생 및 효과
- [ ] 구매 수량 선택 (1/10/100)
- [ ] 다국어 전환

### 6.3 Edge Cases (Low Priority)
- [ ] 프레스티지 실행 및 리셋
- [ ] 클라우드 저장 동기화
- [ ] 리더보드 업데이트
- [ ] 오프라인 수익 계산

---

## 7. Key DOM Elements

### 7.1 Main Buttons
| ID/Class | 용도 |
|----------|------|
| `#workBtn` | 노동(클릭) 버튼 |
| `.financial-product .row` | 금융상품 행 |
| `.property-product .row` | 부동산 행 |
| `.upgrade-row` | 업그레이드 행 |

### 7.2 Display Elements
| ID/Class | 용도 |
|----------|------|
| `#cashDisplay` | 현금 표시 |
| `#rpsDisplay` | 초당 수익 표시 |
| `#careerName` | 현재 직급 표시 |
| `#totalClicks` | 총 클릭 수 표시 |

### 7.3 Tabs
| ID/Class | 용도 |
|----------|------|
| `[data-tab="financial"]` | 금융 탭 |
| `[data-tab="property"]` | 부동산 탭 |
| `[data-tab="stats"]` | 통계 탭 |
| `[data-tab="leaderboard"]` | 리더보드 탭 |
| `[data-tab="settings"]` | 설정 탭 |

### 7.4 Purchase Controls
| ID/Class | 용도 |
|----------|------|
| `[data-mode="buy"]` | 구매 모드 버튼 |
| `[data-mode="sell"]` | 판매 모드 버튼 |
| `[data-qty="1"]` | 1개 구매 |
| `[data-qty="10"]` | 10개 구매 |
| `[data-qty="100"]` | 100개 구매 |

---

## 8. Game State Variables

```javascript
// 핵심 상태 (seoulsurvival/src/state/gameState.js)
{
  cash: number,              // 현금
  totalClicks: number,       // 총 클릭 수
  careerLevel: number,       // 직급 레벨 (0-9)

  // 금융상품 보유량
  deposits: number,
  savings: number,
  bonds: number,
  usStocks: number,
  cryptos: number,

  // 부동산 보유량
  villas: number,
  officetels: number,
  apartments: number,
  shops: number,
  buildings: number,
  towers_run: number,
  towers_lifetime: number,

  // 업그레이드 배수
  clickMultiplier: number,
  rentMultiplier: number,
  autoClickEnabled: boolean,
}
```

---

## 9. API Endpoints (Supabase)

| 기능 | 테이블/함수 |
|------|-------------|
| 클라우드 저장 | `cloud_saves` |
| 리더보드 | `leaderboard` |
| 인증 | Supabase Auth (Google OAuth) |

---

## 10. Known Limitations

1. **오프라인 수익**: 현재 미구현 (탭 포커스 시에만 수익 발생)
2. **모바일 최적화**: 기본 지원, 터치 이벤트 최적화됨
3. **브라우저 지원**: Chrome, Firefox, Safari, Edge (최신 버전)

---

## 11. Version

- **Current Version**: 1.2.2 (`package.json`)
- **Last Updated**: 2025-01

