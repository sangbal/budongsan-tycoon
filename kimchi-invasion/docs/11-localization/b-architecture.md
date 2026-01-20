# 11-B. i18n 아키텍처 & 번역 가이드라인

> **Last Updated:** 2026-01-19
>
> 원본: `11-localization.md` 섹션 11.3~11.4

[← 이전: Philosophy](./11-a-philosophy.md) | [다음: Glossary & Culture →](./11-c-glossary-culture.md)

---

## 11.3. i18n 아키텍처

### 11.3.1. 파일 구조

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    📁 로컬라이제이션 파일 구조                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  src/                                                                       │
│  └── i18n/                                                                  │
│      ├── index.ts              # i18n 초기화, t() 함수 export              │
│      ├── types.ts              # TypeScript 타입 정의                      │
│      ├── config.ts             # 언어 설정, 폴백 체인                       │
│      ├── utils/                                                             │
│      │   ├── pluralization.ts  # 복수형 처리                               │
│      │   ├── formatting.ts     # 날짜/숫자/통화 포맷                       │
│      │   └── interpolation.ts  # 변수 삽입 처리                            │
│      │                                                                      │
│      └── locales/                                                           │
│          ├── ko/               # 한국어 (기본/원본)                         │
│          │   ├── common.json   # 공통 UI, 버튼, 라벨                       │
│          │   ├── game.json     # 게임 콘텐츠 (자원, 건물, 연구)             │
│          │   ├── story.json    # 스토리, 대사, 이벤트                       │
│          │   ├── tutorial.json # 튜토리얼 텍스트                            │
│          │   ├── achievements.json # 업적 이름/설명                         │
│          │   ├── errors.json   # 오류 메시지                                │
│          │   └── meta.json     # 언어 메타데이터                            │
│          │                                                                  │
│          ├── en/               # 영어                                       │
│          │   └── (동일 구조)                                                │
│          │                                                                  │
│          ├── ja/               # 일본어                                     │
│          │   └── (동일 구조)                                                │
│          │                                                                  │
│          └── ...               # 기타 언어                                  │
│                                                                             │
│  public/                                                                    │
│  └── locales/                  # 빌드 후 분리 (지연 로딩용)                 │
│      ├── ko.json               # 통합 번들                                  │
│      ├── en.json                                                            │
│      └── ...                                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.3.2. 네임스페이스 구조

```javascript
// 네임스페이스 정의
const NAMESPACES = {
  // 즉시 로드 (필수)
  common: {
    description: '공통 UI 요소',
    load: 'eager',
    keys: ['ui.button.*', 'ui.label.*', 'ui.menu.*'],
  },

  // 지연 로드 (게임 시작 후)
  game: {
    description: '게임 콘텐츠',
    load: 'lazy',
    trigger: 'game_start',
    keys: ['game.resource.*', 'game.building.*', 'game.research.*'],
  },

  // 지연 로드 (튜토리얼 시작 시)
  tutorial: {
    description: '튜토리얼',
    load: 'lazy',
    trigger: 'tutorial_start',
    keys: ['tutorial.*'],
  },

  // 지연 로드 (스토리 이벤트 시)
  story: {
    description: '스토리 대사',
    load: 'lazy',
    trigger: 'story_event',
    keys: ['story.*'],
  },

  // 지연 로드 (업적 달성 시)
  achievements: {
    description: '업적',
    load: 'lazy',
    trigger: 'achievement_ui_open',
    keys: ['achievement.*'],
  },
}
```

### 11.3.3. 키 네이밍 규칙

