"""
examples/using_ollama.py

Run the OPUS swarm entirely on your local machine via Ollama.
No API key, no per-token cost, no rate limit, no network leaks.

Requires:

    # 1. Install Ollama:    https://ollama.com
    # 2. Pull at least one model:
    ollama pull llama3.3
    # (or qwen2.5:14b, mistral-small, phi3.5, etc.)
    # 3. Make sure Ollama is running:
    ollama serve   # usually starts automatically on macOS / Linux

Usage:

    cd opus-core
    uv pip install -e ".[dev]"
    uv run python examples/using_ollama.py

Cost: $0.00 per query. Forever.
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from dotenv import load_dotenv  # noqa: E402
from rich.console import Console  # noqa: E402
from rich.panel import Panel  # noqa: E402

from opus.agents.base import Budget  # noqa: E402
from opus.hive import Hive  # noqa: E402
from opus.llm.client import LLMClient  # noqa: E402
from opus.llm.providers import OllamaProvider  # noqa: E402

# Override per-role models if your hardware can handle bigger ones.
# The defaults below come from OllamaProvider.default_models.


async def main() -> None:
    load_dotenv()

    console = Console()
    console.print(Panel(
        "[bold cyan]OPUS swarm on local Ollama[/bold cyan]\n\n"
        "The full nine-agent colony, running entirely on your machine. "
        "No API key. No bill. No network leaves.",
        title="Local OPUS",
        border_style="cyan",
    ))

    provider = OllamaProvider()  # defaults to http://localhost:11434
    llm = LLMClient(provider=provider)
    # Override defaults if you have a beefier model pulled:
    #   default_worker_model="qwen2.5:32b",
    #   default_scout_model="llama3.2",

    try:
        hive = Hive(
            llm=llm,
            # Local runs are slower per call than the API providers —
            # default round counts and agent counts are fine but you may
            # want to reduce for development iteration.
        )
        result = await hive.run(
            "What is the cleanest pattern for streaming server-sent events "
            "from a Python async generator to a browser?",
            budget=Budget(),  # no dollar cap — local is free
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
        f"[bold]Cost:[/bold]      [green]${result.summary.total_cost_usd:.4f}[/green]  "
        f"[dim](local Ollama — always free)[/dim]\n"
        f"[bold]Wall:[/bold]      {result.summary.wall_seconds:.1f}s"
    )


if __name__ == "__main__":
    asyncio.run(main())
