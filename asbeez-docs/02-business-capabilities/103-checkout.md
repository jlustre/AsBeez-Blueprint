# Checkout

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-103 |
| Capability ID | BC-COM-103 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Commerce |
| Owner | Commerce Domain |

---

# Overview

The Checkout capability validates the customer's shopping cart and prepares it for payment.

Its primary responsibility is to ensure that all information required to complete a purchase is accurate before the payment is processed.

Checkout is the final step before Payment Processing.

---

# Responsibilities

The Checkout capability is responsible for:

- Reviewing cart contents
- Validating customer information
- Validating billing information
- Validating shipping information *(Future)*
- Validating product pricing
- Validating coupons
- Validating promotions
- Calculating final totals
- Calculating taxes
- Selecting a payment method
- Accepting Terms & Conditions
- Passing validated information to Payment Processing

The Checkout capability is **not responsible** for:

- Processing payments
- Creating orders
- Generating Reward Points
- Creating ABCs
- Distributing AHC
- Vendor accounting
- Product fulfillment

---

# Checkout Information

A checkout session contains:

## Customer Information

- Customer Account
- Member Status
- Email Address
- Billing Information

---

## Purchase Information

- Shopping Cart
- Products
- Quantity
- Discounts
- Promotions
- Taxes
- Final Amount

---

## Payment Information

- Selected Payment Method
- Payment Currency

---

## Confirmation

- Terms & Conditions Accepted
- Privacy Policy Accepted

---

# Checkout Workflow

```text
Shopping Cart
      │
      ▼
Review Purchase
      │
      ▼
Validate Customer
      │
      ▼
Validate Pricing
      │
      ▼
Validate Coupons
      │
      ▼
Calculate Final Total
      │
      ▼
Select Payment Method
      │
      ▼
Proceed to Payment
```

---

# Validation

Before proceeding to payment, Checkout validates:

- Customer account
- Product availability
- Product status
- Product pricing
- Coupon validity
- Promotion eligibility
- Billing information
- Country availability
- Currency support

If validation fails, checkout cannot continue until the issue is resolved.

---

# Supported Checkout Types

## Guest Checkout

Available for customers who are not signed in.

Guest purchases are treated as Customer purchases only.

---

## Registered Customer Checkout

Available to registered customers.

---

## Member Checkout

Available to Members.

Members may use supported member features such as Wallet payments and member-specific promotions.

---

# Configuration

Administrators may configure:

- Guest Checkout
- Checkout Timeout
- Supported Countries
- Supported Currencies
- Billing Requirements
- Terms & Conditions
- Payment Methods
- Tax Calculation Rules

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-CHK-001 | Checkout requires a valid Shopping Cart. |
| BR-CHK-002 | Final pricing is recalculated during Checkout. |
| BR-CHK-003 | Checkout validates all coupons before payment. |
| BR-CHK-004 | Product pricing is refreshed before payment. |
| BR-CHK-005 | Customers must accept the Terms & Conditions before continuing. |
| BR-CHK-006 | Checkout passes validated purchase information to Payment Processing. |
| BR-CHK-007 | No order is created during Checkout. |

---

# Published Events

The Checkout capability publishes:

- CheckoutStarted
- CheckoutValidated
- CheckoutValidationFailed
- CheckoutCancelled
- CheckoutCompleted

---

# Consumed Events

The Checkout capability consumes:

- CartUpdated
- CouponApplied
- CouponRemoved
- CustomerLoggedIn

---

# Related Capabilities

- BC-COM-102 Shopping Cart
- BC-COM-104 Payment Processing
- BC-PLT-163 Tax Management
- BC-PLT-162 Currency Management

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |