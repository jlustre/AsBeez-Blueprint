# Tax Events

> **Document:** 12-financial-system/160-taxes/019-tax-events.md

---

## Purpose

Tax events are immutable facts for jurisdiction, registration, assessment, exemption, invoice, withholding, filing, remittance, adjustment, and reconciliation workflows.

## Event Catalog

- TaxJurisdictionEnabled, TaxRegistrationVerified, TaxRegistrationExpired;
- TaxAssessmentCreated, TaxAssessmentAdjusted, TaxExemptionApplied, TaxExemptionRevoked;
- TaxInvoiceIssued, TaxWithholdingRecorded, TaxFilingPrepared, TaxFilingSubmitted;
- TaxRemittanceScheduled, TaxRemitted, TaxRemittanceFailed;
- TaxReconciliationMatched, TaxExceptionOpened, TaxExceptionResolved; and
- TaxRuleVersionPublished.

## Contract

Events include ID/version, source order/invoice/settlement/payout, entity, party, jurisdiction/authority, tax type, basis, rate, amount/currency, exemption/registration evidence, rule/provider version, period, occurred/effective time, actor/system, correlation, causation, and idempotency.

## Rules

Consumers are idempotent. Tax events do not silently change invoices, revenue, settlement, rewards, or GL; each consequence follows validated policy and reconciliation.

## Related Documents

- [000-index.md](000-index.md)
- [002-tax-domain-model.md](002-tax-domain-model.md)
- [011-tax-calculation.md](011-tax-calculation.md)
- [016-tax-reconciliation.md](016-tax-reconciliation.md)
