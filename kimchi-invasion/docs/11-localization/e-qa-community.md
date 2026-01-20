# 11-E. 번역 QA & 커뮤니티 번역 (QA & Community Translation)

> **Last Updated:** 2026-01-19
>
> 원본: `11-localization.md` 섹션 11.9~11.10

[← 이전: Grammar & Fonts](./11-d-grammar-fonts.md) | [다음: Implementation →](./11-f-implementation.md)

---

## 11.9. 번역 QA 프로세스

### 11.9.1. QA 워크플로우

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🔍 번역 QA 워크플로우                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1단계: 자동 검증 (Automated Validation)                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 키 누락 검사 (missing keys)                                              │
│  • 변수 플레이스홀더 검증 ({count}, {name} 등)                              │
│  • 길이 제한 검사 (UI 오버플로우 방지)                                      │
│  • 금지 문자 검사 (특수문자, 제어문자)                                      │
│  • JSON 문법 검증                                                           │
│  • ICU 메시지 포맷 검증                                                     │
│                                                                             │
│  2단계: 의사 현지화 테스트 (Pseudo-localization)                            │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 텍스트 확장 시뮬레이션 (+30%)                                            │
│  • 특수문자 렌더링 테스트 (악센트, 움라우트)                                │
│  • 긴 문자열 UI 깨짐 확인                                                   │
│  • 하드코딩된 문자열 탐지                                                   │
│                                                                             │
│  3단계: 언어 전문가 리뷰 (Expert Review)                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 용어 일관성 검토                                                         │
│  • 문화적 적절성 검토                                                       │
│  • 캐릭터 어투 검토                                                         │
│  • 문법/맞춤법 검사                                                         │
│                                                                             │
│  4단계: 인게임 테스트 (In-context Testing)                                  │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 실제 UI에서 텍스트 확인                                                  │
│  • 컨텍스트에 맞는 번역인지 확인                                            │
│  • 스크린샷 기반 리뷰                                                       │
│  • 현지 테스터 플레이테스트                                                 │
│                                                                             │
│  5단계: 릴리스 검증 (Release Validation)                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 모든 체크리스트 완료 확인                                                │
│  • 크리티컬 이슈 없음 확인                                                  │
│  • 버전 태그 및 릴리스 노트                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.9.2. 자동화 검증 스크립트

```javascript
// i18n 검증 스크립트
const I18N_VALIDATION_RULES = {
  // 1. 키 누락 검사
  checkMissingKeys: {
    enabled: true,
    severity: 'error',
    check: (baseLocale, targetLocale) => {
      const baseKeys = getAllKeys(baseLocale);
      const targetKeys = getAllKeys(targetLocale);
      return baseKeys.filter(key => !targetKeys.includes(key));
    }
  },

  // 2. 변수 플레이스홀더 검증
  checkPlaceholders: {
    enabled: true,
    severity: 'error',
    check: (baseValue, targetValue) => {
      const basePlaceholders = baseValue.match(/\{[^}]+\}/g) || [];
      const targetPlaceholders = targetValue.match(/\{[^}]+\}/g) || [];
      return basePlaceholders.every(p => targetPlaceholders.includes(p));
    }
  },

  // 3. 길이 제한 검사
  checkLength: {
    enabled: true,
    severity: 'warning',
    maxExpansion: 1.5, // 원본 대비 150%까지 허용
    check: (baseValue, targetValue, key) => {
      const limit = UI_TEXT_LIMITS[key.split('.')[0]]?.max_chars;
      if (!limit) return true;
      return targetValue.length <= baseValue.length * 1.5;
    }
  },

  // 4. 금지 문자 검사
  checkForbiddenChars: {
    enabled: true,
    severity: 'error',
    forbidden: ['\t', '\r', '\u0000', '\u200B'],  // 탭, CR, NULL, 제로폭 공백
    check: (value) => {
      return !this.forbidden.some(char => value.includes(char));
    }
  },

  // 5. HTML 태그 보존 검사
  checkHtmlTags: {
    enabled: true,
    severity: 'error',
    check: (baseValue, targetValue) => {
      const baseTags = baseValue.match(/<[^>]+>/g) || [];
      const targetTags = targetValue.match(/<[^>]+>/g) || [];
      return baseTags.length === targetTags.length;
    }
  },

  // 6. 이스케이프 시퀀스 검사
  checkEscapeSequences: {
    enabled: true,
    severity: 'error',
    check: (baseValue, targetValue) => {
      const baseNewlines = (baseValue.match(/\\n/g) || []).length;
      const targetNewlines = (targetValue.match(/\\n/g) || []).length;
      return baseNewlines === targetNewlines;
    }
  }
};

// npm 스크립트
// package.json
{
  "scripts": {
    "i18n:validate": "node scripts/validate-i18n.js",
    "i18n:missing": "node scripts/find-missing-keys.js --locale",
    "i18n:check": "npm run i18n:validate && npm run i18n:missing"
  }
}
```