```javascript
// 키 구조: {카테고리}.{하위카테고리}.{구체적_이름}

const KEY_NAMING_CONVENTION = {
  // UI 요소
  'ui.button.confirm': '확인',
  'ui.button.cancel': '취소',
  'ui.tab.production': '생산',
  'ui.label.level': '레벨',
  'ui.tooltip.power_usage': '전력 사용량: {current}/{max}',

  // 게임 콘텐츠
  'game.resource.cabbage': '배추',
  'game.resource.kimchi': '김치',
  'game.building.greenhouse.name': '온실',
  'game.building.greenhouse.desc': '배추를 재배하는 시설',
  'game.research.fermentation_1.name': '기초 발효학',

  // 스토리
  'story.hayul.intro': '드디어... 화성에서 첫 김치가 탄생했어.',
  'story.hayul.bottleneck': '흠, 배추가 쌓이고 있네.',
  'story.event.first_kimchi.title': '첫 번째 김치',
  'story.event.first_kimchi.desc': '화성에서 최초의 김치가 완성되었습니다.',

  // 튜토리얼
  'tutorial.step_1.title': '환영합니다!',
  'tutorial.step_1.content': '화성에 오신 것을 환영합니다.',
  'tutorial.tip.belt': '벨트를 연결하여 자원을 이동시키세요.',

  // 업적
  'achievement.first_kimchi.name': '첫 발효',
  'achievement.first_kimchi.desc': '첫 번째 김치를 생산하세요',

  // 오류
  'error.save.failed': '저장에 실패했습니다',
  'error.network.timeout': '네트워크 연결 시간 초과',

  // 알림
  'notification.level_up': '레벨 {level} 달성!',
  'notification.milestone': '마일스톤 {name} 완료!',
}
```

---

## 11.4. 번역 가이드라인

### 11.4.1. 번역 원칙 상세

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    📝 번역 5대 원칙 (상세)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1️⃣  의미 우선 (Meaning First)                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 직역 vs 의역: 자연스러움이 우선                                          │
│  • 문화적 맥락 고려                                                         │
│                                                                             │
│    ❌ "대박!" → "Big hit!" (직역, 어색함)                                   │
│    ✅ "대박!" → "Awesome!" (의역, 자연스러움)                               │
│                                                                             │
│    ❌ "할머니의 손맛" → "Grandmother's hand taste"                          │
│    ✅ "할머니의 손맛" → "Grandmother's secret touch"                        │
│                                                                             │
│  2️⃣  일관성 유지 (Consistency)                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 동일 용어 = 동일 번역 (용어집 필수)                                      │
│  • 캐릭터별 어투 일관성                                                     │
│  • UI 용어 통일                                                             │
│                                                                             │
│    용어집 예시:                                                              │
│    ┌────────────┬─────────────────────┬──────────────────────┐              │
│    │ 한국어      │ 영어                 │ 비고                 │              │
│    ├────────────┼─────────────────────┼──────────────────────┤              │
│    │ 발효실      │ Fermentation Chamber│ 고정 (변경 금지)     │              │
│    │ 투입기      │ Inserter            │ Factorio 용어 차용   │              │
│    │ 분배기      │ Splitter            │                      │              │
│    └────────────┴─────────────────────┴──────────────────────┘              │
│                                                                             │
│  3️⃣  간결함 (Brevity)                                                       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • UI 공간 제약 고려                                                        │
│  • 버튼: 1-3 단어                                                           │
│  • 툴팁 제목: 1줄                                                           │
│  • 툴팁 설명: 2-3줄                                                         │
│                                                                             │
│    ❌ "Click here to confirm your selection" (7 단어)                       │
│    ✅ "Confirm" (1 단어)                                                    │
│                                                                             │
│  4️⃣  문화 존중 (Cultural Respect)                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 한국 문화 요소 유지 (가능한 한)                                          │
│  • 번역하지 않는 용어: Kimchi, Kimjang, Sol                                 │
│  • 필요시 툴팁이나 괄호로 설명 추가                                         │
│                                                                             │
│    예: "Kimjang (김장)" → 첫 언급 시 설명, 이후 "Kimjang"만                 │
│                                                                             │
│  5️⃣  톤 유지 (Tone Preservation)                                            │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 주인공 캐릭터: 낙천적, 친근, 가끔 유머                                   │
│  • 게임 전체: 희망적, 도전적, 따뜻함                                        │
│  • 격식체 피하기 (너무 딱딱하면 안 됨)                                      │
│                                                                             │
│    ❌ "Production has been completed." (격식체)                             │
│    ✅ "Done! Your kimchi is ready." (친근)                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.4.2. 캐릭터별 어투 가이드

