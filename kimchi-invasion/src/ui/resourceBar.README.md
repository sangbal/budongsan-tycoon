# ResourceBar 구현 가이드

## 개요

화면 상단에 주요 자원을 표시하는 HUD 컴포넌트입니다.

## 구현 파일

- `kimchi-invasion/src/ui/resourceBar.js` - ResourceBar 클래스
- `kimchi-invasion/src/ui/index.js` - UI 초기화 통합

## 기능

### 표시 자원 (기본값)

| 자원       | 아이콘 | 색상                 | 표시 형식          |
| ---------- | ------ | -------------------- | ------------------ |
| 💰 dollars | 💰     | #10B981 (Green)      | 숫자 포맷 (1K)     |
| ⚡ energy  | ⚡     | #FCD34D (Yellow)     | 현재/최대 (50/100) |
| ⚙️ iron    | ⚙️     | #6B7280 (Gray)       | 숫자 포맷          |
| 🧊 ice     | 🧊     | #BAE6FD (Light Cyan) | 숫자 포맷          |

### 특수 기능

1. **에너지 경고**: 에너지가 최대치의 20% 미만일 때 빨간색(#EF4444)으로 표시
2. **숫자 포맷팅**: 1000 이상은 1K, 1,000,000 이상은 1M 형식
3. **실시간 업데이트**: Zustand 스토어 구독으로 자동 갱신

## 사용법

### 기본 사용

```javascript
import { initResourceBar } from './ui/resourceBar.js'
import { getUIContainer } from './core/pixiApp.js'

const uiContainer = getUIContainer()
const resourceBar = initResourceBar(uiContainer, {
  x: 10,
  y: 10,
})
```

### 커스터마이징

```javascript
const resourceBar = new ResourceBar({
  width: 800, // HUD 너비
  height: 60, // HUD 높이
  displayResources: ['dollars', 'energy', 'water', 'kimchi'], // 표시할 자원
  fontSize: 20, // 폰트 크기
})
```

## 테스트

### 1. 개발 서버 실행

```bash
npm run dev
# http://localhost:5173/kimchi-invasion/
```

### 2. 브라우저 콘솔에서 테스트

```javascript
// 자원 추가
kimchiGame.getState().modifyResource('dollars', 1000)
kimchiGame.getState().modifyResource('iron', 500)
kimchiGame.getState().modifyResource('energy', 80)

// 에너지 부족 상태 테스트 (빨간색 경고)
kimchiGame.getState().modifyResource('energy', -70) // 10/100 → 빨간색

// 큰 숫자 포맷 테스트
kimchiGame.getState().modifyResource('dollars', 5000) // 5.0K
kimchiGame.getState().modifyResource('dollars', 995000) // 1.0M
```

## 검증 기준

- [x] 4개 자원 표시 (dollars, energy, iron, ice)
- [x] 실시간 업데이트 (Zustand 구독)
- [x] 숫자 포맷 (1K, 1M)
- [x] 에너지 부족 시 빨간색
- [ ] ESLint 에러 0개

## 다음 단계

1. **툴팁 추가**: 자원 위에 마우스 오버 시 상세 정보 표시
2. **애니메이션**: 자원 증가/감소 시 부드러운 카운터 애니메이션
3. **용량 게이지**: 에너지처럼 최대치가 있는 자원에 프로그레스 바 추가
4. **정렬 옵션**: 가로/세로 레이아웃 전환
5. **반응형**: 화면 크기에 따라 자동 조정

## 스타일 가이드

### 색상 팔레트

```javascript
const COLORS = {
  background: 0x1f2937, // Dark Gray
  border: 0x374151, // Medium Gray
  warning: 0xef4444, // Red (에너지 부족)
}
```

### 레이아웃

```
┌────────────────────────────────────────────────────┐
│ [Padding 12px]                                     │
│                                                    │
│ 💰 $1.2K   ⚡ 85/100   ⚙️ 456   🧊 123            │
│   ^120px    ^120px      ^120px   ^120px          │
│                                                    │
│ [Height 50px]                                      │
└────────────────────────────────────────────────────┘
```

## 문제 해결

### ResourceBar가 표시되지 않음

1. PixiJS App이 초기화되었는지 확인
2. UIContainer가 존재하는지 확인
3. 콘솔에서 `kimchiGame.getPixiApp().stage.children` 확인

### 자원이 업데이트되지 않음

1. Zustand 구독이 정상인지 확인
2. `useGameStore.getState().resources` 값 확인
3. `resourceBar.unsubscribe`가 호출되지 않았는지 확인

### 에너지 색상이 변경되지 않음

- 에너지 값이 20/100 미만인지 확인 (20% 이하에서 빨간색)
- `RESOURCES.energy.maxValue`가 100인지 확인

## 아키텍처

```
ResourceBar (PixiJS Container)
├── background (Graphics)
├── resourceTexts[dollars] (Text)
├── resourceTexts[energy] (Text)
├── resourceTexts[iron] (Text)
└── resourceTexts[ice] (Text)

Zustand Store Subscription
  └─> updateDisplay() → 모든 Text 객체 업데이트
```

## 성능

- **렌더링**: PixiJS의 자동 배칭으로 GPU 최적화
- **구독**: Zustand의 `subscribeWithSelector`로 변경 시에만 업데이트
- **메모리**: `destroy()` 호출 시 구독 자동 해제
