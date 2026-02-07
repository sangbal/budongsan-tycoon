# Seoul Survival - PWA & TWA Setup

## Overview

이 문서는 Seoul Survival을 Progressive Web App(PWA)으로 구성하고 Google Play Store의 Trusted Web Activity(TWA)로 출시하기 위한 설정을 설명합니다.

## 구현 완료 항목

### 1. manifest.json

- **위치**: `seoulsurvival/manifest.json`
- **기능**:
  - 앱 이름, 아이콘, 테마 색상 정의
  - 스탠드얼론 모드로 전체 화면 표시
  - 한국어(ko) 기본 언어 설정
  - 게임 카테고리 지정
  - 아이콘 purpose (any, maskable) 분리

### 2. Service Worker

- **위치**: `seoulsurvival/sw.js`
- **기능**:
  - **Cache-first strategy**: 정적 자산(JS, CSS, 이미지) → 캐시 먼저 사용
  - **Network-first strategy**: API 호출 → 네트워크 먼저 시도
  - 오프라인 폴백 페이지 제공
  - 캐시 자동 업데이트 및 정리
  - 클라이언트 메시지 처리 (캐시 클리어 등)

### 3. HTML Meta Tags

- **파일**: `seoulsurvival/index.html`
- **추가된 메타태그**:

  ```html
  <!-- PWA Manifest -->
  <link rel="manifest" href="manifest.json" />

  <!-- Apple Mobile Web App (iOS) -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="서울 생존기" />

  <!-- Microsoft Tiles (Windows) -->
  <meta name="msapplication-TileColor" content="#0b0f19" />
  <meta name="msapplication-TileImage" content="assets/icons/icon-144x144.png" />
  ```

- **Service Worker 등록**: 자동 스크립트로 sw.js 등록 및 주기적 업데이트 체크

### 4. Asset Links Configuration

- **위치**: `.well-known/assetlinks.json`
- **용도**: Google Play Store TWA 연결 (Digital Asset Links)
- **Fingerprint**: 나중에 실제 앱 서명 인증서로 교체 필요

### 5. Vite Config 수정

- **파일**: `vite.config.js`
- **기능**: 빌드 시 `.well-known/assetlinks.json`을 `dist/.well-known/`로 자동 복사

---

## 필수 작업 - 아이콘 생성

### 필요한 아이콘 목록

모든 아이콘은 `seoulsurvival/assets/icons/` 디렉토리에 배치:

1. **Maskable Icons** (배경 유연한 디자인)
   - `icon-192x192-maskable.png` (192x192, PNG)
   - `icon-512x512-maskable.png` (512x512, PNG)

2. **Standard Icons** (기존 디자인)
   - `icon-192x192.png` (192x192, PNG)
   - `icon-512x512.png` (512x512, PNG)
   - `icon-144x144.png` (144x144, PNG) - Windows Tiles

3. **Screenshots** (선택사항이지만 권장)
   - `screenshot-540x720.png` (540x720, PNG) - 모바일
   - `screenshot-1280x720.png` (1280x720, PNG) - 태블릿/데스크탑

4. **Favicon** (이미 존재)
   - `assets/images/logo.webp` 사용 중

### 아이콘 디자인 가이드

**Maskable Icons 주의사항**:

- 중요 콘텐츠를 중앙 20% 영역에 배치 (안전 영역)
- 투명도 없이 불투명한 배경 필수
- 배경색은 테마 색상(`#0b0f19`)과 대비되는 색 사용
- iOS에서 모서리가 잘려나갈 수 있음 고려

**디자인 참고**:

