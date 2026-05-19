import type { Metadata } from "next";
import Link from "next/link";
import { Divider } from "@/components/ui/Divider";
import {
  COLONY_NOW,
  REPO_BASE,
  type CandidateOption,
  type ColonyDecision,
  type DecisionStatus,
} from "@/data/colonyNow";

export const metadata: Metadata = {
  title: "OPUS — Now",
  description:
    "The OPUS colony's three latest moves. Always visible. Always honest. Never more than three at a time. Each shipped entry linked to its commit on the public repository.",
};

export default function NowPage() {
  return (
    <main className="min-h-screen bg-opus-black text-opus-bone overflow-x-hidden">
      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="relative w-full px-6 pt-32 pb-12 md:pt-40 md:pb-16 text-center">
        <p className="opus-eyebrow text-opus-silver mb-6">
          — § The Now Page &middot; MMXXVI —
        </p>
        <h1 className="opus-display text-opus-bone text-[clamp(3rem,12vw,9rem)] leading-none mb-10">
          N&nbsp;O&nbsp;W
        </h1>
        <p className="opus-serif italic text-opus-bone text-base md:text-xl leading-relaxed max-w-2xl mx-auto">
          The colony&apos;s three latest moves.<br />
          Always visible. Always honest.
        </p>
        <Divider className="mt-14" width="80px" />
      </section>

      {/* ─── The Three Cards ───────────────────────────────────── */}
      <section className="w-full px-6 pb-16">
        <div className="mx-auto max-w-[760px] flex flex-col gap-10">
          {COLONY_NOW.map((decision) => (
            <DecisionCard key={decision.numeral} decision={decision} />
          ))}
        </div>
      </section>

      {/* ─── Footer + cross-links ──────────────────────────────── */}
      <article className="mx-auto max-w-[760px] px-6 pb-16">
        <p className="opus-serif italic text-opus-silver text-center text-base md:text-lg leading-relaxed mb-12">
          Never more than three at a time. Nothing teased. Nothing hidden.<br />
          The colony works on what the colony has surfaced.
        </p>

        <Divider width="120px" className="mb-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-4">
          <p className="opus-mono text-opus-dim text-xs uppercase tracking-widest">
            Magnum&nbsp;Opus &middot; MMXXVI
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/autogenesis"
              className="opus-mono text-opus-gold text-xs uppercase tracking-widest border border-opus-gold/60 px-4 py-2 hover:bg-opus-gold hover:text-opus-black transition-colors"
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
// DecisionCard — one of the three. Gold-bordered when in progress,
// dim-bordered when shipped. Status badge top-right, Roman numeral
// top-left, body in serif, links in mono at the bottom.
// ──────────────────────────────────────────────────────────────────

function DecisionCard({ decision }: { decision: ColonyDecision }) {
  const isInProgress = decision.status === "in-progress";
  const isDeliberating = isInProgress && (decision.candidates?.length ?? 0) > 0;

  return (
    <article
      className={`relative px-7 py-8 md:px-9 md:py-10 transition-colors ${
        isInProgress
          ? "border border-opus-gold/60 bg-opus-gold/[0.025]"
          : "border border-opus-dim/30"
      }`}
    >
      {/* Top row: numeral + status */}
      <div className="flex items-start justify-between mb-7">
        <span className="opus-display text-opus-gold text-2xl md:text-3xl leading-none tracking-wider">
          {decision.numeral}
        </span>
        <StatusBadge status={decision.status} deliberating={isDeliberating} />
      </div>

      {/* Title */}
      <h2 className="opus-display text-opus-bone text-[1.35rem] md:text-[1.6rem] leading-snug mb-4">
        {decision.title}
      </h2>

      {/* Description */}
      <p className="opus-serif text-opus-bone text-[1rem] md:text-[1.08rem] leading-relaxed mb-7 opacity-95">
        {decision.description}
      </p>

      {/* Candidates block — only when present */}
      {decision.candidates && decision.candidates.length > 0 && (
        <CandidatesBlock candidates={decision.candidates} decideIn={decision.decideIn} />
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 opus-mono text-[0.62rem] md:text-[0.66rem] uppercase tracking-widest text-opus-dim">
        <span>{decision.date}</span>

        {decision.decideIn && !decision.candidates && (
          <span className="text-opus-gold">
            Verdict in {decision.decideIn}
          </span>
        )}

        {decision.commitHash && (
          <a
            href={`${REPO_BASE}/commit/${decision.commitHash}`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-opus-gold hover:text-opus-bone transition-colors inline-flex items-center gap-1.5 border-b border-opus-gold/40 hover:border-opus-bone/60 pb-0.5"
          >
            <span aria-hidden>↗</span>
            commit {decision.commitHash}
          </a>
        )}

        {decision.loreRef && (
          <a
            href={`${REPO_BASE}/blob/main/${decision.loreRef}`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-opus-silver hover:text-opus-bone transition-colors inline-flex items-center gap-1.5 border-b border-opus-dim/40 hover:border-opus-bone/60 pb-0.5"
          >
            <span aria-hidden>↗</span>
            colony-decisions
          </a>
        )}
      </div>
    </article>
  );
}

// ──────────────────────────────────────────────────────────────────
// CandidatesBlock — shown inside an in-progress card when the colony
// is actively deliberating between named options. Two-column on
// desktop, stacked on mobile.
// ──────────────────────────────────────────────────────────────────

function CandidatesBlock({
  candidates,
  decideIn,
}: {
  candidates: CandidateOption[];
  decideIn?: string;
}) {
  return (
    <div className="mb-7 -mx-1 md:-mx-2">
      <p className="opus-mono text-opus-gold text-[0.62rem] md:text-[0.66rem] uppercase tracking-widest mb-4 px-1 md:px-2">
        — Candidates on the ballot —
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {candidates.map((c) => (
          <div
            key={c.label}
            className="border-l-2 border-opus-gold/60 bg-opus-black/40 pl-4 pr-3 py-4 md:py-5"
          >
            <p className="opus-display text-opus-gold text-[0.9rem] md:text-[1rem] leading-snug mb-2.5 tracking-wide">
              {c.label}
            </p>
            <p className="opus-serif text-opus-bone text-[0.92rem] md:text-[0.98rem] leading-relaxed opacity-90">
              {c.thesis}
            </p>
          </div>
        ))}
      </div>

      {decideIn && (
        <div className="px-1 md:px-2 flex items-center gap-2.5">
          <span
            aria-hidden
            className="relative inline-flex h-1.5 w-1.5"
          >
            <span className="absolute inline-flex h-full w-full rounded-full bg-opus-gold opacity-60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-opus-gold" />
          </span>
          <span className="opus-mono text-opus-gold text-[0.62rem] md:text-[0.66rem] uppercase tracking-widest">
            Verdict expected in {decideIn}
          </span>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// StatusBadge — gold pulsing dot for in-progress, silver ✓ for shipped
// ──────────────────────────────────────────────────────────────────

function StatusBadge({
  status,
  deliberating = false,
}: {
  status: DecisionStatus;
  deliberating?: boolean;
}) {
  if (status === "in-progress") {
    return (
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="relative inline-flex h-2 w-2"
        >
          <span className="absolute inline-flex h-full w-full rounded-full bg-opus-gold opacity-70 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-opus-gold" />
        </span>
        <span className="opus-mono text-opus-gold text-[0.62rem] md:text-[0.68rem] uppercase tracking-widest">
          {deliberating ? "Deliberating" : "In Progress"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="opus-mono text-opus-silver text-sm leading-none">
        ✓
      </span>
      <span className="opus-mono text-opus-silver text-[0.62rem] md:text-[0.68rem] uppercase tracking-widest">
        Shipped
      </span>
    </div>
  );
}
