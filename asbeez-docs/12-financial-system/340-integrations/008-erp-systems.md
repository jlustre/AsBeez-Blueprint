# ERP Systems

> **Document:** 12-financial-system/340-integrations/008-erp-systems.md

---

## Purpose

ERP integrations exchange approved procurement, orders, vendors, customers, inventory-related financial facts, budgets, assets, invoices, payments, and journal/reporting data.

## Boundary

ERP adapters translate context-owned contracts; they do not grant ERP direct database access or authority to change AsBeez wallet, ledger, reward, tax, reserve, payout, or reconciliation state. Ownership is explicit for each entity, country, period, and data type.

## Controls

Use versioned mappings, entity/country/currency validation, batch IDs, idempotency, control totals, approval, access scopes, error queues, replay, and reconciliation. Source snapshots and external references are retained. Conflicting ERP data becomes an exception rather than an overwrite.

## Related Documents

- [000-index.md](000-index.md)
- [007-accounting-platforms.md](007-accounting-platforms.md)
- [013-data-warehouse.md](013-data-warehouse.md)
- [../290-architecture/002-service-boundaries.md](../290-architecture/002-service-boundaries.md)
