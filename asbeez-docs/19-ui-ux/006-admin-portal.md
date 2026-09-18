# Admin Portal

## Purpose

The admin portal provides role-scoped dashboards and workflows for configuration, accounts, journals, wallets, payments, payouts, invoices, refunds, disputes, tax, reserves, reconciliation, close, reporting, audit, support, exceptions, incidents, and AI assistance.

## Required Experiences

Show source, freshness, entity/country/currency/period, status, owner, severity, policy/version, approval, evidence, reconciliation, and next action. Provide explicit confirmation, reason, scope, audit reference, idempotency, and outcome for material actions.

## Control Boundary

Admin UI cannot directly edit balances, posted journals, immutable events, provider evidence, tax history, audit records, certifications, or period state. All actions use authorized APIs, separation of duties, MFA, thresholds, dual control, and current validation. AI may summarize/recommend but cannot approve itself or execute prohibited effects.

## Operations

Support queue aging, exception assignment, incident/runbook links, reconciliation and close checklists, report certification, access recertification, privacy masking, export controls, and recovery/degraded states. Destructive or high-risk actions require explicit authority and evidence.

## Related Documents

- [index.md](index.md)
- [002-design-system.md](002-design-system.md)
- [../18-api/008-admin-api.md](../18-api/008-admin-api.md)
- [../12-financial-system/380-administration/000-index.md](../12-financial-system/380-administration/000-index.md)
