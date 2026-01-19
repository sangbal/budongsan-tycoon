/**
 * KIMCHI INVASION - Zustand Stores Index
 *
 * @description 모든 Zustand 스토어 중앙 export
 */

// Game Store - 자원, 건물, 생산
export { useGameStore, selectResource, selectBuildingCount, selectKimchiRate } from './gameStore.js'

// UI Store - 모달, 패널, 선택
export { useUIStore, selectIsModalOpen, selectIsPanelOpen, selectIsBuildMode } from './uiStore.js'

// Settings Store - 설정
export {
  useSettingsStore,
  selectLanguage,
  selectIsSoundEnabled,
  selectIsMusicEnabled,
  applyInitialSettings,
} from './settingsStore.js'
