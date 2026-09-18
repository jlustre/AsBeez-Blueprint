# Rewards API

## Purpose

The Rewards API exposes reward programs, qualifying activity, RP, ABC, AHC, referral status, matrix-related views, distributions, expiry, reversals, holds, and approved conversion or payout requests.

## Financial Boundary

Rewards and Matrix contexts own qualification, placement, and distribution mechanics. Reward Finance owns approved monetary treatment. RP/ABC/AHC are not money, currency, equity, ownership, investment, or guaranteed returns unless jurisdiction-specific legal approval expressly supports that classification.

## Rules

Every reward result identifies qualifying source, policy/version, country, status, expiry, reversal/hold reason, and liability context. Refunds, chargebacks, fraud, and policy breaches can reverse or suspend rewards through auditable events. APIs cannot directly convert units, create wallet value, alter qualification, or bypass country/legal controls.

## Related Documents

- [index.md](index.md)
- [005-member-api.md](005-member-api.md)
- [007-wallet-api.md](007-wallet-api.md)
- [../12-financial-system/060-reward-finance/001-overview.md](../12-financial-system/060-reward-finance/001-overview.md)
- [../14-legal-compliance/003-loyalty-rewards-compliance.md](../14-legal-compliance/003-loyalty-rewards-compliance.md)
