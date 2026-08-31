# OASIS Backend — CLAUDE.md

## Purpose

The backend coordinates OASIS modules and exposes APIs to the frontend.

---

## Responsibilities

The backend should:

* Authenticate users where applicable.
* Manage projects.
* Receive source code.
* Start analysis.
* Coordinate optimization pipeline.
* Manage experiment execution.
* Store results.
* Return structured results to frontend.

---

## Architecture

Prefer:

```text
API Layer
    ↓
Service Layer
    ↓
Domain Modules
    ↓
Repository/Data Layer
```

---

## Recommended Technology

Python + FastAPI.

---

## API Principles

Use:

* RESTful endpoints.
* Pydantic schemas.
* Type validation.
* Explicit errors.
* HTTP status codes.
* Structured responses.

---

## Important

Do not place the entire OASIS pipeline inside one API route.

Bad:

```text
/analyze
    └── 1000 lines of logic
```

Prefer services:

```text
AnalysisService
EnergyService
CandidateService
VerificationService
BenchmarkService
DecisionService
```

---

## Error Handling

Handle:

* Invalid code.
* Parser failure.
* LLM failure.
* Verification failure.
* Benchmark timeout.
* Energy measurement failure.
* Database failure.

Errors must be logged and returned safely.

---

## Security

Never execute submitted code directly inside the API process.

Use isolated execution workers or containers.

Never expose:

* API keys.
* Database credentials.
* Internal stack traces.
* Host filesystem information.

---

## Configuration

Use environment variables/configuration files.

Never hardcode secrets.
