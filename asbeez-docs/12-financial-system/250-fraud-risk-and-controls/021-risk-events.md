# Risk Events

> **Document:** 12-financial-system/250-fraud-risk-and-controls/021-risk-events.md

---

## Purpose

Risk events are immutable facts for signals, scores, alerts, controls, holds, cases, evidence, decisions, appeals, losses, recoveries, and resolutions.

## Event Catalog

- RiskSignalDetected, RiskScoreCalculated, VelocityThresholdBreached;
- RiskAlertOpened, RiskAlertAssigned, RiskAlertEscalated;
- HoldPlaced, FreezePlaced, HoldReleased, FreezeReleased;
- RiskCaseOpened, EvidenceSubmitted, RiskDecisionRecorded, RiskAppealOpened/Resolved;
- FraudConfirmed, FraudDismissed, LossRecognized, RecoveryRecorded;
- RiskControlBreached, RiskExceptionOpened/Resolved; and
- RiskModelVersionPublished.

## Contract

Events include ID/version, subject/event, risk type, amount/unit/currency, entity/country, signal, score/confidence, rule/model version, evidence, action, owner, case, occurred/effective time, actor/system, correlation, causation, and idempotency.

## Rules

Consumers are idempotent. Risk events do not independently alter accounting, tax, reward, payable, payout, or customer rights; downstream actions require approved control workflows.

## Related Documents

- [000-index.md](000-index.md)
- [015-transaction-monitoring.md](015-transaction-monitoring.md)
- [017-case-management.md](017-case-management.md)
- [019-risk-reporting.md](019-risk-reporting.md)
