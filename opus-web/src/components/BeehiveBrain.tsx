"use client";

import { motion } from "framer-motion";
import { Divider } from "./ui/Divider";
import { fadeUp } from "@/lib/motion";

const PRINCIPLES = [
  {
    n: "I.",
    title: "Parallel Exploration",
    body: "Many Scouts read the world at once. None depend on the others; all write to the same Blackboard. Coverage, not coordination, is the unit of progress.",
  },
  {
    n: "II.",
    title: "Stigmergic Memory",
    body: "Agents do not message each other. They modify a shared environment — the Blackboard — and respond to its state. Communication is a side effect of work.",
  },
  {
    n: "III.",
    title: "Consensus Synthesis",
    body: "Three stages: Borda aggregation, Judge adjudication, Verifier falsification. The colony surfaces what survives, attached to its provenance and confidence.",
  },
];

export function BeehiveBrain() {
  return (
    <section
      id="beehive"
      className="relative w-full bg-opus-black px-6 py-32 md:py-48"
      aria-label="The Beehive Brain"
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-eyebrow mb-4 text-center"
        >
          §2 — Three principles
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-display text-opus-bone text-[clamp(2rem,5vw,3.5rem)] text-center mb-20"
        >
          The Beehive Brain
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.n}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.15 }}
              className="text-center md:text-left"
            >
              <div className="opus-display text-opus-gold text-2xl mb-6">{p.n}</div>
              <h3 className="opus-serif text-opus-bone text-2xl mb-4 italic">
                {p.title}
              </h3>
              <p className="opus-serif text-opus-silver leading-relaxed">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>

        <Divider className="mt-24" width="100px" />
      </div>
    </section>
  );
}
