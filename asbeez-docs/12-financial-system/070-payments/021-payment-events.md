# Payment Events

> **Document:** 12-financial-system/070-payments/021-payment-events.md

---

## Purpose

Payment events are immutable facts used by order, tax, settlement, reward, wallet, reconciliation, and General Ledger workflows.

## Event Catalog

- PaymentIntentCreated, PaymentIntentCancelled, PaymentIntentExpired;
- PaymentMethodAttached, PaymentAuthorizationSucceeded, PaymentAuthorizationFailed;
- PaymentCaptured, PaymentPartiallyCaptured, PaymentVoided;
- PaymentRefundRequested, PaymentRefunded, PaymentRefundFailed;
- PaymentDisputeOpened, PaymentDisputeUpdated, PaymentDisputeResolved;
- ProviderSettlementImported, ProviderFeeRecorded, ProviderBalanceUpdated;
- PaymentReconciliationMatched, PaymentExceptionOpened, PaymentExceptionResolved; and
- PaymentUnknownOutcomeDetected.

## Contract

Events include ID/version, payment/intent/attempt/capture/refund IDs, order/invoice, provider/reference, amount/currency, country/entity, occurred/effective times, status, source, correlation/causation IDs, idempotency key, and policy version.

## Rules

Consumers are idempotent and do not infer order completion or reward eligibility from capture alone. Provider events are retained as evidence and mapped through versioned adapters.

## Related Documents

- [000-index.md](000-index.md)
- [002-payment-domain-model.md](002-payment-domain-model.md)
- [016-payment-provider-integration.md](016-payment-provider-integration.md)
- [018-payment-reconciliation.md](018-payment-reconciliation.md)
