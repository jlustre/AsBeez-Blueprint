# Partner Adjustments

> **Document:** 12-financial-system/120-partner-finance/011-partner-adjustments.md

---

## Purpose

Partner adjustments correct commission, bonus, incentive, fee, reserve, hold, settlement, tax, or payout treatment without deleting the original partner event.

## Sources

Refund, chargeback, fraud, duplicate, attribution dispute, policy error, country restriction, service failure, expiry, tax correction, payout return, or approved manual correction.

## Required Evidence

Original event and source order/service, partner/program, original/corrected amount or unit, currency, country/entity, reason, policy versions, preparer, approver, effective/posting dates, and reversal/compensating reference.

## Rules

Adjustments are idempotent and separately reported. They cannot create a payable without qualification, funding, classification, and settlement approval. Member/customer, vendor, reward, tax, and revenue effects are evaluated through their owning workflows.

## Related Documents

- [000-index.md](000-index.md)
- [004-partner-commissions.md](004-partner-commissions.md)
- [009-partner-settlement.md](009-partner-settlement.md)
- [013-partner-reconciliation.md](013-partner-reconciliation.md)
