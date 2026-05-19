# opus-core

The Python swarm engine for OPUS.

<div align="center">

**Official $OPUS CA (Solana)**

`FjGZibcd8DBzxoL3H2srMayap1h7S5Q5NuPoaJcVpump`

</div>

---

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

### Local Web UI — one command, your own colony in the browser

```bash
uv pip install -e ".[serve]"          # one-time, adds fastapi+uvicorn
opus serve                             # boots http://127.0.0.1:8000
```

A single command boots a local FastAPI server with the OPUS web UI on `localhost`. Pose questions, watch the swarm deliberate live (server-sent events stream every Record as it's written to the Blackboard), see the verdict + cost + provenance. Anyone with a terminal can run their own colony — no API gate, no marketing form, no rate limit.

```bash
opus serve --provider ollama          # local model, $0/query
opus serve --provider openai          # OpenAI / o-series
opus serve --port 9000 --no-browser   # custom port, headless
```

### Library — embed it in your own code

```python
from opus import Hive, LLMClient, Budget

llm = LLMClient()  # uses Anthropic by default
hive = Hive(llm=llm)
result = await hive.run(
    "What is the cleanest refactor for this module?",
    budget=Budget(max_cost_usd=0.50),
)
print(result.answer)
print(f"${result.summary.total_cost_usd:.4f}")
```

### Pick your LLM backend (Anthropic / OpenAI / Ollama / anything)

```python
from opus import LLMClient, OpenAIProvider, OllamaProvider, auto_provider

llm = LLMClient(provider=OpenAIProvider())     # GPT-4o / o1 / o3 / etc.
llm = LLMClient(provider=OllamaProvider())     # local, free, private
llm = LLMClient(provider=auto_provider())      # auto-detect from env
```

All four providers (Anthropic, OpenAI, Ollama, Mock for tests) expose the same `LLMProvider` interface — your Hive / agent / consensus code never has to branch on backend. Per-role default models come from each provider automatically; runnable demos at [`examples/using_openai.py`](examples/using_openai.py) and [`examples/using_ollama.py`](examples/using_ollama.py).

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

**84 tests pass** — Blackboard (5), Consensus (8), Hive (5), Introspection (27), Providers (32), Server (7). Run in under 4 seconds. All use isolated fixtures, `httpx.MockTransport`, or `httpx.ASGITransport`; no network, no API key required.

## Layout

```
src/opus/
├── __init__.py        ── public API (15 symbols)
├── hive.py            ── orchestrator
├── autogenesis.py     ── the autonomous deliberation loop
├── introspection.py   ── repo scanner + bottleneck surfacer (27 tests)
├── blackboard.py      ── append-only Record store
├── consensus.py       ── borda · judge · verify
├── provenance.py      ── cost ledger + DAG serialisation
├── agents/            ── one file per role (8 roles)
├── memory/            ── vector + graph wrappers (stubs in v0)
├── llm/
│   ├── client.py       ── LLMClient — façade with budget tracking
│   └── providers/      ── multi-backend abstraction
│       ├── base.py     ── LLMProvider protocol + types
│       ├── anthropic.py ─ Claude (Opus 4.7, Sonnet 4.6, Haiku 4.5)
│       ├── openai.py   ── GPT-4o / o1 / + OpenAI-compatible gateways
│       ├── ollama.py   ── local LLM, free, private, no key required
│       └── mock.py     ── deterministic mock for tests
├── server/            ── local web UI + HTTP API (one-command serve)
│   ├── app.py          ── FastAPI app, SSE streaming, /query, /status
│   └── ui.py           ── single-file inline web UI (HTML/CSS/JS)
└── cli.py             ── `opus query "..."`, `opus serve`

examples/
├── hello_swarm.py            ── smallest one-query example (Anthropic)
├── autogenesis_demo.py       ── the autonomous loop, end-to-end
├── autogenesis_continuous.py ── continuous scan → surface → loop pipeline
├── using_openai.py           ── same colony, on OpenAI
└── using_ollama.py           ── same colony, on local Ollama (free)
```

See [`../docs/architecture.md`](../docs/architecture.md) for the file-by-file walk-through and [`../docs/api.md`](../docs/api.md) for the full API reference.
