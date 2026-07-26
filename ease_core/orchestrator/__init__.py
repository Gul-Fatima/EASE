"""Pipeline orchestrator: DAG resolution, stage execution, and event emission.

The orchestrator resolves a pipeline.yaml into a directed acyclic graph,
executes stages in topological order with concurrent fan-out for independent
branches, and emits stage-transition events that the dashboard can observe.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional

from pydantic import BaseModel


class PipelineConfig(BaseModel):
    """Deserialized pipeline.yaml validated at load time."""
    stages: list[dict[str, Any]]
    default_timeout_seconds: float = 300.0
    max_concurrency: int = 2


@dataclass
class StageNode:
    """A single node in the execution DAG."""
    name: str
    plugin_category: str
    plugin_name: str
    depends_on: list[str] = field(default_factory=list)
    config: dict[str, Any] = field(default_factory=dict)
    timeout_seconds: Optional[float] = None


@dataclass
class PipelineDAG:
    """Resolved DAG ready for execution."""
    stages: list[StageNode]
    config: PipelineConfig

    def topological_sort(self) -> list[StageNode]:
        """Return stages in execution order (topological sort)."""
        # Simple Kahn's algorithm
        in_degree: dict[str, int] = {s.name: len(s.depends_on) for s in self.stages}
        adjacency: dict[str, list[str]] = {s.name: [] for s in self.stages}
        for s in self.stages:
            for dep in s.depends_on:
                adjacency.setdefault(dep, []).append(s.name)

        queue = [name for name, deg in in_degree.items() if deg == 0]
        ordered: list[StageNode] = []
        node_map = {s.name: s for s in self.stages}

        while queue:
            name = queue.pop(0)
            ordered.append(node_map[name])
            for neighbor in adjacency.get(name, []):
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        if len(ordered) != len(self.stages):
            raise ValueError("Pipeline DAG contains a cycle — cannot execute.")
        return ordered

    def independent_batches(self) -> list[list[StageNode]]:
        """Group stages into batches that can run concurrently.

        Returns a list of batches, where each batch contains stages
        whose dependencies are all satisfied by previous batches.
        """
        ordered = self.topological_sort()
        in_degree: dict[str, int] = {s.name: len(s.depends_on) for s in self.stages}
        batches: list[list[StageNode]] = []
        remaining = set(s.name for s in ordered)
        node_map = {s.name: s for s in self.stages}
        adjacency: dict[str, list[str]] = {s.name: [] for s in self.stages}
        for s in self.stages:
            for dep in s.depends_on:
                adjacency.setdefault(dep, []).append(s.name)

        while remaining:
            batch = [node_map[n] for n in remaining if in_degree[n] == 0]
            if not batch:
                raise ValueError("Detected a cycle or unreachable stages.")
            batches.append(batch)
            for stage in batch:
                remaining.remove(stage.name)
                for neighbor in adjacency.get(stage.name, []):
                    if neighbor in remaining:
                        in_degree[neighbor] -= 1
        return batches


class Orchestrator:
    """Executes pipelines from config, managing stage lifecycle and error handling."""

    def __init__(self) -> None:
        self._active_runs: dict[str, Any] = {}

    def resolve(self, config: PipelineConfig) -> PipelineDAG:
        """Convert a validated config into an executable DAG."""
        nodes = [
            StageNode(
                name=stage["name"],
                plugin_category=stage["category"],
                plugin_name=stage["plugin"],
                depends_on=stage.get("depends_on", []),
                config=stage.get("config", {}),
            )
            for stage in config.stages
        ]
        return PipelineDAG(stages=nodes, config=config)

    async def run_pipeline(self, dag: PipelineDAG, experiment_id: str) -> None:
        """Execute a resolved DAG for a given experiment.

        This is the main entry point called by the API background task.
        Actual stage execution is delegated to StageExecutor; this method
        handles the orchestration lifecycle (resolve, execute, emit events).
        """
        # TODO: Implement in Phase 1 — wire up StageExecutor, event emission,
        # blob storage for I/O refs, and status updates to DB.
        raise NotImplementedError
