# Defense-in-Depth Validation

> Source: https://github.com/obra/superpowers/tree/main/skills/systematic-debugging

## Core Principle

```
Validate at EVERY layer data passes through.
Make the bug structurally impossible.
```

Rather than fixing bugs with isolated checks, distribute validation across multiple layers.

## The Four-Layer Framework

### Layer 1: Entry Point Validation

Screen input at API boundaries, rejecting obviously invalid data before processing.

```javascript
function createUser(data) {
  // Layer 1: Entry validation
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid user data')
  }
  if (!data.email || !isValidEmail(data.email)) {
    throw new Error('Invalid email')
  }
  // ... continue processing
}
```

### Layer 2: Business Logic Validation

Ensure data aligns with operation requirements and contextual rules.

```javascript
function processOrder(order, user) {
  // Layer 2: Business logic validation
  if (order.total > user.creditLimit) {
    throw new Error('Order exceeds credit limit')
  }
  if (order.items.some(item => item.quantity <= 0)) {
    throw new Error('Invalid item quantity')
  }
  // ... continue processing
}
```

### Layer 3: Environment Guards

Prevent risky operations in specific contexts.

```javascript
function deleteFile(path) {
  // Layer 3: Environment guard
  if (process.env.NODE_ENV === 'test') {
    const safeDirs = ['/tmp', process.cwd() + '/test-data']
    if (!safeDirs.some(dir => path.startsWith(dir))) {
      throw new Error(`Unsafe path in test environment: ${path}`)
    }
  }
  // ... continue processing
}
```

### Layer 4: Debug Instrumentation

Capture contextual information for troubleshooting when other layers fail.

```javascript
function riskyOperation(data) {
  // Layer 4: Debug instrumentation
  const context = {
    timestamp: new Date().toISOString(),
    data: JSON.stringify(data).slice(0, 200),
    stack: new Error().stack,
  }

  try {
    return actualOperation(data)
  } catch (error) {
    console.error('[DEBUG] Operation failed:', context)
    throw error
  }
}
```

## Implementation Pattern

When encountering a bug:

1. **Trace** - Where does problematic data originate and flow?
2. **Map** - Identify all checkpoints along that path
3. **Validate** - Implement validation at each layer
4. **Test** - Verify bypassing one layer gets caught by another

## Example: Path Validation

### The Bug

Tests accidentally delete production files when running in wrong directory.

### Four-Layer Solution

```javascript
// Layer 1: Entry validation
function deletePath(path) {
  if (!path || typeof path !== 'string') {
    throw new Error('Path must be a string')
  }
  if (path.includes('..')) {
    throw new Error('Relative paths not allowed')
  }

  // Layer 2: Business logic
  const normalized = require('path').resolve(path)
  if (!normalized.startsWith(PROJECT_ROOT)) {
    throw new Error('Path outside project')
  }

  // Layer 3: Environment guard
  if (process.env.NODE_ENV === 'test') {
    const allowedPaths = [TEST_TMP_DIR, TEST_FIXTURES_DIR]
    if (!allowedPaths.some(p => normalized.startsWith(p))) {
      throw new Error(`Test cannot delete: ${path}`)
    }
  }

  // Layer 4: Debug instrumentation
  console.error('[DELETE]', { path, normalized, env: process.env.NODE_ENV })

  return fs.unlinkSync(normalized)
}
```

## Why All Layers Are Necessary

| Layer          | What It Catches                         |
| -------------- | --------------------------------------- |
| 1. Entry       | Malformed input, type errors            |
| 2. Business    | Logic violations, constraint breaks     |
| 3. Environment | Context-inappropriate operations        |
| 4. Debug       | Helps diagnose failures in other layers |

Each layer catches different categories of issues that others miss.

## Quick Checklist

For any data flow path, ensure you have:

- [ ] Input validation at entry point
- [ ] Business rule validation before processing
- [ ] Environment-appropriate guards
- [ ] Diagnostic instrumentation for failures

## Key Takeaway

> "A bug that passes through one validation layer should be caught by the next. Multiple failures required for a bug to reach production."
