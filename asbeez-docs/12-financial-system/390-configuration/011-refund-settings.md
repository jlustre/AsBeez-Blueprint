# Refund Settings

> **Document:** 12-financial-system/390-configuration/011-refund-settings.md

---

## Purpose

Refund settings define eligibility windows, reason codes, approval thresholds, full/partial treatment, fees, tax, rewards, vendor/partner allocation, reserve, provider, retry, and reconciliation behavior.

## Rules

Settings cannot permit refunds beyond refundable amount, delete original sales/journals, bypass risk/approval, or silently change tax/revenue/commission treatment. Provider unknown states require query/reconciliation; corrections use compensating records.

## Change Control

Assess customer, order, payment, invoice, provider, tax, reward, vendor/partner, reserve, ledger, and dispute impact. Require examples/tests, approval, effective dating, rollout monitoring, and historical policy preservation.

## Related Documents

- [000-index.md](000-index.md)
- [010-invoice-settings.md](010-invoice-settings.md)
- [012-chargeback-settings.md](012-chargeback-settings.md)
- [../300-data-model/009-refund-schema.md](../300-data-model/009-refund-schema.md)
