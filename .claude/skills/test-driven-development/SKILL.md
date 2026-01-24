# Test-Driven Development (TDD)

> Source: https://github.com/obra/superpowers/tree/main/skills/test-driven-development

## Overview

The core approach is straightforward: compose the test first, observe it fail, then write minimal code to pass it. As emphasized: "If you didn't watch the test fail, you don't know if it tests the right thing."

## When to Apply

Use TDD for new features, bug fixes, refactoring, and behavior modifications. Exceptions—like throwaway prototypes or generated code—require discussion with your team.

## The Fundamental Rule

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

If code exists before tests, delete it completely and start fresh. This isn't negotiable—no keeping it as reference or adapting it while testing.

## Red-Green-Refactor Cycle

**RED:** Write one minimal test demonstrating desired behavior. Must be specific and test actual code.

**Verify RED:** Run the test suite and confirm it fails as expected—not due to syntax errors or existing functionality.

**GREEN:** Implement the simplest solution passing the test. Avoid over-engineering or adding untested features.

**Verify GREEN:** Confirm the test passes and no other tests break.

**REFACTOR:** Clean up code while maintaining green tests—remove duplication, improve naming, extract helpers.

## Good Test Characteristics

Tests should be minimal (one behavior each), clearly named, and demonstrate the desired API using real code rather than mocks when possible.

## Why Sequence Matters

Writing tests afterward produces immediate passes, proving nothing about coverage or correctness. Pre-written tests force discovery of edge cases and ensure comprehensive validation.

## Common Rationalizations to Reject

Avoid thinking "too simple to test," "I'll test after," "manual testing was sufficient," or "deleting hours of work is wasteful." Each represents a rationalization that undermines TDD's benefits.

## Verification Before Completion

Confirm every new function has a test, each test failed before implementation for the right reason, minimal code was written, all tests pass, and edge cases are covered.

## TDD Workflow Summary

```
1. Write a failing test (RED)
2. Run tests - verify failure
3. Write minimal code to pass (GREEN)
4. Run tests - verify pass
5. Refactor if needed
6. Repeat
```

## Anti-Patterns to Avoid

See `testing-anti-patterns.md` for detailed guidance on:

- Testing mock behavior instead of real behavior
- Adding test-only methods to production code
- Mocking without understanding dependencies
- Incomplete mocks
- Tests as afterthought
