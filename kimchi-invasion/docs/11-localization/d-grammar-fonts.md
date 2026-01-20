# 11-D. 복수형/문법 & 폰트 (Grammar & Typography)

> **Last Updated:** 2026-01-19
>
> 원본: `11-localization.md` 섹션 11.7~11.8

[← 이전: Glossary & Culture](./11-c-glossary-culture.md) | [다음: QA & Community →](./11-e-qa-community.md)

---

## 11.7. 복수형 및 문법 처리

### 11.7.1. ICU MessageFormat

```javascript
// 복수형 처리 - ICU MessageFormat 사용
const PLURALIZATION_EXAMPLES = {
  // 영어 (2개 형태: one, other)
  en: {
    'game.day': '{count, plural, one {# day} other {# days}}',
    'game.item': '{count, plural, one {# item} other {# items}}',
    'game.kimchi_produced': '{count, plural, one {# Kimchi produced!} other {# Kimchi produced!}}',
  },

  // 한국어 (복수형 없음, 단수형만)
  ko: {
    'game.day': '{count}일',
    'game.item': '{count}개',
    'game.kimchi_produced': '김치 {count}개 생산!',
  },

  // 일본어 (복수형 없음)
  ja: {
    'game.day': '{count}日',
    'game.item': '{count}個',
    'game.kimchi_produced': 'キムチ{count}個生産！',
  },

  // 러시아어 (3개 형태: one, few, many)
  ru: {
    'game.day': '{count, plural, one {# день} few {# дня} many {# дней}}',
    'game.item': '{count, plural, one {# предмет} few {# предмета} many {# предметов}}',
  },

  // 아랍어 (6개 형태: zero, one, two, few, many, other)
  ar: {
    'game.day':
      '{count, plural, zero {لا أيام} one {يوم واحد} two {يومان} few {# أيام} many {# يومًا} other {# يوم}}',
  },
}
```

### 11.7.2. 성별 처리 (해당 언어만)

```javascript
// 성별 처리 - 프랑스어, 스페인어 등
const GENDER_HANDLING = {
  // 프랑스어 - 명사 성별에 따른 관사
  fr: {
    'game.resource.cabbage': 'le chou', // 남성
    'game.resource.salt': 'le sel', // 남성
    'game.resource.water': "l'eau", // 여성
    'ui.the_building': '{gender, select, m {le} f {la}} {building}',
  },

  // 스페인어
  es: {
    'game.resource.cabbage': 'la col', // 여성
    'game.resource.salt': 'la sal', // 여성
    'ui.the_building': '{gender, select, m {el} f {la}} {building}',
  },

  // 독일어 - 3성 (남성, 여성, 중성)
  de: {
    'game.resource.cabbage': 'der Kohl', // 남성
    'game.resource.salt': 'das Salz', // 중성
    'ui.the_building': '{gender, select, m {der} f {die} n {das}} {building}',
  },
}
```

### 11.7.3. 어순 처리

```javascript
// 언어별 어순 차이 처리
const WORD_ORDER_HANDLING = {
  // 주어-목적어-동사 (SOV) 언어: 한국어, 일본어
  ko: {
    'game.produced': '{item} {count}개 생산!', // 목적어가 앞
    'action.built': '{building}을(를) 건설했습니다',
  },

  // 주어-동사-목적어 (SVO) 언어: 영어
  en: {
    'game.produced': '{count} {item} produced!', // 동사가 앞
    'action.built': 'Built {building}',
  },

  // 변수 위치가 문법에 따라 달라짐
  de: {
    'game.produced': '{count} {item} produziert!',
    'action.built': '{building} gebaut',
  },
}

// 올바른 처리 방법
const CORRECT_INTERPOLATION = {
  // ❌ 잘못된 방식: 문자열 조합
  wrong: (count, item, lang) => {
    if (lang === 'ko') return item + ' ' + count + '개 생산!'
    return count + ' ' + item + ' produced!'
  },

  // ✅ 올바른 방식: 전체 문장을 번역
  correct: (count, item) => t('game.produced', { count, item }),
}
```

---

## 11.8. 폰트 및 타이포그래피

### 11.8.1. 언어별 폰트 스택

