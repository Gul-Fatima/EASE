"""JSON reporter — serializes experiment results as a downloadable JSON artifact."""

from __future__ import annotations

import json
from datetime import datetime
from typing import Any

from pydantic import BaseModel

from ease_core.plugins.base import ExecutionContext, Reporter


class JSONReporter:
    """Renders an experiment as a pretty-printed JSON blob."""

    name = "json"
    version = "1.0.0"
    input_schema: type[BaseModel] = BaseModel
    output_schema: type[BaseModel] = BaseModel

    def run(self, ctx: ExecutionContext, input_data: BaseModel) -> BaseModel:
        # input_data is expected to be an Experiment or similar data container
        data: dict[str, Any] = {
            "experiment_id": ctx.experiment_id,
            "generated_at": datetime.utcnow().isoformat(),
            "report": input_data.model_dump() if hasattr(input_data, "model_dump") else str(input_data),
            "config": ctx.config,
        }

        # Write to scratch dir as JSON artifact
        output_path = ctx.workspace.scratch / "report.json"
        output_path.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")

        class RawReport(BaseModel):
            path: str
            content: str

        return RawReport(path=str(output_path), content=json.dumps(data, indent=2, default=str))

    def healthcheck(self) -> bool:
        return True
