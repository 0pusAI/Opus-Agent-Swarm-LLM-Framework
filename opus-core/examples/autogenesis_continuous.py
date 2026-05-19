"""
examples/autogenesis_continuous.py

The full autogenesis loop, end-to-end:

  1. The colony scans its own repository (`RepoAnalyst`).
  2. The colony deliberates which gaps are the highest-conviction
     next moves (`surface_bottlenecks`).
  3. The colony enters an `AutogenesisLoop` against that verdict
     as the goal — deciding, implementing, verifying each step.
  4. Each verified step lands in a commit_handler the user controls
     (here: writes a JSON record to disk; in production: opens a PR).

This is the script that makes the autogenesis doctrine concrete.
Point it at any repository, give it credit on the Anthropic key,
and watch the colony work on its own codebase.

Usage:

    cd opus-core
    cp .env.example .env       # paste your ANTHROPIC_API_KEY
    uv pip install -e ".[dev]"
    uv run python examples/autogenesis_continuous.py

Cost: roughly $2-$6 for one full cycle (one scan deliberation +
two autogenesis iterations). Default below is two iterations.
"""

from __future__ import annotations

import asyncio
import json
import os
import sys
import time
from pathlib import Path

# Allow running without an install from inside opus-core.
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from dotenv import load_dotenv  # noqa: E402
from rich.console import Console  # noqa: E402
from rich.panel import Panel  # noqa: E402
from rich.rule import Rule  # noqa: E402
from rich.table import Table  # noqa: E402

from opus.autogenesis import AutogenesisLoop, Step  # noqa: E402
from opus.hive import Hive  # noqa: E402
from opus.introspection import RepoAnalyst, surface_bottlenecks  # noqa: E402
from opus.llm.client import LLMClient  # noqa: E402


# Point this at any repository you want the colony to work on.
# Default is the OPUS repo itself — fully autogenetic.
REPO_ROOT = Path(__file__).resolve().parents[2]
MAX_AUTOGENESIS_ITERATIONS = 2
OUTPUT_DIR = REPO_ROOT / ".autogenesis-output"


async def main() -> None:
    load_dotenv()
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("ERROR: ANTHROPIC_API_KEY is not set.")
        print("Copy .env.example to .env and paste your key.")
        sys.exit(1)

    console = Console()
    console.print(Panel(
        f"[bold cyan]OPUS — continuous autogenesis[/bold cyan]\n\n"
        f"[bold]Repository:[/bold] {REPO_ROOT}\n"
        f"[bold]Max iterations:[/bold] {MAX_AUTOGENESIS_ITERATIONS}\n"
        f"[bold]Output:[/bold]      {OUTPUT_DIR}",
        title="The colony is about to work on itself",
        border_style="cyan",
    ))

    # ── 1. Scan the repository ──────────────────────────────────
    console.print()
    console.print(Rule("Step 1 — scan", style="cyan"))

    analyst = RepoAnalyst(repo_root=REPO_ROOT)
    t0 = time.time()
    observations = analyst.scan()
    elapsed = time.time() - t0

    by_kind: dict[str, int] = {}
    for o in observations:
        by_kind[o.kind] = by_kind.get(o.kind, 0) + 1

    table = Table(show_header=True, header_style="bold")
    table.add_column("Kind")
    table.add_column("Count", justify="right")
    for kind, count in sorted(by_kind.items()):
        table.add_row(kind, str(count))
    console.print(table)
    console.print(
        f"[dim]Scanned in {elapsed:.2f}s. "
        f"Top 5 observations follow.[/dim]"
    )
    for o in observations[:5]:
        console.print(f"  [yellow]→[/yellow] {o.as_line()}")

    # ── 2. Surface bottlenecks ──────────────────────────────────
    console.print()
    console.print(Rule("Step 2 — surface bottlenecks", style="cyan"))

    llm = LLMClient()
    try:
        hive = Hive(llm=llm)

        console.print("[dim]Colony deliberating which observations matter most...[/dim]")
        verdict = await surface_bottlenecks(hive, observations, n=3)
        console.print(Panel(
            str(verdict.answer),
            title="[bold]Colony verdict — top 3 next moves[/bold]",
            border_style="green" if verdict.accepted else "yellow",
        ))
        console.print(
            f"[dim]Surface cost: ${verdict.summary.total_cost_usd:.4f}[/dim]"
        )

        # ── 3. Enter autogenesis loop with the verdict as the goal ──
        console.print()
        console.print(Rule("Step 3 — autogenesis loop", style="cyan"))

        # We extract a clean goal sentence from the verdict.
        goal = (
            "Address the top bottlenecks the colony just surfaced:\n\n"
            f"{verdict.answer}"
        )

        loop = AutogenesisLoop(hive=hive, goal=goal)

        OUTPUT_DIR.mkdir(exist_ok=True)

        async def commit_handler(step: Step) -> None:
            # In production this is where you open a PR, write to a
            # file, push to a queue, etc. Here we write a JSON record
            # to disk so the run leaves a verifiable trail.
            out = OUTPUT_DIR / f"step-{step.iteration:03d}.json"
            out.write_text(json.dumps({
                "iteration": step.iteration,
                "goal": step.goal,
                "plan": step.plan_answer,
                "change": step.change_answer,
                "verified": step.verified,
                "limitations": step.limitations,
                "cost_usd": step.total_cost_usd,
            }, indent=2))
            console.print()
            console.print(Rule(
                f"Iteration {step.iteration} — "
                + ("verified ✓" if step.verified else "unverified"),
                style="green" if step.verified else "yellow",
            ))
            console.print(f"  [bold]Plan:[/bold]   {step.plan_answer[:140]}")
            console.print(f"  [bold]Change:[/bold] {step.change_answer[:140]}")
            console.print(
                f"  [dim]Cost: ${step.total_cost_usd:.4f}  ·  "
                f"wrote {out.relative_to(REPO_ROOT)}[/dim]"
            )

        steps = await loop.run(
            max_iterations=MAX_AUTOGENESIS_ITERATIONS,
            commit_handler=commit_handler,
            cooldown_seconds=1.0,
        )
    finally:
        await llm.aclose()

    # ── 4. Summary ──────────────────────────────────────────────
    console.print()
    console.print(Rule("Run summary", style="cyan"))
    total = verdict.summary.total_cost_usd + sum(s.total_cost_usd for s in steps)
    verified = sum(1 for s in steps if s.verified)
    console.print(
        f"  [bold]Observations scanned:[/bold] {len(observations)}\n"
        f"  [bold]Bottlenecks surfaced:[/bold] 3\n"
        f"  [bold]Iterations:[/bold]           {len(steps)}\n"
        f"  [bold]Verified:[/bold]             {verified}/{len(steps)}\n"
        f"  [bold]Total cost:[/bold]           [green]${total:.4f}[/green]\n"
        f"  [bold]Output:[/bold]               {OUTPUT_DIR}"
    )


if __name__ == "__main__":
    asyncio.run(main())
