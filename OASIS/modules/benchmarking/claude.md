# Benchmarking Module — CLAUDE.md

## Purpose

The Benchmarking module executes original and verified optimized code under comparable conditions.

---

## Principle

The comparison must be fair.

Use:

* Same workload.
* Same environment.
* Same input.
* Same configuration.
* Same runtime where possible.
* Same number of iterations.

---

## Benchmark Flow

```text
Workload
   ↓
Warm-up
   ↓
Original Benchmark
   ↓
Optimized Benchmark
   ↓
Repeat
   ↓
Aggregate
   ↓
Compare
```

---

## Metrics

Record:

* Execution time.
* Energy.
* CPU.
* Memory.
* CO2 emissions where available.

---

## Repetition

Where practical, execute multiple repetitions.

Store:

```text
mean
median
min
max
standard_deviation
```

---

## Rules

* Do not benchmark failed candidates.
* Do not change workloads between versions.
* Do not compare measurements from unrelated environments without disclosure.
* Record environment information.
* Do not hide failed or neutral results.

---

## Comparison

Calculate:

```text
Energy Reduction (%)

Execution Time Reduction (%)

CPU Change (%)

Memory Change (%)
```

All percentage calculations must clearly identify the baseline.
