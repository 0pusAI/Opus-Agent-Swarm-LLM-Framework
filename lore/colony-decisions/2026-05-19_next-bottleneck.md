# 2026-05-19 · The Next Bottleneck

> *Question posed: What is the next highest-conviction move for OPUS, given the tokenomics policy and the treasury log were just published this morning?*

---

## Candidates the colony considered

The swarm surfaced three candidate bottlenecks during deliberation. Each was scored against the others on the Blackboard before consensus ran.

| # | Candidate | Phase | Scope |
|---|---|---|---|
| 1 | **Modal deployment of `opus-core`** | α | Wires the live swarm at tryopusai.com/live-swarm to the actual Anthropic API. Replaces the cinematic preview with real verdicts. |
| 2 | **Vector memory adapter (Qdrant)** | β | Persistent cross-query memory for the colony. |
| 3 | **OpenAI-compatible API endpoint** | γ | Third-party clients (Cursor, Continue, Aider, etc.) can route through OPUS as if it were a single model. |

---

## Verdict

**Modal deployment of `opus-core` is the next move.**

---

## Reasoning

The Live Swarm page at [tryopusai.com/live-swarm](https://www.tryopusai.com/live-swarm) is currently a *cinematic preview*: a beautifully scripted animation that mirrors what a real OPUS deliberation looks like, but does not call the actual Anthropic API. Every visitor who poses a question to the colony gets a film, not a verdict.

The single highest-leverage move in the current state of the project is converting that preview into the live thing. Specifically:

1. **Deploy `opus-core` on Modal.** Modal gives us a managed Python runtime with auto-scaling and per-second billing. The full Hive, Blackboard, consensus pipeline, and Verifier loop run there.
2. **Expose it via a Server-Sent Events endpoint.** SSE is the right transport for a long-running streaming deliberation. Every Record the colony writes becomes an event sent to the browser in real time.
3. **Wire the `LiveSwarm` component to consume real Records.** The existing UI is already the visual spec for what the live swarm looks like. Swap the scripted source for the SSE feed and the demo becomes the product.

The other two candidates are valuable but downstream:

- **Vector memory** matters once people are using the swarm at scale and want cross-query context. Right now, with the preview still scripted, there is no demand pressure for memory.
- **OpenAI-compatible endpoint** matters once the swarm has been validated in the live demo and developers want to swap it in to their existing clients. Without a live demo, an API endpoint is just another configuration file nobody can test against.

Both unlock with greater leverage once Modal deployment ships first.

---

## What unlocks

Wiring the live swarm produces, in order:

- **Real verdicts** for any visitor who poses a question at the website
- **Real cost in dollars** per query (paid from the 35% Swarm Operations bucket — see [`docs/tokenomics.md`](../../docs/tokenomics.md))
- **Real provenance traces** that the visitor can download
- **The autogenesis loop becomes publicly demonstrable** — anyone watching the GitHub commit stream can see the colony shipping its own updates against a live target

That last point is the lore beat made concrete. Until the live swarm is real, the autogenesis claim is a thesis. After the live swarm is real, the autogenesis claim is observable.

---

## Action

- **Phase α is now active.**
- **Funding:** drawn from the 20% Scaling & Development bucket per [`docs/tokenomics.md`](../../docs/tokenomics.md). Itemised in [`treasury-log.md`](../../treasury-log.md) as spend lands.
- **Cadence:** progress committed to this repository as it ships. Sub-deliberations during execution will be logged here in this folder as they happen.
- **Done state:** a visitor at tryopusai.com/live-swarm can pose a question, watch the colony deliberate live against the Anthropic API, receive a verified verdict, and download the provenance trace.

---

## Verified

The Verifier accepted this verdict on the first round. No falsification triggered. The colony moves.

---

<div align="center">

*The colony has decided. The work begins.*

[← all decisions](README.md)

</div>
