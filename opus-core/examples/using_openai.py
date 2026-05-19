"""
examples/using_openai.py

Run the OPUS swarm on OpenAI (or any OpenAI-compatible gateway:
groq, together, fireworks, openrouter, vLLM, litellm-proxy, etc.).

Requires:

    OPENAI_API_KEY=sk-...
    # Optional, to point at a non-default endpoint:
    # OPENAI_BASE_URL=https://your-gateway/v1

Usage:

    cd opus-core
    uv pip install -e ".[dev]"
    OPENAI_API_KEY=sk-... uv run python examples/using_openai.py
"""

from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from dotenv import load_dotenv  # noqa: E402
from rich.console import Console  # noqa: E402
from rich.panel import Panel  # noqa: E402

from opus.agents.base import Budget  # noqa: E402
from opus.hive import Hive  # noqa: E402
from opus.llm.client import LLMClient  # noqa: E402
from opus.llm.providers import OpenAIProvider  # noqa: E402


async def main() -> None:
    load_dotenv()
    if not os.environ.get("OPENAI_API_KEY"):
        print("ERROR: OPENAI_API_KEY is not set.")
        sys.exit(1)

    console = Console()
    console.print(Panel(
        "[bold cyan]OPUS swarm on OpenAI[/bold cyan]\n\n"
        "The same colony, the same architecture, the same nine agents — "
        "now reasoning through OpenAI instead of Anthropic.",
        title="Multi-provider OPUS",
        border_style="cyan",
    ))

    provider = OpenAIProvider()
    llm = LLMClient(provider=provider)
    # Per-role defaults come automatically from the provider:
    #   worker  = gpt-4o
    #   scout   = gpt-4o-mini
    #   judge   = o1-mini
    #   verifier = gpt-4o
    # Override any of them via LLMClient(default_worker_model="gpt-4.1", ...)

    try:
        hive = Hive(llm=llm)
        result = await hive.run(
            "What is the cleanest pattern for streaming server-sent events "
            "from a Python async generator to a browser?",
            budget=Budget(max_cost_usd=1.00),
        )
    finally:
        await llm.aclose()

    console.print()
    console.print(Panel(
        str(result.answer),
        title=("[green]Verified[/green]" if result.accepted else "[yellow]Surfaced[/yellow]"),
        border_style=("green" if result.accepted else "yellow"),
    ))
    console.print(
        f"[bold]Provider:[/bold]  [cyan]{llm.provider_name}[/cyan]\n"
        f"[bold]Cost:[/bold]      [green]${result.summary.total_cost_usd:.4f}[/green]\n"
        f"[bold]Wall:[/bold]      {result.summary.wall_seconds:.1f}s"
    )


if __name__ == "__main__":
    asyncio.run(main())
