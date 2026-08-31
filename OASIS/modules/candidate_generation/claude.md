# Optimization Candidate Generation — CLAUDE.md

## Purpose

The Candidate Generation module creates alternative implementations for detected optimization opportunities.

---

## Generation Methods

Support:

### Rule-Based

Deterministic transformations for known patterns.

### LLM-Assisted

Generate alternatives using an open-source code-oriented LLM.

---

## LLM Role

The LLM is a candidate generator.

It is not the final decision-maker.

The generated code is untrusted until verified.

---

## Input

The generator may receive:

* Original source code.
* Relevant function.
* Detected opportunity.
* Code state representation.
* Optimization objective.
* Constraints.
* Existing tests.
* Programming language.

---

## Output

Each candidate must include:

```text
Candidate
├── candidate_id
├── source_code
├── strategy
├── generation_method
├── model
├── explanation
└── predicted_impact
```

---

## Multiple Candidates

Prefer generating multiple candidates when feasible.

Example:

```text
Original
   ↓
Opportunity
   ↓
Candidate Generator
   ├── Rule candidate
   ├── LLM candidate 1
   ├── LLM candidate 2
   └── LLM candidate 3
```

---

## Rules

* Never trust generated code.
* Never deploy generated code automatically.
* Never claim measured energy improvement.
* Preserve required interfaces.
* Preserve expected inputs/outputs.
* Keep transformations explainable.
* Store the original code unchanged.

---

## Prompting

Prompts should explicitly state:

* Preserve functionality.
* Do not change public interfaces unless requested.
* Optimize the identified opportunity.
* Avoid unnecessary complexity.
* Return complete valid code.
* Explain the transformation.

---

## Failure Handling

Handle:

* Invalid syntax.
* Incomplete output.
* Hallucinated libraries.
* Changed function signatures.
* Missing imports.
* LLM timeout.
* API/model errors.

Invalid candidates should be marked and excluded from verification.
