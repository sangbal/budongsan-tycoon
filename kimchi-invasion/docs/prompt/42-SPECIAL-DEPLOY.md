# 배포 프롬프트

> **용도:** 빌드, 배포, 릴리스
> **사용 시점:** 개발 완료 후 배포 시
> **권장 Agent:** deploy-agent

---

## 프롬프트 - 빌드 확인 (아래 내용 전체 복사)

```
KIMCHI INVASION 프로덕션 빌드를 확인해줘.

1. npm run build 실행
2. 빌드 에러 확인 및 수정
3. 번들 크기 확인 (목표: < 300KB gzip)
4. dist/ 폴더 내용 확인

문제 있으면 수정하고 결과 알려줘.
```

---

## 프롬프트 - deploy-agent 활용 (권장)

```
deploy-agent를 사용해서 KIMCHI INVASION을 배포해줘.

deploy-agent가:
1. 프로덕션 빌드 실행
2. 빌드 결과 검증
3. 배포 전 체크리스트 확인
4. 배포 실행
5. 배포 후 동작 확인

완료 후 배포 URL과 상태 알려줘.
```

---

## 프롬프트 - 배포 전 체크 (orchestrator)

```
orchestrator를 사용해서 KIMCHI INVASION 배포 전 체크리스트를 확인해줘.

orchestrator가:
1. test-agent로 전체 테스트 실행
2. performance-agent로 성능 목표 확인
3. deploy-agent로 빌드 검증
4. Playwright로 주요 기능 동작 확인

체크 항목:
- [ ] 모든 테스트 통과
- [ ] 프로덕션 빌드 성공
- [ ] 콘솔 에러 없음
- [ ] 저장/불러오기 정상
- [ ] 한/영 언어 전환 정상
- [ ] 성능 목표 달성 (60fps, 3초 로딩)

각 항목 확인하고 결과 보고해줘.
```

---

## 프롬프트 - 버전 릴리스

```
deploy-agent를 사용해서 KIMCHI INVASION [버전] 릴리스를 진행해줘.

deploy-agent가:
1. package.json 버전 업데이트
2. 변경 사항 정리 (CHANGELOG 형식)
3. 빌드 및 테스트
4. Git 커밋 및 태그
5. 배포

릴리스 노트 작성해서 보여줘.
```

---

## 사용 예시

### MVP 릴리스

```
deploy-agent를 사용해서 KIMCHI INVASION v0.1.0 (MVP) 릴리스를 진행해줘.

deploy-agent가:
1. package.json 버전 → 0.1.0
2. CHANGELOG 작성:
   - M1: 클릭 채굴, 건물 배치, 첫 김치 생산
   - M2: 컨베이어, 연구소, 자동화 시작
3. 빌드 및 전체 테스트
4. Git 커밋 (feat: KIMCHI INVASION MVP release)
5. Git 태그 (v0.1.0)
6. 배포

릴리스 노트 작성해서 보여줘.
```

### 핫픽스

```
deploy-agent를 사용해서 KIMCHI INVASION v0.1.1 (핫픽스) 릴리스를 진행해줘.

수정 내용:
- [버그 설명]

deploy-agent가:
1. package.json 버전 → 0.1.1
2. CHANGELOG에 핫픽스 기록
3. 빌드 및 테스트
4. Git 커밋 (fix: [버그 설명])
5. Git 태그 (v0.1.1)
6. 배포

릴리스 노트 작성해서 보여줘.
```

---

## 배포 체크리스트

### 기능 확인

- [ ] 게임 로딩 정상
- [ ] 클릭 채굴 동작
- [ ] 건물 배치/작동
- [ ] 자원 생산/소비
- [ ] 김치 생산 (M1 완료 기준)
- [ ] 저장/불러오기
- [ ] 언어 전환

### 성능 확인

- [ ] FPS 60 유지
- [ ] 로딩 3초 이내
- [ ] 번들 300KB 이하

### 기술 확인

- [ ] 콘솔 에러 없음
- [ ] 모바일 터치 (기본)
- [ ] 크로스 브라우저 (Chrome, Firefox, Safari)

---

## 배포 명령어

```bash
# 프로덕션 빌드
npm run build

# 빌드 프리뷰
npm run preview

# 배포 (GitHub Pages)
# .github/workflows에서 자동 실행됨
git push origin main

# 수동 배포
deploy.bat  # 또는 deploy.ps1
```

---

## Agent 역할 분담

| 배포 단계     | Agent/MCP         |
| :------------ | :---------------- |
| 빌드          | deploy-agent      |
| 테스트        | test-agent        |
| 성능 검증     | performance-agent |
| 동작 확인     | Playwright        |
| 에러 모니터링 | Sentry MCP        |
| 배포 실행     | deploy-agent      |

---

## Sentry 통합 (에러 모니터링)

```
deploy-agent를 사용해서 Sentry 에러 모니터링을 설정해줘.

deploy-agent가:
1. Sentry MCP로 프로젝트 설정
2. main.js에 Sentry.init() 추가
3. 에러 바운더리 구현
4. 테스트: 의도적 에러 발생 → Sentry 대시보드 확인

설정 완료 후 Sentry 대시보드 URL 알려줘.
```

---

## 롤백 절차

문제 발생 시:

```bash
# 이전 버전으로 롤백
git revert HEAD
git push origin main

# 또는 특정 커밋으로
git revert [커밋해시]
git push origin main
```

---

## Ralph Loop 연동 (자동 배포)

```
/ralph-loop "
KIMCHI INVASION 자동 배포:

1. npm run build 실행
2. 빌드 에러 있으면 수정
3. npx playwright test 실행
4. 테스트 실패하면 bug-hunter로 수정
5. 모든 검증 통과 시 git push
6. 배포 성공 시 <promise>DEPLOY_COMPLETE</promise>
" --max-iterations 15 --completion-promise "DEPLOY_COMPLETE"
```
