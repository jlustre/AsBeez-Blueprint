# Refund Management

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-106 |
| Capability ID | BC-COM-106 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Commerce |
| Owner | Commerce Domain |

---

# Overview

The Refund Management capability processes customer refund requests for purchases made through the AsBeez Marketplace.

It validates refund eligibility, records refund transactions, communicates with the Payment Processing capability, and publishes events required by downstream business capabilities.

Refund Management does not directly modify Rewards, ABCs, AHC, Wallets, Vendor Revenue, or Financial Ledgers.

---

# Responsibilities

The Refund Management capability is responsible for:

- Receiving refund requests
- Validating refund eligibility
- Approving or rejecting refunds
- Processing payment refunds
- Recording refund transactions
- Recording refund reasons
- Maintaining refund history
- Publishing refund events

The Refund Management capability is **not responsible** for:

- Adjusting Reward Points
- Adjusting ABCs
- Adjusting AHC
- Vendor revenue adjustments
- Wallet adjustments
- Financial ledger adjustments

Those responsibilities belong to their respective capabilities.

---

# Refund Types

The platform supports the following refund types.

| Type | Description |
|------|-------------|
| Full Refund | Refunds the entire purchase |
| Partial Refund | Refunds a portion of the purchase |
| Item Refund | Refunds one or more order items |

---

# Refund Information

Each refund records:

## Refund Details

- Refund Number
- Order Number
- Customer
- Refund Type
- Refund Amount
- Refund Reason
- Refund Status
- Requested Date
- Processed Date

---

## Payment Reference

- Original Payment Transaction
- Refund Transaction Reference
- Payment Gateway

---

# Refund Workflow

```text
Customer Requests Refund
           │
           ▼
Validate Eligibility
           │
           ▼
Approve / Reject
           │
           ▼
Process Payment Refund
           │
           ▼
Record Refund
           │
           ▼
Publish Refund Event
```

---

# Refund Status

A refund may have one of the following statuses.

| Status | Description |
|----------|-------------|
| Requested | Awaiting review |
| Approved | Approved for processing |
| Rejected | Refund denied |
| Processing | Refund in progress |
| Completed | Refund successfully processed |
| Failed | Refund processing failed |

---

# Refund Eligibility

Refund eligibility is configurable.

Examples include:

- Refund period
- Product category
- Product type
- Vendor policy
- Country regulations

Digital products may have different refund policies than physical products.

---

# Configuration

Administrators may configure:

- Refund Window
- Auto Approval
- Manual Approval
- Eligible Product Categories
- Refund Reasons
- Partial Refund Support
- Digital Product Refund Policy

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-RFD-001 | Refund requests must reference an existing order. |
| BR-RFD-002 | Refund eligibility is validated before processing. |
| BR-RFD-003 | Refunds create new refund transactions and never modify the original order. |
| BR-RFD-004 | Every refund receives a unique refund number. |
| BR-RFD-005 | Refund processing must be recorded in the refund history. |
| BR-RFD-006 | Completed refunds publish refund events for downstream capabilities. |
| BR-RFD-007 | Original orders remain immutable after refunds. |

---

# Published Events

The Refund Management capability publishes:

- RefundRequested
- RefundApproved
- RefundRejected
- RefundProcessed
- RefundCompleted

---

# Consumed Events

The Refund Management capability consumes:

- PaymentRefundRequested
- OrderCancelled *(when applicable)*

---

# Downstream Processing

After a refund is completed, downstream capabilities determine whether additional adjustments are required.

Examples include:

- Reward Point Adjustment
- ABC Adjustment
- AHC Adjustment
- Vendor Revenue Adjustment
- Wallet Adjustment
- Financial Ledger Adjustment

These adjustments are performed by their respective business capabilities.

---

# Related Capabilities

- BC-COM-104 Payment Processing
- BC-COM-105 Order Management
- BC-RWD-123 Reward Adjustment Engine
- BC-RWD-126 ABC Adjustment Engine
- BC-BHM-305 Hive Credit Adjustment Engine
- BC-FIN-201 Financial Ledger

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |