"""Plugin system: Protocol/ABC definitions for all plugin categories and entry-points-based registry."""

from ease_core.plugins.base import (
    Analyzer,
    EnergyMetrics,
    ExecutionContext,
    LLMProvider,
    Monitor,
    NormalizedSmellReport,
    OptimizedCode,
    Optimizer,
    Reporter,
    RunMetrics,
    Runner,
    SmellCategory,
    Stage,
    ValidationResult,
    Validator,
    WorkspacePaths,
)
from ease_core.plugins.registry import PluginRegistry, discover_plugins

__all__ = [
    "Analyzer",
    "EnergyMetrics",
    "ExecutionContext",
    "LLMProvider",
    "Monitor",
    "NormalizedSmellReport",
    "OptimizedCode",
    "Optimizer",
    "Reporter",
    "RunMetrics",
    "Runner",
    "SmellCategory",
    "Stage",
    "ValidationResult",
    "Validator",
    "WorkspacePaths",
    "PluginRegistry",
    "discover_plugins",
]
