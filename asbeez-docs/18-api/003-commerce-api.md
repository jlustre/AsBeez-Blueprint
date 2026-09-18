# Commerce API

## Purpose

The Commerce API supports catalog discovery, product/service detail, vendor storefronts, pricing, promotions, carts, orders, order status, fulfillment/delivery evidence, reviews, and customer support references.

## Queries

Expose only authorized products, prices, availability, vendor information, customer-safe order state, invoices/payment links, fulfillment, tax estimate, and refund/dispute options. Preserve currency, country, entity, terms, pricing, tax, and policy snapshots for committed orders.

## Commands

Create/update approved catalog items, cart/order, promotion, cancellation, fulfillment update, review, and support request. Server calculates totals, availability, tax treatment, fees, eligibility, and allocations; clients cannot submit final accounting values.

## Financial Integration

Order events initiate payment, invoice, tax, settlement, vendor/partner entitlement, rewards, and ledger workflows through domain APIs. Commerce status does not prove payment, revenue, settlement, or payout. Refunds and chargebacks create explicit compensating effects.

## Related Documents

- [index.md](index.md)
- [004-vendor-api.md](004-vendor-api.md)
- [005-member-api.md](005-member-api.md)
- [../12-financial-system/310-api/011-payment-api.md](../12-financial-system/310-api/011-payment-api.md)
