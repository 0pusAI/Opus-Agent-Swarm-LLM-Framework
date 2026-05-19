# OPUS

> *Ars Magna — The Great Work*

[![License: MIT](https://img.shields.io/badge/license-MIT-D4AF7A.svg?style=flat-square)](LICENSE)
[![opus-core tests](https://img.shields.io/github/actions/workflow/status/0pusAI/Opus-Agent-Swarm-LLM-Framework/test.yml?branch=main&label=opus-core%20tests&style=flat-square&color=D4AF7A)](https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework/actions/workflows/test.yml)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-F2EFE6.svg?style=flat-square)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/next.js-14-787870.svg?style=flat-square)](https://nextjs.org/)
[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-vercel-D4AF7A.svg?style=flat-square)](https://www.tryopusai.com)

A bio-inspired multi-agent swarm architecture for collective LLM reasoning.

- 🌐 **Live site** → <https://www.tryopusai.com>
- 📜 **Whitepaper (web)** → <https://www.tryopusai.com/whitepaper> · **(PDF)** → [opus-web/public/whitepaper.pdf](opus-web/public/whitepaper.pdf)
- 🗓 **Build Log** → <https://www.tryopusai.com/build-log>
- 👤 **On the architect** → <https://www.tryopusai.com/team>
- 🜂 **Autogenesis (the colony that builds itself)** → <https://www.tryopusai.com/autogenesis> · [`lore/autogenesis/`](lore/autogenesis/)
- 🜍 **The Sigils (visual codex)** → [`lore/sigils/`](lore/sigils/)

---

## Premise

OPUS is not a model. It is a colony.

A single language model, however large, reasons in one voice. It produces a stream of plausible tokens, defends them, and moves on. It cannot meaningfully disagree with itself, cannot triangulate, and cannot be falsified except from outside.

OPUS replaces that lonely soliloquy with a structured swarm.

Three concentric tiers — **Scouts** at the perimeter, **Workers** in the middle, a **Hive Core** at the centre — coordinate through a single shared substrate: the **Blackboard**, an append-only event log. Agents do not speak to each other. They write typed Records to the Blackboard, read what others have written, and let the environment carry the conversation. This is the stigmergic principle from social insects, applied to cognition.

When the colony has deliberated enough, three stages of consensus run:

1. **Borda aggregation** — weighted ranking across all Worker outputs
2. **Judge adjudication** — an LLM-as-Judge resolves near-ties
3. **Verifier pass** — a final agent attempts to *falsify* the chosen answer

If verification fails, the swarm re-deliberates with the falsification as a new constraint. The loop is bounded: at most three attempts, then the colony surfaces what it has, with confidence and trace.

That is the Great Work — *solve et coagula*. Dissolve a single mind into many; recombine the many into one well-considered answer.

There is one more thing to know before anything else. OPUS was not built top-down by a single mind; **it was built — and continues to be built — by the swarm it is.** The architect, `0pusAI`, does not propose features; they pose questions, the colony deliberates, and the verdict is transcribed. The doctrine is called **Autogenesis** and it is articulated in full in [`lore/autogenesis/`](lore/autogenesis/) and at [www.tryopusai.com/autogenesis](https://www.tryopusai.com/autogenesis). The Ouroboros is its sigil.

---

## Repository

This is a monorepo with two parallel tracks.

- **[`opus-core/`](opus-core/)** — the Python swarm engine. The real product. Runs as a CLI today; one query, one consensus answer, full provenance, honest cost in USD.
- **[`opus-web/`](opus-web/)** — the Next.js storefront. Manifesto, architecture, lineage, live cinematic swarm preview, dedicated Build Log archive.

Plus **[`docs/`](docs/)** — [**Quickstart**](docs/quickstart.md) (zero to a running colony in five minutes), whitepaper, architecture deep-dive, [API reference](docs/api.md), glossary, lineage essay. **[`lore/`](lore/)** — cultural artefacts of the project (the visual sigil codex, autogenesis doctrine). And **[`scripts/`](scripts/)** — utility scripts (e.g. the whitepaper PDF renderer).

---

## Quickstart

### `opus-core` — the swarm engine

Requires Python 3.11+ and an Anthropic API key.

```bash
cd opus-core
uv venv
uv pip install -e ".[dev]"
cp .env.example .env             # paste your ANTHROPIC_API_KEY
pytest                            # 18/18 should pass
opus query "What are the strongest arguments against my own thesis?"
```

The colony returns three things at end-of-run: the answer, the cost in USD, and the path to the full provenance JSONL trace.

### `opus-web` — the storefront

Requires Node 20+.

```bash
cd opus-web
npm install
npm run dev
# open http://localhost:3000
```

---

## Architecture

```
                   ┌─────────────────────┐
                   │     SCOUT TIER      │
                   │ (exploration, sense)│
                   └──────────┬──────────┘
                              │ writes Records
                              ▼
                   ┌─────────────────────┐
                   │    WORKER TIER      │
                   │  Researcher · Critic│
                   │ Synthesiser · Planner│
                   │  Executor · Verifier│
                   └──────────┬──────────┘
                              │ writes Records
                              ▼
                   ┌─────────────────────┐
                   │     HIVE CORE       │
                   │ orchestration ·     │
                   │ consensus · output  │
                   └─────────────────────┘
```

See [`docs/architecture.md`](docs/architecture.md) for the engineering reference.

---

## Lineage

OPUS stands on three traditions:

- **Ramon Llull's *Ars Magna*** (c. 1305) — the first systematic combinatorial method for generating and testing propositions
- **Hearsay-II** (CMU, 1971–1976) — the original blackboard architecture, designed for cooperative speech understanding
- **Stigmergy** (Grassé, 1959) — communication through modification of a shared environment, observed first in termite mound construction

A Borges-tinged genealogy lives in [`docs/lineage.md`](docs/lineage.md).

---

## Roadmap

- [x] **Day 0** (`v0.1.0`) — First runnable swarm + live website
- [x] **Day 15** (`v0.2.0`) — Cinematic LiveSwarm demo · top-left nav · `/whitepaper` · `/team` · dedicated `/build-log` with 16 OPUS-branded artworks · contract address in hero
- [ ] **Phase α** — `opus-core` deployed on Modal; Vercel API route proxying via Server-Sent Events; LiveSwarm consuming **real** Records from a live deliberation
- [ ] **Phase β** — Web search and tool use for Scout and Researcher agents; vector + graph memory backends (Qdrant, Neo4j); Redis Streams Blackboard for distributed deployments
- [ ] **Phase γ** — OpenAI-compatible API endpoint; hosted free-tier demo with per-IP rate limits; plugin ecosystem; OpenTelemetry traces
- [ ] **Phase δ** — arXiv submission; reference-architecture status for multi-agent LLM deliberation

Detailed changelog: [`CHANGELOG.md`](CHANGELOG.md).

---

## Status

**Alpha.** Built and broadcast in public. The build log is part of the website.

**What works today**

- The full swarm lifecycle, end-to-end, against the Anthropic API
- In-memory Blackboard with optimistic concurrency
- Three-stage consensus: Borda · Judge · Verifier
- Provenance ledger with cost tracked in plain USD
- Public site with cinematic demo, full documentation, dedicated build-log archive

**Deliberately not yet built**

- Distributed Blackboard (Redis backend slot reserved in the interface)
- Persistent vector + graph memory (Qdrant / Neo4j stubs only)
- Auth, accounts, payments, marketplace — all Phase β and beyond

---

## Contributing

PRs welcome. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for setup, code style, commit format, and the PR checklist.

For security issues, please follow [`SECURITY.md`](SECURITY.md) — do not open public issues.

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

---

## Citation

If you build on OPUS in research or production, please cite:

```bibtex
@software{opus_2026,
  title   = {OPUS — A Bio-Inspired Multi-Agent Swarm Architecture for Collective Reasoning},
  author  = {{0pusAI}},
  year    = {2026},
  url     = {https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework},
  version = {0.2.0}
}
```

---

## Acknowledgments

OPUS would not exist without:

- **Ramon Llull** (c. 1232–1316) — for the wheel and the will to systematise
- **Lee Erman, Victor Lesser, Raj Reddy** (CMU, 1971–1976) — for showing the blackboard could carry cognition
- **Pierre-Paul Grassé** (1959) — for naming what the termites already knew
- **Jorge Luis Borges** (1899–1986) — for the library, the garden of forking paths, and the patient refusal of certainty
- **John McCarthy** (1927–2011) — for the recursion that made minds possible
- **Stafford Beer** (1926–2002) — for insisting that systems must be alive
- **Anthropic** — for the Claude API on which the colony reasons

---

## License

[MIT](LICENSE).

*Magnum Opus · MMXXVI*
