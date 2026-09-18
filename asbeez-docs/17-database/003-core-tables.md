# Core Tables

## Purpose

Core tables provide stable identity, tenancy, organization, user, role, country, entity, currency, policy, and configuration references shared through contracts.

## Table Groups

- `users`, `organizations`, `memberships`, `roles`, `permissions`, and scoped access grants;
- `legal_entities`, `countries`, `currencies`, `time_zones`, and jurisdiction registrations;
- `addresses`, consent/preferences, terms acceptance, verification references, and support cases;
- policy/configuration definitions, versions, effective dates, approvals, and feature flags; and
- correlation/idempotency references, integration identities, and service ownership metadata.

## Rules

Separate identity from financial ownership and authorization. Country assignment is platform state subject to legal/tax/compliance review, not proof of residence. Personal and identity data is classified, minimized, encrypted, scoped, retained, and audited. Core tables cannot directly mutate financial tables.

## Integrity

Use stable IDs, uniqueness within tenant/entity scope, effective-date conflict checks, optimistic versions, status constraints, audit references, and migration/backfill evidence. Historical acceptance, verification, and country decisions remain immutable.

## Related Documents

- [index.md](index.md)
- [004-commerce-tables.md](004-commerce-tables.md)
- [008-audit-tables.md](008-audit-tables.md)
- [../14-legal-compliance/006-privacy.md](../14-legal-compliance/006-privacy.md)
