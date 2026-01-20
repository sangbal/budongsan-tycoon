# 11-F. 기술 구현 & 비고 (Implementation & Notes)

> **Last Updated:** 2026-01-19
>
> 원본: `11-localization.md` 섹션 11.11~11.12

[← 이전: QA & Community](./11-e-qa-community.md) | [다음: Market Strategy →](./12-market-strategy.md)

---

## 11.11. 기술 구현

### 11.11.1. i18next 설정

```typescript
// src/i18n/index.ts
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'

// 언어 설정
const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja', 'zh-CN', 'zh-TW'] as const
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// i18next 초기화
i18next
  .use(HttpApi) // 지연 로딩
  .use(LanguageDetector) // 자동 감지
  .init({
    // 지원 언어
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: 'en',

    // 감지 옵션
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'kimchi_invasion_lang',
      caches: ['localStorage'],
    },

    // 백엔드 (지연 로딩)
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // 네임스페이스
    ns: ['common', 'game', 'story', 'tutorial', 'achievements'],
    defaultNS: 'common',

    // 변수 삽입
    interpolation: {
      escapeValue: false, // React는 자체 이스케이프
      formatSeparator: ',',
      format: (value, format, lng) => {
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value)
        }
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: 'USD',
          }).format(value)
        }
        if (value instanceof Date) {
          return new Intl.DateTimeFormat(lng).format(value)
        }
        return value
      },
    },

    // 복수형
    pluralSeparator: '_',

    // 디버그 (개발 환경만)
    debug: import.meta.env.DEV,

    // React 통합
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
    },
  })

// t 함수 export
export const t = i18next.t.bind(i18next)
export const changeLanguage = (lang: SupportedLanguage) => i18next.changeLanguage(lang)
export const getCurrentLanguage = () => i18next.language as SupportedLanguage

// 훅 (React용)
export { useTranslation } from 'react-i18next'

export default i18next
```

### 11.11.2. 언어 전환 컴포넌트

```typescript
// src/components/LanguageSelector.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', status: 'soon' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳', status: 'soon' },
];

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[1];

  const handleChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    localStorage.setItem('kimchi_invasion_lang', langCode);
    setIsOpen(false);

    // 폰트 로드 (필요시)
    document.documentElement.lang = langCode;
  };

  return (
    <div className="language-selector">
      <button
        className="language-selector__trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flag">{currentLang.flag}</span>
        <span className="name">{currentLang.name}</span>
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <ul className="language-selector__dropdown">
          {LANGUAGES.map(lang => (
            <li key={lang.code}>
              <button
                onClick={() => handleChange(lang.code)}
                disabled={lang.status === 'soon'}
                className={i18n.language === lang.code ? 'active' : ''}
              >
                <span className="flag">{lang.flag}</span>
                <span className="name">{lang.name}</span>
                {lang.status === 'soon' && (
                  <span className="badge">{t('ui.coming_soon')}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="language-selector__note">
        {t('settings.language.note')}
      </p>
    </div>
  );
};
```

### 11.11.3. 번역 파일 예시

**한국어 (locales/ko/common.json):**

```json
{
  "ui": {
    "button": {
      "start": "시작하기",
      "confirm": "확인",
      "cancel": "취소",
      "save": "저장",
      "load": "불러오기",
      "settings": "설정",
      "back": "뒤로",
      "next": "다음",
      "skip": "건너뛰기"
    },
    "tab": {
      "production": "생산",
      "research": "연구",
      "logistics": "물류",
      "stats": "통계"
    },
    "label": {
      "level": "레벨",
      "power": "전력",
      "time": "시간"
    },
    "coming_soon": "출시 예정"
  },
  "settings": {
    "language": {
      "title": "언어",
      "note": "💡 언어 변경 시 게임이 새로고침됩니다."
    }
  },
  "error": {
    "generic": "오류가 발생했습니다.",
    "save": {
      "failed": "저장에 실패했습니다. 다시 시도해 주세요."
    },
    "network": {
      "timeout": "네트워크 연결 시간 초과",
      "offline": "인터넷 연결을 확인해 주세요."
    }
  }
}
```

**영어 (locales/en/common.json):**

```json
{
  "ui": {
    "button": {
      "start": "Start",
      "confirm": "Confirm",
      "cancel": "Cancel",
      "save": "Save",
      "load": "Load",
      "settings": "Settings",
      "back": "Back",
      "next": "Next",
      "skip": "Skip"
    },
    "tab": {
      "production": "Production",
      "research": "Research",
      "logistics": "Logistics",
      "stats": "Stats"
    },
    "label": {
      "level": "Level",
      "power": "Power",
      "time": "Time"
    },
    "coming_soon": "Coming Soon"
  },
  "settings": {
    "language": {
      "title": "Language",
      "note": "💡 The game will refresh when you change the language."
    }
  },
  "error": {
    "generic": "An error occurred.",
    "save": {
      "failed": "Save failed. Please try again."
    },
    "network": {
      "timeout": "Network connection timed out",
      "offline": "Please check your internet connection."
    }
  }
}
```

---

## 11.12. 비고 (Notes)

### 구현 우선순위

| 단계        | 기능                           | 중요도 | 언어                  |
| :---------- | :----------------------------- | :----- | :-------------------- |
| **Phase 1** | 기본 i18n 시스템               | 필수   | ko, en                |
| **Phase 1** | 언어 전환 UI                   | 필수   | -                     |
| **Phase 2** | Tier 2 언어                    | 높음   | ja, zh-CN, zh-TW      |
| **Phase 2** | 커뮤니티 번역 플랫폼           | 높음   | -                     |
| **Phase 3** | Tier 3 언어                    | 중간   | es, de, fr, pt-BR, ru |
| **Phase 3** | 고급 현지화 (RTL, 수직 텍스트) | 낮음   | -                     |

### 번역 통계 목표

| 언어          | Phase 1 | Phase 2 | Phase 3 |
| :------------ | :------ | :------ | :------ |
| 한국어        | 100%    | 100%    | 100%    |
| 영어          | 100%    | 100%    | 100%    |
| 일본어        | 0%      | 95%     | 100%    |
| 중국어(간/번) | 0%      | 90%     | 95%     |
| 기타          | 0%      | 0%      | 80%+    |

### 리소스

- i18next 문서: https://www.i18next.com/
- ICU MessageFormat: https://unicode-org.github.io/icu/userguide/format_parse/messages/
- Crowdin: https://crowdin.com/
- CLDR (Unicode Common Locale Data): https://cldr.unicode.org/

---

[← 이전: QA & Community](./11-e-qa-community.md) | [다음: Market Strategy →](./12-market-strategy.md)
