# 11-C. 용어 사전 & 문화적 적응 (Glossary & Cultural Adaptation)

> **Last Updated:** 2026-01-19
>
> 원본: `11-localization.md` 섹션 11.5~11.6

[← 이전: Architecture](./11-b-architecture.md) | [다음: Grammar & Fonts →](./11-d-grammar-fonts.md)

---

## 11.5. 핵심 용어 사전 (Glossary)

### 11.5.1. 번역하지 않는 용어

| 원본         | 이유                       | 처리 방식            |
| :----------- | :------------------------- | :------------------- |
| **Kimchi**   | 글로벌 인지도, UNESCO 등재 | 모든 언어에서 유지   |
| **Kimjang**  | 한국 고유 문화             | 첫 언급 시 괄호 설명 |
| **Sol**      | 화성 하루 (SF 표준)        | 모든 언어에서 유지   |
| **Ares One** | 기지 고유명사              | 모든 언어에서 유지   |
| **SpaceX**   | 회사 고유명사              | 모든 언어에서 유지   |

### 11.5.2. 자원 용어

| 한국어   | 영어           | 일본어                 | 중국어(간) | 비고 |
| :------- | :------------- | :--------------------- | :--------- | :--- |
| 배추     | Napa Cabbage   | 白菜(はくさい)         | 大白菜     |      |
| 소금     | Salt           | 塩(しお)               | 盐         |      |
| 고춧가루 | Chili Powder   | 唐辛子粉(とうがらしこ) | 辣椒粉     |      |
| 마늘     | Garlic         | ニンニク               | 大蒜       |      |
| 파       | Green Onion    | ネギ                   | 大葱       |      |
| 생강     | Ginger         | 生姜(しょうが)         | 生姜       |      |
| 젓갈     | Salted Seafood | 塩辛(しおから)         | 虾酱       |      |
| 철광석   | Iron Ore       | 鉄鉱石                 | 铁矿石     |      |
| 얼음     | Ice            | 氷(こおり)             | 冰         |      |

### 11.5.3. 김치 종류

| 한국어     | 영어          | 일본어         | 중국어(간) | 설명      |
| :--------- | :------------ | :------------- | :--------- | :-------- |
| 배추김치   | Baechu Kimchi | 白菜キムチ     | 白菜泡菜   | 표준 김치 |
| 깍두기     | Kkakdugi      | カクテキ       | 萝卜块泡菜 | 음역 유지 |
| 파김치     | Pa Kimchi     | ネギキムチ     | 葱泡菜     |           |
| 오이소박이 | Oi Sobagi     | きゅうりキムチ | 黄瓜泡菜   |           |
| 갓김치     | Gat Kimchi    | からし菜キムチ | 芥菜泡菜   |           |
| 묵은지     | Mukeunji      | 熟成キムチ     | 陈年泡菜   | 음역 유지 |

### 11.5.4. 건물 용어

| 한국어        | 영어                 | 일본어         | 비고          |
| :------------ | :------------------- | :------------- | :------------ |
| 채굴기        | Miner                | 採掘機         |               |
| 온실          | Greenhouse           | 温室           |               |
| 발효실        | Fermentation Chamber | 発酵室         |               |
| 포장 시설     | Packaging Facility   | 包装施設       |               |
| 발사대        | Launch Pad           | 発射台         |               |
| 연구소        | Research Lab         | 研究所         |               |
| 태양광 패널   | Solar Panel          | ソーラーパネル |               |
| 화력 발전소   | Thermal Power Plant  | 火力発電所     |               |
| 핵융합 발전소 | Fusion Reactor       | 核融合炉       |               |
| 컨베이어 벨트 | Conveyor Belt        | コンベアベルト |               |
| 투입기        | Inserter             | インサーター   | Factorio 용어 |
| 분배기        | Splitter             | スプリッター   |               |
| 지하 벨트     | Underground Belt     | 地下ベルト     |               |

### 11.5.5. 게임 시스템 용어

