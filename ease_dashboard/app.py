"""EASE Dashboard — Streamlit app (MVP).

Run with:
    streamlit run ease_dashboard/app.py

Connects to the FastAPI backend at http://localhost:8000.
"""

from __future__ import annotations

import httpx
import streamlit as st

API_BASE = "http://localhost:8000"

st.set_page_config(
    page_title="EASE Dashboard",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.title("⚡ EASE — Energy-Aware Software Engineering")
st.markdown("### Analyze, optimize, and benchmark software energy efficiency.")

# ------------------------------------------------------------------
# Sidebar
# ------------------------------------------------------------------

st.sidebar.header("Navigation")
page = st.sidebar.radio("Go to", ["Projects", "Experiments", "Plugins", "About"])

# ------------------------------------------------------------------
# Projects page
# ------------------------------------------------------------------

if page == "Projects":
    st.header("Projects")

    with st.expander("Register New Project", expanded=False):
        with st.form("register_project"):
            name = st.text_input("Project Name")
            root_path = st.text_input("Root Path")
            language = st.text_input("Language", value="python")
            if st.form_submit_button("Register"):
                try:
                    resp = httpx.post(
                        f"{API_BASE}/projects",
                        json={"name": name, "root_path": root_path, "language": language},
                        timeout=10,
                    )
                    if resp.is_success:
                        st.success(f"Project registered: {resp.json()['id']}")
                    else:
                        st.error(f"Error: {resp.text}")
                except Exception as exc:
                    st.error(f"Connection failed: {exc}")

    try:
        resp = httpx.get(f"{API_BASE}/projects", timeout=10)
        if resp.is_success:
            projects = resp.json()
            if projects:
                st.subheader("Registered Projects")
                for proj in projects:
                    with st.container(border=True):
                        col1, col2, col3 = st.columns([2, 1, 1])
                        col1.write(f"**{proj['name']}**")
                        col2.write(f"`{proj['language']}`")
                        col3.write(f"_{proj['id'][:8]}..._")
                        if st.button("View Experiments", key=proj["id"]):
                            st.session_state["selected_project"] = proj["id"]
            else:
                st.info("No projects registered yet.")
    except Exception as exc:
        st.warning(f"Cannot connect to API at {API_BASE}: {exc}")

# ------------------------------------------------------------------
# Experiments page
# ------------------------------------------------------------------

elif page == "Experiments":
    st.header("Experiments")
    st.info("Experiment management coming soon. Run experiments via the API.")

    try:
        resp = httpx.get(f"{API_BASE}/experiments?limit=10", timeout=10)
        if resp.is_success:
            experiments = resp.json()
            if experiments:
                st.subheader("Recent Experiments")
                st.dataframe(
                    [
                        {
                            "ID": e["id"][:8],
                            "Status": e["status"],
                            "Created": e["created_at"][:19],
                            "Completed": (e.get("completed_at") or "")[:19] if e.get("completed_at") else "—",
                        }
                        for e in experiments
                    ]
                )
    except Exception:
        pass

# ------------------------------------------------------------------
# Plugins page
# ------------------------------------------------------------------

elif page == "Plugins":
    st.header("Plugin Registry")
    try:
        resp = httpx.get(f"{API_BASE}/plugins", timeout=10)
        if resp.is_success:
            data = resp.json()
            st.metric("Total Plugins", data["total"])
            for category, plugin_list in data["plugins"].items():
                with st.expander(f"{category} ({len(plugin_list)})"):
                    for plugin in plugin_list:
                        st.code(plugin)
    except Exception as exc:
        st.warning(f"Cannot connect to API: {exc}")

# ------------------------------------------------------------------
# About page
# ------------------------------------------------------------------

else:
    st.header("About EASE")
    st.markdown("""
    **EASE** (Energy-Aware Software Engineering Platform) helps developers:

    - **Analyze** source code for quality, complexity, and energy-impacting patterns
    - **Optimize** code automatically using industry-standard tools
    - **Validate** that optimizations don't break correctness
    - **Benchmark** runtime and energy consumption differences
    - **Compare** results across strategies and visualize improvements

    ### Architecture

    - **Backend:** FastAPI + SQLAlchemy + SQLite (→ PostgreSQL in Phase 2)
    - **Dashboard:** Streamlit (→ React in Phase 2)
    - **Plugins:** Python entry-points based discovery
    - **Isolation:** Copy-on-write workspace per experiment

    ### Quick Start

    ```bash
    pip install -e ".[dev]"
    uvicorn ease_api.main:app --reload --port 8000  # Terminal 1
    streamlit run ease_dashboard/app.py               # Terminal 2
    ```
    """)

# ------------------------------------------------------------------
# Footer
# ------------------------------------------------------------------

st.sidebar.markdown("---")
st.sidebar.caption("EASE v0.1.0 — MVP")
