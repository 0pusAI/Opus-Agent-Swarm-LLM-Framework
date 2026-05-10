"""
opus.memory.graph

Neo4j client wrapper. v0 stub — interface only.

Same rationale as vector.py: the seam exists so swarm code can import
the interface; concrete backend lands in Phase β.
"""

from __future__ import annotations

import abc
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class GraphTriple:
    subject: str
    predicate: str
    obj: str
    properties: dict[str, Any]


class GraphMemory(abc.ABC):
    @abc.abstractmethod
    async def upsert_triple(self, triple: GraphTriple) -> None: ...

    @abc.abstractmethod
    async def neighbours(self, *, subject: str, predicate: str | None = None) -> list[GraphTriple]: ...


class NullGraphMemory(GraphMemory):
    """v0 default: no-op."""

    async def upsert_triple(self, triple: GraphTriple) -> None:
        return None

    async def neighbours(self, *, subject: str, predicate: str | None = None) -> list[GraphTriple]:
        return []
