# OASIS Frontend — CLAUDE.md

## Purpose

The frontend provides the developer-facing interface for OASIS.

---

## Responsibilities

The frontend should provide:

* Project management.
* Code input/upload.
* Analysis status.
* Energy opportunities.
* Candidate comparison.
* Verification results.
* Benchmark results.
* Energy visualization.
* Optimization history.
* Accept/reject controls.

---

## Recommended Technology

Use:

* React or Next.js.
* TypeScript.
* Tailwind CSS where appropriate.
* Charting library for measurements.

---

## Main Screens

1. Dashboard
2. Project Details
3. Code Analysis
4. Opportunity Details
5. Candidate Generation
6. Verification
7. Energy Benchmark
8. Candidate Comparison
9. Optimization History

---

## UI Principle

The dashboard must clearly distinguish:

### Predicted

Expected impact before execution.

### Measured

Actual observed result.

Never visually represent predicted and measured energy using identical labels.

---

## Important Visualizations

Provide:

* Energy before/after.
* Execution time before/after.
* CPU utilization.
* Memory usage.
* CO2 emissions.
* Candidate ranking.
* Verification status.

---

## UX Rules

* Show loading states.
* Show errors clearly.
* Never hide failed experiments.
* Explain technical terms.
* Use consistent status labels.
* Confirm destructive operations.
* Keep code comparison readable.

---

## Accept/Reject

The user must be able to inspect evidence before accepting an optimization.

Do not put "Accept" before the important validation information.

---

## API

Frontend communicates with the backend through defined API contracts.

Do not place business logic for energy measurement or optimization decisions inside frontend components.
