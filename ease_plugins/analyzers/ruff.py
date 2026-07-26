"""Ruff analyzer plugin — wraps `ruff check --output-format json`."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path
from typing import Any

from pydantic import BaseModel

from ease_core.plugins.base import Analyzer, ExecutionContext, NormalizedSmellReport


class RuffAnalyzer:
    """Analyzes Python source with ruff and returns a NormalizedSmellReport."""

    name = "ruff"
    version = "0.2.0"
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = NormalizedSmellReport

    # Mapping of ruff rule codes to EASE SmellCategory
    RULE_CATEGORY_MAP: dict[str, str] = {
        "C": "COMPLEXITY",      # McCabe complexity
        "E": "STYLE",           # pycodestyle errors
        "W": "STYLE",           # pycodestyle warnings
        "F": "DEAD_CODE",       # pyflakes
        "N": "STYLE",           # naming conventions
        "UP": "STYLE",          # pyupgrade
        "SIM": "DUPLICATION",   # simplify
        "PL": "SECURITY",       # pylint security
        "B": "PERFORMANCE",     # flake8-bugbear
        "PERF": "PERFORMANCE",  # performance
        "S": "SECURITY",        # flake8-security
        "D": "STYLE",           # pydocstyle
    }

    DEFAULT_SEVERITY: dict[str, int] = {
        "COMPLEXITY": 7,
        "STYLE": 3,
        "DEAD_CODE": 8,
        "DUPLICATION": 5,
        "SECURITY": 9,
        "PERFORMANCE": 6,
    }

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> NormalizedSmellReport:
        """Execute ruff check on the original workspace source and return normalized report."""
        target = ctx.workspace.original
        cmd = ["ruff", "check", str(target), "--output-format", "json", "--quiet"]
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=ctx.timeout_seconds or 120,
            )
            raw_output = result.stdout.strip()
            if not raw_output:
                return NormalizedSmellReport(
                    tool_name=self.name,
                    tool_version=self.version,
                    smells=[],
                    summary={},
                )
            ruff_results: list[dict[str, Any]] = json.loads(raw_output)
        except (subprocess.TimeoutExpired, json.JSONDecodeError, FileNotFoundError) as exc:
            return NormalizedSmellReport(
                tool_name=self.name,
                tool_version=self.version,
                smells=[],
                summary={"error": str(exc)},
            )

        smells: list[NormalizedSmellReport.Smell] = []
        for item in ruff_results:
            code = item.get("code", "?")
            category = self._categorize(code)
            smells.append(NormalizedSmellReport.Smell(
                category=category,
                rule_id=code,
                file_path=item.get("filename", ""),
                line=item.get("location", {}).get("row", 0) or item.get("line", 0),
                severity=self.DEFAULT_SEVERITY.get(category, 5),
                message=item.get("message", ""),
                tool_source=self.name,
            ))

        summary: dict[str, int] = {}
        for s in smells:
            summary[s.category] = summary.get(s.category, 0) + 1

        return NormalizedSmellReport(
            tool_name=self.name,
            tool_version=self.version,
            smells=smells,
            summary=summary,
        )

    def healthcheck(self) -> bool:
        """Check if ruff CLI is available."""
        try:
            result = subprocess.run(["ruff", "--version"], capture_output=True, text=True, timeout=10)
            return result.returncode == 0
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return False

    @classmethod
    def _categorize(cls, code: str) -> str:
        """Map a ruff rule code to a SmellCategory."""
        if not code:
            return "STYLE"
        for prefix, category in cls.RULE_CATEGORY_MAP.items():
            if code.startswith(prefix):
                return category
        return "STYLE"
