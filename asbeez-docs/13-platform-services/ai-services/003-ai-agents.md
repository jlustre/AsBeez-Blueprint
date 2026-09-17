# AI Agents

## Purpose

AI agents are bounded, task-oriented components that plan, retrieve, reason, and propose steps within an explicit scope, tool allowlist, budget, time limit, and human-control boundary.

## Agent Contract

Each agent has owner, purpose, risk tier, inputs, allowed data, tools, model/prompt/version, state, maximum steps/cost/time, stop conditions, approval gates, output schema, audit, monitoring, and incident rollback.

## Financial Safety

Agents are read-only or approval-gated by default. They cannot directly post, approve, pay, release/freeze, alter balances/configuration/history, certify, close, or make final fraud/compliance/legal decisions. Tool actions invoke normal authentication, authorization, idempotency, policy, reconciliation, and audit controls.

## Related Documents

- [000-index.md](000-index.md)
- [004-ai-automation.md](004-ai-automation.md)
- [010-ai-governance.md](010-ai-governance.md)
- [../../12-financial-system/330-ai-capabilities/019-ai-governance.md](../../12-financial-system/330-ai-capabilities/019-ai-governance.md)

