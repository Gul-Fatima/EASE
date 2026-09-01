"""FastAPI dependency injection — provides database sessions, blob store, and workspace manager."""

from __future__ import annotations

from ease_core.config import AppSettings
from ease_core.plugins.registry import PluginRegistry, discover_plugins
from ease_core.storage import BlobStore, DatabaseManager
from ease_core.workspace import WorkspaceManager
from sqlalchemy.orm import Session


# Singleton services

_settings = AppSettings()

_db_manager = DatabaseManager(
    database_url=_settings.database_url
)

_blob_store = BlobStore(
    base_dir=_settings.artifacts_dir
)

_workspace_manager = WorkspaceManager(
    base_dir=_settings.workspaces_dir
)

_plugin_registry: PluginRegistry | None = None


def get_settings() -> AppSettings:
    return _settings


def get_db() -> DatabaseManager:
    return _db_manager


def get_db_session():
    """Return a synchronous database session with proper cleanup."""
    session = _db_manager.get_session()

    try:
        yield session
    finally:
        session.close()


def get_blob_store() -> BlobStore:
    return _blob_store


def get_workspace_manager() -> WorkspaceManager:
    return _workspace_manager


def get_plugin_registry() -> PluginRegistry:
    global _plugin_registry

    if _plugin_registry is None:
        _plugin_registry = discover_plugins()

    return _plugin_registry