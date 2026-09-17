# AsBeez Platform Glossary

---

# Overview

The AsBeez Platform Glossary defines the official business and technical terminology used throughout the platform.

It serves as the single source of truth for all domain language, ensuring consistency across architecture, software development, APIs, database design, legal agreements, user interfaces, training materials, and AI assistants.

Every engine within the AsBeez Platform should use the terminology defined in this glossary.

---


# Terminology Governance Policy

The AsBeez Platform maintains a single, official business vocabulary known as the **AsBeez Ubiquitous Language**.

This glossary is the authoritative source for all business and technical terminology used throughout the platform. Every term defined here represents an official concept within the AsBeez architecture and should be used consistently across all domains.

To preserve clarity, consistency, and long-term maintainability, the following policies apply:

## Principles

- Every new business concept must be defined in this glossary before it is introduced into the platform.
- All architecture documents must use the official terminology defined here.
- APIs, database schemas, event names, user interfaces, reports, training materials, legal agreements, and AI assistants should reference the same official terminology.
- Existing terminology should not be redefined or replaced without updating this glossary.
- Synonyms should be avoided unless explicitly documented as acceptable alternatives.
- Business terminology should remain industry-neutral whenever possible and avoid unnecessary regulatory or industry-specific language.

## Purpose

Maintaining a shared vocabulary ensures that everyone involved in the AsBeez ecosystem—including business stakeholders, developers, architects, designers, QA engineers, legal teams, support staff, partners, and AI assistants—communicates using the same language.

This reduces ambiguity, improves documentation quality, simplifies onboarding, and strengthens the overall consistency of the platform.

## Evolution

As the AsBeez Platform evolves, this glossary will continue to grow.

New business domains, engines, features, and services should extend the existing language rather than introducing competing terminology.

Whenever possible, new terms should align with the core principles of the AsBeez Platform:

- Participation Economy
- Platform Partnerships
- Qualified Platform Revenue
- Contribution-Based Rewards
- Hive-Based Growth
- Transparency
- Traceability
- Simplicity
- Sustainability

This glossary is considered a living document and forms part of the official architecture of the AsBeez Platform.

---


# 1. Membership Domain

## Member

An individual with an active AsBeez Membership.

Members may purchase products and services, earn Reward Points (RP), create AsBeez Business Cells (ABC), accumulate AsBeez Hive Credits (AHC), and participate in the AsBeez ecosystem.

---

## Referrer

A Member who introduces another Member into the AsBeez Platform.

The Referrer relationship exists only between Members and is independent of the ABC Hive structure.

---

## Referral

The relationship created when one Member successfully introduces another Member.

Referral relationships determine membership lineage and qualification rules but do not define reward distribution inside the Hive.

---

# 2. Platform Partnership Domain

## Platform Partner

A business entity that participates in the AsBeez ecosystem under a Platform Participation Agreement (PPA).

Examples include:

- Retail Stores
- Restaurants
- Insurance Agencies
- Real Estate Brokerages
- Car Dealers
- Contractors
- Hotels
- Clinics
- Travel Agencies

---

## Platform Product Provider

A Platform Partner that primarily sells physical or digital products.

Examples:

- Retail Stores
- Auto Dealers
- Electronics Stores
- Grocery Stores

---

## Platform Service Provider

A Platform Partner that primarily provides services.

Examples:

- Insurance Agencies
- Realtors
- Contractors
- Dentists
- Lawyers
- Hotels
- Consultants

---

## Platform Participation Agreement (PPA)

The contractual agreement between AsBeez and a Platform Partner.

The PPA defines:

- Participation Terms
- Platform Participation Fee
- Qualified Transaction Value Rules
- Effective Dates
- Settlement Rules
- Compliance Requirements

---

## Platform Participation Fee (PPF)

The fee paid by a Platform Partner to AsBeez under a Platform Participation Agreement.

The PPF represents the commercial consideration paid for participating in the AsBeez ecosystem and may be viewed as a customer acquisition, marketing, and platform participation fee.

The PPF is calculated as a percentage of the Qualified Transaction Value (QTV).

---

# 3. Commerce Domain

## Commercial Transaction

A completed commercial activity between a Customer and a Platform Partner.

Examples include:

