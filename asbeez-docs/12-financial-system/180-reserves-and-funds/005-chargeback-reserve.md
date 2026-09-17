# Chargeback Reserve

> **Document:** 12-financial-system/180-reserves-and-funds/005-chargeback-reserve.md

---

## Purpose

The Chargeback Reserve protects against expected payment dispute exposure before provider outcome and final liability are known.

## Required Data

Case/population, provider, payment/order, vendor/partner/platform scope, probability/assumption, amount/currency, country/entity, funding account, review/release condition, owner, approval, and utilization.

## Rules

Chargeback reserve is not a loss, vendor fault, fee, revenue, or payout reduction by itself. It may support a hold or settlement restriction while evidence and liability are reviewed. Wins, losses, recoveries, and utilization create linked events and reconciled GL effects.

## Monitoring

Report open case exposure, funded reserve, expected loss, utilized amount, released amount, coverage, aging, provider, vendor/partner/platform scope, country, entity, currency, and policy assumptions.

## Related Documents

- [000-index.md](000-index.md)
- [002-reserve-domain-model.md](002-reserve-domain-model.md)
- [015-reserve-release.md](015-reserve-release.md)
- [016-reserve-reconciliation.md](016-reserve-reconciliation.md)
