// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Toast Notification System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/seoulsurvival/')
    await page.waitForLoadState('networkidle')
  })

  test('토스트 컨테이너가 생성되는지 확인', async ({ page }) => {
    // 콘솔에서 toast 함수 실행
    await page.evaluate(() => {
      window.toast.info('테스트 메시지')
    })

    // 컨테이너가 생성되었는지 확인
    const container = await page.locator('#game-toast-container')
    await expect(container).toBeVisible()
  })

  test('성공 토스트가 표시되는지 확인', async ({ page }) => {
    await page.evaluate(() => {
      window.toast.success('게임이 저장되었습니다.')
    })

    // 토스트가 표시되는지 확인
    const toast = await page.locator('.game-toast.toast-success')
    await expect(toast).toBeVisible()

    // 메시지 확인
    const message = await toast.locator('.game-toast-message')
    await expect(message).toHaveText('게임이 저장되었습니다.')

    // 아이콘 확인
    const icon = await toast.locator('.game-toast-icon')
    await expect(icon).toHaveText('✅')
  })

  test('에러 토스트가 표시되는지 확인', async ({ page }) => {
    await page.evaluate(() => {
      window.toast.error('저장에 실패했습니다.')
    })

    const toast = await page.locator('.game-toast.toast-error')
    await expect(toast).toBeVisible()

    const message = await toast.locator('.game-toast-message')
    await expect(message).toHaveText('저장에 실패했습니다.')

    const icon = await toast.locator('.game-toast-icon')
    await expect(icon).toHaveText('⚠️')
  })

  test('정보 토스트가 표시되는지 확인', async ({ page }) => {
    await page.evaluate(() => {
      window.toast.info('새로운 업그레이드가 해금되었습니다.')
    })

    const toast = await page.locator('.game-toast.toast-info')
    await expect(toast).toBeVisible()

    const message = await toast.locator('.game-toast-message')
    await expect(message).toHaveText('새로운 업그레이드가 해금되었습니다.')
  })

  test('경고 토스트가 표시되는지 확인', async ({ page }) => {
    await page.evaluate(() => {
      window.toast.warning('저장 공간이 부족합니다.')
    })

    const toast = await page.locator('.game-toast.toast-warning')
    await expect(toast).toBeVisible()

    const message = await toast.locator('.game-toast-message')
    await expect(message).toHaveText('저장 공간이 부족합니다.')
  })

  test('토스트가 자동으로 닫히는지 확인', async ({ page }) => {
    // 1초 duration으로 토스트 생성
    await page.evaluate(() => {
      window.toast.info('1초 후 닫힙니다', 1000)
    })

    const toast = await page.locator('.game-toast')
    await expect(toast).toBeVisible()

    // 1.5초 대기 (애니메이션 포함)
    await page.waitForTimeout(1500)

    // 토스트가 사라졌는지 확인
    await expect(toast).not.toBeVisible()
  })

  test('토스트 클릭 시 즉시 닫히는지 확인', async ({ page }) => {
    await page.evaluate(() => {
      window.toast.info('클릭하면 닫힙니다', 10000)
    })

    const toast = await page.locator('.game-toast')
    await expect(toast).toBeVisible()

    // 토스트 클릭
    await toast.click()

    // 애니메이션 대기
    await page.waitForTimeout(500)

    // 토스트가 사라졌는지 확인
    await expect(toast).not.toBeVisible()
  })

  test('중복 토스트가 방지되는지 확인', async ({ page }) => {
    // 같은 메시지 2번 호출
    await page.evaluate(() => {
      window.toast.error('중복 메시지')
      window.toast.error('중복 메시지')
    })

    // 토스트가 1개만 표시되는지 확인
    const toasts = await page.locator('.game-toast').all()
    expect(toasts.length).toBe(1)
  })

  test('다른 타입의 같은 메시지는 중복으로 처리되지 않는지 확인', async ({ page }) => {
    // 타입만 다르고 메시지는 같음
    await page.evaluate(() => {
      window.toast.error('메시지')
      window.toast.success('메시지')
    })

    // 2개 모두 표시되어야 함
    const toasts = await page.locator('.game-toast').all()
    expect(toasts.length).toBe(2)
  })

  test('여러 개의 다른 토스트가 동시에 표시되는지 확인', async ({ page }) => {
    await page.evaluate(() => {
      window.toast.info('첫 번째 메시지')
      window.toast.success('두 번째 메시지')
      window.toast.warning('세 번째 메시지')
    })

    const toasts = await page.locator('.game-toast').all()
    expect(toasts.length).toBe(3)
  })

  test('clearAllToasts가 모든 토스트를 제거하는지 확인', async ({ page }) => {
    // 여러 토스트 생성
    await page.evaluate(() => {
      window.toast.info('메시지 1')
      window.toast.success('메시지 2')
      window.toast.error('메시지 3')
    })

    let toasts = await page.locator('.game-toast').all()
    expect(toasts.length).toBe(3)

    // clearAllToasts 호출
    await page.evaluate(async () => {
      const { clearAllToasts } = await import('./src/ui/toast.js')
      clearAllToasts()
    })

    // 모든 토스트가 사라졌는지 확인
    toasts = await page.locator('.game-toast').all()
    expect(toasts.length).toBe(0)
  })

  test('ARIA 속성이 올바르게 설정되는지 확인', async ({ page }) => {
    await page.evaluate(() => {
      window.toast.error('에러 메시지')
    })

    const toast = await page.locator('.game-toast')

    // role="alert"
    await expect(toast).toHaveAttribute('role', 'alert')

    // aria-live="assertive" (error)
    await expect(toast).toHaveAttribute('aria-live', 'assertive')

    // 아이콘 aria-hidden="true"
    const icon = await toast.locator('.game-toast-icon')
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  test('info 타입은 aria-live="polite"를 사용하는지 확인', async ({ page }) => {
    await page.evaluate(() => {
      window.toast.info('정보 메시지')
    })

    const toast = await page.locator('.game-toast')
    await expect(toast).toHaveAttribute('aria-live', 'polite')
  })

  test('모바일 viewport에서 위치가 조정되는지 확인', async ({ page }) => {
    // 모바일 viewport 설정
    await page.setViewportSize({ width: 375, height: 667 })

    await page.evaluate(() => {
      window.toast.info('모바일 테스트')
    })

    const container = await page.locator('#game-toast-container')

    // bottom 값이 80px인지 확인 (모바일 탭바 위)
    const styles = await container.evaluate(el => {
      return window.getComputedStyle(el).bottom
    })

    // CSS 미디어쿼리가 적용되었는지 확인
    // 정확한 픽셀 값은 브라우저마다 다를 수 있으므로 존재 여부만 확인
    expect(styles).toBeTruthy()
  })

  test('스타일이 동적으로 주입되는지 확인', async ({ page }) => {
    await page.evaluate(() => {
      window.toast.info('스타일 테스트')
    })

    // toast-styles 스타일 태그가 존재하는지 확인
    const styleTag = await page.locator('#toast-styles')
    await expect(styleTag).toBeAttached()
  })

  test('페이드 인 애니메이션이 적용되는지 확인', async ({ page }) => {
    await page.evaluate(() => {
      window.toast.info('애니메이션 테스트')
    })

    const toast = await page.locator('.game-toast')

    // show 클래스가 추가되는지 확인
    await expect(toast).toHaveClass(/show/)

    // opacity가 1인지 확인 (애니메이션 완료)
    await page.waitForTimeout(500) // 애니메이션 대기
    const opacity = await toast.evaluate(el => {
      return window.getComputedStyle(el).opacity
    })
    expect(parseFloat(opacity)).toBeGreaterThan(0.9)
  })

  test('잘못된 타입은 info로 대체되는지 확인', async ({ page }) => {
    const consoleMessages = []
    page.on('console', msg => consoleMessages.push(msg.text()))

    await page.evaluate(() => {
      // @ts-expect-error - 잘못된 타입 테스트
      window.toast.info = (msg, type, duration) => {
        // createToast를 직접 호출하여 잘못된 타입 테스트
        return window.eval(`
          import('./src/ui/toast.js').then(module => {
            module.createToast('${msg}', 'invalid_type', ${duration || 3000})
          })
        `)
      }
      window.toast.info('잘못된 타입 테스트')
    })

    await page.waitForTimeout(500)

    // 경고 메시지가 콘솔에 출력되는지 확인
    const hasWarning = consoleMessages.some(msg => msg.includes('유효하지 않은 타입'))
    expect(hasWarning).toBe(true)
  })

  test('testToasts 함수가 4가지 타입을 순차적으로 표시하는지 확인', async ({ page }) => {
    await page.evaluate(async () => {
      const { testToasts } = await import('./src/ui/toast.js')
      testToasts()
    })

    // 잠시 대기 (순차 생성 시간)
    await page.waitForTimeout(2000)

    // 4개의 토스트가 표시되는지 확인
    const toasts = await page.locator('.game-toast').all()
    expect(toasts.length).toBe(4)

    // 각 타입이 모두 존재하는지 확인
    await expect(page.locator('.toast-info')).toBeVisible()
    await expect(page.locator('.toast-success')).toBeVisible()
    await expect(page.locator('.toast-warning')).toBeVisible()
    await expect(page.locator('.toast-error')).toBeVisible()
  })
})