| 한국어          | 영어             | 일본어             | 비고 |
| :-------------- | :--------------- | :----------------- | :--- |
| 마일스톤        | Milestone        | マイルストーン     |      |
| 프레스티지      | Prestige         | プレステージ       |      |
| 로드아웃        | Loadout          | ロードアウト       |      |
| 블루프린트      | Blueprint        | 設計図(せっけいず) |      |
| 오프라인 진행   | Offline Progress | オフライン進行     |      |
| 자동 저장       | Auto Save        | 自動セーブ         |      |
| 클라우드 동기화 | Cloud Sync       | クラウド同期       |      |

---

## 11.6. 문화적 적응 (Cultural Adaptation)

### 11.6.1. 지역별 마케팅 메시지

```javascript
// 지역별 문화 적응 전략
const CULTURAL_ADAPTATION = {
  ko: {
    marketing_angle: '우리 김치로 화성을 정복하자',
    emphasis: ['문화적 자긍심', '할머니의 유산', '글로벌 진출'],
    tone: '자랑스러움, 정겨움',
    avoid: ['과도한 애국심 표현'],
  },

  en: {
    marketing_angle: 'Build Your Kimchi Empire on Mars',
    emphasis: ['Factory automation', 'Space exploration', 'Unique theme'],
    tone: 'Exciting, innovative',
    avoid: ['Exoticizing Korean culture', 'Stereotypes'],
  },

  ja: {
    marketing_angle: '発酵の科学 × 宇宙開拓',
    emphasis: ['발효 과학', '장인 정신', '최적화 시스템'],
    tone: '기술적, 정교함',
    cultural_notes: '일본의 발효 문화(된장, 낫토)와 연결점 강조',
    avoid: ['역사적 민감사항'],
  },

  'zh-CN': {
    marketing_angle: '火星泡菜工厂',
    emphasis: ['경영 시뮬레이션', '자동화', '대규모 생산'],
    tone: '야심찬, 전략적',
    avoid: ['정치적 민감사항'],
  },

  de: {
    marketing_angle: 'Fermentation trifft Raumfahrt',
    emphasis: ['효율성', '시스템 최적화', '과학적 정확성'],
    tone: '진지한, 기술적',
    cultural_notes: '독일의 발효 문화(사워크라우트)와 연결점',
  },

  'pt-BR': {
    marketing_angle: 'Construa seu Império de Kimchi em Marte',
    emphasis: ['재미', '접근성', '경영 게임'],
    tone: '활기찬, 친근한',
    cultural_notes: '브라질의 발효 음식 문화(카샤사 등) 참조 가능',
  },
}
```

### 11.6.2. 김치 101 - 비한국인용 온보딩

```json
// en.json - 김치 소개 텍스트
{
  "tutorial": {
    "kimchi_101": {
      "prompt": "New to Kimchi?",
      "option_yes": "Yes, tell me more!",
      "option_no": "I know kimchi, let's start!",

      "intro_title": "What is Kimchi?",
      "intro_p1": "Kimchi is Korea's iconic fermented vegetable dish, loved worldwide for its unique flavor and health benefits.",
      "intro_p2": "Made by salting napa cabbage and fermenting it with chili, garlic, ginger, and other seasonings, kimchi develops complex tangy, spicy flavors.",
      "intro_p3": "Rich in probiotics and vitamins, kimchi is more than food—it's a living culture, passed down through generations.",

      "mars_title": "Why Kimchi on Mars?",
      "mars_p1": "In the isolation of Mars, maintaining gut health is crucial. Kimchi's probiotics strengthen the immune system naturally.",
      "mars_p2": "Our protagonist carries their grandmother's heirloom starter culture—a living connection to Earth and family.",
      "mars_p3": "Your mission: Build an automated kimchi factory and export it back to Earth. Show them that Korean food conquers space!",

      "fermentation_title": "The Science of Fermentation",
      "fermentation_p1": "Fermentation is a natural preservation process where beneficial bacteria convert sugars into lactic acid.",
      "fermentation_p2": "In this game, you'll manage fermentation conditions—temperature, time, and ingredients—to create different kimchi varieties.",
      "fermentation_p3": "Master the fermentation process and unlock premium aged kimchi (Mukeunji) for maximum profit!",

      "continue_button": "Got it, let's start!",
      "skip_button": "Skip"
    },

    "cultural_notes": {
      "kimjang": {
        "title": "What is Kimjang?",
        "desc": "Kimjang (김장) is the traditional Korean practice of making and sharing large quantities of kimchi before winter. Families and communities come together for this annual event. UNESCO recognized Kimjang as an Intangible Cultural Heritage of Humanity in 2013.",
        "in_game": "In KIMCHI INVASION, Kimjang events boost production and unlock special rewards!"
      },

      "grandma_culture": {
        "title": "The Heirloom Starter",
        "desc": "In Korean households, a starter culture (종균) is often passed down through generations. Each family's kimchi has its unique flavor profile shaped by this heirloom culture. The protagonist's grandmother's starter is their most precious possession—a living legacy.",
        "in_game": "Protect and nurture your starter culture. Losing it means starting over without bonuses!"
      }
    }
  }
}
```

