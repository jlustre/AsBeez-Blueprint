# Overview

> **Document:** 12-financial-system/130-refunds-returns-and-cancellations/001-overview.md

---

## Purpose

Refunds, Returns, and Cancellations govern how AsBeez reverses or adjusts customer consideration, invoices, payments, vendor/partner obligations, tax, rewards, reserves, wallets, and revenue without rewriting history.

## AsBeez Boundary

A refund returns or credits customer value; a return changes fulfillment/order facts; a cancellation prevents or stops an obligation. They are related but distinct workflows. Each downstream effect is evaluated by its owning policy.

## Principles

- original order, payment, invoice, RP, ABC, matrix, AHC, vendor, partner, settlement, and payout records remain immutable;
- refund eligibility, amount, method, timing, tax, fee, and reward effects are explicit;
- partial refunds identify affected lines and cannot exceed refundable value;
- provider, wallet, credit-note, and settlement states are reconciled separately;
- fraud and abuse controls never silently deny lawful rights; and
- every correction is idempotent, attributable, approved, and auditable.

## Related Documents

- [000-index.md](000-index.md)
- [002-refund-domain-model.md](002-refund-domain-model.md)
- [003-refund-eligibility.md](003-refund-eligibility.md)
- [013-refund-reconciliation.md](013-refund-reconciliation.md)
