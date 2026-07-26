"""REST API router for project management.

Endpoints:
    POST   /projects           Register a new project
    GET    /projects/{id}       Project detail + smell summary
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ease_api.deps import get_db_session
from ease_core.models import ProjectCreate, ProjectModel, ProjectResponse

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ProjectResponse, status_code=201)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db_session),
) -> ProjectResponse:
    """Register a new project for analysis."""
    project = ProjectModel(
        id=str(uuid.uuid4()),
        name=payload.name,
        root_path=payload.root_path,
        language=payload.language,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return ProjectResponse.model_validate(project)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: str,
    db: Session = Depends(get_db_session),
) -> ProjectResponse:
    """Retrieve project details."""
    project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse.model_validate(project)


@router.get("", response_model=list[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db_session),
) -> list[ProjectResponse]:
    """List all registered projects."""
    projects = db.query(ProjectModel).all()
    return [ProjectResponse.model_validate(p) for p in projects]
