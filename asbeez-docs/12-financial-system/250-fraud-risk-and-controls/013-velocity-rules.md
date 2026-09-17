# Velocity Rules

> **Document:** 12-financial-system/250-fraud-risk-and-controls/013-velocity-rules.md

---

## Purpose

Velocity rules limit or review repeated actions over time, amount, account, device, provider, destination, country, vendor, partner, reward program, or payment method.

## Rules

Rules are versioned, effective-dated, scoped, explainable, and tested for false positives. They may trigger allow, step-up, hold, review, reject, or escalation, but do not prove fraud or alter source/accounting records.

## Required Data

Rule ID/version, window, subject, threshold, amount/count/unit, scope, action, exception, owner, expiry, evidence, and appeal/review path.

## Monitoring

Review rule hit rate, false positives, drift, override rate, affected country/entity, customer/vendor/partner impact, and resulting loss/recovery at each model or policy review.

## Related Documents

- [000-index.md](000-index.md)
- [003-transaction-risk.md](003-transaction-risk.md)
- [014-risk-scoring.md](014-risk-scoring.md)
- [015-transaction-monitoring.md](015-transaction-monitoring.md)
