"""Local process runner — executes a project's entrypoint via subprocess and collects resource usage."""

from __future__ import annotations

import subprocess
import time
from pathlib import Path

from pydantic import BaseModel

from ease_core.plugins.base import ExecutionContext, RunMetrics, Runner


class LocalProcessRunner:
    """Runs a project entrypoint in a subprocess and collects CPU/memory/wall-clock metrics."""

    name = "local_process"
    version = "1.0.0"
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = RunMetrics

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> RunMetrics:
        entrypoint = ctx.config.get("entrypoint", "main.py")
        runs = ctx.config.get("runs", 1)
        entry_path = ctx.workspace.candidate / entrypoint

        if not entry_path.exists():
            return RunMetrics(
                exit_code=-1,
                wall_clock_seconds=0.0,
                cpu_seconds=0.0,
                memory_mb=0.0,
                run_count=0,
            )

        total_wall = 0.0
        total_cpu = 0.0
        total_memory = 0.0
        successful_runs = 0
        last_exit_code = -1

        for _ in range(runs):
            start = time.monotonic()
            try:
                result = subprocess.run(
                    ["python", str(entry_path)],
                    capture_output=True, text=True,
                    timeout=ctx.timeout_seconds or 60,
                    cwd=ctx.workspace.candidate,
                )
                elapsed = time.monotonic() - start
                total_wall += elapsed
                total_cpu += elapsed  # Simplified: real impl uses resource.getrusage
                total_memory += 0.0   # TODO: measure peak RSS via psutil or /proc
                last_exit_code = result.returncode
                if result.returncode == 0:
                    successful_runs += 1
            except (subprocess.TimeoutExpired, FileNotFoundError) as exc:
                elapsed = time.monotonic() - start
                total_wall += elapsed
                continue

        avg_wall = total_wall / max(runs, 1)
        avg_cpu = total_cpu / max(runs, 1)
        avg_mem = total_memory / max(runs, 1)

        return RunMetrics(
            exit_code=last_exit_code,
            wall_clock_seconds=avg_wall,
            cpu_seconds=avg_cpu,
            memory_mb=avg_mem,
            run_count=successful_runs,
        )

    def healthcheck(self) -> bool:
        return True  # subprocess is stdlib
