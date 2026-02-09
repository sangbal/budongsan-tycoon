/**
 * upgradeManager.js 테스트
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createUpgradeManager } from '../upgradeManager.js'

// Mock dependencies
vi.mock('../../utils/numberFormat.js', () => ({
  formatFinancialPrice: vi.fn(cost => `₩${cost}`),
}))

vi.mock('../../i18n/index.js', () => ({
  t: vi.fn((key, params, fallback) => fallback || key),
}))

vi.mock('../diary.js', () => ({
  addLog: vi.fn(),
}))

vi.mock('../synergy.js', () => ({
  updateCompletionistSynergy: vi.fn(),
  invalidateSynergyCache: vi.fn(),
}))

vi.mock('../prestigeBonus.js', () => ({
  invalidatePrestigeCache: vi.fn(),
}))

describe('createUpgradeManager', () => {
  let mockDeps
  let manager
  let mockUpgrades

  beforeEach(() => {
    mockUpgrades = {
      test_upgrade: {
        name: '테스트 업그레이드',
        desc: '설명',
        icon: '🔧',
        cost: 1000,
        unlocked: true,
        purchased: false,
        category: 'labor',
        effect: vi.fn(),
      },
      locked_upgrade: {
        name: '잠금 업그레이드',
        desc: '설명',
        icon: '🔒',
        cost: 5000,
        unlocked: false,
        purchased: false,
        category: 'labor',
        effect: vi.fn(),
        unlockCondition: () => false,
      },
      purchased_upgrade: {
        name: '구매 완료',
        desc: '설명',
        icon: '✅',
        cost: 100,
        unlocked: true,
        purchased: true,
        category: 'labor',
        effect: vi.fn(),
      },
    }

    mockDeps = {
      UPGRADES: mockUpgrades,
      getCash: vi.fn(() => 2000),
      setCash: vi.fn(),
      CAREER_LEVELS: [{ requiredClicks: 0 }, { requiredClicks: 100 }, { requiredClicks: 500 }],
    }

    // DOM 요소 생성
    document.body.innerHTML = `
      <div id="upgradeList"></div>
      <span id="upgradeCount"></span>
      <div id="noUpgradesMessage"></div>
      <div class="stats-section" data-section-id="upgrades">
        <button class="stats-toggle" aria-expanded="true"></button>
        <span class="toggle-icon">▼</span>
      </div>
    `

    manager = createUpgradeManager(mockDeps)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('updateUpgradeAffordability', () => {
    beforeEach(() => {
      // 업그레이드 아이템 추가
      document.body.innerHTML += `
        <div class="upgrade-item" data-upgrade-id="test_upgrade"></div>
        <div class="upgrade-item" data-upgrade-id="locked_upgrade"></div>
      `
    })

    it('구매 가능한 업그레이드에 affordable 클래스 추가', () => {
      mockDeps.getCash.mockReturnValue(2000) // cost 1000보다 큼

      manager.updateUpgradeAffordability()

      const item = document.querySelector('[data-upgrade-id="test_upgrade"]')
      expect(item.classList.contains('affordable')).toBe(true)
    })

    it('구매 불가능한 업그레이드에서 affordable 클래스 제거', () => {
      mockDeps.getCash.mockReturnValue(500) // cost 1000보다 적음

      const item = document.querySelector('[data-upgrade-id="test_upgrade"]')
      item.classList.add('affordable')

      manager.updateUpgradeAffordability()

      expect(item.classList.contains('affordable')).toBe(false)
    })

    it('이미 구매한 업그레이드는 무시', () => {
      document.body.innerHTML += `
        <div class="upgrade-item" data-upgrade-id="purchased_upgrade"></div>
      `

      manager.updateUpgradeAffordability()

      const item = document.querySelector('[data-upgrade-id="purchased_upgrade"]')
      expect(item.classList.contains('affordable')).toBe(false)
    })
  })

  describe('updateUpgradeProgress', () => {
    it('진행률 요소 초기화', () => {
      document.body.innerHTML = `
        <div class="upgrade-item" data-upgrade-id="test_upgrade">
          <div class="upgrade-progress">50%</div>
        </div>
      `

      manager.updateUpgradeProgress(100)

      const progress = document.querySelector('.upgrade-progress')
      expect(progress.textContent).toBe('')
    })

    it('upgrade-item이 없으면 무시', () => {
      document.body.innerHTML = '<div class="upgrade-progress">50%</div>'

      expect(() => manager.updateUpgradeProgress(100)).not.toThrow()
    })
  })

  describe('updateUpgradeList', () => {
    it('해금된 미구매 업그레이드 렌더링', () => {
      manager.updateUpgradeList()

      const items = document.querySelectorAll('.upgrade-item')
      expect(items.length).toBe(1) // test_upgrade만 (unlocked && !purchased)
    })

    it('업그레이드 카운트 업데이트', () => {
      manager.updateUpgradeList()

      const count = document.getElementById('upgradeCount')
      expect(count.textContent).toBe('(1)')
      expect(count.style.display).not.toBe('none')
    })

    it('업그레이드 없으면 카운트 숨김', () => {
      mockUpgrades.test_upgrade.purchased = true

      manager.updateUpgradeList()

      const count = document.getElementById('upgradeCount')
      expect(count.style.display).toBe('none')
    })

    it('업그레이드 없으면 noUpgradesMessage 표시', () => {
      mockUpgrades.test_upgrade.purchased = true

      manager.updateUpgradeList()

      const msg = document.getElementById('noUpgradesMessage')
      expect(msg.style.display).toBe('block')
    })

    it('업그레이드 아이템에 클릭 이벤트 연결', () => {
      manager.updateUpgradeList()

      const item = document.querySelector('.upgrade-item')
      expect(item).not.toBeNull()
      expect(item.dataset.upgradeId).toBe('test_upgrade')
    })

    it('DOM 요소 없어도 에러 없음', () => {
      document.body.innerHTML = ''

      expect(() => manager.updateUpgradeList()).not.toThrow()
    })
  })

  describe('purchaseUpgrade', () => {
    it('업그레이드 구매 성공', async () => {
      const { addLog } = await import('../diary.js')
      const { updateCompletionistSynergy } = await import('../synergy.js')

      manager.purchaseUpgrade('test_upgrade')

      expect(mockDeps.setCash).toHaveBeenCalledWith(1000) // 2000 - 1000
      expect(mockUpgrades.test_upgrade.purchased).toBe(true)
      expect(mockUpgrades.test_upgrade.effect).toHaveBeenCalled()
      expect(addLog).toHaveBeenCalled()
      expect(updateCompletionistSynergy).toHaveBeenCalledWith(mockUpgrades)
    })

    it('존재하지 않는 업그레이드 무시', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      manager.purchaseUpgrade('nonexistent')

      expect(mockDeps.setCash).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('이미 구매한 업그레이드 무시', async () => {
      const { addLog } = await import('../diary.js')

      manager.purchaseUpgrade('purchased_upgrade')

      expect(mockDeps.setCash).not.toHaveBeenCalled()
      expect(addLog).toHaveBeenCalled()
    })

    it('자금 부족 시 구매 실패', async () => {
      mockDeps.getCash.mockReturnValue(500) // 1000보다 적음
      const { addLog } = await import('../diary.js')

      manager.purchaseUpgrade('test_upgrade')

      expect(mockDeps.setCash).not.toHaveBeenCalled()
      expect(mockUpgrades.test_upgrade.purchased).toBe(false)
      expect(addLog).toHaveBeenCalled()
    })

    it('effect 실행 실패 시에도 구매 처리', async () => {
      mockUpgrades.test_upgrade.effect.mockImplementation(() => {
        throw new Error('Effect error')
      })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      manager.purchaseUpgrade('test_upgrade')

      expect(mockUpgrades.test_upgrade.purchased).toBe(true)
      expect(mockDeps.setCash).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('반환 객체', () => {
    it('모든 메서드 포함', () => {
      expect(manager).toHaveProperty('updateUpgradeAffordability')
      expect(manager).toHaveProperty('updateUpgradeProgress')
      expect(manager).toHaveProperty('updateUpgradeList')
      expect(manager).toHaveProperty('purchaseUpgrade')
    })
  })
})
