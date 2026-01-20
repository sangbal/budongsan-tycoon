// @ts-check
import { test, expect } from '@playwright/test'

test.describe('닉네임 입력 후 레이아웃 확인', () => {
  test('localhost 1920px - 닉네임 설정 전후 레이아웃', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/seoulsurvival/?lang=ko')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // 1. 닉네임 설정 전 스크린샷
    console.log('=== 1920px - 닉네임 설정 전 ===')
    await page.screenshot({ path: 'test-results/before-nickname-1920.png', fullPage: false })

    // 2. 각 탭의 너비 확인 (설정 전)
    const tabs = ['#workTab', '#shopTab', '#statsTab', '#rankingTab', '#settingsTab']
    console.log('닉네임 설정 전 탭 너비:')
    for (const tab of tabs) {
      const width = await page.locator(tab).evaluate(el => el.offsetWidth)
      console.log(`${tab} width: ${width}`)
    }

    // 3. 모달에서 닉네임 입력 (첫 로드 시 모달이 나타남)
    const nicknameInput = page
      .locator('input[placeholder*="닉네임"], input[placeholder*="Nickname"]')
      .first()
    if ((await nicknameInput.count()) > 0) {
      console.log('닉네임 입력 모달 발견 - 입력 시작')
      await nicknameInput.fill('테스트닉네임')
      await page.waitForTimeout(300)

      // 확인 버튼 클릭
      const confirmBtn = page.locator('button:has-text("확인"), button:has-text("Save")')
      if ((await confirmBtn.count()) > 0) {
        await confirmBtn.click()
        await page.waitForTimeout(1000)
      }
    }

    // 4. 닉네임 설정 후 스크린샷
    console.log('=== 1920px - 닉네임 설정 후 ===')
    await page.screenshot({ path: 'test-results/after-nickname-1920.png', fullPage: false })

    // 5. 각 탭의 너비 확인 (설정 후)
    console.log('닉네임 설정 후 탭 너비:')
    for (const tab of tabs) {
      const width = await page.locator(tab).evaluate(el => el.offsetWidth)
      console.log(`${tab} width: ${width}`)
    }

    // 6. tab-wrapper의 display 확인
    const tabWrapper = page.locator('.tab-wrapper')
    const display = await tabWrapper.evaluate(el => getComputedStyle(el).display)
    console.log('tab-wrapper display:', display)
  })

  test('localhost 375px - 모바일 닉네임 설정 전후 레이아웃', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/seoulsurvival/?lang=ko')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // 1. 닉네임 설정 전 스크린샷
    console.log('=== 375px - 닉네임 설정 전 ===')
    await page.screenshot({ path: 'test-results/mobile-before-nickname-375.png', fullPage: false })

    const workTabBefore = await page.locator('#workTab').evaluate(el => el.offsetWidth)
    console.log('닉네임 설정 전 workTab width:', workTabBefore)

    // 2. 모달에서 닉네임 입력
    const nicknameInput = page
      .locator('input[placeholder*="닉네임"], input[placeholder*="Nickname"]')
      .first()
    if ((await nicknameInput.count()) > 0) {
      console.log('닉네임 입력 모달 발견 - 입력 시작')
      await nicknameInput.fill('테스트')
      await page.waitForTimeout(300)

      // 확인 버튼 클릭
      const confirmBtn = page.locator('button:has-text("확인"), button:has-text("Save")')
      if ((await confirmBtn.count()) > 0) {
        await confirmBtn.click()
        await page.waitForTimeout(1000)
      }
    }

    // 3. 닉네임 설정 후 스크린샷
    console.log('=== 375px - 닉네임 설정 후 ===')
    await page.screenshot({ path: 'test-results/mobile-after-nickname-375.png', fullPage: false })

    const workTabAfter = await page.locator('#workTab').evaluate(el => el.offsetWidth)
    console.log('닉네임 설정 후 workTab width:', workTabAfter)

    // 4. section.card 너비 확인
    const card = await page.locator('#workTab section.card').evaluate(el => el.offsetWidth)
    console.log('모바일 section.card width:', card)

    // 5. 결과 비교
    console.log(`\n=== 결과 비교 ===`)
    console.log(`닉네임 설정 전=${workTabBefore}, 설정 후=${workTabAfter}`)
    if (workTabBefore === workTabAfter) {
      console.log('✅ 레이아웃 안정성: 너비 변화 없음')
    } else {
      console.log(
        `❌ 레이아웃 변화: ${workTabBefore}px → ${workTabAfter}px (차이: ${Math.abs(workTabAfter - workTabBefore)}px)`
      )
    }
  })
})
