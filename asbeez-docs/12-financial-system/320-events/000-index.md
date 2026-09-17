# Events

> **Document:** 12-financial-system/320-events/000-index.md

---

## Purpose

This section defines Financial System events, including contracts, domain event catalogs, versioning, replay, and dead-letter handling.

## Structure

- [001-event-overview.md](001-event-overview.md) - Event Overview
- [002-event-contracts.md](002-event-contracts.md) - Event Contracts
- [003-account-events.md](003-account-events.md) - Account Events
- [004-ledger-events.md](004-ledger-events.md) - Ledger Events
- [005-wallet-events.md](005-wallet-events.md) - Wallet Events
- [006-payment-events.md](006-payment-events.md) - Payment Events
- [007-payout-events.md](007-payout-events.md) - Payout Events
- [008-invoice-events.md](008-invoice-events.md) - Invoice Events
- [009-refund-events.md](009-refund-events.md) - Refund Events
- [010-chargeback-events.md](010-chargeback-events.md) - Chargeback Events
- [011-tax-events.md](011-tax-events.md) - Tax Events
- [012-currency-events.md](012-currency-events.md) - Currency Events
- [013-reserve-events.md](013-reserve-events.md) - Reserve Events
- [014-reconciliation-events.md](014-reconciliation-events.md) - Reconciliation Events
- [015-close-events.md](015-close-events.md) - Close Events
- [016-reporting-events.md](016-reporting-events.md) - Reporting Events
- [017-compliance-events.md](017-compliance-events.md) - Compliance Events
- [018-security-events.md](018-security-events.md) - Security Events
- [019-event-versioning.md](019-event-versioning.md) - Event Versioning
- [020-event-replay.md](020-event-replay.md) - Event Replay
- [021-dead-letter-queues.md](021-dead-letter-queues.md) - Dead Letter Queues
- [022-future-roadmap.md](022-future-roadmap.md) - Future Roadmap

## Design Authority

Financial Event Architecture owns event envelopes, ownership, publication, delivery, schema compatibility, replay, dead-letter handling, retention, privacy, and observability. Domain owners own event meaning; the General Ledger remains authoritative for posted monetary effects.

## Event Authority

Events are immutable facts, not editable state, direct commands, or automatic permission to post. Producers publish approved state changes through durable outbox; consumers validate scope and versions, process idempotently, and reconcile financial effects. Provider observations remain evidence until approved and reconciled.

## Implementation Sequence

1. Establish event envelope, ownership, schema/version, security, retention, correlation, causation, and idempotency standards.
2. Implement account, ledger, wallet, payment, payout, invoice, refund, dispute, tax, currency, and reserve event catalogs.
3. Implement reconciliation, close, reporting, compliance, and security event catalogs.
4. Establish versioning, replay, dead-letter, monitoring, recovery, contract testing, and consumer certification.
5. Validate event-driven workflows against ledger balance, authorization, country/entity isolation, privacy, reconciliation, and disaster recovery.

## Related Documents

- [001-event-overview.md](001-event-overview.md)
- [002-event-contracts.md](002-event-contracts.md)
- [019-event-versioning.md](019-event-versioning.md)
- [020-event-replay.md](020-event-replay.md)
- [../290-architecture/008-outbox-pattern.md](../290-architecture/008-outbox-pattern.md)
- [../300-data-model/018-event-store-schema.md](../300-data-model/018-event-store-schema.md)
