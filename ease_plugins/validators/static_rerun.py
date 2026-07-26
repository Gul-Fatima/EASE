"""Static rerun validator — re-runs analyzers on optimized code to ensure no smell regression."""

from __future__ import annotations

from pydantic import BaseModel

from ease_core.plugins.base import ExecutionContext, ValidationResult, Validator


class StaticRerunValidator:
    """Re-runs the same analyzers on optimized code and compares smell counts.

    This validates that optimization didn't introduce new code quality issues.
    """

    name = "static_rerun"
    version = "1.0.0"
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = ValidationResult

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> ValidationResult:
        # TODO: Implement — re-run registered analyzers on ctx.workspace.candidate
        # and compare smell counts/densities against the baseline report.
        # For now, return a pass-through result.
        return ValidationResult(
            passed=True,
            stage_name=self.name,
            details={"note": "Static rerun validation not yet implemented — pass-through."},
            errors=[],
        )

    def healthcheck(self) -> bool:
        return True
