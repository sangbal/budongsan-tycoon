/**
 * KIMCHI INVASION - Game Systems Index
 *
 * Central export for all game systems.
 * Each system handles a specific aspect of gameplay.
 */

import { initCameraControls, destroyCameraControls } from './cameraControls.js'
import { resourceSystem } from './resourceSystem.js'
import { buildingSystem } from './buildingSystem.js'
import { processingSystem } from './processingSystem.js'
import { fermentationSystem } from './fermentationSystem.js'
import { powerSystem } from './powerSystem.js'
import { tutorialSystem } from './tutorialSystem.js'

// System modules will be imported here as they are developed
// import { initLogisticsSystem } from './logistics.js';
// import { initResearchSystem } from './research.js';
// import { initExportSystem } from './export.js';

/**
 * Get all ECS systems that need to be registered with the World
 * @returns {import('../ecs/System.js').System[]}
 */
export function getAllSystems() {
  return [
    resourceSystem,
    buildingSystem,
    processingSystem,
    fermentationSystem,
    powerSystem,
    tutorialSystem,
    // TODO: Add more systems as they are developed
  ]
}

/**
 * Initialize all game systems
 * @param {import('../ecs/World.js').World} world - ECS World instance
 */
export async function initSystems(world) {
  console.log('[Systems] Initializing game systems...')

  // Register ECS systems with the World
  const systems = getAllSystems()
  for (const system of systems) {
    world.addSystem(system)
    console.log(`[Systems] Registered: ${system.constructor.name}`)
  }

  // Core systems (non-ECS)
  initCameraControls()

  // TODO: Initialize each system
  // await initProductionSystem();
  // await initLogisticsSystem();
  // await initFermentationSystem();
  // await initResearchSystem();
  // await initExportSystem();

  console.log('[Systems] All systems initialized')
}

/**
 * Update all game systems (called each frame)
 */
export function updateSystems(deltaTime) {
  // TODO: Update each system
  // updateProductionSystem(deltaTime);
  // updateLogisticsSystem(deltaTime);
  // updateFermentationSystem(deltaTime);
}

/**
 * Pause all systems (for menu, etc.)
 */
export function pauseSystems() {
  console.log('[Systems] Paused')
}

/**
 * Resume all systems
 */
export function resumeSystems() {
  console.log('[Systems] Resumed')
}

/**
 * Cleanup all systems (called on game exit)
 */
export function cleanupSystems() {
  destroyCameraControls()
  console.log('[Systems] Cleaned up')
}

// Export individual systems for direct access
export { resourceSystem } from './resourceSystem.js'
export { buildingSystem } from './buildingSystem.js'
export { processingSystem } from './processingSystem.js'
export { fermentationSystem } from './fermentationSystem.js'
export { powerSystem } from './powerSystem.js'
export { tutorialSystem, checkAutoStartTutorial } from './tutorialSystem.js'
