import { Component, inject } from "@angular/core";
import { Routes } from "@angular/router";
import { CommonModule } from "@angular/common";

import { BankStoreService } from "./core/bank-store.service";
import { CurrencySimplePipe } from "./shared";
import { AccountsListComponent } from "./features/accounts/accounts-list/accounts-list.component";
import { TransactionsListComponent } from "./features/transactions/transactions-list/transactions-list.component";

@Component({
  selector: "app-dashboard-page",
  standalone: true,
  imports: [CommonModule, CurrencySimplePipe, AccountsListComponent, TransactionsListComponent],
  template: `
    <section class="container">
      <h1>Account-Fin</h1>
      <p>PLN Balance: {{ store.totalBalancePLN() | currencySimple: 'PLN' }}</p>
      <app-accounts-list></app-accounts-list>
      <app-transactions-list></app-transactions-list>
    </section>
  `,
})
class DashboardPageComponent {
  protected readonly store = inject(BankStoreService);
}

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "dashboard",
    title: "Home",
  },
  {
    path: "dashboard",
    component: DashboardPageComponent,
    title: "Dashboard",
  },
  {
    path: "**",
    redirectTo: "dashboard",
  },
];
