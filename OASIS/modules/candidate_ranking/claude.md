# Candidate Ranking Module — CLAUDE.md

## Purpose

The Candidate Ranking module prioritizes optimization candidates before expensive verification and benchmarking.

---

## Ranking Factors

Consider:

* Predicted energy impact.
* Predicted performance impact.
* Memory impact.
* Computational complexity.
* Correctness confidence.
* Transformation risk.
* Code complexity.
* Generation quality.

---

## Principle

Ranking is prioritization, not final validation.

A highly ranked candidate can still fail verification or measurement.

---

## Conceptual Score

A candidate score may combine:

```text
Energy Potential
+ Performance Potential
+ Resource Efficiency
+ Correctness Confidence
- Transformation Risk
```

The exact formula should be configurable and experimentally evaluated.

---

## Output

Return candidates ordered by priority:

```text
Candidate A — Rank 1
Candidate B — Rank 2
Candidate C — Rank 3
```

---

## Rules

* Do not mark a candidate successful.
* Do not report predicted savings as actual savings.
* Preserve ranking explanations.
* Handle missing prediction values.
* Avoid ranking solely on LLM confidence.
