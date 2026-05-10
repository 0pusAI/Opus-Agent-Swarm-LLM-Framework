"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Ornament } from "./ui/Ornament";
import { CloudCanvas } from "./CloudCanvas";
import { fadeIn, fadeUp } from "@/lib/motion";

// Sphere is heavy (R3F + drei + postprocessing). Load client-side only.
const Sphere = dynamic(() => import("./Sphere").then((m) => m.Sphere), {
  ssr: false,
  loading: () => null,
});

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-opus-black"
      aria-label="OPUS — Ars Magna"
    >
      <CloudCanvas intensity={0.55} />
      <Sphere />

      <Ornament size={36} inset={28} className="absolute inset-0 z-10" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } } }}
        className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          variants={fadeUp}
          className="opus-eyebrow mb-10"
        >
          — ARS · MAGNA —
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="opus-display text-opus-bone text-[clamp(3.5rem,12vw,9rem)] leading-none"
        >
          O&nbsp;P&nbsp;U&nbsp;S
        </motion.h1>

        <motion.div
          variants={fadeIn}
          className="mt-12 max-w-2xl"
        >
          <p className="opus-mono text-opus-silver text-[0.78rem] uppercase tracking-widest">
            A&nbsp; multi-agent&nbsp; swarm&nbsp; architecture
            <br />
            for&nbsp; collective&nbsp; reasoning
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="absolute bottom-12 flex flex-col items-center gap-3"
        >
          <span className="opus-mono text-[0.65rem] uppercase tracking-widest text-opus-dim">
            Scroll
          </span>
          <span
            className="block h-10 w-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--opus-dim), transparent)",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
