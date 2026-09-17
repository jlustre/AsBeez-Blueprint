# Reserves And Funds

> **Document:** 12-financial-system/180-reserves-and-funds/000-index.md

---

## Purpose

This section defines reserves and special funds, including operating, refund, chargeback, vendor, partner, reward liability, compensation, charity, promotional, country, and liquidity reserves, plus funding, release, reconciliation, and reporting.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-reserve-domain-model.md](002-reserve-domain-model.md) - Reserve Domain Model
- [003-operating-reserve.md](003-operating-reserve.md) - Operating Reserve
- [004-refund-reserve.md](004-refund-reserve.md) - Refund Reserve
- [005-chargeback-reserve.md](005-chargeback-reserve.md) - Chargeback Reserve
- [006-vendor-reserve.md](006-vendor-reserve.md) - Vendor Reserve
- [007-partner-reserve.md](007-partner-reserve.md) - Partner Reserve
- [008-reward-liability-reserve.md](008-reward-liability-reserve.md) - Reward Liability Reserve
- [009-compensation-fund.md](009-compensation-fund.md) - Compensation Fund
- [010-charity-fund.md](010-charity-fund.md) - Charity Fund
- [011-promotional-fund.md](011-promotional-fund.md) - Promotional Fund
- [012-country-reserve.md](012-country-reserve.md) - Country Reserve
- [013-liquidity-reserve.md](013-liquidity-reserve.md) - Liquidity Reserve
- [014-reserve-funding.md](014-reserve-funding.md) - Reserve Funding
- [015-reserve-release.md](015-reserve-release.md) - Reserve Release
- [016-reserve-reconciliation.md](016-reserve-reconciliation.md) - Reserve Reconciliation
- [017-reserve-reporting.md](017-reserve-reporting.md) - Reserve Reporting
- [018-future-roadmap.md](018-future-roadmap.md) - Future Roadmap

## Design Authority

Reserves and Funds own designated exposure protection and purpose-limited pools. Payments, Refunds, Chargebacks, Vendor/Partner Finance, Reward Finance, Tax, Payouts, Treasury, and the General Ledger provide or consume controlled funding, exposure, release, utilization, and accounting facts.

## Implementation Sequence

1. Approve reserve/fund types, purposes, owners, countries, entities, currencies, sources, exposures, and release policies.
2. Implement reserve/fund identity, funding, commitments, holds, release, utilization, return, and expiry.
3. Connect refunds, disputes, vendor/partner settlement, rewards, wallets, payouts, tax, treasury, and GL.
4. Implement reconciliation, reporting, APIs, events, security, audit, liquidity, and governed AI assistance.
