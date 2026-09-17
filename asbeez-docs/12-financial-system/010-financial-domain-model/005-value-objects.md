# Value Objects

## Purpose

Value objects describe financial meaning without independent identity. They are immutable, compared by value, validated at construction, and serialized with their complete precision and currency context.

## Catalog

| Value object | Required meaning |
| --- | --- |
| Money | minor-unit amount plus ISO currency |
| Currency | code, exponent, and jurisdiction rules |
| MonetaryAmount | amount with scale and rounding policy |
| PercentageRate | bounded rate with effective dates |
| ExchangeRate | source, base, quote, rate, timestamp |
| AccountReference | account ID and account type |
| PartyReference | customer, member, vendor, partner, or company ID |
| Jurisdiction | country/region and tax authority context |
| TaxBreakdown | taxable base, rate, amount, and rule reference |
| PaymentMethodReference | provider token and method type |
| LedgerReference | journal or entry linkage |
| IdempotencyKey | caller scope plus unique request key |
| EffectivePeriod | inclusive start and exclusive end |

## Monetary Rules

Money is never represented with floating-point arithmetic. Addition and subtraction require matching currencies. Conversion requires an approved rate and records both source and target amounts. Rounding occurs at a documented boundary and the rounding difference is observable.

## Equality and Serialization

Value objects are immutable. Equality includes all fields that affect financial meaning, including currency, scale, rate source, and effective time. Serialized values must preserve minor units and must not silently coerce precision.

## Related Documents

- [006-domain-services.md](006-domain-services.md)
- [011-invariants.md](011-invariants.md)
