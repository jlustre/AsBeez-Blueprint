# Payout Schema

> **Document:** 12-financial-system/300-data-model/007-payout-schema.md

---

## Purpose

Payout data records approved withdrawals or disbursements from AsBeez-controlled balances to vendors, partners, members, or other approved recipients.

## Core Fields

`payout_id`, `recipient_id`, `recipient_type`, `source_wallet_id`, `amount_minor`, `currency`, `destination_type`, `destination_token`, `provider_id`, `provider_payout_id`, `status`, `fee_minor`, `reserve_minor`, `country_code`, `entity_id`, `approval_id`, `idempotency_key`, `requested_at`, and `completed_at`.

## Lifecycle

Requested, validated, held, approved, queued, submitted, processing, paid, failed, cancelled, returned, reversed, or disputed. Provider status is evidence until reconciled. A failed or returned payout does not silently restore funds; a compensating wallet and ledger effect is created through policy.

## Controls

Payouts require balance, reserve, limits, identity, sanctions, tax, risk, approval, country, currency, and destination validation. Sensitive destination details are tokenized. Payout amounts and fees are idempotent and concurrency-controlled.

## Related Documents

- [000-index.md](000-index.md)
- [005-wallet-schema.md](005-wallet-schema.md)
- [../080-payouts-and-withdrawals/001-overview.md](../080-payouts-and-withdrawals/001-overview.md)
- [../190-treasury-and-cash-management/001-overview.md](../190-treasury-and-cash-management/001-overview.md)
