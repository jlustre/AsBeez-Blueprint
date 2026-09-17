# Integration Monitoring

> **Document:** 12-financial-system/340-integrations/016-integration-monitoring.md

---

## Purpose

Integration monitoring detects availability, latency, errors, retries, rate limits, schema drift, security failures, data quality issues, provider uncertainty, and reconciliation breaks.

## Signals

Track request/response volume, success/failure/unknown status, timeout, retry, callback delay, queue lag, file freshness, rate-limit consumption, credential expiry, mapping/version, amount/currency mismatch, duplicate, missing, unmatched, control totals, settlement variance, and provider/country/entity scope.

## Response

Classify transient, provider, security, data, contract, capacity, reconciliation, and systemic incidents. Alerts may recommend retry, pause, route change, provider escalation, or review; operators authorize changes. Monitoring cannot silently mark an external financial operation successful.

## Evidence

Retain dashboards, alerts, traces, raw/normalized references, incident timeline, provider communication, actions, approvals, retries, dead letters, reconciliation result, and post-incident remediation.

## Related Documents

- [000-index.md](000-index.md)
- [001-overview.md](001-overview.md)
- [015-integration-security.md](015-integration-security.md)
- [../220-reconciliation/001-overview.md](../220-reconciliation/001-overview.md)
