# Domain Rule Testing

> **Document:** 12-financial-system/360-testing/003-domain-rule-testing.md

---

## Purpose

Domain-rule tests verify business invariants for payments, wallets, rewards, orders, revenue, vendors, partners, refunds, disputes, tax, FX, reserves, treasury, payouts, and close.

## Required Cases

Test eligibility, ownership, country/entity, currency, amount, limits, tax, fee, commission, reward qualification versus monetary treatment, settlement, reserve, hold, approval, period, cancellation, return, dispute, and compensation rules with valid, invalid, boundary, duplicate, stale, and unauthorized inputs.

## Rules

Tests assert domain outcomes and emitted facts without permitting cross-context table writes or hidden side effects. Each rule identifies policy/version and effective date. Contradictory rules fail visibly and require authority resolution rather than test-specific exceptions.

## Related Documents

- [000-index.md](000-index.md)
- [002-unit-testing.md](002-unit-testing.md)
- [006-integration-testing.md](006-integration-testing.md)
- [../../24-business-rules/index.md](../../24-business-rules/index.md)
