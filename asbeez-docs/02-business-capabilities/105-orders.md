# Order Management

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-105 |
| Capability ID | BC-COM-105 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Commerce |
| Owner | Commerce Domain |

---

# Overview

The Order Management capability records every completed purchase within the AsBeez Marketplace.

An order is the permanent business record of a successful transaction between a customer and one or more vendors.

Once created, an order becomes immutable and serves as the official source for customer purchases, vendor sales, reporting, and downstream business processes.

---

# Responsibilities

The Order Management capability is responsible for:

- Creating orders
- Assigning order numbers
- Recording purchased products
- Recording pricing snapshots
- Recording customer information
- Recording vendor information
- Maintaining order status
- Maintaining order history
- Providing order lookup
- Publishing order events

The Order Management capability is **not responsible** for:

- Processing payments
- Calculating rewards
- Creating ABCs
- Distributing AHC
- Vendor payouts
- Refund calculations
- Product fulfillment

---

# Order Information

Each order contains:

## Order Header

- Order Number
- Customer
- Member (if applicable)
- Order Date
- Currency
- Country
- Order Status

---

## Order Items

Each item records a snapshot of:

- Product
- Vendor
- Quantity
- Unit Price
- Discount
- Tax
- Final Price

---

## Payment Reference

- Payment Transaction ID
- Payment Method
- Payment Status

---

## Customer Information

- Customer Name
- Email Address
- Billing Address

---

# Order Workflow

```text
Payment Captured
        │
        ▼
Create Order
        │
        ▼
Assign Order Number
        │
        ▼
Store Order Snapshot
        │
        ▼
Publish Order Created Event
```

---

# Order Status

An order may have one of the following statuses.

| Status | Description |
|----------|-------------|
| Pending | Awaiting processing |
| Processing | Being prepared |
| Completed | Successfully completed |
| Cancelled | Cancelled before completion |
| Refunded | Fully refunded |
| Partially Refunded | Partially refunded |
| Archived | Historical record |

---

# Snapshot Principle

Orders store a snapshot of transaction data at the time of purchase.

Changes made after the order is created (such as product price updates or product description changes) do not affect historical orders.

This ensures accurate reporting, auditing, and financial traceability.

---

# Configuration

Administrators may configure:

- Order Number Format
- Initial Order Status
- Order Status Workflow
- Archive Policy
- Order Retention Period

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-ORD-001 | Orders are created only after successful payment capture. |
| BR-ORD-002 | Every order must have a unique order number. |
| BR-ORD-003 | Orders are immutable after creation. |
| BR-ORD-004 | Product information is stored as a snapshot. |
| BR-ORD-005 | Historical orders must never be modified. |
| BR-ORD-006 | Every order must reference its originating payment transaction. |
| BR-ORD-007 | Every order status change must be recorded in the order history. |

---

# Published Events

The Order Management capability publishes:

- OrderCreated
- OrderUpdated
- OrderCompleted
- OrderCancelled
- OrderArchived

---

# Consumed Events

The Order Management capability consumes:

- PaymentCaptured
- PaymentRefunded

---

# Related Capabilities

- BC-COM-104 Payment Processing
- BC-COM-106 Refund Management
- BC-COM-107 Digital Product Delivery
- BC-VEN-149 Vendor Payouts
- BC-RWD-125 Reward Point Engine

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |