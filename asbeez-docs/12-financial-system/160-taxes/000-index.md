# Taxes

> **Document:** 12-financial-system/160-taxes/000-index.md

---

## Purpose

This section defines tax domain capabilities, including jurisdictions, sales tax, VAT, GST, withholding tax, income reporting, exemptions, registration, calculation, rounding, invoices, remittance, reporting, reconciliation, provider integration, APIs, events, and AI capabilities.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-tax-domain-model.md](002-tax-domain-model.md) - Tax Domain Model
- [003-tax-jurisdictions.md](003-tax-jurisdictions.md) - Tax Jurisdictions
- [004-sales-tax.md](004-sales-tax.md) - Sales Tax
- [005-value-added-tax.md](005-value-added-tax.md) - Value Added Tax
- [006-goods-and-services-tax.md](006-goods-and-services-tax.md) - Goods And Services Tax
- [007-withholding-tax.md](007-withholding-tax.md) - Withholding Tax
- [008-income-reporting.md](008-income-reporting.md) - Income Reporting
- [009-tax-exemptions.md](009-tax-exemptions.md) - Tax Exemptions
- [010-tax-registration.md](010-tax-registration.md) - Tax Registration
- [011-tax-calculation.md](011-tax-calculation.md) - Tax Calculation
- [012-tax-rounding.md](012-tax-rounding.md) - Tax Rounding
- [013-tax-invoices.md](013-tax-invoices.md) - Tax Invoices
- [014-tax-remittance.md](014-tax-remittance.md) - Tax Remittance
- [015-tax-reporting.md](015-tax-reporting.md) - Tax Reporting
- [016-tax-reconciliation.md](016-tax-reconciliation.md) - Tax Reconciliation
- [017-tax-provider-integration.md](017-tax-provider-integration.md) - Tax Provider Integration
- [018-tax-api.md](018-tax-api.md) - Tax API
- [019-tax-events.md](019-tax-events.md) - Tax Events
- [020-tax-ai-capabilities.md](020-tax-ai-capabilities.md) - Tax AI Capabilities
- [021-future-roadmap.md](021-future-roadmap.md) - Future Roadmap

## Design Authority

Tax owns jurisdiction, registration, rule, assessment, exemption, withholding, filing, remittance, and tax evidence. Orders, Invoicing, Payments, Vendor/Partner Finance, Fees, Refunds, Disputes, and Payouts provide source facts; the General Ledger records tax payable/recoverable effects.

## Implementation Sequence

1. Approve launch jurisdictions, entities, registrations, tax types, products, currencies, authorities, and providers.
2. Implement jurisdiction, registration, exemption, calculation, rounding, invoice, withholding, and filing rules.
3. Connect orders, invoices, payments, fees, vendor/partner settlement, refunds, disputes, payouts, and GL mappings.
4. Implement remittance, reconciliation, reporting, APIs, events, security, audit, and governed AI assistance.
