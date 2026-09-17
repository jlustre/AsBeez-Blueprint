# Domain Services

## Purpose

Domain services express financial operations that do not naturally belong to one entity or aggregate. They are deterministic where possible, side-effect-aware, and invoked through application commands.

## Service Catalog

| Service | Responsibility | Output |
| --- | --- | --- |
| Payment Allocation | allocate captured funds to invoice lines, tax, fees, and clearing | allocation proposal |
| Journal Posting | validate and post balanced entries | posted journal or rejection |
| Balance Projection | calculate ledger-backed wallet balances and holds | available, pending, held totals |
| Settlement Calculation | calculate gross, fees, taxes, reserves, and net | reproducible settlement |
| FX Conversion | convert using an approved historical rate | source/target money pair |
| Tax Calculation | apply jurisdiction and effective tax rules | tax assessment |
| Revenue Recognition | determine earned amount and period | recognition schedule/event |
| Reconciliation Matching | match internal facts to external evidence | match or exception |
| Reward Financial Treatment | classify RP, ABC, and AHC financial effects | liability/ledger instruction |

The Reward Financial Treatment service must distinguish a program event from a monetary obligation. RP issuance, ABC creation, and matrix placement do not create a journal entry by default. It posts or schedules a financial effect only after jurisdiction, funding source, reward policy, and liability classification are approved.

## Service Rules

- Services must not mutate multiple aggregates without an explicit workflow boundary.
- A service records the policy and rule versions used for its result.
- External calls return attempts and provider references; they do not directly post accounting entries.
- Re-running a service with the same input and rule version produces the same result.
- Uncertain results are represented as exceptions or pending outcomes, never silently approximated.

## Related Documents

- [005-value-objects.md](005-value-objects.md)
- [008-policies.md](008-policies.md)
- [009-specifications.md](009-specifications.md)
- [014-asbeez-financial-mapping.md](014-asbeez-financial-mapping.md)
