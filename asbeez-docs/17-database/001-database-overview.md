# Database Overview

## Purpose

The AsBeez database supports bounded-context aggregates, commerce records, rewards and matrix history, financial authority, events, projections, configuration, controls, and audit evidence.

## Ownership Model

Core identity/member/customer records belong to their owning context; commerce owns catalog/order/fulfillment records; rewards owns RP/qualification/distribution; Matrix owns placement; financial contexts own subledgers and the General Ledger; audit owns immutable evidence. Shared infrastructure does not imply shared table ownership.

## Common Metadata

Records use stable IDs, lifecycle/status, created/updated timestamps, schema/version, actor/service, correlation/causation, entity/country, source, policy/effective version, and idempotency where an operation can create an effect. Money uses integer minor units and explicit ISO currency.

## Integrity and Operations

Use foreign keys, unique/check constraints, aggregate versions, append-only records, transaction boundaries, outbox atomicity, partitioning, encryption, access controls, retention/legal holds, backups, restore testing, migration review, and reconciliation. Posted journals and audit evidence are never soft-deleted or overwritten.

## Related Documents

- [index.md](index.md)
- [002-erd.md](002-erd.md)
- [007-financial-tables.md](007-financial-tables.md)
- [../12-financial-system/300-data-model/001-database-overview.md](../12-financial-system/300-data-model/001-database-overview.md)