- Product Purchase
- Service Purchase
- Insurance Policy
- Home Purchase
- Vehicle Purchase
- Contractor Project
- Hotel Booking
- Subscription Renewal

---

## Qualified Transaction Value (QTV)

The portion of a Commercial Transaction that is eligible for Platform Participation Fee calculation.

The QTV is defined by the Platform Participation Agreement.

Typical exclusions may include:

- Taxes
- Shipping
- Government Fees
- Other configurable exclusions

---

# 4. Revenue Allocation Domain

## Qualified Platform Revenue (QPR)

Revenue recognized by AsBeez after:

- Platform Participation Fee has been calculated.
- Qualification rules have been satisfied.
- Platform Participation Agreement has been validated.

Only Qualified Platform Revenue may enter the Revenue Allocation Engine.

---

## Qualified Revenue Certificate (QRC)

The immutable economic record issued for every Qualified Platform Revenue.

The QRC becomes the permanent reference used throughout the platform.

The QRC is referenced by:

- Revenue Allocation
- Funding Batch
- Compensation Fund
- Rewards Engine
- Financial Engine
- Analytics
- Audit Reports

---

## Revenue Allocation

The process of distributing Qualified Platform Revenue into one or more financial destinations according to Allocation Policies.

Examples:

- Company Revenue
- Compensation Fund
- Strategic Reserve
- Country Fund
- Marketing Fund

---

## Funding Batch

A group of Reward Point generation events funded by one or more Qualified Revenue Certificates.

---

## Compensation Fund

The financial fund that receives a configurable percentage of Qualified Platform Revenue.

The Compensation Fund finances Reward Point generation.

---

# 5. Rewards Domain

## Reward Points (RP)

The internal contribution currency generated from the Compensation Fund.

Reward Points are consumed when creating an AsBeez Business Cell.

Reward Points are not money.

---

## AsBeez Business Cell (ABC)

A digital business cell created when sufficient Reward Points are accumulated.

Each ABC owns an independent Hive capable of generating AsBeez Hive Credits.

---

## AsBeez Hive Credit (AHC)

The permanent contribution credit earned by an ABC.

AHC accumulates throughout the lifetime of the ABC.

AHC never expires.

Current conversion policy:

```
10 AHC = $1
```

---

# 6. Hive Domain

## Hive

The contribution structure owned by an AsBeez Business Cell.

Every ABC owns an independent Hive.

---

## Ancestor ABC

An ABC positioned above another ABC within the same Hive.

Ancestors may receive AHC generated by newly created descendant ABCs according to the Rewards Engine rules.

---

## Descendant ABC

An ABC positioned below another ABC within the same Hive.

Descendants contribute AHC to qualified Ancestor ABCs.

---

## Parent ABC

The immediate Ancestor ABC.

---

## Child ABC

The immediate Descendant ABC.

---

## Sibling ABC

ABCs sharing the same Parent ABC.

---

## Root ABC

The first ABC in a Hive.

---

## Branch

One path extending from an ABC through its Descendants.

---

# 7. Financial Domain

## Company Revenue

The portion of Qualified Platform Revenue retained by AsBeez for operations, growth, infrastructure, and profit.

---

## Settlement

The process of converting eligible AsBeez Hive Credits into monetary value according to Financial Engine policies.

---

# Guiding Principles

The official terminology of the AsBeez Platform is based on the following principles:

- Business relationships use **Platform Partner** terminology.
- Member relationships use **Referrer** terminology.
- Hive relationships use **Ancestor** and **Descendant** terminology.
- Revenue relationships use **Platform Participation** terminology.
- Financial relationships use **Qualified Platform Revenue** terminology.
- Reward relationships use **Business Cell** terminology.

No official documentation should use MLM-oriented terms such as:

- Upline
- Downline
- Leg
- Sponsor (except where legally required)
- Commission Income

These terms are intentionally replaced with AsBeez-specific terminology.

---

# Revision History

| Version | Date | Description |
|---------|------|-------------|
| 2.0.0 | YYYY-MM-DD | Established the official AsBeez ubiquitous language, introducing Platform Partner, Platform Participation Agreement (PPA), Platform Participation Fee (PPF), Qualified Platform Revenue (QPR), and Hive relationship terminology based on Ancestor and Descendant ABCs. |