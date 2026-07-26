"""REST API router for experiment management.

Endpoints:
    POST   /projects/{id}/experiments    Trigger a pipeline run (async)
    GET    /experiments/{id}             Experiment status + full result
    GET    /experiments/{id}/stages      Stage-by-stage log/status
    GET    /experiments                  History/list
    POST   /experiments/compare          Compare multiple experiments
"""

from __future__ import annotations

import uuid
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ease_api.deps import get_db_session
from ease_core.models import (
    CompareRequest,
    ExperimentCreate,
    ExperimentModel,
    ExperimentResponse,
    ProjectModel,
    StageRunModel,
    StageRunResponse,
)

router = APIRouter(tags=["experiments"])


@router.post("/projects/{project_id}/experiments", response_model=ExperimentResponse, status_code=202)
def create_experiment(
    project_id: str,
    payload: ExperimentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db_session),
) -> ExperimentResponse:
    """Trigger a new experiment pipeline run (async — returns 202 immediately)."""
    project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    experiment = ExperimentModel(
        id=str(uuid.uuid4()),
        project_id=project_id,
        pipeline_config=payload.config_overrides or {},
        status="PENDING",
    )
    db.add(experiment)
    db.commit()
    db.refresh(experiment)

    # TODO: Enqueue background pipeline execution
    # background_tasks.add_task(run_pipeline, experiment.id)

    return ExperimentResponse.model_validate(experiment)


@router.get("/experiments/{experiment_id}", response_model=ExperimentResponse)
def get_experiment(
    experiment_id: str,
    db: Session = Depends(get_db_session),
) -> ExperimentResponse:
    """Retrieve experiment status and results."""
    experiment = db.query(ExperimentModel).filter(ExperimentModel.id == experiment_id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return ExperimentResponse.model_validate(experiment)


@router.get("/experiments/{experiment_id}/stages", response_model=list[StageRunResponse])
def get_experiment_stages(
    experiment_id: str,
    db: Session = Depends(get_db_session),
) -> list[StageRunResponse]:
    """Retrieve stage-by-stage execution details for an experiment."""
    stages = db.query(StageRunModel).filter(StageRunModel.experiment_id == experiment_id).all()
    return [StageRunResponse.model_validate(s) for s in stages]


@router.get("/experiments", response_model=list[ExperimentResponse])
def list_experiments(
    project_id: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db_session),
) -> list[ExperimentResponse]:
    """List experiments, optionally filtered by project."""
    query = db.query(ExperimentModel)
    if project_id:
        query = query.filter(ExperimentModel.project_id == project_id)
    experiments = query.order_by(ExperimentModel.created_at.desc()).limit(limit).all()
    return [ExperimentResponse.model_validate(e) for e in experiments]


@router.post("/experiments/compare")
def compare_experiments(
    payload: CompareRequest,
    db: Session = Depends(get_db_session),
) -> dict:
    """Compare multiple experiments and compute deltas."""
    experiments = (
        db.query(ExperimentModel)
        .filter(ExperimentModel.id.in_(payload.experiment_ids))
        .all()
    )
    if len(experiments) != len(payload.experiment_ids):
        raise HTTPException(status_code=404, detail="One or more experiments not found")

    # TODO: Full comparison logic — compute runtime/energy/smell deltas
    return {
        "experiment_ids": payload.experiment_ids,
        "comparison": "Comparison logic not yet implemented.",
    }
