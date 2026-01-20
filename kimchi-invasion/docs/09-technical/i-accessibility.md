# 9-I. 접근성 기술 사양 (Accessibility Specifications)

> **Last Updated:** 2026-01-19
>
> 원본: `09-technical.md` 섹션 9.11

[← 이전: Loading](./09-h-loading.md) | [다음: Platform →](./09-j-platform.md)

---

## 9.11. 접근성 기술 사양

### 9.11.1. WCAG 2.1 AA 준수

```javascript
const ACCESSIBILITY_SPECS = {
  // 시각
  visual: {
    color_contrast: {
      normal_text: 4.5, // AA 기준
      large_text: 3,
      ui_components: 3,
    },
    color_blindness: {
      support: ['protanopia', 'deuteranopia', 'tritanopia'],
      color_coding_alternatives: true, // 색상 외 추가 표시
    },
    text_scaling: {
      min: 100, // %
      max: 200,
      reflow: true, // 확대 시 리플로우
    },
    motion: {
      reduce_motion: true, // prefers-reduced-motion
      pause_animations: true,
    },
  },

  // 청각
  auditory: {
    captions: {
      enabled: true,
      for: ['tutorial', 'story', 'notifications'],
    },
    visual_indicators: {
      for_sound_effects: true, // 효과음 시각적 표시
      for_alerts: true, // 경고음 시각적 표시
    },
  },

  // 운동
  motor: {
    keyboard_navigation: {
      full_support: true,
      focus_visible: true,
      focus_trap_modals: true,
    },
    touch_targets: {
      min_size: 44, // px
      spacing: 8, // px
    },
    one_handed_mode: {
      enabled: true,
      side_preference: 'configurable',
    },
    auto_pause: {
      on_focus_loss: true,
    },
  },

  // 인지
  cognitive: {
    reading_level: 'middle_school', // 중학생 수준
    clear_instructions: true,
    error_recovery: {
      undo_support: true,
      confirmation_dialogs: true,
    },
    consistent_navigation: true,
  },
}
```

### 9.11.2. 키보드 네비게이션

```javascript
const KEYBOARD_NAVIGATION = {
  // 전역 단축키
  global_shortcuts: {
    Escape: '메뉴 열기/닫기',
    Space: '일시정지/재개',
    Tab: '다음 요소로 포커스 이동',
    'Shift+Tab': '이전 요소로 포커스 이동',
  },

  // 게임 내 단축키
  game_shortcuts: {
    '1-9': '건물 선택 (빌드 메뉴)',
    R: '건물 회전',
    Q: '건설 모드 취소',
    'WASD/Arrow': '카메라 이동',
    '+/-': '줌 인/아웃',
  },

  // 포커스 관리
  focus_management: {
    visible_indicator: true,
    trap_in_modals: true,
    restore_on_close: true,
    skip_links: true,
  },
}
```

### 9.11.3. 스크린 리더 지원

```javascript
const SCREEN_READER_SUPPORT = {
  // ARIA 레이블
  aria_labels: {
    all_buttons: true,
    all_inputs: true,
    game_status: true,
    resource_counts: true,
  },

  // 라이브 리전
  live_regions: {
    notifications: 'polite',
    alerts: 'assertive',
    resource_updates: 'off', // 너무 빈번
  },

  // 대체 텍스트
  alt_texts: {
    all_images: true,
    icons_with_meaning: true,
  },
}
```

---

[← 이전: Loading](./09-h-loading.md) | [다음: Platform →](./09-j-platform.md)
