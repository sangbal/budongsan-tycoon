# Kimchi Invasion 크로스플랫폼 기술 스택 리서치 보고서

> 작성일: 2026-01-19 (업데이트)
> 목적: Steam 포함 다양한 플랫폼 배포를 위한 최적 기술 스택 선정

---

## 1. 벤치마크 게임 기술 스택 분석

### 1.1 Factorio (레퍼런스 게임)

| 항목                  | 기술                              |
| --------------------- | --------------------------------- |
| **핵심 언어**         | C++                               |
| **게임 엔진**         | 커스텀 엔진 (자체 개발)           |
| **그래픽 라이브러리** | Allegro (크로스플랫폼용), OpenGL  |
| **스크립팅**          | Lua (모딩용 LuaJIT)               |
| **셰이더**            | GLSL                              |
| **3D 모델링**         | Blender → 45° 아이소메트릭 렌더링 |
| **추가 라이브러리**   | Boost, Agui                       |
| **개발팀 규모**       | 31명 (2024년 기준)                |

**핵심 인사이트:**

- 기존 엔진이 목표에 맞지 않아 **커스텀 엔진 개발** 선택
- 성능이 최우선이라 C++ 채택
- 모딩 시스템은 Lua로 분리하여 확장성 확보

**개발자 회고 (Rseding91):**

> "Allegro, Agui, Lua는 다시 안 쓸 것. 하지만 C++의 극한 제어력은 여전히 사랑한다."

---

### 1.2 유사 장르 게임들

#### Shapez.io (오픈소스, 웹+데스크톱) ⭐ 가장 유사

| 항목       | 기술                          |
| ---------- | ----------------------------- |
| **언어**   | JavaScript (ES5, 일부 ES2015) |
| **엔진**   | 커스텀 (YORG.io 3 기반)       |
| **빌드**   | Gulp                          |
| **플랫폼** | 웹 브라우저, Steam (데스크톱) |

**개발자 회고:** "다시 개발한다면 **TypeScript**를 사용하겠다"

#### Mindustry (오픈소스)

| 항목           | 기술                                |
| -------------- | ----------------------------------- |
| **언어**       | Java (JDK 17)                       |
| **프레임워크** | libGDX → 커스텀 Arc 프레임워크      |
| **플랫폼**     | Windows, macOS, Linux, Android, iOS |

**특징:** libGDX 기반으로 진정한 크로스플랫폼 달성

#### Vampire Survivors

| 항목          | 초기                 | 현재           |
| ------------- | -------------------- | -------------- |
| **엔진**      | Phaser 3 (웹)        | Unity (Il2Cpp) |
| **언어**      | JavaScript           | C# → C++ 변환  |
| **전환 이유** | 콘솔 포팅, 성능 개선 |

**중요 교훈:**

- MVP/Demo는 Phaser(웹)로 빠르게 개발
- 정식 출시 및 콘솔 포팅 시 Unity로 리빌드
- 개발자는 Unity 라이선스 정책 후 **"다른 엔진을 검토하겠다"**고 언급

---

## 2. 게임 엔진 비교 분석 (2025년 기준)

### 2.1 시장 점유율

| 엔진      | Steam 게임 점유율 (2024) | 트렌드                |
| --------- | ------------------------ | --------------------- |
| Unity     | 51%                      | 소폭 하락             |
| Unreal    | 28%                      | 상승                  |
| **Godot** | 5%                       | **급성장**            |
| GameMaker | 4%                       | 유지                  |
| 커스텀    | 13%                      | 하락 (2012년 70%에서) |

### 2.2 엔진별 상세 비교

#### Godot Engine ⭐ **인디 개발 1순위 추천**

| 장점                        | 단점                           |
| --------------------------- | ------------------------------ |
| 100% 무료, 오픈소스         | 3D 성능 Unity/Unreal 대비 약함 |
| 실행 파일 50MB 이하         | 대규모 프로젝트 레퍼런스 부족  |
| 빠른 이터레이션             | 에셋 스토어 규모 작음          |
| **2D 전용 엔진 (네이티브)** | 콘솔 포팅 공식 미지원          |
| GDScript + C# 지원          |                                |

**성공 사례 (매출):**
| 게임 | 매출 | 평점 |
|------|------|------|
| Brotato | $10.7M | 96.57% 긍정 |
| Dome Keeper | $6.1M | 92.31% 긍정 |
| Backpack Battles | $5.2M | 91.09% 긍정 |
| Until Then | $5.1M | 97.27% 긍정 |
| Turing Complete | $2.1M | 96.10% 긍정 |

**2025 현황:** 연간 Steam 출시 게임 수가 2024년 전체(389개)를 **5개월 만에 돌파**(394개)

#### Unity

| 장점               | 단점                            |
| ------------------ | ------------------------------- |
| 모바일 70%+ 점유율 | 2023 런타임 피 논란 (2024 철회) |
| 방대한 에셋 스토어 | 신뢰도 하락                     |
| C# 친숙한 환경     | 최적화 노력 필요                |
| 콘솔 공식 지원     |                                 |

**라이선스:** 연 $200K 미만 수익 시 무료, 이후 연 $2,200/인

#### Unreal Engine

| 장점                       | 단점                       |
| -------------------------- | -------------------------- |
| 최고 수준 3D 그래픽        | 높은 시스템 요구사항       |
| 블루프린트 비주얼 스크립팅 | 학습 곡선 가파름 (4-6개월) |
| 콘솔 완벽 지원             | **2D 게임에 과도함**       |

**라이선스:** $1M 매출까지 무료, 이후 5% 로열티

### 2.3 추천 매트릭스

| 사용 사례               | 추천 엔진             |
| ----------------------- | --------------------- |
| **2D 인디 게임**        | **Godot**             |
| 모바일/크로스플랫폼     | Unity                 |
| 고퀄리티 3D             | Unreal                |
| 픽셀아트 RPG            | Godot / GameMaker     |
| **타워디펜스/팩토리류** | **Godot** 또는 커스텀 |

---

## 3. 웹 게임 → Steam 배포 옵션

### 3.1 Electron (단기 권장)

| 장점                           | 단점                   |
| ------------------------------ | ---------------------- |
| Steam SDK 통합 (steamworks.js) | 80-120MB 바이너리 크기 |
| 크로스플랫폼 일관된 렌더링     | 100MB+ 메모리 사용     |
| 웹 개발자 친숙                 | 게임에는 과도한 리소스 |
| 검증된 사례 다수               |                        |

**Steam 통합:** `steamworks.js` 패키지로 업적, 클라우드 저장, 리더보드 연동

**성공 사례:**

- Game Dev Tycoon (NW.js/Greenworks)
- **5,700+ 게임**이 NW.js 사용 (SteamDB 기준)

### 3.2 Tauri

| 장점             | 단점                      |
| ---------------- | ------------------------- |
| 2.5-3MB 바이너리 | **Steam SDK 통합 어려움** |
| 30-40MB 메모리   | OS별 WebView 차이         |
| Rust 기반 보안   | Rust 지식 필요            |

**결론:** 게임 개발에는 **Electron이 더 적합**

### 3.3 NW.js

| 장점                   | 단점                   |
| ---------------------- | ---------------------- |
| Electron과 유사        | 유지보수 활발도 낮음   |
| Greenworks 레거시 지원 | Greenworks 지원 중단됨 |

---

## 4. Kimchi Invasion 기술 스택 제안

### 4.1 전략적 접근: 2단계 개발

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: MVP/Demo (웹 버전)                                │
│  ─────────────────────────────                              │
│  • 목표: 빠른 프로토타이핑, 유저 피드백 수집                  │
│  • 플랫폼: 웹 브라우저 (ClickSurvivor 허브)                  │
│  • 기술: 현재 JavaScript + HTML5 Canvas/WebGL               │
│  • 기간: 단기                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Phase 2: 정식 버전 (Steam + 크로스플랫폼)                   │
│  ─────────────────────────────                              │
│  • 목표: Steam 출시, 콘솔 확장 가능성                        │
│  • 옵션 A: Godot 리빌드 ⭐ 권장                              │
│  • 옵션 B: Electron 래핑 + 점진적 개선                       │
│  • 옵션 C: Unity 완전 리빌드                                │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 옵션별 상세 분석

#### 옵션 A: Godot 리빌드 ⭐ **1순위 권장**

```
기술 스택:
├── 엔진: Godot 4.x
├── 언어: GDScript (또는 C#)
├── 렌더링: Godot 2D 엔진
├── 빌드 대상:
│   ├── Windows (.exe)
│   ├── macOS (.app)
│   ├── Linux
│   └── 웹 (HTML5 export)
└── Steam: GodotSteam 플러그인
```

| 평가 항목    | 점수                  |
| ------------ | --------------------- |
| 개발 효율    | ★★★★☆                 |
| 성능         | ★★★★★                 |
| 크로스플랫폼 | ★★★★★                 |
| Steam 통합   | ★★★★☆                 |
| 학습 곡선    | ★★★★☆ (GDScript 쉬움) |
| 비용         | ★★★★★ (무료)          |
| 커뮤니티     | ★★★★☆ (급성장 중)     |

**적합한 경우:**

- 팩토리/자동화 장르 (Shapez.io, Mindustry 유사)
- 2D 그래픽 중심
- 향후 콘솔 포팅은 별도 고려

#### 옵션 B: Electron 래핑

```
기술 스택:
├── 프레임워크: Electron
├── 프론트엔드: 기존 JS 코드 재사용
├── Steam: steamworks.js
├── 빌드: Electron Forge + GitHub Actions
└── 대상: Windows, macOS, Linux
```

| 평가 항목     | 점수                     |
| ------------- | ------------------------ |
| 개발 효율     | ★★★★★ (기존 코드 재사용) |
| 성능          | ★★★☆☆                    |
| 크로스플랫폼  | ★★★★☆                    |
| Steam 통합    | ★★★★★                    |
| 학습 곡선     | ★★★★★ (변경 최소)        |
| 비용          | ★★★★★                    |
| 바이너리 크기 | ★★☆☆☆ (80MB+)            |

**적합한 경우:**

- 빠른 Steam 출시가 목표
- 웹 버전과 동시 유지보수
- 성능 요구사항이 높지 않음

#### 옵션 C: Unity 리빌드

```
기술 스택:
├── 엔진: Unity 2022 LTS
├── 언어: C#
├── 렌더링: URP (Universal Render Pipeline)
├── Steam: Steamworks.NET
└── 대상: 전 플랫폼 (콘솔 포함)
```

| 평가 항목    | 점수                       |
| ------------ | -------------------------- |
| 개발 효율    | ★★★☆☆ (완전 재개발)        |
| 성능         | ★★★★☆                      |
| 크로스플랫폼 | ★★★★★                      |
| Steam 통합   | ★★★★★                      |
| 콘솔 지원    | ★★★★★                      |
| 비용         | ★★★★☆                      |
| 신뢰도       | ★★★☆☆ (라이선스 논란 여파) |

**적합한 경우:**

- Nintendo Switch, PlayStation, Xbox 출시 계획
- 대규모 3D 요소 추가 예정
- 모바일 앱 스토어 동시 출시

---

### 4.3 최종 권장안