### 11.6.3. 날짜/숫자/통화 형식

```javascript
// 지역별 포맷 설정
const LOCALE_FORMATS = {
  ko: {
    date: {
      short: 'YYYY.MM.DD', // 2042.03.15
      long: 'YYYY년 M월 D일', // 2042년 3월 15일
      relative: '{n}일 전', // 3일 전
    },
    time: {
      format: 'A h:mm', // 오후 3:30
      am: '오전',
      pm: '오후',
    },
    number: {
      decimal: '.',
      thousands: ',',
      units: ['', '만', '억', '조'], // 1조 = 1,000,000,000,000
    },
    currency: {
      symbol: '$',
      position: 'prefix',
      format: '$#,###', // $1,234,567
    },
  },

  en: {
    date: {
      short: 'MM/DD/YYYY', // 03/15/2042
      long: 'MMMM D, YYYY', // March 15, 2042
      relative: '{n} days ago',
    },
    time: {
      format: 'h:mm A', // 3:30 PM
      am: 'AM',
      pm: 'PM',
    },
    number: {
      decimal: '.',
      thousands: ',',
      units: ['', 'K', 'M', 'B', 'T'], // 1T = 1,000,000,000,000
    },
    currency: {
      symbol: '$',
      position: 'prefix',
      format: '$#,###',
    },
  },

  ja: {
    date: {
      short: 'YYYY/MM/DD', // 2042/03/15
      long: 'YYYY年M月D日', // 2042年3月15日
      relative: '{n}日前',
    },
    time: {
      format: 'H:mm', // 15:30 (24시간)
      am: '午前',
      pm: '午後',
    },
    number: {
      decimal: '.',
      thousands: ',',
      units: ['', '万', '億', '兆'],
    },
    currency: {
      symbol: '$',
      position: 'prefix',
      format: '$#,###',
    },
  },

  'zh-CN': {
    date: {
      short: 'YYYY/MM/DD',
      long: 'YYYY年M月D日',
      relative: '{n}天前',
    },
    time: {
      format: 'HH:mm',
      am: '上午',
      pm: '下午',
    },
    number: {
      decimal: '.',
      thousands: ',',
      units: ['', '万', '亿', '万亿'],
    },
    currency: {
      symbol: '$',
      position: 'prefix',
      format: '$#,###',
    },
  },

  de: {
    date: {
      short: 'DD.MM.YYYY', // 15.03.2042
      long: 'D. MMMM YYYY', // 15. März 2042
      relative: 'vor {n} Tagen',
    },
    time: {
      format: 'HH:mm', // 15:30
      am: '',
      pm: '',
    },
    number: {
      decimal: ',', // 주의: 독일은 . 과 , 반대
      thousands: '.',
      units: ['', 'Tsd.', 'Mio.', 'Mrd.', 'Bio.'],
    },
    currency: {
      symbol: '$',
      position: 'prefix',
      format: '$ #.###', // $ 1.234.567
    },
  },
}
```

---

[← 이전: Architecture](./11-b-architecture.md) | [다음: Grammar & Fonts →](./11-d-grammar-fonts.md)
