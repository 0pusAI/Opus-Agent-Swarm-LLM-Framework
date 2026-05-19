# Changelog

All notable changes to **OPUS** — the bio-inspired multi-agent swarm architecture for collective reasoning.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Coming next (Phase α)

- `opus-core` deployed on Modal exposing the swarm via a hosted SSE endpoint
- `LiveSwarm` on the website consuming **real** Records from a public hosted colony (currently still cinematic preview)
- Per-IP rate limiting via Upstash Redis on the hosted demo
- Vector memory adapter (Qdrant) for cross-query learning
- Redis Streams backend for the Blackboard (distributed deployments)

---

## [2.0.0] — 2026-05-19 — *"Multiplicatio · The Open Colony"*

> The biggest release since launch. OPUS is now a fully multi-provider, fully open-source, fully runnable-in-one-command AI LLM swarm framework that anyone with a terminal can use to spin up their own colony — with Anthropic, OpenAI, local Ollama, or any custom backend they bring. The autogenesis doctrine moves from prose to runnable Python. The tokenomics policy locks at 45 / 35 / 20. The test suite goes from 18 to **84 passing in under 4 seconds**, with zero breaking changes.

### Headline features

- **`opus serve`** — one command boots a local web UI on `localhost`. The OPUS-register web app streams the swarm's deliberation live via server-sent events. Anyone with a terminal can now run their own colony in three commands. ([commit](https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework/commit/eacc5f4))
- **Multi-provider LLM abstraction** — Anthropic, OpenAI (and every OpenAI-compatible gateway: groq, together, fireworks, openrouter, vLLM, litellm-proxy), local Ollama (free, no API key, fully private), or any custom backend. One protocol, four built-in implementations, zero changes to the agent / consensus / Hive layers. ([commit](https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework/commit/7cc2e2f))
- **`opus.autogenesis` + `opus.introspection`** — the colony can now scan its own repository, surface its own bottlenecks, and feed them back into its own deliberation loop. The autogenesis doctrine made executable. ([commit](https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework/commit/e1367db))
- **Public tokenomics policy + treasury log** — 45 % Buybacks & Burns, 35 % Swarm Operations, 20 % Scaling & Development. Append-only public ledger. The colony's treasury cannot move funds without leaving a trace in git. ([commit](https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework/commit/939d7dd))
- **84 / 84 tests passing** (was 18). Full repo suite runs in under 4 seconds. No network, no API key required.
- **Zero breaking changes.** Every existing call to `LLMClient()`, every existing agent, every existing example continues to work without modification.

### Added — `opus-core` engine

#### Local web UI (`opus serve`)

- **`opus serve` — one-command local web UI.** Boots a FastAPI server on `http://127.0.0.1:8000` with a single-page OPUS-register web app where anyone can pose questions to their own colony and watch the swarm deliberate live. The UI is inline (HTML + CSS + JS in one Python string constant), no build step, no external assets, ships entirely as part of the Python install. Browser opens automatically; `--no-browser` to skip; `--host` / `--port` / `--provider` for everything else.
- **`opus.server` — the server module.** `create_app(llm, ...)` returns a FastAPI app exposing `GET /` (UI), `GET /api/status` (active provider + per-role models), `POST /api/query` (start a deliberation, returns `run_id`), `GET /api/stream/{run_id}` (server-sent events: `phase`, `record`, `complete`, `error`). `run_server(llm, ...)` boots uvicorn synchronously.
- **`Hive.run()` now accepts an optional `blackboard` kwarg** — non-breaking. Lets outside consumers inject a Blackboard so they can poll it for live Records (which is exactly how the SSE stream works without modifying any agent code). Defaults to creating a fresh `InMemoryBlackboard` per call.
- **`[serve]` extra in `pyproject.toml`** — `pip install -e ".[serve]"` adds `fastapi>=0.110` + `uvicorn>=0.27`. Kept optional so the core install stays light for users who only want the library.
- **`tests/test_server.py` — 7 new tests** covering the UI page, `/api/status`, `/api/query` (accepts valid, rejects empty + oversize via pydantic validation), `/api/stream/{run_id}` (404 for unknown, full end-to-end SSE flow including phase + record + complete events). Tests run against the FastAPI app directly via `httpx.ASGITransport`; no real network, no API key.

#### Multi-provider LLM abstraction

