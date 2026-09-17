# Reserve Subledger

> **Document:** 12-financial-system/040-subledgers/012-reserve-subledger.md

---

## Purpose

The Reserve Subledger records amounts held back to protect against refunds, chargebacks, fraud, vendor/partner risk, reward liability, liquidity needs, or approved country requirements.

## Required Detail

Reserve ID, type, funding source, beneficiary or exposure, basis, rate/amount, currency, country, legal entity, start and release conditions, hold period, owner, approval, release, utilization, and reconciliation status.

## Rules

Reserve funds are not revenue, free cash, or an unallocated liability. A reserve must have a documented exposure model and release or utilization rule. Release creates a new event and may create a payable or wallet availability change only after all controls pass.

## Reconciliation

Reserve balances reconcile to the underlying exposure population, reserve GL accounts, settlement holds, and treasury or provider evidence. A reserve cannot be released twice or used for an unrelated program.

## Related Documents

- [000-index.md](000-index.md)
- [005-vendor-subledger.md](005-vendor-subledger.md)
- [011-refund-subledger.md](011-refund-subledger.md)
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md)
