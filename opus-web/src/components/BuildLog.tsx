"use client";

import { motion } from "framer-motion";
import { Divider } from "./ui/Divider";
import { fadeUp } from "@/lib/motion";

interface Entry {
  date: string; // ISO date
  headline: string;
  body: string;
}

// Seed entries — replace as the build progresses.
const ENTRIES: Entry[] = [
  {
    date: "2026-05-11",
    headline: "Day 0 — first runnable swarm",
    body: "opus-core scaffolded end-to-end: Blackboard, eight agent roles, Hive orchestrator with 3-attempt verification loop, full provenance ledger, JSONL trace output, prompt caching plumbed through the LLM client. 18/18 unit tests pass.",
  },
  {
    date: "2026-05-11",
    headline: "Day 0 — storefront online",
    body: "opus-web scaffolded: Next.js 14, Three.js armillary sphere with mouse parallax, animated storm-cloud shader background, ten sections, custom palette and typography. Live on Vercel with the whitepaper as a downloadable PDF.",
  },
  {
    date: "2026-05-12",
    headline: "Day 1 — cinematic demo wired",
    body: "LiveSwarm section upgraded from static mockup to interactive cinematic demo: real input field, animated agent topology (Hive · 6 Workers · 3 Scouts), per-record transcript with confidence + cost, climbing dollar ticker, and a final-answer reveal. Frontend-only for now; doubles as the visual specification for the real-swarm wiring.",
  },
  {
    date: "TBD",
    headline: "Day N — real swarm in the browser",
    body: "opus-core deployed on Modal, Vercel API route proxies via Server-Sent Events, the LiveSwarm component begins consuming actual Records from a live deliberation. The demo becomes the product.",
  },
];

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
          className="opus-display text-opus-bone text-[clamp(2rem,5vw,3.5rem)] text-center mb-16"
        >
          Build Log
        </motion.h2>

        <div className="overflow-x-auto pb-6 -mx-6 px-6">
          <div className="flex gap-6 min-w-max">
            {ENTRIES.map((e, i) => (
              <motion.article
                key={`${e.date}-${i}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
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

        <Divider className="mt-20" width="100px" />
      </div>
    </section>
  );
}