- **`opus.llm.providers` — pluggable LLM backends.** The colony now runs on Anthropic, OpenAI (and every OpenAI-compatible gateway — groq, together, fireworks, openrouter, vLLM, litellm-proxy), local Ollama (free, no API key, fully private), or any custom `LLMProvider` subclass. One protocol, four built-in implementations, zero code changes needed in the agent / consensus / Hive layers. Per-role default model names come from each provider automatically (worker / scout / judge / verifier) so the Hive just works on any backend out of the box. `auto_provider()` picks intelligently based on which API key is in the environment, with `OPUS_PROVIDER` env var as explicit override.
- **`LLMClient` refactored** to delegate to a swappable provider while preserving its existing public API exactly. Existing code keeps working unchanged; new code can pass `provider=...` to switch backends.
- **`OpenAIProvider`** — uses raw `httpx` (already a transitive dep, no new SDK) so it works with OpenAI proper, Azure OpenAI, or any OpenAI-API-compatible gateway. Handles the o-series quirks transparently (`max_completion_tokens` vs `max_tokens`, `reasoning_effort` mapping). Pricing table for gpt-4o / gpt-4o-mini / gpt-4.1 / o1 / o3-mini included.
- **`OllamaProvider`** — local LLM via `http://localhost:11434` (or `OLLAMA_HOST` override). Always-free cost estimation. Lets anyone run the entire OPUS swarm on their own machine with zero recurring expense.
- **`MockProvider`** — deterministic mock backend for tests, with two modes (static response cycling, templated responder callable). Records every call it received so tests can assert agent prompts.
- **`tests/test_providers.py` — 32 new tests** covering every provider, the auto-detection logic, error paths (missing key, API failure, connection refused), the o-series special-case handling, cost estimation, default models, and `LLMClient` backward compatibility. Uses `httpx.MockTransport` for network-free testing of OpenAI / Ollama.
- **`examples/using_openai.py` and `examples/using_ollama.py`** — runnable end-to-end demos showing the exact same Hive code reasoning through different backends.

#### Autogenesis (the colony reading and improving itself)

