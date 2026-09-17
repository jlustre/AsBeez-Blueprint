# Allocation History

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Revenue Allocation Engine |
| Section | Ledgers |
| Document | Allocation History |
| Document ID | AEDS-RAE-LDG-003 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Revenue Architecture Team |

---

# Introduction

Allocation History provides a complete chronological record of every revenue allocation performed by the Revenue Allocation Engine.

While the Allocation Ledger records the financial accounting entries created during allocation, the Allocation History documents the complete business lifecycle of each allocation, including policy resolution, allocation decisions, processing milestones, and audit information.

Allocation History enables administrators, auditors, and analysts to understand **how**, **when**, and **why** revenue was allocated.

---

# Purpose

Allocation History exists to:

- Record the complete allocation lifecycle.
- Preserve allocation decision history.
- Support auditing and compliance.
- Enable operational troubleshooting.
- Support historical reporting.
- Provide complete traceability.

---

# Guiding Principle

> **Every revenue allocation should leave a permanent and traceable business history explaining how the allocation occurred.**

---

# Allocation Lifecycle

```text
Commercial Transaction

↓

Qualified Transaction Value (QTV)

↓

Platform Participation Fee (PPF)

↓

Qualified Platform Revenue (QPR)

↓

Allocation Policy Resolved

↓

Allocation Rules Applied

↓

Platform Funds Updated

↓

Ledger Entries Created

↓

Allocation History Recorded
```

Allocation History is created after a successful allocation.

---

# What Allocation History Records

Allocation History captures business information such as:

- Revenue Source
- Revenue Type
- Allocation Policy
- Policy Version
- Allocation Rules Applied
- Destination Funds
- Allocation Percentages
- Processing Date
- Processing Duration
- Processing Status
- Initiating Process
- Correlation ID
- Related Ledger Entries

---

# Example

```text
Commercial Transaction

TX-2026-000145

↓

Qualified Platform Revenue

$10.00

↓

Policy

Default Allocation Policy v1

↓

Platform Operations Fund

40%

↓

$4.00

↓

Compensation Fund

60%

↓

$6.00

↓

Allocation Completed

2026-08-15 09:32:14 UTC
```

This information becomes part of the permanent Allocation History.

---

# Allocation States

An allocation may pass through the following states:

```text
Received

↓

Validated

↓

Policy Resolved

↓

Rules Applied

↓

Funds Allocated

↓

Ledger Posted

↓

Completed
```

Possible exception states include:

- Validation Failed
- Policy Not Found
- Allocation Rejected
- Allocation Reversed
- Manual Review

---

# Recorded Metadata

Each Allocation History record may include:

- Allocation History ID
- Qualified Platform Revenue ID
- Revenue Source
- Revenue Type
- Platform Partner
- Country
- Currency
- Allocation Policy
- Policy Version
- Processing Status
- Effective Date
- Created Timestamp
- Completed Timestamp
- Processing Duration
- Correlation ID
- Notes

---

# Search and Reporting

Allocation History should support searching by:

- Allocation ID
- Commercial Transaction
- Platform Partner
- Revenue Type
- Allocation Policy
- Country
- Currency
- Date Range
- Processing Status
- Destination Fund

---

# Business Rules

## AH-001

Every successful revenue allocation must create an Allocation History record.

---

## AH-002

Allocation History records are immutable.

---

## AH-003

Allocation History records must reference the Allocation Policy and Policy Version used during processing.

---

## AH-004

Historical Allocation History must remain available even after policy changes.

---

## AH-005

Allocation History must be linked to all related ledger entries.

---

## AH-006

Corrections are recorded as new history records rather than modifying existing records.

---

## AH-007

Allocation History must support complete traceability from Commercial Transaction through Financial Settlement.

---

# Relationship with Ledgers

Allocation History complements, but does not replace, platform ledgers.

| Component | Responsibility |
|-----------|----------------|
| Allocation History | Records the business process and timeline. |
| Allocation Ledger | Records financial allocation entries. |
| Compensation Fund Ledger | Records Compensation Fund activity. |
| Financial Ledger | Records accounting and settlement. |

---

# Relationship with Other Engines

| Platform Engine | Responsibility |
|-----------------|----------------|
| Commerce Engine | Originates Commercial Transactions. |
| Platform Participation Engine | Produces Qualified Platform Revenue. |
| Revenue Allocation Engine | Creates Allocation History. |
| Rewards Engine | Consumes Compensation Fund allocations. |
| Financial Engine | Uses Allocation History for reconciliation and audit support. |
| Analytics Engine | Produces operational and historical reports. |

---

# Governance

Allocation History should support:

- Audit reviews
- Financial reconciliation
- Policy validation
- Operational monitoring
- Regulatory reporting
- Historical investigations

History records should never be removed from the platform.

---

# Long-Term Vision

Allocation History should become the operational memory of the Revenue Allocation Engine.

Combined with immutable ledgers, it provides a complete picture of both **what happened financially** and **how the allocation process reached its final result**, supporting transparency, governance, and long-term platform trust.

---

# Closing Statement

Allocation History preserves the chronological story behind every revenue allocation.

By maintaining a permanent record of allocation decisions, policies, processing steps, and outcomes, AsBeez ensures that every movement of Platform Revenue can be understood, verified, and audited long after the financial entries have been recorded.

---

# Allocation History Principle

> **Ledgers record financial facts. Allocation History records business context. Together they provide a complete, transparent, and auditable view of every revenue allocation within the AsBeez Participation Economy.**

---

# Related Documents

- 000-index.md
- 001-allocation-ledger.md
- 002-compensation-fund-ledger.md
- ../020-allocation-rules/000-index.md
- ../../005-financial-engine/000-index.md

---

# Revision History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Allocation History specification. |