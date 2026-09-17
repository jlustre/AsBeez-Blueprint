# Key Management

> **Document:** 12-financial-system/280-security/011-key-management.md

---

## Purpose

Key management protects encryption, signing, tokenization, provider, bank, audit, and integrity keys across their full lifecycle.

## Controls

Generate/store keys in approved KMS/HSM, separate duties, scope access, rotate, revoke, backup/recover, monitor use, protect backup copies, and retain key version metadata. Production keys are never embedded in source or logs.

## Rules

Key compromise triggers containment, rotation/revocation, impact assessment, provider notification where required, evidence preservation, and incident response. Historical signatures/hashes remain verifiable under retained key versions.

## Key States

```text
Generated -> Active -> Rotating -> Retired -> Destroyed
Active -> Suspended | Revoked
```

State transitions require authorized change, impact review, backup/recovery validation, and audit evidence.

## Related Documents

- [000-index.md](000-index.md)
- [009-encryption.md](009-encryption.md)
- [012-secrets-management.md](012-secrets-management.md)
- [016-security-monitoring.md](016-security-monitoring.md)
