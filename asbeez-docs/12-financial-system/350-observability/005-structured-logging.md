# Structured Logging

> **Document:** 12-financial-system/350-observability/005-structured-logging.md

---

## Purpose

Structured logs provide searchable, consistent, privacy-aware evidence for financial operations, integrations, events, security, reconciliation, and incidents.

## Required Fields

`timestamp`, `level`, `service`, `environment`, `operation`, `event_type`, `resource_type/id`, `actor_type/id`, `entity_id`, `country_code`, `currency`, `period`, `provider`, `status`, `error_code`, `correlation_id`, `causation_id`, `idempotency_key_hash`, `policy_version`, `schema_version`, and source reference where appropriate.

## Rules

Log decisions, transitions, retries, unknown outcomes, approvals, exceptions, control totals, and reconciliation references without secrets, full payment credentials, raw identity data, or unnecessary personal information. Posted financial facts are referenced, not recreated in logs. Access, retention, masking, legal hold, and tamper evidence apply.

## Related Documents

- [000-index.md](000-index.md)
- [006-distributed-tracing.md](006-distributed-tracing.md)
- [007-correlation-ids.md](007-correlation-ids.md)
- [../300-data-model/017-audit-schema.md](../300-data-model/017-audit-schema.md)
