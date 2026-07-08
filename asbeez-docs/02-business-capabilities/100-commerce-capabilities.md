# Commerce Capabilities

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-100 |
| Capability ID | BC-COM-100 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Commerce |
| Owner | Commerce Domain |

---

# Overview

The Commerce Capability manages the complete buying and selling process within the AsBeez Marketplace.

It provides the business functions required for customers to discover products, place orders, complete purchases, and receive products or services while supporting Vendors in selling through the marketplace.

Commerce is the primary source of business activity within AsBeez and is the entry point for downstream capabilities such as Rewards, Beehive Matrix, Vendor Revenue Sharing, Financial Accounting, and Analytics.

---

# Responsibilities

The Commerce domain is responsible for:

- Product Catalog
- Shopping Cart
- Checkout
- Payment Processing
- Order Management
- Refund Management
- Digital Product Delivery
- Coupon Management
- Promotion Management
- Product Reviews
- Wishlist
- Order Notifications

Commerce is **not responsible** for:

- Reward Point calculations
- ABC generation
- AHC distribution
- Vendor payouts
- Wallet management
- Financial accounting

These responsibilities belong to their respective domains.

---

# Capability Map

| ID | Capability |
|----|------------|
| BC-COM-101 | Product Catalog |
| BC-COM-102 | Shopping Cart |
| BC-COM-103 | Checkout |
| BC-COM-104 | Payment Processing |
| BC-COM-105 | Order Management |
| BC-COM-106 | Refund Management |
| BC-COM-107 | Digital Product Delivery |
| BC-COM-108 | Coupon Management |
| BC-COM-109 | Promotion Management |
| BC-COM-110 | Product Reviews |
| BC-COM-111 | Wishlist |
| BC-COM-112 | Order Notifications |

---

# Business Workflow

```text
Browse Products
        │
        ▼
Shopping Cart
        │
        ▼
Checkout
        │
        ▼
Payment Processing
        │
        ▼
Order Management
        │
        ▼
Digital Delivery
```

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-COM-001 | Commerce begins when a customer adds a product to the Shopping Cart. |
| BR-COM-002 | Orders are created only after successful payment. |
| BR-COM-003 | Commerce does not calculate Rewards or Beehive earnings directly. |
| BR-COM-004 | Every completed order publishes business events for downstream capabilities. |
| BR-COM-005 | Historical commerce transactions are immutable. |

---

# Published Events

The Commerce domain may publish the following events:

- ProductPublished
- CartUpdated
- CheckoutStarted
- PaymentSucceeded
- PaymentFailed
- OrderCreated
- OrderCompleted
- RefundRequested
- RefundCompleted

These events are consumed by other business capabilities.

---

# Related Capabilities

| Capability | Description |
|------------|-------------|
| Membership | Customer and Member accounts |
| Vendor | Product ownership and storefronts |
| Rewards | Reward Point calculations |
| Beehive Matrix | ABC placement and AHC distribution |
| Finance | Revenue allocation and accounting |
| Platform | Configuration, notifications, reporting |

---

# Included Documents

- 101 Product Catalog
- 102 Shopping Cart
- 103 Checkout
- 104 Payment Processing
- 105 Order Management
- 106 Refund Management
- 107 Digital Product Delivery
- 108 Coupon Management
- 109 Promotion Management
- 110 Product Reviews
- 111 Wishlist
- 112 Order Notifications

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |