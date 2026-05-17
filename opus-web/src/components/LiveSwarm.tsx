"use client";

/**
 * LiveSwarm — interactive cinematic demo of the OPUS deliberation flow.
 *
 * v0.2: scripted demo with real-feeling content. The colony graph,
 * transcript, and answer reveal mirror the actual hello_swarm.py
 * lifecycle so this doubles as the visual spec for when we wire
 * the real Python swarm in via SSE.
 *
 * No backend calls. Pure client-side animation + curated records.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Divider } from "./ui/Divider";

// ──────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────

type Phase = "idle" | "scouting" | "researching" | "critiquing" | "synthesising" | "verifying" | "complete";
type AgentRole = "hive" | "scout" | "researcher" | "critic" | "synthesiser" | "verifier";

interface Agent {
  id: string;
  label: string;
  role: AgentRole;
  ring: 0 | 1 | 2;
  angleDeg: number;
}

interface ScriptedRecord {
  agentId: string;
  role: AgentRole;
  type: string;
  content: string;
  confidence: number;
  costUsd: number;
  delayMs: number; // when (ms after Begin) to drop into transcript
  durationMs: number; // how long this agent "thinks" before writing
}

// ──────────────────────────────────────────────────────────────────
// Agents — positioned around a central Hive
// ──────────────────────────────────────────────────────────────────

const AGENTS: Agent[] = [
  // Hive at center
  { id: "hive", label: "Hive", role: "hive", ring: 0, angleDeg: 0 },

  // Workers (inner ring)
  { id: "researcher_a", label: "Researcher α", role: "researcher", ring: 1, angleDeg: 0 },
  { id: "researcher_b", label: "Researcher β", role: "researcher", ring: 1, angleDeg: 60 },
  { id: "critic_a",     label: "Critic α",     role: "critic",     ring: 1, angleDeg: 120 },
  { id: "critic_b",     label: "Critic β",     role: "critic",     ring: 1, angleDeg: 180 },
  { id: "synthesiser",  label: "Synthesiser",  role: "synthesiser", ring: 1, angleDeg: 240 },
  { id: "verifier",     label: "Verifier",     role: "verifier",   ring: 1, angleDeg: 300 },

  // Scouts (outer ring)
  { id: "scout_00", label: "Scout 0", role: "scout", ring: 2, angleDeg: 30 },
  { id: "scout_01", label: "Scout 1", role: "scout", ring: 2, angleDeg: 150 },
  { id: "scout_02", label: "Scout 2", role: "scout", ring: 2, angleDeg: 270 },
];

const RADIUS: Record<0 | 1 | 2, number> = { 0: 0, 1: 130, 2: 230 };
const SVG_SIZE = 580;
const CENTER = SVG_SIZE / 2;

function nodePos(a: Agent) {
  const r = RADIUS[a.ring];
  const rad = (a.angleDeg * Math.PI) / 180;
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

// ──────────────────────────────────────────────────────────────────
// Curated records for the canonical consciousness question.
// (Same prompt as opus-core/examples/hello_swarm.py — these read
// as if the real swarm wrote them.)
// ──────────────────────────────────────────────────────────────────

const DEFAULT_QUESTION =
  "What are the three strongest arguments against my own thesis that consciousness is computable?";

const SCRIPT: ScriptedRecord[] = [
  // Phase 1 — Scouts (parallel)
  { agentId: "scout_00", role: "scout", type: "observation", confidence: 0.91, costUsd: 0.018,
    content: "Chalmers (1995) — the hard problem distinguishes 'easy' problems (information processing) from the 'hard' problem of subjective experience. Three decades later, this remains the central anti-computationalism framing.",
    delayMs: 600, durationMs: 1800 },
  { agentId: "scout_01", role: "scout", type: "observation", confidence: 0.85, costUsd: 0.021,
    content: "Searle's Chinese Room (1980) — syntactic computation alone cannot generate semantic understanding. The 'systems reply' and 'robot reply' counter-arguments exist; the intuition pump persists.",
    delayMs: 900, durationMs: 1900 },
  { agentId: "scout_02", role: "scout", type: "observation", confidence: 0.78, costUsd: 0.019,
    content: "Tononi's IIT measures consciousness via Φ. Currently defined, Φ is not Turing-computable — it requires combinatorial loops over all substrate partitions.",
    delayMs: 1100, durationMs: 2000 },

  // Phase 2 — Researchers (parallel, after scouts)
  { agentId: "researcher_a", role: "researcher", type: "hypothesis", confidence: 0.84, costUsd: 0.082,
    content: "The strongest counter is the explanatory gap. Behavioural isomorphism does not entail experiential isomorphism. Even a perfect functional emulation of a brain leaves the question 'why is anyone home?' unanswered in principle. Computation is necessary; on this view, it is not sufficient.",
    delayMs: 3500, durationMs: 4200 },
  { agentId: "researcher_b", role: "researcher", type: "hypothesis", confidence: 0.62, costUsd: 0.071,
    content: "Substrate-dependence: if consciousness depends on specific quantum coherence (Penrose-Hameroff Orch-OR) or specific neurochemistry (e.g. NMDA receptor dynamics not reducible to gates), then a silicon implementation runs the same algorithm on a different physical phenomenon.",
    delayMs: 4100, durationMs: 4300 },

  // Phase 3 — Critics (parallel)
  { agentId: "critic_a", role: "critic", type: "critique", confidence: 0.87, costUsd: 0.064,
    content: "Hypothesis 2 is empirically weak. Orch-OR remains controversial; no result rules out functional emulation of NMDA dynamics. Don't lead with substrate-dependence — the explanatory gap (H1) is far stronger and survives more attacks.",
    delayMs: 8800, durationMs: 3400 },
  { agentId: "critic_b", role: "critic", type: "critique", confidence: 0.79, costUsd: 0.069,
    content: "Both hypotheses miss a third class of objection: temporal binding. Consciousness presents as unified across the experiential 'now' (~100ms). Discrete computational steps, however fast, may not reproduce the continuous binding. This is distinct from H1 and worth its own slot.",
    delayMs: 9300, durationMs: 3600 },

  // Phase 4 — Synthesiser
  { agentId: "synthesiser", role: "synthesiser", type: "synthesis", confidence: 0.86, costUsd: 0.142,
    content: "[draft synthesis assembled from Researchers + Critics — see final answer]",
    delayMs: 13500, durationMs: 5200 },

  // Phase 5 — Verifier
  { agentId: "verifier", role: "verifier", type: "verdict.accepted", confidence: 0.83, costUsd: 0.119,
    content: "Attempted to falsify by checking each argument against well-known computationalist responses (functionalism, multiple realisability, Dennett's heterophenomenology). Each argument resists. Verdict: accepted.",
    delayMs: 19500, durationMs: 4400 },

  // Phase 6 — Hive provenance
  { agentId: "hive", role: "hive", type: "provenance.summary", confidence: 1.0, costUsd: 0,
    content: "10 records written · 9 agents · 1 round · accepted on first verification pass.",
    delayMs: 24500, durationMs: 800 },
];

const FINAL_ANSWER = `Three strongest arguments against the thesis that consciousness is computable:

1. The explanatory gap (Chalmers). Even a perfect functional emulation of a brain leaves intact the question of why there is something it is like to undergo the computation. Computation may be necessary; it is not, on this view, demonstrably sufficient.

2. Temporal binding. Consciousness presents as a unified experiential 'now' across roughly 100ms. Discrete computational steps, however fast, may fail to reproduce the continuous binding that experience requires — a different objection from the hard problem and not yet answered by it.

3. Φ-incomputability. Integrated Information Theory's Φ — currently the leading mathematical proposal for what consciousness IS — is not Turing-computable as defined. If the right theory of consciousness has this shape, no algorithmic system instantiates it, regardless of behavioural fidelity.

These three resist the standard computationalist replies (functionalism, multiple realisability, Dennett's heterophenomenology). They do not prove computationalism false. They mark the territory it has not yet covered.`;

const TOTAL_RUNTIME_MS = 26000;

// ──────────────────────────────────────────────────────────────────
// Color and label helpers
// ──────────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<AgentRole, { node: string; glow: string; label: string }> = {
  hive:        { node: "#D4AF7A", glow: "rgba(212,175,122,0.55)", label: "text-opus-gold" },
  scout:       { node: "#F2EFE6", glow: "rgba(242,239,230,0.45)", label: "text-opus-bone" },
  researcher:  { node: "#F2EFE6", glow: "rgba(242,239,230,0.45)", label: "text-opus-bone" },
  critic:      { node: "#F2EFE6", glow: "rgba(242,239,230,0.45)", label: "text-opus-bone" },
  synthesiser: { node: "#F2EFE6", glow: "rgba(242,239,230,0.55)", label: "text-opus-bone" },
  verifier:    { node: "#D4AF7A", glow: "rgba(212,175,122,0.45)", label: "text-opus-gold" },
};

const ROLE_PREFIX: Record<AgentRole, string> = {
  hive: "hive",
  scout: "scout",
  researcher: "researcher",
  critic: "critic",
  synthesiser: "synthesiser",
  verifier: "verifier",
};

// ──────────────────────────────────────────────────────────────────
// Small helpers
// ──────────────────────────────────────────────────────────────────

function timeStamp(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  const ms = Math.floor((seconds * 1000) % 1000).toString().padStart(3, "0");
  return `${m}:${s}.${ms}`;
}

function trimContent(text: string, max = 110): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

// ──────────────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────────────

export function LiveSwarm() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [activeAgents, setActiveAgents] = useState<Set<string>>(new Set());
  const [completedAgents, setCompletedAgents] = useState<Set<string>>(new Set());
  const [transcript, setTranscript] = useState<ScriptedRecord[]>([]);
  const [costUsd, setCostUsd] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(0);

  const startedAtRef = useRef<number | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const reset = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase("idle");
    setActiveAgents(new Set());
    setCompletedAgents(new Set());
    setTranscript([]);
    setCostUsd(0);
    setElapsedSec(0);
    setShowAnswer(false);
    setAnswerRevealed(0);
    startedAtRef.current = null;
  }, []);

  const begin = useCallback(() => {
    reset();
    startedAtRef.current = performance.now();
    setPhase("scouting");

    // Schedule each scripted record
    SCRIPT.forEach((rec) => {
      // Activate agent at start of its "thinking"
      timersRef.current.push(
        setTimeout(() => {
          setActiveAgents((prev) => new Set(prev).add(rec.agentId));
          if (rec.role === "scout") setPhase("scouting");
          if (rec.role === "researcher") setPhase("researching");
          if (rec.role === "critic") setPhase("critiquing");
          if (rec.role === "synthesiser") setPhase("synthesising");
          if (rec.role === "verifier") setPhase("verifying");
        }, rec.delayMs)
      );
      // Drop record into transcript at end of "thinking"
      timersRef.current.push(
        setTimeout(() => {
          setActiveAgents((prev) => {
            const next = new Set(prev);
            next.delete(rec.agentId);
            return next;
          });
          setCompletedAgents((prev) => new Set(prev).add(rec.agentId));
          setTranscript((prev) => [...prev, rec]);
          setCostUsd((prev) => prev + rec.costUsd);
        }, rec.delayMs + rec.durationMs)
      );
    });

    // Reveal answer
    timersRef.current.push(
      setTimeout(() => {
        setShowAnswer(true);
        setPhase("complete");
      }, TOTAL_RUNTIME_MS - 500)
    );
  }, [reset]);

  // Drive the elapsed-time clock
  useEffect(() => {
    if (phase === "idle" || phase === "complete") return;
    let raf = 0;
    const tick = () => {
      if (startedAtRef.current) {
        setElapsedSec((performance.now() - startedAtRef.current) / 1000);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Drive the answer reveal (per-letter)
  useEffect(() => {
    if (!showAnswer) return;
    let raf = 0;
    const start = performance.now();
    const total = FINAL_ANSWER.length;
    const durationMs = 4500;
    const tick = () => {
      const t = (performance.now() - start) / durationMs;
      const n = Math.min(total, Math.floor(t * total));
      setAnswerRevealed(n);
      if (n < total) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [showAnswer]);

  // Cleanup on unmount
  useEffect(() => () => {
    timersRef.current.forEach(clearTimeout);
  }, []);

  const isRunning = phase !== "idle" && phase !== "complete";

  return (
    <section
      id="live-swarm"
      className="relative w-full bg-opus-black px-6 py-32 md:py-48"
      aria-label="Live Swarm"
    >
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="opus-eyebrow mb-4 text-center"
        >
          §5 — A swarm in motion
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="opus-display text-opus-bone text-[clamp(2rem,5vw,3.5rem)] text-center mb-4"
        >
          Live Swarm
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="opus-mono text-opus-gold text-xs uppercase tracking-widest text-center mb-12"
        >
          REAL-TIME OPUS LLM SWARM · LET THE COLONY WORK
        </motion.p>

        {/* Input + action */}
        <div className="mb-8 flex flex-col gap-3">
          <label className="opus-eyebrow text-opus-silver">
            Pose the colony a question
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isRunning}
              className="flex-1 px-4 py-3 bg-opus-black border border-opus-dim/60 text-opus-bone opus-serif text-base focus:outline-none focus:border-opus-bone disabled:opacity-50"
              placeholder="What is the question worth deliberating?"
              aria-label="Question for the swarm"
            />
            <button
              type="button"
              onClick={isRunning ? undefined : begin}
              disabled={isRunning}
              className={clsx(
                "px-6 py-3 opus-mono text-xs uppercase tracking-widest border transition-all duration-300",
                isRunning
                  ? "border-opus-dim text-opus-dim cursor-wait"
                  : "border-opus-gold text-opus-gold hover:bg-opus-gold hover:text-opus-black"
              )}
            >
              {isRunning ? "Deliberating…" : "Begin Deliberation"}
            </button>
            {phase === "complete" && (
              <button
                type="button"
                onClick={reset}
                className="px-4 py-3 opus-mono text-xs uppercase tracking-widest border border-opus-dim text-opus-silver hover:border-opus-bone hover:text-opus-bone transition-all duration-300"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Swarm graph */}
        <div className="relative w-full aspect-[16/10] border border-opus-dim/40 overflow-hidden bg-opus-black mb-6">
          <SwarmGraph
            activeAgents={activeAgents}
            completedAgents={completedAgents}
            phase={phase}
          />

          {/* HUD overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
            <div>
              <div className="opus-eyebrow text-opus-gold mb-1">
                {phase === "idle" && "— colony at rest —"}
                {phase === "scouting" && "— scouts deployed —"}
                {phase === "researching" && "— researchers proposing —"}
                {phase === "critiquing" && "— critics circling —"}
                {phase === "synthesising" && "— synthesiser fusing —"}
                {phase === "verifying" && "— verifier attacking —"}
                {phase === "complete" && "— answer accepted —"}
              </div>
            </div>
            <div className="text-right">
              <div className="opus-mono text-opus-silver text-xs">
                {timeStamp(elapsedSec)}
              </div>
              <div className="opus-mono text-opus-gold text-sm font-medium">
                ${costUsd.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div className="border border-opus-dim/40 bg-opus-black/80 p-6 font-mono text-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="opus-eyebrow text-opus-gold">— transcript —</div>
            <div className="opus-mono text-opus-dim text-[0.65rem]">
              {transcript.length} records
            </div>
          </div>
          <div className="space-y-2 min-h-[14rem] max-h-[18rem] overflow-y-auto">
            <AnimatePresence initial={false}>
              {transcript.map((r, i) => (
                <motion.div
                  key={`${r.agentId}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-opus-silver leading-snug"
                >
                  <span className="text-opus-dim mr-2">$</span>
                  <span className={clsx("font-medium", ROLE_COLORS[r.role].label)}>
                    {r.agentId}
                  </span>
                  <span className="text-opus-dim mx-1">→</span>
                  <span className="text-opus-bone">{r.type}</span>
                  <span className="text-opus-dim ml-2">
                    conf={r.confidence.toFixed(2)} · ${r.costUsd.toFixed(4)}
                  </span>
                  <div className="ml-4 mt-1 text-opus-silver/80 text-[0.78rem] leading-relaxed">
                    {trimContent(r.content)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isRunning && (
              <div className="text-opus-gold flex items-center">
                <span className="text-opus-dim mr-2">$</span>
                <span className="inline-block w-2 h-4 bg-opus-gold animate-pulse align-middle" />
              </div>
            )}
            {phase === "idle" && transcript.length === 0 && (
              <div className="text-opus-dim italic">
                press <span className="opus-mono text-opus-gold">Begin Deliberation</span> to wake the colony
              </div>
            )}
          </div>
        </div>

        {/* Answer reveal */}
        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
              className="border border-opus-gold/60 bg-opus-black p-8 mt-2"
            >
              <div className="opus-eyebrow text-opus-gold mb-4">
                — final answer · accepted on first pass —
              </div>
              <pre className="opus-serif text-opus-bone text-base leading-relaxed whitespace-pre-wrap font-serif">
                {FINAL_ANSWER.slice(0, answerRevealed)}
                {answerRevealed < FINAL_ANSWER.length && (
                  <span className="inline-block w-2 h-4 bg-opus-gold animate-pulse align-middle ml-1" />
                )}
              </pre>
              {answerRevealed >= FINAL_ANSWER.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-6 pt-6 border-t border-opus-dim/40 flex items-center justify-between"
                >
                  <div className="opus-mono text-opus-silver text-xs">
                    9 agents · 10 records · {timeStamp(elapsedSec)} · ${costUsd.toFixed(4)} total
                  </div>
                  <div className="opus-mono text-opus-dim text-[0.65rem] uppercase tracking-widest">
                    cinematic preview · real swarm coming online
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Divider className="mt-20" width="100px" />
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────
// SwarmGraph — SVG visualisation of the colony
// ──────────────────────────────────────────────────────────────────

interface SwarmGraphProps {
  activeAgents: Set<string>;
  completedAgents: Set<string>;
  phase: Phase;
}

function SwarmGraph({ activeAgents, completedAgents, phase }: SwarmGraphProps) {
  const hive = AGENTS.find((a) => a.id === "hive")!;
  const hivePos = nodePos(hive);
  const others = AGENTS.filter((a) => a.id !== "hive");

  return (
    <svg
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      className="absolute inset-0 w-full h-full"
      role="img"
      aria-label="Swarm topology — Hive at centre, Worker ring, Scout ring"
    >
      {/* Concentric ring guides */}
      <circle cx={CENTER} cy={CENTER} r={RADIUS[1]} fill="none" stroke="#787870" strokeWidth="0.4" strokeDasharray="2 5" opacity={0.5} />
      <circle cx={CENTER} cy={CENTER} r={RADIUS[2]} fill="none" stroke="#787870" strokeWidth="0.4" strokeDasharray="2 5" opacity={0.5} />

      {/* Connections */}
      {others.map((a) => {
        const p = nodePos(a);
        const isActive = activeAgents.has(a.id);
        const isCompleted = completedAgents.has(a.id);
        return (
          <g key={`line-${a.id}`}>
            <line
              x1={hivePos.x}
              y1={hivePos.y}
              x2={p.x}
              y2={p.y}
              stroke={isActive ? "#D4AF7A" : isCompleted ? "#F2EFE6" : "#787870"}
              strokeWidth={isActive ? 1.4 : isCompleted ? 0.6 : 0.4}
              opacity={isActive ? 1 : isCompleted ? 0.6 : 0.3}
            />
            {isActive && (
              <PulseAlongLine x1={hivePos.x} y1={hivePos.y} x2={p.x} y2={p.y} />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {AGENTS.map((a) => {
        const p = nodePos(a);
        const colors = ROLE_COLORS[a.role];
        const isActive = activeAgents.has(a.id);
        const isCompleted = completedAgents.has(a.id);
        const isHive = a.role === "hive";
        const baseRadius = isHive ? 18 : a.ring === 2 ? 7 : 9;

        return (
          <g key={a.id}>
            {/* Halo (animated when active) */}
            {(isActive || isHive) && (
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={baseRadius + 8}
                fill={colors.glow}
                animate={{
                  r: isActive ? [baseRadius + 6, baseRadius + 16, baseRadius + 6] : baseRadius + 6,
                  opacity: isActive ? [0.4, 0.8, 0.4] : isHive ? [0.3, 0.5, 0.3] : 0,
                }}
                transition={{
                  duration: isHive ? 1.2 : 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
            {/* Core node */}
            <circle
              cx={p.x}
              cy={p.y}
              r={baseRadius}
              fill={isActive || isHive || isCompleted ? colors.node : "#000"}
              stroke={colors.node}
              strokeWidth={isActive ? 2 : 1}
              opacity={isActive || isHive ? 1 : isCompleted ? 0.95 : 0.55}
            />
            {/* Inner mark for the Hive */}
            {isHive && (
              <circle cx={p.x} cy={p.y} r={baseRadius / 3} fill="#000" opacity={0.7} />
            )}
            {/* Label */}
            <text
              x={p.x}
              y={p.y + baseRadius + 14}
              textAnchor="middle"
              fontSize="9"
              fill={isActive ? "#D4AF7A" : isCompleted ? "#F2EFE6" : "#787870"}
              opacity={isActive || isCompleted || isHive ? 1 : 0.5}
              fontFamily="var(--font-jetbrains), monospace"
              style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              {a.label}
            </text>
          </g>
        );
      })}

      {/* Verifier attack flash */}
      {phase === "verifying" && (
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS[1] + 30}
          fill="none"
          stroke="#D4AF7A"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.6, 1.05, 1.2] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      )}
    </svg>
  );
}

// Particle that travels along a connection line when an agent is active
function PulseAlongLine({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <motion.circle
      r={2.8}
      fill="#D4AF7A"
      initial={{ cx: x2, cy: y2, opacity: 0 }}
      animate={{ cx: x1, cy: y1, opacity: [0, 1, 0] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
