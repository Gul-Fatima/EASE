# OASIS Experiments — CLAUDE.md

## Purpose

The experiments directory contains controlled experiments used to evaluate OASIS.

---

## Experimental Principle

Experiments must be:

* Reproducible.
* Controlled.
* Documented.
* Honest.
* Comparable.

---

## Experiment Structure

Each experiment should document:

```text
Experiment
├── Objective
├── Research Question
├── Hypothesis
├── Dataset/Workload
├── Original Code
├── Candidate Code
├── Environment
├── Measurement Method
├── Number of Runs
├── Results
└── Conclusion
```

---

## Evaluation Categories

### Detection

Measure:

* Precision.
* Recall.
* F1-score.

### Correctness

Measure:

* Test pass rate.
* Functional equivalence.

### Optimization

Measure:

* Energy reduction.
* Execution-time reduction.
* CPU change.
* Memory change.

### Candidate Generation

Measure:

* Valid candidate rate.
* Correct candidate rate.
* Verification pass rate.

---

## Research Integrity

Never:

* Fabricate measurements.
* Remove unsuccessful candidates without explanation.
* Present predictions as measurements.
* Claim universal improvement.

Negative results are valid research results.

---

## Recommended Comparison

For every experiment report:

```text
Original
vs
Optimized
```

using identical workloads wherever possible.

---

## Statistical Reporting

When enough repetitions are available, report:

* Mean.
* Median.
* Standard deviation.
* Range.

Do not overinterpret very small differences.
