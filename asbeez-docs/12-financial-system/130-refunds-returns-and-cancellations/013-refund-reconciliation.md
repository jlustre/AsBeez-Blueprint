# Refund Reconciliation

> **Document:** 12-financial-system/130-refunds-returns-and-cancellations/013-refund-reconciliation.md

---

## Purpose

Refund reconciliation proves that refund requests, eligibility, approvals, payment/provider execution, invoices/credit notes, wallets, tax, vendor/partner adjustments, rewards, reserves, and General Ledger effects agree.

## Required Checks

- refund amount and currency match eligible captured/invoiced scope;
- provider, bank, credit-note, or wallet execution has evidence;
- cumulative full/partial refunds do not exceed source;
- customer, vendor, partner, tax, reward, reserve, revenue, and payout links exist where applicable;
- cancellation and return status agree to refund decision; and
- failed/unknown/duplicate outcomes remain exceptions.

## Outcomes

Matched, timing difference, amount difference, duplicate, missing source, provider mismatch, tax mismatch, downstream adjustment missing, fraud/dispute, or approved correction. Every exception has owner, age, evidence, severity, and resolution.

## Related Documents

- [000-index.md](000-index.md)
- [005-partial-refunds.md](005-partial-refunds.md)
- [008-refund-payment-routing.md](008-refund-payment-routing.md)
- [014-refund-fraud-controls.md](014-refund-fraud-controls.md)
