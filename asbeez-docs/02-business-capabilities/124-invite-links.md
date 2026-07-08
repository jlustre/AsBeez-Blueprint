# Invite Links

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-124 |
| Capability ID | BC-MEM-124 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Membership |
| Owner | Membership Domain |

---

# Overview

The Invite Links capability allows Members to invite new people to join the AsBeez platform using personalized referral links or invite codes.

Every successful registration through an invite link automatically associates the new Member with the referring Member.

Invite Links simplify member referrals while ensuring accurate referral attribution.

---

# Responsibilities

The Invite Links capability is responsible for:

- Generating invite links
- Generating invite codes
- Validating invite codes
- Associating referrals during registration
- Tracking invite link usage
- Recording invite statistics

The Invite Links capability is **not responsible** for:

- Member registration
- Referral qualification
- Reward calculations
- ABC generation
- AHC distribution
- Wallet credits

---

# Invite Methods

The platform supports:

- Personalized Invite Link
- Invite Code
- QR Code *(Future)*

---

# Invite Link Structure

Example:

```text
https://www.asbeez.com/register?ref=ABC123XYZ
```

The referral code uniquely identifies the referring Member.

---

# Invite Code

Each Member receives a unique invite code.

Example:

```text
JOHN12345
```

A new Member may enter the invite code during registration instead of using an invite link.

---

# Invite Information

Each invite records:

- Invite ID
- Referring Member
- Invite Code
- Invite Link
- Created Date
- Total Clicks
- Successful Registrations
- Qualified Referrals

---

# Invite Workflow

```text
Generate Invite Link
          │
          ▼
Share Invite
          │
          ▼
Prospective Member Opens Link
          │
          ▼
Registration Form
          │
          ▼
Referral Recorded
```

---

# Link Validation

Before accepting an invite, the system validates:

- Invite Code Exists
- Referring Member Exists
- Referring Member Status
- Invite Link Status

Invalid invite links are rejected.

---

# Configuration

Administrators may configure:

- Invite Link Format
- Invite Code Length
- Invite Code Format
- Link Expiration *(Future)*
- QR Code Availability
- Custom Invite URLs

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-INV-001 | Every Member receives one unique invite code. |
| BR-INV-002 | Invite links are generated automatically upon Member activation. |
| BR-INV-003 | Invite codes must be unique. |
| BR-INV-004 | Invite links identify the referring Member during registration. |
| BR-INV-005 | Invite links do not qualify referrals. Qualification is determined by the Referral System. |
| BR-INV-006 | Invite statistics are maintained for reporting purposes. |

---

# Published Events

The Invite Links capability publishes:

- InviteLinkGenerated
- InviteLinkUsed
- InviteCodeValidated

---

# Consumed Events

The Invite Links capability consumes:

- MemberActivated

---

# Related Capabilities

- BC-MEM-121 Member Registration
- BC-MEM-123 Referral System

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |