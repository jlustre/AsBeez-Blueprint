# AsBeez Posting Mappings

## Purpose

This document defines the minimum General Ledger mapping boundary for AsBeez marketplace, vendor, partner, and reward activity. Exact account numbers remain configuration owned by the Chart of Accounts and vary by legal entity and jurisdiction.

## Qualifying Marketplace Order

A typical captured order may require these posting stages:

| Stage | Debit | Credit |
| --- | --- | --- |
| Customer payment captured | processor receivable or cash | customer receivable or order clearing |
| Tax recognized as collected | order clearing or receivable | tax payable |
| Vendor entitlement recognized | order clearing or settlement clearing | vendor payable |
| Platform fee recognized | order clearing or receivable | marketplace fee revenue |
| Partner commission approved | commission expense or approved allocation | partner payable |
| Vendor payout executed | vendor payable | cash or payout clearing |

The final treatment depends on principal/agent analysis, contract terms, tax rules, refunds, chargebacks, reserves, and the approved revenue-recognition policy.

## Reward and Matrix Boundary

- RP issuance is first an immutable reward/subledger event, not automatically a monetary journal.
- ABC creation and matrix placement are not journal entries by themselves.
- AHC distribution creates a journal consequence only when the approved jurisdictional reward policy classifies it as a liability, expense, redemption, or another monetary effect.
- The journal source must reference the reward event, ABC, matrix cycle/placement, member, country, and policy version.
- Company-held reward allocations remain separately identifiable from vendor, partner, member, charity, or promotional funds.

## Reversals and Corrections

Refunds, returns, cancellations, and chargebacks evaluate each downstream effect separately. Vendor and partner obligations may be reduced or held; reward liabilities may be reversed, expired, or suspended; revenue may be contra-posted; and payout eligibility may be blocked. Original entries remain immutable.

## Required Posting Metadata

Order ID, payment ID, vendor ID, partner ID, member/customer reference, country, legal entity, currency, tax assessment, reward event ID, ABC ID, matrix event ID, AHC event ID where applicable, account mapping version, policy versions, idempotency key, correlation ID, and causation ID.

## Control Totals

For each order or settlement batch:

```text
Captured or invoiced source
= tax
+ vendor entitlement
+ platform revenue and approved fees
+ partner obligations
+ approved reward financial effect
+ reserves, holds, refunds, or other allocations
+ residual clearing balance
```

The residual must be zero at final allocation or remain in a named, aged clearing/exception account with an owner and resolution path.

## Related Documents

- [003-double-entry-accounting.md](003-double-entry-accounting.md)
- [007-ledger-posting.md](007-ledger-posting.md)
- [013-ledger-reconciliation.md](013-ledger-reconciliation.md)
- [006-liability-accounts.md](../020-chart-of-accounts/006-liability-accounts.md)
- [008-revenue-accounts.md](../020-chart-of-accounts/008-revenue-accounts.md)
