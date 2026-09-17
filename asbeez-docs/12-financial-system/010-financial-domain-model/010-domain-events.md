# Domain Events

## Purpose

Domain events are immutable facts that a meaningful financial state transition occurred. They are not commands, notifications of intent, or database change feeds.

## Event Catalog

| Event | Published when |
| --- | --- |
| PaymentAuthorized | provider authorization succeeds |
| PaymentCaptured | funds are captured and linked to a source |
| PaymentRefunded | refund is accepted or completed according to provider state |
| ChargebackOpened / Resolved | dispute state changes |
| InvoiceIssued / Settled | invoice becomes collectible or fully allocated |
| JournalPosted / Reversed | accounting entry is posted or compensated |
| WalletHoldPlaced / Released | availability restriction changes |
| SettlementCalculated / Approved / Settled | obligation passes each controlled stage |
| PayoutSubmitted / Paid / Failed | provider execution changes state |
| TaxAssessed / Remitted | tax result or remittance is recorded |
| FXRateLocked | a conversion rate is selected for a transaction |
| ReconciliationCompleted | evidence is matched or exceptions accepted |
| RewardLiabilityRecognized / Released / Reversed | reward obligation changes |

## Event Contract

Every event contains event ID, event type and version, aggregate ID and version, occurred time, effective time, producer context, jurisdiction, currency where relevant, source reference, correlation ID, causation ID, and payload. Sensitive provider data is excluded or tokenized.

## Delivery Rules

Events are committed through an outbox with the aggregate change. Consumers are idempotent, tolerate reordering where possible, and persist processing status. Event handlers must not infer a financial result from event arrival alone; they validate the event contract and source state.

## Related Documents

- [007-repositories.md](007-repositories.md)
- [011-invariants.md](011-invariants.md)
- [012-state-machines.md](012-state-machines.md)
