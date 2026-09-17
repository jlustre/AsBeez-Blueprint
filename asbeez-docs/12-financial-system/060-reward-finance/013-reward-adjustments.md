# Reward Adjustments

> **Document:** 12-financial-system/060-reward-finance/013-reward-adjustments.md

---

## Purpose

Reward adjustments correct RP, ABC, AHC, liability, expense, reserve, redemption, or payout treatment without deleting the original reward event or financial record.

## Adjustment Sources

- refund, return, cancellation, or chargeback;
- fraud, duplicate, abuse, or invalid qualification;
- provider or matrix correction;
- policy or country configuration error;
- expiry, forfeiture, redemption, or failed payout; and
- approved manual correction with evidence.

## Required Evidence

Original event, affected member/ABC/matrix/program, order/payment/settlement, reason code, rule/policy versions, original and corrected quantities/amounts, currency, country, approver, effective/posting dates, and reversal or compensating journal reference.

## Rules

Adjustments are idempotent, explainable, and separately reported. An adjustment cannot create a new liability without classification, funding, and account mapping. Member communication and dispute handling follow the governing reward and legal policy.

## Related Documents

- [000-index.md](000-index.md)
- [003-reward-point-accounting.md](003-reward-point-accounting.md)
- [008-reward-liabilities.md](008-reward-liabilities.md)
- [014-reward-reconciliation.md](014-reward-reconciliation.md)
