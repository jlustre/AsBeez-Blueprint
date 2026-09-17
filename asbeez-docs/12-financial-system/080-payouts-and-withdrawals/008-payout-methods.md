# Payout Methods

> **Document:** 12-financial-system/080-payouts-and-withdrawals/008-payout-methods.md

---

## Purpose

Payout methods define approved channels for sending monetary value to a verified recipient.

## Method Families

- bank account or local bank rail;
- regulated payment provider;
- approved digital wallet;
- card or prepaid destination where permitted; and
- controlled alternative method subject to country approval.

## Required Data

Method ID/type, provider, recipient ownership, tokenized destination, country, currency, verification state, limits, fees, tax requirements, risk state, and effective time.

## Rules

Destination changes require re-verification and may impose a cooling-off hold. A payout method cannot accept RP, ABC, AHC, or unclassified reward quantities as money. Provider support does not override country, compliance, or account ownership rules.

## Related Documents

- [000-index.md](000-index.md)
- [004-withdrawal-validation.md](004-withdrawal-validation.md)
- [016-payout-compliance.md](016-payout-compliance.md)
- [017-payout-security.md](017-payout-security.md)
