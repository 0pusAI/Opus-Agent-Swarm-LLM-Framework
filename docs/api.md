# OPUS API Reference

> *How to use the colony, programmatically and from the CLI.*

OPUS exposes its full architecture through three surfaces — a **library API** (`from opus import ...`), a **CLI** (`opus query "..."`), and an **autogenesis loop** for autonomous use (`AutogenesisLoop`). All three call the same underlying engine. All three are open-source and run in your own process on your own keys.

This document covers all three, end-to-end.

---

## Table of contents

- [Install](#install)
- [Configuration](#configuration)
- [CLI](#cli)
- [Library API](#library-api)
  - [`Hive`](#hive)
  - [`LLMClient`](#llmclient)
  - [`Budget`](#budget)
  - [`RunResult`](#runresult)
- [Autogenesis loop](#autogenesis-loop)
  - [`AutogenesisLoop`](#autogenesisloop)
  - [`Step`](#step)
  - [Example: continuous self-improvement](#example-continuous-self-improvement)
- [Provenance & cost](#provenance--cost)
- [FAQ](#faq)

---

## Install

Requires Python 3.11+ and the [Anthropic API](https://www.anthropic.com/api) for the agents. The recommended package manager is [`uv`](https://docs.astral.sh/uv/).

```bash
git clone https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework
cd Opus-Agent-Swarm-LLM-Framework/opus-core
uv venv
uv pip install -e ".[dev]"
cp .env.example .env             # then paste your ANTHROPIC_API_KEY
pytest                            # 18/18 should pass
```

---

## Configuration

OPUS reads exactly one environment variable. Everything else is configured per-call.

| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | Your Anthropic API key. The colony reasons through this key, in your process, on your dime. Nothing routes through OPUS. |

Put it in a `.env` file at the `opus-core/` root, or set it in your shell.

---

## CLI

The CLI is the fastest path to a working colony. One verb. Reads `ANTHROPIC_API_KEY` from your environment.

```bash
opus query "What are the strongest arguments against my own thesis?"
```

What you get back, in order:

1. The colony's **answer** (verified, or surfaced with unresolved falsifications)
2. The total **cost** of the run, in honest USD
3. The path to the full **provenance trace** (a JSONL file with every Record, every parent_id, every model call, every cent)

### CLI flags

```bash
opus query "..." --scouts 3 --researchers 2 --critics 2 --synthesisers 1
opus query "..." --max-cost-usd 0.50
opus query "..." --trace-out ./traces/
```

Run `opus query --help` for the full list.

---

## Library API

The CLI is a thin wrapper around the library. Use the library when you want to embed OPUS in your own pipeline, build on top of it, or run the autogenesis loop.

### `Hive`

The orchestrator. One `Hive` per query.

```python
from opus.hive import Hive
from opus.llm.client import LLMClient
from opus.agents.base import Budget

llm = LLMClient()
hive = Hive(
    llm=llm,
    n_scouts=3,         # cheap retrieval agents (Sonnet)
    n_researchers=2,    # deliberators
    n_critics=2,        # adversarial readers
    n_synthesisers=1,   # combines into a final candidate
)

result = await hive.run(
    "What is the cleanest refactor for this module?",
    budget=Budget(max_cost_usd=0.50),
)

print(result.answer)
print(f"${result.summary.total_cost_usd:.4f}")
print(result.provenance_path)
```

The `Hive` constructor accepts:

| Param | Default | Purpose |
|---|---|---|
| `llm` | required | An `LLMClient` instance. The colony shares one client across all agents. |
| `n_scouts` | `3` | Number of Scout agents (cheap exploration on Sonnet). |
| `n_researchers` | `2` | Number of Researchers (Opus). |
| `n_critics` | `2` | Number of Critics (Opus). |
| `n_synthesisers` | `1` | Number of Synthesisers (Opus). |
| `n_verifiers` | `1` | Number of Verifier passes per round. |
| `max_rounds` | `3` | Hard cap on Worker rounds before surfacing what we have. |
| `epsilon` | `0.05` | If top-2 Borda scores are within ε, the Judge adjudicates. |

### `LLMClient`

A thin async wrapper around the Anthropic SDK with adaptive thinking, prompt caching, and cost tracking baked in.

```python
from opus.llm.client import LLMClient

llm = LLMClient()                # uses ANTHROPIC_API_KEY from env
# ... use it in one or more Hives ...
await llm.aclose()               # explicit cleanup; or use as async ctx mgr
```

You normally never call `LLMClient` directly — the `Hive` uses it. But it's there if you need to.

### `Budget`

Enforced by the Hive Core. Any agent that would exceed budget is short-circuited with a `verdict.budget_exhausted` Record.

```python
from opus.agents.base import Budget

Budget()                            # unbounded (default in v0)
Budget(max_cost_usd=0.50)           # cap by dollars
Budget(max_records=100)             # cap by total Record count
Budget(max_seconds=120)             # cap by wall clock
```

### `RunResult`

Returned by `hive.run(...)`.

```python
@dataclass
class RunResult:
    answer: str | dict           # the final synthesis (verified or surfaced)
    accepted: bool               # True if verification passed; False if the
                                 # colony surfaces with unresolved falsifications
    blackboard: Blackboard       # the full Blackboard at end-of-run; iterable
    summary: ProvenanceSummary   # totals: cost, tokens, wall-time, records
    provenance_path: Path | None # path to the JSONL trace, if writing was enabled
```

`summary` exposes:

```python
result.summary.total_cost_usd        # honest dollars
result.summary.wall_seconds          # real elapsed time
result.summary.total_records         # how many Records the colony wrote
result.summary.tokens_per_model      # {"claude-opus-4-7": ..., "claude-sonnet-4-6": ...}
```

---

## Autogenesis loop

The directed mode above asks the colony one question and gets back one verdict. The **autogenesis loop** is the autonomous mode: you hand the colony a *goal* and it runs the deliberation pattern recursively — deciding what to do next, implementing it, verifying it, and handing each verified step back to your callback.

This is the same pattern OPUS itself uses to ship its own updates. Implemented in `opus.autogenesis`.

### `AutogenesisLoop`

```python
from opus import Hive, LLMClient
from opus.autogenesis import AutogenesisLoop, Step

llm = LLMClient()
hive = Hive(llm=llm)

loop = AutogenesisLoop(
    hive=hive,
    goal="Improve and document this repository, honestly.",
)
```

Run it:

```python
async def apply(step: Step) -> None:
    """Called once per verified step. Decide what to do with it."""
    print(f"[{step.iteration}] {step.plan_answer[:80]}")
    print(f"  → {step.change_answer[:80]}")
    print(f"  ${step.total_cost_usd:.4f}")
    # ... open a PR, write a file, anything you want ...

steps = await loop.run(
    max_iterations=5,
    commit_handler=apply,
    stop_on_unverified=False,
    cooldown_seconds=2.0,
)
```

Parameters:

| Param | Default | Purpose |
|---|---|---|
| `max_iterations` | `10` | Hard cap. The loop never runs forever unless you ask it to. |
| `commit_handler` | `None` | Async callback called once per *verified* step. Skip it and verified steps still come back in the return value. |
| `stop_on_unverified` | `False` | If True, halt as soon as the colony fails to verify a change. |
| `cooldown_seconds` | `0.0` | Optional sleep between iterations. Useful for rate-limited backends or human-paced visibility. |

### `Step`

One iteration of the loop produces one `Step`:

```python
@dataclass(frozen=True)
class Step:
    iteration: int
    goal: str
    plan_answer: str           # what the colony decided to do
    plan_cost_usd: float
    change_answer: str         # the implementation
    change_cost_usd: float
    verified: bool             # True if Verifier accepted the change
    limitations: Optional[str] # what the colony admits it couldn't resolve
    total_cost_usd: float      # plan_cost + change_cost
```

### Example: continuous self-improvement

A 30-line script that points the colony at a repository and lets it improve documentation indefinitely. Drop a `commit_handler` in that actually opens PRs and you have a working autogenetic process.

```python
import asyncio
from pathlib import Path

from opus.autogenesis import AutogenesisLoop, Step
from opus.hive import Hive
from opus.llm.client import LLMClient

GOAL = "Improve the README of this repository for first-time users."

async def commit_handler(step: Step) -> None:
    out = Path(f"./autogenesis-output/step-{step.iteration:03d}.md")
    out.parent.mkdir(exist_ok=True)
    out.write_text(
        f"# Iteration {step.iteration} (verified={step.verified})\n\n"
        f"## Plan\n{step.plan_answer}\n\n"
        f"## Implementation\n{step.change_answer}\n"
    )
    print(f"  wrote {out}  (${step.total_cost_usd:.4f})")

async def main() -> None:
    llm = LLMClient()
    try:
        hive = Hive(llm=llm)
        loop = AutogenesisLoop(hive=hive, goal=GOAL)
        await loop.run(max_iterations=10, commit_handler=commit_handler)
    finally:
        await llm.aclose()

asyncio.run(main())
```

A full runnable demo lives at [`opus-core/examples/autogenesis_demo.py`](../opus-core/examples/autogenesis_demo.py).

---

## Introspection — the colony reading itself

`opus.introspection` is the bridge between the autogenesis loop and the *actual codebase* it works on. Without it, `AutogenesisLoop` needs a human to hand it a goal. With it, the colony can walk its own repo, surface structured observations, and feed them back into the Hive as deliberation context. The result: continuous, end-to-end autogenesis.

```python
from pathlib import Path
from opus import Hive, LLMClient, AutogenesisLoop
from opus.introspection import RepoAnalyst, surface_bottlenecks

llm  = LLMClient()
hive = Hive(llm=llm)

# 1. Scan the repository.
analyst = RepoAnalyst(repo_root=Path("."))
observations = analyst.scan()
# observations is a list of structured findings:
#   Observation(kind="todo", location="opus-core/src/opus/hive.py:142", ...)
#   Observation(kind="stale_link", location="docs/whitepaper.md", ...)
#   Observation(kind="missing_docstring", location=..., ...)
#   Observation(kind="test_gap", location=..., ...)

# 2. Let the colony decide which ones matter most.
verdict = await surface_bottlenecks(hive, observations, n=3)

# 3. Feed the verdict back as the goal for an autogenesis loop.
loop = AutogenesisLoop(hive=hive, goal=str(verdict.answer))
await loop.run(max_iterations=3, commit_handler=apply)
```

### `Observation`

```python
@dataclass(frozen=True)
class Observation:
    kind: str           # "todo" | "stale_link" | "missing_docstring" | "test_gap"
    location: str       # "path:line" or just "path"
    summary: str        # one-line description
    severity: int = 1   # 1 (minor) to 5 (urgent)
```

### `RepoAnalyst`

Four scanners ship out of the box. All four are also run together by `scan()`, which returns the merged list sorted by severity.

| Scanner | What it finds |
|---|---|
| `find_todos()` | `TODO` / `FIXME` / `HACK` / `XXX` comments in `.py`, `.ts`, `.tsx`, `.md`, etc. |
| `find_stale_links()` | Markdown links pointing at files that don't exist. |
| `find_missing_docstrings()` | Public Python functions and classes with no docstring. |
| `find_test_gaps()` | Source modules under `src/` with no matching `tests/test_*.py`. |

Construct with a custom ignore set or extension list if your repository needs different exclusions.

### `surface_bottlenecks(hive, observations, *, n=3)`

Hands the observations to the colony as deliberation context, asks for the top `n` highest-conviction next moves with reasoning, and returns a `RunResult` whose `.answer` can be used as the goal for an `AutogenesisLoop`. If `observations` is empty, the colony is asked to propose a goal from scratch.

A full runnable end-to-end demo (scan → surface → loop → commit) lives at [`opus-core/examples/autogenesis_continuous.py`](../opus-core/examples/autogenesis_continuous.py).

---

## Provenance & cost

Every `RunResult` includes a complete provenance trace — every Record the colony wrote, every parent_id, every model invocation, every cent spent. By default the trace is also written to disk as JSONL at `provenance/<query_uuid>.jsonl` and the path comes back as `result.provenance_path`.

Each Record in the trace carries:

```jsonc
{
  "id": "rec_...",
  "agent_id": "synthesiser_a",
  "agent_role": "synthesiser",
  "parent_ids": ["rec_..."],
  "type": "synthesis.candidate",
  "content": { "answer": "..." },
  "confidence": 0.82,
  "model": "claude-opus-4-7",
  "cost_estimate": 0.0142,
  "timestamp": "2026-05-19T01:42:18.119Z"
}
```

You can read it as plain JSONL, replay any past Blackboard state, or feed it into your own analytics. The trace is the receipt.

---

## FAQ

**Q: Does OPUS need to phone home?**
No. The library calls the Anthropic API directly using *your* key. Nothing routes through us. There is no telemetry, no usage reporting, no proprietary server. The package you install is the package that runs.

**Q: What does a typical query cost?**
A default v0 run (3 Scouts + 6 Workers + 1 Judge + Verifier) is in the $0.50–$2.00 range depending on response length and how many verification rounds the Verifier triggers. The autogenesis loop is roughly $1–$3 per iteration (two full deliberations each).

**Q: Can I use a different LLM provider?**
Not in v0. The agents are tuned against Claude (`claude-opus-4-7` for Workers, `claude-sonnet-4-6` for Scouts) and use Anthropic-specific features (adaptive thinking, prompt caching). A provider-agnostic abstraction is on the roadmap.

**Q: What runs the colony when I ship a PR?**
Your machine. Or your CI. Or a worker process you spin up yourself. OPUS is a Python package — there is no hosted runtime. (A `Modal` deployment template is Phase α work.)

**Q: How do I make the autogenesis loop actually open PRs / push commits?**
Implement that logic in your `commit_handler`. Use `subprocess`, `gitpython`, or the GitHub API — the colony hands you the verified change, you decide where it goes. Keeping that side of things explicit is intentional: the colony is the author, you are the editor of record.

---

*Magnum Opus · MMXXVI · [tryopusai.com](https://www.tryopusai.com)*
