/**
 * Seoul Survival - Market System Tests
 *
 * 시장 이벤트 시스템 단위 테스트
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import { createMarketSystem } from '../market.js'
import { ensureTranslationLoaded } from '../../i18n/index.js'

// 테스트 시작 전 번역 파일 로드
beforeAll(async () => {
  await ensureTranslationLoaded('en')
})

// 테스트용 시장 이벤트 목록
const mockMarketEvents = [
  {
    id: 'bull_market',
    name: '강세장',
    durationMs: 30_000,
    effects: {
      financial: {
        deposit: 1.5,
        savings: 1.5,
        bond: 1.2,
        usStock: 2.0,
        crypto: 2.5,
      },
      property: {
        villa: 1.2,
        officetel: 1.3,
        apartment: 1.4,
        shop: 1.5,
        building: 1.6,
      },
    },
  },
  {
    id: 'bear_market',
    name: '약세장',
    durationMs: 60_000,
    effects: {
      financial: {
        deposit: 0.8,
        savings: 0.7,
        bond: 0.6,
        usStock: 0.5,
        crypto: 0.3,
      },
      property: {
        villa: 0.9,
        officetel: 0.85,
        apartment: 0.8,
        shop: 0.75,
        building: 0.7,
      },
    },
  },
  {
    id: 'crypto_boom',
    name: '코인 열풍',
    duration: 45_000, // durationMs 대신 duration 사용
    effects: {
      financial: {
        crypto: 5.0,
      },
    },
  },
]

describe('createMarketSystem', () => {
  let currentEvent = null
  let eventEndTime = 0
  let marketMultiplier = 1
  let logs = []
  let notifications = []
  let dirtyCount = 0

  const createDeps = (nowFn = () => Date.now()) => ({
    getCurrentEvent: () => currentEvent,
    setCurrentEvent: ev => {
      currentEvent = ev
    },
    getEventEndTime: () => eventEndTime,
    setEventEndTime: t => {
      eventEndTime = t
    },
    setMarketMultiplier: m => {
      marketMultiplier = m
    },
    addLog: msg => logs.push(msg),
    notify: ev => notifications.push(ev),
    markDirty: () => dirtyCount++,
    now: nowFn,
  })

  beforeEach(() => {
    currentEvent = null
    eventEndTime = 0
    marketMultiplier = 1
    logs = []
    notifications = []
    dirtyCount = 0
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getMarketEventMultiplier', () => {
    it('이벤트 없으면 기본 배수 1.0 반환', () => {
      const system = createMarketSystem(mockMarketEvents, createDeps())
      const mult = system.getMarketEventMultiplier('deposit', 'financial')
      expect(mult).toBe(1.0)
    })

    it('이벤트 있을 때 해당 타입의 배수 반환', () => {
      currentEvent = mockMarketEvents[0] // 강세장
      const system = createMarketSystem(mockMarketEvents, createDeps())

      expect(system.getMarketEventMultiplier('deposit', 'financial')).toBe(1.5)
      expect(system.getMarketEventMultiplier('usStock', 'financial')).toBe(2.0)
      expect(system.getMarketEventMultiplier('crypto', 'financial')).toBe(2.5)
    })

    it('부동산 카테고리 배수 반환', () => {
      currentEvent = mockMarketEvents[0] // 강세장
      const system = createMarketSystem(mockMarketEvents, createDeps())

      expect(system.getMarketEventMultiplier('villa', 'property')).toBe(1.2)
      expect(system.getMarketEventMultiplier('building', 'property')).toBe(1.6)
    })

    it('약세장 이벤트 배수 반환', () => {
      currentEvent = mockMarketEvents[1] // 약세장
      const system = createMarketSystem(mockMarketEvents, createDeps())

      expect(system.getMarketEventMultiplier('crypto', 'financial')).toBe(0.3)
      expect(system.getMarketEventMultiplier('villa', 'property')).toBe(0.9)
    })

    it('정의되지 않은 타입은 기본 배수 1.0 반환', () => {
      currentEvent = mockMarketEvents[2] // 코인 열풍 (crypto만 정의)
      const system = createMarketSystem(mockMarketEvents, createDeps())

      expect(system.getMarketEventMultiplier('crypto', 'financial')).toBe(5.0)
      expect(system.getMarketEventMultiplier('deposit', 'financial')).toBe(1.0) // 미정의
      expect(system.getMarketEventMultiplier('villa', 'property')).toBe(1.0) // property 카테고리 없음
    })

    it('이벤트의 effects가 없으면 기본 배수 반환', () => {
      currentEvent = { id: 'empty_event', name: 'Empty' }
      const system = createMarketSystem(mockMarketEvents, createDeps())

      expect(system.getMarketEventMultiplier('deposit', 'financial')).toBe(1.0)
    })
  })

  describe('checkMarketEvent', () => {
    it('이벤트 종료 시간 미도달 시 이벤트 유지', () => {
      currentEvent = mockMarketEvents[0]
      eventEndTime = 100_000 // 미래 시간

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 50_000)
      )
      system.checkMarketEvent()

      expect(currentEvent).not.toBeNull()
      expect(eventEndTime).toBe(100_000)
    })

    it('이벤트 종료 시간 도달 시 이벤트 종료', () => {
      currentEvent = mockMarketEvents[0]
      eventEndTime = 100_000

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 100_000)
      )
      system.checkMarketEvent()

      expect(currentEvent).toBeNull()
      expect(eventEndTime).toBe(0)
      expect(marketMultiplier).toBe(1)
    })

    it('이벤트 종료 시간 초과 시 이벤트 종료', () => {
      currentEvent = mockMarketEvents[0]
      eventEndTime = 100_000

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 150_000)
      )
      system.checkMarketEvent()

      expect(currentEvent).toBeNull()
      expect(eventEndTime).toBe(0)
    })

    it('이벤트 종료 시 로그 추가', () => {
      currentEvent = mockMarketEvents[0]
      eventEndTime = 100_000

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 100_000)
      )
      system.checkMarketEvent()

      // t('msg.eventEnded') 번역 결과 검증
      expect(logs.length).toBe(1)
      expect(logs[0]).toContain('Market event ended')
    })

    it('이벤트 종료 시 markDirty 호출', () => {
      currentEvent = mockMarketEvents[0]
      eventEndTime = 100_000

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 100_000)
      )
      system.checkMarketEvent()

      expect(dirtyCount).toBe(1)
    })

    it('이벤트 없으면 아무 동작 안 함', () => {
      currentEvent = null
      eventEndTime = 0

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 100_000)
      )
      system.checkMarketEvent()

      expect(logs).toHaveLength(0)
      expect(dirtyCount).toBe(0)
    })
  })

  describe('startMarketEvent', () => {
    it('이벤트 목록에서 랜덤 이벤트 선택', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0) // 첫 번째 이벤트 선택

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 1000)
      )
      system.startMarketEvent()

      expect(currentEvent).toBe(mockMarketEvents[0])
    })

    it('이벤트 종료 시간 설정 (durationMs 사용)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0) // 강세장 (30초)

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 1000)
      )
      system.startMarketEvent()

      expect(eventEndTime).toBe(1000 + 30_000)
    })

    it('이벤트 종료 시간 설정 (duration fallback)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.67) // 세 번째 이벤트 (코인 열풍, duration 사용)

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 1000)
      )
      system.startMarketEvent()

      expect(eventEndTime).toBe(1000 + 45_000)
    })

    it('notify 호출', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 1000)
      )
      system.startMarketEvent()

      expect(notifications).toHaveLength(1)
      expect(notifications[0]).toBe(mockMarketEvents[0])
    })

    it('로그 추가', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 1000)
      )
      system.startMarketEvent()

      expect(logs).toHaveLength(1)
      // t('msg.eventStarted', { name: ..., duration: ... }) 번역 결과 검증
      expect(logs[0]).toContain('event started')
      expect(logs[0]).toContain('강세장')
    })

    it('marketMultiplier는 1로 설정 (개별 배수 사용)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 1000)
      )
      system.startMarketEvent()

      expect(marketMultiplier).toBe(1)
    })

    it('markDirty 호출', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 1000)
      )
      system.startMarketEvent()

      expect(dirtyCount).toBe(1)
    })

    it('이벤트 목록 비어있으면 아무 동작 안 함', () => {
      const system = createMarketSystem(
        [],
        createDeps(() => 1000)
      )
      system.startMarketEvent()

      expect(currentEvent).toBeNull()
      expect(logs).toHaveLength(0)
    })

    it('이벤트 목록 undefined면 아무 동작 안 함', () => {
      const system = createMarketSystem(
        undefined,
        createDeps(() => 1000)
      )
      system.startMarketEvent()

      expect(currentEvent).toBeNull()
      expect(logs).toHaveLength(0)
    })
  })

  describe('scheduleNextMarketEvent', () => {
    it('2~5분 후 이벤트 예약', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5) // 중간값 선택

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 1000)
      )
      system.scheduleNextMarketEvent()

      // 0.5 * 180_000 + 120_000 = 210_000ms (3분 30초)
      expect(vi.getTimerCount()).toBe(1)
    })

    it('이벤트 없을 때만 새 이벤트 시작', () => {
      eventEndTime = 0 // 진행 중인 이벤트 없음
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 1000)
      )
      system.scheduleNextMarketEvent()

      // 타이머 실행
      vi.advanceTimersByTime(120_000) // 최소 2분

      expect(currentEvent).not.toBeNull()
    })

    it('이벤트 진행 중이면 새 이벤트 시작 안 함', () => {
      eventEndTime = 999_999 // 진행 중인 이벤트 있음
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 1000)
      )
      system.scheduleNextMarketEvent()

      vi.advanceTimersByTime(120_000)

      // currentEvent는 이미 있던 것이 유지됨
      expect(notifications).toHaveLength(0)
    })

    it('재귀적으로 다음 이벤트 예약', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const system = createMarketSystem(
        mockMarketEvents,
        createDeps(() => 1000)
      )
      system.scheduleNextMarketEvent()

      // 첫 번째 타이머 실행
      vi.advanceTimersByTime(120_000)

      // 두 번째 타이머도 예약되어 있어야 함
      expect(vi.getTimerCount()).toBe(1)
    })
  })
})

describe('createMarketSystem - 통합 시나리오', () => {
  it('이벤트 시작 → 배수 적용 → 종료 사이클', () => {
    let currentEvent = null
    let eventEndTime = 0
    let marketMultiplier = 1
    let currentTime = 0

    const deps = {
      getCurrentEvent: () => currentEvent,
      setCurrentEvent: ev => {
        currentEvent = ev
      },
      getEventEndTime: () => eventEndTime,
      setEventEndTime: t => {
        eventEndTime = t
      },
      setMarketMultiplier: m => {
        marketMultiplier = m
      },
      addLog: () => {},
      notify: () => {},
      markDirty: () => {},
      now: () => currentTime,
    }

    vi.spyOn(Math, 'random').mockReturnValue(0) // 강세장 선택

    const system = createMarketSystem(mockMarketEvents, deps)

    // 1. 이벤트 시작
    currentTime = 0
    system.startMarketEvent()
    expect(currentEvent.id).toBe('bull_market')
    expect(eventEndTime).toBe(30_000)

    // 2. 배수 적용 확인
    expect(system.getMarketEventMultiplier('deposit', 'financial')).toBe(1.5)
    expect(system.getMarketEventMultiplier('usStock', 'financial')).toBe(2.0)

    // 3. 시간 경과 (이벤트 종료 전)
    currentTime = 15_000
    system.checkMarketEvent()
    expect(currentEvent).not.toBeNull() // 이벤트 유지

    // 4. 이벤트 종료
    currentTime = 30_000
    system.checkMarketEvent()
    expect(currentEvent).toBeNull()
    expect(eventEndTime).toBe(0)

    // 5. 배수 기본값 복귀
    expect(system.getMarketEventMultiplier('deposit', 'financial')).toBe(1.0)
  })
})
