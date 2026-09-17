# Overview

> **Document:** 12-financial-system/050-member-wallets/001-overview.md

---

## Purpose

Member Wallets provide controlled, member-facing views of approved balances and participation benefits. A wallet is not automatically a bank account, stored-value account, cash balance, or guaranteed income account.

## AsBeez Wallet Boundary

Wallet activity may originate from approved marketplace refunds, redemptions, settlements, or reward events. RP, ABC, and AHC remain separate program units unless Legal and Finance approve a monetary conversion or wallet credit for the applicable country and policy version.

## Core Principles

- wallet balances are backed by subledger records and mapped GL control accounts where monetary;
- available balance excludes pending, held, reserved, restricted, and disputed value;
- every credit and debit has a source event and idempotency key;
- wallet operations never bypass settlement, compliance, reserve, tax, or payout controls;
- corrections are new events, not edits to history; and
- country, currency, member status, and wallet type are explicit.

## Related Documents

- [000-index.md](000-index.md)
- [002-wallet-domain-model.md](002-wallet-domain-model.md)
- [005-wallet-balances.md](005-wallet-balances.md)
- [016-wallet-compliance.md](016-wallet-compliance.md)
