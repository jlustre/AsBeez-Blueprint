# AsBeez Financial Mapping

## Purpose

This document translates the AsBeez commerce and participation model into financial ownership and accounting boundaries. It does not decide reward qualification or matrix placement; those remain owned by the Marketplace, Rewards, and Beehive Matrix domains.

## AsBeez Value Chain

```text
Customer order
  -> payment authorized and captured
  -> order qualifies under marketplace rules
  -> RP ledger records the reward event
  -> ABC eligibility is evaluated
  -> matrix placement and AHC distribution are evaluated
  -> vendor/partner settlement is calculated
  -> approved monetary effects are posted
  -> payout or wallet availability follows policy
```

Each arrow is a separate state transition. A later event cannot be inferred merely because an earlier event exists.

## Financial Meaning by Concept

| AsBeez concept | Financial treatment |
| --- | --- |
| Qualifying purchase | source fact that may create payment, tax, vendor, fee, and reward consequences |
| RP | non-money program unit; its accounting effect is policy- and jurisdiction-dependent |
| ABC | platform participation record; creation alone creates no monetary liability unless an approved policy says otherwise |
| Beehive Matrix placement | operational genealogy event; it is not a journal entry by itself |
| AHC | platform reward unit; any liability, expense, redemption, or payout treatment requires approved Legal and Finance classification |
| Vendor settlement | calculated obligation after order status, fees, tax, reserves, refunds, and disputes |
| Partner commission | approved obligation tied to a qualifying source and program rule, not mere registration |
| Company holding account | controlled account for amounts retained by AsBeez pending allocation, release, or approved program treatment |
| Member wallet | controlled balance projection or liability view; it is not automatically company cash or revenue |

## Order Allocation Boundary

For a qualifying marketplace order, the financial system evaluates, as applicable:

1. customer payment and processor clearing;
2. sales tax or other statutory amounts;
3. vendor gross entitlement;
4. approved platform fees and recognized revenue;
5. partner or referral commission obligation;
6. refunds, chargebacks, reserves, and holds;
7. reward-related liability or expense only after the reward policy recognizes a financial consequence; and
8. net settlement and payout eligibility.

The allocation must reconcile to the captured or invoiced source amount. Any residual remains in a named clearing or exception state with an owner.

## Refund and Chargeback Effects

A refund or chargeback does not delete the original order, RP event, ABC record, matrix placement, AHC event, vendor settlement, or commission history. Each affected consequence is evaluated for reversal, hold, liability adjustment, or compensating entry under its owning policy.

## Required Traceability

Every financial mapping carries order ID, payment ID, vendor ID, partner ID where applicable, member/customer references, country, legal entity, currency, reward event ID, ABC ID, matrix event ID, AHC event ID where applicable, policy versions, and correlation/causation IDs.

## Release Gate

No reward or matrix feature is financially production-ready until the launch jurisdiction approves RP, ABC, AHC, wallet, payout, and funding classifications and the corresponding account mappings are published in the Chart of Accounts and General Ledger configuration.

## Related Documents

- [002-bounded-contexts.md](002-bounded-contexts.md)
- [006-domain-services.md](006-domain-services.md)
- [008-policies.md](008-policies.md)
- [011-invariants.md](011-invariants.md)
- [013-ubiquitous-language.md](013-ubiquitous-language.md)
