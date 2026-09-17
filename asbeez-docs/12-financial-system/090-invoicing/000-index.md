# Invoicing

> **Document:** 12-financial-system/090-invoicing/000-index.md

---

## Purpose

This section defines invoicing capabilities, including invoice types, numbering, generation, line items, tax, discounts, adjustments, credit and debit notes, payment status, delivery, recurring invoices, localization, compliance, APIs, events, and AI capabilities.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-invoice-domain-model.md](002-invoice-domain-model.md) - Invoice Domain Model
- [003-invoice-types.md](003-invoice-types.md) - Invoice Types
- [004-invoice-numbering.md](004-invoice-numbering.md) - Invoice Numbering
- [005-invoice-generation.md](005-invoice-generation.md) - Invoice Generation
- [006-invoice-line-items.md](006-invoice-line-items.md) - Invoice Line Items
- [007-invoice-tax-calculation.md](007-invoice-tax-calculation.md) - Invoice Tax Calculation
- [008-invoice-discounts.md](008-invoice-discounts.md) - Invoice Discounts
- [009-invoice-adjustments.md](009-invoice-adjustments.md) - Invoice Adjustments
- [010-credit-notes.md](010-credit-notes.md) - Credit Notes
- [011-debit-notes.md](011-debit-notes.md) - Debit Notes
- [012-invoice-payment-status.md](012-invoice-payment-status.md) - Invoice Payment Status
- [013-invoice-delivery.md](013-invoice-delivery.md) - Invoice Delivery
- [014-recurring-invoices.md](014-recurring-invoices.md) - Recurring Invoices
- [015-invoice-localization.md](015-invoice-localization.md) - Invoice Localization
- [016-invoice-compliance.md](016-invoice-compliance.md) - Invoice Compliance
- [017-invoice-api.md](017-invoice-api.md) - Invoice API
- [018-invoice-events.md](018-invoice-events.md) - Invoice Events
- [019-invoice-ai-capabilities.md](019-invoice-ai-capabilities.md) - Invoice AI Capabilities
- [020-future-roadmap.md](020-future-roadmap.md) - Future Roadmap

## Design Authority

Invoicing owns formal amounts-due documents and payment allocation status. Marketplace/Orders own commercial source facts, Payments own funding state, Tax owns tax assessment, Customer/Vendor/Partner subledgers own detailed obligations, Reward Finance owns reward financial treatment, and the General Ledger owns posted monetary effects.

## Implementation Sequence

1. Approve invoice types, entities, countries, currencies, numbering, tax, and compliance requirements.
2. Implement immutable drafts, line calculations, issue/version, delivery, and payment status.
3. Implement discounts, adjustments, credit/debit notes, recurring schedules, localization, and retention.
4. Connect orders, payments, tax, customer/vendor/partner subledgers, rewards, settlement, and GL mappings.
5. Implement secure APIs, events, reconciliation, audit, reporting, and governed AI assistance.
