# Financial Account API

> **Document:** 12-financial-system/310-api/008-financial-account-api.md

---

## Purpose

The Financial Account API exposes authorized account definitions, mappings, dimensions, and balance views without allowing clients to mutate the Chart of Accounts or posted truth directly.

## Queries

Retrieve account by scoped code/ID, account hierarchy, class, normal balance, chart version, effective dates, control-account mapping, dimensions, entity/country scope, and derived balance or trial-balance view.

## Commands

Request account creation, closure, supersession, mapping change, dimension-policy change, or balance investigation. Commands require authority, effective dating, approval, period impact analysis, and audit evidence; posted account meaning cannot be repurposed.

## Rules

Clients cannot choose unrestricted accounts for journal posting or write balances. Account data is filtered by entity/country and chart version. Balances identify period, currency, source, freshness, and certification.

## Related Documents

- [000-index.md](000-index.md)
- [002-authentication.md](002-authentication.md)
- [003-authorization.md](003-authorization.md)
- [009-ledger-api.md](009-ledger-api.md)
- [../300-data-model/002-financial-accounts-schema.md](../300-data-model/002-financial-accounts-schema.md)
