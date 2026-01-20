// @ts-check
import { test, expect } from '@playwright/test'

test.describe('레이아웃 디버깅', () => {
  test('데스크톱 1920px - 5개 탭 레이아웃 확인', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/seoulsurvival/?lang=ko')
    await page.waitForLoadState('networkidle')

    // 스크린샷 저장
    await page.screenshot({ path: 'test-results/desktop-1920-localhost.png', fullPage: false })

    // tab-wrapper의 display 확인
    const tabWrapper = page.locator('.tab-wrapper')
    const display = await tabWrapper.evaluate(el => getComputedStyle(el).display)
    console.log('tab-wrapper display:', display)

    // 각 탭의 너비 확인
    const tabs = ['#workTab', '#shopTab', '#statsTab', '#rankingTab', '#settingsTab']
    for (const tab of tabs) {
      const width = await page.locator(tab).evaluate(el => el.offsetWidth)
      console.log(`${tab} width:`, width)
    }
  })

  test('배포 버전 1920px - 5개 탭 레이아웃 확인', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('https://clicksurvivor.com/seoulsurvival/?lang=ko')
    await page.waitForLoadState('networkidle')

    // 스크린샷 저장
    await page.screenshot({ path: 'test-results/desktop-1920-production.png', fullPage: false })

    // tab-wrapper의 display 확인
    const tabWrapper = page.locator('.tab-wrapper')
    const display = await tabWrapper.evaluate(el => getComputedStyle(el).display)
    console.log('tab-wrapper display:', display)

    // 각 탭의 너비 확인
    const tabs = ['#workTab', '#shopTab', '#statsTab', '#rankingTab', '#settingsTab']
    for (const tab of tabs) {
      const width = await page.locator(tab).evaluate(el => el.offsetWidth)
      console.log(`${tab} width:`, width)
    }
  })

  test('모바일 375px - 노동 탭 폭 확인', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('https://clicksurvivor.com/seoulsurvival/?lang=ko')
    await page.waitForLoadState('networkidle')

    // 스크린샷 저장
    await page.screenshot({ path: 'test-results/mobile-375-production.png', fullPage: false })

    // workTab 너비 확인
    const workTab = page.locator('#workTab')
    const width = await workTab.evaluate(el => el.offsetWidth)
    const computedWidth = await workTab.evaluate(el => getComputedStyle(el).width)
    console.log('workTab offsetWidth:', width)
    console.log('workTab computed width:', computedWidth)

    // section.card 너비 확인
    const card = page.locator('#workTab section.card')
    const cardWidth = await card.evaluate(el => el.offsetWidth)
    console.log('section.card offsetWidth:', cardWidth)
  })
})
