# ADR-002: Multi-Vendor Checkout

## Status

Accepted, subject to payment, tax, fulfillment, vendor agreement, and country readiness.

## Context

Customers need one convenient checkout for products from multiple approved vendors, while each vendor may have separate fees, tax treatment, fulfillment, settlement, refunds, disputes, reserves, and payout obligations.

## Decision

Support a single customer checkout that creates one customer order with vendor-scoped allocations, order lines, fulfillment groups, payment allocation, tax, fees, vendor/partner entitlement, reward treatment, and settlement references. The checkout is country/currency/entity compatible and uses server-side pricing and policy snapshots.

## Consequences

The customer receives one checkout experience, while vendors receive scoped order/settlement views. Partial fulfillment, partial refund, vendor cancellation, tax differences, provider failure, and dispute liability require explicit allocation and compensation workflows. Payment capture, revenue recognition, vendor entitlement, and payout remain separate states.

## Controls

Validate vendor/product eligibility, country, currency, tax, payment method, fees, reserves, fraud/risk, fulfillment, and idempotency before commit. Persist source snapshots and allocation totals; ensure customer total, vendor allocations, tax, fees, discounts, and rounding reconcile. No vendor or client can alter another allocation directly.

## Related Documents

- [index.md](index.md)
- [adr-001-one-active-cart-per-country.md](adr-001-one-active-cart-per-country.md)
- [adr-004-server-side-pricing.md](adr-004-server-side-pricing.md)
- [../12-financial-system/100-orders-and-revenue/001-overview.md](../12-financial-system/100-orders-and-revenue/001-overview.md)
