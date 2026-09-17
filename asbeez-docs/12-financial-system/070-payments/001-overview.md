# Overview

> **Document:** 12-financial-system/070-payments/001-overview.md

---

## Purpose

Payments records how customer funds are requested, authorized, captured, refunded, disputed, settled by providers, and reconciled for AsBeez marketplace activity.

## AsBeez Boundary

Payment capture is evidence of funding, not automatic revenue recognition, vendor settlement, reward issuance, ABC creation, AHC distribution, or payout. Those consequences are separate workflows driven by order, tax, settlement, reward, and accounting policies.

## Principles

- provider state is mapped into explicit AsBeez payment state;
- every attempt, callback, and command is idempotent;
- authorization is not capture and capture is not provider settlement;
- refunds and chargebacks preserve original history and propagate downstream effects;
- payment amounts carry currency, country, entity, fees, taxes, and source references;
- raw payment credentials are never stored; and
- every final state reconciles to provider evidence and the General Ledger.

## Related Documents

- [000-index.md](000-index.md)
- [002-payment-domain-model.md](002-payment-domain-model.md)
- [006-payment-capture.md](006-payment-capture.md)
- [018-payment-reconciliation.md](018-payment-reconciliation.md)
