# Membership Types

## Introduction

The **Membership Types** document defines the classifications of participants within the AsBeez Membership Engine. These classifications determine a person's capabilities, privileges, responsibilities, and participation level within the AsBeez ecosystem.

Unlike many traditional membership programs that rely on paid subscription tiers (Silver, Gold, Platinum, etc.), AsBeez separates **identity**, **membership qualification**, and **participation level**. Every individual follows the same qualification path regardless of background, location, or financial status.

Membership Types are designed to support future expansion while maintaining backward compatibility with the core philosophy of fairness, transparency, and equal opportunity.

---

# Objectives

The Membership Types framework aims to:

- Clearly distinguish customers from members.
- Define participation levels.
- Simplify permission management.
- Support future membership programs.
- Enable country-specific configurations.
- Maintain fair qualification standards.
- Support enterprise participation.
- Enable AI personalization.
- Preserve scalability.
- Maintain consistent governance.

---

# Membership Classification Hierarchy

The Membership Engine classifies participants into the following categories:

```text
Visitor

↓

Registered User

↓

Customer

↓

Qualified Member

↓

Active Member

↓

Leadership Member (Future)

↓

Honorary Member (Future)

↓

Former Member
```

Each classification represents a different stage of participation rather than a measure of personal value or importance.

---

# Visitor

## Description

A Visitor has not yet created an AsBeez account.

### Capabilities

- Browse public pages.
- Search products.
- View vendors.
- Learn about AsBeez.
- Read public documentation.

### Restrictions

Visitors cannot:

- Purchase restricted products.
- Earn Reward Points.
- Access member resources.
- Participate in referrals.
- Create ABCs.

---

# Registered User

## Description

A Registered User has successfully created an account but has not yet actively participated in the marketplace.

### Capabilities

- Log in.
- Manage profile.
- Verify email.
- Configure account settings.

### Restrictions

Registered Users are not yet Customers until they begin participating in the marketplace.

---

# Customer

## Description

A Customer is any registered user who participates in the Marketplace but has **not yet qualified** for Membership.

Customers may:

- Purchase products.
- Purchase services.
- Earn Reward Points.
- Save favorites.
- Receive promotions.
- Build purchase history.

Customers do **not** own an ABC.

---

## Rights

Customers may:

- Access all public marketplace features.
- Contact support.
- Participate in promotions.
- Earn eligible Reward Points.
- Refer friends (subject to platform policies).

---

## Restrictions

Customers cannot:

- Receive member-exclusive benefits.
- Participate in ABC earnings.
- Earn AHC.
- Access member governance.
- Designate beneficiaries for membership assets.

---

# Qualified Member

## Description

A Qualified Member is a Customer who has successfully met all membership qualification requirements.

Qualification requires:

- Successful creation of at least one ABC.
- Satisfaction of all platform qualification rules.
- Required verification (where applicable).

This transition is permanent and fully auditable.

---

## Rights

Qualified Members receive:

- Full Membership status.
- Membership dashboard.
- Sponsor privileges.
- Referral benefits.
- Beneficiary management.
- Member-exclusive promotions.
- AI Member Assistant.

---

## Responsibilities

Members are expected to:

- Follow platform policies.
- Maintain accurate information.
- Conduct business ethically.
- Protect account credentials.
- Respect community standards.

---

# Active Member

## Description

An Active Member is a Qualified Member who remains in good standing and satisfies any ongoing platform participation requirements.

Active Members may:

- Own multiple ABCs.
- Continue earning AHC.
- Sponsor new customers.
- Participate in future governance.
- Access all membership privileges.

---

# Inactive Member

## Description

An Inactive Member is a previously active member whose participation has temporarily paused.

Possible reasons include:

- Voluntary inactivity.
- Administrative hold.
- Compliance review.
- Future inactivity policies.

Inactive status does **not** necessarily remove ownership of historical membership assets.

---

# Suspended Member

## Description

Suspension is a temporary administrative action.

Reasons may include:

- Fraud investigation.
- Security concerns.
- Policy violations.
- Regulatory review.

Suspended members retain historical records but may temporarily lose operational privileges.

---

# Reactivated Member

## Description

A previously inactive or suspended member who has successfully completed the reactivation process.

Reactivation may require:

- Identity verification.
- Compliance review.
- Administrative approval.
- Resolution of outstanding issues.

Historical membership continuity is preserved whenever possible.

---

# Former Member

## Description

A Former Member is an individual whose membership has been permanently closed.

Possible reasons:

- Voluntary termination.
- Death.
- Legal requirements.
- Fraud.
- Administrative termination.

Historical records remain permanently archived.

---

# Leadership Member (Future)

Future versions of AsBeez may recognize members demonstrating exceptional long-term contributions.

Possible criteria:

- Marketplace participation.
- Community leadership.
- Customer service.
- Ethical referrals.
- Educational contributions.
- Vendor mentorship.

Leadership recognition is honorary and does not override standard membership rights.

---

# Honorary Member (Future)

The platform may recognize individuals or organizations for extraordinary contributions.

