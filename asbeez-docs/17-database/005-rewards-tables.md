# Rewards Tables

## Purpose

Rewards tables record program activity, qualification, RP, ABC, AHC, distributions, referrals, expiry, reversals, and reward audit history without treating reward units as money by default.

## Table Groups

`reward_programs`, `reward_policies`, `reward_activities`, `reward_qualifications`, `rp_accounts`, `rp_transactions`, `abc_records`, `ahc_accounts`, `ahc_transactions`, `reward_distributions`, `referrals`, `reward_holds`, `reward_expirations`, `reward_reversals`, and policy/version references.

## Rules

Reward records link to qualifying commerce, order/payment/refund/chargeback events, member/country, policy version, and matrix references. RP/ABC/AHC remain separate from monetary wallet balances. A conversion or payout requires an approved policy and distinct financial effect; refund/fraud/chargeback changes create auditable reversals or holds.

## Integrity

Use append-only transaction history, aggregate versions, idempotency, qualification constraints, country/policy scope, expiry rules, maximum liability, reserve references, privacy, and reconciliation to approved reward-finance treatment. Reward tables do not post journals directly.

## Related Documents

- [index.md](index.md)
- [006-matrix-tables.md](006-matrix-tables.md)
- [007-financial-tables.md](007-financial-tables.md)
- [../12-financial-system/060-reward-finance/001-overview.md](../12-financial-system/060-reward-finance/001-overview.md)
