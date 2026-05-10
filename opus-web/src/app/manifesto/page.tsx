import type { Metadata } from "next";
import { Divider } from "@/components/ui/Divider";

export const metadata: Metadata = {
  title: "OPUS — Manifesto",
  description: "The long-form Manifesto for OPUS — Ars Magna.",
};

export default function ManifestoPage() {
  return (
    <main className="min-h-screen bg-opus-black px-6 py-32">
      <article className="mx-auto max-w-[720px]">
        <p className="opus-eyebrow mb-6 text-center">— Manifesto —</p>
        <h1 className="opus-display text-opus-bone text-[clamp(2.5rem,6vw,4.5rem)] text-center mb-16 leading-none">
          OPUS
        </h1>

        <div className="opus-serif text-opus-bone text-[1.18rem] leading-relaxed space-y-7">
          <p className="opus-dropcap">
            Opus is not a model. It is a colony.
          </p>

          <p>
            A single language model, however large, reasons in one voice. It produces a stream of plausible tokens, defends them, and moves on. It cannot meaningfully disagree with itself. It cannot triangulate. It cannot be falsified except from outside.
          </p>

          <p>
            We replace that lonely soliloquy with a structured swarm. Three concentric tiers — Scouts at the perimeter, Workers in the middle, a Hive Core at the centre — coordinate not by speaking to each other but by writing typed records to a single shared substrate: the Blackboard, an append-only event log. Each agent reads the current state of the Blackboard, performs one unit of cognition, and writes its result back. No agent has a private channel to any other. The environment is the conversation.
          </p>

          <p>
            This is the stigmergic principle, observed first in termite mound construction by Grassé in 1959 and formalised in computer science as the blackboard architecture by Hearsay-II at Carnegie Mellon between 1971 and 1976. It is not new. What is new is applying it, with discipline, to large language models — to obtain something a single model cannot produce: a deliberation, with an audit trail, a confidence, and a falsification attempt baked in.
          </p>

          <p>
            When the colony has deliberated enough, three stages of consensus run. Borda aggregation ranks across all Worker outputs. A Judge adjudicates near-ties. A Verifier attempts to falsify the chosen answer. If verification fails, the swarm re-deliberates with the falsification as a new constraint. The loop is bounded: at most three attempts, after which the colony surfaces what it has, with confidence and trace. The colony does not lie about its certainty.
          </p>

          <p className="text-opus-silver italic text-center pt-8">
            Solve et coagula.
            <br />
            Dissolve a single mind into many; recombine the many into one well-considered answer.
            <br />
            That is the Great Work.
          </p>
        </div>

        <Divider className="mt-20" width="100px" />

        <p className="opus-mono text-opus-dim text-xs uppercase tracking-widest text-center mt-12">
          Magnum&nbsp;Opus · MMXXVI
        </p>
      </article>
    </main>
  );
}
