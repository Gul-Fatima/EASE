"""Syntax validator — uses ast.parse to verify optimized code is syntactically valid."""

from __future__ import annotations

import ast
from pathlib import Path

from pydantic import BaseModel

from ease_core.plugins.base import ExecutionContext, ValidationResult, Validator


class SyntaxValidator:
    """Validates that optimized code parses as valid Python AST."""

    name = "syntax"
    version = "1.0.0"
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = ValidationResult

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> ValidationResult:
        errors: list[str] = []
        candidate_dir = ctx.workspace.candidate

        for py_file in candidate_dir.rglob("*.py"):
            try:
                source = py_file.read_text(encoding="utf-8")
                ast.parse(source, filename=str(py_file))
            except SyntaxError as exc:
                rel_path = py_file.relative_to(candidate_dir)
                errors.append(f"{rel_path}: {exc.msg} (line {exc.lineno})")

        passed = len(errors) == 0
        return ValidationResult(
            passed=passed,
            stage_name=self.name,
            details={"files_checked": sum(1 for _ in candidate_dir.rglob("*.py")),
                     "errors_found": len(errors)},
            errors=errors,
        )

    def healthcheck(self) -> bool:
        return True  # ast is stdlib
