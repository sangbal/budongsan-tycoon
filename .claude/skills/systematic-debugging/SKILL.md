# Systematic Debugging

> Source: https://github.com/obra/superpowers/tree/main/skills/systematic-debugging

## The Fundamental Rule

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

Systematic debugging typically resolves issues in 15-30 minutes versus 2-3 hours of random experimentation, achieving 95% first-time success rates.

## Phase 1: Root Cause Investigation

**Examine error messages thoroughly:**

- Read the complete error, not just the first line
- Check for file paths, line numbers, stack traces
- Look for the earliest error in a cascade

**Reproduce consistently:**

- Identify minimal steps to trigger the bug
- Note environmental factors (OS, versions, state)
- Document what works vs. what fails

**Review recent changes:**

- Check git diff for recent modifications
- Consider what worked before vs. now
- Look at timing of when bug appeared

**Gather diagnostic evidence:**

- Add logging before the problem area
- Capture actual values vs. expected values
- Trace data flow backward to the source

## Phase 2: Pattern Analysis

**Find working examples:**

- Locate similar code that works correctly
- Study reference implementations
- Understand the expected behavior

**Identify differences:**

- Compare broken code to working code
- Look for configuration differences
- Check for missing dependencies

**Understand all dependencies:**

- Map the call chain completely
- Identify external dependencies
- Note environmental requirements

## Phase 3: Hypothesis and Testing

**Apply scientific methodology:**

- Form a specific hypothesis about the cause
- Make ONE change to test the hypothesis
- Observe results carefully

**Test with minimal changes:**

- Change only one thing at a time
- Verify each change's effect
- Don't layer multiple fixes

**Adjust hypothesis based on results:**

- If fix doesn't work, gather more data
- Don't guess - investigate why it failed
- Return to Phase 1 if needed

## Phase 4: Implementation

**Create test case first:**

- Write a failing test that demonstrates the bug
- Ensure the test fails for the right reason
- This prevents regression

**Apply single-point fix:**

- Target the actual root cause
- Make the minimal necessary change
- Avoid "while I'm here" additions

**Verify without additional changes:**

- Run the test suite
- Check for side effects
- Confirm the fix addresses root cause

## Critical Safeguards

### The Three-Strike Rule

```
IF fix attempts > 3:
  HARD STOP
  Return to Phase 1
  Question: "Is the architecture itself wrong?"
```

### Red Flags - Return to Phase 1 Immediately

- Assuming a solution without verification
- Proposing multiple simultaneous changes
- Attempting fixes without complete understanding
- "This should work" thinking
- Random permutation of code

### Questions to Ask Before Any Fix

1. "What is the exact error message?"
2. "What is the expected behavior?"
3. "What is the actual behavior?"
4. "What changed recently?"
5. "Do I understand the complete call chain?"

## Debugging Techniques

### Add Instrumentation

```javascript
// Use console.error - it survives test logger suppression
console.error('[DEBUG] value:', actualValue, 'expected:', expectedValue)
console.error('[DEBUG] stack:', new Error().stack)
```

### Binary Search for Test Pollution

When you can't find which test causes pollution:

1. Run tests 1-50, then 51-100
2. If 51-100 fails alone, problem is in 1-50
3. Continue bisecting until isolated

### Trace Data Flow Backward

```
Error at: function C
  ↑ Called by: function B
    ↑ Called by: function A
      ↑ Data came from: user input

Fix at: user input validation, not function C
```

## Common Mistakes to Avoid

1. **Fixing symptoms, not causes** - Trace to the source
2. **Multiple changes at once** - One change, one test
3. **Assuming the fix** - Verify with evidence
4. **Ignoring error messages** - Read them completely
5. **Not reproducing first** - Can't fix what you can't reproduce

## Verification Checklist

Before declaring a bug fixed:

- [ ] Root cause identified with evidence
- [ ] Failing test written that demonstrates bug
- [ ] Single, minimal fix applied
- [ ] All tests pass (not just the new one)
- [ ] Fix addresses root cause, not symptom
- [ ] No "while I'm here" additional changes
