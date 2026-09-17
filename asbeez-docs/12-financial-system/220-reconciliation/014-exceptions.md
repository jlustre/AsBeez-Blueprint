# Exceptions

> **Document:** 12-financial-system/220-reconciliation/014-exceptions.md

---

## Purpose

Reconciliation exceptions are owned records for unmatched, inconsistent, missing, duplicate, stale, unauthorized, or unexplained facts.

## Required Data

Exception ID, scope/source/target, type, amount/count/unit, currency, entity/country, severity, detected time, owner, evidence, due date, status, action, approval, and resolution.

## States

```text
Open -> Assigned -> Investigating -> Resolved -> Approved -> Closed
Open -> Escalated | Accepted Timing Difference | Written Off
```

## Rules

Exceptions cannot be closed by editing source or ledger records, masking amounts, or changing match rules retrospectively. Material, aged, fraud, tax, cash, payout, reward, vendor, partner, or close exceptions escalate under policy.

## Related Documents

- [000-index.md](000-index.md)
- [013-reconciliation-rules.md](013-reconciliation-rules.md)
- [015-discrepancy-resolution.md](015-discrepancy-resolution.md)
- [016-reconciliation-approvals.md](016-reconciliation-approvals.md)
