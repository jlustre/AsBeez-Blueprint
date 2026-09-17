# Audit Schema

> **Document:** 12-financial-system/300-data-model/017-audit-schema.md

---

## Purpose

Audit data records who or what acted, what changed or was attempted, why, under which authority and policy, and what evidence supports the financial outcome.

## Core Fields

`audit_event_id`, `event_type`, `action`, `actor_type`, `actor_id`, `service`, `resource_type`, `resource_id`, `before_hash`, `after_hash`, `source`, `reason`, `policy_version`, `approval_id`, `correlation_id`, `ip/device_context`, `occurred_at`, and `retention_class`.

## Rules

Audit records are append-only, tamper-evident, access-controlled, time-synchronized where feasible, and retained according to legal, tax, dispute, security, and financial requirements. Sensitive values are masked or tokenized while preserving investigative usefulness.

## Coverage

Capture authentication, authorization, account changes, journal preparation/posting/reversal, wallet movements, payment/provider callbacks, payouts, refunds, disputes, tax, FX, reserves, reconciliation, close, report certification, configuration, access, and AI recommendations or overrides.

## Related Documents

- [000-index.md](000-index.md)
- [001-database-overview.md](001-database-overview.md)
- [018-event-store-schema.md](018-event-store-schema.md)
- [../270-audit-and-internal-controls/001-overview.md](../270-audit-and-internal-controls/001-overview.md)
