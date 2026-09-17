# Case Management

> **Document:** 12-financial-system/250-fraud-risk-and-controls/017-case-management.md

---

## Purpose

Case Management coordinates investigation, evidence, decisions, controls, communications, appeals, remediation, loss/recovery, and closure for fraud and financial-risk cases.

## States

```text
Opened -> Assigned -> Investigating -> Decision -> Remediation -> Reviewed -> Closed
Opened -> Escalated | Dismissed | Appealed
```

## Required Data

Case, subject/event, risk type, amount/unit/currency, country/entity, evidence, signals, rule/model version, owner, SLA, decision, action, communication, appeal, loss/recovery, approvals, and audit history.

## Rules

Cases preserve source and financial history, support fair review, minimize sensitive data, and separate investigation from final accounting, tax, liability, and payout decisions. Closure requires reason, evidence, approval, resolution, and reporting impact.

## Related Documents

- [000-index.md](000-index.md)
- [014-risk-scoring.md](014-risk-scoring.md)
- [016-holds-and-freezes.md](016-holds-and-freezes.md)
- [018-loss-prevention.md](018-loss-prevention.md)
