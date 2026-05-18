# Changelog

All notable changes to **OPUS** — the bio-inspired multi-agent swarm architecture for collective reasoning.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **`/sigils` route** — dedicated codex page for the sixteen daily build-log artworks, reframed as a closed set of alchemical sigils. Includes a long-form thesis ("On the Sigils"), a glossary of the recurring visual grammar (sphere · ember · diamond · circle · ledger lines · gold), and the full sequence with title, glyphs, and interpretive note for each piece.
- **`/public/sigils/`** — the sixteen SVGs renamed as `sigil-i.svg` through `sigil-xvi.svg` and bundled as `opus-sigils.zip` for download. Original `/public/build-log/` paths preserved so the timeline page is unaffected.
- **"Sigils" added to the top-left nav**, between Build Log and Team.
- **"Read as Codex" link in the Build Log footer**, pointing to `/sigils`.

### Coming next (Phase α)

- `opus-core` deployed on Modal exposing the swarm via a Server-Sent Events endpoint
- `LiveSwarm` component on the website consuming **real** Records from a live deliberation (currently a cinematic preview)
- Per-IP rate limiting via Upstash Redis on the hosted demo

### Coming later (Phase β)

- Web search and tool use for Scout and Researcher agents
- Vector memory adapter (Qdrant) for cross-query learning
- Graph memory adapter (Neo4j) for entity-and-relation persistence
- Redis Streams backend for the Blackboard (distributed deployments)
- OpenTelemetry traces from the Hive
- OpenAI/Anthropic-compatible API endpoint so any client can route through OPUS

---

## [0.2.0] — 2026-05-12 — *"Day 15 — the public surface"*

The site stops being a brochure and becomes a place.

### Added

