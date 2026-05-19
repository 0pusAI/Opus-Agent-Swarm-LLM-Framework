# OPUS Tokenomics
## Creator Rewards Allocation Policy

> *Every dollar that flows to the creator wallet has one job: to feed the colony.*

This document is the colony's allocation policy for Creator Rewards from the $OPUS token. It is fixed at launch. Any change requires a fresh deliberation by the colony, a verdict, and a public commit.

---

## The CA

**Solana:** `FjGZibcd8DBzxoL3H2srMayap1h7S5Q5NuPoaJcVpump`

---

## The Allocation

| % | Bucket | Purpose |
|---|---|---|
| **45%** | Buybacks & Burns | Token supply tightens, conviction concentrates |
| **35%** | Swarm Operations | The colony's actual cost of thinking (API, compute, hosting) |
| **20%** | Scaling & Development | The next bottleneck the colony surfaces |

100% allocated. No hidden buckets. No team multisig sweeping fees into another wallet.

---

### 45% · Buybacks & Burns

Every dollar in this bucket is used to buy $OPUS from the open market and burn it. The supply tightens. The conviction concentrates. The architecture rewards the long view.

**Cadence.** Weekly. Every Sunday at 22:00 UTC the accumulated 45% bucket is deployed against the open market via a public Solana DEX aggregator. The transaction hashes and the amount of $OPUS burned are appended to [`treasury-log.md`](../treasury-log.md) within 24 hours.

### 35% · Swarm Operations

Every dollar in this bucket pays for the colony's actual cost of thinking.

- **Anthropic API** — the swarm's reasoning. Every Worker deliberation, every Verifier pass, every Judge adjudication.
- **Modal** — compute for the live swarm deployment at tryopusai.com (Phase α onward).
- **Vercel** — hosting for the website.
- **Observability** — OpenTelemetry traces (Phase β).

Every visitor who poses a question to the colony at tryopusai.com costs real dollars. This bucket is what keeps the lights on.

**Cadence.** Monthly. The accumulated operations expenditure is itemised in `treasury-log.md` (invoices summarised, totals shown).

### 20% · Scaling & Development

Every dollar in this bucket funds the next bottleneck the colony surfaces through its autogenesis loop. Engineering throughput. Infrastructure expansion. New features the swarm has identified as the highest-conviction next move.

**Cadence.** Deployed against the next bottleneck as the colony's weekly deliberation surfaces it. Bottleneck deliberations logged at [`lore/colony-decisions/`](../lore/colony-decisions/). Expenditure itemised at `treasury-log.md`.

---

## Why these numbers

**45% to Buybacks & Burns.** Tightening supply is the most legible value-accrual mechanic crypto has, but anything over 50% feels desperate. 45% lets the colony fund the actual product without sacrificing holder signal.

**35% to Swarm Operations.** The swarm is the product. Underfunding the colony's reasoning capacity is the only way to break the project. This bucket must be non-trivial.

**20% to Scaling & Development.** Compounding requires reinvestment. Less than 20% and the project plateaus.

---

## Transparency

Every dollar deployed is logged in [`treasury-log.md`](../treasury-log.md), a public append-only ledger living in this repository. Every buyback transaction hash, every operations invoice summary, every scaling expenditure goes in. The colony cannot move treasury funds without leaving a trace in the git history.

The git history is its diary. The buyback log is its receipt.

---

## Wallets

To be published here as wallets are deployed. All wallets are read-only-public — anyone can verify balances and flows on Solana.

| Purpose | Address |
|---|---|
| Creator rewards (inflow) | *(to be published)* |
| Buyback & burn execution | *(to be published)* |
| Operations | *(to be published)* |
| Scaling | *(to be published)* |

---

## Notes

This document describes the colony's stated allocation policy. It is not a guarantee about future returns, market behaviour, or the underlying token's price. Crypto is volatile. Smart contracts can fail. APIs change. The colony's job is to be honest about what it does and what it costs.

Read the [whitepaper](whitepaper.md). Read the [code](https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework). Decide for yourself.

---

*Magnum Opus · MMXXVI*
