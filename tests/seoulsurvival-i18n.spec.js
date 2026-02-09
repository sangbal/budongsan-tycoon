import { test, expect } from '@playwright/test'

const SAVE_KEY = 'seoulTycoonSaveV1'

// 테스트 타임아웃 증가
test.setTimeout(60000)

/**
 * 모달이 있으면 닉네임을 설정하고 닫는 헬퍼 함수
 * @param {import('@playwright/test').Page} page
 */
async function dismissModal(page) {
  // 모달이 나타날 시간 대기
  await page.waitForTimeout(500)

  // 닉네임 입력 모달이 있으면 닉네임 설정
  const nicknameInput = page.locator('input[type="text"]')
  if (await nicknameInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await nicknameInput.fill('테스트')
    const confirmBtn = page.locator('button:has-text("확인")')
    if (await confirmBtn.isVisible({ timeout: 500 }).catch(() => false)) {
      await confirmBtn.click()
      await page.waitForTimeout(300)
    }
  }

  // 그래도 모달이 남아있으면 강제 제거
  await page.evaluate(() => {
    const modalRoot = document.getElementById('gameModalRoot')
    if (modalRoot) {
      modalRoot.remove()
    }
    const overlay = document.querySelector('.game-modal-overlay')
    if (overlay) {
      overlay.remove()
    }
  })

  await page.waitForTimeout(200)
}

/**
 * 페이지 reload 후 모달 닫기까지 완료하는 헬퍼
 * @param {import('@playwright/test').Page} page
 */
async function reloadAndDismissModal(page) {
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForSelector('#workBtn', { state: 'visible', timeout: 15000 })
  await dismissModal(page)
}

test.describe('SeoulSurvival - i18n 언어 전환', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지 클리어 (깨끗한 시작)
    await page.goto('/seoulsurvival/', { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.evaluate(() => {
      localStorage.clear()
      localStorage.removeItem('clicksurvivor-auth')
      localStorage.removeItem('seoulsurvival_cloud_save_timestamp')
    })
    await reloadAndDismissModal(page)
    await page.waitForTimeout(300) // 초기화 완료 대기
  })

  test('1. 언어 선택기 초기 상태 확인', async ({ page }) => {
    // 설정 버튼 클릭하여 설정 모달 열기
    const settingsBtn = page.locator('#settingsBtn')
    await settingsBtn.click()
    await page.waitForTimeout(1000)

    // 언어 선택기 가시성 확인
    const languageSelect = page.locator('#languageSelect')
    await expect(languageSelect).toBeVisible()

    // 현재 값이 'ko' 또는 'en'인지 확인
    const currentLang = await languageSelect.inputValue()
    expect(['ko', 'en']).toContain(currentLang)
  })

  test('2. 한국어 → 영어 전환', async ({ page }) => {
    // 설정 모달 열기
    const settingsBtn = page.locator('#settingsBtn')
    await settingsBtn.click()
    await page.waitForTimeout(1000)

    // 언어를 영어로 변경
    const languageSelect = page.locator('#languageSelect')
    await languageSelect.selectOption('en')
    await page.waitForTimeout(1500) // i18n 적용 대기

    // 설정 모달 닫기
    const settingsModalCloseBtn = page.locator('#settingsModalCloseBtn')
    if (await settingsModalCloseBtn.isVisible().catch(() => false)) {
      await settingsModalCloseBtn.click()
      await page.waitForTimeout(500)
    }

    // 주요 텍스트가 영어로 변경되었는지 확인
    // 1. 탭 라벨 확인 (하단 네비게이션)
    const laborTab = page.locator('.bottom-nav button[data-tab="workTab"] span')
    await expect(laborTab).toHaveText('Labor')

    const investmentTab = page.locator('.bottom-nav button[data-tab="shopTab"] span')
    await expect(investmentTab).toHaveText('Investment')

    const statsTab = page.locator('.bottom-nav button[data-tab="statsTab"] span')
    await expect(statsTab).toHaveText('Stats')

    // 2. 노동 버튼 내 span 텍스트 확인 (data-i18n="work.button")
    const workBtnSpan = page.locator('#workBtn span[data-i18n="work.button"]')
    await expect(workBtnSpan).toHaveText('🛠️ Work')

    // 3. data-i18n 속성을 가진 요소들이 번역되었는지 검증
    const gameTitle = page.locator('[data-i18n="game.name"]')
    await expect(gameTitle).toHaveText('Seoul Survival')
  })

  test('3. 영어 → 한국어 전환', async ({ page }) => {
    // 먼저 영어로 설정
    const settingsBtn = page.locator('#settingsBtn')
    await settingsBtn.click()
    await page.waitForTimeout(1000)

    const languageSelect = page.locator('#languageSelect')
    await languageSelect.selectOption('en')
    await page.waitForTimeout(1500)

    // 다시 한국어로 변경
    await languageSelect.selectOption('ko')
    await page.waitForTimeout(1500)

    // 설정 모달 닫기
    const settingsModalCloseBtn = page.locator('#settingsModalCloseBtn')
    if (await settingsModalCloseBtn.isVisible().catch(() => false)) {
      await settingsModalCloseBtn.click()
      await page.waitForTimeout(500)
    }

    // 한국어로 복구되었는지 확인
    const laborTab = page.locator('.bottom-nav button[data-tab="workTab"] span')
    await expect(laborTab).toHaveText('노동')

    const investmentTab = page.locator('.bottom-nav button[data-tab="shopTab"] span')
    await expect(investmentTab).toHaveText('투자')

    const statsTab = page.locator('.bottom-nav button[data-tab="statsTab"] span')
    await expect(statsTab).toHaveText('통계')

    const gameTitle = page.locator('[data-i18n="game.name"]')
    await expect(gameTitle).toHaveText('서울 생존기')
  })

  test('4. 주요 탭 라벨 번역', async ({ page }) => {
    // 설정 모달 열기
    const settingsBtn = page.locator('#settingsBtn')
    await settingsBtn.click()
    await page.waitForTimeout(1000)

    // 영어로 변경
    const languageSelect = page.locator('#languageSelect')
    await languageSelect.selectOption('en')
    await page.waitForTimeout(1500)

    // 설정 모달 닫기
    const settingsModalCloseBtn = page.locator('#settingsModalCloseBtn')
    if (await settingsModalCloseBtn.isVisible().catch(() => false)) {
      await settingsModalCloseBtn.click()
      await page.waitForTimeout(500)
    }

    // 모든 탭 라벨 확인
    const tabs = [
      { selector: 'button[data-tab="workTab"] span', koText: '노동', enText: 'Labor' },
      { selector: 'button[data-tab="shopTab"] span', koText: '투자', enText: 'Investment' },
      { selector: 'button[data-tab="statsTab"] span', koText: '통계', enText: 'Stats' },
      { selector: 'button[data-tab="rankingTab"] span', koText: '랭킹', enText: 'Ranking' },
    ]

    for (const tab of tabs) {
      const tabElement = page.locator(`.bottom-nav ${tab.selector}`)
      await expect(tabElement).toHaveText(tab.enText)
    }

    // 한국어로 다시 변경
    await settingsBtn.click()
    await page.waitForTimeout(1000)
    await languageSelect.selectOption('ko')
    await page.waitForTimeout(1500)

    if (await settingsModalCloseBtn.isVisible().catch(() => false)) {
      await settingsModalCloseBtn.click()
      await page.waitForTimeout(500)
    }

    // 한국어 확인
    for (const tab of tabs) {
      const tabElement = page.locator(`.bottom-nav ${tab.selector}`)
      await expect(tabElement).toHaveText(tab.koText)
    }
  })

  test('5. 동적 UI 업데이트 (직급 이름)', async ({ page }) => {
    // 초기 직급 확인 (현재 언어로 설정된 상태)
    const careerBadge = page.locator('#currentCareer')

    // 먼저 한국어로 확실히 설정
    const settingsBtn = page.locator('#settingsBtn')
    await settingsBtn.click()
    await page.waitForTimeout(1000)

    const languageSelect = page.locator('#languageSelect')
    await languageSelect.selectOption('ko')
    await page.waitForTimeout(1500)

    const settingsModalCloseBtn = page.locator('#settingsModalCloseBtn')
    if (await settingsModalCloseBtn.isVisible().catch(() => false)) {
      await settingsModalCloseBtn.click()
      await page.waitForTimeout(500)
    }

    // 한국어 확인
    const initialCareer = await careerBadge.textContent()
    expect(initialCareer).toBe('알바')

    // 영어로 변경
    await settingsBtn.click()
    await page.waitForTimeout(1000)
    await languageSelect.selectOption('en')
    await page.waitForTimeout(1500)

    if (await settingsModalCloseBtn.isVisible().catch(() => false)) {
      await settingsModalCloseBtn.click()
      await page.waitForTimeout(500)
    }

    // 직급 이름이 영어로 변경되었는지 확인
    const updatedCareer = await careerBadge.textContent()
    expect(updatedCareer).toBe('Part-time')

    // 한국어로 복구
    await settingsBtn.click()
    await page.waitForTimeout(1000)
    await languageSelect.selectOption('ko')
    await page.waitForTimeout(1500)

    if (await settingsModalCloseBtn.isVisible().catch(() => false)) {
      await settingsModalCloseBtn.click()
      await page.waitForTimeout(500)
    }

    // 다시 한국어로 복구되었는지 확인
    const restoredCareer = await careerBadge.textContent()
    expect(restoredCareer).toBe('알바')
  })

  test('6. 페이지 새로고침 후 언어 유지', async ({ page }) => {
    // 영어로 설정
    const settingsBtn = page.locator('#settingsBtn')
    await settingsBtn.click()
    await page.waitForTimeout(1000)

    const languageSelect = page.locator('#languageSelect')
    await languageSelect.selectOption('en')
    await page.waitForTimeout(1500)

    // 설정 모달 닫기
    const settingsModalCloseBtn = page.locator('#settingsModalCloseBtn')
    if (await settingsModalCloseBtn.isVisible().catch(() => false)) {
      await settingsModalCloseBtn.click()
      await page.waitForTimeout(500)
    }

    // localStorage 확인
    const langInStorage = await page.evaluate(() => {
      return localStorage.getItem('clicksurvivor_lang')
    })
    expect(langInStorage).toBe('en')

    // 페이지 새로고침
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForSelector('#workBtn', { state: 'visible', timeout: 15000 })
    await dismissModal(page)
    await page.waitForTimeout(1500) // i18n 로딩 대기

    // 언어가 유지되었는지 확인
    const laborTab = page.locator('.bottom-nav button[data-tab="workTab"] span')
    await expect(laborTab).toHaveText('Labor')

    const gameTitle = page.locator('[data-i18n="game.name"]')
    await expect(gameTitle).toHaveText('Seoul Survival')

    // 설정 모달에서도 확인
    await settingsBtn.click()
    await page.waitForTimeout(1000)
    const languageSelectAfterReload = page.locator('#languageSelect')
    const currentLang = await languageSelectAfterReload.inputValue()
    expect(currentLang).toBe('en')
  })
})
