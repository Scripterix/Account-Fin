import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BankStoreService } from "../../../core/bank-store.service";
import { CurrencySimplePipe } from "../../../shared";

@Component({
  selector: "app-transactions-list",
  standalone: true,
  imports: [CommonModule, CurrencySimplePipe],
  template: `
    <table class="table transactions-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th class="text-right">Amount</th>
          <th>From</th>
          <th>To</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let tx of transactions()">
          <td>{{ tx.ts.slice(0, 10) }}</td>
          <td>{{ tx.kind }}</td>
          <td class="text-right">{{ tx.amount | currencySimple: tx.currency }}</td>
          <td>{{ accountName(tx.fromAccountId) }}</td>
          <td>{{ accountName(tx.toAccountId) }}</td>
          <td>{{ tx.description || '-' }}</td>
        </tr>
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsListComponent {
  private readonly store = inject(BankStoreService);

  readonly transactions = this.store.transactions;

  accountName(id?: string): string {
    if (!id) {
      return "-";
    }
    return this.store.getAccountById(id)?.name ?? "-";
  }
}
