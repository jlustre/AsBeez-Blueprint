# Financial Reporting

> **Document:** 12-financial-system/230-financial-reporting/000-index.md

---

## Purpose

This section defines financial reporting, including trial balance, income statement, balance sheet, cash flow, equity, general ledger, liability, settlement, commission, tax, country, consolidated, management, and regulatory reports, plus scheduling, export, APIs, events, and AI capabilities.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-reporting-domain-model.md](002-reporting-domain-model.md) - Reporting Domain Model
- [003-trial-balance.md](003-trial-balance.md) - Trial Balance
- [004-income-statement.md](004-income-statement.md) - Income Statement
- [005-balance-sheet.md](005-balance-sheet.md) - Balance Sheet
- [006-cash-flow-statement.md](006-cash-flow-statement.md) - Cash Flow Statement
- [007-statement-of-equity.md](007-statement-of-equity.md) - Statement Of Equity
- [008-general-ledger-report.md](008-general-ledger-report.md) - General Ledger Report
- [009-wallet-liability-report.md](009-wallet-liability-report.md) - Wallet Liability Report
- [010-reward-liability-report.md](010-reward-liability-report.md) - Reward Liability Report
- [011-vendor-settlement-report.md](011-vendor-settlement-report.md) - Vendor Settlement Report
- [012-partner-commission-report.md](012-partner-commission-report.md) - Partner Commission Report
- [013-tax-report.md](013-tax-report.md) - Tax Report
- [014-country-financial-report.md](014-country-financial-report.md) - Country Financial Report
- [015-consolidated-financial-report.md](015-consolidated-financial-report.md) - Consolidated Financial Report
- [016-management-reporting.md](016-management-reporting.md) - Management Reporting
- [017-regulatory-reporting.md](017-regulatory-reporting.md) - Regulatory Reporting
- [018-report-scheduling.md](018-report-scheduling.md) - Report Scheduling
- [019-report-export.md](019-report-export.md) - Report Export
- [020-report-api.md](020-report-api.md) - Report API
- [021-report-events.md](021-report-events.md) - Report Events
- [022-report-ai-capabilities.md](022-report-ai-capabilities.md) - Report AI Capabilities
- [023-future-roadmap.md](023-future-roadmap.md) - Future Roadmap

## Design Authority

Financial Reporting owns report definitions, datasets, snapshots, certifications, schedules, exports, and reporting access. General Ledger, subledgers, reconciliation, close, revenue, tax, treasury, budgets, reserves, rewards, vendor/partner, payments, and payouts provide authoritative facts or controlled projections.

## Implementation Sequence

1. Approve report definitions, dimensions, periods, entities, countries, currencies, source systems, and certification rules.
2. Implement trial balance, financial statements, GL/subledger, wallet/reward, vendor/partner, tax, country, treasury, reserve, and reconciliation reports.
3. Implement management/regulatory reporting, snapshots, schedules, exports, API, events, security, and audit.
4. Connect close, budgets, forecasts, actuals, exceptions, consolidation, and governed AI assistance.
