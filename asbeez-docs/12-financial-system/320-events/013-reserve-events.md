# Reserve Events

> **Document:** 12-financial-system/320-events/013-reserve-events.md

---

## Purpose

Reserve events communicate reserve proposal, approval, funding, increase, decrease, release, expiry, transfer, closure, and reconciliation facts.

## Event Catalog

`ReserveProposed`, `ReserveApproved`, `ReserveFunded`, `ReserveIncreased`, `ReserveDecreased`, `ReserveReleaseRequested`, `ReserveReleased`, `ReserveExpired`, `ReserveTransferred`, and `ReserveReconciled`.

## Payload and Rules

Events include reserve/owner/type, purpose, amount/currency, source/target account, entity/country, release policy, exposure, approval, current version, idempotency, wallet/subledger, ledger, and reconciliation references. Reserve funds are not free cash, revenue, or an untracked liability. Release events require policy and authority; they do not erase funding history.

## Related Documents

- [000-index.md](000-index.md)
- [010-chargeback-events.md](010-chargeback-events.md)
- [014-reconciliation-events.md](014-reconciliation-events.md)
- [../300-data-model/013-reserve-schema.md](../300-data-model/013-reserve-schema.md)
