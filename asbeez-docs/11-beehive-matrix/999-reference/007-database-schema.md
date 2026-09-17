# Database Schema

## Purpose

This document defines database schema reference material.

# Database Schema

> **Document:** `11-beehive-matrix/999-reference/007-database-schema.md`

---

# Overview

The **Database Schema** document defines the logical and physical database architecture of the **AsBeez Beehive Matrix**.

It serves as the authoritative reference for all database entities, relationships, constraints, indexing strategies, partitioning approaches, and scalability considerations.

The schema has been designed around the following architectural principles:

- Domain-Driven Design (DDD)
- Event Sourcing
- CQRS
- Immutable Financial Records
- Append-Only Ledgers
- Multi-Country Architecture
- High Scalability
- AI Readiness
- Auditability

This document represents the logical schema. Physical implementations may differ depending on database technology.

---

# Objectives

The schema is designed to:

- support millions of members
- support billions of ledger records
- guarantee financial integrity
- minimize locking
- maximize scalability
- simplify reporting
- enable replay
- support AI analytics
- maintain audit history

---

# Database Philosophy

The Beehive Matrix database separates data into multiple logical domains.

```text
Identity

Membership

Business Cells

Rewards

Wallet

Ledger

Country

Administration

AI

Monitoring

Reporting

Audit

Events
```

Each domain owns its own aggregate data.

---

# Database Architecture

```text
Application

↓

Commands

↓

Write Database

↓

Event Store

↓

Event Bus

↓

Projection Builders

↓

Read Database

↓

Dashboards

↓

Reports

↓

AI
```

---

# Database Types

The platform may utilize multiple storage technologies.

| Database | Purpose |
|-----------|----------|
| PostgreSQL / MySQL | Primary transactional data |
| Event Store | Immutable domain events |
| Redis | Cache & queues |
| Object Storage | Files & backups |
| Search Engine | Full-text search |
| Analytics Warehouse | Reporting & BI |
| Vector Database | AI knowledge retrieval (optional) |

---

# Domain Schema

```text
Database

├── Identity
├── Membership
├── Business Cells
├── Rewards
├── Wallet
├── Ledger
├── Country
├── Notifications
├── Reporting
├── Monitoring
├── AI
├── Audit
├── Security
└── Events
```

---

# Identity Domain

## Members

| Column | Type |
|---------|------|
| id | UUID |
| member_number | String |
| country_id | UUID |
| sponsor_id | UUID |
| email | String |
| mobile | String |
| password_hash | String |
| status | Enum |
| created_at | Timestamp |
| updated_at | Timestamp |

---

## Roles

```text
roles

role_permissions

permissions
```

---

## Sessions

```text
sessions

device_tokens

login_history
```

---

# Membership Domain

## Members

Business profile information.

```text
members

member_profiles

member_addresses

member_preferences

member_documents
```

---

## Referrals

```text
member_referrals
```

Columns

- sponsor
- referral
- relationship_date
- qualification_status

---

# Country Domain

```text
countries

country_settings

country_languages

country_currencies

country_tax_rules

country_thresholds
```

---

# Business Cell Domain

## business_cells

Primary Business Cell table.

| Column | Type |
|---------|------|
| id | UUID |
| member_id | UUID |
| country_id | UUID |
| genealogy_position | String |
| level | Integer |
| status | Enum |
| created_at | Timestamp |

---

## business_cell_positions

Stores immutable matrix positions.

---

## business_cell_history

Historical lifecycle.

---

# Reward Domain

```text
reward_points

reward_distributions

reward_balances

reward_rules

reward_levels
```

---

## reward_points

| Column | Type |
|---------|------|
| id | UUID |
| member_id | UUID |
| transaction_id | UUID |
| points | Decimal |
| source | String |
| created_at | Timestamp |

---

# Wallet Domain

```text
wallets

wallet_transactions

wallet_balances

withdrawals

withdrawal_batches
```

---

## wallets

| Column | Type |
|---------|------|
| id | UUID |
| member_id | UUID |
| currency | String |
| status | Enum |
| created_at | Timestamp |

---

# Ledger Domain

The Ledger is the financial source of truth.

Tables:

```text
ledger_entries

ledger_accounts

ledger_batches

ledger_balances
```

---

## ledger_entries

| Column | Type |
|---------|------|
| id | UUID |
| account_id | UUID |
| transaction_type | Enum |
| amount | Decimal(18,8) |
| currency | String |
| correlation_id | UUID |
| created_at | Timestamp |

---

## Ledger Principles

Ledger entries are:

- append only
- immutable
- replayable
- auditable

Updates are prohibited.

---

# Event Store

```text
events
```

Columns

| Column | Type |
|---------|------|
| id | UUID |
| aggregate_id | UUID |
| aggregate_type | String |
| event_name | String |
| payload | JSON |
| version | Integer |
| occurred_at | Timestamp |

---

# Read Models

Optimized projections.

```text
member_dashboard

wallet_dashboard

reward_dashboard

country_dashboard

admin_dashboard
```

Read models may be rebuilt.

---

# Notification Domain

```text
notifications

notification_templates

notification_queue

notification_delivery
```

---

# Administration Domain

```text
administrators

admin_sessions

admin_activity

configuration

feature_flags
```

---

# Monitoring Domain

```text
system_metrics

health_checks

alerts

incidents

logs
```

---

# AI Domain

