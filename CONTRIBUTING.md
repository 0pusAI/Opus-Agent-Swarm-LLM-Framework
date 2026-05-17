# Contributing to OPUS

Thanks for considering a contribution to OPUS — the open-source bio-inspired multi-agent swarm architecture for collective reasoning.

## What we welcome

- **Agent prompt iterations** — the system prompts in `opus-core/src/opus/agents/*.py` are v0 and want careful hand-crafting against real Anthropic API output. PRs that demonstrably improve answer quality on a held-out query set are very welcome.
- **New backends** — Redis Streams for the Blackboard, Qdrant for vector memory, Neo4j for graph memory. The interfaces are stubbed already.
- **Documentation improvements** — clarity in the whitepaper, architecture, glossary, or lineage essay.
- **Bug fixes** — anywhere.
- **New agent roles** — propose them via an issue first so we can discuss fit.
- **Performance work** — prompt caching, parallelism, cost reduction.

## What we are NOT building (yet)

See [docs/whitepaper.md](docs/whitepaper.md) §8 — no auth, no payments, no virtual currencies, no Docker, no marketplace, no governance. These belong to Phase β and beyond. Please don't open PRs for them without first opening an issue to discuss.

## Setup

### `opus-core` (Python 3.11+)

```bash
cd opus-core
uv venv
uv pip install -e ".[dev]"
cp .env.example .env  # paste your ANTHROPIC_API_KEY
pytest                # 18/18 should pass
```

### `opus-web` (Node 20+)

```bash
cd opus-web
npm install
npm run dev
# open http://localhost:3000
```

## Code style

- **Python** — `ruff` + `mypy --strict` (`pyproject.toml` already configured). Run before committing:
  ```bash
  cd opus-core
  uv run ruff check .
  uv run mypy src
  uv run pytest
  ```
- **TypeScript** — ESLint via Next.js defaults. Run `npm run lint && npm run build` in `opus-web/`.

## Commit message format

Plain English, present tense, with the affected component prefix when relevant.

Examples:
```
opus-core: refine Critic prompt to reduce false-positive critique
opus-web: fix mobile fallback for Three.js sphere
docs: clarify Borda role weights in whitepaper §4.1
```

When co-authoring, include `Co-Authored-By:` trailers.

## Pull-request checklist

- [ ] Unit tests pass (`pytest` for `opus-core`, `npm run build` for `opus-web`)
- [ ] No regressions in agent answer quality on the canonical question in `examples/hello_swarm.py`
- [ ] `docs/` updated if behaviour changed
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] Commit message follows the format above

## Windows / line-endings

Git for Windows will warn `LF will be replaced by CRLF` on first commit — this is normal. The `.gitattributes` (if any) handles it on push; nothing is broken. If you hit a `npm.ps1 cannot be loaded because running scripts is disabled` error, run `npm` commands through `cmd.exe` or `bash`, not PowerShell.

## Security

If you discover a security issue, please follow [SECURITY.md](SECURITY.md). Do **not** open a public issue.

## Code of Conduct

By participating in this project you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree your contributions will be licensed under the same MIT license as the project. See [LICENSE](LICENSE).

---

*Magnum Opus · MMXXVI*
