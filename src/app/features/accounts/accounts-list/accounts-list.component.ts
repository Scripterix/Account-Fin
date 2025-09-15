import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BankStoreService } from "../../../core/bank-store.service";
import { CurrencySimplePipe } from "../../../shared";

@Component({
  selector: "app-accounts-list",
  standalone: true,
  imports: [CommonModule, CurrencySimplePipe],
  template: `
    <table class="table accounts-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Number</th>
          <th>Currency</th>
          <th class="text-right">Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let account of accounts()">
          <td>{{ account.name }}</td>
          <td>{{ account.number }}</td>
          <td>{{ account.currency }}</td>
          <td class="text-right">{{ account.balance | currencySimple: account.currency }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">Accounts: {{ totalAccounts() }}</td>
        </tr>
      </tfoot>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsListComponent {
  private readonly store = inject(BankStoreService);

  readonly accounts = this.store.accounts;
  readonly totalAccounts = this.store.totalAccounts;
}
