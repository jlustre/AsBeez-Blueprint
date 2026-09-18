# Financial Tables

## Purpose

Financial tables store authoritative accounts, journals, ledger lines, wallets, payments, payouts, invoices, refunds, disputes, tax, currencies, reserves, reconciliation, periods, reporting, and financial events.

## Table Groups

Chart/accounts and dimensions; `journals`/`journal_lines`; subledgers for wallet/reward/vendor/partner/payment/payout/tax/reserve; payment/payout/invoice/refund/chargeback; currency/FX; reserves/funds; reconciliation/periods; reports/read models; event/outbox/idempotency; and control totals.

## Non-Negotiable Rules

Posted journal headers/lines are immutable and balanced. Monetary amounts use integer minor units and explicit currency. Records retain source, account/chart version, entity/country, dimensions, period, policy, actor, correlation, causation, idempotency, and audit. Corrections use reversal/compensation. Subledgers reconcile to GL control accounts; projections cannot authorize effects.

## Operational Controls

Use transaction boundaries, unique/check constraints, optimistic/concurrency controls, append-only history, partition/retention policy, encryption/access control, backup/restore, outbox, provider evidence, reconciliation, close, and audit. No direct cross-context writes.

## Related Documents

- [index.md](index.md)
- [002-erd.md](002-erd.md)
- [008-audit-tables.md](008-audit-tables.md)
- [../12-financial-system/300-data-model/000-index.md](../12-financial-system/300-data-model/000-index.md)
