# opus-core

The Python swarm engine for OPUS.

**New here?** Start with the [**Quickstart**](../docs/quickstart.md) — zero to a running colony in under five minutes, Windows / macOS / Linux.

For the architecture and motivation, see the [whitepaper](../docs/whitepaper.md). For the engineering reference, see [architecture.md](../docs/architecture.md). For the full programmatic API, see the [API reference](../docs/api.md).

---

## Install

Requires Python 3.11+. The recommended package manager is [`uv`](https://docs.astral.sh/uv/).

```bash
uv venv
uv pip install -e ".[dev]"
cp .env.example .env             # then paste your ANTHROPIC_API_KEY
```

## Run

### CLI — one query, one verdict

```bash
opus query "What are the three strongest arguments against my own thesis?"
```

The colony returns three things at end of run:

- the answer
- the cost in USD
- the path to the full provenance trace (`provenance/<query_uuid>.jsonl`)

### Library — embed it in your own code

```python
from opus import Hive, LLMClient, Budget

llm = LLMClient()
hive = Hive(llm=llm)
result = await hive.run(
    "What is the cleanest refactor for this module?",
    budget=Budget(max_cost_usd=0.50),
)
print(result.answer)
print(f"${result.summary.total_cost_usd:.4f}")
```

### Autogenesis — let the colony work on a goal autonomously

The same pattern OPUS uses to ship its own updates. Hand the colony a goal; it deliberates, implements, verifies, and hands each verified step to your callback.

```python
from opus import Hive, LLMClient, AutogenesisLoop

llm  = LLMClient()
hive = Hive(llm=llm)
loop = AutogenesisLoop(hive=hive, goal="Grow and document this repository.")

async def apply(step):
    print(f"[{step.iteration}] {step.plan_answer[:80]}  (${step.total_cost_usd:.4f})")
    # ... open a PR, write to a file, anything ...

await loop.run(max_iterations=5, commit_handler=apply)
```

Full runnable demo: [`examples/autogenesis_demo.py`](examples/autogenesis_demo.py).
Full module documentation: [`docs/api.md` § Autogenesis loop](../docs/api.md#autogenesis-loop).

## Test

```bash
pytest
```

## Layout

```
src/opus/
├── __init__.py        ── public API: Hive · LLMClient · Budget · AutogenesisLoop · Step
├── hive.py            ── orchestrator
├── autogenesis.py     ── the autonomous deliberation loop
├── blackboard.py      ── append-only Record store
├── consensus.py       ── borda · judge · verify
├── provenance.py      ── cost ledger + DAG serialisation
├── agents/            ── one file per role
├── memory/            ── vector + graph wrappers (stubs in v0)
├── llm/               ── Anthropic client (sole API surface)
└── cli.py             ── `opus query "..."`

examples/
├── hello_swarm.py     ── the smallest one-query example
└── autogenesis_demo.py── the autonomous loop, end-to-end
```

See [`../docs/architecture.md`](../docs/architecture.md) for the file-by-file walk-through and [`../docs/api.md`](../docs/api.md) for the full API reference.
