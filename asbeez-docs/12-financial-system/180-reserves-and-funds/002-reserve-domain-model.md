# Reserve Domain Model

> **Document:** 12-financial-system/180-reserves-and-funds/002-reserve-domain-model.md

---

## Purpose

The Reserve and Fund domain models exposure reserves, designated funds, funding, commitments, holds, release, utilization, return, reconciliation, and reporting.

## Entities

| Entity | Responsibility |
| --- | --- |
| Reserve | amount restricted against a defined exposure |
| Fund | designated pool for an approved purpose |
| Exposure | refund, chargeback, vendor, partner, reward, liquidity, or other risk basis |
| Funding Event | approved transfer or allocation into a reserve/fund |
| Commitment | approved planned use or obligation |
| Release/Utilization | controlled movement out or use against exposure/purpose |
| Reserve Snapshot | dated measure of amount, coverage, and assumptions |

## Invariants

- reserve/fund has one purpose, owner, currency, entity, and policy scope;
- reserve cannot exceed approved funding or exposure policy without exception;
- fund use cannot exceed available committed amount;
- release/utilization/return is idempotent and evidenced;
- reserve does not equal realized loss or final liability; and
- balances reconcile to GL, treasury, subledgers, and exposure populations.

## Related Documents

- [000-index.md](000-index.md)
- [003-operating-reserve.md](003-operating-reserve.md)
- [014-reserve-funding.md](014-reserve-funding.md)
- [015-reserve-release.md](015-reserve-release.md)
