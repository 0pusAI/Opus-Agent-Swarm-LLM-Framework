---
name: Bug report
about: Something is broken or behaves unexpectedly in OPUS
title: '[bug] '
labels: bug
---

## Description

A clear, concise description of what the bug is.

## To reproduce

1. ...
2. ...
3. ...

## Expected behaviour

What did you expect to happen?

## Actual behaviour

What actually happened? Include the full error message and stack trace if applicable.

## Environment

- OS: (e.g. macOS 15.0, Ubuntu 24.04, Windows 11)
- Python: (`python --version`)
- Node: (`node --version`)
- OPUS commit: (`git rev-parse --short HEAD`)
- Anthropic SDK version: (`uv pip show anthropic | grep Version`)

## Provenance trace

If this is a swarm-output issue, attach the JSONL trace from `opus-core/provenance/<query_uuid>.jsonl` (redact any sensitive content first).

## Additional context

Logs, screenshots, or related issues.
