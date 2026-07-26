"""Rope optimizer plugin — uses rope library for Python refactoring.

Note: rope is a library for programmatic refactoring in Python. This plugin
uses rope's API to apply automated refactorings (rename, extract method, etc.)
based on smell report findings.
"""

from __future__ import annotations

import difflib
from pathlib import Path
from typing import Any

from pydantic import BaseModel

from ease_core.plugins.base import ExecutionContext, NormalizedSmellReport, OptimizedCode, Optimizer


class RopeOptimizer:
    """Applies rope-based refactorings based on analysis smell reports."""

    name = "rope"
    version = "1.12.0"
    input_schema: type[BaseModel] = NormalizedSmellReport
    output_schema: type[BaseModel] = OptimizedCode

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> OptimizedCode:
        target = ctx.workspace.candidate
        self._copy_source(ctx.workspace.original, target)

        try:
            from rope.base.project import Project
            from rope.base.libutils import report_exceptions
        except ImportError:
            return OptimizedCode(
                strategy_name=self.name, files=[],
                summary="Rope library not available. Install with: pip install rope",
            )

        try:
            project = Project(str(target))
            # Placeholder: rope-based automatic refactoring logic
            # TODO: Implement smell-driven auto-refactoring:
            #   - Extract repeated code blocks (duplication)
            #   - Rename poorly named variables (style)
            #   - Inline trivial variables
            #   - etc.
            project.close()
        except Exception as exc:
            return OptimizedCode(
                strategy_name=self.name, files=[],
                summary=f"Rope refactoring failed: {exc}",
            )

        files = self._collect_modified_files(ctx.workspace.original, target)
        return OptimizedCode(
            strategy_name=self.name, files=files,
            summary=f"Rope refactored {len(files)} file(s).",
        )

    def healthcheck(self) -> bool:
        try:
            import rope  # noqa: F401
            return True
        except ImportError:
            return False

    @staticmethod
    def _copy_source(src: Path, dst: Path) -> None:
        import shutil
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst, symlinks=True)

    @staticmethod
    def _collect_modified_files(original: Path, candidate: Path) -> list[OptimizedCode.ModifiedFile]:
        files: list[OptimizedCode.ModifiedFile] = []
        for candidate_file in candidate.rglob("*.py"):
            rel_path = candidate_file.relative_to(candidate)
            original_file = original / rel_path
            if not original_file.exists():
                continue
            orig_content = original_file.read_text(encoding="utf-8")
            cand_content = candidate_file.read_text(encoding="utf-8")
            if orig_content != cand_content:
                diff = "".join(
                    difflib.unified_diff(
                        orig_content.splitlines(keepends=True),
                        cand_content.splitlines(keepends=True),
                        fromfile=str(rel_path), tofile=str(rel_path),
                    )
                )
                files.append(OptimizedCode.ModifiedFile(
                    file_path=str(rel_path),
                    original_content=orig_content,
                    optimized_content=cand_content,
                    diff=diff,
                ))
        return files
