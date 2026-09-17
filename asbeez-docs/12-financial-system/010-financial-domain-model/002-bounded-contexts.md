# Bounded Contexts

> **Document:** 12-financial-system/010-financial-domain-model/002-bounded-contexts.md

## Purpose

Bounded contexts define ownership of financial language, data, decisions, and state transitions. A context may publish facts to another context, but it must not update another context's private state.

## Context Map

| Context | Owns | Does not own |
| --- | --- | --- |
| Payments | intents, attempts, captures, refunds, provider references | revenue recognition or wallet balances |
| Billing | invoices, receivables, credit/debit notes, allocations | provider execution |
| General Ledger | chart of accounts, journals, posted entries, accounting periods | operational workflow state |
| Wallets | wallet status, holds, reservations, available balance projection | source-of-funds classification |
| Revenue Recognition | performance obligations, schedules, recognition events | cash movement |
| Settlement | participant obligations, fees, reserves, settlement batches | outbound transfer execution |
| Payouts | payout requests, attempts, provider execution, failure handling | amount owed calculation |
| Treasury | bank/cash accounts, liquidity, internal funding transfers | customer-facing balances |
| Tax | assessment, collection, withholding, remittance evidence | commercial pricing |
| FX | rates, conversions, rounding, revaluation | payment authorization |
| Reconciliation | imported evidence, matching, exceptions, resolutions | correcting history in place |
| Reward Accounting | financial consequences of approved RP, ABC, and AHC events, including liabilities, expenses, redemptions, and reversals | reward qualification, ABC creation, or matrix placement rules |
| Controls and Audit | approvals, permissions, evidence, retention | ordinary transaction ownership |

## Integration Rules

1. Cross-context communication uses commands, queries, or versioned domain events.
2. A consumer stores the source event identifier and processes it idempotently.
3. Currency, jurisdiction, actor, source transaction, and effective time travel with every financial fact.
4. A context may reject an incoming command without mutating the sender's state.
5. Corrections are new facts or compensating entries; posted records are never edited.

## Related Documents

- [001-domain-overview.md](001-domain-overview.md)
- [003-aggregates.md](003-aggregates.md)
- [010-domain-events.md](010-domain-events.md)
- [014-asbeez-financial-mapping.md](014-asbeez-financial-mapping.md)