- 게임 테마: 다크 배경 + 밝은 포인트 색상
- 기존 로고: `seoulsurvival/assets/images/logo.webp` 활용
- 앱 아이콘 스타일 가이드: [Android Icon Guidelines](https://developer.android.com/develop/ui/views/notifications/adaptive-icons)

---

## TWA (Trusted Web Activity) 출시 준비

### 1. Android App 번들 생성

Google Play Store에 출시하려면 실제 Android 앱 프로젝트가 필요합니다.

**필수 정보**:

- Package name: `com.clicksurvivor.seoulsurvival`
- URL: `https://clicksurvivor.com/seoulsurvival/`
- App version: `package.json`의 version 참고

**추천 도구**:

- [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) - Google 공식 TWA 생성 도구
- [TWA Quick Start](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start/)

### 2. 앱 서명 인증서 생성

```bash
# Android 앱 서명 키 생성 (keytool)
keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias seoulsurvival
```

### 3. SHA256 Fingerprint 추출

```bash
# 인증서에서 SHA256 fingerprint 추출
keytool -list -v -keystore release.jks
```

### 4. assetlinks.json 업데이트

`.well-known/assetlinks.json`의 `sha256_cert_fingerprints` 배열에 실제 fingerprint 입력:

```json
{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.clicksurvivor.seoulsurvival",
    "sha256_cert_fingerprints": ["YOUR_ACTUAL_SHA256_FINGERPRINT_HERE"]
  }
}
```

### 5. 도메인 검증

assetlinks.json 배포 후 검증:

```bash
curl https://clicksurvivor.com/.well-known/assetlinks.json
```

---

## 배포 체크리스트

- [ ] PWA 아이콘 생성 및 배치 (`seoulsurvival/assets/icons/`)
- [ ] iOS 테스트 (iPad/iPhone에서 "홈 화면에 추가" 테스트)
- [ ] Android 테스트 (Chrome에서 설치 프롬프트 테스트)
- [ ] Service Worker 캐싱 동작 확인
- [ ] 오프라인 모드 테스트
- [ ] Android 앱 번들 생성 (Bubblewrap)
- [ ] 앱 서명 인증서 생성 및 SHA256 fingerprint 확인
- [ ] `assetlinks.json` 업데이트
- [ ] Google Play Store에 앱 등록
- [ ] Lighthouse PWA 점수 확인 (90점 이상)
- [ ] LighthouseBot/Pagespeed Insights 최종 검증

---

## 빌드 및 배포

### 개발 환경

```bash
npm run dev
# http://localhost:5173/seoulsurvival/
```

### 프로덕션 빌드

```bash
npm run build
# Service Worker + manifest.json + .well-known/assetlinks.json 모두 빌드됨
```

### GitHub Pages 배포

```bash
npm run build
git add dist/
git commit -m "build: PWA build with SW and assetlinks"
git push origin gh-pages
```

---

## 마이그레이션 참고

기존 웹 게임 사용자가 앱 설치로 전환될 때:

1. **데이터 동기화**: Supabase 클라우드 저장 활용
2. **URL 유지**: PWA `start_url: "/seoulsurvival/"` 동일
3. **사용자 인증**: 기존 Google OAuth 계속 사용

---

## 모니터링 및 업데이트

### Service Worker 업데이트

`seoulsurvival/sw.js` 수정 후:

1. Service Worker 버전 업데이트
2. 빌드 및 배포
3. 기존 사용자는 다음 방문 시 새 버전으로 자동 업데이트

### 캐시 전략 조정

필요 시 `sw.js`의 `STATIC_ASSETS` 및 `API_PATTERNS` 수정:

- 캐시할 정적 자산 추가
- API 엔드포인트 패턴 수정

---

## 문제 해결

### Service Worker 등록 안 됨

- `seoulsurvival/sw.js` 존재 확인
- HTTPS 환경 필요 (localhost 제외)
- 브라우저 DevTools > Application > Service Worker 확인

### 아이콘이 표시 안 됨

- 아이콘 파일 경로 확인
- 파일 형식이 PNG인지 확인
- 크기가 정확한지 확인 (192x192, 512x512)

### 오프라인 모드에서 페이지가 로드 안 됨

- Service Worker 캐시 상태 확인 (DevTools)
- `seoulsurvival/index.html` 캐시 여부 확인

---

## 참고 자료

- [PWA Checklist - web.dev](https://web.dev/pwa-checklist/)
- [Trusted Web Activity - Google Chrome](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Android App Links - Android Developers](https://developer.android.com/training/app-links)
- [Service Worker API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Manifest Format - MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)
