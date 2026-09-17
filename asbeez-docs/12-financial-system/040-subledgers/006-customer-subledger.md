# Customer Subledger

> **Document:** 12-financial-system/040-subledgers/006-customer-subledger.md

---

## Purpose

The Customer Subledger records customer-level receivables, payments, credits, refunds, disputes, orders, and approved customer obligations. It supports invoice and payment allocation without becoming the source of product, order, or identity truth.

## Required Detail

Customer reference, order/invoice/payment IDs, gross and net amounts, tax, discounts, refunds, chargebacks, currency, country, legal entity, due date, status, allocation, and source/policy versions.

## Rules

Customer payment received, customer receivable, customer credit, and AsBeez revenue are distinct states. A refund references the original payment and order; a chargeback remains identifiable even after resolution. Customer balances reconcile to invoices, payment provider records, refund records, and GL control accounts.

## Privacy

The subledger uses stable customer references and minimizes personal data. Payment credentials are represented by provider tokens, never stored raw.

## Related Documents

- [000-index.md](000-index.md)
- [010-payment-provider-subledger.md](010-payment-provider-subledger.md)
- [011-refund-subledger.md](011-refund-subledger.md)
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md)
