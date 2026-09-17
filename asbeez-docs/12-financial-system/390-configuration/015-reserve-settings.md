# Reserve Settings

> **Document:** 12-financial-system/390-configuration/015-reserve-settings.md

---

## Purpose

Reserve settings define reserve types, purposes, owners, funding sources, exposure formulas, holds, release conditions, limits, aging, country/entity, currency, accounting, and approval policies.

## Rules

Reserve configuration cannot treat restricted funds as free cash, revenue, or an untracked liability. Funding/release/increase/decrease settings are versioned, idempotent, approved, ledger-linked, and reconciled. Historical reserve decisions retain the policy used.

## Change Control

Changes assess refund, chargeback, vendor/partner, reward, liquidity, payout, treasury, country, tax, ledger, and reconciliation impact; require dual approval, test scenarios, effective date, monitoring, and release/expiry review.

## Related Documents

- [000-index.md](000-index.md)
- [012-chargeback-settings.md](012-chargeback-settings.md)
- [016-reconciliation-settings.md](016-reconciliation-settings.md)
- [../300-data-model/013-reserve-schema.md](../300-data-model/013-reserve-schema.md)
