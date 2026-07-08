# Shopping Cart

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-102 |
| Capability ID | BC-COM-102 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Commerce |
| Owner | Commerce Domain |

---

# Overview

The Shopping Cart temporarily stores products selected by customers before checkout.

It allows customers to review products, modify quantities, apply discounts, estimate totals, and prepare an order for checkout.

The Shopping Cart does not process payments or create orders.

---

# Responsibilities

The Shopping Cart is responsible for:

- Adding products
- Removing products
- Updating quantities
- Saving products for later
- Applying coupons
- Applying promotions
- Estimating totals
- Estimating taxes
- Estimating shipping *(Future)*
- Preparing data for Checkout

The Shopping Cart is **not responsible** for:

- Payment processing
- Order creation
- Reward Point generation
- ABC generation
- AHC distribution
- Vendor accounting
- Financial transactions

---

# Cart Types

## Guest Cart

Available without signing in.

- Session-based
- Temporary
- Can be merged after login

---

## Registered Customer Cart

Available to registered users.

- Saved in the database
- Accessible across devices

---

## Member Cart

Supports all registered customer features plus:

- Wallet payment option
- Reward Point estimate
- Future member promotions

---

# Cart Information

Each shopping cart contains:

## Cart Header

- Cart ID
- Customer
- Session
- Country
- Currency
- Created Date
- Updated Date

---

## Cart Items

Each item contains:

- Product
- Vendor
- Quantity
- Unit Price
- Discount
- Promotion
- Estimated Tax
- Estimated Total

---

# Shopping Cart Workflow

```text
Browse Products
       │
       ▼
Add to Cart
       │
       ▼
Update Cart
       │
       ▼
Apply Coupon
       │
       ▼
Review Cart
       │
       ▼
Proceed to Checkout
```

---

# Cart Validation

Before Checkout, the Shopping Cart validates:

- Product availability
- Product status
- Product pricing
- Coupon validity
- Promotion eligibility

Final validation occurs during Checkout.

---

# Multi-Vendor Support

A shopping cart may contain products from multiple Vendors.

The customer experiences a single shopping cart while the platform internally groups items by Vendor for order processing.

---

# Coupons

The Shopping Cart supports:

- Fixed Amount Coupons
- Percentage Discounts
- Vendor Coupons
- Marketplace Coupons

Coupon validation is performed every time the cart is recalculated.

---

# Promotions

Supported promotions include:

- Sale Pricing
- Quantity Discounts
- Bundle Promotions
- Flash Sales
- Seasonal Promotions

Promotion rules are configurable.

---

# Save for Later

Customers may move products between:

- Shopping Cart
- Saved for Later
- Wishlist

Saved items are excluded from cart totals.

---

# Cart Configuration

Administrators may configure:

- Guest Cart Expiration
- Saved Cart Duration
- Maximum Cart Items
- Coupon Rules
- Promotion Rules
- Cart Timeout
- Country Availability

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-CART-001 | A customer may have one active cart per country. |
| BR-CART-002 | Guest carts may be merged after login. |
| BR-CART-003 | Cart totals are estimates only. |
| BR-CART-004 | Product prices are refreshed before checkout. |
| BR-CART-005 | Coupons are revalidated whenever the cart changes. |
| BR-CART-006 | Removing an item immediately recalculates totals. |
| BR-CART-007 | Checkout performs the final pricing validation. |

---

# Published Events

The Shopping Cart publishes:

- ProductAddedToCart
- ProductRemovedFromCart
- CartUpdated
- CouponApplied
- CouponRemoved
- CartCleared
- CheckoutStarted

---

# Related Capabilities

- BC-COM-101 Product Catalog
- BC-COM-103 Checkout
- BC-COM-108 Coupon Management
- BC-COM-109 Promotion Management
- BC-COM-111 Wishlist

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |