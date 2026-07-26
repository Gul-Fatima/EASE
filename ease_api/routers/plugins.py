"""REST API router for plugin registry introspection.

Endpoints:
    GET    /plugins       List all registered plugins by category
"""

from __future__ import annotations

from fastapi import APIRouter, Depends

from ease_api.deps import get_plugin_registry
from ease_core.plugins.registry import PluginRegistry

router = APIRouter(prefix="/plugins", tags=["plugins"])


@router.get("")
def list_plugins(
    registry: PluginRegistry = Depends(get_plugin_registry),
) -> dict:
    """List all registered plugins grouped by category."""
    plugins = registry.list_plugins()
    return {"plugins": plugins, "total": sum(len(v) for v in plugins.values())}
