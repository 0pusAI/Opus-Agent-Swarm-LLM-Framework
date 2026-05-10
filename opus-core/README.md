# opus-core

The Python swarm engine for OPUS.

For the architecture and motivation, see the [whitepaper](../docs/whitepaper.md). For the engineering reference, see [architecture.md](../docs/architecture.md).

---

## Install

Requires Python 3.11+. The recommended package manager is [`uv`](https://docs.astral.sh/uv/).

```bash
uv venv
uv pip install -e ".[dev]"
cp .env.example .env             # then paste your ANTHROPIC_API_KEY
```

## Run

```bash
opus query "What are the three strongest arguments against my own thesis?"
```

The colony returns three things at end of run:

- the answer
- the cost in USD
- the path to the full provenance trace (`provenance/<query_uuid>.jsonl`)

## Test

```bash
pytest
```

## Layout

```
src/opus/
├── hive.py            ── orchestrator
├── blackboard.py      ── append-only Record store
├── consensus.py       ── borda · judge · verify
├── provenance.py      ── cost ledger + DAG serialisation
├── agents/            ── one file per role
├── memory/            ── vector + graph wrappers (stubs in v0)
├── llm/               ── Anthropic client (sole API surface)
└── cli.py             ── `opus query "..."`
```

See [`../docs/architecture.md`](../docs/architecture.md) for the file-by-file walk-through.
