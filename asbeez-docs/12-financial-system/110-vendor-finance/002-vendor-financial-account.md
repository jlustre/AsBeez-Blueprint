# Vendor Financial Account

> **Document:** 12-financial-system/110-vendor-finance/002-vendor-financial-account.md

---

## Purpose

The Vendor Financial Account is the controlled financial identity and payable view for a verified vendor within an AsBeez legal entity, country, currency, and settlement program.

## Required Data

Vendor ID, legal/business identity, tax status, legal entity, country, settlement currency, bank/provider destination reference, account status, fee plan, reserve plan, statement scope, compliance status, and effective policy versions.

## Rules

- account creation does not create earnings, payable, revenue, or payout;
- one vendor may have separate entity/country/currency settlement accounts;
- destination changes require verification and cooling-off controls;
- suspended or non-compliant accounts may accumulate controlled payable but cannot receive payout; and
- vendor identity and financial references are separated from customer payment credentials.

## Lifecycle

```text
Pending -> Verified -> Active -> Restricted -> Suspended -> Closed
```

## Related Documents

- [000-index.md](000-index.md)
- [003-vendor-earnings.md](003-vendor-earnings.md)
- [009-vendor-payouts.md](009-vendor-payouts.md)
- [016-vendor-api.md](016-vendor-api.md)
