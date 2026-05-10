"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Divider } from "./ui/Divider";
import { fadeUp } from "@/lib/motion";

interface NodeSpec {
  id: string;
  label: string;
  role: string;
  desc: string;
  ring: 0 | 1 | 2;
  angleDeg: number;
}

// Layout: HIVE at centre (ring 0), WORKERS on inner ring (1), SCOUTS outer (2).
const NODES: NodeSpec[] = [
  { id: "hive", label: "Hive Core", role: "orchestrator", desc: "Owns the Blackboard. Schedules rounds. Runs consensus.", ring: 0, angleDeg: 0 },
  // Workers (6 around inner ring)
  { id: "researcher-a", label: "Researcher α", role: "worker.researcher", desc: "Generates one specific, falsifiable hypothesis.", ring: 1, angleDeg: 0 },
  { id: "researcher-b", label: "Researcher β", role: "worker.researcher", desc: "Distinctive hypothesis from a different angle.", ring: 1, angleDeg: 60 },
  { id: "critic-a",     label: "Critic α",     role: "worker.critic",     desc: "Targeted attack on the strongest hypothesis.", ring: 1, angleDeg: 120 },
  { id: "critic-b",     label: "Critic β",     role: "worker.critic",     desc: "Targeted attack from a different angle.", ring: 1, angleDeg: 180 },
  { id: "synthesiser",  label: "Synthesiser",  role: "worker.synthesiser", desc: "Integrates the Blackboard into one candidate answer.", ring: 1, angleDeg: 240 },
  { id: "verifier",     label: "Verifier",     role: "worker.verifier",   desc: "Attempts to falsify the candidate. Bounded to 3 attempts.", ring: 1, angleDeg: 300 },
  // Scouts (3 around outer ring)
  { id: "scout-1", label: "Scout 1", role: "scout", desc: "Brings back one distinctive observation.", ring: 2, angleDeg: 0 },
  { id: "scout-2", label: "Scout 2", role: "scout", desc: "Reads from a different angle.", ring: 2, angleDeg: 120 },
  { id: "scout-3", label: "Scout 3", role: "scout", desc: "Different angle again.", ring: 2, angleDeg: 240 },
];

const RADIUS = { 0: 0, 1: 130, 2: 240 } as const;
const SVG_SIZE = 600;
const CENTRE = SVG_SIZE / 2;

function nodePos(n: NodeSpec) {
  const r = RADIUS[n.ring];
  const a = (n.angleDeg * Math.PI) / 180;
  return { x: CENTRE + r * Math.cos(a), y: CENTRE + r * Math.sin(a) };
}

export function Architecture() {
  const [hovered, setHovered] = useState<string | null>(null);
  const hive = NODES.find((n) => n.id === "hive")!;
  const hivePos = nodePos(hive);
  const hoverNode = hovered ? NODES.find((n) => n.id === hovered) : null;

  return (
    <section
      id="architecture"
      className="relative w-full bg-opus-black px-6 py-32 md:py-48"
      aria-label="Architecture"
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-eyebrow mb-4 text-center"
        >
          §3 — Architecture
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-display text-opus-bone text-[clamp(2rem,5vw,3.5rem)] text-center mb-12"
        >
          The Topology
        </motion.h2>

        <div className="relative mx-auto" style={{ maxWidth: SVG_SIZE }}>
          <svg
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            className="w-full h-auto"
            role="img"
            aria-label="Hive at centre, Worker ring, Scout ring with message-passing lines"
          >
            {/* Concentric ring guides */}
            <circle cx={CENTRE} cy={CENTRE} r={RADIUS[1]} fill="none" stroke="var(--opus-dim)" strokeWidth="0.5" strokeDasharray="2 4" />
            <circle cx={CENTRE} cy={CENTRE} r={RADIUS[2]} fill="none" stroke="var(--opus-dim)" strokeWidth="0.5" strokeDasharray="2 4" />

            {/* Lines from each node to Hive */}
            {NODES.filter((n) => n.id !== "hive").map((n) => {
              const p = nodePos(n);
              const active = hovered === n.id;
              return (
                <line
                  key={`l-${n.id}`}
                  x1={hivePos.x}
                  y1={hivePos.y}
                  x2={p.x}
                  y2={p.y}
                  stroke={active ? "var(--opus-gold)" : "var(--opus-dim)"}
                  strokeWidth={active ? 1.4 : 0.6}
                  opacity={active ? 1 : 0.5}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((n) => {
              const p = nodePos(n);
              const isHive = n.id === "hive";
              const r = isHive ? 22 : 11;
              const active = hovered === n.id;
              return (
                <g
                  key={n.id}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                  tabIndex={0}
                  onFocus={() => setHovered(n.id)}
                  onBlur={() => setHovered(null)}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={r + 4}
                    fill="var(--opus-black)"
                    stroke={active ? "var(--opus-gold)" : "var(--opus-bone)"}
                    strokeWidth={active ? 1.5 : 0.8}
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={r}
                    fill={isHive ? "var(--opus-gold)" : (active ? "var(--opus-gold)" : "var(--opus-bone)")}
                    opacity={active || isHive ? 1 : 0.85}
                  />
                </g>
              );
            })}
          </svg>

          {/* Hover tooltip */}
          <div className="mt-8 min-h-[5rem] text-center">
            {hoverNode ? (
              <div>
                <div className="opus-mono text-opus-gold text-xs uppercase tracking-widest mb-1">
                  {hoverNode.role}
                </div>
                <div className="opus-display text-opus-bone text-xl mb-2">
                  {hoverNode.label}
                </div>
                <p className="opus-serif text-opus-silver max-w-md mx-auto">
                  {hoverNode.desc}
                </p>
              </div>
            ) : (
              <p className="opus-mono text-opus-dim text-xs uppercase tracking-widest">
                Hover or focus a node
              </p>
            )}
          </div>
        </div>

        <Divider className="mt-24" width="100px" />
      </div>
    </section>
  );
}
