// bash
# From the OASIS root directory:
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

Or if you want to use port 8001 instead (which is clean):

// bash
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8001