# Invoice Events

> **Document:** 12-financial-system/090-invoicing/018-invoice-events.md

---

## Purpose

Invoice events are immutable facts for invoice creation, issue, delivery, payment allocation, adjustment, notes, status, compliance, and archival workflows.

## Event Catalog

- InvoiceDraftCreated, InvoiceReviewed, InvoiceIssued, InvoiceVoided;
- InvoiceDelivered, InvoiceDeliveryFailed, InvoiceDeliveryAcknowledged;
- InvoicePaymentAllocated, InvoicePartiallyPaid, InvoicePaid, InvoiceOverdue;
- InvoiceDisputed, InvoiceWrittenOff, InvoiceUncollectible;
- CreditNoteIssued, DebitNoteIssued, InvoiceAdjusted;
- RecurringInvoiceScheduled, RecurringInvoiceGenerated, RecurringInvoiceCancelled; and
- InvoiceComplianceExceptionOpened/Resolved.

## Contract

Events include event ID/version, invoice/type/number, issuer/recipient/entity/country, order/contract/subscription, amount/currency, tax, lines, payment allocation, document version, occurred/effective times, policy versions, correlation/causation IDs, and actor/system.

## Rules

Consumers are idempotent. An invoice event does not imply payment, revenue, settlement, reward qualification, or payout unless the relevant downstream policy emits its own approved event.

## Related Documents

- [000-index.md](000-index.md)
- [002-invoice-domain-model.md](002-invoice-domain-model.md)
- [013-invoice-delivery.md](013-invoice-delivery.md)
- [017-invoice-api.md](017-invoice-api.md)
