"use client";

/**
 * /build-log — dedicated cinematic archive page.
 *
 * Hero with the days-since-start counter, then the BuildLogTimeline
 * (scroll-linked gold thread, diamond markers, staggered entry reveals,
 * sticky reading indicator). Lenis smooth scroll active throughout.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Divider } from "@/components/ui/Divider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { BuildLogTimeline } from "@/components/BuildLogTimeline";
import { BUILD_LOG_START } from "@/data/buildLog";

function spellOut(n: number): string {
  const ones = ["zero","one","two","three","four","five","six","seven","eight","nine"];
  const teens = ["ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  if (n < 0) return String(n);
  if (n < 10) return ones[n];
  if (n < 20) return teens[n - 10];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return o === 0 ? tens[t] : `${tens[t]}-${ones[o]}`;
  }
  return String(n);
}

export default function BuildLogPage() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const diff = Date.now() - BUILD_LOG_START.getTime();
      setDays(Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1));
    };
    tick();
    const id = setInterval(tick, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const display = days ?? 15;
  const word = spellOut(display);

  return (
    <main className="min-h-screen bg-opus-black text-opus-bone overflow-x-hidden">
      <SmoothScroll />

      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[80vh] md:min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2 }}
          className="opus-eyebrow text-opus-silver mb-8"
        >
          — §7 · Archive of Days —
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          className="opus-display text-opus-bone text-[clamp(3rem,11vw,8rem)] leading-none mb-10"
        >
          B&nbsp;U&nbsp;I&nbsp;L&nbsp;D&nbsp; L&nbsp;O&nbsp;G
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.7 }}
          className="opus-serif italic text-opus-bone text-base md:text-xl leading-relaxed max-w-2xl"
        >
          In the making for{" "}
          <span className="opus-display not-italic text-opus-gold tracking-wider">
            {word}
          </span>
          {" "}days
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.0 }}
          className="opus-mono text-opus-dim text-xs uppercase tracking-widest mt-6"
        >
          built in public · the work continues
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.4 }}
          className="absolute bottom-12 flex flex-col items-center gap-3"
        >
          <span className="opus-mono text-[0.6rem] uppercase tracking-widest text-opus-dim">
            scroll the archive
          </span>
          <motion.span
            aria-hidden
            className="block h-10 w-px bg-gradient-to-b from-opus-dim to-transparent"
            animate={{ scaleY: [1, 0.6, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ─── Timeline ──────────────────────────────────────────── */}
      <BuildLogTimeline />

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="relative w-full bg-opus-black px-6 pb-16 pt-8">
        <div className="mx-auto max-w-5xl">
          <Divider width="120px" className="mb-10" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="opus-mono text-opus-dim text-xs uppercase tracking-widest">
              Magnum&nbsp;Opus · MMXXVI
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#live-swarm"
                className="opus-mono text-opus-gold text-xs uppercase tracking-widest border border-opus-gold/60 px-4 py-2 hover:bg-opus-gold hover:text-opus-black transition-colors"
              >
                Try the Swarm
              </Link>
              <Link
                href="/sigils"
                className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-4 py-2 hover:border-opus-bone hover:text-opus-bone transition-colors"
              >
                Read as Codex
              </Link>
              <Link
                href="/whitepaper"
                className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-4 py-2 hover:border-opus-bone hover:text-opus-bone transition-colors"
              >
                Whitepaper
              </Link>
              <Link
                href="/"
                className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-4 py-2 hover:border-opus-bone hover:text-opus-bone transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
