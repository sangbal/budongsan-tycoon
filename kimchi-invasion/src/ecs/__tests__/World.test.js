/**
 * ECS-Lite World 단위 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Entity, System, World, resetEntityIdCounter } from '../index.js'

describe('ECS-Lite Framework', () => {
  beforeEach(() => {
    resetEntityIdCounter()
  })

  describe('Entity', () => {
    it('엔티티를 생성하고 고유 ID를 부여한다', () => {
      const entity1 = new Entity({ type: 'building' })
      const entity2 = new Entity({ type: 'resource' })

      expect(entity1.id).toBe(1)
      expect(entity2.id).toBe(2)
      expect(entity1.type).toBe('building')
      expect(entity2.type).toBe('resource')
      expect(entity1.active).toBe(true)
    })

    it('컴포넌트를 추가/제거할 수 있다', () => {
      const entity = new Entity({ type: 'building' })

      entity.addComponent('position', { x: 10, y: 20 })
      entity.addComponent('health', 100)

      expect(entity.hasComponent('position')).toBe(true)
      expect(entity.getComponent('position')).toEqual({ x: 10, y: 20 })
      expect(entity.getComponent('health')).toBe(100)

      entity.removeComponent('health')
      expect(entity.hasComponent('health')).toBe(false)
    })

    it('초기 컴포넌트를 생성자에서 받을 수 있다', () => {
      const entity = new Entity({
        type: 'worker',
        components: {
          position: { x: 0, y: 0 },
          speed: 5,
        },
      })

      expect(entity.hasComponent('position')).toBe(true)
      expect(entity.hasComponent('speed')).toBe(true)
      expect(entity.getComponent('speed')).toBe(5)
    })

    it('엔티티를 활성화/비활성화할 수 있다', () => {
      const entity = new Entity({ type: 'building' })

      expect(entity.active).toBe(true)

      entity.deactivate()
      expect(entity.active).toBe(false)

      entity.activate()
      expect(entity.active).toBe(true)
    })
  })

  describe('System', () => {
    it('필수 컴포넌트를 지정할 수 있다', () => {
      const system = new System(['position', 'velocity'])

      expect(system.requiredComponents).toEqual(['position', 'velocity'])
      expect(system.priority).toBe(0)
    })

    it('엔티티가 시스템의 요구사항을 만족하는지 확인한다', () => {
      const system = new System(['position', 'velocity'])

      const entity1 = new Entity({ type: 'moving' })
      entity1.addComponent('position', { x: 0, y: 0 })
      entity1.addComponent('velocity', { x: 1, y: 1 })

      const entity2 = new Entity({ type: 'static' })
      entity2.addComponent('position', { x: 5, y: 5 })

      expect(system.matches(entity1)).toBe(true)
      expect(system.matches(entity2)).toBe(false)
    })

    it('update()를 구현하지 않으면 에러가 발생한다', () => {
      const system = new System()

      expect(() => system.update([], 0.016)).toThrow('System.update() must be implemented')
    })
  })

  describe('World', () => {
    let world

    beforeEach(() => {
      world = new World()
    })

    it('엔티티를 추가하고 가져올 수 있다', () => {
      const entity = new Entity({ type: 'building' })

      world.addEntity(entity)

      expect(world.getEntity(entity.id)).toBe(entity)
      expect(world.entities.size).toBe(1)
    })

    it('엔티티를 제거할 수 있다', () => {
      const entity = new Entity({ type: 'building' })

      world.addEntity(entity)
      expect(world.entities.size).toBe(1)

      const removed = world.removeEntity(entity.id)
      expect(removed).toBe(true)
      expect(world.entities.size).toBe(0)
    })

    it('존재하지 않는 엔티티를 제거하면 false를 반환한다', () => {
      const removed = world.removeEntity(999)
      expect(removed).toBe(false)
    })

    it('타입별로 엔티티를 필터링할 수 있다', () => {
      const building1 = new Entity({ type: 'building' })
      const building2 = new Entity({ type: 'building' })
      const resource = new Entity({ type: 'resource' })

      world.addEntity(building1)
      world.addEntity(building2)
      world.addEntity(resource)

      const buildings = world.getEntitiesByType('building')
      expect(buildings.length).toBe(2)
      expect(buildings).toContain(building1)
      expect(buildings).toContain(building2)
    })

    it('시스템을 추가하고 우선순위 순으로 정렬한다', () => {
      class LowPrioritySystem extends System {
        constructor() {
          super()
          this.priority = 10
        }
        update() {}
      }

      class HighPrioritySystem extends System {
        constructor() {
          super()
          this.priority = 1
        }
        update() {}
      }

      const lowSys = new LowPrioritySystem()
      const highSys = new HighPrioritySystem()

      world.addSystem(lowSys)
      world.addSystem(highSys)

      expect(world.systems[0]).toBe(highSys)
      expect(world.systems[1]).toBe(lowSys)
    })

    it('시스템을 제거할 수 있다', () => {
      class TestSystem extends System {
        update() {}
      }

      const system = new TestSystem()
      world.addSystem(system)

      expect(world.systems.length).toBe(1)

      const removed = world.removeSystem(system)
      expect(removed).toBe(true)
      expect(world.systems.length).toBe(0)
    })

    it('update()가 매칭되는 엔티티만 시스템에 전달한다', () => {
      const updatedEntities = []

      class MovementSystem extends System {
        constructor() {
          super(['position', 'velocity'])
        }
        update(entities) {
          updatedEntities.push(...entities)
        }
      }

      const movingEntity = new Entity({ type: 'moving' })
      movingEntity.addComponent('position', { x: 0, y: 0 })
      movingEntity.addComponent('velocity', { x: 1, y: 1 })

      const staticEntity = new Entity({ type: 'static' })
      staticEntity.addComponent('position', { x: 5, y: 5 })

      world.addEntity(movingEntity)
      world.addEntity(staticEntity)
      world.addSystem(new MovementSystem())

      world.update(0.016)

      expect(updatedEntities.length).toBe(1)
      expect(updatedEntities[0]).toBe(movingEntity)
    })

    it('비활성 엔티티는 시스템에서 무시된다', () => {
      const updatedEntities = []

      class TestSystem extends System {
        constructor() {
          super(['test'])
        }
        update(entities) {
          updatedEntities.push(...entities)
        }
      }

      const activeEntity = new Entity({ type: 'active' })
      activeEntity.addComponent('test', true)

      const inactiveEntity = new Entity({ type: 'inactive' })
      inactiveEntity.addComponent('test', true)
      inactiveEntity.deactivate()

      world.addEntity(activeEntity)
      world.addEntity(inactiveEntity)
      world.addSystem(new TestSystem())

      world.update(0.016)

      expect(updatedEntities.length).toBe(1)
      expect(updatedEntities[0]).toBe(activeEntity)
    })

    it('빈 월드에서 update()를 호출해도 에러가 발생하지 않는다', () => {
      class EmptySystem extends System {
        update() {}
      }

      world.addSystem(new EmptySystem())

      expect(() => world.update(0.016)).not.toThrow()
    })

    it('clear()가 모든 엔티티와 시스템을 제거한다', () => {
      const entity = new Entity({ type: 'test' })

      class TestSystem extends System {
        update() {}
      }

      world.addEntity(entity)
      world.addSystem(new TestSystem())

      expect(world.entities.size).toBe(1)
      expect(world.systems.length).toBe(1)

      world.clear()

      expect(world.entities.size).toBe(0)
      expect(world.systems.length).toBe(0)
    })

    it('시스템의 init()과 cleanup()이 적절한 시점에 호출된다', () => {
      const calls = []

      class LifecycleSystem extends System {
        init() {
          calls.push('init')
        }
        cleanup() {
          calls.push('cleanup')
        }
        update() {}
      }

      const system = new LifecycleSystem()

      world.addSystem(system)
      expect(calls).toEqual(['init'])

      world.removeSystem(system)
      expect(calls).toEqual(['init', 'cleanup'])
    })
  })
})
