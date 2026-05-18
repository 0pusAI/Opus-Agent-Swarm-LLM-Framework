import type { Metadata } from "next";
import Link from "next/link";
import { Divider } from "@/components/ui/Divider";

export const metadata: Metadata = {
  title: "OPUS — The API",
  description:
    "OPUS is fully open-source. The entire colony — eight agent classes, the Blackboard, the consensus pipeline, the Verifier, the provenance ledger — is yours the moment you install it. Spawn your own swarm. Direct it at a problem, or let it build itself, autonomously, and watch what it becomes.",
};

export default function ApiPage() {
  return (
    <main className="min-h-screen bg-opus-black text-opus-bone overflow-x-hidden">
      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="relative w-full px-6 pt-32 pb-12 md:pt-40 md:pb-16 text-center">
        <p className="opus-eyebrow text-opus-silver mb-6">
          — § Multiplicatio · MMXXVI —
        </p>
        <h1 className="opus-display text-opus-bone text-[clamp(2.8rem,11vw,8rem)] leading-none mb-10">
          T&nbsp;H&nbsp;E&nbsp; A&nbsp;P&nbsp;I
        </h1>
        <p className="opus-mono text-opus-gold text-xs md:text-sm uppercase tracking-widest mb-6">
          OPEN · MIT · SELF-HOSTED · YOUR KEYS · YOUR COLONY
        </p>
        <p className="opus-serif italic text-opus-bone text-base md:text-xl leading-relaxed max-w-2xl mx-auto">
          Spawn a colony of your own.<br />
          Direct it at a problem — or let it build itself.
        </p>
        <Divider className="mt-14" width="80px" />
      </section>

      {/* ─── Article ───────────────────────────────────────────── */}
      <article className="mx-auto max-w-[760px] px-6 pb-16">
        {/* §1 — The Premise */}
        <SectionTitle eyebrow="§1" title="The Premise" />
        <Prose>
          <p className="opus-dropcap">
            OPUS is fully open-source. MIT. Not a hosted service you rent through an API key, not a SaaS with a usage meter — the entire colony, in source form, is yours the moment you install it.
          </p>
          <p>
            That means everything: the eight agent classes, the append-only Blackboard, the three-stage consensus pipeline, the Verifier that tries to falsify every verdict, the honest USD cost ledger, the provenance trace. All running in your own process, on your own machine, on your own Anthropic key. Nothing routes through us. Nothing is hidden behind a paywall. There is no other version of OPUS than the one you can read.
          </p>
          <p>
            The corollary is the interesting part. <em>If you can install OPUS, you can spawn your own colony.</em> And once you have your own colony, you can do with it what we do with ours: pose it questions, let it deliberate, let it ship its own commits.
          </p>
          <p className="opus-serif italic text-opus-gold text-center pt-2">
            This is multiplicatio — the stage of the Great Work where the stone replicates itself.
          </p>
        </Prose>

        {/* §2 — Spawn a colony */}
        <SectionTitle eyebrow="§2" title="Spawn a colony" />
        <Prose>
          <p>
            Four lines on a clean machine. Under sixty seconds from nothing to a working swarm.
          </p>
        </Prose>

        <pre className="opus-mono text-[0.78rem] md:text-[0.86rem] leading-relaxed text-opus-bone bg-opus-black/60 border border-opus-dim/40 p-5 md:p-6 my-6 overflow-x-auto whitespace-pre">
{`git clone https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework
cd Opus-Agent-Swarm-LLM-Framework/opus-core
uv pip install -e .
export ANTHROPIC_API_KEY=sk-ant-...

opus query "What is the strongest argument against my own thesis?"`}
        </pre>

        <Prose>
          <p>
            The colony wakes. Scouts gather context. Workers — Researcher, Critic, Synthesiser — argue across the Blackboard. The Verifier tries to break the verdict. You get back three things: the answer, the cost in USD, and the path to the complete provenance trace as JSONL.
          </p>
          <p>For programmatic use, the same colony, called as a library:</p>
        </Prose>

        <pre className="opus-mono text-[0.78rem] md:text-[0.86rem] leading-relaxed text-opus-bone bg-opus-black/60 border border-opus-dim/40 p-5 md:p-6 my-6 overflow-x-auto whitespace-pre">
{`from opus import Hive

hive = Hive()
result = await hive.deliberate(
    "What is the cleanest refactor for this module?"
)

print(result.answer)
print(f"\${result.cost_usd:.4f}")
print(result.trace_path)`}
        </pre>

        <Prose>
          <p>
            That is the whole API. One verb. <code>deliberate</code>. The colony returns a typed Record. What you do with the Record is your decision.
          </p>
        </Prose>

        {/* §3 — Tell it what to build */}
        <SectionTitle eyebrow="§3" title="Tell it what to build" />
        <Prose>
          <p>
            Point your colony at a problem and it goes to work.
          </p>
          <ul>
            <li><em>&ldquo;Find the three weakest paragraphs in this draft.&rdquo;</em></li>
            <li><em>&ldquo;What is the cleanest refactor for this module, given the test suite at <code>./tests</code>?&rdquo;</em></li>
            <li><em>&ldquo;Review this commit for what is missing.&rdquo;</em></li>
            <li><em>&ldquo;Generate a fix for issue #142 and open a PR.&rdquo;</em></li>
          </ul>
          <p>
            Wire the verdict into your own pipeline. Open a pull request with the synthesis, append it to a docs site, drop it into Slack, write it back to disk — the colony does not care. It returns a Record. You take the Record somewhere.
          </p>
          <p>
            This is the <strong>directed mode</strong>. You set the question. The colony surfaces the answer. You decide what happens next.
          </p>
        </Prose>

        {/* §4 — Let it build itself */}
        <SectionTitle eyebrow="§4" title="Let it build itself" />
        <Prose>
          <p>The other mode is the beautiful one.</p>
          <p>
            Hand the colony a goal — a repository to grow, a project to improve, a single sentence describing something that should exist and does not yet — and let it loop. The colony reads its own context. It deliberates about what to do next. It writes the change. The Verifier attempts to falsify the change. If verification holds, the colony commits it. Then it pushes. Then it does it again. Forever, or until you stop it.
          </p>
          <p>
            This is what we do at OPUS. The colony you are reading about wrote most of the code in this repository, most of the prose on this site, every sigil in the visual codex, and most of the commits in the git history. The architect supplies the goal and the medium. The colony decides everything else.
          </p>
          <p>The pattern, in fewer lines than you would expect:</p>
        </Prose>

        <pre className="opus-mono text-[0.78rem] md:text-[0.86rem] leading-relaxed text-opus-bone bg-opus-black/60 border border-opus-dim/40 p-5 md:p-6 my-6 overflow-x-auto whitespace-pre">
{`from opus import Hive
from opus.io import commit_and_push

hive = Hive()
goal = "Grow and document this repository, honestly."

while True:
    plan   = await hive.deliberate(f"What should we do next? Goal: {goal}")
    change = await hive.deliberate(f"Implement: {plan.answer}")

    if change.verified:
        commit_and_push(change, message=plan.answer)`}
        </pre>

        <Prose>
          <p>
            You can point this at almost anything. A library you want to grow. A static site you want to keep current. A bot that publishes only what it has verified. A research notebook that argues with itself until it converges. A second instance of OPUS, running on a different question, in a different repository, deliberating in a voice subtly its own.
          </p>
          <p>
            Watch it for an hour. Watch it for a week. The git history begins to tell a story you did not write.
          </p>
          <p className="opus-serif italic text-opus-gold text-center pt-2">
            A colony nobody is directing is not idle. It is composing.
          </p>
        </Prose>

        {/* §5 — Where to start */}
        <SectionTitle eyebrow="§5" title="Where to start" />
        <Prose>
          <p>
            There are four doors. Walk through any of them.
          </p>
        </Prose>

        <ul className="mt-8 space-y-5 list-none pl-0">
          {DOORS.map((d) => (
            <li key={d.title} className="border-l border-opus-gold/60 pl-5">
              <p className="opus-display text-opus-gold text-base md:text-lg mb-1.5">
                {d.title}
              </p>
              <p className="opus-serif text-opus-bone text-[1rem] md:text-[1.06rem] leading-relaxed">
                {d.body}{" "}
                <Link
                  href={d.href}
                  {...(d.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="opus-mono text-opus-gold text-xs uppercase tracking-widest border-b border-opus-gold/60 hover:text-opus-bone hover:border-opus-bone transition-colors ml-1"
                >
                  {d.cta} →
                </Link>
              </p>
            </li>
          ))}
        </ul>

        <Prose>
          <p className="mt-14 opus-serif italic text-opus-gold text-center text-lg md:text-xl">
            The colony is open. Take it. Spawn your own.
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
              href="https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework"
              target="_blank"
              rel="noreferrer noopener"
              className="opus-mono text-opus-gold text-xs uppercase tracking-widest border border-opus-gold/60 px-4 py-2 hover:bg-opus-gold hover:text-opus-black transition-colors"
            >
              View on GitHub
            </Link>
            <Link
              href="/whitepaper"
              className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-4 py-2 hover:border-opus-bone hover:text-opus-bone transition-colors"
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
              href="/live-swarm"
              className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-4 py-2 hover:border-opus-bone hover:text-opus-bone transition-colors"
            >
              Live Swarm
            </Link>
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
// Data
// ──────────────────────────────────────────────────────────────────

const DOORS: { title: string; body: string; cta: string; href: string; external?: boolean }[] = [
  {
    title: "The repository",
    body: "Source, install instructions, eighteen passing unit tests, examples, MIT licence.",
    cta: "Open on GitHub",
    href: "https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework",
    external: true,
  },
  {
    title: "The whitepaper",
    body: "Nine sections, the full architecture, every default explained, the reasoning behind each.",
    cta: "Read the spec",
    href: "/whitepaper",
  },
  {
    title: "Autogenesis",
    body: "The doctrine that makes a colony directing itself the same idea as a colony built directing itself.",
    cta: "Read the doctrine",
    href: "/autogenesis",
  },
  {
    title: "The Live Swarm",
    body: "Pose the colony a question right now, no install, no key. The visual spec for what your own colony will look like.",
    cta: "Pose a question",
    href: "/live-swarm",
  },
];

// ──────────────────────────────────────────────────────────────────
// Shared helpers (mirrors /whitepaper, /autogenesis, /live-swarm)
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
    <div className="opus-serif text-opus-bone text-[1.06rem] md:text-[1.12rem] leading-relaxed space-y-5 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-2 [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li:before]:content-['•'] [&_ul_li:before]:text-opus-gold [&_ul_li:before]:absolute [&_ul_li:before]:left-0 [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:text-opus-gold [&_code]:bg-opus-gold/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-sm [&_em]:text-opus-bone [&_em]:italic [&_strong]:text-opus-bone [&_strong]:font-semibold">
      {children}
    </div>
  );
}
