# AI Security

> **Document:** 12-financial-system/330-ai-capabilities/020-ai-security.md

---

## Purpose

AI security protects financial data, models, prompts, tools, outputs, integrations, and human decisions from unauthorized access, leakage, manipulation, prompt injection, poisoning, model theft, and unsafe automation.

## Controls

Use least privilege, data minimization, tenant/entity/country isolation, encryption, tokenization, secret management, sandboxed tools, retrieval allowlists, input/output filtering, prompt and model versioning, supply-chain review, logging, red teaming, rate limits, and human approval gates.

## Financial Safety

AI tools are read-only by default. Tool calls cannot directly post, approve, pay, release, certify, close, or change policy. Any approved command re-enters normal authentication, authorization, idempotency, risk, tax, ledger, reconciliation, and audit controls. Outputs are labeled as AI-generated and sensitive content is masked.

## Incident Response

Detect, contain, preserve evidence, revoke access/keys, assess affected data and financial actions, notify required owners, remediate, retest, and document model/prompt/tool rollback. AI incidents are linked to security, audit, compliance, and operational cases.

## Related Documents

- [000-index.md](000-index.md)
- [002-financial-copilot.md](002-financial-copilot.md)
- [019-ai-governance.md](019-ai-governance.md)
- [../310-api/002-authentication.md](../310-api/002-authentication.md)
