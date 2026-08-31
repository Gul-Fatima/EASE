# Verification Module — CLAUDE.md

## Purpose

The Verification module determines whether an optimization candidate preserves the required functionality of the original implementation.

---

## Priority

Correctness has higher priority than energy efficiency.

```text
Correct Code
    ↓
Potential Optimization
```

not:

```text
Energy Saving
    ↓
Ignore Correctness
```

---

## Verification Methods

Support:

* Unit tests.
* Regression tests.
* Input/output comparison.
* Edge-case testing.
* Exception behavior.
* Generated tests where appropriate.

---

## Verification Flow

```text
Candidate
    ↓
Syntax Check
    ↓
Build/Import Check
    ↓
Test Execution
    ↓
Input/Output Validation
    ↓
Verification Result
```

---

## Result

Possible states:

```text
PASS
FAIL
ERROR
TIMEOUT
NOT_RUN
```

---

## Verification Record

```text
VerificationResult
├── candidate_id
├── status
├── tests_total
├── tests_passed
├── tests_failed
├── execution_time
├── errors
└── timestamp
```

---

## Rules

* Never benchmark a clearly invalid candidate.
* Never classify failed candidates as optimized.
* Preserve test output.
* Use timeouts.
* Isolate execution.
* Record failure reasons.

---

## Important

Passing tests does not prove energy efficiency.

It only establishes functional validity sufficient for the next stage.
