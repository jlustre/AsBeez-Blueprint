# Financial Accounts Schema

> **Document:** 12-financial-system/300-data-model/002-financial-accounts-schema.md

---

## Purpose

Financial accounts identify the Chart of Accounts meaning used by the General Ledger and its subledger control relationships.

## Core Fields

`account_id`, `account_code`, `account_name`, `account_class`, `normal_balance`, `parent_account_id`, `control_account`, `currency_scope`, `entity_scope`, `country_scope`, `dimension_policy`, `status`, `effective_from`, `effective_to`, `chart_version`, and `created_by`.

## Rules

Account codes are unique within a chart version. Account class is one of asset, liability, equity, revenue, expense, contra, or memorandum. Posted journals reference the account and chart version used at posting time. Accounts cannot be deleted or repurposed after posting; they may be closed or superseded.

## Control Relationships

Each wallet, reward, vendor, partner, payment, payout, tax, reserve, treasury, and provider subledger mapping identifies its control account, reconciliation scope, currency, entity, country, and owner. Mapping changes require approval and effective dating.

## Related Documents

- [000-index.md](000-index.md)
- [003-journal-entries-schema.md](003-journal-entries-schema.md)
- [004-ledger-entries-schema.md](004-ledger-entries-schema.md)
- [../020-chart-of-accounts/018-account-dimensions.md](../020-chart-of-accounts/018-account-dimensions.md)
