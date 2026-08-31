# Energy Opportunity Detection — CLAUDE.md

## Purpose

The Energy Detection module identifies potential energy optimization opportunities in source code.

The module identifies:

> **Potential inefficient programming patterns**

It does not prove that a pattern consumes more energy.

---

## Core Principle

Detection is a hypothesis.

Measurement provides evidence.

Therefore:

```text
Detected Opportunity ≠ Measured Energy Inefficiency
```

---

## Initial Detection Categories

Implement selected patterns such as:

### Redundant Computation

Repeated calculation of the same value.

### Inefficient Loops

Unnecessary iterations or repeated work.

### Repeated I/O

Repeated file/resource access that may be avoidable.

### Inefficient Data Structures

Potentially inappropriate structure for the operation.

### Unnecessary Object Creation

Repeated creation of objects.

### Redundant Operations

Operations that do not contribute to the required output.

### Excessive Memory Operations

Unnecessary copying or allocation.

---

## Opportunity Schema

Each opportunity should contain:

```text
Opportunity
├── opportunity_id
├── type
├── file
├── start_line
├── end_line
├── severity
├── explanation
├── evidence
├── possible_strategies
└── confidence
```

---

## Severity

Use:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Severity must represent the potential optimization importance, not guaranteed energy impact.

---

## Rules

* Never claim actual energy savings.
* Provide evidence for every detection.
* Include source location.
* Avoid duplicate findings.
* Prefer explainable rules.
* Keep detectors modular.
* Make thresholds configurable.

---

## Example

Input:

```python
for item in data:
    value = expensive_function(x)
    process(value, item)
```

Potential result:

```text
Type:
REDUNDANT_COMPUTATION

Reason:
The expression appears independent of the loop variable.

Potential strategy:
Precompute the invariant expression.
```

The candidate must later be verified and measured.
