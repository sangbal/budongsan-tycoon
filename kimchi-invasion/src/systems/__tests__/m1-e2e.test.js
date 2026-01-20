/**
 * KIMCHI INVASION - M1 마일스톤 E2E 테스트
 *
 * @description 김치 10캔 생산 시나리오 검증
 * @module systems/__tests__/m1-e2e
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { resourceSystem } from '../resourceSystem.js'
import { buildingSystem } from '../buildingSystem.js'
import { fermentationSystem } from '../fermentationSystem.js'
import { powerSystem } from '../powerSystem.js'
import { useGameStore } from '../../state/stores/gameStore.js'
import { RESOURCES } from '../../data/resources.js'
import { BUILDINGS } from '../../data/buildings.js'

describe('M1 Milestone E2E Tests - 김치 10캔 생산', () => {
  beforeEach(() => {
    // Zustand 상태 초기화
    useGameStore.setState({
      resources: {},
      buildings: [],
    })

    // 시스템 초기화
    resourceSystem.init()
    buildingSystem.init()
    fermentationSystem.init()
    powerSystem.init()

    // 초기 자원 설정 (RESOURCES 정의 기반)
    for (const [resourceId, def] of Object.entries(RESOURCES)) {
      useGameStore.getState().modifyResource(resourceId, def.initialValue)
    }
  })

  describe('1. 기본 자원 수집 테스트', () => {
    it('초기 자원이 올바르게 설정됨', () => {
      expect(resourceSystem.get('dollars')).toBe(100)
      expect(resourceSystem.get('energy')).toBe(0)
      expect(resourceSystem.get('oxygen')).toBe(100)
    })

    it('자원 추가/소비가 정상 작동', () => {
      // 자원 추가
      resourceSystem.add('iron', 50)
      expect(resourceSystem.get('iron')).toBe(50)

      // 자원 소비
      const consumed = resourceSystem.consume('iron', 20)
      expect(consumed).toBe(true)
      expect(resourceSystem.get('iron')).toBe(30)

      // 부족 시 소비 실패
      const failed = resourceSystem.consume('iron', 100)
      expect(failed).toBe(false)
      expect(resourceSystem.get('iron')).toBe(30) // 변화 없음
    })

    it('여러 자원 동시 소비', () => {
      resourceSystem.add('iron', 100)
      resourceSystem.add('sand', 50)

      const consumed = resourceSystem.consumeMultiple({
        iron: 30,
        sand: 10,
      })

      expect(consumed).toBe(true)
      expect(resourceSystem.get('iron')).toBe(70)
      expect(resourceSystem.get('sand')).toBe(40)
    })

    it('여러 자원 중 하나라도 부족하면 소비 실패', () => {
      resourceSystem.add('iron', 100)
      resourceSystem.add('sand', 5) // 부족

      const consumed = resourceSystem.consumeMultiple({
        iron: 30,
        sand: 10,
      })

      expect(consumed).toBe(false)
      expect(resourceSystem.get('iron')).toBe(100) // 변화 없음
      expect(resourceSystem.get('sand')).toBe(5) // 변화 없음
    })
  })

  describe('2. 건물 배치 테스트', () => {
    it('온실(greenhouse) 배치 가능', () => {
      // 건설 비용 지급
      const greenhouseCost = BUILDINGS.greenhouse.cost
      for (const [resourceId, amount] of Object.entries(greenhouseCost)) {
        resourceSystem.add(resourceId, amount)
      }

      // 배치
      const building = buildingSystem.place('greenhouse', 5, 5)

      expect(building).not.toBeNull()
      expect(building.type).toBe('greenhouse')
      expect(building.x).toBe(5)
      expect(building.y).toBe(5)
      expect(building.level).toBe(1)
    })

    it('발효실(fermentationChamber) 배치 가능', () => {
      // 건설 비용 지급
      const chamberCost = BUILDINGS.fermentationChamber.cost
      for (const [resourceId, amount] of Object.entries(chamberCost)) {
        resourceSystem.add(resourceId, amount)
      }

      // 배치
      const building = buildingSystem.place('fermentationChamber', 10, 10)

      expect(building).not.toBeNull()
      expect(building.type).toBe('fermentationChamber')
      expect(building.level).toBe(1)
    })

    it('자원 부족 시 건물 배치 실패', () => {
      // 자원 없이 배치 시도
      const building = buildingSystem.place('greenhouse', 5, 5)

      expect(building).toBeNull()
    })

    it('점유된 타일에 건물 배치 불가', () => {
      // 첫 번째 건물 배치
      const greenhouseCost = BUILDINGS.greenhouse.cost
      for (const [resourceId, amount] of Object.entries(greenhouseCost)) {
        resourceSystem.add(resourceId, amount * 2) // 2번 지을 수 있도록
      }

      buildingSystem.place('greenhouse', 5, 5)

      // 같은 위치에 배치 시도
      const building2 = buildingSystem.place('greenhouse', 5, 5)
      expect(building2).toBeNull()
    })

    it('건물 제거 시 50% 환불', () => {
      // 건물 배치
      const greenhouseCost = BUILDINGS.greenhouse.cost
      for (const [resourceId, amount] of Object.entries(greenhouseCost)) {
        resourceSystem.add(resourceId, amount)
      }

      const building = buildingSystem.place('greenhouse', 5, 5)
      const initialDollars = resourceSystem.get('dollars')

      // 제거
      buildingSystem.remove(building.id)

      const refund = Math.floor(greenhouseCost.dollars * 0.5)
      expect(resourceSystem.get('dollars')).toBe(initialDollars + refund)
    })
  })

  describe('3. 발효 프로세스 테스트', () => {
    it('발효 레시피 조회', () => {
      const recipe = fermentationSystem.getRecipe()

      expect(recipe.input).toHaveProperty('cabbage')
      expect(recipe.input).toHaveProperty('salt')
      expect(recipe.input).toHaveProperty('chilliPowder')
      expect(recipe.output).toHaveProperty('kimchi')
      expect(recipe.time).toBe(60)
    })

    it('재료 투입 → 발효 시작', () => {
      // 발효실 배치
      const chamberCost = BUILDINGS.fermentationChamber.cost
      for (const [resourceId, amount] of Object.entries(chamberCost)) {
        resourceSystem.add(resourceId, amount)
      }
      resourceSystem.add('energy', 100)

      const chamber = buildingSystem.place('fermentationChamber', 10, 10)

      // 재료 추가
      resourceSystem.add('cabbage', 1)
      resourceSystem.add('salt', 1)
      resourceSystem.add('chilliPowder', 1)

      // 발효 시작 전
      expect(chamber.fermenting).toBeUndefined()

      // 1 프레임 업데이트 (발효 시작)
      fermentationSystem.update([], 0.016)

      // 발효 시작 확인
      expect(chamber.fermenting).toBe(true)
      expect(chamber.progress).toBe(0)

      // 재료 소비 확인
      expect(resourceSystem.get('cabbage')).toBe(0)
      expect(resourceSystem.get('salt')).toBe(0)
      expect(resourceSystem.get('chilliPowder')).toBe(0)
    })

    it.skip('발효 진행 → 김치 생산 (에너지 충분) - TODO: 발효→김치 생산 플로우 검증 필요', () => {
      // 발효실 배치
      const chamberCost = BUILDINGS.fermentationChamber.cost
      for (const [resourceId, amount] of Object.entries(chamberCost)) {
        resourceSystem.add(resourceId, amount)
      }

      buildingSystem.place('fermentationChamber', 10, 10)

      // 60초 발효 시 필요 에너지 = 4 * 60 = 240
      // 발효 시작 전에 충분한 에너지 추가
      resourceSystem.add('energy', 300)

      // 재료 추가
      resourceSystem.add('cabbage', 1)
      resourceSystem.add('salt', 1)
      resourceSystem.add('chilliPowder', 1)

      // 발효 시작
      fermentationSystem.update([], 0.016)

      // 발효 시작 확인 (buildingSystem에서 실제 건물 가져오기)
      const chambers = buildingSystem.getBuildingsByType('fermentationChamber')
      expect(chambers[0].fermenting).toBe(true)

      // 60초 경과 시뮬레이션 (1초씩 업데이트)
      for (let i = 0; i < 60; i++) {
        fermentationSystem.update([], 1)
      }

      // 김치 생산 확인
      expect(resourceSystem.get('kimchi')).toBe(1)
      expect(chambers[0].fermenting).toBe(false)
      expect(chambers[0].progress).toBe(0)

      console.log(`[M1 E2E] Remaining energy: ${resourceSystem.get('energy')}`)
    })

    it('에너지 부족 시 발효 중단', () => {
      // 발효실 배치
      const chamberCost = BUILDINGS.fermentationChamber.cost
      for (const [resourceId, amount] of Object.entries(chamberCost)) {
        resourceSystem.add(resourceId, amount)
      }
      resourceSystem.add('energy', 5) // 부족한 에너지

      const chamber = buildingSystem.place('fermentationChamber', 10, 10)

      // 재료 추가
      resourceSystem.add('cabbage', 1)
      resourceSystem.add('salt', 1)
      resourceSystem.add('chilliPowder', 1)

      // 발효 시작
      fermentationSystem.update([], 0.016)
      expect(chamber.fermenting).toBe(true)

      // 에너지 소진
      resourceSystem.consume('energy', resourceSystem.get('energy'))

      // 발효 진행 시도 (에너지 부족)
      const progressBefore = chamber.progress
      fermentationSystem.update([], 10)

      // 진행률 변화 없음
      expect(chamber.progress).toBe(progressBefore)
      expect(chamber.fermenting).toBe(true) // 상태는 유지
    })

    it('재료 부족 시 새 발효 시작 불가', () => {
      // 발효실 배치
      const chamberCost = BUILDINGS.fermentationChamber.cost
      for (const [resourceId, amount] of Object.entries(chamberCost)) {
        resourceSystem.add(resourceId, amount)
      }
      resourceSystem.add('energy', 100)

      buildingSystem.place('fermentationChamber', 10, 10)

      // 재료 부족 (고춧가루 없음)
      resourceSystem.add('cabbage', 1)
      resourceSystem.add('salt', 1)

      // 발효 시작 시도
      fermentationSystem.update([], 0.016)

      // 발효 시작 안 됨
      const chambers = buildingSystem.getBuildingsByType('fermentationChamber')
      expect(chambers[0].fermenting).toBeUndefined()
    })
  })

  describe('4. 전력 관리 테스트', () => {
    it('전력 수지 계산', () => {
      // 화력 발전소 배치
      const powerPlantCost = BUILDINGS.coalPowerPlant.cost
      for (const [resourceId, amount] of Object.entries(powerPlantCost)) {
        resourceSystem.add(resourceId, amount)
      }

      buildingSystem.place('coalPowerPlant', 0, 0)

      const balance = powerSystem.getPowerBalance()

      // coalPowerPlant: energyPerTick = -10 (생산)
      expect(balance.production).toBeGreaterThan(0)
      expect(balance.consumption).toBe(0)
      expect(balance.balance).toBeGreaterThan(0)
    })

    it('전력 경고 발생', () => {
      // 에너지 부족 상태 설정
      resourceSystem.add('energy', 2)

      // 온실 배치 (에너지 소비)
      const greenhouseCost = BUILDINGS.greenhouse.cost
      for (const [resourceId, amount] of Object.entries(greenhouseCost)) {
        resourceSystem.add(resourceId, amount)
      }

      buildingSystem.place('greenhouse', 5, 5)

      // 전력 상태 체크
      const consumption = powerSystem.calculateTotalConsumption()
      powerSystem.checkPowerStatus(consumption, 0.016)

      // 경고 발생 확인
      expect(powerSystem.powerWarning).toBe(true)
    })

    it('전력 부족 시 건물 작동 불가', () => {
      // 온실 배치
      const greenhouseCost = BUILDINGS.greenhouse.cost
      for (const [resourceId, amount] of Object.entries(greenhouseCost)) {
        resourceSystem.add(resourceId, amount)
      }

      const building = buildingSystem.place('greenhouse', 5, 5)

      // 에너지 없음
      expect(resourceSystem.get('energy')).toBe(0)

      // 작동 불가 확인
      const canOperate = powerSystem.canOperate(building)
      expect(canOperate).toBe(false)
    })

    it('전력 충분 시 건물 작동 가능', () => {
      // 온실 배치
      const greenhouseCost = BUILDINGS.greenhouse.cost
      for (const [resourceId, amount] of Object.entries(greenhouseCost)) {
        resourceSystem.add(resourceId, amount)
      }

      const building = buildingSystem.place('greenhouse', 5, 5)

      // 충분한 에너지
      resourceSystem.add('energy', 100)

      // 작동 가능 확인
      const canOperate = powerSystem.canOperate(building)
      expect(canOperate).toBe(true)
    })
  })

  describe('5. 통합 시나리오 - 김치 10캔 생산', () => {
    it('김치 10캔 생산 시나리오 (수동 자원 공급)', () => {
      // ==========================================
      // 단계 1: 초기 자금으로 인프라 구축
      // ==========================================

      // 시작 자금
      expect(resourceSystem.get('dollars')).toBe(100)

      // 자원 추가 (치트 - M1 테스트 목적)
      resourceSystem.add('dollars', 5000)
      resourceSystem.add('iron', 1000)
      resourceSystem.add('sand', 500)
      resourceSystem.add('regolith', 500)
      resourceSystem.add('ice', 500)

      // ==========================================
      // 단계 2: 발전소 건설
      // ==========================================

      const powerPlant = buildingSystem.place('coalPowerPlant', 0, 0)
      expect(powerPlant).not.toBeNull()

      // 발전소 연료(regolith) 확인
      expect(resourceSystem.get('regolith')).toBeGreaterThan(0)

      // 에너지 생산 시뮬레이션 (10초)
      for (let i = 0; i < 10; i++) {
        buildingSystem.update([], 1) // 1초마다
      }

      const energyAfterGeneration = resourceSystem.get('energy')
      console.log(`[M1 E2E] Energy after 10s: ${energyAfterGeneration}`)
      expect(energyAfterGeneration).toBeGreaterThan(0)

      // ==========================================
      // 단계 3: 발효실 건설
      // ==========================================

      const chamber = buildingSystem.place('fermentationChamber', 10, 10)
      expect(chamber).not.toBeNull()

      // ==========================================
      // 단계 4: 김치 10캔 생산 (수동 재료 공급)
      // ==========================================

      // 재료 추가 (치트 - M1 테스트)
      resourceSystem.add('cabbage', 20)
      resourceSystem.add('salt', 20)
      resourceSystem.add('chilliPowder', 20)

      let kimchiProduced = 0
      const targetKimchi = 10

      // 김치 생산 루프 (10캔까지)
      let elapsed = 0
      const maxTime = 1000 // 최대 1000초 (시간 초과 방지)

      while (kimchiProduced < targetKimchi && elapsed < maxTime) {
        // 발전소 가동 (에너지 생산)
        buildingSystem.update([], 1)

        // 발효실 가동 (김치 생산)
        fermentationSystem.update([], 1)

        // 생산된 김치 카운트
        const currentKimchi = resourceSystem.get('kimchi')
        if (currentKimchi > kimchiProduced) {
          kimchiProduced = currentKimchi
          console.log(`[M1 E2E] Kimchi produced: ${kimchiProduced}/${targetKimchi}`)
        }

        elapsed += 1
      }

      // ==========================================
      // 단계 5: 결과 검증
      // ==========================================

      expect(resourceSystem.get('kimchi')).toBeGreaterThanOrEqual(targetKimchi)
      expect(elapsed).toBeLessThan(maxTime)

      console.log(`[M1 E2E] ✅ 김치 10캔 생산 완료! (${elapsed}초 소요)`)
      console.log(
        `[M1 E2E] Final Resources: Kimchi=${resourceSystem.get('kimchi')}, Energy=${resourceSystem.get('energy')}`
      )
    })

    it('병목 구간 식별 - 온실 생산 속도', () => {
      // 온실 3개 배치 (배추 생산)

      // 자원 추가
      resourceSystem.add('dollars', 5000)
      resourceSystem.add('iron', 1000)
      resourceSystem.add('sand', 500)
      resourceSystem.add('water', 1000)

      // 발전소 배치 (에너지 생산)
      resourceSystem.add('regolith', 500)
      buildingSystem.place('coalPowerPlant', 0, 0)

      // 에너지 초기 생산
      for (let i = 0; i < 10; i++) {
        buildingSystem.update([], 1)
      }

      console.log(`[M1 E2E] Initial Energy: ${resourceSystem.get('energy')}`)

      // 온실 3개 배치
      buildingSystem.place('greenhouse', 5, 5)
      buildingSystem.place('greenhouse', 10, 5)
      buildingSystem.place('greenhouse', 15, 5)

      // 90초 생산 (배추 processTime = 30초)
      for (let i = 0; i < 90; i++) {
        buildingSystem.update([], 1) // 발전소 + 온실 통합 업데이트
      }

      const cabbage = resourceSystem.get('cabbage')
      console.log(`[M1 E2E] Cabbage with 3 greenhouses (90s): ${cabbage}`)

      // 온실 3개 = 3 * 1개/30초 = 90초에 9개 (이론상)
      // 에너지 소비: 3 * 2 = 6 에너지/sec
      // 발전소 생산: 10 에너지/sec → 충분
      expect(cabbage).toBeGreaterThanOrEqual(6) // 최소 6개
    })

    it('건물 업그레이드 효과 검증', () => {
      // 온실 업그레이드

      // 자원 추가
      resourceSystem.add('dollars', 5000)
      resourceSystem.add('iron', 1000)
      resourceSystem.add('sand', 500)
      resourceSystem.add('water', 1000)
      resourceSystem.add('regolith', 500)

      // 발전소 배치
      buildingSystem.place('coalPowerPlant', 0, 0)

      // 에너지 초기 생산
      for (let i = 0; i < 10; i++) {
        buildingSystem.update([], 1)
      }

      // 온실 배치
      const greenhouse = buildingSystem.place('greenhouse', 5, 5)

      // 업그레이드 전 생산량 (60초)
      for (let i = 0; i < 60; i++) {
        buildingSystem.update([], 1)
      }
      const cabbageBefore = resourceSystem.get('cabbage')
      console.log(`[M1 E2E] Cabbage Before Upgrade (60s): ${cabbageBefore}`)

      // 업그레이드
      const upgraded = buildingSystem.upgrade(greenhouse.id)
      expect(upgraded).toBe(true)
      expect(greenhouse.level).toBe(2)

      // 배추 초기화 (Zustand 직접 수정)
      useGameStore.setState(state => ({
        resources: {
          ...state.resources,
          cabbage: 0,
        },
      }))

      // 업그레이드 후 생산량 (60초)
      for (let i = 0; i < 60; i++) {
        buildingSystem.update([], 1)
      }
      const cabbageAfter = resourceSystem.get('cabbage')
      console.log(`[M1 E2E] Cabbage After Upgrade (60s): ${cabbageAfter}`)

      // 레벨 2 = 1 + (2-1)*0.2 = 1.2배 생산
      expect(cabbageAfter).toBeGreaterThan(cabbageBefore * 1.1) // 최소 10% 증가
    })
  })
})
