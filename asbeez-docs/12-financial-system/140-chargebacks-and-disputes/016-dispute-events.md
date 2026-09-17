# Dispute Events

> **Document:** 12-financial-system/140-chargebacks-and-disputes/016-dispute-events.md

---

## Purpose

Dispute events are immutable facts for case creation, provider status, evidence, representment, arbitration, exposure, liability, reserve, accounting, and reconciliation workflows.

## Event Catalog

- DisputeOpened, DisputeAcknowledged, DisputeInvalid, DisputeDuplicate;
- EvidenceRequested, EvidenceAdded, EvidenceSubmitted;
- RepresentmentSubmitted, PreArbitrationOpened, ArbitrationOpened;
- DisputeWon, DisputeLost, DisputeWithdrawn, DisputeClosed;
- ChargebackReservePlaced, ChargebackHoldPlaced, LiabilityDecisionRecorded;
- VendorAdjustmentCreated, PlatformLossRecognized, RecoveryRecorded;
- DisputeReconciled, DisputeExceptionOpened/Resolved; and
- DisputeDeadlineApproaching, DisputeDeadlineMissed.

## Contract

Events include ID/version, case/provider/payment/order/invoice, customer/vendor/partner, amount/currency/fee, evidence/deadline, reserve/hold/liability, country/entity, policy versions, occurred/effective time, actor/system, correlation, causation, and idempotency.

## Rules

Consumers are idempotent. Events do not infer fault or create accounting effects without a mapped decision, source, policy, and reconciliation path.

## Related Documents

- [000-index.md](000-index.md)
- [003-chargeback-lifecycle.md](003-chargeback-lifecycle.md)
- [008-chargeback-accounting.md](008-chargeback-accounting.md)
- [013-dispute-reconciliation.md](013-dispute-reconciliation.md)
