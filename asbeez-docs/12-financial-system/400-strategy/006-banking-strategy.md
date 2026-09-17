# Banking Strategy

> **Document:** 12-financial-system/400-strategy/006-banking-strategy.md

---

## Purpose

Banking strategy establishes reliable accounts, rails, statements, transfers, settlements, cash evidence, provider diversification, country/entity coverage, and treasury controls.

## Strategic Requirements

Select banks/rails by legal entity, country, currency, availability, fees, settlement timing, limits, APIs/files, sanctions/KYC, data/residency, reconciliation, liquidity, concentration, contingency, and exit criteria. Maintain normalized bank evidence separate from ledger truth.

## Controls

Bank credentials/certificates are secret-managed; transfers use approval, dual control, limits, idempotency, sanctions, entity/country, source/destination, and reconciliation. Bank balances and statements are evidence until matched. Concentration and provider failure require tested alternatives.

## Related Documents

- [000-index.md](000-index.md)
- [007-treasury-strategy.md](007-treasury-strategy.md)
- [003-global-expansion-strategy.md](003-global-expansion-strategy.md)
- [../340-integrations/003-banking-integrations.md](../340-integrations/003-banking-integrations.md)
