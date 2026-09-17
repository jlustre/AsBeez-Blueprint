# Ubiquitous Language

## Purpose

These definitions are the authoritative financial vocabulary. Product, accounting, legal, API, database, and support documents should use these terms consistently.

## Core Terms

| Term | Definition |
| --- | --- |
| Financial fact | An immutable record of an economic event or decision. |
| Money | A currency-denominated amount with explicit precision. |
| Ledger balance | Balance calculated from posted ledger-backed entries. |
| Available balance | Amount currently usable after pending, held, and reserved amounts. |
| Hold | A temporary restriction that reduces availability without being a final debit. |
| Reservation | A commitment of available value for a pending operation. |
| Payment | A customer funding transaction and its provider lifecycle. |
| Invoice | A formal statement of amounts due. |
| Refund | Return of captured customer funds, recorded as a new financial effect. |
| Chargeback | A provider or issuer dispute over a payment. |
| Revenue | Amount recognized as earned under the applicable accounting policy. |
| Settlement | Calculation and approval of what a participant is owed. |
| Payout | Execution of an approved outbound transfer. |
| Reconciliation | Comparison of internal facts with external evidence. |
| Adjustment | A controlled compensating financial fact that corrects an earlier result. |
| Reward liability | An obligation created by a valid reward event under approved rules. |
| RP | Reward Points, a platform-defined non-money reward unit. |
| ABC | AsBeez Business Cell, a platform-defined participation record. |
| AHC | AsBeez Hive Credits, a platform-defined reward unit subject to approved rules. |

## Terms to Avoid

Do not use “cash balance” for RP, ABC, or AHC; “income” for an unrecognized reward; “payout” for a settlement calculation; “refund” for a ledger correction; or “ownership” for an ABC unless Legal has approved the jurisdiction-specific meaning.

## Naming Rules

Use singular aggregate names, explicit status names, and separate source, effective, and posting times. API names must preserve the domain distinction between amount owed, amount available, and amount paid.

## Related Documents

- [002-bounded-contexts.md](002-bounded-contexts.md)
- [004-entities.md](004-entities.md)
- [011-invariants.md](011-invariants.md)
