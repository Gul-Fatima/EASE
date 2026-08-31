# OASIS Database — CLAUDE.md

## Purpose

The database stores project, code, optimization, verification, benchmark, measurement, and decision information.

---

## Core Entities

```text
User
Project
CodeVersion
Analysis
Opportunity
Candidate
VerificationResult
BenchmarkResult
Measurement
OptimizationDecision
Experiment
```

---

## Relationships

```text
Project
  ↓
CodeVersion
  ↓
Analysis
  ↓
Opportunity
  ↓
Candidate
  ↓
Verification
  ↓
Benchmark
  ↓
Measurement
  ↓
Decision
```

---

## Requirements

Store enough information to reproduce and understand an experiment.

---

## Important Fields

Measurements must store:

* Energy.
* Unit.
* Execution time.
* CPU.
* Memory.
* CO2 where available.
* Measurement backend.
* Hardware.
* Runtime.
* Workload.
* Timestamp.

---

## Prediction Fields

Predicted values must be stored separately from measured values.

Example:

```text
predicted_energy
measured_energy
predicted_time
measured_time
```

---

## Database Rules

* Use primary keys.
* Use foreign keys.
* Add timestamps.
* Avoid duplicated information.
* Preserve experiment history.
* Do not overwrite historical measurements.
* Prefer immutable experiment records.

---

## Versioning

Do not overwrite the original source code when an optimization is generated.

Store each code version separately.
