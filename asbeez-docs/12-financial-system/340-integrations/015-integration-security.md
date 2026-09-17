# Integration Security

> **Document:** 12-financial-system/340-integrations/015-integration-security.md

---

## Purpose

Integration security protects credentials, data, transport, messages, files, endpoints, provider accounts, and financial effects across external boundaries.

## Controls

Use secret/KMS/HSM management, rotation, least privilege, scoped service identities, mTLS or signed requests where appropriate, TLS, webhook verification, IP/endpoint controls, tokenization, encryption at rest/in transit, data minimization, residency, consent/legal basis, and access review.

## Operational Rules

Never place secrets, full payment credentials, raw identity evidence, or unnecessary personal data in logs or events. Validate provider response integrity, schema, amount, currency, entity/country, reference, timestamp, and idempotency. External data is evidence until accepted and reconciled. Security changes require approval, testing, audit, and rollback.

## Incident Response

Detect, contain, revoke credentials, preserve evidence, isolate provider/endpoint, assess data and financial impact, notify required owners, recover safely, rotate secrets, reconcile effects, and document remediation.

## Related Documents

- [000-index.md](000-index.md)
- [014-webhooks.md](014-webhooks.md)
- [016-integration-monitoring.md](016-integration-monitoring.md)
- [../330-ai-capabilities/020-ai-security.md](../330-ai-capabilities/020-ai-security.md)
