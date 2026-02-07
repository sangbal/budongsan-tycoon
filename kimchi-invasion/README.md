# Kimchi Invasion

**장르:** Factory Automation + Idle Incremental
**스택:** Vite + PixiJS 8 + Zustand
**컨셉:** 화성 김치 생산 → 지구 수출 → 새 행성 이주

## 개발 서버

```bash
npm run dev  # http://localhost:5173/kimchi-invasion/
```

## 주요 문서

**최신 상태:** `kimchi-invasion/docs/_ai-context/PROGRESS.md` 참조

- `docs/_ai-context/QUICK_START.md` - 게임 개요
- `docs/00-foundation/development-plan.md` - 개발 계획서

## 아키텍처

```
kimchi-invasion/src/
├── main.js           # 게임 초기화
├── core/             # 렌더러, 입력 처리
├── state/            # Zustand 상태 관리
├── systems/          # ECS-lite 시스템
└── ui/               # UI 컴포넌트
```

## 게임 플로우

1. **화성 생산**: 김치 제조 시설 구축
2. **지구 수출**: 우주선으로 김치 배송
3. **행성 확장**: 새로운 행성에 공장 건설
4. **자동화**: 효율 업그레이드 및 자동 생산

## 기술 스택

- **렌더링**: PixiJS 8 (WebGL)
- **상태 관리**: Zustand (간단한 상태 관리)
- **빌드**: Vite (빠른 개발 서버)
- **공유 모듈**: `../shared/` (인증, i18n 등)
