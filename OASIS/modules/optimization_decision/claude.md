# Optimization Decision Module — CLAUDE.md

## Purpose

The Optimization Decision module combines correctness, benchmarking, and measured energy results to determine the outcome of an optimization candidate.

---

## Decision Hierarchy

Use:

```text
Correctness
    ↓
Benchmark Validity
    ↓
Measured Energy
    ↓
Performance
    ↓
Resource Usage
    ↓
Developer Decision
```

---

## Possible Outcomes

### IMPROVED

Candidate is correct and demonstrates meaningful measured improvement.

### NEUTRAL

Candidate is correct but improvement is negligible.

### REGRESSED

Candidate is correct but produces an unacceptable regression.

### FAILED

Candidate does not pass verification or execution.

### REJECTED

Candidate may be valid but developer chooses not to adopt it.

### ACCEPTED

Developer explicitly approves the optimization.

---

## Decision Rules

Never accept an optimization solely because:

* LLM generated it.
* Static analysis recommended it.
* Predicted energy was lower.
* Code appears cleaner.
* Complexity appears lower.

Use measured evidence.

---

## Human-in-the-Loop

The developer must retain final control.

```text
System Recommendation
        ↓
Developer Review
        ↓
Accept / Reject
```

The system must not automatically modify production code.

---

## Decision Record

```text
OptimizationDecision
├── candidate_id
├── status
├── measured_improvement
├── rationale
├── developer_action
└── timestamp
```
