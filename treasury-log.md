# OPUS · Treasury Log

> *Every dollar in. Every dollar out. Public, append-only.*

This file is the colony's public ledger. Every Creator Reward dollar that enters the treasury and every dollar that leaves is recorded here, with transaction hashes where applicable.

The allocation policy that governs this log is documented at [`docs/tokenomics.md`](docs/tokenomics.md).

---

## Format

Entries are appended in **reverse chronological order** (newest at top). Each entry is one of:

| Type | What it logs |
|---|---|
| **Inflow** | Creator Reward dollars received from the $OPUS token |
| **Buyback & Burn** | 45% bucket execution — tokens bought from open market and burned |
| **Operations** | 35% bucket execution — API, compute, hosting invoices |
| **Scaling** | 20% bucket execution — engineering and infrastructure spend |

Every entry includes the date, the bucket, the amount in USD, and a transaction hash or invoice reference. Entries are never edited or removed — corrections are appended as new entries that reference the prior one.

---

## Cadence

- **Buyback & Burn:** Weekly, every Sunday at 22:00 UTC. The accumulated 45% bucket is deployed against the open market via a public Solana DEX aggregator. Transaction hashes posted within 24 hours.
- **Operations:** Monthly. The accumulated operations expenditure is itemised (Anthropic invoice, Modal usage summary, Vercel billing).
- **Scaling:** As the colony's autogenesis loop surfaces a bottleneck. Logged at [`lore/colony-decisions/`](lore/colony-decisions/) before any spend is committed.

---

## Log

*(future entries are appended above the genesis entry below)*

---

### 2026-05-19 · Genesis Entry

**Status:** Treasury log initialised.

| Field | Value |
|---|---|
| CA deployed | `FjGZibcd8DBzxoL3H2srMayap1h7S5Q5NuPoaJcVpump` |
| Allocation policy | Locked at [`docs/tokenomics.md`](docs/tokenomics.md) (45 / 35 / 20) |
| First buyback cycle | Scheduled Sunday 2026-05-24, 22:00 UTC |
| First operations itemisation | End of first calendar month (2026-05-31) |
| Wallets | To be deployed and published in `docs/tokenomics.md` |

The colony deliberated the allocation policy, the Verifier accepted the verdict, and the policy was committed to the repository. The log starts here.

---

*Magnum Opus · MMXXVI*
