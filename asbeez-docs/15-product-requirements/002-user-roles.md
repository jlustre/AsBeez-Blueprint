# User Roles

## Purpose

This document defines product roles and the boundaries of their access, actions, responsibilities, and success criteria. A role does not grant access by itself; authorization, country/entity scope, consent, policy, and resource ownership are evaluated at execution.

## Primary Roles

### Customer

Browses and purchases products/services, manages permitted account information, views orders/invoices/payments, requests refunds, and receives customer-safe support. A customer cannot access vendor/member financial data or administer rewards, payouts, tax, or accounting.

### Member

Uses membership and loyalty features, may refer others under published rules, views RP/ABC/AHC and wallet states separately, and requests eligible redemptions or payouts. Membership does not promise income, ownership, investment returns, or guaranteed withdrawal.

### Vendor

Manages approved products/services, pricing, orders, customer service, fulfillment evidence, invoices, earnings, fees, tax data, reserves, statements, and payout requests within the vendor agreement and country scope.

### Partner

Provides approved services or strategic capabilities and views only authorized contracts, activity, earnings/commission, statements, and reconciliation information. Partner access cannot expose unrelated customer, vendor, or member data.

### Support and Operations

Investigates authorized cases, explains status, follows runbooks, routes exceptions, and communicates. Support/operations cannot directly edit balances, posted journals, provider outcomes, tax history, or certifications.

### Finance, Compliance, Risk, and Audit

Finance/accounting manages policy, accounts, ledger, close, and reports; treasury manages liquidity; tax manages tax decisions; compliance/risk manages reviews and holds; audit reviews evidence and controls. Separation of duties prevents self-approval.

### Administrator

Administers configuration, roles, workflows, and dashboards through approved APIs. Administrative privilege is scoped, time-bound where possible, MFA-protected, recertified, and audited.

### Platform Services

Automated services and AI may retrieve, classify, detect, prioritize, forecast, summarize, and recommend. They cannot independently post, approve, pay, release/freeze funds, certify, close, or make final legal/compliance decisions.

## Related Documents

- [000-index.md](000-index.md)
- [004-functional-requirements.md](004-functional-requirements.md)
- [../12-financial-system/310-api/003-authorization.md](../12-financial-system/310-api/003-authorization.md)
- [../14-legal-compliance/009-member-agreement.md](../14-legal-compliance/009-member-agreement.md)
