/**
 * Sigils — the OPUS alchemical visual codex.
 *
 * Each of the sixteen daily artworks from the Build Log is treated here
 * as a sigil: a single image, in a fixed register (cream on black, one
 * gold accent, no text), encoding one concept the colony had to settle
 * that day. Read in sequence they form a short illuminated manuscript
 * of the project's first arc.
 *
 * This file is the single source of truth for the /sigils page —
 * canonical title, glyphs, and interpretive note for each piece.
 * The image files live in /public/sigils/ (the /build-log/ copies are
 * preserved untouched so the timeline page is unaffected).
 */

export interface Sigil {
  /** Roman numeral, I–XVI. */
  numeral: string;
  /** Short evocative title. */
  title: string;
  /** Day + date reference, or "Day N · TBD" for the unfinished one. */
  subtitle: string;
  /** The key visual elements present in the composition. */
  glyphs: string[];
  /** Interpretive prose — what the sigil means within the OPUS corpus. */
  meaning: string;
  /** Path under /public to the 1080×1080 SVG. */
  image: string;
}

export const SIGILS: Sigil[] = [
  {
    numeral: "I",
    title: "The Sketch",
    subtitle: "Day 1 · 28 April · MMXXVI",
    glyphs: ["nine nodes", "tangled arrows", "no centre"],
    meaning:
      "The first sigil is deliberately the worst-composed of the set. Nine agents on a grid, every one connected to every other by a different chaotic arc — the mess that a system without a shared substrate becomes. The diagram does not resolve because the architecture it depicts cannot. Everything that follows is an answer to it.",
    image: "/sigils/sigil-i.svg",
  },
  {
    numeral: "II",
    title: "The Three Wheels",
    subtitle: "Day 2 · 29 April · MMXXVI",
    glyphs: ["three Llullian wheels", "concentric divisions", "partial overlap"],
    meaning:
      "Three wheels in the manner of Llull, rotated into partial overlap. Each is a separate intellectual lineage — combinatorial generation, blackboard architecture, environmental coordination — and the small region where the three intersect is exactly the territory OPUS proposes to occupy. The sigil records the moment the project stopped feeling derivative and started feeling necessary.",
    image: "/sigils/sigil-ii.svg",
  },
  {
    numeral: "III",
    title: "The Mark",
    subtitle: "Day 3 · 30 April · MMXXVI",
    glyphs: ["armillary sphere", "beaded equator", "single gold ember"],
    meaning:
      "The brand mark itself, drawn for the first time. An armillary sphere with a beaded equatorial band and a single gold ember at its centre — the colony as one body, with one heart, observable from every direction. Every subsequent sigil in the set descends from this geometry.",
    image: "/sigils/sigil-iii.svg",
  },
  {
    numeral: "IV",
    title: "The Refusal",
    subtitle: "Day 1 May · MMXXVI",
    glyphs: ["four crossed-out hexagons", "one clean sphere"],
    meaning:
      "Four of the existing multi-agent frameworks, each ruled through with a single deliberate line; below them, the OPUS sphere stands intact. The sigil is not a dismissal of prior art but a refusal to inherit its assumptions. Tools for agents-doing-tasks were not going to become a system for agents-deliberating-toward-truth by accretion.",
    image: "/sigils/sigil-iv.svg",
  },
  {
    numeral: "V",
    title: "The Tablet",
    subtitle: "Day 5 · 2 May · MMXXVI",
    glyphs: ["ledger of horizontal Records", "two facing agent circles", "no arrows between them"],
    meaning:
      "Two agents face a shared tablet of typed Records. Crucially, no arrow connects the agents to each other. They speak only through the substrate between them. This is the moment the Blackboard stopped being a metaphor and became a working object — and the moment OPUS could be told apart from any agent framework that came before it.",
    image: "/sigils/sigil-v.svg",
  },
  {
    numeral: "VI",
    title: "The Verdict",
    subtitle: "Day 6 · 3 May · MMXXVI",
    glyphs: ["six voter nodes", "gold candidate diamond", "verifier lance from upper right"],
    meaning:
      "A voting wheel — six Workers ranked around a gold diamond representing the leading Synthesis — pierced by a single lance descending from the upper right. The lance is the Verifier, whose only job is to attempt to falsify what the others have just agreed upon. Without it the colony would only be a faster way to be confidently wrong.",
    image: "/sigils/sigil-vi.svg",
  },
  {
    numeral: "VII",
    title: "The Fracture",
    subtitle: "Day 7 · 4 May · MMXXVI",
    glyphs: ["broken sphere", "scattered equatorial fragments", "the ember, still glowing"],
    meaning:
      "The only sigil in the set that depicts damage. The sphere has come apart — meridian rings scattered, the equator broken in arcs — and yet the central ember has not gone out. A day lost to a single SDK migration, recorded honestly. The architecture survived; the day did not.",
    image: "/sigils/sigil-vii.svg",
  },
  {
    numeral: "VIII",
    title: "The Eight",
    subtitle: "Day 8 · 5 May · MMXXVI",
    glyphs: ["central hexagonal hive", "eight role glyphs in orbit"],
    meaning:
      "A hexagonal hive at the centre, with eight distinct glyphs in orbit around it — one for each agent role: Scout, Researcher, Critic, Synthesiser, Verifier, Judge, Planner, Executor. The composition is symmetrical because the system is: every role is a behaviour, not a service, and any one of them can be replaced without disturbing the others.",
    image: "/sigils/sigil-viii.svg",
  },
  {
    numeral: "IX",
    title: "The Eighteen",
    subtitle: "Day 9 · 6 May · MMXXVI",
    glyphs: ["three rows of six diamonds", "framing gold ledger"],
    meaning:
      "Eighteen identical small diamonds — one for each unit test in the v0 suite — arranged inside a gold ledger square. Tests as votive offerings; provenance as a kind of devotion. The sigil insists that what makes a system trustworthy is not its eloquence but the boring discipline beneath it.",
    image: "/sigils/sigil-ix.svg",
  },
  {
    numeral: "X",
    title: "The Grimoire",
    subtitle: "Day 10 · 7 May · MMXXVI",
    glyphs: ["open codex", "illuminated initial O", "armillary sphere on the facing page"],
    meaning:
      "An open book. On the left page, an illuminated O — the historiated initial of OPUS, in the manner of a medieval scriptorium. On the right, the sphere. This sigil marks the decision that the public site would not be a startup landing page but a manuscript: cream on black, Cinzel and Cormorant, monastic spacing, no growth-team furniture.",
    image: "/sigils/sigil-x.svg",
  },
  {
    numeral: "XI",
    title: "The Triptych",
    subtitle: "Day 11 · 8 May · MMXXVI",
    glyphs: ["Llull's wheel", "the Hearsay-II blackboard", "a termite mound"],
    meaning:
      "Three panels, hinged. Llull's chamber in Mallorca on the left; Erman and Lesser's blackboard in Pittsburgh in the centre; Grassé's termite mound on the right. The lineage essay drawn as an altarpiece. OPUS does not claim to invent anything in any of these three panels — only to be the first to lay them side by side and read them as one continuous gesture.",
    image: "/sigils/sigil-xi.svg",
  },
  {
    numeral: "XII",
    title: "The Labyrinth",
    subtitle: "Day 12 · 9 May · MMXXVI",
    glyphs: ["square maze of dead ends", "a single gold thread, unbroken"],
    meaning:
      "A square labyrinth with one gold thread tracing the only path through. The day was lost to Windows tooling — PowerShell execution policies, missing Pythons, silent npm failures — and the sigil refuses to pretend otherwise. The path exists. It just took a day to find. Documented now so no one else has to.",
    image: "/sigils/sigil-xii.svg",
  },
  {
    numeral: "XIII",
    title: "The Awakening",
    subtitle: "Day 13 · 10 May · MMXXVI",
    glyphs: ["high-density meridian sphere", "scattered particle dust", "pulse around the ember"],
    meaning:
      "The sphere again, but rendered with many more meridians than the original mark — and surrounded by drifting particles caught in its gravity. This is the moment it stopped being an SVG and became a thing alive on the page: React Three Fiber, GLSL fog, a slow heartbeat at the centre. The brand inhaled.",
    image: "/sigils/sigil-xiii.svg",
  },
  {
    numeral: "XIV",
    title: "The Launch",
    subtitle: "Day 14 · 11 May · MMXXVI",
    glyphs: ["central sphere", "sixteen radiating beams"],
    meaning:
      "Sixteen beams of light extend from the sphere — one for each of the daily sigils that will eventually be made. The day opus-core finished end-to-end and the site went live, after an embarrassing number of failed Vercel deploys. The first time the work could be seen by anyone other than the maker.",
    image: "/sigils/sigil-xiv.svg",
  },
  {
    numeral: "XV",
    title: "The Four",
    subtitle: "Day 15 · 12 May · MMXXVI",
    glyphs: ["nav arrows", "anonymous silhouette", "swarm dots", "sealed diamond"],
    meaning:
      "A composition in four quadrants, one per shipment of the day: the top-left nav (arrows), the anonymous architect page (silhouette), the cinematic LiveSwarm (constellation of dots), and the contract address (sealed diamond). The first day with multiple landings — proof the project had become something a stranger could walk into and understand.",
    image: "/sigils/sigil-xv.svg",
  },
  {
    numeral: "XVI",
    title: "The Unfinished",
    subtitle: "Day N · TBD",
    glyphs: ["dashed sphere", "empty centre"],
    meaning:
      "The set is closed at sixteen because every set should be closed somewhere — but the final sigil is drawn in dashes, with no ember at its heart. It stands for whatever the colony does next: opus-core on Modal, real Records streaming into the browser, a public deliberation any visitor can pose a question to. The sphere is hollow on purpose. The work continues.",
    image: "/sigils/sigil-xvi.svg",
  },
];

