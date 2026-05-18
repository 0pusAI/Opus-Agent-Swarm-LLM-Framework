import type { Metadata } from "next";
import Link from "next/link";
import { Divider } from "@/components/ui/Divider";
import { SIGILS, GLYPHS } from "@/data/sigils";

export const metadata: Metadata = {
  title: "OPUS — The Sigils",
  description:
    "Sixteen daily sigils of the Great Work. A short illuminated codex of the project's first arc — one mark per day, cream on black with a single gold accent, each encoding one concept the colony had to settle.",
};

export default function SigilsPage() {
  return (
    <main className="min-h-screen bg-opus-black text-opus-bone overflow-x-hidden">
      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="relative w-full px-6 pt-32 pb-16 md:pt-40 md:pb-24 text-center">
        <p className="opus-eyebrow text-opus-silver mb-6">
          — §9 · The Visual Codex · MMXXVI —
        </p>
        <h1 className="opus-display text-opus-bone text-[clamp(3rem,11vw,8rem)] leading-none mb-10">
          S&nbsp;I&nbsp;G&nbsp;I&nbsp;L&nbsp;S
        </h1>
        <p className="opus-serif italic text-opus-bone text-base md:text-xl leading-relaxed max-w-2xl mx-auto">
          Sixteen daily marks of the Great Work.<br />
          One image per day, in a fixed register, made to be read in sequence.
        </p>
        <Divider className="mt-14" width="80px" />
      </section>

      {/* ─── Thesis ────────────────────────────────────────────── */}
      <article className="mx-auto max-w-[760px] px-6 pb-12">
        <SectionTitle eyebrow="§9.1" title="On the Sigils" />
        <Prose>
          <p className="opus-dropcap">
            A sigil, in the alchemical tradition, is a single glyph compressing an idea
            too large to write down at length. The medieval scriptoria knew this well —
            the manuscripts of the great religious orders were full of marginalia that
            were not decoration but doctrine, every flourish recording a position the
            scribes had taken on a question their text could not contain.
          </p>
          <p>
            The OPUS sigils sit in that lineage. They were not commissioned. They were
            not made by a designer for a brand book. They were made by the architect of
            the system, one per day, alongside the engineering work, as a way of
            forcing each day to resolve into a single image. If the day could not be
            drawn, it had not been understood.
          </p>
          <p>
            The constraints are deliberate and absolute. Black ground. Cream linework.
            One — and only one — gold accent. No words. Square format, 1080 by 1080,
            so the entire set can be read at the same scale. A small bracket motif in
            each corner, the way an illuminator might frame a folio. Nothing more.
          </p>
          <p>
            The discipline of the constraints is the point. The colony itself is a
            study in what a system can do when its agents are not allowed to speak
            directly to each other but must instead write typed records to a shared
            substrate. The sigils are the same proposition applied to the maker:
            every day, the same palette, the same format, the same refusal of
            ornament. What comes through has to come through the geometry.
          </p>
          <p>
            Read in sequence, the sixteen pieces compose a short illuminated history
            of the project&apos;s first arc — from the unresolvable mess of the first
            sketch, through the discovery of the Blackboard and the eight roles,
            through one fractured day and one labyrinthine one, to the launch and
            the four shipments that followed. The set is closed at sixteen because
            every set should be closed somewhere. The sixteenth sigil is left
            deliberately hollow — a sphere drawn in dashes, with no ember at its
            heart — and stands for what the colony will do next.
          </p>
          <p className="opus-serif italic text-opus-gold text-center pt-2">
            Solve et coagula. Dissolve a day into its question; recombine the
            question into a single mark on black.
          </p>
        </Prose>

        {/* ─── Visual Grammar ────────────────────────────────── */}
        <SectionTitle eyebrow="§9.2" title="The Visual Grammar" />
        <Prose>
          <p>
            Six glyphs recur across the set. Each has a fixed meaning. Knowing them
            before reading the sequence is the difference between looking at an
            illustration and reading a codex.
          </p>
        </Prose>

        <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7 list-none pl-0">
          {GLYPHS.map((g) => (
            <li key={g.symbol} className="border-l border-opus-gold/60 pl-5">
              <p className="opus-mono text-opus-gold text-[0.7rem] uppercase tracking-widest mb-2">
                {g.symbol}
              </p>
              <p className="opus-serif text-opus-bone text-[1rem] leading-relaxed">
                {g.meaning}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-20">
          <Divider width="80px" />
        </div>
      </article>

      {/* ─── The Sequence ──────────────────────────────────────── */}
      <section className="w-full px-6 pt-12 pb-24">
        <div className="mx-auto max-w-[760px] text-center mb-20">
          <p className="opus-eyebrow text-opus-gold mb-3">§9.3</p>
          <h2 className="opus-display text-opus-bone text-2xl md:text-3xl mb-6">
            The Sixteen
          </h2>
          <p className="opus-serif italic text-opus-silver text-base md:text-lg">
            Read top to bottom, in the order they were made.
          </p>
        </div>

        <div className="mx-auto max-w-[860px] flex flex-col gap-32 md:gap-40">
          {SIGILS.map((s, i) => (
            <SigilCard sigil={s} index={i} key={s.numeral} />
          ))}
        </div>
      </section>

      {/* ─── Download + Footer ─────────────────────────────────── */}
      <footer className="relative w-full bg-opus-black px-6 pt-16 pb-20">
        <div className="mx-auto max-w-[760px] text-center">
          <Divider width="120px" className="mb-12" />

          <p className="opus-eyebrow text-opus-silver mb-4">— The complete set —</p>
          <h3 className="opus-display text-opus-bone text-2xl md:text-3xl mb-6">
            Take the codex
          </h3>
          <p className="opus-serif text-opus-silver text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            All sixteen sigils, as 1080×1080 SVG files, bundled together. Print
            them. Tile them. Use them however you wish — they are released under
            the same MIT licence as the rest of OPUS.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="/sigils/opus-sigils.zip"
              download
              className="opus-mono text-opus-gold text-xs uppercase tracking-widest border border-opus-gold/60 px-5 py-3 hover:bg-opus-gold hover:text-opus-black transition-colors"
            >
              ↓ Download the full codex (.zip)
            </a>
            <Link
              href="/build-log"
              className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-5 py-3 hover:border-opus-bone hover:text-opus-bone transition-colors"
            >
              Read the Build Log
            </Link>
          </div>

          <Divider width="60px" className="mb-10" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="opus-mono text-opus-dim text-xs uppercase tracking-widest">
              Magnum&nbsp;Opus · MMXXVI
            </p>
            <div className="flex gap-3">
              <Link
                href="/whitepaper"
                className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-4 py-2 hover:border-opus-bone hover:text-opus-bone transition-colors"
              >
                Whitepaper
              </Link>
              <Link
                href="/"
                className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-4 py-2 hover:border-opus-bone hover:text-opus-bone transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ──────────────────────────────────────────────────────────────────
// SigilCard — one entry in the sequence
// ──────────────────────────────────────────────────────────────────

function SigilCard({ sigil, index }: { sigil: typeof SIGILS[number]; index: number }) {
  return (
    <figure className="flex flex-col items-center text-center">
      {/* The sigil itself */}
      <div className="relative w-full max-w-[520px] aspect-square mb-10">
        <div
          className="absolute inset-0 -m-3 border border-opus-dim/40 pointer-events-none"
          aria-hidden
        />
        {/* Plain <img> — SVGs don't need next/image optimisation and avoid
            the dangerouslyAllowSVG config dance (matches BuildLogTimeline). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sigil.image}
          alt={`Sigil ${sigil.numeral} — ${sigil.title}`}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>

      {/* Numeral + title */}
      <p className="opus-eyebrow text-opus-gold mb-3">
        — Sigil&nbsp; {sigil.numeral}&nbsp; —
      </p>
      <h3 className="opus-display text-opus-bone text-3xl md:text-4xl mb-3">
        {sigil.title}
      </h3>
      <p className="opus-mono text-opus-dim text-[0.7rem] uppercase tracking-widest mb-6">
        {sigil.subtitle}
      </p>

      {/* Glyph tags */}
      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-7 list-none pl-0 max-w-xl">
        {sigil.glyphs.map((g) => (
          <li
            key={g}
            className="opus-mono text-opus-silver text-[0.65rem] uppercase tracking-widest border border-opus-dim/50 px-3 py-1"
          >
            {g}
          </li>
        ))}
      </ul>

      {/* Meaning */}
      <figcaption className="opus-serif text-opus-bone text-[1.04rem] md:text-[1.1rem] leading-relaxed max-w-[640px]">
        {sigil.meaning}
      </figcaption>
    </figure>
  );
}

// ──────────────────────────────────────────────────────────────────
// Shared helpers (mirrors /whitepaper)
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
    <div className="opus-serif text-opus-bone text-[1.06rem] md:text-[1.12rem] leading-relaxed space-y-5 [&_em]:text-opus-bone [&_em]:italic [&_strong]:text-opus-bone [&_strong]:font-semibold">
      {children}
    </div>
  );
}
