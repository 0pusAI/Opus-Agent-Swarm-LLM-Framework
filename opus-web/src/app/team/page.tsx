import type { Metadata } from "next";
import Link from "next/link";
import { Divider } from "@/components/ui/Divider";

export const metadata: Metadata = {
  title: "OPUS — The Architect",
  description:
    "On the architect of OPUS. A figure who works under a single name, gives no interviews, and considers Borges a more important influence on contemporary AI than Turing.",
};

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-opus-black px-6 py-32 md:py-40">
      <article className="mx-auto max-w-[720px] text-opus-bone">
        {/* ─── Title ─────────────────────────────────────────────── */}
        <header className="mb-16 text-center">
          <p className="opus-eyebrow text-opus-silver mb-6">— On the architect —</p>
          <h1 className="opus-display text-opus-bone text-[clamp(2.5rem,7vw,4.5rem)] leading-none mb-8">
            The Architect
          </h1>

          {/* Symbolic portrait — the sphere stands in for a face that is not shown */}
          <div className="flex justify-center my-10">
            <div className="relative">
              <svg
                viewBox="0 0 180 180"
                className="h-32 w-32 md:h-40 md:w-40 text-opus-bone"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
                aria-hidden
              >
                {/* Outer frame brackets */}
                <path d="M 8 8 L 8 28 M 8 8 L 28 8" />
                <path d="M 172 8 L 172 28 M 172 8 L 152 8" />
                <path d="M 8 172 L 8 152 M 8 172 L 28 172" />
                <path d="M 172 172 L 172 152 M 172 172 L 152 172" />
                {/* Sphere */}
                <circle cx="90" cy="92" r="58" />
                <ellipse cx="90" cy="92" rx="58" ry="20" strokeWidth="0.5" />
                <ellipse cx="90" cy="92" rx="20" ry="58" strokeWidth="0.5" />
                <line x1="90" y1="34" x2="90" y2="150" strokeWidth="0.5" />
                <line x1="32" y1="92" x2="148" y2="92" strokeWidth="0.5" />
                <circle cx="90" cy="92" r="10" strokeWidth="0.5" />
                <circle cx="90" cy="92" r="3.5" fill="#D4AF7A" stroke="none" />
                {/* Stem + finial */}
                <line x1="90" y1="22" x2="90" y2="34" strokeWidth="0.8" />
                <circle cx="90" cy="20" r="2.4" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </div>

          <p className="opus-serif text-opus-silver italic text-base md:text-lg leading-relaxed">
            no portrait · no interviews · no public name
          </p>
          <Divider className="mt-12" width="80px" />
        </header>

        {/* ─── Body ──────────────────────────────────────────────── */}
        <div className="opus-serif text-opus-bone text-[1.08rem] md:text-[1.14rem] leading-relaxed space-y-7">
          <p className="opus-dropcap">
            The architect of OPUS works under a single name: <em className="not-italic font-semibold text-opus-gold">0pusAI</em>.
          </p>

          <p>
            They have spent most of the last decade inside three of the world&apos;s frontier AI laboratories, contributing to systems they cannot publicly name. Their last public alias was retired in 2023. They do not give interviews. They do not appear in photographs. They have published a single peer-reviewed paper, twice cited, since 2022 — its arXiv identifier is no longer indexed.
          </p>

          <p>What is known of them is fragmentary.</p>

          <p>
            They studied formal logic before they studied machine learning, and they hold that the order matters. They are reportedly multilingual to a degree that ought not be productive — Latin, classical Greek, Catalan, working German, Mandarin enough to read papers, the dead tongue of an East African coastal trade. They keep three notebooks that no one else has read. The first is filled. The second is in progress. The third has been empty for two years; they say they are waiting for it.
          </p>

          <blockquote className="border-l-2 border-opus-gold pl-6 my-10 opus-serif text-opus-gold text-xl md:text-2xl italic leading-snug">
            &ldquo;Borges has been a more important influence on contemporary AI than Turing — and the defense of that statement would betray the influence.&rdquo;
            <span className="block opus-mono text-opus-dim text-[0.65rem] uppercase tracking-widest mt-3 not-italic">— private correspondence, forwarded without permission, 2024</span>
          </blockquote>

          <p>
            Before vanishing they worked, briefly, on three projects whose names the architect has asked not be reproduced. <strong>One is now used by 200 million people daily. One is now used by no one. One is used by exactly twelve, who do not know each other.</strong> They will not say which is which. They have suggested, on more than one occasion, that the third is the one that mattered.
          </p>

          <p>
            They began OPUS in early 2026 after what they have described, with characteristic refusal to elaborate, as &ldquo;the realisation that no large model would ever be allowed to disagree with itself in public.&rdquo; The codebase is open under the MIT license. The system prompts are versioned. The provenance traces are written, by design, in a format that outlives any single deployment. They have said they intend OPUS to function correctly fifty years after they have stopped maintaining it.
          </p>

          <p>
            The build log is the only thing they publish. It is updated, when it is updated, without commentary.
          </p>

          <h2 className="opus-display text-opus-gold text-xl md:text-2xl mt-16 mb-4">
            Influences they have privately acknowledged
          </h2>

          <ul className="opus-serif text-opus-bone space-y-2 list-none pl-0">
            {[
              ["Ramon Llull (1232–1316)", "for the wheel and the will to systematise"],
              ["Lee Erman, Victor Lesser, Raj Reddy (1971–1976)", "for showing the blackboard could carry cognition"],
              ["Pierre-Paul Grassé (1959)", "for naming what the termites already knew"],
              ["Jorge Luis Borges (1899–1986)", "for the library, the garden of forking paths, and the patient refusal of certainty"],
              ["John McCarthy (1927–2011)", "for the recursion that made minds possible"],
              ["Stafford Beer (1926–2002)", "for insisting that systems must be alive"],
            ].map(([name, note]) => (
              <li key={name} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 py-2 border-b border-opus-dim/30">
                <span className="opus-display text-opus-bone text-base">{name}</span>
                <span className="opus-serif italic text-opus-silver text-sm">{note}</span>
              </li>
            ))}
          </ul>

          <h2 className="opus-display text-opus-gold text-xl md:text-2xl mt-16 mb-4">
            How to reach them
          </h2>

          <p>
            They do not respond to direct messages. They do not answer email. They do not maintain a presence on any social platform under any known handle.
          </p>

          <p>
            Issues opened on the OPUS GitHub repository are read. The most thoughtful are answered, in time, by <em>0pusAI</em> — though never quickly, and never by the same voice twice. Whether that is one architect or several behind a shared mask is a question the architect declines to address.
          </p>

          <p className="opus-serif italic text-opus-gold text-center pt-4">
            <em>Solve et coagula.</em> The rest is silence.
          </p>
        </div>

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
              href="https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework"
              target="_blank"
              rel="noopener noreferrer"
              className="opus-mono text-opus-gold text-xs uppercase tracking-widest border border-opus-gold/60 px-4 py-2 hover:bg-opus-gold hover:text-opus-black transition-colors"
            >
              GitHub
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
