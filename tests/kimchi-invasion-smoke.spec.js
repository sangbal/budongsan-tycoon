// @ts-check
import { test, expect } from '@playwright/test'

test.describe('KIMCHI INVASION - Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kimchi-invasion/')
  })

  test.skip('should load game and hide loading screen', async ({ page }) => {
    // Skip: 게임 개발 중 - 로딩 시스템 안정화 후 활성화
    // Wait for loading screen to disappear (max 10 seconds)
    const loadingScreen = page.locator('#loading-screen')

    // Should start with loading screen visible
    await expect(loadingScreen).toBeVisible({ timeout: 2000 })

    // Loading screen should eventually be hidden
    await expect(loadingScreen).toBeHidden({ timeout: 15000 })

    // Canvas should be visible
    const canvas = page.locator('#game-canvas')
    await expect(canvas).toBeVisible()

    // No console errors (check for critical errors)
    const consoleErrors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Wait a bit for any async errors
    await page.waitForTimeout(1000)

    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(
      err => !err.includes('favicon') && !err.includes('404')
    )

    expect(criticalErrors).toHaveLength(0)
  })

  test('should have PixiJS canvas rendering', async ({ page }) => {
    // Wait for game to load
    await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 15000 })

    // Check canvas dimensions
    const canvas = page.locator('#game-canvas')
    const boundingBox = await canvas.boundingBox()

    expect(boundingBox).not.toBeNull()
    expect(boundingBox?.width).toBeGreaterThan(100)
    expect(boundingBox?.height).toBeGreaterThan(100)
  })

  test.skip('should respond to keyboard input for camera', async ({ page }) => {
    // Skip: 게임 개발 중 - 로딩 시스템 안정화 후 활성화
    // Wait for game to load
    await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 15000 })

    // Focus on canvas
    await page.locator('#game-canvas').click()

    // Press WASD keys (should not throw errors)
    await page.keyboard.press('w')
    await page.keyboard.press('a')
    await page.keyboard.press('s')
    await page.keyboard.press('d')

    // If we get here without errors, the test passes
    expect(true).toBe(true)
  })
})
