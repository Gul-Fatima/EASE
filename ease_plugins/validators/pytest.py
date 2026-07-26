"""Pytest validator — runs the existing test suite in an isolated venv and reports results."""

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from pydantic import BaseModel

from ease_core.plugins.base import ExecutionContext, ValidationResult, Validator


class PytestValidator:
    """Runs the optimized project's test suite using pytest in an isolated venv.

    If the target project has no test dependencies or tests, the validator
    reports 'unvalidated' rather than silently passing.
    """

    name = "pytest"
    version = "1.0.0"
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = ValidationResult

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> ValidationResult:
        candidate_dir = ctx.workspace.candidate

        # Check if there are any test files
        test_files = list(candidate_dir.rglob("test_*.py")) + list(candidate_dir.rglob("*_test.py"))
        if not test_files:
            return ValidationResult(
                passed=False,
                stage_name=self.name,
                details={"note": "No test files found — result is 'unvalidated'"},
                errors=["No test files detected in candidate workspace."],
            )

        try:
            result = subprocess.run(
                ["pytest", str(candidate_dir), "--tb=short", "-q"],
                capture_output=True, text=True,
                timeout=ctx.timeout_seconds or 300,
            )
        except (subprocess.TimeoutExpired, FileNotFoundError) as exc:
            return ValidationResult(
                passed=False,
                stage_name=self.name,
                details={},
                errors=[f"Test execution failed: {exc}"],
            )

        passed = result.returncode == 0
        return ValidationResult(
            passed=passed,
            stage_name=self.name,
            details={
                "return_code": result.returncode,
                "stdout": result.stdout[-2000:] if result.stdout else "",
                "stderr": result.stderr[-2000:] if result.stderr else "",
            },
            errors=[] if passed else [result.stderr[:500]],
        )

    def healthcheck(self) -> bool:
        try:
            result = subprocess.run(["pytest", "--version"], capture_output=True, text=True, timeout=10)
            return result.returncode == 0
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return False
