# Vendor Coupons

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-145 |
| Capability ID | BC-VEN-145 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Vendor |
| Owner | Vendor Domain |

---

# Overview

The Vendor Coupons capability allows Vendors to create and manage promotional coupons for their products.

Vendor coupons help Vendors increase sales, attract new customers, reward loyal buyers, and run marketing campaigns while maintaining control over the discount they offer.

The Vendor is responsible for funding the discount provided by the coupon.

---

# Responsibilities

The Vendor Coupons capability is responsible for:

- Creating coupons
- Editing coupons
- Activating coupons
- Deactivating coupons
- Defining coupon rules
- Tracking coupon usage
- Managing coupon expiration

The Vendor Coupons capability is **not responsible** for:

- Platform-wide promotions
- Checkout validation
- Shopping Cart calculations
- Payment processing
- Reward calculations

---

# Coupon Types

Supported coupon types include:

- Percentage Discount
- Fixed Amount Discount
- Free Shipping *(Future)*
- Buy X Get Y *(Future)*

---

# Coupon Information

Each coupon contains:

## Basic Information

- Coupon Code
- Coupon Name
- Description *(Optional)*

---

## Discount

- Discount Type
- Discount Value
- Maximum Discount *(Optional)*

---

## Validity

- Start Date
- End Date

---

## Usage Rules

- Minimum Purchase Amount
- Maximum Uses
- Uses Per Customer
- Eligible Products
- Eligible Categories

---

## Status

- Active
- Inactive
- Expired

---

# Coupon Workflow

```text
Create Coupon
      │
      ▼
Configure Rules
      │
      ▼
Activate Coupon
      │
      ▼
Customer Uses Coupon
      │
      ▼
Track Usage
      │
      ▼
Expire / Deactivate
```

---

# Coupon Validation

A coupon is considered valid when:

- The coupon is active.
- The current date is within the validity period.
- Usage limits have not been exceeded.
- Purchase requirements are satisfied.
- The coupon applies to the selected products.

Validation occurs during Checkout.

---

# Configuration

Administrators may configure:

- Allowed Coupon Types
- Maximum Discount Limits
- Coupon Code Format
- Coupon Duration
- Usage Limits
- Stackable Coupon Rules
- Category Restrictions

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-VCP-001 | Vendors may create coupons only for their own products. |
| BR-VCP-002 | Coupon discounts are funded by the Vendor. |
| BR-VCP-003 | Coupon usage is validated during Checkout. |
| BR-VCP-004 | Expired coupons cannot be used. |
| BR-VCP-005 | Coupon rules are configurable. |
| BR-VCP-006 | Coupon usage history is permanently recorded. |
| BR-VCP-007 | Vendor revenue sharing is calculated using the discounted selling price, unless otherwise configured. |

---

# Published Events

The Vendor Coupons capability publishes:

- CouponCreated
- CouponUpdated
- CouponActivated
- CouponDeactivated
- CouponRedeemed
- CouponExpired

---

# Consumed Events

The Vendor Coupons capability consumes:

- OrderCompleted
- CheckoutStarted

---

# Related Capabilities

- BC-COM-102 Shopping Cart
- BC-COM-103 Checkout
- BC-COM-105 Order Management
- BC-VEN-147 Revenue Sharing

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |