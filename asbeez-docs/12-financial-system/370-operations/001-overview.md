# Overview

> **Document:** 12-financial-system/370-operations/001-overview.md

---

## Purpose

Financial operations run reliable, controlled, auditable workflows across payments, wallets, payouts, refunds, disputes, tax, treasury, reconciliation, close, support, exceptions, incidents, continuity, and recovery.

## Operating Principles

- every operational action has an owner, authority, scope, status, evidence, and escalation;
- operators use approved commands/runbooks and never edit posted accounting or balances directly;
- provider state is evidence until mapped and reconciled;
- pending, unknown, held, failed, and exception states remain visible; and
- operations preserve entity/country/currency/period, privacy, security, segregation of duties, and audit lineage.

## Control Loop

Observe -> triage -> validate source/policy -> act through an authorized workflow -> reconcile -> communicate -> document -> review/remediate.

## Related Documents

- [000-index.md](000-index.md)
- [002-operating-model.md](002-operating-model.md)
- [003-daily-financial-operations.md](003-daily-financial-operations.md)
- [013-exception-management.md](013-exception-management.md)
- [../350-observability/001-overview.md](../350-observability/001-overview.md)
