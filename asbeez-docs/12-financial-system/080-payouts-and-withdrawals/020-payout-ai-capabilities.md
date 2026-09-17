# Payout AI Capabilities

> **Document:** 12-financial-system/080-payouts-and-withdrawals/020-payout-ai-capabilities.md

---

## Purpose

AI may assist payout operations with risk detection, exception prioritization, reconciliation matching, support explanation, provider routing, and liquidity forecasting while deterministic controls remain authoritative.

## Permitted Assistance

- identify unusual withdrawal, destination, velocity, or provider patterns;
- recommend hold or review priority;
- propose reconciliation matches and failure classification;
- forecast payout volume, provider delay, fees, and liquidity; and
- explain a payout state using approved evidence.

## Prohibited Actions

AI must not directly approve, submit, retry, pay, reverse, unlock, alter amount/destination, bypass compliance, classify RP/ABC/AHC as payable, or release a reserve.

## Governance

Recommendations include model/version, evidence scope, confidence, reason, provenance, policy context, and human decision for material action. Sensitive identity, tax, screening, and payout data is access-controlled and minimized.

## Related Documents

- [000-index.md](000-index.md)
- [016-payout-compliance.md](016-payout-compliance.md)
- [017-payout-security.md](017-payout-security.md)
- [019-payout-events.md](019-payout-events.md)
