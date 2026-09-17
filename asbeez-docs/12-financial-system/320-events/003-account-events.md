# Account Events

> **Document:** 12-financial-system/320-events/003-account-events.md

---

## Purpose

Account events communicate Chart of Accounts and financial-account lifecycle facts to ledger, mapping, reporting, reconciliation, controls, and audit consumers.

## Event Catalog

`AccountCreated`, `AccountActivated`, `AccountUpdated`, `AccountClosed`, `AccountSuperseded`, `AccountMappingApproved`, `AccountDimensionPolicyChanged`, and `AccountAccessChanged`.

## Payload and Rules

Events include account ID/code, chart version, class, normal balance, parent, control-account status, dimensions, entity/country scope, effective dates, policy, actor, approval, correlation, and causation. Account events never assert balances or authorize arbitrary journal lines. Posted account meaning cannot be repurposed; changes are effective-dated and audited.

## Related Documents

- [000-index.md](000-index.md)
- [002-event-contracts.md](002-event-contracts.md)
- [004-ledger-events.md](004-ledger-events.md)
- [../300-data-model/002-financial-accounts-schema.md](../300-data-model/002-financial-accounts-schema.md)
