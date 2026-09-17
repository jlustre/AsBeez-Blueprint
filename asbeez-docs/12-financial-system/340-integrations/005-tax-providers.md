# Tax Providers

> **Document:** 12-financial-system/340-integrations/005-tax-providers.md

---

## Purpose

Tax-provider integrations support jurisdiction lookup, address validation, classification, calculation, exemption, filing, remittance, and tax reporting evidence.

## Adapter Contract

Map source transaction, entity, country/jurisdiction, address snapshot, customer/vendor classification, product/service code, taxable base, tax type/code/rate, exemption, rounding, provider calculation ID, and response version. Preserve input and response snapshots.

## Rules

Provider calculation is evidence until accepted under effective AsBeez policy and reconciled. Tax collected/withheld is not revenue. Timeouts, stale rates, provider disagreement, and changed registrations become explicit exceptions. Provider credentials and tax data are minimized, encrypted, and access-controlled.

## Related Documents

- [000-index.md](000-index.md)
- [006-fx-rate-providers.md](006-fx-rate-providers.md)
- [015-integration-security.md](015-integration-security.md)
- [../160-taxes/001-overview.md](../160-taxes/001-overview.md)
