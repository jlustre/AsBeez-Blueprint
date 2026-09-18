# System Context

## Purpose

The AsBeez system context describes external actors, channels, core platform capabilities, financial authorities, providers, and governance boundaries.

## Context

```text
Customers/Members/Vendors/Partners/Operators
	-> Web, Mobile, Admin, Partner, Provider APIs
	-> Commerce, Membership, Marketplace, Rewards, Platform Services
	-> Payments, Wallets, Billing, Settlement, Payouts, Tax, FX, Treasury
	-> General Ledger, Reconciliation, Reporting, Audit, Controls
```

External payment/bank/payout/tax/FX/risk/identity providers, accounting/ERP, BI/warehouse, notification, and AI providers connect through adapters and versioned contracts. Legal, compliance, security, operations, and audit constrain every context.

## Authority Rules

External systems provide evidence or exchange data; they do not directly write AsBeez financial truth. Channels cannot write balances or posted journals. AI and projections are advisory/derived. The General Ledger, policy owners, authorization, reconciliation, and audit controls remain authoritative.

## Related Documents

- [index.md](index.md)
- [004-bounded-contexts.md](004-bounded-contexts.md)
- [005-event-driven-architecture.md](005-event-driven-architecture.md)
- [../12-financial-system/290-architecture/001-system-architecture.md](../12-financial-system/290-architecture/001-system-architecture.md)
