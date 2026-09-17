# Matrix Distribution Accounting

> **Document:** 12-financial-system/060-reward-finance/006-matrix-distribution-accounting.md

---

## Purpose

Matrix distribution accounting evaluates the financial effect of an AHC or related distribution event after the Beehive Matrix engine has determined placement, genealogy, cycle, level, and distribution result.

## Source Contract

The Matrix Engine supplies matrix ID/version, country, cycle, node, ancestor/upline, descendant/source ABC, distribution rule/version, quantity, event status, and source marketplace/reward references. Reward Finance does not recalculate placement or distribution.

## Financial Decision

For each distribution, Reward Finance determines whether the result is non-monetary, pending, a measured liability, reward/compensation expense, approved redemption, wallet credit, or reversal. The decision records funding source, liability ceiling, reserve, account mapping, jurisdiction, and payout restrictions.

## Rules

- matrix placement is not a payment or journal entry;
- spillover, cycle completion, genealogy, and level qualification remain operational facts;
- AHC cannot be treated as cash without an approved conversion;
- duplicate distribution events are rejected by source and cycle idempotency; and
- refunds, chargebacks, fraud, or invalid placement trigger explicit impact evaluation.

## Related Documents

- [000-index.md](000-index.md)
- [004-ahc-accounting.md](004-ahc-accounting.md)
- [005-abc-creation-accounting.md](005-abc-creation-accounting.md)
- [014-reward-reconciliation.md](014-reward-reconciliation.md)
