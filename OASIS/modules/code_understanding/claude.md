# Code Understanding Module — CLAUDE.md

## Purpose

The Code Understanding module converts source code into a structured representation that can be analyzed by downstream OASIS components.

Its responsibility is to answer:

> **What does this code contain and how is it structured?**

It must not independently determine whether code is energy efficient.

---

## Responsibilities

The module shall:

* Parse source code.
* Build an AST or equivalent representation.
* Extract functions and classes.
* Identify loops.
* Identify conditionals.
* Identify function calls.
* Identify data structures.
* Identify variables.
* Identify I/O operations.
* Extract code complexity features.
* Identify potentially expensive operations.
* Produce a machine-readable representation.

---

## Initial Language

The first implementation should support:

**Python**

Future languages may be added through separate parser adapters.

---

## Suggested Architecture

```text
Source Code
    ↓
Parser
    ↓
AST
    ↓
AST Visitor
    ↓
Feature Extractor
    ↓
Code State Representation
```

---

## Code State Representation

Recommended fields:

```text
CodeState
├── language
├── functions
├── classes
├── loops
├── conditionals
├── function_calls
├── data_structures
├── io_operations
├── complexity
├── allocations
└── dependencies
```

---

## Rules

* Never modify source code during analysis.
* Preserve source-code locations.
* Preserve line numbers.
* Do not make energy claims.
* Do not generate optimization candidates.
* Keep representation deterministic.
* Handle syntax errors gracefully.

---

## Output

The module should produce structured JSON-compatible data.

Example:

```json
{
  "language": "python",
  "functions": [],
  "loops": [],
  "io_operations": [],
  "complexity": {}
}
```

---

## Testing

Test:

* Simple functions.
* Nested loops.
* Conditional logic.
* Function calls.
* List/dictionary/set usage.
* File I/O.
* Syntax errors.
* Empty files.
* Large files.

The same input should produce a consistent representation.
