/**
 * Shared build-log entries — single source of truth.
 * Consumed by both the homepage BuildLog component (horizontal scroll
 * preview) and the dedicated /build-log timeline page.
 *
 * Add new entries at the END so the timeline reads top → bottom in
 * chronological order. The homepage component reverses for newest-first.
 */

export interface BuildLogEntry {
  date: string;
  headline: string;
  body: string;
  /** Path to a 1080×1080 SVG artwork that represents the day. */
  image: string;
}

export const BUILD_LOG_START = new Date("2026-04-28T00:00:00Z");

/**
 * formatDate — render an ISO date in the OPUS register.
 *   "2026-04-28" → "28 APR"
 *   "TBD"        → "TBD"
 *
 * For places with more room (the sticky indicator, the footer) you
 * can pass `withYear: true` to get "28 APR · MMXXVI".
 */
export function formatDate(iso: string, opts: { withYear?: boolean } = {}): string {
  if (!iso || iso === "TBD") return "TBD";
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  const day = d.getUTCDate();
  const month = d.toLocaleString("en", { month: "short", timeZone: "UTC" }).toUpperCase();
  if (!opts.withYear) return `${day} ${month}`;
  const year = d.getUTCFullYear();
  const roman = toRoman(year);
  return `${day} ${month} · ${roman}`;
}

// Minimal Roman-numeral helper (handles up to 3999 — plenty).
function toRoman(n: number): string {
  if (n <= 0 || n >= 4000) return String(n);
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  for (const [value, symbol] of map) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
}

