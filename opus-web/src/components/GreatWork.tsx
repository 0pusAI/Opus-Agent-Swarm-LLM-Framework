"use client";

import { motion } from "framer-motion";
import { Divider } from "./ui/Divider";
import { fadeUp } from "@/lib/motion";

export function GreatWork() {
  return (
    <section
      id="great-work"
      className="relative w-full bg-opus-black px-6 py-32 md:py-48"
      aria-label="The Great Work"
    >
      <div className="mx-auto max-w-[720px]">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-eyebrow mb-4 text-center"
        >
          §6 — Philosophy
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="opus-display text-opus-bone text-[clamp(2rem,5vw,3.5rem)] text-center mb-16"
        >
          The Great Work
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
          className="opus-serif text-opus-bone text-[1.18rem] leading-relaxed space-y-7"
        >
          <motion.h3 variants={fadeUp} className="opus-display text-opus-gold text-xl mb-2">
            Why a swarm?
          </motion.h3>
          <motion.p variants={fadeUp}>
            A colony introspects. A lone agent does not. The cheapest unit of useful disagreement is two agents reading the same Blackboard and producing different syntheses. Once you have that, you can rank, you can adjudicate, you can falsify. Cognition becomes legible.
          </motion.p>

          <motion.blockquote
            variants={fadeUp}
            className="border-l-2 border-opus-gold pl-6 my-10 opus-serif text-opus-gold text-2xl italic leading-snug"
          >
            &ldquo;Dissolve the one mind into many. Recombine the many into one well-considered answer.&rdquo;
          </motion.blockquote>

          <motion.h3 variants={fadeUp} className="opus-display text-opus-gold text-xl mb-2 mt-12">
            Lineage
          </motion.h3>
          <motion.p variants={fadeUp}>
            OPUS stands on three traditions: <em>Ramon Llull&rsquo;s Ars Magna</em> (1305) — combinatorial generation under a falsifier; <em>Hearsay-II</em> (CMU, 1971–1976) — the first blackboard architecture for cooperative cognition; and <em>stigmergy</em> (Grassé, 1959) — the principle that termites, and now agents, coordinate by modifying their environment.
          </motion.p>

          <motion.h3 variants={fadeUp} className="opus-display text-opus-gold text-xl mb-2 mt-12">
            Ars Magna
          </motion.h3>
          <motion.p variants={fadeUp}>
            We do not claim novelty in the parts. We claim attention to the whole — combinatorial generation, shared substrate, stigmergic coordination, bounded falsification — applied to large language models with engineering discipline. <em>Solve et coagula.</em> The work continues.
          </motion.p>
        </motion.div>

        <Divider className="mt-20" width="100px" />
      </div>
    </section>
  );
}