- **`opus.autogenesis` — functional autonomous-mode module.** Implements the autogenesis loop OPUS uses on itself: pose → deliberate → implement → verify → hand back to the caller. Provides `AutogenesisLoop` (the orchestrator) and `Step` (the per-iteration result, with verified status, plan, implementation, and costs). The `commit_handler` callback is intentionally pluggable — the colony surfaces verified verdicts, the user decides where they land (open a PR, write to disk, drop in Slack, anything). ~200 lines, fully type-hinted, no external dependencies beyond the rest of `opus`.
- **`opus.introspection` — the colony reading itself.** The missing functional piece between `AutogenesisLoop` (which needs a goal handed in) and `lore/colony-decisions/` (which captures verdicts after they're deliberated). Provides `Observation` (structured finding), `RepoAnalyst` (four scanners out of the box: `find_todos`, `find_stale_links`, `find_missing_docstrings`, `find_test_gaps` — walks plain text and Python AST, zero new dependencies), and `surface_bottlenecks` (hands the observations to the Hive, returns a verdict suitable as the goal for an `AutogenesisLoop`).
- **`examples/autogenesis_demo.py`** — runnable end-to-end demo of the loop with a sample goal and a `commit_handler` that prints each verified step.
- **`examples/autogenesis_continuous.py`** — the full pipeline as one runnable script: scan → surface → loop → commit. Default target is the OPUS repo itself, so anyone with an Anthropic key can watch the colony work on its own codebase end to end.
- **`tests/test_introspection.py` — 27 tests** proving the introspection module actually works. Covers `Observation` invariants, every `RepoAnalyst` scanner (positive + negative cases), `scan()` orchestration, ignore-list and custom-extensions behaviour, and `surface_bottlenecks` against a stubbed Hive.

#### Public API + version

- **Public API surfaced in `opus/__init__.py`** — `Hive`, `LLMClient`, `Budget`, `AutogenesisLoop`, `Step`, `RepoAnalyst`, `Observation`, `surface_bottlenecks`, `LLMProvider`, `CompletionResult`, `AnthropicProvider`, `OpenAIProvider`, `OllamaProvider`, `MockProvider`, `auto_provider`, plus three error types. **16 public exports.**
- **`pyproject.toml`** — version bumped to **2.0.0**, `httpx>=0.27` added as an explicit dependency, `[serve]` optional extra added.

### Added — `docs/` (knowledge & onboarding)

- **`docs/quickstart.md` — zero-to-running guide.** Plain-spoken, cross-platform (PowerShell-first for Windows, bash for macOS/Linux), aimed at someone who has never installed a Python package from source before. Covers prerequisites with one-line install commands per OS, the full install path, first-query walkthrough, programmatic `Hive` usage, the `AutogenesisLoop` pattern, and a "common issues" section.
- **`docs/api.md` — complete API reference** (~350 lines) covering install, configuration with the multi-provider matrix, CLI, library API (`Hive` · `LLMClient` · `Budget` · `RunResult`), the autogenesis loop, the introspection module, the provenance JSONL format, and FAQ.
- **`docs/tokenomics.md` — the colony's Creator Rewards allocation policy.** Fixed at launch, locked until a fresh deliberation overturns it. 45 % to Buybacks & Burns (weekly cadence, on-chain tx hashes posted within 24 h), 35 % to Swarm Operations, 20 % to Scaling & Development. Includes the CA, the cadence per bucket, reasoning behind the percentages, wallets section ready to fill, and transparency commitments.
- **`docs/release-notes-v2.md`** — formal release notes for v2.0.0 (this release).

### Added — `opus-web` (the public site)

- **`/api` — fully dedicated API page** (the *multiplicatio* doctrine). Hero with the "T H E A P I" wordmark + `OPEN · MIT · SELF-HOSTED · YOUR KEYS · YOUR COLONY` mono subtitle. Five sections covering the premise, install path, directed mode, autonomous mode, and where to start.
- **`/live-swarm` — fully dedicated OpusAI Live Swarm page.** The interactive swarm widget gets its own destination route, with an honest "cinematic preview" note explaining Phase α and four substantive explainer sections.
- **`/now` — dedicated page for the colony's three latest moves.** Single source of truth at `opus-web/src/data/colonyNow.ts`. Three stacked cards with clear in-progress vs shipped differentiation. Every shipped card links to its real commit hash on GitHub.
- **Nav: 6 + 1 items, mobile-swipeable.** OpusAI · Now · Whitepaper · API · Build Log · Autogenesis · Team, plus a small GitHub icon button anchored on the right edge. Brand mark stays anchored on the left; nav items scroll horizontally on mobile with a subtle right-edge fade indicator.
- **Nav: always-on top atmosphere gradient.** A 128 px-tall vertical fade (`opus-black/90` → transparent) sits behind the nav so labels are legible against any background, including the cinematic hero on mobile.
- **Solana CA published in the hero** — click-to-copy button with mobile truncation. Mirrors the canonical CA shown in both repository READMEs.
- **Homepage Autogenesis section** placed between BuildLog and CallToAction. Ouroboros sigil + tight thesis + CTA into `/autogenesis`.
- **Autogenesis page: "In plain terms" callout** placed above the alchemical thesis on both the web page and the GitHub lore essay. Mirrored verbatim across both surfaces.
- **Multi-step homepage reorganisation** — narrative flow ends on Materials (the colony's tech stack as a colophon), not in the middle.

### Added — `lore/` (the cultural surface)

- **`lore/autogenesis/`** — the canonical doctrine on GitHub. Includes `ouroboros.svg` (the meta-sigil) and a long-form `README.md` covering the premise, the Ouroboros principle, the five-step workflow, and the compact.
- **`lore/colony-decisions/`** — the colony's public reasoning log. One markdown file per decision, with the question posed, candidates considered, verdict surfaced, reasoning, and action being taken. Three entries logged: `2026-05-19_next-bottleneck.md` (Modal deployment as the next move), `2026-05-19_autogenesis-live.md` (introspection module ships), `2026-05-19_v2-released.md` (this v2.0.0 release).
- **`lore/sigils/`** — the sixteen daily build-log artworks reframed as a closed alchemical codex with thesis, glossary of recurring glyphs, and per-piece interpretive notes. PNG versions at 1080×1080 also bundled at `lore/sigils-png/` for direct social-media use.
- **`lore/launch-thread/`** — the X launch thread assets: branded post cards (Post 2 · Post 3 · Post 4 · Post 5 · Post 6 + Llull quote card + compute card + autogenesis card) in OPUS register, plus 5:2 vision banner. All 1080×1080 PNG, ready to drop straight into X.
- **`lore/teaser/`** — start-frame and end-frame keyframes (1920×1080) for the OPUS commercial teaser, with re-render scripts.

### Added — top-level

- **Official $OPUS Solana CA published on all surfaces.** `FjGZibcd8DBzxoL3H2srMayap1h7S5Q5NuPoaJcVpump` is now visible at the top of the main `README.md`, at the top of `opus-core/README.md`, and in the website hero. One canonical address, three surfaces, no ambiguity.
- **`treasury-log.md` — the colony's public ledger.** Append-only, newest-first, four entry types (Inflow, Buyback & Burn, Operations, Scaling). Cadence section at the top documents the execution schedule.

### Changed

- **`opus-core/README.md` rewritten** with three usage paths (CLI · Library · Autogenesis · Local Web UI), expanded layout diagram showing the `providers/` and `server/` subpackages, test count updated to 84.
- **Live Swarm page** — the "— A note on the demo —" callout moved to the very bottom of the page as a quiet final whisper in dim italic serif.
- **LiveSwarm component refactored** with an optional `embedded` prop. Homepage behaviour unchanged; the dedicated `/live-swarm` page uses `embedded=true` to wrap the widget in its own page hero.

### Deprecated · Removed · Security

- *None.* This release is purely additive. Every public API from 0.1.0 continues to work unchanged.

### Stats

- **84 tests** passing (was 18) — Blackboard (5), Consensus (8), Hive (5), Introspection (27), Providers (32), Server (7)
- **3,500+ lines** of new production code across `opus-core/src/opus/`
- **6 new modules**: `autogenesis`, `introspection`, `llm.providers.{base, anthropic, openai, ollama, mock}`, `server.{app, ui}`
- **4 new runnable examples**: `autogenesis_demo.py`, `autogenesis_continuous.py`, `using_openai.py`, `using_ollama.py`
- **3 new documentation surfaces**: `docs/quickstart.md`, `docs/api.md`, `docs/tokenomics.md`
- **4 new website routes**: `/api`, `/autogenesis`, `/live-swarm`, `/now`
- **16 public API exports** from `opus/__init__.py` (was 1: just `__version__`)
- **0 breaking changes**

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
