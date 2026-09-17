# Reward Reconciliation

> **Document:** 12-financial-system/060-reward-finance/014-reward-reconciliation.md

---

## Purpose

Reward reconciliation proves that reward program events, financial classifications, liabilities, expenses, reserves, wallet effects, settlements, and General Ledger control accounts agree.

## Required Reconciliations

- qualifying orders to RP issuance and reversal;
- RP consumption to ABC eligibility/creation;
- ABC and matrix events to AHC distribution;
- AHC events to approved financial recognition, redemption, or no-effect outcomes;
- reward liabilities to member/partner/vendor obligations and GL accounts;
- reward expenses and reserves to funding and policy calculations;
- refunds, chargebacks, fraud, expiry, forfeiture, and adjustments to downstream effects; and
- country/entity/currency totals to statutory and management reports.

## Exception Rules

Missing source links, duplicate events, unclassified monetary effects, balance differences, stale policy versions, and unauthorized country activity are exceptions even when aggregate totals balance. Every exception has owner, severity, age, evidence, and resolution.

## Evidence

Reconciliation stores population counts, non-monetary quantities, monetary totals, source periods, rule/policy versions, account mappings, reviewer, approval, completion time, and rebuild/replay information.

## Related Documents

- [000-index.md](000-index.md)
- [008-reward-liabilities.md](008-reward-liabilities.md)
- [013-reward-adjustments.md](013-reward-adjustments.md)
- [016-reward-audit.md](016-reward-audit.md)
