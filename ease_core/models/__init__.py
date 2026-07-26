"""Pydantic schemas and SQLAlchemy ORM models for the EASE data model.

Core entities: Project, Experiment, StageRun, SmellReport, Candidate, ComparisonReport.

Pydantic schemas in this package define API contracts and validation.
SQLAlchemy models (declarative) define the persistence layer — same models
work on SQLite (MVP) and PostgreSQL (Phase 2) with only a connection-string change.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy.sql import func


# ======================================================================
# SQLAlchemy ORM Models
# ======================================================================

class Base(DeclarativeBase):
    pass


class ProjectModel(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    root_path = Column(Text, nullable=False)
    language = Column(String(50), default="python")
    vcs_ref = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    experiments = relationship("ExperimentModel", back_populates="project", cascade="all, delete-orphan")


class ExperimentModel(Base):
    __tablename__ = "experiments"

    id = Column(String(36), primary_key=True)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    pipeline_config = Column(JSON, nullable=False)
    hardware_fingerprint = Column(JSON, nullable=True)
    status = Column(String(20), default="PENDING")   # PENDING | RUNNING | COMPLETED | FAILED
    created_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)

    project = relationship("ProjectModel", back_populates="experiments")
    stage_runs = relationship("StageRunModel", back_populates="experiment", cascade="all, delete-orphan")
    candidates = relationship("CandidateModel", back_populates="experiment", cascade="all, delete-orphan")


class StageRunModel(Base):
    __tablename__ = "stage_runs"

    id = Column(String(36), primary_key=True)
    experiment_id = Column(String(36), ForeignKey("experiments.id"), nullable=False)
    stage_name = Column(String(100), nullable=False)
    plugin_name = Column(String(100), nullable=False)
    plugin_version = Column(String(50), nullable=True)
    input_ref = Column(String(255), nullable=True)
    output_ref = Column(String(255), nullable=True)
    status = Column(String(20), default="PENDING")
    started_at = Column(DateTime, nullable=True)
    finished_at = Column(DateTime, nullable=True)
    error = Column(Text, nullable=True)
    logs_ref = Column(String(255), nullable=True)

    experiment = relationship("ExperimentModel", back_populates="stage_runs")


class SmellReportModel(Base):
    __tablename__ = "smell_reports"

    id = Column(String(36), primary_key=True)
    stage_run_id = Column(String(36), ForeignKey("stage_runs.id"), nullable=False)
    category = Column(String(50), nullable=False)
    rule_id = Column(String(100), nullable=False)
    file_path = Column(Text, nullable=False)
    line = Column(Integer, nullable=True)
    severity = Column(Integer, default=5)
    tool_source = Column(String(50), nullable=False)


class CandidateModel(Base):
    __tablename__ = "candidates"

    id = Column(String(36), primary_key=True)
    experiment_id = Column(String(36), ForeignKey("experiments.id"), nullable=False)
    strategy_name = Column(String(100), nullable=False)
    source_blob_ref = Column(String(255), nullable=True)
    validation_result = Column(JSON, nullable=True)
    run_metrics = Column(JSON, nullable=True)
    energy_metrics = Column(JSON, nullable=True)

    experiment = relationship("ExperimentModel", back_populates="candidates")


class ComparisonReportModel(Base):
    __tablename__ = "comparison_reports"

    id = Column(String(36), primary_key=True)
    experiment_id = Column(String(36), ForeignKey("experiments.id"), nullable=False)
    baseline_candidate_id = Column(String(36), nullable=False)
    candidates = Column(JSON, nullable=False)     # list of candidate IDs
    deltas = Column(JSON, nullable=False)


# ======================================================================
# Pydantic API Schemas
# ======================================================================

class ProjectCreate(BaseModel):
    name: str = Field(..., max_length=255)
    root_path: str
    language: str = "python"


class ProjectResponse(BaseModel):
    id: str
    name: str
    root_path: str
    language: str
    vcs_ref: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ExperimentCreate(BaseModel):
    pipeline_yaml: Optional[str] = None
    config_overrides: dict[str, Any] = {}


class ExperimentResponse(BaseModel):
    id: str
    project_id: str
    pipeline_config: dict[str, Any]
    hardware_fingerprint: Optional[dict[str, Any]] = None
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class StageRunResponse(BaseModel):
    id: str
    experiment_id: str
    stage_name: str
    plugin_name: str
    plugin_version: Optional[str] = None
    status: str
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    error: Optional[str] = None

    model_config = {"from_attributes": True}


class CompareRequest(BaseModel):
    experiment_ids: list[str] = Field(..., min_length=2, max_length=10)


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "0.1.0"
