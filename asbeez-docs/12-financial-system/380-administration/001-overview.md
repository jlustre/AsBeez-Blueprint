# Overview

> **Document:** 12-financial-system/380-administration/001-overview.md

---

## Purpose

Financial administration provides authorized interfaces for configuration, monitoring, workflow review, approvals, reporting, access, audit, and controlled operational action across the AsBeez Financial System.

## Administrative Boundary

Administrators manage definitions, policies, mappings, queues, permissions, approvals, and workflow requests through domain APIs. They do not directly edit posted journals, balances, immutable events, provider evidence, tax history, audit records, or certified reports.

## Control Principles

Use least privilege, entity/country scope, separation of duties, dual control, MFA, effective dating, versioning, idempotency, audit evidence, review/expiry, privacy, and reconciliation. Every material action shows current source state, policy, impact, approver, correlation, and result.

## Related Documents

- [000-index.md](000-index.md)
- [002-financial-admin-dashboard.md](002-financial-admin-dashboard.md)
- [018-configuration-management.md](018-configuration-management.md)
- [019-role-and-permission-management.md](019-role-and-permission-management.md)
- [../310-api/003-authorization.md](../310-api/003-authorization.md)
