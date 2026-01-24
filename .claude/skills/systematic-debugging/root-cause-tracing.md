# Root Cause Tracing

> Source: https://github.com/obra/superpowers/tree/main/skills/systematic-debugging

## Core Concept

Trace backward through the call chain until you find the original trigger, then fix at the source. Never fix at the symptom location only.

## The Process

### 1. Observe the Symptom

Note where the error manifests:

```
Error: Cannot read property 'name' of undefined
  at displayUser (user.js:45)
```

### 2. Find Immediate Cause

The direct code triggering the error:

```javascript
function displayUser(user) {
  console.log(user.name) // user is undefined here
}
```

### 3. Ask: Who Called This?

Work backward through the call stack:

```javascript
function processUsers(users) {
  users.forEach(user => displayUser(user)) // Where does users come from?
}
```

### 4. Keep Tracing Upward

Follow data sources to their origin:

```javascript
async function loadUsers() {
  const response = await fetch('/api/users')
  const users = response.users // Should be response.data.users!
  processUsers(users)
}
```

### 5. Locate the Original Trigger

Found it: `response.users` should be `response.data.users`

## Instrumentation Techniques

### Add Logging Before Problem

```javascript
console.error('[DEBUG] About to process:', {
  value: data,
  type: typeof data,
  keys: Object.keys(data || {}),
})
```

### Include Context

```javascript
console.error('[DEBUG] Context:', {
  directory: process.cwd(),
  envVars: process.env.NODE_ENV,
  timestamp: new Date().toISOString(),
})
```

### Capture Stack Trace

```javascript
console.error('[DEBUG] Stack:', new Error().stack)
```

### Use console.error in Tests

Important: Use `console.error()` instead of `console.log()` in tests - it survives logger suppression.

## Tracing Pattern

```
Symptom Location     <- DON'T FIX HERE
    ↑
Intermediate Call    <- DON'T FIX HERE
    ↑
Intermediate Call    <- DON'T FIX HERE
    ↑
Root Cause          <- FIX HERE
```

## Example: Test Pollution

### Symptom

```
Test A passes alone, fails when run after Test B
```

### Tracing

```
Test A fails
  ↑ Because database has unexpected data
    ↑ Because Test B didn't clean up
      ↑ Because afterEach was missing
```

### Fix Location

Add afterEach cleanup to Test B, not a workaround in Test A.

## Bisection Script for Test Pollution

When you can't identify which test pollutes:

```bash
#!/bin/bash
# find-polluter.sh

FAILING_TEST=$1
TOTAL_TESTS=$2
MID=$((TOTAL_TESTS / 2))

# Run first half + failing test
npm test -- --grep "test1|test2|...|$FAILING_TEST"

# If it fails, polluter is in first half
# If it passes, polluter is in second half
# Continue bisecting
```

## Defense-in-Depth After Finding Root Cause

Don't just fix at the source - add validation at multiple layers:

1. **Entry point validation** - Reject bad data early
2. **Business logic validation** - Ensure data fits context
3. **Environment guards** - Prevent risky operations
4. **Debug instrumentation** - Help future debugging

## Key Principle

> "Fix at the source, but defend at every layer."
