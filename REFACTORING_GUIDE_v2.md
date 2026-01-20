# Part 0: Executive Summary & Context

**To**: Claude Code (Agent)
**From**: Codebase Analysis Agent
**Date**: 2026-01-18
**Project**: Seoul Survivor (Web Game)
**Subject**: Codebase Review & Refactoring Directive

---

## 1. Context & Objective

This report provides a deep-dive analysis of the "Seoul Survivor" codebase.
You are tasked with **refactoring this legacy codebase** from a "Script-based Prototype" into a "Scalable Application".

The current codebase functions correctly as an MVP but suffers from significant Technical Debt that prevents safe expansion.
Your immediate goal is to understand the **"God Object" pattern** in `main.js` and the **Fragmented Data** structure, and then prepare to execute a rigorous refactoring plan (Phase 1).

## 2. High-Level Assessment

- **Architecture**: Monolithic `main.js` (2,400+ lines) managing all state via local variables (`let`). Heavy use of dependency injection (getters/setters) to workaround scope issues.
- **Data**: The "Source of Truth" for game balance is split between `balance/` (constants) and `data/` (logic), making tuning risky.
- **Persistence**: Save logic is manual and fragile. New variables must be manually mapped in `saveLoad.js`, leading to frequent data loss bugs during updates.
- **Score**: **6.0 / 10** (Functional, but highly brittle).

## 3. Critical Directives for Claude Code

When modifying this codebase, you **MUST** adhere to the following rules:

1.  **Do Not Add Global Variables**: Stop adding `let` variables to `main.js`. Use the future `GameState` object.
2.  **Respect the `shared/` Directory**: Do not break the contract with other games sharing this folder.
3.  **Assume Mobile-First**: Validation must be done in the Browser Tool with mobile viewports (e.g., iPhone 12 Pro dimensions).

---

_Proceed to **Part 1** for the deep-dive on Architecture._

---

# Part 1: Architecture & State Management Deep Dive

## 1. The "God Object" Problem

### Diagnosis

The file `seoulsurvival/src/main.js` acts as a classic **God Object**.
It holds:

- Core Game State (`cash`, `deposits`, `careerLevel`, etc.)
- Business Logic (Income calculation loops)
- UI Event Handlers (Click Listeners)
- Initialization Logic

```javascript
// Current Pattern (main.js)
let cash = 0
let deposits = 0
// ... 50+ more variables

// Injection Hell
const saveLoadManager = createSaveLoadManager({
  gameVars: {
    get cash() {
      return cash
    },
    set cash(v) {
      cash = v
    },
    // ... repetitively injecting every single variable
  },
})
```

### Risks

1.  **Scope Pollution**: Almost every module requires `gameVars` injection, creating a spiderweb of dependencies.
2.  **Testability**: You cannot test `income.js` or `saveLoad.js` in isolation easily because they depend on heavy context objects constructed in `main.js`.
3.  **Refactoring Friction**: Adding one new resource (e.g., "Gold") requires editing:
    - `main.js` (declaration)
    - `main.js` (injection to UI)
    - `main.js` (injection to SaveLoad)
    - `saveLoad.js` (save mapping)
    - `saveLoad.js` (load mapping)

## 2. State Management Strategy (SSOT)

### Proposed Solution

We need a **Single Source of Truth (SSOT)**.
The `src/state/gameState.js` file exists but is underutilized. It should be promoted to a **Factory Module**.

```javascript
// Proposed Pattern (src/state/gameState.js)
export function createGameState() {
  return {
    resources: {
      cash: 0,
    },
    assets: {
      deposits: 0,
      savings: 0,
      // ...
    },
    career: {
      level: 0,
      exp: 0,
    },
    // ...
  }
}

// Proposed Pattern (main.js)
import { createGameState } from './state/gameState.js'
const state = createGameState() // One object to rule them all
```

