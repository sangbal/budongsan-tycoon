# Toast Notification System

## 개요

Seoul Survival 게임의 비침습적 알림 시스템입니다. 에러, 성공, 정보 메시지를 사용자에게 시각적으로 전달합니다.

## 기능

- 4가지 토스트 타입 (error, success, info, warning)
- 자동 숨김 (duration 설정 가능)
- 페이드 인/아웃 애니메이션
- 중복 토스트 방지
- 모바일 최적화 (탭바 위에 표시)
- 접근성 지원 (ARIA 레이블, 스크린 리더)
- 클릭 시 즉시 닫기

## 사용법

### 기본 사용

```javascript
import { createToast, toastSuccess, toastError, toastInfo, toastWarning } from './ui/toast.js'

// 타입별 편의 함수
toastSuccess('게임이 저장되었습니다.')
toastError('저장에 실패했습니다.')
toastInfo('새로운 업그레이드가 해금되었습니다.')
toastWarning('저장 공간이 부족합니다.')

// createToast 직접 호출 (duration 커스터마이징)
createToast('5초간 표시되는 메시지', 'info', 5000)
```

### window.toast 사용 (전역 접근)

main.js에서 window 객체에 연결되어 있어 어디서든 접근 가능합니다.

```javascript
// errorBoundary.js, saveLoad.js 등에서 사용
window.toast.error('게임 저장에 실패했습니다.')
window.toast.success('클라우드에 저장했습니다.')
```

### 다국어 지원

```javascript
import { t } from '../i18n/index.js'

window.toast.error(t('error.saveFailed'))
window.toast.success(t('msg.cloudSaved'))
```

## 타입별 기본 설정

| 타입    | 아이콘 | 색상           | 기본 Duration |
| ------- | ------ | -------------- | ------------- |
| error   | ⚠️     | var(--bad)     | 4000ms        |
| success | ✅     | var(--good)    | 3000ms        |
| info    | ℹ️     | var(--info)    | 3000ms        |
| warning | ⚠️     | var(--warning) | 3500ms        |

## 스타일링

토스트는 게임의 기존 디자인 시스템을 따릅니다.

### CSS 변수 사용

- `--bg-panel`: 배경색
- `--text`: 텍스트 색상
- `--bad`, `--good`, `--info`, `--warning`: 타입별 색상

### 위치

- 데스크톱: 화면 하단 중앙 (bottom: 20px)
- 모바일: 모바일 탭바 위 (bottom: 80px)

### z-index

- 2100 (모달보다 높음)

## 접근성

### ARIA 속성

- `role="alert"`: 스크린 리더에게 알림 전달
- `aria-live="polite"` (info, success, warning): 현재 읽기 완료 후 알림
- `aria-live="assertive"` (error): 즉시 알림
- `aria-hidden="true"` (아이콘): 장식용 아이콘은 읽기 제외

### 키보드 접근성

- 클릭 시 즉시 닫기 지원
- 포커스 필요 없음 (자동 닫힘)

### 애니메이션 감소 모드

```css
@media (prefers-reduced-motion: reduce) {
  .game-toast {
    transition: opacity 0.15s ease;
  }
}
```

## 중복 방지

같은 메시지가 이미 표시 중이면 새 토스트를 생성하지 않습니다.

```javascript
toastError('에러 메시지')
toastError('에러 메시지') // ← 무시됨 (이미 표시 중)
```

중복 키: `${type}:${message}`

## API

### createToast(message, type, duration)

메인 토스트 생성 함수

**Parameters:**

- `message` (string): 표시할 메시지
- `type` (string): 'error' | 'success' | 'info' | 'warning' (기본값: 'info')
- `duration` (number | null): 표시 시간 (밀리초, 기본값: 타입별 기본값)

**Returns:** HTMLElement | null

### toastError(message, duration)

에러 토스트 생성 (빨간색)

### toastSuccess(message, duration)

성공 토스트 생성 (초록색)

### toastInfo(message, duration)

정보 토스트 생성 (파란색)

### toastWarning(message, duration)

경고 토스트 생성 (주황색)

### clearAllToasts()

모든 토스트 즉시 제거 (페이지 전환 시)

### testToasts()

테스트용 함수 (개발 모드)

```javascript
import { testToasts } from './ui/toast.js'
testToasts() // 4가지 타입 순차 표시
```

## 통합 사례

### errorBoundary.js

저장 실패 시 사용자에게 알림

```javascript
import { toastError, toastWarning } from '../ui/toast.js'

// 저장 실패
toastWarning(t('error.saveFailed'))

// 클라우드 저장 실패
toastWarning(t('error.cloudSaveFailed'))
```

### saveLoad.js

저장 공간 부족 시 경고

```javascript
// 기존 showSaveWarning 함수를 토스트로 교체
if (typeof window.toast?.error === 'function') {
  window.toast.error(message, 5000)
}
```

## 모바일 최적화

### 탭바 충돌 방지

```css
@media (max-width: 768px) {
  .game-toast-container {
    bottom: 80px; /* 모바일 탭바 위 */
  }
}
```

### 반응형 폰트/패딩

```css
@media (max-width: 768px) {
  .game-toast {
    font-size: 13px;
    padding: 12px 16px;
  }
}
```

## 디버깅

### 콘솔 로그

모든 토스트는 콘솔에 로그를 남깁니다.

```
[Toast] ERROR: 게임 저장에 실패했습니다. (4000ms)
[Toast] SUCCESS: 게임이 저장되었습니다. (3000ms)
```

### 중복 방지 로그

```
[Toast] 중복 토스트 방지: 게임 저장에 실패했습니다.
```

## 주의사항

1. **타이밍**: 토스트는 비침습적 알림입니다. 중요한 작업 확인은 모달을 사용하세요.
2. **메시지 길이**: 너무 긴 메시지는 가독성이 떨어집니다. 간결하게 작성하세요.
3. **다국어**: 메시지는 항상 t() 함수로 전달하세요.
4. **z-index**: 모달(2000)보다 높은 2100을 사용합니다.

## 향후 개선 사항

- [ ] 토스트 위치 옵션 (상단/하단)
- [ ] 진행률 바 (duration 시각화)
- [ ] 액션 버튼 (실행 취소 등)
- [ ] 스택 방식 (여러 토스트 동시 표시)
- [ ] 사운드 피드백
