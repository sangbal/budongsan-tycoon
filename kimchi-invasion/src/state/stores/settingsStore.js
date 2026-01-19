/**
 * KIMCHI INVASION - Settings Store (Zustand)
 *
 * @description 게임 설정 관리 (언어, 사운드, 그래픽, 접근성)
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * @typedef {Object} SettingsState
 * @property {string} language - 언어 (ko, en)
 * @property {boolean} soundEnabled - 효과음 활성화
 * @property {boolean} musicEnabled - 배경음악 활성화
 * @property {number} soundVolume - 효과음 볼륨 (0-1)
 * @property {number} musicVolume - 배경음악 볼륨 (0-1)
 * @property {boolean} notificationsEnabled - 알림 활성화
 * @property {boolean} autoSaveEnabled - 자동 저장 활성화
 * @property {number} autoSaveInterval - 자동 저장 간격 (ms)
 * @property {string} graphicsQuality - 그래픽 품질 (low, medium, high)
 * @property {boolean} showFPS - FPS 표시
 * @property {boolean} showGrid - 그리드 표시
 * @property {boolean} reducedMotion - 모션 감소 (접근성)
 * @property {boolean} highContrast - 고대비 모드 (접근성)
 */

const DEFAULT_SETTINGS = {
  // 언어
  language: 'ko',

  // 오디오
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 0.7,
  musicVolume: 0.5,

  // 알림
  notificationsEnabled: true,

  // 저장
  autoSaveEnabled: true,
  autoSaveInterval: 30000, // 30초

  // 그래픽
  graphicsQuality: 'medium',
  showFPS: false,
  showGrid: true,

  // 접근성
  reducedMotion: false,
  highContrast: false,

  // 게임플레이
  tooltipDelay: 500,
  confirmDestructiveActions: true,
}

/**
 * Settings Store (with localStorage persistence)
 */
export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // === State ===
      ...DEFAULT_SETTINGS,

      // === Actions: Language ===

      /**
       * 언어 변경
       * @param {string} lang - ko, en
       */
      setLanguage: lang => {
        set({ language: lang })
        // 브라우저 언어 동기화
        document.documentElement.lang = lang
        // 허브와 동기화
        try {
          localStorage.setItem('clicksurvivor_lang', lang)
        } catch {
          // localStorage 접근 실패 무시
        }
      },

      // === Actions: Audio ===

      /**
       * 효과음 토글
       */
      toggleSound: () => {
        set(state => ({ soundEnabled: !state.soundEnabled }))
      },

      /**
       * 배경음악 토글
       */
      toggleMusic: () => {
        set(state => ({ musicEnabled: !state.musicEnabled }))
      },

      /**
       * 효과음 볼륨 설정
       * @param {number} volume - 0-1
       */
      setSoundVolume: volume => {
        set({ soundVolume: Math.max(0, Math.min(1, volume)) })
      },

      /**
       * 배경음악 볼륨 설정
       * @param {number} volume - 0-1
       */
      setMusicVolume: volume => {
        set({ musicVolume: Math.max(0, Math.min(1, volume)) })
      },

      /**
       * 모든 오디오 음소거
       */
      muteAll: () => {
        set({ soundEnabled: false, musicEnabled: false })
      },

      /**
       * 모든 오디오 활성화
       */
      unmuteAll: () => {
        set({ soundEnabled: true, musicEnabled: true })
      },

      // === Actions: Graphics ===

      /**
       * 그래픽 품질 설정
       * @param {string} quality - low, medium, high
       */
      setGraphicsQuality: quality => {
        set({ graphicsQuality: quality })
      },

      /**
       * FPS 표시 토글
       */
      toggleFPS: () => {
        set(state => ({ showFPS: !state.showFPS }))
      },

      /**
       * 그리드 표시 토글
       */
      toggleGrid: () => {
        set(state => ({ showGrid: !state.showGrid }))
      },

      // === Actions: Accessibility ===

      /**
       * 모션 감소 토글
       */
      toggleReducedMotion: () => {
        set(state => ({ reducedMotion: !state.reducedMotion }))
      },

      /**
       * 고대비 모드 토글
       */
      toggleHighContrast: () => {
        set(state => {
          const newValue = !state.highContrast
          // CSS 클래스 토글
          document.body.classList.toggle('high-contrast', newValue)
          return { highContrast: newValue }
        })
      },

      // === Actions: Save ===

      /**
       * 자동 저장 토글
       */
      toggleAutoSave: () => {
        set(state => ({ autoSaveEnabled: !state.autoSaveEnabled }))
      },

      /**
       * 자동 저장 간격 설정
       * @param {number} interval - ms
       */
      setAutoSaveInterval: interval => {
        set({ autoSaveInterval: Math.max(10000, interval) }) // 최소 10초
      },

      // === Actions: Gameplay ===

      /**
       * 알림 토글
       */
      toggleNotifications: () => {
        set(state => ({ notificationsEnabled: !state.notificationsEnabled }))
      },

      /**
       * 파괴적 행동 확인 토글
       */
      toggleConfirmDestructive: () => {
        set(state => ({ confirmDestructiveActions: !state.confirmDestructiveActions }))
      },

      // === Actions: Batch ===

      /**
       * 여러 설정 동시 변경
       * @param {Partial<SettingsState>} updates
       */
      updateSettings: updates => {
        set(updates)
      },

      /**
       * 설정 초기화
       */
      resetToDefaults: () => {
        set(DEFAULT_SETTINGS)
      },

      // === Utilities ===

      /**
       * 현재 설정 내보내기
       * @returns {Object}
       */
      exportSettings: () => {
        const state = get()
        return {
          language: state.language,
          soundEnabled: state.soundEnabled,
          musicEnabled: state.musicEnabled,
          soundVolume: state.soundVolume,
          musicVolume: state.musicVolume,
          notificationsEnabled: state.notificationsEnabled,
          autoSaveEnabled: state.autoSaveEnabled,
          autoSaveInterval: state.autoSaveInterval,
          graphicsQuality: state.graphicsQuality,
          showFPS: state.showFPS,
          showGrid: state.showGrid,
          reducedMotion: state.reducedMotion,
          highContrast: state.highContrast,
          tooltipDelay: state.tooltipDelay,
          confirmDestructiveActions: state.confirmDestructiveActions,
        }
      },

      /**
       * 설정 가져오기
       * @param {Object} settings
       */
      importSettings: settings => {
        if (!settings || typeof settings !== 'object') return

        const validSettings = {}
        for (const [key, value] of Object.entries(settings)) {
          if (key in DEFAULT_SETTINGS) {
            validSettings[key] = value
          }
        }

        set(validSettings)
      },
    }),
    {
      name: 'kimchi-invasion-settings',
      version: 1,
      // 저장할 키 선택 (함수는 제외)
      partialize: state => ({
        language: state.language,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        soundVolume: state.soundVolume,
        musicVolume: state.musicVolume,
        notificationsEnabled: state.notificationsEnabled,
        autoSaveEnabled: state.autoSaveEnabled,
        autoSaveInterval: state.autoSaveInterval,
        graphicsQuality: state.graphicsQuality,
        showFPS: state.showFPS,
        showGrid: state.showGrid,
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast,
        tooltipDelay: state.tooltipDelay,
        confirmDestructiveActions: state.confirmDestructiveActions,
      }),
    }
  )
)

// === Selectors ===

export const selectLanguage = state => state.language
export const selectIsSoundEnabled = state => state.soundEnabled && state.soundVolume > 0
export const selectIsMusicEnabled = state => state.musicEnabled && state.musicVolume > 0

/**
 * 초기 설정 적용 (앱 시작 시 호출)
 */
export function applyInitialSettings() {
  const { language, highContrast, reducedMotion } = useSettingsStore.getState()

  // 언어 설정
  document.documentElement.lang = language

  // 고대비 모드
  if (highContrast) {
    document.body.classList.add('high-contrast')
  }

  // 모션 감소
  if (reducedMotion) {
    document.body.classList.add('reduced-motion')
  }
}
