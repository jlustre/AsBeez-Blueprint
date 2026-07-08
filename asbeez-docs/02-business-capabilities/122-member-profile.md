# Member Profile

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-122 |
| Capability ID | BC-MEM-122 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Membership |
| Owner | Membership Domain |

---

# Overview

The Member Profile capability manages the personal information, preferences, and account settings of an AsBeez Member.

It provides Members with a centralized location to maintain their profile information throughout their membership lifecycle.

---

# Responsibilities

The Member Profile capability is responsible for:

- Managing personal information
- Managing contact information
- Managing profile photo
- Managing account preferences
- Managing beneficiary information
- Managing notification preferences
- Viewing membership information

The Member Profile capability is **not responsible** for:

- Registration
- Authentication
- Password management
- Referrals
- Reward calculations
- Wallet balances
- Vendor information

---

# Profile Information

Each Member Profile contains:

## Personal Information

- First Name
- Middle Name
- Last Name
- Preferred Name
- Date of Birth *(Optional)*
- Gender *(Optional)*

---

## Contact Information

- Email Address
- Mobile Number
- Telephone Number *(Optional)*

---

## Address

- Country
- State / Province
- City
- Postal Code
- Address Line 1
- Address Line 2 *(Optional)*

---

## Profile

- Profile Photo
- Preferred Language
- Preferred Currency
- Time Zone

---

## Membership Information

- Member ID
- Membership Status
- Registration Date
- Activation Date

---

## Beneficiary

Members may assign one beneficiary.

Beneficiary information includes:

- Full Name
- Relationship
- Email *(Optional)*
- Contact Number *(Optional)*

The beneficiary may receive the Member's account according to the policies defined by the Membership program.

---

# Member Preferences

Members may configure:

- Email Notifications
- SMS Notifications
- Marketing Emails
- Language
- Time Zone

---

# Profile Workflow

```text
View Profile
      │
      ▼
Update Information
      │
      ▼
Validate Changes
      │
      ▼
Save Profile
```

---

# Configuration

Administrators may configure:

- Required Profile Fields
- Editable Fields
- Supported Languages
- Supported Countries
- Profile Photo Size
- Beneficiary Requirement

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-MEM-201 | Every Member has exactly one Member Profile. |
| BR-MEM-202 | Email addresses must remain unique. |
| BR-MEM-203 | Country changes may affect marketplace availability. |
| BR-MEM-204 | Members may assign only one beneficiary at a time. |
| BR-MEM-205 | Beneficiary changes are recorded in the audit history. |
| BR-MEM-206 | Some profile fields may require administrative approval before taking effect. |

---

# Published Events

The Member Profile capability publishes:

- MemberProfileUpdated
- BeneficiaryAssigned
- BeneficiaryUpdated
- MemberPreferencesUpdated

---

# Consumed Events

The Member Profile capability consumes:

- MemberActivated

---

# Related Capabilities

- BC-MEM-121 Member Registration
- BC-MEM-123 Referral System
- BC-MEM-126 Beneficiary Management
- BC-PLT-165 Notifications

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |