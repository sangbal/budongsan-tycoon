# 10. 사운드 & 음악 시스템 (Audio System) - 인덱스

> **Last Updated:** 2026-01-19
>
> ⚠️ **모듈화 안내:** 이 문서는 context 효율성을 위해 6개의 하위 문서로 분할되었습니다.

[← 목차로 돌아가기](../README.md) | [← 이전: Technical](../09-technical/_index.md) | [다음: Localization →](../11-localization/_index.md)

---

## 분할 문서 목록

| #     | 문서                                          | 섹션       | 핵심 내용                                          |
| :---- | :-------------------------------------------- | :--------- | :------------------------------------------------- |
| **A** | [Design Philosophy](./a-design.md)            | 10.1       | MARS 오디오 디자인 철학, 레퍼런스, 감정 매핑       |
| **B** | [BGM System](./b-bgm.md)                      | 10.2       | 적응형 레이어 시스템, 마일스톤 테마, 전환 시스템   |
| **C** | [SFX System](./c-sfx.md)                      | 10.3       | 효과음 카테고리 (120+ SFX), 기술 사양, 변형 시스템 |
| **D** | [Ambience & Spatial](./d-ambience-spatial.md) | 10.4~10.5  | 화성 환경음, 공장 환경음, 3D 공간 오디오           |
| **E** | [Optimization](./e-optimization.md)           | 10.6~10.8  | 접근성, 모바일 최적화, 설정 UI                     |
| **F** | [Implementation](./f-implementation.md)       | 10.9~10.11 | Howler.js 구현, 에셋 파이프라인, 로딩 전략         |

---

## 빠른 참조

### MARS 오디오 디자인 원칙

| 원칙           | 설명                                 | 상세 문서                  |
| :------------- | :----------------------------------- | :------------------------- |
| **M**eaningful | 모든 사운드는 게임플레이 정보 전달   | [A. Design](./a-design.md) |
| **A**daptive   | 게임 상태에 따라 동적 변화           | [A. Design](./a-design.md) |
| **R**ealistic  | 화성 환경의 물리적 특성 반영         | [A. Design](./a-design.md) |
| **S**ubtle     | 과도한 사운드 회피, 중요 순간만 강조 | [A. Design](./a-design.md) |

### BGM 레이어 구조

| 레이어  | 역할            | 조건               | 상세 문서            |
| :------ | :-------------- | :----------------- | :------------------- |
| Layer 0 | 앰비언트 베이스 | 항상 재생          | [B. BGM](./b-bgm.md) |
| Layer 1 | 하모닉 베드     | 마일스톤별 변화    | [B. BGM](./b-bgm.md) |
| Layer 2 | 활동 레이어     | 생산 활동량에 따라 | [B. BGM](./b-bgm.md) |
| Layer 3 | 긴장 레이어     | 위기 상황 시       | [B. BGM](./b-bgm.md) |
| Layer 4 | 성취 레이어     | 목표 달성 시       | [B. BGM](./b-bgm.md) |

### SFX 카테고리 요약

| 카테고리      | 수량 | 주요 용도              | 상세 문서            |
| :------------ | :--- | :--------------------- | :------------------- |
| UI 사운드     | 15종 | 클릭, 호버, 메뉴       | [C. SFX](./c-sfx.md) |
| 건설 사운드   | 12종 | 배치, 철거, 업그레이드 | [C. SFX](./c-sfx.md) |
| 생산 사운드   | 20종 | 기계 가동, 제작, 발효  | [C. SFX](./c-sfx.md) |
| 물류 사운드   | 12종 | 벨트, 투입기, 드론     | [C. SFX](./c-sfx.md) |
| 에너지 사운드 | 10종 | 전력, 태양광, 발전기   | [C. SFX](./c-sfx.md) |
| 환경 사운드   | 15종 | 바람, 폭풍, 실내/외    | [C. SFX](./c-sfx.md) |
| 알림/성취     | 14종 | 경고, 업적, 프레스티지 | [C. SFX](./c-sfx.md) |
| 캐릭터        | 10종 | 걷기, 상호작용 [추후]  | [C. SFX](./c-sfx.md) |

### 기술 스택

| 기술              | 용도                   | 상세 문서                                  |
| :---------------- | :--------------------- | :----------------------------------------- |
| **Howler.js**     | 오디오 재생, 풀링      | [F. Implementation](./f-implementation.md) |
| **Web Audio API** | 공간 오디오, 버스 믹싱 | [F. Implementation](./f-implementation.md) |
| **OGG/MP3**       | 배포 포맷              | [F. Implementation](./f-implementation.md) |

### 구현 우선순위

| Phase   | 기능                          | 상세 문서                                  |
| :------ | :---------------------------- | :----------------------------------------- |
| Phase 1 | 기본 BGM, UI SFX, 볼륨 컨트롤 | [F. Implementation](./f-implementation.md) |
| Phase 2 | 적응형 음악, 생산 SFX         | [B. BGM](./b-bgm.md), [C. SFX](./c-sfx.md) |
| Phase 3 | 공간 오디오, 환경음           | [D. Ambience](./d-ambience-spatial.md)     |
| Phase 4 | 접근성, 모바일 최적화         | [E. Optimization](./e-optimization.md)     |

---

[← 목차로 돌아가기](../README.md) | [다음: Localization →](../11-localization/_index.md)
