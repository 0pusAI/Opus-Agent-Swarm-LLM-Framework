"use client";

/**
 * LiveSwarm — animated dots on a hex grid leaving fading luminous trails,
 * with a streaming terminal-style log of faux agent messages below.
 *
 * v0: visually rough. The structure is right; the animation is intentionally
 * simple (Canvas 2D, hex centroids + per-particle decay). Polish in later
 * sessions — likely move to WebGL with instanced points + a real shader.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Divider } from "./ui/Divider";
import { fadeUp } from "@/lib/motion";

const FAUX_LOG_LINES = [
  "scout_07 → retrieving sources for hypothesis H4",
  "researcher_03 → submitting hypothesis H4 conf=0.71",
  "critic_02 → rejecting H1: contradicts axiom A3",
  "scout_02 → observation O11 conf=0.84",
  "synthesiser_00 → integrating H4 + O11 → S2",
  "verifier_00 → attempt 1: scanning S2 for falsifications",
  "researcher_01 → submitting hypothesis H5 conf=0.62",
  "critic_01 → rejecting H5: weakly supported by O3",
  "judge_00 → adjudicating S2 vs S3 (Δ=0.02)",
  "verifier_00 → verdict.accepted on S2",
  "hive → provenance written: provenance/8b3c91…jsonl",
];

export function LiveSwarm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [logLines, setLogLines] = useState<string[]>([]);

  // ── Streaming log ───────────────────────────────────────────────
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setLogLines((prev) => {
        const next = [...prev, FAUX_LOG_LINES[i % FAUX_LOG_LINES.length]];
        return next.slice(-9);
      });
      i++;
    }, 1100);
    return () => clearInterval(id);
  }, []);

  // ── Canvas dots on hex grid ─────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate hex grid centroids
    const hexSize = 28;
    const centroids: { x: number; y: number }[] = [];
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    for (let row = 0; row * (hexSize * 1.5) < h + hexSize; row++) {
      for (let col = 0; col * (hexSize * Math.sqrt(3)) < w + hexSize; col++) {
        const x = col * hexSize * Math.sqrt(3) + (row % 2 ? hexSize * Math.sqrt(3) / 2 : 0);
        const y = row * hexSize * 1.5;
        centroids.push({ x, y });
      }
    }

    // Particles that hop between centroids, leaving trails
    const particles = Array.from({ length: 24 }).map(() => ({
      idx: Math.floor(Math.random() * centroids.length),
      next: 0,
      t: Math.random(),
      speed: 0.005 + Math.random() * 0.012,
      gold: Math.random() > 0.85,
    }));
    particles.forEach((p) => {
      p.next = (p.idx + 1 + Math.floor(Math.random() * 6)) % centroids.length;
    });

    const tick = () => {
      // fade the previous frame
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      particles.forEach((p) => {
        const a = centroids[p.idx];
        const b = centroids[p.next];
        if (!a || !b) return;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.fillStyle = p.gold ? "rgba(212, 175, 122, 0.8)" : "rgba(242, 239, 230, 0.6)";
        ctx.beginPath();
        ctx.arc(x, y, p.gold ? 2.4 : 1.6, 0, Math.PI * 2);
        ctx.fill();
        p.t += p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.idx = p.next;
          p.next = (p.idx + 1 + Math.floor(Math.random() * 6)) % centroids.length;
        }
      });

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="live-swarm"
      className="relative w-full bg-opus-black px-6 py-32 md:py-48"
      aria-label="Live Swarm"
    >
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-eyebrow mb-4 text-center"
        >
          §5 — A swarm in motion
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-display text-opus-bone text-[clamp(2rem,5vw,3.5rem)] text-center mb-16"
        >
          Live Swarm
        </motion.h2>

        <div className="relative w-full aspect-[16/9] border border-opus-dim/40 overflow-hidden bg-opus-black mb-8">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>

        <div className="border border-opus-dim/40 bg-opus-black/80 p-6 font-mono text-sm">
          <div className="opus-eyebrow mb-3 text-opus-gold">— transcript —</div>
          <div className="space-y-1 min-h-[14rem]">
            {logLines.map((line, i) => (
              <div key={i} className="text-opus-silver">
                <span className="text-opus-dim mr-2">$</span>
                {line}
              </div>
            ))}
            <div className="text-opus-gold">
              <span className="text-opus-dim mr-2">$</span>
              <span className="inline-block w-2 h-4 bg-opus-gold animate-pulse align-middle" />
            </div>
          </div>
        </div>

        <Divider className="mt-20" width="100px" />
      </div>
    </section>
  );
}
