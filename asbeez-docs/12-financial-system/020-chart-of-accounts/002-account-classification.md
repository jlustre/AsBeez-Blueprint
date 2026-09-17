# Account Classification

## Purpose

Classification determines how an account behaves in accounting and reporting. Each posting account has one primary class and may have controlled reporting dimensions.

## Primary Classes

| Class | Normal balance | Examples |
| --- | --- | --- |
| Asset | Debit | cash, processor receivable, vendor receivable, prepaid expense |
| Liability | Credit | customer funds payable, vendor payable, tax payable, reward liability |
| Equity | Credit | contributed capital, retained earnings, current result |
| Revenue | Credit | marketplace fees, subscriptions, advertising, services |
| Expense | Debit | payment fees, refunds expense, support, infrastructure, compliance |
| Contra-asset | Credit | accumulated depreciation, allowance for doubtful receivables |
| Contra-revenue | Debit | discounts, refunds reducing recognized revenue |

## Classification Rules

An account must declare class, normal balance, monetary status, posting permission, parent, reporting treatment, and effective dates. A child account inherits only defaults; it may not silently change the accounting meaning of its parent.

RP, ABC, and AHC are not monetary account classes. Their financial consequences are recorded through approved reward liability, expense, revenue, or clearing accounts according to jurisdiction and policy.

## Related Documents

- [003-account-hierarchy.md](003-account-hierarchy.md)
- [005-asset-accounts.md](005-asset-accounts.md)
- [006-liability-accounts.md](006-liability-accounts.md)
- [018-account-dimensions.md](018-account-dimensions.md)
