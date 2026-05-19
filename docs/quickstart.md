# OPUS — Quickstart

> Zero to a running colony in under five minutes.

This is the fastest, friendliest path to using OPUS yourself, written for someone who has not used Python before today. It works on Windows (PowerShell), macOS, and Linux. You need three things to begin: Python, git, and an Anthropic API key.

The colony itself decided this guide was the next thing missing. Now it exists.

---

## What you need (one-time setup)

### 1. Python 3.11 or newer

Open a terminal and check:

```powershell
python --version
```

If you do not have it:

* **Windows (PowerShell):** `winget install Python.Python.3.12`
* **macOS:** `brew install python@3.12`
* **Linux:** use your distribution's package manager (`apt`, `dnf`, `pacman`, etc.)

### 2. Git

```powershell
git --version
```

If you do not have it:

* **Windows:** `winget install Git.Git`
* **macOS:** usually preinstalled, or `brew install git`
* **Linux:** `apt install git` or equivalent

### 3. An Anthropic API key

Get one from [console.anthropic.com](https://console.anthropic.com). The account needs credit on it. Expect about $0.50 to $2.00 per query depending on response length and how many verification rounds the colony triggers.

That is everything. Three things, one time.

---

## Install (Windows PowerShell)

Open PowerShell and run these one block at a time:

```powershell
# 1. Clone the repository
git clone https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework
cd Opus-Agent-Swarm-LLM-Framework\opus-core

# 2. Install uv (the fast Python package manager OPUS uses)
winget install astral-sh.uv

# 3. Create a virtual environment and install the colony into it
uv venv
uv pip install -e ".[dev]"

# 4. Set your Anthropic API key
Copy-Item .env.example .env
notepad .env
```

Notepad will open. Find the line that says `ANTHROPIC_API_KEY=` and paste your key right after the equals sign, with no spaces and no quotes. Save and close.

You are installed.

## Install (macOS / Linux)

```bash
git clone https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework
cd Opus-Agent-Swarm-LLM-Framework/opus-core

# Install uv if you do not already have it
curl -LsSf https://astral.sh/uv/install.sh | sh

uv venv
uv pip install -e ".[dev]"

cp .env.example .env
nano .env       # paste your ANTHROPIC_API_KEY, save, exit
```

---

## Run your first query

Still in the `opus-core` directory:

```powershell
uv run opus query "What are the strongest arguments against my own thesis?"
```

### Or boot the local web UI in one command

The friendliest way to use OPUS is in your browser. Install the `[serve]` extra once and run `opus serve`:

```powershell
uv pip install -e ".[serve]"           # adds fastapi + uvicorn
uv run opus serve                       # boots http://127.0.0.1:8000
```

The OPUS UI opens in your default browser. Type a question, watch the swarm deliberate live, get back a verified verdict with cost and provenance. No coding required.

```powershell
uv run opus serve --provider ollama     # use local Ollama (free, no key)
uv run opus serve --provider openai     # use OpenAI
uv run opus serve --port 9000 --no-browser
```

The colony wakes. You will see Scouts gather context, Workers argue across the Blackboard, the Verifier attempt to break the chosen answer. After roughly 30 to 90 seconds you get back three things:

1. The colony's **answer** (verified, or surfaced with unresolved falsifications labelled honestly)
2. The total **cost** of the run, in honest US dollars
3. The path to the full **provenance trace** (a JSONL file with every Record, every parent\_id, every model call, every cent)

That is the entire interaction. Ask the colony anything you would otherwise have to think hard about alone, and a verdict comes back with its receipt.

---

## Use it from Python

The CLI is a thin wrapper around the library. For anything beyond simple queries you will want the library directly.

Create a file called `my_query.py` in any directory:

```python
import asyncio
from opus import Hive, LLMClient, Budget

async def main():
    llm = LLMClient()
    try:
        hive = Hive(llm=llm)
        result = await hive.run(
            "What is the cleanest refactor for the function below?",
            budget=Budget(max_cost_usd=0.50),
        )
        print(result.answer)
        print(f"\nCost: ${result.summary.total_cost_usd:.4f}")
        print(f"Trace: {result.provenance_path}")
    finally:
        await llm.aclose()

asyncio.run(main())
```

Run it from the `opus-core` directory:

```powershell
uv run python my_query.py
```

You now have a programmable colony.

---

## Use the autogenesis loop

The same pattern OPUS uses to ship its own updates. Hand the colony a goal instead of a question and let it work on it autonomously.

```python
import asyncio
from opus import Hive, LLMClient, AutogenesisLoop

async def main():
    llm = LLMClient()
    try:
        hive = Hive(llm=llm)
        loop = AutogenesisLoop(
            hive=hive,
            goal="Improve the README of this repository for first-time users.",
        )

        async def apply(step):
            print(f"\n[Iteration {step.iteration}] verified={step.verified}")
            print(f"  Plan:    {step.plan_answer[:120]}")
            print(f"  Change:  {step.change_answer[:120]}")
            print(f"  Cost:    ${step.total_cost_usd:.4f}")
            # This is where you decide what to do with the verified change.
            # Open a PR. Write to a file. Drop it in Slack. Anything.

        await loop.run(max_iterations=3, commit_handler=apply)
    finally:
        await llm.aclose()

asyncio.run(main())
```

A complete runnable version of this is bundled at `examples/autogenesis_demo.py`:

```powershell
uv run python examples/autogenesis_demo.py
```

Watch the colony decide what to work on, implement it, verify it, and hand each verified step back to your callback. That is autogenesis.

---

## Common issues

**`ANTHROPIC_API_KEY is not set`.** Your `.env` file is not being read or has a typo. Make sure you are in the `opus-core` directory when you run the command, that the file is named exactly `.env` (no extension), and that the line reads `ANTHROPIC_API_KEY=sk-ant-...` with no spaces or quotes.

**PowerShell refuses to run scripts.** Windows blocks running PS1 scripts by default. The `uv run` path used above avoids this entirely. If you prefer activating the venv manually, run `Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process` once in your current session, then `.\.venv\Scripts\Activate.ps1`.

**Rate-limit errors.** Anthropic rate-limits new accounts more aggressively. If you hit a `429` from the API, either wait a minute and retry, or upgrade your usage tier in the Anthropic console.

**`opus: command not found`.** You are probably in the wrong directory, or you tried to run it without `uv run` (which auto-activates the venv). Use `uv run opus query "..."` from inside the `opus-core` directory and it will always work.

**The tests pass but the examples fail.** The 18 unit tests in `tests/` are pure and do not call the live Anthropic API. The two scripts in `examples/` *do* call the live API and need a key with credit. If `pytest` passes but `examples/hello_swarm.py` fails, the install is fine; you just need to check your API key and account credit.

---

## Where to go next

* **[docs/api.md](api.md)** — the full API reference (`Hive`, `LLMClient`, `Budget`, `RunResult`, `AutogenesisLoop`, `Step`).
* **[docs/whitepaper.md](whitepaper.md)** — the full architecture and motivation.
* **[docs/architecture.md](architecture.md)** — the engineering reference, file by file.
* **[examples/hello\_swarm.py](../opus-core/examples/hello_swarm.py)** — the smallest working example.
* **[examples/autogenesis\_demo.py](../opus-core/examples/autogenesis_demo.py)** — the autonomous-mode demo, end to end.
* **[tryopusai.com](https://www.tryopusai.com)** — the live site, the build log, the doctrine.

---

The colony is open. The architecture is yours. The future is plural.

*Magnum Opus · MMXXVI*
