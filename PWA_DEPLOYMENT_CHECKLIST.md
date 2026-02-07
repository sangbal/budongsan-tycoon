# Seoul Survival PWA & TWA 배포 체크리스트

## 완성 현황

### 1. Core PWA 구현 ✓

- [x] **manifest.json** (`seoulsurvival/manifest.json`)
  - 앱 메타데이터 정의
  - 아이콘 경로 설정 (192x192, 512x512 - maskable 포함)
  - 테마 색상: `#0b0f19` (게임 테마)
  - 시작 URL: `/seoulsurvival/`
  - 스탠드얼론 모드
  - 한국어 설정

- [x] **Service Worker** (`seoulsurvival/sw.js`)
  - Cache-first 전략: 정적 자산 (JS, CSS, 이미지)
  - Network-first 전략: API 호출
  - 오프라인 폴백
  - 자동 캐시 업데이트 및 정리
  - 버전 관리 (`CACHE_VERSION: 'v1'`)

- [x] **HTML Meta Tags** (`seoulsurvival/index.html`)
  - PWA manifest 링크
  - Apple Mobile Web App 메타태그
  - Microsoft Tiles 지원
  - Service Worker 자동 등록 스크립트

- [x] **Vite Build Configuration** (`vite.config.js`)
  - manifest.json 빌드 시 dist 복사
  - sw.js 빌드 시 dist 복사
  - .well-known/assetlinks.json 빌드 시 dist 복사

### 2. TWA (Trusted Web Activity) 준비 ✓

- [x] **assetlinks.json** (`.well-known/assetlinks.json`)
  - 패키지명: `com.clicksurvivor.seoulsurvival`
  - 도메인: `clicksurvivor.com`
  - Placeholder SHA256 fingerprint (나중에 교체 필요)

---

## 배포 전 필수 작업

### Phase 1: 아이콘 준비

필요한 아이콘들을 `seoulsurvival/assets/icons/`에 배치:

```
seoulsurvival/assets/icons/
├── icon-192x192.png              (192x192, PNG, any purpose)
├── icon-192x192-maskable.png     (192x192, PNG, maskable - 안전 영역 참고)
├── icon-512x512.png              (512x512, PNG, any purpose)
├── icon-512x512-maskable.png     (512x512, PNG, maskable)
├── icon-144x144.png              (144x144, PNG, Windows Tiles)
├── icon-96x96.png                (96x96, PNG, shortcuts)
├── screenshot-540x720.png        (540x720, PNG, 모바일 스크린샷)
└── screenshot-1280x720.png       (1280x720, PNG, 데스크탑 스크린샷)
```

**Maskable Icon 가이드:**

- 투명도 없이 불투명한 배경 사용
- 중요 콘텐츠를 중앙 20% 영역에 배치 (안전 영역)
- 배경색은 주요 요소와 대비되어야 함

**생성 도구 추천:**

- Figma / Adobe XD / Photoshop
- Online: [Maskable.app](https://maskable.app)
- CLI: ImageMagick, ffmpeg

### Phase 2: 로컬 테스트

#### PWA 설치 테스트 (웹)

```bash
npm run build
npm run preview

# 브라우저에서 http://localhost:4173/seoulsurvival/ 방문
# DevTools → Application → Manifest 확인
# DevTools → Application → Service Worker 확인
```

**체크 항목:**

- [ ] Manifest.json이 정상 로드됨
- [ ] Service Worker가 활성화됨
- [ ] 설치 버튼 표시됨 (모바일 환경 시뮬레이션)
- [ ] 오프라인 모드에서 페이지 로드됨

#### 모바일 테스트

1. **iOS (Safari)**

   ```
   Settings → Home Screen → Add Safari
   서울 생존기 추가
   ```

   - [ ] 홈 화면에 추가됨
   - [ ] 아이콘이 올바르게 표시됨
   - [ ] 스탠드얼론 모드로 실행됨

2. **Android (Chrome)**
   ```
   Menu → Install Seoul Survival
   ```

   - [ ] 설치 팝업 표시
   - [ ] 앱으로 설치 가능
   - [ ] 오프라인 모드 테스트

#### Lighthouse PWA 점수 확인

```bash
npm run build
npm run preview
```

Chrome DevTools → Lighthouse:

- [ ] **Progressive Web App**: 90점 이상
- [ ] Installable
- [ ] Works Offline
- [ ] HTTPS 지원

---

### Phase 3: Android TWA 앱 생성

#### 도구 설치

```bash
npm install -g @bubblewrap/cli
bubblewrap --version
```

#### Bubblewrap으로 앱 생성

```bash
bubblewrap init \
  --manifest=/path/to/manifest.json \
  --package=com.clicksurvivor.seoulsurvival \
  --host=clicksurvivor.com \
  --directory=./android-app
```

#### 서명 키 생성

```bash
keytool -genkey -v \
  -keystore release.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias seoulsurvival
```

입력 정보:

```
Key store password: [강력한 비밀번호]
Key password: [강력한 비밀번호]
First and last name: Seoul Survival Game
Organizational Unit: ClickSurvivor
Organization: ClickSurvivor Studio
City: Seoul
State/Province: Seoul
Country Code: KR
```

#### SHA256 Fingerprint 추출

```bash
keytool -list -v -keystore release.jks -alias seoulsurvival
```

Output 예:

```
Certificate fingerprints:
     SHA1: XX:XX:XX:XX...
     SHA256: YY:YY:YY:YY...
```

**YY:YY:YY:YY... 값을 복사하여 콜론(:) 제거:**

```
YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

#### assetlinks.json 업데이트

`.well-known/assetlinks.json`의 `sha256_cert_fingerprints` 배열 업데이트:

```json
{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.clicksurvivor.seoulsurvival",
    "sha256_cert_fingerprints": ["ACTUAL_SHA256_FINGERPRINT_HERE"]
  }
}
```

#### 앱 빌드 및 서명

```bash
bubblewrap build \
  --keystore=release.jks \
  --keystore-password=[password] \
  --key-password=[password] \
  --key-alias=seoulsurvival
```

Output: `app-release.aab` 또는 `app-release.apk`

---

### Phase 4: 도메인 검증

#### assetlinks.json 배포

1. 파일을 GitHub Pages에 배포:

   ```bash
   npm run build
   git add dist/.well-known/assetlinks.json
   git commit -m "feat: TWA assetlinks configuration"
   git push origin gh-pages
   ```

2. URL에서 접근 확인:

   ```bash
   curl https://clicksurvivor.com/.well-known/assetlinks.json
   ```

   예상 응답:

   ```json
   [
     {
       "relation": ["delegate_permission/common.handle_all_urls"],
       "target": {
         "namespace": "android_app",
         "package_name": "com.clicksurvivor.seoulsurvival",
         "sha256_cert_fingerprints": ["ACTUAL_FINGERPRINT"]
       }
     }
   ]
   ```

#### Google Play Console에서 검증

1. [Google Play Console](https://play.google.com/console) 접속
2. 앱 생성 → "Seoul Survival"
3. 스토어 정보 → 앱 서명
4. assetlinks.json 자동 검증

---

### Phase 5: Google Play Store 등록

#### 앱 정보 입력

- **앱 이름**: 서울 생존기 : 흙수저 탈출
- **스크린샷**: `assets/icons/screenshot-*.png` 5개 이상
- **설명**: PWA manifest.json의 description 사용
- **카테고리**: Games
- **콘텐츠 등급**: 개발 중
- **개인정보 보호정책**: https://clicksurvivor.com/privacy.html

#### 릴리스 생성

1. 내부 테스트 → Release 생성
   - `app-release.aab` 업로드
   - 버전 코드: `1` (초기)
   - 릴리스 노트: "Initial TWA release"

2. 테스트 진행
   - 내부 테스터에게 배포
   - Play Console → Tests → Internal Testing

3. 프로덕션 배포
   - Production 트랙으로 승격

---

## 배포 후 모니터링

### PWA 사용 현황

**주요 메트릭:**

- 설치 수
- 활성 사용자
- 세션 길이
- 오프라인 모드 사용률

**분석 연동:** Google Analytics → 웹 & 앱

### TWA 사용 현황

**Google Play Console:**

- 다운로드 수
- 리뷰/별점
- 충돌 로그 (Android Vitals)
- 성능 지표 (로드 시간, 응답 시간)

### 유지보수

#### 버전 업데이트

1. 게임 코드 변경
2. `package.json` 버전 업데이트
3. `seoulsurvival/sw.js`의 `CACHE_VERSION` 증가 (optional)
4. 빌드 및 배포
5. Google Play Console에서 새 AAB 업로드

#### Service Worker 캐시 전략 조정

`seoulsurvival/sw.js` 수정:

- `STATIC_ASSETS`: 캐시할 정적 자산 목록
- `API_PATTERNS`: API 엔드포인트 패턴

변경 후:

```bash
npm run build
git add seoulsurvival/sw.js dist/seoulsurvival/sw.js
git commit -m "refactor: Service Worker cache strategy update"
git push origin gh-pages
```

---

## 문제 해결

### Service Worker 등록 실패

**증상:** DevTools에서 SW가 표시 안 됨

**해결:**

1. HTTPS 환경 확인 (localhost 제외)
2. `seoulsurvival/sw.js` 문법 확인
3. 브라우저 캐시 삭제
4. DevTools Console에서 에러 확인

```javascript
// DevTools Console
navigator.serviceWorker.getRegistrations().then(r => console.log(r))
```

### 아이콘이 표시 안 됨

**증상:** 앱 설치 시 기본 아이콘 표시

**해결:**

1. 아이콘 파일 경로 확인: `seoulsurvival/assets/icons/icon-*.png`
2. 파일 형식 PNG 확인
3. 크기 정확성 확인 (192x192, 512x512)
4. DevTools → Manifest에서 아이콘 URL 클릭해서 로드되는지 확인

### TWA 앱이 시작 안 됨

**증상:** "This app doesn't have permission to open links"

**해결:**

1. assetlinks.json 재확인: `https://clicksurvivor.com/.well-known/assetlinks.json`
2. SHA256 fingerprint 정확성 확인
3. 패키지명 일치 확인: `com.clicksurvivor.seoulsurvival`
4. Google Play Console에서 앱 서명 정보 재확인
5. 앱 캐시 삭제 후 재설치

---

## 참고 자료

- [web.dev PWA Checklist](https://web.dev/pwa-checklist/)
- [Trusted Web Activity Quick Start](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start/)
- [Bubblewrap CLI Documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- [Android App Links](https://developer.android.com/training/app-links)
- [Service Worker Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 릴리스 노트 예시 (v1.0.0 TWA)

```markdown
# 서울 생존기 v1.0.0 - Android TWA 출시

## 신기능

- PWA로 변환되어 앱 설치 지원
- 오프라인 모드 지원
- 네이티브 앱처럼 전체 화면 실행
- Android 홈 화면 아이콘 추가

## 개선사항

- Service Worker로 빠른 로딩
- 캐시 전략으로 안정적인 성능
- iOS / Android 완벽 지원

## 알려진 문제

- 특정 구형 안드로이드 (< 5.0)에서 미지원

## 설치 방법

1. Google Play Store에서 "서울 생존기" 검색
2. "설치" 버튼 클릭
3. 앱이 설치되고 홈 화면에 아이콘이 추가됨
```

---

**작성일**: 2026-02-02
**담당**: Infra Engineer
**상태**: 구현 완료, 아이콘/서명 준비 대기
