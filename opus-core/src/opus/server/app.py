"""
opus.server.app — the FastAPI app that powers `opus serve`.

Endpoints
---------

  GET  /                       — single-page web UI (inline HTML)
  GET  /api/status             — { provider, version, models }
  POST /api/query              — start a deliberation, returns { run_id }
  GET  /api/stream/{run_id}    — SSE: 'phase' / 'record' / 'complete' events

Architecture
------------

A single in-memory ``_RunRegistry`` holds active deliberations. Each
``POST /api/query`` kicks off a background ``asyncio.Task`` that runs the
Hive against a fresh Blackboard, while a poller pushes new Records into
the run's SSE queue every 150ms. When the Hive finishes, a terminal
``complete`` event ships the verdict, total cost, and wall time.

The whole thing is single-process and small enough to be read in one
sitting. Tested against a MockProvider with FastAPI's TestClient so
the entire flow exercises offline.
"""

from __future__ import annotations

import asyncio
import json
import time
import uuid
import webbrowser
from dataclasses import dataclass, field
from typing import Any

from ..agents.base import Budget
from ..blackboard import InMemoryBlackboard, Record, RecordType
from ..hive import Hive
from ..llm.client import LLMClient
from .ui import INDEX_HTML

# Imports we only use when running the server; FastAPI is an optional
# `[serve]` extra so we want a clear error if it isn't installed.
try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
    from pydantic import BaseModel, Field
except ImportError as e:  # pragma: no cover — import-time guard
    raise ImportError(
        "opus.server requires the [serve] extra. Install with:\n"
        "    uv pip install -e \".[serve]\"\n"
        "or:\n"
        "    pip install fastapi uvicorn"
    ) from e


# ──────────────────────────────────────────────────────────────────
# In-memory run registry — one deliberation = one entry
# ──────────────────────────────────────────────────────────────────


@dataclass
class _Run:
    """Live state for one in-flight or just-completed deliberation."""

    run_id: str
    query: str
    started_at: float
    blackboard: InMemoryBlackboard
    queue: asyncio.Queue
    task: asyncio.Task | None = None
    seen_count: int = 0
    poll_task: asyncio.Task | None = None
    completed: bool = False


@dataclass
class _RunRegistry:
    runs: dict[str, _Run] = field(default_factory=dict)

    def add(self, run: _Run) -> None:
        self.runs[run.run_id] = run

    def get(self, run_id: str) -> _Run | None:
        return self.runs.get(run_id)


# ──────────────────────────────────────────────────────────────────
# Request / response shapes
# ──────────────────────────────────────────────────────────────────


class QueryBody(BaseModel):
    query: str = Field(..., min_length=1, max_length=4000)
    budget_usd: float | None = None


class QueryAccepted(BaseModel):
    run_id: str


# ──────────────────────────────────────────────────────────────────
# SSE serialisation helpers
# ──────────────────────────────────────────────────────────────────


def _sse_event(event: str, payload: dict[str, Any]) -> str:
    """Format one Server-Sent Event."""
    return f"event: {event}\ndata: {json.dumps(payload, default=str)}\n\n"


def _record_to_payload(r: Record, *, running_cost_usd: float) -> dict[str, Any]:
    """Project a Record into a JSON-safe dict for the client."""
    return {
        "id": str(r.id),
        "agent_id": r.agent_id,
        "agent_role": r.agent_role.value,
        "type": r.type.value,
        "content": r.content,
        "confidence": r.confidence,
        "model": r.model,
        "cost_estimate": r.cost_estimate,
        "timestamp": r.timestamp.isoformat() if r.timestamp else None,
        "running_cost_usd": running_cost_usd,
    }


# ──────────────────────────────────────────────────────────────────
# The app factory
# ──────────────────────────────────────────────────────────────────


def create_app(
    llm: LLMClient,
    *,
    hive_kwargs: dict[str, Any] | None = None,
    poll_interval_seconds: float = 0.15,
) -> FastAPI:
    """Build the FastAPI app. Pass a pre-configured LLMClient — the app
    reuses it across requests so the budget tracking stays coherent.

    ``hive_kwargs`` is passed through to ``Hive(...)`` so callers can
    tune agent counts, rounds, etc. Defaults to the Hive's own defaults.
    """
    app = FastAPI(
        title="OPUS · Local",
        version="0.2.0",
        docs_url=None,   # keep the surface intentionally small
        redoc_url=None,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    registry = _RunRegistry()
    hive_kwargs = hive_kwargs or {}

    # ── GET / ─ the UI ──────────────────────────────────────────

    @app.get("/", response_class=HTMLResponse)
    async def index() -> HTMLResponse:
        return HTMLResponse(content=INDEX_HTML, status_code=200)

    # ── GET /api/status ─────────────────────────────────────────

    @app.get("/api/status")
    async def status() -> JSONResponse:
        return JSONResponse({
            "provider": llm.provider_name,
            "models": {
                "worker":   llm.default_worker_model,
                "scout":    llm.default_scout_model,
                "judge":    llm.default_judge_model,
                "verifier": llm.default_verifier_model,
            },
            "spent_usd": llm.spent_usd,
            "version": "0.2.0",
        })

    # ── POST /api/query ─────────────────────────────────────────

    @app.post("/api/query", response_model=QueryAccepted)
    async def post_query(body: QueryBody) -> QueryAccepted:
        run_id = uuid.uuid4().hex[:12]
        run = _Run(
            run_id=run_id,
            query=body.query,
            started_at=time.time(),
            blackboard=InMemoryBlackboard(),
            queue=asyncio.Queue(),
        )

        async def run_hive() -> None:
            try:
                # Each request gets its own Hive instance so provenance
                # is fresh. The Blackboard is injected so the poller
                # below can stream records as they're written.
                hive = Hive(llm=llm, **hive_kwargs)
                budget = Budget(max_total_usd=body.budget_usd)
                await run.queue.put(_sse_event("phase", {
                    "phase": "deliberating",
                    "label": "Scouts gathering…",
                }))
                result = await hive.run(
                    body.query,
                    budget=budget,
                    blackboard=run.blackboard,
                )
                wall = time.time() - run.started_at
                await run.queue.put(_sse_event("complete", {
                    "accepted": bool(result.accepted),
                    "answer": result.answer,
                    "confidence": result.confidence,
                    "cost_usd": result.summary.total_cost_usd,
                    "wall_seconds": wall,
                    "total_records": result.summary.total_records,
                    "provider": llm.provider_name,
                }))
            except Exception as e:  # noqa: BLE001 — surface as an error event
                await run.queue.put(_sse_event("error", {"message": str(e)}))
            finally:
                run.completed = True

        async def poll_blackboard() -> None:
            """Push any new Records on the Blackboard to the run's queue
            every `poll_interval_seconds`, until the run completes."""
            running_cost = 0.0
            while not run.completed:
                snap = run.blackboard.snapshot()
                if len(snap) > run.seen_count:
                    new_recs = snap[run.seen_count :]
                    run.seen_count = len(snap)
                    for r in new_recs:
                        if r.type == RecordType.PROVENANCE_SUMMARY:
                            continue
                        running_cost += float(r.cost_estimate or 0.0)
                        await run.queue.put(_sse_event("record",
                            _record_to_payload(r, running_cost_usd=running_cost),
                        ))
                await asyncio.sleep(poll_interval_seconds)
            # One final sweep after completion so trailing records get sent.
            snap = run.blackboard.snapshot()
            if len(snap) > run.seen_count:
                for r in snap[run.seen_count :]:
                    if r.type == RecordType.PROVENANCE_SUMMARY:
                        continue
                    running_cost += float(r.cost_estimate or 0.0)
                    await run.queue.put(_sse_event("record",
                        _record_to_payload(r, running_cost_usd=running_cost),
                    ))
            # Signal end of stream.
            await run.queue.put(None)

        run.task = asyncio.create_task(run_hive())
        run.poll_task = asyncio.create_task(poll_blackboard())
        registry.add(run)
        return QueryAccepted(run_id=run_id)

    # ── GET /api/stream/{run_id} ─ SSE ──────────────────────────

    @app.get("/api/stream/{run_id}")
    async def stream(run_id: str) -> StreamingResponse:
        run = registry.get(run_id)
        if run is None:
            raise HTTPException(status_code=404, detail="run_id not found")

        async def event_generator():
            while True:
                item = await run.queue.get()
                if item is None:  # sentinel = stream over
                    return
                yield item

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",  # disable nginx buffering, harmless elsewhere
            },
        )

    return app


# ──────────────────────────────────────────────────────────────────
# `opus serve` plumbing — boot uvicorn with the configured app
# ──────────────────────────────────────────────────────────────────


def run_server(
    llm: LLMClient,
    *,
    host: str = "127.0.0.1",
    port: int = 8000,
    open_browser: bool = True,
    hive_kwargs: dict[str, Any] | None = None,
) -> None:
    """Synchronously boot the server. Used by `opus serve` and as a one-call
    convenience for any Python script that wants to launch the UI."""
    try:
        import uvicorn
    except ImportError as e:  # pragma: no cover
        raise ImportError(
            "opus serve requires the [serve] extra. Install with:\n"
            "    uv pip install -e \".[serve]\""
        ) from e

    app = create_app(llm, hive_kwargs=hive_kwargs)

    url = f"http://{host}:{port}"
    if open_browser:
        try:
            webbrowser.open(url)
        except Exception:  # noqa: BLE001 — non-fatal in headless contexts
            pass

    uvicorn.run(app, host=host, port=port, log_level="info")
