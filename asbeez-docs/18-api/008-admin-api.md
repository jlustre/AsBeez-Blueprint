# Administration API

## Purpose

The Administration API supports scoped dashboards, configuration, roles/permissions, workflow review, exception management, reconciliation, close, reports, audit, and approved operational commands.

## Controls

Use least privilege, RBAC/ABAC, entity/country scope, MFA, dual control, separation of duties, amount/threshold approval, time-bound elevation, idempotency, effective-dated configuration, audit, privacy, and review/recertification.

## Financial Boundary

Administrators use domain APIs and cannot directly edit balances, posted journals, immutable events, provider evidence, tax history, audit records, certifications, or period state. Dashboard actions initiate commands with current validation and explicit pending/unknown/error outcomes.

## AI and Operations

AI may summarize, retrieve, prioritize, explain, forecast, and recommend; it cannot grant permissions, approve itself, post, pay, release/freeze, certify, close, or bypass controls. Administrative APIs expose runbook, incident, reconciliation, and audit evidence.

## Related Documents

- [index.md](index.md)
- [002-auth-api.md](002-auth-api.md)
- [../12-financial-system/380-administration/000-index.md](../12-financial-system/380-administration/000-index.md)
- [../12-financial-system/310-api/003-authorization.md](../12-financial-system/310-api/003-authorization.md)
