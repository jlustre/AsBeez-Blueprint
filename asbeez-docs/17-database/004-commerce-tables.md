# Commerce Tables

## Purpose

Commerce tables store marketplace products/services, vendors, partners, customers, orders, order lines, pricing, promotions, fulfillment/delivery evidence, invoices, and customer interactions.

## Table Groups

`vendors`, `vendor_products`, `services`, `categories`, `orders`, `order_lines`, `order_participants`, `prices`, `discounts`, `coupons`, `subscriptions`, `fulfillment`, `digital_deliveries`, `customer_reviews`, and source-event references.

## Financial Boundary

Commerce records are source facts, not the General Ledger. Order totals, payment, GMV, tax, fees, vendor/partner entitlement, rewards, refunds, and recognized revenue remain distinct and link to approved financial workflows. Historical order/pricing/tax/customer snapshots are immutable after the relevant business event.

## Integrity and Privacy

Enforce vendor/customer ownership, order-line totals, currency, tax jurisdiction, status transitions, idempotent order references, country/entity scope, product restrictions, consent, privacy, retention, and audit. Commerce tables cannot write wallet balances or journal lines directly.

## Related Documents

- [index.md](index.md)
- [005-rewards-tables.md](005-rewards-tables.md)
- [007-financial-tables.md](007-financial-tables.md)
- [../12-financial-system/100-orders-and-revenue/001-overview.md](../12-financial-system/100-orders-and-revenue/001-overview.md)
