# Membership Capabilities

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-120 |
| Capability ID | BC-MEM-120 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Membership |
| Owner | Membership Domain |

---

# Overview

The Membership Capability manages the lifecycle of Members within the AsBeez ecosystem.

It enables individuals to participate in the AsBeez community beyond being a customer by providing access to membership benefits, referral features, rewards participation, and future loyalty programs.

Membership is free and may be activated independently of making a purchase.

---

# Responsibilities

The Membership Capability is responsible for:

- Member Registration
- Member Profile Management
- Member Authentication
- Member Verification
- Referral Management
- Invite Links
- Membership Status
- Beneficiary Assignment
- Membership Preferences

The Membership Capability is **not responsible** for:

- Shopping
- Payments
- Orders
- Vendor Management
- Reward Point calculations
- ABC generation
- AHC distribution
- Wallet balances

These responsibilities belong to their respective capabilities.

---

# Membership Types

The platform supports the following account types.

| Type | Description |
|------|-------------|
| Customer | Purchases products without membership benefits. |
| Member | Participates in the AsBeez Membership Program. |
| Vendor | Sells products through the marketplace. |

A user may simultaneously be:

- Customer + Member
- Customer + Vendor
- Member + Vendor
- Customer + Member + Vendor

One user account supports multiple roles.

---

# Membership Lifecycle

```text
Register
    │
    ▼
Verify Email
    │
    ▼
Activate Membership
    │
    ▼
Update Profile
    │
    ▼
Participate in Membership Programs
```

---

# Membership Status

A membership may have one of the following statuses.

| Status | Description |
|----------|-------------|
| Pending | Awaiting email verification |
| Active | Membership is active |
| Suspended | Temporarily restricted |
| Deactivated | Membership disabled |
| Closed | Membership permanently closed |

---

# Included Capabilities

| ID | Capability |
|----|------------|
| BC-MEM-121 | Member Registration |
| BC-MEM-122 | Member Profile |
| BC-MEM-123 | Referral System |
| BC-MEM-124 | Invite Links |
| BC-MEM-125 | Membership Verification |
| BC-MEM-126 | Beneficiary Management |
| BC-MEM-127 | Member Dashboard |

---

# Configuration

Administrators may configure:

- Registration Settings
- Email Verification
- Membership Activation
- Referral Requirements
- Account Suspension Rules
- Beneficiary Rules

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-MEM-001 | Membership is free. |
| BR-MEM-002 | Email verification is required before activation. |
| BR-MEM-003 | A Customer may upgrade to a Member at any time. |
| BR-MEM-004 | One user account may have multiple roles. |
| BR-MEM-005 | Membership may be suspended for policy violations. |
| BR-MEM-006 | Members may assign one beneficiary for inheritance purposes. |

---

# Published Events

The Membership Capability publishes:

- MemberRegistered
- MemberActivated
- MemberUpdated
- MemberSuspended
- MemberReactivated
- MemberDeactivated

---

# Consumed Events

The Membership Capability consumes:

- EmailVerified
- VendorApproved

---

# Related Capabilities

- BC-MEM-121 Member Registration
- BC-MEM-122 Member Profile
- BC-MEM-123 Referral System
- BC-MEM-124 Invite Links
- BC-RWD-125 Reward Point Engine
- BC-VEN-141 Vendor Registration

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |