# Tax Provider Integration

> **Document:** 12-financial-system/160-taxes/017-tax-provider-integration.md

---

## Purpose

Tax provider integration supplies rates, jurisdiction, product taxability, exemption validation, calculation, filing, or remittance capabilities without making provider output authoritative until AsBeez validates and records it.

## Adapter Responsibilities

- request taxability/rate calculation;
- validate jurisdiction, product, party, registration, and exemption inputs;
- version provider response and rule metadata;
- import filing, remittance, and correction evidence; and
- handle provider timeout, mismatch, duplicate, and unavailable states.

## Rules

Provider credentials are secret-managed, calls are idempotent and correlated, and provider output is mapped through a versioned contract. AsBeez retains source inputs, output, provider/rule version, timestamp, and review state. A provider response does not directly post the GL or override tax/legal approval.

## Related Documents

- [000-index.md](000-index.md)
- [003-tax-jurisdictions.md](003-tax-jurisdictions.md)
- [011-tax-calculation.md](011-tax-calculation.md)
- [016-tax-reconciliation.md](016-tax-reconciliation.md)
