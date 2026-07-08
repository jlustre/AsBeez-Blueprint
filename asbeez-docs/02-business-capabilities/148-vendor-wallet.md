# Vendor Wallet

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-148 |
| Capability ID | BC-VEN-148 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Vendor |
| Owner | Vendor Domain |

---

# Overview

The Vendor Wallet maintains the earnings available to a Vendor from product sales made through the AsBeez Marketplace.

Vendor earnings are credited only after the corresponding order satisfies the platform's settlement requirements.

The Vendor Wallet serves as the source of funds for Vendor Payouts.

---

# Responsibilities

The Vendor Wallet is responsible for:

- Maintaining Vendor balances
- Recording wallet transactions
- Receiving approved earnings
- Recording adjustments
- Recording payout deductions
- Maintaining transaction history

The Vendor Wallet is **not responsible** for:

- Revenue share calculations
- Payment collection
- Customer refunds
- Reward calculations
- Vendor payouts

---

# Wallet Balance

Each Vendor has one Vendor Wallet.

The wallet maintains:

- Available Balance
- Pending Balance
- Total Credits
- Total Debits

---

# Wallet Transactions

Supported transaction types include:

- Sales Earnings
- Revenue Adjustments
- Refund Adjustments
- Manual Credits
- Manual Debits
- Payouts
- Reversals

---

# Earnings Flow

```text
Completed Order
       │
       ▼
Revenue Sharing
       │
       ▼
Settlement Review
       │
       ▼
Credit Vendor Wallet
       │
       ▼
Available for Payout
```

---

# Settlement

Vendor earnings may remain in a **Pending Balance** until the settlement requirements have been met.

Examples include:

- Refund period
- Payment confirmation
- Fraud review
- Platform policies

Once approved, the amount is moved to the Available Balance.

---

# Wallet Statement

The Vendor Wallet provides a complete transaction history including:

- Transaction Date
- Transaction Type
- Reference Number
- Description
- Credit
- Debit
- Running Balance

---

# Configuration

Administrators may configure:

- Settlement Period
- Pending Balance Rules
- Minimum Wallet Balance
- Automatic Settlement
- Manual Settlement
- Adjustment Permissions

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-VW-001 | Every Vendor has one Vendor Wallet. |
| BR-VW-002 | Vendor earnings are credited only after settlement requirements are met. |
| BR-VW-003 | Wallet balances cannot become negative. |
| BR-VW-004 | Every wallet transaction must be permanently recorded. |
| BR-VW-005 | Refund adjustments are recorded as separate transactions. |
| BR-VW-006 | Payouts reduce the Available Balance only. |
| BR-VW-007 | Pending balances cannot be withdrawn. |

---

# Published Events

The Vendor Wallet capability publishes:

- VendorWalletCredited
- VendorWalletDebited
- VendorWalletAdjusted
- VendorSettlementCompleted

---

# Consumed Events

The Vendor Wallet capability consumes:

- RevenueShareCalculated
- RefundCompleted
- VendorPayoutCompleted

---

# Related Capabilities

- BC-VEN-147 Revenue Sharing
- BC-VEN-149 Vendor Payouts
- BC-COM-105 Order Management
- BC-COM-106 Refund Management
- BC-FIN-201 Financial Ledger

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |