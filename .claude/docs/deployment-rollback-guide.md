# Phase 1.5 배포 롤백 가이드

## 개요

본 문서는 SeoulSurvival i18n Phase 1.5 배포 시 긴급 상황에서 5분 이내에 빠른 복구가 가능하도록 작성된 실무 가이드입니다.

**목적**: Phase 1 배포 중 치명적 버그 발생 시 신속한 롤백을 통해 서비스 안정성 확보

**적용 범위**:

- SeoulSurvival i18n 기능 배포 (Phase 1.5)
- 긴급 상황 대응 프로세스
- 배포 전/후 모니터링

**대상 독자**:

- 배포 담당자
- CTO / 인프라 엔지니어
- 긴급 상황 대응팀

---

## 배포 전 체크리스트

**배포 시작 최소 1시간 전 완료**

### 기술 검증

```markdown
□ 프로젝트 빌드 성공 확인
npm run build

□ i18n 검증 스크립트 통과
npm run validate:i18n
출력 결과: "✅ 모든 검증 완료" 확인

□ 전체 테스트 통과
npm test
E2E 테스트 포함: npm run test:e2e (선택)

□ npm lint 통과
npm run lint
ESLint 에러 0개 확인

□ 프로덕션 빌드 크기 확인
du -sh seoulsurvival/dist/
이전 배포 대비 10% 이상 증가하지 않았는지 확인
```

### 배포 준비

```markdown
□ 이전 커밋 ID 기록
git log --oneline | head -5
첫 번째 커밋 ID를 메모장에 저장
예: 3cf6f92 opt: 세이브 데이터 압축

□ 현재 브랜치 확인
git branch

- main <- 메인 브랜치에 있는지 확인

□ 원격 동기화 확인
git status
"Your branch is up to date with 'origin/main'" 확인

□ 배포 시작 시간 기록
현재 시간: \_**\_:\_\_** (24시간 형식)

□ Sentry 대시보드 접속 준비
https://sentry.io/[organization]/seoul-survival/
로그인 상태 확인

□ GitHub Actions 확인
https://github.com/sangbal/seoul-survival/actions
브라우저에 탭 열기

□ 게임 서버 상태 확인
https://clicksurvivor.com/seoulsurvival/
정상 동작 확인
```

### 백업 생성

```markdown
□ 배포 전 태그 생성
git tag -a v-pre-phase1.5-$(date +%Y%m%d-%H%M%S) \
 -m "Backup before Phase 1.5 deployment"
git push origin --tags

□ 백업 브랜치 생성 (옵션, 매우 안전한 방식)
git branch backup-before-phase1.5-$(date +%Y%m%d-%H%M%S)
  git push origin backup-before-phase1.5-$(date +%Y%m%d-%H%M%S)
```

---

## 긴급 롤백 프로세스

### 롤백 판단 기준

**다음 중 하나라도 발생하면 즉시 롤백 실행**:

| 상황                      | 심각도      | 조치             |
| ------------------------- | ----------- | ---------------- |
| 메인 페이지 접속 불가     | 🔴 critical | 즉시 롤백        |
| 게임 플레이 불가          | 🔴 critical | 즉시 롤백        |
| 언어 전환 버튼 작동 안 됨 | 🔴 critical | 즉시 롤백        |
| Sentry 에러율 > 5%        | 🔴 critical | 즉시 롤백        |
| 크리티컬 버그 3건 이상    | 🔴 critical | 즉시 롤백        |
| 게임 저장 실패            | 🔴 critical | 즉시 롤백        |
| UI 텍스트 표시 안 됨      | 🔴 critical | 즉시 롤박        |
| 경미한 버그 1-2건         | 🟡 warning  | 모니터링 후 판단 |

---

## 롤백 시나리오별 상세 절차

### 시나리오 A: Git 리셋 (권장, 5분 복구)

**상황**: 배포 후 1시간 이내, 최신 커밋이 문제일 때
**복구 시간**: 약 3-5분
**복원 신뢰도**: ⭐⭐⭐⭐⭐ (최고)

#### Step A1: 롤백 커밋 식별

```bash
# 현재 로그 확인
git log --oneline | head -10

# 출력 예시:
# abc1234 feat: Phase 1.5 i18n 배포
# 3cf6f92 opt: 세이브 데이터 압축
# a82d3d0 opt: 리더보드 조회 클라이언트 캐싱
# d2a2fff feat: 리더보드 5분 캐시
# ... (이전 커밋들)

# 좋은 상태의 커밋 ID 선택
# 예: 3cf6f92 (배포 전 마지막 안정 커밋)
```

**중요**: 배포 전 메모한 커밋 ID를 사용

#### Step A2: Git 리셋 실행

```bash
# 변수 설정
GOOD_COMMIT="3cf6f92"  # 배포 전 마지막 안정 커밋

# 로컬 리셋 (원격은 아직 수정하지 않음)
git reset --hard $GOOD_COMMIT

# 결과 확인
git log --oneline | head -3
# abc1234 (HEAD -> main) opt: 세이브 데이터 압축 <- 현재 상태
```

#### Step A3: 강제 푸시 (안전한 방식)

```bash
# force-with-lease 사용 (다른 개발자의 변경사항 보호)
git push --force-with-lease origin main

# 또는 일반 강제 푸시 (매우 주의)
# git push --force origin main
```

**안내**:

- `--force-with-lease`: ✅ 권장 (다른 푸시 감지 시 실패)
- `--force`: ⚠️ 위험 (모든 변경 덮어쓰기)

#### Step A4: GitHub Actions 배포 모니터링

```bash
# GitHub Actions 페이지 확인
# https://github.com/sangbal/seoul-survival/actions

# 또는 CLI로 확인 (gh 설치 필수)
gh run list --branch main --workflow=deploy.yml --limit 1

# 상태 확인:
# - in_progress: 배포 진행 중
# - completed: success or failure
```

**예상 시간**: 2-3분

#### Step A5: 배포 완료 확인

```bash
# 1. 웹사이트 접속
# https://clicksurvivor.com/seoulsurvival/

# 2. 개발자 도구 확인 (F12)
# Console 탭: 에러 확인
# Network 탭: 새로고침 후 리소스 로드 확인

# 3. 게임 플레이 테스트
# - 메인 화면 진입
# - 클릭 가능
# - 언어 전환 (한국어 ↔ 영어)
# - 설정 메뉴 열기

# 4. 저장 기능 테스트
# - 게임 데이터 저장 (Ctrl+S)
# - 새로고침 후 데이터 로드 확인
```

---

### 시나리오 B: 특정 파일만 롤백

**상황**: 특정 파일의 버그가 명확할 때 (예: 번역 파일, 특정 UI)
**복구 시간**: 약 5-7분
**복원 신뢰도**: ⭐⭐⭐⭐ (높음)

#### Step B1: 문제 파일 식별

```bash
# 최근 변경된 파일 확인
git diff HEAD~1 HEAD --name-only

# 출력 예시:
# seoulsurvival/src/i18n/translations/ko.js
# seoulsurvival/src/i18n/translations/en.js
# seoulsurvival/src/ui/gameUI.js
```

#### Step B2: 파일 롤백

```bash
# 방법 1: 특정 파일을 이전 버전으로 복구
GOOD_COMMIT="3cf6f92"
FILE_TO_REVERT="seoulsurvival/src/i18n/translations/ko.js"

git checkout $GOOD_COMMIT -- $FILE_TO_REVERT

# 방법 2: 여러 파일 롤백
git checkout $GOOD_COMMIT -- \
  seoulsurvival/src/i18n/translations/ko.js \
  seoulsurvival/src/i18n/translations/en.js
```

#### Step B3: 검증 및 커밋

```bash
# 변경 사항 확인
git status

# 문제 해결했는지 로컬 테스트
npm run validate:i18n
npm test

# 롤백 커밋 생성
git commit -m "fix: rollback specific files from Phase 1.5 deployment

Reverted files:
- seoulsurvival/src/i18n/translations/ko.js
- seoulsurvival/src/i18n/translations/en.js

Reason: Critical bug in i18n system
"

# 푸시
git push origin main
```

---

### 시나리오 C: 히스토리 보존 롤백 (가장 안전)

**상황**: Git 히스토리 보존이 중요할 때 (감사, 기록)
**복구 시간**: 약 7-10분
**복원 신뢰도**: ⭐⭐⭐⭐⭐ (최고, 안전성)

#### Step C1: 롤백 커밋 생성

```bash
# 이전 커밋을 역으로 적용
GOOD_COMMIT="3cf6f92"

git revert $GOOD_COMMIT

# 편집기가 열릴 예정 (기본값: vi)
# 자동 생성된 메시지 그대로 두고 저장 (ZZ 또는 :wq)
```

**주의**: `--no-edit` 플래그 사용 금지 (대화형 입력 필요)

#### Step C2: 메시지 커스터마이징 (선택)

```bash
# 만약 메시지를 수정하고 싶다면:
git revert --no-commit $GOOD_COMMIT
# (에디터에서 메시지 수정)
git commit -m "Revert 'feat: Phase 1.5 i18n deployment'

This reverts commit abc1234.

Reason: Critical bug detected in language switching
Impact: 1시간 내 전체 복구
"
```

#### Step C3: 푸시

```bash
git push origin main

# 배포 자동 시작 (GitHub Actions)
# 상태 확인: https://github.com/sangbal/seoul-survival/actions
```

**장점**:

- Git 히스토리에 롤백 기록 남음
- 누가, 언제, 왜 롤백했는지 명확
- 향후 분석 가능

---

## 배포 후 모니터링

### 1시간 이내 (즉시 확인)

**체크리스트**:

```markdown
□ 메인 페이지 접속 확인
https://clicksurvivor.com/seoulsurvival/
페이지 로드 완료 (2초 이내)

□ 게임 플레이 기본 기능 테스트

- 클릭 버튼 작동
- 수익 증가
- UI 업데이트

□ 언어 전환 수동 테스트

1. 우상단 "한국어" 또는 "English" 클릭
2. 언어 전환 확인 (2초 이내)
3. 모든 텍스트가 올바른 언어로 표시되는지 확인

한국어 → 영어 → 한국어 최소 2회 테스트

□ 설정 메뉴 확인

1. 설정 아이콘 클릭 (⚙️)
2. 자동 저장, 입자 효과 등 옵션 표시 확인
3. 텍스트 언어 일치 확인

□ 개발자 도구 확인 (F12)

- Console: 빨간 에러 0개
- Network: HTTP 에러 (5xx) 없음
- Application: 저장된 데이터 정상

□ Sentry 대시보드 확인
https://sentry.io/organizations/[org]/issues/

신규 에러 개수: \_\_\_건
에러율 변화: [이전] → [현재] %
기준선: < 5개 에러 또는 < 5% 증가
```

**통과 기준**:

- ✅ 메인 기능 모두 작동
- ✅ 언어 전환 정상
- ✅ Console 에러 0-2개 (경고 무시)
- ✅ 에러율 정상 범위

### 24시간 이내 (추세 분석)

**체크리스트**:

```markdown
□ Sentry 에러 추이 분석

- 신규 에러 발생 건수
- 에러율 증감 추이
- 크리티컬 에러 여부

□ 게임 플레이 데이터 확인 (있다면)

- 사용자 활동 정상 여부
- 게임 시작 수 이상 여부
- 진행도 저장 정상 여부

□ 커뮤니티/사용자 피드백 확인

- Discord, 이메일, GitHub Issues 확인
- 배포 관련 버그 신고 여부

□ 서버 성능 지표 확인 (있다면)

- 응답 속도
- 에러율
- CPU/메모리 사용률
```

**문제 발견 시 조치**:

| 발견 내용          | 조치                 |
| ------------------ | -------------------- |
| 신규 에러 5개 이상 | 시나리오 A 롤백 고려 |
| 에러율 > 5% 증가   | 시나리오 A 롤백 고려 |
| 크리티컬 버그 신고 | 즉시 시나리오 A 롤백 |
| 경미한 버그 1-2개  | 핫픽스 커밋 준비     |

---

## 트러블슈팅

### Git 명령어 오류

#### 오류: "Permission denied"

```bash
# 원인: GitHub 인증 실패
# 해결:
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# SSH 키 확인
ssh -T git@github.com

# 또는 HTTPS로 재설정
git remote set-url origin https://github.com/sangbal/seoul-survival.git
```

#### 오류: "Your branch has diverged"

```bash
# 원인: 로컬과 원격 브랜치가 다름
# 해결:
git fetch origin
git reset --hard origin/main
```

### 배포 오류

#### GitHub Actions 실패

```bash
# 1. GitHub Actions 페이지에서 실패 로그 확인
# https://github.com/sangbal/seoul-survival/actions

# 2. 로컬에서 동일 환경으로 재현
npm run build
npm test

# 3. 빌드 캐시 삭제 (매우 마지막 수단)
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

#### 배포 후 페이지 공백

```bash
# 1. CDN 캐시 삭제 (있다면)
# GitHub Pages 설정에서 캐시 정책 확인

# 2. 브라우저 캐시 삭제
# Ctrl+Shift+Delete (또는 개발자 도구 > 응용프로그램 > 저장소 > 삭제)

# 3. 강제 새로고침
# Ctrl+Shift+R (또는 Cmd+Shift+R)

# 4. 파일 경로 확인
# dist/seoulsurvival/index.html 존재 여부 확인
ls -la seoulsurvival/dist/
```

---

## 체크리스트: 배포 완료 후 정리

```markdown
□ 롤백 여부 최종 확인

- 롤백하지 않았다면: 모니터링 계속
- 롤백했다면: 원인 분석 문서 작성

□ 시간 기록
배포 시작: \_**\_:\_\_**
배포 완료: \_**\_:\_\_**
소요 시간: **\_**분

□ 문제 발견 여부

- 문제 없음: 정상 완료
- 경미한 문제: 핫픽스 준비
- 심각한 문제: 원인 분석 회의

□ 배포 보고서 작성
담당자: **\_\_\_**
배포 버전: v1.2.3-phase1.5
배포 결과: ✅ 성공 / ⚠️ 부분 성공 / 🔴 실패/롤백
특이사항: \***\*\_\*\***

□ 향후 개선 사항 기록

- 테스트 추가 필요
- 모니터링 알림 추가
- 문서 업데이트
```

---

## 부록: 주요 커맨드 치트시트

```bash
# === 배포 전 ===

# 코드 상태 확인
git status
git log --oneline | head -5

# 빌드 및 테스트
npm run build
npm run validate:i18n
npm test

# 태그 생성 (백업)
git tag -a v-backup-$(date +%Y%m%d-%H%M%S) -m "Backup before deployment"
git push origin --tags

# === 롤백 (시나리오 A) ===

# 이전 커밋으로 리셋
git reset --hard 3cf6f92

# 강제 푸시
git push --force-with-lease origin main

# 배포 상태 확인 (gh CLI)
gh run list --branch main --limit 1

# === 롤백 (시나리오 B) ===

# 특정 파일 롤백
git checkout 3cf6f92 -- seoulsurvival/src/i18n/translations/ko.js

# 커밋 및 푸시
git commit -m "fix: rollback specific file"
git push origin main

# === 롤백 (시나리오 C) ===

# 히스토리 보존 롤백
git revert abc1234
git push origin main

# === 배포 후 모니터링 ===

# 최신 배포 확인
git log --oneline | head -1

# 파일 크기 확인
du -sh seoulsurvival/dist/

# 배포 시간 측정
git log --format="%h %ai %s" | head -5
```

---

## 참고 자료

### 관련 문서

- `.claude/docs/phase1-i18n-completion-report.md` - Phase 1 완료 보고서
- `.claude/docs/architecture.md` - 프로젝트 아키텍처
- `CLAUDE.md` - 프로젝트 구조 및 규칙

### 외부 링크

- GitHub Repository: https://github.com/sangbal/seoul-survival
- GitHub Pages: https://clicksurvivor.com/seoulsurvival/
- GitHub Actions: https://github.com/sangbal/seoul-survival/actions
- Sentry: https://sentry.io/

### 비상 연락처

- CTO: [연락처]
- 인프라 담당: [연락처]
- 게임 디자인: [연락처]

---

**문서 작성**: 2026-02-09
**최종 검수**: 대기 중
**상태**: Phase 1.5 배포 준비
**문서관리자**: docs-manager [haiku]

---

## 문서 버전 이력

| 버전 | 작성일     | 변경 내용 |
| ---- | ---------- | --------- |
| 1.0  | 2026-02-09 | 초안 작성 |
