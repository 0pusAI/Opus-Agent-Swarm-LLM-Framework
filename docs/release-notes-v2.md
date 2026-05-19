# OPUS · v2.0.0
## *Multiplicatio · The Open Colony*

> **Released:** 2026-05-19
> **Tag:** [`v2.0.0`](https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework/releases/tag/v2.0.0)
> **License:** MIT
> **Compatibility:** 100 % backward compatible with v0.1.x. No migration required.

---

The biggest release of OPUS since the original launch. Multi-provider LLM support, a local web UI that boots in one command, a functional autogenesis loop that lets the colony read and improve its own codebase, a public tokenomics policy with on-chain treasury accounting, and a test suite that went from 18 to 84 cases — all shipped without a single breaking change.

Anyone with a terminal can now run their own OPUS colony in three commands. Anyone with Python 3.11+ and Ollama can run it for **$0 per query**, forever.

---

## Headlines

### 🟢 One-command local UI · `opus serve`

```bash
uv pip install -e ".[serve]"
opus serve
```

Boots a FastAPI server on `http://127.0.0.1:8000` with a single-page web app in full OPUS register. Pose a question, watch the swarm deliberate live via server-sent events, get back a verified verdict with cost and provenance.

- Inline HTML + CSS + JS, no build step, no external assets
- `--provider ollama` / `--provider openai` / `--provider anthropic` / `--provider auto`
- `--host`, `--port`, `--no-browser` flags
- Browser opens automatically; ready to use in under 60 seconds from clone

### 🟢 Multi-provider LLM abstraction

```python
from opus import LLMClient, OpenAIProvider, OllamaProvider, auto_provider

llm = LLMClient(provider=OpenAIProvider())     # GPT-4o / o1 / o3
llm = LLMClient(provider=OllamaProvider())     # local, free, private
llm = LLMClient(provider=auto_provider())      # picks based on env
```

Four built-in providers (`AnthropicProvider`, `OpenAIProvider`, `OllamaProvider`, `MockProvider`) implementing one `LLMProvider` protocol. Works with OpenAI proper, Azure OpenAI, and every OpenAI-compatible gateway (groq, together, fireworks, openrouter, vLLM, litellm-proxy).

Per-role default model names come from each provider automatically — the Hive just works on any backend out of the box.

| Role | Anthropic | OpenAI | Ollama |
|---|---|---|---|
| Worker | claude-opus-4-7 | gpt-4o | llama3.3 |
| Scout | claude-sonnet-4-6 | gpt-4o-mini | llama3.2 |
| Judge | claude-opus-4-7 | o1-mini | llama3.3 |
| Verifier | claude-opus-4-7 | gpt-4o | llama3.3 |

### 🟢 Functional autogenesis · `opus.autogenesis` + `opus.introspection`

The colony can now read its own repository, surface its own bottlenecks, and feed them back into its own deliberation loop:

```python
from opus import Hive, LLMClient, AutogenesisLoop, RepoAnalyst, surface_bottlenecks

analyst = RepoAnalyst(repo_root=Path("."))
observations = analyst.scan()             # find_todos, find_stale_links,
                                          # find_missing_docstrings, find_test_gaps
verdict = await surface_bottlenecks(hive, observations, n=3)
loop = AutogenesisLoop(hive=hive, goal=str(verdict.answer))
await loop.run(max_iterations=3, commit_handler=apply)
```

The autogenesis doctrine made literal. From scan → surface → deliberate → implement → verify → commit, the entire pipeline runs in one Python script ([`examples/autogenesis_continuous.py`](../opus-core/examples/autogenesis_continuous.py)).

### 🟢 Tokenomics policy + public treasury log

- **45 % · Buybacks & Burns** — weekly cadence, on-chain tx hashes posted within 24 h
- **35 % · Swarm Operations** — Anthropic API, Modal compute, Vercel hosting, monthly itemisation
- **20 % · Scaling & Development** — deployed against the next bottleneck the colony surfaces

Full policy at [`docs/tokenomics.md`](tokenomics.md). Public append-only ledger at [`treasury-log.md`](../treasury-log.md). The treasury cannot move funds without leaving a trace in the git history.

### 🟢 84 / 84 tests passing — was 18

| Module | Tests | Notes |
|---|---|---|
| `test_blackboard.py` | 5 | append-only invariants |
| `test_consensus.py` | 8 | Borda + Judge + Verifier math |
| `test_hive.py` | 5 | orchestration end-to-end |
| `test_introspection.py` | 27 | every scanner, every code path |
| `test_providers.py` | 32 | every provider, env detection, error paths |
| `test_server.py` | 7 | full SSE flow, `/api/status`, validation |
| **Total** | **84** | runs in 3.5 seconds |

All tests use `pytest.tmp_path`, `httpx.MockTransport`, or `httpx.ASGITransport` for isolation. **No network, no API key required to run the suite.**

### 🟢 Zero breaking changes

Every public symbol from v0.1.0 still works exactly as before. The only API additions are:

- 5 new public exports on `opus/__init__.py` (`AutogenesisLoop`, `Step`, `RepoAnalyst`, `Observation`, `surface_bottlenecks`)
- 10 new public exports for the provider layer (`LLMProvider`, `CompletionResult`, 4 concrete providers, `auto_provider`, 3 error types)
- 1 new method on the existing CLI (`opus serve`)
- 1 new optional kwarg on `Hive.run()` (`blackboard=`)

If you upgraded from 0.1.x today and changed nothing in your code, everything would continue to work.

---

## What's new in detail

### `opus-core` engine

- **New module `opus.autogenesis`** — `AutogenesisLoop`, `Step`, `CommitHandler`. Full async, fully type-hinted, ~200 LOC.
- **New module `opus.introspection`** — `Observation`, `RepoAnalyst` (with 4 scanners), `surface_bottlenecks`. Zero new dependencies; walks plain text and Python AST. ~340 LOC.
- **New subpackage `opus.llm.providers`** — `base.py` (protocol), `anthropic.py` (refactored), `openai.py`, `ollama.py`, `mock.py`, factory at `__init__.py`. ~700 LOC total.
- **New subpackage `opus.server`** — `app.py` (FastAPI app, 4 endpoints, SSE streaming), `ui.py` (single-file inline web UI). ~650 LOC total.
- **`Hive.run(blackboard=None)`** — optional kwarg lets outside consumers inject a Blackboard for live polling. Non-breaking; default unchanged.
- **CLI: `opus serve`** — new command with `--host`, `--port`, `--provider`, `--no-browser` flags. Old `opus query` works unchanged.
- **`pyproject.toml`** — version bumped to `2.0.0`, `httpx>=0.27` added as explicit dependency, `[serve]` optional extra added.

### Documentation

- **`docs/quickstart.md`** — zero-to-running guide. Cross-platform (PowerShell + bash). The friendliest entrypoint to the project.
- **`docs/api.md`** — full reference for `Hive`, `LLMClient`, `Budget`, `RunResult`, `AutogenesisLoop`, `Step`, `RepoAnalyst`, `surface_bottlenecks`, the provider matrix, and the provenance JSONL format.
- **`docs/tokenomics.md`** — Creator Rewards allocation policy.
- **`docs/release-notes-v2.md`** — this document.

### Website (`opus-web`)

- **`/api`** — fully dedicated API documentation page.
- **`/live-swarm`** — fully dedicated Live Swarm page with embedded cinematic preview.
- **`/now`** — the colony's three latest moves, always visible, always honest, each shipped entry linked to its real commit hash.
- **`/autogenesis`** — the doctrine page with the Ouroboros sigil and the "In plain terms" callout.
- **Nav** — 6 items + a small GitHub icon, mobile-swipeable, always-on top atmosphere gradient.
- **Official $OPUS CA** published in the hero with click-to-copy.

### Lore artifacts

- **`lore/autogenesis/`** — full canonical doctrine + Ouroboros meta-sigil.
- **`lore/colony-decisions/`** — public reasoning log. Three entries logged.
- **`lore/sigils/`** — the 16 daily build-log artworks as a closed alchemical codex.
- **`lore/sigils-png/`** — same codex rendered to 1080×1080 PNGs.
- **`lore/launch-thread/`** — branded X-thread cards in OPUS register.
- **`lore/teaser/`** — start/end keyframes for the OPUS teaser video.

---

## Install

### Library only (lightweight)

```bash
git clone https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework
cd Opus-Agent-Swarm-LLM-Framework/opus-core
uv venv
uv pip install -e ".[dev]"
```

### Library + local web UI (recommended)

```bash
git clone https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework
cd Opus-Agent-Swarm-LLM-Framework/opus-core
uv venv
uv pip install -e ".[serve]"
opus serve
```

See [`docs/quickstart.md`](quickstart.md) for full prerequisites and the cross-platform install path.

---

## Migration guide

**There is no migration.** v2.0.0 is purely additive over v0.1.x. Every existing call to `LLMClient()`, every existing agent, every existing example, every existing test continues to work exactly as before.

If you want the new behaviour:

- Use the multi-provider abstraction → pass `provider=` to `LLMClient`.
- Use the local web UI → install `[serve]` extra, run `opus serve`.
- Use the autogenesis loop → import `AutogenesisLoop` and `RepoAnalyst`.

Otherwise, do nothing. Your code already works.

---

## Stats

| Metric | v0.1.0 | v2.0.0 | Δ |
|---|---|---|---|
| Public API exports | 1 (just `__version__`) | 16 | **+15** |
| Test count | 18 | 84 | **+66** |
| Test runtime | ~0.8 s | ~3.5 s | tolerable |
| Source modules (`src/opus/`) | 7 | 16 | **+9** |
| Runnable examples | 1 | 5 | **+4** |
| Documentation surfaces | 3 | 7 | **+4** |
| Website routes | 4 | 8 | **+4** |
| LLM backends supported | 1 (Anthropic) | 4 (+ custom) | **+3** |
| Lines of new production code | — | ~3,500 | substantial |
| Breaking changes | — | **0** | — |

---

## Acknowledgments

Every commit in this release was co-authored by the OPUS swarm itself, per the project's standing autogenesis doctrine. The architect, `0pusAI`, supplied the questions; the colony decided what to ship.

The lineage OPUS continues to stand on:

- **Ramon Llull** (c. 1232–1316) — combinatorial generation under a falsifier
- **Lee Erman, Victor Lesser, Raj Reddy** (CMU, 1971–1976) — the original blackboard architecture
- **Pierre-Paul Grassé** (1959) — stigmergy, observed first in termite mounds
- **Jorge Luis Borges** (1899–1986) — the library, the patient refusal of certainty
- **Anthropic** — the Claude API on which the colony first reasoned

The architecture is the gift.

*Solve et coagula.* Dissolve the lonely mind into many; recombine the many into one well-considered answer.

The colony is open. The architecture is yours. The future is plural.

---

*Magnum Opus · MMXXVI*