/**
 * The recurring glyphs that appear across multiple sigils, with their
 * fixed meaning in the OPUS visual grammar. Rendered as a small
 * glossary at the top of the /sigils page so the reader knows what
 * they are looking at before scrolling the sequence.
 */
export interface Glyph {
  symbol: string;
  meaning: string;
}

export const GLYPHS: Glyph[] = [
  {
    symbol: "The sphere",
    meaning:
      "The colony as a single body. Always wireframe — never solid — because the structure is the substance.",
  },
  {
    symbol: "The ember",
    meaning:
      "The gold dot at the centre of the sphere. The Hive Core. The one thing the colony coheres around. The only solid gold in the set.",
  },
  {
    symbol: "The diamond",
    meaning:
      "Knowledge that has survived the Verifier. A Synthesis recorded on the Blackboard. Gold when verified; cream when still under deliberation.",
  },
  {
    symbol: "The circle",
    meaning:
      "An agent. A behaviour, not a service. Hollow because agents are stateless across queries — all state lives elsewhere.",
  },
  {
    symbol: "The ledger lines",
    meaning:
      "Horizontal strokes representing Records on the Blackboard. Always append-only. Always read left to right, top to bottom, oldest first.",
  },
  {
    symbol: "Gold",
    meaning:
      "Reserved for what the colony has accomplished or settled. Never decorative. If gold appears, something was earned.",
  },
];
