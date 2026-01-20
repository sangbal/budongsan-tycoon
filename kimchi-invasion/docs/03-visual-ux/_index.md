# 3. Visual & UX/UI Design (비주얼 및 사용자 경험) - 인덱스

> **Last Updated:** 2026-01-19
>
> ⚠️ **모듈화 안내:** 이 문서는 context 효율성을 위해 8개의 하위 문서로 분할되었습니다.

[← 목차로 돌아가기](../README.md) | [← 이전: Game Mechanics](../02-mechanics/game-mechanics.md) | [다음: Progression →](../04-progression/_index.md)

---

## 분할 문서 목록

| #     | 문서                                    | 섹션           | 핵심 내용                                      |
| :---- | :-------------------------------------- | :------------- | :--------------------------------------------- |
| **A** | [Design System](./a-design-system.md)   | 3.1~3.4        | 디자인 철학, 색상 시스템, 타이포그래피, 아이콘 |
| **B** | [Layout](./b-layout.md)                 | 3.5~3.6        | HUD 레이아웃, 반응형, 조작 방식 (PC/모바일)    |
| **C** | [Animation](./c-animation.md)           | 3.7~3.8        | 애니메이션 시스템, 메뉴 구조                   |
| **D** | [Overlays](./d-overlays.md)             | 3.9~3.11       | Master Plan Mode, 알림 시스템, 화성 환경 UI    |
| **E** | [Integration](./e-integration.md)       | 3.12~3.14      | 사운드-UI 연동, 성능 최적화, 디자인 토큰       |
| **F** | [Accessibility](./f-accessibility.md)   | 3.15           | WCAG 2.1 AA 접근성 가이드                      |
| **G** | [Asset Specs](./g-asset-specs.md)       | 3.16.1~3.16.3  | 건물 에셋 (50종), 자원 아이콘 (42종)           |
| **H** | [Asset Advanced](./h-asset-advanced.md) | 3.16.4~3.16.10 | UI 컴포넌트, 효과, AI 생성 가이드              |

---

## 빠른 참조

### 핵심 디자인 원칙

| 원칙            | 설명                     | 상세 문서                                |
| :-------------- | :----------------------- | :--------------------------------------- |
| Mission Control | NASA 미션 컨트롤 UI 영감 | [A. Design System](./a-design-system.md) |
| 정보 밀도       | HUD는 화면의 10% 이하    | [B. Layout](./b-layout.md)               |
| WCAG 2.1 AA     | 접근성 준수              | [F. Accessibility](./f-accessibility.md) |

### 색상 팔레트 요약

| 색상          | HEX       | 용도       | 상세 문서                                |
| :------------ | :-------- | :--------- | :--------------------------------------- |
| Space Black   | `#0D1117` | 배경, 패널 | [A. Design System](./a-design-system.md) |
| Mars Rust     | `#8B4513` | 화성 토양  | [A. Design System](./a-design-system.md) |
| Kimchi Red    | `#E63946` | 김치, 경고 | [A. Design System](./a-design-system.md) |
| Electric Blue | `#00D4FF` | 전력, 연구 | [A. Design System](./a-design-system.md) |
| Cabbage Green | `#2D5A27` | 농업, 성장 | [A. Design System](./a-design-system.md) |

### 레이아웃 브레이크포인트

| 디바이스         | 너비           | 상세 문서                  |
| :--------------- | :------------- | :------------------------- |
| Mobile Portrait  | < 480px        | [B. Layout](./b-layout.md) |
| Mobile Landscape | 480px - 767px  | [B. Layout](./b-layout.md) |
| Tablet           | 768px - 1023px | [B. Layout](./b-layout.md) |
| Desktop          | ≥ 1024px       | [B. Layout](./b-layout.md) |

### 에셋 요약

| 카테고리    | 수량  | 우선순위 | 상세 문서                                  |
| :---------- | :---- | :------- | :----------------------------------------- |
| 건물        | 50종  | 🔴 MVP   | [G. Asset Specs](./g-asset-specs.md)       |
| 자원 아이콘 | 42종  | 🔴 MVP   | [G. Asset Specs](./g-asset-specs.md)       |
| UI 컴포넌트 | ~30종 | 🔴 MVP   | [H. Asset Advanced](./h-asset-advanced.md) |
| 파티클/효과 | 12종  | 🟡 M2    | [H. Asset Advanced](./h-asset-advanced.md) |

---

[← 목차로 돌아가기](../README.md) | [다음: Progression →](../04-progression/_index.md)
