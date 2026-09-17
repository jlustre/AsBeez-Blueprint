# Wallet Events

> **Document:** 12-financial-system/320-events/005-wallet-events.md

---

## Purpose

Wallet events communicate wallet creation, balance movement requests/results, holds, reservations, transfers, locks, limits, and reconciliation facts.

## Event Catalog

`WalletCreated`, `WalletActivated`, `WalletCreditRequested`, `WalletCredited`, `WalletDebitRequested`, `WalletDebited`, `WalletHoldPlaced`, `WalletHoldReleased`, `WalletReserved`, `WalletReserveReleased`, `WalletTransferCompleted`, `WalletLocked`, and `WalletReconciled`.

## Payload and Rules

Events include wallet/owner/type, movement ID, amount/unit/currency, available/pending/held/reserved effect, source reference, current aggregate version, entity/country, policy, idempotency, and ledger reference where monetary. RP/ABC/AHC events remain distinct from money and cannot imply conversion without an approved event.

## Related Documents

- [000-index.md](000-index.md)
- [002-event-contracts.md](002-event-contracts.md)
- [006-payment-events.md](006-payment-events.md)
- [../300-data-model/005-wallet-schema.md](../300-data-model/005-wallet-schema.md)
