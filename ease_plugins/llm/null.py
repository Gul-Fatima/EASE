"""Null LLM provider — placeholder that raises NotImplementedError.

This ensures the LLM provider slot exists in the data model and registry
from MVP day one, avoiding a schema migration when real LLM plugins land.
"""

from __future__ import annotations

from pydantic import BaseModel

from ease_core.plugins.base import ExecutionContext, LLMProvider, NormalizedSmellReport, OptimizedCode


class NullLLMProvider:
    """Placeholder LLM provider — raises NotImplementedError."""

    name = "null"
    version = "0.0.0"
    input_schema: type[BaseModel] = NormalizedSmellReport
    output_schema: type[BaseModel] = list[OptimizedCode]

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> list[OptimizedCode]:
        raise NotImplementedError(
            "LLM optimization is not available in the MVP. "
            "Install and register an LLM provider plugin to use this feature."
        )

    def healthcheck(self) -> bool:
        return False
