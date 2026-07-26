"""Persistence layer: SQLAlchemy engine/session management and content-addressed BlobStore.

MVP uses SQLite; Phase 2 upgrades to PostgreSQL with the same ORM models.
BlobStore keeps large artifacts out of the DB for performance and future S3 compatibility.
"""

from __future__ import annotations

import hashlib
import shutil
from pathlib import Path
from typing import Optional

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from ease_core.models import Base


class DatabaseManager:
    """Manages the SQLAlchemy engine and session lifecycle."""

    def __init__(self, database_url: str = "sqlite:///./ease.db") -> None:
        self.database_url = database_url
        self.engine = create_engine(database_url, echo=False)
        self.session_factory = sessionmaker(bind=self.engine)

    def create_all(self) -> None:
        """Create all tables (idempotent)."""
        Base.metadata.create_all(self.engine)

    def drop_all(self) -> None:
        """Drop all tables (use in tests only)."""
        Base.metadata.drop_all(self.engine)

    def get_session(self) -> Session:
        return self.session_factory()


class BlobStore:
    """Content-addressed blob storage on the local filesystem.

    Artifacts are stored as artifacts/<sha256>; the DB stores only the ref key.
    Phase 4: swap the filesystem backend for S3/MinIO behind the same put/get interface.
    """

    def __init__(self, base_dir: str | Path = "artifacts") -> None:
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def put(self, data: bytes) -> str:
        """Store *data* and return its content-addressed key (sha256 hex)."""
        key = hashlib.sha256(data).hexdigest()
        dest = self.base_dir / key
        if not dest.exists():
            dest.write_bytes(data)
        return key

    def put_text(self, text: str) -> str:
        """Store UTF-8 text and return its key."""
        return self.put(text.encode("utf-8"))

    def get(self, key: str) -> bytes:
        """Retrieve data by its content-addressed key."""
        path = self.base_dir / key
        if not path.exists():
            raise FileNotFoundError(f"Blob '{key}' not found in {self.base_dir}")
        return path.read_bytes()

    def get_text(self, key: str) -> str:
        """Retrieve UTF-8 text by key."""
        return self.get(key).decode("utf-8")

    def delete(self, key: str) -> None:
        """Remove a blob by key."""
        path = self.base_dir / key
        if path.exists():
            path.unlink()

    def clear(self) -> None:
        """Remove all blobs (use in tests)."""
        if self.base_dir.exists():
            shutil.rmtree(self.base_dir)
            self.base_dir.mkdir(parents=True)
