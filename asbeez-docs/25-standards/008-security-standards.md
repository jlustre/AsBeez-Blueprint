# Security Standards

## Purpose

Security standards protect identities, financial data, APIs, code, databases, integrations, events, AI, infrastructure, and operational decisions.

## Baseline Controls

Use threat modeling, least privilege, MFA, RBAC/ABAC, separation of duties, secure secrets/KMS/HSM, TLS/encryption, tokenization, secure dependencies, input/output validation, rate limiting, logging/monitoring, vulnerability management, backups, incident response, and access recertification.

## Data and Privacy

Classify and minimize personal, identity, payment, tax, risk, rewards, vendor, partner, and audit data. Mask sensitive values in logs/events/prompts/reports/support/test data; enforce country/entity/residency, consent/legal basis, retention, deletion/legal hold, and approved provider controls.

## Financial and AI Safety

Security failures fail closed for unsafe effects. No system, provider, UI, AI, or operator bypasses authorization, idempotency, ledger, reconciliation, approval, tax, compliance, or audit. AI tools are read-only or approval-gated and defend against prompt injection, leakage, poisoning, and unsafe tools.

## Assurance

Test authentication, authorization, privacy, webhooks, APIs, migrations, dependencies, recovery, incident containment, and tamper evidence. Track findings, owners, severity, remediation, exceptions, evidence, and retest.

## Related Documents

- [index.md](index.md)
- [007-coding-standards.md](007-coding-standards.md)
- [009-versioning-standards.md](009-versioning-standards.md)
- [../12-financial-system/330-ai-capabilities/020-ai-security.md](../12-financial-system/330-ai-capabilities/020-ai-security.md)
