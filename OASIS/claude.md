# OASIS — CLAUDE.md

## Project Identity

**Project Name:** OASIS
**Full Name:** Optimizing Algorithms for Sustainable Intelligent Systems
**Project Type:** SE-499 Final Year Design Project
**Domain:** Green AI, Energy Estimation & Code Optimization, LLM4SE

OASIS is an AI-assisted software energy optimization and validation framework.

The system identifies potential energy optimization opportunities in source code, generates alternative implementations, evaluates their potential impact, verifies functional correctness, executes the candidates under controlled workloads, measures actual resource and energy consumption, and presents evidence to the developer for an accept/reject decision.

---

# 1. Core Product Principle

The fundamental principle of OASIS is:

> **Prediction is not measurement.**

The system must never claim that an optimization saves energy solely because an LLM, heuristic, static analyzer, or prediction model expects it to.

The trusted pipeline is:

```text
Code
  ↓
Understand
  ↓
Detect
  ↓
Generate
  ↓
Predict
  ↓
Verify
  ↓
Execute
  ↓
Measure
  ↓
Compare
  ↓
Developer Decision
```

Actual energy improvement must be based on empirical measurement.

---

# 2. Primary Objective

OASIS must answer three questions:

1. Where is the software performing unnecessary or excessive work?
2. What alternative implementation could perform the same functionality more efficiently?
3. Did the optimization actually improve the software when executed?

The system is therefore not merely an LLM code-generation tool.

It is an:

> **AI-assisted energy optimization and empirical validation framework for software.**

---

# 3. Project Goals

The system should:

* Analyze source code.
* Parse code into a structured representation.
* Detect selected energy-related programming patterns.
* Establish a baseline using controlled execution.
* Generate multiple optimization candidates.
* Support both rule-based and LLM-assisted optimization.
* Predict candidate impact.
* Verify functional correctness.
* Benchmark original and optimized implementations.
* Measure energy and resource utilization.
* Compare original and optimized versions.
* Explain optimization decisions.
* Allow human accept/reject decisions.
* Store experiment history.
* Provide an interactive dashboard.

---

# 4. Project Scope

## Supported

Initially focus on:

* Python
* General-purpose software
* Function-level and selected repository-level analysis
* CPU-based workloads
* Software-level optimization
* Controlled execution
* Energy measurement
* Resource measurement
* LLM-assisted optimization

## Out of Scope

Do not implement unless explicitly approved:

* Hardware redesign
* Physical power management
* Autonomous production deployment
* Mobile optimization
* Embedded systems
* IoT optimization
* Browser optimization
* GPU-specific optimization
* Complete cloud carbon accounting
* Automatic production code merging
* Guaranteed energy savings

---

# 5. High-Level Architecture

OASIS follows three major layers.

## Presentation Layer

Responsible for:

* Code upload
* Project management
* Analysis results
* Opportunity visualization
* Candidate comparison
* Verification results
* Energy comparison
* Accept/reject decisions
* Optimization history

## Application Layer

Responsible for:

* Code parsing
* Code understanding
* Static analysis
* Energy opportunity detection
* Energy estimation
* Candidate generation
* Candidate ranking
* Correctness verification
* Benchmarking
* Energy measurement
* Optimization decision

## Data Layer

Responsible for:

* Source code
* Code representations
* Opportunities
* Candidates
* Measurements
* Verification results
* Optimization decisions
* Experiment history

---

# 6. Core Pipeline

Every optimization must follow this conceptual pipeline:

```text
Source Code
    ↓
Code Parser
    ↓
Code Understanding
    ↓
Static Analysis
    ↓
Optimization Opportunity Detection
    ↓
Baseline Measurement
    ↓
Candidate Generation
    ↓
Candidate Ranking
    ↓
Correctness Verification
    ↓
Candidate Benchmarking
    ↓
Energy Measurement
    ↓
Original vs Candidate Comparison
    ↓
Optimization Decision
    ↓
Human Accept/Reject
```

Modules should not bypass this workflow without a clear architectural reason.

---

# 7. Module Responsibilities

## Code Understanding

Responsible for parsing and representing code.

Must not make energy claims.

## Energy Detection

Responsible for identifying potential energy optimization opportunities.

Detection is a hypothesis, not proof of energy inefficiency.

## Energy Estimation

Responsible for measuring or estimating energy/resource consumption.

Measured and predicted values must always be clearly distinguished.

## Candidate Generation

Responsible for producing alternative implementations.

LLMs generate candidates but do not make final optimization decisions.

## Candidate Ranking

Responsible for prioritizing promising candidates.

Ranking should consider energy potential, performance, resources, correctness confidence, and risk.

## Verification

Responsible for checking functional correctness.

A candidate that fails correctness verification must not be considered a successful optimization.

## Benchmarking

Responsible for executing original and optimized implementations under comparable conditions.

## Optimization Decision

Responsible for combining verification and empirical measurement results.

Final adoption remains under human control.

---

# 8. Energy Measurement Rules

Energy measurements must be treated as experimental data.

Always record:

* Energy consumption
* Execution time
* CPU utilization where available
* Memory utilization where available
* CO2 emissions where available
* Number of runs
* Workload
* Hardware/environment information
* Measurement tool
* Timestamp

Never fabricate measurements.

Never convert a prediction directly into a measured value.

---

# 9. Experimental Reproducibility

Experiments should use controlled conditions whenever practical.

Prefer:

```text
Warm-up
↓
Original Run 1
Original Run 2
...
Original Run N
↓
Optimized Run 1
Optimized Run 2
...
Optimized Run N
↓
Aggregate Results
↓
Compare
```

Store enough metadata to reproduce the experiment.

Measurements may contain environmental noise. Do not overstate small differences.

