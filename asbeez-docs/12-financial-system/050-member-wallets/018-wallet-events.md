# Wallet Events

> **Document:** 12-financial-system/050-member-wallets/018-wallet-events.md

---

## Purpose

Wallet events are immutable facts describing wallet creation, status changes, movements, holds, reservations, compliance decisions, transfers, redemptions, and payout workflow changes.

## Event Catalog

- WalletCreated, WalletActivated, WalletRestricted, WalletFrozen, WalletClosed;
- WalletCreditAuthorized, WalletCredited, WalletDebitAuthorized, WalletDebited;
- WalletHoldPlaced, WalletHoldPartiallyReleased, WalletHoldReleased;
- WalletReservationCreated, WalletReservationCommitted, WalletReservationReleased;
- WalletTransferRequested, WalletTransferCompleted, WalletTransferFailed;
- WalletPayoutRequested, WalletPayoutApproved, WalletPayoutPaid, WalletPayoutFailed;
- WalletRewardConversionRequested, WalletRewardConversionApproved, WalletRewardConversionRejected; and
- WalletReconciled, WalletExceptionOpened, WalletExceptionResolved.

## Contract

Every event includes event ID/version, wallet ID/type, owner reference, unit/currency, amount where applicable, source event, country, legal entity, policy version, occurred/effective times, correlation/causation IDs, actor/system, and aggregate version.

## Rules

Consumers are idempotent and preserve ordering per wallet where required. Reward events remain distinguishable from monetary wallet events. Provider callbacks and downstream payout events cannot directly mutate wallet state without a validated command or mapped event.

## Related Documents

- [000-index.md](000-index.md)
- [002-wallet-domain-model.md](002-wallet-domain-model.md)
- [007-wallet-debits.md](007-wallet-debits.md)
- [019-wallet-ai-capabilities.md](019-wallet-ai-capabilities.md)
