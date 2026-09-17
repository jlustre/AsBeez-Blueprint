# Ledger To Subledger

> **Document:** 12-financial-system/220-reconciliation/003-ledger-to-subledger.md

---

## Purpose

Ledger-to-subledger reconciliation proves that detailed wallet, customer, vendor, partner, commission, reward, tax, payment, refund, reserve, and fund records agree to General Ledger control accounts.

## Required Checks

- population count and monetary totals;
- account, entity, country, currency, period, and dimension mapping;
- source event, order/payment/invoice/settlement, and policy attribution;
- pending, held, reserved, disputed, and available states;
- reversals, adjustments, refunds, chargebacks, expiry, and payout effects; and
- control-account balance and reporting projection agreement.

## Rules

A balanced GL total does not prove detailed attribution. Missing vendor, partner, member, reward, country, tax, or source links are exceptions even when amounts agree.

## Related Documents

- [000-index.md](000-index.md)
- [002-reconciliation-domain-model.md](002-reconciliation-domain-model.md)
- [006-wallet-reconciliation.md](006-wallet-reconciliation.md)
- [008-vendor-reconciliation.md](008-vendor-reconciliation.md)
