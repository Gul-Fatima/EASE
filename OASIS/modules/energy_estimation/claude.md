# Energy Estimation Module — CLAUDE.md

## Purpose

The Energy Estimation module measures and estimates resource and energy consumption of software workloads.

---

## Core Principle

Separate:

### Prediction

Expected impact before execution.

### Measurement

Observed impact after execution.

Never mix them.

---

## Metrics

The module should support:

* Energy consumption
* Execution time
* CPU utilization
* Memory utilization
* CO2-equivalent emissions where available

---

## Measurement Backend

Initial backend:

**CodeCarbon**

The architecture should provide an abstraction so additional measurement tools can be integrated later.

---

## Suggested Interface

```python
class EnergyMeasurementBackend:
    def start(self):
        pass

    def stop(self):
        pass

    def get_result(self):
        pass
```

---

## Measurement Record

```text
Measurement
├── experiment_id
├── energy
├── energy_unit
├── execution_time
├── cpu_usage
├── memory_usage
├── emissions
├── measurement_tool
├── hardware
├── runtime
└── timestamp
```

---

## Rules

* Never fabricate energy values.
* Store raw measurements.
* Store measurement metadata.
* Clearly identify measurement units.
* Handle measurement failures.
* Do not silently substitute estimated values for missing measurements.
* Report unavailable metrics explicitly.

---

## Noise

Energy measurements can vary between executions.

Support multiple runs and aggregate statistics where practical.

Prefer:

* Mean
* Median
* Standard deviation

for repeated experiments.

---

## Important

A faster program is not automatically an energy-efficient program.

A lower CPU percentage is not automatically proof of lower energy.

Energy conclusions must be based on measured results.
