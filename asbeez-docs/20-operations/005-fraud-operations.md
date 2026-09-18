# Fraud Operations

## Purpose

Fraud Operations reviews payment, wallet, payout, refund, chargeback, reward, vendor, partner, account-takeover, velocity, and transaction-risk signals.

## Procedure

Receive alert/case; authenticate and scope access; preserve evidence; assess signals, model/provider output, transaction history, country/entity, velocity, device/network context where permitted, and customer impact; apply deterministic policy; request human/risk/compliance decision; communicate/appeal; reconcile any financial action; record closure or residual risk.

## Decision Boundary

AI and provider scores are evidence/recommendations. Authorized risk/compliance personnel and deterministic policies decide review, hold, decline, freeze, release, recovery, or case closure. Operations cannot fabricate evidence, make unsupported fraud labels, alter accounting, release funds, or deny lawful rights without authority.

## Controls

Use least privilege, privacy minimization, fairness/drift review, reason codes, appeal paths, separation of duties, time-bound holds, case aging, loss/recovery tracking, audit, incident escalation, and reconciliation. Unknown provider state is not approval.

## Related Documents

- [index.md](index.md)
- [006-compliance-operations.md](006-compliance-operations.md)
- [../12-financial-system/250-fraud-risk-and-controls/017-case-management.md](../12-financial-system/250-fraud-risk-and-controls/017-case-management.md)
