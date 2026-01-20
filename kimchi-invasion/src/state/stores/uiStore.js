/**
 * KIMCHI INVASION - UI Store (Zustand)
 *
 * @description UI 상태 관리 (모달, 패널, 선택, 툴팁)
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/**
 * @typedef {Object} UIState
 * @property {string|null} activePanel - 현재 열린 패널 (build, research, inventory, settings)
 * @property {string|null} activeModal - 현재 열린 모달
 * @property {Object|null} modalData - 모달에 전달할 데이터
 * @property {string|null} selectedBuildingType - 배치할 건물 타입
 * @property {string|null} selectedBuildingId - 선택된 건물 ID
 * @property {Object|null} tooltip - 툴팁 상태
 * @property {boolean} isLoading - 로딩 중 여부
 * @property {string|null} loadingMessage - 로딩 메시지
 * @property {Array} notifications - 알림 큐
 * @property {boolean} isPaused - 게임 일시정지 여부
 * @property {string} currentView - 현재 뷰 (game, menu, tutorial)
 */

/**
 * UI Store
 */
export const useUIStore = create(
  subscribeWithSelector((set, get) => ({
    // === State ===
    activePanel: null,
    activeModal: null,
    modalData: null,
    selectedBuildingType: null,
    selectedBuildingId: null,
    tooltip: null,
    isLoading: false,
    loadingMessage: null,
    notifications: [],
    isPaused: false,
    currentView: 'game',

    // 빌드 모드
    buildMode: {
      active: false,
      type: null,
      valid: false,
      previewX: 0,
      previewY: 0,
    },

    // 카메라 상태 (UI에서 참조용)
    camera: {
      x: 0,
      y: 0,
      zoom: 1,
    },

    // === Actions: Panel ===

    /**
     * 패널 열기
     * @param {string} panelId
     */
    openPanel: panelId => {
      set({ activePanel: panelId })
    },

    /**
     * 패널 닫기
     */
    closePanel: () => {
      set({ activePanel: null })
    },

    /**
     * 패널 토글
     * @param {string} panelId
     */
    togglePanel: panelId => {
      set(state => ({
        activePanel: state.activePanel === panelId ? null : panelId,
      }))
    },

    // === Actions: Modal ===

    /**
     * 모달 열기
     * @param {string} modalId
     * @param {Object} [data]
     */
    openModal: (modalId, data = null) => {
      set({
        activeModal: modalId,
        modalData: data,
        isPaused: true, // 모달 열리면 게임 일시정지
      })
    },

    /**
     * 모달 닫기
     */
    closeModal: () => {
      set({
        activeModal: null,
        modalData: null,
        isPaused: false,
      })
    },

    // === Actions: Building Selection ===

    /**
     * 배치할 건물 선택 (빌드 모드 진입)
     * @param {string} buildingType
     */
    selectBuildingType: buildingType => {
      set({
        selectedBuildingType: buildingType,
        buildMode: {
          active: true,
          type: buildingType,
          valid: false,
          previewX: 0,
          previewY: 0,
        },
      })
    },

    /**
     * 빌드 모드 종료
     */
    cancelBuildMode: () => {
      set({
        selectedBuildingType: null,
        buildMode: {
          active: false,
          type: null,
          valid: false,
          previewX: 0,
          previewY: 0,
        },
      })
    },

    /**
     * 빌드 프리뷰 업데이트
     * @param {number} x - 타일 X
     * @param {number} y - 타일 Y
     * @param {boolean} valid - 배치 가능 여부
     */
    updateBuildPreview: (x, y, valid) => {
      set(state => ({
        buildMode: {
          ...state.buildMode,
          previewX: x,
          previewY: y,
          valid,
        },
      }))
    },

    /**
     * 건물 선택 (기존 건물 클릭)
     * @param {string} buildingId
     */
    selectBuilding: buildingId => {
      set({
        selectedBuildingId: buildingId,
        selectedBuildingType: null,
      })
    },

    /**
     * 선택 해제
     */
    clearSelection: () => {
      set({
        selectedBuildingId: null,
        selectedBuildingType: null,
        buildMode: {
          active: false,
          type: null,
          valid: false,
          previewX: 0,
          previewY: 0,
        },
      })
    },

    // === Actions: Tooltip ===

    /**
     * 툴팁 표시
     * @param {Object} tooltip - { x, y, title, content, type }
     */
    showTooltip: tooltip => {
      set({ tooltip })
    },

    /**
     * 툴팁 숨기기
     */
    hideTooltip: () => {
      set({ tooltip: null })
    },

    // === Actions: Loading ===

    /**
     * 로딩 시작
     * @param {string} [message]
     */
    startLoading: (message = null) => {
      set({ isLoading: true, loadingMessage: message })
    },

    /**
     * 로딩 완료
     */
    stopLoading: () => {
      set({ isLoading: false, loadingMessage: null })
    },

    /**
     * 로딩 메시지 업데이트
     * @param {string} message
     */
    updateLoadingMessage: message => {
      set({ loadingMessage: message })
    },

    // === Actions: Notifications ===

    /**
     * 알림 추가
     * @param {Object} notification - { id, type, message, duration }
     */
    addNotification: notification => {
      const id = notification.id ?? `notif-${Date.now()}`
      set(state => ({
        notifications: [...state.notifications, { ...notification, id }],
      }))

      // 자동 제거 (기본 3초)
      const duration = notification.duration ?? 3000
      if (duration > 0) {
        setTimeout(() => {
          get().removeNotification(id)
        }, duration)
      }

      return id
    },

    /**
     * 알림 제거
     * @param {string} notificationId
     */
    removeNotification: notificationId => {
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== notificationId),
      }))
    },

    /**
     * 모든 알림 제거
     */
    clearNotifications: () => {
      set({ notifications: [] })
    },

    // === Actions: Game State ===

    /**
     * 게임 일시정지
     */
    pause: () => {
      set({ isPaused: true })
    },

    /**
     * 게임 재개
     */
    resume: () => {
      set({ isPaused: false })
    },

    /**
     * 일시정지 토글
     */
    togglePause: () => {
      set(state => ({ isPaused: !state.isPaused }))
    },

    /**
     * 뷰 변경
     * @param {string} view - game, menu, tutorial
     */
    setView: view => {
      set({ currentView: view })
    },

    // === Actions: Camera (UI 참조용) ===

    /**
     * 카메라 상태 업데이트 (UI 동기화용)
     * @param {Object} camera - { x, y, zoom }
     */
    updateCamera: camera => {
      set({ camera })
    },

    // === Actions: Reset ===

    /**
     * UI 상태 초기화
     */
    reset: () => {
      set({
        activePanel: null,
        activeModal: null,
        modalData: null,
        selectedBuildingType: null,
        selectedBuildingId: null,
        tooltip: null,
        isLoading: false,
        loadingMessage: null,
        notifications: [],
        isPaused: false,
        currentView: 'game',
        buildMode: {
          active: false,
          type: null,
          valid: false,
          previewX: 0,
          previewY: 0,
        },
      })
    },
  }))
)

// === Selectors ===

export const selectIsModalOpen = state => state.activeModal !== null
export const selectIsPanelOpen = panelId => state => state.activePanel === panelId
export const selectIsBuildMode = state => state.buildMode.active
