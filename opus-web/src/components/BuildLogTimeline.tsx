"use client";

/**
 * BuildLogTimeline — cinematic vertical archive of OPUS build entries.
 *
 * Layout:
 *   - Vertical gold thread runs down the centre of the section
 *   - Each entry alternates side-by-side: image left | thread | text right
 *     for even entries, text left | thread | image right for odd entries
 *   - The thread "draws itself" with scroll progress (scaleY linked to
 *     useScroll / useTransform)
 *   - Diamond markers sit on the thread, one per entry, gently pulsing
 *   - Sticky reading indicator floats top-right with the active date +
 *     headline + position
 *   - On mobile, entries stack: image on top, text below
 */

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import clsx from "clsx";
import {
  BUILD_LOG_ENTRIES,
  formatDate,
  type BuildLogEntry,
} from "@/data/buildLog";

export function BuildLogTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Map vertical scroll progress to scaleY of the centered thread.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });
  const threadScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const threadOpacity = useTransform(scrollYProgress, [0, 0.04, 1], [0.2, 1, 1]);

  // Sticky reading-indicator state.
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeEntry = BUILD_LOG_ENTRIES[activeIdx] ?? BUILD_LOG_ENTRIES[0];

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-6xl px-6 md:px-10 pb-32 md:pb-48"
      aria-label="Archive of build days"
    >
      {/* Sticky reading indicator — small floating chip top-right */}
      <StickyReadingIndicator entry={activeEntry} index={activeIdx} total={BUILD_LOG_ENTRIES.length} />

      {/* Centered vertical gold thread.
          Hidden on mobile (where entries stack and the thread doesn't fit
          a sensible position); full vertical line on md+. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 bottom-0 z-0
                   left-1/2 -translate-x-1/2 w-px
                   hidden md:block"
      >
        {/* Static dim base line (always visible behind the gold one) */}
        <div className="absolute inset-0 bg-opus-dim/30" />
        {/* Animated gold overlay drawing top → bottom on scroll */}
        <motion.div
          style={{
            scaleY: threadScaleY,
            opacity: threadOpacity,
            transformOrigin: "top",
          }}
          className="absolute inset-0 bg-gradient-to-b from-opus-gold via-opus-gold/85 to-opus-gold/30"
        />
      </div>

      {/* Entries */}
      <ol className="relative z-10 space-y-24 md:space-y-32 pt-4">
        {BUILD_LOG_ENTRIES.map((entry, i) => (
          <TimelineEntry
            key={`${entry.date}-${i}`}
            entry={entry}
            index={i}
            onActive={(idx) => setActiveIdx(idx)}
          />
        ))}
      </ol>

      {/* Tail flourish — single gold diamond + closing inscription */}
      <div className="relative z-10 mt-28 flex flex-col items-center">
        <div className="opus-mono text-opus-gold text-[0.6rem] uppercase tracking-[0.4em] mb-4">
          — Magnum Opus · MMXXVI —
        </div>
        <span aria-hidden className="block h-1.5 w-1.5 rotate-45 bg-opus-gold" />
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────
// One entry in the timeline — alternating image / text layout
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
  const inView = useInView(ref, { margin: "-40% 0px -55% 0px" });
  if (inView) onActive(index);

  const isTBD = entry.date === "TBD";
  // Even index (0, 2, 4...) → image on LEFT, text on RIGHT.
  // Odd index → text on LEFT, image on RIGHT.
  const imageLeft = index % 2 === 0;

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative"
    >
      {/* Diamond marker centred on the thread (desktop only) */}
      <div
        aria-hidden
        className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <DiamondMarker isTBD={isTBD} />
      </div>

      <div
        className={clsx(
          "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center",
        )}
      >
        {/* Image column */}
        <div
          className={clsx(
            "relative w-full max-w-[460px] mx-auto md:mx-0",
            imageLeft ? "md:order-1 md:justify-self-end" : "md:order-2 md:justify-self-start",
          )}
        >
          <ImageFrame src={entry.image} alt="" />
        </div>

        {/* Text column */}
        <div
          className={clsx(
            "max-w-[520px] mx-auto md:mx-0",
            imageLeft
              ? "md:order-2 md:justify-self-start md:text-left md:pl-2"
              : "md:order-1 md:justify-self-end md:text-right md:pr-2",
          )}
        >
          {/* Date label */}
          <div
            className={clsx(
              "opus-mono text-[0.7rem] md:text-xs uppercase tracking-widest mb-4",
              isTBD ? "italic text-opus-dim" : "text-opus-gold",
            )}
          >
            {formatDate(entry.date)}
          </div>

          {/* Headline */}
          <h3 className="opus-display italic leading-tight text-opus-bone text-xl sm:text-2xl md:text-[1.7rem] mb-4">
            {entry.headline}
          </h3>

          {/* Body */}
          <p className="opus-serif text-opus-silver text-[0.98rem] sm:text-[1.05rem] md:text-[1.1rem] leading-relaxed">
            {entry.body}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

// ──────────────────────────────────────────────────────────────────
// ImageFrame — square frame with subtle hover lift, ornament corner brackets
// ──────────────────────────────────────────────────────────────────

function ImageFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.4, ease: "easeOut" } }}
      className="group relative aspect-square w-full"
    >
      {/* Faint gold glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                   bg-[radial-gradient(ellipse_at_center,rgba(212,175,122,0.08),transparent_70%)]"
      />
      {/* The artwork — plain <img> because SVGs don't need next/image
          optimisation and avoid the dangerouslyAllowSVG config dance. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain"
      />
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Diamond marker on the thread
// ──────────────────────────────────────────────────────────────────

function DiamondMarker({ isTBD }: { isTBD: boolean }) {
  return (
    <div className="relative h-3.5 w-3.5">
      {!isTBD && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rotate-45 bg-opus-gold"
          animate={{
            scale: [1, 2.4, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 3.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      <span
        aria-hidden
        className={clsx(
          "absolute inset-0 rotate-45 border",
          isTBD
            ? "border-opus-dim border-dashed bg-opus-black"
            : "border-opus-gold bg-opus-gold",
        )}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Sticky reading indicator
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
  return (
    <div
      aria-hidden
      className="pointer-events-none sticky top-20 md:top-24 z-30 flex justify-end mb-0"
    >
      <motion.div
        key={index}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
        className="hidden md:inline-flex items-stretch gap-3 max-w-md
                   border border-opus-dim/60 bg-opus-black/75 backdrop-blur-md"
      >
        <div className="flex flex-col justify-center px-3 py-2 border-r border-opus-dim/50">
          <span className="opus-mono text-opus-gold text-[0.6rem] uppercase tracking-widest leading-none">
            {formatDate(entry.date, { withYear: true })}
          </span>
          <span className="opus-mono text-opus-dim text-[0.55rem] uppercase tracking-widest leading-none mt-1">
            {index + 1} of {total}
          </span>
        </div>
        <div className="flex items-center pr-4 py-2 max-w-[260px]">
          <span className="opus-serif italic text-opus-bone text-xs leading-snug line-clamp-2">
            {entry.headline}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