```javascript
// 폰트 설정
const FONT_STACKS = {
  // 라틴 문자 (영어, 스페인어, 독일어 등)
  latin: {
    primary: 'Inter',
    fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    weights: [400, 500, 600, 700],
    loading: 'swap',
  },

  // 한국어
  ko: {
    primary: 'Pretendard',
    fallback: ['Apple SD Gothic Neo', 'Malgun Gothic', '맑은 고딕', 'sans-serif'],
    weights: [400, 500, 600, 700],
    loading: 'swap',
  },

  // 일본어
  ja: {
    primary: 'Noto Sans JP',
    fallback: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'sans-serif'],
    weights: [400, 500, 700],
    loading: 'swap',
  },

  // 중국어 간체
  'zh-CN': {
    primary: 'Noto Sans SC',
    fallback: ['PingFang SC', 'Microsoft YaHei', '微软雅黑', 'sans-serif'],
    weights: [400, 500, 700],
    loading: 'swap',
  },

  // 중국어 번체
  'zh-TW': {
    primary: 'Noto Sans TC',
    fallback: ['PingFang TC', 'Microsoft JhengHei', '微軟正黑體', 'sans-serif'],
    weights: [400, 500, 700],
    loading: 'swap',
  },

  // 키릴 문자 (러시아어 등)
  cyrillic: {
    primary: 'Inter',
    fallback: ['system-ui', 'Arial', 'sans-serif'],
    weights: [400, 500, 600, 700],
    loading: 'swap',
  },
}

// CSS 생성
const generateFontCSS = locale => {
  const stack = FONT_STACKS[locale] || FONT_STACKS.latin
  return `
    font-family: "${stack.primary}", ${stack.fallback.join(', ')};
    font-display: ${stack.loading};
  `
}
```

### 11.8.2. 폰트 로딩 전략

```javascript
// 폰트 로딩 최적화
const FONT_LOADING_STRATEGY = {
  // 필수 폰트 (즉시 로드)
  critical: {
    latin: ['Inter-400.woff2', 'Inter-600.woff2'],
    ko: ['Pretendard-Regular.woff2', 'Pretendard-SemiBold.woff2'],
    ja: ['NotoSansJP-Regular.woff2', 'NotoSansJP-Bold.woff2'],
    'zh-CN': ['NotoSansSC-Regular.woff2', 'NotoSansSC-Bold.woff2'],
  },

  // 추가 굵기 (지연 로드)
  deferred: {
    latin: ['Inter-500.woff2', 'Inter-700.woff2'],
    ko: ['Pretendard-Medium.woff2', 'Pretendard-Bold.woff2'],
  },

  // 프리로드 태그 생성
  generatePreload: locale => {
    const fonts = FONT_LOADING_STRATEGY.critical[locale] || []
    return fonts
      .map(
        font => `<link rel="preload" href="/fonts/${font}" as="font" type="font/woff2" crossorigin>`
      )
      .join('\n')
  },

  // 서브셋 설정 (용량 최적화)
  subsetting: {
    latin: 'latin,latin-ext',
    ko: 'korean',
    ja: 'japanese',
    'zh-CN': 'chinese-simplified',
    'zh-TW': 'chinese-traditional',
    cyrillic: 'cyrillic,cyrillic-ext',
  },
}
```

### 11.8.3. CJK 특수 처리

```css
/* CJK (중국어, 일본어, 한국어) 특수 처리 */

/* 줄바꿈 규칙 */
[lang='ko'],
[lang='ja'],
[lang='zh-CN'],
[lang='zh-TW'] {
  word-break: keep-all; /* 단어 중간 줄바꿈 금지 */
  overflow-wrap: break-word;
}

/* 세로 텍스트 지원 (일본어 특수 UI용) */
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
}

/* CJK 마침표/괄호 위치 조정 */
[lang='ja'] .punctuation-adjust {
  text-spacing-trim: space-all;
}

/* 루비 텍스트 (후리가나) */
[lang='ja'] ruby {
  ruby-position: over;
  ruby-align: center;
}

[lang='ja'] rt {
  font-size: 0.5em;
  font-weight: normal;
}

/* 중국어/일본어 기울임체 대체 (이탤릭 없음) */
[lang='zh-CN'] em,
[lang='zh-TW'] em,
[lang='ja'] em {
  font-style: normal;
  text-decoration: underline;
  text-decoration-style: dotted;
}
```

---

[← 이전: Glossary & Culture](./11-c-glossary-culture.md) | [다음: QA & Community →](./11-e-qa-community.md)
