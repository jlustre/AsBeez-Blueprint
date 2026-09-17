# Contract Testing

> **Document:** 12-financial-system/360-testing/009-contract-testing.md

---

## Purpose

Contract tests protect compatibility among APIs, events, outbox consumers, provider adapters, banks, tax/FX services, accounting/ERP, warehouse, notifications, and internal bounded contexts.

## Required Checks

Validate schemas, required/optional fields, amount/currency precision, statuses, error codes, signatures, version compatibility, idempotency behavior, country/entity scope, privacy classification, event ordering, provider mappings, and backward/forward compatibility.

## Rules

Producer and consumer tests run against versioned contracts and representative failure cases. Breaking changes require a new version, migration/upcaster, consumer inventory, deprecation plan, and financial/reconciliation impact review. A provider contract passing does not prove accounting correctness.

## Related Documents

- [000-index.md](000-index.md)
- [007-api-testing.md](007-api-testing.md)
- [008-event-testing.md](008-event-testing.md)
- [../310-api/023-api-versioning.md](../310-api/023-api-versioning.md)
