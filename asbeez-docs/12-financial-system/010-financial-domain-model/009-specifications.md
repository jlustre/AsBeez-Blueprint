# Specifications

## Purpose

Specifications are composable predicates that express eligibility or validity without performing a state change. They make financial rules testable and reusable across workflows.

## Specification Catalog

| Specification | Example result |
| --- | --- |
| PaymentCapturable | payment is authorized, uncaptured, unexpired, and risk-approved |
| RefundablePayment | captured amount remains refundable under policy |
| CollectibleInvoice | invoice is issued, due, unpaid, and not blocked |
| PostableJournal | entry balances, accounts are valid, and period is open |
| SpendableWallet | wallet is active and available balance covers reservation |
| SettledAmount | settlement lines have valid source facts and approvals |
| PayablePayout | payout is approved, compliant, and destination verified |
| ValidTaxAssessment | jurisdiction, rate, basis, and effective date are present |
| ReconciledStatementLine | external line has one accepted match or documented exception |
| RewardLiabilityRecognizable | reward event is valid, non-duplicated, and within policy |

## Composition

Specifications may be combined with `and`, `or`, and `not`. Composition must preserve explainability: a failed result identifies each failed component and its evidence. A specification never changes state or calls an external provider.

## Related Documents

- [008-policies.md](008-policies.md)
- [011-invariants.md](011-invariants.md)
