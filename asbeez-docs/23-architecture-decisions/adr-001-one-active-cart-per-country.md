# ADR-001: One Active Cart Per Country

## Status

Accepted, subject to country/entity and legal review.

## Context

Cart pricing, currency, tax, payment, promotions, fulfillment, rewards, and country rules must remain coherent before checkout. A member or customer may interact across countries, but mixing incompatible country policies in one cart creates ambiguity in currency, tax, provider, terms, inventory, and financial allocation.

## Decision

Maintain at most one active cart per customer/member and assigned country scope. A cart has explicit country, legal entity where applicable, currency, pricing/policy version, tax context, and expiration. Cross-country products or participation may be browsed, but checkout creates a country-compatible cart or requires a deliberate country/context selection.

## Consequences

This simplifies pricing, tax, payment routing, reward qualification, order allocation, and reporting. Users may need separate carts for different country contexts. Existing carts are revalidated when country, currency, product, price, tax, or policy changes; stale carts cannot silently checkout.

## Controls

Cart commands are authenticated/authorized, versioned, idempotent, server-validated, and auditable. Checkout snapshots price/tax/currency/entity/policy. Country assignment is platform state and does not prove legal or tax residence; legal/compliance rules can block checkout.

## Related Documents

- [index.md](index.md)
- [adr-002-multi-vendor-checkout.md](adr-002-multi-vendor-checkout.md)
- [adr-004-server-side-pricing.md](adr-004-server-side-pricing.md)
- [../19-ui-ux/003-customer-website.md](../19-ui-ux/003-customer-website.md)
