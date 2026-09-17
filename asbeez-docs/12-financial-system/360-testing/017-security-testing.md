# Security Testing

> **Document:** 12-financial-system/360-testing/017-security-testing.md

---

## Purpose

Security tests verify confidentiality, integrity, availability, authentication, authorization, privacy, secrets, encryption, tenant/entity/country isolation, and resilience of financial systems and integrations.

## Required Cases

Test credential/token abuse, MFA/step-up, privilege escalation, separation of duties, IDOR, injection, replay, webhook forgery, provider impersonation, secret leakage, payment-data exposure, log/event masking, API abuse, supply chain, model/tool abuse, backup access, key rotation, incident containment, and audit tamper resistance.

## Assertions

Unauthorized callers cannot view or mutate financial data; secrets and sensitive evidence do not appear in logs/events/errors; security controls fail closed for unsafe financial effects; and incidents preserve evidence without duplicating or corrupting accounting.

## Related Documents

- [000-index.md](000-index.md)
- [007-api-testing.md](007-api-testing.md)
- [018-compliance-testing.md](018-compliance-testing.md)
- [../340-integrations/015-integration-security.md](../340-integrations/015-integration-security.md)