### 11.9.3. 의사 현지화 (Pseudo-localization)

```javascript
// 의사 현지화 - 번역 품질 테스트용
const PSEUDO_LOCALIZATION = {
  // 문자 치환 맵 (라틴 → 악센트 문자)
  charMap: {
    a: 'àáâãäå',
    e: 'èéêë',
    i: 'ìíîï',
    o: 'òóôõö',
    u: 'ùúûü',
    c: 'ç',
    n: 'ñ',
    // ... 더 많은 매핑
  },

  // 텍스트 변환
  pseudoLocalize: (text, options = {}) => {
    const { expand = 1.3, bracket = true, charReplace = true } = options

    let result = text

    // 1. 문자 치환 (특수문자 렌더링 테스트)
    if (charReplace) {
      result = result.replace(/[a-z]/gi, char => {
        const replacements = PSEUDO_LOCALIZATION.charMap[char.toLowerCase()]
        if (replacements) {
          const replacement = replacements[Math.floor(Math.random() * replacements.length)]
          return char === char.toUpperCase() ? replacement.toUpperCase() : replacement
        }
        return char
      })
    }

    // 2. 텍스트 확장 (UI 오버플로우 테스트)
    if (expand > 1) {
      const extraLength = Math.floor(result.length * (expand - 1))
      result = result + '_'.repeat(extraLength)
    }

    // 3. 브래킷 추가 (하드코딩 문자열 감지)
    if (bracket) {
      result = `[[ ${result} ]]`
    }

    return result
  },

  // 전체 로케일 파일 변환
  generatePseudoLocale: baseLocale => {
    const pseudo = {}
    for (const [key, value] of Object.entries(baseLocale)) {
      if (typeof value === 'string') {
        pseudo[key] = PSEUDO_LOCALIZATION.pseudoLocalize(value)
      } else if (typeof value === 'object') {
        pseudo[key] = PSEUDO_LOCALIZATION.generatePseudoLocale(value)
      }
    }
    return pseudo
  },
}

// 사용 예:
// "Hello, World!" → "[[ Hëllö, Wörld!____________ ]]"
```

### 11.9.4. QA 체크리스트

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ✅ 번역 QA 체크리스트                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📝 텍스트 품질                                                              │
│  [ ] 맞춤법/문법 오류 없음                                                  │
│  [ ] 용어집에 맞는 용어 사용                                                │
│  [ ] 캐릭터 어투 일관성 유지                                                │
│  [ ] 문화적으로 적절한 표현                                                 │
│  [ ] 성별/복수형 올바른 처리                                                │
│                                                                             │
│  🖥️ UI/UX 품질                                                              │
│  [ ] 텍스트 잘림 없음 (모든 UI 요소)                                        │
│  [ ] 줄바꿈 올바름 (버튼, 메뉴, 툴팁)                                       │
│  [ ] 폰트 렌더링 정상 (특수문자, 악센트)                                    │
│  [ ] 정렬 문제 없음 (LTR/RTL)                                               │
│  [ ] 아이콘과 텍스트 간격 적절                                              │
│                                                                             │
│  🔧 기술적 품질                                                              │
│  [ ] 모든 키 번역됨 (누락 없음)                                             │
│  [ ] 변수 플레이스홀더 정확                                                 │
│  [ ] 이스케이프 시퀀스 보존                                                 │
│  [ ] HTML 태그 올바름                                                       │
│  [ ] JSON 문법 유효                                                         │
│                                                                             │
│  🎮 게임 컨텍스트                                                            │
│  [ ] 인게임에서 의미 명확                                                   │
│  [ ] 튜토리얼 단계별 흐름 자연스러움                                        │
│  [ ] 스토리 대사 감정 전달                                                  │
│  [ ] 업적 설명 명확                                                         │
│  [ ] 오류 메시지 도움이 됨                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11.10. 커뮤니티 번역 시스템

