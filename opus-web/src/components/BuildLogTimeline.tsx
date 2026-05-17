"use client";

/**
 * BuildLogTimeline — cinematic vertical archive of OPUS build entries.
 *
 * The visual centerpiece of /build-log. Uses:
 *  - Lenis-driven smooth scroll (via <SmoothScroll />)
 *  - Framer Motion's useScroll + useTransform for a gold thread that
 *    "draws" itself from top to bottom as the user scrolls past
 *  - whileInView for staggered entry reveals (fade + slide)
 *  - A sticky pill at the top that names the day currently in view
 *  - Pulsing diamond markers on the thread, one per entry
 *  - Subtle hover-glow on each card
 */

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import clsx from "clsx";
import { BUILD_LOG_ENTRIES, type BuildLogEntry } from "@/data/buildLog";

export function BuildLogTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll progress for the gold thread — maps to scaleY of the line.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });
  const threadScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const threadOpacity = useTransform(scrollYProgress, [0, 0.05, 1], [0.2, 1, 1]);

  // Currently-visible date (for the sticky reading indicator).
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeEntry = BUILD_LOG_ENTRIES[activeIdx] ?? BUILD_LOG_ENTRIES[0];

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-5xl px-6 md:px-10 pb-32 md:pb-48"
      aria-label="Archive of build days"
    >
      {/* Sticky reading indicator — small floating chip top-right that
          updates as the active entry changes. */}
      <StickyReadingIndicator entry={activeEntry} index={activeIdx} total={BUILD_LOG_ENTRIES.length} />

      {/* The thread: a thin gradient line that the diamonds sit on, and
          a gold overlay that grows as the user scrolls. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 bottom-0 z-0
                   left-[58px] sm:left-[110px] md:left-[180px] w-px"
      >
        {/* Static dim base line */}
        <div className="absolute inset-0 bg-opus-dim/35" />
        {/* Animated gold overlay drawing top → bottom */}
        <motion.div
          style={{
            scaleY: threadScaleY,
            opacity: threadOpacity,
            transformOrigin: "top",
          }}
          className="absolute inset-0 bg-gradient-to-b from-opus-gold via-opus-gold/80 to-opus-gold/30"
        />
      </div>

      {/* Entries */}
      <ol className="relative z-10 space-y-20 md:space-y-28 pt-8">
        {BUILD_LOG_ENTRIES.map((entry, i) => (
          <TimelineEntry
            key={`${entry.date}-${i}`}
            entry={entry}
            index={i}
            onActive={(idx) => setActiveIdx(idx)}
          />
        ))}
      </ol>

      {/* Tail flourish — a final small ornament under the last entry */}
      <div className="relative z-10 mt-24 flex flex-col items-center">
        <div className="opus-mono text-opus-gold text-[0.6rem] uppercase tracking-[0.4em] mb-4">
          — Magnum Opus · MMXXVI —
        </div>
        <span aria-hidden className="block h-1.5 w-1.5 rotate-45 bg-opus-gold" />
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────
// One entry in the timeline
// ──────────────────────────────────────────────────────────────────

function TimelineEntry({
  entry,
  index,
  onActive,
}: {
  entry: BuildLogEntry;
  index: number;
  onActive: (idx: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Mark this entry "active" when its center crosses the upper third
  // of the viewport — that's where the eye naturally rests when reading.
  const inView = useInView(ref, { margin: "-40% 0px -55% 0px" });

  if (inView) onActive(index);

  const isTBD = entry.date === "TBD";

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.85, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative pl-[88px] sm:pl-[150px] md:pl-[230px] min-h-[140px]"
    >
      {/* Date column on the left of the thread */}
      <div className="absolute left-0 top-1 w-[50px] sm:w-[100px] md:w-[170px] text-right pr-4 sm:pr-6 md:pr-8">
        <span
          className={clsx(
            "opus-mono text-[0.6rem] sm:text-[0.7rem] md:text-xs uppercase tracking-widest",
            isTBD ? "italic text-opus-dim" : "text-opus-gold"
          )}
        >
          {entry.date}
        </span>
      </div>

      {/* Diamond marker on the thread */}
      <div
        aria-hidden
        className="absolute top-[6px] z-10
                   left-[58px] sm:left-[110px] md:left-[180px] -translate-x-1/2"
      >
        <DiamondMarker isTBD={isTBD} />
      </div>

      {/* Card content */}
      <article className="group relative pr-2">
        {/* Hover wash — a thin gold-tinted glow that fades in on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-3 sm:-inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                     bg-[radial-gradient(ellipse_at_left,rgba(212,175,122,0.06),transparent_70%)]"
        />
        <h3
          className={clsx(
            "opus-display italic leading-tight mb-3",
            "text-opus-bone text-xl sm:text-2xl md:text-[1.7rem]"
          )}
        >
          {entry.headline}
        </h3>
        <p
          className={clsx(
            "opus-serif leading-relaxed max-w-[640px]",
            "text-opus-silver text-[0.98rem] sm:text-[1.05rem] md:text-[1.12rem]"
          )}
        >
          {entry.body}
        </p>
      </article>
    </motion.li>
  );
}

// ──────────────────────────────────────────────────────────────────
// Diamond marker on the thread
// ──────────────────────────────────────────────────────────────────

function DiamondMarker({ isTBD }: { isTBD: boolean }) {
  return (
    <div className="relative h-3 w-3 sm:h-3.5 sm:w-3.5">
      {/* Halo pulse for active (non-TBD) entries */}
      {!isTBD && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rotate-45 bg-opus-gold"
          animate={{
            scale: [1, 2.2, 1],
            opacity: [0.35, 0, 0.35],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      {/* Solid diamond core */}
      <span
        aria-hidden
        className={clsx(
          "absolute inset-0 rotate-45 border",
          isTBD
            ? "border-opus-dim border-dashed bg-opus-black"
            : "border-opus-gold bg-opus-gold"
        )}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Sticky reading indicator — small floating chip at top of viewport
// ──────────────────────────────────────────────────────────────────

function StickyReadingIndicator({
  entry,
  index,
  total,
}: {
  entry: BuildLogEntry;
  index: number;
  total: number;
}) {
  // Hide on the first scroll position (nothing active yet) and on
  // very small viewports where the nav already occupies the top-left.
  return (
    <div
      aria-hidden
      className="pointer-events-none sticky top-4 md:top-6 z-30 flex justify-end mb-0"
    >
      <motion.div
        key={index}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 border border-opus-dim/60
                   bg-opus-black/70 backdrop-blur-md"
      >
        <span className="opus-mono text-opus-gold text-[0.6rem] uppercase tracking-widest">
          {entry.date}
        </span>
        <span aria-hidden className="h-3 w-px bg-opus-dim/60" />
        <span className="opus-mono text-opus-silver text-[0.6rem] uppercase tracking-widest">
          {index + 1} · {total}
        </span>
      </motion.div>
    </div>
  );
}
