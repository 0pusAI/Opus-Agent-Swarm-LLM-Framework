"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Divider } from "./ui/Divider";
import { fadeUp } from "@/lib/motion";
import { BUILD_LOG_ENTRIES, BUILD_LOG_START } from "@/data/buildLog";

const START_DATE = BUILD_LOG_START;

// Entries are imported from @/data/buildLog (single source of truth,
// also consumed by the dedicated /build-log timeline page).
// Show newest first in the homepage carousel.
const PREVIEW_ENTRIES = [...BUILD_LOG_ENTRIES].reverse().slice(0, 8);

// ──────────────────────────────────────────────────────────────────
// DaysCounter — small italic line under the heading, day count auto-updates
// ──────────────────────────────────────────────────────────────────

function spellOut(n: number): string {
  const ones = ["zero","one","two","three","four","five","six","seven","eight","nine"];
  const teens = ["ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  if (n < 0) return String(n);
  if (n < 10) return ones[n];
  if (n < 20) return teens[n - 10];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return o === 0 ? tens[t] : `${tens[t]}-${ones[o]}`;
  }
  return String(n);
}

function DaysCounter() {
  // Render the static fallback on the server, then update on the client
  // to avoid hydration mismatch as the day rolls over.
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diffMs = now.getTime() - START_DATE.getTime();
      const dayCount = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
      setDays(dayCount);
    };
    tick();
    // Recompute once an hour in case the user leaves the tab open across a midnight.
    const id = setInterval(tick, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const display = days ?? 15; // sensible SSR fallback
  const word = spellOut(display);

  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
      className="opus-serif italic text-opus-bone text-base md:text-lg text-center mb-16"
    >
      In the making for{" "}
      <span className="opus-display not-italic text-opus-gold tracking-wider">
        {word}
      </span>
      {" "}days
      <span className="opus-mono not-italic text-opus-dim text-[0.65rem] uppercase tracking-widest ml-3 align-middle">
        · the work continues
      </span>
    </motion.p>
  );
}

export function BuildLog() {
  return (
    <section
      id="build-log"
      className="relative w-full bg-opus-black px-6 py-32 md:py-48"
      aria-label="Build Log"
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-eyebrow mb-4 text-center"
        >
          §7 — Built in public
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-display text-opus-bone text-[clamp(2rem,5vw,3.5rem)] text-center mb-4"
        >
          Build Log
        </motion.h2>

        <DaysCounter />

        <div className="overflow-x-auto pb-6 -mx-6 px-6">
          <div className="flex gap-6 min-w-max">
            {PREVIEW_ENTRIES.map((e, i) => (
              <motion.article
                key={`${e.date}-${i}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="w-[320px] shrink-0 border border-opus-dim/40 p-6 bg-opus-black"
              >
                <div className="opus-mono text-opus-gold text-xs uppercase tracking-widest mb-3">
                  {e.date}
                </div>
                <h3 className="opus-serif text-opus-bone text-xl mb-3 italic leading-snug">
                  {e.headline}
                </h3>
                <p className="opus-serif text-opus-silver text-sm leading-relaxed">
                  {e.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/build-log"
            className="group inline-flex items-center gap-3 opus-mono uppercase tracking-widest text-xs px-6 py-3 border border-opus-gold/60 text-opus-gold hover:bg-opus-gold hover:text-opus-black transition-colors duration-300"
          >
            <span>View Full Archive</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        <Divider className="mt-20" width="100px" />
      </div>
    </section>
  );
}
