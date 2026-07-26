"""Unit tests for the PluginRegistry discovery mechanism."""

from __future__ import annotations

from ease_core.plugins.registry import PluginRegistry


class TestPluginRegistry:
    def setup_method(self) -> None:
        self.registry = PluginRegistry()

    def test_discover_analyzers(self) -> None:
        analyzers = self.registry.discover("ease.analyzers")
        assert "ruff" in analyzers
        assert "pylint" in analyzers
        assert "radon" in analyzers

    def test_discover_optimizers(self) -> None:
        optimizers = self.registry.discover("ease.optimizers")
        assert "black" in optimizers
        assert "autopep8" in optimizers
        assert "isort" in optimizers
        assert "rope" in optimizers

    def test_list_plugins(self) -> None:
        plugins = self.registry.list_plugins()
        assert "analyzers" in plugins
        assert "optimizers" in plugins
        assert "validators" in plugins
        assert "runners" in plugins
        assert "monitors" in plugins
        assert "reporters" in plugins

    def test_get_plugin(self) -> None:
        cls = self.registry.get("analyzers", "ruff")
        assert cls is not None
        assert hasattr(cls, "name")

    def test_get_raises_on_missing(self) -> None:
        import pytest
        with pytest.raises(KeyError):
            self.registry.get("analyzers", "nonexistent_plugin")