export const BUILD_LOG_ENTRIES: BuildLogEntry[] = [
  {
    date: "2026-04-28",
    headline: "Day 1 — first sketches",
    body: "Re-reading Hearsay-II (CMU, 1976) and asking why no large-language-model framework treats deliberation as a first-class problem. A single model defending its first thought kept feeling like watching one voice argue with itself in a closed room. The seed of OPUS: what if the agents do not speak to each other at all, but to a shared substrate? Notebook filled with arrows.",
    image: "/build-log/day-01.svg",
  },
  {
    date: "2026-04-29",
    headline: "Day 2 — three traditions",
    body: "Down the rabbit hole on Ramon Llull's Ars Magna (1305) and Pierre-Paul Grassé's 1959 paper on termite stigmergy. Realised the three traditions — combinatorial generation, blackboard architecture, environmental coordination — have never been put together with LLMs in earnest. This stops being a weekend toy.",
    image: "/build-log/day-02.svg",
  },
  {
    date: "2026-04-30",
    headline: "Day 3 — the name and the mark",
    body: "Whole day on the name. OPUS · Ars Magna · the Great Work — the alchemical register felt earned, not borrowed. Sketched the armillary sphere as the brand mark. Locked the palette: deep matte black, cream parchment, single sacred gold. The aesthetic has to feel ancient and next-generation simultaneously. Anything in between collapses.",
    image: "/build-log/day-03.svg",
  },
  {
    date: "2026-05-01",
    headline: "Day 4 — the existing frameworks won't do it",
    body: "Spent the morning evaluating LangGraph, CrewAI, AutoGen, Eliza. All optimise for agents-doing-tasks. None for agents-deliberating-to-truth. Confirmed there is no canonical open-source pattern for what OPUS needs to be. Decision: build it from scratch in Python.",
    image: "/build-log/day-04.svg",
  },
  {
    date: "2026-05-02",
    headline: "Day 5 — first Blackboard",
    body: "First working Blackboard prototype. Append-only, typed Records, parent_ids forming a causal DAG. Two mock agents reasoning off each other's writes without ever talking. Big question for tomorrow: how does the colony agree on a winning answer when nine voices disagree?",
    image: "/build-log/day-05.svg",
  },
  {
    date: "2026-05-03",
    headline: "Day 6 — consensus clicks",
    body: "Implemented weighted Borda count from scratch. Then the real breakthrough — added a Verifier whose only job is to attempt to falsify the chosen Synthesis. If the Verifier succeeds, the colony re-deliberates with the falsification as a hard constraint. Bounded to three attempts. The system stops lying about its certainty.",
    image: "/build-log/day-06.svg",
  },
  {
    date: "2026-05-04",
    headline: "Day 7 — lost the day to a 400",
    body: "Anthropic SDK hell. Code that worked yesterday on Sonnet now 400s on Opus 4.7. Eventually traced it: Opus 4.7 removes budget_tokens entirely (forced migration to adaptive thinking). Then discovered temperature and top_p also 400. Re-read the migration guide three times. Lost most of the day. Wrote down every gotcha so nobody else has to debug this twice.",
    image: "/build-log/day-07.svg",
  },
  {
    date: "2026-05-05",
    headline: "Day 8 — the eight roles",
    body: "Cleaned the agent abstraction. Wrote v0 system prompts for all eight roles: Scout, Researcher, Critic, Synthesiser, Verifier, Judge, Planner, Executor. First time the architecture felt right rather than provisional. Realised the prompts ARE the product — code can be rewritten in an hour, prompts take many iterations against real output.",
    image: "/build-log/day-08.svg",
  },
  {
    date: "2026-05-06",
    headline: "Day 9 — tests and provenance",
    body: "Built the test suite — eighteen unit tests covering the Blackboard, consensus math, and Hive orchestrator. Added the provenance ledger with honest USD cost tracking against real Anthropic pricing. No virtual tokens, no crypto handwaving, no theatre — just dollars. Memory adapters (vector, graph) left as interfaces; concrete backends are Phase β work.",
    image: "/build-log/day-09.svg",
  },
  {
    date: "2026-05-07",
    headline: "Day 10 — the site is a grimoire",
    body: "Started sketching the public site. The temptation was a dry technical doc. The decision: build it like a grimoire. Armillary sphere as the centrepiece. Cream-on-black, Cinzel and Cormorant, monastic spacing. It should feel like the manuscript of an order — not a startup landing page.",
    image: "/build-log/day-10.svg",
  },
  {
    date: "2026-05-08",
    headline: "Day 11 — whitepaper week",
    body: "Wrote the whitepaper properly — nine sections, around 1200 words. Then the architecture deep-dive (engineer companion), a strict glossary, and the lineage essay walking through three rooms: Llull's chamber in Mallorca, Erman and Lesser's lab at Carnegie Mellon, Grassé's termite mound. The lineage piece took the longest. Borges-tinged on purpose.",
    image: "/build-log/day-11.svg",
  },
  {
    date: "2026-05-09",
    headline: "Day 12 — Windows tooling hell",
    body: "Tried to set up the dev environment on Windows. Python wasn't installed. PowerShell's default execution policy silently blocked every npm script. uv ran for ten minutes without output. Lost the better part of the day to environment friction. Final answer: winget for everything, bash for npm, and a documented setup so the next contributor doesn't pay this tax.",
    image: "/build-log/day-12.svg",
  },
  {
    date: "2026-05-10",
    headline: "Day 13 — the sphere in Three.js",
    body: "Built the armillary sphere in React Three Fiber. Wireframe globe, concentric meridian rings, a beaded equatorial band, gold ember at the centre on a slow heartbeat pulse. GLSL fragment shader for the storm-cloud background. Mouse parallax tilts the whole sphere toward the cursor. First moment the brand felt fully alive.",
    image: "/build-log/day-13.svg",
  },
  {
    date: "2026-05-11",
    headline: "Day 14 — opus-core ships, the site goes live",
    body: "opus-core finished end-to-end: Blackboard, eight agent roles, Hive orchestrator with verification loop, full provenance ledger, JSONL trace output. 18/18 unit tests pass. opus-web pushed to Vercel — which took an embarrassing number of broken deploys before discovering the deployment-protection wall and a framework-detection misfire. Site finally went live in the early hours.",
    image: "/build-log/day-14.svg",
  },
  {
    date: "2026-05-12",
    headline: "Day 15 — nav, lore, cinematic demo, contract",
    body: "Four shipments in one day. Top-left nav (OpusAI · Whitepaper · Team) persisting across every page. New routes — /whitepaper (full readable spec) and /team (anonymous lore for the architect). LiveSwarm upgraded from static mockup to interactive cinematic demo: animated topology, live transcript, climbing cost ticker, per-letter answer reveal. Contract address added to the hero with click-to-copy. The project finally feels like a thing strangers can land on and understand.",
    image: "/build-log/day-15.svg",
  },
  {
    date: "TBD",
    headline: "Day N — the real swarm in the browser",
    body: "opus-core deployed on Modal. A Vercel API route proxies via Server-Sent Events. The LiveSwarm component begins consuming actual Records from a live deliberation against the Anthropic API. The demo becomes the product. Cost is honest, provenance is downloadable, every visitor can pose the colony a real question.",
    image: "/build-log/day-tbd.svg",
  },
];
