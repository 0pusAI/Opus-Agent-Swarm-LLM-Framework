# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in OPUS, **please do not open a public issue**. Use one of the private channels below instead.

### Preferred

Open a private security advisory through GitHub:
<https://github.com/0pusAI/Opus-Agent-Swarm-LLM-Framework/security/advisories/new>

This creates a private conversation with the maintainers and is the fastest, most-trackable path.

### Acknowledgement timeline

- **72 hours** — initial acknowledgement of receipt
- **14 days** — proposed fix or mitigation timeline for confirmed vulnerabilities
- **Coordinated disclosure** — once a fix is released, we publish a security advisory crediting the reporter (unless they prefer to remain anonymous)

## What counts as a vulnerability

- Exposure or leakage of API keys, tokens, or other secrets in shipped code, logs, or the published trace format
- Prompt-injection attacks that bypass the Verifier or the per-query budget guardrails in ways that incur unexpected cost
- Code-execution paths in the swarm engine that could be exploited (e.g. unsafe deserialization, eval, shell injection in tool runners)
- Exposure of user data through the deployed website
- Dependency vulnerabilities that specifically affect OPUS (not generic upstream CVEs already patched in a newer release)

## What does not count

- Outputs from the swarm that you disagree with — the swarm is a deliberation tool, not an oracle. Use the provenance trace to understand how it reached its answer; the system is designed never to lie about its certainty.
- General weaknesses in the underlying Anthropic API — please report those directly to Anthropic.
- Publicly disclosed CVEs in dependencies that already have available patches — please open a normal PR to bump the dependency.

## Out of scope

OPUS v0 has no authentication, no payments, no user database, and runs only as a CLI or as a (currently) un-credentialed cinematic preview. Issues that rely on features OPUS does not yet have are out of scope.

---

*Magnum Opus · MMXXVI*
