"""Application and pipeline configuration via pydantic-settings.

Supports YAML pipeline configs validated at load time and environment-based
app configuration (database URL, logging level, etc.).
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Optional

import yaml
from pydantic import Field
from pydantic_settings import BaseSettings


class AppSettings(BaseSettings):
    """Application-level settings, read from environment or .env file.

    MVP uses SQLite; set DATABASE_URL to a Postgres connection string for Phase 2.
    """

    database_url: str = Field(default="sqlite:///./ease.db", alias="DATABASE_URL")
    artifacts_dir: str = Field(default="artifacts", alias="ARTIFACTS_DIR")
    workspaces_dir: str = Field(default="workspaces", alias="WORKSPACES_DIR")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    max_concurrent_stages: int = Field(default=4, alias="MAX_CONCURRENT_STAGES")
    default_timeout_seconds: float = Field(default=300.0, alias="DEFAULT_TIMEOUT_SECONDS")

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


class PipelineSettings:
    """Loads and validates a pipeline.yaml configuration."""

    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        self._raw: dict[str, Any] = {}

    def load(self) -> dict[str, Any]:
        """Load and return the parsed pipeline configuration."""
        if not self.path.exists():
            raise FileNotFoundError(f"Pipeline config not found: {self.path}")
        with open(self.path) as f:
            self._raw = yaml.safe_load(f) or {}
        self._validate()
        return self._raw

    def _validate(self) -> None:
        """Basic structural validation of the pipeline config."""
        if "stages" not in self._raw:
            raise ValueError("Pipeline config must contain a 'stages' list.")
        stages = self._raw["stages"]
        if not isinstance(stages, list) or len(stages) == 0:
            raise ValueError("Pipeline config 'stages' must be a non-empty list.")
        for i, stage in enumerate(stages):
            if not isinstance(stage, dict):
                raise ValueError(f"Stage at index {i} must be a mapping.")
            for key in ("name", "category", "plugin"):
                if key not in stage:
                    raise ValueError(f"Stage at index {i} is missing required key '{key}'.")


def load_pipeline(path: str | Path) -> dict[str, Any]:
    """Convenience: load and return a validated pipeline configuration."""
    return PipelineSettings(path).load()


__all__ = [
    "AppSettings",
    "PipelineSettings",
    "load_pipeline",
]
