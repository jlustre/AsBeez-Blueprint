# Reconciliation API

> **Document:** 12-financial-system/220-reconciliation/018-reconciliation-api.md

---

## Purpose

The Reconciliation API exposes authenticated sessions, populations, matches, control totals, exceptions, resolutions, approvals, and reports without allowing clients to alter source or ledger facts directly.

## Read Operations

- retrieve session, source/target, control totals, matches, exceptions, aging, approval, and certification;
- retrieve domain-specific status for bank, provider, wallet, rewards, vendors, partners, tax, reserves, FX, and country; and
- retrieve evidence-safe reports and resolution history.

## Commands

Open session, import evidence, propose match, classify exception, assign owner, submit resolution, approve disposition, reopen, and publish report. Commands require scope, authorization, idempotency, policy/tolerance, and audit correlation.

## Rules

Clients cannot mark unmatched items matched, edit source balances, alter posted entries, suppress material exceptions, or approve their own high-risk resolution through API fields.

## Related Documents

- [000-index.md](000-index.md)
- [002-reconciliation-domain-model.md](002-reconciliation-domain-model.md)
- [015-discrepancy-resolution.md](015-discrepancy-resolution.md)
- [019-reconciliation-events.md](019-reconciliation-events.md)
