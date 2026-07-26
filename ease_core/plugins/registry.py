"""Plugin discovery and registry via Python packaging entry-points.

Usage
-----
    registry = PluginRegistry()
    registry.load_all()
    ruff_analyzer = registry.get("analyzers", "ruff")
"""

from __future__ import annotations

from typing import Any, Optional

from importlib.metadata import entry_points


class PluginRegistry:
    """Discovers and instantiates plugins registered via packaging entry-points.

    Plugins declare themselves in pyproject.toml under:
        [project.entry-points."ease.<category>"]
        my_plugin = "mymodule.plugins:MyPluginClass"
    """

    def __init__(self) -> None:
        self._groups: dict[str, dict[str, Any]] = {}

    # ------------------------------------------------------------------
    # Discovery
    # ------------------------------------------------------------------

    def discover(self, group: str) -> dict[str, Any]:
        """Return {name: class} for all entry points in *group*.

        Resolves dotted paths to the actual class (does not instantiate).
        Cached after first call per group.
        """
        if group in self._groups:
            return self._groups[group]

        eps = entry_points(group=group)
        resolved: dict[str, Any] = {}
        for ep in eps:
            try:
                resolved[ep.name] = ep.load()
            except Exception as exc:
                import warnings
                warnings.warn(f"Failed to load plugin '{ep.name}' in group '{group}': {exc}")
        self._groups[group] = resolved
        return resolved

    def load_all(self) -> None:
        """Discover all known EASE plugin groups."""
        for group in ("ease.analyzers", "ease.optimizers", "ease.validators",
                       "ease.runners", "ease.monitors", "ease.reporters", "ease.llm"):
            self.discover(group)

    # ------------------------------------------------------------------
    # Accessors
    # ------------------------------------------------------------------

    def list_plugins(self, category: Optional[str] = None) -> dict[str, list[str]]:
        """Return {category: [plugin_name, ...]}.

        If *category* is provided, return only that category's entries.
        """
        if category:
            full_group = f"ease.{category}"
            return {category: list(self.discover(full_group).keys())}
        result: dict[str, list[str]] = {}
        for group_key in ("analyzers", "optimizers", "validators",
                          "runners", "monitors", "reporters", "llm"):
            result[group_key] = list(self.discover(f"ease.{group_key}").keys())
        return result

    def get(self, category: str, name: str) -> Any:
        """Get a plugin class by category and name.

        Raises KeyError if the plugin is not registered.
        """
        group = f"ease.{category}"
        plugins = self.discover(group)
        if name not in plugins:
            raise KeyError(f"Plugin '{name}' not found in category '{category}'. "
                           f"Available: {list(plugins.keys())}")
        return plugins[name]

    def instantiate(self, category: str, name: str, **kwargs: Any) -> Any:
        """Discover, load, and instantiate a plugin."""
        cls = self.get(category, name)
        return cls(**kwargs)


# Module-level convenience
_registry: Optional[PluginRegistry] = None


def discover_plugins() -> PluginRegistry:
    """Return the module-level singleton registry (discovered on first call)."""
    global _registry
    if _registry is None:
        _registry = PluginRegistry()
        _registry.load_all()
    return _registry
