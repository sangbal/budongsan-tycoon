# Thought Engine 스킬 그룹

## 개요

복잡한 문제 해결, 단계별 추론, 라이브러리 문서 컨텍스트 제공을 담당합니다. AI의 인지 능력을 강화하는 고급 도구입니다.

## 포함된 MCP 서버

### 1. **sequential-thinking**

- **용도**: 복잡한 문제를 단계적으로 분석 및 해결
- **주요 기능**:
  - 멀티 단계 추론 (Chain of Thought)
  - 문제 분해 및 재조립
  - 가설 생성 및 검증
  - 대안 탐색 및 비교
  - 불확실성 표현
  - 논리적 오류 감지 및 수정
- **사용 시나리오**:
  - 복잡한 알고리즘 설계
  - 아키텍처 의사결정
  - 버그 근본 원인 분석
  - 성능 최적화 전략 수립
  - 게임 밸런스 조정 계획
  - 대규모 리팩토링 계획
- **강점**:
  - 직관적인 답변보다 정확한 결과
  - 자체 오류 감지 및 수정
  - 여러 접근 방식 비교 가능
  - 복잡한 의존성 관리

### 2. **context7**

- **용도**: 라이브러리 및 프레임워크 문서 실시간 검색
- **주요 기능**:
  - 500+ 인기 라이브러리 문서 접근
  - 버전별 API 변경사항 조회
  - 코드 예제 검색 및 제공
  - 최신 문법 및 베스트 프랙티스 제시
  - 라이브러리 비교 및 추천
  - 마이그레이션 가이드 제공
- **지원 라이브러리 (예)**:
  - JavaScript: React, Vue, Angular, Next.js, Express
  - Python: Django, FastAPI, Flask, NumPy, Pandas
  - Web: HTML, CSS, WebGL, Web APIs
  - 게임: Babylon.js, Phaser, Three.js
  - Testing: Jest, Vitest, Playwright, Cypress
- **사용 시나리오**:
  - 라이브러리 API 확인 (Vite, React, Supabase)
  - 마이그레이션 가이드 조회 (version upgrade)
  - 최신 문법 학습 (ES2024, TypeScript)
  - 라이브러리 비교 (Vue vs React, Vitest vs Jest)
  - 코드 예제 검색 및 수정

## 연동 흐름

```
복잡한 문제 제시
   ↓
Sequential Thinking (다단계 분석)
   ↓
Context7 (라이브러리 문서 검색)
   ↓
최적의 해결책 도출
```

## 사용 예시

### 시나리오 1: 복잡한 아키텍처 설계

```
문제: "main.js를 12개의 모듈로 리팩토링하는 전략을 세워줘"

1. sequential-thinking: 문제 분해
   - 각 모듈의 책임 정의
   - 모듈 간 의존성 맵핑
   - 마이그레이션 순서 결정

2. context7: 최적 패턴 검색
   - 모듈화 베스트 프랙티스
   - JavaScript 모듈 시스템 확인
   - 유사 프로젝트 예제 검색

3. 결과: 검증된 리팩토링 계획
```

### 시나리오 2: 버그 분석 및 수정

```
문제: "TypeError: Cannot read property 'x' of undefined"

1. sequential-thinking: 근본 원인 분석
   - 호출 스택 추적
   - 변수 초기화 확인
   - 타이밍 이슈 검토

2. context7: 관련 문서 검색
   - JavaScript TDZ (Temporal Dead Zone)
   - Promise 순서 이슈
   - 모듈 로드 순서

3. 결과: 정확한 원인 파악 및 수정 코드
```

## 토큰 최적화 효과

**순차적 사고 (sequential-thinking)**:

- 🎯 정확도 향상: 직관적 답변 → 검증된 답변
- 🔍 자체 검토: 오류 감지 및 수정
- 📊 투명성: 추론 과정 확인 가능

**컨텍스트 (context7)**:

- 📚 최신 정보: 검색 결과 우선 (웹 검색 재실행 불필요)
- ⚡ 빠른 응답: 캐시된 문서 사용
- 💰 토큰 절약: 긴 문서 요약 필요 없음

## 권한 설정

- ✅ 복잡한 분석 시 필수 사용
- ✅ 라이브러리 문서 검색
- ✅ 아키텍처 설계 지원
- ⚠️ 단순 작업에는 사용하지 않음 (토큰 낭비)

## 추천 조합 (스킬 그룹 연동)

| 작업               | 필요 스킬                   |
| ------------------ | --------------------------- |
| 버그 수정          | thought_engine + developer  |
| 성능 최적화        | thought_engine + researcher |
| 아키텍처 리뉴얼    | thought_engine + developer  |
| 새 라이브러리 학습 | thought_engine + researcher |
| 테스트 작성        | thought_engine + developer  |
