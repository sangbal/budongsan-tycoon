# 성능 최적화 프롬프트

> **용도:** 성능 분석 및 개선
> **사용 시점:** 게임이 느리거나 버벅일 때, 배포 전 최적화
> **권장 Agent:** performance-agent

---

## 프롬프트 - 성능 분석 (아래 내용 전체 복사)

```
KIMCHI INVASION의 성능을 분석해줘.

확인 항목:
1. FPS 측정 (목표: 60fps)
2. 메모리 사용량
3. 렌더링 병목
4. 게임 루프 성능

performance-agent를 사용해서 분석하고,
문제가 있으면 개선 방안 제시해줘.
```

---

## 프롬프트 - performance-agent 활용 (권장)

```
performance-agent를 사용해서 KIMCHI INVASION 성능을 최적화해줘.

performance-agent가:
1. 현재 성능 프로파일링
   - FPS, 메모리, 렌더링 시간
2. 병목 지점 식별
3. 최적화 코드 적용
4. 개선 효과 측정
5. Playwright로 시각적 검증

결과 보고해줘.
```

---

## 프롬프트 - 특정 문제 최적화

```
[성능 문제]를 최적화해줘.

현상:
[어떤 성능 문제가 있는지]

performance-agent를 사용해서:
1. 원인 분석
2. 최적화 코드 적용
3. 개선 효과 확인

결과 알려줘.
```

---

## 프롬프트 - 빌드 최적화

```
performance-agent를 사용해서 KIMCHI INVASION 빌드를 최적화해줘.

목표:
- 번들 크기 < 300KB (gzip)
- 로딩 시간 < 3초

performance-agent가:
1. 번들 크기 분석
2. 불필요한 의존성 제거
3. 코드 스플리팅 적용
4. 트리 쉐이킹 확인
5. Playwright + Lighthouse로 로딩 시간 측정

npm run build 후 결과 분석하고 개선해줘.
```

---

## 사용 예시

### FPS 저하 문제

```
performance-agent를 사용해서 FPS 저하 문제를 최적화해줘.

현상:
건물 100개 이상 배치하면 FPS가 30fps 이하로 떨어짐

performance-agent가:
1. 렌더링 코드 분석
2. 스프라이트 배칭 확인
3. 오프스크린 컬링 적용
4. 오브젝트 풀링 구현
5. 개선 효과 측정

결과 알려줘.
```

### 메모리 누수

```
performance-agent를 사용해서 메모리 누수를 최적화해줘.

현상:
게임을 오래 플레이하면 브라우저가 느려짐

performance-agent가:
1. 메모리 프로파일링
2. 이벤트 리스너 정리 확인
3. 텍스처/오브젝트 해제 확인
4. 누수 지점 수정
5. 개선 효과 측정

결과 알려줘.
```

### 로딩 시간

```
performance-agent를 사용해서 로딩 시간을 최적화해줘.

현상:
게임 시작까지 5초 이상 걸림 (목표: 3초 이내)

performance-agent가:
1. 로딩 단계별 시간 측정
2. 비동기 로딩 적용
3. 에셋 압축
4. lazy loading 구현
5. Lighthouse로 개선 효과 측정

결과 알려줘.
```

---

## 성능 목표 (개발 계획서 기준)

| 지표       | 목표            | 측정 방법                     |
| :--------- | :-------------- | :---------------------------- |
| FPS        | 60fps           | PixiJS stats, Chrome DevTools |
| 스프라이트 | 5,000개 @ 60fps | 스트레스 테스트               |
| 로딩 시간  | < 3초           | Lighthouse                    |
| 번들 크기  | < 300KB (gzip)  | Vite build                    |
| 메모리     | 안정적 유지     | Chrome Memory tab             |

---

## 성능 최적화 체크리스트

### 렌더링

- [ ] 불필요한 렌더링 제거
- [ ] 오프스크린 컬링 적용
- [ ] 스프라이트 배칭 활용
- [ ] 텍스처 아틀라스 사용

### 메모리

- [ ] 이벤트 리스너 정리
- [ ] 사용하지 않는 객체 정리
- [ ] 텍스처 캐싱
- [ ] 오브젝트 풀링

### 게임 루프

- [ ] 과도한 계산 최적화
- [ ] 비동기 처리 활용
- [ ] 틱 레이트 최적화

### 빌드

- [ ] 트리 쉐이킹 확인
- [ ] 코드 스플리팅
- [ ] 이미지 압축
- [ ] 불필요한 의존성 제거

---

## Agent/MCP 역할 분담

| 최적화 영역 | Agent/MCP                      |
| :---------- | :----------------------------- |
| FPS/렌더링  | performance-agent              |
| 메모리      | performance-agent              |
| 빌드/번들   | performance-agent              |
| 로딩 시간   | performance-agent + Lighthouse |
| PixiJS 관련 | performance-agent + Context7   |
| 시각적 검증 | Playwright                     |

---

## Context7 활용 (PixiJS 최적화)

```
Context7을 사용해서 PixiJS 8 성능 최적화 방법을 조사해줘.

알고 싶은 것:
1. 스프라이트 배칭 Best Practice
2. 대량 스프라이트 렌더링 최적화
3. 메모리 관리 방법

조사 결과를 performance-agent에게 전달해서 적용해줘.
```

---

## Ralph Loop 연동 (자동 최적화)

```
/ralph-loop "
KIMCHI INVASION 성능 자동 최적화:

1. npm run build 실행
2. 번들 크기 확인
3. 300KB 초과 시 최적화 적용
4. Lighthouse 로딩 시간 측정
5. 3초 초과 시 로딩 최적화
6. 목표 달성 시 <promise>PERF_OPTIMIZED</promise>
" --max-iterations 20 --completion-promise "PERF_OPTIMIZED"
```
