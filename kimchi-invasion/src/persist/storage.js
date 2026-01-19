/**
 * KIMCHI INVASION - Storage Module
 *
 * Handles game save/load with localStorage and cloud sync.
 */

import { useGameStore } from '../state/stores/gameStore.js'

const LOCAL_STORAGE_KEY = 'kimchi_invasion_save'
const SAVE_VERSION = 1

let autoSaveInterval = null

/**
 * Save game to localStorage
 */
export function saveGame() {
  try {
    const state = useGameStore.getState().serialize()
    if (!state) {
      console.warn('[Storage] No game state to save')
      return false
    }

    const saveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      state: state,
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData))
    console.log('[Storage] Game saved')
    return true
  } catch (error) {
    console.error('[Storage] Save failed:', error)
    return false
  }
}

/**
 * Load game from localStorage
 */
export async function loadSave() {
  try {
    const saveDataStr = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!saveDataStr) {
      console.log('[Storage] No save found')
      return false
    }

    const saveData = JSON.parse(saveDataStr)

    // Version migration if needed
    const migratedState = migrateState(saveData.state, saveData.version)

    // Initialize game state with saved data
    useGameStore.getState().deserialize(migratedState)

    console.log('[Storage] Save loaded successfully')
    return true
  } catch (error) {
    console.error('[Storage] Load failed:', error)
    return false
  }
}

/**
 * Delete saved game
 */
export function deleteSave() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    console.log('[Storage] Save deleted')
    return true
  } catch (error) {
    console.error('[Storage] Delete failed:', error)
    return false
  }
}

/**
 * Check if a save exists
 */
export function hasSave() {
  return localStorage.getItem(LOCAL_STORAGE_KEY) !== null
}

/**
 * Setup auto-save
 */
export function setupAutoSave(intervalMs = 30000) {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
  }

  autoSaveInterval = setInterval(() => {
    saveGame()
  }, intervalMs)

  // Save on visibility change (tab hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      saveGame()
    }
  })

  // Save before unload
  window.addEventListener('beforeunload', () => {
    saveGame()
  })

  console.log(`[Storage] Auto-save enabled (${intervalMs / 1000}s interval)`)
}

/**
 * Stop auto-save
 */
export function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
    autoSaveInterval = null
  }
}

/**
 * Migrate save data to current version
 */
function migrateState(state, fromVersion) {
  let migratedState = state

  // Add migration logic as versions change
  // if (fromVersion < 2) {
  //   migratedState = migrateV1toV2(migratedState);
  // }

  return migratedState
}

/**
 * Export save as JSON string (for backup)
 */
export function exportSave() {
  try {
    const state = useGameStore.getState().serialize()
    if (!state) return null

    const exportData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      game: 'kimchi-invasion',
      state: state,
    }

    return JSON.stringify(exportData, null, 2)
  } catch (error) {
    console.error('[Storage] Export failed:', error)
    return null
  }
}

/**
 * Import save from JSON string
 */
export function importSave(jsonString) {
  try {
    const importData = JSON.parse(jsonString)

    if (importData.game !== 'kimchi-invasion') {
      throw new Error('Invalid save file')
    }

    const migratedState = migrateState(importData.state, importData.version)
    useGameStore.getState().deserialize(migratedState)

    // Save to localStorage
    saveGame()

    console.log('[Storage] Import successful')
    return true
  } catch (error) {
    console.error('[Storage] Import failed:', error)
    return false
  }
}
