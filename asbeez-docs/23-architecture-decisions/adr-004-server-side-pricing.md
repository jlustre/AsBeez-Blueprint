# ADR-004: Server-Side Pricing

## Status

Accepted.

## Context

Client-provided prices, discounts, tax, fees, currency, or allocations can be stale or manipulated and cannot be trusted for orders, invoices, payments, refunds, rewards, vendor settlement, or ledger effects.

## Decision

The server is authoritative for product price, promotion, discount, tax calculation/input, fees, commissions, currency, rounding, availability, eligibility, vendor/partner allocation, and payable totals. The client may display and request values but cannot define final financial amounts.

## Consequences

Checkout may require recalculation and user confirmation when price, inventory, tax, currency, promotion, policy, or country context changes. Server-side calculation improves integrity but requires versioned pricing, tax/FX, promotion, and allocation services with clear error/stale-state handling.

## Controls

Snapshot price/tax/fee/promotion/currency/policy at commitment; use integer minor units and deterministic rounding; validate country/entity and authorization; protect against replay and duplicate commands; disclose changes; and reconcile allocations, invoices, payments, refunds, vendor/partner entitlements, and ledger effects.

## Related Documents

- [index.md](index.md)
- [adr-001-one-active-cart-per-country.md](adr-001-one-active-cart-per-country.md)
- [adr-002-multi-vendor-checkout.md](adr-002-multi-vendor-checkout.md)
- [../12-financial-system/310-api/004-request-response-standards.md](../12-financial-system/310-api/004-request-response-standards.md)
