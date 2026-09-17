# Reconciliation Events

> **Document:** 12-financial-system/320-events/014-reconciliation-events.md

---

## Purpose

Reconciliation events communicate run creation, source capture, matching, difference, exception assignment, resolution, approval, certification, reopening, and completion facts.

## Event Catalog

`ReconciliationRunStarted`, `SourceSnapshotCaptured`, `ReconciliationMatched`, `ReconciliationDifferenceFound`, `ExceptionAssigned`, `ExceptionResolutionProposed`, `ExceptionResolved`, `ResolutionApproved`, `ReconciliationCertified`, `ReconciliationReopened`, and `ReconciliationCompleted`.

## Payload and Rules

Events include run/scope, source versions, ledger/subledger/provider/bank/wallet/tax/reserve references, period, entity/country/currency, control totals, matched/unmatched counts and amounts, tolerance, exception severity, owner, approval, and certification. Differences are explicit facts; events cannot hide or manually rewrite balances.

## Related Documents

- [000-index.md](000-index.md)
- [004-ledger-events.md](004-ledger-events.md)
- [015-close-events.md](015-close-events.md)
- [../300-data-model/014-reconciliation-schema.md](../300-data-model/014-reconciliation-schema.md)
