# ECS World 통합 검증 가이드

## 작업 완료 사항

✅ **2026-01-19**: ECS World를 `main.js` 게임 루프에 통합 완료

### 변경 사항

1. **Import 추가**

   ```javascript
   import { World } from './ecs/index.js'
   ```

2. **World 인스턴스 생성** (Line 23-24)

   ```javascript
   // ECS World instance
   let world = null
   ```

3. **초기화 단계 추가** (Line 145-147)

   ```javascript
   // Step 6: Initialize ECS World
   updateLoadingProgress(65, 'Initializing ECS World...')
   world = new World()
   console.log('[KIMCHI INVASION] ECS World created')
   ```

4. **게임 루프에서 World.update() 호출** (Line 195-211)

   ```javascript
   function gameLoop(currentTime) {
     if (!game.running) return

     // Calculate deltaTime in seconds
     const deltaTime = (currentTime - game.lastTime) / 1000
     game.lastTime = currentTime

     // Update ECS systems
     if (world) {
       world.update(deltaTime)
     }

     // Render frame
     // PixiJS는 자체 ticker를 사용하므로 별도 렌더링 호출 불필요
     // 각 시스템이 필요 시 PixiJS 객체를 직접 업데이트함

     requestAnimationFrame(gameLoop)
   }
   ```

5. **디버그 export 추가** (Line 283)
   ```javascript
   getWorld: () => world,
   ```

## 검증 방법

### 1. 개발 서버 실행

```bash
npm run dev
```

브라우저 → `http://localhost:5174/kimchi-invasion/`

### 2. 브라우저 콘솔 테스트

```javascript
// ECS World 인스턴스 확인
const world = window.kimchiGame.getWorld()
console.log(world)
// 출력: World { entities: Map(0) {}, systems: [] }

// 시스템 개수 확인 (현재는 0개여야 함)
console.log('Systems count:', world.systems.length)
// 출력: Systems count: 0

// 엔티티 개수 확인 (현재는 0개여야 함)
console.log('Entities count:', world.entities.size)
// 출력: Entities count: 0

// 게임 루프 상태 확인
const game = window.kimchiGame.getGame()
console.log('Game running:', game.running)
// 출력: Game running: true
```

### 3. 콘솔 로그 확인

브라우저 콘솔에서 다음 메시지를 확인:

```
[KIMCHI INVASION] v0.1.0 - Initializing...
[KIMCHI INVASION] ECS World created
[KIMCHI INVASION] Initialization complete
[KIMCHI INVASION] Game loop started
```

### 4. FPS 확인

개발자 도구 → Performance 탭 → Record → Stop → FPS 그래프 확인

- **목표**: 60 FPS 유지
- **허용 범위**: 55-60 FPS

### 5. ESLint 검증

```bash
npm run lint
```

- **에러 개수**: 0개
- **경고**: 기존 경고만 (새로운 경고 없음)

## 기술 상세

### deltaTime 계산 정확도

- **입력**: `performance.now()` (밀리초, 고정밀도)
- **변환**: `(currentTime - game.lastTime) / 1000` → 초 단위
- **정밀도**: 마이크로초 단위까지 정확

**예시:**

```javascript
// 60 FPS 기준
// Frame 1: 1000.123
// Frame 2: 1016.789
// deltaTime = (1016.789 - 1000.123) / 1000 = 0.016666초 ≈ 1/60
```

### PixiJS Ticker vs requestAnimationFrame

**현재 아키텍처:**

- **게임 로직**: `requestAnimationFrame` (60 FPS 목표)
- **렌더링**: PixiJS 자체 ticker (자동 관리)

**이유:**

- ECS 시스템 업데이트와 렌더링을 분리
- PixiJS가 내부적으로 최적화된 렌더링 루프 사용
- 향후 고정 타임스텝 로직 추가 가능

## 다음 단계

1. **첫 번째 시스템 추가**
   - `systems/movement/MovementSystem.js` 구현
   - `world.addSystem(new MovementSystem())` 등록

2. **테스트 엔티티 생성**
   - 테스트용 엔티티 추가
   - 콘솔에서 `world.entities.size` 확인

3. **시스템 업데이트 검증**
   - 콘솔 로그로 시스템 실행 확인
   - deltaTime 값 모니터링

## 트러블슈팅

### World가 undefined

**증상:**

```javascript
window.kimchiGame.getWorld()
// undefined
```

**해결:**

- 게임 초기화 완료 확인
- 콘솔에 "[KIMCHI INVASION] ECS World created" 메시지 있는지 확인
- 페이지 새로고침

### FPS 저하 (60 FPS 미만)

**원인:**

- 너무 많은 엔티티/시스템 (현재는 해당 없음)
- 백그라운드 탭

**확인:**

- 개발자 도구 Performance 탭에서 프로파일링
- `world.systems.length`, `world.entities.size` 확인

### deltaTime이 비정상적으로 큼

**예시:**

```javascript
// deltaTime = 1.5초 (비정상)
```

**원인:**

- 탭이 백그라운드로 전환되었다가 복귀
- 브라우저 디버거에서 breakpoint 걸림

**해결책:**

- `gameLoop()`에서 deltaTime 상한 설정
  ```javascript
  const deltaTime = Math.min((currentTime - game.lastTime) / 1000, 0.1)
  // 최대 0.1초 (100ms)로 제한
  ```

## 참고 문서

- `kimchi-invasion/src/ecs/World.js` - ECS World 구현
- `kimchi-invasion/src/ecs/System.js` - 시스템 베이스 클래스
- `kimchi-invasion/docs/09-technical/11-ecs-architecture.md` - ECS 아키텍처 설계
