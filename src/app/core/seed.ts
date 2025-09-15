import { Account, Transaction } from "./models";

export const SEED_ACCOUNTS: Account[] = [
  {
    id: "acc-pln",
    name: "PLN Current",
    number: "11 1140 2004 0000 3102 0476 1234",
    currency: "PLN",
    balance: 10_000,
  },
  {
    id: "acc-sav",
    name: "PLN Savings",
    number: "11 1140 2004 0000 3102 0476 5678",
    currency: "PLN",
    balance: 25_000,
  },
  {
    id: "acc-eur",
    name: "EUR Account",
    number: "DE89 3704 0044 0532 0130 00",
    currency: "EUR",
    balance: 2_000,
  },
];

export const SEED_TX: Transaction[] = [
  {
    id: "tx-001",
    ts: "2024-05-01T09:30:00.000Z",
    kind: "deposit",
    amount: 2_500,
    currency: "PLN",
    toAccountId: "acc-pln",
    description: "Salary May",
  },
  {
    id: "tx-002",
    ts: "2024-05-03T12:15:00.000Z",
    kind: "withdrawal",
    amount: 300,
    currency: "PLN",
    fromAccountId: "acc-pln",
    description: "ATM cash",
  },
  {
    id: "tx-003",
    ts: "2024-05-07T17:45:00.000Z",
    kind: "transfer",
    amount: 1_200,
    currency: "PLN",
    fromAccountId: "acc-pln",
    toAccountId: "acc-sav",
    description: "Monthly savings",
  },
  {
    id: "tx-004",
    ts: "2024-05-10T08:05:00.000Z",
    kind: "deposit",
    amount: 1_000,
    currency: "EUR",
    toAccountId: "acc-eur",
    description: "Invoice payment",
  },
  {
    id: "tx-005",
    ts: "2024-05-12T10:00:00.000Z",
    kind: "transfer",
    amount: 500,
    currency: "PLN",
    fromAccountId: "acc-sav",
    toAccountId: "acc-pln",
    description: "Cover card bill",
  },
];
