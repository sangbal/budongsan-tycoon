// @ts-check
import { test } from '@playwright/test'

test('KIMCHI INVASION - Debug Loading', async ({ page }) => {
  const consoleLogs = []
  const consoleErrors = []

  page.on('console', msg => {
    const text = msg.text()
    if (msg.type() === 'error') {
      consoleErrors.push(text)
    } else {
      consoleLogs.push(`[${msg.type()}] ${text}`)
    }
  })

  page.on('pageerror', error => {
    consoleErrors.push(`[PAGE ERROR] ${error.message}\n${error.stack}`)
  })

  await page.goto('/kimchi-invasion/')

  // 로딩 상태 확인 (15초 대기)
  await page.waitForTimeout(15000)

  console.log('\n=== Console Logs ===')
  consoleLogs.forEach(log => console.log(log))

  console.log('\n=== Console Errors ===')
  consoleErrors.forEach(err => console.log(err))

  // 로딩 화면 상태 확인
  const loadingScreen = page.locator('#loading-screen')
  const isVisible = await loadingScreen.isVisible()
  console.log(`\n=== Loading Screen Visible: ${isVisible} ===`)

  if (isVisible) {
    const statusText = await page.locator('#loading-status').textContent()
    console.log(`Loading Status: ${statusText}`)
  }
})
