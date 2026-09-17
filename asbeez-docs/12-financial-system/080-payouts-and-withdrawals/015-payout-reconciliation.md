# Payout Reconciliation

> **Document:** 12-financial-system/080-payouts-and-withdrawals/015-payout-reconciliation.md

---

## Purpose

Payout reconciliation matches approved obligations, withdrawal requests, payout attempts, provider/bank evidence, wallet/subledger movements, settlement balances, reserves, fees, and General Ledger clearing/control accounts.

## Required Checks

- one approved payout maps to one intended provider effect;
- amount, currency, fee, destination, country, and beneficiary agree;
- provider submission and final status are evidenced;
- wallet debit or payable release occurs once and for the approved amount;
- returned, failed, held, and reversed funds remain attributable;
- batch totals agree to individual payouts; and
- source settlement, reward conversion, vendor/partner obligation, or wallet event is present where applicable.

## Outcomes

Matched, timing difference, provider mismatch, duplicate, missing source, unknown outcome, returned funds, currency difference, compliance exception, or approved adjustment. Every exception has owner, age, evidence, severity, and resolution.

## Related Documents

- [000-index.md](000-index.md)
- [007-payout-batches.md](007-payout-batches.md)
- [013-payout-failures.md](013-payout-failures.md)
- [016-payout-compliance.md](016-payout-compliance.md)
