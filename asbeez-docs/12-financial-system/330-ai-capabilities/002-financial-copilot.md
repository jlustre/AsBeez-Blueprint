# Financial Copilot

> **Document:** 12-financial-system/330-ai-capabilities/002-financial-copilot.md

---

## Purpose

The Financial Copilot provides role-aware conversational assistance for members, vendors, partners, finance operators, auditors, compliance teams, and administrators.

## Capabilities

Explain balances and statements, summarize payment/payout/refund/reconciliation status, identify relevant policies, draft queries/reports, describe variance drivers, retrieve evidence, recommend next steps, and prepare—but not execute—workflow requests.

## Guardrails

Responses cite source records, time, currency, entity/country, projection freshness, and confidence. The Copilot cannot write balances, post journals, approve payouts/refunds/reserves, alter tax or account mappings, certify reports, close periods, disclose another party’s data, or make final risk/compliance decisions.

## Human Interaction

The user sees whether an answer is actual, projected, estimated, provider-reported, pending, or unknown. A proposed action becomes a separately authorized command with current policy, idempotency, approval, and audit checks. AI output and human disposition are retained where material.

## Related Documents

- [000-index.md](000-index.md)
- [001-overview.md](001-overview.md)
- [012-financial-explanations.md](012-financial-explanations.md)
- [017-natural-language-query.md](017-natural-language-query.md)
- [018-human-approval.md](018-human-approval.md)
