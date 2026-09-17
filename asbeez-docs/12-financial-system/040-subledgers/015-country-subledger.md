# Country Subledger

> **Document:** 12-financial-system/040-subledgers/015-country-subledger.md

---

## Purpose

The Country Subledger groups financial and program records by country, jurisdiction, legal entity, currency, tax authority, payment environment, reward availability, and local settlement rules.

## Required Detail

Country and jurisdiction, legal entity, local account mapping, transaction/settlement currency, tax rules, payment provider, vendor/member eligibility, reward availability, reserve policy, payout restrictions, reporting period, and configuration versions.

## Rules

Country scope is not inferred only from a user profile. The applicable country for an order, vendor, payment, tax, reward, wallet, and payout is determined by the relevant policy and retained as historical evidence. A country may be blocked from a reward or payout feature until Legal, Finance, Tax, and Compliance approve it.

## Consolidation

Local totals reconcile to local GL control accounts and map to global reporting categories without erasing local statutory detail, currency, tax, or policy evidence.

## Related Documents

- [000-index.md](000-index.md)
- [003-reward-points-subledger.md](003-reward-points-subledger.md)
- [009-tax-subledger.md](009-tax-subledger.md)
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md)
