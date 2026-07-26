"""Protocol/ABC definitions for every plugin category.

Each plugin category (Analyzer, Optimizer, Validator, Runner, Monitor, LLM, Reporter)
is defined as a Python Protocol so that plugins are interchangeable via structural
subtyping — no inheritance required for external/third-party plugins.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, List, Optional, Protocol, runtime_checkable

from pydantic import BaseModel


# ---------------------------------------------------------------------------
# Shared value objects
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class WorkspacePaths:
    """Paths an executor may read/write within its isolated workspace.

    Plugins MUST NOT resolve paths outside these directories.
    """
    original: Path       # read-only copy of the target project source
    candidate: Path      # writable copy for optimizer output
    scratch: Path        # temporary files (logs, intermediate artifacts)


@dataclass
class ExecutionContext:
    """Context provided to every stage at runtime."""
    experiment_id: str
    workspace: WorkspacePaths
    config: dict[str, Any] = field(default_factory=dict)
    timeout_seconds: Optional[float] = None
    env_overrides: dict[str, str] = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Pydantic schemas for stage I/O
# ---------------------------------------------------------------------------

class SmellCategory(str, Enum):
    """Shared taxonomy for normalized smell reports across all analyzer tools."""
    COMPLEXITY = "COMPLEXITY"
    STYLE = "STYLE"
    DEAD_CODE = "DEAD_CODE"
    DUPLICATION = "DUPLICATION"
    SECURITY = "SECURITY"
    PERFORMANCE = "PERFORMANCE"


class NormalizedSmellReport(BaseModel):
    """Normalized output from every Analyzer plugin.

    This shared schema is what makes cross-tool aggregation meaningful:
    every analyzer maps its rule IDs to the SmellCategory enum.
    """

    class Smell(BaseModel):
        category: SmellCategory
        rule_id: str
        file_path: str
        line: int
        severity: int          # 1-10
        message: str
        tool_source: str       # e.g. "ruff", "pylint", "radon"

    smells: list[Smell]
    tool_name: str
    tool_version: str
    summary: dict[str, int] = {}   # category -> count


class OptimizedCode(BaseModel):
    """Output from an Optimizer plugin.

    Deterministic optimizers return a single candidate (len(candidates)==1).
    LLM-based optimizers may return multiple.
    """
    class ModifiedFile(BaseModel):
        file_path: str
        original_content: str
        optimized_content: str
        diff: str = ""

    strategy_name: str
    files: list[ModifiedFile]
    summary: str = ""


class ValidationResult(BaseModel):
    """Output from a Validator plugin."""
    passed: bool
    stage_name: str
    details: dict[str, Any] = {}
    errors: list[str] = []


class RunMetrics(BaseModel):
    """Output from a Runner plugin."""
    exit_code: int
    wall_clock_seconds: float
    cpu_seconds: float
    memory_mb: float
    run_count: int = 1


class EnergyMetrics(BaseModel):
    """Output from a Monitor plugin."""
    energy_kwh: float
    co2_kg: float
    avg_power_w: float
    cpu_util_pct: float
    duration_seconds: float
    hardware_fingerprint: dict[str, Any] = {}


class ComparisonReport(BaseModel):
    """Cross-experiment comparison output."""
    baseline_candidate_id: str
    candidates: list[dict[str, Any]]
    deltas: dict[str, Any]  # runtime_delta, energy_delta, smell_delta, memory_delta


# ---------------------------------------------------------------------------
# Stage Protocol (the universal interface every plugin unit implements)
# ---------------------------------------------------------------------------

class Stage(Protocol):
    """Every plugin stage, regardless of category, satisfies this protocol."""
    name: str
    version: str
    input_schema: type[BaseModel]
    output_schema: type[BaseModel]

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> BaseModel:
        """Execute this stage and return typed output."""
        ...

    def healthcheck(self) -> bool:
        """Return True if the plugin is healthy (deps available, API reachable)."""
        ...


# ---------------------------------------------------------------------------
# Category-specific Protocols (each refines Stage for its domain)
# ---------------------------------------------------------------------------

class Analyzer(Stage, Protocol):
    """Analyzes source code and returns a normalized smell report."""
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = NormalizedSmellReport


class Optimizer(Stage, Protocol):
    """Applies optimizations and returns modified code."""
    input_schema: type[BaseModel] = NormalizedSmellReport
    output_schema: type[BaseModel] = OptimizedCode


class Validator(Stage, Protocol):
    """Validates that optimized code is safe and correct."""
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = ValidationResult


class Runner(Stage, Protocol):
    """Executes a project and collects runtime metrics."""
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = RunMetrics


class Monitor(Stage, Protocol):
    """Measures energy consumption of a running project."""
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = EnergyMetrics


class LLMProvider(Stage, Protocol):
    """Generates optimization candidates via an LLM.

    Not implemented in MVP (NullLLMProvider raises NotImplementedError),
    but the slot is defined so the data model and dashboard can reference
    llm_candidate fields without a schema migration later.
    """
    input_schema: type[BaseModel] = NormalizedSmellReport
    output_schema: type[BaseModel] = list[OptimizedCode]


class Reporter(Stage, Protocol):
    """Renders an experiment as a downloadable artifact (JSON, Markdown, PDF, ...)."""
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = BaseModel