---

# 10. Correctness Rules

Correctness has priority over optimization.

A candidate must not be accepted merely because:

* It is faster.
* It consumes less energy.
* It uses less memory.
* The LLM claims it is better.

A successful optimization must preserve the required behavior.

Verification may use:

* Unit tests
* Regression tests
* Input/output comparison
* Edge cases
* Exception behavior
* Generated tests where appropriate

---

# 11. LLM Rules

LLMs are optimization assistants, not authorities.

The LLM may:

* Analyze code.
* Suggest optimizations.
* Generate candidate implementations.
* Explain transformations.

The LLM must not independently:

* Declare an optimization successful.
* Claim measured energy savings.
* Bypass correctness testing.
* Bypass benchmarking.
* Automatically deploy changes.

Every generated candidate must be treated as untrusted source code.

---

# 12. Security Rules

OASIS executes source code.

Never execute untrusted code directly inside the main application process if avoidable.

Use:

* Sandboxing
* Process isolation
* Resource limits
* Execution timeouts
* Restricted filesystem access
* Restricted network access

The execution environment must prevent malicious or runaway code from compromising the host system.

---

# 13. Candidate Representation

Every candidate should contain enough metadata to reproduce and understand the transformation.

Recommended structure:

```text
Candidate
├── candidate_id
├── source_code
├── parent_code_id
├── opportunity_id
├── strategy
├── generation_method
├── model
├── predicted_impact
├── correctness_status
├── benchmark_status
├── measured_energy
├── measured_time
├── measured_resources
├── final_status
└── explanation
```

---

# 14. Optimization Statuses

Use explicit statuses:

```text
GENERATED
PREDICTED
VERIFICATION_PENDING
VERIFICATION_FAILED
VERIFIED
BENCHMARK_PENDING
MEASURED
IMPROVED
NEUTRAL
REGRESSED
REJECTED
ACCEPTED
```

Do not overload one status field with multiple meanings.

---

# 15. Measurement vs Prediction

Always use separate fields.

Example:

```text
predicted_energy_reduction
measured_energy_reduction
```

Never store:

```text
energy_reduction
```

if it is ambiguous whether the value is predicted or measured.

---

# 16. Optimization Success

A candidate should only be classified as successfully optimized when:

```text
Correctness = PASS
AND
Benchmark = SUCCESS
AND
Measured Energy Improvement meets defined criteria
```

Performance improvement alone does not automatically imply energy improvement.

Energy improvement alone does not justify an incorrect implementation.

---

# 17. Code Quality

Code must prioritize:

1. Correctness
2. Reproducibility
3. Security
4. Maintainability
5. Testability
6. Performance
7. Energy efficiency

Do not sacrifice correctness or security for small energy improvements.

---

# 18. Repository Structure

Prefer the following organization:

```text
OASIS/
│
├── CLAUDE.md
├── README.md
├── requirements.txt
├── .env.example
│
├── frontend/
│   ├── CLAUDE.md
│   └── ...
│
├── backend/
│   ├── CLAUDE.md
│   └── ...
│
├── modules/
│   ├── code_understanding/
│   ├── energy_detection/
│   ├── energy_estimation/
│   ├── candidate_generation/
│   ├── candidate_ranking/
│   ├── verification/
│   ├── benchmarking/
│   └── optimization_decision/
│
├── database/
├── experiments/
├── tests/
├── docs/
└── scripts/
```

---

# 19. Coding Conventions

Prefer:

* Python type hints.
* Small functions.
* Clear module boundaries.
* Descriptive names.
* Explicit error handling.
* Unit tests.
* Configuration through environment/config files.
* Structured logging.
* Reusable interfaces.

Avoid:

* Hardcoded secrets.
* Global mutable state.
* Large monolithic functions.
* Duplicate business logic.
* Silent failures.
* Unvalidated LLM output.

---

# 20. API Design

Backend APIs should expose clear domain operations.

Examples:

```text
POST /projects
POST /projects/{id}/analyze
POST /analyses/{id}/opportunities
POST /opportunities/{id}/candidates
POST /candidates/{id}/verify
POST /candidates/{id}/benchmark
GET  /experiments/{id}
POST /candidates/{id}/decision
```

API contracts should be versionable and documented.

---

# 21. Testing Strategy

Use multiple testing levels.

## Unit Tests

Test individual components.

## Integration Tests

Test interactions between modules.

## End-to-End Tests

Test:

```text
Upload → Analyze → Generate → Verify → Measure → Compare
```

## Experiment Tests

Validate measurement and benchmarking procedures.

---

# 22. Research Integrity

OASIS is an academic research project.

Do not:

* Invent experimental results.
* Select only successful examples without reporting failures.
* Present predicted values as measurements.
* Claim universal energy savings.
* Claim causal conclusions unsupported by experiments.
* Hide failed optimization candidates.

Report successful, neutral, and failed candidates.

---

# 23. Development Rule

Before implementing a new feature:

1. Identify the responsible module.
2. Read its local `CLAUDE.md`.
3. Check interfaces with neighboring modules.
4. Implement the smallest maintainable solution.
5. Add tests.
6. Validate integration.
7. Update documentation where necessary.

---

# 24. Definition of Done

A feature is complete only when:

* Implementation exists.
* Relevant tests exist.
* Error handling exists.
* Module interface is documented.
* Integration works.
* Results are reproducible where applicable.
* No security-critical issue is introduced.
* Documentation is updated.

---

# 25. Key Design Philosophy

OASIS must remain:

**Evidence-driven**

**Modular**

**Explainable**

**Human-reviewable**

**Experimentally validated**

**Security-conscious**

The system should optimize software based on evidence rather than blindly trusting static rules, LLM output, or predicted energy savings.