Examples:

- Founders.
- Strategic advisors.
- Major contributors.
- Community builders.
- Charitable organizations.

Honorary status does not automatically grant financial privileges.

---

# Corporate Membership (Future)

Organizations may participate as Corporate Members.

Potential capabilities:

- Multiple authorized users.
- Shared billing.
- Department management.
- Enterprise purchasing.
- Procurement workflows.

Corporate membership supplements—not replaces—individual memberships.

---

# Vendor Membership

A Vendor may also be a Member.

These are independent roles.

Example:

```text
Member

+

Marketplace Vendor
```

Vendor status does not automatically qualify an individual for Membership, and Membership does not automatically create a Vendor account.

---

# Creator Membership (Future)

Content creators may receive additional capabilities.

Examples:

- Course publishing.
- Digital downloads.
- Live events.
- Membership subscriptions.
- Community management.

Creator Membership builds upon standard Membership.

---

# Country Membership

Every Qualified Member belongs to one active country membership.

Country membership determines:

- ABC thresholds.
- Tax treatment.
- Regulatory requirements.
- Currency.
- Local benefits.

Country membership does not create a separate identity.

---

# Multiple Memberships

The Membership Engine follows a simple rule:

> **One Global Identity. One Active Membership. One Active Country Membership.**

A member may:

- Own multiple ABCs.
- Operate multiple businesses.
- Sell through multiple vendors.

However, a person cannot maintain multiple independent Membership accounts.

---

# Membership Qualification Matrix

| Classification | Marketplace Access | Earn RP | Own ABC | Earn AHC | Sponsor | Beneficiary | Member Dashboard |
|----------------|-------------------|---------|---------|----------|----------|--------------|------------------|
| Visitor | Limited | No | No | No | No | No | No |
| Registered User | Limited | No | No | No | No | No | No |
| Customer | Yes | Yes | No | No | Limited | No | Basic |
| Qualified Member | Yes | Yes | Yes | Yes | Yes | Yes | Full |
| Active Member | Yes | Yes | Yes | Yes | Yes | Yes | Full |
| Inactive Member | Limited | Limited | Historical | Limited | Limited | Yes | Limited |
| Suspended Member | Restricted | Restricted | Historical | Restricted | Restricted | Restricted | Restricted |
| Former Member | Archived | No | Historical | Historical | No | Historical | Archived |

---

# Membership Transitions

The primary progression is:

```text
Visitor

↓

Registered User

↓

Customer

↓

Qualified Member

↓

Active Member
```

Possible alternative transitions:

```text
Active

↓

Inactive

↓

Reactivated
```

or

```text
Active

↓

Suspended

↓

Reactivated
```

or

```text
Active

↓

Former Member
```

---

# Permissions

Permissions should be assigned through Role-Based Access Control (RBAC), not solely by membership type.

Examples:

- Customer permissions.
- Member permissions.
- Vendor permissions.
- Administrator permissions.
- Financial permissions.

Membership classification and system roles remain separate concepts.

---

# AI Personalization

AI adapts experiences according to membership classification.

Examples:

Visitors:

- Educational content.

Customers:

- Qualification guidance.
- Product recommendations.

Members:

- Business insights.
- Referral suggestions.
- Reward forecasting.

Leadership Members:

- Advanced analytics.
- Community opportunities.

---

# Security

Membership classifications affect security requirements.

Higher participation levels may require:

- Multi-Factor Authentication.
- Identity verification.
- Enhanced fraud monitoring.
- Financial verification.
- Compliance reviews.

Security scales with operational responsibility.

---

# Future Expansion

The Membership Types architecture supports future additions without breaking existing classifications.

Possible future types:

- Student Member
- Non-Profit Member
- Government Member
- Affiliate Member
- Franchise Member
- Ambassador
- Strategic Partner
- Enterprise Organization

Future classifications should inherit common membership behaviors while introducing specialized capabilities.

---

# Best Practices

- Keep membership classifications easy to understand.
- Separate membership status from permissions.
- Avoid unnecessary membership tiers.
- Preserve equal qualification requirements.
- Allow future extensibility.
- Maintain complete audit histories.
- Ensure country-specific compliance.
- Support AI-driven personalization.
- Protect member rights consistently.
- Document every transition clearly.

---

# Related Documents

This document complements:

- 000-index.md
- 001-overview.md
- 002-membership-lifecycle.md
- 004-registration-onboarding.md
- 005-verification-kyc.md
- 006-membership-benefits.md
- 007-referrals-sponsorship.md
- 008-beneficiary-management.md
- 009-membership-status.md
- 011-country-memberships.md
- 012-membership-governance.md

---

# Summary

The Membership Types framework defines the classifications that govern participation within the AsBeez ecosystem, from Visitor and Customer to Qualified Member and future leadership roles. By separating membership qualification from permissions and commercial participation, AsBeez maintains a fair, transparent, and scalable model that supports global growth while preserving a single global identity for every participant. This structure provides the flexibility to introduce future membership programs without compromising the platform's core principles or architectural integrity.