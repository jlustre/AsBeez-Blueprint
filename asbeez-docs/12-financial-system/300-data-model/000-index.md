# Data Model

> **Document:** 12-financial-system/300-data-model/000-index.md

---

## Purpose

This section defines Financial System data models and schemas for accounts, journals, ledgers, wallets, payments, payouts, invoices, refunds, chargebacks, tax, currency, reserves, reconciliation, periods, reporting, audit, event store, read models, indexing, partitioning, and retention.

## Structure

- [001-database-overview.md](001-database-overview.md) - Database Overview
- [002-financial-accounts-schema.md](002-financial-accounts-schema.md) - Financial Accounts Schema
- [003-journal-entries-schema.md](003-journal-entries-schema.md) - Journal Entries Schema
- [004-ledger-entries-schema.md](004-ledger-entries-schema.md) - Ledger Entries Schema
- [005-wallet-schema.md](005-wallet-schema.md) - Wallet Schema
- [006-payment-schema.md](006-payment-schema.md) - Payment Schema
- [007-payout-schema.md](007-payout-schema.md) - Payout Schema
- [008-invoice-schema.md](008-invoice-schema.md) - Invoice Schema
- [009-refund-schema.md](009-refund-schema.md) - Refund Schema
- [010-chargeback-schema.md](010-chargeback-schema.md) - Chargeback Schema
- [011-tax-schema.md](011-tax-schema.md) - Tax Schema
- [012-currency-schema.md](012-currency-schema.md) - Currency Schema
- [013-reserve-schema.md](013-reserve-schema.md) - Reserve Schema
- [014-reconciliation-schema.md](014-reconciliation-schema.md) - Reconciliation Schema
- [015-financial-period-schema.md](015-financial-period-schema.md) - Financial Period Schema
- [016-reporting-schema.md](016-reporting-schema.md) - Reporting Schema
- [017-audit-schema.md](017-audit-schema.md) - Audit Schema
- [018-event-store-schema.md](018-event-store-schema.md) - Event Store Schema
- [019-read-models.md](019-read-models.md) - Read Models
- [020-indexing.md](020-indexing.md) - Indexing
- [021-partitioning.md](021-partitioning.md) - Partitioning
- [022-retention.md](022-retention.md) - Retention
- [023-future-roadmap.md](023-future-roadmap.md) - Future Roadmap

## Design Authority

Financial Data Architecture owns shared data conventions, schema ownership, integrity constraints, migrations, partitioning, retention, event/read-model mechanics, and data lineage. Domain owners own business meaning; the General Ledger remains the authority for posted monetary truth.

## Modeling Authority

All financial schemas use stable identifiers, integer minor-unit amounts, explicit ISO currency, entity/country scope, policy and schema versions, source references, actor/service lineage, correlation/causation, and idempotency where an operation can create a financial effect. Posted facts are immutable and corrected through compensating records.

## Implementation Sequence

1. Establish database conventions, account/journal/ledger schemas, constraints, and control-account mappings.
2. Implement wallet, payment, payout, invoice, refund, dispute, tax, currency, and reserve schemas.
3. Implement reconciliation, period, reporting, audit, event, and read-model schemas.
4. Apply indexing, partitioning, retention, migration, backup, restore, and schema-compatibility controls.
5. Validate representative workflows against ledger balance, reconciliation, audit, privacy, country, and recovery requirements.

## Related Documents

- [001-database-overview.md](001-database-overview.md)
- [003-journal-entries-schema.md](003-journal-entries-schema.md)
- [018-event-store-schema.md](018-event-store-schema.md)
- [../290-architecture/001-system-architecture.md](../290-architecture/001-system-architecture.md)
- [../290-architecture/005-double-entry-ledger-architecture.md](../290-architecture/005-double-entry-ledger-architecture.md)
