# 9. Technical Specification (기술 사양) - 인덱스

> **Last Updated:** 2026-01-19
>
> ⚠️ **모듈화 안내:** 이 문서는 context 효율성을 위해 11개의 하위 문서로 분할되었습니다.

[← 목차로 돌아가기](../README.md) | [← 이전: Achievements](../08-achievements/achievements.md) | [다음: Audio →](../10-audio/_index.md)

---

## 분할 문서 목록

| #     | 문서                                    | 섹션      | 핵심 내용                                                       |
| :---- | :-------------------------------------- | :-------- | :-------------------------------------------------------------- |
| **A** | [Tech Stack](./a-tech-stack.md)         | 9.1~9.3   | FAST 원칙, 플랫폼 지원, 프론트엔드 스택 (PixiJS, Vite, Zustand) |
| **B** | [Backend](./b-backend.md)               | 9.4       | Supabase 구성, DB 스키마, RLS, Edge Functions                   |
| **C** | [Performance](./c-performance.md)       | 9.5       | 성능 목표, 자동 품질 조절, 렌더링/메모리/네트워크 최적화        |
| **D** | [Game Engine](./d-engine.md)            | 9.6       | 게임 루프, ECS 아키텍처, 이벤트 시스템                          |
| **E** | [Save System](./e-save-system.md)       | 9.7       | 저장 계층 (4단계), 데이터 구조, 마이그레이션                    |
| **F** | [Security](./f-security.md)             | 9.8       | 보안 위협 대응, 치팅 탐지, 인증 보안                            |
| **G** | [DevOps](./g-devops.md)                 | 9.9       | 개발 환경, 테스트 전략, CI/CD, 모니터링                         |
| **H** | [Loading](./h-loading.md)               | 9.10      | 로딩 시퀀스 (5단계), 프로그레시브 로딩                          |
| **I** | [Accessibility](./i-accessibility.md)   | 9.11      | WCAG 2.1 AA, 키보드 네비게이션, 스크린 리더                     |
| **J** | [Platform](./j-platform.md)             | 9.12      | 크로스플랫폼 로드맵, Godot 전환, Steam/모바일                   |
| **K** | [Error Handling](./k-error-handling.md) | 9.13~9.14 | 에러 분류, 복구 시스템, 요약                                    |

---

## 빠른 참조

### 핵심 기술 스택

| 영역   | 기술          | 상세 문서                                       |
| :----- | :------------ | :---------------------------------------------- |
| 렌더링 | PixiJS 8.x    | [A. Tech Stack](./a-tech-stack.md)              |
| 빌드   | Vite 5.x      | [A. Tech Stack](./a-tech-stack.md)              |
| 상태   | Zustand 4.x   | [A. Tech Stack](./a-tech-stack.md)              |
| 백엔드 | Supabase      | [B. Backend](./b-backend.md)                    |
| 오디오 | Howler.js 2.x | [../10-audio/\_index.md](../10-audio/_index.md) |

### 성능 목표

| 지표             | 목표  | 최소  | 상세 문서                            |
| :--------------- | :---- | :---- | :----------------------------------- |
| 첫 상호작용      | 3초   | 5초   | [C. Performance](./c-performance.md) |
| FPS (중사양)     | 45    | 30    | [C. Performance](./c-performance.md) |
| 번들 크기 (gzip) | 300KB | 500KB | [A. Tech Stack](./a-tech-stack.md)   |

### 크로스플랫폼 로드맵

| Phase            | 기술                 | 상세 문서                      |
| :--------------- | :------------------- | :----------------------------- |
| Phase 1 (현재)   | Web (JS/TS + PixiJS) | [J. Platform](./j-platform.md) |
| Phase 1.5 (선택) | Electron + Steam     | [J. Platform](./j-platform.md) |
| Phase 2 (권장)   | Godot 4 리빌드       | [J. Platform](./j-platform.md) |

---

[← 목차로 돌아가기](../README.md) | [다음: Audio →](../10-audio/_index.md)
