# 기술 조사 프롬프트

> **용도:** 라이브러리, 패턴, 기술 조사
> **사용 시점:** 구현 전 기술 선택이 필요할 때
> **권장 MCP:** Context7, brave-search, Playwright

---

## 프롬프트 - Context7 사용 (라이브러리 문서)

```
Context7을 사용해서 [라이브러리명]의 [기능]에 대해 조사해줘.

알고 싶은 것:
1. 기본 사용법
2. 우리 프로젝트에 적용하는 방법
3. 예제 코드

조사 결과를 바탕으로 구현 가이드 작성해줘.
```

---

## 프롬프트 - brave-search 사용 (웹 검색)

```
brave-search를 사용해서 [주제]에 대해 조사해줘.

알고 싶은 것:
[구체적인 질문들]

최신 정보 위주로 찾아서 요약해줘.
```

---

## 프롬프트 - 복합 조사 (Context7 + brave-search)

```
다음 기술에 대해 조사해줘:

1. Context7로 [라이브러리명] 공식 문서 조사
   - API 사용법
   - 설정 옵션
   - Best Practice

2. brave-search로 실제 사용 사례 검색
   - 유사 프로젝트 예제
   - 성능 관련 팁
   - 흔한 실수/해결법

3. 조사 결과 종합
   - 우리 프로젝트에 적용 방법
   - 권장 설정
   - 주의사항

요약해서 알려줘.
```

---

## 프롬프트 - 기술 비교

```
[옵션A]와 [옵션B] 중 어떤 것을 사용해야 할지 비교해줘.

Context7로 각 옵션의 공식 문서 확인 후:

비교 기준:
- 우리 프로젝트 요구사항과의 적합성
- 학습 곡선
- 성능
- 유지보수성

추천과 이유 알려줘.
```

---

## 프롬프트 - game-director 조언 (게임 디자인)

```
game-director에게 물어봐줘.

질문:
[게임 디자인/기술 관련 질문]

game-director가:
1. 유사한 게임들(Factorio, Shapez 등) 분석
2. Best Practice 발굴
3. 우리 프로젝트에 적용 방안 제시

brave-search로 벤치마크 게임 사례도 찾아줘.
```

---

## 사용 예시

### PixiJS 기능 조사

```
Context7을 사용해서 PixiJS 8의 Sprite 배칭에 대해 조사해줘.

알고 싶은 것:
1. 기본 사용법
2. 성능 최적화 방법
3. 예제 코드

조사 결과를 바탕으로 우리 게임에 적용하는 가이드 작성해줘.
```

### Zustand 패턴 조사

```
다음 기술에 대해 조사해줘:

1. Context7로 Zustand persist 미들웨어 조사
   - API 사용법
   - localStorage 연동
   - 마이그레이션 처리

2. brave-search로 실제 사용 사례 검색
   - 게임 저장 시스템 예제
   - 성능 관련 팁

3. 조사 결과 종합
   - 우리 게임의 저장 시스템에 적용 방법
   - 권장 설정

요약해서 알려줘.
```

### ECS 패턴 조사

```
다음 기술에 대해 조사해줘:

1. brave-search로 "JavaScript ECS game development" 검색
   - 유명 라이브러리 (bitecs, miniplex, etc.)
   - 순수 JS 구현 방법

2. Context7로 ECS 라이브러리 문서 확인 (있으면)

3. game-director에게 팩토리 게임에서 ECS 패턴 활용 사례 물어보기
   - Factorio, Shapez 등

우리 프로젝트(KIMCHI INVASION)에 가장 적합한 방식 추천해줘.
```

### 타일맵 라이브러리 비교

```
PixiJS 8과 함께 사용할 타일맵 솔루션을 비교해줘.

옵션:
- @pixi/tilemap
- pixi-tilemap
- 직접 구현

1. Context7로 각 라이브러리 문서 확인

2. brave-search로 성능 벤치마크, 사용자 리뷰 검색

3. 비교 기준:
   - 우리 프로젝트 요구사항과의 적합성
   - PixiJS 8 호환성
   - 성능 (5000+ 타일)
   - 유지보수성

추천과 이유 알려줘.
```

---

## 자주 조사하는 주제

| 주제              | Context7 검색어              | brave-search 검색어                   |
| :---------------- | :--------------------------- | :------------------------------------ |
| PixiJS 렌더링     | `PixiJS 8 Application`       | `PixiJS 8 performance tips 2024`      |
| PixiJS 스프라이트 | `PixiJS 8 Sprite batch`      | `PixiJS sprite batching optimization` |
| Zustand 기본      | `Zustand store create`       | `Zustand game state management`       |
| Zustand 영속화    | `Zustand persist middleware` | `Zustand localStorage game save`      |
| ECS 패턴          | `bitecs tutorial`            | `JavaScript ECS game development`     |
| 타일맵            | `PixiJS tilemap`             | `Factorio-style tilemap rendering`    |

---

## MCP 역할 분담

| 조사 유형            | MCP                          |
| :------------------- | :--------------------------- |
| 라이브러리 공식 문서 | Context7                     |
| 최신 블로그/튜토리얼 | brave-search                 |
| 실제 동작 확인       | Playwright                   |
| 게임 디자인 사례     | game-director + brave-search |
| 성능 벤치마크        | brave-search + Playwright    |

---

## 조사 결과 활용

```
조사 완료 후:

1. gdd-enhancer로 관련 GDD 문서 업데이트
   - 기술 스펙 추가
   - 구현 가이드 작성

2. quality-agent로 구현
   - 조사 결과 기반 코드 작성
   - Best Practice 적용

3. test-agent로 테스트
   - 조사된 엣지 케이스 커버
```
