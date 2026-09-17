# Wallet Reserves

> **Document:** 12-financial-system/050-member-wallets/010-wallet-reserves.md

---

## Purpose

Wallet reserves represent value restricted against a known exposure such as refund, chargeback, fraud, vendor/partner risk, reward liability, or payout risk. A reserve is not a fee, revenue, or freely spendable balance.

## Required Data

Reserve ID, wallet, amount/unit, currency, exposure, funding source, basis, rate or calculation, country, legal entity, start date, release condition, owner, approval, and release/utilization history.

## Rules

Reserve rules are effective-dated and policy-specific. Release requires the exposure to pass review and creates a new wallet/subledger event. Reserve utilization references the underlying loss or obligation. A reserve cannot be used for an unrelated member, program, vendor, or country.

## Related Documents

- [000-index.md](000-index.md)
- [009-wallet-holds.md](009-wallet-holds.md)
- [012-wallet-reconciliation.md](012-wallet-reconciliation.md)
- [016-wallet-compliance.md](016-wallet-compliance.md)
