# Member Wallets

> **Document:** 12-financial-system/050-member-wallets/000-index.md

---

## Purpose

This section defines member wallet capabilities, including types, balances, credits, debits, transfers, holds, reserves, locking, reconciliation, statements, limits, security, compliance, APIs, events, and AI capabilities.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-wallet-domain-model.md](002-wallet-domain-model.md) - Wallet Domain Model
- [003-wallet-types.md](003-wallet-types.md) - Wallet Types
- [004-wallet-creation.md](004-wallet-creation.md) - Wallet Creation
- [005-wallet-balances.md](005-wallet-balances.md) - Wallet Balances
- [006-wallet-credits.md](006-wallet-credits.md) - Wallet Credits
- [007-wallet-debits.md](007-wallet-debits.md) - Wallet Debits
- [008-wallet-transfers.md](008-wallet-transfers.md) - Wallet Transfers
- [009-wallet-holds.md](009-wallet-holds.md) - Wallet Holds
- [010-wallet-reserves.md](010-wallet-reserves.md) - Wallet Reserves
- [011-wallet-locking.md](011-wallet-locking.md) - Wallet Locking
- [012-wallet-reconciliation.md](012-wallet-reconciliation.md) - Wallet Reconciliation
- [013-wallet-statements.md](013-wallet-statements.md) - Wallet Statements
- [014-wallet-limits.md](014-wallet-limits.md) - Wallet Limits
- [015-wallet-security.md](015-wallet-security.md) - Wallet Security
- [016-wallet-compliance.md](016-wallet-compliance.md) - Wallet Compliance
- [017-wallet-api.md](017-wallet-api.md) - Wallet API
- [018-wallet-events.md](018-wallet-events.md) - Wallet Events
- [019-wallet-ai-capabilities.md](019-wallet-ai-capabilities.md) - Wallet AI Capabilities
- [020-future-roadmap.md](020-future-roadmap.md) - Future Roadmap

## Design Authority

Member Wallets are controlled views and workflows over approved subledger and financial records. The [Member Wallet Subledger](../040-subledgers/002-member-wallet-subledger.md) stores wallet detail, while the General Ledger remains authoritative for posted monetary effects. RP, ABC, and AHC are separate typed program units unless an approved conversion creates a monetary wallet event.

## Implementation Sequence

1. Approve wallet types, countries, currencies, custody, reward, and payout classifications.
2. Implement wallet identity, creation, lifecycle, and typed balance components.
3. Implement credits, debits, transfers, holds, reserves, locks, and limits.
4. Connect refunds, settlements, reward conversions, payouts, compliance, and reconciliation.
5. Publish statements, APIs, events, audit evidence, and controlled AI assistance.