```javascript
// 캐릭터별 번역 톤 가이드
const CHARACTER_TONE_GUIDE = {
  protagonist: {
    name_ko: '{플레이어 이름}',
    name_en: '{Player Name}',
    traits: ['낙천적', '친근', '유머러스', '열정적'],
    tone: {
      ko: '반말, ~해요/~네요 체, 이모티콘 가끔',
      en: 'Casual, contractions okay, occasional exclamations',
      ja: '~だね/~よ, カジュアル敬語',
    },
    examples: {
      excited: {
        ko: '우와, 드디어 첫 김치다! 🎉',
        en: 'Wow, our first kimchi! 🎉',
        ja: 'わぁ、初めてのキムチだ！🎉',
      },
      thinking: {
        ko: '흠... 벨트가 막혔네. 분배기가 필요할 것 같아.',
        en: 'Hmm... the belt is jammed. Might need a splitter.',
        ja: 'うーん...ベルトが詰まってる。スプリッターが必要かも。',
      },
      frustrated: {
        ko: '아, 또 전력 부족이야... 태양광 더 깔아야겠다.',
        en: 'Ugh, low power again... Need more solar panels.',
        ja: 'あぁ、また電力不足...ソーラーパネルを増やさなきゃ。',
      },
    },
  },

  system: {
    description: '시스템 메시지 (UI, 알림, 오류)',
    tone: {
      ko: '간결, 명확, 존댓말',
      en: 'Concise, clear, neutral',
      ja: '簡潔、明確、丁寧語',
    },
    examples: {
      notification: {
        ko: '연구 완료: 고급 발효학',
        en: 'Research Complete: Advanced Fermentation',
        ja: '研究完了：上級発酵学',
      },
      error: {
        ko: '저장에 실패했습니다. 다시 시도해 주세요.',
        en: 'Save failed. Please try again.',
        ja: '保存に失敗しました。もう一度お試しください。',
      },
    },
  },

  narrator: {
    description: '내레이션, 스토리 텍스트',
    tone: {
      ko: '서술체, 객관적, 약간의 서정성',
      en: 'Descriptive, objective, slightly poetic',
      ja: '叙述体、客観的、少し詩的',
    },
    examples: {
      milestone: {
        ko: '화성의 붉은 땅 위에 녹색 이파리가 자라기 시작했다.',
        en: 'Green leaves began to grow on the red Martian soil.',
        ja: '火星の赤い大地に、緑の葉が育ち始めた。',
      },
    },
  },
}
```

### 11.4.3. UI 텍스트 길이 제한

```javascript
// UI 요소별 텍스트 길이 제한
const UI_TEXT_LIMITS = {
  button: {
    max_chars: { ko: 6, en: 15, ja: 6, zh: 4 },
    guidelines: '1-3 단어, 동사 우선',
  },

  tab_label: {
    max_chars: { ko: 4, en: 12, ja: 4, zh: 3 },
    guidelines: '아이콘과 함께 사용',
  },

  tooltip_title: {
    max_chars: { ko: 15, en: 30, ja: 15, zh: 10 },
    guidelines: '1줄, 명사구',
  },

  tooltip_desc: {
    max_chars: { ko: 80, en: 150, ja: 80, zh: 60 },
    guidelines: '2-3줄, 간단한 설명',
  },

  notification: {
    max_chars: { ko: 40, en: 80, ja: 40, zh: 30 },
    guidelines: '1줄, 핵심 정보만',
  },

  dialogue: {
    max_chars: { ko: 120, en: 200, ja: 120, zh: 80 },
    guidelines: '3-4줄, 스크롤 없이',
  },

  menu_item: {
    max_chars: { ko: 10, en: 20, ja: 10, zh: 8 },
    guidelines: '1줄, 명사 또는 동사',
  },

  building_name: {
    max_chars: { ko: 8, en: 20, ja: 8, zh: 6 },
    guidelines: '1줄, 명사',
  },

  resource_name: {
    max_chars: { ko: 6, en: 15, ja: 6, zh: 4 },
    guidelines: '1단어, 명사',
  },
}

// 텍스트 확장 비율 (영어 기준)
const TEXT_EXPANSION_RATIOS = {
  en: 1.0, // 기준
  ko: 0.8, // 영어보다 20% 짧음
  ja: 0.9, // 영어보다 10% 짧음
  zh: 0.7, // 영어보다 30% 짧음
  de: 1.3, // 영어보다 30% 김
  fr: 1.2, // 영어보다 20% 김
  es: 1.2, // 영어보다 20% 김
  ru: 1.3, // 영어보다 30% 김
  pt: 1.2, // 영어보다 20% 김
}
```

---

[← 이전: Philosophy](./11-a-philosophy.md) | [다음: Glossary & Culture →](./11-c-glossary-culture.md)
