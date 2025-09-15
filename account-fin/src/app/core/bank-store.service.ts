import { Injectable, computed, signal } from "@angular/core";

import { Account, Transaction } from "./models";
import { SEED_ACCOUNTS, SEED_TX } from "./seed";

@Injectable({ providedIn: "root" })
export class BankStoreService {
  readonly accounts = signal<Account[]>(SEED_ACCOUNTS);
  readonly transactions = signal<Transaction[]>(SEED_TX);

  readonly totalAccounts = computed(() => this.accounts().length);
  readonly totalTransactions = computed(() => this.transactions().length);
  readonly totalBalancePLN = computed(() =>
    this.accounts()
      .filter((account) => account.currency === "PLN")
      .reduce((sum, account) => sum + account.balance, 0)
  );

  getAccountById(id: string): Account | undefined {
    return this.accounts().find((account) => account.id === id);
  }

  deposit(accountId: string, amount: number, desc?: string): void {
    const account = this.expectAccount(accountId);
    this.assertPositiveAmount(amount);

    const updatedAccount: Account = { ...account, balance: account.balance + amount };
    this.updateAccount(updatedAccount);
    this.appendTransaction({
      kind: "deposit",
      amount,
      currency: updatedAccount.currency,
      toAccountId: updatedAccount.id,
      description: desc,
    });
  }

  withdraw(accountId: string, amount: number, desc?: string): void {
    const account = this.expectAccount(accountId);
    this.assertPositiveAmount(amount);
    this.assertSufficientFunds(account, amount);

    const updatedAccount: Account = { ...account, balance: account.balance - amount };
    this.updateAccount(updatedAccount);
    this.appendTransaction({
      kind: "withdrawal",
      amount,
      currency: updatedAccount.currency,
      fromAccountId: updatedAccount.id,
      description: desc,
    });
  }

  transfer(fromId: string, toId: string, amount: number, desc?: string): void {
    if (fromId === toId) {
      throw new Error("Cannot transfer within the same account.");
    }

    const fromAccount = this.expectAccount(fromId);
    const toAccount = this.expectAccount(toId);
    this.assertPositiveAmount(amount);
    this.assertSufficientFunds(fromAccount, amount);

    if (fromAccount.currency !== toAccount.currency) {
      throw new Error("Currencies must match for transfer.");
    }

    const updatedFrom: Account = { ...fromAccount, balance: fromAccount.balance - amount };
    const updatedTo: Account = { ...toAccount, balance: toAccount.balance + amount };

    this.updateAccount(updatedFrom);
    this.updateAccount(updatedTo);
    this.appendTransaction({
      kind: "transfer",
      amount,
      currency: updatedFrom.currency,
      fromAccountId: updatedFrom.id,
      toAccountId: updatedTo.id,
      description: desc,
    });
  }

  private expectAccount(id: string): Account {
    const account = this.getAccountById(id);
    if (!account) {
      throw new Error(`Account ${id} not found.`);
    }
    return account;
  }

  private assertPositiveAmount(amount: number): void {
    if (!(amount > 0)) {
      throw new Error("Amount must be greater than zero.");
    }
  }

  private assertSufficientFunds(account: Account, amount: number): void {
    if (account.balance < amount) {
      throw new Error(`Insufficient funds on account ${account.id}.`);
    }
  }

  private updateAccount(updated: Account): void {
    this.accounts.update((accounts) =>
      accounts.map((account) => (account.id === updated.id ? updated : account))
    );
  }

  private appendTransaction(partial: Omit<Transaction, "id" | "ts">): void {
    const tx: Transaction = {
      id: this.generateTransactionId(),
      ts: new Date().toISOString(),
      ...partial,
    };

    this.transactions.update((transactions) => [tx, ...transactions]);
  }

  private generateTransactionId(): string {
    return `tx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }
}
