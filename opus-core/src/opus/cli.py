"""
opus.cli — typer entrypoint.

    opus query "<your question>"
    opus query "<your question>" --budget-usd 1.50
"""

from __future__ import annotations

import asyncio
import os
from pathlib import Path
from typing import Any

import typer
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel

from .agents.base import Budget
from .blackboard import RecordType
from .hive import Hive
from .llm.client import LLMClient

app = typer.Typer(
    help="OPUS — Ars Magna. A bio-inspired multi-agent swarm for collective reasoning.",
    no_args_is_help=True,
)
console = Console()


@app.command()
def query(
    prompt: str = typer.Argument(..., help="The question for the swarm."),
    budget_usd: float | None = typer.Option(None, "--budget-usd", "-b", help="Hard USD ceiling."),
    n_scouts: int = typer.Option(3, "--scouts"),
    n_researchers: int = typer.Option(2, "--researchers"),
    n_critics: int = typer.Option(2, "--critics"),
    n_synthesisers: int = typer.Option(1, "--synthesisers"),
    provenance_dir: Path = typer.Option(Path("provenance"), help="Where to write the JSONL trace."),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Print the full Record trace."),
) -> None:
    """Deliberate on a query. Writes a JSONL trace and prints answer + cost."""
    load_dotenv()
    if not os.environ.get("ANTHROPIC_API_KEY"):
        console.print(
            "[red]ANTHROPIC_API_KEY is not set.[/red] "
            "Copy .env.example → .env and paste your key."
        )
        raise typer.Exit(code=1)

    asyncio.run(_run_query(
        prompt=prompt,
        budget_usd=budget_usd,
        n_scouts=n_scouts,
        n_researchers=n_researchers,
        n_critics=n_critics,
        n_synthesisers=n_synthesisers,
        provenance_dir=provenance_dir,
        verbose=verbose,
    ))


async def _run_query(
    *,
    prompt: str,
    budget_usd: float | None,
    n_scouts: int,
    n_researchers: int,
    n_critics: int,
    n_synthesisers: int,
    provenance_dir: Path,
    verbose: bool,
) -> None:
    llm = LLMClient(budget_usd=budget_usd)
    try:
        hive = Hive(
            llm=llm,
            n_scouts=n_scouts,
            n_researchers=n_researchers,
            n_critics=n_critics,
            n_synthesisers=n_synthesisers,
            provenance_dir=provenance_dir,
        )
        budget = Budget(max_total_usd=budget_usd)

        console.print(Panel(
            f"[bold]{prompt}[/bold]",
            title="[cyan]OPUS — Query[/cyan]",
            border_style="cyan",
        ))

        with console.status("[cyan]Swarm deliberating...[/cyan]", spinner="dots"):
            result = await hive.run(prompt, budget=budget)

        console.print()
        console.print(Panel(
            _format_answer(result.answer),
            title=("[green]Answer (verified)[/green]" if result.accepted
                   else "[yellow]Answer (best remaining — not verified)[/yellow]"),
            border_style=("green" if result.accepted else "yellow"),
        ))

        console.print()
        console.print(f"[bold]Confidence:[/bold]    {result.confidence:.2f}")
        console.print(f"[bold]Cost:[/bold]          [green]${result.summary.total_cost_usd:.4f}[/green]")
        console.print(f"[bold]Wall time:[/bold]     {result.summary.wall_seconds:.1f}s")
        console.print(f"[bold]Records:[/bold]       {result.summary.total_records}")
        if result.provenance_path:
            console.print(f"[bold]Trace:[/bold]         {result.provenance_path}")

        if verbose:
            console.print()
            console.print("[bold]Trace:[/bold]")
            for r in result.blackboard.snapshot():
                if r.type == RecordType.PROVENANCE_SUMMARY:
                    continue
                body = (r.content if isinstance(r.content, str)
                        else (r.content.get("answer", str(r.content))
                              if isinstance(r.content, dict) else str(r.content)))
                short = (body[:160] + "…") if len(body) > 160 else body
                console.print(
                    f"  [dim]{r.timestamp.strftime('%H:%M:%S')}[/dim] "
                    f"[cyan]{r.agent_role.value:>12}/{r.agent_id:<28}[/cyan] "
                    f"[magenta]{r.type.value:<22}[/magenta] "
                    f"conf={r.confidence:.2f}  ${r.cost_estimate:.4f}\n"
                    f"      {short}"
                )
    finally:
        await llm.aclose()


def _format_answer(answer: Any) -> str:
    if isinstance(answer, dict):
        if "answer" in answer:
            limitations = answer.get("limitations")
            if limitations:
                return f"{answer['answer']}\n\n[dim]Limitations: {limitations}[/dim]"
            return str(answer["answer"])
        return str(answer)
    return str(answer)


if __name__ == "__main__":
    app()
