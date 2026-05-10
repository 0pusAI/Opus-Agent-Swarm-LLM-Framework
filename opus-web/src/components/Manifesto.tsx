"use client";

import { motion } from "framer-motion";
import { Divider } from "./ui/Divider";
import { fadeUp } from "@/lib/motion";

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative w-full bg-opus-black px-6 py-32 md:py-48"
      aria-label="Manifesto"
    >
      <div className="mx-auto max-w-[720px]">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={fadeUp}
          className="opus-eyebrow mb-8 text-center"
        >
          §1 — Manifesto
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.18 } },
          }}
          className="opus-serif text-opus-bone text-[1.25rem] leading-relaxed space-y-7"
        >
          <motion.p variants={fadeUp} className="opus-dropcap">
            Opus is not a model. It is a colony.
          </motion.p>

          <motion.p variants={fadeUp}>
            A single language model, however large, reasons in one voice. It produces a stream of plausible tokens, defends them, and moves on. It cannot meaningfully disagree with itself, cannot triangulate, and cannot be falsified except from outside.
          </motion.p>

          <motion.p variants={fadeUp}>
            We replace that lonely soliloquy with a structured swarm. Three concentric tiers — <em>Scouts</em> at the perimeter, <em>Workers</em> in the middle, a <em>Hive Core</em> at the centre — coordinate not by speaking to each other but by writing typed records to a single shared substrate: the <em>Blackboard</em>, an append-only event log. The environment is the conversation.
          </motion.p>

          <motion.p variants={fadeUp}>
            When the colony has deliberated enough, three stages of consensus run: weighted Borda aggregation across Worker rankings, an LLM-as-Judge adjudication on near-ties, and a Verifier pass that attempts to <em>falsify</em> the chosen answer. If verification fails, the swarm re-deliberates with the falsification as a new constraint. The loop is bounded. The colony does not lie about its certainty.
          </motion.p>

          <motion.p variants={fadeUp} className="text-opus-silver italic">
            Solve et coagula. Dissolve a single mind into many; recombine the many into one well-considered answer. That is the Great Work.
          </motion.p>
        </motion.div>

        <Divider className="mt-20" width="100px" />
      </div>
    </section>
  );
}