### 11.10.1. 커뮤니티 번역 플랫폼

```javascript
// 커뮤니티 번역 시스템 설계
const COMMUNITY_TRANSLATION_SYSTEM = {
  // 플랫폼 선택
  platform: {
    primary: 'Crowdin', // 또는 Lokalise, Transifex
    features: [
      '웹 기반 번역 에디터',
      '컨텍스트 스크린샷',
      '용어집 통합',
      '기계 번역 제안',
      '리뷰 워크플로우',
      '버전 관리',
    ],
  },

  // 역할 및 권한
  roles: {
    translator: {
      permissions: ['submit_translation', 'vote_translation'],
      requirements: '없음 (누구나 참여 가능)',
    },
    proofreader: {
      permissions: ['approve_translation', 'edit_translation'],
      requirements: '번역 100개 이상 승인됨',
    },
    language_coordinator: {
      permissions: ['manage_translators', 'finalize_version'],
      requirements: '해당 언어 네이티브, 프루프리더 경험',
    },
  },

  // 품질 관리
  quality_control: {
    voting: {
      enabled: true,
      threshold: 3, // 3표 이상 받은 번역 채택
    },
    review: {
      required: true,
      reviewers_needed: 1,
    },
    guidelines: {
      linked: true,
      mandatory_read: true,
    },
  },

  // 인센티브
  incentives: {
    credits: '게임 내 크레딧에 번역자 이름 표시',
    badges: 'Steam 배지 / 인게임 타이틀',
    rewards: '무료 DLC, 특별 아이템',
  },

  // 동기화 주기
  sync: {
    import: 'daily', // 원본 → 플랫폼
    export: 'on_approval', // 플랫폼 → 게임
    branch: 'localization/*', // Git 브랜치
  },
}
```

### 11.10.2. 번역 가이드 문서

```javascript
// 커뮤니티 번역자를 위한 가이드
const TRANSLATOR_GUIDE = {
  // 시작하기
  getting_started: {
    title: 'KIMCHI INVASION 번역에 참여해 주셔서 감사합니다!',
    steps: [
      '1. Crowdin 계정 생성 및 프로젝트 참여',
      '2. 번역 가이드라인 숙지 (이 문서)',
      '3. 용어집 확인',
      '4. 번역 시작!',
    ],
  },

  // 번역 우선순위
  priority: {
    critical: ['ui.button.*', 'ui.menu.*', 'error.*'],
    high: ['tutorial.*', 'game.resource.*', 'game.building.*'],
    medium: ['achievement.*', 'notification.*'],
    low: ['story.*'], // 영어 폴백 가능
  },

  // 번역하지 않는 것
  do_not_translate: [
    'Kimchi (김치)',
    'Kimjang (김장)',
    'Sol (화성 하루)',
    'Ares One',
    'SpaceX',
    '플레이스홀더 ({count}, {name} 등)',
    'HTML 태그 (<b>, <color> 등)',
  ],

  // 자주 묻는 질문
  faq: [
    {
      q: '번역 길이가 너무 길어지면 어떻게 하나요?',
      a: '의미를 유지하면서 축약하세요. 버튼은 2-3단어가 적당합니다.',
    },
    {
      q: '문화적으로 어색한 표현은 어떻게 하나요?',
      a: '직역보다 현지 문화에 맞는 자연스러운 표현을 사용하세요.',
    },
    {
      q: '확실하지 않은 번역은?',
      a: '코멘트에 질문을 남기거나 프루프리더에게 문의하세요.',
    },
  ],
}
```

---

[← 이전: Grammar & Fonts](./11-d-grammar-fonts.md) | [다음: Implementation →](./11-f-implementation.md)
