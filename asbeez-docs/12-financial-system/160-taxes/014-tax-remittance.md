# Tax Remittance

> **Document:** 12-financial-system/160-taxes/014-tax-remittance.md

---

## Purpose

Tax remittance records approved payments of collected, withheld, or assessed tax to the relevant authority.

## Required Data

Authority, jurisdiction, entity, tax type, filing period, assessment population, amount/currency, bank/provider reference, due date, approval, submission, payment confirmation, and reconciliation.

## Rules

Remittance is not revenue, settlement, payout, or a correction of source invoices. Late, failed, short, duplicate, or returned remittances create explicit exceptions and interest/penalty treatment under policy. Payments reconcile to tax payable accounts, filings, bank evidence, and assessments.

## States

```text
Prepared -> Approved -> Scheduled -> Submitted -> Confirmed
Prepared -> Rejected | Returned | Failed
```

The confirmed remittance retains authority receipt, payment provider/bank reference, period, amount, currency, and reconciliation evidence.

## Related Documents

- [000-index.md](000-index.md)
- [007-withholding-tax.md](007-withholding-tax.md)
- [013-tax-invoices.md](013-tax-invoices.md)
- [016-tax-reconciliation.md](016-tax-reconciliation.md)
