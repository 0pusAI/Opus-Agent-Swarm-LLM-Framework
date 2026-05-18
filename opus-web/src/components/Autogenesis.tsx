"use client";

/**
 * Autogenesis — homepage showcase.
 *
 * The biggest lore beat of the project: OPUS was built — and continues
 * to be built — by the OPUS swarm itself. Sits late in the homepage
 * (after BuildLog, before CallToAction) so the visitor first sees the
 * visible craft of the project, then learns who actually authored it,
 * then is invited to use the same colony.
 *
 * Two-column on desktop: Ouroboros sigil left, thesis + CTA right.
 * Stacks on mobile.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { Divider } from "./ui/Divider";
import { fadeUp } from "@/lib/motion";

export function Autogenesis() {
  return (
    <section
      id="autogenesis"
      className="relative w-full bg-opus-black px-6 py-32 md:py-48 overflow-hidden"
      aria-label="Autogenesis — the colony that builds itself"
    >
      {/* Faint radial gold glow behind the sigil to give the section weight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 28% 50%, rgba(212,175,122,0.10), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-eyebrow text-center mb-4"
        >
          §7 — The Ouroboros
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-display text-opus-bone text-[clamp(2rem,5vw,3.5rem)] text-center mb-20"
        >
          Autogenesis
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-16 md:gap-20 items-center">
          {/* ─── The Sigil ────────────────────────────────────── */}
          <motion.figure
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative w-full max-w-[460px] mx-auto aspect-square"
          >
            <div
              className="absolute inset-0 -m-3 border border-opus-dim/40 pointer-events-none"
              aria-hidden
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/autogenesis/ouroboros.svg"
              alt="The Ouroboros — the colony that builds itself"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
            />
            <figcaption className="opus-mono text-opus-dim text-[0.65rem] uppercase tracking-widest text-center mt-6">
              The Ouroboros · the work that creates the workman
            </figcaption>
          </motion.figure>

          {/* ─── The Thesis ───────────────────────────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
            className="opus-serif text-opus-bone text-[1.12rem] md:text-[1.18rem] leading-relaxed space-y-6"
          >
            <motion.p
              variants={fadeUp}
              className="opus-display text-opus-gold text-xl md:text-2xl leading-snug !mb-2"
            >
              OPUS was not built top-down by a single mind.<br />
              It was built — and continues to be built — by the swarm it&nbsp;is.
            </motion.p>

            <motion.p variants={fadeUp}>
              The architect does not propose features. They pose questions.
              The colony deliberates. Scouts gather, Workers argue, the
              Verifier attempts to falsify, the Hive Core surfaces a
              verdict. Only then is the verdict transcribed into code,
              into prose, into the public site.
            </motion.p>

            <motion.p variants={fadeUp}>
              Every architectural choice, every agent role, every sigil in
              the codex, every commit in the log — was first deliberated
              by the colony, then made by the colony, then verified by
              the colony. The work belongs to the work.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="opus-serif italic text-opus-gold text-lg md:text-xl pt-2"
            >
              &ldquo;The serpent eats its tail. The loop is sealed.
              Nothing leaves that was not first verified within.&rdquo;
            </motion.p>

            <motion.div variants={fadeUp} className="pt-6 flex flex-wrap gap-3">
              <Link
                href="/autogenesis"
                className="opus-mono text-opus-gold text-xs uppercase tracking-widest border border-opus-gold/60 px-5 py-3 hover:bg-opus-gold hover:text-opus-black transition-colors"
              >
                Read the doctrine →
              </Link>
              <Link
                href="https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework/tree/main/lore/autogenesis"
                target="_blank"
                rel="noreferrer noopener"
                className="opus-mono text-opus-silver text-xs uppercase tracking-widest border border-opus-dim/60 px-5 py-3 hover:border-opus-bone hover:text-opus-bone transition-colors"
              >
                View on GitHub
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <Divider className="mt-24" width="100px" />
      </div>
    </section>
  );
}
