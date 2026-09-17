# AI Workflows

## Purpose

AI workflows coordinate model calls, retrieval, classification, recommendations, human review, commands, events, and follow-up while preserving explicit state and accountability.

## Workflow Contract

Record workflow ID/version, trigger, actor, scope, stages, inputs, model/provider/prompt versions, outputs, confidence, approvals, retries, timeouts, compensation, correlation/causation, cost, status, and terminal decision.

## Rules

Workflows are resumable and idempotent. External calls are evidence until reconciled. Human approval is mandatory for material, sensitive, legal, compliance, financial, access, or irreversible outcomes. A workflow may propose or initiate a controlled command but cannot bypass the owning domain's authorization and invariants.

## Related Documents

- [000-index.md](000-index.md)
- [003-ai-agents.md](003-ai-agents.md)
- [004-ai-automation.md](004-ai-automation.md)
- [../../12-financial-system/290-architecture/007-saga-patterns.md](../../12-financial-system/290-architecture/007-saga-patterns.md)

