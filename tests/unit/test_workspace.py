"""Unit tests for the WorkspaceManager isolation functionality."""

from __future__ import annotations

import tempfile
from pathlib import Path

import pytest

from ease_core.workspace import WorkspaceManager


class TestWorkspaceManager:
    def setup_method(self) -> None:
        self.tmpdir = Path(tempfile.mkdtemp())
        self.manager = WorkspaceManager(base_dir=str(self.tmpdir / "workspaces"))
        self.source = self.tmpdir / "source"
        self.source.mkdir()
        (self.source / "main.py").write_text("x = 1\n")
        (self.source / "utils.py").write_text("y = 2\n")

    def test_create_workspace(self) -> None:
        workspace = self.manager.create("exp-1", self.source)
        assert (workspace / "original").exists()
        assert (workspace / "candidate").exists()
        assert (workspace / "scratch").exists()
        assert (workspace / "original" / "main.py").exists()
        assert (workspace / "original" / "utils.py").exists()

    def test_destroy_workspace(self) -> None:
        self.manager.create("exp-2", self.source)
        self.manager.destroy("exp-2")
        assert not (self.tmpdir / "workspaces" / "exp-2").exists()

    def test_sanitize_path_allows_internal(self) -> None:
        workspace = self.manager.create("exp-3", self.source)
        resolved = self.manager.sanitize_path(workspace, "candidate/new_file.py")
        assert str(resolved).startswith(str((workspace / "candidate").resolve()))

    def test_sanitize_path_blocks_escape(self) -> None:
        workspace = self.manager.create("exp-4", self.source)
        with pytest.raises(ValueError, match="escapes workspace"):
            self.manager.sanitize_path(workspace, "../../etc/passwd")
