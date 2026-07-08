# Wallet

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-128 |
| Capability ID | BC-RWD-128 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Rewards *(Temporary)* |
| Owner | Rewards Domain |

---

# Overview

The Wallet stores monetary credits belonging to a Member.

Funds in the Wallet may be used to purchase products, transfer funds to another Member, or request withdrawals, subject to platform policies.

The Wallet only stores monetary value. It does not store Reward Points (RP) or AsBeez Hive Credits (AHC).

---

# Responsibilities

The Wallet is responsible for:

- Maintaining wallet balance
- Recording wallet transactions
- Receiving converted AHC
- Receiving approved credits
- Supporting purchases
- Supporting member-to-member transfers
- Supporting withdrawal requests
- Maintaining transaction history

The Wallet is **not responsible** for:

- Calculating Reward Points
- Creating ABCs
- Calculating AHC
- Processing payments
- Financial accounting

---

# Wallet Balance

Each Member has one Wallet.

The Wallet maintains:

- Available Balance
- Pending Balance
- Total Credits
- Total Debits

---

# Wallet Transactions

Supported transaction types include:

- AHC Conversion
- Purchase
- Withdrawal
- Transfer In
- Transfer Out
- Refund Credit
- Promotional Credit
- Manual Adjustment

---

# Wallet Workflow

```text
Approved Credit
       │
       ▼
Add to Wallet
       │
       ▼
Update Balance
       │
       ▼
Record Transaction
```

---

# Wallet Uses

Members may use Wallet funds to:

- Purchase products
- Transfer funds to another Member
- Request withdrawals

Additional uses may be introduced in future releases.

---

# Wallet Transfers

Members may transfer Wallet funds to another active Member.

Each transfer records:

- Sender
- Receiver
- Amount
- Date
- Reference Number

Transfer rules are configurable.

---

# Withdrawals

Members may submit withdrawal requests using their available Wallet balance.

Withdrawal approval, payment processing, and settlement are managed by the Withdrawal capability.

---

# Configuration

Administrators may configure:

- Minimum Wallet Balance
- Minimum Withdrawal Amount
- Maximum Withdrawal Amount
- Transfer Limits
- Supported Withdrawal Methods
- Transaction Fees

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-WAL-001 | Every Member has one Wallet. |
| BR-WAL-002 | Wallet balances cannot be negative. |
| BR-WAL-003 | Only available funds may be transferred or withdrawn. |
| BR-WAL-004 | Every Wallet transaction must be recorded. |
| BR-WAL-005 | AHC must be converted before becoming available in the Wallet. |
| BR-WAL-006 | RP cannot be deposited into the Wallet. |
| BR-WAL-007 | Wallet transfers are allowed only between active Members. |

---

# Published Events

The Wallet publishes:

- WalletCredited
- WalletDebited
- WalletTransferCompleted
- WithdrawalRequested

---

# Consumed Events

The Wallet consumes:

- AHCConverted
- RefundApproved
- ManualCreditApproved

---

# Related Capabilities

- BC-RWD-127 AHC Engine
- BC-RWD-129 Withdrawals
- BC-FIN-201 Financial Ledger

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |