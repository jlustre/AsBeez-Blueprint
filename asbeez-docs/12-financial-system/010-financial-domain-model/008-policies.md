# Policies

## Purpose

Policies are changeable business decisions applied by a domain service or aggregate. Every policy that affects money or eligibility is versioned, effective-dated, jurisdiction-aware, and auditable.

## Policy Catalog

| Policy | Determines |
| --- | --- |
| Payment Acceptance | supported methods, risk gates, capture conditions |
| Refund and Chargeback | eligibility, deadlines, reversal scope, reserve treatment |
| Revenue Recognition | performance obligation and recognition timing |
| Settlement | window, hold, reserve, fee, tax, and approval requirements |
| Payout | allowed destination, limits, review, retry, and cancellation |
| Wallet Availability | pending, held, restricted, and spendable balance rules |
| FX | permitted rate source, timestamp, spread, and rounding |
| Tax | jurisdiction, exemption, collection, withholding, remittance |
| Reward Accounting | liability recognition, release, redemption, expiry, reversal |
| Financial Period | posting, close, reopen, and adjustment authority |
| Approval | threshold, role separation, escalation, emergency access |

For AsBeez rewards, the policy must separately define: the qualifying marketplace event, the RP rule, the ABC creation rule, matrix/AHC rule, monetary classification if any, funding account, liability ceiling, refund/chargeback response, country availability, and payout or redemption conditions.

## Policy Evaluation

The evaluation result includes the decision, policy ID, version, effective time, input facts, explanatory reason, and any required approval. A policy must fail closed when required facts are missing or stale.

## Related Documents

- [006-domain-services.md](006-domain-services.md)
- [009-specifications.md](009-specifications.md)
- [013-ubiquitous-language.md](013-ubiquitous-language.md)
