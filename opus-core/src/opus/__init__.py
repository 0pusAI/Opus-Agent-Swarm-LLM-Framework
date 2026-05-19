"""OPUS — Ars Magna. A bio-inspired multi-agent swarm for collective reasoning.

Public API — these are the surfaces stable enough to import directly.
For full documentation see `docs/api.md` at the repository root.

    from opus import Hive, LLMClient, Budget, AutogenesisLoop, Step

For everything else (Records, agent base classes, consensus internals,
provenance helpers) import from the submodules directly:

    from opus.blackboard import Record, RecordType
    from opus.consensus import borda_aggregate
    from opus.provenance import ProvenanceSummary
"""

__version__ = "0.2.0"

from .agents.base import Budget
from .autogenesis import AutogenesisLoop, Step
from .hive import Hive
from .introspection import Observation, RepoAnalyst, surface_bottlenecks
from .llm.client import LLMClient
from .llm.providers import (
    AnthropicProvider,
    CompletionResult,
    LLMProvider,
    MockProvider,
    OllamaProvider,
    OpenAIProvider,
    ProviderAPIError,
    ProviderConfigurationError,
    ProviderError,
    auto_provider,
)

__all__ = [
    "__version__",
    # Core
    "Hive",
    "LLMClient",
    "Budget",
    # Autogenesis
    "AutogenesisLoop",
    "Step",
    # Introspection
    "RepoAnalyst",
    "Observation",
    "surface_bottlenecks",
    # LLM providers (next-gen multi-backend)
    "LLMProvider",
    "CompletionResult",
    "AnthropicProvider",
    "OpenAIProvider",
    "OllamaProvider",
    "MockProvider",
    "auto_provider",
    "ProviderError",
    "ProviderConfigurationError",
    "ProviderAPIError",
]
