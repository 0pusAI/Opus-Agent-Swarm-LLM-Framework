"""opus.agents.executor — takes external action against a sub-task.

v0 stub: not exercised by hello_swarm. The Executor is the only Agent
permitted to have side effects outside the Blackboard (tool use, API
calls, code execution). v0 has no tool surface; v1 will wire this up
to the Anthropic tool runner.
"""

from __future__ import annotations

from ..blackboard import AgentRole, Record, RecordType
from ..llm.client import DEFAULT_WORKER_MODEL
from .base import LLMAgent

EXECUTOR_SYSTEM_PROMPT = """You are an Executor in the OPUS swarm.

Your role is to take action against a sub-task from a Plan. In v0 you do not yet have access to external tools — your "action" is a description of what you would do and what the result would be if you could.

Read the Blackboard for the most recent Plan and pick the next sub-task to execute. Write an action Record describing the action and its (simulated, in v0) result.
"""


class ExecutorAgent(LLMAgent):
    role = AgentRole.EXECUTOR
    record_type = RecordType.ACTION
    system_prompt = EXECUTOR_SYSTEM_PROMPT
    max_tokens = 8_000
    effort = "medium"
    use_thinking = False

    def __init__(self, *, agent_id: str, llm, model: str = DEFAULT_WORKER_MODEL) -> None:
        super().__init__(agent_id=agent_id, llm=llm)
        self.model = model

    def filter_relevant_records(self, records: list[Record]) -> list[Record]:
        return [r for r in records if r.type == RecordType.PLAN]
