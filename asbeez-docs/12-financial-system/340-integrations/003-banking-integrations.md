# Banking Integrations

> **Document:** 12-financial-system/340-integrations/003-banking-integrations.md

---

## Purpose

Banking integrations connect approved bank accounts, statements, transfers, balances, payment rails, confirmations, returns, fees, and cash evidence to treasury and reconciliation workflows.

## Adapter Contract

Map bank account/entity/country/currency, statement period, transaction reference, value date, booking date, amount, balance, counterparty classification, transfer status, return reason, and file/API provenance. Preserve raw evidence and normalized records separately.

## Rules

Bank data is evidence until matched to ledger, treasury, wallet, payout, payment, tax, reserve, or settlement records. Transfers require authorization, dual control where applicable, idempotency, limits, sanctions, country/entity policy, and reconciliation. Bank credentials, certificates, and files are protected and access-audited.

## Related Documents

- [000-index.md](000-index.md)
- [004-payout-providers.md](004-payout-providers.md)
- [016-integration-monitoring.md](016-integration-monitoring.md)
- [../190-treasury-and-cash-management/001-overview.md](../190-treasury-and-cash-management/001-overview.md)
