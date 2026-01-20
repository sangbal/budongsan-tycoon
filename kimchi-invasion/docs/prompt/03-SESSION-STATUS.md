# 세션 상태 확인 프롬프트

> **용도:** 현재 진행 상황 빠르게 확인
> **사용 시점:** 작업 중 현재 위치 확인이 필요할 때
> **권장 Agent:** gdd-enhancer

---

## 프롬프트 - 기본 (아래 내용 전체 복사)

```
현재 KIMCHI INVASION 개발 진행 상황을 간단히 알려줘.

PROGRESS.md를 읽고:
1. 전체 진행률 (Week X / Day Y)
2. 완료된 주요 항목
3. 현재 진행 중인 항목
4. 다음 할 일 3개

표 형식으로 간결하게 보여줘.
```

---

## 프롬프트 - 상세 분석 (orchestrator)

```
orchestrator를 사용해서 KIMCHI INVASION 전체 상태를 분석해줘.

orchestrator가:
1. PROGRESS.md 현황 분석
2. 코드 품질 상태 (ESLint 에러 수)
3. 테스트 커버리지 현황
4. 남은 작업 예상 분량
5. 블로커/리스크 식별

종합 리포트 작성해줘.
```

---

## 예상 응답 형식

```
📊 KIMCHI INVASION 개발 현황

| 항목 | 상태 |
|:-----|:-----|
| 현재 Phase | Week 1 / Day 2 |
| 전체 진행률 | 15% |

✅ 완료:
- PixiJS 8 설치
- pixiApp.js 작성

🔄 진행 중:
- camera.js 구현

📋 다음 할 일:
1. camera.js 완료
2. tilemap.js 구현
3. 단위 테스트 작성
```

---

## Agent 역할

| 분석 유형   | Agent         |
| :---------- | :------------ |
| 문서 상태   | gdd-enhancer  |
| 코드 품질   | quality-agent |
| 테스트 현황 | test-agent    |
| 종합 분석   | orchestrator  |
