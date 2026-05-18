import type { Metadata } from "next";
import Link from "next/link";
import { Divider } from "@/components/ui/Divider";
import { LiveSwarm } from "@/components/LiveSwarm";

export const metadata: Metadata = {
  title: "OPUS — The Live Swarm",
  description:
    "Pose the colony a question. Watch nine agents deliberate — Scouts gather, Workers argue, the Verifier attempts to falsify, the Hive Core surfaces the verdict. The OpusAI Live Swarm, free to use, no account, no install.",
};

export default function LiveSwarmPage() {
  return (
    <main className="min-h-screen bg-opus-black text-opus-bone overflow-x-hidden">
      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="relative w-full px-6 pt-32 pb-12 md:pt-40 md:pb-16 text-center">
        <p className="opus-eyebrow text-opus-silver mb-6">
          — § The OpusAI Live Swarm · MMXXVI —
        </p>
        <h1 className="opus-display text-opus-bone text-[clamp(2.8rem,11vw,8rem)] leading-none mb-10">
          L&nbsp;I&nbsp;V&nbsp;E&nbsp; S&nbsp;W&nbsp;A&nbsp;R&nbsp;M
        </h1>
        <p className="opus-mono text-opus-gold text-xs md:text-sm uppercase tracking-widest mb-6">
          REAL-TIME OPUS LLM SWARM · LET THE COLONY WORK
        </p>
        <p className="opus-serif italic text-opus-bone text-base md:text-xl leading-relaxed max-w-2xl mx-auto">
          Pose the colony a question. Watch it deliberate.
        </p>
      </section>

      {/* ─── The Swarm Widget (embedded) ───────────────────────── */}
      <LiveSwarm embedded />

      {/* ─── Article — the four explainer sections ─────────────── */}
      <article className="mx-auto max-w-[760px] px-6 pt-12 pb-16">
        <Divider width="80px" className="mb-2" />

        {/* §1 — How to use it */}
        <SectionTitle eyebrow="§1" title="How to use it" />
        <Prose>
          <p className="opus-dropcap">
            The Live Swarm is free, anonymous, and has no install. There is no signup, no
            paywall, no API key to enter. You type a question, the colony deliberates, you
            read what it concluded and why.
          </p>
          <ol>
            <li><strong>Pose a question</strong> in the input above. Open and adversarial questions work best — anything you genuinely want stress-tested by nine agents reading the same context.</li>
            <li><strong>Press <em>Begin Deliberation</em>.</strong> Scouts wake first, then Workers (Researcher · Critic · Synthesiser · Verifier), then the Hive Core. The topology animates as each agent activates.</li>
            <li><strong>Watch the transcript.</strong> Every Record the colony writes appears in order: the role, the content, a confidence score, the model used, and the cost in USD.</li>
            <li><strong>Read the verdict.</strong> When the loop completes, the final Synthesis surfaces below the transcript, with the total cost of the run and a path to the provenance trace.</li>
          </ol>
        </Prose>

        <SectionTitle eyebrow="§1.1" title="Questions that suit it" />
        <Prose>
          <p>The Live Swarm is built for questions where the value is in the <em>deliberation</em>, not the lookup. Three patterns suit it especially well:</p>
          <ul>
            <li><strong>Stress-test your own thesis.</strong> <em>&ldquo;What are the strongest arguments against my position that X?&rdquo;</em></li>
            <li><strong>Surface hidden assumptions.</strong> <em>&ldquo;What is this argument quietly assuming about Y?&rdquo;</em></li>
            <li><strong>Force a verdict between options.</strong> <em>&ldquo;Given constraints A, B, C — which of these three approaches survives?&rdquo;</em></li>
          </ul>
          <p>For factual lookups, a single model is faster. The Live Swarm exists for questions a single model cannot honestly answer alone.</p>
        </Prose>

        {/* §2 — What to use it for */}
        <SectionTitle eyebrow="§2" title="What to use it for" />
        <Prose>
          <p>
            People who get the most out of the Live Swarm tend to use it for the same handful of things:
          </p>
          <ul>
            <li><strong>Researchers</strong> — to find what is wrong with a paper draft before submitting it; to surface counter-arguments before defending a thesis.</li>
            <li><strong>Founders</strong> — to red-team a strategy. The Critic and Verifier are paid to disagree; cheap criticism beats expensive mistakes.</li>
            <li><strong>Writers</strong> — to find the weakest paragraph of a long essay, or the missing argument that a single model glossed over.</li>
            <li><strong>Engineers</strong> — to evaluate trade-offs between architectures, libraries, or refactors where the right answer depends on context the colony can hold simultaneously.</li>
            <li><strong>Anyone wrestling with a real decision</strong> — anywhere the cheap shortcut is to ask one model and accept its first plausible answer.</li>
          </ul>
        </Prose>

        {/* §3 — Why this is the future */}
        <SectionTitle eyebrow="§3" title="Why this is the future" />
        <Prose>
          <p>
            A single language model, however large, reasons in one voice. It produces a stream of plausible tokens, defends them, and moves on. It cannot meaningfully disagree with itself; it cannot triangulate; it cannot be falsified except from outside.
          </p>
          <p>
            This was acceptable when models were toys. It is not acceptable when they are infrastructure.
          </p>
          <p>
            The next generation of useful AI will not be measured by parameter count or by benchmark scores. It will be measured by <em>whether you can trust the answer</em>. That requires three things a single model cannot give you:
          </p>
          <ul>
            <li><strong>Multiple perspectives</strong> — held simultaneously, not averaged into one.</li>
            <li><strong>A falsification step</strong> — at least one agent whose job is to try to break the answer before it leaves the room.</li>
            <li><strong>Provenance</strong> — a complete audit trail of who said what, when, with what confidence, at what cost.</li>
          </ul>
          <p>
            OPUS is one model of how to do this. There will be others. What matters is that the era of the lonely oracle is ending. The Live Swarm is what comes next, in working form, in the open.
          </p>
        </Prose>

        {/* §4 — How it was made */}
        <SectionTitle eyebrow="§4" title="How it was made" />
        <Prose>
          <p>
            The Live Swarm sits on top of <strong>opus-core</strong>, a Python engine that implements the architecture in full. Eight agent classes, an append-only Blackboard, a three-stage consensus pipeline, a bounded falsification loop, an honest USD cost ledger. The whitepaper has the full specification; the architecture deep-dive has the engineering reference.
          </p>
          <p>
            The colony reasons on the Anthropic API — <code>claude-opus-4-7</code> for the Workers and the Judge, <code>claude-sonnet-4-6</code> for the cheaper Scouts. Async runtime via <code>asyncio</code> + <code>anyio</code>. Strict typing via <code>pydantic v2</code>. CLI via <code>typer</code>. Tests via <code>pytest</code>. No magic, no proprietary backend.
          </p>
          <p>
            The lineage is older. The blackboard architecture was first formalised at Carnegie Mellon between 1971 and 1976 (Hearsay-II). The principle of agents coordinating through environmental modification was named by Pierre-Paul Grassé in 1959 (stigmergy, in termite mound construction). The combinatorial generation of testable propositions traces to Ramon Llull&apos;s <em>Ars Magna</em> around 1305. OPUS is the first system to put all three under one roof, applied to large language models, with engineering discipline.
          </p>
          <p>
            Everything is MIT-licensed. The full source is on GitHub. The whitepaper is a public PDF. The build log is broadcast in public, daily. The colony, true to its own doctrine, is its own author — the entire project is built and continues to be built by the swarm it is.
          </p>
        </Prose>

        {/* Footer */}
        <div className="mt-24 mb-12">
          <Divider width="120px" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <p className="opus-mono text-opus-dim text-xs uppercase tracking-widest">
            Magnum&nbsp;Opus · MMXXVI
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/whitepaper"
              className="opus-mono text-opus-gold text-xs uppercase tracking-widest border border-opus-gold/60 px-4 py-2 hover:bg-opus-gold hover:text-opus-black transition-colors"
            >
              Whitepaper
            </Link>
            <Link
              href="/autogenesis"
              className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-4 py-2 hover:border-opus-bone hover:text-opus-bone transition-colors"
            >
              Autogenesis
            </Link>
            <Link
              href="/build-log"
              className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-4 py-2 hover:border-opus-bone hover:text-opus-bone transition-colors"
            >
              Build Log
            </Link>
            <Link
              href="/"
              className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-4 py-2 hover:border-opus-bone hover:text-opus-bone transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>

        {/* ─── Quiet preview note — the last whisper on the page ─── */}
        <div className="mt-2 mb-4 text-center">
          <p className="opus-serif italic text-opus-dim text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
            The interactive demo above is a cinematic preview, scripted from a real swarm trace. The live-API wiring — real Records, real cost, downloadable provenance — ships in Phase&nbsp;α.
          </p>
        </div>
      </article>
    </main>
  );
}

// ──────────────────────────────────────────────────────────────────
// Shared helpers (mirrors /whitepaper, /autogenesis)
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
    <div className="opus-serif text-opus-bone text-[1.06rem] md:text-[1.12rem] leading-relaxed space-y-5 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-2 [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li:before]:content-['•'] [&_ul_li:before]:text-opus-gold [&_ul_li:before]:absolute [&_ul_li:before]:left-0 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-3 [&_ol]:marker:text-opus-gold [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:text-opus-gold [&_code]:bg-opus-gold/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-sm [&_em]:text-opus-bone [&_em]:italic [&_strong]:text-opus-bone [&_strong]:font-semibold">
      {children}
    </div>
  );
}
