# Partner API

> **Document:** 12-financial-system/120-partner-finance/015-partner-api.md

---

## Purpose

The Partner Finance API exposes authenticated partner activity, earnings, commissions, bonuses, incentives, fees, reserves, settlement, payout, tax, statements, and reconciliation views without allowing partners to write financial balances.

## Read Operations

- retrieve qualified activity and source references permitted to the partner;
- retrieve estimated, approved, payable, paid, held, reversed, and disputed values;
- retrieve fees, tax, reserves, holds, settlement, payout, destination, and exception status; and
- download certified or provisional statements with clear labels.

## Commands

Submit destination/tax details, request payout, acknowledge statement, dispute an attribution/calculation line, provide refund/chargeback evidence, and request support review. Commands require authorization, idempotency, server-side calculation, policy validation, and audit correlation.

## Rules

Partners cannot alter earnings, attribution, commission, bonus, incentive, fees, taxes, reserves, settlement, payout status, account mappings, or reward values through API fields. Registration or referral count cannot be submitted as a payable amount.

## Related Documents

- [000-index.md](000-index.md)
- [002-partner-financial-account.md](002-partner-financial-account.md)
- [012-partner-statements.md](012-partner-statements.md)
- [013-partner-reconciliation.md](013-partner-reconciliation.md)
