# Wallet Locking

> **Document:** 12-financial-system/050-member-wallets/011-wallet-locking.md

---

## Purpose

Wallet locking prevents selected or all wallet operations while an integrity, security, fraud, compliance, dispute, or administrative condition is reviewed.

## Lock Types

- operation lock: blocks one operation such as payout or transfer;
- amount lock: restricts a defined value;
- wallet lock: blocks ordinary wallet activity; and
- account/member lock: applies a broader compliance or identity restriction.

## Rules

Every lock has a reason, authority, scope, created time, review/expiry rule, affected operations, and release decision. Emergency locks are logged and reviewed. A lock does not change the underlying balance, delete history, or itself create a debit.

## Release

Release requires the owner or authorized reviewer to record evidence and outcome. Unlocking a wallet does not automatically approve a pending transfer or payout; each workflow resumes through its own state machine.

## Related Documents

- [000-index.md](000-index.md)
- [009-wallet-holds.md](009-wallet-holds.md)
- [015-wallet-security.md](015-wallet-security.md)
- [016-wallet-compliance.md](016-wallet-compliance.md)
