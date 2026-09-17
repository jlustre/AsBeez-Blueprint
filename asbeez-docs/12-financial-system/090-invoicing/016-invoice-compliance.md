# Invoice Compliance

> **Document:** 12-financial-system/090-invoicing/016-invoice-compliance.md

---

## Purpose

Invoice compliance ensures issued documents satisfy country, tax, consumer, accounting, privacy, retention, payment, and audit requirements.

## Controls

- approved issuer/entity and tax registration;
- valid numbering, invoice type, date, currency, and required fields;
- accurate tax determination and exemption evidence;
- immutable issue/version and credit/debit note linkage;
- payment terms, consumer disclosures, and delivery evidence;
- privacy, access, retention, and legal hold; and
- reconciliation to receivables, payments, tax, settlement, and GL.

## Reward Boundary

An invoice cannot present RP, ABC, AHC, matrix placement, or referral status as cash, income, company ownership, or guaranteed payout. A reward-related amount appears only when an approved monetary conversion, billable service, or obligation is legally and financially classified.

## Failure Behavior

Missing or stale legal, tax, numbering, source, or recipient facts block issuance or require review. Compliance decisions retain policy version, evidence, reason, reviewer/system, and effective date.

## Related Documents

- [000-index.md](000-index.md)
- [007-invoice-tax-calculation.md](007-invoice-tax-calculation.md)
- [015-invoice-localization.md](015-invoice-localization.md)
- [017-invoice-api.md](017-invoice-api.md)
