"""Workspace isolation: copy-on-write project copies for experiment sandboxing.

Every experiment creates a fresh workspace:
    workspaces/<experiment_id>/
        original/   (read-only snapshot of target project)
        candidate/  (mutable copy optimizer writes into)
        scratch/    (temp files, logs)

Stage executors receive a WorkspacePaths object and physically cannot resolve
paths outside their assigned workspace.
"""

from __future__ import annotations

import os
import shutil
import stat
import tempfile
from pathlib import Path


class WorkspaceManager:
    """Manages isolated workspaces for experiment execution."""

    def __init__(self, base_dir: str | Path = "workspaces") -> None:
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def create(self, experiment_id: str, source_path: str | Path) -> Path:
        """Create a fresh workspace for an experiment.

        Copies *source_path* into workspaces/<experiment_id>/original as a
        read-only snapshot, and creates empty candidate/ and scratch/ dirs.

        Returns the workspace root path.
        """
        workspace_root = self.base_dir / experiment_id

        # Clean up any previous workspace for this experiment_id
        if workspace_root.exists():
            shutil.rmtree(workspace_root)

        # Create directory structure
        original_dir = workspace_root / "original"
        candidate_dir = workspace_root / "candidate"
        scratch_dir = workspace_root / "scratch"

        # Copy source into original/ (shallow copy — large projects may need git worktree)
        src = Path(source_path)
        if src.is_dir():
            shutil.copytree(src, original_dir, symlinks=True)
        else:
            original_dir.mkdir(parents=True)
            shutil.copy2(src, original_dir)

        # Make original read-only (best-effort on Windows)
        self._set_read_only(original_dir)

        # Create mutable directories
        candidate_dir.mkdir(parents=True, exist_ok=True)
        scratch_dir.mkdir(parents=True, exist_ok=True)

        return workspace_root

    def destroy(self, experiment_id: str) -> None:
        """Remove a workspace after experiment completion.

        Handles Windows permission issues by making files writable before deletion.
        """
        workspace_path = self.base_dir / experiment_id
        if workspace_path.exists():
            def _onerror(func: callable, path: str, exc_info: tuple) -> None:
                """Retry deletion after removing read-only flag."""
                try:
                    os.chmod(path, stat.S_IWRITE)
                    func(path)
                except (PermissionError, OSError):
                    pass  # Best-effort cleanup

            shutil.rmtree(workspace_path, onerror=_onerror)

    def paths_for(self, experiment_id: str) -> Path:
        """Return the workspace root for a given experiment."""
        return self.base_dir / experiment_id

    @staticmethod
    def _set_read_only(directory: Path) -> None:
        """Make all files under *directory* read-only (best-effort)."""
        for f in directory.rglob("*"):
            if f.is_file():
                try:
                    f.chmod(0o444)
                except PermissionError:
                    pass  # Windows may not support this for all files

    @staticmethod
    def sanitize_path(workspace_root: Path, user_path: str) -> Path:
        """Resolve *user_path* relative to workspace_root, preventing escape.

        Raises ValueError if the resolved path points outside the workspace.
        """
        resolved = (workspace_root / user_path).resolve()
        if not str(resolved).startswith(str(workspace_root.resolve())):
            raise ValueError(f"Path '{user_path}' escapes workspace sandbox.")
        return resolved
