import json
import threading

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from modules.energy_estimation.project import Project
from modules.energy_estimation.executor import ProjectExecutor
from modules.energy_estimation.estimator import EnergyEstimator


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="OASIS Energy Estimation API",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ACTIVE RUN REGISTRY
#
# Lets the Stop endpoint reach the measurement that is
# currently running (needed for infinite processes like a
# PHP website).
# ============================================================

_active_run = {
    "estimator": None,
    "executor": None,
}

_active_run_lock = threading.Lock()


def _set_active_run(estimator, executor):
    with _active_run_lock:
        _active_run["estimator"] = estimator
        _active_run["executor"] = executor


def _clear_active_run():
    with _active_run_lock:
        _active_run["estimator"] = None
        _active_run["executor"] = None


# ============================================================
# REQUEST MODEL
# ============================================================

class EnergyRequest(BaseModel):
    project_path: str
    command: str
    timeout: int = 300
    # For PHP servers / other infinite processes:
    # flush CodeCarbon metrics every N seconds while running.
    continuous: bool = False
    interval_seconds: int = Field(default=10, ge=1, le=300)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "application": "OASIS",
        "module": "Energy Estimation",
        "status": "running",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health():
    return {"status": "healthy"}


def _enrich_with_project(result: dict, project: Project) -> dict:
    result["project_path"] = str(project.project_path)
    result["file_count"] = project.get_file_count()
    return result


# ============================================================
# ENERGY ESTIMATION (finite processes)
# ============================================================

@app.post("/api/energy/estimate")
def estimate_energy(request: EnergyRequest):
    try:
        print()
        print("=" * 70)
        print("                 OASIS API REQUEST")
        print("=" * 70)
        print(f"Project Path : {request.project_path}")
        print(f"Command      : {request.command}")
        print(f"Timeout      : {request.timeout}")
        print(f"Continuous   : {request.continuous}")

        if request.continuous:
            raise HTTPException(
                status_code=400,
                detail=(
                    "For continuous / infinite processes use "
                    "POST /api/energy/estimate/stream"
                ),
            )

        project = Project(request.project_path)

        executor = ProjectExecutor(
            command=request.command,
            working_directory=str(project.project_path),
            timeout=request.timeout,
        )

        estimator = EnergyEstimator(output_dir="results")
        result = estimator.estimate(executor)
        result = _enrich_with_project(result, project)

        print()
        print("Returning CodeCarbon measurement to frontend...")
        print("=" * 70)

        return result

    except HTTPException:
        raise

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        print()
        print("OASIS BACKEND ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# CONTINUOUS ENERGY ESTIMATION (infinite processes)
# Emits one SSE event every interval_seconds (default 10s)
# ============================================================

@app.post("/api/energy/estimate/stream")
def estimate_energy_stream(request: EnergyRequest):
    """
    Stream live CodeCarbon metrics for long-running workloads
    (PHP built-in server, Flask, etc.).

    Each Server-Sent Event is a JSON metrics snapshot.
    The last event has ``final: true``.
    """

    try:
        print()
        print("=" * 70)
        print("           OASIS CONTINUOUS API REQUEST")
        print("=" * 70)
        print(f"Project Path : {request.project_path}")
        print(f"Command      : {request.command}")
        print(f"Duration     : {request.timeout}s")
        print(f"Interval     : {request.interval_seconds}s")

        project = Project(request.project_path)

        executor = ProjectExecutor(
            command=request.command,
            working_directory=str(project.project_path),
            timeout=request.timeout,
        )

        estimator = EnergyEstimator(output_dir="results")

        def event_generator():
            _set_active_run(estimator, executor)
            try:
                for snapshot in estimator.estimate_continuous(
                    executor,
                    interval_seconds=request.interval_seconds,
                    duration_seconds=request.timeout,
                ):
                    snapshot = _enrich_with_project(
                        snapshot,
                        project,
                    )
                    payload = json.dumps(snapshot, default=str)
                    yield f"data: {payload}\n\n"

            except Exception as e:
                error_payload = json.dumps(
                    {
                        "error": str(e),
                        "final": True,
                        "execution_status": "failed",
                    }
                )
                yield f"data: {error_payload}\n\n"

            finally:
                _clear_active_run()

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        print()
        print("OASIS BACKEND ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# STOP A RUNNING CONTINUOUS MEASUREMENT
# ============================================================

@app.post("/api/energy/stop")
def stop_energy_measurement():
    """
    Stop the currently running continuous measurement.

    The measured process (e.g. a PHP website) and its whole
    process tree are terminated, CodeCarbon performs a final
    flush, and the stream emits its final snapshot.
    """

    with _active_run_lock:
        estimator = _active_run["estimator"]
        executor = _active_run["executor"]

    if estimator is None:
        raise HTTPException(
            status_code=409,
            detail="No energy measurement is currently running.",
        )

    print()
    print("=" * 70)
    print("           OASIS STOP REQUEST RECEIVED")
    print("=" * 70)

    # 1. Signal the measurement loop to finish.
    estimator.request_stop()

    # 2. If the loop is sleeping between intervals, killing the
    #    process directly also unblocks it (poll() will report
    #    "not running" on the next iteration).
    if executor is not None and executor.is_running():
        try:
            executor.stop()
        except Exception as e:
            print("Executor stop warning:", e)

    return {
        "status": "stopping",
        "detail": (
            "Measurement is stopping. Final metrics follow "
            "on the measurement stream."
        ),
    }
