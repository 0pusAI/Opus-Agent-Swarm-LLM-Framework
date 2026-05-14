import type { Metadata } from "next";
import Link from "next/link";
import { Divider } from "@/components/ui/Divider";

export const metadata: Metadata = {
  title: "OPUS — Whitepaper",
  description:
    "Ars Magna · A Bio-Inspired Multi-Agent Swarm Architecture for Collective Reasoning. Full whitepaper, version 0.1.",
};

export default function WhitepaperPage() {
  return (
    <main className="min-h-screen bg-opus-black px-6 py-32 md:py-40">
      <article className="mx-auto max-w-[760px] text-opus-bone">
        {/* ─── Title ─────────────────────────────────────────────── */}
        <header className="mb-16 text-center">
          <p className="opus-eyebrow text-opus-silver mb-6">— Whitepaper · v0.1 · MMXXVI —</p>
          <h1 className="opus-display text-opus-bone text-[clamp(2.5rem,7vw,4.5rem)] leading-none mb-6">
            OPUS
          </h1>
          <p className="opus-serif text-opus-silver italic text-lg md:text-xl leading-relaxed">
            Ars Magna · A Bio-Inspired Multi-Agent Swarm Architecture for
            <br />
            Collective Reasoning
          </p>
          <Divider className="mt-12" width="80px" />
        </header>

        <SectionTitle eyebrow="§1" title="Premise" />
        <Prose>
          <p className="opus-dropcap">
            OPUS is not a model. It is a colony.
          </p>
          <p>
            A single language model, however large, reasons in one voice. It produces a stream of plausible tokens, defends them, and moves on. It cannot meaningfully disagree with itself. It cannot triangulate. It cannot be falsified except from outside.
          </p>
          <p>We replace that lonely soliloquy with a structured swarm.</p>
          <p>
            Three concentric tiers — <em>Scouts</em> at the perimeter, <em>Workers</em> in the middle, a <em>Hive Core</em> at the centre — coordinate not by speaking to each other but by writing typed records to a single shared substrate: the <em>Blackboard</em>, an append-only event log. Each agent reads the current state of the Blackboard, performs one unit of cognition, and writes its result back. No agent has a private channel to any other. The environment is the conversation.
          </p>
          <p>
            This is the stigmergic principle, observed first in termite mound construction by Grassé in 1959 and formalised in computer science as the blackboard architecture by Hearsay-II at Carnegie Mellon between 1971 and 1976. It is not new. What is new is applying it, with discipline, to large language models — to obtain something a single model cannot produce: a <em>deliberation</em>, with an audit trail, a confidence, and a falsification attempt baked in.
          </p>
          <p>
            When the colony has deliberated enough, three stages of consensus run: <strong>Borda aggregation</strong> across all Worker outputs, <strong>Judge adjudication</strong> on near-ties, and a <strong>Verifier pass</strong> that attempts to <em>falsify</em> the chosen answer. If verification fails, the swarm re-deliberates with the falsification as a new constraint. The loop is bounded: at most three attempts, after which the colony surfaces what it has, with confidence and trace.
          </p>
          <p className="opus-serif italic text-opus-gold text-center pt-2">
            Solve et coagula — dissolve a single mind into many; recombine the many into one well-considered answer. That is the Great Work.
          </p>
        </Prose>

        <SectionTitle eyebrow="§2" title="Architecture" />
        <Prose>
          <h3 className="opus-display text-opus-gold text-lg mb-4 mt-8">
            2.1 — The three tiers
          </h3>
          <pre className="opus-mono text-[0.72rem] md:text-xs leading-snug text-opus-silver bg-opus-black/60 border border-opus-dim/40 p-4 overflow-x-auto whitespace-pre">
{`            ┌─────────────────────┐
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
            └─────────────────────┘`}
          </pre>
          <p>Each tier has a distinct cost profile and reasoning style.</p>
          <ul>
            <li><strong>Scouts</strong> are cheap and many. They retrieve, sense, and reconnoitre. Default model: <code>claude-sonnet-4-6</code>. They do not opine; they bring back evidence.</li>
            <li><strong>Workers</strong> are the deliberators. Fewer in number but more capable. Default model: <code>claude-opus-4-7</code>. Each Worker has a single role — Researcher, Critic, Synthesiser, Planner, Executor, Verifier — and operates on the same Blackboard.</li>
            <li><strong>Hive Core</strong> is one entity per query. It schedules agent rounds, enforces budgets, runs consensus, and emits the final Record.</li>
          </ul>

          <h3 className="opus-display text-opus-gold text-lg mb-4 mt-8">
            2.2 — The Agent contract
          </h3>
          <p>
            Every agent is a subclass of a single base class. Its only required method is <code>think(task, blackboard) → Record</code>. Agents are stateless across queries. All state lives on the Blackboard or in long-term memory. An agent is a <em>behaviour</em>, not a service.
          </p>
        </Prose>

        <SectionTitle eyebrow="§3" title="The Blackboard" />
        <Prose>
          <p>
            The Blackboard is an append-only log of typed Records. A Record is a pydantic model with strict typing: <code>id</code>, <code>agent_id</code>, <code>agent_role</code>, <code>parent_ids</code>, <code>type</code>, <code>content</code>, <code>confidence</code>, <code>model</code>, <code>cost_estimate</code>, <code>timestamp</code>.
          </p>
          <h3 className="opus-display text-opus-gold text-lg mb-4 mt-8">
            3.1 — Why append-only
          </h3>
          <ul>
            <li>A <strong>causal DAG</strong> for free, via <code>parent_ids</code>.</li>
            <li><strong>Time-travel debugging</strong> — replay any past Blackboard state.</li>
            <li>A <strong>complete audit trail</strong> of provenance, no extra plumbing.</li>
            <li><strong>Optimistic concurrency</strong> — writes never conflict; readers never block.</li>
          </ul>
          <h3 className="opus-display text-opus-gold text-lg mb-4 mt-8">
            3.2 — Why not CRDTs
          </h3>
          <p>
            v0 runs in a single Python process. CRDTs solve a distributed-consistency problem we do not yet have. The Blackboard interface is abstracted (<code>append</code>, <code>read</code>, <code>subscribe</code>) so a Redis Streams backend, and eventually a CRDT-based one, can slot in without touching agent code. We will adopt that complexity when the workload justifies it; not before.
          </p>
        </Prose>

        <SectionTitle eyebrow="§4" title="Consensus" />
        <Prose>
          <p>Three stages, each independently testable.</p>
          <h3 className="opus-display text-opus-gold text-lg mb-4 mt-8">
            4.1 — Borda aggregation
          </h3>
          <p>
            Every Worker that produces a Synthesis Record also produces a ranked list of all candidate Syntheses on the Blackboard. We aggregate using <strong>weighted Borda count</strong>: each Worker&apos;s vote is multiplied by a role weight. Defaults for v0:
          </p>
          <p className="opus-mono text-xs text-opus-silver pl-2 border-l border-opus-gold/60 italic">
            Researcher 1.0 · Critic 1.2 · Synthesiser 1.5 · Verifier 1.3 · Planner 1.0 · Executor 0.8.
          </p>
          <p>
            Critics and Verifiers are weighted higher because their failure mode (false negatives) is less harmful than a Synthesiser&apos;s (false positives). These numbers are starting points; tune empirically.
          </p>
          <h3 className="opus-display text-opus-gold text-lg mb-4 mt-8">
            4.2 — Judge adjudication
          </h3>
          <p>
            If the top two candidates are within ε = 5% of each other on aggregate Borda score, a single Judge agent (model: <code>claude-opus-4-7</code>) reads both candidates <em>and</em> the trace that produced them, and selects a winner with reasoning. The Judge&apos;s verdict is itself a Record on the Blackboard.
          </p>
          <h3 className="opus-display text-opus-gold text-lg mb-4 mt-8">
            4.3 — Verifier pass
          </h3>
          <p>
            The chosen Synthesis goes to a Verifier agent whose job is the opposite of synthesis: <em>find what is wrong with it</em>. The Verifier returns either <code>verdict.accepted</code> or <code>verdict.falsified</code> with a specific counter-example. Verification is bounded to <strong>three attempts</strong>. After the third, the colony surfaces the strongest remaining candidate along with the unresolved falsifications, marked clearly. <strong>The user is never lied to about the colony&apos;s certainty.</strong>
          </p>
        </Prose>

        <SectionTitle eyebrow="§5" title="Tech Stack" />
        <div className="my-8 overflow-x-auto">
          <table className="w-full opus-serif text-sm md:text-base">
            <thead>
              <tr className="border-b border-opus-dim/60">
                <th className="text-left py-3 pr-4 opus-mono text-opus-gold text-xs uppercase tracking-widest">Layer</th>
                <th className="text-left py-3 pr-4 opus-mono text-opus-gold text-xs uppercase tracking-widest">Component</th>
                <th className="text-left py-3 opus-mono text-opus-gold text-xs uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="text-opus-bone">
              <tr className="border-b border-opus-dim/30"><td className="py-2 pr-4">Models</td><td className="py-2 pr-4 opus-mono text-xs">claude-opus-4-7</td><td className="py-2"><Pill kind="active" /></td></tr>
              <tr className="border-b border-opus-dim/30"><td className="py-2 pr-4">Models</td><td className="py-2 pr-4 opus-mono text-xs">claude-sonnet-4-6</td><td className="py-2"><Pill kind="active" /></td></tr>
              <tr className="border-b border-opus-dim/30"><td className="py-2 pr-4">Async runtime</td><td className="py-2 pr-4 opus-mono text-xs">asyncio + anyio</td><td className="py-2"><Pill kind="active" /></td></tr>
              <tr className="border-b border-opus-dim/30"><td className="py-2 pr-4">Validation</td><td className="py-2 pr-4 opus-mono text-xs">pydantic v2</td><td className="py-2"><Pill kind="active" /></td></tr>
              <tr className="border-b border-opus-dim/30"><td className="py-2 pr-4">Logging</td><td className="py-2 pr-4 opus-mono text-xs">structlog (JSON)</td><td className="py-2"><Pill kind="active" /></td></tr>
              <tr className="border-b border-opus-dim/30"><td className="py-2 pr-4">CLI</td><td className="py-2 pr-4 opus-mono text-xs">typer</td><td className="py-2"><Pill kind="active" /></td></tr>
              <tr className="border-b border-opus-dim/30"><td className="py-2 pr-4">Tests</td><td className="py-2 pr-4 opus-mono text-xs">pytest, pytest-asyncio</td><td className="py-2"><Pill kind="active" /></td></tr>
              <tr className="border-b border-opus-dim/30"><td className="py-2 pr-4">Web</td><td className="py-2 pr-4 opus-mono text-xs">Next.js 14 + Three.js + GSAP</td><td className="py-2"><Pill kind="live" /></td></tr>
              <tr className="border-b border-opus-dim/30"><td className="py-2 pr-4">Vector memory</td><td className="py-2 pr-4 opus-mono text-xs">Qdrant (interface stubbed)</td><td className="py-2"><Pill kind="planned" /></td></tr>
              <tr className="border-b border-opus-dim/30"><td className="py-2 pr-4">Graph memory</td><td className="py-2 pr-4 opus-mono text-xs">Neo4j (interface stubbed)</td><td className="py-2"><Pill kind="planned" /></td></tr>
              <tr className="border-b border-opus-dim/30"><td className="py-2 pr-4">Distributed bus</td><td className="py-2 pr-4 opus-mono text-xs">Redis Streams (Blackboard backend)</td><td className="py-2"><Pill kind="planned" /></td></tr>
              <tr><td className="py-2 pr-4">Observability</td><td className="py-2 pr-4 opus-mono text-xs">OpenTelemetry traces</td><td className="py-2"><Pill kind="planned" /></td></tr>
            </tbody>
          </table>
        </div>

        <SectionTitle eyebrow="§6" title="Lifecycle of a single query" />
        <Prose>
          <p>
            A default v0 query runs <strong>3 Scouts in parallel</strong>; <strong>6 Workers</strong> (2 Researchers, 2 Critics, 1 Synthesiser, 1 Verifier) over 1–3 rounds; <strong>1 Judge</strong> only if Borda is close; <strong>1 Verifier pass per round</strong>. Token + dollar budget is enforced by the Hive Core. Any agent attempting to exceed budget is short-circuited with a <code>verdict.budget_exhausted</code> Record.
          </p>
        </Prose>

        <SectionTitle eyebrow="§7" title="Provenance & Cost" />
        <Prose>
          <p>
            Every Record carries its <code>model</code>, <code>cost_estimate</code>, and <code>parent_ids</code>. The Hive Core writes a final <code>provenance.summary</code> Record at end-of-run containing total wall time, total tokens per model, total USD spent (using the official Anthropic pricing table, hard-coded and version-stamped), and the full causal DAG, serialisable to JSONL for replay.
          </p>
          <p>
            The CLI surfaces three things at end of run: <strong>the answer · the cost · the trace path</strong>. Nothing else by default. Verbosity is opt-in.
          </p>
        </Prose>

        <SectionTitle eyebrow="§8" title="What we are not building (yet)" />
        <Prose>
          <p>Stated plainly so future contributors do not assume otherwise.</p>
          <ul>
            <li>No authentication, accounts, or login.</li>
            <li>No payments, billing, credits, or virtual currencies of any kind.</li>
            <li>No persistent user database.</li>
            <li>No REST or GraphQL surface — CLI only for v0.</li>
            <li>No Docker, Kubernetes, or production deployment.</li>
            <li>No CI/CD until there is something to deploy.</li>
            <li>No marketplace, third-party agents, or governance — Phase β and beyond.</li>
          </ul>
        </Prose>

        <SectionTitle eyebrow="§9" title="Open editorial decisions" />
        <Prose>
          <p>
            These were defaulted in v0.1 and should be reviewed before v1.
          </p>
          <ol>
            <li><strong>Borda role weights</strong> — defaulted in §4.1. Tune empirically once we have a representative query set.</li>
            <li><strong>Verification ε threshold</strong> — defaulted to 5%. Sensitive to model temperature.</li>
            <li><strong>Default agent prompts</strong> — first-pass prompts live in <code>opus-core/src/opus/agents/</code>. These are <em>the product</em>; they want hand-crafting.</li>
            <li><strong>Budget defaults</strong> — currently unbounded in v0.1. Set sensible USD ceilings before public demos.</li>
            <li><strong>Vector + graph schemas</strong> — interfaces stubbed, no schema decisions yet.</li>
          </ol>
        </Prose>

        {/* Footer */}
        <div className="mt-24 mb-16">
          <Divider width="120px" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <p className="opus-mono text-opus-dim text-xs uppercase tracking-widest">
            Magnum&nbsp;Opus · MMXXVI
          </p>
          <div className="flex gap-4">
            <a
              href="/whitepaper.pdf"
              className="opus-mono text-opus-gold text-xs uppercase tracking-widest border border-opus-gold/60 px-4 py-2 hover:bg-opus-gold hover:text-opus-black transition-colors"
            >
              Download PDF
            </a>
            <Link
              href="/"
              className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-4 py-2 hover:border-opus-bone hover:text-opus-bone transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mt-20 mb-6">
      <p className="opus-eyebrow text-opus-gold mb-2">{eyebrow}</p>
      <h2 className="opus-display text-opus-bone text-2xl md:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="opus-serif text-opus-bone text-[1.06rem] md:text-[1.12rem] leading-relaxed space-y-5 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-2 [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li:before]:content-['•'] [&_ul_li:before]:text-opus-gold [&_ul_li:before]:absolute [&_ul_li:before]:left-0 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:marker:text-opus-gold [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:text-opus-gold [&_code]:bg-opus-gold/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-sm [&_em]:text-opus-bone [&_em]:italic [&_strong]:text-opus-bone [&_strong]:font-semibold">
      {children}
    </div>
  );
}

function Pill({ kind }: { kind: "active" | "live" | "planned" }) {
  const styles = {
    active:  "border-opus-bone text-opus-bone",
    live:    "border-opus-gold text-opus-gold",
    planned: "border-opus-dim text-opus-dim",
  };
  const labels = { active: "ACTIVE", live: "LIVE", planned: "PLANNED" };
  return (
    <span
      className={`inline-block px-2 py-0.5 opus-mono text-[0.6rem] uppercase tracking-widest border ${styles[kind]}`}
    >
      {labels[kind]}
    </span>
  );
}
