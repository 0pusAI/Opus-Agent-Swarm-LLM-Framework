## What

Briefly describe what this PR changes.

## Why

What problem does this solve? Link any relevant issues with `Closes #N`.

## How

High-level description of the implementation approach.

## Testing

- [ ] `pytest` passes (`cd opus-core && uv run pytest`)
- [ ] `npm run build` succeeds (`cd opus-web && npm run build`)
- [ ] Manual smoke test of changed behaviour
- [ ] Agent prompt changes: validated against the canonical consciousness query in `examples/hello_swarm.py`; trace attached if useful

## Screenshots / traces

If this changes the website, include before/after screenshots. If it changes agent behaviour, include a relevant excerpt of the provenance trace.

## Checklist

- [ ] Code follows project style (ruff + mypy for Python, ESLint for TS)
- [ ] Documentation updated (`docs/`, `README.md`) if behaviour changed
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] Commit message follows the format in [CONTRIBUTING.md](CONTRIBUTING.md)
