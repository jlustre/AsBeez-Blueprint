# AI Security Privacy

## Purpose

AI security and privacy protect data, models, prompts, tools, providers, outputs, users, and decisions from unauthorized access, leakage, manipulation, prompt injection, poisoning, model theft, and unsafe automation.

## Controls

Use least privilege, tenant/entity/country isolation, data minimization, classification, consent/legal basis, encryption, tokenization, KMS/HSM, secret management, provider restrictions, sandboxed tools, retrieval allowlists, prompt/output filtering, DLP, logging, rate limits, red teaming, retention, deletion/legal hold, and access review.

## Prompt and Output Safety

Treat retrieved content and user input as untrusted. Separate instructions from data, defend against prompt injection, constrain tools, validate structured outputs, cite sources, mask sensitive fields, and require human approval for material actions. AI output never overrides authorization or policy.

## Incident Response

Detect, contain, revoke keys/access, preserve evidence, assess data and financial impact, notify owners, remediate, retest, rotate secrets, and document rollback. Link AI incidents to security, privacy, compliance, audit, and operational cases.

## Related Documents

- [000-index.md](000-index.md)
- [010-ai-governance.md](010-ai-governance.md)
- [014-rag-knowledge-base.md](014-rag-knowledge-base.md)
- [../../12-financial-system/330-ai-capabilities/020-ai-security.md](../../12-financial-system/330-ai-capabilities/020-ai-security.md)

