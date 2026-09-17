# Anomaly Detection

> **Document:** 12-financial-system/330-ai-capabilities/006-anomaly-detection.md

---

## Purpose

AI detects unusual financial patterns across transactions, wallets, payments, payouts, rewards, vendors, partners, tax, reserves, providers, and country activity.

## Output

Return anomaly type, affected scope, baseline/window, signals, confidence, materiality, comparison population, model/rule version, data freshness, recommended review priority, and limitations. Detection is an alert, not a finding of fraud or error.

## Controls

Alerts may recommend review, hold, or investigation but cannot independently freeze/release funds, reject a transaction, label fraud, alter accounting, or close a case. Thresholds, appeals, false positives, drift, fairness, and human outcomes are monitored and audited.

## Related Documents

- [000-index.md](000-index.md)
- [007-fraud-detection.md](007-fraud-detection.md)
- [005-reconciliation-assistance.md](005-reconciliation-assistance.md)
- [../250-fraud-risk-and-controls/015-transaction-monitoring.md](../250-fraud-risk-and-controls/015-transaction-monitoring.md)
