# Invoice Events

> **Document:** 12-financial-system/320-events/008-invoice-events.md

---

## Purpose

Invoice events communicate draft, calculation, issue, delivery, payment allocation, adjustment, credit/debit note, void, and collection facts.

## Event Catalog

`InvoiceDraftCreated`, `InvoiceCalculated`, `InvoiceIssued`, `InvoiceSent`, `InvoiceDeliveryFailed`, `InvoicePaymentApplied`, `CreditNoteIssued`, `DebitNoteIssued`, `InvoiceVoided`, `InvoiceOverdue`, and `InvoiceDisputed`.

## Payload and Rules

Events include invoice ID/number, issuer/customer/vendor/partner, order, line/tax/discount totals, currency, legal entity/country, due date, document/template version, immutable document hash, source references, and status. Issued invoice facts are not overwritten; corrections use notes or approved adjustments. Invoice events do not independently recognize revenue or prove payment.

## Related Documents

- [000-index.md](000-index.md)
- [006-payment-events.md](006-payment-events.md)
- [011-tax-events.md](011-tax-events.md)
- [../300-data-model/008-invoice-schema.md](../300-data-model/008-invoice-schema.md)
