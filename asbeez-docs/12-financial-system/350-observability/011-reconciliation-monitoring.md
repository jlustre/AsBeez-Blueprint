# Reconciliation Monitoring

> **Document:** 12-financial-system/350-observability/011-reconciliation-monitoring.md

---

## Purpose

Reconciliation monitoring tracks whether ledger, subledger, bank, provider, wallet, reward, vendor, partner, tax, reserve, and country sources are complete, current, matched, resolved, and certified.

## Signals

Track run freshness, source completeness, control totals, matched/unmatched counts and amounts, tolerance, exception severity/age, owner, resolution, approval, certification, reopened runs, duplicate/missing records, currency/entity/country, and unresolved risk.

## Response

Alerts route exceptions to accountable owners and may recommend source refresh, provider query, investigation, or controlled adjustment. Monitoring cannot mark differences resolved, edit balances, certify a run, or hide material exceptions. Every resolution links evidence and approval.

## Related Documents

- [000-index.md](000-index.md)
- [008-ledger-monitoring.md](008-ledger-monitoring.md)
- [012-close-monitoring.md](012-close-monitoring.md)
- [../300-data-model/014-reconciliation-schema.md](../300-data-model/014-reconciliation-schema.md)
