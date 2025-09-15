import { Injectable, computed, signal } from "@angular/core";

import { Account, Transaction } from "./models";
import { SEED_ACCOUNTS, SEED_TX } from "./seed";

/**
 * Centralized signal-driven store handling account balances and transaction history.
 */
@Injectable({ providedIn: "root" })
export class BankStoreService {
  /** List of known accounts. */
  readonly accounts = signal<Account[]>(SEED_ACCOUNTS);

  /** Ledger of all transactions. */
  readonly transactions = signal<Transaction[]>(SEED_TX);

  /** Total balance of PLN accounts. */
  readonly totalBalancePLN = computed(() =>
    this.accounts()
      .filter((account) => account.currency === "PLN")
      .reduce((acc, account) => acc + account.balance, 0)
  );

  /** Total number of accounts. */
  readonly totalAccounts = computed(() => this.accounts().length);

  /** Total number of transactions recorded. */
  readonly totalTransactions = computed(() => this.transactions().length);

  /**
   * Applies a deposit to the given account ID.
   * @throws Error when the account cannot be found or amount is not positive.
   */
  deposit(accountId: string, amount: number, desc?: string): void {
    const account = this.expectAccount(accountId);
    this.assertPositiveAmount(amount);

    const updatedAccount = { ...account, balance: account.balance + amount };
    this.replaceAccount(updatedAccount);
    this.appendTransaction({
      kind: "deposit",
      amount,
      currency: updatedAccount.currency,
      toAccountId: updatedAccount.id,
      description: desc,
    });
  }

  /**
   * Applies a withdrawal from the given account ID.
   * @throws Error when the account cannot be found, amount is not positive or funds are insufficient.
   */
  withdraw(accountId: string, amount: number, desc?: string): void {
    const account = this.expectAccount(accountId);
    this.assertPositiveAmount(amount);
    this.assertSufficientFunds(account, amount);

    const updatedAccount = { ...account, balance: account.balance - amount };
    this.replaceAccount(updatedAccount);
    this.appendTransaction({
      kind: "withdrawal",
      amount,
      currency: updatedAccount.currency,
      fromAccountId: updatedAccount.id,
      description: desc,
    });
  }

  /**
   * Transfers funds between two accounts.
   * @throws Error when either account is missing, amount is not positive, accounts differ by currency or funds are insufficient.
   */
  transfer(fromId: string, toId: string, amount: number, desc?: string): void {
    if (fromId === toId) {
      throw new Error("Cannot transfer within the same account.");
    }

    const fromAccount = this.expectAccount(fromId);
    const toAccount = this.expectAccount(toId);
    this.assertPositiveAmount(amount);

    if (fromAccount.currency !== toAccount.currency) {
      throw new Error("Cross-currency transfers are not supported.");
    }

    this.assertSufficientFunds(fromAccount, amount);

    const updatedFrom = { ...fromAccount, balance: fromAccount.balance - amount };
    const updatedTo = { ...toAccount, balance: toAccount.balance + amount };

    this.replaceAccount(updatedFrom);
    this.replaceAccount(updatedTo);

    this.appendTransaction({
      kind: "transfer",
      amount,
      currency: updatedFrom.currency,
      fromAccountId: updatedFrom.id,
      toAccountId: updatedTo.id,
      description: desc,
    });
  }

  /** Retrieves account or undefined when missing. */
  getAccountById(id: string): Account | undefined {
    return this.accounts().find((account) => account.id === id);
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
      throw new Error(`Insufficient funds on ${account.id}.`);
    }
  }

  private replaceAccount(updated: Account): void {
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