```text
ai_recommendations

ai_feedback

ai_models

ai_prompts

ai_embeddings

ai_sessions
```

---

# Reporting Domain

```text
reports

report_jobs

report_exports

scheduled_reports
```

---

# Audit Domain

```text
audit_logs

audit_changes

audit_exports
```

Audit data is immutable.

---

# Security Domain

```text
security_events

failed_logins

password_history

api_keys

device_trust
```

---

# File Storage

Metadata tables.

```text
files

folders

attachments

media
```

Actual files reside in object storage.

---

# Relationship Overview

```text
Country

↓

Members

↓

Business Cells

↓

Reward Points

↓

Wallet

↓

Ledger
```

---

# Aggregate Relationships

```text
Member

↓

Business Cell

↓

Reward Distribution

↓

Wallet

↓

Ledger
```

Each aggregate owns its own consistency boundary.

---

# Primary Keys

Every aggregate uses UUIDs.

Example

```text
UUID

550e8400-e29b-41d4-a716-446655440000
```

---

# Foreign Keys

Examples

```text
business_cells.member_id

↓

members.id
```

```text
wallets.member_id

↓

members.id
```

---

# Unique Constraints

Examples

- member_number
- email
- wallet per member per currency
- matrix position
- configuration key

---

# Index Strategy

High-frequency indexes include:

```text
member_id

country_id

created_at

status

correlation_id

transaction_id

event_name

wallet_id

business_cell_id
```

Composite indexes are preferred for common query patterns.

---

# Partition Strategy

Very large tables may be partitioned by:

- country
- year
- month
- event date

Example

```text
ledger_entries

↓

2028

↓

January
```

---

# Archival Strategy

Archive candidates:

- historical logs
- notifications
- exports
- reports

Never archive:

- ledger
- events
- Business Cells
- audit logs

---

# Soft Deletes

Used selectively.

Allowed:

- notifications
- reports
- temporary drafts

Not allowed:

- ledger
- events
- Business Cells
- audit

---

# Versioning

Configuration and event schemas include versions.

```text
version

1

2

3
```

---

# Transaction Strategy

Critical transactions include:

- Business Cell creation
- reward distribution
- ledger creation
- withdrawals

All execute atomically.

---

# CQRS Separation

Write model

```text
Commands

↓

Write Database
```

Read model

```text
Queries

↓

Projection Database
```

---

# Event Sourcing

Business events are stored before projections.

```text
Command

↓

Aggregate

↓

Event

↓

Projection
```

---

# Concurrency Control

Use optimistic concurrency.

```text
version

↓

compare

↓

update
```

Conflicting updates are rejected.

---

# Data Retention

| Data | Retention |
|------|-----------|
| Ledger | Permanent |
| Events | Permanent |
| Business Cells | Permanent |
| Audit Logs | Permanent |
| Reports | Configurable |
| Notifications | Configurable |
| Metrics | Configurable |

---

# AI Considerations

AI accesses:

- projections
- reports
- metrics
- documentation
- embeddings

AI never directly modifies financial tables.

---

# Performance Considerations

Database optimizations include:

- connection pooling
- indexing
- query optimization
- caching
- asynchronous processing
- batching
- partitioning
- projection databases

---

# Security Considerations

Database security includes:

- encryption at rest
- encryption in transit
- least privilege
- row-level security (where applicable)
- audit logging
- secret management
- key rotation

---

# Backup Strategy

Backups include:

- full backups
- incremental backups
- point-in-time recovery
- event store backups
- verification
- off-site replication

---

# Scalability

The schema supports:

- millions of members
- billions of ledger records
- billions of events
- thousands of administrators
- hundreds of countries
- petabyte-scale reporting

---

# Example Entity Relationship Diagram

```text
Country
   │
   ├─────────────┐
   │             │
   ▼             ▼
Members      Country Settings
   │
   ├─────────────┐
   │             │
   ▼             ▼
Business Cells  Wallets
   │             │
   ▼             ▼
Reward Distributions
        │
        ▼
Ledger Entries
        │
        ▼
Reports / Dashboards / AI
```

---

# Naming Conventions

Tables

```text
snake_case

plural

examples

members

wallet_transactions

business_cells
```

Columns

```text
snake_case

member_id

country_id

created_at
```

Primary Keys

```text
id
```

Foreign Keys

```text
entity_id
```

Timestamps

```text
created_at

updated_at

deleted_at
```

---

# Best Practices

- Use UUIDs for all aggregates.
- Keep the Ledger append-only.
- Never update immutable financial records.
- Partition high-volume tables.
- Separate write and read models.
- Store events permanently.
- Keep projections disposable.
- Use optimistic concurrency.
- Index common query paths.
- Document every schema change through version-controlled migrations.

---

# Related Documents

- 001-glossary.md
- 002-configuration-reference.md
- 003-country-examples.md
- 004-example-scenarios.md
- 005-sequence-diagrams.md
- 006-state-diagrams.md
- 008-data-dictionary.md
- 009-business-rules-reference.md

---

# Summary

The Database Schema document defines the logical data architecture of the AsBeez Beehive Matrix. By organizing data into well-defined domain boundaries, separating transactional and analytical workloads through CQRS, preserving immutable financial records in append-only ledgers, storing business history through Event Sourcing, and supporting country isolation, replayability, auditing, AI integration, and enterprise-scale growth, the schema provides a robust foundation capable of supporting global operations while maintaining consistency, integrity, and long-term maintainability.