This change allows passing a **single `state` reference** to all subsystems, eliminating the "Getter/Setter Injection Hell".

## 3. Module Boundaries

- `src/boot/`: Should contain the entry point logic currently in `main.js`.
- `src/core/loop.js`: The `setInterval` logic (50ms tick) should be extracted here.
- `src/systems/`: Business logic (e.g., `JobSystem`, `InvestmentSystem`) should be purely functional, taking `state` as input and returning mutations or events.

---

_Proceed to **Part 2** to understand the Data Integrity issues._

---

# Part 2: Data Integrity & Balance Architecture

## 1. The Split-Brain Balance Issue

### Diagnosis

Game balance is currently defined in two conflicting locations:

1.  **`src/balance/`**: Contains constants like `BASE_COSTS`, `MARKET_EVENTS`. (Intended as the new standard).
2.  **`src/data/upgrades.js`**: Contains object factories that **hardcode** values and logic.

```javascript
// src/data/upgrades.js (Current Leaky Abstraction)
export function createUpgrades(deps) {
  return {
    click_boost_1: {
      cost: 100000, // Hardcoded Magic Number
      effect: () => deps.setClickMultiplier(1.2), // Hardcoded Logic
    },
  }
}
```

This means changing a value in `src/balance/` often **does not reflect** in the actual game unless the developer remembers to also update `src/data/upgrades.js`.

### Proposed Solution: Data-Driven Definitions

We must move to a purely **declarative** definition in `src/balance/` and use a **Builder** to generate runtime objects.

```javascript
// src/balance/upgrades.json (or .js)
{
  "click_boost_1": {
    "type": "click_multiplier",
    "value": 1.2,
    "cost": 100000,
    "req_career": 2
  }
}

// src/systems/Restoration.js (Builder)
function buildUpgrades(schema, state) {
  // Automatically generates the 'effect' function based on 'type'
}
```

## 2. Fragile Persistence (Save/Load)

### Diagnosis

The current saving mechanism is manual:

```javascript
// src/persist/saveLoad.js
const saveData = {
  cash: gameVars.cash, // Manual mapping
  deposits: gameVars.deposits, // Manual mapping
  // ...
}
```

This violates the **Open/Closed Principle**. Every time a feature is added, the save system must be modified.

### Proposed Solution: Schema-Based Serialization

Once Phase 1 (SSOT) is complete, persistence becomes trivial:

```javascript
function saveGame(state) {
  // Save the entire state tree directly
  // (Assuming the state tree involves only serializable data)
  localStorage.setItem(KEY, JSON.stringify(state))
}
```

## 3. Validation Strategy

- **Migration Tests**: When changing the save format, you **MUST** create a test case that loads an "Old Verification Save" (v0.1.0) and asserts that it migrates correctly to the new v0.2.0 format without data loss.

---

_Proceed to **Part 3** for Security & Quality concerns._

---

# Part 3: Security & Code Quality Assurance

## 1. Security Risks

### Unsafe Cheat Exposure

**Location**: `main.js` (Scope: Global)
The code explicitly exposes `window.cheat` mechanisms in the production build.

```javascript
// Dangerous Pattern
window.cheat = {
  money: () => {
    cash += 999999
  },
}
```

While this is a single-player game, Cluade Code must respect the "Leaderboard Integrity".
**Directive**: Wrap all debug/cheat logic in `if (__IS_DEV__) { ... }` blocks.

### Global Scope Abuse

**Location**: `src/persist/saveLoad.js`
The variable `window.__lastLeaderboardUpdate` is used for throttling.
**Fix**: Move this to module-level scope (`let lastUpdate = 0;`) inside the `LeaderboardUI` or `saveLoad` module. **Never pollute the `window` object.**

## 2. Code Hygiene

### Source Tree Pollution

Files like `main.js.backup`, `main_backup.js`, `main_backup2.js` are present in the repository.
**Action**: Delete these immediately. Rely on Git history.

### DRY Violations (Do Don't Repeat Yourself)

**Location**: `src/data/upgrades.js`
Repeated logic for "Click Income Boost" upgrades.
**Refactoring**: create a helper `makeMultiplierUpgrade(id, name, cost, value)` to reduce boilerplate and potential copy-paste errors.

## 3. Error Handling

### Save/Load Resilience

The current logic has basic `try-catch`, but it lacks **recovery strategies**.
**Recommendation**: Implement a "Safe Mode" load. If the standard load fails (JSON parse error), attempt to load a `.bak` version if available (Logic to create `.bak` on successful save needed).

---

_Proceed to **Part 4** for Frontend & UX specific issues._

---

# Part 4: Frontend Architecture & UX

## 1. CSS Architecture

### The Inline Styles Problem

**Location**: `index.html` (~Line 41)
A large block of CSS is embedded directly in HTML. This prevents:

- Browser Caching of styles
- Parallel development (Designer working on CSS while dev works on JS)
- Linting/Minification tools from working effectively

**Directive**: Move all inline styles to `src/styles/main.css` (or `seoul.css`) and link it.
_Note: Keep `shared/` styles separate._

## 2. Mobile Experience (Accessibility vs. UX)

### Aggressive Zoom Blocking

The code uses `preventDefault` on `gesturestart` events globally.

```javascript
// Current Aggressive Lock
document.addEventListener('gesturestart', prevent, { passive: false })
```

This hurts accessibility for visually impaired users who _need_ to zoom.

**Better Approach**:
Remove global listeners. Use CSS `touch-action` on interactive elements only.

```css
/* Recommended */
#workBtn,
.btn {
  touch-action: manipulation; /* Disables double-tap zoom only on buttons */
}
```

## 3. UI-Logic Coupling

**Diagnosis**: `main.js` contains direct DOM manipulation inside business logic rules.
Example: `elWorkArea.style.opacity = '0.5'` inside `checkCareerPromotion()`.

**Refactoring Goal**: The "Business Logic" should only emit an event (e.g., `Events.PROMOTION`), and the "UI Layer" (`src/ui/gameUI.js`) should listen to it and handle the animation.
**Pattern**: Observer Pattern or Pub/Sub.

---

_Proceed to **Part 5** for the Action Plan._

---

# Part 5: Actionable Refactoring Roadmap

**To**: Claude Code
**Priority**: Immediate

## Phase 1: Establish SSOT (Single Source of Truth)

**Objective**: Eliminate "God Object" variables in `main.js`.

1.  **Create Factory**: Update `src/state/gameState.js` to return a complete `initialState` object.
2.  **Context Injection**: Modify `main.js` to instantiate `const state = createGameState()`.
3.  **Refactoring Loop**:
    - Pick one variable (e.g., `cash`).
    - Move it to `state.resources.cash`.
    - Update all references in `main.js` (`cash` -> `state.resources.cash`).
    - Update `saveLoadManager` to accept `state` instead of individual getters.
    - **Verify**: Run the game, click, check if cash increases.
4.  **Repeat** for all ~50 variables.

## Phase 2: Data & Persistence Hardening

**Objective**: Automate saving and unify balance.

1.  **Save Automation**: Switch `saveLoad.js` to `JSON.stringify(state)`.
2.  **Builder Pattern**: Create `buildUpgrades(state, schema)` to generate upgrade logic dynamically from `balance/upgrades.js`.

## Phase 3: Cleanup

1.  **Frontend**: Extract `index.html` CSS to file.
2.  **Security**: Wrap `window.cheat` in dev guard.
3.  **Delete**: Remove `*.backup` files.

## Summary Checklist for Claude Code

- [ ] **Must** use `state` object, not independent `let`s.
- [ ] **Must** verify mobile constraints (touch actions).
- [ ] **Must NOT** break existing save files (migration logic required if schema changes drastically).

---

**End of Report**
