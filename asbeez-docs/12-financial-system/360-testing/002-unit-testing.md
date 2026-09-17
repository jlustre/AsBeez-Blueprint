# Unit Testing

> **Document:** 12-financial-system/360-testing/002-unit-testing.md

---

## Purpose

Unit tests verify small deterministic functions, value objects, validators, mappers, policies, state transitions, calculations, and error handling in isolation.

## Financial Scope

Test minor-unit money, currency precision, rounding, FX, tax, fees, commissions, account mappings, dimensions, reward classifications, balance components, limits, eligibility, status transitions, period rules, idempotency decisions, and error categories.

## Rules

Tests use explicit inputs and expected outputs, boundary/negative cases, deterministic clocks and identifiers, property-based examples where useful, and no external provider or database dependency. Unit tests never prove integration, reconciliation, authorization configuration, or ledger persistence alone.

## Related Documents

- [000-index.md](000-index.md)
- [003-domain-rule-testing.md](003-domain-rule-testing.md)
- [005-double-entry-validation.md](005-double-entry-validation.md)
- [012-idempotency-testing.md](012-idempotency-testing.md)
