# 11. 로컬라이제이션 (Localization) - 인덱스

> **Last Updated:** 2026-01-19
>
> **GLOBAL 프레임워크** - Genuine, Local, Optimized, Brand-consistent, Accessible, Living
>
> 이 문서는 모듈화된 로컬라이제이션 문서의 인덱스입니다.

[← 이전: Audio](../10-audio/_index.md) | [다음: Market Strategy →](../12-marketing/market-strategy.md)

---

## 📚 문서 구조

| 문서                                                 | 내용                                | 섹션        |
| :--------------------------------------------------- | :---------------------------------- | :---------- |
| [**A. Philosophy**](./a-philosophy.md)               | GLOBAL 프레임워크, 언어 티어 시스템 | 11.1~11.2   |
| [**B. Architecture**](./b-architecture.md)           | i18n 파일 구조, 번역 가이드라인     | 11.3~11.4   |
| [**C. Glossary & Culture**](./c-glossary-culture.md) | 용어 사전, 문화적 적응              | 11.5~11.6   |
| [**D. Grammar & Fonts**](./d-grammar-fonts.md)       | 복수형/문법 처리, 폰트 설정         | 11.7~11.8   |
| [**E. QA & Community**](./e-qa-community.md)         | 번역 QA 프로세스, 커뮤니티 번역     | 11.9~11.10  |
| [**F. Implementation**](./f-implementation.md)       | i18next 설정, 언어 전환 UI          | 11.11~11.12 |

---

## 🎯 빠른 참조

### GLOBAL 프레임워크 원칙

| 원칙                 | 설명                               |
| :------------------- | :--------------------------------- |
| **G**enuine          | 한국 문화의 본질을 왜곡 없이 전달  |
| **L**ocal            | 각 시장의 문화적 기대에 맞춤       |
| **O**ptimized        | UI 공간, 폰트 렌더링, 성능 최적화  |
| **B**rand-consistent | 캐릭터성, 게임 톤, 용어 일관성     |
| **A**ccessible       | WCAG 2.1 AA 준수, 스크린 리더 호환 |
| **L**iving           | 지속적 품질 개선, 커뮤니티 피드백  |

### 언어 지원 티어

| 티어       | 언어                                             | MVP 포함 | 상태         |
| :--------- | :----------------------------------------------- | :------- | :----------- |
| **Tier 1** | 한국어 (ko), 영어 (en)                           | ✅       | Full Support |
| **Tier 2** | 일본어, 중국어 간/번체                           | ❌       | Post-Launch  |
| **Tier 3** | 스페인어, 독일어, 프랑스어, 포르투갈어, 러시아어 | ❌       | Post-Launch  |
| **Tier 4** | 이탈리아어, 폴란드어, 터키어 등                  | ❌       | Community    |

### 번역하지 않는 용어

| 용어         | 이유                             |
| :----------- | :------------------------------- |
| **Kimchi**   | 글로벌 인지도, UNESCO 등재       |
| **Kimjang**  | 한국 고유 문화 (첫 언급 시 설명) |
| **Sol**      | 화성 하루 (SF 표준)              |
| **Ares One** | 기지 고유명사                    |

### UI 텍스트 길이 제한

| 요소      | 한국어 | 영어 | 일본어 |
| :-------- | :----- | :--- | :----- |
| 버튼      | 6자    | 15자 | 6자    |
| 탭 라벨   | 4자    | 12자 | 4자    |
| 툴팁 제목 | 15자   | 30자 | 15자   |
| 알림      | 40자   | 80자 | 40자   |

### 폰트 스택

| 언어        | 기본 폰트    | 폴백                               |
| :---------- | :----------- | :--------------------------------- |
| 한국어      | Pretendard   | Apple SD Gothic Neo, Malgun Gothic |
| 영어/라틴   | Inter        | system-ui, Segoe UI, sans-serif    |
| 일본어      | Noto Sans JP | Hiragino Sans, Yu Gothic           |
| 중국어 (간) | Noto Sans SC | PingFang SC, Microsoft YaHei       |

### 구현 우선순위

| Phase       | 기능                         | 언어                  |
| :---------- | :--------------------------- | :-------------------- |
| **Phase 1** | 기본 i18n, 언어 전환 UI      | ko, en                |
| **Phase 2** | Tier 2 언어, 커뮤니티 플랫폼 | ja, zh-CN, zh-TW      |
| **Phase 3** | Tier 3 언어, RTL/수직 텍스트 | es, de, fr, pt-BR, ru |

---

## 📁 관련 파일

```
src/
└── i18n/
    ├── index.ts              # i18next 초기화
    ├── config.ts             # 언어 설정
    └── locales/
        ├── ko/               # 한국어
        │   ├── common.json
        │   ├── game.json
        │   └── story.json
        └── en/               # 영어
            └── (동일 구조)
```

---

## 📖 세부 문서 바로가기

- **철학/전략**: [A. Philosophy](./a-philosophy.md)
- **기술 아키텍처**: [B. Architecture](./b-architecture.md)
- **용어/문화**: [C. Glossary & Culture](./c-glossary-culture.md)
- **문법/폰트**: [D. Grammar & Fonts](./d-grammar-fonts.md)
- **QA/커뮤니티**: [E. QA & Community](./e-qa-community.md)
- **구현 코드**: [F. Implementation](./f-implementation.md)

---

[← 이전: Audio](../10-audio/_index.md) | [다음: Market Strategy →](../12-marketing/market-strategy.md)
