import { Pipe, PipeTransform } from "@angular/core";

import { Account } from "../core/models";

type SupportedCurrency = Account["currency"];

/**
 * Formats numeric values using Polish locale currency formatting while forcing ISO currency symbols.
 */
@Pipe({
  name: "currencySimple",
  standalone: true,
})
export class CurrencySimplePipe implements PipeTransform {
  transform(value: number, currency: SupportedCurrency = "PLN"): string {
    const formatter = new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter
      .formatToParts(value ?? 0)
      .map((part) => (part.type === "currency" ? currency : part.value))
      .join("");
  }
}
