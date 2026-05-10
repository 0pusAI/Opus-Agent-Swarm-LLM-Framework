# OPUS

> *Ars Magna — The Great Work*

A bio-inspired multi-agent swarm architecture for collective reasoning.

---

## Premise

OPUS is not a model. It is a colony.

A single language model, however large, reasons in one voice. It produces a stream of plausible tokens, defends them, and moves on. It cannot meaningfully disagree with itself, cannot triangulate, and cannot be falsified except from outside.

OPUS replaces that lonely soliloquy with a structured swarm.

Three concentric tiers — **Scouts** at the perimeter, **Workers** in the middle, a **Hive Core** at the centre — coordinate through a single shared substrate: the **Blackboard**, an append-only event log. Agents do not speak to each other. They write typed records to the Blackboard, read what others have written, and let the environment carry the conversation. This is the stigmergic principle from social insects, applied to cognition.

When the colony has deliberated enough, three stages of consensus run:

1. **Borda aggregation** — weighted ranking across all Worker outputs.
2. **Judge adjudication** — an LLM-as-Judge resolves near-ties.
3. **Verifier pass** — a final agent attempts to *falsify* the chosen answer.

If verification fails, the swarm re-deliberates with the falsification as a new constraint. The loop is bounded: at most three attempts, then the colony surfaces what it has, with confidence and trace.

That is the Great Work — *solve et coagula*. Dissolve a single mind into many; recombine the many into one well-considered answer.

---

## Repository

This is a monorepo with two parallel tracks.

- **[`opus-core/`](opus-core/)** — the Python swarm engine. The real product. Runs as a CLI today; one query, one consensus answer, full provenance, honest cost in USD.
- **[`opus-web/`](opus-web/)** — the Next.js storefront. Manifesto, architecture, lineage, live swarm visualisation. Built and broadcast in public.

Plus **[`docs/`](docs/)** — whitepaper, architecture deep-dive, glossary, and lineage essay.

---

## Quickstart

### opus-core — the swarm

Requires Python 3.11+ and an Anthropic API key.

```bash
cd opus-core
uv venv
uv pip install -e ".[dev]"
cp .env.example .env             # paste your ANTHROPIC_API_KEY
opus query "What are the strongest arguments against my own thesis?"
```

The colony returns a single answer, the full ordered trace of every Record written to the Blackboard, and the total cost in USD.

### opus-web — the storefront

Requires Node 20+.

```bash
cd opus-web
npm install
npm run dev
# http://localhost:3000
```

---

## Lineage

OPUS stands on three traditions:

- **Ramon Llull's _Ars Magna_** (c. 1305) — the first systematic combinatorial method for generating and testing propositions about the world.
- **Hearsay-II** (CMU, 1971–1976) — the original blackboard architecture, designed for cooperative speech understanding by independent knowledge sources.
- **Stigmergy** (Grassé, 1959) — communication through modification of a shared environment, first observed in termite mound construction.

A fuller genealogy lives in [docs/lineage.md](docs/lineage.md).

---

## Status

**Alpha.** Built and broadcast in public. The build log is part of the website.

What works today:

- The full swarm lifecycle, end-to-end, against the Anthropic API.
- In-memory Blackboard with optimistic concurrency.
- Three-stage consensus: Borda · Judge · Verifier.
- Provenance ledger with cost tracked in plain USD.

What is deliberately not built yet:

- Distributed Blackboard (Redis backend slot is reserved in the interface).
- Persistent vector + graph memory (Qdrant / Neo4j stubs only).
- Auth, accounts, payments, marketplace — all Phase β and beyond.

---

## License

See [LICENSE](LICENSE).

---

*Magnum Opus · MMXXVI*
