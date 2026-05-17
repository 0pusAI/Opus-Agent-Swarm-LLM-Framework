"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Ornament } from "./ui/Ornament";
import { CloudCanvas } from "./CloudCanvas";
import { fadeIn, fadeUp } from "@/lib/motion";

const CONTRACT_ADDRESS = "FEbo4QzYag3u8WrABrNj3aJrnf1fe6awaLd2akLnEHfL";

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
          className="mt-8 w-full max-w-[640px] px-4"
        >
          <ContractAddressBlock />
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

// ──────────────────────────────────────────────────────────────────
// Contract Address — click-to-copy, OPUS-styled
// ──────────────────────────────────────────────────────────────────

function ContractAddressBlock() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = CONTRACT_ADDRESS;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy contract address"
      className="group block w-full text-left border border-opus-dim/60 hover:border-opus-gold transition-colors duration-300 bg-opus-black/50 backdrop-blur-sm px-4 py-3"
    >
      <div className="flex items-center justify-between gap-3 mb-1">
        <span className="opus-mono text-opus-gold text-[0.6rem] uppercase tracking-widest">
          CA · Solana
        </span>
        <span className="opus-mono text-[0.6rem] uppercase tracking-widest text-opus-dim group-hover:text-opus-bone transition-colors">
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.2 }}
                className="text-opus-gold"
              >
                ✓ Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Click to copy
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>
      <div className="opus-mono text-opus-bone text-[0.7rem] sm:text-[0.8rem] md:text-[0.92rem] break-all leading-relaxed select-all">
        {CONTRACT_ADDRESS}
      </div>
    </button>
  );
}
