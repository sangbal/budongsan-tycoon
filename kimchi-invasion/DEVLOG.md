# DEVLOG

## 2026-01-20: Phase 2 QA & 최적화 완료

### 🔧 성능 최적화

**Objective**: console.log 정리 및 성능 모니터링 추가

**Completed Actions**:

- **console.log 정리**: 232개 → 58개 (75% 감소)
  - inserterSystem.js, conveyorSystem.js, researchSystem.js 등 6개 파일 정리
  - DEBUG 로그 제거, WARN/ERROR 로그 유지
- **FPS 모니터 추가** (DEV 환경 전용)
  - `main.js`에 fpsMonitor 객체 추가
  - 색상 코딩: 초록(60+), 노랑(30-59), 빨강(<30)

### 🐛 버그 수정

**버그 1: buildingRenderer 에너지/자원 부족 피드백**

- `buildingRenderer.js` 수정
- powerSystem.canOperate() 연동
- markNoPower() 함수로 빨간색 테두리 표시
- 입력 자원 부족 시에도 경고 표시

**버그 2: buildingRenderer 메모리 누수**

- 이벤트 리스너 해제 추가 (destroyBuildingRenderer)
- eventHandlers 객체로 핸들러 저장 후 off() 호출

**버그 3: UI 모달 Z-order 충돌**

- `styles.css`에 Z-index CSS 변수 추가
- `tutorial.css`, `settings.css`에서 CSS 변수 사용
- 명확한 Z-index 계층 구조 정의

### 📦 빌드 검증

- **빌드**: 성공 (6.93s)
- **번들 크기**: kimchi-invasion-bundle 133.93 KB (gzip: 37.54 KB)
- **테스트**: 902/936 통과 (96%)

### 📝 수정된 파일

| 파일                     | 변경 내용                       |
| :----------------------- | :------------------------------ |
| `main.js`                | FPS 모니터 추가                 |
| `ui/buildingRenderer.js` | 에너지/자원 피드백, 이벤트 해제 |
| `i18n/index.js`          | getCurrentLanguage alias        |
| `styles.css`             | Z-index CSS 변수                |
| `styles/tutorial.css`    | CSS 변수 적용                   |
| `styles/settings.css`    | CSS 변수 적용                   |
| 6개 systems/\*.js        | console.log 정리                |

---

## 2026-01-19: MVP Asset Generation Phase 1

### 🎨 Visual UX

**Objective**: Generate core assets defined in `docs/03-visual-ux/g-asset-specs.md` and `h-asset-advanced.md` to support MVP development.

**Completed Actions**:

- Analyzed Asset Specifications (Mission Control Aesthetic, Isometric 45°, Pixel-perfect).
- Generated 21 Essential Assets covering Buildings, Logistics, Resources, and UI.
- Validated style consistency (Flat minimal vector, specific color palette).

**Generated Asset List (`generated-images/`):**

#### 🏭 Buildings (15 items)

| Category         | Assets                                                                                                                                                                |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Extraction**   | `building_miner_b01` (Iron/Rust), `building_ice_drill_b02` (Ice/Blue)                                                                                                 |
| **Bio & Farm**   | `building_greenhouse_b03` (Dome), `building_hydroponics_b04` (Trays), `building_mega_greenhouse_b05` (Triple Dome)                                                    |
| **Processing**   | `building_thawer_b06`, `building_distiller_b07`, `building_furnace_b08`, `building_dryer_b09`, `building_crusher_b10`, `building_extractor_b11`, `building_mixer_b12` |
| **Fermentation** | `building_pickling_station_b13`, `building_fermenter_b14`, `building_packaging_machine_b17`                                                                           |
| **Energy**       | `building_thermal_plant_b36`, `building_power_pole_b41`                                                                                                               |

#### 📦 Logistics (3 items)

- `building_belt_b22` (Conveyor)
- `building_inserter_b26` (Robotic Arm)
- `building_warehouse_b33` (Storage)

#### 💎 Resources (7 items)

- **Raw**: Iron Ore (`r01`), Lithium (`r02`), Silicon (`r03`), Water (`r14`)
- **Product**: Cabbage (`r17`), Iron Plate (`r15`), Kimchi (`r32`)

#### 🖥️ UI (3 items)

- `ui_button_primary`
- `ui_panel_base` (9-slice ready)
- `ui_slot_frame`

**Next Steps**:

- Sprite sheet generation (TexturePacker or similar).
- Implementation of `AssetLoader` in game engine.
- Integrating assets into the game grid system.
