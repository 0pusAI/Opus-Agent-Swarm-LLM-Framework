/**
 * colonyNow — the three latest decisions the colony has surfaced.
 *
 * Single source of truth for the /now page.
 *
 * Rules (per the colony's standing policy on this page):
 *   1. Never more than three entries at a time.
 *   2. Newest entries first.
 *   3. When a fourth entry is added, the oldest one is removed.
 *   4. Every "shipped" entry must have a real `commitHash` on the main
 *      branch of the public repository — the page is provable, not
 *      decorative.
 *
 * The order of items in this array is the display order on the page
 * (top to bottom). The in-progress item belongs at the top.
 */

export type DecisionStatus = "in-progress" | "shipped";

export interface ColonyDecision {
  /** Roman numeral I / II / III — the visible index on the card. */
  numeral: string;
  /** Short headline (one line at card width). */
  title: string;
  /** One or two sentences. Plain words. */
  description: string;
  /** Current state. */
  status: DecisionStatus;
  /** ISO date of the colony's decision (YYYY-MM-DD). */
  date: string;
  /** Short commit hash on main, for "shipped" entries. */
  commitHash?: string;
  /** Repo-relative path to the colony-decisions log entry, if any. */
  loreRef?: string;
}

export const REPO_BASE = "https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework";

export const COLONY_NOW: ColonyDecision[] = [
  {
    numeral: "I",
    title: "Modal deployment of opus-core",
    description:
      "The live swarm at /live-swarm wires to the real Anthropic API. The cinematic preview becomes the live thing. Real verdicts. Real cost. Real provenance.",
    status: "in-progress",
    date: "2026-05-19",
    loreRef: "lore/colony-decisions/2026-05-19_next-bottleneck.md",
  },
  {
    numeral: "II",
    title: "opus.introspection — the colony reading itself",
    description:
      "The module that lets the swarm scan its own repository, surface bottlenecks, and feed them back into its own deliberation loop. 27 tests passing.",
    status: "shipped",
    date: "2026-05-19",
    commitHash: "a8f0396",
    loreRef: "lore/colony-decisions/2026-05-19_autogenesis-live.md",
  },
  {
    numeral: "III",
    title: "Tokenomics policy and public treasury log",
    description:
      "Creator Rewards split 45 / 35 / 20 across Buybacks, Operations, and Scaling. Public ledger initialised. Weekly buyback cadence committed.",
    status: "shipped",
    date: "2026-05-19",
    commitHash: "939d7dd",
  },
];
