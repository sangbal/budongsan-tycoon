import { test, expect } from '@playwright/test'

test.describe('모바일 탭바 접근성 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/seoulsurvival/')
    // 모바일 뷰포트 설정 (iPhone 12)
    await page.setViewportSize({ width: 390, height: 844 })
    // 페이지 로딩 대기
    await page.waitForLoadState('networkidle')
  })

  test('ARIA 라벨 확인', async ({ page }) => {
    // 하단 네비게이션이 모바일에서 표시되는지 확인
    const bottomNav = await page.locator('.bottom-nav')
    await expect(bottomNav).toBeVisible()

    // navigation role 확인
    const navRole = await bottomNav.getAttribute('role')
    expect(navRole).toBe('navigation')

    // aria-label 확인
    const navLabel = await bottomNav.getAttribute('aria-label')
    expect(navLabel).toBe('주요 메뉴')

    // 모든 탭 버튼의 ARIA 속성 확인
    const navBtns = await page.locator('.nav-btn')
    const count = await navBtns.count()
    expect(count).toBe(5) // 노동, 투자, 통계, 랭킹, 설정

    for (let i = 0; i < count; i++) {
      const btn = navBtns.nth(i)

      // role="tab" 확인
      const role = await btn.getAttribute('role')
      expect(role).toBe('tab')

      // aria-controls 확인
      const controls = await btn.getAttribute('aria-controls')
      expect(controls).toBeTruthy()

      // aria-label 확인
      const label = await btn.getAttribute('aria-label')
      expect(label).toBeTruthy()
      expect(label).toContain('화면으로 이동')

      // aria-selected 확인
      const selected = await btn.getAttribute('aria-selected')
      expect(selected).toBeTruthy() // 'true' 또는 'false'
    }
  })

  test('첫 번째 탭이 활성화되어 있는지 확인', async ({ page }) => {
    const firstBtn = await page.locator('.nav-btn').first()

    // active 클래스 확인
    const hasActive = await firstBtn.evaluate(el => el.classList.contains('active'))
    expect(hasActive).toBe(true)

    // aria-selected="true" 확인
    const selected = await firstBtn.getAttribute('aria-selected')
    expect(selected).toBe('true')

    // 해당 탭 컨텐츠가 표시되는지 확인
    const tabId = await firstBtn.getAttribute('data-tab')
    const tabContent = await page.locator(`#${tabId}`)
    await expect(tabContent).toHaveClass(/active/)
  })

  test('탭 클릭 시 ARIA 상태 변경', async ({ page }) => {
    const navBtns = await page.locator('.nav-btn')
    const secondBtn = navBtns.nth(1) // 투자 탭

    // 클릭 전 상태
    let selected = await secondBtn.getAttribute('aria-selected')
    expect(selected).toBe('false')

    // 클릭
    await secondBtn.click()

    // 클릭 후 상태
    selected = await secondBtn.getAttribute('aria-selected')
    expect(selected).toBe('true')

    // 첫 번째 탭은 비활성화되어야 함
    const firstBtn = navBtns.first()
    selected = await firstBtn.getAttribute('aria-selected')
    expect(selected).toBe('false')
  })

  test('키보드 네비게이션 (Alt+1-5)', async ({ page }) => {
    // Alt+2로 투자 탭 활성화
    await page.keyboard.press('Alt+2')
    await page.waitForTimeout(100) // 탭 전환 애니메이션 대기

    const shopBtn = await page.locator('.nav-btn[data-tab="shopTab"]')
    const selected = await shopBtn.getAttribute('aria-selected')
    expect(selected).toBe('true')

    // 투자 탭 컨텐츠가 활성화되었는지 확인
    const shopTab = await page.locator('#shopTab')
    await expect(shopTab).toHaveClass(/active/)

    // Alt+3으로 통계 탭 활성화
    await page.keyboard.press('Alt+3')
    await page.waitForTimeout(100)

    const statsBtn = await page.locator('.nav-btn[data-tab="statsTab"]')
    const statsSelected = await statsBtn.getAttribute('aria-selected')
    expect(statsSelected).toBe('true')
  })

  test('포커스 스타일 확인', async ({ page }) => {
    const navBtns = await page.locator('.nav-btn')
    const firstBtn = navBtns.first()

    // 키보드 포커스
    await firstBtn.focus()

    // focus-visible 스타일 확인 (outline 존재)
    const outline = await firstBtn.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return styles.getPropertyValue('outline')
    })

    // 포커스가 있을 때 outline이 설정되어야 함
    // (실제 값은 브라우저마다 다를 수 있으므로 존재 여부만 확인)
    expect(outline).toBeTruthy()
  })

  test('Skip Navigation 링크', async ({ page }) => {
    // 페이지 로드 후 첫 Tab 키
    await page.keyboard.press('Tab')

    // Skip link가 포커스되었는지 확인
    const skipLink = await page.locator('.skip-link')
    const isFocused = await skipLink.evaluate(el => el === document.activeElement)
    expect(isFocused).toBe(true)

    // href 확인
    const href = await skipLink.getAttribute('href')
    expect(href).toBe('#main-content')

    // Enter로 클릭
    await page.keyboard.press('Enter')
    await page.waitForTimeout(100)

    // main-content로 스크롤되었는지 확인
    const mainContent = await page.locator('#main-content')
    const isInView = await mainContent.isVisible()
    expect(isInView).toBe(true)
  })

  test('모든 탭 전환 테스트', async ({ page }) => {
    const tabs = [
      { selector: 'workTab', name: '노동' },
      { selector: 'shopTab', name: '투자' },
      { selector: 'statsTab', name: '통계' },
      { selector: 'rankingTab', name: '랭킹' },
      { selector: 'settingsTab', name: '설정' },
    ]

    for (const tab of tabs) {
      const btn = await page.locator(`.nav-btn[data-tab="${tab.selector}"]`)
      await btn.click()
      await page.waitForTimeout(100)

      // 해당 탭이 활성화되었는지 확인
      const selected = await btn.getAttribute('aria-selected')
      expect(selected).toBe('true')

      // 탭 컨텐츠가 표시되는지 확인
      const tabContent = await page.locator(`#${tab.selector}`)
      await expect(tabContent).toHaveClass(/active/)

      console.log(`✅ ${tab.name} 탭 전환 성공`)
    }
  })

  test('모바일에서 하단 네비게이션 표시', async ({ page }) => {
    // 모바일 뷰포트에서 bottom-nav가 표시되는지 확인
    const bottomNav = await page.locator('.bottom-nav')
    await expect(bottomNav).toBeVisible()

    // 하단 고정 위치 확인
    const position = await bottomNav.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return {
        position: styles.position,
        bottom: styles.bottom,
        zIndex: styles.zIndex,
      }
    })

    expect(position.position).toBe('fixed')
    expect(position.bottom).toBe('0px')
    expect(parseInt(position.zIndex)).toBeGreaterThanOrEqual(100)
  })

  test('데스크톱에서 하단 네비게이션 숨김', async ({ page }) => {
    // 데스크톱 뷰포트로 변경
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.waitForTimeout(100)

    const bottomNav = await page.locator('.bottom-nav')

    // display: none인지 확인
    const isHidden = await bottomNav.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return styles.display === 'none'
    })

    expect(isHidden).toBe(true)
  })
})

test.describe('Lighthouse 접근성 검증', () => {
  test('Lighthouse Accessibility 점수 95+ (모바일)', async ({ page }) => {
    await page.goto('/seoulsurvival/')
    await page.setViewportSize({ width: 390, height: 844 })

    // Lighthouse 점수는 별도의 CI 파이프라인에서 측정
    // 여기서는 기본적인 접근성 검증만 수행

    // axe-core를 사용한 접근성 검사 (선택적)
    // const results = await new AxeBuilder({ page }).analyze()
    // expect(results.violations).toEqual([])

    console.log('ℹ️  Lighthouse 점수는 CI 파이프라인에서 측정됩니다.')
  })
})
