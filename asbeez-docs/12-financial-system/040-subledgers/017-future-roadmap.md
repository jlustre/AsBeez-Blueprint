# Future Roadmap

> **Document:** 12-financial-system/040-subledgers/017-future-roadmap.md

---

## Near Term

- publish subledger schemas and source-event contracts;
- connect marketplace orders, payments, tax, vendor/partner settlement, refunds, and GL mappings;
- implement RP, ABC, and AHC event lineage without assuming monetary treatment;
- reconcile wallet, provider, vendor, partner, reward, tax, reserve, and fund totals; and
- establish country launch gates and exception ownership.

## Medium Term

- automate subledger control totals and aging;
- support multi-entity, multi-currency, and localized statutory views;
- provide member/vendor/partner statements from reconciled records;
- improve refund, chargeback, and reward reversal propagation; and
- add explainable anomaly detection with human approval.

## Long Term

- support regional subledger services and high-volume event ingestion;
- provide historical replay and rebuild from immutable events;
- strengthen program-level reward liability forecasting; and
- expose governed APIs for approved partners and financial operations.

## Roadmap Gate

No subledger feature may present RP, ABC, AHC, wallet, reserve, fund, or commission values as money or guaranteed earnings without approved jurisdictional classification, funding, accounting, and compliance rules.

## Related Documents

- [000-index.md](000-index.md)
- [001-overview.md](001-overview.md)
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md)
