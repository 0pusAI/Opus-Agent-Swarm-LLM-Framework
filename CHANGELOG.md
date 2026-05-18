# Changelog

All notable changes to **OPUS** — the bio-inspired multi-agent swarm architecture for collective reasoning.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **`/api` — fully dedicated API page (the *multiplicatio* doctrine).** OPUS is fully open-source, so anyone can spawn their own colony — the entire architecture, in your own process, on your own keys. The page makes that landable for non-developers and concrete for developers: hero with the "T H E A P I" wordmark + `OPEN · MIT · SELF-HOSTED · YOUR KEYS · YOUR COLONY` mono subtitle, then five sections — §1 The Premise (multiplicatio, the stage of the Great Work where the stone replicates itself), §2 Spawn a colony (four-line install + the one-verb `hive.deliberate()` library API), §3 Tell it what to build (the directed mode with four real example questions), §4 **Let it build itself** (the autonomous mode, with the loop-pattern code that any user can point at their own repo), §5 Where to start (four doors — repo · whitepaper · autogenesis · live swarm). Closes with: *"The colony is open. Take it. Spawn your own."*
- **Nav: "API" added** between Whitepaper and Build Log. Now six items: OpusAI · Whitepaper · API · Build Log · Autogenesis · Team. Current-page highlight wired up.
- **Live Swarm page** — moved the "— A note on the demo —" callout from the middle of the page (between widget and article) to the very bottom as a quiet final whisper in dim italic serif, no border, no eyebrow chip. Less interruption of the swarm experience; honest caveat still preserved for anyone who reads to the end.
- **`/live-swarm` — fully dedicated OpusAI Live Swarm page.** The interactive swarm widget gets its own destination route, hero ("LIVE SWARM" wordmark, gold mono subtitle, italic serif tagline), an embedded honest "cinematic preview" note explaining current state vs Phase α, and four substantive explainer sections below: §1 How to use it (+ §1.1 on questions that suit it), §2 What to use it for (researchers, founders, writers, engineers, anyone wrestling with a real decision), §3 Why this is the future (the case against the lonely oracle — multiple perspectives, falsification, provenance), §4 How it was made (opus-core, Anthropic models, the Llull/Hearsay-II/Grassé lineage, MIT-licensed, autogenetic).
- **LiveSwarm component refactor** — accepts an optional `embedded` prop. When true, hides the homepage `§4 — A swarm in motion` eyebrow/title/subtitle block and tightens vertical padding so the dedicated `/live-swarm` page can wrap the widget in its own page hero. Homepage section is unchanged.
- **Nav: "OpusAI" now points to `/live-swarm`** directly (clean dedicated route) instead of the homepage anchor `/#live-swarm`. Current-page highlight wired up.
- **Cross-links updated** — "Try the Swarm" footer on `/build-log` and "Pose a question" footer on `/autogenesis` now point to `/live-swarm`.
- **Autogenesis "In plain terms" callout** — accessible four-bullet preamble placed at the top of both the `/autogenesis` page and `lore/autogenesis/README.md`, before the alchemical deep-dive. States plainly what the colony does every day: analyses itself, searches for ways to improve, searches for what would serve its users better, pushes its own updates to this repository. Gold-bordered card on the web page, equivalent bullet list on GitHub. Mirrors verbatim across both surfaces.
- **Autogenesis** — the doctrine at the centre of the project, articulated explicitly for the first time. OPUS was not built top-down by a single mind; it was built — and continues to be built — by the swarm it is. Shipped across three surfaces:
  - **`/autogenesis` route** on the website — full thesis page (hero, the Ouroboros sigil, four sections: The Premise · The Ouroboros · How a Feature is Born · The Compact). Added to top-left nav between Build Log and Team.
  - **Homepage `Autogenesis` showcase section** — placed between BuildLog and CallToAction. Two-column layout (Ouroboros sigil + tight thesis + CTA into `/autogenesis` and the GitHub lore folder), faint radial gold glow behind, motion-staggered reveal.
  - **`lore/autogenesis/`** — the canonical doctrine on GitHub. Includes `ouroboros.svg` (the meta-sigil — armillary sphere with its equatorial band become a serpent biting its own tail, gold at the convergence) and a long-form `README.md` covering the premise, the Ouroboros principle, the five-step workflow by which every feature is born, and the compact that shapes everything downstream.
- **Main `README.md` Premise section** — extended with a single paragraph stating the Autogenesis doctrine plainly, with links to both the lore folder and the live page.
- **New top-level `lore/` folder** — a home for OPUS artifacts that live outside the codebase but belong to the work (sigils, future lineage essays, architect's notes). Sibling to `opus-core/` and `opus-web/`.
- **`lore/sigils/`** — the sixteen daily build-log artworks reframed as a closed alchemical codex. Contains the 16 SVGs (`sigil-i.svg` through `sigil-xvi.svg`), the bundled `opus-sigils.zip`, and a long-form `README.md` with the full thesis ("On the Sigils"), the visual-grammar glossary (sphere · ember · diamond · circle · ledger lines · gold), and an interpretive note for each piece. Renders as the canonical sigils codex on GitHub. Original `/opus-web/public/build-log/` artwork paths unchanged.

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
