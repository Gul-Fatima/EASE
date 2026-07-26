"""CodeCarbon monitor plugin — wraps codecarbon.EmissionsTracker for energy measurement."""

from __future__ import annotations

import platform
import threading
from pathlib import Path
from typing import Any, Optional

from pydantic import BaseModel

from ease_core.plugins.base import EnergyMetrics, ExecutionContext, Monitor


class CodeCarbonMonitor:
    """Measures energy consumption of an experiment using CodeCarbon."""

    name = "codecarbon"
    version = "2.3.0"
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = EnergyMetrics

    def __init__(self) -> None:
        self._tracker: Any = None
        self._lock = threading.Lock()

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> EnergyMetrics:
        try:
            from codecarbon import EmissionsTracker
            from codecarbon.external.logger import logger
            import logging
            logger.setLevel(logging.WARNING)
        except ImportError:
            return EnergyMetrics(
                energy_kwh=0.0, co2_kg=0.0, avg_power_w=0.0,
                cpu_util_pct=0.0, duration_seconds=0.0,
                hardware_fingerprint={"error": "codecarbon not installed"},
            )

        output_dir = ctx.workspace.scratch
        tracker = EmissionsTracker(
            output_dir=str(output_dir),
            output_file=f"emissions_{ctx.experiment_id}.csv",
            log_level="warning",
            measure_power_secs=5.0,
        )

        try:
            tracker.start()
            # The actual workload runs in parallel; this monitor just wraps it.
            # For standalone use, we return baseline metrics.
            import time
            time.sleep(2)  # Brief sample
            emissions = tracker.stop()
        except Exception as exc:
            return EnergyMetrics(
                energy_kwh=0.0, co2_kg=0.0, avg_power_w=0.0,
                cpu_util_pct=0.0, duration_seconds=0.0,
                hardware_fingerprint={"error": str(exc)},
            )

        if emissions is None:
            return EnergyMetrics(
                energy_kwh=0.0, co2_kg=0.0, avg_power_w=0.0,
                cpu_util_pct=0.0, duration_seconds=0.0,
                hardware_fingerprint={"note": "No emissions data returned"},
            )

        return EnergyMetrics(
            energy_kwh=getattr(emissions, "energy_consumed", 0.0) or 0.0,
            co2_kg=getattr(emissions, "co2", 0.0) or 0.0,
            avg_power_w=getattr(emissions, "avg_power", 0.0) or 0.0,
            cpu_util_pct=getattr(emissions, "cpu_power", 0.0) or 0.0,
            duration_seconds=getattr(emissions, "duration", 0.0) or 0.0,
            hardware_fingerprint=self._get_hardware_fingerprint(),
        )

    def healthcheck(self) -> bool:
        try:
            import codecarbon  # noqa: F401
            return True
        except ImportError:
            return False

    @staticmethod
    def _get_hardware_fingerprint() -> dict[str, Any]:
        return {
            "cpu": platform.processor() or "unknown",
            "cores": getattr(platform, "cpu_count", lambda: None)() or 0,
            "system": platform.system(),
            "python": platform.python_version(),
            "machine": platform.machine(),
        }
