# Reward Point Accounting

> **Document:** 12-financial-system/060-reward-finance/003-reward-point-accounting.md

---

## Purpose

RP accounting records the quantity and financial evaluation of Reward Points earned from qualifying AsBeez marketplace activity.

## Source and States

Each RP event references order, line, payment/settlement status, customer/member, vendor, country, campaign/referral program, rule version, and fraud/compliance state. States include pending, earned, validated, available, consumed for ABC eligibility, adjusted, expired, reversed, and blocked.

## Financial Treatment

RP is a non-money program unit. Issuance, accumulation, and consumption do not create a journal entry by default. If an approved jurisdictional policy creates a financial consequence, Reward Finance records the classification, funding source, measurement, liability ceiling, account mapping, and reversal conditions separately from RP quantity.

## Refunds and Chargebacks

Refunds, chargebacks, fraud, and cancelled qualifying activity produce explicit RP reversal, hold, or adjustment events. Existing RP history is never deleted, and ABC eligibility is re-evaluated through a separate policy workflow.

## Related Documents

- [000-index.md](000-index.md)
- [002-reward-financial-model.md](002-reward-financial-model.md)
- [005-abc-creation-accounting.md](005-abc-creation-accounting.md)
- [014-reward-reconciliation.md](014-reward-reconciliation.md)
