"""Isort optimizer plugin — wraps `isort` to sort Python imports."""

from __future__ import annotations

import difflib
import subprocess
from pathlib import Path

from pydantic import BaseModel

from ease_core.plugins.base import ExecutionContext, OptimizedCode, Optimizer


class IsortOptimizer:
    """Sorts Python imports using isort."""

    name = "isort"
    version = "5.13.0"
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = OptimizedCode

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> OptimizedCode:
        target = ctx.workspace.candidate
        self._copy_source(ctx.workspace.original, target)

        cmd = ["isort", str(target), "--quiet"]
        try:
            subprocess.run(cmd, capture_output=True, text=True,
                           timeout=ctx.timeout_seconds or 120, check=False)
        except (subprocess.TimeoutExpired, FileNotFoundError) as exc:
            return OptimizedCode(
                strategy_name=self.name, files=[],
                summary=f"Error running isort: {exc}",
            )

        files = self._collect_modified_files(ctx.workspace.original, target)
        return OptimizedCode(
            strategy_name=self.name, files=files,
            summary=f"isort sorted imports in {len(files)} file(s).",
        )

    def healthcheck(self) -> bool:
        try:
            result = subprocess.run(["isort", "--version"], capture_output=True, text=True, timeout=10)
            return result.returncode == 0
        except (FileNotFoundError, subprocess.TimeoutExpired):
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