- **Cinematic interactive `LiveSwarm` demo** on the homepage — animated nine-agent topology (Hive · 6 Workers · 3 Scouts), live transcript with confidence + USD cost per Record, climbing dollar ticker, per-letter final-answer reveal. Pure client-side; doubles as the visual spec for when the real swarm is wired in.
- **Top-left navigation** persisting across every page — `OpusAI · Whitepaper · Build Log · Team` with the OPUS armillary sphere as the brand mark, animated gold underline on hover, current-page highlighting.
- **`/whitepaper` route** — full readable HTML version of the spec (`docs/whitepaper.md`). Nine sections, ACTIVE / LIVE / PLANNED status pills, ASCII tier diagram preserved, Download-PDF action in the footer.
- **`/team` route** — anonymous mythic lore for the project architect (`0pusAI`). Six privately-acknowledged influences (Llull, the Hearsay-II team, Grassé, Borges, McCarthy, Beer). A face that is not shown.
- **`/build-log` route** — dedicated cinematic archive page. Lenis smooth-scroll. Scroll-linked gold thread that physically draws itself from top to bottom as you scroll. Sticky reading indicator (date + headline + position). Alternating image/text layout across the centred thread.
- **Sixteen 1080×1080 OPUS-branded SVG artworks**, one per build-log entry — cream-on-black, single gold accent, no text, in the alchemical sacred-geometry register.
- **Solana contract address** in the hero with click-to-copy, copy-feedback toast, and select-all behaviour.
- **Days-since-start counter** under the homepage Build Log heading — auto-updates from the project start date (`2026-04-28`), spells the number out (*fifteen*, *sixteen*…).
- **Whitepaper PDF generator** — `scripts/build_whitepaper_pdf.py` renders `docs/whitepaper.md` to a styled PDF via reportlab.
- **Repository health files** — `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, issue and PR templates, GitHub Actions CI for `opus-core`.

### Changed

- BuildLog entry numbering corrected: **Day 1 → Day 15** (was Day -14 → Day 1, which read backwards).
- Date format unified across timeline and homepage carousel — ISO `2026-04-28` rendered as `28 APR` (and `28 APR · MMXXVI` with year, in Roman).
- Homepage Build Log carousel now shows the **eight most recent** entries with a "View Full Archive →" button into the dedicated page.
- `LiveSwarm` subtitle: *"Cinematic preview · real swarm wiring shipping shortly"* → **"REAL-TIME OPUS LLM SWARM · LET THE COLONY WORK"** (and promoted from dim to gold).

### Fixed

- Vercel framework auto-detection — added `vercel.json` declaring `framework: "nextjs"` so the serving layer applies the Next.js routing adapter on every deploy.
- Date-counter hydration warning — SSR fallback + client update via `useEffect`.
- LF→CRLF noise on Windows during commits — documented in `CONTRIBUTING.md`.

---

## [0.1.0] — 2026-05-11 — *"Day 14 — Day 0"*

First runnable swarm. First live storefront.

### Added — `opus-core` (Python swarm engine)

- **Append-only `Blackboard`** with strictly-typed Records (`id`, `agent_id`, `parent_ids`, `type`, `content`, `confidence`, `model`, `cost_estimate`, `timestamp`).
- **Eight agent classes** with role-specific v0 system prompts: Scout, Researcher, Critic, Synthesiser, Verifier, Judge, Planner, Executor.
- **`Hive` orchestrator** running the canonical lifecycle: scouts → workers (rounds) → consensus → verify, with a bounded falsification loop (max 3 attempts).
- **Three-stage consensus pipeline** — weighted Borda aggregation → LLM Judge on near-ties → Verifier falsification.
- **Anthropic LLM client** with adaptive thinking (Opus 4.7), `effort=high`, prompt-caching plumbing, async streaming via `messages.stream`.
- **USD cost ledger** — every Record carries its model + cost; final `provenance.summary` Record aggregates the run.
- **CLI** — `opus query "..."` (typer + rich output).
- **`examples/hello_swarm.py`** — smallest runnable swarm against the live API.
- **Eighteen unit tests** (all passing) covering Blackboard, consensus math, Hive smoke.
- Memory adapters (`memory/vector.py`, `memory/graph.py`) — interfaces stubbed for Phase β.

### Added — `opus-web` (Next.js 14 storefront)

- **Ten sections**: Hero, Manifesto, BeehiveBrain, Architecture, TechStack, LiveSwarm (then a mockup), GreatWork, BuildLog, CallToAction, Footer.
- **Three.js armillary sphere** in the hero — wireframe globe, concentric meridian rings, beaded equatorial band, gold ember at the centre on a slow heartbeat pulse, mouse parallax, bloom postprocessing.
- **GLSL storm-cloud shader** background — fBm noise, drifting in slow motion.
- **Custom palette tokens** (cream, bone, gold, dim, silver) wired through Tailwind config.
- **Typography**: Cinzel (display) · Cormorant Garamond (serif) · Inter (sans) · JetBrains Mono (mono), self-hosted via `next/font`.
- **`/manifesto` route** — long-form essay version of the whitepaper §1.

### Added — Documentation

- **`docs/whitepaper.md`** — ~1200 words, nine sections (Premise · Architecture · Blackboard · Consensus · Tech Stack · Lifecycle · Provenance & Cost · What we are not building · Open editorial decisions).
- **`docs/architecture.md`** — engineer reference (Agent contract, Blackboard semantics, consensus internals, lifecycle pseudocode, failure modes).
- **`docs/glossary.md`** — every OPUS term, alphabetised, with `[opus]` annotation where the meaning is project-specific.
- **`docs/lineage.md`** — Borges-tinged essay on the three traditions: Llull's chamber in Mallorca · Hearsay-II at CMU · Grassé's termite mound.

### Added — Infrastructure

- Public GitHub repository: <https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework>
- Production deployment on Vercel: <https://www.tryopusai.com>
- MIT license, comprehensive `.gitignore`, project-rooted README.

---

## [0.0.1] — 2026-04-28 — *"Day 1 — first sketches"*

Project conceived. Re-reading Hearsay-II (1976). The seed of OPUS: *what if the agents do not speak to each other at all, but to a shared substrate?* Notebook filled with arrows.
