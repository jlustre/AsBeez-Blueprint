# Payment Reconciliation

> **Document:** 12-financial-system/070-payments/018-payment-reconciliation.md

---

## Purpose

Payment reconciliation matches AsBeez intents, attempts, authorizations, captures, refunds, disputes, provider settlements, fees, bank evidence, customer records, order allocation, and GL clearing/control accounts.

## Required Checks

- one provider event maps to one AsBeez payment effect;
- captured amount and currency match source/order allocation;
- refunds and chargebacks reference captured payments;
- provider fees and net settlement agree to evidence;
- bank/processor settlement agrees to provider subledger;
- customer, vendor, partner, tax, reserve, and reward downstream links exist where applicable; and
- failed/unknown outcomes remain exceptions until resolved.

## Outcomes

Matched, timing difference, amount difference, duplicate, missing source, unknown provider event, currency mismatch, fraud/dispute, or approved adjustment. Every outcome has owner, age, evidence, and resolution.

## Related Documents

- [000-index.md](000-index.md)
- [007-payment-settlement.md](007-payment-settlement.md)
- [010-payment-provider-subledger.md](../040-subledgers/010-payment-provider-subledger.md)
- [019-payment-security.md](019-payment-security.md)
