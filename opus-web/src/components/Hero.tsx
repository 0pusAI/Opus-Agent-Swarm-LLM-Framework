"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Ornament } from "./ui/Ornament";
import { CloudCanvas } from "./CloudCanvas";
import { fadeIn, fadeUp } from "@/lib/motion";

// Solana contract address — the public token mint for $OPUS.
const CA = "FEbo4QzYag3u8WrABrNj3aJrnf1fe6awaLd2akLnEHfL";

// Sphere is heavy (R3F + drei + postprocessing). Load client-side only.
const Sphere = dynamic(() => import("./Sphere").then((m) => m.Sphere), {
  ssr: false,
  loading: () => null,
});

export function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for browsers without clipboard API — select-all on the
      // CA text still works because of the `select-all` Tailwind class.
    }
  }, []);

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

        {/* ─── Contract Address — click to copy ───────────────── */}
        <motion.div variants={fadeIn} className="mt-7">
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copy contract address — ${CA}`}
            title={CA}
            className="group inline-flex items-center gap-3 md:gap-4 px-3.5 md:px-5 py-2 md:py-2.5 border border-opus-gold/40 hover:border-opus-gold/80 hover:bg-opus-gold/5 transition-colors"
          >
            <span className="opus-mono text-opus-dim group-hover:text-opus-gold text-[0.55rem] md:text-[0.6rem] uppercase tracking-widest transition-colors">
              CA
            </span>
            <span
              aria-hidden
              className="h-3 w-px bg-opus-gold/40"
            />
            <span className="opus-mono text-opus-bone text-[0.62rem] md:text-[0.72rem] tracking-wider select-all">
              <span className="sm:hidden">{`${CA.slice(0, 6)}…${CA.slice(-6)}`}</span>
              <span className="hidden sm:inline">{CA}</span>
            </span>
            <span
              aria-hidden
              className="h-3 w-px bg-opus-gold/40"
            />
            <span className="opus-mono text-opus-gold text-[0.55rem] md:text-[0.6rem] uppercase tracking-widest min-w-[3.2rem] text-right transition-opacity">
              {copied ? "Copied ✓" : "Copy"}
            </span>
          </button>
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
