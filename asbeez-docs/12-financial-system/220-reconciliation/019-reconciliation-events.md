# Reconciliation Events

> **Document:** 12-financial-system/220-reconciliation/019-reconciliation-events.md

---

## Purpose

Reconciliation events are immutable facts for sessions, imports, matching, control totals, exceptions, resolutions, approvals, and certification.

## Event Catalog

- ReconciliationSessionOpened, EvidenceImported, PopulationCaptured;
- ControlTotalCalculated, MatchProposed, MatchConfirmed, TimingDifferenceAccepted;
- ExceptionOpened, ExceptionAssigned, ExceptionEscalated, ExceptionResolved;
- DiscrepancyCorrectionRequested, AdjustmentPosted, SourceCorrectionRecorded;
- ReconciliationApproved, ReconciliationCompleted, ReconciliationReopened; and
- ReconciliationReportPublished.

## Contract

Events include ID/version, session/source/target, domain, population, amount/count/unit, currency, entity/country, rule/tolerance version, exception/resolution, actor/system, occurred/effective time, correlation, causation, and idempotency.

## Rules

Consumers are idempotent. Events do not edit source or posted ledger records or imply approval without the required workflow.

## Related Documents

- [000-index.md](000-index.md)
- [002-reconciliation-domain-model.md](002-reconciliation-domain-model.md)
- [014-exceptions.md](014-exceptions.md)
- [017-reconciliation-reporting.md](017-reconciliation-reporting.md)
