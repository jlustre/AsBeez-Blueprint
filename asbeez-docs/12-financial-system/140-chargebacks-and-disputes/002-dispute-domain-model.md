# Dispute Domain Model

> **Document:** 12-financial-system/140-chargebacks-and-disputes/002-dispute-domain-model.md

---

## Purpose

The Dispute domain models a payment or transaction challenge, provider case, evidence, representment, arbitration, liability, reserve/hold, accounting effect, and resolution.

## Entities

| Entity | Responsibility |
| --- | --- |
| Dispute Case | identity, reason, source payment, amount, deadline, status |
| Evidence Package | documents, events, delivery/payment/order proof, integrity |
| Representment | response submitted to provider and outcome |
| Arbitration | escalated decision and fee/outcome |
| Exposure | disputed amount, fee, reserve, hold, and potential loss |
| Liability Decision | vendor, partner, platform, customer, provider, or shared treatment |
| Resolution | win, loss, withdrawn, duplicate, invalid, or settled outcome |

## Invariants

- one case references one provider/source scope and declared amount/currency;
- evidence is versioned, time-bound, and integrity-protected;
- deadlines and provider states are explicit;
- reserve/hold does not equal final liability;
- downstream adjustments are idempotent and linked; and
- original payment/order/refund/reward/settlement history is not edited.

## Lifecycle

```text
Opened -> Evidence Requested -> Evidence Ready -> Represented
-> Pre-Arbitration -> Arbitration -> Won | Lost | Withdrawn | Closed
Opened -> Invalid | Duplicate
```

## Related Documents

- [000-index.md](000-index.md)
- [003-chargeback-lifecycle.md](003-chargeback-lifecycle.md)
- [004-dispute-evidence.md](004-dispute-evidence.md)
- [016-dispute-events.md](016-dispute-events.md)
