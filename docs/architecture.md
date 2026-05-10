# OPUS — Architecture

A deeper, engineer-facing companion to the [whitepaper](whitepaper.md). Where the whitepaper explains *why*, this document explains *how*.

---

## 1. Module map

```
opus-core/src/opus/
├── hive.py            ── Hive Core. Orchestrates one query end-to-end.
├── blackboard.py      ── Append-only Record store + subscribe API.
├── consensus.py       ── borda_aggregate · judge_adjudicate · verify
├── provenance.py      ── Cost ledger + DAG serialisation
├── agents/
│   ├── base.py        ── Agent abstract base class. The contract.
│   ├── scout.py       ── Scout: retrieval, sensing
│   ├── researcher.py  ── Researcher: hypothesis generation
│   ├── critic.py      ── Critic: targeted attack on Synthesis records
│   ├── synthesiser.py ── Synthesiser: integrate Records into a candidate
│   ├── planner.py     ── Planner: decompose into sub-tasks
│   ├── executor.py    ── Executor: tool-using action agent
│   ├── verifier.py    ── Verifier: attempt to falsify a candidate
│   └── judge.py       ── Judge: adjudicate near-ties
├── memory/
│   ├── vector.py      ── Qdrant wrapper (interface stub today)
│   └── graph.py       ── Neo4j wrapper (interface stub today)
├── llm/
│   └── client.py      ── Anthropic client. The only place API is called.
└── cli.py             ── `opus query "..."`
```

---

## 2. The Agent contract

```python
class Agent(abc.ABC):
    role: AgentRole               # enum
    model: str                    # claude-opus-4-7 | claude-sonnet-4-6
    system_prompt: str            # role-specific, cacheable

    @abc.abstractmethod
    async def think(
        self,
        task: Task,
        blackboard: Blackboard,
    ) -> Record:
        ...
```

Constraints, not suggestions:

- **No private channels.** An agent may not call another agent. The only output is a single Record appended to the Blackboard.
- **No global mutable state.** All state for a query lives on the Blackboard. Agents may use long-term memory (vector / graph) read-only during cognition; writes go through the Hive.
- **One Record per `think()`.** If the agent has nothing to add, it returns a Record of type `noop` with a reason.
- **Bounded cost.** The agent receives a `budget` field on the Task and must respect it; the LLM client also enforces it as a hard ceiling.

---

## 3. Blackboard semantics

### 3.1  Operations

```python
class Blackboard:
    async def append(self, record: Record) -> None: ...
    async def read(
        self,
        *,
        types: list[RecordType] | None = None,
        roles: list[AgentRole] | None = None,
        since: datetime | None = None,
    ) -> list[Record]: ...
    async def subscribe(self) -> AsyncIterator[Record]: ...
```

`append` is the only mutation. `read` is a snapshot at call time. `subscribe` is a fire-and-forget stream for agents that want to react in real time (post-v0; not used in the first lifecycle).

### 3.2  Causality

`Record.parent_ids` forms a DAG over the entire deliberation. Every `synthesis` Record names every `observation`, `hypothesis`, and `critique` Record it reasoned from. The DAG is serialised at end-of-run to `provenance/<query_uuid>.jsonl`.

### 3.3  Concurrency model

Optimistic. Append never conflicts because the Blackboard's underlying structure is a list with monotonic IDs. Readers see a consistent snapshot at the moment of `read()`. There is no transaction boundary; agents that need a settled view of the world should `read()` once at the start of `think()` and reason over that snapshot.

---

## 4. Consensus internals

```python
def borda_aggregate(
    rankings: list[Ranking],
    weights: dict[AgentRole, float],
) -> list[ScoredCandidate]: ...

def judge_adjudicate(
    top_candidates: list[ScoredCandidate],
    trace: list[Record],
    judge: JudgeAgent,
) -> ScoredCandidate: ...

async def verify(
    candidate: ScoredCandidate,
    blackboard: Blackboard,
    verifier: VerifierAgent,
) -> Verdict: ...
```

Three pure-ish functions (`verify` is async because it calls an LLM). Each is independently unit-testable. `borda_aggregate` has no I/O at all and is the foundation of our test suite.

### 4.1  When the Judge fires

Only when the top two candidates' aggregate Borda scores are within ε = 5%. Below that threshold, Borda alone wins. Above it, the Judge always runs. This keeps Judge cost bounded — it fires on close calls, not every query.

### 4.2  Falsification loop

```python
for attempt in range(MAX_VERIFY_ATTEMPTS):  # = 3
    candidate = await pick_candidate(blackboard)
    verdict = await verify(candidate, blackboard, verifier)
    if verdict.accepted:
        return candidate
    blackboard.append(verdict.falsification_record)
    await deliberate_round(workers, blackboard)
return best_remaining(blackboard)  # surfaced with explicit unresolved falsifications
```

The colony does not lie about its certainty. If the third attempt is still falsified, the user sees the falsifications attached to the answer.

---

## 5. Hive lifecycle

```python
async def run(self, query: str, budget: Budget) -> RunResult:
    bb = Blackboard()
    bb.append(self._task_record(query))

    await self._spawn_scouts(bb, budget)              # parallel
    for round_idx in range(self.max_worker_rounds):   # default 1
        await self._spawn_workers(bb, budget, round_idx)
        candidate = await self._consensus(bb)
        verdict = await verify(candidate, bb, self.verifier)
        if verdict.accepted:
            break
        bb.append(verdict.falsification_record)
    else:
        candidate = best_remaining(bb)

    summary = self.provenance.summarise(bb, started_at=self.t0)
    bb.append(summary)
    return RunResult(answer=candidate, blackboard=bb, summary=summary)
```

This is intentionally linear and easy to read. Optimisations (parallel rounds, partial early termination, streaming candidates) are explicit Phase β work — they belong only after the lifecycle has been measured.

---

## 6. Failure modes & mitigations

| Failure                                | Mitigation                                                  |
|----------------------------------------|-------------------------------------------------------------|
| LLM provider 5xx / rate limit          | Retry with exponential backoff in `llm/client.py`           |
| Agent returns malformed Record         | Pydantic validation rejects; Hive logs and skips the agent  |
| All candidates falsified after 3 tries | Surface answer with attached falsifications, mark confidence|
| Budget exhausted mid-round             | Hive emits `budget_exhausted` Record; consensus runs anyway |
| Network loss to Anthropic              | Run aborts cleanly; partial Blackboard saved to provenance/ |

---

## 7. Extension points

These are deliberately the only seams in v0; they are where future work will land.

1. **`Blackboard` backend** — interface allows in-memory (today), Redis Streams (planned), or CRDT-based store (later).
2. **`memory/*`** — vector + graph wrappers are stubs. Concrete adapters slot in without touching agent code.
3. **`agents/*`** — adding a new role means subclassing `Agent` and registering it in the Hive's role catalogue.
4. **`llm/client.py`** — switching providers (OpenAI, Google, local) is a single-file change. Cost accounting lives here.

Everything else is implementation detail and may be refactored freely.

---

*Magnum Opus · MMXXVI*
