# Reconciliation API

> **Document:** 12-financial-system/310-api/019-reconciliation-api.md

---

## Purpose

The Reconciliation API exposes runs, scopes, source snapshots, matching results, exceptions, resolutions, approvals, and certification across financial systems.

## Queries

Retrieve reconciliation run/scope, source version, period, entity/country/currency, control totals, matched/unmatched counts and amounts, exceptions, owner, severity, aging, resolution, and certification state.

## Commands

Start run, upload/import approved source evidence, match, assign exception, propose resolution, approve resolution, reopen, certify, or request rebuild. Commands require scope authority, source integrity, idempotency, segregation of duties, and control-total validation.

## Rules

Reconciliation may compare ledger, subledgers, wallets, rewards, providers, banks, vendors, partners, tax, reserves, and country books. Differences are explicit exceptions; APIs cannot hide them with manual balance edits. Certification records unresolved risk and reviewer evidence.

## Related Documents

- [000-index.md](000-index.md)
- [009-ledger-api.md](009-ledger-api.md)
- [020-reporting-api.md](020-reporting-api.md)
- [../300-data-model/014-reconciliation-schema.md](../300-data-model/014-reconciliation-schema.md)
- [../220-reconciliation/001-overview.md](../220-reconciliation/001-overview.md)
