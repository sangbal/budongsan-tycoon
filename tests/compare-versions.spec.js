// @ts-check
import { test } from '@playwright/test'

test.describe('배포 버전 vs localhost 비교', () => {
  test('1920px - 닉네임 설정 후 두 버전 비교', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })

    // 두 URL 모두 테스트
    const urls = [
      { name: 'localhost', url: '/seoulsurvival/?lang=ko' },
      { name: 'production', url: 'https://clicksurvivor.com/seoulsurvival/?lang=ko' },
    ]

    for (const { name, url } of urls) {
      console.log(`\n========== ${name.toUpperCase()} ==========`)

      await page.goto(url)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)

      // 닉네임 입력
      const nicknameInput = page
        .locator('input[placeholder*="닉네임"], input[placeholder*="Nickname"]')
        .first()
      if ((await nicknameInput.count()) > 0) {
        console.log('닉네임 입력 시작...')
        await nicknameInput.fill('테스트닉네임')
        await page.waitForTimeout(300)

        const confirmBtn = page.locator('button:has-text("확인"), button:has-text("Save")')
        if ((await confirmBtn.count()) > 0) {
          await confirmBtn.click()
          await page.waitForTimeout(1000)
        }
      }

      // 스크린샷
      await page.screenshot({ path: `test-results/compare-${name}-1920.png`, fullPage: false })

      // 각 탭의 너비 측정
      const tabs = ['#workTab', '#shopTab', '#statsTab', '#rankingTab', '#settingsTab']
      const widths = {}
      for (const tab of tabs) {
        const width = await page.locator(tab).evaluate(el => el.offsetWidth)
        widths[tab] = width
        console.log(`${tab}: ${width}px`)
      }

      // nicknameInfoItem 상태 확인
      const nicknameInfo = page.locator('#nicknameInfoItem')
      if ((await nicknameInfo.count()) > 0) {
        const visibility = await nicknameInfo.evaluate(el => getComputedStyle(el).visibility)
        const display = await nicknameInfo.evaluate(el => getComputedStyle(el).display)
        const position = await nicknameInfo.evaluate(el => getComputedStyle(el).position)
        console.log(
          `nicknameInfoItem - visibility: ${visibility}, display: ${display}, position: ${position}`
        )
      }

      // tab-wrapper 너비
      const tabWrapper = page.locator('.tab-wrapper')
      if ((await tabWrapper.count()) > 0) {
        const wrapperWidth = await tabWrapper.evaluate(el => el.offsetWidth)
        const display = await tabWrapper.evaluate(el => getComputedStyle(el).display)
        console.log(`tab-wrapper: ${wrapperWidth}px, display: ${display}`)
      }
    }
  })

  test('375px 모바일 - 닉네임 설정 후 두 버전 비교', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })

    const urls = [
      { name: 'localhost', url: '/seoulsurvival/?lang=ko' },
      { name: 'production', url: 'https://clicksurvivor.com/seoulsurvival/?lang=ko' },
    ]

    for (const { name, url } of urls) {
      console.log(`\n========== ${name.toUpperCase()} 375px ==========`)

      await page.goto(url)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)

      const workTabBefore = await page.locator('#workTab').evaluate(el => el.offsetWidth)
      console.log(`설정 전 workTab: ${workTabBefore}px`)

      // 닉네임 입력
      const nicknameInput = page
        .locator('input[placeholder*="닉네임"], input[placeholder*="Nickname"]')
        .first()
      if ((await nicknameInput.count()) > 0) {
        await nicknameInput.fill('테스트')
        await page.waitForTimeout(300)

        const confirmBtn = page.locator('button:has-text("확인"), button:has-text("Save")')
        if ((await confirmBtn.count()) > 0) {
          await confirmBtn.click()
          await page.waitForTimeout(1000)
        }
      }

      const workTabAfter = await page.locator('#workTab').evaluate(el => el.offsetWidth)
      console.log(`설정 후 workTab: ${workTabAfter}px`)

      // 스크린샷
      await page.screenshot({ path: `test-results/compare-${name}-375.png`, fullPage: false })

      // section.card 확인
      const card = await page.locator('#workTab section.card').evaluate(el => el.offsetWidth)
      console.log(`section.card: ${card}px`)

      // 결과
      if (workTabBefore === workTabAfter) {
        console.log(`✅ 안정적: 너비 변화 없음`)
      } else {
        console.log(
          `❌ 변화: ${workTabBefore}px → ${workTabAfter}px (차이: ${Math.abs(workTabAfter - workTabBefore)}px)`
        )
      }
    }
  })
})
