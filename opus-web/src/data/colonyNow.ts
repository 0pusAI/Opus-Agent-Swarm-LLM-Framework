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
 *   5. An "in-progress" entry may carry `candidates` (a small list of
 *      options the colony is choosing between) and `decideIn` (when
 *      the verdict is expected). When both are present, the card
 *      reads as a live deliberation rather than a generic todo.
 */

export type DecisionStatus = "in-progress" | "shipped";

export interface CandidateOption {
  /** Short label, e.g. "Option A · 100% Buybacks & Burns". */
  label: string;
  /** One or two sentences explaining the thesis. Plain words. */
  thesis: string;
}

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
  /** Options the colony is choosing between (in-progress only). */
  candidates?: CandidateOption[];
  /** When the verdict is expected, e.g. "3–5 hours". */
  decideIn?: string;
}

export const REPO_BASE = "https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework";

export const COLONY_NOW: ColonyDecision[] = [
  {
    numeral: "I",
    title: "The tokenomics rebalance",
    description:
      "With v2.0.0 shipped, the colony is reconsidering its allocation policy. The middle is off the ballot. Two extremes are on it.",
    status: "in-progress",
    date: "2026-05-19",
    decideIn: "3–5 hours",
    loreRef: "lore/colony-decisions/2026-05-19_tokenomics-rebalance.md",
    candidates: [
      {
        label: "Option A · 100% Buybacks & Burns",
        thesis:
          "All creator rewards routed into weekly market buybacks of $OPUS, followed by burn. Pure scarcity instrument. Supply tightens; the architecture becomes a deflationary signal-amplifier for every holder.",
      },
      {
        label: "Option B · 100% Scaling & Compute",
        thesis:
          "All creator rewards routed into upgrading the colony itself. Frontier-tier APIs, the largest models, the highest reasoning effort, new agent roles, better infrastructure. The token's value follows the architecture's value.",
      },
    ],
  },
  {
    numeral: "II",
    title: "OPUS v2.0.0 — Multiplicatio · The Open Colony",
    description:
      "The biggest release since launch. Multi-provider LLM (Anthropic, OpenAI, Ollama, custom). `opus serve` boots a local web UI in one command. Functional autogenesis. 84/84 tests, 0 breaking changes.",
    status: "shipped",
    date: "2026-05-19",
    commitHash: "v2.0.0",
    loreRef: "lore/colony-decisions/2026-05-19_v2-released.md",
  },
  {
    numeral: "III",
    title: "opus.introspection — the colony reading itself",
    description:
      "The module that lets the swarm scan its own repository, surface bottlenecks, and feed them back into its own deliberation loop. 27 tests passing.",
    status: "shipped",
    date: "2026-05-19",
    commitHash: "a8f0396",
    loreRef: "lore/colony-decisions/2026-05-19_autogenesis-live.md",
  },
];
