"""Smoke tests for the Hive — does not call the API.

Real end-to-end coverage is in examples/hello_swarm.py, which requires
ANTHROPIC_API_KEY.
"""

from __future__ import annotations

import pytest

from opus.agents.base import Budget
from opus.hive import Hive
from opus.llm.client import LLMClient


def test_hive_constructs():
    """Hive can be constructed with a stock LLMClient (no API call)."""
    llm = LLMClient(api_key="sk-ant-test-not-used")
    hive = Hive(llm=llm, n_scouts=3, n_researchers=2, n_critics=2, n_synthesisers=1)
    assert hive.n_scouts == 3
    assert hive.n_researchers == 2


def test_budget_defaults():
    b = Budget()
    assert b.max_agents == 16
    assert b.max_worker_rounds == 3
    assert b.max_total_usd is None


def test_budget_with_ceiling():
    b = Budget(max_total_usd=2.0)
    assert b.max_total_usd == 2.0


def test_llm_client_tracks_zero_spend_initially():
    llm = LLMClient(api_key="sk-ant-test-not-used", budget_usd=1.50)
    assert llm.spent_usd == 0.0
    assert llm.budget_remaining_usd == 1.50
    assert llm.is_budget_exhausted() is False


def test_llm_client_unbounded_budget():
    llm = LLMClient(api_key="sk-ant-test-not-used")
    assert llm.budget_remaining_usd is None
    assert llm.is_budget_exhausted() is False
