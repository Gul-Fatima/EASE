"""Pylint analyzer plugin — wraps `pylint --output-format json`."""

from __future__ import annotations

import json
import subprocess
from typing import Any

from pydantic import BaseModel

from ease_core.plugins.base import Analyzer, ExecutionContext, NormalizedSmellReport


class PylintAnalyzer:
    """Analyzes Python source with Pylint and returns a NormalizedSmellReport."""

    name = "pylint"
    version = "3.0.0"
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = NormalizedSmellReport

    PYLINT_CATEGORY_MAP: dict[str, str] = {
        "C": "COMPLEXITY",   # Convention
        "R": "STYLE",        # Refactor
        "W": "STYLE",        # Warning
        "E": "DEAD_CODE",    # Error
        "F": "DEAD_CODE",    # Fatal
    }

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> NormalizedSmellReport:
        target = ctx.workspace.original
        cmd = ["pylint", str(target), "--output-format", "json", "--quiet"]
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
                    tool_name=self.name, tool_version=self.version, smells=[], summary={}
                )
            pylint_results: list[dict[str, Any]] = json.loads(raw_output)
        except (subprocess.TimeoutExpired, json.JSONDecodeError, FileNotFoundError) as exc:
            return NormalizedSmellReport(
                tool_name=self.name, tool_version=self.version,
                smells=[], summary={"error": str(exc)},
            )

        smells: list[NormalizedSmellReport.Smell] = []
        for item in pylint_results:
            message_id = item.get("message-id", "?")
            symbol = item.get("symbol", "")
            category = self._categorize(message_id)
            smells.append(NormalizedSmellReport.Smell(
                category=category,
                rule_id=message_id,
                file_path=item.get("path", ""),
                line=item.get("line", 0),
                severity=7 if category == "SECURITY" else 5,
                message=f"[{symbol}] {item.get('message', '')}",
                tool_source=self.name,
            ))

        summary: dict[str, int] = {}
        for s in smells:
            summary[s.category] = summary.get(s.category, 0) + 1

        return NormalizedSmellReport(
            tool_name=self.name, tool_version=self.version,
            smells=smells, summary=summary,
        )

    def healthcheck(self) -> bool:
        try:
            result = subprocess.run(["pylint", "--version"], capture_output=True, text=True, timeout=10)
            return result.returncode == 0
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return False

    @classmethod
    def _categorize(cls, message_id: str) -> str:
        if message_id and len(message_id) > 0:
            prefix = message_id[0]
            return cls.PYLINT_CATEGORY_MAP.get(prefix, "STYLE")
        return "STYLE"
