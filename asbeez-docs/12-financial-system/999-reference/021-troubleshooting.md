# Troubleshooting

> **Document:** 12-financial-system/999-reference/021-troubleshooting.md

---

## Purpose

Use this quick guide to investigate financial symptoms without creating unsafe effects. Preserve correlation, source, scope, evidence, and audit history.

## Common Symptoms

- **Unknown provider state:** query provider, inspect callback/outbox, check idempotency, then reconcile; do not blindly retry.
- **Ledger mismatch:** stop affected posting, validate journal balance/account/period/dimensions, inspect source and control totals, use reversal/compensation only with authority.
- **Wallet/report mismatch:** compare wallet/subledger/ledger/projection versions and rebuild/reconcile; do not edit balances.
- **Payout delayed:** inspect compliance/risk/approval/destination/provider/batch/liquidity and escalation deadlines.
- **Tax difference:** verify jurisdiction, registration, classification, address, policy/version, rounding, provider evidence, and filing impact.
- **Close blocked:** inspect reconciliation, late data, checklist, accrual/deferral, trial balance, approvals, and unresolved risk; do not force close.

## Escalation

Escalate security/privacy, fraud/compliance, material financial, customer/vendor/partner, country/legal, provider, period/close, and recovery issues through operations/incident/exception runbooks with evidence.

## Related Documents

- [000-index.md](000-index.md)
- [014-example-scenarios.md](014-example-scenarios.md)
- [017-security-guidelines.md](017-security-guidelines.md)
- [../370-operations/013-exception-management.md](../370-operations/013-exception-management.md)
