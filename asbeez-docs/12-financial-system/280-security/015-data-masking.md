# Data Masking

> **Document:** 12-financial-system/280-security/015-data-masking.md

---

## Purpose

Data masking limits exposure of payment, bank, tax, identity, wallet, payout, vendor, partner, risk, and audit data while retaining operational and financial usefulness.

## Rules

Mask/tokenize by role, purpose, environment, country, entity, and data classification. Production secrets and raw payment credentials never appear in logs, analytics, exports, tickets, or development data. Authorized reveal requires strong authentication, purpose, approval where material, and audit logging.

## Examples

Mask PAN/account numbers, tax identifiers, bank details, addresses, identity documents, payout destinations, risk signals, KYC evidence, and sensitive case notes while preserving safe references and aggregates.

## Related Documents

- [000-index.md](000-index.md)
- [009-encryption.md](009-encryption.md)
- [010-tokenization.md](010-tokenization.md)
- [016-security-monitoring.md](016-security-monitoring.md)
