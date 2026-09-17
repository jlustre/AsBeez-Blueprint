# 001

# Enhancement Backlog

## Documentation

- Standardize all Mermaid diagrams.
- Add executive summaries to every document.
- Add Blueprint Sheets to every capability.

## Architecture

- Introduce Business Rule Registry.
- Introduce Architecture Decision Records.
- Separate Rewards Ledger into its own book.
- Review capability numbering.

## Technology

- Event Sourcing evaluation.
- CQRS evaluation.
- AI recommendation engine.

## UI/UX

- Add Figma wireframes.
- Standardize dashboard layouts.

## Legal

- Country-specific compliance review.
- Marketplace regulations review.

## Investor

- Build full investment data room.
- Create financial projection workbook.

# 002

# Enhancement: Move Wallet to the Financial Domain

**Status:** Backlog  
**Priority:** Medium  
**Phase:** Architecture Review (Phase 2)

## Description

The Wallet is currently documented under the **Rewards Domain** for organizational simplicity during the initial blueprint phase.

However, the Wallet is not exclusively a rewards component. It is a financial capability that will eventually manage multiple monetary sources and transactions across the AsBeez platform.

During the Architecture Review phase, evaluate moving the Wallet into the **Financial Domain**.

## Rationale

The Wallet is expected to support:

- AHC conversions
- Referral bonuses
- Promotional credits
- Refund credits
- Manual adjustments
- Vendor earnings
- Internal member-to-member transfers
- Future financial incentives

Because these transactions extend beyond rewards, the Wallet aligns more naturally with the Financial Domain.

## Future Architecture

Current:

```text
Rewards Domain
â””â”€â”€ Wallet
```

Proposed:

```text
Financial Domain
â”œâ”€â”€ Financial Ledger
â”œâ”€â”€ Member Wallet
â”œâ”€â”€ Vendor Wallet
â”œâ”€â”€ Withdrawals
â”œâ”€â”€ Transfers
â””â”€â”€ Financial Reports
```

## Additional Recommendation

Adopt a **Wallet Ledger** instead of maintaining only a running balance.

Every wallet activity should be recorded as an immutable transaction, including:

- Credits
- Debits
- Transfers
- Withdrawals
- Refunds
- Manual Adjustments

The displayed Wallet Balance should always be calculated from the ledger.

## Benefits

- Complete audit trail
- Improved financial reconciliation
- Easier dispute resolution
- Better regulatory compliance
- Consistent with the ledger-first architecture used throughout AsBeez

# 003

# Enhancement: Automatic Documentation Index

**Status:** Backlog  
**Priority:** Low  
**Phase:** Documentation Review (Phase 3)

## Description

Generate all `index.md` files automatically from the documentation structure instead of maintaining them manually.

## Benefits

- Prevents broken indexes.
- Automatically updates document counts.
- Ensures new documents appear in the correct section.
- Reduces maintenance effort.
- Keeps all books synchronized with the repository structure.

## Future Implementation

Create a documentation generator that scans the repository and rebuilds all `index.md` files whenever new documents are added or renamed.

# 004

# Enhancement: Standardize Book Index Files

**Status:** Backlog  
**Priority:** Medium  
**Phase:** Documentation Review (Phase 3)

## Description

Standardize every `index.md` across the AsBeez documentation library so each book follows the same structure.

## Standard Sections

- Overview
- Document List
- Structure Diagram
- Purpose of Each Document
- Reading Order
- Document Statistics
- Related Books
- Revision History

## Benefits

- Consistent navigation across all books.
- Easier onboarding for new readers.
- Simpler maintenance.
- Professional, enterprise-grade documentation.

