"use client";

import { motion } from "framer-motion";
import { Divider } from "./ui/Divider";
import { fadeUp } from "@/lib/motion";

interface Row {
  label: string;
  desc: string;
  status: "ACTIVE" | "LIVE" | "PLANNED";
}

const ROWS: Row[] = [
  { label: "claude-opus-4-7", desc: "Workers, Judge, Verifier", status: "ACTIVE" },
  { label: "claude-sonnet-4-6", desc: "Scouts, lightweight critique", status: "ACTIVE" },
  { label: "asyncio + anyio", desc: "Concurrency runtime", status: "ACTIVE" },
  { label: "pydantic v2", desc: "Strict typing on every Record", status: "ACTIVE" },
  { label: "structlog (JSON)", desc: "Structured observability", status: "ACTIVE" },
  { label: "typer", desc: "CLI surface (`opus query …`)", status: "ACTIVE" },
  { label: "hatchling", desc: "Packaging backend", status: "ACTIVE" },
  { label: "pytest + pytest-asyncio", desc: "Test suite", status: "ACTIVE" },
  { label: "Next.js 14 + Three.js + GSAP", desc: "This site", status: "LIVE" },
  { label: "Qdrant", desc: "Vector memory (interface stubbed)", status: "PLANNED" },
  { label: "Neo4j", desc: "Graph memory (interface stubbed)", status: "PLANNED" },
  { label: "Redis Streams", desc: "Distributed Blackboard backend", status: "PLANNED" },
  { label: "OpenTelemetry", desc: "Distributed tracing", status: "PLANNED" },
];

const STATUS_COLOR: Record<Row["status"], string> = {
  ACTIVE: "border-opus-bone text-opus-bone",
  LIVE: "border-opus-gold text-opus-gold",
  PLANNED: "border-opus-dim text-opus-dim",
};

export function TechStack() {
  return (
    <section
      id="stack"
      className="relative w-full bg-opus-black px-6 py-32 md:py-48"
      aria-label="Tech Stack"
    >
      <div className="mx-auto max-w-4xl">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-eyebrow mb-4 text-center"
        >
          §8 — Stack
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-display text-opus-bone text-[clamp(2rem,5vw,3.5rem)] text-center mb-16"
        >
          Materials
        </motion.h2>

        <div className="space-y-1">
          {ROWS.map((r, i) => (
            <motion.div
              key={r.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-5% 0px" }}
              variants={fadeUp}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
              className="grid grid-cols-12 items-baseline gap-4 py-4 border-b border-opus-dim/40"
            >
              <div className="col-span-12 sm:col-span-4 opus-mono text-opus-bone text-sm">
                {r.label}
              </div>
              <div className="col-span-9 sm:col-span-6 opus-serif text-opus-silver text-base italic">
                {r.desc}
              </div>
              <div className="col-span-3 sm:col-span-2 text-right">
                <span
                  className={`inline-block px-2 py-1 opus-mono text-[0.65rem] uppercase tracking-widest border ${STATUS_COLOR[r.status]}`}
                >
                  {r.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <Divider className="mt-20" width="100px" />
      </div>
    </section>
  );
}
