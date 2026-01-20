/**
 * Seoul Survival - Achievements Data Tests
 *
 * 업적 데이터 정의 단위 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAchievements } from '../achievements.js'

describe('createAchievements', () => {
  let deps
  let achievements

  beforeEach(() => {
    deps = {
      getTotalClicks: vi.fn(() => 0),
      getDeposits: vi.fn(() => 0),
      getSavings: vi.fn(() => 0),
      getBonds: vi.fn(() => 0),
      getUsStocks: vi.fn(() => 0),
      getCryptos: vi.fn(() => 0),
      getVillas: vi.fn(() => 0),
      getOfficetels: vi.fn(() => 0),
      getApartments: vi.fn(() => 0),
      getShops: vi.fn(() => 0),
      getBuildings: vi.fn(() => 0),
      getTotalProperties: vi.fn(() => 0),
      getTotalAssets: vi.fn(() => 0),
      getCareerLevel: vi.fn(() => 0),
      getTowersLifetime: vi.fn(() => 0),
      UPGRADES: {},
      getFinancialCost: vi.fn((type, count) => 1000000 * (count + 1)),
    }
    achievements = createAchievements(deps)
  })

  it('업적 배열 반환', () => {
    expect(Array.isArray(achievements)).toBe(true)
    expect(achievements.length).toBeGreaterThan(0)
  })

  it('모든 업적에 필수 속성 존재', () => {
    achievements.forEach(achievement => {
      expect(achievement).toHaveProperty('id')
      expect(achievement).toHaveProperty('name')
      expect(achievement).toHaveProperty('desc')
      expect(achievement).toHaveProperty('icon')
      expect(achievement).toHaveProperty('condition')
      expect(achievement).toHaveProperty('unlocked')
      expect(typeof achievement.condition).toBe('function')
      expect(achievement.unlocked).toBe(false)
    })
  })

  describe('기본 업적', () => {
    it('first_click: 클릭 1회 이상', () => {
      const achievement = achievements.find(a => a.id === 'first_click')
      expect(achievement.condition()).toBe(false)

      deps.getTotalClicks = vi.fn(() => 1)
      achievements = createAchievements(deps)
      const updated = achievements.find(a => a.id === 'first_click')
      expect(updated.condition()).toBe(true)
    })

    it('first_deposit: 예금 1개 이상', () => {
      const achievement = achievements.find(a => a.id === 'first_deposit')
      expect(achievement.condition()).toBe(false)

      deps.getDeposits = vi.fn(() => 1)
      achievements = createAchievements(deps)
      const updated = achievements.find(a => a.id === 'first_deposit')
      expect(updated.condition()).toBe(true)
    })

    it('first_savings: 적금 1개 이상', () => {
      deps.getSavings = vi.fn(() => 1)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'first_savings')
      expect(achievement.condition()).toBe(true)
    })

    it('first_bond: 국내주식 1개 이상', () => {
      deps.getBonds = vi.fn(() => 1)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'first_bond')
      expect(achievement.condition()).toBe(true)
    })

    it('first_us_stock: 미국주식 1개 이상', () => {
      deps.getUsStocks = vi.fn(() => 1)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'first_us_stock')
      expect(achievement.condition()).toBe(true)
    })

    it('first_crypto: 코인 1개 이상', () => {
      deps.getCryptos = vi.fn(() => 1)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'first_crypto')
      expect(achievement.condition()).toBe(true)
    })

    it('first_property: 부동산 1개 이상 (빌라)', () => {
      deps.getVillas = vi.fn(() => 1)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'first_property')
      expect(achievement.condition()).toBe(true)
    })

    it('first_property: 부동산 1개 이상 (빌딩)', () => {
      deps.getBuildings = vi.fn(() => 1)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'first_property')
      expect(achievement.condition()).toBe(true)
    })

    it('first_upgrade: 업그레이드 구매', () => {
      deps.UPGRADES = { test: { purchased: true } }
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'first_upgrade')
      expect(achievement.condition()).toBe(true)
    })

    it('first_upgrade: 업그레이드 없음', () => {
      deps.UPGRADES = { test: { purchased: false } }
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'first_upgrade')
      expect(achievement.condition()).toBe(false)
    })
  })

  describe('전문가 업적', () => {
    it('financial_expert: 모든 금융상품 보유', () => {
      const achievement = achievements.find(a => a.id === 'financial_expert')
      expect(achievement.condition()).toBe(false)

      deps.getDeposits = vi.fn(() => 1)
      deps.getSavings = vi.fn(() => 1)
      deps.getBonds = vi.fn(() => 1)
      deps.getUsStocks = vi.fn(() => 1)
      deps.getCryptos = vi.fn(() => 1)
      achievements = createAchievements(deps)
      const updated = achievements.find(a => a.id === 'financial_expert')
      expect(updated.condition()).toBe(true)
    })

    it('property_collector: 부동산 5채', () => {
      deps.getTotalProperties = vi.fn(() => 5)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'property_collector')
      expect(achievement.condition()).toBe(true)
    })

    it('property_tycoon: 모든 부동산 종류 보유', () => {
      deps.getVillas = vi.fn(() => 1)
      deps.getOfficetels = vi.fn(() => 1)
      deps.getApartments = vi.fn(() => 1)
      deps.getShops = vi.fn(() => 1)
      deps.getBuildings = vi.fn(() => 1)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'property_tycoon')
      expect(achievement.condition()).toBe(true)
    })

    it('investment_guru: 모든 업그레이드 구매', () => {
      deps.UPGRADES = {
        upgrade1: { purchased: true },
        upgrade2: { purchased: true },
      }
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'investment_guru')
      expect(achievement.condition()).toBe(true)
    })

    it('investment_guru: 일부 업그레이드만 구매', () => {
      deps.UPGRADES = {
        upgrade1: { purchased: true },
        upgrade2: { purchased: false },
      }
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'investment_guru')
      expect(achievement.condition()).toBe(false)
    })

    it('gangnam_rich: 아파트 3채', () => {
      deps.getApartments = vi.fn(() => 3)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'gangnam_rich')
      expect(achievement.condition()).toBe(true)
    })

    it('global_investor: 해외 투자 1억원', () => {
      // 미국주식 50개 + 코인 50개 = 1억원
      deps.getUsStocks = vi.fn(() => 50)
      deps.getCryptos = vi.fn(() => 50)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'global_investor')
      expect(achievement.condition()).toBe(true)
    })

    it('crypto_expert: 코인 투자 5억원', () => {
      // 코인 10개의 누적 구매 가격이 5억원 이상이 되도록
      deps.getCryptos = vi.fn(() => 100)
      deps.getFinancialCost = vi.fn((type, count) => 5000000) // 각 500만원
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'crypto_expert')
      expect(achievement.condition()).toBe(true)
    })

    it('real_estate_agent: 부동산 20채', () => {
      deps.getTotalProperties = vi.fn(() => 20)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'real_estate_agent')
      expect(achievement.condition()).toBe(true)
    })
  })

  describe('자산 업적', () => {
    it('millionaire: 총 자산 1억원', () => {
      deps.getTotalAssets = vi.fn(() => 100000000)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'millionaire')
      expect(achievement.condition()).toBe(true)
    })

    it('ten_millionaire: 총 자산 10억원', () => {
      deps.getTotalAssets = vi.fn(() => 1000000000)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'ten_millionaire')
      expect(achievement.condition()).toBe(true)
    })

    it('hundred_millionaire: 총 자산 100억원', () => {
      deps.getTotalAssets = vi.fn(() => 10000000000)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'hundred_millionaire')
      expect(achievement.condition()).toBe(true)
    })

    it('billionaire: 총 자산 1000억원', () => {
      deps.getTotalAssets = vi.fn(() => 100000000000)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'billionaire')
      expect(achievement.condition()).toBe(true)
    })

    it('trillionaire: 총 자산 1조원', () => {
      deps.getTotalAssets = vi.fn(() => 1000000000000)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'trillionaire')
      expect(achievement.condition()).toBe(true)
    })

    it('global_rich: 총 자산 10조원', () => {
      deps.getTotalAssets = vi.fn(() => 10000000000000)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'global_rich')
      expect(achievement.condition()).toBe(true)
    })

    it('legendary_rich: 총 자산 100조원', () => {
      deps.getTotalAssets = vi.fn(() => 100000000000000)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'legendary_rich')
      expect(achievement.condition()).toBe(true)
    })

    it('god_rich: 총 자산 1000조원', () => {
      deps.getTotalAssets = vi.fn(() => 1000000000000000)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'god_rich')
      expect(achievement.condition()).toBe(true)
    })
  })

  describe('커리어 업적', () => {
    it('career_starter: 계약직 (레벨 1)', () => {
      deps.getCareerLevel = vi.fn(() => 1)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'career_starter')
      expect(achievement.condition()).toBe(true)
    })

    it('employee: 사원 (레벨 2)', () => {
      deps.getCareerLevel = vi.fn(() => 2)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'employee')
      expect(achievement.condition()).toBe(true)
    })

    it('deputy_director: 과장 (레벨 4)', () => {
      deps.getCareerLevel = vi.fn(() => 4)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'deputy_director')
      expect(achievement.condition()).toBe(true)
    })

    it('executive: 상무 (레벨 7)', () => {
      deps.getCareerLevel = vi.fn(() => 7)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'executive')
      expect(achievement.condition()).toBe(true)
    })

    it('ceo: CEO (레벨 9)', () => {
      deps.getCareerLevel = vi.fn(() => 9)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'ceo')
      expect(achievement.condition()).toBe(true)
    })

    it('chaebol_chairman: 자산 1조원', () => {
      deps.getTotalAssets = vi.fn(() => 1000000000000)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'chaebol_chairman')
      expect(achievement.condition()).toBe(true)
    })

    it('global_ceo: 해외 진출 (미국주식 10, 코인 10)', () => {
      deps.getUsStocks = vi.fn(() => 10)
      deps.getCryptos = vi.fn(() => 10)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'global_ceo')
      expect(achievement.condition()).toBe(true)
    })

    it('legendary_ceo: CEO + 10조원 + 타워 1개', () => {
      deps.getCareerLevel = vi.fn(() => 9)
      deps.getTotalAssets = vi.fn(() => 10000000000000)
      deps.getTowersLifetime = vi.fn(() => 1)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'legendary_ceo')
      expect(achievement.condition()).toBe(true)
    })

    it('legendary_ceo: 조건 미충족 (타워 없음)', () => {
      deps.getCareerLevel = vi.fn(() => 9)
      deps.getTotalAssets = vi.fn(() => 10000000000000)
      deps.getTowersLifetime = vi.fn(() => 0)
      achievements = createAchievements(deps)
      const achievement = achievements.find(a => a.id === 'legendary_ceo')
      expect(achievement.condition()).toBe(false)
    })
  })

  describe('업적 ID 고유성', () => {
    it('모든 업적 ID가 고유함', () => {
      const ids = achievements.map(a => a.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('업적 개수', () => {
    it('총 32개 업적 존재', () => {
      // 기본 8 + 전문가 8 + 자산 8 + 커리어 8 = 32
      expect(achievements.length).toBe(32)
    })
  })
})
