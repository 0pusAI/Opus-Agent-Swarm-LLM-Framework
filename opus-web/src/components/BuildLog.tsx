"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Divider } from "./ui/Divider";
import { fadeUp } from "@/lib/motion";

const START_DATE = new Date("2026-04-28T00:00:00Z");

interface Entry {
  date: string; // ISO date
  headline: string;
  body: string;
}

// Build log — the real arc from first sketch to public launch.
// Updated as the project advances.
const ENTRIES: Entry[] = [
  {
    date: "2026-04-28",
    headline: "Day -14 — first sketches",
    body: "Re-reading Hearsay-II (CMU, 1976) and asking why no large-language-model framework treats deliberation as a first-class problem. A single model defending its first thought kept feeling like watching one voice argue with itself in a closed room. The seed of OPUS: what if the agents do not speak to each other at all, but to a shared substrate? Notebook filled with arrows.",
  },
  {
    date: "2026-04-29",
    headline: "Day -13 — three traditions",
    body: "Down the rabbit hole on Ramon Llull's Ars Magna (1305) and Pierre-Paul Grassé's 1959 paper on termite stigmergy. Realised the three traditions — combinatorial generation, blackboard architecture, environmental coordination — have never been put together with LLMs in earnest. This stops being a weekend toy.",
  },
  {
    date: "2026-04-30",
    headline: "Day -12 — the name and the mark",
    body: "Whole day on the name. OPUS · Ars Magna · the Great Work — the alchemical register felt earned, not borrowed. Sketched the armillary sphere as the brand mark. Locked the palette: deep matte black, cream parchment, single sacred gold. The aesthetic has to feel ancient and next-generation simultaneously. Anything in between collapses.",
  },
  {
    date: "2026-05-01",
    headline: "Day -11 — the existing frameworks won't do it",
    body: "Spent the morning evaluating LangGraph, CrewAI, AutoGen, Eliza. All optimise for agents-doing-tasks. None for agents-deliberating-to-truth. Confirmed there is no canonical open-source pattern for what OPUS needs to be. Decision: build it from scratch in Python.",
  },
  {
    date: "2026-05-02",
    headline: "Day -10 — first Blackboard",
    body: "First working Blackboard prototype. Append-only, typed Records, parent_ids forming a causal DAG. Two mock agents reasoning off each other's writes without ever talking. Big question for tomorrow: how does the colony agree on a winning answer when nine voices disagree?",
  },
  {
    date: "2026-05-03",
    headline: "Day -9 — consensus clicks",
    body: "Implemented weighted Borda count from scratch. Then the real breakthrough — added a Verifier whose only job is to attempt to falsify the chosen Synthesis. If the Verifier succeeds, the colony re-deliberates with the falsification as a hard constraint. Bounded to three attempts. The system stops lying about its certainty.",
  },
  {
    date: "2026-05-04",
    headline: "Day -8 — lost the day to a 400",
    body: "Anthropic SDK hell. Code that worked yesterday on Sonnet now 400s on Opus 4.7. Eventually traced it: Opus 4.7 removes budget_tokens entirely (forced migration to adaptive thinking). Then discovered temperature and top_p also 400. Re-read the migration guide three times. Lost most of the day. Wrote down every gotcha so nobody else has to debug this twice.",
  },
  {
    date: "2026-05-05",
    headline: "Day -7 — the eight roles",
    body: "Cleaned the agent abstraction. Wrote v0 system prompts for all eight roles: Scout, Researcher, Critic, Synthesiser, Verifier, Judge, Planner, Executor. First time the architecture felt right rather than provisional. Realised the prompts ARE the product — code can be rewritten in an hour, prompts take many iterations against real output.",
  },
  {
    date: "2026-05-06",
    headline: "Day -6 — tests and provenance",
    body: "Built the test suite — eighteen unit tests covering the Blackboard, consensus math, and Hive orchestrator. Added the provenance ledger with honest USD cost tracking against real Anthropic pricing. No virtual tokens, no crypto handwaving, no theatre — just dollars. Memory adapters (vector, graph) left as interfaces; concrete backends are Phase β work.",
  },
  {
    date: "2026-05-07",
    headline: "Day -5 — the site is a grimoire",
    body: "Started sketching the public site. The temptation was a dry technical doc. The decision: build it like a grimoire. Armillary sphere as the centrepiece. Cream-on-black, Cinzel and Cormorant, monastic spacing. It should feel like the manuscript of an order — not a startup landing page.",
  },
  {
    date: "2026-05-08",
    headline: "Day -4 — whitepaper week",
    body: "Wrote the whitepaper properly — nine sections, around 1200 words. Then the architecture deep-dive (engineer companion), a strict glossary, and the lineage essay walking through three rooms: Llull's chamber in Mallorca, Erman and Lesser's lab at Carnegie Mellon, Grassé's termite mound. The lineage piece took the longest. Borges-tinged on purpose.",
  },
  {
    date: "2026-05-09",
    headline: "Day -3 — Windows tooling hell",
    body: "Tried to set up the dev environment on Windows. Python wasn't installed. PowerShell's default execution policy silently blocked every npm script. uv ran for ten minutes without output. Lost the better part of the day to environment friction. Final answer: winget for everything, bash for npm, and a documented setup so the next contributor doesn't pay this tax.",
  },
  {
    date: "2026-05-10",
    headline: "Day -2 — the sphere in Three.js",
    body: "Built the armillary sphere in React Three Fiber. Wireframe globe, concentric meridian rings, a beaded equatorial band, gold ember at the centre on a slow heartbeat pulse. GLSL fragment shader for the storm-cloud background. Mouse parallax tilts the whole sphere toward the cursor. First moment the brand felt fully alive.",
  },
  {
    date: "2026-05-11",
    headline: "Day 0 — opus-core ships, the site goes live",
    body: "opus-core finished end-to-end: Blackboard, eight agent roles, Hive orchestrator with verification loop, full provenance ledger, JSONL trace output. 18/18 unit tests pass. opus-web pushed to Vercel — which took an embarrassing number of broken deploys before discovering the deployment-protection wall and a framework-detection misfire. Site finally went live in the early hours.",
  },
  {
    date: "2026-05-12",
    headline: "Day 1 — nav, lore, cinematic demo, contract",
    body: "Four shipments in one day. Top-left nav (OpusAI · Whitepaper · Team) persisting across every page. New routes — /whitepaper (full readable spec) and /team (anonymous lore for the architect). LiveSwarm upgraded from static mockup to interactive cinematic demo: animated topology, live transcript, climbing cost ticker, per-letter answer reveal. Contract address added to the hero with click-to-copy. The project finally feels like a thing strangers can land on and understand.",
  },
  {
    date: "TBD",
    headline: "Day N — the real swarm in the browser",
    body: "opus-core deployed on Modal. A Vercel API route proxies via Server-Sent Events. The LiveSwarm component begins consuming actual Records from a live deliberation against the Anthropic API. The demo becomes the product. Cost is honest, provenance is downloadable, every visitor can pose the colony a real question.",
  },
];

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
