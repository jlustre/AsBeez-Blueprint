# Reserve Release

> **Document:** 12-financial-system/180-reserves-and-funds/015-reserve-release.md

---

## Purpose

Reserve release returns or reallocates value after the protected exposure is resolved, expires, reduces, or is approved for use.

## Preconditions

Exposure/case review complete, release condition met, amount verified, currency/entity/purpose match, no blocking hold or legal issue, approval obtained, and reconciliation path available.

## Outcomes

Release to available settlement/payout, utilization against loss/obligation, transfer to approved fund, return to source, expiry, partial release, or continued hold.

## Rules

Release is idempotent, evidenced, and separately recorded. It does not automatically create revenue, payable, wallet credit, reward, or payout. Utilization references the loss or obligation; return references the funding source. Original reserve history remains immutable.

## Related Documents

- [000-index.md](000-index.md)
- [014-reserve-funding.md](014-reserve-funding.md)
- [016-reserve-reconciliation.md](016-reserve-reconciliation.md)
- [017-reserve-reporting.md](017-reserve-reporting.md)