```
┌────────────────────────────────────────────────────────────┐
│                    권장 전략: A + B 하이브리드              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  단기 (1-3개월): 웹 MVP로 컨셉 검증                         │
│  ────────────────────────────────                          │
│  • 현재 JavaScript 코드로 ClickSurvivor 허브에 배포         │
│  • 핵심 게임플레이 피드백 수집                              │
│  • (선택) Electron으로 Steam Early Access 빠른 출시         │
│                                                            │
│  중장기 (3-6개월): Godot 4로 리빌드                         │
│  ────────────────────────────────                          │
│  • 핵심 게임 로직 GDScript/C#로 포팅                       │
│  • 성능 크리티컬 부분부터 순차 전환                         │
│  • 웹 버전도 Godot HTML5 export로 통합                     │
│                                                            │
│  최종: Godot 기반 단일 코드베이스                          │
│  ────────────────────────────────                          │
│  • Steam, Web, (향후 Mobile) 동시 배포                     │
│  • GodotSteam으로 완전한 Steam 기능 활용                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 5. 왜 Godot인가? (vs Unity/Unreal)

### 5.1 Kimchi Invasion 장르 적합성

| 요소               | Godot   | Unity       | Unreal    |
| ------------------ | ------- | ----------- | --------- |
| 2D 타워디펜스      | ⭐ 최적 | 적합        | 과도함    |
| 팩토리 시뮬레이션  | ⭐ 최적 | 적합        | 과도함    |
| 인디 개발자 친화성 | ⭐ 최고 | 보통        | 낮음      |
| 라이선스 비용      | **$0**  | 조건부 무료 | 5% 로열티 |
| 학습 곡선          | 1-2개월 | 2-4개월     | 4-6개월   |

### 5.2 유사 성공 게임 비교

- **Brotato** (Godot): 로그라이크 슈터 → $10.7M
- **Dome Keeper** (Godot): 타워디펜스 + 채굴 → $6.1M
- **Shapez.io** (JavaScript→Steam): 팩토리 빌더 → Steam 인기

### 5.3 Unity 기피 이유

1. **2023년 런타임 피 논란**: 철회했지만 신뢰 손상
2. **Vampire Survivors 개발자**: "다시는 Unity 안 씀"
3. **커뮤니티 이탈**: Godot으로 대규모 마이그레이션

---

## 6. 실행 로드맵

| 단계          | 목표                | 기술        | 마일스톤                |
| ------------- | ------------------- | ----------- | ----------------------- |
| **Phase 1**   | 웹 MVP 완성         | JavaScript  | ClickSurvivor 허브 배포 |
| **Phase 1.5** | (선택) Early Access | Electron    | Steam 얼리억세스        |
| **Phase 2**   | Godot 프로토타입    | GDScript    | 핵심 메카닉 포팅        |
| **Phase 3**   | Godot 정식 개발     | GDScript/C# | Steam 정식 출시         |
| **Phase 4**   | 확장                | Godot       | 모바일/콘솔 검토        |

---

## 7. 참고 자료 및 출처

### 게임 기술 스택

- [Factorio 프로그래밍 언어](https://forums.factorio.com/viewtopic.php?t=46670)
- [Factorio Steam 토론](https://steamcommunity.com/app/427520/discussions/0/143388132204902411/)
- [Shapez.io GitHub](https://github.com/tobspr-games/shapez.io)
- [Mindustry GitHub](https://github.com/Anuken/Mindustry)
- [Vampire Survivors Wikipedia](https://en.wikipedia.org/wiki/Vampire_Survivors)
- [Vampire Survivors 엔진 전환](https://www.windowscentral.com/gaming/vampire-survivors-was-rebuilt-just-to-run-well-on-xbox-consoles)

### 엔진 비교

- [Godot vs Unity 2025](https://rocketbrush.com/blog/godot-vs-unity)
- [게임 엔진 비교 2025](https://www.wayline.io/blog/unity-unreal-godot-engine-comparison-2025)
- [Godot 성공 게임 분석 2025](https://alihan98ersoy.medium.com/most-successful-games-made-with-godot-engine-revenue-sales-analysis-2025-9b69af569585)
- [Steam 게임 엔진 통계 2025](https://gamedevreports.substack.com/p/video-game-insights-game-engines)
- [Godot 폭발적 성장](https://automaton-media.com/en/news/godot-engine-is-seeing-explosive-growth-total-number-of-godot-games-on-steam-surpasses-last-years/)

### Steam 배포

- [Electron으로 웹게임 Steam 배포](https://dev.to/jacklehamster/publish-your-web-game-to-steam-using-electron-670)
- [Phaser + Electron Steam 가이드](https://phaser.io/news/2025/03/publishing-web-games-on-steam-with-electron)
- [steamworks.js GitHub](https://github.com/ceifa/steamworks.js/)
- [Tauri vs Electron 비교](https://www.raftlabs.com/blog/tauri-vs-electron-pros-cons/)

---

## 8. 결론

**Kimchi Invasion의 특성**(팩토리/타워디펜스 하이브리드, 2D 그래픽)을 고려할 때:

| 순위         | 전략               | 근거                                             |
| ------------ | ------------------ | ------------------------------------------------ |
| 🥇 **1순위** | **Godot 4 리빌드** | 2D 네이티브, 무료, 급성장 생태계, 유사 게임 성공 |
| 🥈 **2순위** | Electron 래핑      | 기존 코드 활용, 빠른 Steam 출시                  |
| 🥉 **3순위** | Unity 리빌드       | 콘솔 필수 시, 대규모 확장 시                     |

**최종 권장:**

1. **즉시**: 웹 MVP로 컨셉 검증
2. **검증 후**: Godot 4로 마이그레이션
3. **장기**: Steam 정식 출시 + 웹/모바일 동시 배포
