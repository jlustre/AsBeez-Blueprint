# Chargeback Schema

> **Document:** 12-financial-system/300-data-model/010-chargeback-schema.md

---

## Purpose

Chargeback data records a provider or network dispute, evidence process, liability decision, financial hold, and eventual recovery or loss.

## Core Fields

`chargeback_id`, `payment_id`, `order_id`, `provider_id`, `provider_case_id`, `reason_code`, `stage`, `amount_minor`, `currency`, `fee_minor`, `received_at`, `response_due_at`, `evidence_reference`, `liability_party`, `reserve_id`, `status`, `outcome`, `opened_at`, and `closed_at`.

## Lifecycle

Received, under review, evidence requested, evidence submitted, representment, pre-arbitration, arbitration, won, lost, withdrawn, expired, or closed. Provider case status remains evidence until mapped to an approved business and accounting outcome.

## Accounting Rules

Chargebacks link payment reversal, customer/vendor/partner liability, reserves, fees, recovery, loss, tax, and ledger journals. Evidence, deadlines, communications, and decisions are retained for audit and dispute resolution.

## Related Documents

- [000-index.md](000-index.md)
- [006-payment-schema.md](006-payment-schema.md)
- [013-reserve-schema.md](013-reserve-schema.md)
- [../140-chargebacks-and-disputes/001-overview.md](../140-chargebacks-and-disputes/001-overview.md)
