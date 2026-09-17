# Account Dimensions

## Purpose

Account dimensions describe the business context of a posting without multiplying the chart of accounts. They support analysis, allocation, consolidation, and controlled statutory reporting.

## Required Dimensions

| Dimension | Purpose |
| --- | --- |
| Legal entity | identifies the entity that owns the accounting result |
| Country and jurisdiction | supports local reporting, tax, and regulatory treatment |
| Currency | identifies transaction, functional, or reporting currency |
| Business unit | groups platform, marketplace, vendor, partner, or service activity |
| Product or service | supports revenue, cost, and margin analysis |
| Channel | identifies web, mobile, API, POS, partner, or other origin |
| Program | identifies rewards, promotions, subscriptions, or campaigns |
| Counterparty | identifies customer, member, vendor, partner, provider, or authority |
| Cost center | assigns controllable operating cost ownership |
| Project | tracks temporary implementation or investment activity |

## Rules

Dimensions are controlled reference data with effective dates and ownership. Required dimensions vary by account and transaction type, but a posting must never use a fabricated placeholder to bypass validation. Personal or sensitive identifiers should use references or aggregation rather than raw personal data.

Dimensions cannot change the account's classification or normal balance. They also cannot be used to hide a need for a new account when the economic meaning is different.

## Reporting and Performance

Reports specify which dimensions are authoritative for the result being measured. Dimension values remain attached to journal lines and source facts so a report can be reproduced after account hierarchy changes.

## Related Documents

- [003-account-hierarchy.md](003-account-hierarchy.md)
- [004-account-numbering.md](004-account-numbering.md)
- [013-country-specific-accounts.md](013-country-specific-accounts.md)
- [016-account-governance.md](016-account-governance.md)
