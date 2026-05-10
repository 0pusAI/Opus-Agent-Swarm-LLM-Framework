"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { fadeUp } from "@/lib/motion";

export function CallToAction() {
  return (
    <section
      id="cta"
      className="relative w-full bg-opus-black px-6 py-32 md:py-48"
      aria-label="Call to action"
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-eyebrow mb-6"
        >
          — Initiation —
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-display text-opus-bone text-[clamp(2.5rem,7vw,5rem)] mb-10"
        >
          Join the Work
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-serif text-opus-silver text-xl italic mb-14 max-w-xl mx-auto leading-relaxed"
        >
          Daily builds are broadcast in public. The whitepaper is the source of truth. Early access is by request.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button href="/build-log">Watch Daily Builds</Button>
          <Button href="/whitepaper.pdf" external variant="gold">
            Read the Whitepaper
          </Button>
          <Button href="/manifesto" variant="ghost">
            Request Early Access
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
