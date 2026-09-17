# Subledgers

> **Document:** 12-financial-system/040-subledgers/000-index.md

---

## Purpose

This section defines financial subledgers that support the general ledger, including wallets, rewards, AHC, vendors, customers, partners, commissions, tax, payment providers, refunds, reserves, funds, and country subledgers.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-member-wallet-subledger.md](002-member-wallet-subledger.md) - Member Wallet Subledger
- [003-reward-points-subledger.md](003-reward-points-subledger.md) - Reward Points Subledger
- [004-ahc-subledger.md](004-ahc-subledger.md) - AHC Subledger
- [005-vendor-subledger.md](005-vendor-subledger.md) - Vendor Subledger
- [006-customer-subledger.md](006-customer-subledger.md) - Customer Subledger
- [007-partner-subledger.md](007-partner-subledger.md) - Partner Subledger
- [008-commission-subledger.md](008-commission-subledger.md) - Commission Subledger
- [009-tax-subledger.md](009-tax-subledger.md) - Tax Subledger
- [010-payment-provider-subledger.md](010-payment-provider-subledger.md) - Payment Provider Subledger
- [011-refund-subledger.md](011-refund-subledger.md) - Refund Subledger
- [012-reserve-subledger.md](012-reserve-subledger.md) - Reserve Subledger
- [013-compensation-fund-subledger.md](013-compensation-fund-subledger.md) - Compensation Fund Subledger
- [014-charity-fund-subledger.md](014-charity-fund-subledger.md) - Charity Fund Subledger
- [015-country-subledger.md](015-country-subledger.md) - Country Subledger
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md) - Subledger Reconciliation
- [017-future-roadmap.md](017-future-roadmap.md) - Future Roadmap

## Design Authority

Subledgers provide detailed operational and participant records; the General Ledger remains authoritative for posted monetary effects. Subledger definitions must follow the [AsBeez financial mapping](../010-financial-domain-model/014-asbeez-financial-mapping.md) and [AsBeez posting mappings](../030-general-ledger/019-asbeez-posting-mappings.md).

## Implementation Sequence

1. Define stable source-event contracts and subject identifiers.
2. Implement non-monetary RP, ABC, matrix, and AHC lineage separately from monetary treatment.
3. Implement wallet, customer, vendor, partner, payment, refund, tax, reserve, and fund records.
4. Map monetary subledger totals to General Ledger control accounts.
5. Add country, entity, currency, policy, and compliance controls.
6. Implement reconciliation, statements, exception aging, replay, and audit evidence.
