# OPUS — Glossary

Terms used throughout the codebase, whitepaper, and website. Where a term has a precise OPUS meaning that differs from common usage, the OPUS meaning takes precedence and is marked [opus].

---

**Agent** [opus]
A subclass of `Agent` with one required method: `think(task, blackboard) -> Record`. An Agent is a behaviour, not a service: stateless across queries, with all state on the Blackboard. Roles include Scout, Researcher, Critic, Synthesiser, Planner, Executor, Verifier, Judge.

**Ars Magna**
Latin, "the great art." The combinatorial reasoning system devised by Ramon Llull around 1305 to systematically generate and evaluate propositions about the world. The intellectual ancestor of OPUS's structured deliberation.

**Blackboard** [opus]
The append-only, typed event log that is the only communication medium between Agents in OPUS. Every act of cognition produces exactly one Record on the Blackboard. The Blackboard is the substrate of consensus, the source of provenance, and the embodiment of the stigmergic principle.

**Borda count**
A ranked-choice voting method in which each ranker assigns descending points to candidates. OPUS uses *weighted* Borda — each Worker's vote is multiplied by a role weight before aggregation. See whitepaper §4.1.

**Budget**
The hard ceiling on a query's resource use, enforced by the Hive Core. Today's fields: max agents, max worker rounds, max total USD. An Agent that would exceed the budget is short-circuited with a `verdict.budget_exhausted` Record.

**Critic** [opus]
A Worker whose role is targeted attack on Synthesis Records — finding weaknesses, contradictions, or missed constraints. Critics' Borda weight is set higher than Researchers' because false-negative critique is less harmful than false-positive synthesis.

**Executor** [opus]
A Worker that takes external action — calls a tool, runs code, hits an API. The only Agent permitted to have side effects outside the Blackboard. Side effects are recorded as Records with type `action`.

**Falsification**
A specific reason a candidate answer is wrong: a counter-example, a contradicted axiom, a violated constraint. Produced by the Verifier. Becomes a hard constraint on the next deliberation round.

**Hive Core** [opus]
The single orchestrator per query. Owns the Blackboard, schedules agent rounds, runs the consensus pipeline, enforces the budget, emits the final Record and provenance summary.

**Judge** [opus]
A specialised Agent that adjudicates near-ties in Borda aggregation. Reads both candidates *and* the trace that produced them, then selects a winner with reasoning. The Judge's verdict is itself a Record on the Blackboard. Fires only when the top two candidates are within ε = 5%.

**Magnum Opus**
Latin, "the great work." In alchemy, the project of transforming base matter into gold (or, more truthfully, of transforming the practitioner). The motto and the mission of this project.

**Planner** [opus]
A Worker that decomposes a complex task into a sequence of sub-tasks. Planners write `plan` Records that other Workers (typically Executors) consume.

**Provenance**
The complete, ordered trail of Records that produced a final answer, plus the cost and wall-time data attached to each. Serialised at end-of-run as `provenance/<query_uuid>.jsonl`. The OPUS guarantee is that no answer is ever surfaced without its provenance attached.

**Record** [opus]
A typed, immutable pydantic model written to the Blackboard. The unit of cognition. See whitepaper §3 for the full schema.

**Researcher** [opus]
A Worker that generates candidate hypotheses or evidence-backed claims. The "production" side of the deliberation, balanced by the "destruction" side (Critics, Verifier).

**Scout** [opus]
A perimeter Agent that retrieves, senses, and reconnoitres. Cheap, parallel, many. Scouts do not opine — they bring back evidence as `observation` Records. Default model: claude-sonnet-4-6.

**Solve et coagula**
Latin, "dissolve and coagulate." The alchemical maxim and the OPUS lifecycle: dissolve a single mind into many independent agents (solve), then coagulate the many into one well-considered answer (coagula).

**Stigmergy**
The principle, observed first in social insects by Pierre-Paul Grassé in 1959, of agents communicating through modification of a shared environment rather than through direct messages. The biological inspiration for the Blackboard.

**Synthesiser** [opus]
A Worker that integrates Records from Researchers and Critics into a single candidate answer. Each Synthesis Record is a candidate for consensus.

**Verifier** [opus]
A Worker whose sole job is to attempt to *falsify* the chosen Synthesis. Returns either `verdict.accepted` (no falsification found) or `verdict.falsified` with a specific counter-example. Bounded to three attempts per query.

**VIITE**
The colony's secret word. Used internally as a sentinel value and externally as an easter egg on the website. Means nothing on its own — it is a marker of initiation.

**Worker** [opus]
The middle tier of the swarm. Fewer than Scouts, more capable. Workers deliberate, critique, synthesise, plan, execute, verify. Default model: claude-opus-4-7.
