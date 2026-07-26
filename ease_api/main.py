"""EASE API — FastAPI application entry point.

Run with:
    uvicorn ease_api.main:app --reload --port 8000
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ease_api.deps import get_db
from ease_api.routers import experiments, plugins, projects
from ease_core.models import HealthResponse

app = FastAPI(
    title="EASE — Energy-Aware Software Engineering Platform",
    version="0.1.0",
    description="Analyze, optimize, validate, and benchmark software energy efficiency.",
)

# ------------------------------------------------------------------
# Middleware
# ------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------
# Routers
# ------------------------------------------------------------------

app.include_router(projects.router)
app.include_router(experiments.router)
app.include_router(plugins.router)


# ------------------------------------------------------------------
# Startup / Shutdown
# ------------------------------------------------------------------

@app.on_event("startup")
async def startup() -> None:
    """Initialize the database and create tables on first run."""
    db_manager = get_db()
    db_manager.create_all()


# ------------------------------------------------------------------
# Health
# ------------------------------------------------------------------

@app.get("/health", response_model=HealthResponse, tags=["health"])
def health() -> HealthResponse:
    return HealthResponse(status="ok", version="0.1.0")
