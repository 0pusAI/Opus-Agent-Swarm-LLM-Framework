"""
opus.llm.client

The single Anthropic API surface for OPUS. Every LLM call in the
swarm goes through this module — it owns cost accounting, prompt
caching, retries (SDK default), and budget tracking.

Centralising buys us:
  - One place to log token usage and dollar cost.
  - One place to enforce per-query budget ceilings.
  - One place to swap providers if we ever need to.

Opus 4.7 specifics enforced here:
  - Adaptive thinking only (budget_tokens would 400).
  - No sampling parameters (temperature / top_p / top_k would 400).
  - Always stream (avoids SDK HTTP timeouts on large max_tokens).
  - thinking.display = "summarized" to keep reasoning text in the
    response (default is "omitted" on 4.7).
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Any

from anthropic import AsyncAnthropic

from ..provenance import TokenUsage, estimate_cost_usd

DEFAULT_WORKER_MODEL = "claude-opus-4-7"
DEFAULT_SCOUT_MODEL = "claude-sonnet-4-6"
DEFAULT_JUDGE_MODEL = "claude-opus-4-7"
DEFAULT_VERIFIER_MODEL = "claude-opus-4-7"

# Adaptive is the only on-mode for Opus 4.7. "summarized" surfaces the
# reasoning text so it lands on the Blackboard provenance trail.
DEFAULT_THINKING: dict[str, str] = {"type": "adaptive", "display": "summarized"}


@dataclass(frozen=True)
class CompletionResult:
    """One LLM call's worth of output, accounting included."""

    text: str
    thinking: str | None
    model: str
    usage: TokenUsage
    cost_usd: float
    stop_reason: str | None


class LLMClient:
    """Async Anthropic wrapper. The only place the API is touched."""

    def __init__(
        self,
        *,
        api_key: str | None = None,
        default_worker_model: str = DEFAULT_WORKER_MODEL,
        default_scout_model: str = DEFAULT_SCOUT_MODEL,
        default_judge_model: str = DEFAULT_JUDGE_MODEL,
        default_verifier_model: str = DEFAULT_VERIFIER_MODEL,
        budget_usd: float | None = None,
    ) -> None:
        # SDK reads ANTHROPIC_API_KEY from env when api_key is None.
        self._client = AsyncAnthropic(api_key=api_key)
        self.default_worker_model = default_worker_model
        self.default_scout_model = default_scout_model
        self.default_judge_model = default_judge_model
        self.default_verifier_model = default_verifier_model
        self._budget_usd = budget_usd
        self._spent_usd = 0.0
        self._lock = asyncio.Lock()

    @property
    def spent_usd(self) -> float:
        return self._spent_usd

    @property
    def budget_remaining_usd(self) -> float | None:
        if self._budget_usd is None:
            return None
        return max(0.0, self._budget_usd - self._spent_usd)

    def is_budget_exhausted(self) -> bool:
        return self._budget_usd is not None and self._spent_usd >= self._budget_usd

    async def complete(
        self,
        *,
        system: str,
        user: str,
        model: str | None = None,
        max_tokens: int = 16_000,
        thinking: bool = True,
        effort: str = "high",
        cache_system: bool = True,
    ) -> CompletionResult:
        """One Claude completion. Always streams. Always tracks cost.

        Notes:
          - We always stream (`messages.stream` + `get_final_message`)
            because Opus 4.7 outputs can be long enough to exceed the
            SDK's non-streaming HTTP timeout.
          - System prompt is wrapped in a list with `cache_control` when
            `cache_system=True`. Caching only kicks in if the prefix
            exceeds the model's minimum (4096 tok on Opus 4.7) — silent
            no-op below that. See shared/prompt-caching.md.
        """
        model = model or self.default_worker_model

        request_kwargs: dict[str, Any] = {
            "model": model,
            "max_tokens": max_tokens,
            "system": _build_system(system, cache=cache_system),
            "messages": [{"role": "user", "content": user}],
            "output_config": {"effort": effort},
        }
        if thinking:
            request_kwargs["thinking"] = DEFAULT_THINKING

        async with self._client.messages.stream(**request_kwargs) as stream:
            message = await stream.get_final_message()

        text = "".join(b.text for b in message.content if b.type == "text")
        thinking_text = "\n".join(
            b.thinking for b in message.content
            if b.type == "thinking" and getattr(b, "thinking", None)
        ) or None

        usage = TokenUsage(
            input_tokens=message.usage.input_tokens,
            output_tokens=message.usage.output_tokens,
            cache_creation_tokens=getattr(message.usage, "cache_creation_input_tokens", 0) or 0,
            cache_read_tokens=getattr(message.usage, "cache_read_input_tokens", 0) or 0,
        )
        cost = estimate_cost_usd(model, usage)

        async with self._lock:
            self._spent_usd += cost

        return CompletionResult(
            text=text,
            thinking=thinking_text,
            model=model,
            usage=usage,
            cost_usd=cost,
            stop_reason=message.stop_reason,
        )

    async def aclose(self) -> None:
        await self._client.close()


def _build_system(text: str, *, cache: bool) -> list[dict[str, Any]] | str:
    """Wrap system text with cache_control when caching is on.

    Caching is a strict prefix match — putting the marker on the system
    text caches tools+system together, so every agent call against the
    same role prompt reads from cache after the first.
    """
    if not cache:
        return text
    return [{"type": "text", "text": text, "cache_control": {"type": "ephemeral"}}]
