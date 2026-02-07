# 밸런스 & 게임 디자인 가이드

ClickSurvivor Hub의 게임 밸런스 및 디자인 원칙 정보입니다.

## 서울 생존기 (Seoul Survival)

### 밸런스 상수 위치

- 경로: `seoulsurvival/src/balance/`
- 주요 파일:
  - `timing.js` - 게임 루프 및 타이밍 상수
  - `economy.js` - 경제 밸런스 (업그레이드 비용, 수익률 등)
  - `prestige.js` - 프레스티지 시스템 밸런스

### 디자인 철학

상세 디자인 문서: `docs/game-design/BALANCE_NOTES.md`

**핵심 원칙:**

- 점진적 성장 곡선 (exponential growth)
- 의미 있는 선택 (meaningful choices)
- 명확한 피드백 (clear feedback)

### 프레스티지 시스템

- **발동 조건**: 서울타워 (1조원) 구매 시
- **보상**: 영구 버프 (다음 게임에 적용)
- **밸런스**: 초반 가속화 vs 후반 진행 속도

### 리더보드 순위

**우선순위:**

1. 타워 개수 (프레스티지 횟수)
2. 자산 순 (동일 타워 개수일 때)

## 김치 인베이전 (Kimchi Invasion)

Factory Automation + Idle Incremental 게임

상세 정보: `kimchi-invasion/README.md`

## 밸런스 조정 워크플로우

1. **문제 식별**: 플레이 테스트 또는 데이터 분석
2. **밸런스 파일 수정**: `seoulsurvival/src/balance/` 내 상수 조정
3. **테스트**: 단위 테스트 및 통합 테스트 실행
4. **검증**: 실제 플레이로 체감 확인
5. **문서화**: `BALANCE_NOTES.md` 업데이트

## 관련 문서

- [아키텍처 가이드](./architecture.md)
- [에이전트 가이드](./agent-guide.md)
