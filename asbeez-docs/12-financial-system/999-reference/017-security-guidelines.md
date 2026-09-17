# Security Guidelines

> **Document:** 12-financial-system/999-reference/017-security-guidelines.md

---

## Purpose

These guidelines summarize financial security expectations. Security, API, integration, audit, and compliance authorities govern exact controls.

## Minimum Controls

Strong authentication/MFA, least privilege, RBAC/ABAC, entity/country scope, separation of duties, encryption, tokenization, KMS/HSM, secret rotation, secure APIs/webhooks, provider verification, input validation, rate limits, masking, monitoring, backups, incident response, and access recertification.

## Data Rules

Do not expose secrets, full payment credentials, unnecessary identity/tax evidence, unrestricted risk signals, or sensitive data in URLs, logs, events, prompts, reports, test data, or support channels. Retention, legal hold, residency, deletion/anonymization, and audit evidence apply.

## Financial Safety

Security failures fail closed for unsafe financial effects; they do not justify editing accounting or silently approving/retrying external operations. Preserve evidence, contain, recover, rotate credentials, and reconcile.

## Related Documents

- [000-index.md](000-index.md)
- [018-compliance-reference.md](018-compliance-reference.md)
- [019-testing-reference.md](019-testing-reference.md)
- [../340-integrations/015-integration-security.md](../340-integrations/015-integration-security.md)
