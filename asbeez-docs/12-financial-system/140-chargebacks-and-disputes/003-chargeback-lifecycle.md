# Chargeback Lifecycle

> **Document:** 12-financial-system/140-chargebacks-and-disputes/003-chargeback-lifecycle.md

---

## Purpose

The chargeback lifecycle tracks an issuer/provider dispute from notification through evidence, representment, pre-arbitration, arbitration, resolution, financial adjustment, and reconciliation.

## States

```text
Received -> Acknowledged -> Evidence Requested -> Represented
-> Pre-Arbitration -> Arbitration -> Won | Lost | Withdrawn | Closed
Received -> Invalid | Duplicate
```

## Required Data

Case/provider references, payment/order/invoice, customer/vendor/partner, reason code, amount/currency, fee, received/deadline dates, evidence, reserve/hold, liability decision, outcome, and downstream adjustment references.

## Rules

State changes are provider- and policy-versioned. A received chargeback may place holds or reserves without proving vendor/platform liability. Missed deadlines, provider decisions, and returned funds create explicit operational and accounting events.

## Related Documents

- [000-index.md](000-index.md)
- [002-dispute-domain-model.md](002-dispute-domain-model.md)
- [005-representment.md](005-representment.md)
- [013-dispute-reconciliation.md](013-dispute-reconciliation.md)
