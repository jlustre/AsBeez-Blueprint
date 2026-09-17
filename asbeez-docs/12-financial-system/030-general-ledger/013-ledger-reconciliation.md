# Ledger Reconciliation

> **Document:** 12-financial-system/030-general-ledger/013-ledger-reconciliation.md

---

## Purpose

Ledger reconciliation compares posted GL facts and controlled projections with authoritative external or subledger evidence. It proves completeness, accuracy, timing, ownership, and resolution of differences.

## Reconciliation Scopes

- bank and treasury accounts;
- payment processor balances and transactions;
- wallets and participant subledgers;
- vendor and partner settlements;
- tax assessments and remittances;
- reward liability populations; and
- intercompany and clearing accounts.

For AsBeez order and reward flows, reconciliation must connect the marketplace order, payment capture, tax assessment, vendor/partner settlement, RP event, ABC event, matrix/AHC event where applicable, reward liability treatment, payout, and resulting journal entries. Missing or duplicated links are exceptions even when the monetary totals happen to balance.

## Outcomes

Each evidence line is matched, partially matched, marked as timing difference, placed in an approved exception, or escalated. A completed reconciliation records source period, population totals, match rules, unmatched amount, reviewer, approval, and completion time.

## Difference Handling

Differences are not resolved by changing source or posted history. The owner identifies whether the issue is timing, missing source activity, duplicate activity, classification, currency, provider error, or fraud, then initiates the appropriate source correction, adjustment, or investigation.

## Related Documents

- [000-index.md](000-index.md)
- [008-ledger-balancing.md](008-ledger-balancing.md)
- [011-clearing-accounts.md](../020-chart-of-accounts/011-clearing-accounts.md)
- [015-ledger-auditability.md](015-ledger-auditability.md)
- [019-asbeez-posting-mappings.md](019-asbeez-posting-mappings.md)
