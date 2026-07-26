"""Radon analyzer plugin — wraps `radon cc` and `radon mi` for complexity metrics."""

from __future__ import annotations

import json
import subprocess
from typing import Any

from pydantic import BaseModel

from ease_core.plugins.base import Analyzer, ExecutionContext, NormalizedSmellReport


class RadonAnalyzer:
    """Analyzes Python source complexity with Radon and returns a NormalizedSmellReport."""

    name = "radon"
    version = "5.1.0"
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = NormalizedSmellReport

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> NormalizedSmellReport:
        target = ctx.workspace.original
        smells: list[NormalizedSmellReport.Smell] = []

        # Cyclomatic complexity
        try:
            cc_result = subprocess.run(
                ["radon", "cc", str(target), "--json"],
                capture_output=True, text=True, timeout=ctx.timeout_seconds or 60,
            )
            if cc_result.stdout.strip():
                cc_data: dict[str, Any] = json.loads(cc_result.stdout.strip())
                for file_path, blocks in cc_data.items():
                    for block in blocks:
                        complexity = block.get("complexity", 0)
                        if complexity > 10:  # Only report high complexity
                            severity = min(10, 5 + (complexity - 10) // 5)
                            smells.append(NormalizedSmellReport.Smell(
                                category="COMPLEXITY",
                                rule_id=f"CC>{10}",
                                file_path=file_path,
                                line=block.get("lineno", 0),
                                severity=severity,
                                message=f"Cyclomatic complexity {complexity} in {block.get('name', '?')}",
                                tool_source=self.name,
                            ))
        except (subprocess.TimeoutExpired, json.JSONDecodeError, FileNotFoundError):
            pass

        # Maintainability index
        try:
            mi_result = subprocess.run(
                ["radon", "mi", str(target), "--json"],
                capture_output=True, text=True, timeout=ctx.timeout_seconds or 60,
            )
            if mi_result.stdout.strip():
                mi_data: dict[str, Any] = json.loads(mi_result.stdout.strip())
                for file_path, mi_entry in mi_data.items():
                    if isinstance(mi_entry, dict):
                        mi_score = mi_entry.get("mi", 100)
                        if mi_score < 50:
                            smells.append(NormalizedSmellReport.Smell(
                                category="COMPLEXITY",
                                rule_id="MI<50",
                                file_path=file_path,
                                line=0,
                                severity=8,
                                message=f"Maintainability index {mi_score:.1f} — low maintainability",
                                tool_source=self.name,
                            ))
        except (subprocess.TimeoutExpired, json.JSONDecodeError, FileNotFoundError):
            pass

        summary: dict[str, int] = {}
        for s in smells:
            summary[s.category] = summary.get(s.category, 0) + 1

        return NormalizedSmellReport(
            tool_name=self.name, tool_version=self.version,
            smells=smells, summary=summary,
        )

    def healthcheck(self) -> bool:
        try:
            result = subprocess.run(["radon", "--version"], capture_output=True, text=True, timeout=10)
            return result.returncode == 0
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return False
