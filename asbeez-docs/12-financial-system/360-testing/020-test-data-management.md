# Test Data Management

> **Document:** 12-financial-system/360-testing/020-test-data-management.md

---

## Purpose

Test-data management provides realistic, deterministic, privacy-safe data for financial testing without exposing production secrets or creating real financial effects.

## Requirements

Use synthetic or approved masked data with known entity/country/currency/period, account/chart, order/payment/payout/wallet, tax/FX, provider, event, reconciliation, close, risk, compliance, and failure cases. Preserve referential integrity, control totals, version, provenance, and reset/rebuild capability.

## Controls

Production data requires documented authority, minimization, masking/tokenization, encryption, access/time limits, residency, retention, legal-hold, deletion, and audit. Test credentials/providers are isolated. Never send real money, live credentials, unapproved identity/payment data, or unbounded exports to test environments.

## Related Documents

- [000-index.md](000-index.md)
- [006-integration-testing.md](006-integration-testing.md)
- [017-security-testing.md](017-security-testing.md)
- [../300-data-model/022-retention.md](../300-data-model/022-retention.md)
