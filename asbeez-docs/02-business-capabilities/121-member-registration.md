# Member Registration

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-121 |
| Capability ID | BC-MEM-121 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Membership |
| Owner | Membership Domain |

---

# Overview

The Member Registration capability allows individuals to create an AsBeez account and become Members of the platform.

Registration is free and requires email verification before the membership becomes active.

Members may join without purchasing any products.

---

# Responsibilities

The Member Registration capability is responsible for:

- Creating member accounts
- Validating registration information
- Email verification
- Activating membership
- Recording referral information
- Assigning Member ID
- Accepting Terms & Conditions

The Member Registration capability is **not responsible** for:

- Authentication
- Profile management
- Vendor registration
- Reward calculations
- Wallet creation
- ABC generation

---

# Registration Methods

Supported registration methods include:

- Email Registration
- Referral Link Registration
- Invite Code Registration

Future methods:

- Google Sign-In
- Apple Sign-In
- Facebook Login
- Microsoft Login

---

# Registration Information

The following information is required.

## Required

- First Name
- Last Name
- Email Address
- Password
- Country
- Accept Terms & Conditions

## Optional

- Mobile Number
- Referral Code
- Invite Code

---

# Registration Workflow

```text
Complete Registration Form
          │
          ▼
Validate Information
          │
          ▼
Create Member Account
          │
          ▼
Send Verification Email
          │
          ▼
Verify Email
          │
          ▼
Activate Membership
```

---

# Email Verification

Membership remains in **Pending** status until the email address has been verified.

Only verified Members can access Member features.

---

# Referral Registration

If a referral code or invite code is provided:

- The referring Member is recorded.
- The referral relationship is permanently established.
- The referral becomes qualified only after meeting the requirements defined in the Referral System capability.

---

# Configuration

Administrators may configure:

- Email Verification Required
- Password Policy
- Allowed Countries
- Referral Required
- Registration Approval
- Default Member Status

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-MEM-101 | Membership registration is free. |
| BR-MEM-102 | Email verification is required before activation. |
| BR-MEM-103 | Every Member must have a unique email address. |
| BR-MEM-104 | Referral codes are optional during registration. |
| BR-MEM-105 | Referral relationships cannot be changed after activation. |
| BR-MEM-106 | A unique Member ID is assigned upon successful registration. |
| BR-MEM-107 | Members must accept the Terms & Conditions before registration. |

---

# Published Events

The Member Registration capability publishes:

- MemberRegistered
- VerificationEmailSent
- MemberActivated
- RegistrationFailed

---

# Consumed Events

The Member Registration capability consumes:

- EmailVerified

---

# Related Capabilities

- BC-MEM-122 Member Profile
- BC-MEM-123 Referral System
- BC-MEM-124 Invite Links
- BC-MEM-127 Member Dashboard

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |