# Overview

> **Document:** 12-financial-system/090-invoicing/001-overview.md

---

## Purpose

Invoicing creates formal, jurisdiction-aware statements of amounts due for AsBeez customers, vendors, partners, members, or other approved parties.

## AsBeez Boundary

An invoice describes an obligation; it is not a payment, cash receipt, revenue recognition, vendor settlement, reward event, or payout. Payment, tax, order, settlement, rewards, and General Ledger workflows consume invoice facts through explicit references.

## Principles

- invoice totals are server-calculated and reproducible;
- each invoice has one issuer, recipient, entity, country, currency, and numbering scope;
- tax, discounts, fees, vendor amounts, partner amounts, and reward effects are separately identified;
- issued invoices and notes are immutable; corrections use credit/debit notes or controlled adjustments;
- payment status is evidence-linked and never inferred from delivery; and
- legal, localization, retention, and disclosure rules are effective-dated.

## Related Documents

- [000-index.md](000-index.md)
- [002-invoice-domain-model.md](002-invoice-domain-model.md)
- [005-invoice-generation.md](005-invoice-generation.md)
- [016-invoice-compliance.md](016-invoice-compliance.md)
