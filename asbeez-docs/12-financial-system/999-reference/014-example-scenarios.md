# Example Scenarios

> **Document:** 12-financial-system/999-reference/014-example-scenarios.md

---

## Purpose

These scenarios connect domain behavior to accounting, controls, events, APIs, operations, and reconciliation. They are test/reference examples, not authority to bypass policy.

## Marketplace Order

Order completes -> payment captured -> tax/fees/allocations calculated -> vendor/partner/reward treatment -> journal posted -> settlement/reconciliation -> wallet/payout/reporting. GMV and payment are not automatically revenue.

## Partial Refund

Eligibility and prior refunds checked -> approval -> provider refund -> tax/fee/reward/vendor/partner adjustments -> compensating journal/subledger effects -> reconciliation -> communication.

## Payout Return

Provider returns payout -> evidence stored -> recipient/source status held -> bank/provider reconciliation -> approved compensating wallet/ledger effect -> reserve/liquidity review -> communication and closure.

## Close Exception

Control difference detected -> assigned and investigated -> source refresh or approved adjustment -> re-reconcile -> document unresolved risk -> close only under authorized policy.

## Related Documents

- [000-index.md](000-index.md)
- [007-financial-state-diagrams.md](007-financial-state-diagrams.md)
- [015-reconciliation-reference.md](015-reconciliation-reference.md)
- [../360-testing/003-domain-rule-testing.md](../360-testing/003-domain-rule-testing.md)
