# Chargeback Events

> **Document:** 12-financial-system/320-events/010-chargeback-events.md

---

## Purpose

Chargeback events communicate dispute receipt, evidence deadlines, evidence submission, representment, arbitration, liability, reserve, recovery, loss, and closure facts.

## Event Catalog

`ChargebackReceived`, `ChargebackEvidenceRequested`, `ChargebackEvidenceSubmitted`, `ChargebackRepresented`, `ChargebackPreArbitration`, `ChargebackArbitration`, `ChargebackWon`, `ChargebackLost`, `ChargebackWithdrawn`, `ChargebackReservePlaced`, and `ChargebackClosed`.

## Payload and Rules

Events include case/payment/order/provider IDs, reason/stage, amount/currency, fee, deadline, evidence hash/reference, liability party, reserve, country/entity, owner, and outcome. Provider status is evidence until mapped to an approved business/accounting state. Evidence and deadlines are immutable/auditable; loss or recovery creates linked financial events.

## Related Documents

- [000-index.md](000-index.md)
- [006-payment-events.md](006-payment-events.md)
- [013-reserve-events.md](013-reserve-events.md)
- [../300-data-model/010-chargeback-schema.md](../300-data-model/010-chargeback-schema.md)
