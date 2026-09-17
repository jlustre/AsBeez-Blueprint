# Reward Points Subledger

> **Document:** 12-financial-system/040-subledgers/003-reward-points-subledger.md

---

## Purpose

The Reward Points (RP) Subledger records the non-money reward unit earned, adjusted, expired, or consumed under approved marketplace and program rules.

## Sources and States

RP events reference the order, qualifying purchase, member/customer, vendor, campaign or referral program, country, rule version, and fraud/compliance status. Typical states are earned, pending, validated, available, adjusted, expired, reversed, and consumed for an approved ABC qualification.

## Rules

- RP cannot be created from an unverified or cancelled source event.
- Refunds, chargebacks, fraud, and policy breaches create explicit reversal or hold events.
- RP is not money, cash, equity, or a withdrawal balance.
- RP conversion into ABC eligibility is recorded as a new event and does not erase RP history.
- Any monetary consequence requires separate Reward Accounting classification and GL mapping.

## Reconciliation

RP totals reconcile to qualifying marketplace events, not directly to cash. The subledger must report earned, pending, reversed, expired, consumed, and outstanding quantities by member, country, vendor/program, and rule version.

## Related Documents

- [000-index.md](000-index.md)
- [004-ahc-subledger.md](004-ahc-subledger.md)
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md)
