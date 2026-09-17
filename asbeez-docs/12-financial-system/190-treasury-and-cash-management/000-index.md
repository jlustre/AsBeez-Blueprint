# Treasury And Cash Management

> **Document:** 12-financial-system/190-treasury-and-cash-management/000-index.md

---

## Purpose

This section defines treasury and cash management, including bank and cash accounts, cash positioning, liquidity, forecasting, fund transfers, bank and provider reconciliation, cash concentration, country treasury, FX exposure, controls, reporting, APIs, events, and AI capabilities.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-treasury-domain-model.md](002-treasury-domain-model.md) - Treasury Domain Model
- [003-bank-accounts.md](003-bank-accounts.md) - Bank Accounts
- [004-cash-accounts.md](004-cash-accounts.md) - Cash Accounts
- [005-cash-positioning.md](005-cash-positioning.md) - Cash Positioning
- [006-liquidity-management.md](006-liquidity-management.md) - Liquidity Management
- [007-cash-forecasting.md](007-cash-forecasting.md) - Cash Forecasting
- [008-fund-transfers.md](008-fund-transfers.md) - Fund Transfers
- [009-bank-reconciliation.md](009-bank-reconciliation.md) - Bank Reconciliation
- [010-payment-provider-reconciliation.md](010-payment-provider-reconciliation.md) - Payment Provider Reconciliation
- [011-cash-concentration.md](011-cash-concentration.md) - Cash Concentration
- [012-country-treasury.md](012-country-treasury.md) - Country Treasury
- [013-fx-exposure.md](013-fx-exposure.md) - FX Exposure
- [014-treasury-controls.md](014-treasury-controls.md) - Treasury Controls
- [015-treasury-reporting.md](015-treasury-reporting.md) - Treasury Reporting
- [016-treasury-api.md](016-treasury-api.md) - Treasury API
- [017-treasury-events.md](017-treasury-events.md) - Treasury Events
- [018-treasury-ai-capabilities.md](018-treasury-ai-capabilities.md) - Treasury AI Capabilities
- [019-future-roadmap.md](019-future-roadmap.md) - Future Roadmap

## Design Authority

Treasury owns organizational cash custody, liquidity, bank/provider evidence, transfers, concentration, forecasts, and FX exposure. Payments, Payouts, Refunds, Taxes, Reserves, Vendor/Partner Finance, Rewards, and the General Ledger provide approved obligations and accounting effects.

## Implementation Sequence

1. Approve accounts, entities, countries, currencies, providers, restrictions, reserves, and liquidity policies.
2. Implement cash positions, bank/provider ingestion, transfers, concentration, forecasting, country treasury, and FX exposure.
3. Connect payments, payouts, refunds, taxes, reserves, vendor/partner settlement, rewards, and GL mappings.
4. Implement reconciliation, controls, reporting, APIs, events, security, audit, and governed AI assistance.
