# Withdrawals

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-129 |
| Capability ID | BC-RWD-129 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Rewards *(Temporary)* |
| Owner | Rewards Domain |

---

# Overview

The Withdrawal capability allows Members to request the withdrawal of available funds from their Wallet.

Withdrawals are subject to platform policies, verification requirements, and administrative approval before funds are released.

---

# Responsibilities

The Withdrawal capability is responsible for:

- Receiving withdrawal requests
- Validating withdrawal eligibility
- Calculating withdrawal fees
- Managing withdrawal approvals
- Recording withdrawal transactions
- Tracking withdrawal status
- Publishing withdrawal events

The Withdrawal capability is **not responsible** for:

- Managing wallet balances
- Processing payment collections
- Reward calculations
- Financial accounting
- Bank transfers

---

# Withdrawal Eligibility

Members may request a withdrawal when:

- Their Wallet has sufficient available funds.
- The minimum withdrawal amount has been met.
- Their account is active.
- Identity verification requirements have been satisfied (if applicable).

---

# Withdrawal Information

Each withdrawal records:

- Withdrawal Number
- Member ID
- Wallet ID
- Requested Amount
- Withdrawal Fee
- Net Amount
- Currency
- Withdrawal Method
- Status
- Requested Date
- Processed Date

---

# Withdrawal Methods

Supported withdrawal methods are configurable.

Examples include:

- Bank Transfer
- PayPal
- Interac e-Transfer
- ACH
- Wire Transfer
- Other supported payment providers

---

# Withdrawal Workflow

```text
Member Requests Withdrawal
            │
            ▼
Validate Eligibility
            │
            ▼
Calculate Fees
            │
            ▼
Approve / Reject
            │
            ▼
Release Funds
            │
            ▼
Complete Withdrawal
```

---

# Withdrawal Status

| Status | Description |
|----------|-------------|
| Pending | Awaiting review |
| Approved | Approved for processing |
| Rejected | Request denied |
| Processing | Payment in progress |
| Completed | Funds released |
| Cancelled | Cancelled before processing |

---

# Configuration

Administrators may configure:

- Minimum Withdrawal Amount
- Maximum Withdrawal Amount
- Withdrawal Fees
- Supported Withdrawal Methods
- Approval Requirements
- Processing Schedule

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-WTH-001 | Withdrawals may only use available Wallet funds. |
| BR-WTH-002 | Members must meet the minimum withdrawal amount. |
| BR-WTH-003 | Withdrawal fees are deducted before funds are released. |
| BR-WTH-004 | Every withdrawal receives a unique withdrawal number. |
| BR-WTH-005 | Approved withdrawals create a Wallet debit transaction. |
| BR-WTH-006 | Rejected withdrawals do not affect the Wallet balance. |
| BR-WTH-007 | Withdrawal policies are configurable by country. |

---

# Published Events

The Withdrawal capability publishes:

- WithdrawalRequested
- WithdrawalApproved
- WithdrawalRejected
- WithdrawalCompleted
- WithdrawalCancelled

---

# Consumed Events

The Withdrawal capability consumes:

- WalletCredited
- WalletDebited

---

# Related Capabilities

- BC-RWD-128 Wallet
- BC-FIN-201 Financial Ledger
- BC-PLT-165 Notifications

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |