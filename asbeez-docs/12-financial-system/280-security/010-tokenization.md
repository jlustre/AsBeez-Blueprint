# Tokenization

> **Document:** 12-financial-system/280-security/010-tokenization.md

---

## Purpose

Tokenization replaces sensitive payment, bank, payout, tax, identity, and provider values with controlled references while reducing data exposure and compliance scope.

## Rules

Tokens are scoped to owner, provider, purpose, country/entity, environment, and expiry. Detokenization requires least privilege, explicit purpose, strong authentication, logging, and provider controls. Tokens are not balances, payment success, authorization, or ownership proof.

## Lifecycle

```text
Requested -> Issued -> Active -> Rotated/Restricted -> Revoked/Expired
```

Token issuance, use, reveal, rotation, revocation, and deletion retain actor/service, purpose, provider, scope, and audit evidence.

## Assurance

Token inventory, detokenization access, provider scope, expiry, rotation, revocation, incident, and PCI/data-classification status are reviewed periodically.

## Related Documents

- [000-index.md](000-index.md)
- [009-encryption.md](009-encryption.md)
- [011-key-management.md](011-key-management.md)
- [013-pci-dss.md](013-pci-dss.md)
