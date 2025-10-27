# 서울 역세권 타이쿤

브라우저 기반 부동산 경영 시뮬레이션 게임

## 게임 소개

서울의 지하철 역세권 부동산을 사고팔며 부동산 재벌이 되어보세요!

## 플레이 방법

`index.html` 파일을 브라우저로 열면 바로 플레이할 수 있습니다.

## GitHub Pages 배포

### 초기 설정 (1회만 실행)

1. GitHub에서 새 저장소 생성
2. 다음 명령어로 원격 저장소 연결:
```bash
git remote add origin https://github.com/sangbal/저장소명.git
git push -u origin main
```

3. GitHub 저장소 설정에서 Pages 활성화:
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main" / "/ (root)"
   - Save

### 자동 배포 (업데이트 시마다)

#### 방법 1: 배치 스크립트 사용
```bash
deploy.bat
```

#### 방법 2: PowerShell 스크립트 사용
```bash
.\deploy.ps1
```

#### 방법 3: 수동 명령어
```bash
git add .
git commit -m "업데이트"
git push
```

## 개발 정보

- 버전: v2.9.0
- 개발: sangbal
- 라이선스: MIT

