# Vendor Payouts

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-149 |
| Capability ID | BC-VEN-149 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Vendor |
| Owner | Vendor Domain |

---

# Overview

The Vendor Payouts capability manages the disbursement of available funds from the Vendor Wallet to the Vendor.

Payouts are initiated after earnings have completed the settlement process and satisfy all platform payout requirements.

---

# Responsibilities

The Vendor Payouts capability is responsible for:

- Receiving payout requests
- Validating payout eligibility
- Calculating payout fees
- Approving payouts
- Recording payout transactions
- Tracking payout status
- Notifying Vendors of payout results

The Vendor Payouts capability is **not responsible** for:

- Revenue share calculations
- Vendor Wallet balances
- Payment collection
- Customer refunds
- Financial accounting

---

# Payout Eligibility

A Vendor may request a payout when:

- The Vendor account is Active.
- The Vendor Wallet has sufficient Available Balance.
- The minimum payout amount has been met.
- Settlement requirements have been satisfied.
- Required tax and banking information has been completed.

---

# Payout Information

Each payout records:

- Payout Number
- Vendor ID
- Vendor Wallet ID
- Requested Amount
- Processing Fee
- Net Amount
- Currency
- Payout Method
- Status
- Requested Date
- Approved Date
- Completed Date

---

# Payout Methods

Supported payout methods are configurable.

Examples include:

- Bank Transfer
- ACH
- Wire Transfer
- PayPal
- Interac e-Transfer
- Stripe Connect
- Other supported payment providers

---

# Payout Workflow

```text
Vendor Requests Payout
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
Debit Vendor Wallet
          │
          ▼
Release Funds
          │
          ▼
Complete Payout
```

---

# Payout Status

| Status | Description |
|----------|-------------|
| Pending | Awaiting review |
| Approved | Approved for processing |
| Rejected | Request denied |
| Processing | Payment in progress |
| Completed | Funds successfully released |
| Failed | Payment could not be completed |
| Cancelled | Cancelled before processing |

---

# Configuration

Administrators may configure:

- Minimum Payout Amount
- Maximum Payout Amount
- Processing Fees
- Settlement Period
- Supported Payout Methods
- Automatic Approval
- Manual Approval
- Processing Schedule

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-VPO-001 | Payouts may only use the Available Balance of the Vendor Wallet. |
| BR-VPO-002 | Pending balances cannot be paid out. |
| BR-VPO-003 | Every payout receives a unique payout number. |
| BR-VPO-004 | Processing fees are deducted before funds are released. |
| BR-VPO-005 | Every completed payout creates a Vendor Wallet debit transaction. |
| BR-VPO-006 | Rejected payouts do not affect the Vendor Wallet balance. |
| BR-VPO-007 | Payout methods are configurable by country. |

---

# Published Events

The Vendor Payouts capability publishes:

- VendorPayoutRequested
- VendorPayoutApproved
- VendorPayoutRejected
- VendorPayoutCompleted
- VendorPayoutFailed

---

# Consumed Events

The Vendor Payouts capability consumes:

- VendorWalletCredited
- VendorWalletAdjusted

---

# Related Capabilities

- BC-VEN-147 Revenue Sharing
- BC-VEN-148 Vendor Wallet
- BC-COM-105 Order Management
- BC-COM-106 Refund Management
- BC-FIN-201 Financial Ledger

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |